"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, PieChart, MessageSquare, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard-header"
import Sidebar from "@/components/sidebar"
import PerformanceTable from "@/components/performance-table"
import TotalPerformanceTable from "@/components/total-performance-table"
import TwoFactorAuth from "@/components/two-factor-auth"
import EmployeeReport from "@/components/employee-report"
import FinancialInsights from "@/components/financial-insights"
import AIDocumentAnalyzer from "@/components/ai-document-analyzer"
import AIClientInsights from "@/components/ai-client-insights"
import AIMarketTrends from "@/components/ai-market-trends"
import AccountManagement from "@/components/account-management"
import CompletedClients from "@/components/completed-clients"
import ManagerDashboard from "@/components/manager-dashboard"

export default function EmployeeDashboard() {
  const [employeeName, setEmployeeName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [canAccessUptodate, setCanAccessUptodate] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [accountType, setAccountType] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    // In a real app, this would check the session/cookie
    const storedEmployeeId = localStorage.getItem("employeeId")
    const storedEmployeeName = localStorage.getItem("employeeName")
    const storedCanAccessUptodate = localStorage.getItem("canAccessUptodate") === "true"
    const storedAccountType = localStorage.getItem("accountType") || ""

    if (!storedEmployeeId || !storedEmployeeName) {
      router.push("/employee-login")
      return
    }

    setEmployeeId(storedEmployeeId)
    setEmployeeName(storedEmployeeName)
    setCanAccessUptodate(storedCanAccessUptodate)
    setAccountType(storedAccountType)

    // Check user type
    if (storedEmployeeId === "admin1" || storedAccountType === "admin") {
      setIsAdmin(true)
    } else if (storedAccountType === "manager") {
      setIsManager(true)
    }

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [router])

  function handleLogout() {
    // In a real app, this would clear the session/cookie
    localStorage.removeItem("employeeId")
    localStorage.removeItem("employeeName")
    localStorage.removeItem("canAccessUptodate")
    localStorage.removeItem("employeeData")
    localStorage.removeItem("accountType")
    router.push("/")
  }

  function handleUptodateClick() {
    setShowTwoFactor(true)
  }

  function handleTwoFactorSuccess() {
    setShowTwoFactor(false)
    setAuthenticated(true)
    setActiveTab("uptodate")
  }

  function handleTwoFactorCancel() {
    setShowTwoFactor(false)
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  if (!employeeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader
        employeeName={employeeName}
        onLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canAccessUptodate={canAccessUptodate}
          handleUptodateClick={handleUptodateClick}
          isOpen={sidebarOpen}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          isAdmin={isAdmin}
          isManager={isManager}
        />

        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "ml-64" : "ml-0"
          }`}
        >
          {showTwoFactor && (
            <TwoFactorAuth
              employeeId={employeeId}
              onSuccess={handleTwoFactorSuccess}
              onCancel={handleTwoFactorCancel}
            />
          )}

          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="apple-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isAdmin ? "Admin Dashboard" : isManager ? "Manager Dashboard" : "AI-Powered Dashboard"}
                  </h1>
                </div>
                <p className="text-gray-600">
                  Welcome, {employeeName}.{" "}
                  {isAdmin
                    ? "Manage the entire system and monitor all activities."
                    : isManager
                      ? "Monitor and oversee all pending and in-progress client interactions."
                      : "Here's your AI-enhanced financial dashboard with insights and analytics."}
                </p>
              </div>

              <FinancialInsights />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIMarketTrends />
                <AIClientInsights />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="apple-card p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    AI-Generated Recommendations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Review client portfolio allocations</p>
                        <p className="text-xs text-gray-500">AI detected potential optimization opportunities</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <PieChart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Interest rate change impact analysis</p>
                        <p className="text-xs text-gray-500">AI predicts significant impact on current loans</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Client communication opportunity</p>
                        <p className="text-xs text-gray-500">
                          AI suggests reaching out to clients affected by market changes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <AIDocumentAnalyzer />
              </div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <PerformanceTable />
              <TotalPerformanceTable />
            </motion.div>
          )}

          {activeTab === "report" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <EmployeeReport />
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <AccountManagement />
            </motion.div>
          )}

          {activeTab === "clients" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <CompletedClients />
            </motion.div>
          )}

          {activeTab === "manager" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <ManagerDashboard />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
