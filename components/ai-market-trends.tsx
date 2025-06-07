"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, TrendingDown, RefreshCw, Calendar } from "lucide-react"

// Mock historical market data
const mockMarketData = {
  stockMarket: {
    lastQuarter: {
      growth: 2.3,
      volatility: "medium",
      topSectors: ["Technology", "Healthcare", "Energy"],
    },
    lastYear: {
      growth: 8.7,
      volatility: "high",
      majorEvents: ["Interest rate changes", "Global supply chain disruptions"],
    },
  },
  interestRates: {
    current: 4.5,
    trend: "stable",
    projections: "likely to decrease slightly",
  },
  economicIndicators: {
    gdpGrowth: 2.1,
    inflation: 3.2,
    unemployment: 4.8,
  },
}

export default function AIMarketTrends() {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString())

  useEffect(() => {
    generatePrediction()
  }, [])

  const generatePrediction = async () => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `
        You are an AI market analyst for FintechSolutions.
        Based on the following historical market data, predict likely trends for the next quarter:
        ${JSON.stringify(mockMarketData)}
        
        Provide a concise analysis focusing on key indicators and potential market movements.
        Keep your response under 200 words.
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate market prediction")
      }

      const data = await response.json()
      setPrediction(data.text)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      console.error("Error generating market prediction:", err)
      setError("Failed to generate market prediction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              AI Market Trends
            </CardTitle>
            <CardDescription>AI-powered market analysis and predictions</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePrediction}
            disabled={loading}
            className="flex items-center gap-1"
          >
            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            AI-Generated
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Updated: {lastUpdated}</span>
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Analyzing market data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : prediction ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <h3 className="text-md font-medium text-blue-800">AI Market Prediction</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{prediction}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Stock Market</h4>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">
                  Last quarter growth: {mockMarketData.stockMarket.lastQuarter.growth}%
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Interest Rates</h4>
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">
                  Current: {mockMarketData.interestRates.current}% ({mockMarketData.interestRates.trend})
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Inflation</h4>
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-xs text-gray-600">Current: {mockMarketData.economicIndicators.inflation}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No market prediction available. Click refresh to generate a prediction.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
