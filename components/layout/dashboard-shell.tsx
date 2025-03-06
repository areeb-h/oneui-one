"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  session: any;
}

export function DashboardShell({ children, session }: DashboardShellProps) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar pathname={pathname} session={session} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header session={session} />
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4 md:p-8 mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
