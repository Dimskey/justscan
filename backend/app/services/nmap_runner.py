import asyncio
import subprocess
import json
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional
import logging
import platform
import os

from app.core.config import settings

logger = logging.getLogger(__name__)

def get_nmap_path():
    nmap_env = os.environ.get("NMAP_PATH")
    if nmap_env:
        return nmap_env
    system = platform.system()
    if system == "Windows":
        possible_paths = [
            r"C:\\Program Files (x86)\\Nmap\\nmap.exe",
            r"C:\\Program Files\\Nmap\\nmap.exe"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path
        return "nmap"  # fallback
    else:
        return "nmap"

class NmapRunner:
    def __init__(self):
        self.nmap_path = get_nmap_path()
        self.timing = settings.NMAP_TIMING
    
    async def run_scan(
        self,
        target: str,
        scan_type: str = "basic",
        ports: Optional[str] = None,
        options: Optional[Dict] = None
    ) -> Dict:
        """
        Run Nmap scan with specified parameters
        """
        try:
            # Build command
            cmd = [self.nmap_path]
            
            # Add timing
            cmd.extend([f"-T{self.timing}"])
            
            # Add output format
            cmd.extend(["-oX", "-"])  # XML output to stdout
            
            # Add scan type
            if scan_type == "basic":
                cmd.extend(["-sS", "-sV", "-O"])
            elif scan_type == "stealth":
                cmd.extend(["-sS", "-sV", "-O", "--script=vuln"])
            elif scan_type == "aggressive":
                cmd.extend(["-sS", "-sV", "-O", "-A", "--script=vuln"])
            elif scan_type == "port_scan":
                cmd.extend(["-sS", "-sV"])
            elif scan_type == "custom":
                pass  # Don't add any preset scan type, only use options
            
            # Add ports
            if ports:
                cmd.extend(["-p", ports])
            else:
                cmd.extend(["-p-"])  # All ports
            
            # Add custom options
            if options:
                for key, value in options.items():
                    if key.startswith("--"):
                        cmd.append(f"{key}={value}")
                    else:
                        cmd.append(key)
                        if value:
                            cmd.append(str(value))
            
            # Add target
            cmd.append(target)
            
            logger.info(f"Running Nmap command: {' '.join(cmd)}")
            
            # Execute command
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"Nmap failed: {stderr.decode()}")
            
            # Parse XML output
            xml_output = stdout.decode()
            parsed_data = self._parse_nmap_xml(xml_output)
            
            return {
                "status": "completed",
                "raw_output": xml_output,
                "parsed_data": parsed_data,
                "command": " ".join(cmd)
            }
            
        except Exception as e:
            logger.error(f"Nmap scan failed: {str(e)}")
            return {
                "status": "failed",
                "error": str(e),
                "command": " ".join(cmd) if 'cmd' in locals() else ""
            }
    
    def _parse_nmap_xml(self, xml_content: str) -> Dict:
        """
        Parse Nmap XML output into structured data
        """
        try:
            root = ET.fromstring(xml_content)
            result = {
                "hosts": [],
                "scan_info": {}
            }
            
            # Get scan info
            scan_info = root.find("scaninfo")
            if scan_info is not None:
                result["scan_info"] = {
                    "type": scan_info.get("type"),
                    "protocol": scan_info.get("protocol"),
                    "numservices": scan_info.get("numservices")
                }
            
            # Parse hosts
            for host in root.findall("host"):
                host_data = {
                    "addresses": [],
                    "ports": [],
                    "os_info": {},
                    "hostnames": []
                }
                
                # Get addresses
                for address in host.findall("address"):
                    host_data["addresses"].append({
                        "type": address.get("addrtype"),
                        "addr": address.get("addr")
                    })
                
                # Get hostnames
                for hostname in host.findall("hostnames/hostname"):
                    host_data["hostnames"].append({
                        "name": hostname.get("name"),
                        "type": hostname.get("type")
                    })
                
                # Get OS info
                os_match = host.find("os/osmatch")
                if os_match is not None:
                    host_data["os_info"] = {
                        "name": os_match.get("name"),
                        "accuracy": os_match.get("accuracy"),
                        "line": os_match.get("line")
                    }
                
                # Get ports
                for port in host.findall("ports/port"):
                    port_data = {
                        "port": port.get("portid"),
                        "protocol": port.get("protocol"),
                        "state": port.find("state").get("state") if port.find("state") is not None else None,
                        "service": {}
                    }
                    
                    service = port.find("service")
                    if service is not None:
                        port_data["service"] = {
                            "name": service.get("name"),
                            "product": service.get("product"),
                            "version": service.get("version"),
                            "extrainfo": service.get("extrainfo")
                        }
                    
                    host_data["ports"].append(port_data)
                
                result["hosts"].append(host_data)
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to parse Nmap XML: {str(e)}")
            return {"error": f"Failed to parse XML: {str(e)}"}
    
    async def quick_scan(self, target: str) -> Dict:
        """
        Quick port scan
        """
        return await self.run_scan(target, scan_type="basic", ports="1-1000")
    
    async def full_scan(self, target: str) -> Dict:
        """
        Full comprehensive scan
        """
        return await self.run_scan(target, scan_type="aggressive", ports="1-65535") 