"use client";

import {
  LayoutDashboard, FileText, IndianRupee, Calendar, Users, TrendingUp, Globe, Box,
  CheckCircle, AlertTriangle, BarChart3, Camera, Flame, MapPin, Sparkles, Layers,
  Building, GitBranch, RotateCcw, Clock, PiggyBank, Shield, Target, Megaphone,
  Heart, PieChart, Link, Rocket, Star, FolderOpen, UserCog, Settings, Warehouse,
  ClipboardList, Wrench, Film, Clapperboard, HardHat, Landmark,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard,
  FileText,
  IndianRupee,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  Box,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Camera,
  Flame,
  MapPin,
  Sparkles,
  Layers,
  Building,
  GitBranch,
  RotateCcw,
  Clock,
  PiggyBank,
  Shield,
  Target,
  Megaphone,
  Heart,
  PieChart,
  Link,
  Rocket,
  Star,
  FolderOpen,
  UserCog,
  Settings,
  Warehouse,
  ClipboardList,
  Wrench,
  Film,
  Clapperboard,
  HardHat,
  Landmark,
};

interface LucideIconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = iconMap[name];
  if (!Icon) {
    return <span className="w-4 h-4 rounded bg-current opacity-20" />;
  }
  return <Icon {...props} />;
}
