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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, ArrowRight, Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample data for selectable options
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

const availableTags = [
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
  { value: "reporting", label: "Reporting" },
  { value: "admin", label: "Admin" },
  { value: "collaboration", label: "Collaboration" },
  { value: "dashboard", label: "Dashboard" },
  { value: "integration", label: "Integration" },
  { value: "api", label: "API" },
  { value: "documentation", label: "Documentation" },
];

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
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["running", "under maintenance"]),
  active: z.boolean().default(true),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

// Define the form steps
const steps = [
  {
    id: "basic",
    name: "Basics",
    fields: ["name", "slug", "appUrl"],
  },
  {
    id: "categorization",
    name: "Categories",
    fields: ["category", "department", "tags"],
  },
  {
    id: "details",
    name: "Details",
    fields: ["description", "status", "active"],
  },
  {
    id: "review",
    name: "Review",
    fields: [],
  },
];

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
  const [currentStep, setCurrentStep] = React.useState(0);

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      appUrl: "",
      category: "",
      department: "",
      description: "",
      tags: [],
      status: "running",
      active: true,
    },
    mode: "onChange",
  });

  // Function to go to the next step - defined before it's used in handleSubmit
  const goToNextStep = async () => {
    const currentFields = steps[currentStep].fields;
    const output = await form.trigger(currentFields as any);
    
    if (output) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = React.useCallback(
    async (data: CreateFormValues) => {
      try {
        // Only submit if we're on the final review step
        if (currentStep === steps.length - 1) {
          await onSubmit(data);
          form.reset();
          setCurrentStep(0);
          onOpenChange(false);
          toast.success("App created successfully");
        } else {
          // Otherwise just advance to the next step
          goToNextStep();
        }
      } catch (error) {
        toast.error("Failed to create app");
        console.error("App creation error:", error);
      }
    },
    [onSubmit, form, onOpenChange, currentStep]
  );

  // Auto-generate slug from name
  const watchName = form.watch("name");
  React.useEffect(() => {
    if (watchName && !form.getValues("slug")) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchName, form]);

  // Function to go to the previous step
  const goToPreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Function to check if current step fields are valid
  const isCurrentStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every((field) => !form.formState.errors[field as keyof CreateFormValues]);
  };

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
              <DialogTitle className="text-xl">Create New App</DialogTitle>
              <DialogDescription>
                Add a new application to your directory
              </DialogDescription>
            </DialogHeader>

            {/* Step Indicators */}
            <div className="flex justify-between mt-8 relative">
              {/* Progress bar */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-muted -translate-y-1/2 w-full z-0"
                aria-hidden="true"
              />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  transition: "width 300ms ease-in-out"
                }}
                aria-hidden="true"
              />
              
              {steps.map((step, index) => (
                <div key={step.id} className="z-10 flex flex-col items-center">
                  <div
                    className={`rounded-full w-10 h-10 flex items-center justify-center border-2 
                    ${
                      currentStep > index 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : currentStep === index
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > index ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span 
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= index 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                id="create-app-form"
                className="space-y-6"
              >
                {/* Basic Info Step */}
                {currentStep === 0 && (
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
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="text-base">URL Slug</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="app-name"
                              className="h-10"
                              onChange={(e) => {
                                const slugValue = e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9-]/g, "");
                                field.onChange(slugValue);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Will be used in the URL: domain.com/apps/<strong>{field.value || "your-slug"}</strong>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appUrl"
                      render={({ field }) => (
                        <FormItem>
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
                  </div>
                )}

                {/* Categorization Step */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Categorization</h3>
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="text-base">Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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
                            defaultValue={field.value}
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
                        <FormItem>
                          <FormLabel className="text-base">Tags</FormLabel>
                          <div className="mb-2">
                            {field.value?.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary"
                                className="mr-1 mb-1"
                              >
                                {availableTags.find(t => t.value === tag)?.label || tag}
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between h-10"
                                >
                                  {field.value?.length 
                                    ? `${field.value.length} tag${field.value.length > 1 ? 's' : ''} selected` 
                                    : "Select tags"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search tags..." />
                                  <CommandEmpty>No tags found.</CommandEmpty>
                                  <CommandGroup>
                                    {availableTags.map((tag) => (
                                      <CommandItem
                                        key={tag.value}
                                        onSelect={() => {
                                          const current = field.value || [];
                                          const newTags = current.includes(tag.value)
                                            ? current.filter((t) => t !== tag.value)
                                            : [...current, tag.value];
                                          form.setValue("tags", newTags);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            field.value?.includes(tag.value)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {tag.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Add relevant tags to help with discoverability
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Details Step */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Additional Details</h3>
                    
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
                              defaultValue={field.value}
                              className="flex flex-col space-y-3 mt-2"
                            >
                              <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                                <RadioGroupItem value="running" id="running" />
                                <div className="flex flex-col">
                                  <label htmlFor="running" className="font-medium cursor-pointer">Running</label>
                                  <span className="text-sm text-muted-foreground">The application is fully operational</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                                <RadioGroupItem
                                  value="under maintenance"
                                  id="maintenance"
                                />
                                <div className="flex flex-col">
                                  <label htmlFor="maintenance" className="font-medium cursor-pointer">Under Maintenance</label>
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
                )}

                {/* Review Step */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Review Your App Details</h3>
                    <div className="bg-muted rounded-lg p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="border-b pb-3">
                          <h4 className="text-base font-medium text-muted-foreground mb-4">Basic Information</h4>
                          <div className="grid grid-cols-3 gap-y-3">
                            <div className="font-medium col-span-1">Name:</div>
                            <div className="col-span-2">{form.getValues("name")}</div>
                            
                            <div className="font-medium col-span-1">Slug:</div>
                            <div className="col-span-2">{form.getValues("slug")}</div>
                            
                            <div className="font-medium col-span-1">URL:</div>
                            <div className="col-span-2 truncate">{form.getValues("appUrl")}</div>
                          </div>
                        </div>
                        
                        <div className="border-b pb-3">
                          <h4 className="text-base font-medium text-muted-foreground mb-4">Categorization</h4>
                          <div className="grid grid-cols-3 gap-y-3">
                            <div className="font-medium col-span-1">Category:</div>
                            <div className="col-span-2">
                              {categories.find(c => c.value === form.getValues("category"))?.label || form.getValues("category")}
                            </div>
                            
                            <div className="font-medium col-span-1">Department:</div>
                            <div className="col-span-2">
                              {departments.find(d => d.value === form.getValues("department"))?.label || form.getValues("department")}
                            </div>
                            
                            <div className="font-medium col-span-1">Tags:</div>
                            <div className="col-span-2">
                              {form.getValues("tags")?.length ? (
                                <div className="flex flex-wrap">
                                  {form.getValues("tags").map(tag => (
                                    <Badge key={tag} variant="secondary" className="mr-1 mb-1">
                                      {availableTags.find(t => t.value === tag)?.label || tag}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                "None"
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-medium text-muted-foreground mb-4">Additional Details</h4>
                          <div className="grid grid-cols-3 gap-y-3">
                            <div className="font-medium col-span-1">Status:</div>
                            <div className="col-span-2 capitalize">
                              {form.getValues("status").replace("-", " ")}
                            </div>
                            
                            <div className="font-medium col-span-1">Active:</div>
                            <div className="col-span-2">{form.getValues("active") ? "Yes" : "No"}</div>
                          </div>
                          
                          {form.getValues("description") && (
                            <div className="mt-4">
                              <div className="font-medium mb-2">Description:</div>
                              <div className="bg-background rounded p-3 text-sm">
                                {form.getValues("description")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
              
              {/* Right side - Navigation buttons */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!isCurrentStepValid()}
                    className="flex items-center gap-2 min-w-24"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    className="min-w-24"
                  >
                    {form.formState.isSubmitting ? "Creating..." : "Create App"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}