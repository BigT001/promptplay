# PromptPlay 🎬

A collaborative script writing and video generation system that leverages AI agents and Blender to create animated content from text prompts.

## 🌟 Features

### Script Writing System
- **Plot Architect**: Designs story arcs, themes, and plot structures
- **Character Designer**: Creates multi-dimensional characters with detailed profiles
- **Scene Builder**: Crafts visual and spatial layouts for scenes
- **Dialogue Writer**: Generates authentic character dialogue
- **Continuity Checker**: Ensures logical flow and timeline coherence

### Video Generation System
- Automatic conversion of scripts to Blender animations
- Voice generation using ElevenLabs API
- 3D asset management with BlenderKit integration
- Basic animatic and storyboard generation
- Camera and lighting setup automation

## 🛠️ Technology Stack

- **Backend**: 
  - FastAPI server
  - Python 3.13+
  - Blender Python API
  - ElevenLabs TTS Integration
  - FFmpeg for video processing

- **Frontend**:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Modern UI components

## 📦 Project Structure

```
├── frontend/                  # Next.js frontend application 
│   ├── app/                  # App router and API routes
│   ├── components/           # React components
│   └── styles/              # CSS and styling
├── script_writing_agent/     # Python backend for script generation
│   ├── tools/               # Specialized agent tools
│   ├── agent.py            # Main agent implementation
│   ├── server.py           # FastAPI server
│   └── video_tools.py      # Blender integration
└── docfiles/                # Documentation
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/promptplay.git
cd promptplay
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Install and configure Blender**
- Ensure Blender is installed and accessible from PATH
- Test the Blender setup:
```bash
python test_blender.py
```

4. **Set up environment variables**
Create a `.env` file with:
```
ELEVENLABS_API_KEY=your_key_here
BLENDERKIT_API_KEY=your_key_here
```

5. **Start the backend server**
```bash
python -m script_writing_agent.server
```

6. **Install and run the frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🎯 Usage

1. Enter your creative prompt in the main interface
2. The system will generate a complete script using collaborative AI agents
3. Review and adjust the generated script
4. Initiate video generation to create an animated version
5. Export the final video or continue refining

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Blender Foundation for the amazing 3D creation suite
- ElevenLabs for text-to-speech capabilities
- The open-source community for various tools and libraries used in this project
