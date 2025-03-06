"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AppDownPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        className="max-w-md w-full space-y-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AlertCircle className="h-8 w-8 text-red-600" />
          </motion.div>
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight",
              "bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
            )}
          >
            Application Unavailable
          </h1>
          <p className="text-muted-foreground">
            The requested application is currently experiencing technical
            difficulties.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-4">
            Our team has been notified and is working to resolve this issue.
            Please try again later or contact support for assistance.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/apps">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Apps Dashboard
              </Link>
            </Button>
            <Button asChild>
              <a href="mailto:support@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
