"use client";

import { useState } from "react";
import { vfxShots } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { reworkTranslations } from "@/lib/translations/rework";

export default function ReworkPage() {
  const { t } = useTranslation(reworkTranslations);
  // Mock rework history data
  const [reworkHistory] = useState([
    { shotId: "vfx_002", iteration: 1, date: "2026-01-18", reason: "Color grading adjustments", cost: 0.05 },
    { shotId: "vfx_002", iteration: 2, date: "2026-01-25", reason: "Director feedback on timing", cost: 0.03 },
  ]);

  // Get shots with rework or create mock rework items
  const reworkShots = vfxShots
    .map((shot) => {
      const shotReworks = reworkHistory.filter((r) => r.shotId === shot.id);
      return {
        ...shot,
        reworkHistory: shotReworks,
        totalReworkCost: shotReworks.reduce((sum, r) => sum + r.cost, 0),
      };
    })
    .filter((shot) => shot.reworkCount > 0 || shot.status === "rework" || shot.reworkHistory.length > 0);

  const stats = {
    totalReworks: reworkShots.reduce((sum, s) => sum + s.reworkCount, 0) + reworkHistory.length,
    activeReworks: reworkShots.filter((s) => s.status === "rework" || s.status === "review").length,
    resolvedReworks: reworkShots.filter((s) => s.status === "approved").length,
    avgIterations: reworkShots.length > 0
      ? (reworkShots.reduce((sum, s) => sum + (s.reworkHistory.length || s.reworkCount), 0) / reworkShots.length).toFixed(1)
      : "0",
    totalReworkCost: reworkShots.reduce((sum, s) => sum + s.totalReworkCost, 0) + 0.15, // Add estimated additional cost
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "rgba(91, 140, 90, 0.15)", text: "#5B8C5A" };
      case "review":
        return { bg: "rgba(196, 160, 66, 0.15)", text: "#C4A042" };
      case "rework":
        return { bg: "rgba(196, 92, 92, 0.15)", text: "#C45C5C" };
      default:
        return { bg: "rgba(154, 144, 128, 0.15)", text: "#9A9080" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F0F", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <LucideIcon name="RotateCcw" size={32} style={{ color: "#C4A882" }} />
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageDescription")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="RotateCcw" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalReworks")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalReworks}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C45C5C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("active")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.activeReworks}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="CheckCircle" size={20} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("resolved")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.resolvedReworks}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="GitBranch" size={20} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("avgIterations")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.avgIterations}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="IndianRupee" size={20} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("reworkCost")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalReworkCost)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Rework Items Table */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "16px" }}>
            {t("reworkItems")}
          </h2>
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#242424", borderBottom: "1px solid #2A2A2A" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("shot")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("vendor")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("iterations")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("status")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "right", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("reworkCostHeader")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {reworkShots.map((shot, idx) => {
                  const statusStyle = getStatusColor(shot.status);
                  const iterations = shot.reworkHistory.length || shot.reworkCount || 1;
                  return (
                    <tr
                      key={shot.id}
                      style={{
                        borderBottom: idx < reworkShots.length - 1 ? "1px solid #2A2A2A" : "none",
                      }}
                    >
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                          Scene {shot.sceneNumber} - Shot {shot.shotNumber}
                        </div>
                        <div style={{ fontSize: "12px", color: "#9A9080", marginTop: "2px" }}>
                          {shot.type.toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ fontSize: "13px", color: "#9A9080" }}>{shot.vendor}</span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: "#242424",
                            border: "1px solid #3A3A3A",
                            borderRadius: "6px",
                            padding: "4px 12px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: iterations > 2 ? "#C45C5C" : iterations > 1 ? "#C4A042" : "#5B7C8C",
                          }}
                        >
                          {iterations}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            textTransform: "capitalize",
                          }}
                        >
                          {shot.status === "in_progress" ? t("inProgress") : shot.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <span style={{ fontSize: "14px", color: "#C4A042", fontWeight: "600" }}>
                          {formatCrores(shot.totalReworkCost || 0.08)}
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <button
                          style={{
                            background: "transparent",
                            border: "1px solid #3A3A3A",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: "#9A9080",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {t("viewHistory")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rework Statistics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Cost Impact */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("costImpact")}
            </h3>
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                background: "#242424",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#C4A042", marginBottom: "8px" }}>
                {formatCrores(stats.totalReworkCost)}
              </div>
              <div style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalReworkCost")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#6B6560", lineHeight: "1.6" }}>
              {t("costImpactDescription")}
            </div>
          </div>

          {/* Top Rework Reasons */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("topReworkReasons")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { reason: t("colorGradingAdjustments"), count: 3, percentage: 35 },
                { reason: t("timingPacingFeedback"), count: 2, percentage: 25 },
                { reason: t("detailEnhancement"), count: 2, percentage: 20 },
                { reason: t("compositingRefinement"), count: 1, percentage: 15 },
                { reason: t("other"), count: 1, percentage: 5 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#E8E0D4" }}>{item.reason}</span>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{item.count}x</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      background: "#242424",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: "100%",
                        background: "#C4A882",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Performance */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("reworkByVendor")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { vendor: "DNEG", reworks: 1, shots: 6 },
                { vendor: "Framestore", reworks: 0, shots: 2 },
                { vendor: "Makuta VFX", reworks: 0, shots: 4 },
              ].map((vendor) => {
                const reworkRate = (vendor.reworks / vendor.shots) * 100;
                return (
                  <div
                    key={vendor.vendor}
                    style={{
                      background: "#242424",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                        {vendor.vendor}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: reworkRate === 0 ? "#5B8C5A" : reworkRate < 20 ? "#C4A042" : "#C45C5C",
                        }}
                      >
                        {reworkRate.toFixed(0)}% {t("reworkRate")}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#9A9080" }}>
                      {vendor.reworks} {t("reworksOutOf")} {vendor.shots} {t("shotsLabel")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rework Timeline (Selected Shot) */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
          marginTop: "24px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
          {t("reworkHistoryTimeline")}
        </h3>
        {reworkHistory.length > 0 ? (
          <div style={{ position: "relative", paddingLeft: "40px" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "16px",
                bottom: "16px",
                width: "2px",
                background: "#2A2A2A",
              }}
            />

            {reworkHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  marginBottom: idx < reworkHistory.length - 1 ? "24px" : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-32px",
                    top: "8px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#C4A882",
                    border: "3px solid #1A1A1A",
                  }}
                />

                <div
                  style={{
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                        {t("iteration")} {item.iteration}
                      </span>
                      <span style={{ fontSize: "12px", color: "#9A9080", marginLeft: "12px" }}>
                        {t("shotLabel")}: {item.shotId}
                      </span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>
                      {formatCrores(item.cost)}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#9A9080", marginBottom: "4px" }}>
                    {item.reason}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B6560" }}>
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#6B6560" }}>
            {t("noReworkHistory")}
          </div>
        )}
      </div>
    </div>
  );
}
