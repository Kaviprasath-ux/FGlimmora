"use client";

import { useState } from "react";
import { scenes } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { simulationTranslations } from "@/lib/translations/simulation";

export default function SimulationPage() {
  const { t } = useTranslation(simulationTranslations);
  const [selectedScene, setSelectedScene] = useState<string>(scenes[4].id); // Interval truck chase
  const [stuntIntensity, setStuntIntensity] = useState(7);
  const [crowdSize, setCrowdSize] = useState(50);
  const [vfxLevel, setVfxLevel] = useState(8);

  // Action scenes only
  const actionScenes = scenes.filter((s) => s.complexity === "action" || s.complexity === "stunt");

  const selectedSceneData = scenes.find((s) => s.id === selectedScene);

  // Calculate cost impact based on parameters
  const baseCost = selectedSceneData?.estimatedCost || 0;
  const intensityMultiplier = 1 + (stuntIntensity / 10) * 0.5; // 0-50% increase
  const crowdCost = (crowdSize / 100) * 2; // Up to 2Cr for max crowd
  const vfxMultiplier = 1 + (vfxLevel / 10) * 0.8; // 0-80% increase
  const totalCost = (baseCost * intensityMultiplier + crowdCost) * vfxMultiplier;

  // Safety rating (inverse of intensity)
  const safetyRating = Math.max(1, 10 - stuntIntensity);
  const safetyColor = safetyRating >= 7 ? "#5B8C5A" : safetyRating >= 4 ? "#C4A042" : "#C45C5C";

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <LucideIcon name="Sparkles" size={32} style={{ color: "#C4A882" }} />
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageDescription")}
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Film" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("actionScenes")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{actionScenes.length}</div>
        </div>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="IndianRupee" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("baseCost")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(baseCost)}
          </div>
        </div>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="TrendingUp" size={20} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("simulatedCost")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#C4A042" }}>
            {formatCrores(totalCost)}
          </div>
        </div>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Shield" size={20} style={{ color: safetyColor }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("safetyRating")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: safetyColor }}>
            {safetyRating}/10
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Scene Selector */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "16px" }}>
              {t("selectActionScene")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {actionScenes.map((scene) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedScene(scene.id)}
                  style={{
                    background: selectedScene === scene.id ? "#333333" : "transparent",
                    border: `1px solid ${selectedScene === scene.id ? "#C4A882" : "#3A3A3A"}`,
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedScene !== scene.id) {
                      e.currentTarget.style.borderColor = "#4A4A4A";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedScene !== scene.id) {
                      e.currentTarget.style.borderColor = "#3A3A3A";
                    }
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                        {t("scene")} {scene.sceneNumber}: {scene.description}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9A9080" }}>{scene.location}</div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#C4A882" }}>
                      {formatCrores(scene.estimatedCost)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Viewer */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "16px" }}>
              {t("simulationPreview")}
            </h3>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                background: "#0A0A0A",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Grid background */}
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0, opacity: 0.15 }}
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C4A882" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Center content */}
              <div style={{ position: "relative", textAlign: "center" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #C4A882 0%, #9A9080 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(196, 168, 130, 0.3)",
                  }}
                >
                  <LucideIcon name="Sparkles" size={48} style={{ color: "#1A1A1A" }} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "8px" }}>
                  {selectedSceneData?.description}
                </div>
                <div style={{ fontSize: "13px", color: "#9A9080" }}>
                  {t("adjustParameters")}
                </div>
              </div>

              {/* Simulation indicators */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#5B8C5A",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#5B8C5A", fontWeight: "600" }}>{t("simulationActive")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Complexity Controls */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "24px" }}>
              {t("simulationParameters")}
            </h3>

            {/* Stunt Intensity */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <label style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                  {t("stuntIntensity")}
                </label>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#C4A882",
                  }}
                >
                  {stuntIntensity}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stuntIntensity}
                onChange={(e) => setStuntIntensity(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, #C4A882 0%, #C4A882 ${stuntIntensity * 10}%, #333333 ${stuntIntensity * 10}%, #333333 100%)`,
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                }}
              />
              <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "8px" }}>
                {t("higherIntensityNote")}
              </div>
            </div>

            {/* Crowd Size */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <label style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                  {t("crowdSize")}
                </label>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#C4A882",
                  }}
                >
                  {crowdSize}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={crowdSize}
                onChange={(e) => setCrowdSize(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, #5B7C8C 0%, #5B7C8C ${(crowdSize / 200) * 100}%, #333333 ${(crowdSize / 200) * 100}%, #333333 100%)`,
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                }}
              />
              <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "8px" }}>
                {t("backgroundActors")}
              </div>
            </div>

            {/* VFX Level */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <label style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                  {t("vfxComplexity")}
                </label>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#C4A882",
                  }}
                >
                  {vfxLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={vfxLevel}
                onChange={(e) => setVfxLevel(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, #5B8C5A 0%, #5B8C5A ${vfxLevel * 10}%, #333333 ${vfxLevel * 10}%, #333333 100%)`,
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                }}
              />
              <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "8px" }}>
                {t("digitalEffects")}
              </div>
            </div>
          </div>

          {/* Cost Impact */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("costImpactAnalysis")}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#333333",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("baseSceneCost")}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                  {formatCrores(baseCost)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#333333",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("stuntAdjustment")}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#C4A042" }}>
                  +{formatCrores(baseCost * (intensityMultiplier - 1))}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#333333",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("crowdCost")}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#C4A042" }}>
                  +{formatCrores(crowdCost)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#333333",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("vfxMultiplier")}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#C4A042" }}>
                  x{vfxMultiplier.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "rgba(196, 168, 130, 0.1)",
                  border: "1px solid rgba(196, 168, 130, 0.3)",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>{t("totalEstimated")}</span>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#C4A882" }}>
                  {formatCrores(totalCost)}
                </span>
              </div>

              <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                {totalCost > baseCost * 2 ? (
                  <span style={{ color: "#C45C5C" }}>⚠ {t("costExceeds2x")}</span>
                ) : totalCost > baseCost * 1.5 ? (
                  <span style={{ color: "#C4A042" }}>⚠ {t("significantCostIncrease")}</span>
                ) : (
                  <span style={{ color: "#5B8C5A" }}>✓ {t("withinReasonableRange")}</span>
                )}
              </div>
            </div>
          </div>

          {/* Safety Display */}
          <div
            style={{
              background: "#262626",
              border: `1px solid ${safetyColor}40`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "16px" }}>
              {t("safetyAssessment")}
            </h3>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  color: safetyColor,
                  marginBottom: "8px",
                }}
              >
                {safetyRating}/10
              </div>
              <div style={{ fontSize: "14px", color: "#9A9080" }}>
                {safetyRating >= 7
                  ? t("lowRisk")
                  : safetyRating >= 4
                  ? t("mediumRisk")
                  : t("highRisk")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
