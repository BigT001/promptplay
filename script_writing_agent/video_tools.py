import os
import json
import tempfile
import subprocess
from typing import Dict, Any
import elevenlabs

def generate_audio(text: str, voice_name: str = "Bella") -> bytes:
    """Generate audio using ElevenLabs API"""
    # Set the API key
    elevenlabs.set_api_key(os.getenv("ELEVENLABS_API_KEY"))
    
    try:
        # Get all available voices
        available_voices = elevenlabs.voices()
        
        # Find the requested voice or use the first available one
        voice = next((v for v in available_voices if v.name.lower() == voice_name.lower()), available_voices[0])
        
        # Generate the audio
        audio = elevenlabs.generate(
            text=text,
            voice=voice.name,
            model="eleven_multilingual_v2"
        )
        
        return audio
        
    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        return None

def video_generator(script: dict, scene_metadata: dict, character_info: dict) -> dict:
    """Generates a video animation from script and scene data using Blender.
    
    Args:
        script (dict): Final script with scenes and dialogue
        scene_metadata (dict): Camera angles, timing, mood, actions
        character_info (dict): Character descriptions and properties
        
    Returns:
        dict: Paths to generated files and status information
    """
    # Create a temporary directory for our files
    temp_dir = tempfile.mkdtemp()
    
    # Generate audio for each dialogue line
    audio_files = {}
    for scene in script.get('scenes', []):
        for dialogue in scene.get('dialogue', []):
            character = dialogue.get('character')
            text = dialogue.get('text')
            if character and text:
                try:
                    audio = generate_audio(text, character_info.get('voices', {}).get(character, 'Bella'))
                    if audio:
                        audio_file = os.path.join(temp_dir, f"{character}_{len(audio_files)}.mp3")
                        elevenlabs.save(audio, audio_file)
                        audio_files[f"{character}_{dialogue.get('id')}"] = audio_file
                except Exception as e:
                    print(f"Failed to generate audio for {character}: {str(e)}")
    
    # Add audio files to input data
    input_data = {
        'script': script,
        'scene_metadata': scene_metadata,
        'character_info': character_info,
        'audio_files': audio_files
    }
    
    temp_file = os.path.join(temp_dir, 'scene_data.json')
    with open(temp_file, 'w') as f:
        json.dump(input_data, f)
    
    # Get path to blender_script.py
    blender_script = os.path.abspath(os.path.join(os.path.dirname(__file__), 'blender_script.py'))
    
    # Run Blender in background mode with our script
    blender_cmd = 'blender --background --python "{}" -- "{}"'.format(blender_script, temp_file)
    
    try:
        # Execute Blender
        process = subprocess.run(
            blender_cmd, 
            shell=True, 
            check=True,
            capture_output=True,
            text=True
        )
        
        # Check for result file
        result_file = temp_file + '.result'
        if os.path.exists(result_file):
            with open(result_file, 'r') as f:
                result = json.load(f)
        else:
            result = {
                "status": "error",
                "error_message": "No result file generated",
                "blender_output": process.stdout
            }
            
    except subprocess.CalledProcessError as e:
        result = {
            "status": "error",
            "error_message": str(e),
            "blender_output": e.stdout
        }
    except Exception as e:
        result = {
            "status": "error",
            "error_message": str(e)
        }
    
    return result
