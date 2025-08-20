"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, FileText, Home, MessageSquare, User, X, Users, CheckCircle, Shield, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  canAccessUptodate: boolean
  handleUptodateClick: () => void
  isOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  isAdmin?: boolean
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    adminOnly: false,
  },
  {
    id: "performance",
    label: "Performance",
    icon: BarChart3,
    adminOnly: false,
  },
  {
    id: "account-management",
    label: "Account Management",
    icon: Users,
    adminOnly: true,
  },
  {
    id: "completed-clients",
    label: "Completed Clients",
    icon: CheckCircle,
    adminOnly: true,
  },
  {
    id: "uptodate",
    label: "Up-to-date",
    icon: FileText,
    adminOnly: false,
    requiresAuth: true,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: MessageSquare,
    adminOnly: false,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    adminOnly: false,
  },
]

export default function Sidebar({
  activeTab,
  setActiveTab,
  canAccessUptodate,
  handleUptodateClick,
  isOpen,
  isMobile,
  toggleSidebar,
  isAdmin = false,
}: SidebarProps) {
  const tradingViewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TradingView widget
    if (tradingViewRef.current && isOpen) {
      // Clear existing content
      tradingViewRef.current.innerHTML = ""

      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
      script.async = true
      script.innerHTML = JSON.stringify({
        symbol: "NSE-NIFTY",
        width: "100%",
        height: "220",
        locale: "en",
        dateRange: "12M",
        colorTheme: "light",
        trendLineColor: "rgba(41, 98, 255, 1)",
        underLineColor: "rgba(41, 98, 255, 0.3)",
        underLineBottomColor: "rgba(41, 98, 255, 0)",
        isTransparent: false,
        autosize: false,
        largeChartUrl: "",
      })

      tradingViewRef.current.appendChild(script)
    }
  }, [isOpen])

  const handleNavClick = (itemId: string, requiresAuth?: boolean) => {
    if (itemId === "uptodate" && requiresAuth) {
      handleUptodateClick()
    } else {
      setActiveTab(itemId)
    }

    if (isMobile) {
      toggleSidebar()
    }
  }

  const filteredItems = navigationItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    return true
  })

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform professional-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{isAdmin ? "Admin Portal" : "Employee Portal"}</h2>
                <p className="text-xs text-gray-500">IIFL Capital Services</p>
              </div>
            </div>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Admin Badge */}
          {isAdmin && (
            <div className="mx-4 mt-4 mb-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Administrator</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4">
            <nav className="space-y-2 py-4">
              {filteredItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                const isDisabled = item.requiresAuth && !canAccessUptodate && item.id === "uptodate"

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10 transition-all duration-200",
                      isActive && "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
                      !isActive && "hover:bg-gray-100",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      item.adminOnly && "border-l-2 border-red-200",
                    )}
                    onClick={() => !isDisabled && handleNavClick(item.id, item.requiresAuth)}
                    disabled={isDisabled}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.adminOnly && <Shield className="h-3 w-3 ml-auto text-red-500" />}
                  </Button>
                )
              })}
            </nav>

            {/* Market Widget */}
            <div className="mt-6 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 px-2">Market Overview</h3>
              <div className="tradingview-widget">
                <div ref={tradingViewRef} className="w-full h-full"></div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              <p>Financial Technology Platform</p>
              <p className="mt-1">Partner of IIFL Capital Services Ltd</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
