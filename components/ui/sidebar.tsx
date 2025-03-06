"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Context for sidebar state management
type SidebarContextType = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  isHovering: boolean
  setIsHovering: (hovering: boolean) => void
  shouldExpand: boolean
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  // State management
  const [mounted, setMounted] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [isHovering, setIsHovering] = React.useState(false)

  // Derived state
  const shouldExpand = React.useMemo(() => collapsed && isHovering, [collapsed, isHovering])

  // Update localStorage when collapsed state changes
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", String(collapsed))
    }
  }, [collapsed, mounted])

  // Load initial state from localStorage
  React.useEffect(() => {
    setMounted(true)
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === "true")
    }
  }, [])

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev)
    setIsHovering(false)
  }, [])

  const value = React.useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      isHovering,
      setIsHovering,
      shouldExpand,
    }),
    [collapsed, toggleCollapsed, isHovering, shouldExpand],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

// Animation variants - slower and smoother transitions
const sidebarVariants = {
  expanded: {
    width: 260,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      duration: 0.3,
    },
  },
  collapsed: {
    width: 64,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      duration: 0.3,
    },
  },
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  variant?: "default" | "floating"
}

export function Sidebar({ className, variant = "default", children, ...props }: SidebarProps) {
  const { collapsed, shouldExpand, setIsHovering } = useSidebar()

  // Handle mouse enter/leave with longer delay to prevent flickering
  const handleMouseEnter = React.useCallback(() => {
    if (collapsed) {
      const timer = setTimeout(() => setIsHovering(true), 300)
      return () => clearTimeout(timer)
    }
  }, [collapsed, setIsHovering])

  const handleMouseLeave = React.useCallback(() => {
    if (collapsed) {
      const timer = setTimeout(() => setIsHovering(false), 600)
      return () => clearTimeout(timer)
    }
  }, [collapsed, setIsHovering])

  return (
    <motion.aside
      initial={false}
      variants={sidebarVariants}
      animate={shouldExpand ? "expanded" : collapsed ? "collapsed" : "expanded"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex h-screen flex-col border-r bg-background",
        variant === "floating" && "m-2 rounded-xl shadow-lg border h-[calc(100vh-16px)]",
        className,
      )}
      {...props}
    >
      {children}

      {/* Floating Toggle Button */}
      <SidebarToggle />
    </motion.aside>
  )
}

// Sidebar toggle button
function SidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebar()

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute -right-3 top-4 z-50",
        "h-6 w-6",
        "rounded-full border",
        "bg-background shadow-md",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-transform duration-300",
      )}
      onClick={toggleCollapsed}
    >
      {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
    </Button>
  )
}

// Sidebar header component
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function SidebarHeader({ className, children, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("flex h-[3.27rem] items-center border-b px-4", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar content component
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar footer component
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function SidebarFooter({ className, children, ...props }: SidebarFooterProps) {
  return (
    <div className={cn("border-t p-4", className)} {...props}>
      {children}
    </div>
  )
}

// Sidebar section component
interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  children?: React.ReactNode
}

export function SidebarSection({ className, title, children, ...props }: SidebarSectionProps) {
  const { collapsed, shouldExpand } = useSidebar()

  return (
    <div className={cn("py-2", className)} {...props}>
      {title && (!collapsed || shouldExpand) && (
        <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">{title}</h3>
      )}
      <div className="space-y-1 px-3">{children}</div>
    </div>
  )
}

// Export all components
export { SidebarContext }

