"""Dialogue writer module for script generation."""

def create_dialogue(scenes: dict, characters: dict) -> dict:
    """Creates dialogue for all scenes in the script.
    
    Args:
        scenes (dict): All scenes in the script
        characters (dict): Character profiles
        
    Returns:
        dict: Scenes with added dialogue
    """
    try:
        dialogue_scenes = {}
        
        # Process each act
        for act, act_scenes in scenes.items():
            dialogue_scenes[act] = []
            
            # Process each scene in the act
            for scene in act_scenes:
                dialogue = generate_scene_dialogue(scene, characters)
                dialogue_scenes[act].append({
                    **scene,
                    "dialogue": dialogue
                })
        
        return dialogue_scenes
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating dialogue: {str(e)}"
        }

def generate_scene_dialogue(scene: dict, characters: dict) -> list:
    """Generate dialogue for a specific scene.
    
    Args:
        scene (dict): Scene context and description
        characters (dict): Character profiles
        
    Returns:
        list: List of dialogue exchanges
    """
    dialogue = []
    scene_chars = scene.get("characters", [])
    
    # Get scene purpose and elements
    purpose = scene.get("purpose", "")
    key_elements = scene.get("key_elements", [])
    
    # Basic dialogue structure based on scene purpose
    if "introduction" in purpose.lower():
        # Character introduction scene
        dialogue.extend(generate_introduction_dialogue(scene_chars, characters))
    
    elif "conflict" in purpose.lower():
        # Conflict scene
        dialogue.extend(generate_conflict_dialogue(scene_chars, characters))
    
    elif "development" in purpose.lower():
        # Character development scene
        dialogue.extend(generate_development_dialogue(scene_chars, characters))
    
    elif "resolution" in purpose.lower():
        # Resolution scene
        dialogue.extend(generate_resolution_dialogue(scene_chars, characters))
    
    return dialogue

def generate_introduction_dialogue(scene_chars: list, characters: dict) -> list:
    """Generate introduction dialogue."""
    dialogue = []
    protagonist = characters.get("protagonist", {})
    
    if protagonist and protagonist.get("name") in scene_chars:
        dialogue.append({
            "character": protagonist["name"],
            "action": "working on an invention",
            "line": "One day, this will change everything. I know it will."
        })
        
        # Add supporting character reactions if present
        for char in characters.get("supporting", []):
            if char.get("name") in scene_chars:
                dialogue.append({
                    "character": char["name"],
                    "action": "skeptical",
                    "line": f"Again with the inventions, {protagonist['name']}?"
                })
    
    return dialogue

def generate_conflict_dialogue(scene_chars: list, characters: dict) -> list:
    """Generate conflict dialogue."""
    dialogue = []
    protagonist = characters.get("protagonist", {})
    antagonist = characters.get("antagonist", {})
    
    if protagonist and antagonist:
        dialogue.extend([
            {
                "character": antagonist.get("name", "Antagonist"),
                "action": "dismissive",
                "line": "Your ideas are a waste of time and resources."
            },
            {
                "character": protagonist["name"],
                "action": "determined",
                "line": "You'll see. I won't give up until I succeed."
            }
        ])
    
    return dialogue

def generate_development_dialogue(scene_chars: list, characters: dict) -> list:
    """Generate character development dialogue."""
    dialogue = []
    protagonist = characters.get("protagonist", {})
    
    if protagonist:
        dialogue.append({
            "character": protagonist["name"],
            "action": "reflective",
            "line": "Maybe they're right... No, I have to keep trying."
        })
    
    return dialogue

def generate_resolution_dialogue(scene_chars: list, characters: dict) -> list:
    """Generate resolution dialogue."""
    dialogue = []
    protagonist = characters.get("protagonist", {})
    
    if protagonist:
        dialogue.extend([
            {
                "character": protagonist["name"],
                "action": "triumphant",
                "line": "It works! It finally works!"
            }
        ])
        
        # Add community reaction
        if any(char.get("name") in scene_chars for char in characters.get("supporting", [])):
            dialogue.append({
                "character": "Community Member",
                "action": "amazed",
                "line": "We were wrong about you. This is incredible!"
            })
    
    return dialogue
