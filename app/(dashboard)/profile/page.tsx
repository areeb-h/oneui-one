import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Key, Mail, Shield, User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>You need to sign in to access this page</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={session.user} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Your Profile
          </h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-medium">
                      {session.user?.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.user?.name || "User"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.user?.email || "No email provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Information
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex p-6">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </h4>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {session.user?.name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex p-6">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Address
                    </h4>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {session.user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex p-6">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </h4>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white break-all">
                      {session.user?.id || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex p-6">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Authentication Provider
                    </h4>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      Zitadel
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
