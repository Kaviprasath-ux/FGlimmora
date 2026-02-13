import type {
  Project, Scene, BudgetCategory, ShootDay, Actor, VfxShot,
  Campaign, RevenueStream, Approval, RiskAlert, DailyProgress,
  DistributionTerritory, CrewMember, WhatIfScenario, StatItem,
  LiveCamera, LiveStreamSession, StreamActivityLog,
  StripBoardScene, DayBreak, PurchaseOrder, AuditEntry, ActivityEvent,
} from "@/lib/types";

// ═══════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════

export const projects: Project[] = [
  {
    id: "proj_001",
    name: "Pushpa 3: The Rampage",
    description: "The third installment of the Pushpa franchise. Pushpa Raj faces new threats from international smuggling syndicates while protecting his territory.",
    status: "production",
    budget: 350,
    spent: 187.5,
    genre: "Action / Mass",
    language: "Telugu",
    releaseDate: "2027-01-14",
    posterImage: "/posters/pushpa3.jpg",
    healthScore: 78,
    director: "Sukumar",
    producer: "Dil Raju",
  },
  {
    id: "proj_002",
    name: "Spirit",
    description: "A gripping action thriller about an undercover cop infiltrating a powerful crime syndicate in Hyderabad.",
    status: "pre_production",
    budget: 200,
    spent: 22,
    genre: "Action Thriller",
    language: "Telugu",
    releaseDate: "2027-08-15",
    posterImage: "/posters/spirit.jpg",
    healthScore: 92,
    director: "Sandeep Reddy Vanga",
    producer: "Bhushan Kumar",
  },
];

// ═══════════════════════════════════════════════════════════
// SCENES (Script Intelligence)
// ═══════════════════════════════════════════════════════════

export const scenes: Scene[] = [
  { id: "sc_001", sceneNumber: 1, description: "Opening - Red sandalwood forest chase at dawn", location: "Seshachalam Forest", complexity: "action", estimatedCost: 2.5, estimatedDuration: 3, vfxRequired: true, vfxIntensity: "medium", status: "completed", castNeeded: ["Pushpa", "Henchmen"] },
  { id: "sc_002", sceneNumber: 2, description: "Pushpa's grand entry in village market", location: "Ramoji Film City - Village Set", complexity: "action", estimatedCost: 1.8, estimatedDuration: 2, vfxRequired: false, status: "completed", castNeeded: ["Pushpa", "Srivalli", "Villagers"] },
  { id: "sc_003", sceneNumber: 3, description: "Srivalli emotional confrontation scene", location: "Indoor Studio - House Set", complexity: "dialogue", estimatedCost: 0.5, estimatedDuration: 1, vfxRequired: false, status: "completed", castNeeded: ["Pushpa", "Srivalli"] },
  { id: "sc_004", sceneNumber: 4, description: "Smuggling warehouse raid sequence", location: "Vizag Port Area", complexity: "action", estimatedCost: 4.2, estimatedDuration: 4, vfxRequired: true, vfxIntensity: "high", status: "shooting", castNeeded: ["Pushpa", "Antagonist", "Police"] },
  { id: "sc_005", sceneNumber: 5, description: "Interval fight - Truck chase on highway", location: "Outer Ring Road, Hyderabad", complexity: "stunt", estimatedCost: 8.5, estimatedDuration: 6, vfxRequired: true, vfxIntensity: "extreme", status: "planned", castNeeded: ["Pushpa", "Stunt doubles"] },
  { id: "sc_006", sceneNumber: 6, description: "Romantic song - Pushpa & Srivalli in Europe", location: "Switzerland", complexity: "song", estimatedCost: 5.0, estimatedDuration: 5, vfxRequired: true, vfxIntensity: "low", status: "planned", castNeeded: ["Pushpa", "Srivalli", "Dancers"] },
  { id: "sc_007", sceneNumber: 7, description: "International syndicate boardroom scene", location: "Indoor Studio - Office Set", complexity: "dialogue", estimatedCost: 0.8, estimatedDuration: 1, vfxRequired: false, status: "planned", castNeeded: ["Antagonist", "Syndicate members"] },
  { id: "sc_008", sceneNumber: 8, description: "Mass item song in underworld den", location: "Custom Built Set - Annapurna Studios", complexity: "song", estimatedCost: 6.0, estimatedDuration: 4, vfxRequired: true, vfxIntensity: "medium", status: "planned", castNeeded: ["Pushpa", "Item dancer", "Background dancers"] },
  { id: "sc_009", sceneNumber: 9, description: "Climax fight on cargo ship", location: "Vizag Shipyard + VFX", complexity: "stunt", estimatedCost: 12.0, estimatedDuration: 8, vfxRequired: true, vfxIntensity: "extreme", status: "planned", castNeeded: ["Pushpa", "Antagonist", "Stunt team"] },
  { id: "sc_010", sceneNumber: 10, description: "Emotional climax - Pushpa's sacrifice scene", location: "Forest Set", complexity: "dialogue", estimatedCost: 1.5, estimatedDuration: 2, vfxRequired: true, vfxIntensity: "low", status: "planned", castNeeded: ["Pushpa", "Srivalli", "Supporting cast"] },
  { id: "sc_011", sceneNumber: 11, description: "Police station confrontation", location: "Studio Set - Police Station", complexity: "dialogue", estimatedCost: 0.6, estimatedDuration: 1.5, vfxRequired: false, status: "completed", castNeeded: ["Pushpa", "SP Bhanwar Singh"] },
  { id: "sc_012", sceneNumber: 12, description: "Village celebration mass dance", location: "Ramoji Film City", complexity: "song", estimatedCost: 3.5, estimatedDuration: 3, vfxRequired: true, vfxIntensity: "low", status: "shooting", castNeeded: ["Pushpa", "Srivalli", "Villagers", "Dancers"] },
];

// ═══════════════════════════════════════════════════════════
// BUDGET
// ═══════════════════════════════════════════════════════════

