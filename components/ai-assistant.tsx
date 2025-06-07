"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Send, User, Paperclip, Mic, XCircle } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistant({ employeeId }: { employeeId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI financial assistant. I can help you with financial analysis, client information, and more. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const employeeData = localStorage.getItem("employeeData")
      const employeeContext = employeeData ? `Employee context: ${employeeData}` : ""

      const prompt = `
        You are an AI assistant for FintechSolutions, a financial technology company. 
        You help employees with financial analysis, client information, and internal processes.
        
        ${employeeContext}
        
        Current conversation:
        ${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}
        
        User: ${input}
        
        Provide a helpful, professional response. Focus on financial insights and actionable advice.
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="apple-card p-4 rounded-2xl mb-4 flex items-center">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg mr-3">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">AI Financial Assistant</h2>
          <p className="text-sm text-gray-600">Powered by Groq LLM</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} mb-4`}>
              <div
                className={`flex max-w-[80%] ${
                  message.role === "assistant" ? "bg-gray-100" : "bg-blue-600 text-white"
                } rounded-2xl px-4 py-3`}
              >
                <div className="mr-2 mt-0.5">
                  {message.role === "assistant" ? (
                    <Bot className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex max-w-[80%] bg-gray-100 rounded-2xl px-4 py-3">
                <div className="mr-2 mt-0.5">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 flex-shrink-0"
              disabled={isLoading}
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about finance..."
                className="pr-10 py-6 rounded-full border-gray-200"
                disabled={isLoading}
              />
              {input && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setInput("")}
                >
                  <XCircle className="h-5 w-5 text-gray-400" />
                </Button>
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 flex-shrink-0"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0 bg-blue-600 hover:bg-blue-700"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
