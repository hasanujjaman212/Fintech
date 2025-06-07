"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, X } from "lucide-react"

interface TwoFactorAuthProps {
  employeeId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function TwoFactorAuth({ employeeId, onSuccess, onCancel }: TwoFactorAuthProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const enteredCode = code.join("")

    if (enteredCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real app, this would validate the code with a server
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code "123456" is valid
      if (enteredCode === "123456") {
        onSuccess()
      } else {
        setError("Invalid verification code. Please try again.")
        setCode(["", "", "", "", "", ""])
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus()
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>
            Enter the 6-digit verification code to access sensitive information. For demo, use code: 123456
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                <Lock className="h-6 w-6" />
              </div>

              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
