export type UserRole =
  | "producer"
  | "director"
  | "production_head"
  | "vfx_head"
  | "financier"
  | "marketing_head"
  | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "pre_production" | "production" | "post_production" | "released";
  budget: number;
  spent: number;
  genre: string;
  language: string;
  releaseDate?: string;
  posterImage?: string;
  healthScore: number;
  director?: string;
  producer?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
  children?: NavItem[];
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  color?: "gold" | "success" | "warning" | "danger" | "info";
}

export interface Scene {
  id: string;
  sceneNumber: number;
  description: string;
  location: string;
  complexity: "action" | "dialogue" | "vfx" | "romantic" | "song" | "stunt";
  estimatedCost: number;
  estimatedDuration: number;
  vfxRequired: boolean;
  vfxIntensity?: "low" | "medium" | "high" | "extreme";
  status: "planned" | "shooting" | "completed" | "delayed";
  castNeeded: string[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  description: string;
  planned: number;
  actual: number;
  status: "on_track" | "over_budget" | "under_budget" | "pending";
  vendor?: string;
}

export interface ShootDay {
  id: string;
  dayNumber: number;
  date: string;
  location: string;
  scenes: string[];
  status: "planned" | "completed" | "delayed" | "cancelled";
  notes?: string;
}

export interface Actor {
  id: string;
  name: string;
  fee: number;
  image?: string;
  tier: "A" | "B" | "C";
  fanBaseScore: number;
  overseasPull: number;
  socialFollowing: number;
}

export interface VfxShot {
  id: string;
  sceneNumber: number;
  shotNumber: number;
  type: "CGI" | "roto" | "paint" | "crowd" | "composite" | "full_cg";
  complexity: "low" | "medium" | "high" | "extreme";
  estimatedCost: number;
  actualCost: number;
  vendor: string;
  status: "pending" | "in_progress" | "review" | "approved" | "rework";
  reworkCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: "youtube" | "instagram" | "x" | "tiktok" | "facebook" | "tv";
  budget: number;
  spent: number;
  region: string;
  status: "planned" | "active" | "paused" | "completed";
  impressions: number;
  engagement: number;
  sentimentScore: number;
}

export interface RevenueStream {
  id: string;
  type: "theatrical" | "ott" | "satellite" | "music" | "dubbing" | "overseas";
  territory: string;
  projected: number;
  actual: number;
}

export interface Approval {
  id: string;
  type: string;
  title: string;
  description: string;
  requestedBy: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  amount?: number;
}

export interface RiskAlert {
  id: string;
  type: "budget" | "schedule" | "weather" | "vfx" | "market" | "actor";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  impactAmount: number;
  mitigated: boolean;
}

export interface DailyProgress {
  id: string;
  date: string;
  scenesCompleted: number;
  budgetSpentToday: number;
  notes: string;
  issues: string[];
}

export interface DistributionTerritory {
  id: string;
  territory: string;
  mgValuation: number;
  actualDeal: number;
  distributor: string;
  status: "negotiating" | "confirmed" | "released" | "collected";
}

export interface CrewMember {
  id: string;
  name: string;
  department: string;
  role: string;
  dailyRate: number;
  availability: "available" | "assigned" | "unavailable";
}

export interface LiveCamera {
  id: string;
  label: string;
  location: string;
  status: "live" | "standby" | "offline";
  resolution: string;
  operator: string;
}

export interface LiveStreamSession {
  id: string;
  sceneId: string;
  sceneNumber: number;
  sceneDescription: string;
  status: "live" | "scheduled" | "completed" | "paused";
  startTime: string;
  endTime?: string;
  cameras: LiveCamera[];
  viewers: { name: string; role: string }[];
  shotNumber: number;
  totalShots: number;
  budgetBurn: number;
  scheduledStart: string;
  isHighRisk: boolean;
}

export interface StreamActivityLog {
  id: string;
  timestamp: string;
  type: "scene_start" | "scene_wrap" | "shot_approved" | "viewer_joined" | "alert";
  message: string;
  user?: string;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  parameterChanges: Record<string, unknown>;
  impactSummary: {
    budgetImpact: number;
    scheduleImpact: number;
    revenueImpact: number;
    riskChange: string;
  };
}
