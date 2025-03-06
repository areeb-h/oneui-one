import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  CreditCard,
  Inbox,
  BarChart3,
  FileText,
  FolderKanban,
  Layers,
  LifeBuoy,
} from "lucide-react";

export const navigation = [
  {
    title: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        badge: null,
        children: [{ label: "Manage Applications", path: "/dashboard/apps" }],
      },
      {
        icon: BarChart3,
        label: "Applications",
        path: "/apps",
        badge: null,
      },
      // {
      //   icon: BarChart3,
      //   label: "Analytics",
      //   path: "/analytics",
      //   badge: { text: "New", variant: "blue" },
      // },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        icon: Users,
        label: "Team",
        path: "/team",
        badge: null,
        children: [
          { label: "Members", path: "/team/members" },
          { label: "Roles", path: "/team/roles" },
          { label: "Invites", path: "/team/invites" },
        ],
      },
      {
        icon: FolderKanban,
        label: "Projects",
        path: "/projects",
        badge: null,
      },
      {
        icon: FileText,
        label: "Documents",
        path: "/documents",
        badge: null,
      },
      {
        icon: Layers,
        label: "Resources",
        path: "/resources",
        badge: null,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        icon: Calendar,
        label: "Calendar",
        path: "/calendar",
        badge: null,
      },
      {
        icon: MessageSquare,
        label: "Messages",
        path: "/messages",
        badge: { text: "12", variant: "red" },
      },
      {
        icon: Inbox,
        label: "Inbox",
        path: "/inbox",
        badge: { text: "5", variant: "red" },
      },
    ],
  },
];

export const utilityItems = [
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
  {
    icon: LifeBuoy,
    label: "Help & Support",
    path: "/support",
  },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  //   path: "/notifications",
  //   badge: { text: "3", variant: "blue" },
  // },
  // {
  //   icon: CreditCard,
  //   label: "Billing",
  //   path: "/billing",
  // },
];
