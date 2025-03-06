"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { EditAppModal } from "./edit-modal";
import { CreateAppModal } from "./create-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, Plus, MoreVertical, ExternalLink, Power, Edit, Trash2, Filter, SlidersHorizontal, Download, Upload } from 'lucide-react';
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const AppCardSkeleton = ({ view }: { view: "grid" | "list" }) => (
  <div
    className={`
      animate-pulse rounded-xl border bg-card 
      ${view === "list" ? "flex items-center gap-6 p-4" : "p-6"}
    `}
  >
    <div className={`${view === "list" ? "flex-shrink-0" : ""}`}>
      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
    <div className={`${view === "list" ? "flex-1" : "mt-4"}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default function Apps() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

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

  const departments = useMemo(
    () => [...new Set(apps.map((app) => app.department))],
    [apps]
  );

  const filteredApps = useMemo(() => {
    let filtered = apps;
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }
    
    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(app => app.department === selectedDepartment);
    }
    
    // Filter by tab
    if (activeTab === "running") {
      filtered = filtered.filter(app => app.status === "running");
    } else if (activeTab === "maintenance") {
      filtered = filtered.filter(app => app.status === "under maintenance");
    }
    
    return filtered;
  }, [apps, search, selectedCategory, selectedDepartment, activeTab]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedDepartment(null);
    setActiveTab("all");
  };

  const hasActiveFilters = search || selectedCategory || selectedDepartment || activeTab !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Application Directory</h2>
          <p className="text-sm text-muted-foreground">
            Browse and manage your organization's applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only md:not-sr-only md:inline-block">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New App
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                Import Apps
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Apps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setIsCreateModalOpen(true)} className="h-8">
            <Plus className="mr-2 h-3.5 w-3.5" />
            <span>Add App</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Apps</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only md:not-sr-only md:inline-block">Filter</span>
                  {hasActiveFilters && <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {(search ? 1 : 0) + (selectedCategory ? 1 : 0) + (selectedDepartment ? 1 : 0)}
                  </Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium">Category</p>
                  <select
                    className="w-full rounded-md border border-input px-3 py-1 text-sm"
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
                </div>
                <div className="p-2">
                  <p className="mb-2 text-xs font-medium">Department</p>
                  <select
                    className="w-full rounded-md border border-input px-3 py-1 text-sm"
                    value={selectedDepartment || ""}
                    onChange={(e) => setSelectedDepartment(e.target.value || null)}
                  >
                    <option value="">All Departments</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} disabled={!hasActiveFilters}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="h-8 w-8 transition-all"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="h-8 w-8 transition-all"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <TabsContent value="all" className="mt-0">
          <AppGrid 
            apps={filteredApps} 
            view={view} 
            isLoading={isLoading}
            onEdit={setEditingApp}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
        <TabsContent value="running" className="mt-0">
          <AppGrid 
            apps={filteredApps} 
            view={view} 
            isLoading={isLoading}
            onEdit={setEditingApp}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
        <TabsContent value="maintenance" className="mt-0">
          <AppGrid 
            apps={filteredApps} 
            view={view} 
            isLoading={isLoading}
            onEdit={setEditingApp}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
      </Tabs>

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

interface AppGridProps {
  apps: App[];
  view: "grid" | "list";
  isLoading: boolean;
  onEdit: (app: App) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCreateNew: () => void;
}

function AppGrid({ apps, view, isLoading, onEdit, onDelete, onToggleStatus, onCreateNew }: AppGridProps) {
  const router = useRouter(); 
  
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {[...Array(6)].map((_, index) => (
          <AppCardSkeleton key={index} view={view} />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No applications found</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-md">
          No applications match your current filters. Try adjusting your search or filters, or add a new application.
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New App
        </Button>
      </Card>
    );
  }

  return (
    <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      <AnimatePresence>
        {apps.map((app) => (
          <motion.div
            key={app.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              group relative rounded-xl border bg-card
              hover:shadow-md transition-all duration-300
              ${view === "list" ? "flex items-center gap-6 p-4" : "p-6"}
            `}
          >
            <div className={view === "list" ? "flex-shrink-0" : ""}>
              {app.icon ? (
                <img
                  src={app.icon || "/placeholder.svg"}
                  alt={app.name}
                  className="w-12 h-12 rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-medium">{app.name[0]}</span>
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
                    className="text-xs"
                  >
                    {app.status}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/apps/${app.slug}`)}
                  >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open App
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleStatus(app.id)}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      Toggle Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(app)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(app.id)}
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
                  <Badge key={tag} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{app.department}</span>
                <span>
                  Updated {new Date(app.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
