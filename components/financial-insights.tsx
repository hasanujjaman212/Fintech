"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Clock, BarChart, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FinancialInsight {
  id: number
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  value: number
  trend: "up" | "down" | "stable"
  category: string
}

export default function FinancialInsights() {
  const [insights, setInsights] = useState<FinancialInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/financial-insights")
      if (!response.ok) {
        throw new Error("Failed to fetch insights")
      }
      const data = await response.json()
      setInsights(data)
      generateAiSummary(data)
    } catch (error) {
      console.error("Failed to load financial insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAiSummary = async (data: FinancialInsight[]) => {
    setAiLoading(true)
    try {
      const prompt = `
        You are an AI financial analyst for FintechSolutions.
        
        Based on the following financial insights, provide a concise summary of the overall financial situation:
        ${JSON.stringify(data)}
        
        Your summary should:
        1. Highlight the most important trends
        2. Identify potential opportunities or concerns
        3. Provide a brief outlook for the near future
        
        Keep your response under 150 words and focus on actionable insights.
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI summary")
      }

      const aiData = await response.json()
      setAiSummary(aiData.text)
    } catch (error) {
      console.error("Error generating AI summary:", error)
      setAiSummary("Unable to generate AI summary at this time.")
    } finally {
      setAiLoading(false)
    }
  }

  const refreshInsights = async () => {
    setLoading(true)
    setAiLoading(true)
    await fetchInsights()
  }

  const getTrendIcon = (trend: string, impact: string) => {
    if (trend === "up") {
      return impact === "positive" ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingUp className="h-4 w-4 text-red-600" />
      )
    } else if (trend === "down") {
      return impact === "positive" ? (
        <TrendingDown className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-600" />
      )
    } else {
      return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "revenue":
        return <DollarSign className="h-5 w-5 text-blue-600" />
      case "clients":
        return <Users className="h-5 w-5 text-purple-600" />
      case "efficiency":
        return <Clock className="h-5 w-5 text-green-600" />
      default:
        return <BarChart className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI-Generated Financial Insights
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshInsights}
          disabled={loading || aiLoading}
          className="flex items-center gap-1"
        >
          {loading || aiLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          <span>Refresh</span>
        </Button>
      </div>

      {aiSummary && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-700">Generating AI summary...</p>
              </div>
            ) : (
              <p className="text-sm text-blue-700">{aiSummary}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className="backdrop-blur-sm bg-white/90 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              {getCategoryIcon(insight.category)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insight.value}
                {insight.trend !== "stable" && "%"}
              </div>
              <div className="flex items-center pt-1">
                {getTrendIcon(insight.trend, insight.impact)}
                <p
                  className={`text-xs ml-1 ${
                    insight.impact === "positive"
                      ? "text-green-600"
                      : insight.impact === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {insight.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
