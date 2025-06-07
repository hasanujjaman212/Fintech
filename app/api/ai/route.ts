import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = "general" } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key is not configured" }, { status: 500 })
    }

    const { text } = await generateText({
      model: groq("llama3-70b-8192", {
        apiKey: process.env.GROQ_API_KEY,
      }),
      prompt: prompt,
    })

    // For structured responses, attempt to parse JSON
    if (type === "json") {
      try {
        const jsonData = JSON.parse(text)
        return NextResponse.json({ text, data: jsonData })
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        return NextResponse.json({ text, data: null })
      }
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