export const budgetCategories: BudgetCategory[] = [
  {
    id: "bud_001", name: "Talent & Cast", planned: 95, actual: 65,
    items: [
      { id: "bi_001", description: "Lead Actor (Allu Arjun)", planned: 60, actual: 45, status: "on_track", vendor: "GA2 Pictures" },
      { id: "bi_002", description: "Lead Actress (Rashmika)", planned: 8, actual: 6, status: "on_track", vendor: "Direct" },
      { id: "bi_003", description: "Antagonist (Fahadh Faasil)", planned: 12, actual: 9, status: "on_track", vendor: "Direct" },
      { id: "bi_004", description: "Supporting Cast", planned: 10, actual: 3, status: "on_track" },
      { id: "bi_005", description: "Item Song Artist", planned: 5, actual: 2, status: "pending" },
    ],
  },
  {
    id: "bud_002", name: "Production & Crew", planned: 45, actual: 28,
    items: [
      { id: "bi_006", description: "Director (Sukumar)", planned: 15, actual: 10, status: "on_track" },
      { id: "bi_007", description: "Cinematography (Miroslaw)", planned: 6, actual: 4, status: "on_track" },
      { id: "bi_008", description: "Art Direction", planned: 8, actual: 5.5, status: "on_track" },
      { id: "bi_009", description: "Crew & Technicians", planned: 12, actual: 6.5, status: "on_track" },
      { id: "bi_010", description: "Costumes & Makeup", planned: 4, actual: 2, status: "on_track" },
    ],
  },
  {
    id: "bud_003", name: "VFX & Post Production", planned: 80, actual: 32,
    items: [
      { id: "bi_011", description: "VFX - Action sequences", planned: 35, actual: 15, status: "on_track", vendor: "DNEG" },
      { id: "bi_012", description: "VFX - Environment & Sets", planned: 20, actual: 8, status: "on_track", vendor: "Framestore" },
      { id: "bi_013", description: "Sound Design & Mix", planned: 8, actual: 2, status: "pending", vendor: "Resul Pookutty" },
      { id: "bi_014", description: "Color Grading", planned: 5, actual: 2, status: "on_track" },
      { id: "bi_015", description: "Editing", planned: 6, actual: 3, status: "on_track" },
      { id: "bi_016", description: "DI & Mastering", planned: 6, actual: 2, status: "pending" },
    ],
  },
  {
    id: "bud_004", name: "Locations & Sets", planned: 40, actual: 25.5,
    items: [
      { id: "bi_017", description: "Ramoji Film City Rental", planned: 10, actual: 7, status: "on_track", vendor: "Ramoji Group" },
      { id: "bi_018", description: "Outdoor Location Permits", planned: 8, actual: 6, status: "on_track" },
      { id: "bi_019", description: "Set Construction", planned: 15, actual: 10, status: "over_budget" },
      { id: "bi_020", description: "International Location (Switzerland)", planned: 7, actual: 2.5, status: "on_track" },
    ],
  },
  {
    id: "bud_005", name: "Music & Songs", planned: 25, actual: 12,
    items: [
      { id: "bi_021", description: "Music Director (DSP)", planned: 10, actual: 6, status: "on_track" },
      { id: "bi_022", description: "Lyricists", planned: 3, actual: 1.5, status: "on_track" },
      { id: "bi_023", description: "Playback Singers", planned: 5, actual: 2, status: "on_track" },
      { id: "bi_024", description: "Choreography", planned: 4, actual: 1.5, status: "on_track" },
      { id: "bi_025", description: "Recording & Production", planned: 3, actual: 1, status: "on_track" },
    ],
  },
  {
    id: "bud_006", name: "Marketing & Distribution", planned: 50, actual: 20,
    items: [
      { id: "bi_026", description: "Theatrical Marketing", planned: 20, actual: 8, status: "on_track" },
      { id: "bi_027", description: "Digital Marketing", planned: 12, actual: 5, status: "on_track" },
      { id: "bi_028", description: "PR & Events", planned: 8, actual: 3, status: "on_track" },
      { id: "bi_029", description: "Print Distribution", planned: 5, actual: 2, status: "on_track" },
      { id: "bi_030", description: "International Marketing", planned: 5, actual: 2, status: "on_track" },
    ],
  },
  {
    id: "bud_007", name: "Contingency", planned: 15, actual: 5,
    items: [
      { id: "bi_031", description: "Weather delays buffer", planned: 5, actual: 3, status: "on_track" },
      { id: "bi_032", description: "Reshoot contingency", planned: 5, actual: 2, status: "on_track" },
      { id: "bi_033", description: "Miscellaneous", planned: 5, actual: 0, status: "pending" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// SHOOTING SCHEDULE
// ═══════════════════════════════════════════════════════════

export const shootingSchedule: ShootDay[] = [
  { id: "sd_001", dayNumber: 1, date: "2026-01-15", location: "Seshachalam Forest", scenes: ["sc_001"], status: "completed", notes: "Sunrise shoot completed successfully" },
  { id: "sd_002", dayNumber: 2, date: "2026-01-16", location: "Seshachalam Forest", scenes: ["sc_001"], status: "completed" },
  { id: "sd_003", dayNumber: 3, date: "2026-01-20", location: "Ramoji Film City - Village Set", scenes: ["sc_002"], status: "completed" },
  { id: "sd_004", dayNumber: 4, date: "2026-01-21", location: "Ramoji Film City - Village Set", scenes: ["sc_002"], status: "completed" },
  { id: "sd_005", dayNumber: 5, date: "2026-01-25", location: "Indoor Studio - House Set", scenes: ["sc_003"], status: "completed" },
  { id: "sd_006", dayNumber: 6, date: "2026-02-01", location: "Studio Set - Police Station", scenes: ["sc_011"], status: "completed" },
  { id: "sd_007", dayNumber: 7, date: "2026-02-05", location: "Vizag Port Area", scenes: ["sc_004"], status: "completed" },
  { id: "sd_008", dayNumber: 8, date: "2026-02-06", location: "Vizag Port Area", scenes: ["sc_004"], status: "completed" },
  { id: "sd_009", dayNumber: 9, date: "2026-02-10", location: "Ramoji Film City", scenes: ["sc_012"], status: "completed" },
  { id: "sd_010", dayNumber: 10, date: "2026-02-11", location: "Ramoji Film City", scenes: ["sc_012"], status: "delayed", notes: "Rain delay - shifted to next day" },
  { id: "sd_011", dayNumber: 11, date: "2026-02-20", location: "Outer Ring Road, Hyderabad", scenes: ["sc_005"], status: "planned" },
  { id: "sd_012", dayNumber: 12, date: "2026-02-21", location: "Outer Ring Road, Hyderabad", scenes: ["sc_005"], status: "planned" },
  { id: "sd_013", dayNumber: 13, date: "2026-02-22", location: "Outer Ring Road, Hyderabad", scenes: ["sc_005"], status: "planned" },
  { id: "sd_014", dayNumber: 14, date: "2026-03-01", location: "Switzerland", scenes: ["sc_006"], status: "planned" },
  { id: "sd_015", dayNumber: 15, date: "2026-03-02", location: "Switzerland", scenes: ["sc_006"], status: "planned" },
  { id: "sd_016", dayNumber: 16, date: "2026-03-03", location: "Switzerland", scenes: ["sc_006"], status: "planned" },
  { id: "sd_017", dayNumber: 17, date: "2026-03-15", location: "Indoor Studio - Office Set", scenes: ["sc_007"], status: "planned" },
  { id: "sd_018", dayNumber: 18, date: "2026-03-20", location: "Annapurna Studios", scenes: ["sc_008"], status: "planned" },
  { id: "sd_019", dayNumber: 19, date: "2026-03-21", location: "Annapurna Studios", scenes: ["sc_008"], status: "planned" },
  { id: "sd_020", dayNumber: 20, date: "2026-04-01", location: "Vizag Shipyard", scenes: ["sc_009"], status: "planned" },
  { id: "sd_021", dayNumber: 21, date: "2026-04-02", location: "Vizag Shipyard", scenes: ["sc_009"], status: "planned" },
  { id: "sd_022", dayNumber: 22, date: "2026-04-03", location: "Vizag Shipyard", scenes: ["sc_009"], status: "planned" },
  { id: "sd_023", dayNumber: 23, date: "2026-04-10", location: "Forest Set", scenes: ["sc_010"], status: "planned" },
];

// ═══════════════════════════════════════════════════════════
// ACTORS (Star Economics)
// ═══════════════════════════════════════════════════════════

export const actors: Actor[] = [
  { id: "act_001", name: "Allu Arjun", fee: 60, tier: "A", fanBaseScore: 96, overseasPull: 88, socialFollowing: 25000000 },
  { id: "act_002", name: "Rashmika Mandanna", fee: 8, tier: "A", fanBaseScore: 82, overseasPull: 72, socialFollowing: 42000000 },
  { id: "act_003", name: "Fahadh Faasil", fee: 12, tier: "A", fanBaseScore: 78, overseasPull: 65, socialFollowing: 8500000 },
  { id: "act_004", name: "Jagapathi Babu", fee: 2, tier: "B", fanBaseScore: 60, overseasPull: 35, socialFollowing: 1200000 },
  { id: "act_005", name: "Sunil", fee: 1.5, tier: "B", fanBaseScore: 55, overseasPull: 25, socialFollowing: 800000 },
  { id: "act_006", name: "Anasuya Bharadwaj", fee: 1, tier: "B", fanBaseScore: 58, overseasPull: 20, socialFollowing: 5500000 },
];

// ═══════════════════════════════════════════════════════════
// VFX SHOTS
// ═══════════════════════════════════════════════════════════

export const vfxShots: VfxShot[] = [
  { id: "vfx_001", sceneNumber: 1, shotNumber: 1, type: "composite", complexity: "medium", estimatedCost: 0.4, actualCost: 0.35, vendor: "DNEG", status: "approved", reworkCount: 0 },
  { id: "vfx_002", sceneNumber: 1, shotNumber: 2, type: "CGI", complexity: "medium", estimatedCost: 0.6, actualCost: 0.55, vendor: "DNEG", status: "approved", reworkCount: 1 },
  { id: "vfx_003", sceneNumber: 4, shotNumber: 1, type: "CGI", complexity: "high", estimatedCost: 1.2, actualCost: 0.8, vendor: "DNEG", status: "in_progress", reworkCount: 0 },
  { id: "vfx_004", sceneNumber: 4, shotNumber: 2, type: "crowd", complexity: "high", estimatedCost: 0.8, actualCost: 0, vendor: "Framestore", status: "pending", reworkCount: 0 },
  { id: "vfx_005", sceneNumber: 5, shotNumber: 1, type: "full_cg", complexity: "extreme", estimatedCost: 3.5, actualCost: 0, vendor: "DNEG", status: "pending", reworkCount: 0 },
  { id: "vfx_006", sceneNumber: 5, shotNumber: 2, type: "CGI", complexity: "extreme", estimatedCost: 2.5, actualCost: 0, vendor: "DNEG", status: "pending", reworkCount: 0 },
  { id: "vfx_007", sceneNumber: 8, shotNumber: 1, type: "composite", complexity: "medium", estimatedCost: 0.5, actualCost: 0, vendor: "Makuta VFX", status: "pending", reworkCount: 0 },
  { id: "vfx_008", sceneNumber: 9, shotNumber: 1, type: "full_cg", complexity: "extreme", estimatedCost: 4.0, actualCost: 0, vendor: "DNEG", status: "pending", reworkCount: 0 },
  { id: "vfx_009", sceneNumber: 9, shotNumber: 2, type: "CGI", complexity: "high", estimatedCost: 2.0, actualCost: 0, vendor: "Framestore", status: "pending", reworkCount: 0 },
  { id: "vfx_010", sceneNumber: 9, shotNumber: 3, type: "crowd", complexity: "high", estimatedCost: 1.5, actualCost: 0, vendor: "Makuta VFX", status: "pending", reworkCount: 0 },
  { id: "vfx_011", sceneNumber: 12, shotNumber: 1, type: "composite", complexity: "low", estimatedCost: 0.3, actualCost: 0.25, vendor: "Makuta VFX", status: "review", reworkCount: 0 },
  { id: "vfx_012", sceneNumber: 6, shotNumber: 1, type: "composite", complexity: "low", estimatedCost: 0.4, actualCost: 0, vendor: "Makuta VFX", status: "pending", reworkCount: 0 },
];

// ═══════════════════════════════════════════════════════════
// CAMPAIGNS (Marketing)
// ═══════════════════════════════════════════════════════════

export const campaigns: Campaign[] = [
  { id: "camp_001", name: "First Look Reveal", platform: "instagram", budget: 2.0, spent: 1.8, region: "Pan India", status: "completed", impressions: 85000000, engagement: 12500000, sentimentScore: 92 },
  { id: "camp_002", name: "Teaser Launch", platform: "youtube", budget: 5.0, spent: 4.5, region: "Pan India", status: "completed", impressions: 150000000, engagement: 45000000, sentimentScore: 95 },
  { id: "camp_003", name: "Trailer Campaign", platform: "youtube", budget: 8.0, spent: 3.2, region: "Pan India", status: "active", impressions: 45000000, engagement: 12000000, sentimentScore: 88 },
  { id: "camp_004", name: "Song Promo - Angaaron", platform: "instagram", budget: 3.0, spent: 1.5, region: "Telugu States", status: "active", impressions: 28000000, engagement: 8000000, sentimentScore: 91 },
  { id: "camp_005", name: "BTS Content Series", platform: "youtube", budget: 1.5, spent: 0.8, region: "Pan India", status: "active", impressions: 12000000, engagement: 3500000, sentimentScore: 87 },
  { id: "camp_006", name: "Fan Events & Meetups", platform: "x", budget: 2.0, spent: 0.5, region: "AP & TS", status: "planned", impressions: 0, engagement: 0, sentimentScore: 0 },
  { id: "camp_007", name: "International Trailer Push", platform: "youtube", budget: 3.0, spent: 0, region: "Overseas", status: "planned", impressions: 0, engagement: 0, sentimentScore: 0 },
];

// ═══════════════════════════════════════════════════════════
// REVENUE STREAMS
// ═══════════════════════════════════════════════════════════

export const revenueStreams: RevenueStream[] = [
  { id: "rev_001", type: "theatrical", territory: "Andhra Pradesh", projected: 110, actual: 0 },
  { id: "rev_002", type: "theatrical", territory: "Telangana", projected: 85, actual: 0 },
  { id: "rev_003", type: "theatrical", territory: "Karnataka", projected: 35, actual: 0 },
  { id: "rev_004", type: "theatrical", territory: "Tamil Nadu", projected: 25, actual: 0 },
  { id: "rev_005", type: "theatrical", territory: "Hindi Belt", projected: 180, actual: 0 },
  { id: "rev_006", type: "theatrical", territory: "Kerala", projected: 15, actual: 0 },
  { id: "rev_007", type: "overseas", territory: "USA", projected: 55, actual: 0 },
  { id: "rev_008", type: "overseas", territory: "Middle East", projected: 18, actual: 0 },
  { id: "rev_009", type: "overseas", territory: "Rest of World", projected: 12, actual: 0 },
  { id: "rev_010", type: "ott", territory: "Pan India", projected: 120, actual: 0 },
  { id: "rev_011", type: "satellite", territory: "Telugu", projected: 45, actual: 0 },
  { id: "rev_012", type: "satellite", territory: "Hindi", projected: 35, actual: 0 },
  { id: "rev_013", type: "music", territory: "Pan India", projected: 18, actual: 0 },
  { id: "rev_014", type: "dubbing", territory: "Tamil + Malayalam", projected: 8, actual: 0 },
];

// ═══════════════════════════════════════════════════════════
// APPROVALS
// ═══════════════════════════════════════════════════════════

export const approvals: Approval[] = [
  { id: "apr_001", type: "Budget", title: "VFX Budget Increase - Climax Sequence", description: "DNEG requesting additional ₹3.5 Cr for enhanced climax ship explosion VFX", requestedBy: "Srinivas Mohan", status: "pending", createdAt: "2026-02-08", amount: 3.5 },
  { id: "apr_002", type: "Schedule", title: "Switzerland Song Shoot Extension", description: "Additional 2 days needed for song shoot in Switzerland due to weather", requestedBy: "Rajesh Naidu", status: "pending", createdAt: "2026-02-09", amount: 1.8 },
  { id: "apr_003", type: "Vendor", title: "New VFX Vendor - Makuta VFX", description: "Proposal to onboard Makuta VFX for crowd multiplication shots", requestedBy: "Srinivas Mohan", status: "pending", createdAt: "2026-02-07" },
  { id: "apr_004", type: "Casting", title: "Item Song Choreographer Change", description: "Replace current choreographer with Prabhu Deva for item song", requestedBy: "Sukumar", status: "pending", createdAt: "2026-02-10", amount: 0.5 },
  { id: "apr_005", type: "Budget", title: "Set Construction Cost Overrun", description: "Village set at Ramoji exceeded budget by ₹2.5 Cr", requestedBy: "Rajesh Naidu", status: "approved", createdAt: "2026-01-28", amount: 2.5 },
  { id: "apr_006", type: "Marketing", title: "Teaser Launch Campaign Budget", description: "Digital marketing budget for teaser launch across platforms", requestedBy: "Priya Sharma", status: "approved", createdAt: "2026-01-20", amount: 5.0 },
];

// ═══════════════════════════════════════════════════════════
// RISK ALERTS
// ═══════════════════════════════════════════════════════════

export const riskAlerts: RiskAlert[] = [
  { id: "risk_001", type: "budget", severity: "high", description: "VFX costs trending 15% over budget due to complexity of climax sequence", impactAmount: 12, mitigated: false },
  { id: "risk_002", type: "schedule", severity: "medium", description: "Rain season approaching Vizag - outdoor shoots may face delays", impactAmount: 3.5, mitigated: false },
  { id: "risk_003", type: "actor", severity: "high", description: "Lead actor's availability conflict with brand shoot in March", impactAmount: 5, mitigated: false },
  { id: "risk_004", type: "vfx", severity: "medium", description: "DNEG capacity constraints may delay climax VFX delivery by 3 weeks", impactAmount: 4, mitigated: false },
  { id: "risk_005", type: "market", severity: "low", description: "Competitor film announced for same release window (Sankranti 2027)", impactAmount: 15, mitigated: false },
  { id: "risk_006", type: "weather", severity: "medium", description: "Switzerland shoot window has 40% precipitation probability", impactAmount: 2, mitigated: true },
  { id: "risk_007", type: "budget", severity: "critical", description: "Set construction overrun on 3 major sets, total impact ₹4.5 Cr", impactAmount: 4.5, mitigated: true },
];

// ═══════════════════════════════════════════════════════════
// DAILY PROGRESS
// ═══════════════════════════════════════════════════════════

export const dailyProgress: DailyProgress[] = [
  { id: "dp_001", date: "2026-02-10", scenesCompleted: 1, budgetSpentToday: 2.1, notes: "Village celebration song shot completed. Rain delay in afternoon.", issues: ["Rain delay - 2 hours lost", "Background dancer injured - minor"] },
  { id: "dp_002", date: "2026-02-09", scenesCompleted: 2, budgetSpentToday: 3.8, notes: "Port warehouse scenes progressing well. VFX team on set for reference.", issues: [] },
  { id: "dp_003", date: "2026-02-08", scenesCompleted: 1, budgetSpentToday: 2.5, notes: "Police station scene completed ahead of schedule.", issues: ["Sound recording issue - will need ADR"] },
  { id: "dp_004", date: "2026-02-07", scenesCompleted: 0, budgetSpentToday: 0.5, notes: "Rest day - only pre-production work", issues: [] },
  { id: "dp_005", date: "2026-02-06", scenesCompleted: 2, budgetSpentToday: 4.2, notes: "Vizag Port shoot day 2. Excellent progress.", issues: ["Tide timing affected one shot - rescheduled to evening"] },
];

// ═══════════════════════════════════════════════════════════
// DISTRIBUTION
// ═══════════════════════════════════════════════════════════

export const distributionTerritories: DistributionTerritory[] = [
  { id: "dist_001", territory: "Andhra Pradesh (Nizam)", mgValuation: 80, actualDeal: 75, distributor: "Mythri Movies", status: "confirmed" },
  { id: "dist_002", territory: "Andhra Pradesh (Ceded)", mgValuation: 30, actualDeal: 28, distributor: "Sri Venkateswara", status: "confirmed" },
  { id: "dist_003", territory: "Telangana", mgValuation: 65, actualDeal: 60, distributor: "Asian Films", status: "confirmed" },
  { id: "dist_004", territory: "Karnataka", mgValuation: 25, actualDeal: 22, distributor: "KRG Studios", status: "negotiating" },
  { id: "dist_005", territory: "Tamil Nadu", mgValuation: 20, actualDeal: 0, distributor: "TBD", status: "negotiating" },
  { id: "dist_006", territory: "Hindi Belt", mgValuation: 120, actualDeal: 0, distributor: "AA Films", status: "negotiating" },
  { id: "dist_007", territory: "USA", mgValuation: 40, actualDeal: 38, distributor: "Prathyangira Cinemas", status: "confirmed" },
  { id: "dist_008", territory: "UAE/GCC", mgValuation: 15, actualDeal: 0, distributor: "Phars Films", status: "negotiating" },
];

// ═══════════════════════════════════════════════════════════
// CREW
// ═══════════════════════════════════════════════════════════

export const crewMembers: CrewMember[] = [
  { id: "crew_001", name: "Sukumar", department: "Direction", role: "Director", dailyRate: 15, availability: "assigned" },
  { id: "crew_002", name: "Miroslaw Kuba Brozek", department: "Cinematography", role: "DoP", dailyRate: 3, availability: "assigned" },
  { id: "crew_003", name: "Naveen Nooli", department: "Editing", role: "Editor", dailyRate: 1.5, availability: "assigned" },
  { id: "crew_004", name: "S. Ramakrishna", department: "Art", role: "Production Designer", dailyRate: 1, availability: "assigned" },
  { id: "crew_005", name: "Ram-Lakshman", department: "Stunts", role: "Action Directors", dailyRate: 2, availability: "available" },
  { id: "crew_006", name: "DSP", department: "Music", role: "Music Director", dailyRate: 2.5, availability: "assigned" },
  { id: "crew_007", name: "Srinivas Mohan", department: "VFX", role: "VFX Supervisor", dailyRate: 1.5, availability: "assigned" },
  { id: "crew_008", name: "Sekhar Master", department: "Choreography", role: "Choreographer", dailyRate: 0.8, availability: "available" },
  { id: "crew_009", name: "Anand Sai", department: "Art", role: "Set Designer", dailyRate: 0.5, availability: "assigned" },
  { id: "crew_010", name: "Bhanu", department: "Costumes", role: "Costume Designer", dailyRate: 0.4, availability: "assigned" },
];

// ═══════════════════════════════════════════════════════════
// WHAT-IF SCENARIOS
// ═══════════════════════════════════════════════════════════

export const whatIfScenarios: WhatIfScenario[] = [
  {
    id: "wif_001", name: "Reduce VFX in Climax", description: "Replace full-CG ship with partial practical + CG composite",
    parameterChanges: { vfxBudget: -8, practicalCost: 3 },
    impactSummary: { budgetImpact: -5, scheduleImpact: -5, revenueImpact: -2, riskChange: "Reduces VFX delivery risk significantly" },
  },
  {
    id: "wif_002", name: "Add 3 Extra Shoot Days", description: "Additional coverage days for action sequences",
    parameterChanges: { shootDays: 3, dailyCost: 2.1 },
    impactSummary: { budgetImpact: 6.3, scheduleImpact: 3, revenueImpact: 0, riskChange: "Reduces reshoot probability by 40%" },
  },
  {
    id: "wif_003", name: "Shift Release to Summer", description: "Move from Sankranti to Summer 2027 window",
    parameterChanges: { releaseDate: "2027-05-01" },
    impactSummary: { budgetImpact: 2, scheduleImpact: 15, revenueImpact: -25, riskChange: "Less competition but lower festival premium" },
  },
  {
    id: "wif_004", name: "Replace Switzerland with Kashmir", description: "Song shoot at Kashmir instead of Switzerland",
    parameterChanges: { locationCost: -4, travelCost: -2, vfxEnhancement: 1 },
    impactSummary: { budgetImpact: -5, scheduleImpact: -2, revenueImpact: -1, riskChange: "Eliminates international travel logistics risk" },
  },
];

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS (per role)
// ═══════════════════════════════════════════════════════════

export const producerStats: StatItem[] = [
  { label: "Total Budget", value: "₹350 Cr", icon: "IndianRupee", color: "gold" },
  { label: "Spent", value: "₹187.5 Cr", change: 53.6, changeLabel: "of budget", icon: "TrendingUp", trend: "up", color: "warning" },
  { label: "Health Score", value: "78/100", change: -3, changeLabel: "vs last week", icon: "Shield", trend: "down", color: "info" },
  { label: "Days in Production", value: "42 / 85", icon: "Calendar", color: "gold" },
  { label: "Scenes Completed", value: "5 / 12", change: 41.7, changeLabel: "complete", icon: "CheckCircle", color: "success" },
  { label: "Pending Approvals", value: "4", icon: "AlertTriangle", color: "danger" },
];

export const directorStats: StatItem[] = [
  { label: "Today's Scenes", value: "2", icon: "Camera", color: "gold" },
  { label: "Shots Planned", value: "18", icon: "FileText", color: "info" },
  { label: "VFX Flagged", value: "3 scenes", icon: "Sparkles", color: "warning" },
  { label: "Schedule Status", value: "On Track", icon: "Calendar", color: "success" },
  { label: "Completed Scenes", value: "5 / 12", icon: "CheckCircle", color: "gold" },
  { label: "Cast Available Today", value: "4 / 6", icon: "Users", color: "info" },
];

export const productionHeadStats: StatItem[] = [
  { label: "Active Crew", value: "127", icon: "Users", color: "gold" },
  { label: "Today's Budget", value: "₹2.1 Cr", icon: "IndianRupee", color: "warning" },
  { label: "Schedule Variance", value: "+1 day", change: 1, trend: "down", icon: "Calendar", color: "danger" },
  { label: "Active Locations", value: "3", icon: "MapPin", color: "info" },
  { label: "Equipment Utilization", value: "84%", icon: "Wrench", color: "success" },
  { label: "Open Issues", value: "2", icon: "AlertTriangle", color: "warning" },
];

export const vfxHeadStats: StatItem[] = [
  { label: "Total Shots", value: "12", icon: "Layers", color: "gold" },
  { label: "Completed", value: "3", change: 25, changeLabel: "of total", icon: "CheckCircle", color: "success" },
  { label: "In Progress", value: "2", icon: "GitBranch", color: "info" },
  { label: "Rework Queue", value: "1", icon: "RotateCcw", color: "warning" },
  { label: "VFX Budget", value: "₹80 Cr", icon: "IndianRupee", color: "gold" },
  { label: "Spent", value: "₹32 Cr", change: 40, changeLabel: "utilized", icon: "TrendingUp", color: "info" },
];

export const financierStats: StatItem[] = [
  { label: "Total Investment", value: "₹350 Cr", icon: "PiggyBank", color: "gold" },
  { label: "Capital Deployed", value: "₹187.5 Cr", icon: "IndianRupee", color: "info" },
  { label: "Projected Revenue", value: "₹761 Cr", icon: "TrendingUp", color: "success" },
  { label: "Projected ROI", value: "2.17x", icon: "Target", color: "gold" },
  { label: "Risk Level", value: "Medium", icon: "Shield", color: "warning" },
  { label: "Break-even", value: "₹285 Cr", icon: "Target", color: "info" },
];

export const marketingHeadStats: StatItem[] = [
  { label: "Active Campaigns", value: "4", icon: "Megaphone", color: "gold" },
  { label: "Total Reach", value: "320M", icon: "Globe", color: "info" },
  { label: "Avg Sentiment", value: "89%", change: 3, trend: "up", icon: "Heart", color: "success" },
  { label: "Marketing Spend", value: "₹12.3 Cr", icon: "IndianRupee", color: "warning" },
  { label: "Engagement Rate", value: "8.2%", change: 1.5, trend: "up", icon: "TrendingUp", color: "gold" },
  { label: "Attributed Revenue", value: "₹45 Cr", icon: "Link", color: "success" },
];

// ═══════════════════════════════════════════════════════════
// LIVE PRODUCTION — Cameras, Sessions, Activity Log
// ═══════════════════════════════════════════════════════════

export const liveCameras: LiveCamera[] = [
  { id: "cam_a", label: "Camera A — Main", location: "Vizag Port Area", status: "live", resolution: "4K UHD", operator: "Ravi Kumar" },
  { id: "cam_b", label: "Camera B — Wide", location: "Vizag Port Area", status: "live", resolution: "1080p", operator: "Suresh Babu" },
  { id: "cam_c", label: "Camera C — Drone", location: "Vizag Port Aerial", status: "standby", resolution: "4K UHD", operator: "Karthik M." },
  { id: "cam_d", label: "Camera D — Steadicam", location: "Vizag Port Interior", status: "live", resolution: "1080p", operator: "Venkat R." },
];

export const liveStreamSessions: LiveStreamSession[] = [
  {
    id: "sess_001",
    sceneId: "sc_004",
    sceneNumber: 4,
    sceneDescription: "Smuggling warehouse raid sequence",
    status: "live",
    startTime: "2026-02-12T10:30:00",
    cameras: liveCameras,
    viewers: [
      { name: "Dil Raju", role: "Producer" },
      { name: "Studio Admin", role: "Admin" },
    ],
    shotNumber: 4,
    totalShots: 12,
    budgetBurn: 1.2,
    scheduledStart: "2026-02-12T10:00:00",
    isHighRisk: true,
  },
  {
    id: "sess_002",
    sceneId: "sc_012",
    sceneNumber: 12,
    sceneDescription: "Village celebration mass dance",
    status: "completed",
    startTime: "2026-02-12T07:00:00",
    endTime: "2026-02-12T09:45:00",
    cameras: liveCameras.map((c) => ({ ...c, status: "offline" as const })),
    viewers: [{ name: "Dil Raju", role: "Producer" }],
    shotNumber: 8,
    totalShots: 8,
    budgetBurn: 2.1,
    scheduledStart: "2026-02-12T07:00:00",
    isHighRisk: false,
  },
  {
    id: "sess_003",
    sceneId: "sc_005",
    sceneNumber: 5,
    sceneDescription: "Interval fight — Truck chase on highway",
    status: "scheduled",
    startTime: "2026-02-12T14:00:00",
    cameras: liveCameras.map((c) => ({ ...c, status: "offline" as const })),
    viewers: [],
    shotNumber: 0,
    totalShots: 18,
    budgetBurn: 0,
    scheduledStart: "2026-02-12T14:00:00",
    isHighRisk: true,
  },
  {
    id: "sess_004",
    sceneId: "sc_003",
    sceneNumber: 3,
    sceneDescription: "Srivalli emotional confrontation scene",
    status: "completed",
    startTime: "2026-02-11T15:00:00",
    endTime: "2026-02-11T17:30:00",
    cameras: liveCameras.slice(0, 2).map((c) => ({ ...c, status: "offline" as const })),
    viewers: [{ name: "Dil Raju", role: "Producer" }],
    shotNumber: 6,
    totalShots: 6,
    budgetBurn: 0.5,
    scheduledStart: "2026-02-11T15:00:00",
    isHighRisk: false,
  },
];

export const streamActivityLog: StreamActivityLog[] = [
  { id: "log_001", timestamp: "2026-02-12T10:30:00", type: "scene_start", message: "Scene 4 — Warehouse raid sequence started", user: "AD Team" },
  { id: "log_002", timestamp: "2026-02-12T10:35:00", type: "viewer_joined", message: "Dil Raju joined live stream", user: "Dil Raju" },
  { id: "log_003", timestamp: "2026-02-12T10:42:00", type: "shot_approved", message: "Shot 1 — Master wide approved by Director", user: "Sukumar" },
  { id: "log_004", timestamp: "2026-02-12T10:58:00", type: "shot_approved", message: "Shot 2 — Close-up Pushpa approved", user: "Sukumar" },
  { id: "log_005", timestamp: "2026-02-12T11:15:00", type: "alert", message: "30 min behind schedule — stunt setup delay" },
  { id: "log_006", timestamp: "2026-02-12T11:22:00", type: "viewer_joined", message: "Studio Admin joined live stream", user: "Admin" },
  { id: "log_007", timestamp: "2026-02-12T11:35:00", type: "shot_approved", message: "Shot 3 — Action sequence take approved", user: "Sukumar" },
  { id: "log_008", timestamp: "2026-02-12T09:45:00", type: "scene_wrap", message: "Scene 12 — Village celebration wrapped", user: "AD Team" },
  { id: "log_009", timestamp: "2026-02-12T07:00:00", type: "scene_start", message: "Scene 12 — Village celebration started", user: "AD Team" },
  { id: "log_010", timestamp: "2026-02-12T11:50:00", type: "shot_approved", message: "Shot 4 — Explosion wide take 2 approved", user: "Sukumar" },
];

// ═══════════════════════════════════════════════════════════
// STRIP BOARD
// ═══════════════════════════════════════════════════════════

export const stripBoardScenes: StripBoardScene[] = [
  { sceneId: "sc_001", sceneNumber: 1, description: "Opening - Red sandalwood forest chase at dawn", location: "Seshachalam Forest", complexity: "action", castNeeded: ["Pushpa", "Henchmen"], estimatedCost: 2.5, estimatedDuration: 3, order: 0 },
  { sceneId: "sc_002", sceneNumber: 2, description: "Pushpa's grand entry in village market", location: "Ramoji Film City - Village Set", complexity: "action", castNeeded: ["Pushpa", "Srivalli", "Villagers"], estimatedCost: 1.8, estimatedDuration: 2, order: 1 },
  { sceneId: "sc_011", sceneNumber: 11, description: "Police station confrontation", location: "Studio Set - Police Station", complexity: "dialogue", castNeeded: ["Pushpa", "SP Bhanwar Singh"], estimatedCost: 0.6, estimatedDuration: 1.5, order: 2 },
  { sceneId: "sc_003", sceneNumber: 3, description: "Srivalli emotional confrontation scene", location: "Indoor Studio - House Set", complexity: "dialogue", castNeeded: ["Pushpa", "Srivalli"], estimatedCost: 0.5, estimatedDuration: 1, order: 3 },
  { sceneId: "sc_004", sceneNumber: 4, description: "Smuggling warehouse raid sequence", location: "Vizag Port Area", complexity: "action", castNeeded: ["Pushpa", "Antagonist", "Police"], estimatedCost: 4.2, estimatedDuration: 4, order: 4 },
  { sceneId: "sc_012", sceneNumber: 12, description: "Village celebration mass dance", location: "Ramoji Film City", complexity: "song", castNeeded: ["Pushpa", "Srivalli", "Villagers", "Dancers"], estimatedCost: 3.5, estimatedDuration: 3, order: 5 },
  { sceneId: "sc_005", sceneNumber: 5, description: "Interval fight - Truck chase on highway", location: "Outer Ring Road, Hyderabad", complexity: "stunt", castNeeded: ["Pushpa", "Stunt doubles"], estimatedCost: 8.5, estimatedDuration: 6, order: 6 },
  { sceneId: "sc_007", sceneNumber: 7, description: "International syndicate boardroom scene", location: "Indoor Studio - Office Set", complexity: "dialogue", castNeeded: ["Antagonist", "Syndicate members"], estimatedCost: 0.8, estimatedDuration: 1, order: 7 },
  { sceneId: "sc_006", sceneNumber: 6, description: "Romantic song - Pushpa & Srivalli in Europe", location: "Switzerland", complexity: "song", castNeeded: ["Pushpa", "Srivalli", "Dancers"], estimatedCost: 5.0, estimatedDuration: 5, order: 8 },
  { sceneId: "sc_008", sceneNumber: 8, description: "Mass item song in underworld den", location: "Custom Built Set - Annapurna Studios", complexity: "song", castNeeded: ["Pushpa", "Item dancer", "Background dancers"], estimatedCost: 6.0, estimatedDuration: 4, order: 9 },
  { sceneId: "sc_009", sceneNumber: 9, description: "Climax fight on cargo ship", location: "Vizag Shipyard + VFX", complexity: "stunt", castNeeded: ["Pushpa", "Antagonist", "Stunt team"], estimatedCost: 12.0, estimatedDuration: 8, order: 10 },
  { sceneId: "sc_010", sceneNumber: 10, description: "Emotional climax - Pushpa's sacrifice scene", location: "Forest Set", complexity: "dialogue", castNeeded: ["Pushpa", "Srivalli", "Supporting cast"], estimatedCost: 1.5, estimatedDuration: 2, order: 11 },
];

export const dayBreaks: DayBreak[] = [
  { id: "db_001", dayNumber: 1, location: "Seshachalam Forest", afterOrder: -1 },
  { id: "db_002", dayNumber: 2, location: "Ramoji Film City", afterOrder: 1 },
  { id: "db_003", dayNumber: 3, location: "Studio Sets", afterOrder: 3 },
  { id: "db_004", dayNumber: 4, location: "Vizag Port Area", afterOrder: 5 },
  { id: "db_005", dayNumber: 5, location: "Outer Ring Road", afterOrder: 6 },
  { id: "db_006", dayNumber: 6, location: "Indoor Studio / Switzerland", afterOrder: 8 },
  { id: "db_007", dayNumber: 7, location: "Annapurna Studios", afterOrder: 9 },
  { id: "db_008", dayNumber: 8, location: "Vizag Shipyard", afterOrder: 10 },
];

// ═══════════════════════════════════════════════════════════
// PURCHASE ORDERS (Finance Module)
// ═══════════════════════════════════════════════════════════

export const purchaseOrders: PurchaseOrder[] = [
  { id: "po_001", poNumber: "PO-2026-001", vendor: "DNEG India", description: "VFX shots for climax ship explosion — 4 full-CG shots", category: "VFX & Post Production", amount: 4.5, requestedBy: "Srinivas Mohan", requestedDate: "2026-02-08", status: "pending" },
  { id: "po_002", poNumber: "PO-2026-002", vendor: "Ramoji Group", description: "Extended set rental — Village set for 10 additional days", category: "Locations & Sets", amount: 2.8, requestedBy: "Rajesh Naidu", requestedDate: "2026-02-07", status: "pending" },
  { id: "po_003", poNumber: "PO-2026-003", vendor: "DSP Music", description: "Background score recording — 45 tracks orchestral", category: "Music & Songs", amount: 1.2, requestedBy: "Sukumar", requestedDate: "2026-02-06", status: "pending" },
  { id: "po_004", poNumber: "PO-2026-004", vendor: "Framestore UK", description: "Crowd multiplication VFX for scenes 9, 12", category: "VFX & Post Production", amount: 2.0, requestedBy: "Srinivas Mohan", requestedDate: "2026-02-05", status: "approved", approvedBy: "Dil Raju", approvedDate: "2026-02-06" },
  { id: "po_005", poNumber: "PO-2026-005", vendor: "Swiss Location Services", description: "Location permits & logistics for Switzerland song shoot", category: "Locations & Sets", amount: 3.5, requestedBy: "Rajesh Naidu", requestedDate: "2026-02-04", status: "approved", approvedBy: "Dil Raju", approvedDate: "2026-02-05" },
  { id: "po_006", poNumber: "PO-2026-006", vendor: "Stunt Solutions Intl", description: "Stunt rigging equipment for highway chase sequence", category: "Production & Crew", amount: 0.8, requestedBy: "Ram-Lakshman", requestedDate: "2026-02-03", status: "approved", approvedBy: "Rajesh Naidu", approvedDate: "2026-02-04" },
  { id: "po_007", poNumber: "PO-2026-007", vendor: "Local Transport Co", description: "50 trucks rental for highway chase scene blocking", category: "Production & Crew", amount: 0.5, requestedBy: "Rajesh Naidu", requestedDate: "2026-02-01", status: "rejected", notes: "Too expensive, sourcing alternatives" },
  { id: "po_008", poNumber: "PO-2026-008", vendor: "Resul Pookutty Audio", description: "Dolby Atmos sound design & mixing sessions", category: "VFX & Post Production", amount: 1.8, requestedBy: "Sukumar", requestedDate: "2026-01-30", status: "approved", approvedBy: "Dil Raju", approvedDate: "2026-02-01" },
];

// ═══════════════════════════════════════════════════════════
// AUDIT ENTRIES (Finance Module)
// ═══════════════════════════════════════════════════════════

export const auditEntries: AuditEntry[] = [
  { id: "aud_001", timestamp: "2026-02-12T10:30:00", action: "PO Submitted", user: "Srinivas Mohan", module: "Finance", details: "PO-2026-001 submitted for DNEG India — ₹4.5 Cr VFX work", amount: 4.5, status: "info" },
  { id: "aud_002", timestamp: "2026-02-12T09:15:00", action: "Budget Revised", user: "Dil Raju", module: "Budget", details: "VFX budget category increased from ₹80 Cr to ₹85 Cr", amount: 5, status: "warning" },
  { id: "aud_003", timestamp: "2026-02-11T16:45:00", action: "PO Approved", user: "Dil Raju", module: "Finance", details: "PO-2026-004 approved — Framestore crowd VFX ₹2 Cr", amount: 2, status: "success" },
  { id: "aud_004", timestamp: "2026-02-11T14:20:00", action: "Payment Released", user: "Finance Team", module: "Finance", details: "Payment to Ramoji Group — Set rental Q1 ₹3.5 Cr", amount: 3.5, status: "success" },
  { id: "aud_005", timestamp: "2026-02-11T11:00:00", action: "PO Rejected", user: "Dil Raju", module: "Finance", details: "PO-2026-007 rejected — Transport rental too expensive", amount: 0.5, status: "warning" },
  { id: "aud_006", timestamp: "2026-02-10T15:30:00", action: "Cost Overrun Alert", user: "System", module: "Budget", details: "Set Construction category exceeded planned budget by 8.3%", status: "warning" },
  { id: "aud_007", timestamp: "2026-02-10T10:00:00", action: "PO Submitted", user: "Rajesh Naidu", module: "Finance", details: "PO-2026-002 submitted — Ramoji set rental extension", amount: 2.8, status: "info" },
  { id: "aud_008", timestamp: "2026-02-09T17:00:00", action: "Vendor Onboarded", user: "Srinivas Mohan", module: "VFX", details: "Makuta VFX onboarded as additional VFX vendor", status: "info" },
  { id: "aud_009", timestamp: "2026-02-09T12:00:00", action: "Budget Approval", user: "Dil Raju", module: "Budget", details: "Approved ₹2.5 Cr overrun for village set construction", amount: 2.5, status: "success" },
  { id: "aud_010", timestamp: "2026-02-08T09:30:00", action: "PO Approved", user: "Rajesh Naidu", module: "Finance", details: "PO-2026-006 approved — Stunt equipment ₹0.8 Cr", amount: 0.8, status: "success" },
];

// ═══════════════════════════════════════════════════════════
// ACTIVITY EVENTS (Global Audit Trail)
// ═══════════════════════════════════════════════════════════

export const activityEvents: ActivityEvent[] = [
  { id: "evt_001", timestamp: "2026-02-13T10:32:00", category: "approval", user: "Dil Raju", userRole: "Producer", description: "Approved VFX budget increase request for climax sequence", metadata: { amount: 3.5, module: "Budget", status: "approved" } },
  { id: "evt_002", timestamp: "2026-02-13T10:15:00", category: "schedule", user: "Rajesh Naidu", userRole: "Production Head", description: "Updated shoot schedule — added 2 extra days for highway chase", metadata: { module: "Schedule", oldValue: "3 days", newValue: "5 days" } },
  { id: "evt_003", timestamp: "2026-02-13T09:45:00", category: "budget", user: "Finance Team", userRole: "System", description: "Released payment to DNEG India for Q1 VFX deliverables", metadata: { amount: 8.5, module: "Finance", status: "completed" } },
  { id: "evt_004", timestamp: "2026-02-13T09:20:00", category: "access", user: "Studio Admin", userRole: "Admin", description: "Granted Makuta VFX team access to shot pipeline module", metadata: { module: "VFX" } },
  { id: "evt_005", timestamp: "2026-02-13T08:50:00", category: "system", user: "System", userRole: "System", description: "Daily backup completed — all project data synced", metadata: { module: "System", status: "success" } },
  { id: "evt_006", timestamp: "2026-02-12T17:30:00", category: "vfx", user: "Srinivas Mohan", userRole: "VFX Head", description: "Approved Shot 4 — Explosion wide take 2 from DNEG", metadata: { module: "VFX", status: "approved" } },
  { id: "evt_007", timestamp: "2026-02-12T16:00:00", category: "schedule", user: "AD Team", userRole: "Production", description: "Scene 4 — Warehouse raid sequence wrapped for the day", metadata: { module: "Production" } },
  { id: "evt_008", timestamp: "2026-02-12T15:20:00", category: "budget", user: "Rajesh Naidu", userRole: "Production Head", description: "Submitted PO for extended Ramoji Film City set rental", metadata: { amount: 2.8, module: "Finance", status: "pending" } },
  { id: "evt_009", timestamp: "2026-02-12T14:00:00", category: "marketing", user: "Priya Sharma", userRole: "Marketing Head", description: "Launched BTS content series Phase 2 on Instagram", metadata: { module: "Marketing", status: "active" } },
  { id: "evt_010", timestamp: "2026-02-12T11:15:00", category: "schedule", user: "System", userRole: "System", description: "Alert: Shoot running 30 min behind schedule — stunt setup delay", metadata: { module: "Production", status: "warning" } },
  { id: "evt_011", timestamp: "2026-02-12T10:30:00", category: "schedule", user: "AD Team", userRole: "Production", description: "Scene 4 — Warehouse raid sequence started shooting", metadata: { module: "Production" } },
  { id: "evt_012", timestamp: "2026-02-12T09:45:00", category: "schedule", user: "AD Team", userRole: "Production", description: "Scene 12 — Village celebration mass dance wrapped", metadata: { module: "Production", status: "completed" } },
  { id: "evt_013", timestamp: "2026-02-11T16:45:00", category: "approval", user: "Dil Raju", userRole: "Producer", description: "Approved PO-2026-004 — Framestore crowd VFX work", metadata: { amount: 2.0, module: "Finance", status: "approved" } },
  { id: "evt_014", timestamp: "2026-02-11T14:20:00", category: "budget", user: "Finance Team", userRole: "System", description: "Released payment to Ramoji Group — Set rental Q1", metadata: { amount: 3.5, module: "Finance", status: "completed" } },
  { id: "evt_015", timestamp: "2026-02-11T11:00:00", category: "approval", user: "Dil Raju", userRole: "Producer", description: "Rejected PO-2026-007 — Transport rental cost too high", metadata: { amount: 0.5, module: "Finance", status: "rejected" } },
  { id: "evt_016", timestamp: "2026-02-11T09:30:00", category: "vfx", user: "Srinivas Mohan", userRole: "VFX Head", description: "Submitted 3 new VFX shots for review — Scene 1 composites", metadata: { module: "VFX" } },
  { id: "evt_017", timestamp: "2026-02-10T15:30:00", category: "budget", user: "System", userRole: "System", description: "Cost overrun alert: Set Construction exceeded budget by 8.3%", metadata: { module: "Budget", status: "warning" } },
  { id: "evt_018", timestamp: "2026-02-10T12:00:00", category: "marketing", user: "Priya Sharma", userRole: "Marketing Head", description: "Song promo campaign 'Angaaron' reached 28M impressions", metadata: { module: "Marketing", status: "active" } },
  { id: "evt_019", timestamp: "2026-02-10T10:00:00", category: "schedule", user: "Rajesh Naidu", userRole: "Production Head", description: "Rain delay on Day 10 — Scene 12 shifted to next day", metadata: { module: "Schedule", status: "warning" } },
  { id: "evt_020", timestamp: "2026-02-09T17:00:00", category: "vfx", user: "Srinivas Mohan", userRole: "VFX Head", description: "Onboarded Makuta VFX as additional vendor for crowd shots", metadata: { module: "VFX" } },
  { id: "evt_021", timestamp: "2026-02-09T12:00:00", category: "approval", user: "Dil Raju", userRole: "Producer", description: "Approved ₹2.5 Cr budget overrun for village set construction", metadata: { amount: 2.5, module: "Budget", status: "approved" } },
  { id: "evt_022", timestamp: "2026-02-08T15:00:00", category: "schedule", user: "AD Team", userRole: "Production", description: "Police station scene completed ahead of schedule", metadata: { module: "Production", status: "completed" } },
  { id: "evt_023", timestamp: "2026-02-08T09:30:00", category: "approval", user: "Rajesh Naidu", userRole: "Production Head", description: "Approved PO-2026-006 — Stunt rigging equipment ₹0.8 Cr", metadata: { amount: 0.8, module: "Finance", status: "approved" } },
  { id: "evt_024", timestamp: "2026-02-07T14:00:00", category: "access", user: "Studio Admin", userRole: "Admin", description: "Updated user permissions — added Director view for Script Import", metadata: { module: "System" } },
  { id: "evt_025", timestamp: "2026-02-07T10:00:00", category: "system", user: "System", userRole: "System", description: "Platform maintenance completed — performance optimization deployed", metadata: { module: "System", status: "success" } },
];
