"use client";

import { useState, useMemo, useEffect } from "react";
import { scenes, vfxShots, actors, shootingSchedule } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { scriptTranslations } from "@/lib/translations/script";
import type { Scene, VfxShot, Actor } from "@/lib/types";

// ═══════════════════════════════════════════════════════════
// LOCAL INTERFACES
// ═══════════════════════════════════════════════════════════

interface SafetyRisk {
  level: "low" | "medium" | "high" | "critical";
  score: number;
  factors: string[];
}

interface SceneIntelligence {
  scene: Scene;
  feasibility: number;
  aiCost: number;
  intensity: number;
  estimatedShots: number;
  safetyRisk: SafetyRisk;
  linkedVfxShots: VfxShot[];
  linkedActors: { actor: Actor; role: string }[];
  shootDays: number;
}

interface FeasibilityBreakdown {
  costFactor: number;
  vfxFactor: number;
  durationFactor: number;
  castComplexity: number;
  locationDifficulty: number;
}

interface ShotListItem {
  shotNumber: number;
  type: string;
  cameraMovement: string;
  estDuration: string;
  lighting: string;
}

interface SimulationResult {
  totalCost: number;
  feasibility: number;
  massAppeal: number;
  classAppeal: number;
  shootDays: number;
  vfxShotCount: number;
  sceneCount: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTS & MAPPINGS
// ═══════════════════════════════════════════════════════════

const castToActorMap: Record<string, string> = {
  Pushpa: "Allu Arjun",
  Srivalli: "Rashmika Mandanna",
  Antagonist: "Fahadh Faasil",
  "SP Bhanwar Singh": "Jagapathi Babu",
};

const complexityColors: Record<string, { bg: string; border: string; text: string }> = {
  action: { bg: "#C4A04220", border: "#C4A042", text: "#C4A042" },
  dialogue: { bg: "#5B7C8C20", border: "#5B7C8C", text: "#5B7C8C" },
  vfx: { bg: "#C4A88220", border: "#C4A882", text: "#C4A882" },
  romantic: { bg: "#C45C5C20", border: "#C45C5C", text: "#C45C5C" },
  song: { bg: "#8B735520", border: "#8B7355", text: "#D4B892" },
  stunt: { bg: "#5B8C5A20", border: "#5B8C5A", text: "#5B8C5A" },
};

const directorStyles: Record<string, { camera: string; framing: string; lighting: string; signature: string }> = {
  action: { camera: "Handheld + Steadicam", framing: "Low-angle hero shots", lighting: "High-contrast chiaroscuro", signature: "Slow-motion power walk with dust particles" },
  dialogue: { camera: "Locked tripod, dolly-in", framing: "Tight close-ups, eye-level", lighting: "Soft key with warm fill", signature: "Long unbroken takes with subtle rack focus" },
  song: { camera: "Crane + dolly track", framing: "Wide establishing, cut to dance close-ups", lighting: "Colorful with gel lighting", signature: "360-degree spinning hero shot with confetti" },
  stunt: { camera: "Multi-cam crash coverage", framing: "Dutch angles, extreme low", lighting: "Harsh practicals + fire FX", signature: "Under-crank speed ramp on impact" },
  romantic: { camera: "Steadicam float", framing: "Two-shot with bokeh background", lighting: "Golden hour backlight", signature: "Silhouette shot against sunset" },
  vfx: { camera: "Motion control rig", framing: "Wide to show scale", lighting: "HDRI matched", signature: "Camera through impossible geometry" },
};

const shotTemplates: Record<string, ShotListItem[]> = {
  action: [
    { shotNumber: 1, type: "Wide Establishing", cameraMovement: "Crane down", estDuration: "8s", lighting: "High key dramatic" },
    { shotNumber: 2, type: "Tracking Shot", cameraMovement: "Steadicam follow", estDuration: "12s", lighting: "Naturalistic" },
    { shotNumber: 3, type: "Close-up Reaction", cameraMovement: "Static push-in", estDuration: "4s", lighting: "Key light emphasis" },
    { shotNumber: 4, type: "Aerial Wide", cameraMovement: "Drone orbit", estDuration: "10s", lighting: "Available light" },
    { shotNumber: 5, type: "Slow-mo Impact", cameraMovement: "Phantom high-speed", estDuration: "6s", lighting: "High contrast" },
    { shotNumber: 6, type: "POV Action", cameraMovement: "Handheld", estDuration: "5s", lighting: "Practical sources" },
  ],
  dialogue: [
    { shotNumber: 1, type: "Two-shot Master", cameraMovement: "Static tripod", estDuration: "30s", lighting: "Soft key, warm fill" },
    { shotNumber: 2, type: "OTS - Character A", cameraMovement: "Dolly-in slow", estDuration: "15s", lighting: "Key light camera-side" },
    { shotNumber: 3, type: "OTS - Character B", cameraMovement: "Dolly-in slow", estDuration: "15s", lighting: "Matched reverse" },
    { shotNumber: 4, type: "Close-up A", cameraMovement: "Static, slight float", estDuration: "8s", lighting: "Eyelight emphasis" },
    { shotNumber: 5, type: "Close-up B", cameraMovement: "Static, slight float", estDuration: "8s", lighting: "Matched intensity" },
  ],
  song: [
    { shotNumber: 1, type: "Crane Wide", cameraMovement: "Crane jib up-and-over", estDuration: "12s", lighting: "Colored gels, party" },
    { shotNumber: 2, type: "Dolly Track", cameraMovement: "Lateral dolly", estDuration: "10s", lighting: "Moving spotlights" },
    { shotNumber: 3, type: "Dance Close-ups", cameraMovement: "Handheld float", estDuration: "6s", lighting: "Rim light emphasis" },
    { shotNumber: 4, type: "Aerial Formation", cameraMovement: "Drone top-down", estDuration: "8s", lighting: "Broad daylight" },
    { shotNumber: 5, type: "Hero Portrait", cameraMovement: "360-degree spin rig", estDuration: "10s", lighting: "Beauty lighting" },
    { shotNumber: 6, type: "Crowd Reaction", cameraMovement: "Long lens static", estDuration: "5s", lighting: "Available" },
  ],
  stunt: [
    { shotNumber: 1, type: "Wide Safety Master", cameraMovement: "Locked wide", estDuration: "15s", lighting: "Full coverage" },
    { shotNumber: 2, type: "Crash Cam A", cameraMovement: "Fixed crash housing", estDuration: "4s", lighting: "Practical + fire" },
    { shotNumber: 3, type: "Crash Cam B", cameraMovement: "Fixed crash housing", estDuration: "4s", lighting: "Practical + fire" },
    { shotNumber: 4, type: "Speed Ramp Hero", cameraMovement: "Under-crank to over-crank", estDuration: "8s", lighting: "Harsh cross-light" },
    { shotNumber: 5, type: "Wire Shot", cameraMovement: "Tracking with wire rig", estDuration: "6s", lighting: "Dramatic side light" },
    { shotNumber: 6, type: "Aerial Stunt Wide", cameraMovement: "Drone tracking", estDuration: "10s", lighting: "Natural" },
    { shotNumber: 7, type: "Reaction Close-up", cameraMovement: "Static", estDuration: "3s", lighting: "Key emphasis" },
  ],
  romantic: [
    { shotNumber: 1, type: "Wide Establishing", cameraMovement: "Steadicam approach", estDuration: "12s", lighting: "Golden hour" },
    { shotNumber: 2, type: "Two-shot Float", cameraMovement: "Steadicam orbit", estDuration: "15s", lighting: "Backlit bokeh" },
    { shotNumber: 3, type: "Close-up A", cameraMovement: "Dolly-in gentle", estDuration: "8s", lighting: "Soft beauty" },
    { shotNumber: 4, type: "Close-up B", cameraMovement: "Dolly-in gentle", estDuration: "8s", lighting: "Warm backlight" },
    { shotNumber: 5, type: "Silhouette Wide", cameraMovement: "Static tripod", estDuration: "10s", lighting: "Contra-jour" },
  ],
  vfx: [
    { shotNumber: 1, type: "Plate - Wide", cameraMovement: "Motion control track", estDuration: "12s", lighting: "HDRI reference" },
    { shotNumber: 2, type: "Green Screen A", cameraMovement: "Locked", estDuration: "10s", lighting: "Even green spill control" },
    { shotNumber: 3, type: "Green Screen B", cameraMovement: "Tilt up", estDuration: "8s", lighting: "Matched to plate" },
    { shotNumber: 4, type: "Reference Pass", cameraMovement: "Match to plate", estDuration: "12s", lighting: "Chrome ball + gray ball" },
    { shotNumber: 5, type: "Clean Plate", cameraMovement: "Repeat motion control", estDuration: "12s", lighting: "Matched" },
  ],
};

type TabId = "overview" | "feasibility" | "appeal" | "simulator" | "shotlist" | "safety";

// ═══════════════════════════════════════════════════════════
// COMPUTATION FUNCTIONS
// ═══════════════════════════════════════════════════════════

function computeFeasibilityBreakdown(scene: Scene): FeasibilityBreakdown {
  const maxCost = 12;
  const costFactor = Math.max(1, Math.min(10, 10 - (scene.estimatedCost / maxCost) * 9));
  const vfxMap: Record<string, number> = { low: 8, medium: 6, high: 4, extreme: 2 };
  const vfxFactor = scene.vfxRequired ? (vfxMap[scene.vfxIntensity || "low"] || 8) : 10;
  const durationFactor = Math.max(1, Math.min(10, 10 - (scene.estimatedDuration / 8) * 6));
  const castComplexity = Math.max(1, Math.min(10, 10 - (scene.castNeeded.length / 5) * 4));
  const isOutdoor = /Forest|Port|Road|Switzerland|Shipyard/.test(scene.location);
  const isInternational = scene.location.includes("Switzerland");
  const locationDifficulty = isInternational ? 3 : isOutdoor ? 5 : 9;
  return { costFactor, vfxFactor, durationFactor, castComplexity, locationDifficulty };
}

function computeFeasibility(scene: Scene): number {
  const b = computeFeasibilityBreakdown(scene);
  const score = b.costFactor * 0.25 + b.vfxFactor * 0.25 + b.durationFactor * 0.15 + b.castComplexity * 0.15 + b.locationDifficulty * 0.2;
  return Math.round(score * 10) / 10;
}

function computeAICost(scene: Scene, linkedVfx: VfxShot[]): number {
  const baseCost = scene.estimatedCost;
  const vfxAddon = linkedVfx.reduce((sum, v) => sum + v.estimatedCost, 0);
  const crewFactor = scene.complexity === "action" || scene.complexity === "stunt" ? 0.15 : 0.08;
  const locationFactor = scene.location.includes("Switzerland") ? 0.25 : /Port|Shipyard/.test(scene.location) ? 0.12 : 0.05;
  return Math.round((baseCost + vfxAddon + baseCost * crewFactor + baseCost * locationFactor) * 10) / 10;
}

function computeIntensity(scene: Scene): number {
  const cMap: Record<string, number> = { action: 4, stunt: 5, vfx: 3, song: 2, romantic: 1, dialogue: 1 };
  const base = cMap[scene.complexity] || 1;
  const vfxBonus = scene.vfxRequired ? (scene.vfxIntensity === "extreme" ? 1 : scene.vfxIntensity === "high" ? 0.5 : 0) : 0;
  return Math.min(5, Math.round((base + vfxBonus) * 10) / 10);
}

function estimateShots(scene: Scene): number {
  const m: Record<string, number> = { action: 8, stunt: 10, vfx: 6, song: 7, romantic: 5, dialogue: 4 };
  return Math.round(scene.estimatedDuration * (m[scene.complexity] || 5));
}

function computeSafetyRisk(scene: Scene): SafetyRisk {
  const factors: string[] = [];
  let score = 0;
  if (scene.complexity === "stunt") { score += 35; factors.push("Stunt sequences"); }
  if (scene.complexity === "action") { score += 20; factors.push("Action choreography"); }
  if (scene.castNeeded.some(c => c.includes("Stunt"))) { score += 15; factors.push("Stunt doubles required"); }
  if (scene.castNeeded.some(c => /crowd|Villagers|Dancers|Background/i.test(c))) { score += 15; factors.push("Crowd management"); }
  if (scene.vfxRequired && (scene.vfxIntensity === "extreme" || scene.vfxIntensity === "high")) { score += 10; factors.push("High-intensity VFX environment"); }
  const isOutdoor = /Forest|Port|Road|Shipyard/.test(scene.location);
  if (isOutdoor) { score += 10; factors.push("Outdoor location"); }
  if (scene.location.includes("Switzerland")) { score += 5; factors.push("International location logistics"); }
  const level: SafetyRisk["level"] = score >= 50 ? "critical" : score >= 35 ? "high" : score >= 20 ? "medium" : "low";
  return { level, score: Math.min(100, score), factors };
}

function computeMassAppeal(sceneList: Scene[]): number {
  if (sceneList.length === 0) return 0;
  const massCount = sceneList.filter(s => ["action", "stunt", "song"].includes(s.complexity)).length;
  return Math.round((massCount / sceneList.length) * 100);
}

function computeClassAppeal(sceneList: Scene[]): number {
  if (sceneList.length === 0) return 0;
  const classCount = sceneList.filter(s => ["dialogue", "romantic"].includes(s.complexity)).length;
  return Math.round((classCount / sceneList.length) * 100);
}

function computeScriptHealth(sceneList: Scene[], totalCost: number): number {
  const completionScore = (sceneList.filter(s => s.status === "completed").length / sceneList.length) * 40;
  const budgetEfficiency = Math.max(0, 30 - (totalCost / 50) * 10);
  const vfxReadiness = (sceneList.filter(s => !s.vfxRequired || s.status === "completed").length / sceneList.length) * 30;
  return Math.round(completionScore + budgetEfficiency + vfxReadiness);
}

function computeVfxIntensityScore(sceneList: Scene[]): number {
  const vfxScenes = sceneList.filter(s => s.vfxRequired);
  if (vfxScenes.length === 0) return 0;
  const iMap: Record<string, number> = { low: 2, medium: 5, high: 7, extreme: 10 };
  const total = vfxScenes.reduce((sum, s) => sum + (iMap[s.vfxIntensity || "low"] || 2), 0);
  return Math.round((total / vfxScenes.length) * 10) / 10;
}

function getLinkedVfxShots(scene: Scene): VfxShot[] {
  return vfxShots.filter(v => v.sceneNumber === scene.sceneNumber);
}

function getLinkedActors(scene: Scene): { actor: Actor; role: string }[] {
  const result: { actor: Actor; role: string }[] = [];
  scene.castNeeded.forEach(role => {
    const actorName = castToActorMap[role];
    if (actorName) {
      const found = actors.find(a => a.name === actorName);
      if (found) result.push({ actor: found, role });
    }
  });
  return result;
}

function getShootDays(scene: Scene): number {
  return shootingSchedule.filter(sd => sd.scenes.includes(scene.id)).length;
}

function computeSimulation(sceneList: Scene[]): SimulationResult {
  const totalCost = sceneList.reduce((sum, s) => sum + s.estimatedCost, 0);
  const feasibility = sceneList.length > 0
    ? sceneList.reduce((sum, s) => sum + computeFeasibility(s), 0) / sceneList.length
    : 0;
  const massAppeal = computeMassAppeal(sceneList);
  const classAppeal = computeClassAppeal(sceneList);
  const shootDays = sceneList.reduce((sum, s) => sum + Math.ceil(s.estimatedDuration / 8) + 1, 0);
  const vfxShotCount = sceneList.reduce((sum, s) => sum + getLinkedVfxShots(s).length, 0);
  return { totalCost, feasibility, massAppeal, classAppeal, shootDays, vfxShotCount, sceneCount: sceneList.length };
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function ScriptIntelligencePage() {
  const { t } = useTranslation(scriptTranslations);

  const tabList: { id: TabId; label: string; icon: string }[] = [
    { id: "overview", label: t("tabOverview"), icon: "LayoutDashboard" },
    { id: "feasibility", label: t("tabFeasibility"), icon: "Target" },
    { id: "appeal", label: t("tabAppeal"), icon: "Flame" },
    { id: "simulator", label: t("tabSimulator"), icon: "GitBranch" },
    { id: "shotlist", label: t("tabShotList"), icon: "Camera" },
    { id: "safety", label: t("tabSafety"), icon: "HardHat" },
  ];

  const uploadStageKeys = [
    "parsingPdf",
    "identifyingSceneBreaks",
    "extractingLocations",
    "mappingCharacters",
    "analyzingVfxRequirements",
    "computingFeasibilityScores",
    "generatingShotLists",
  ];

  const uploadStages = uploadStageKeys.map(k => t(k));

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStage, setUploadStage] = useState(-1);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFeasibilityScene, setSelectedFeasibilityScene] = useState<Scene | null>(null);
  const [activeScenarios, setActiveScenarios] = useState<Set<string>>(new Set());
  const [actionMultiplier, setActionMultiplier] = useState(1.0);
  const [vfxScale, setVfxScale] = useState(1.0);
  const [songCount, setSongCount] = useState(3);
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set());

  // ─── Scene Intelligence Data ───
  const sceneIntelligence = useMemo((): SceneIntelligence[] => {
    return scenes.map(scene => ({
      scene,
      feasibility: computeFeasibility(scene),
      aiCost: computeAICost(scene, getLinkedVfxShots(scene)),
      intensity: computeIntensity(scene),
      estimatedShots: estimateShots(scene),
      safetyRisk: computeSafetyRisk(scene),
      linkedVfxShots: getLinkedVfxShots(scene),
      linkedActors: getLinkedActors(scene),
      shootDays: getShootDays(scene),
    }));
  }, []);

  // ─── Global Metrics ───
  const globalMetrics = useMemo(() => {
    const totalCost = scenes.reduce((sum, s) => sum + s.estimatedCost, 0);
    const scriptHealth = computeScriptHealth(scenes, totalCost);
    const avgFeasibility = sceneIntelligence.reduce((sum, si) => sum + si.feasibility, 0) / sceneIntelligence.length;
    const vfxIntensity = computeVfxIntensityScore(scenes);
    const massAppeal = computeMassAppeal(scenes);
    const classAppeal = computeClassAppeal(scenes);
    const highRiskCount = sceneIntelligence.filter(si => si.safetyRisk.level === "high" || si.safetyRisk.level === "critical").length;
    return { totalCost, scriptHealth, avgFeasibility: Math.round(avgFeasibility * 10) / 10, vfxIntensity, massAppeal, classAppeal, highRiskCount, scenesAnalyzed: scenes.length };
  }, [sceneIntelligence]);

  // ─── Narrative Simulation ───
  const baselineResult = useMemo(() => computeSimulation(scenes), []);

  const simulatedResult = useMemo((): SimulationResult => {
    let modifiedScenes = [...scenes];
    if (activeScenarios.has("remove-switzerland")) {
      modifiedScenes = modifiedScenes.filter(s => s.sceneNumber !== 6);
    }
    if (activeScenarios.has("simplify-climax")) {
      modifiedScenes = modifiedScenes.map(s =>
        s.sceneNumber === 9 ? { ...s, estimatedCost: s.estimatedCost * 0.6, vfxIntensity: "medium" as const } : s
      );
    }
    if (activeScenarios.has("add-flashback")) {
      const flashback: Scene = {
        id: "sc_sim_fb", sceneNumber: 99, description: "Emotional flashback - Pushpa's childhood",
        location: "Indoor Studio", complexity: "dialogue", estimatedCost: 0.8, estimatedDuration: 1.5,
        vfxRequired: false, status: "planned", castNeeded: ["Pushpa"],
      };
      modifiedScenes = [...modifiedScenes, flashback];
    }
    if (activeScenarios.has("replace-truck")) {
      modifiedScenes = modifiedScenes.map(s =>
        s.sceneNumber === 5 ? { ...s, description: "Interval fight - Rooftop chase sequence", estimatedCost: 5.0, complexity: "action" as const, vfxIntensity: "high" as const } : s
      );
    }
    if (activeScenarios.has("cut-item-song")) {
      modifiedScenes = modifiedScenes.filter(s => s.sceneNumber !== 8);
    }
    modifiedScenes = modifiedScenes.map(s => {
      const modified = { ...s };
      if (s.complexity === "action" || s.complexity === "stunt") {
        modified.estimatedCost = s.estimatedCost * actionMultiplier;
      }
      if (s.vfxRequired) {
        const levels: Scene["vfxIntensity"][] = ["low", "medium", "high", "extreme"];
        const curIdx = levels.indexOf(s.vfxIntensity || "low");
        const newIdx = Math.min(3, Math.max(0, Math.round(curIdx * vfxScale)));
        modified.vfxIntensity = levels[newIdx];
      }
      return modified;
    });
    const currentSongs = modifiedScenes.filter(s => s.complexity === "song");
    if (songCount < currentSongs.length) {
      let toRemove = currentSongs.length - songCount;
      modifiedScenes = modifiedScenes.filter(s => {
        if (s.complexity === "song" && toRemove > 0) { toRemove--; return false; }
        return true;
      });
    }
    return computeSimulation(modifiedScenes);
  }, [activeScenarios, actionMultiplier, vfxScale, songCount]);

  // ─── Upload animation ───
  useEffect(() => {
    if (!showUploadModal) {
      setUploadStage(-1);
      setUploadComplete(false);
    }
  }, [showUploadModal]);

  const startUpload = () => {
    setUploadStage(0);
    setUploadComplete(false);
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage >= uploadStageKeys.length) {
        clearInterval(interval);
        setUploadComplete(true);
      } else {
        setUploadStage(stage);
      }
    }, 800);
  };

  // ─── Feasibility ranked ───
  const rankedByFeasibility = useMemo(() => {
    return [...sceneIntelligence].sort((a, b) => b.feasibility - a.feasibility);
  }, [sceneIntelligence]);

  // ─── Scene composition for appeal ───
  const sceneComposition = useMemo(() => {
    const counts: Record<string, number> = {};
    scenes.forEach(s => { counts[s.complexity] = (counts[s.complexity] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / scenes.length) * 100),
    }));
  }, []);

  const toggleScenario = (id: string) => {
    setActiveScenarios(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleExpandScene = (id: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ─── Safety data ───
  const crowdScenes = useMemo(() => {
    return sceneIntelligence.filter(si =>
      si.scene.castNeeded.some(c => /Villagers|Dancers|Background|crowd/i.test(c))
    ).map(si => {
      const castWithCrowd = si.scene.castNeeded.filter(c => /Villagers|Dancers|Background/i.test(c));
      const estCrowdSize = castWithCrowd.length * 80 + (si.scene.complexity === "song" ? 100 : 20);
      const managementLevel = estCrowdSize > 200 ? "High" : estCrowdSize > 100 ? "Medium" : "Standard";
      return { ...si, estCrowdSize, managementLevel };
    });
  }, [sceneIntelligence]);

  const highRiskScenes = useMemo(() => {
    return sceneIntelligence.filter(si => si.safetyRisk.level === "high" || si.safetyRisk.level === "critical");
  }, [sceneIntelligence]);

  // ─── Delta renderer ───
  const renderDelta = (baseline: number, simulated: number, isCurrency = false) => {
    const delta = simulated - baseline;
    const pct = baseline !== 0 ? ((delta / baseline) * 100) : 0;
    if (Math.abs(delta) < 0.01) return <span style={{ color: "#6B6560", fontSize: "12px" }}>{t("noChange")}</span>;
    const isUp = delta > 0;
    const color = isUp ? "#C45C5C" : "#5B8C5A";
    const arrow = isUp ? "\u2191" : "\u2193";
    return (
      <span style={{ color, fontSize: "12px", fontWeight: "600" }}>
        {arrow} {isCurrency ? formatCrores(Math.abs(delta)) : Math.abs(delta).toFixed(1)} ({Math.abs(pct).toFixed(1)}%)
      </span>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div style={{ background: "#1A1A1A", minHeight: "100vh", padding: "32px" }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 8px #5B8C5A40; } 50% { box-shadow: 0 0 16px #5B8C5A80; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progressBar { from { width: 0; } to { width: 100%; } }
      `}</style>

      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>

        {/* ═══════ HEADER ═══════ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "12px", background: "linear-gradient(135deg, #262626, #333333)", borderRadius: "14px", border: "1px solid #C4A88240" }}>
              <LucideIcon name="Sparkles" size={28} style={{ color: "#C4A882" }} />
            </div>
            <div>
              <h1 style={{
                fontSize: "32px", fontWeight: "700", margin: 0,
                background: "linear-gradient(90deg, #E8E0D4, #C4A882, #E8E0D4)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}>
                {t("pageTitle")}
              </h1>
              <p style={{ fontSize: "14px", color: "#9A9080", margin: "4px 0 0 0" }}>
                {t("pageSubtitle")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
              background: "#5B8C5A15", border: "1px solid #5B8C5A40", borderRadius: "10px",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5B8C5A" }} />
              <span style={{ fontSize: "13px", color: "#5B8C5A", fontWeight: "600" }}>{t("agiActive")}</span>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                padding: "10px 20px", background: "#C4A882", border: "none", borderRadius: "10px",
                color: "#1A1A1A", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <LucideIcon name="FileText" size={16} />
              {t("uploadScript")}
            </button>
            <div style={{
              display: "flex", gap: "16px", padding: "8px 20px",
              background: "#262626", border: "1px solid #3A3A3A", borderRadius: "10px",
            }}>
              <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{scenes.length} {t("scenes")}</span>
              <span style={{ fontSize: "13px", color: "#6B6560" }}>|</span>
              <span style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "600" }}>{formatCrores(globalMetrics.totalCost)}</span>
              <span style={{ fontSize: "13px", color: "#6B6560" }}>|</span>
              <span style={{ fontSize: "13px", color: globalMetrics.scriptHealth >= 60 ? "#5B8C5A" : "#C45C5C", fontWeight: "600" }}>
                {t("health")}: {globalMetrics.scriptHealth}/100
              </span>
            </div>
          </div>
        </div>

        {/* ═══════ STATS ROW ═══════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: t("scriptHealth"), value: `${globalMetrics.scriptHealth}/100`, icon: "Shield", color: globalMetrics.scriptHealth >= 60 ? "#5B8C5A" : "#C45C5C" },
            { label: t("feasibilityIndex"), value: `${globalMetrics.avgFeasibility}/10`, icon: "Target", color: "#C4A882" },
            { label: t("totalScriptCost"), value: formatCrores(globalMetrics.totalCost), icon: "IndianRupee", color: "#C4A042" },
            { label: t("vfxIntensity"), value: `${globalMetrics.vfxIntensity}/10`, icon: "Sparkles", color: "#C4A882" },
            { label: t("massAppeal"), value: `${globalMetrics.massAppeal}/100`, icon: "Flame", color: "#C45C5C" },
            { label: t("classAppeal"), value: `${globalMetrics.classAppeal}/100`, icon: "Star", color: "#5B7C8C" },
            { label: t("safetyRisks"), value: `${globalMetrics.highRiskCount} ${t("highRisk")}`, icon: "HardHat", color: globalMetrics.highRiskCount > 2 ? "#C45C5C" : "#C4A042" },
            { label: t("scenesAnalyzed"), value: `${globalMetrics.scenesAnalyzed}/${globalMetrics.scenesAnalyzed}`, icon: "FileText", color: "#5B8C5A" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#262626", border: "1px solid #3A3A3A", borderRadius: "14px", padding: "18px",
              animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ padding: "6px", background: `${stat.color}15`, borderRadius: "8px" }}>
                  <LucideIcon name={stat.icon} size={16} style={{ color: stat.color }} />
                </div>
                <span style={{ fontSize: "11px", color: "#9A9080", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#E8E0D4" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ═══════ TAB NAVIGATION ═══════ */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "24px", background: "#262626",
          border: "1px solid #3A3A3A", borderRadius: "14px", padding: "6px", overflowX: "auto",
        }}>
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "1 0 auto", padding: "12px 20px",
                background: activeTab === tab.id ? "#C4A882" : "transparent",
                border: "none", borderRadius: "10px",
                color: activeTab === tab.id ? "#1A1A1A" : "#9A9080",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              <LucideIcon name={tab.icon} size={16} style={{ color: activeTab === tab.id ? "#1A1A1A" : "#9A9080" }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════ TAB 1: OVERVIEW ═══════ */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
            {sceneIntelligence.map(si => (
              <div
                key={si.scene.id}
                onClick={() => setSelectedScene(si.scene)}
                style={{
                  background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px",
                  padding: "24px", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4A882"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#3A3A3A"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <div style={{ padding: "5px 10px", background: "#C4A88225", borderRadius: "8px", fontSize: "13px", fontWeight: "700", color: "#C4A882" }}>
                    {t("scene")} {si.scene.sceneNumber}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{
                      padding: "4px 10px", background: complexityColors[si.scene.complexity].bg,
                      border: `1px solid ${complexityColors[si.scene.complexity].border}`,
                      borderRadius: "6px", fontSize: "11px", fontWeight: "600",
                      color: complexityColors[si.scene.complexity].text,
                    }}>
                      {t(si.scene.complexity)}
                    </div>
                    {si.scene.vfxRequired && (
                      <div style={{
                        padding: "4px 8px", background: "#C4A88218", border: "1px solid #C4A88240",
                        borderRadius: "6px", fontSize: "11px", fontWeight: "600", color: "#C4A882",
                        display: "flex", alignItems: "center", gap: "3px",
                      }}>
                        <LucideIcon name="Sparkles" size={10} /> VFX
                      </div>
                    )}
                  </div>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                  {si.scene.description}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                  <LucideIcon name="MapPin" size={12} style={{ color: "#6B6560" }} />
                  <span style={{ fontSize: "12px", color: "#6B6560" }}>{si.scene.location}</span>
                </div>
                {/* Feasibility bar */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#9A9080" }}>{t("feasibility")}</span>
                    <span style={{ fontSize: "11px", color: "#E8E0D4", fontWeight: "600" }}>{si.feasibility}/10</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "#333333", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                      width: `${(si.feasibility / 10) * 100}%`, height: "100%", borderRadius: "3px",
                      background: si.feasibility >= 7 ? "linear-gradient(90deg, #5B8C5A, #7BAF7A)" : si.feasibility >= 4 ? "linear-gradient(90deg, #C4A042, #D4B052)" : "linear-gradient(90deg, #C45C5C, #D46C6C)",
                    }} />
                  </div>
                </div>
                {/* Cost comparison bars */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#9A9080" }}>{t("costManualVsAi")}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <div style={{ flex: 1, position: "relative", height: "14px" }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, height: "6px",
                        width: `${Math.min(100, (si.scene.estimatedCost / 12) * 100)}%`,
                        background: "#5B7C8C", borderRadius: "3px",
                      }} />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, height: "6px",
                        width: `${Math.min(100, (si.aiCost / 15) * 100)}%`,
                        background: "#C4A882", borderRadius: "3px",
                      }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: "60px", textAlign: "right" }}>
                      <span style={{ fontSize: "10px", color: "#5B7C8C" }}>{formatCrores(si.scene.estimatedCost)}</span>
                      <span style={{ fontSize: "10px", color: "#C4A882" }}>{formatCrores(si.aiCost)}</span>
                    </div>
                  </div>
                </div>
                {/* Bottom row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <LucideIcon key={i} name="Flame" size={14} style={{ color: i < si.intensity ? "#C45C5C" : "#3A3A3A" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "#9A9080" }}>~{si.estimatedShots} {t("shots")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════ TAB 2: SCENE FEASIBILITY ═══════ */}
        {activeTab === "feasibility" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Left: Ranked list */}
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>
                {t("scenesRankedByFeasibility")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {rankedByFeasibility.map((si, idx) => {
                  const isSelected = selectedFeasibilityScene?.id === si.scene.id;
                  return (
                    <div
                      key={si.scene.id}
                      onClick={() => setSelectedFeasibilityScene(si.scene)}
                      style={{
                        padding: "14px 16px", background: isSelected ? "#C4A88215" : "#333333",
                        border: `1px solid ${isSelected ? "#C4A882" : "#3A3A3A"}`, borderRadius: "10px",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "12px", color: "#6B6560", fontWeight: "600", minWidth: "20px" }}>#{idx + 1}</span>
                          <span style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "500" }}>Sc. {si.scene.sceneNumber}</span>
                          <span style={{ fontSize: "12px", color: "#9A9080" }}>
                            {si.scene.description.length > 35 ? si.scene.description.slice(0, 35) + "..." : si.scene.description}
                          </span>
                        </div>
                        <span style={{
                          fontSize: "14px", fontWeight: "700",
                          color: si.feasibility >= 7 ? "#5B8C5A" : si.feasibility >= 4 ? "#C4A042" : "#C45C5C",
                        }}>
                          {si.feasibility}
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "5px", background: "#262626", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                          width: `${(si.feasibility / 10) * 100}%`, height: "100%", borderRadius: "3px",
                          background: si.feasibility >= 7 ? "#5B8C5A" : si.feasibility >= 4 ? "#C4A042" : "#C45C5C",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Breakdown */}
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
              {selectedFeasibilityScene ? (() => {
                const breakdown = computeFeasibilityBreakdown(selectedFeasibilityScene);
                const score = computeFeasibility(selectedFeasibilityScene);
                const factors = [
                  { label: t("costFactor"), value: breakdown.costFactor, desc: t("costFactorDesc") },
                  { label: t("vfxFactor"), value: breakdown.vfxFactor, desc: t("vfxFactorDesc") },
                  { label: t("durationFactor"), value: breakdown.durationFactor, desc: t("durationFactorDesc") },
                  { label: t("castComplexity"), value: breakdown.castComplexity, desc: t("castComplexityDesc") },
                  { label: t("locationDifficulty"), value: breakdown.locationDifficulty, desc: t("locationDifficultyDesc") },
                ];
                return (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 4px 0" }}>
                          {t("scene")} {selectedFeasibilityScene.sceneNumber} {t("sceneBreakdown")}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#9A9080", margin: 0 }}>{selectedFeasibilityScene.description}</p>
                      </div>
                      <div style={{
                        padding: "12px 20px",
                        background: score >= 7 ? "#5B8C5A20" : score >= 4 ? "#C4A04220" : "#C45C5C20",
                        borderRadius: "12px", textAlign: "center",
                      }}>
                        <div style={{ fontSize: "28px", fontWeight: "700", color: score >= 7 ? "#5B8C5A" : score >= 4 ? "#C4A042" : "#C45C5C" }}>
                          {score}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9A9080" }}>/ 10</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                      {factors.map(f => (
                        <div key={f.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <div>
                              <span style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "500" }}>{f.label}</span>
                              <span style={{ fontSize: "11px", color: "#6B6560", marginLeft: "8px" }}>{f.desc}</span>
                            </div>
                            <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{f.value.toFixed(1)}</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "#333333", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{
                              width: `${(f.value / 10) * 100}%`, height: "100%",
                              background: f.value >= 7 ? "#5B8C5A" : f.value >= 4 ? "#C4A042" : "#C45C5C",
                              borderRadius: "4px", transition: "width 0.3s",
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "16px", background: "#C4A88210", border: "1px solid #C4A88230", borderRadius: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <LucideIcon name="Sparkles" size={14} style={{ color: "#C4A882" }} />
                        <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{t("aiRecommendation")}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#9A9080", margin: 0, lineHeight: "1.5" }}>
                        {score >= 7
                          ? t("aiRecHighly")
                          : score >= 5
                            ? t("aiRecModerate")
                            : score >= 3
                              ? t("aiRecLow")
                              : t("aiRecCritical")}
                      </p>
                    </div>
                  </>
                );
              })() : (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  height: "100%", color: "#6B6560", textAlign: "center", padding: "40px",
                }}>
                  <LucideIcon name="Target" size={48} style={{ color: "#3A3A3A", marginBottom: "16px" }} />
                  <p style={{ fontSize: "15px", margin: 0 }}>{t("selectScenePrompt")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════ TAB 3: MASS vs CLASS ═══════ */}
        {activeTab === "appeal" && (
          <div>
            {/* Appeal Spectrum */}
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>{t("appealSpectrum")}</h3>
              <div style={{ position: "relative", height: "48px", marginBottom: "12px" }}>
                <div style={{
                  width: "100%", height: "12px", borderRadius: "6px", marginTop: "18px",
                  background: "linear-gradient(90deg, #C45C5C, #C4A042, #5B7C8C)",
                }} />
                <div style={{
                  position: "absolute", left: `${globalMetrics.massAppeal}%`, top: "8px",
                  transform: "translateX(-50%)",
                }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", background: "#E8E0D4",
                    border: "3px solid #C4A882", boxShadow: "0 0 12px #C4A88260",
                  }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#C45C5C", fontWeight: "600" }}>{t("massLabel")} ({globalMetrics.massAppeal}%)</span>
                <span style={{ fontSize: "13px", color: "#5B7C8C", fontWeight: "600" }}>{t("classLabel")} ({globalMetrics.classAppeal}%)</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              {/* Donut */}
              <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 24px 0" }}>{t("sceneComposition")}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                  <div style={{ position: "relative", width: "180px", height: "180px", flexShrink: 0 }}>
                    {(() => {
                      const dColors: Record<string, string> = { action: "#C4A042", dialogue: "#5B7C8C", song: "#D4B892", stunt: "#5B8C5A", romantic: "#C45C5C", vfx: "#C4A882" };
                      let cum = 0;
                      const parts = sceneComposition.map(sc => {
                        const start = cum;
                        cum += sc.percentage;
                        return `${dColors[sc.type] || "#9A9080"} ${start}% ${cum}%`;
                      });
                      return (
                        <div style={{
                          width: "180px", height: "180px", borderRadius: "50%",
                          background: `conic-gradient(${parts.join(", ")})`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            width: "110px", height: "110px", borderRadius: "50%", background: "#262626",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          }}>
                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>{scenes.length}</div>
                            <div style={{ fontSize: "11px", color: "#6B6560" }}>{t("scenes")}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {sceneComposition.map(sc => {
                      const dColors: Record<string, string> = { action: "#C4A042", dialogue: "#5B7C8C", song: "#D4B892", stunt: "#5B8C5A", romantic: "#C45C5C", vfx: "#C4A882" };
                      return (
                        <div key={sc.type} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: dColors[sc.type] || "#9A9080" }} />
                          <span style={{ fontSize: "13px", color: "#9A9080", minWidth: "70px" }}>{t(sc.type)}</span>
                          <span style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "600" }}>{sc.count} ({sc.percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Audience Predictions */}
              <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>{t("audiencePredictions")}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {(() => {
                    const actionSongRatio = scenes.filter(s => ["action", "stunt", "song"].includes(s.complexity)).length / scenes.length;
                    const dialogueRomanticRatio = scenes.filter(s => ["dialogue", "romantic"].includes(s.complexity)).length / scenes.length;
                    const narrativeComplexity = scenes.length >= 10 ? 0.7 : 0.5;
                    const overseasPull = actors.reduce((sum, a) => sum + a.overseasPull, 0) / actors.length;
                    const vfxSpectacle = scenes.filter(s => s.vfxRequired && (s.vfxIntensity === "extreme" || s.vfxIntensity === "high")).length / scenes.length;
                    const segments = [
                      { name: t("youth"), score: Math.round(actionSongRatio * 90 + 10), color: "#C45C5C", icon: "Flame" },
                      { name: t("family"), score: Math.round(dialogueRomanticRatio * 80 + 20), color: "#5B7C8C", icon: "Heart" },
                      { name: t("critics"), score: Math.round(narrativeComplexity * 85 + 10), color: "#C4A882", icon: "Star" },
                      { name: t("overseasNri"), score: Math.round((overseasPull / 100 * 0.6 + vfxSpectacle * 0.4) * 90 + 10), color: "#5B8C5A", icon: "Globe" },
                    ];
                    return segments.map(seg => (
                      <div key={seg.name} style={{ padding: "16px", background: "#333333", borderRadius: "12px", border: "1px solid #3A3A3A" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                          <LucideIcon name={seg.icon} size={14} style={{ color: seg.color }} />
                          <span style={{ fontSize: "12px", color: "#9A9080", fontWeight: "500" }}>{seg.name}</span>
                        </div>
                        <div style={{ fontSize: "26px", fontWeight: "700", color: seg.color, marginBottom: "8px" }}>{seg.score}%</div>
                        <div style={{ width: "100%", height: "4px", background: "#262626", borderRadius: "2px" }}>
                          <div style={{ width: `${seg.score}%`, height: "100%", background: seg.color, borderRadius: "2px" }} />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ TAB 4: NARRATIVE SIMULATOR ═══════ */}
        {activeTab === "simulator" && (
          <div>
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>{t("whatIfScenarios")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "14px" }}>
                {[
                  { id: "remove-switzerland", name: t("removeSwitzerlandName"), desc: t("removeSwitzerlandDesc"), icon: "MapPin" },
                  { id: "simplify-climax", name: t("simplifyClimaxName"), desc: t("simplifyClimaxDesc"), icon: "Sparkles" },
                  { id: "add-flashback", name: t("addFlashbackName"), desc: t("addFlashbackDesc"), icon: "Heart" },
                  { id: "replace-truck", name: t("replaceTruckName"), desc: t("replaceTruckDesc"), icon: "RotateCcw" },
                  { id: "cut-item-song", name: t("cutItemSongName"), desc: t("cutItemSongDesc"), icon: "Film" },
                ].map(scenario => {
                  const isActive = activeScenarios.has(scenario.id);
                  return (
                    <div
                      key={scenario.id}
                      onClick={() => toggleScenario(scenario.id)}
                      style={{
                        padding: "16px", background: isActive ? "#C4A88215" : "#333333",
                        border: `1px solid ${isActive ? "#C4A882" : "#3A3A3A"}`, borderRadius: "12px",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "4px",
                          border: `2px solid ${isActive ? "#C4A882" : "#6B6560"}`,
                          background: isActive ? "#C4A882" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isActive && <span style={{ color: "#1A1A1A", fontSize: "12px", fontWeight: "700" }}>&#10003;</span>}
                        </div>
                        <LucideIcon name={scenario.icon} size={14} style={{ color: isActive ? "#C4A882" : "#9A9080" }} />
                        <span style={{ fontSize: "13px", color: isActive ? "#C4A882" : "#E8E0D4", fontWeight: "600" }}>
                          {scenario.name}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#6B6560", margin: 0, paddingLeft: "28px" }}>{scenario.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Sliders */}
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>{t("customAdjustments")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("actionBudgetMultiplier")}</span>
                    <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{actionMultiplier.toFixed(1)}x</span>
                  </div>
                  <input type="range" min="0.5" max="2.0" step="0.1" value={actionMultiplier}
                    onChange={e => setActionMultiplier(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#C4A882" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("vfxIntensityScale")}</span>
                    <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{vfxScale.toFixed(1)}x</span>
                  </div>
                  <input type="range" min="0.5" max="2.0" step="0.1" value={vfxScale}
                    onChange={e => setVfxScale(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#C4A882" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("songSequences")}</span>
                    <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>{songCount}</span>
                  </div>
                  <input type="range" min="0" max="5" step="1" value={songCount}
                    onChange={e => setSongCount(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#C4A882" }}
                  />
                </div>
              </div>
            </div>

            {/* Impact Dashboard */}
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>
                {t("impactDashboard")}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {[
                  { label: t("totalCost"), baseline: baselineResult.totalCost, simulated: simulatedResult.totalCost, isCurrency: true },
                  { label: t("avgFeasibility"), baseline: baselineResult.feasibility, simulated: simulatedResult.feasibility, isCurrency: false },
                  { label: t("massAppeal"), baseline: baselineResult.massAppeal, simulated: simulatedResult.massAppeal, isCurrency: false },
                  { label: t("classAppeal"), baseline: baselineResult.classAppeal, simulated: simulatedResult.classAppeal, isCurrency: false },
                  { label: t("shootDays"), baseline: baselineResult.shootDays, simulated: simulatedResult.shootDays, isCurrency: false },
                  { label: t("vfxShots"), baseline: baselineResult.vfxShotCount, simulated: simulatedResult.vfxShotCount, isCurrency: false },
                ].map((metric, i) => (
                  <div key={i} style={{ padding: "18px", background: "#333333", borderRadius: "12px", border: "1px solid #3A3A3A" }}>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {metric.label}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#6B6560" }}>
                        {metric.isCurrency ? formatCrores(metric.baseline) : metric.baseline.toFixed(1)}
                      </span>
                      <span style={{ fontSize: "11px", color: "#6B6560" }}>{"\u2192"}</span>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#E8E0D4" }}>
                        {metric.isCurrency ? formatCrores(metric.simulated) : metric.simulated.toFixed(1)}
                      </span>
                    </div>
                    {renderDelta(metric.baseline, metric.simulated, metric.isCurrency)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ TAB 5: SHOT LIST ═══════ */}
        {activeTab === "shotlist" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sceneIntelligence.map(si => {
              const isExpanded = expandedScenes.has(si.scene.id);
              const shots = shotTemplates[si.scene.complexity] || shotTemplates.dialogue;
              return (
                <div key={si.scene.id} style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "14px", overflow: "hidden" }}>
                  <div
                    onClick={() => toggleExpandScene(si.scene.id)}
                    style={{
                      padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", background: isExpanded ? "#333333" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "700" }}>{t("scene")} {si.scene.sceneNumber}</span>
                      <span style={{ fontSize: "13px", color: "#E8E0D4" }}>{si.scene.description}</span>
                      <div style={{
                        padding: "3px 8px", background: complexityColors[si.scene.complexity].bg,
                        borderRadius: "4px", fontSize: "11px",
                        color: complexityColors[si.scene.complexity].text,
                      }}>
                        {t(si.scene.complexity)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#9A9080" }}>{shots.length} {t("shots")}</span>
                      <span style={{
                        fontSize: "18px", color: "#6B6560",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s", display: "inline-block",
                      }}>{"\u25BE"}</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 24px 20px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #3A3A3A" }}>
                            {[t("shotNumber"), t("shotType"), t("cameraMovement"), t("estDuration"), t("lighting")].map(h => (
                              <th key={h} style={{
                                padding: "12px 8px", textAlign: "left", fontSize: "11px",
                                color: "#6B6560", fontWeight: "600", textTransform: "uppercase",
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {shots.map((shot, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #333333" }}>
                              <td style={{ padding: "12px 8px", fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>
                                {si.scene.sceneNumber}.{shot.shotNumber}
                              </td>
                              <td style={{ padding: "12px 8px", fontSize: "13px", color: "#E8E0D4" }}>{shot.type}</td>
                              <td style={{ padding: "12px 8px", fontSize: "13px", color: "#9A9080" }}>{shot.cameraMovement}</td>
                              <td style={{ padding: "12px 8px", fontSize: "13px", color: "#9A9080" }}>{shot.estDuration}</td>
                              <td style={{ padding: "12px 8px", fontSize: "13px", color: "#9A9080" }}>{shot.lighting}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════ TAB 6: SAFETY & CROWD ═══════ */}
        {activeTab === "safety" && (
          <div>
            <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>{t("safetyRiskHeatMap")}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {sceneIntelligence.map(si => {
                  const rc: Record<string, string> = { low: "#5B8C5A", medium: "#C4A042", high: "#C45C5C", critical: "#FF4444" };
                  const rb: Record<string, string> = { low: "#5B8C5A20", medium: "#C4A04220", high: "#C45C5C20", critical: "#FF444420" };
                  return (
                    <div key={si.scene.id} style={{
                      padding: "16px", background: rb[si.safetyRisk.level],
                      border: `1px solid ${rc[si.safetyRisk.level]}40`, borderRadius: "10px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "600", marginBottom: "4px" }}>
                        Sc. {si.scene.sceneNumber}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "8px" }}>
                        {si.scene.description.length > 25 ? si.scene.description.slice(0, 25) + "..." : si.scene.description}
                      </div>
                      <div style={{
                        padding: "3px 8px", background: `${rc[si.safetyRisk.level]}30`,
                        borderRadius: "4px", display: "inline-block",
                        fontSize: "11px", fontWeight: "600", color: rc[si.safetyRisk.level], textTransform: "uppercase",
                      }}>
                        {si.safetyRisk.level}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Crowd Detection */}
              <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>Crowd Detection</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #3A3A3A" }}>
                      {["Scene", "Est. Crowd", "Management"].map(h => (
                        <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: "11px", color: "#6B6560", fontWeight: "600" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {crowdScenes.map(cs => (
                      <tr key={cs.scene.id} style={{ borderBottom: "1px solid #333333" }}>
                        <td style={{ padding: "12px 8px", fontSize: "13px", color: "#E8E0D4" }}>Sc. {cs.scene.sceneNumber}</td>
                        <td style={{ padding: "12px 8px", fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>~{cs.estCrowdSize}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600",
                            background: cs.managementLevel === "High" ? "#C45C5C20" : cs.managementLevel === "Medium" ? "#C4A04220" : "#5B8C5A20",
                            color: cs.managementLevel === "High" ? "#C45C5C" : cs.managementLevel === "Medium" ? "#C4A042" : "#5B8C5A",
                          }}>
                            {cs.managementLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Safety Protocols */}
              <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>Safety Protocols</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {highRiskScenes.length === 0 && (
                    <p style={{ fontSize: "13px", color: "#6B6560", textAlign: "center", padding: "20px" }}>No high-risk scenes detected</p>
                  )}
                  {highRiskScenes.map(si => {
                    const safetyCrew = si.safetyRisk.level === "critical" ? 12 : 8;
                    const costEstimate = safetyCrew * 0.05;
                    return (
                      <div key={si.scene.id} style={{
                        padding: "16px", background: "#C45C5C10", border: "1px solid #C45C5C30", borderRadius: "10px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "600" }}>Scene {si.scene.sceneNumber}</span>
                          <span style={{
                            padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600",
                            background: si.safetyRisk.level === "critical" ? "#FF444420" : "#C45C5C20",
                            color: si.safetyRisk.level === "critical" ? "#FF4444" : "#C45C5C", textTransform: "uppercase",
                          }}>
                            {si.safetyRisk.level}
                          </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                          {si.safetyRisk.factors.map((f, i) => (
                            <span key={i} style={{
                              padding: "3px 8px", background: "#333333", borderRadius: "4px",
                              fontSize: "11px", color: "#9A9080",
                            }}>{f}</span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#6B6560" }}>
                          <span>Safety Crew: <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{safetyCrew}</span></span>
                          <span>Est. Cost: <span style={{ color: "#C4A882", fontWeight: "600" }}>{formatCrores(costEstimate)}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ DIRECTOR STYLE MAPPING ═══════ */}
        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px", marginTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>Director Style Mapping</h3>
            <div style={{
              padding: "8px 16px", background: "#C4A88215", border: "1px solid #C4A88240", borderRadius: "8px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <LucideIcon name="Clapperboard" size={14} style={{ color: "#C4A882" }} />
              <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>Sukumar</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
            {Object.entries(directorStyles).map(([type, sty]) => (
              <div key={type} style={{ padding: "16px", background: "#333333", borderRadius: "10px", border: "1px solid #3A3A3A" }}>
                <div style={{
                  padding: "4px 10px", background: complexityColors[type]?.bg || "#333333",
                  borderRadius: "6px", fontSize: "12px", fontWeight: "600",
                  color: complexityColors[type]?.text || "#9A9080", textTransform: "capitalize",
                  display: "inline-block", marginBottom: "12px",
                }}>
                  {type}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { label: "Camera", value: sty.camera },
                    { label: "Framing", value: sty.framing },
                    { label: "Lighting", value: sty.lighting },
                    { label: "Signature", value: sty.signature },
                  ].map(item => (
                    <div key={item.label}>
                      <span style={{ fontSize: "10px", color: "#6B6560", textTransform: "uppercase" }}>{item.label}</span>
                      <div style={{ fontSize: "12px", color: "#E8E0D4", lineHeight: "1.4" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ SCENE INTELLIGENCE MODAL ═══════ */}
        {selectedScene && (() => {
          const si = sceneIntelligence.find(s => s.scene.id === selectedScene.id);
          if (!si) return null;
          const shots = shotTemplates[selectedScene.complexity] || shotTemplates.dialogue;
          return (
            <div
              onClick={() => setSelectedScene(null)}
              style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px", zIndex: 1000,
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  background: "#262626", border: "1px solid #3A3A3A", borderRadius: "20px", padding: "32px",
                  maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600", marginBottom: "6px" }}>
                      Scene {selectedScene.sceneNumber} Intelligence Report
                    </div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                      {selectedScene.description}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedScene(null)}
                    style={{
                      padding: "8px", background: "#333333", border: "1px solid #3A3A3A",
                      borderRadius: "8px", cursor: "pointer", color: "#9A9080", fontSize: "16px",
                    }}
                  >
                    {"\u2715"}
                  </button>
                </div>

                {/* Score cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
                  {[
                    { label: "Feasibility", value: `${si.feasibility}/10`, color: si.feasibility >= 7 ? "#5B8C5A" : si.feasibility >= 4 ? "#C4A042" : "#C45C5C" },
                    { label: "AI Est. Cost", value: formatCrores(si.aiCost), color: "#C4A882" },
                    { label: "Action Intensity", value: `${si.intensity}/5`, color: "#C45C5C" },
                    { label: "Est. Shots", value: `${si.estimatedShots}`, color: "#5B7C8C" },
                  ].map((card, i) => (
                    <div key={i} style={{ padding: "14px", background: "#333333", borderRadius: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px" }}>{card.label}</div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: card.color }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ fontSize: "14px", color: "#9A9080", fontWeight: "600", margin: "0 0 12px 0" }}>Cost Breakdown</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div style={{ padding: "12px", background: "#333333", borderRadius: "8px" }}>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>Manual Estimate</div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#5B7C8C" }}>{formatCrores(selectedScene.estimatedCost)}</div>
                    </div>
                    <div style={{ padding: "12px", background: "#333333", borderRadius: "8px" }}>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>AI Estimate</div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#C4A882" }}>{formatCrores(si.aiCost)}</div>
                    </div>
                    <div style={{ padding: "12px", background: "#333333", borderRadius: "8px" }}>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>VFX Sub-cost</div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#C4A882" }}>
                        {formatCrores(si.linkedVfxShots.reduce((sum, v) => sum + v.estimatedCost, 0))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked VFX Shots */}
                {si.linkedVfxShots.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "14px", color: "#9A9080", fontWeight: "600", margin: "0 0 12px 0" }}>Linked VFX Shots</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {si.linkedVfxShots.map(v => (
                        <div key={v.id} style={{
                          padding: "12px", background: "#333333", borderRadius: "8px",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "12px", color: "#C4A882", fontWeight: "600" }}>Shot {v.shotNumber}</span>
                            <span style={{ fontSize: "12px", color: "#9A9080", textTransform: "capitalize" }}>{v.type.replace("_", " ")}</span>
                            <span style={{
                              padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "600",
                              background: v.complexity === "extreme" ? "#FF444420" : v.complexity === "high" ? "#C45C5C20" : "#C4A04220",
                              color: v.complexity === "extreme" ? "#FF4444" : v.complexity === "high" ? "#C45C5C" : "#C4A042",
                              textTransform: "uppercase",
                            }}>
                              {v.complexity}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#E8E0D4" }}>{formatCrores(v.estimatedCost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cast & Fee Impact */}
                {si.linkedActors.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "14px", color: "#9A9080", fontWeight: "600", margin: "0 0 12px 0" }}>Cast & Fee Impact</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {si.linkedActors.map(la => (
                        <div key={la.actor.id} style={{ padding: "12px", background: "#333333", borderRadius: "8px", minWidth: "140px" }}>
                          <div style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "600" }}>{la.actor.name}</div>
                          <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>as {la.role}</div>
                          <div style={{ fontSize: "14px", color: "#C4A882", fontWeight: "600" }}>{formatCrores(la.actor.fee)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Style Notes */}
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ fontSize: "14px", color: "#9A9080", fontWeight: "600", margin: "0 0 12px 0" }}>Director Style Notes</h4>
                  <div style={{ padding: "14px", background: "#C4A88210", border: "1px solid #C4A88225", borderRadius: "10px" }}>
                    {(() => {
                      const ds = directorStyles[selectedScene.complexity];
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div><span style={{ fontSize: "10px", color: "#6B6560" }}>CAMERA</span><div style={{ fontSize: "12px", color: "#E8E0D4" }}>{ds.camera}</div></div>
                          <div><span style={{ fontSize: "10px", color: "#6B6560" }}>FRAMING</span><div style={{ fontSize: "12px", color: "#E8E0D4" }}>{ds.framing}</div></div>
                          <div><span style={{ fontSize: "10px", color: "#6B6560" }}>LIGHTING</span><div style={{ fontSize: "12px", color: "#E8E0D4" }}>{ds.lighting}</div></div>
                          <div><span style={{ fontSize: "10px", color: "#6B6560" }}>SIGNATURE</span><div style={{ fontSize: "12px", color: "#E8E0D4" }}>{ds.signature}</div></div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Preliminary Shot List */}
                <div>
                  <h4 style={{ fontSize: "14px", color: "#9A9080", fontWeight: "600", margin: "0 0 12px 0" }}>Preliminary Shot List</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #3A3A3A" }}>
                        {["Shot", "Type", "Camera", "Duration", "Lighting"].map(h => (
                          <th key={h} style={{ padding: "8px", textAlign: "left", fontSize: "11px", color: "#6B6560" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shots.slice(0, 5).map((shot, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #333333" }}>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#C4A882" }}>{selectedScene.sceneNumber}.{shot.shotNumber}</td>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#E8E0D4" }}>{shot.type}</td>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#9A9080" }}>{shot.cameraMovement}</td>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#9A9080" }}>{shot.estDuration}</td>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#9A9080" }}>{shot.lighting}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══════ UPLOAD MODAL ═══════ */}
        {showUploadModal && (
          <div
            onClick={() => setShowUploadModal(false)}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px", zIndex: 1000,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "#262626", border: "1px solid #3A3A3A", borderRadius: "20px", padding: "32px",
                maxWidth: "500px", width: "100%",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#E8E0D4", margin: "0 0 24px 0" }}>Upload Script</h2>

              {uploadStage < 0 && !uploadComplete && (
                <div
                  onClick={startUpload}
                  style={{
                    border: "2px dashed #3A3A3A", borderRadius: "14px", padding: "48px 24px",
                    textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: "#333333",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4A882"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#3A3A3A"; }}
                >
                  <LucideIcon name="FileText" size={40} style={{ color: "#6B6560", marginBottom: "12px" }} />
                  <p style={{ fontSize: "15px", color: "#E8E0D4", margin: "0 0 4px 0", fontWeight: "500" }}>
                    Drop your script PDF here
                  </p>
                  <p style={{ fontSize: "13px", color: "#6B6560", margin: 0 }}>or click to browse</p>
                </div>
              )}

              {uploadStage >= 0 && !uploadComplete && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {uploadStages.map((stage, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px", padding: "10px",
                      opacity: i <= uploadStage ? 1 : 0.3, transition: "opacity 0.3s",
                    }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        background: i < uploadStage ? "#5B8C5A" : i === uploadStage ? "#C4A882" : "#3A3A3A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {i < uploadStage && <span style={{ color: "#fff", fontSize: "12px" }}>{"\u2713"}</span>}
                        {i === uploadStage && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1A1A1A" }} />}
                      </div>
                      <span style={{ fontSize: "13px", color: i <= uploadStage ? "#E8E0D4" : "#6B6560" }}>{stage}</span>
                      {i === uploadStage && (
                        <div style={{ flex: 1, height: "3px", background: "#333333", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "#C4A882", borderRadius: "2px", animation: "progressBar 0.7s ease-out forwards" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {uploadComplete && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%", background: "#5B8C5A20",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <LucideIcon name="CheckCircle" size={32} style={{ color: "#5B8C5A" }} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#E8E0D4", margin: "0 0 8px 0" }}>
                    12 Scenes Extracted
                  </h3>
                  <p style={{ fontSize: "13px", color: "#9A9080", margin: "0 0 20px 0" }}>
                    All scenes analyzed and intelligence reports generated
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
                    {["Locations mapped", "VFX flagged", "Cost computed", "Shots estimated", "Safety scored"].map(item => (
                      <span key={item} style={{
                        padding: "4px 10px", background: "#5B8C5A15", border: "1px solid #5B8C5A30",
                        borderRadius: "6px", fontSize: "11px", color: "#5B8C5A", fontWeight: "500",
                      }}>
                        {"\u2713"} {item}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    style={{
                      marginTop: "20px", padding: "12px 32px", background: "#C4A882", border: "none",
                      borderRadius: "10px", color: "#1A1A1A", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    Continue to Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
