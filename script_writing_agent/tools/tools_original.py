def plot_architect(concept: str, genre: str) -> dict:
    """Defines the story arc, themes, acts, and turning points.
    
    Args:
        concept (str): One-line concept for the story
        genre (str): Target genre for the script
        
    Returns:
        dict: Plot structure including acts and turning points
    """
    # Genre-specific elements and themes
    genre_config = {
        "action": {
            "themes": ["Justice", "Survival", "Redemption", "Good vs Evil"],
            "elements": ["High-intensity action", "Chase sequences", "Combat scenes", "Plot twists"],
            "pacing": "Fast-paced",
            "act_structure": {
                "setup": "Establish protagonist's normal world and skills",
                "inciting": "Violent or action-packed event disrupts status quo",
                "progressive": ["Training/Preparation", "Initial confrontations", "Raising stakes"],
                "climax_type": "High-stakes physical confrontation"
            }
        },
        "drama": {
            "themes": ["Personal growth", "Relationships", "Internal conflict", "Social issues"],
            "elements": ["Character development", "Emotional moments", "Dialogue-driven scenes"],
            "pacing": "Character-driven",
            "act_structure": {
                "setup": "Introduce character's world and relationships",
                "inciting": "Personal or emotional crisis emerges",
                "progressive": ["Initial attempts to cope", "Deepening conflict", "Personal revelations"],
                "climax_type": "Emotional confrontation or decision"
            }
        },
        "comedy": {
            "themes": ["Self-discovery", "Love", "Friendship", "Overcoming adversity"],
            "elements": ["Humorous situations", "Witty dialogue", "Running gags", "Comic timing"],
            "pacing": "Rhythm-based",
            "act_structure": {
                "setup": "Establish comic premise and character quirks",
                "inciting": "Humorous complication or misunderstanding",
                "progressive": ["Escalating situations", "Compounding problems", "Farcical peak"],
                "climax_type": "Resolution of misunderstandings"
            }
        }
    }
    # Genre-specific elements and themes
    genre_config = {
        "action": {
            "themes": ["Justice", "Survival", "Redemption", "Good vs Evil"],
            "elements": ["High-intensity action", "Chase sequences", "Combat scenes", "Plot twists"],
            "pacing": "Fast-paced"
        },
        "drama": {
            "themes": ["Personal growth", "Relationships", "Internal conflict", "Social issues"],
            "elements": ["Character development", "Emotional moments", "Dialogue-driven scenes"],
            "pacing": "Character-driven"
        },
        "comedy": {
            "themes": ["Self-discovery", "Love", "Friendship", "Overcoming adversity"],
            "elements": ["Humorous situations", "Witty dialogue", "Running gags", "Comic timing"],
            "pacing": "Rhythm-based"
        },
        "horror": {
            "themes": ["Fear", "Survival", "Trust", "Unknown"],
            "elements": ["Suspense building", "Jump scares", "Psychological elements", "Atmosphere"],
            "pacing": "Tension-building"
        },
        "sci-fi": {
            "themes": ["Technology", "Humanity", "Progress", "Exploration"],
            "elements": ["World-building", "Technological concepts", "Speculative elements"],
            "pacing": "World-driven"
        },
        "romance": {
            "themes": ["Love", "Relationships", "Personal growth", "Connection"],
            "elements": ["Meet-cute", "Relationship development", "Emotional moments"],
            "pacing": "Emotional-driven"
        },
        "thriller": {
            "themes": ["Mystery", "Suspense", "Trust", "Deception"],
            "elements": ["Plot twists", "Suspense building", "Red herrings", "Revelations"],
            "pacing": "Suspense-driven"
        }
    }
    
    # Default genre elements if genre not in config
    default_config = {
        "themes": ["Universal human experience", "Growth", "Change"],
        "elements": ["Character development", "Plot progression", "Resolution"],
        "pacing": "Balanced"
    }
    
    # Get genre configuration or default
    genre = genre.lower()
    genre_info = genre_config.get(genre, default_config)
    
    # Extract key concept elements
    concept_words = concept.lower().split()
    
    # Build plot structure
    return {
        "status": "success",
        "plot_structure": {
            "act1": {
                "setup": f"Establish the world of {concept}",
                "inciting_incident": "Event that disrupts the normal world",
                "first_plot_point": "protagonist must engage with the main conflict",
                "key_scenes": [
                    "World introduction",
                    "Character introduction",
                    "Normal life demonstration",
                    "Inciting incident"
                ]
            },
            "act2": {
                "rising_action": f"Protagonist faces escalating challenges in {genre} style",
                "midpoint": "Major revelation or reversal that raises the stakes",
                "low_point": "All seems lost moment before the final push",
                "key_scenes": [
                    "Initial challenges",
                    "Skill development",
                    "Midpoint twist",
                    "Complications",
                    "Dark moment"
                ]
            },
            "act3": {
                "climax": "Final confrontation with the main conflict",
                "resolution": "New equilibrium is established",
                "aftermath": "Impact of the story events",
                "key_scenes": [
                    "Preparation for climax",
                    "Climactic moment",
                    "Resolution",
                    "New normal"
                ]
            },
            "theme": genre_info["themes"],
            "genre_elements": genre_info["elements"],
            "pacing": genre_info["pacing"],
            "tone": f"{genre.capitalize()} tone appropriate for {concept}",
            "style_notes": [
                f"Maintain {genre} conventions while being original",
                f"Focus on {genre_info['pacing']} storytelling",
                "Ensure character motivations drive the plot",
                f"Incorporate {genre} elements naturally"
            ]
        }
    }

