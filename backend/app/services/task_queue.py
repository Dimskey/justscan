import asyncio
import uuid
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from celery import Celery
from celery.result import AsyncResult
import re

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    "justsploit",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

class TaskQueue:
    @staticmethod
    async def add_task(task_type: str, task_data: Dict[str, Any]) -> str:
        """
        Add a new task to the queue
        """
        if task_type == "nmap_scan":
            task = nmap_scan_task.delay(task_data)
        elif task_type == "whatweb_scan":
            task = whatweb_scan_task.delay(task_data)
        else:
            raise ValueError(f"Unknown task type: {task_type}")
        logger.info(f"Added task {task.id} of type {task_type}")
        return task.id

    @staticmethod
    async def get_task_status(task_id: str) -> Dict[str, Any]:
        """
        Get status of a task using Celery result backend
        """
        try:
            celery_task = AsyncResult(task_id, app=celery_app)
            status = celery_task.status
            result = celery_task.result if celery_task.ready() else None
            response = {
                "task_id": task_id,
                "status": status,
                "result": result
            }
            return response
        except Exception as e:
            logger.error(f"Error checking task status: {str(e)}")
            return {"status": "error", "error": str(e)}

    @staticmethod
    async def cancel_task(task_id: str) -> bool:
        """
        Cancel a running task
        """
        try:
            celery_app.control.revoke(task_id, terminate=True)
            return True
        except Exception as e:
            logger.error(f"Error cancelling task: {str(e)}")
            return False

    @staticmethod
    async def get_all_tasks() -> Dict[str, Any]:
        """
        Get all tasks (not implemented for persistent backend)
        """
        return {"message": "Not implemented. Use a database or monitoring tool for persistent task listing."}

# Celery Tasks
@celery_app.task
def nmap_scan_task(task_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Celery task for running Nmap scans
    """
    try:
        from app.services.nmap_runner import NmapRunner
        from app.db.session import SessionLocal
        from app.models.scan_result import ScanResult as ScanResultModel
        nmap = NmapRunner()
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        started_at = datetime.utcnow()
        result = loop.run_until_complete(
            nmap.run_scan(
                target=task_data["target"],
                scan_type=task_data.get("scan_type", "basic"),
                ports=task_data.get("ports"),
                options=task_data.get("options")
            )
        )
        loop.close()
        completed_at = datetime.utcnow()
        # Simpan ke database
        db = SessionLocal()
        try:
            scan_result = ScanResultModel(
                scan_type=task_data.get("scan_type", "basic"),
                target_id=None,  # Tidak otomatis, kecuali ingin lookup target
                project_id=task_data.get("project_id"),
                status=result.get("status", "completed"),
                raw_output=result.get("raw_output"),
                parsed_data=result.get("parsed_data"),
                scan_options=task_data.get("options"),
                started_at=started_at,
                completed_at=completed_at,
                error_message=result.get("error")
            )
            db.add(scan_result)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to save scan result: {str(e)}")
        finally:
            db.close()
        return result
    except Exception as e:
        logger.error(f"Nmap scan task failed: {str(e)}")
        return {"status": "failed", "error": str(e)}

def parse_whatweb_output(raw_output: str) -> dict:
    # Hilangkan kode warna ANSI
    clean = re.sub(r'\x1b\[[0-9;]*m', '', raw_output)
    # Ambil baris utama (biasanya baris pertama)
    lines = clean.strip().splitlines()
    if not lines:
        return {"summary": "No output"}
    main = lines[0]
    result = {}
    # Ambil URL dan status
    m = re.match(r'(https?://[^\s]+) \[([^\]]+)\] (.+)', main)
    if m:
        result['url'] = m.group(1)
        result['status'] = m.group(2)
        rest = m.group(3)
        # Split info lain dengan koma
        for part in rest.split(','):
            part = part.strip()
            if '[' in part and ']' in part:
                key, val = part.split('[', 1)
                val = val.rstrip(']')
                result[key.strip().lower()] = val.strip()
            else:
                result[part.lower()] = True
    else:
        result['raw'] = main
    return result

@celery_app.task
def whatweb_scan_task(task_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Celery task for running WhatWeb scans
    """
    try:
        import subprocess
        import json
        target = task_data["target"]
        options = task_data.get("options", {})
        
        # First, let's test basic connectivity
        logger.info(f"Starting WhatWeb scan for target: {target}")
        
        started_at = datetime.utcnow()
        
        # Test basic connectivity first
        ping_cmd = ["ping", "-c", "1", target.replace("https://", "").replace("http://", "").split("/")[0]]
        ping_result = subprocess.run(ping_cmd, capture_output=True, text=True, timeout=30)
        logger.info(f"Ping test result: {ping_result.returncode}, stdout: {ping_result.stdout[:200]}")
        
        # Build WhatWeb command for legacy version (no --log-json, no --follow-redirects)
        cmd = ["whatweb", "--no-errors", target]
        for key, value in (options or {}).items():
            if key.startswith("--"):
                cmd.append(f"{key}={value}")
            else:
                cmd.append(key)
                if value:
                    cmd.append(str(value))
        
        logger.info(f"Running WhatWeb command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        completed_at = datetime.utcnow()
        
        logger.info(f"WhatWeb return code: {result.returncode}")
        logger.info(f"WhatWeb stdout length: {len(result.stdout)}")
        logger.info(f"WhatWeb stderr: {result.stderr}")
        
        # Prepare result data
        if result.returncode == 0:
            parsed = parse_whatweb_output(result.stdout)
            scan_result_data = {
                "status": "completed",
                "raw_output": result.stdout,
                "parsed_data": parsed,
                "command": " ".join(cmd),
                "ping_test": ping_result.returncode == 0
            }
        else:
            scan_result_data = {
                "status": "failed",
                "error": result.stderr,
                "command": " ".join(cmd),
                "ping_test": ping_result.returncode == 0
            }
        
        # Save to database if project_id is provided
        if task_data.get("project_id"):
            from app.db.session import SessionLocal
            from app.models.scan_result import ScanResult as ScanResultModel
            
            db = SessionLocal()
            try:
                scan_result = ScanResultModel(
                    scan_type="whatweb",
                    target_id=None,  # Not automatically set, unless target lookup is desired
                    project_id=task_data.get("project_id"),
                    status=scan_result_data.get("status", "completed"),
                    raw_output=scan_result_data.get("raw_output"),
                    parsed_data=scan_result_data.get("parsed_data"),
                    scan_options=task_data.get("options"),
                    started_at=started_at,
                    completed_at=completed_at,
                    error_message=scan_result_data.get("error")
                )
                db.add(scan_result)
                db.commit()
                logger.info(f"WhatWeb scan result saved to database for project {task_data.get('project_id')}")
            except Exception as e:
                db.rollback()
                logger.error(f"Failed to save WhatWeb scan result: {str(e)}")
            finally:
                db.close()
        
        return scan_result_data
        
    except Exception as e:
        logger.error(f"WhatWeb scan task failed: {str(e)}")
        return {"status": "failed", "error": str(e)} 