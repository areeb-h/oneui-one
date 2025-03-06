"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { EditAppModal } from "./edit-modal";
import { CreateAppModal } from "./create-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  Plus,
  MoreVertical,
  ExternalLink,
  Power,
  Edit,
  Trash2,
} from "lucide-react";
import {
  getRegisteredApps,
  deleteApp,
  toggleAppStatus,
  updateApp,
  registerApp,
  App,
} from "@/lib/actions/apps";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AppCardSkeleton = ({ view }: { view: "grid" | "list" }) => (
  <div
    className={`
      animate-pulse rounded-xl border bg-card 
      ${view === "list" ? "flex items-center gap-6 p-4" : "p-6"}
    `}
  >
    <div className={`${view === "list" ? "flex-shrink-0" : ""}`}>
      <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
    </div>
    <div className={`${view === "list" ? "flex-1" : "mt-4"}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default function AppsDashboard() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();

  const fetchApps = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedApps = await getRegisteredApps();
      setApps(fetchedApps);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleDelete = useCallback(
    async (appId: string) => {
      if (!window.confirm("Are you sure you want to delete this app?")) return;
      try {
        await deleteApp(appId);
        await fetchApps();
        toast.success("App deleted successfully");
      } catch (error) {
        toast.error("Failed to delete app");
      }
    },
    [fetchApps]
  );

  const handleToggleStatus = useCallback(
    async (appId: string) => {
      try {
        await toggleAppStatus(appId);
        await fetchApps();
        toast.success("App status updated");
      } catch (error) {
        toast.error("Failed to update status");
      }
    },
    [fetchApps]
  );

  const handleCreate = useCallback(
    async (data: any) => {
      try {
        await registerApp(data);
        await fetchApps();
        setIsCreateModalOpen(false);
        toast.success("App created successfully");
      } catch (error) {
        toast.error("Failed to create app");
      }
    },
    [fetchApps]
  );

  const handleEdit = useCallback(
    async (data: any) => {
      if (!editingApp) return;
      try {
        await updateApp(editingApp.id, data);
        await fetchApps();
        setEditingApp(null);
        toast.success("App updated successfully");
      } catch (error) {
        toast.error("Failed to update app");
      }
    },
    [editingApp, fetchApps]
  );

  const categories = useMemo(
    () => [...new Set(apps.map((app) => app.category))],
    [apps]
  );

  const filteredApps = useMemo(
    () =>
      apps.filter((app) => {
        const matchesSearch =
          app.name.toLowerCase().includes(search.toLowerCase()) ||
          app.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          !selectedCategory || app.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [apps, search, selectedCategory]
  );

  return (
    <div className="min-h-screen space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Manage Apps
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Configure and manage your application directory
          </motion.p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New App
        </Button>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-10 shadow-sm focus:shadow-md transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 rounded-lg border focus:ring-2 ring-primary shadow-sm"
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

          <div className="flex items-center border rounded-lg shadow-sm">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
              className="transition-all"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
              className="transition-all"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div
        className={`grid gap-6 ${
          view === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <AppCardSkeleton key={index} view={view} />
          ))
        ) : filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full text-center py-12"
          >
            <div className="rounded-lg border bg-card p-8 max-w-md mx-auto shadow-lg">
              <h3 className="font-semibold mb-1">No apps found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search || selectedCategory
                  ? "No apps match your current filter"
                  : "Get started by adding your first application"}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New App
              </Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  group relative rounded-xl border bg-card
                  hover:shadow-lg transition-all duration-300
                  ${view === "list" ? "flex items-center gap-6 p-4" : "p-6"}
                `}
              >
                <div className={view === "list" ? "flex-shrink-0" : ""}>
                  {app.icon ? (
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">{app.name[0]}</span>
                    </div>
                  )}
                </div>

                <div className={`${view === "list" ? "flex-1" : "mt-4"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{app.name}</h2>
                      <Badge
                        variant={
                          app.status === "running" ? "default" : "secondary"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(app.appUrl, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open App
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(app.id)}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          Toggle Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingApp(app)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {app.description || "No description"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{app.category}</Badge>
                    <Badge variant="secondary">{app.department}</Badge>
                    {app.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{app.department}</span>
                    <span>
                      Updated {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <CreateAppModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreate}
      />
      {editingApp && (
        <EditAppModal
          app={editingApp}
          open={!!editingApp}
          onOpenChange={(open) => !open && setEditingApp(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}
