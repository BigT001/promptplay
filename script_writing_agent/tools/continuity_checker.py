"""Continuity checker module for script generation."""

def check_continuity(plot: dict, characters: dict, scenes: dict) -> dict:
    """Checks for consistency in the script.
    
    Args:
        plot (dict): Plot structure and details
        characters (dict): Character profiles
        scenes (dict): All scenes with dialogue
        
    Returns:
        dict: Consistency report and suggestions
    """
    try:
        issues = []
        suggestions = []
        
        # Check character consistency
        character_issues = check_character_consistency(characters, scenes)
        issues.extend(character_issues)
        
        # Check plot progression
        plot_issues = check_plot_progression(plot, scenes)
        issues.extend(plot_issues)
        
        # Check scene transitions
        transition_issues = check_scene_transitions(scenes)
        issues.extend(transition_issues)
        
        # Generate suggestions
        if issues:
            suggestions = generate_suggestions(issues)
        
        return {
            "status": "success" if not issues else "warning",
            "issues": issues,
            "suggestions": suggestions
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error checking continuity: {str(e)}"
        }

def check_character_consistency(characters: dict, scenes: dict) -> list:
    """Check for character consistency across scenes."""
    issues = []
    
    # Track character appearances
    char_appearances = {}
    
    # Check each act's scenes
    for act, act_scenes in scenes.items():
        for scene in act_scenes:
            scene_chars = scene.get("characters", [])
            
            # Track appearances
            for char in scene_chars:
                if char not in char_appearances:
                    char_appearances[char] = []
                char_appearances[char].append(scene.get("scene_number"))
            
            # Check for character conflicts
            dialogue = scene.get("dialogue", [])
            for line in dialogue:
                speaker = line.get("character")
                if speaker and speaker not in scene_chars:
                    issues.append(f"Character '{speaker}' speaks in scene {scene.get('scene_number')} but is not listed in scene characters")
    
    return issues

def check_plot_progression(plot: dict, scenes: dict) -> list:
    """Check for logical plot progression."""
    issues = []
    
    # Ensure all acts are present
    required_acts = ["act_1", "act_2", "act_3"]
    for act in required_acts:
        if act not in scenes:
            issues.append(f"Missing {act.replace('_', ' ').title()}")
    
    # Check scene numbering
    scene_numbers = []
    for act_scenes in scenes.values():
        for scene in act_scenes:
            if "scene_number" in scene:
                scene_numbers.append(scene["scene_number"])
    
    # Check for gaps in scene numbers
    for i in range(1, max(scene_numbers) + 1):
        if i not in scene_numbers:
            issues.append(f"Missing scene number {i}")
    
    return issues

def check_scene_transitions(scenes: dict) -> list:
    """Check for logical scene transitions."""
    issues = []
    last_time = None
    last_location = None
    
    for act, act_scenes in scenes.items():
        for scene in act_scenes:
            current_time = scene.get("time")
            current_location = scene.get("location")
            
            # Check time progression
            if last_time and last_time == "Night" and current_time == "Day":
                # This is actually okay, it's a new day
                pass
            elif last_time and last_time == "Day" and current_time == "Night":
                # This is okay too
                pass
            elif last_time and last_time != current_time:
                issues.append(f"Unclear time transition in {act} from {last_time} to {current_time}")
            
            # Check location transitions
            if last_location and last_location == current_location:
                # Might want to suggest a location change for variety
                issues.append(f"Repeated location in {act}: {current_location}")
            
            last_time = current_time
            last_location = current_location
    
    return issues

def generate_suggestions(issues: list) -> list:
    """Generate helpful suggestions based on identified issues."""
    suggestions = []
    
    for issue in issues:
        if "missing" in issue.lower():
            suggestions.append(f"Add {issue.lower().replace('missing ', '')}")
        elif "unclear time" in issue.lower():
            suggestions.append("Add a transition scene or time indicator")
        elif "repeated location" in issue.lower():
            suggestions.append("Consider varying locations to maintain visual interest")
    
    return suggestions
