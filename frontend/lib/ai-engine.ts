interface AIEngineConfig {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  provider?: 'ollama' | 'gemini' | 'auto';
  timeout?: number;
}

interface AIRequest {
  prompt: string;
  provider?: string;
  context?: string;
  genre?: string;
  style?: string;
  constraints?: string[];
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

interface RequestStatus {
  isLoading: boolean
  error: Error | null
  progress?: number
}

interface AIResponse {
  content?: string
  error?: string
  analysis?: string
  background?: string
  suggestions?: string[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
const DEFAULT_TIMEOUT = 30000 // 30 seconds

export class AIScriptEngine {
  private config: AIEngineConfig
  private requestStatus: RequestStatus = {
    isLoading: false,
    error: null
  }

  constructor(config: AIEngineConfig = {}) {
    this.config = {
      maxTokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      provider: config.provider || 'auto'
    }
  }

  get status(): RequestStatus {
    return { ...this.requestStatus }
  }

  private updateStatus(status: Partial<RequestStatus>) {
    this.requestStatus = { ...this.requestStatus, ...status }
  }

  private async makeRequest(endpoint: string, data: any, retryWithFallback = true): Promise<AIResponse> {
    this.updateStatus({ isLoading: true, error: null })

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      // Get the authentication token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...data,
          provider: this.config.provider
        }),
        signal: controller.signal,
        credentials: 'include'  // Include cookies for auth
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 401) {
          // Handle authentication error
          window.location.href = '/auth';  // Redirect to auth page
          throw new Error('Authentication required')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed ${endpoint} request: ${response.status}`)
      }

      const result = await response.json()
      this.updateStatus({ isLoading: false })
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.config.timeout}ms`)
        }

        // If using auto provider and first attempt failed, retry with fallback
        if (retryWithFallback && this.config.provider === 'auto') {
          this.config.provider = 'gemini'
          return this.makeRequest(endpoint, data, false)
        }

        this.updateStatus({ error, isLoading: false })
        throw error
      }
      throw error
    }
  }

  async generateScript({ prompt, context, genre, style, constraints = [] }: ScriptGeneration) {
    try {
      const request: AIRequest = {
        prompt,
        context,
        genre,
        style,
        constraints,
        provider: this.config.provider
      }
      
      return await this.makeRequest('/ai/generate-script', request)
    } catch (error) {
      console.error('Error in generateScript:', error)
      throw error
    }
  }

  async analyzeScript({ content, aspectsToAnalyze }: ScriptAnalysis) {
    try {
      return await this.makeRequest('/ai/analyze-script', {
        content,
        aspectsToAnalyze
      })
    } catch (error) {
      console.error('Error in analyzeScript:', error)
      throw error
    }
  }

  async generateCharacterBackground(character: CharacterBackground) {
    try {
      return await this.makeRequest('/ai/generate-background', character)
    } catch (error) {
      console.error('Error in generateCharacterBackground:', error)
      throw error
    }
  }

  async getSuggestions({ content, targetAspect, context }: ScriptSuggestion) {
    try {
      return await this.makeRequest('/ai/suggest', {
        content,
        targetAspect,
        context
      })
    } catch (error) {
      console.error('Error in getSuggestions:', error)
      throw error
    }
  }

  async generateCharacterDialogue(character: string, context: string, prompt: string) {
    try {
      return await this.makeRequest('/ai/dialogue', {
        character,
        context,
        prompt
      })
    } catch (error) {
      console.error('Error in generateCharacterDialogue:', error)
      throw error
    }
  }

  // Helper method to reset the engine state
  reset() {
    this.updateStatus({ isLoading: false, error: null, progress: undefined })
    this.config.provider = this.config.provider || 'auto'
  }
}