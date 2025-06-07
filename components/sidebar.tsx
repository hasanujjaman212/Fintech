"use client"

import { Button } from "@/components/ui/button"
import {
  BarChart,
  Calendar,
  ChevronLeft,
  Lock,
  MessageSquare,
  PieChart,
  Settings,
  User,
  X,
  FileText,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  canAccessUptodate: boolean
  handleUptodateClick: () => void
  isOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  canAccessUptodate,
  handleUptodateClick,
  isOpen,
  isMobile,
  toggleSidebar,
}: SidebarProps) {
  const sidebarItems = [
    {
      name: "AI Dashboard",
      icon: <Sparkles className="h-5 w-5" />,
      value: "dashboard",
    },
    {
      name: "Performance",
      icon: <BarChart className="h-5 w-5" />,
      value: "performance",
    },
    {
      name: "Uptodate",
      icon: <Calendar className="h-5 w-5" />,
      value: "uptodate",
      onClick: handleUptodateClick,
      disabled: !canAccessUptodate,
    },
    {
      name: "AI Assistant",
      icon: <MessageSquare className="h-5 w-5" />,
      value: "ai-assistant",
      highlight: true,
    },
    {
      name: "Analytics",
      icon: <PieChart className="h-5 w-5" />,
      value: "analytics",
    },
    {
      name: "Document Analysis",
      icon: <FileText className="h-5 w-5" />,
      value: "documents",
      highlight: true,
    },
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      value: "profile",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      value: "settings",
    },
  ]

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
        isMobile ? "transform translate-x-0" : "",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          AI Navigation
        </h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg py-2.5 px-3",
                activeTab === item.value && "bg-gray-100 text-gray-900 font-medium",
                item.disabled && "opacity-50 cursor-not-allowed",
                item.highlight && "border-l-2 border-blue-500",
              )}
              onClick={() => {
                if (item.onClick) {
                  item.onClick()
                } else if (!item.disabled) {
                  setActiveTab(item.value)
                  if (isMobile) {
                    toggleSidebar()
                  }
                }
              }}
              disabled={item.disabled}
            >
              <div className="flex items-center">
                <span className={cn("mr-3", item.highlight && "text-blue-600")}>{item.icon}</span>
                <span>{item.name}</span>
                {item.value === "uptodate" && !canAccessUptodate && <Lock className="h-3.5 w-3.5 ml-2 text-gray-400" />}
                {item.highlight && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">AI</span>
                )}
              </div>
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-medium text-blue-800">AI-Powered Platform</p>
          </div>
          <p className="text-xs text-gray-600">
            All features are enhanced with artificial intelligence for better insights and productivity.
          </p>
        </div>
      </div>
    </div>
  )
}
