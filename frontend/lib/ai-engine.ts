interface AIEngineConfig {
  maxTokens?: number
  temperature?: number
  model?: string
}

interface ScriptGeneration {
  prompt: string
  context?: string
  genre?: string
  style?: string
  constraints?: string[]
}

interface ScriptAnalysis {
  content: string
  aspectsToAnalyze?: Array<'plot' | 'character' | 'dialogue' | 'pacing' | 'structure'>
}

interface ScriptSuggestion {
  content: string
  targetAspect: string
  context?: string
}

interface CharacterBackground {
  name: string
  role?: string
  description?: string
  personality?: string
  goals?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export class AIScriptEngine {
  private config: AIEngineConfig

  constructor(config: AIEngineConfig = {}) {
    this.config = {
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7,
      model: config.model || 'llama2'
    }
  }

  async generateScript({ prompt, context, genre, style, constraints = [] }: ScriptGeneration) {
    try {
      const response = await fetch(`${BACKEND_URL}/ai/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context,
          genre,
          style,
          constraints,
          config: this.config,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate script')
      }

      return await response.json()
    } catch (error) {
      console.error('Error in generateScript:', error)
      throw error
    }
  }

  async analyzeScript({ content, aspectsToAnalyze }: ScriptAnalysis) {
    try {
      const response = await fetch(`${BACKEND_URL}/ai/analyze-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          aspectsToAnalyze,
          config: this.config,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze script')
      }

      return await response.json()
    } catch (error) {
      console.error('Error in analyzeScript:', error)
      throw error
    }
  }

  async generateCharacterBackground(character: CharacterBackground) {
    try {
      const response = await fetch(`${BACKEND_URL}/ai/generate-background`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      })

      if (!response.ok) {
        throw new Error('Failed to generate character background')
      }

      return await response.json()
    } catch (error) {
      console.error('Error in generateCharacterBackground:', error)
      throw error
    }
  }

  async getSuggestions({ content, targetAspect, context }: ScriptSuggestion) {
    try {
      const response = await fetch(`${BACKEND_URL}/ai/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetAspect,
          context,
          config: this.config,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      return await response.json()
    } catch (error) {
      console.error('Error in getSuggestions:', error)
      throw error
    }
  }

  async generateCharacterDialogue(character: string, context: string, prompt: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/ai/dialogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          context,
          prompt,
          config: this.config,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate dialogue')
      }

      return await response.json()
    } catch (error) {
      console.error('Error in generateCharacterDialogue:', error)
      throw error
    }
  }
}