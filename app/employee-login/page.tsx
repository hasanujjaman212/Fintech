"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function EmployeeLogin() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "employee",
          id: employeeId,
          password: password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("employeeId", data.user.id)
        localStorage.setItem("employeeName", data.user.name)
        localStorage.setItem("canAccessUptodate", data.user.canAccessUptodate.toString())

        // Store additional employee data for AI context
        const employeeData = JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobileNumber: data.user.mobileNumber,
          role: data.user.role,
          department: data.user.department,
        })
        localStorage.setItem("employeeData", employeeData)

        router.push("/employee-dashboard")
      } else {
        setError(data.message || "Invalid employee ID or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              FS
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">FintechSolutions</span>
              <span className="text-xs text-gray-500">Partner of IIFL Capital Services Ltd</span>
            </div>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-gray-200 shadow-lg backdrop-blur-sm bg-white/80">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Employee Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your employee credentials to access the dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="employeeId"
                        placeholder="Enter your employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Login</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Need help? Contact system administrator for assistance.
          </p>
        </div>
      </main>
    </div>
  )
}
