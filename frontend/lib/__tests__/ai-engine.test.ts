import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AIScriptEngine } from '../ai-engine'

describe('AIScriptEngine', () => {
  let engine: AIScriptEngine

  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
    engine = new AIScriptEngine()
  })

  it('generates initial script', async () => {
    const mockResponse = { content: 'Generated script content' }
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await engine.generateScript('Test script')
    expect(result).toEqual(mockResponse)
  })

  it('handles API errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'))
    await expect(engine.generateScript('Test script')).rejects.toThrow('API Error')
  })

  it('retries with fallback provider on failure', async () => {
    const mockFetch = vi.fn()
      // First call with primary provider fails
      .mockRejectedValueOnce(new Error('Primary provider failed'))
      // Second call with fallback provider succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Fallback content' })
      })

    global.fetch = mockFetch

    const result = await engine.generateScript('Test script', { provider: 'auto' })

    expect(result).toEqual({ content: 'Fallback content' })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})