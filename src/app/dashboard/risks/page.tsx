"use client";

import { useState } from "react";
import { riskAlerts } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { risksTranslations } from "@/lib/translations/risks";
import type { RiskAlert } from "@/lib/types";

export default function RisksPage() {
  const { t } = useTranslation(risksTranslations);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [risks, setRisks] = useState<RiskAlert[]>(riskAlerts);

  // Calculate stats
  const totalRisks = risks.length;
  const critical = risks.filter((r) => r.severity === "critical").length;
  const high = risks.filter((r) => r.severity === "high").length;
  const medium = risks.filter((r) => r.severity === "medium").length;
  const low = risks.filter((r) => r.severity === "low").length;
  const totalImpact = risks.reduce((sum, r) => sum + r.impactAmount, 0);
  const mitigatedCount = risks.filter((r) => r.mitigated).length;

  // Get unique types
  const types = [...new Set(risks.map((r) => r.type))];

  // Apply filters
  const filteredRisks = risks.filter((risk) => {
    if (severityFilter !== "all" && risk.severity !== severityFilter) return false;
    if (typeFilter !== "all" && risk.type !== typeFilter) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "#8B1E3F",
      high: "#C45C5C",
      medium: "#C4A042",
      low: "#5B7C8C",
    };
    return colors[severity as keyof typeof colors] || "#6B6560";
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      budget: "IndianRupee",
      schedule: "Calendar",
      weather: "Cloud",
      vfx: "Sparkles",
      market: "TrendingUp",
      actor: "Users",
    };
    return icons[type] || "AlertTriangle";
  };

  const toggleMitigated = (id: string) => {
    setRisks(risks.map((r) => (r.id === id ? { ...r, mitigated: !r.mitigated } : r)));
  };

  // Risk heat map data
  const severities = ["critical", "high", "medium", "low"];
  const heatMapData = types.map((type) => ({
    type,
    data: severities.map((severity) => ({
      severity,
      count: risks.filter((r) => r.type === type && r.severity === severity).length,
    })),
  }));

  return (
    <div style={{ padding: "2rem", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <LucideIcon name="AlertTriangle" size={32} color="#C4A882" />
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ color: "#9A9080", margin: 0 }}>{t("pageSubtitle")}</p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: t("totalRisks"), value: totalRisks, icon: "AlertTriangle", color: "#C4A882" },
          { label: t("criticalLabel"), value: critical, icon: "Flame", color: "#8B1E3F" },
          { label: t("highLabel"), value: high, icon: "AlertTriangle", color: "#C45C5C" },
          { label: t("mediumLabel"), value: medium, icon: "Shield", color: "#C4A042" },
          { label: t("lowLabel"), value: low, icon: "CheckCircle", color: "#5B7C8C" },
          { label: t("totalImpact"), value: formatCrores(totalImpact), icon: "IndianRupee", color: "#C4A882" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "1rem",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <LucideIcon name={stat.icon} size={20} color={stat.color} />
              <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("severity")}
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#333333",
                border: "1px solid #3A3A3A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allSeverities")}</option>
              <option value="critical">{t("criticalLabel")}</option>
              <option value="high">{t("highLabel")}</option>
              <option value="medium">{t("mediumLabel")}</option>
              <option value="low">{t("lowLabel")}</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("typeLabel")}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#333333",
                border: "1px solid #3A3A3A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allTypes")}</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            style={{
              background: "#262626",
              border: `1px solid ${risk.severity === "critical" ? getSeverityColor(risk.severity) : "#3A3A3A"}`,
              borderRadius: "1rem",
              padding: "1.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {risk.severity === "critical" && (
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "50%",
                  background: getSeverityColor(risk.severity),
                  animation: "pulse 2s infinite",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
              <div
                style={{
                  background: getSeverityColor(risk.severity) + "20",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                }}
              >
                <LucideIcon name={getTypeIcon(risk.type)} size={24} color={getSeverityColor(risk.severity)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      background: getSeverityColor(risk.severity) + "20",
                      color: getSeverityColor(risk.severity),
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {risk.severity}
                  </span>
                  <span
                    style={{
                      background: "#333333",
                      color: "#9A9080",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {risk.type}
                  </span>
                  {risk.mitigated && (
                    <span
                      style={{
                        background: "#5B8C5A20",
                        color: "#5B8C5A",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      {t("mitigated")}
                    </span>
                  )}
                </div>
                <p style={{ color: "#E8E0D4", fontSize: "0.875rem", margin: "0 0 1rem 0", lineHeight: "1.6" }}>
                  {risk.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: "#6B6560", fontSize: "0.875rem" }}>{t("impact")} </span>
                    <span style={{ color: "#C4A882", fontSize: "0.875rem", fontWeight: "600" }}>
                      {formatCrores(risk.impactAmount)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleMitigated(risk.id)}
                    style={{
                      background: risk.mitigated ? "#5B8C5A" : "transparent",
                      color: risk.mitigated ? "#E8E0D4" : "#9A9080",
                      border: `1px solid ${risk.mitigated ? "#5B8C5A" : "#3A3A3A"}`,
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {risk.mitigated ? t("mitigated") : t("markAsMitigated")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Heat Map & Total Exposure */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Risk Heat Map */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
            {t("riskHeatMap")}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${severities.length}, 1fr)`, gap: "0.5rem" }}>
              {/* Header */}
              <div />
              {severities.map((s) => (
                <div
                  key={s}
                  style={{
                    color: "#9A9080",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    padding: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {s}
                </div>
              ))}
              {/* Rows */}
              {heatMapData.map((row) => (
                <>
                  <div
                    key={`${row.type}-label`}
                    style={{
                      color: "#E8E0D4",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      padding: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.type}
                  </div>
                  {row.data.map((cell) => (
                    <div
                      key={`${row.type}-${cell.severity}`}
                      style={{
                        background:
                          cell.count > 0
                            ? getSeverityColor(cell.severity) + Math.min(20 + cell.count * 20, 80).toString(16)
                            : "#333333",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: cell.count > 0 ? getSeverityColor(cell.severity) : "#6B6560",
                        fontWeight: "700",
                      }}
                    >
                      {cell.count || "-"}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Total Risk Exposure */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
            {t("riskExposureBreakdown")}
          </h3>
          {severities.map((severity) => {
            const severityRisks = risks.filter((r) => r.severity === severity);
            const severityImpact = severityRisks.reduce((sum, r) => sum + r.impactAmount, 0);
            const percentage = totalImpact > 0 ? (severityImpact / totalImpact) * 100 : 0;

            return (
              <div key={severity} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      color: getSeverityColor(severity),
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {severity}
                  </span>
                  <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>
                    {formatCrores(severityImpact)} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div
                  style={{
                    height: "0.5rem",
                    background: "#333333",
                    borderRadius: "0.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: getSeverityColor(severity),
                      width: `${percentage}%`,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "#333333",
              borderRadius: "0.75rem",
              borderLeft: `4px solid #C4A882`,
            }}
          >
            <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              {t("totalRiskExposure")}
            </div>
            <div style={{ color: "#C4A882", fontSize: "1.75rem", fontWeight: "700" }}>
              {formatCrores(totalImpact)}
            </div>
            <div style={{ color: "#6B6560", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              {mitigatedCount} {t("of")} {totalRisks} {t("risksMitigated")}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
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
