"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { App } from "@/lib/actions/apps";

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  appUrl: z.string().url("Must be a valid URL").min(1, "URL is required"),
  tags: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["running", "under maintenance"]).optional(),
  active: z.boolean().optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface EditAppModalProps {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditFormValues) => Promise<void>;
}

export function EditAppModal({
  app,
  open,
  onOpenChange,
  onSubmit,
}: EditAppModalProps) {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: app?.name || "",
      description: app?.description || "",
      category: app?.category || "",
      appUrl: app?.appUrl || "",
      tags: app?.tags?.join(", ") || "",
      department: app?.department || "",
      status: app?.status,
      active: app?.active,
    },
  });

  // Reset form when app changes
  React.useEffect(() => {
    if (app) {
      form.reset({
        name: app.name,
        description: app.description || "",
        category: app.category,
        appUrl: app.appUrl,
        tags: app.tags?.join(", ") || "",
        department: app.department,
        status: app.status,
        active: app.active,
      });
    }
  }, [app, form.reset]);

  const handleSubmit = React.useCallback(
    async (data: EditFormValues) => {
      try {
        await onSubmit({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        });
        form.reset();
        onOpenChange(false);
        toast.success("App updated successfully");
      } catch (error) {
        toast.error("Failed to update app");
        console.error("App update error:", error);
      }
    },
    [onSubmit, form, onOpenChange]
  );

  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit App: {app.name}</DialogTitle>
          <DialogDescription>
            Make changes to your app details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter app name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a detailed description"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter department" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="appUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter tags, comma separated"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
