import { Suspense } from "react"
import LoginForm from "./login-form"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/2 mx-auto"></div>
      <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="flex items-center justify-center my-4">
        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        <div className="px-2 bg-white dark:bg-gray-800">
          <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
    </div>
  )
}

