import type { UserRole, NavItem } from "./types";

export const roleLabels: Record<UserRole, string> = {
  producer: "Producer",
  director: "Director",
  production_head: "Production Head",
  vfx_head: "VFX / Action Head",
  financier: "Financier / Investor",
  marketing_head: "Marketing Head",
  admin: "Studio Admin",
};

export const roleDescriptions: Record<UserRole, string> = {
  producer: "Oversee budget, approvals, revenue, and overall film health",
  director: "Creative vision, shot planning, scene management, and VFX review",
  production_head: "Schedule, crew, locations, daily operations, and cost tracking",
  vfx_head: "VFX pipeline, vendor management, action simulation, and delivery",
  financier: "Investment tracking, risk assessment, revenue confidence",
  marketing_head: "Campaigns, audience intelligence, revenue attribution",
  admin: "Full platform access, project management, user administration",
};

export const roleIcons: Record<UserRole, string> = {
  producer: "Film",
  director: "Clapperboard",
  production_head: "HardHat",
  vfx_head: "Sparkles",
  financier: "Landmark",
  marketing_head: "Megaphone",
  admin: "Shield",
};

export function getNavigationForRole(role: UserRole): NavItem[] {
  switch (role) {
    case "producer":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Script Overview", href: "/dashboard/script", icon: "FileText" },
        { label: "Strip Board", href: "/dashboard/strip-board", icon: "ArrowUpDown" },
        { label: "Script Import", href: "/dashboard/script-import", icon: "FileUp" },
        { label: "Budget & Cost", href: "/dashboard/budget", icon: "IndianRupee" },
        { label: "Finance", href: "/dashboard/finance", icon: "Receipt" },
        { label: "Schedule", href: "/dashboard/schedule", icon: "Calendar" },
        { label: "Casting & Stars", href: "/dashboard/casting", icon: "Users" },
        { label: "Revenue Forecast", href: "/dashboard/revenue", icon: "TrendingUp" },
        { label: "Distribution", href: "/dashboard/distribution", icon: "Globe" },
        { label: "Digital Twin", href: "/dashboard/digital-twin", icon: "Box" },
        { label: "Live Production", href: "/dashboard/live-production", icon: "Radio", badge: "LIVE" },
        { label: "Approvals", href: "/dashboard/approvals", icon: "CheckCircle", badge: 4 },
        { label: "Risk Alerts", href: "/dashboard/risks", icon: "AlertTriangle" },
        { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
        { label: "Activity Log", href: "/dashboard/activity", icon: "Activity" },
      ];

    case "director":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Script & Scenes", href: "/dashboard/script", icon: "FileText" },
        { label: "Strip Board", href: "/dashboard/strip-board", icon: "ArrowUpDown" },
        { label: "Script Import", href: "/dashboard/script-import", icon: "FileUp" },
        { label: "Shot Planning", href: "/dashboard/shot-planning", icon: "Camera" },
        { label: "3D Previsualization", href: "/dashboard/previsualization", icon: "Box" },
        { label: "Action & Stunts", href: "/dashboard/action-stunts", icon: "Flame" },
        { label: "My Schedule", href: "/dashboard/schedule", icon: "Calendar" },
        { label: "VFX Review", href: "/dashboard/vfx-review", icon: "Sparkles" },
        { label: "Cast & Characters", href: "/dashboard/casting", icon: "Users" },
        { label: "Locations", href: "/dashboard/locations", icon: "MapPin" },
      ];

    case "production_head":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Strip Board", href: "/dashboard/strip-board", icon: "ArrowUpDown" },
        { label: "Schedule", href: "/dashboard/schedule", icon: "Calendar" },
        { label: "Crew & Resources", href: "/dashboard/crew", icon: "Users" },
        { label: "Locations & Sets", href: "/dashboard/locations", icon: "MapPin" },
        { label: "Set Management", href: "/dashboard/sets", icon: "Warehouse" },
        { label: "Budget (Ops)", href: "/dashboard/budget", icon: "IndianRupee" },
        { label: "Delay & Risk", href: "/dashboard/risks", icon: "AlertTriangle" },
        { label: "Daily Progress", href: "/dashboard/daily-progress", icon: "ClipboardList" },
        { label: "Equipment", href: "/dashboard/equipment", icon: "Wrench" },
      ];

    case "vfx_head":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "VFX Breakdown", href: "/dashboard/vfx-breakdown", icon: "Layers" },
        { label: "Vendor Management", href: "/dashboard/vendors", icon: "Building" },
        { label: "Shot Pipeline", href: "/dashboard/shot-pipeline", icon: "GitBranch" },
        { label: "3D Simulation", href: "/dashboard/simulation", icon: "Box" },
        { label: "Rework Tracker", href: "/dashboard/rework", icon: "RotateCcw" },
        { label: "Delivery Timeline", href: "/dashboard/delivery", icon: "Clock" },
        { label: "Action Sequences", href: "/dashboard/action-stunts", icon: "Flame" },
      ];

    case "financier":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Investment Summary", href: "/dashboard/investment", icon: "PiggyBank" },
        { label: "Finance", href: "/dashboard/finance", icon: "Receipt" },
        { label: "Risk Scorecard", href: "/dashboard/risks", icon: "Shield" },
        { label: "Revenue Forecast", href: "/dashboard/revenue", icon: "TrendingUp" },
        { label: "Break-even", href: "/dashboard/break-even", icon: "Target" },
        { label: "Distribution Deals", href: "/dashboard/distribution", icon: "Globe" },
        { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
      ];

    case "marketing_head":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Campaigns", href: "/dashboard/campaigns", icon: "Megaphone" },
        { label: "Audience & Sentiment", href: "/dashboard/audience", icon: "Heart" },
        { label: "Spend Optimization", href: "/dashboard/spend", icon: "PieChart" },
        { label: "Revenue Attribution", href: "/dashboard/attribution", icon: "Link" },
        { label: "Release Strategy", href: "/dashboard/release-strategy", icon: "Rocket" },
        { label: "Influencer Tracking", href: "/dashboard/influencers", icon: "Star" },
        { label: "Content Calendar", href: "/dashboard/content-calendar", icon: "Calendar" },
      ];

    case "admin":
      return [
        { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "All Projects", href: "/dashboard/projects", icon: "FolderOpen" },
        { label: "Script", href: "/dashboard/script", icon: "FileText" },
        { label: "Strip Board", href: "/dashboard/strip-board", icon: "ArrowUpDown" },
        { label: "Script Import", href: "/dashboard/script-import", icon: "FileUp" },
        { label: "Budget", href: "/dashboard/budget", icon: "IndianRupee" },
        { label: "Finance", href: "/dashboard/finance", icon: "Receipt" },
        { label: "Schedule", href: "/dashboard/schedule", icon: "Calendar" },
        { label: "VFX", href: "/dashboard/vfx-breakdown", icon: "Sparkles" },
        { label: "Casting", href: "/dashboard/casting", icon: "Users" },
        { label: "Distribution", href: "/dashboard/distribution", icon: "Globe" },
        { label: "Marketing", href: "/dashboard/campaigns", icon: "Megaphone" },
        { label: "Revenue", href: "/dashboard/revenue", icon: "TrendingUp" },
        { label: "Digital Twin", href: "/dashboard/digital-twin", icon: "Box" },
        { label: "Live Production", href: "/dashboard/live-production", icon: "Radio" },
        { label: "Activity Log", href: "/dashboard/activity", icon: "Activity" },
        { label: "User Management", href: "/dashboard/users", icon: "UserCog" },
        { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
      ];

    default:
      return [];
  }
}
