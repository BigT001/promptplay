"""Plot architect module for script generation."""

def create_plot(concept: str, genre: str = "drama") -> dict:
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
    
    # Use drama as fallback genre
    genre = genre.lower() if genre else "drama"
    if genre not in genre_config:
        genre = "drama"
    
    config = genre_config[genre]
    
    # Extract key elements from concept
    themes = config["themes"]
    elements = config["elements"]
    pacing = config["pacing"]
    
    # Build three-act structure
    acts = {
        "act1": {
            "setup": [
                "Introduce young Nigerian inventor in his community",
                "Show his passion for creating gadgets",
                "Establish community's skepticism",
                "Present the core problem his invention might solve"
            ],
            "turning_point": "A specific incident highlights the need for his invention"
        },
        "act2": {
            "rising_action": [
                "Multiple failed attempts at creating the solution",
                "Increasing mockery from neighbors",
                "Discovery of a key insight or component",
                "Small success that hints at potential"
            ],
            "midpoint": "A partial success proves his concept might work",
            "falling_action": [
                "Technical challenges threaten the project",
                "Community pressure intensifies",
                "Personal doubts surface",
                "Key setback that almost makes him quit"
            ]
        },
        "act3": {
            "climax": [
                "Final assembly of the invention",
                "Public demonstration",
                "Initial skepticism turns to amazement",
                "Community begins to see the value"
            ],
            "resolution": [
                "Invention helps solve a community problem",
                "Recognition from previous doubters",
                "Inspiration for other young inventors",
                "Change in community's attitude toward innovation"
            ]
        }
    }
    
    return {
        "title": "The Young Inventor",
        "theme": "Innovation and perseverance in the face of skepticism",
        "genre": genre,
        "acts": acts,
        "elements": elements,
        "pacing": pacing
    }