def character_designer(plot_structure: dict) -> dict:
    """Develops character profiles based on the plot structure.
    
    Args:
        plot_structure (dict): The plot structure from plot_architect
        
    Returns:
        dict: Character profiles and their relationships
    """
    if not plot_structure or "plot_structure" not in plot_structure:
        return {
            "status": "error",
            "error_message": "Invalid plot structure provided."
        }

    plot_info = plot_structure["plot_structure"]
    genre_elements = plot_info.get("genre_elements", [])
    themes = plot_info.get("theme", [])
    pacing = plot_info.get("pacing", "Balanced")

    # Build character archetypes based on genre and themes
    character_types = {
        "action": {
            "protagonist": ["Hero", "Anti-hero", "Skilled professional", "Reluctant hero"],
            "antagonist": ["Mastermind", "Corrupt official", "Criminal boss", "Dark reflection"],
            "supporting": ["Ally", "Mentor", "Informant", "Comic relief", "Betrayer"]
        },
        "drama": {
            "protagonist": ["Everyman", "Dreamer", "Rebel", "Survivor"],
            "antagonist": ["Society", "Authority figure", "Inner demons", "Rival"],
            "supporting": ["Confidant", "Love interest", "Mentor", "Family member"]
        },
        "comedy": {
            "protagonist": ["Underdog", "Fish out of water", "Charming troublemaker"],
            "antagonist": ["Authority figure", "Rival", "Societal norms"],
            "supporting": ["Best friend", "Love interest", "Eccentric family", "Straight man"]
        },
        "thriller": {
            "protagonist": ["Detective", "Amateur sleuth", "Victim", "Professional"],
            "antagonist": ["Serial killer", "Conspirator", "Hidden enemy", "Corrupt system"],
            "supporting": ["Partner", "Expert", "Witness", "Red herring"]
        },
        "horror": {
            "protagonist": ["Final girl/guy", "Investigator", "Skeptic", "Expert"],
            "antagonist": ["Monster", "Supernatural force", "Human monster", "Unknown entity"],
            "supporting": ["Victim", "Helper", "Red herring", "Doom sayer"]
        },
        "sci-fi": {
            "protagonist": ["Explorer", "Scientist", "Rebel", "Enhanced human"],
            "antagonist": ["AI", "Corrupt corporation", "Alien threat", "Mad scientist"],
            "supporting": ["Robot companion", "Crew member", "Alien ally", "Tech expert"]
        },
        "romance": {
            "protagonist": ["Love seeker", "Career focused", "Free spirit", "Wounded heart"],
            "antagonist": ["Rival love interest", "Family opposition", "Internal fears", "Circumstances"],
            "supporting": ["Best friend", "Wingman/woman", "Family member", "Mentor"]
        }
    }

    # Determine genre from elements
    genre_type = "drama"  # default
    for element in genre_elements:
        element_lower = element.lower()
        for genre in character_types.keys():
            if genre in element_lower:
                genre_type = genre
                break

    # Get appropriate archetypes
    genre_archetypes = character_types.get(genre_type, character_types["drama"])

    # Select random archetype from appropriate list
    import random
    protag_type = random.choice(genre_archetypes["protagonist"])
    antag_type = random.choice(genre_archetypes["antagonist"])
    support_types = random.sample(genre_archetypes["supporting"], 2)

    # Build character profiles
    return {
        "status": "success",
        "characters": {
            "protagonist": {
                "archetype": protag_type,
                "name": f"{protag_type} Name",
                "role": "Main character",
                "motivation": themes[0] if isinstance(themes, list) and themes else "Personal growth",
                "background": "To be developed based on story needs",
                "skills": [f"{genre_type} expertise", "Story-relevant skill", "Personal talent"],
                "weaknesses": ["Character flaw", "Story-driven weakness", "Personal limitation"],
                "arc": f"Journey through {plot_info['act1']['setup']}",
                "relationships": {
                    "antagonist": {
                        "type": antag_type,
                        "conflict": "Opposes protagonist's goals",
                        "resolution": "To be determined by story outcome"
                    },
                    "supporting": [
                        {
                            "type": support_types[0],
                            "role": "Supportive ally or mentor",
                            "conflict": "Possible differences in approach or ideology",
                            "resolution": "To be developed"
                        },
                        {
                            "type": support_types[1],
                            "role": "Comic relief or sidekick",
                            "conflict": "May inadvertently cause problems",
                            "resolution": "To be developed"
                        }
                    ]
                }
            },
            "antagonist": {
                "archetype": antag_type,
                "name": f"{antag_type} Name",
                "role": "Opposes protagonist",
                "motivation": "Antithesis of protagonist's goal",
                "background": "To be developed",
                "skills": ["Expert in opposition to protagonist", "Manipulation", "Strategic planning"],
                "weaknesses": ["Hubris", "Overconfidence", "Personal vendetta"],
                "arc": f"Counter-journey to protagonist's arc",
                "relationships": {
                    "protagonist": {
                        "type": "Primary conflict",
                        "intensity": "High",
                        "resolution": "To be determined"
                    }
                }
            },
            "supporting": [
                {
                    "archetype": support_types[0],
                    "name": f"{support_types[0]} Name",
                    "role": "Supportive ally or mentor",
                    "motivation": "Aid protagonist",
                    "background": "To be developed",
                    "skills": ["Expertise in relevant field", "Mentoring", "Problem-solving"],
                    "weaknesses": ["Possible naivety", "Overprotectiveness"],
                    "arc": "Supportive arc complementing protagonist",
                    "relationships": {
                        "protagonist": {
                            "type": "Mentor/mentee",
                            "intensity": "Medium",
                            "resolution": "To be developed"
                        }
                    }
                },
                {
                    "archetype": support_types[1],
                    "name": f"{support_types[1]} Name",
                    "role": "Comic relief or sidekick",
                    "motivation": "Loyalty to protagonist",
                    "background": "To be developed",
                    "skills": ["Humor", "Loyalty", "Resourcefulness"],
                    "weaknesses": ["Impetuosity", "Lack of focus"],
                    "arc": "Comic or supportive arc",
                    "relationships": {
                        "protagonist": {
                            "type": "Ally",
                            "intensity": "Medium",
                            "resolution": "To be developed"
                        }
                    }
                }
            ]
        }
    }

