"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { put } from "@vercel/blob"

export default function AIDocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setFileUrl(null)
      setAnalysis(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploadStatus("uploading")
    setLoading(true)
    setError(null)

    try {
      // Upload file to Vercel Blob
      const blob = await put(`documents/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      })

      setFileUrl(blob.url)
      setUploadStatus("success")

      // Analyze the document with AI
      await analyzeDocument(blob.url, file.name)
    } catch (err) {
      console.error("Error uploading or analyzing document:", err)
      setError("Failed to upload or analyze the document. Please try again.")
      setUploadStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const analyzeDocument = async (url: string, filename: string) => {
    try {
      // For PDF or complex documents, you would typically extract text first
      // For this demo, we'll simulate document analysis with the filename
      const prompt = `
        You are an AI financial document analyzer for FintechSolutions.
        Analyze the following document: ${filename}
        
        The document is available at: ${url}
        
        Provide a comprehensive analysis including:
        1. Document type identification
        2. Key financial information extracted
        3. Potential risks or issues identified
        4. Recommendations based on the document content
        
        Note: Since this is a simulation, provide a realistic analysis based on what you might expect to find in a document with this filename.
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze document")
      }

      const data = await response.json()
      setAnalysis(data.text)
    } catch (err) {
      console.error("Error analyzing document:", err)
      setError("Failed to analyze the document. Please try again.")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          AI Document Analyzer
        </CardTitle>
        <CardDescription>Upload financial documents for AI-powered analysis and insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          />
          <label htmlFor="document-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">{file ? file.name : "Click to upload a document"}</p>
            <p className="text-xs text-gray-500">Supports PDF, Word, Excel, CSV, and text files</p>
          </label>
        </div>

        {file && (
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={loading || !file} className="flex items-center gap-2">
              {uploadStatus === "uploading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : uploadStatus === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploadStatus === "uploading"
                ? "Uploading..."
                : uploadStatus === "success"
                  ? "Uploaded"
                  : "Upload & Analyze"}
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Analyzing document...</p>
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-blue-800 mb-2">AI Analysis Results</h3>
            <div className="text-sm text-blue-700 whitespace-pre-wrap">{analysis}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Powered by AI for accurate document analysis and insights
      </CardFooter>
    </Card>
  )
}
