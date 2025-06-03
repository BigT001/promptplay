"""Scene builder module for script generation."""

def create_scenes(plot: dict, characters: dict) -> dict:
    """Designs the visual and spatial layout of scenes.
    
    Args:
        plot (dict): The plot structure and details
        characters (dict): Character profiles and arcs
        
    Returns:
        dict: Scene descriptions and sequence
    """
    try:
        scenes = {
            "act_1": [],
            "act_2": [],
            "act_3": []
        }
        
        # Extract genre info and elements
        genre = plot.get("genre", "drama")
        
        # Scene templates based on genre
        scene_templates = {
            "drama": {
                "pacing": "character-driven",
                "focus": "emotional impact",
                "key_elements": ["character interaction", "dialogue", "internal conflict"]
            },
            "action": {
                "pacing": "fast",
                "focus": "visual excitement",
                "key_elements": ["action sequences", "chase scenes", "confrontations"]
            },
            "comedy": {
                "pacing": "dynamic",
                "focus": "humor",
                "key_elements": ["comedic situations", "misunderstandings", "resolution"]
            }
        }
        
        template = scene_templates.get(genre, scene_templates["drama"])
        
        # Generate Act 1 scenes
        scenes["act_1"] = [
            {
                "scene_number": 1,
                "location": "Protagonist's World",
                "time": "Day",
                "description": "Introduce protagonist in their normal environment",
                "characters": [characters["protagonist"]["name"]],
                "purpose": "Character introduction and world-building"
            },
            {
                "scene_number": 2,
                "location": "Key Location",
                "time": "Day",
                "description": "Inciting incident that disrupts normal life",
                "characters": [
                    characters["protagonist"]["name"],
                    characters["antagonist"].get("name", "Antagonistic Force")
                ],
                "purpose": "Set main conflict in motion"
            }
        ]
        
        # Generate Act 2 scenes
        scenes["act_2"] = [
            {
                "scene_number": 3,
                "location": "Various",
                "time": "Various",
                "description": "Protagonist faces initial challenges",
                "characters": [characters["protagonist"]["name"]],
                "purpose": "Build conflict and stakes"
            },
            {
                "scene_number": 4,
                "location": "New Environment",
                "time": "Day/Night",
                "description": "Protagonist learns and grows",
                "characters": [
                    characters["protagonist"]["name"],
                    *(c.get("name", "") for c in characters.get("supporting", []))
                ],
                "purpose": "Character development"
            },
            {
                "scene_number": 5,
                "location": "Confrontation Space",
                "time": "Night",
                "description": "Major setback or conflict",
                "characters": [
                    characters["protagonist"]["name"],
                    characters["antagonist"].get("name", "Antagonistic Force")
                ],
                "purpose": "Raise stakes to maximum"
            }
        ]
        
        # Generate Act 3 scenes
        scenes["act_3"] = [
            {
                "scene_number": 6,
                "location": "Climactic Location",
                "time": "Day/Night",
                "description": "Final confrontation and resolution",
                "characters": [
                    characters["protagonist"]["name"],
                    characters["antagonist"].get("name", "Antagonistic Force"),
                    *(c.get("name", "") for c in characters.get("supporting", []))
                ],
                "purpose": "Resolve main conflict"
            },
            {
                "scene_number": 7,
                "location": "Resolution Setting",
                "time": "Day",
                "description": "Show aftermath and character growth",
                "characters": [characters["protagonist"]["name"]],
                "purpose": "Wrap up story and character arcs"
            }
        ]
        
        # Add genre-specific elements to scenes
        for act_scenes in scenes.values():
            for scene in act_scenes:
                scene.update({
                    "pacing": template["pacing"],
                    "focus": template["focus"],
                    "key_elements": template["key_elements"]
                })
        
        return scenes
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating scenes: {str(e)}"
        }