def continuity_checker(script: dict) -> dict:
    """Checks for consistency in the script.
    
    Args:
        script (dict): Complete script with all elements
        
    Returns:
        dict: Consistency report and suggestions
    """
    if not script:
        return {
            "status": "error",
            "error_message": "Script data required for continuity check."
        }

    issues = []
    suggestions = []
    
    # Setup tracking variables
    character_appearances = {}
    plot_threads = {}
    locations = set()
    props = {}
    time_markers = []

    # Analyze each scene
    for scene_num, scene in enumerate(script.get("scenes", []), 1):
        # Track character appearances
        for char in scene.get("characters", []):
            if char not in character_appearances:
                character_appearances[char] = []
            character_appearances[char].append(scene_num)

        # Track locations and transitions
        location = scene.get("setting", "")
        if location:
            locations.add(location)
            if scene_num > 1:
                prev_location = script["scenes"][scene_num-2].get("setting", "")
                if prev_location and not scene.get("transition"):
                    suggestions.append(f"Consider adding location transition between {prev_location} and {location}")

        # Track props
        for prop in scene.get("props", []):
            if prop not in props:
                props[prop] = {"introduced": scene_num, "last_seen": scene_num}
            else:
                props[prop]["last_seen"] = scene_num

        # Track plot threads
        for thread in scene.get("plot_threads", []):
            if thread not in plot_threads:
                plot_threads[thread] = {"introduced": scene_num, "resolved": None}
            elif scene.get("resolves_thread") == thread:
                plot_threads[thread]["resolved"] = scene_num

        # Track time progression
        time_markers.append(scene.get("time", ""))

    # Analyze continuity
    # Check character consistency
    for char, appearances in character_appearances.items():
        if len(appearances) > 1:
            gaps = [appearances[i+1] - appearances[i] for i in range(len(appearances)-1)]
            long_gaps = [i+1 for i, gap in enumerate(gaps) if gap > 3]
            if long_gaps:
                issues.append(f"Character {char} has long gaps in appearances at scenes {long_gaps}")

    # Check unresolved plot threads
    for thread, status in plot_threads.items():
        if not status["resolved"]:
            issues.append(f"Plot thread '{thread}' introduced in scene {status['introduced']} is never resolved")

    # Check prop continuity
    for prop, usage in props.items():
        if usage["introduced"] != usage["last_seen"]:
            gap = usage["last_seen"] - usage["introduced"]
            if gap > 5:
                suggestions.append(f"Consider showing prop '{prop}' between scenes {usage['introduced']} and {usage['last_seen']}")

    # Check time continuity
    for i in range(len(time_markers)-1):
        if time_markers[i] and time_markers[i+1]:
            try:
                if not is_valid_time_progression(time_markers[i], time_markers[i+1]):
                    issues.append(f"Possible time continuity error between scenes {i+1} and {i+2}")
            except ValueError:
                suggestions.append(f"Consider clarifying time progression between scenes {i+1} and {i+2}")

    return {
        "status": "success",
        "issues": issues,
        "suggestions": suggestions,
        "analysis": {
            "character_tracking": character_appearances,
            "plot_threads": plot_threads,
            "prop_continuity": props,
            "time_progression": time_markers,
            "locations": list(locations)
        }
    }

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
            "characters_present": [char.get("name", "CHARACTER") for char in scene_characters]
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
