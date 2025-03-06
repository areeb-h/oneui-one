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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const createFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  appUrl: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  department: z.string().min(1, "Department is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["running", "under maintenance"]),
  active: z.boolean().default(true),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

interface CreateAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFormValues) => Promise<void>;
}

export function CreateAppModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateAppModalProps) {
  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      appUrl: "",
      category: "",
      department: "",
      description: "",
      tags: "",
      status: "running",
      active: true,
    },
  });

  const handleSubmit = React.useCallback(
    async (data: CreateFormValues) => {
      try {
        await onSubmit({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        });
        form.reset();
        onOpenChange(false);
        toast.success("App created successfully");
      } catch (error) {
        toast.error("Failed to create app");
        console.error("App creation error:", error);
      }
    },
    [onSubmit, form, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
          <DialogDescription>
            Add a new application to your directory
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="app-name"
                        onChange={(e) => {
                          const slugValue = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "");
                          field.onChange(slugValue);
                        }}
                      />
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="running" id="running" />
                        <label htmlFor="running">Running</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="under maintenance"
                          id="maintenance"
                        />
                        <label htmlFor="maintenance">Under Maintenance</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Enable or disable the application
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {form.formState.isSubmitting ? "Creating..." : "Create App"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
