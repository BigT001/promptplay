"""Character designer module for script generation."""

def create_characters(concept: str, genre: str = None) -> dict:
    """Creates and develops characters for the script.
    
    Args:
        concept (str): Story concept from prompt
        genre (str): Target genre for the script
        
    Returns:
        dict: Character descriptions and arcs
    """
    # Define character archetypes based on genre
    genre_archetypes = {
        "action": {
            "protagonist": ["Hero", "Anti-hero", "Warrior"],
            "antagonist": ["Villain", "Rival", "System"],
            "supporting": ["Mentor", "Ally", "Informant"]
        },
        "drama": {
            "protagonist": ["Everyman", "Dreamer", "Rebel"],
            "antagonist": ["Opposition", "Society", "Self"],
            "supporting": ["Family", "Friend", "Authority"]
        },
        "comedy": {
            "protagonist": ["Underdog", "Fool", "Fish-out-of-water"],
            "antagonist": ["Rival", "Authority", "Situation"],
            "supporting": ["Sidekick", "Love Interest", "Eccentric"]
        }
    }
    
    # Extract character needs from concept
    concept_lower = concept.lower()
    
    # Create base character structure
    characters = {
        "protagonist": {
            "name": "",
            "age": None,
            "role": "Protagonist",
            "description": "",
            "traits": [],
            "goals": [],
            "conflicts": []
        },
        "antagonist": {
            "name": "",
            "role": "Antagonist",
            "description": "",
            "traits": [],
            "goals": [],
            "motivation": ""
        },
        "supporting": []
    }
    
    # Add genre-specific elements
    genre = genre or "drama"
    archetype_options = genre_archetypes.get(genre, genre_archetypes["drama"])
    
    # Analyze concept and generate appropriate characters
    if "inventor" in concept_lower or "innovation" in concept_lower:
        characters["protagonist"].update({
            "name": "Oluwaseun (Seun) Adebayo",
            "age": 14,
            "description": "A bright, curious teenager with a passion for invention and problem-solving",
            "traits": ["Innovative", "Persistent", "Curious", "Optimistic"],
            "goals": ["Create useful inventions", "Prove doubters wrong", "Help community"],
            "conflicts": ["Social pressure", "Limited resources", "Self-doubt"]
        })
        
        characters["antagonist"].update({
            "name": "Community Skeptics",
            "description": "Collective group of neighborhood adults who dismiss Seun's inventions",
            "traits": ["Traditional", "Skeptical", "Pragmatic"],
            "goals": ["Maintain status quo"],
            "motivation": "Fear of change and unconventional ideas"
        })
        
        characters["supporting"] = [
            {
                "name": "Mama Adebayo",
                "role": "Mother",
                "description": "Supportive but worried about her son's obsession with inventing",
                "traits": ["Loving", "Protective", "Hard-working"]
            },
            {
                "name": "Mr. Okafor",
                "role": "Science Teacher",
                "description": "Recognizes Seun's potential and provides guidance",
                "traits": ["Encouraging", "Knowledgeable", "Mentor"]
            }
        ]
    else:
        # Generate generic characters based on genre and concept
        characters = generate_generic_characters(concept, genre, archetype_options)
    
    return characters

def generate_generic_characters(concept: str, genre: str, archetypes: dict) -> dict:
    """Generate characters based on genre archetypes and concept."""
    # Implementation for other types of stories
    return {
        "protagonist": {
            "name": "Main Character",
            "role": "Protagonist",
            "description": "Generic protagonist based on genre",
            "traits": ["Determined", "Relatable"],
            "goals": ["Achieve goal"],
            "conflicts": ["Main conflict"]
        },
        "antagonist": {
            "name": "Opposing Force",
            "role": "Antagonist",
            "description": "Generic antagonist based on genre",
            "traits": ["Opposing"],
            "goals": ["Stop protagonist"],
            "motivation": "Generic motivation"
        },
        "supporting": []
    }
