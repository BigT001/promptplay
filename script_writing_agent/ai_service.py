"""AI service module for script generation using Google's Gemini model."""
import os
from typing import Dict, Any, Optional, List
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class AIService:
    def __init__(self):
        """Initialize the AI service with Gemini model configuration."""
        # Configure the Gemini model
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))        # Get available models and log them
        models = genai.list_models()
        for m in models:
            logger.info(f"Available model: {m.name}")
            
        # Initialize the model using environment variable
        model_name = os.getenv('MODEL', 'gemini-2.0-flash')  # Default to gemini-2.0-flash if not specified
        
        # Find the exact model name from available models
        model_found = False
        for m in models:
            if model_name in m.name:
                model_name = m.name
                model_found = True
                break
                
        if not model_found:
            logger.warning(f"Model {model_name} not found, falling back to gemini-2.0-flash")
            model_name = "models/gemini-2.0-flash"
            
        logger.info(f"Using model: {model_name}")
        self.model = genai.GenerativeModel(model_name)
        
        # Configuration for the model
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "candidate_count": 1,
        }
        
    async def generate_response(self, prompt: str, 
                              context: Optional[Dict[str, Any]] = None) -> Dict:
        """Generate AI response for any component of the script.
        
        Args:
            prompt (str): The prompt to send to the AI model
            context (Dict, optional): Additional context for the AI
            
        Returns:
            Dict: AI-generated response
        """
        try:
            logger.info(f"Generating AI response for prompt: {prompt[:100]}...")
            
            # Construct the full prompt with context
            full_prompt = prompt
            if context and context.get("request_type"):  # Only add context prefix for script requests
                full_prompt = f"Context: {context}\n\nPrompt: {prompt}"
            logger.info(f"Sending prompt to Gemini model ({self.model.model_name})")
            
            # Generate response with minimal safety settings
            response = await self.model.generate_content_async(
                full_prompt,
                generation_config=self.generation_config
            )
            
            # Parse and structure the response
            if not response or not hasattr(response, 'text'):
                raise Exception("Invalid response from AI model")
                
            response_text = response.text
            if not response_text:
                raise Exception("Empty response from AI model")
            
            logger.info(f"Raw model response: {response_text[:200]}...")
                
            # If no specific request type, return the raw response
            if not context or not context.get("request_type"):
                return {
                    "status": "success",
                    "content": response_text,
                    "metadata": {
                        "prompt": prompt,
                        "context": context,
                        "model": "gemini-2.0-flash"
                    }
                }
                
            # For script requests, convert the response text into structured format
            structured_response = self._structure_ai_response(response_text, context)
            logger.info(f"Generated structured response: {structured_response}")
            
            return {
                "status": "success",
                "content": structured_response,
                "metadata": {
                    "prompt": prompt,
                    "context": context,
                    "model": "gemini-2.0-flash"
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
        
    async def _generate_mock_response(self, prompt: str, context: Optional[Dict[str, Any]]) -> Dict:
        """Generate a mock response for development and testing.
        This will be replaced with actual AI model integration."""
        
        request_type = context.get("request_type", "") if context else ""
        
        mock_content = {
            "plot_creation": {
                "structure": "three_act",
                "acts": {
                    "setup": "Initial situation and character introduction",
                    "confrontation": "Main conflict development",
                    "resolution": "Conflict resolution and conclusion"
                },
                "themes": ["Growth", "Change"],
                "tone": "Dynamic"
            },
            "character_creation": {
                "main_characters": [
                    {
                        "name": "Character 1",
                        "role": "Protagonist",
                        "description": "Main character description"
                    }
                ],
                "supporting_characters": []
            },
            "scene_creation": {
                "scenes": [
                    {
                        "id": "scene_1",
                        "setting": "Initial location",
                        "description": "Scene description"
                    }
                ]
            },
            "dialogue_generation": {
                "exchanges": [
                    {
                        "character": "Character 1",
                        "line": "Example dialogue"
                    }
                ]
            }
        }.get(request_type, {})
        
        return {
            "status": "success",
            "content": mock_content,
            "metadata": {
                "prompt": prompt,
                "context": context
            }
        }
    
    def _structure_ai_response(self, response_text: str, context: Optional[Dict[str, Any]]) -> Dict:
        """Structure the AI response based on the request type.
        
        Args:
            response_text (str): Raw response from the AI model
            context (Dict, optional): Context of the request
            
        Returns:
            Dict: Structured response
        """
        request_type = context.get("request_type", "") if context else ""
        
        try:
            # For plot creation
            if request_type == "plot_creation":
                return {
                    "structure": "dynamic",  # Let AI determine the structure
                    "acts": self._extract_acts_from_text(response_text),
                    "themes": self._extract_themes_from_text(response_text),
                    "tone": self._extract_tone_from_text(response_text)
                }
            
            # For character creation
            elif request_type == "character_creation":
                return {
                    "main_characters": self._extract_characters_from_text(response_text, is_main=True),
                    "supporting_characters": self._extract_characters_from_text(response_text, is_main=False)
                }
            
            # For scene creation
            elif request_type == "scene_creation":
                return {
                    "scenes": self._extract_scenes_from_text(response_text)
                }
            
            # For dialogue generation
            elif request_type == "dialogue_generation":
                return {
                    "exchanges": self._extract_dialogue_from_text(response_text)
                }
            
            # For any other type, return the raw text in a basic structure
            else:
                return {
                    "raw_response": response_text,
                    "structured": False
                }
                
        except Exception as e:
            logger.error(f"Error structuring AI response: {str(e)}")
            return {
                "error": str(e),
                "raw_response": response_text
            }
    
    def _extract_acts_from_text(self, text: str) -> Dict[str, str]:
        """Extract acts from AI response text."""
        # For now, basic text splitting - this can be enhanced with more sophisticated parsing
        acts = {}
        current_act = None
        
        for line in text.split('\n'):
            if "ACT" in line.upper():
                current_act = line.lower().replace("act", "").strip()
                acts[current_act] = ""
            elif current_act and line.strip():
                acts[current_act] += line.strip() + " "
        
        return acts or {"setup": text}  # Default if no acts found
    
    def _extract_themes_from_text(self, text: str) -> List[str]:
        """Extract themes from AI response text."""
        # Look for theme-related keywords and extract following content
        themes = []
        text = text.lower()
        
        theme_indicators = ["theme:", "themes:", "thematic elements:", "key themes:"]
        for indicator in theme_indicators:
            if indicator in text:
                theme_section = text.split(indicator)[1].split('\n')[0]
                themes.extend([t.strip() for t in theme_section.split(',') if t.strip()])
        
        return themes or ["No explicit themes identified"]
    
    def _extract_tone_from_text(self, text: str) -> str:
        """Extract tone from AI response text."""
        # Look for tone-related keywords
        text = text.lower()
        tone_indicators = ["tone:", "mood:", "atmosphere:"]
        
        for indicator in tone_indicators:
            if indicator in text:
                return text.split(indicator)[1].split('\n')[0].strip()
        
        return "Neutral"  # Default tone
    
    def _extract_characters_from_text(self, text: str, is_main: bool = True) -> List[Dict]:
        """Extract character information from AI response text."""
        characters = []
        lines = text.split('\n')
        current_character = None
        
        for line in lines:
            if ':' in line and not current_character:
                name = line.split(':')[0].strip()
                desc = line.split(':')[1].strip()
                current_character = {
                    "name": name,
                    "description": desc,
                    "role": "Protagonist" if is_main else "Supporting"
                }
                characters.append(current_character)
            elif current_character and line.strip():
                current_character["description"] += " " + line.strip()
        
        return characters
    
    def _extract_scenes_from_text(self, text: str) -> List[Dict]:
        """Extract scene information from AI response text."""
        scenes = []
        lines = text.split('\n')
        current_scene = None
        
        for i, line in enumerate(lines):
            if line.strip().upper().startswith("SCENE"):
                if current_scene:
                    scenes.append(current_scene)
                current_scene = {
                    "id": f"scene_{len(scenes) + 1}",
                    "setting": "",
                    "description": ""
                }
            elif current_scene:
                if not current_scene["setting"]:
                    current_scene["setting"] = line.strip()
                else:
                    current_scene["description"] += line.strip() + " "
        
        if current_scene:
            scenes.append(current_scene)
        
        return scenes
    
    def _extract_dialogue_from_text(self, text: str) -> List[Dict]:
        """Extract dialogue exchanges from AI response text."""
        exchanges = []
        lines = text.split('\n')
        
        for line in lines:
            if ':' in line:
                character, dialogue = line.split(':', 1)
                exchanges.append({
                    "character": character.strip(),
                    "line": dialogue.strip()
                })
        
        return exchanges

# Create a singleton instance
ai_service = AIService()
