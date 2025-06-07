"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ChevronDown,
  Globe,
  LineChart,
  Lock,
  MessageSquare,
  Play,
  Shield,
  Sparkles,
  Users,
  Zap,
  User,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle2,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [demoMessage, setDemoMessage] = useState("")
  const [demoResponse, setDemoResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const features = [
    {
      title: "AI-Powered Financial Insights",
      description:
        "Our advanced AI algorithms analyze market trends and client data to provide actionable financial insights in real-time.",
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Secure Client Management",
      description:
        "Manage client relationships with enterprise-grade security and compliance features built into every interaction.",
      icon: <Shield className="h-6 w-6 text-green-600" />,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Automated Document Processing",
      description:
        "Save hours with AI-powered document analysis that extracts key information and generates summaries automatically.",
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Performance Analytics",
      description:
        "Track employee and business performance with comprehensive analytics dashboards and AI-generated recommendations.",
      icon: <LineChart className="h-6 w-6 text-orange-600" />,
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const testimonials = [
    {
      author: "Jane Doe",
      position: "CEO, ABC Investments",
      quote:
        "FintechSolutions has revolutionized the way we manage client portfolios. The AI-powered insights are invaluable.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      author: "John Smith",
      position: "Senior Financial Advisor",
      quote:
        "The automated document processing has saved us countless hours. We can now focus on building stronger client relationships.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      author: "Emily White",
      position: "Head of Wealth Management",
      quote:
        "Our clients love the personalized insights and recommendations they receive. FintechSolutions has truly set us apart from the competition.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoMessage.trim() || isGenerating) return

    setIsGenerating(true)
    setDemoResponse("")

    try {
      const prompt = `
        You are an AI financial assistant for FintechSolutions, a financial technology company.
        Provide a helpful, professional response to the following question about finance or investing:
        
        Question: ${demoMessage}
        
        Keep your response concise (under 150 words) and focused on providing valuable financial insights.
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
      setDemoResponse(data.text)
    } catch (error) {
      console.error("Error generating response:", error)
      setDemoResponse("I'm sorry, I encountered an error. Please try again later.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !message.trim()) return

    try {
      // In a real app, this would send the form data to a server
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate AI response to the inquiry
      const prompt = `
        You are a helpful AI assistant for FintechSolutions, a financial technology company.
        Generate a personalized response to the following customer inquiry:
        
        Email: ${email}
        Message: ${message}
        
        Keep your response professional, helpful, and under 100 words. Thank them for their interest
        and provide next steps.
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
      setAiResponse(data.text)
      setSubmitted(true)
      setEmail("")
      setMessage("")
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                  FS
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">FintechSolutions</span>
                  <span className="text-xs text-gray-500">Partner of IIFL Capital Services Ltd</span>
                </div>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                <button
                  onClick={() => scrollTo(featuresRef)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollTo(demoRef)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollTo(contactRef)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/employee-login">
                <Button variant="outline">Employee Login</Button>
              </Link>
              <Link href="/client-login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Client Login
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200"
            >
              <div className="px-4 py-2 space-y-1">
                <button
                  onClick={() => scrollTo(featuresRef)}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollTo(demoRef)}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollTo(contactRef)}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Contact
                </button>
                <div className="pt-2 space-y-2">
                  <Link href="/employee-login" className="block">
                    <Button variant="outline" className="w-full">
                      Employee Login
                    </Button>
                  </Link>
                  <Link href="/client-login" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Client Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
      >
        <motion.div style={{ opacity, scale }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 py-1 px-3">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>AI-Powered Financial Platform</span>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Transform Your Financial Services with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                AI-Powered
              </span>{" "}
              Insights
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              FintechSolutions combines cutting-edge AI technology with financial expertise to deliver powerful
              insights, automate workflows, and enhance client relationships.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg" onClick={() => scrollTo(demoRef)}>
                Try AI Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg" onClick={() => scrollTo(featuresRef)}>
                Explore Features <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 relative"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=600&width=1200"
                      alt="FintechSolutions Dashboard"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30"
                      >
                        <Play className="h-6 w-6 mr-2" /> Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-8"
            >
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Client Logo 1"
                  className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Client Logo 2"
                  className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Client Logo 3"
                  className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Client Logo 4"
                  className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[80%] bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[60%] bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</p>
              <p className="text-gray-600">Financial Institutions</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">$2.5B</p>
              <p className="text-gray-600">Assets Managed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10,000+</p>
              <p className="text-gray-600">Financial Advisors</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">99.9%</p>
              <p className="text-gray-600">Uptime Reliability</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 py-1 px-3">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>AI-Powered Features</span>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Financial Services with Advanced AI
            </h2>
            <p className="text-xl text-gray-600">
              Our platform combines cutting-edge artificial intelligence with deep financial expertise to deliver
              powerful tools for modern financial professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeFeature === index ? "bg-white shadow-lg border border-gray-100" : "hover:bg-white/50"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${activeFeature === index ? "bg-blue-50" : "bg-gray-100"}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="p-2">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={features[activeFeature].image || "/placeholder.svg"}
                        alt={features[activeFeature].title}
                        className="w-full rounded-lg"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
            </motion.div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="p-3 bg-blue-50 rounded-lg w-fit mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-600 mb-6">
                Bank-level encryption, multi-factor authentication, and continuous security monitoring protect your
                sensitive financial data.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">SOC 2 Type II Compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">GDPR & CCPA Compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">256-bit AES Encryption</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="p-3 bg-green-50 rounded-lg w-fit mb-6">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Integrations</h3>
              <p className="text-gray-600 mb-6">
                Connect with your existing tools and systems through our extensive API and pre-built integrations with
                popular financial platforms.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">CRM Integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Banking APIs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Market Data Providers</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="p-3 bg-purple-50 rounded-lg w-fit mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Support Team</h3>
              <p className="text-gray-600 mb-6">
                Our team of financial and technical experts is available to help you get the most out of our platform
                and solve any challenges.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">24/7 Technical Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Dedicated Account Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Implementation Assistance</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 py-1 px-3">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Interactive Demo</span>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience Our AI Financial Assistant</h2>
            <p className="text-xl text-gray-600">
              Ask our AI assistant any financial question and get instant, accurate responses powered by our advanced
              language models.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">AI Financial Assistant</h3>
                </div>
              </div>

              <div className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm max-w-[80%]">
                      <p className="text-gray-800">
                        Hello! I'm your AI financial assistant. Ask me any question about investments, financial
                        planning, market trends, or financial concepts.
                      </p>
                    </div>
                  </div>

                  {demoMessage && (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-blue-600 p-4 rounded-xl shadow-sm max-w-[80%]">
                        <p className="text-white">{demoMessage}</p>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex space-x-2">
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

                  {demoResponse && (
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm max-w-[80%]">
                        <p className="text-gray-800">{demoResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleDemoSubmit} className="flex gap-2">
                  <Input
                    placeholder="Ask a financial question..."
                    value={demoMessage}
                    onChange={(e) => setDemoMessage(e.target.value)}
                    className="flex-1"
                    disabled={isGenerating}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!demoMessage.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Try asking: "What is dollar-cost averaging?" or "How do I build an emergency fund?"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
                <p className="text-gray-600">
                  Our AI understands context and nuance, allowing for natural, flowing conversations about complex
                  financial topics.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="p-3 bg-green-50 rounded-lg w-fit mb-4">
                  <LineChart className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  Get insights backed by real financial data and market trends, not just generic advice.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="p-3 bg-purple-50 rounded-lg w-fit mb-4">
                  <Lock className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
                <p className="text-gray-600">
                  All conversations are encrypted and our AI is trained to provide compliant financial information.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose FintechSolutions?</h2>
            <p className="text-xl text-gray-600">
              See how our AI-powered platform compares to traditional financial software.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">Features</th>
                    <th className="px-6 py-4 text-center text-blue-600 font-semibold">FintechSolutions</th>
                    <th className="px-6 py-4 text-center text-gray-600 font-semibold">Traditional Software</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-900">AI-Powered Insights</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">
                      <X className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Natural Language Interface</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">
                      <X className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Automated Document Analysis</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">
                      <X className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Predictive Analytics</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      <div className="flex items-center justify-center">
                        <div className="h-1 w-5 bg-gray-400 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Real-time Market Data</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Compliance Automation</td>
                    <td className="px-6 py-4 text-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">
                      <X className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 py-1 px-3">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span>Contact Us</span>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch with Our Team</h2>
            <p className="text-xl text-gray-600">
              Have questions about our platform? Our team is ready to help you find the right solution for your
              financial business.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Email Us</p>
                      <p className="text-gray-600">info@fintechsolutions.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Call Us</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Visit Us</p>
                      <p className="text-gray-600">
                        123 Financial District
                        <br />
                        New York, NY 10004
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-medium text-gray-900 mb-4">Follow Us</p>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {!submitted ? (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Send Message
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                  <div className="text-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                      <h4 className="font-medium text-blue-800">AI-Generated Response</h4>
                    </div>
                    <p className="text-blue-700">{aiResponse}</p>
                  </div>

                  <Button onClick={() => setSubmitted(false)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Another Message
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Financial Services?</h2>
                <p className="text-blue-100 mb-8">
                  Join thousands of financial professionals who are leveraging our AI-powered platform to deliver better
                  results for their clients.
                </p>
                <div className="space-y-4">
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="w-full text-white border-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="FintechSolutions Dashboard"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  FS
                </div>
                <span className="text-xl font-bold">FintechSolutions</span>
              </div>
              <p className="text-gray-400 mb-4">AI-powered financial technology for modern financial professionals.</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FintechSolutions. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
