"use client";

import { useState } from "react";
import { whatIfScenarios, vfxShots, scenes, budgetCategories, actors, shootingSchedule } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { digitalTwinTranslations } from "@/lib/translations/digital-twin";
import type { WhatIfScenario } from "@/lib/types";

export default function DigitalTwinPage() {
  const { t } = useTranslation(digitalTwinTranslations);
  const [selectedScenario, setSelectedScenario] = useState<WhatIfScenario | null>(null);
  const [showNewScenario, setShowNewScenario] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: "",
    budgetChange: 0,
    scheduleDays: 0,
    vfxIntensity: 0,
  });

  // Twin status data
  const twinTypes = [
    {
      id: "set",
      name: t("setTwin"),
      icon: "Building",
      status: "synced",
      lastSync: "2 mins ago",
      metrics: { locations: 8, sets: 12, utilization: 84 },
      color: "#5B8C5A",
    },
    {
      id: "scene",
      name: t("sceneTwin"),
      icon: "Camera",
      status: "synced",
      lastSync: "5 mins ago",
      metrics: { total: scenes.length, completed: scenes.filter((s) => s.status === "completed").length, progress: 42 },
      color: "#5B7C8C",
    },
    {
      id: "schedule",
      name: t("scheduleTwin"),
      icon: "Calendar",
      status: "syncing",
      lastSync: t("syncing"),
      metrics: {
        days: shootingSchedule.length,
        completed: shootingSchedule.filter((s) => s.status === "completed").length,
        onTrack: 78,
      },
      color: "#C4A042",
    },
    {
      id: "budget",
      name: t("budgetTwin"),
      icon: "IndianRupee",
      status: "synced",
      lastSync: "1 min ago",
      metrics: { planned: 350, spent: 187.5, variance: 53.6 },
      color: "#C4A882",
    },
    {
      id: "actor",
      name: t("actorTwin"),
      icon: "Users",
      status: "synced",
      lastSync: "8 mins ago",
      metrics: { total: actors.length, available: 4, engaged: 3 },
      color: "#9A9080",
    },
    {
      id: "vfx",
      name: t("vfxTwin"),
      icon: "Sparkles",
      status: "warning",
      lastSync: "15 mins ago",
      metrics: { shots: vfxShots.length, completed: vfxShots.filter((s) => s.status === "approved").length, pending: 8 },
      color: "#C45C5C",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      synced: "#5B8C5A",
      syncing: "#C4A042",
      warning: "#C45C5C",
      error: "#8B1E3F",
    };
    return colors[status as keyof typeof colors] || "#6B6560";
  };

  const handleRunScenario = () => {
    console.log("Running scenario:", newScenario);
    setShowNewScenario(false);
    setNewScenario({
      name: "",
      description: "",
      budgetChange: 0,
      scheduleDays: 0,
      vfxIntensity: 0,
    });
  };

  // Calculate live metrics
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
  const scenesCompleted = scenes.filter((s) => s.status === "completed").length;
  const vfxCompleted = vfxShots.filter((s) => s.status === "approved").length;

  return (
    <div style={{ padding: "2rem", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <LucideIcon name="GitBranch" size={32} color="#C4A882" />
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ color: "#9A9080", margin: 0 }}>{t("pageSubtitle")}</p>
      </div>

      {/* Twin Status Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {twinTypes.map((twin) => (
          <div
            key={twin.id}
            style={{
              background: "#1A1A1A",
              border: `1px solid ${twin.status === "warning" ? twin.color : "#2A2A2A"}`,
              borderRadius: "1rem",
              padding: "1.25rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {twin.status === "syncing" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, ${twin.color}00 0%, ${twin.color} 50%, ${twin.color}00 100%)`,
                  animation: "shimmer 1.5s infinite",
                }}
              />
            )}
            <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  background: twin.color + "20",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                }}
              >
                <LucideIcon name={twin.icon} size={24} color={twin.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", margin: "0 0 0.25rem 0" }}>
                  {twin.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      background: getStatusColor(twin.status),
                      animation: twin.status === "syncing" ? "pulse 2s infinite" : undefined,
                    }}
                  />
                  <span style={{ color: "#9A9080", fontSize: "0.75rem" }}>{twin.lastSync}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {Object.entries(twin.metrics).map(([key, value]) => (
                <div key={key}>
                  <div style={{ color: "#6B6560", fontSize: "0.75rem", textTransform: "capitalize" }}>{key}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "1rem", fontWeight: "600" }}>
                    {typeof value === "number" && value > 100 ? formatCrores(value) : value}
                    {key === "progress" || key === "onTrack" || key === "variance" || key === "utilization" ? "%" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* What-If Scenarios */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("whatIfScenarios")}
          </h2>
          <button
            onClick={() => setShowNewScenario(true)}
            style={{
              background: "#C4A882",
              color: "#0F0F0F",
              border: "none",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {t("newScenario")}
          </button>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          {whatIfScenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              style={{
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3A3A3A")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A2A2A")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", margin: "0 0 0.5rem 0" }}>
                    {scenario.name}
                  </h3>
                  <p style={{ color: "#9A9080", fontSize: "0.875rem", margin: 0, lineHeight: "1.5" }}>
                    {scenario.description}
                  </p>
                </div>
                <LucideIcon name="GitBranch" size={20} color="#C4A882" />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #2A2A2A",
                }}
              >
                <div>
                  <div style={{ color: "#6B6560", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("budgetImpact")}</div>
                  <div
                    style={{
                      color: scenario.impactSummary.budgetImpact > 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {scenario.impactSummary.budgetImpact > 0 ? "+" : ""}
                    {formatCrores(scenario.impactSummary.budgetImpact)}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                    {t("scheduleImpact")}
                  </div>
                  <div
                    style={{
                      color: scenario.impactSummary.scheduleImpact > 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {scenario.impactSummary.scheduleImpact > 0 ? "+" : ""}
                    {scenario.impactSummary.scheduleImpact} days
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                    {t("revenueImpact")}
                  </div>
                  <div
                    style={{
                      color: scenario.impactSummary.revenueImpact < 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {scenario.impactSummary.revenueImpact > 0 ? "+" : ""}
                    {formatCrores(scenario.impactSummary.revenueImpact)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Twin Dashboard - Live Mirrors */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
          {t("liveProductionMirrors")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              label: t("budgetHealth"),
              value: `${((totalSpent / totalBudget) * 100).toFixed(1)}%`,
              subValue: `${formatCrores(totalSpent)} / ${formatCrores(totalBudget)}`,
              icon: "IndianRupee",
              color: totalSpent / totalBudget > 0.6 ? "#C45C5C" : "#5B8C5A",
            },
            {
              label: t("sceneProgress"),
              value: `${scenesCompleted} / ${scenes.length}`,
              subValue: `${((scenesCompleted / scenes.length) * 100).toFixed(0)}% ${t("complete")}`,
              icon: "Camera",
              color: "#5B7C8C",
            },
            {
              label: t("vfxPipeline"),
              value: `${vfxCompleted} / ${vfxShots.length}`,
              subValue: `${vfxShots.length - vfxCompleted} ${t("shotsPending")}`,
              icon: "Sparkles",
              color: "#C4A042",
            },
            {
              label: t("scheduleStatus"),
              value: t("onTrack"),
              subValue: `42 ${t("daysElapsed")}`,
              icon: "Calendar",
              color: "#5B8C5A",
            },
            {
              label: t("castAvailability"),
              value: "4 / 6",
              subValue: `67% ${t("available")}`,
              icon: "Users",
              color: "#9A9080",
            },
            {
              label: t("productionHealth"),
              value: "78/100",
              subValue: t("goodStatus"),
              icon: "Shield",
              color: "#5B8C5A",
            },
          ].map((mirror, i) => (
            <div
              key={i}
              style={{
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    background: mirror.color + "20",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <LucideIcon name={mirror.icon} size={20} color={mirror.color} />
                </div>
                <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{mirror.label}</span>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: "700", color: mirror.color, marginBottom: "0.25rem" }}>
                {mirror.value}
              </div>
              <div style={{ color: "#6B6560", fontSize: "0.75rem" }}>{mirror.subValue}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Detail Modal */}
      {selectedScenario && (
        <div
          onClick={() => setSelectedScenario(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "700px",
              width: "90%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                {selectedScenario.name}
              </h2>
              <button
                onClick={() => setSelectedScenario(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9A9080",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <p style={{ color: "#9A9080", marginBottom: "2rem", lineHeight: "1.6" }}>
              {selectedScenario.description}
            </p>

            {/* Parameter Changes */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1rem" }}>
                {t("parameterChanges")}
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {Object.entries(selectedScenario.parameterChanges).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#242424",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#9A9080", fontSize: "0.875rem", textTransform: "capitalize" }}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span style={{ color: "#E8E0D4", fontSize: "0.875rem", fontWeight: "600" }}>
                      {typeof value === "number" ? (value > 0 ? `+${value}` : value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Visualization */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1rem" }}>
                {t("impactAnalysis")}
              </h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                {[
                  {
                    label: t("budgetImpact"),
                    value: selectedScenario.impactSummary.budgetImpact,
                    unit: "Cr",
                    color: selectedScenario.impactSummary.budgetImpact > 0 ? "#C45C5C" : "#5B8C5A",
                  },
                  {
                    label: t("scheduleImpact"),
                    value: selectedScenario.impactSummary.scheduleImpact,
                    unit: "days",
                    color: selectedScenario.impactSummary.scheduleImpact > 0 ? "#C45C5C" : "#5B8C5A",
                  },
                  {
                    label: t("revenueImpact"),
                    value: selectedScenario.impactSummary.revenueImpact,
                    unit: "Cr",
                    color: selectedScenario.impactSummary.revenueImpact < 0 ? "#C45C5C" : "#5B8C5A",
                  },
                ].map((impact, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{impact.label}</span>
                      <span style={{ color: impact.color, fontSize: "0.875rem", fontWeight: "600" }}>
                        {impact.value > 0 ? "+" : ""}
                        {impact.value} {impact.unit}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "0.5rem",
                        background: "#242424",
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          background: "#3A3A3A",
                        }}
                      />
                      <div
                        style={{
                          height: "100%",
                          background: impact.color,
                          width: `${Math.min(Math.abs(impact.value) * 5, 50)}%`,
                          marginLeft: impact.value < 0 ? `${50 - Math.min(Math.abs(impact.value) * 5, 50)}%` : "50%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Change */}
            <div
              style={{
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.75rem",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("riskAssessment")}</div>
              <div style={{ color: "#E8E0D4", lineHeight: "1.6" }}>
                {selectedScenario.impactSummary.riskChange}
              </div>
            </div>

            <button
              onClick={() => {
                console.log("Implementing scenario:", selectedScenario.name);
                setSelectedScenario(null);
              }}
              style={{
                width: "100%",
                background: "#C4A882",
                color: "#0F0F0F",
                border: "none",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {t("runThisScenario")}
            </button>
          </div>
        </div>
      )}

      {/* New Scenario Modal */}
      {showNewScenario && (
        <div
          onClick={() => setShowNewScenario(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                {t("createNewScenario")}
              </h2>
              <button
                onClick={() => setShowNewScenario(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9A9080",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {t("scenarioName")}
                </label>
                <input
                  type="text"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                  placeholder={t("scenarioNamePlaceholder")}
                  style={{
                    width: "100%",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    padding: "0.625rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {t("descriptionLabel")}
                </label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  style={{
                    width: "100%",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    padding: "0.625rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                    resize: "vertical",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  {t("budgetChange")}
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={newScenario.budgetChange}
                  onChange={(e) => setNewScenario({ ...newScenario, budgetChange: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>-50%</span>
                  <span
                    style={{
                      color: newScenario.budgetChange === 0 ? "#9A9080" : newScenario.budgetChange > 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {newScenario.budgetChange > 0 ? "+" : ""}
                    {newScenario.budgetChange}%
                  </span>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>+50%</span>
                </div>
              </div>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  {t("scheduleChange")}
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={newScenario.scheduleDays}
                  onChange={(e) => setNewScenario({ ...newScenario, scheduleDays: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>-30 days</span>
                  <span
                    style={{
                      color: newScenario.scheduleDays === 0 ? "#9A9080" : newScenario.scheduleDays > 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {newScenario.scheduleDays > 0 ? "+" : ""}
                    {newScenario.scheduleDays} days
                  </span>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>+30 days</span>
                </div>
              </div>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  {t("vfxIntensity")}
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={newScenario.vfxIntensity}
                  onChange={(e) => setNewScenario({ ...newScenario, vfxIntensity: Number(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>-50%</span>
                  <span
                    style={{
                      color: newScenario.vfxIntensity === 0 ? "#9A9080" : newScenario.vfxIntensity > 0 ? "#C45C5C" : "#5B8C5A",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {newScenario.vfxIntensity > 0 ? "+" : ""}
                    {newScenario.vfxIntensity}%
                  </span>
                  <span style={{ color: "#6B6560", fontSize: "0.75rem" }}>+50%</span>
                </div>
              </div>
              <button
                onClick={handleRunScenario}
                disabled={!newScenario.name || !newScenario.description}
                style={{
                  width: "100%",
                  background: !newScenario.name || !newScenario.description ? "#242424" : "#C4A882",
                  color: !newScenario.name || !newScenario.description ? "#6B6560" : "#0F0F0F",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: !newScenario.name || !newScenario.description ? "not-allowed" : "pointer",
                }}
              >
                {t("runScenario")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(200%);
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }
        `}
      </style>
    </div>
  );
}
