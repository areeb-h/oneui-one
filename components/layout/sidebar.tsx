"use client";

import * as React from "react";
import { debounce } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ChevronRight,
  LogOut,
  Zap,
  ChevronLeft,
  SidebarIcon,
} from "lucide-react";
import { navigation, utilityItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  session: any; // Replace with proper session type
}

export function Sidebar({ session }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

  const shouldExpand = isCollapsed && isHovering;

  // Filter navigation based on search
  const filteredNavigation = React.useMemo(() => {
    if (!searchQuery) return navigation;

    return navigation
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.children?.some((child) =>
              child.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const isPathActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsHovering(false);
  };

  const variants = {
    expanded: {
      width: 280,
      transition: {
        type: "tween",
        duration: 0.2,
      },
    },
    collapsed: {
      width: 70,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        variants={variants}
        animate={
          shouldExpand ? "expanded" : isCollapsed ? "collapsed" : "expanded"
        }
        // animate={{
        //   width: shouldExpand ? 280 : isCollapsed ? 70 : 280,
        // }}
        // transition={{
        //   duration: 0.2,
        //   type: "tween", // Use tween interpolation for smoother animation
        // }}
        onMouseEnter={() => setTimeout(() => setIsHovering(true), 0)}
        onMouseLeave={() => setTimeout(() => setIsHovering(false), 700)}
        className="relative flex h-screen flex-col border-r bg-background"
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          <div
            className={cn(
              "flex items-center",
              // Remove justify-center when expanded or hovered
              isCollapsed && !shouldExpand && "justify-center w-full"
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            {(!isCollapsed || shouldExpand) && (
              <span className="ml-2 font-semibold">OneUI</span>
            )}
          </div>
        </div>
        {/* Floating Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute -right-4 top-3 z-50",
            "h-8 w-8",
            "rounded-xl border",
            "bg-background shadow-md",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-transform duration-200",
            "z-50"
          )}
          onClick={toggleCollapse}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarIcon className="h-4 w-4" />
          </motion.div>
        </Button>
        {/* Search */}
        <div className="p-4">
          {!isCollapsed || shouldExpand ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full"
                  onClick={() => setIsCollapsed(false)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Search</TooltipContent>
            </Tooltip>
          )}
        </div>
        {/* Navigation */}
        <ScrollArea className="flex-1">
          <AnimatePresence initial={false}>
            {filteredNavigation.map((group) => (
              <div key={group.title} className="px-4 py-2">
                {(!isCollapsed || shouldExpand) && (
                  <h3 className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = isPathActive(item.path);
                    return (
                      <React.Fragment key={item.path}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            isCollapsed && !shouldExpand && "justify-center"
                          )}
                          onClick={() => {
                            if (item.children) {
                              setActiveGroup(
                                activeGroup === item.path ? null : item.path
                              );
                            } else {
                              router.push(item.path);
                            }
                          }}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              (!isCollapsed || shouldExpand) && "mr-2"
                            )}
                          />
                          {(!isCollapsed || shouldExpand) && (
                            <>
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge
                                  variant={item.badge.variant}
                                  className="ml-auto"
                                >
                                  {item.badge.text}
                                </Badge>
                              )}
                              {item.children && (
                                <ChevronRight
                                  className={cn(
                                    "ml-auto h-4 w-4 transition-transform",
                                    activeGroup === item.path && "rotate-90"
                                  )}
                                />
                              )}
                            </>
                          )}
                        </Button>
                        {(!isCollapsed || shouldExpand) &&
                          item.children &&
                          activeGroup === item.path && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 mt-1 space-y-1">
                                {item.children.map((child) => (
                                  <Button
                                    key={child.path}
                                    variant={
                                      isPathActive(child.path)
                                        ? "secondary"
                                        : "ghost"
                                    }
                                    className="w-full justify-start"
                                    onClick={() => router.push(child.path)}
                                  >
                                    {child.label}
                                  </Button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </AnimatePresence>
        </ScrollArea>
        {/* User Profile */}
        <div className="mt-auto border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && !shouldExpand && "justify-center"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {(!isCollapsed || shouldExpand) && (
                  <span className="ml-2"> {session?.user?.name || "N/A"}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {utilityItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="ml-auto">
                      {item.badge.text}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Collapse/Expand Toggle */}
        {/* {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md z-50"
            onClick={toggleCollapse}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        )} */}
      </motion.aside>
    </TooltipProvider>
  );
}
