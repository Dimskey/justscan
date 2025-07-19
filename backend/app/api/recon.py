from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from typing import List, Optional
import asyncio

from app.schemas.recon import NmapScanRequest, WhatWebScanRequest, ScanResult
from app.services.nmap_runner import NmapRunner
from app.services.task_queue import TaskQueue

router = APIRouter()

@router.post("/nmap", response_model=dict)
async def run_nmap_scan(scan_request: NmapScanRequest, background_tasks: BackgroundTasks):
    """
    Run Nmap scan against target
    """
    try:
        nmap_runner = NmapRunner()
        task_id = await TaskQueue.add_task("nmap_scan", {
            "target": scan_request.target,
            "scan_type": scan_request.scan_type,
            "ports": scan_request.ports,
            "options": scan_request.options,
            "project_id": scan_request.project_id
        })
        
        return {
            "task_id": task_id,
            "status": "started",
            "message": f"Nmap scan started for {scan_request.target}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/whatweb", response_model=dict)
async def run_whatweb_scan(scan_request: WhatWebScanRequest, background_tasks: BackgroundTasks):
    """
    Run WhatWeb scan against target
    """
    try:
        task_id = await TaskQueue.add_task("whatweb_scan", {
            "target": scan_request.target,
            "options": scan_request.options,
            "project_id": scan_request.project_id
        })
        
        return {
            "task_id": task_id,
            "status": "started",
            "message": f"WhatWeb scan started for {scan_request.target}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_scan(request: Request):
    """
    Analisa hasil scan (dummy/manual, AI-ready)
    """
    try:
        data = await request.json()
        # Analisa sederhana: cek port umum dan banner
        results = []
        ports = []
        if isinstance(data, dict):
            ports = data.get("ports") or data.get("open_ports") or []
        for port in ports:
            port_num = port.get("port") if isinstance(port, dict) else port
            if port_num == 22:
                results.append({"vuln": "SSH Open", "severity": "medium", "recommendation": "Disable SSH if not needed or use strong passwords."})
            if port_num == 445:
                results.append({"vuln": "SMB Open", "severity": "high", "recommendation": "Disable SMB or restrict access."})
            if port_num == 3389:
                results.append({"vuln": "RDP Open", "severity": "high", "recommendation": "Restrict RDP access and use strong credentials."})
        # Dummy: jika tidak ada port rawan
        if not results:
            results.append({"vuln": "No critical ports detected", "severity": "info", "recommendation": "No immediate action required."})
        return {"analysis": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze-whatweb")
async def analyze_whatweb(request: Request):
    """
    Analisa hasil WhatWeb (dummy/manual, AI-ready)
    """
    try:
        data = await request.json()
        results = []
        plugins = data.get("plugins") or []
        techs = data.get("technologies") or []
        # Contoh analisa sederhana
        for tech in techs:
            if "WordPress" in tech or "wordpress" in tech:
                results.append({"vuln": "WordPress Detected", "severity": "medium", "recommendation": "Pastikan WordPress dan plugin selalu update."})
            if "Joomla" in tech or "joomla" in tech:
                results.append({"vuln": "Joomla Detected", "severity": "medium", "recommendation": "Pastikan Joomla dan extension selalu update."})
        for plugin in plugins:
            if "phpmyadmin" in plugin.lower():
                results.append({"vuln": "phpMyAdmin Exposed", "severity": "high", "recommendation": "Restrict access to phpMyAdmin."})
        if not results:
            results.append({"vuln": "No critical web technologies detected", "severity": "info", "recommendation": "No action needed."})
        return {"analysis": results}
    except Exception as e:
        return {"analysis": [{"vuln": "Failed to analyze", "severity": "error", "recommendation": str(e)}]}

@router.get("/task/{task_id}", response_model=dict)
async def get_scan_status(task_id: str):
    """
    Get scan task status and results
    """
    try:
        task_status = await TaskQueue.get_task_status(task_id)
        return task_status
    except Exception as e:
        raise HTTPException(status_code=404, detail="Task not found")

@router.get("/results/{project_id}", response_model=List[ScanResult])
async def get_scan_results(project_id: int):
    """
    Get all scan results for a project
    """
    from app.db.session import SessionLocal
    from app.models.scan_result import ScanResult as ScanResultModel
    db = SessionLocal()
    try:
        results = db.query(ScanResultModel).filter(ScanResultModel.project_id == project_id).order_by(ScanResultModel.created_at.desc()).all()
        return results
    finally:
        db.close()

@router.delete("/task/{task_id}")
async def cancel_scan(task_id: str):
    """
    Cancel running scan task
    """
    try:
        await TaskQueue.cancel_task(task_id)
        return {"message": "Task cancelled successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Task not found") 