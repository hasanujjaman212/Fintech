"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface ClientData {
  id: string
  name: string
  email: string
  financialData: {
    income: number
    expenses: number
    savings: number
    investments: number
    debt: number
    creditScore: number
  }
  riskProfile: string
  goals: string[]
}

interface AIAnalysisResult {
  summary: string
  insights: string[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
  confidenceScore: number
}

// Mock client data
const mockClientData: ClientData = {
  id: "client123",
  name: "Alex Johnson",
  email: "alex@example.com",
  financialData: {
    income: 85000,
    expenses: 55000,
    savings: 15000,
    investments: 50000,
    debt: 120000,
    creditScore: 720,
  },
  riskProfile: "Moderate",
  goals: ["Save for retirement", "Pay off mortgage within 15 years", "Fund children's education"],
}

export default function AIClientInsights() {
  const [clientData, setClientData] = useState<ClientData>(mockClientData)
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateInsights()
  }, [])

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `
        You are an AI financial analyst for FintechSolutions.
        Analyze the following financial data and provide insights:
        ${JSON.stringify(clientData)}
        
        Provide a structured analysis with:
        1. A brief summary
        2. Key insights (3-5 points)
        3. Actionable recommendations (2-3 points)
        4. Risk assessment (low, medium, or high)
        5. Confidence score (0-100)
        
        Format your response as JSON with the following structure:
        {
          "summary": "...",
          "insights": ["...", "...", "..."],
          "recommendations": ["...", "...", "..."],
          "riskLevel": "low|medium|high",
          "confidenceScore": 85
        }
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, type: "json" }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate insights")
      }

      const data = await response.json()

      // If we got parsed JSON data, use it
      if (data.data) {
        setAnalysis(data.data)
      } else {
        // Try to parse the text as JSON
        try {
          const parsedData = JSON.parse(data.text)
          setAnalysis(parsedData)
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError)
          setError("Failed to parse AI response. Please try again.")
        }
      }
    } catch (err) {
      console.error("Error generating insights:", err)
      setError("Failed to generate insights. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>Low Risk</span>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>Medium Risk</span>
          </div>
        )
      case "high":
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>High Risk</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              AI Client Insights
            </CardTitle>
            <CardDescription>AI-powered analysis and recommendations for {clientData.name}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={loading}
            className="flex items-center gap-1"
          >
            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Generating AI insights...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : analysis ? (
          <Tabs defaultValue="summary">
            <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="summary" className="rounded-md data-[state=active]:bg-white">
                Summary
              </TabsTrigger>
              <TabsTrigger value="insights" className="rounded-md data-[state=active]:bg-white">
                Insights
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="rounded-md data-[state=active]:bg-white">
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Financial Summary</h3>
                  {getRiskBadge(analysis.riskLevel)}
                </div>
                <p className="text-gray-700">{analysis.summary}</p>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-700">AI Confidence Score: {analysis.confidenceScore}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Key Insights</h3>
                <ul className="space-y-2">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-gray-700">{insight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Recommendations</h3>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No insights available. Click refresh to generate insights.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
