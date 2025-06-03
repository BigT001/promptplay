from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from .agent import (
    generate_script,
    generate_script_async,
    analyze_prompt,
    ScriptRequest,
    ScriptResponse
)

__all__ = [
    'generate_script',
    'generate_script_async',
    'analyze_prompt',
    'ScriptRequest',
    'ScriptResponse'
]
