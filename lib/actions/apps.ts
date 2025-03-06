"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

const APPS_KEY = "registered_apps";

export interface App {
  id: string;
  name: string;
  slug: string;
  appUrl: string; // ✅ New field for app URL
  category: string;
  department: string;
  description?: string; // Nullable
  tags?: string[]; // Nullable
  status: "under maintenance" | "running"; // Enum
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ Get all apps
export async function getRegisteredApps(): Promise<App[]> {
  const apps = (await kv.get(APPS_KEY)) || [];
  return Array.isArray(apps)
    ? apps.map((app) => ({
        ...app,
        updatedAt: new Date(app.updatedAt).toISOString(),
        createdAt: new Date(app.createdAt).toISOString(),
      }))
    : [];
}

// ✅ Register a new app
export async function registerApp(
  appData: Omit<App, "id" | "createdAt" | "updatedAt">
) {
  const apps = await getRegisteredApps();

  const newId = crypto.randomUUID(); // ✅ Auto-generate ID

  if (apps.some((app) => app.slug === appData.slug)) {
    throw new Error("App already registered");
  }

  const newApp = {
    id: newId,
    ...appData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newApps = [...apps, newApp];
  await kv.set(APPS_KEY, newApps);
  revalidatePath("/dashboard/apps");
  return newApp;
}

// ✅ Update an app
export async function updateApp(id: string, updateData: Partial<App>) {
  const apps = await getRegisteredApps();
  const appIndex = apps.findIndex((app) => app.id === id);

  if (appIndex === -1) {
    throw new Error("App not found");
  }

  const updatedApp = {
    ...apps[appIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  apps[appIndex] = updatedApp;
  await kv.set(APPS_KEY, apps);
  revalidatePath("/dashboard/apps");
  return updatedApp;
}

// ✅ Delete an app
export async function deleteApp(id: string) {
  const apps = await getRegisteredApps();
  const newApps = apps.filter((app) => app.id !== id);
  await kv.set(APPS_KEY, newApps);
  revalidatePath("/dashboard/apps");
}

// ✅ Toggle app status (active/inactive)
export async function toggleAppStatus(id: string) {
  const apps = await getRegisteredApps();
  const app = apps.find((app) => app.id === id);

  if (!app) {
    throw new Error("App not found");
  }

  return updateApp(id, { active: !app.active });
}
