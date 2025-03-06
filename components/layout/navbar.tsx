"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { CommandDialog } from "cmdk";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Settings,
  Command,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1] || "Dashboard";
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

export function Header() {
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-40 border-b",
        "flex-1 w-full",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="flex h-[3.45rem] /items-center px-8">
        {title && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>OneUI</span>
            <ChevronRight className="h-4 w-4" />
            <span>{title}</span>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="outline"
            className="relative h-8 w-full justify-start text-sm md:w-40 md:flex"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Type a command or search..."
              />
            </div>
          </CommandDialog>

          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white">
              2
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
