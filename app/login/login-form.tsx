"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("zitadel", { callbackUrl })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Sign in to your account</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Access all your organization's applications in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-8">
        <Button onClick={handleLogin} className="w-full flex items-center justify-center h-11" disabled={isLoading}>
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Sign in with Zitadel"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">OR</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <span className="text-blue-600 dark:text-blue-400">Contact your administrator</span>
        </p>
      </CardContent>
    </Card>
  )
}

