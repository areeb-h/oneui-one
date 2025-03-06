"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      name: "Applications",
      href: "/apps",
      active: pathname === "/apps" || pathname.startsWith("/apps/"),
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                    item.active
                      ? "border-blue-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer flex w-full items-center"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer flex w-full items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="cursor-pointer flex w-full items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                  item.active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {user && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
