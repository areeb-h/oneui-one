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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { App } from "@/lib/actions/apps";

// Sample data for selectable options - add these to match create modal
const categories = [
  { value: "analytics", label: "Analytics" },
  { value: "communication", label: "Communication" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "marketing", label: "Marketing" },
  { value: "productivity", label: "Productivity" },
  { value: "sales", label: "Sales" },
  { value: "security", label: "Security" },
];

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "IT" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "product", label: "Product" },
  { value: "sales", label: "Sales" },
];

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  appUrl: z.string().url("Must be a valid URL").min(1, "URL is required"),
  tags: z.array(z.string()).default([]),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["running", "under maintenance"]),
  active: z.boolean().default(true),
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
      tags: app?.tags || [],
      department: app?.department || "",
      status: app?.status || "running",
      active: app?.active ?? true,
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
        tags: app.tags || [],
        department: app.department,
        status: app.status || "running",
        active: app.active ?? true,
      });
    }
  }, [app, form]);

  const handleSubmit = React.useCallback(
    async (data: EditFormValues) => {
      try {
        await onSubmit(data);
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
      <DialogContent 
        side={true}
        className="p-0 sm:max-w-md inset-y-4 right-4 h-[calc(100%-2rem)] rounded-lg shadow-lg fixed data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 animate-in overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit App: {app.name}</DialogTitle>
              <DialogDescription>
                Make changes to your app details. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                id="edit-app-form"
                className="space-y-6"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">App Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">App Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter app name" 
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription>
                          The name that will be displayed to users
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appUrl"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Application URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://example.com"
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription>
                          The direct link to your application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.value} 
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Group your app by its primary function
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem 
                                key={department.value} 
                                value={department.value}
                              >
                                {department.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The department that owns this application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Tags</FormLabel>
                        <div className="mb-2">
                          {field.value?.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="mr-1 mb-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => {
                                  const newTags = field.value?.filter(
                                    (t) => t !== tag
                                  );
                                  form.setValue("tags", newTags);
                                }}
                                className="ml-1 rounded-full outline-none"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Add tag and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                const newTag = e.currentTarget.value.trim();
                                if (newTag && !field.value.includes(newTag)) {
                                  form.setValue("tags", [...field.value, newTag]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription>
                          Add relevant tags to help with discoverability
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter a detailed description of your application"
                            value={field.value || ""}
                            className="min-h-24 resize-none"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide information about the app's purpose and features
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-base">Application Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-3 mt-2"
                          >
                            <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value="running" id="edit-running" />
                              <div className="flex flex-col">
                                <label htmlFor="edit-running" className="font-medium cursor-pointer">Running</label>
                                <span className="text-sm text-muted-foreground">The application is fully operational</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem
                                value="under maintenance"
                                id="edit-maintenance"
                              />
                              <div className="flex flex-col">
                                <label htmlFor="edit-maintenance" className="font-medium cursor-pointer">Under Maintenance</label>
                                <span className="text-sm text-muted-foreground">The application is temporarily unavailable</span>
                              </div>
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
                      <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>
                            Toggle to show or hide this application
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
                </div>
              </form>
            </Form>
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t bg-background">
            <div className="flex justify-between items-center w-full">
              {/* Left side - Cancel button */}
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
              
              {/* Right side - Save button */}
              <div>
                <Button
                  type="submit"
                  form="edit-app-form"
                  disabled={
                    !form.formState.isDirty || form.formState.isSubmitting
                  }
                  className="min-w-24"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}