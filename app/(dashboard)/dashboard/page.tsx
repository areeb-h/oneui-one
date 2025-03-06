"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  RefreshCw,
  Users,
  Calendar,
  Archive,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      title: "Total Users",
      value: "2,856",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: "24",
      change: "+4.3%",
      trend: "up",
      icon: Archive,
    },
    {
      title: "System Status",
      value: "99.9%",
      change: "-0.1%",
      trend: "down",
      icon: CheckCircle2,
    },
    {
      title: "Pending Tasks",
      value: "12",
      change: "-2.4%",
      trend: "down",
      icon: Calendar,
    },
  ];

  const activities = [
    {
      app: "HR Portal",
      action: "New employee onboarded",
      time: "2 hours ago",
      status: "success",
    },
    {
      app: "Finance Dashboard",
      action: "Monthly report generated",
      time: "Yesterday",
      status: "warning",
    },
    {
      app: "Project Manager",
      action: "Sprint planning completed",
      time: "2 days ago",
      status: "success",
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart3 className="h-[350px] w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`mr-4 rounded-full p-2 ${
                      activity.status === "success"
                        ? "bg-emerald-100"
                        : "bg-amber-100"
                    }`}
                  >
                    {activity.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.app}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
