import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const insights = await sql<
      {
        id: number
        title: string
        description: string
        impact: string
        value: number
        trend: string
        category: string
      }[]
    >`
      SELECT id, title, description, impact, value, trend, category
      FROM financial_insights
      ORDER BY created_at DESC
    `

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Error fetching financial insights:", error)
    return NextResponse.json({ error: "Failed to fetch financial insights" }, { status: 500 })
  }
}
