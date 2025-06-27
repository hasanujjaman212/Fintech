"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  FileText,
  Home,
  MessageSquare,
  User,
  X,
  Users,
  CheckCircle,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  canAccessUptodate: boolean
  handleUptodateClick: () => void
  isOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  isAdmin?: boolean
  isManager?: boolean
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    adminOnly: false,
    managerOnly: false,
  },
  {
    id: "performance",
    label: "Performance",
    icon: BarChart3,
    adminOnly: false,
    managerOnly: false,
  },
  {
    id: "manager-dashboard",
    label: "Manager Dashboard",
    icon: UserCheck,
    adminOnly: false,
    managerOnly: true,
  },
  {
    id: "account-management",
    label: "Account Management",
    icon: Users,
    adminOnly: true,
    managerOnly: false,
  },
  {
    id: "completed-clients",
    label: "Completed Clients",
    icon: CheckCircle,
    adminOnly: true,
    managerOnly: false,
  },
  {
    id: "uptodate",
    label: "Up-to-date",
    icon: FileText,
    adminOnly: false,
    managerOnly: false,
    requiresAuth: true,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: MessageSquare,
    adminOnly: false,
    managerOnly: false,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    adminOnly: false,
    managerOnly: false,
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
  isManager = false,
}: SidebarProps) {
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
    if (item.managerOnly && !isManager) return false
    return true
  })

  const getUserType = () => {
    if (isAdmin) return "Admin Portal"
    if (isManager) return "Manager Portal"
    return "Employee Portal"
  }

  const getUserBadge = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Shield className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-800">Administrator</span>
        </div>
      )
    }
    if (isManager) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
          <UserCheck className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Manager</span>
        </div>
      )
    }
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{getUserType()}</h2>
                <p className="text-xs text-gray-500">IIFL Capital Services</p>
              </div>
            </div>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* User Badge */}
          {(isAdmin || isManager) && <div className="mx-4 mt-4 mb-2">{getUserBadge()}</div>}

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
                      "w-full justify-start gap-3 h-10",
                      isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      item.adminOnly && "border-l-2 border-red-200",
                      item.managerOnly && "border-l-2 border-purple-200",
                    )}
                    onClick={() => !isDisabled && handleNavClick(item.id, item.requiresAuth)}
                    disabled={isDisabled}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.adminOnly && <Shield className="h-3 w-3 ml-auto text-red-500" />}
                    {item.managerOnly && <UserCheck className="h-3 w-3 ml-auto text-purple-500" />}
                  </Button>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="text-xs text-gray-500 text-center">
              <p>Powered by AI</p>
              <p className="mt-1">Partner of IIFL Capital Services Ltd</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
