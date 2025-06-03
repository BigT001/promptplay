"""Main script writing agent module."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
import asyncio
from functools import lru_cache
import logging
from concurrent.futures import ThreadPoolExecutor
import time

from .tools import (
    create_plot,
    create_characters,
    create_scenes,
    create_dialogue,
    check_continuity
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize thread pool
executor = ThreadPoolExecutor(max_workers=4)

# Define input/output schemas
class ScriptRequest(BaseModel):
    prompt: str = Field(..., description="The user's request or message")
    parameters: Dict = Field(default_factory=dict, description="Optional parameters")

class ScriptResponse(BaseModel):
    script: Dict
    status: str = "success"
    message: Optional[str] = None

@lru_cache(maxsize=100)
def analyze_prompt(prompt: str) -> Dict:
    """Analyze a natural language prompt to extract relevant information with caching.
    
    Args:
        prompt: The user's natural language request
        
    Returns:
        Dict containing extracted concept, genre (if any), and additional parameters
    """
    start_time = time.time()
    logger.info(f"Starting prompt analysis for: {prompt[:100]}...")
    
    try:
        # Extract key information using NLP
        concept = prompt  # Default behavior
        genre = None
        additional_params = {}
        
        # Improved genre detection with weighted keywords
        genre_keywords = {
            "action": ["action", "fight", "battle", "adventure", "chase", "explosion"],
            "drama": ["drama", "emotional", "relationship", "conflict", "personal"],
            "comedy": ["comedy", "funny", "humor", "laugh", "hilarious"],
            "horror": ["horror", "scary", "fear", "terrifying", "spooky"],
            "sci-fi": ["sci-fi", "science fiction", "future", "space", "technology"],
            "romance": ["romance", "love", "relationship", "romantic"],
            "thriller": ["thriller", "suspense", "mystery", "tension"],
            "fantasy": ["fantasy", "magic", "mythical", "dragon", "wizard"]
        }
        
        # Score each genre based on keyword matches
        genre_scores = {genre: 0 for genre in genre_keywords}
        prompt_lower = prompt.lower()
        
        for genre, keywords in genre_keywords.items():
            for keyword in keywords:
                if keyword in prompt_lower:
                    genre_scores[genre] += 1
        
        # Select the genre with the highest score
        if any(genre_scores.values()):
            genre = max(genre_scores.items(), key=lambda x: x[1])[0]
        else:
            genre = "drama"  # Default genre
        
        # Extract additional parameters (tone, setting, etc.)
        additional_params = {
            "tone": "light" if genre in ["comedy", "romance"] else "serious",
            "setting": "modern" if not any(k in prompt_lower for k in ["future", "past", "ancient"]) else "other"
        }
        
        result = {
            "concept": concept,
            "genre": genre,
            "additional_params": additional_params
        }
        
        logger.info(f"Prompt analysis completed in {time.time() - start_time:.2f}s")
        return result
        
    except Exception as e:
        logger.error(f"Error in prompt analysis: {str(e)}")
        raise

async def generate_script_async(prompt: str, parameters: Dict = None) -> Dict:
    """Generate a script asynchronously based on the user's prompt.
    
    Args:
        prompt: The user's natural language request
        parameters: Optional parameters to customize generation
        
    Returns:
        Dict containing the generated script
    """
    start_time = time.time()
    logger.info(f"Starting script generation for prompt: {prompt[:100]}...")
    
    try:
        # Extract information from the prompt
        request_info = analyze_prompt(prompt)
        concept = request_info["concept"]
        genre = request_info["genre"]
        
        # Create tasks for parallel processing
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(executor, create_plot, concept, genre),
            loop.run_in_executor(executor, create_characters, concept, genre)
        ]
        
        # Wait for plot and characters
        plot, characters = await asyncio.gather(*tasks)
        
        # Create scenes (depends on plot and characters)
        scenes = await loop.run_in_executor(
            executor, create_scenes, plot, characters
        )
        
        # Create dialogue and check continuity in parallel
        tasks = [
            loop.run_in_executor(executor, create_dialogue, scenes, characters),
            loop.run_in_executor(executor, check_continuity, plot, characters, scenes)
        ]
        
        dialogue, continuity_notes = await asyncio.gather(*tasks)
        
        script = {
            "plot": plot,
            "characters": characters,
            "scenes": scenes,
            "dialogue": dialogue,
            "continuity_notes": continuity_notes
        }
        
        logger.info(f"Script generation completed in {time.time() - start_time:.2f}s")
        return {
            "status": "success",
            "script": script,
            "message": f"Script generated successfully in {time.time() - start_time:.2f}s"
        }
        
    except Exception as e:
        logger.error(f"Error in script generation: {str(e)}")
        return {
            "status": "error",
            "script": None,
            "message": f"Error generating script: {str(e)}"
        }

def generate_script(prompt: str, parameters: Dict = None) -> Dict:
    """Synchronous wrapper for generate_script_async."""
    return asyncio.run(generate_script_async(prompt, parameters))
