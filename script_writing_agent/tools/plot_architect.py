"""Plot architect module for script generation."""

from typing import Dict, Optional
from ..ai_service import ai_service

async def create_plot(concept: str, genre: str = None) -> Dict:
    """Analyzes user's concept and generates a dynamic plot structure using AI.
    
    Args:
        concept (str): User's creative prompt/concept
        genre (str, optional): Genre if specified
        
    Returns:
        Dict: AI-generated plot structure
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
            "request_type": "plot_creation"
        }

        # Generate AI prompt
        prompt = f"""Based on this story concept: "{concept}"
        {f'Taking into account {genre} genre elements,' if genre else ''}
        create a compelling and original plot structure.
        
        Consider:
        - Natural story progression and pacing
        - Key plot points and turning points
        - Thematic elements and motifs
        - Character development opportunities
        - Conflict escalation and resolution
        - Subplot integration
        - Story stakes and tension
        """

        # Get AI response
        response = await ai_service.generate_response(prompt, context)
        
        if response["status"] == "error":
            return response

        return {
            "status": "success",
            "plot": response["content"],
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
