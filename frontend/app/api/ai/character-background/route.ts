import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_ENDPOINT = process.env.OPENAI_API_ENDPOINT

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set")
}

async function generateBackground(character: any, config: any) {
  const prompt = `Create a detailed and compelling background story for a character with the following details:
Name: ${character.name}
${character.role ? `Role: ${character.role}\n` : ''}
${character.description ? `Description: ${character.description}\n` : ''}
${character.personality ? `Personality: ${character.personality}\n` : ''}
${character.goals ? `Goals: ${character.goals}\n` : ''}

Focus on creating a rich backstory that explains:
1. Key life events that shaped the character
2. Important relationships and influences
3. Motivations behind their current goals
4. Past experiences that inform their personality
5. Significant achievements or failures

Make it emotionally resonant and consistent with their established traits.`

  const response = await fetch(`${OPENAI_API_ENDPOINT}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  })

  if (!response.ok) {
    throw new Error("OpenAI API call failed")
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { character, config } = body

    if (!character || !character.name) {
      return NextResponse.json(
        { error: "Character name is required" },
        { status: 400 }
      )
    }

    const background = await generateBackground(character, config)
    return NextResponse.json({ background })
  } catch (error: any) {
    console.error("Error in POST /api/ai/character-background:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate character background" },
      { status: 500 }
    )
  }
}