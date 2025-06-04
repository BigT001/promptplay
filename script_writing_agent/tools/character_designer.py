"""Character designer module for script generation."""

from typing import Dict, Optional
from ..ai_service import ai_service

async def create_characters(concept: str, genre: str = None) -> Dict:
    """Creates and develops characters using AI analysis.
    
    Args:
        concept (str): Story concept from prompt
        genre (str): Optional genre specification
        
    Returns:
        Dict: AI-generated character descriptions and arcs
    """
    if not concept:
        return {
            "status": "error",
            "error_message": "Story concept is required"
        }

    try:
        # Prepare context for AI
        context = {
            "concept": concept,
            "genre": genre,
            "request_type": "character_creation"
        }

        prompt = f"""Analyze this story concept: "{concept}"
        {f'Consider the {genre} genre conventions.' if genre else ''}
        Create a cast of characters that would naturally emerge from this story.
        Consider:
        - Main character(s) with detailed personalities
        - Supporting characters that enhance the story
        - Antagonistic forces (not necessarily traditional villains)
        - Character relationships and dynamics
        - Character arcs and growth opportunities
        - Cultural and demographic authenticity
        """

        # Get AI response
        response = await ai_service.generate_response(prompt, context)
        
        if response["status"] == "error":
            return response

        return {
            "status": "success",
            "characters": response["content"],
            "metadata": {
                "concept": concept,
                "genre": genre
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "error_message": str(e)
        }
