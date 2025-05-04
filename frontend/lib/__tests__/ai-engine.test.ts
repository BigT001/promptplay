import { AIScriptEngine } from '../ai-engine'
import fetchMock from 'jest-fetch-mock'

// Mock fetch globally
fetchMock.enableMocks()

describe('AIScriptEngine', () => {
  let engine: AIScriptEngine

  beforeEach(() => {
    fetchMock.resetMocks()
    engine = new AIScriptEngine()
  })

  describe('generateScript', () => {
    it('should generate a script based on prompt and context', async () => {
      const mockResponse = { result: 'Generated script content' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await engine.generateScript({
        prompt: 'Write a scene',
        context: 'A crime thriller',
        genre: 'Thriller',
        style: 'Noir',
        constraints: ['PG-13', 'Single location']
      })

      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })

      const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
      expect(requestBody).toMatchObject({
        prompt: 'Write a scene',
        context: 'A crime thriller',
        genre: 'Thriller',
        style: 'Noir',
        constraints: ['PG-13', 'Single location']
      })
    })

    it('should handle API errors gracefully', async () => {
      fetchMock.mockRejectOnce(new Error('API Error'))

      await expect(
        engine.generateScript({
          prompt: 'Write a scene'
        })
      ).rejects.toThrow('API Error')
    })
  })

  describe('analyzeScript', () => {
    it('should analyze script content', async () => {
      const mockResponse = { result: 'Analysis results' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await engine.analyzeScript({
        content: 'Script content to analyze',
        aspectsToAnalyze: ['plot', 'character', 'dialogue']
      })

      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    })
  })

  describe('getSuggestions', () => {
    it('should get improvement suggestions', async () => {
      const mockResponse = { result: 'Improvement suggestions' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await engine.getSuggestions({
        content: 'Script content',
        targetAspect: 'dialogue',
        context: 'Make it more natural'
      })

      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    })
  })

  describe('improveSentiment', () => {
    it('should modify text sentiment', async () => {
      const mockResponse = { result: 'Modified content' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await engine.improveSentiment(
        'Original content',
        'positive'
      )

      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/ai/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    })
  })

  describe('generateCharacterDialogue', () => {
    it('should generate character-specific dialogue', async () => {
      const mockResponse = { result: 'Generated dialogue' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await engine.generateCharacterDialogue(
        'Detective Smith',
        'Interrogation scene',
        'Question the suspect'
      )

      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/ai/dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    })
  })

  describe('Configuration', () => {
    it('should use custom configuration when provided', () => {
      const customConfig = {
        maxTokens: 1000,
        temperature: 0.5,
        model: 'gpt-3.5-turbo'
      }
      
      const customEngine = new AIScriptEngine(customConfig)
      fetchMock.mockResponseOnce(JSON.stringify({ result: 'test' }))

      return customEngine.generateScript({ prompt: 'test' }).then(() => {
        const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
        expect(requestBody.config).toMatchObject(customConfig)
      })
    })
  })
})