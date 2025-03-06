"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Zap,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Inbox,
  Layers,
  Calendar,
  MessageSquare,
  Grid3X3,
  Star,
  Clock,
  Building,
  Briefcase,
  Headphones,
  LineChart,
  PieChart,
  Activity,
  Database,
  UserPlus,
  Shield,
  HelpCircle,
  Ticket,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sidebar as UISidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@/components/ui/sidebar"

interface SidebarProps {
  pathname: string
  session: any
}

// Navigation items with sub-items
const navigation = [
  {
    title: "Home",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/dashboard/favorites", label: "Favorites", icon: Star },
      { path: "/dashboard/recent", label: "Recent", icon: Clock },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        path: "/dashboard/apps",
        label: "App Directory",
        icon: Grid3X3,
        children: [
          { path: "/dashboard/apps", label: "All Applications" },
          { path: "/dashboard/apps/favorites", label: "Favorites" },
          { path: "/dashboard/app-registry", label: "App Registry" },
        ],
      },
      {
        path: "/dashboard/erp",
        label: "ERP System",
        icon: Building,
      },
      {
        path: "/dashboard/crm",
        label: "CRM",
        icon: Briefcase,
      },
      {
        path: "/dashboard/hr",
        label: "HR Portal",
        icon: Users,
      },
      {
        path: "/dashboard/helpdesk",
        label: "Help Desk",
        icon: Headphones,
        badge: { text: "3", variant: "default" },
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        path: "/dashboard/projects",
        label: "Projects",
        icon: Layers,
        children: [
          { path: "/dashboard/projects/active", label: "Active Projects" },
          { path: "/dashboard/projects/archived", label: "Archived" },
          { path: "/dashboard/projects/templates", label: "Templates" },
        ],
      },
      {
        path: "/dashboard/documents",
        label: "Documents",
        icon: FileText,
        children: [
          { path: "/dashboard/documents/shared", label: "Shared with me" },
          { path: "/dashboard/documents/recent", label: "Recent" },
          { path: "/dashboard/documents/starred", label: "Starred" },
        ],
      },
      { path: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        path: "/dashboard/inbox",
        label: "Inbox",
        icon: Inbox,
        badge: { text: "5", variant: "default" },
      },
      {
        path: "/dashboard/messages",
        label: "Messages",
        icon: MessageSquare,
        badge: { text: "2", variant: "default" },
      },
      { path: "/dashboard/tickets", label: "Tickets", icon: Ticket },
    ],
  },
  {
    title: "Analytics",
    items: [
      { path: "/dashboard/analytics/overview", label: "Overview", icon: BarChart3 },
      { path: "/dashboard/analytics/reports", label: "Reports", icon: LineChart },
      { path: "/dashboard/analytics/metrics", label: "Key Metrics", icon: PieChart },
      { path: "/dashboard/analytics/activity", label: "User Activity", icon: Activity },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        path: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
        children: [
          { path: "/dashboard/settings/general", label: "General" },
          { path: "/dashboard/settings/appearance", label: "Appearance" },
          { path: "/dashboard/settings/notifications", label: "Notifications" },
        ],
      },
      { path: "/dashboard/app-registry", label: "App Registry", icon: Database },
      { path: "/dashboard/users-management", label: "Users", icon: UserPlus },
      { path: "/dashboard/security", label: "Security", icon: Shield },
      { path: "/dashboard/system", label: "System", icon: Cpu },
    ],
  },
]

export function Sidebar({ pathname, session }: SidebarProps) {
  const router = useRouter()
  const { collapsed, shouldExpand } = useSidebar()
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null)

  // Path active check - memoized for performance
  const isPathActive = React.useCallback(
    (path: string) => pathname === path || pathname?.startsWith(path + "/"),
    [pathname],
  )

  // Initialize active groups based on current path
  React.useEffect(() => {
    navigation.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children && isPathActive(item.path)) {
          setActiveGroup(item.path)
        }
      })
    })
  }, [pathname, isPathActive])

  return (
    <TooltipProvider delayDuration={0}>
      <UISidebar>
        {/* Logo */}
        <SidebarHeader>
          <div className={cn("flex items-center h-full", collapsed && !shouldExpand && "justify-center w-full")}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            {(!collapsed || shouldExpand) && <span className="ml-2 font-semibold text-lg">OneUI</span>}
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className="pt-2">
          <ScrollArea className="h-full px-3">
            <div className="space-y-6 py-2">
              {/* Navigation Groups */}
              {navigation.map((group) => (
                <div key={group.title} className="space-y-1">
                  {(!collapsed || shouldExpand) && (
                    <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">{group.title}</h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = isPathActive(item.path)
                      const hasChildren = item.children && item.children.length > 0
                      const isGroupActive = activeGroup === item.path

                      return (
                        <React.Fragment key={item.path}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full justify-start h-9 px-2",
                                  collapsed && !shouldExpand && "justify-center px-0",
                                )}
                                onClick={() => {
                                  if (hasChildren) {
                                    setActiveGroup(isGroupActive ? null : item.path)
                                  } else {
                                    router.push(item.path)
                                  }
                                }}
                              >
                                <item.icon
                                  className={cn("h-4 w-4 flex-shrink-0", (!collapsed || shouldExpand) && "mr-2")}
                                />
                                {(!collapsed || shouldExpand) && (
                                  <>
                                    <span className="truncate text-sm">{item.label}</span>
                                    {item.badge && (
                                      <Badge variant={item.badge.variant} className="ml-auto text-xs py-0 h-5">
                                        {item.badge.text}
                                      </Badge>
                                    )}
                                    {hasChildren && (
                                      <ChevronRight
                                        className={cn(
                                          "ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200",
                                          isGroupActive && "rotate-90",
                                        )}
                                      />
                                    )}
                                  </>
                                )}
                              </Button>
                            </TooltipTrigger>
                            {collapsed && !shouldExpand && (
                              <TooltipContent side="right" sideOffset={10} className="flex items-center gap-2">
                                {item.label}
                                {item.badge && <Badge variant={item.badge.variant}>{item.badge.text}</Badge>}
                                {hasChildren && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                              </TooltipContent>
                            )}
                          </Tooltip>

                          {/* Submenu items */}
                          {(!collapsed || shouldExpand) && hasChildren && isGroupActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-6 mt-1 space-y-1 border-l pl-2 pt-1">
                                {item.children.map((child) => (
                                  <Button
                                    key={child.path}
                                    variant={isPathActive(child.path) ? "secondary" : "ghost"}
                                    size="sm"
                                    className="w-full justify-start h-8 text-xs"
                                    onClick={() => router.push(child.path)}
                                  >
                                    <span className="truncate">{child.label}</span>
                                  </Button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SidebarContent>

        {/* Help Section in Footer */}
        <SidebarFooter className="p-0">
          <div className="border-t pt-2 pb-3 px-3">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-9 px-2 text-muted-foreground hover:text-foreground",
                collapsed && !shouldExpand && "justify-center",
              )}
              onClick={() => router.push("/dashboard/help")}
            >
              <HelpCircle className={cn("h-4 w-4", (!collapsed || shouldExpand) && "mr-2")} />
              {(!collapsed || shouldExpand) && <span className="text-sm">Help & Support</span>}
            </Button>
          </div>
        </SidebarFooter>
      </UISidebar>
    </TooltipProvider>
  )
}

