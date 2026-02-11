"use client";

import { useState } from "react";
import { budgetCategories, vfxShots, revenueStreams, riskAlerts, shootingSchedule } from "@/data/mock-data";
import { formatCrores, formatDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { reportsTranslations } from "@/lib/translations/reports";

type ReportType = "budget" | "schedule" | "vfx" | "revenue" | "risk" | "production" | null;

export default function ReportsPage() {
  const { t } = useTranslation(reportsTranslations);
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const reports = [
    {
      id: "budget" as ReportType,
      title: t("budgetReport"),
      description: t("budgetReportDesc"),
      icon: "IndianRupee",
      color: "#C4A882",
      lastGenerated: "2026-02-09",
    },
    {
      id: "schedule" as ReportType,
      title: t("scheduleReport"),
      description: t("scheduleReportDesc"),
      icon: "Calendar",
      color: "#5B7C8C",
      lastGenerated: "2026-02-10",
    },
    {
      id: "vfx" as ReportType,
      title: t("vfxReport"),
      description: t("vfxReportDesc"),
      icon: "Sparkles",
      color: "#C4A042",
      lastGenerated: "2026-02-08",
    },
    {
      id: "revenue" as ReportType,
      title: t("revenueReport"),
      description: t("revenueReportDesc"),
      icon: "TrendingUp",
      color: "#5B8C5A",
      lastGenerated: "2026-02-07",
    },
    {
      id: "risk" as ReportType,
      title: t("riskReport"),
      description: t("riskReportDesc"),
      icon: "Shield",
      color: "#C45C5C",
      lastGenerated: "2026-02-10",
    },
    {
      id: "production" as ReportType,
      title: t("productionReport"),
      description: t("productionReportDesc"),
      icon: "Film",
      color: "#9A9080",
      lastGenerated: "2026-02-10",
    },
  ];

  const modules = [
    { id: "budget", label: t("budgetAnalysis") },
    { id: "schedule", label: t("scheduleStatus") },
    { id: "vfx", label: t("vfxBreakdown") },
    { id: "revenue", label: t("revenueProjections") },
    { id: "risks", label: t("riskAssessment") },
    { id: "daily", label: t("dailyProgress") },
  ];

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  const getReportSummary = (reportType: ReportType) => {
    switch (reportType) {
      case "budget": {
        const totalPlanned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
        const totalActual = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
        const variance = ((totalActual - totalPlanned) / totalPlanned) * 100;
        return {
          stats: [
            { label: t("totalPlanned"), value: formatCrores(totalPlanned) },
            { label: t("totalSpent"), value: formatCrores(totalActual) },
            { label: t("variance"), value: `${variance > 0 ? "+" : ""}${variance.toFixed(1)}%` },
            { label: t("categories"), value: budgetCategories.length },
          ],
        };
      }
      case "schedule": {
        const completed = shootingSchedule.filter((s) => s.status === "completed").length;
        const delayed = shootingSchedule.filter((s) => s.status === "delayed").length;
        return {
          stats: [
            { label: t("totalDays"), value: shootingSchedule.length },
            { label: t("completed"), value: completed },
            { label: t("delayed"), value: delayed },
            { label: t("completion"), value: `${((completed / shootingSchedule.length) * 100).toFixed(0)}%` },
          ],
        };
      }
      case "vfx": {
        const totalShots = vfxShots.length;
        const completed = vfxShots.filter((s) => s.status === "approved").length;
        const totalCost = vfxShots.reduce((sum, s) => sum + s.estimatedCost, 0);
        return {
          stats: [
            { label: t("totalShots"), value: totalShots },
            { label: t("completed"), value: completed },
            { label: t("estBudget"), value: formatCrores(totalCost) },
            { label: t("completion"), value: `${((completed / totalShots) * 100).toFixed(0)}%` },
          ],
        };
      }
      case "revenue": {
        const totalRevenue = revenueStreams.reduce((sum, r) => sum + r.projected, 0);
        const theatrical = revenueStreams.filter((r) => r.type === "theatrical").reduce((sum, r) => sum + r.projected, 0);
        return {
          stats: [
            { label: t("totalProjected"), value: formatCrores(totalRevenue) },
            { label: t("theatrical"), value: formatCrores(theatrical) },
            { label: t("territories"), value: revenueStreams.length },
            { label: t("roiEst"), value: "2.17x" },
          ],
        };
      }
      case "risk": {
        const totalRisks = riskAlerts.length;
        const critical = riskAlerts.filter((r) => r.severity === "critical").length;
        const totalImpact = riskAlerts.reduce((sum, r) => sum + r.impactAmount, 0);
        const mitigated = riskAlerts.filter((r) => r.mitigated).length;
        return {
          stats: [
            { label: t("totalRisks"), value: totalRisks },
            { label: t("critical"), value: critical },
            { label: t("totalImpactLabel"), value: formatCrores(totalImpact) },
            { label: t("mitigated"), value: mitigated },
          ],
        };
      }
      case "production": {
        return {
          stats: [
            { label: t("budget"), value: formatCrores(350) },
            { label: t("spent"), value: formatCrores(187.5) },
            { label: t("healthScore"), value: "78/100" },
            { label: t("daysLabel"), value: "42/85" },
          ],
        };
      }
      default:
        return { stats: [] };
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <LucideIcon name="FileText" size={32} color="#C4A882" />
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ color: "#9A9080", margin: 0 }}>{t("pageSubtitle")}</p>
      </div>

      {/* Report Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            style={{
              background: "#1A1A1A",
              border: `1px solid ${selectedReport === report.id ? report.color : "#2A2A2A"}`,
              borderRadius: "1rem",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (selectedReport !== report.id) {
                e.currentTarget.style.borderColor = "#3A3A3A";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedReport !== report.id) {
                e.currentTarget.style.borderColor = "#2A2A2A";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  background: report.color + "20",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                }}
              >
                <LucideIcon name={report.icon} size={24} color={report.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", margin: "0 0 0.5rem 0" }}>
                  {report.title}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "0.875rem", margin: 0, lineHeight: "1.4" }}>
                  {report.description}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem",
                borderTop: "1px solid #2A2A2A",
              }}
            >
              <div>
                <div style={{ color: "#6B6560", fontSize: "0.75rem" }}>{t("lastGenerated")}</div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", fontWeight: "600" }}>
                  {formatDate(report.lastGenerated)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Generating ${report.title}`);
                }}
                style={{
                  background: report.color,
                  color: "#0F0F0F",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("generate")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Area */}
      {selectedReport && (
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
              {reports.find((r) => r.id === selectedReport)?.title} {t("preview")}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["PDF", "Excel", "CSV"].map((format) => (
                <button
                  key={format}
                  onClick={() => console.log(`Download ${format}`)}
                  style={{
                    background: "#242424",
                    color: "#C4A882",
                    border: "1px solid #2A2A2A",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {getReportSummary(selectedReport).stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "#242424",
                  border: "1px solid #2A2A2A",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                }}
              >
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{stat.label}</div>
                <div style={{ color: "#E8E0D4", fontSize: "1.5rem", fontWeight: "700" }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Report Builder */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("customReportBuilder")}
          </h2>
          <button
            onClick={() => setShowCustomBuilder(!showCustomBuilder)}
            style={{
              background: "transparent",
              color: "#C4A882",
              border: "1px solid #C4A882",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {showCustomBuilder ? t("hideBuilder") : t("showBuilder")}
          </button>
        </div>

        {showCustomBuilder && (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Module Selection */}
            <div>
              <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {t("selectModules")}
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => toggleModule(module.id)}
                    style={{
                      background: selectedModules.includes(module.id) ? "#C4A88220" : "#242424",
                      border: `1px solid ${selectedModules.includes(module.id) ? "#C4A882" : "#2A2A2A"}`,
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        borderRadius: "0.25rem",
                        border: `2px solid ${selectedModules.includes(module.id) ? "#C4A882" : "#6B6560"}`,
                        background: selectedModules.includes(module.id) ? "#C4A882" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedModules.includes(module.id) && (
                        <LucideIcon name="CheckCircle" size={12} color="#0F0F0F" />
                      )}
                    </div>
                    <span
                      style={{
                        color: selectedModules.includes(module.id) ? "#E8E0D4" : "#9A9080",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      {module.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {t("dateRange")}
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#6B6560", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    {t("from")}
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
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
                  <label style={{ display: "block", color: "#6B6560", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    {t("to")}
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
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
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => console.log("Generating custom report", { selectedModules, dateRange })}
              disabled={selectedModules.length === 0}
              style={{
                background: selectedModules.length === 0 ? "#242424" : "#C4A882",
                color: selectedModules.length === 0 ? "#6B6560" : "#0F0F0F",
                border: "none",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: selectedModules.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {t("generateCustomReport")} ({selectedModules.length} {t("modulesSelected")})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
