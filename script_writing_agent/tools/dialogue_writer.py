"""Dialogue writer module for script generation."""

from typing import Dict
from ..ai_service import ai_service

async def create_dialogue(scenes: Dict, characters: Dict) -> Dict:
    """Generates natural dialogue for scenes using AI analysis.
    
    Args:
        scenes (Dict): Scene contexts and descriptions
        characters (Dict): Character profiles and relationships
        
    Returns:
        Dict: Scenes with AI-generated dialogue
    """
    if not scenes or not characters:
        return {
            "status": "error",
            "error_message": "Missing scene or character information"
        }
        
    try:
        dialogue_scenes = {}
        
        for scene_id, scene in scenes.items():
            # Generate dialogue for each scene
            context = {
                "scene": scene,
                "characters": characters,
                "request_type": "dialogue_generation",
                "scene_id": scene_id
            }
            
            prompt = f"""For this scene:
            Setting: {scene.get('setting', '')}
            Mood: {scene.get('mood', '')}
            Purpose: {scene.get('purpose', '')}
            
            Generate natural dialogue between these characters:
            {', '.join(scene.get('characters', []))}
            
            Consider:
            - Each character's unique voice and personality
            - Scene mood and emotional context
            - Story progression and character arcs
            - Subtext and dramatic tension
            - Natural conversation flow
            - Character relationships and dynamics
            """
            
            response = await ai_service.generate_response(prompt, context)
            
            if response["status"] == "error":
                return response
                
            dialogue_scenes[scene_id] = response["content"]
        
        return {
            "status": "success",
            "scenes": dialogue_scenes
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating dialogue: {str(e)}"
        }
