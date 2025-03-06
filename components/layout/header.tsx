"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "cmdk"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { Search, Sun, Moon, Bell, Settings, HelpCircle, User, LogOut, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

// Common commands for the command palette
const commands = [
  {
    heading: "Navigation",
    items: [
      { name: "Dashboard", icon: "home", href: "/dashboard" },
      { name: "Applications", icon: "grid", href: "/dashboard/apps" },
      { name: "Analytics", icon: "bar-chart", href: "/dashboard/analytics/overview" },
      { name: "Inbox", icon: "inbox", href: "/dashboard/inbox" },
      { name: "Projects", icon: "layers", href: "/dashboard/projects" },
      { name: "Documents", icon: "file-text", href: "/dashboard/documents" },
      { name: "Calendar", icon: "calendar", href: "/dashboard/calendar" },
      { name: "Messages", icon: "message-square", href: "/dashboard/messages" },
      { name: "Settings", icon: "settings", href: "/dashboard/settings" },
    ],
  },
  {
    heading: "Actions",
    items: [
      {
        name: "Toggle Theme",
        icon: "sun",
        action: (setTheme: (theme: string) => void) => {
          setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
        },
      },
    ],
  },
]

// Get breadcrumb path
function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  if (pathname === "/dashboard") return [{ label: "Dashboard", path: "/dashboard" }]

  const segments = pathname.split("/").filter(Boolean)
  let currentPath = ""

  return segments.map((segment, index) => {
    currentPath += `/${segment}`
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath,
    }
  })
}

interface HeaderProps {
  session: any
}

export function Header({ session }: HeaderProps) {
  const { setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const pathname = usePathname()
  const router = useRouter()
  const breadcrumbs = getBreadcrumbs(pathname)
  const [notifications, setNotifications] = React.useState(3)

  // Command palette keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Filter commands based on search
  const filteredCommands = React.useMemo(() => {
    if (!search) return commands

    return commands
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
      }))
      .filter((group) => group.items.length > 0)
  }, [search])

  // Dynamic icon component
  const DynamicIcon = ({ name }: { name: string }) => {
    const icons: Record<string, React.ReactNode> = {
      home: <span className="i-lucide-layout-dashboard h-4 w-4" />,
      "bar-chart": <span className="i-lucide-bar-chart-3 h-4 w-4" />,
      inbox: <span className="i-lucide-inbox h-4 w-4" />,
      layers: <span className="i-lucide-layers h-4 w-4" />,
      "file-text": <span className="i-lucide-file-text h-4 w-4" />,
      calendar: <span className="i-lucide-calendar h-4 w-4" />,
      "message-square": <span className="i-lucide-message-square h-4 w-4" />,
      settings: <span className="i-lucide-settings h-4 w-4" />,
      sun: <span className="i-lucide-sun h-4 w-4" />,
      grid: <span className="i-lucide-grid-3x3 h-4 w-4" />,
    }
    return icons[name] || <span className="i-lucide-circle h-4 w-4" />
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto max-w-full">
        <div className="flex h-[3.2rem] items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span className="text-muted-foreground mx-1">/</span>}
                  <Button
                    variant="link"
                    className={cn(
                      "h-auto p-0",
                      index === breadcrumbs.length - 1
                        ? "font-medium text-foreground cursor-default pointer-events-none"
                        : "text-muted-foreground",
                    )}
                    onClick={() => router.push(crumb.path)}
                  >
                    {crumb.label}
                  </Button>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="relative h-9 w-9 rounded-full md:w-64 md:rounded-md md:justify-start text-sm"
              onClick={() => setOpen(true)}
            >
              <Search className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline-flex">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                  placeholder="Type a command or search..."
                  className="h-11 flex-1 bg-transparent outline-none"
                  value={search}
                  onValueChange={setSearch}
                />
              </div>
              <div className="sr-only" id="command-dialog-title">
                Command Menu
              </div>
              <CommandList aria-labelledby="command-dialog-title">
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredCommands.map((group) => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.name}
                        onSelect={() => {
                          if ("href" in item) {
                            router.push(item.href)
                            setOpen(false)
                            setSearch("")
                          } else if ("action" in item) {
                            item.action(setTheme)
                            setOpen(false)
                            setSearch("")
                          }
                        }}
                      >
                        <DynamicIcon name={item.icon} />
                        <span className="ml-2">{item.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </CommandDialog>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                  {notifications}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <HelpCircle className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Settings className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/billing")}>
                  <CreditCard className="mr-2 h-4 w-4" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

