import { type NextRequest } from "next/server"

const AI_ENDPOINT = process.env.AI_ENDPOINT || "https://api.openai.com/v1"
const AI_API_KEY = process.env.AI_API_KEY

if (!AI_API_KEY) {
  throw new Error("AI_API_KEY is not set")
}

async function callAI(prompt: string, config: any) {
  const response = await fetch(`${AI_ENDPOINT}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  })

  if (!response.ok) {
    throw new Error("AI API call failed")
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  try {
    const { action } = params
    const body = await request.json()
    const { config, ...data } = body

    let prompt = ""
    let result

    switch (action) {
      case "generate":
        const { prompt: userPrompt, context, genre, style, constraints } = data
        prompt = `Generate a screenplay with the following requirements:
          ${userPrompt}
          ${context ? `\nContext: ${context}` : ""}
          ${genre ? `\nGenre: ${genre}` : ""}
          ${style ? `\nStyle: ${style}` : ""}
          ${constraints?.length ? `\nConstraints:\n${constraints.join("\n")}` : ""}`
        result = await callAI(prompt, config)
        break

      case "analyze":
        const { content, aspectsToAnalyze } = data
        prompt = `Analyze this screenplay:
          ${content}
          ${aspectsToAnalyze ? `\nFocus on these aspects: ${aspectsToAnalyze.join(", ")}` : ""}`
        result = await callAI(prompt, config)
        break

      case "suggest":
        const { content: scriptContent, targetAspect, context: suggestionContext } = data
        prompt = `Suggest improvements for this screenplay:
          ${scriptContent}
          Target aspect: ${targetAspect}
          ${suggestionContext ? `\nContext: ${suggestionContext}` : ""}`
        result = await callAI(prompt, config)
        break

      case "sentiment":
        const { content: sentimentContent, targetSentiment } = data
        prompt = `Modify this text to express a ${targetSentiment} sentiment while maintaining its core meaning:
          ${sentimentContent}`
        result = await callAI(prompt, config)
        break

      case "dialogue":
        const { character, context: characterContext, prompt: dialoguePrompt } = data
        prompt = `Generate dialogue for the character "${character}":
          Context: ${characterContext}
          Prompt: ${dialoguePrompt}`
        result = await callAI(prompt, config)
        break

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(`Error in AI ${params.action} endpoint:`, error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}