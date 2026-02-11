"use client";

import { useState } from "react";
import { vfxShots } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { shotPipelineTranslations } from "@/lib/translations/shot-pipeline";

type PipelineStage = "pending" | "in_progress" | "review" | "approved" | "rework";

export default function ShotPipelinePage() {
  const { t } = useTranslation(shotPipelineTranslations);
  const [shots, setShots] = useState(
    vfxShots.map((shot) => ({
      ...shot,
      pipelineStage: (shot.status === "pending"
        ? "pending"
        : shot.status === "in_progress"
        ? "in_progress"
        : shot.status === "review"
        ? "review"
        : shot.status === "approved"
        ? "approved"
        : "rework") as PipelineStage,
    }))
  );

  const stageKeys: { key: PipelineStage; labelKey: string; color: string }[] = [
    { key: "pending", labelKey: "pending", color: "#6B6560" },
    { key: "in_progress", labelKey: "inProgress", color: "#5B7C8C" },
    { key: "review", labelKey: "review", color: "#C4A042" },
    { key: "approved", labelKey: "approved", color: "#5B8C5A" },
    { key: "rework", labelKey: "rework", color: "#C45C5C" },
  ];

  const stages = stageKeys.map((s) => ({ ...s, label: t(s.labelKey) }));

  const moveShotToStage = (shotId: string, newStage: PipelineStage) => {
    setShots(shots.map((s) => (s.id === shotId ? { ...s, pipelineStage: newStage } : s)));
  };

  // Calculate stats per stage
  const stageStats = stages.map((stage) => {
    const stageShots = shots.filter((s) => s.pipelineStage === stage.key);
    const totalCost = stageShots.reduce((sum, s) => sum + s.estimatedCost, 0);
    return {
      ...stage,
      count: stageShots.length,
      totalCost,
    };
  });

  // Identify bottleneck
  const bottleneck = stageStats.reduce((max, curr) => (curr.count > max.count ? curr : max), stageStats[0]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "extreme":
        return "#C45C5C";
      case "high":
        return "#C4A042";
      case "medium":
        return "#5B7C8C";
      case "low":
        return "#5B8C5A";
      default:
        return "#9A9080";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <LucideIcon name="GitBranch" size={32} style={{ color: "#C4A882" }} />
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageDescription")}
        </p>
      </div>

      {/* Pipeline Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {stageStats.map((stat) => (
          <div
            key={stat.key}
            style={{
              background: "#262626",
              border: `1px solid ${stat.color}20`,
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#9A9080" }}>{stat.label}</span>
              {stat.key === bottleneck.key && stat.count > 2 && (
                <LucideIcon name="AlertTriangle" size={16} style={{ color: "#C4A042" }} />
              )}
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
              {formatCrores(stat.totalCost)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck Alert */}
      {bottleneck.count > 2 && (
        <div
          style={{
            background: "rgba(196, 160, 66, 0.1)",
            border: "1px solid rgba(196, 160, 66, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C4A042" }} />
          <div>
            <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "600" }}>{t("bottleneckDetected")}</span>
            <span style={{ fontSize: "14px", color: "#9A9080" }}>
              {bottleneck.count} {t("shotsWaitingIn")} {bottleneck.label} {t("stage")}
            </span>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          overflowX: "auto",
        }}
      >
        {stages.map((stage) => {
          const stageShots = shots.filter((s) => s.pipelineStage === stage.key);

          return (
            <div key={stage.key}>
              {/* Column Header */}
              <div
                style={{
                  background: "#262626",
                  border: `2px solid ${stage.color}40`,
                  borderRadius: "12px 12px 0 0",
                  padding: "16px",
                  borderBottom: `3px solid ${stage.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
                    {stage.label}
                  </h3>
                  <span
                    style={{
                      background: `${stage.color}20`,
                      color: stage.color,
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {stageShots.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div
                style={{
                  background: "#262626",
                  border: "1px solid #3A3A3A",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  padding: "12px",
                  minHeight: "400px",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {stageShots.map((shot) => (
                    <div
                      key={shot.id}
                      style={{
                        background: "#333333",
                        border: "1px solid #3A3A3A",
                        borderRadius: "8px",
                        padding: "12px",
                        cursor: "grab",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C4A882";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#3A3A3A";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                          {t("scene")} {shot.sceneNumber} - {t("shot")} {shot.shotNumber}
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: `${getComplexityColor(shot.complexity)}20`,
                            color: getComplexityColor(shot.complexity),
                            textTransform: "uppercase",
                          }}
                        >
                          {shot.complexity}
                        </div>
                      </div>

                      <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "8px" }}>
                        <div style={{ marginBottom: "4px" }}>{t("type")}: {shot.type.toUpperCase()}</div>
                        <div>{t("vendorLabel")}: {shot.vendor}</div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "8px",
                          borderTop: "1px solid #3A3A3A",
                        }}
                      >
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>
                          {formatCrores(shot.estimatedCost)}
                        </div>
                        {shot.reworkCount > 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px",
                              color: "#C45C5C",
                            }}
                          >
                            <LucideIcon name="RotateCcw" size={12} />
                            {shot.reworkCount}
                          </div>
                        )}
                      </div>

                      {/* Move buttons */}
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                        {stage.key !== "pending" && (
                          <button
                            onClick={() => {
                              const prevStageIdx = stages.findIndex((s) => s.key === stage.key) - 1;
                              if (prevStageIdx >= 0) {
                                moveShotToStage(shot.id, stages[prevStageIdx].key);
                              }
                            }}
                            style={{
                              flex: 1,
                              background: "transparent",
                              border: "1px solid #4A4A4A",
                              borderRadius: "4px",
                              padding: "4px",
                              color: "#9A9080",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            ←
                          </button>
                        )}
                        {stage.key !== "approved" && (
                          <button
                            onClick={() => {
                              const nextStageIdx = stages.findIndex((s) => s.key === stage.key) + 1;
                              if (nextStageIdx < stages.length) {
                                moveShotToStage(shot.id, stages[nextStageIdx].key);
                              }
                            }}
                            style={{
                              flex: 1,
                              background: "#C4A882",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px",
                              color: "#1A1A1A",
                              fontSize: "10px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "24px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "16px" }}>
          {t("complexityLegend")}
        </h3>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { level: "extreme", labelKey: "extreme" },
            { level: "high", labelKey: "high" },
            { level: "medium", labelKey: "medium" },
            { level: "low", labelKey: "low" },
          ].map((item) => (
            <div key={item.level} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background: getComplexityColor(item.level),
                }}
              />
              <span style={{ fontSize: "13px", color: "#9A9080" }}>{t(item.labelKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
