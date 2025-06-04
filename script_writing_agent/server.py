"""FastAPI server for the script writing agent."""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import logging
from contextlib import asynccontextmanager
import time

from script_writing_agent import (
    generate_script_async,
    ScriptRequest,
    ScriptResponse
)
from script_writing_agent.ai_service import ai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Track active requests for cleanup
active_requests = set()

@asynccontextmanager
async def track_request():
    request_id = time.time()
    active_requests.add(request_id)
    try:
        yield request_id
    finally:
        active_requests.remove(request_id)

app = FastAPI(
    title="Script Writing Agent API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/scripts/generate")
async def generate_script_endpoint(request: ScriptRequest, background_tasks: BackgroundTasks):
    """Generate a response based on user request."""
    async with track_request() as request_id:
        try:
            logger.info(f"Request {request_id}: Received prompt: {request.prompt[:100]}...")
            start_time = time.time()
            
            # For conversational requests, use AI service directly
            if not request.parameters or not request.parameters.get("request_type"):
                result = await ai_service.generate_response(request.prompt)
            else:
                # For script generation, use the full pipeline
                result = await generate_script_async(request.prompt, request.parameters)
            
            logger.info(f"Request {request_id}: Completed in {time.time() - start_time:.2f}s")
            
            if not result:
                raise HTTPException(
                    status_code=400,
                    detail="Script generation returned no result"
                )
                
            if result.get("status") == "error":
                raise HTTPException(
                    status_code=400,
                    detail=result.get("message", "Unknown error in script generation")
                )
                  # Format response depending on request type
            if not request.parameters or not request.parameters.get("request_type"):
                # For conversational responses
                return {
                    "script": {
                        "response": result.get("content", ""),
                    },
                    "status": result.get("status", "success"),
                    "message": "Response generated successfully"
                }
            else:
                # For script generation
                response_data = {
                    "script": result.get("script", {}),
                    "status": "success",
                    "message": result.get("message", "Script generated successfully")
                }
                return ScriptResponse(**response_data)

            # Add cleanup task
            background_tasks.add_task(cleanup_request_resources, request_id)
            
        except Exception as e:
            logger.error(f"Request {request_id}: Error - {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

async def cleanup_request_resources(request_id: float):
    """Clean up any resources used by the request."""
    try:
        # Add any cleanup tasks here
        logger.info(f"Cleaned up resources for request {request_id}")
    except Exception as e:
        logger.error(f"Error cleaning up request {request_id}: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Check the health of the server."""
    return {
        "status": "healthy",
        "active_requests": len(active_requests)
    }

@app.on_event("startup")
async def startup_event():
    """Initialize resources on server startup."""
    logger.info("Starting script writing agent server...")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on server shutdown."""
    logger.info("Shutting down script writing agent server...")
    # Add any cleanup code here
