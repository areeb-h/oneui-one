"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, ExternalLink } from "lucide-react";
import { getRegisteredApps } from "@/lib/actions/apps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [loading, startTransition] = useTransition();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      setApps(await getRegisteredApps());
    });
  }, []);

  const categories = [...new Set(apps.map((app) => app.category))];
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen space-y-8 p-8">
      {/* Header Section */}
      <div className="space-y-2">
        <motion.h1
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Apps Directory
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Access all your applications from one place
        </motion.p>
      </div>

      {/* Controls Section */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 rounded-lg border focus:ring-2 ring-primary"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Apps Grid */}
      <motion.div
        className={`grid gap-6 ${
          view === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {filteredApps.map((app) => (
          <motion.div
            key={app.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className={`
              group relative rounded-xl border bg-card p-6
              hover:shadow-lg transition-shadow duration-200
              ${view === "list" ? "flex items-center gap-6" : ""}
            `}
          >
            <div className={view === "list" ? "flex-shrink-0" : ""}>
              <img
                src={app.icon}
                alt={app.name}
                className="w-12 h-12 rounded-lg"
              />
            </div>

            <div className={`${view === "list" ? "flex-1" : "mt-4"}`}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-semibold">{app.name}</h2>
                <Badge variant="outline">{app.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {app.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{app.team}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
                </div>

                <Button
                  onClick={() => window.open(`/apps/${app.id}`, "_blank")}
                >
                  Open App
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
