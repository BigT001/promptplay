from typing import Dict, List
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool

def plot_architect(concept: str, genre: str) -> dict:
    """Defines the story arc, themes, acts, and turning points.
    
    Args:
        concept (str): One-line concept for the story
        genre (str): Target genre for the script
        
    Returns:
        dict: Plot structure including acts and turning points
    """
    return {
        "status": "success",
        "plot_structure": {
            "act1": {
                "setup": f"Setting up the world of {concept}",
                "inciting_incident": "Event that sets the story in motion",
                "first_plot_point": "Decision that launches into Act 2"
            },
            "act2": {
                "rising_action": "Complications and obstacles",
                "midpoint": "Major revelation or reversal",
                "low_point": "All seems lost moment"
            },
            "act3": {
                "climax": "Final confrontation",
                "resolution": "New normal established"
            },
            "theme": f"Core theme relevant to {genre}",
            "genre_elements": []
        }
    }

def character_designer(plot_structure: dict) -> dict:
    """Develops character profiles based on the plot structure.
    
    Args:
        plot_structure (dict): The plot structure from plot_architect
        
    Returns:
        dict: Character profiles and their relationships
    """
    if "genre_elements" in plot_structure.get("plot_structure", {}):
        return {
            "status": "success",
            "characters": {
                "protagonist": {
                    "name": "Alex Reeves",
                    "role": "Off-duty intelligence agent",
                    "motivation": "Uncovering the truth behind the incident",
                    "skills": ["Combat expertise", "Tactical analysis", "Urban navigation"],
                    "weaknesses": ["Trust issues", "Personal vendetta", "Limited resources"],
                    "arc": "From reluctant witness to determined pursuer",
                    "relationships": ["Former agency contacts", "Potential allies", "Hidden enemies"]
                },
                "antagonist": {
                    "name": "Shadow Operative",
                    "role": "Mystery assassin/conspirator",
                    "motivation": "Hidden agenda revealed in twist",
                    "skills": ["Professional killer", "Stealth", "Network of allies"],
                    "arc": "From faceless threat to personal betrayer",
                    "relationships": ["Secret organization", "Moles in agency", "Connected to protagonist"]
                },
                "supporting_cast": [
                    {
                        "name": "Maria Chen",
                        "role": "Street-smart ally",
                        "relationship": "Helps protagonist navigate the urban environment"
                    },
                    {
                        "name": "Commander Hayes",
                        "role": "Agency contact",
                        "relationship": "Questionable loyalty, potential twist character"
                    }
                ]
            }
        }
    else:
        return {
            "status": "error",
            "error_message": "Invalid plot structure provided."
        }

def scene_builder(plot_structure: dict, characters: dict) -> dict:
    """Designs the visual and spatial layout of scenes.
    
    Args:
        plot_structure (dict): The plot structure
        characters (dict): Character profiles
        
    Returns:
        dict: Scene descriptions and sequence
    """
    return {
        "status": "success",
        "scenes": {
            "act1": [
                {
                    "setting": "Crowded night market - Urban setting",
                    "description": "Bustling street scene, neon lights, tight spaces",
                    "action": "Assassination witnessed by protagonist",
                    "key_elements": ["Multiple witnesses", "Urban chaos", "Initial sighting"]
                },
                {
                    "setting": "Market alleyways and side streets",
                    "description": "Narrow passages, steam vents, ambient city noise",
                    "action": "Initial chase sequence begins",
                    "key_elements": ["Parkour elements", "Crowd navigation", "Building tension"]
                }
            ],
            "act2": [
                {
                    "setting": "Abandoned warehouse district",
                    "description": "Industrial setting, low visibility, many obstacles",
                    "action": "Hand-to-hand combat scene",
                    "key_elements": ["Close quarters", "Environmental hazards", "Raw combat"]
                },
                {
                    "setting": "City rooftops",
                    "description": "Vertigo-inducing heights, helicopter searchlights",
                    "action": "Extended chase sequence",
                    "key_elements": ["Height tension", "Urban traversal", "Near misses"]
                }
            ],
            "act3": [
                {
                    "setting": "Underground parking structure",
                    "description": "Echo-filled concrete structure, minimal lighting",
                    "action": "Final confrontation and twist reveal",
                    "key_elements": ["Betrayal revelation", "Close combat", "Story twist"]
                },
                {
                    "setting": "City street - Dawn approaching",
                    "description": "First light breaking, empty streets",
                    "action": "Cliffhanger ending",
                    "key_elements": ["New threat revealed", "Sequel setup", "Unresolved tension"]
                }
            ]
        }
    }

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
        
    return {
        "status": "success",
        "dialogue": [
            {
                "scene_heading": f"{scene.get('setting', 'UNKNOWN LOCATION')} - NIGHT",
                "action": scene.get('description', ''),
                "exchanges": [
                    {
                        "character": characters['protagonist']['name'],
                        "dialogue": "Sharp, minimal dialogue appropriate for the scene",
                        "action": "Character action description"
                    }
                ],
                "transitions": "CUT TO:"
            }
        ],
        "format": "Screenplay",
        "style_notes": [
            "Keep dialogue minimal and impactful",
            "Focus on visual storytelling",
            "Use action lines to drive the narrative"
        ]
    }

def continuity_checker(script: dict) -> dict:
    """Checks for consistency in the script.
    
    Args:
        script (dict): Complete script with all elements
        
    Returns:
        dict: Consistency report and suggestions
    """
    return {
        "status": "success",
        "issues": [],
        "suggestions": []
    }

# Create tools from our functions
plot_tool = FunctionTool(plot_architect)
character_tool = FunctionTool(character_designer)
scene_tool = FunctionTool(scene_builder)
dialogue_tool = FunctionTool(dialogue_writer)
continuity_tool = FunctionTool(continuity_checker)

# Create the main script writing agent
root_agent = LlmAgent.create(
    name="script_writing_agent",
    description=(
        "A collaborative script writing system with specialized agents for plot, "
        "characters, scenes, dialogue, and continuity."
    ),
    instruction=(
        "You are a collaborative script writing system. Work with the user to "
        "create professional scripts by coordinating multiple specialized agents."
    ),
    model="gemini-2.0-flash",  # Updated model version
    tools=[
        plot_tool,
        character_tool,
        scene_tool,
        dialogue_tool,
        continuity_tool
    ]
)
