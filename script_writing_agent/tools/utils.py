def is_valid_time_progression(time1: str, time2: str) -> bool:
    """Helper function to validate time progression between scenes.
    
    Args:
        time1 (str): Time marker for first scene
        time2 (str): Time marker for second scene
        
    Returns:
        bool: True if time progression is valid
    """
    time_order = {
        "dawn": 0,
        "morning": 1,
        "noon": 2,
        "afternoon": 3,
        "evening": 4,
        "night": 5,
        "midnight": 6
    }
    
    # Convert to lowercase for comparison
    t1 = time1.lower()
    t2 = time2.lower()
    
    # If either time is not in our mapping, assume it's valid
    if t1 not in time_order or t2 not in time_order:
        return True
        
    # Check if time2 is later than time1 or wraps to next day
    return time_order[t2] > time_order[t1] or (time_order[t1] == 6 and time_order[t2] == 0)

def dialogue_writer(scene: dict, characters: dict) -> dict:
    """Writes dialogue for a specific scene.
    
    Args:
        scene (dict): Scene context and description
        characters (dict): Character profiles
        
    Returns:
        dict: Scene with dialogue
    """
    if not scene or not characters:
        return {
            "status": "error",
            "error_message": "Scene and character information required."
        }

    # Extract scene information
    setting = scene.get("setting", "UNKNOWN LOCATION")
    time = scene.get("time", "NIGHT")
    mood = scene.get("mood", "neutral")
    description = scene.get("description", "")
    
    # Character voice patterns
    voice_patterns = {
        "protagonist": {
            "direct": ["Clear objectives", "Leadership tone"],
            "emotional": ["Personal insight", "Inner conflict"],
            "actions": ["Determined movement", "Focused gestures"]
        },
        "antagonist": {
            "direct": ["Threats", "Commands"],
            "emotional": ["Manipulation", "False warmth"],
            "actions": ["Intimidating presence", "Calculated movements"]
        },
        "supporting": {
            "direct": ["Information giving", "Practical advice"],
            "emotional": ["Emotional support", "Comic relief"],
            "actions": ["Supportive gestures", "Background activity"]
        }
    }

    # Build dialogue sequence
    dialogue_exchanges = []
    
    # Add character exchanges based on scene type
    scene_characters = scene.get("characters", [characters.get("protagonist", {})])
    
    for char in scene_characters:
        char_type = char.get("type", "supporting")
        voice = voice_patterns.get(char_type, voice_patterns["supporting"])
        
        dialogue_exchanges.append({
            "character": char.get("name", "CHARACTER"),
            "dialogue": f"{char.get('name', 'CHARACTER')}: {voice['direct'][0]}",
            "action": voice['actions'][0],
            "parenthetical": f"({mood})" if mood != "neutral" else ""
        })

    return {
        "status": "success",
        "dialogue": [
            {
                "scene_heading": f"{setting} - {time}",
                "action": description,
                "exchanges": dialogue_exchanges,
                "transitions": scene.get("transition", "CUT TO:")
            }
        ],
        "format": "Screenplay",
        "style_notes": [
            "Keep dialogue minimal and impactful",
            "Focus on visual storytelling",
            "Use action lines to drive the narrative",
            f"Maintain {mood} mood throughout scene",
            "Balance dialogue with physical actions"
        ],
        "scene_elements": {
            "mood": mood,
            "setting": setting,
            "time": time,
            "characters_present": [char.get("name", "CHARACTER") for char in 
scene_characters]
        }
    }

def scene_builder(plot_structure: dict, characters: dict) -> dict:
    """Designs the visual and spatial layout of scenes.
    
    Args:
        plot_structure (dict): The plot structure
        characters (dict): Character profiles
        
    Returns:
        dict: Scene descriptions and sequence
    """
    if not plot_structure or not characters:
        return {
            "status": "error",
            "error_message": "Plot structure and character information required."
        }

    # Get genre-specific elements
    genre_info = plot_structure.get("plot_structure", {})
    genre_elements = genre_info.get("genre_elements", [])
    pacing = genre_info.get("pacing", "Balanced")
    
    # Scene configuration based on genre
    scene_config = {
        "action": {
            "pacing": "Fast",
            "shot_types": ["Wide shot", "Quick cuts", "Action tracking"],
            "lighting": ["High contrast", "Dynamic", "Atmospheric"],
            "audio_elements": ["Impact sounds", "Tense music", "Environmental"]
        },
        "drama": {
            "pacing": "Character-driven",
            "shot_types": ["Close-ups", "Two shots", "Static frames"],
            "lighting": ["Natural", "Mood-based", "Subtle"],
            "audio_elements": ["Dialogue focus", "Ambient sound", "Emotional score"]
        },
        "thriller": {
            "pacing": "Suspense-building",
            "shot_types": ["Dutch angles", "POV shots", "Slow push-ins"],
            "lighting": ["Shadows", "Low-key", "Noir style"],
            "audio_elements": ["Tension stings", "Heartbeats", "Silence"]
        }
    }
    
    # Determine scene style based on genre elements
    genre_type = "drama"  # default
    for genre in scene_config.keys():
        if any(genre in element.lower() for element in genre_elements):
            genre_type = genre
            break
    
    style = scene_config[genre_type]
    
    return {
        "status": "success",
        "scenes": {
            "act1": [
                {
                    "setting": "Establishing location",
                    "description": "Introduction to the world and characters",
                    "action": "Character-revealing moment",
                    "technical_elements": {
                        "shots": style["shot_types"][:2],
                        "lighting": style["lighting"][0],
                        "audio": style["audio_elements"][0]
                    },
                    "key_elements": ["Character introduction", "World building", "Tone setting"]
                }
            ],
            "act2": [
                {
                    "setting": "Conflict location",
                    "description": "Rising action and complications",
                    "action": "Character confrontation",
                    "technical_elements": {
                        "shots": style["shot_types"],
                        "lighting": style["lighting"][1],
                        "audio": style["audio_elements"][1]
                    },
                    "key_elements": ["Conflict escalation", "Character development", "Plot advancement"]
                }
            ],
            "act3": [
                {
                    "setting": "Climactic location",
                    "description": "Final confrontation setting",
                    "action": "Resolution sequence",
                    "technical_elements": {
                        "shots": style["shot_types"][-2:],
                        "lighting": style["lighting"][2],
                        "audio": style["audio_elements"][2]
                    },
                    "key_elements": ["Climax", "Resolution", "Theme reinforcement"]
                }
            ]
        },
        "scene_progression": {
            "pacing": style["pacing"],
            "visual_style": {
                "primary_shots": style["shot_types"],
                "lighting_scheme": style["lighting"],
                "audio_design": style["audio_elements"]
            },
            "transitions": ["CUT TO:", "DISSOLVE TO:", "FADE OUT."],
            "notes": [
                f"Maintain {style['pacing']} pacing throughout",
                "Use visual elements to support story",
                "Consider character blocking in each scene",
                "Ensure scene transitions serve story purpose"
            ]
        }
    }


