from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
import logging
import time
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

REPLICATE_API_TOKEN = settings.REPLICATE_API_TOKEN
# Gunakan model yang lebih sederhana dan pasti tersedia
PRIMARY_MODEL = "a16z-infra/llama-2-13b-chat:2f7b381af7ba6b9f717fb3ed5a3cdeaa535aa960d3de2a977b7d8d5e23882b2b"

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze_replicate")
def analyze_text_replicate(req: AnalyzeRequest):
    try:
        # Check if API token is available
        if not REPLICATE_API_TOKEN:
            logger.error("REPLICATE_API_TOKEN not found in environment variables")
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Prompt yang lebih terstruktur dan relevan
        user_input = req.text
        prompt = (
            "You are a penetration testing assistant. Analyze the following scan result and identify any potential vulnerabilities, "
            "misconfigurations, or security risks. For each finding, provide:\n"
            "- The vulnerability or issue name\n"
            "- Severity (low/medium/high/critical)\n"
            "- A brief explanation\n"
            "- Clear remediation or recommendation steps\n\n"
            "Present your answer in a structured, easy-to-read format. Use only English.\n\n"
            f"Scan result:\n{user_input}"
        )
        logger.info(f"Sending request to AI with message: {prompt[:100]}...")
        
        # Use Replicate API with proper model format
        payload = {
            "version": "ibm-granite/granite-3.3-8b-instruct:a325a0cacfb0aa9226e6bad1abe5385f1073f4c7f8c36e52ed040e5409e6c034",
            "input": {
                "top_k": 50,
                "top_p": 0.9,
                "prompt": prompt,
                "max_tokens": 512,
                "min_tokens": 0,
                "temperature": 0.6,
                "presence_penalty": 0,
                "frequency_penalty": 0
            }
        }
        
        logger.info(f"Request payload: {payload}")
        
        response = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers={
                "Authorization": f"Token {REPLICATE_API_TOKEN}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )
        
        logger.info(f"Replicate response status: {response.status_code}")
        
        if response.status_code not in [200, 201]:
            logger.error(f"Replicate API error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"AI service error: {response.text}")
        
        data = response.json()
        logger.info(f"Replicate response data: {data}")
        
        # Handle Replicate prediction response
        if isinstance(data, dict):
            # Check if it's a prediction response with ID (async)
            if "id" in data and "status" in data:
                prediction_id = data["id"]
                
                # Poll for completion (simple polling implementation)
                max_attempts = 30
                attempt = 0
                
                while attempt < max_attempts:
                    # Get prediction status
                    status_response = requests.get(
                        f"https://api.replicate.com/v1/predictions/{prediction_id}",
                        headers={"Authorization": f"Token {REPLICATE_API_TOKEN}"}
                    )
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        logger.info(f"Prediction status: {status_data.get('status')}")
                        
                        if status_data.get("status") == "succeeded":
                            output = status_data.get("output")
                            if isinstance(output, list) and len(output) > 0:
                                return {"result": "".join(output)}
                            elif isinstance(output, str):
                                return {"result": output}
                            else:
                                return {"result": str(output)}
                        elif status_data.get("status") == "failed":
                            error = status_data.get("error", "AI model failed")
                            raise HTTPException(status_code=500, detail=f"AI model error: {error}")
                        
                        # Wait before next poll
                        time.sleep(2)
                        attempt += 1
                    else:
                        break
                
                raise HTTPException(status_code=408, detail="AI service timeout - prediction took too long")
            
            # Direct output (synchronous response)
            elif "output" in data:
                output = data["output"]
                if isinstance(output, list) and len(output) > 0:
                    return {"result": "".join(output)}
                elif isinstance(output, str):
                    return {"result": output}
                else:
                    return {"result": str(output)}
            else:
                return {"result": str(data)}
        else:
            return {"result": str(data)}
        
    except requests.exceptions.Timeout:
        logger.error("Request to Replicate timed out")
        raise HTTPException(status_code=408, detail="AI service timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in AI analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") 