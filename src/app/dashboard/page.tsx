"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  producerStats,
  directorStats,
  productionHeadStats,
  vfxHeadStats,
  financierStats,
  marketingHeadStats,
  scenes,
  budgetCategories,
  shootingSchedule,
  vfxShots,
  campaigns,
  revenueStreams,
  approvals,
  riskAlerts,
  dailyProgress,
  crewMembers,
} from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores, formatDate, formatShortDate, getRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "@/lib/translations";
import { dashboardHomeTranslations } from "@/lib/translations/dashboard-home";

// ====================================================
// SHARED COMPONENTS
// ====================================================

interface StatCardProps {
  stat: {
    label: string;
    value: string | number;
    icon?: string;
    change?: number;
    changeLabel?: string;
    trend?: "up" | "down" | "neutral";
    color?: "gold" | "success" | "warning" | "danger" | "info";
  };
}

const StatCard = ({ stat }: StatCardProps) => {
  const getIconColor = () => {
    switch (stat.color) {
      case "gold":
        return "#C4A882";
      case "success":
        return "#5B8C5A";
      case "warning":
        return "#C4A042";
      case "danger":
        return "#C45C5C";
      case "info":
        return "#5B7C8C";
      default:
        return "#C4A882";
    }
  };

  const getTrendColor = () => {
    if (!stat.trend) return "#9A9080";
    return stat.trend === "up" ? "#5B8C5A" : "#C45C5C";
  };

  return (
    <div
      style={{
        background: "#1A1A1A",
        border: "1px solid #2A2A2A",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3A3A3A";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2A2A2A";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {stat.icon && (
        <div style={{ marginBottom: "12px" }}>
          <LucideIcon name={stat.icon} size={24} color={getIconColor()} />
        </div>
      )}
      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#E8E0D4",
          marginBottom: "8px",
        }}
      >
        {stat.value}
      </div>
      <div style={{ fontSize: "14px", color: "#9A9080", marginBottom: "4px" }}>
        {stat.label}
      </div>
      {stat.change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          <LucideIcon
            name={stat.trend === "up" ? "TrendingUp" : "TrendingDown"}
            size={14}
            color={getTrendColor()}
          />
          <span style={{ fontSize: "13px", color: getTrendColor() }}>
            {stat.change > 0 ? "+" : ""}
            {stat.change.toFixed(1)}%
          </span>
          {stat.changeLabel && (
            <span style={{ fontSize: "12px", color: "#6B6560", marginLeft: "4px" }}>
              {stat.changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ title, icon }: { title: string; icon?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
    {icon && <LucideIcon name={icon} size={24} color="#C4A882" />}
    <h2
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#E8E0D4",
        margin: 0,
      }}
    >
      {title}
    </h2>
  </div>
);

// ====================================================
// PRODUCER DASHBOARD
// ====================================================

const ProducerDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const topRisks = riskAlerts.filter((r) => !r.mitigated).slice(0, 3);
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);

  const upcomingShootDays = shootingSchedule
    .filter((day) => day.status === "planned")
    .slice(0, 4);

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {producerStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Budget Overview */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("budgetOverview")} icon="PieChart" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {budgetCategories.map((category) => {
              const percentage = (category.actual / category.planned) * 100;
              const isOverBudget = percentage > 100;
              return (
                <div key={category.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                      {category.name}
                    </span>
                    <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                      <span style={{ color: "#9A9080" }}>
                        {t("planned")} {formatCrores(category.planned)}
                      </span>
                      <span
                        style={{
                          color: isOverBudget ? "#C45C5C" : "#5B8C5A",
                          fontWeight: "600",
                        }}
                      >
                        {t("actual")} {formatCrores(category.actual)}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "#242424",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${Math.min(percentage, 100)}%`,
                        background: isOverBudget
                          ? "linear-gradient(90deg, #C4A042 0%, #C45C5C 100%)"
                          : "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                    {percentage.toFixed(1)}% {t("utilized")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Pending Approvals */}
        <div>
          <SectionHeader title={t("pendingApprovals")} icon="Clock" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  style={{
                    padding: "16px",
                    background: "#242424",
                    borderRadius: "12px",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#E8E0D4",
                          marginBottom: "4px",
                        }}
                      >
                        {approval.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9A9080" }}>
                        {t("by")} {approval.requestedBy}
                      </div>
                    </div>
                    {approval.amount && (
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#C4A882",
                        }}
                      >
                        {formatCrores(approval.amount)}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#9A9080",
                      marginBottom: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    {approval.description}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #5B8C5A 0%, #4A7A49 100%)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#E8E0D4",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #6A9B69 0%, #5B8C5A 100%)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #5B8C5A 0%, #4A7A49 100%)";
                      }}
                    >
                      {t("approve")}
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 16px",
                        background: "#242424",
                        border: "1px solid #3A3A3A",
                        borderRadius: "8px",
                        color: "#9A9080",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C45C5C";
                        e.currentTarget.style.color = "#C45C5C";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#3A3A3A";
                        e.currentTarget.style.color = "#9A9080";
                      }}
                    >
                      {t("reject")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div>
          <SectionHeader title={t("riskAlerts")} icon="AlertTriangle" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {topRisks.map((risk) => {
                const severityColor =
                  risk.severity === "critical"
                    ? "#C45C5C"
                    : risk.severity === "high"
                      ? "#C4A042"
                      : risk.severity === "medium"
                        ? "#5B7C8C"
                        : "#9A9080";
                return (
                  <div
                    key={risk.id}
                    style={{
                      padding: "16px",
                      background: "#242424",
                      borderRadius: "12px",
                      border: `1px solid ${severityColor}30`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          padding: "4px 12px",
                          background: `${severityColor}20`,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: severityColor,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {risk.severity}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#C45C5C",
                        }}
                      >
                        {formatCrores(risk.impactAmount)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#E8E0D4",
                        lineHeight: "1.5",
                        marginTop: "8px",
                      }}
                    >
                      {risk.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div>
        <SectionHeader title={t("upcomingShootDays")} icon="Calendar" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {upcomingShootDays.map((day) => (
              <div
                key={day.id}
                style={{
                  padding: "16px",
                  background: "#242424",
                  borderRadius: "12px",
                  border: "1px solid #2A2A2A",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#C4A882",
                    marginBottom: "4px",
                  }}
                >
                  {t("day")} {day.dayNumber}
                </div>
                <div style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {formatShortDate(day.date)}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#E8E0D4",
                    marginBottom: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  {day.location}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6B6560",
                  }}
                >
                  {day.scenes.length} {day.scenes.length > 1 ? t("scenesCount") : t("sceneCount")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// DIRECTOR DASHBOARD
// ====================================================

const DirectorDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const todayScenes = scenes.filter((s) => s.status === "shooting");
  const completedScenes = scenes.filter((s) => s.status === "completed");
  const vfxReviewQueue = vfxShots.filter((s) => s.status === "review");
  const upcomingScenes = scenes.filter((s) => s.status === "planned").slice(0, 5);

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {directorStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Today's Shot List */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("todaysShotList")} icon="Camera" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {todayScenes.map((scene) => (
              <div
                key={scene.id}
                style={{
                  padding: "20px",
                  background: "#242424",
                  borderRadius: "12px",
                  border: "1px solid #2A2A2A",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#C4A882",
                        }}
                      >
                        {t("sceneLabel")} {scene.sceneNumber}
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          background: "#C4A88220",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#C4A882",
                          textTransform: "uppercase",
                        }}
                      >
                        {scene.complexity}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#E8E0D4",
                        marginTop: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {scene.description}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "12px",
                        color: "#9A9080",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <LucideIcon name="MapPin" size={14} color="#9A9080" />
                        {scene.location}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <LucideIcon name="Clock" size={14} color="#9A9080" />
                        {scene.estimatedDuration}h
                      </div>
                      {scene.vfxRequired && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <LucideIcon name="Sparkles" size={14} color="#C4A042" />
                          VFX {scene.vfxIntensity}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#C4A882",
                      }}
                    >
                      {formatCrores(scene.estimatedCost)}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "12px",
                  }}
                >
                  {scene.castNeeded.map((cast, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "4px 12px",
                        background: "#1A1A1A",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#E8E0D4",
                      }}
                    >
                      {cast}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scene Completion Progress */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("sceneCompletionProgress")} icon="CheckCircle" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4" }}>
                {completedScenes.length} / {scenes.length}
              </div>
              <div style={{ fontSize: "14px", color: "#9A9080" }}>{t("scenesCompleted")}</div>
            </div>
            <div style={{ fontSize: "48px", fontWeight: "700", color: "#C4A882" }}>
              {Math.round((completedScenes.length / scenes.length) * 100)}%
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "12px",
              background: "#242424",
              borderRadius: "6px",
              overflow: "hidden",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(completedScenes.length / scenes.length) * 100}%`,
                background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* VFX Review Queue */}
        <div>
          <SectionHeader title={t("vfxReviewQueue")} icon="Sparkles" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {vfxReviewQueue.map((shot) => (
                <div
                  key={shot.id}
                  style={{
                    padding: "16px",
                    background: "#242424",
                    borderRadius: "12px",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                      {t("sceneLabel")} {shot.sceneNumber} - {t("shot")} {shot.shotNumber}
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        background: "#C4A04220",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#C4A042",
                        textTransform: "uppercase",
                      }}
                    >
                      {shot.type}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9A9080",
                      marginBottom: "8px",
                    }}
                  >
                    {t("vendor")} {shot.vendor}
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#0F0F0F",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #D4B892 0%, #E4C8A2 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)";
                    }}
                  >
                    {t("reviewNow")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Scenes */}
        <div>
          <SectionHeader title={t("upcomingScenes")} icon="Calendar" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {upcomingScenes.map((scene) => (
                <div
                  key={scene.id}
                  style={{
                    padding: "16px",
                    background: "#242424",
                    borderRadius: "12px",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#C4A882" }}>
                      {t("sceneLabel")} {scene.sceneNumber}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9A9080" }}>
                      {scene.estimatedDuration}h
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#E8E0D4",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {scene.description}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B6560" }}>{scene.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// PRODUCTION HEAD DASHBOARD
// ====================================================

const ProductionHeadDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const today = dailyProgress[0];
  const assignedCrew = crewMembers.filter((c) => c.availability === "assigned");
  const nextShootDays = shootingSchedule
    .filter((d) => d.status === "planned")
    .slice(0, 5);
  const activeIssues = today.issues || [];

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {productionHeadStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Daily Progress Summary */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("todaysProgressSummary")} icon="Activity" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#9A9080",
                  marginBottom: "8px",
                }}
              >
                {t("scenesCompletedToday")}
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#5B8C5A" }}>
                {today.scenesCompleted}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#9A9080",
                  marginBottom: "8px",
                }}
              >
                {t("budgetSpentToday")}
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#C4A882" }}>
                {formatCrores(today.budgetSpentToday)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#9A9080",
                  marginBottom: "8px",
                }}
              >
                {t("issuesLogged")}
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: activeIssues.length > 0 ? "#C4A042" : "#5B8C5A",
                }}
              >
                {activeIssues.length}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#242424",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#9A9080", marginBottom: "8px" }}>
              {t("productionNotes")}
            </div>
            <div style={{ fontSize: "14px", color: "#E8E0D4", lineHeight: "1.6" }}>
              {today.notes}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("upcomingSchedule")} icon="Calendar" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {nextShootDays.map((day, idx) => (
              <div
                key={day.id}
                style={{
                  padding: "16px",
                  background: "#242424",
                  borderRadius: "12px",
                  border: "1px solid #2A2A2A",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0F0F0F" }}>
                    {day.dayNumber}
                  </div>
                  <div style={{ fontSize: "10px", color: "#0F0F0F", opacity: 0.7 }}>{t("day").toUpperCase()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#E8E0D4",
                      marginBottom: "4px",
                    }}
                  >
                    {day.location}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9A9080" }}>
                    {formatDate(day.date)} • {day.scenes.length} {day.scenes.length > 1 ? t("scenesCount") : t("sceneCount")}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    background: "#5B8C5A20",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#5B8C5A",
                  }}
                >
                  {t("plannedStatus")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Crew Allocation */}
        <div>
          <SectionHeader title={t("crewAllocation")} icon="Users" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {assignedCrew.slice(0, 6).map((crew) => (
                <div
                  key={crew.id}
                  style={{
                    padding: "12px",
                    background: "#242424",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                      {crew.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9A9080" }}>
                      {crew.role} • {crew.department}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>
                    {formatCrores(crew.dailyRate)}{t("perDay")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issue Tracker */}
        <div>
          <SectionHeader title={t("currentIssues")} icon="AlertTriangle" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            {activeIssues.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      background: "#242424",
                      borderRadius: "12px",
                      border: "1px solid #C4A04220",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                      <LucideIcon name="AlertCircle" size={18} color="#C4A042" />
                      <div style={{ fontSize: "13px", color: "#E8E0D4", lineHeight: "1.5" }}>
                        {issue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#6B6560",
                }}
              >
                <LucideIcon name="CheckCircle" size={48} color="#5B8C5A" />
                <div style={{ marginTop: "16px", fontSize: "14px" }}>
                  {t("noIssuesReported")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// VFX HEAD DASHBOARD
// ====================================================

const VfxHeadDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const totalShots = vfxShots.length;
  const completedShots = vfxShots.filter((s) => s.status === "approved").length;
  const inProgressShots = vfxShots.filter((s) => s.status === "in_progress").length;
  const reworkShots = vfxShots.filter((s) => s.reworkCount > 0).length;
  const pendingShots = vfxShots.filter((s) => s.status === "pending").length;
  const reviewShots = vfxShots.filter((s) => s.status === "review").length;

  // Vendor distribution
  const vendorStats = vfxShots.reduce(
    (acc, shot) => {
      if (!acc[shot.vendor]) {
        acc[shot.vendor] = { total: 0, completed: 0, inProgress: 0 };
      }
      acc[shot.vendor].total++;
      if (shot.status === "approved") acc[shot.vendor].completed++;
      if (shot.status === "in_progress") acc[shot.vendor].inProgress++;
      return acc;
    },
    {} as Record<string, { total: number; completed: number; inProgress: number }>
  );

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {vfxHeadStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Shot Pipeline */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("vfxShotPipeline")} icon="GitBranch" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { label: t("pending"), count: pendingShots, color: "#6B6560" },
              { label: t("inProgress"), count: inProgressShots, color: "#5B7C8C" },
              { label: t("review"), count: reviewShots, color: "#C4A042" },
              { label: t("approved"), count: completedShots, color: "#5B8C5A" },
            ].map((stage, idx) => (
              <div
                key={idx}
                style={{
                  padding: "24px",
                  background: "#242424",
                  borderRadius: "12px",
                  border: `1px solid ${stage.color}30`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "700",
                    color: stage.color,
                    marginBottom: "8px",
                  }}
                >
                  {stage.count}
                </div>
                <div style={{ fontSize: "14px", color: "#9A9080" }}>{stage.label}</div>
                <div
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    height: "4px",
                    background: "#1A1A1A",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(stage.count / totalShots) * 100}%`,
                      background: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Vendor Distribution */}
        <div>
          <SectionHeader title={t("vendorDistribution")} icon="Building" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {Object.entries(vendorStats).map(([vendor, stats]) => (
                <div key={vendor}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                      {vendor}
                    </div>
                    <div style={{ fontSize: "13px", color: "#9A9080" }}>
                      {stats.completed} / {stats.total} shots
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "#242424",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${(stats.completed / stats.total) * 100}%`,
                        background: "linear-gradient(90deg, #5B8C5A 0%, #6A9B69 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: `${(stats.completed / stats.total) * 100}%`,
                        top: 0,
                        height: "100%",
                        width: `${(stats.inProgress / stats.total) * 100}%`,
                        background: "linear-gradient(90deg, #5B7C8C 0%, #6A8B9B 100%)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginTop: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#5B8C5A",
                          borderRadius: "2px",
                        }}
                      />
                      <span style={{ color: "#9A9080" }}>{t("completed")} {stats.completed}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#5B7C8C",
                          borderRadius: "2px",
                        }}
                      />
                      <span style={{ color: "#9A9080" }}>{t("inProgressLabel")} {stats.inProgress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rework Alerts */}
        <div>
          <SectionHeader title={t("reworkQueue")} icon="RotateCcw" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            {reworkShots > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {vfxShots
                  .filter((s) => s.reworkCount > 0)
                  .map((shot) => (
                    <div
                      key={shot.id}
                      style={{
                        padding: "16px",
                        background: "#242424",
                        borderRadius: "12px",
                        border: "1px solid #C4A04220",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                          {t("sceneLabel")} {shot.sceneNumber} - {t("shot")} {shot.shotNumber}
                        </div>
                        <div
                          style={{
                            padding: "4px 10px",
                            background: "#C4A04220",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#C4A042",
                          }}
                        >
                          {t("rework")} x{shot.reworkCount}
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "#9A9080", marginBottom: "4px" }}>
                        {shot.vendor} • {shot.type}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B6560",
                        }}
                      >
                        {t("complexity")} {shot.complexity}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#6B6560",
                }}
              >
                <LucideIcon name="CheckCircle" size={48} color="#5B8C5A" />
                <div style={{ marginTop: "16px", fontSize: "14px" }}>{t("noReworkRequired")}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// FINANCIER DASHBOARD
// ====================================================

const FinancierDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const totalRevenue = revenueStreams.reduce((sum, r) => sum + r.projected, 0);
  const totalInvestment = 350;
  const capitalDeployed = 187.5;
  const roi = totalRevenue / totalInvestment;
  const breakEven = totalInvestment * 0.815; // Typical 81.5% recovery for break-even

  // Revenue by type
  const revenueByType = revenueStreams.reduce(
    (acc, stream) => {
      acc[stream.type] = (acc[stream.type] || 0) + stream.projected;
      return acc;
    },
    {} as Record<string, number>
  );

  const criticalRisks = riskAlerts.filter((r) => r.severity === "critical" || r.severity === "high");

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {financierStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("revenueBreakdownByStream")} icon="TrendingUp" />
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(revenueByType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, amount]) => {
                const percentage = (amount / totalRevenue) * 100;
                return (
                  <div key={type}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>
                          {formatCrores(amount)}
                        </span>
                        <span style={{ fontSize: "13px", color: "#9A9080", minWidth: "50px" }}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        background: "#242424",
                        borderRadius: "5px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Risk Scorecard */}
        <div>
          <SectionHeader title={t("riskScorecard")} icon="Shield" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {criticalRisks.slice(0, 4).map((risk) => {
                const severityColor =
                  risk.severity === "critical"
                    ? "#C45C5C"
                    : risk.severity === "high"
                      ? "#C4A042"
                      : "#5B7C8C";
                return (
                  <div
                    key={risk.id}
                    style={{
                      padding: "16px",
                      background: "#242424",
                      borderRadius: "12px",
                      border: `1px solid ${severityColor}30`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          padding: "4px 12px",
                          background: `${severityColor}20`,
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: severityColor,
                          textTransform: "uppercase",
                        }}
                      >
                        {risk.severity}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#C45C5C" }}>
                        -{formatCrores(risk.impactAmount)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#E8E0D4",
                        lineHeight: "1.5",
                        marginTop: "8px",
                      }}
                    >
                      {risk.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget Burn Rate */}
        <div>
          <SectionHeader title={t("capitalDeployment")} icon="IndianRupee" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", color: "#9A9080", marginBottom: "12px" }}>
                {t("deploymentProgress")}
              </div>
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  background: "#242424",
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(capitalDeployed / totalInvestment) * 100}%`,
                    background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#9A9080" }}>{t("deployed")} {formatCrores(capitalDeployed)}</span>
                <span style={{ color: "#E8E0D4" }}>
                  {((capitalDeployed / totalInvestment) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "#242424",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                {t("breakEvenTarget")}
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#C4A882" }}>
                {formatCrores(breakEven)}
              </div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                {((breakEven / totalRevenue) * 100).toFixed(1)}% {t("ofProjectedRevenue")}
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "linear-gradient(135deg, #5B8C5A20 0%, #5B8C5A10 100%)",
                borderRadius: "12px",
                border: "1px solid #5B8C5A30",
              }}
            >
              <div style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                {t("projectedProfit")}
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#5B8C5A" }}>
                {formatCrores(totalRevenue - totalInvestment)}
              </div>
              <div style={{ fontSize: "12px", color: "#5B8C5A", marginTop: "4px" }}>
                {t("roi")} {roi.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// MARKETING HEAD DASHBOARD
// ====================================================

const MarketingHeadDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const completedCampaigns = campaigns.filter((c) => c.status === "completed");
  const upcomingCampaigns = campaigns.filter((c) => c.status === "planned");

  const totalReach = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalEngagement = campaigns.reduce((sum, c) => sum + c.engagement, 0);
  const avgSentiment =
    campaigns
      .filter((c) => c.sentimentScore > 0)
      .reduce((sum, c) => sum + c.sentimentScore, 0) /
    campaigns.filter((c) => c.sentimentScore > 0).length;

  // Platform distribution
  const platformStats = campaigns.reduce(
    (acc, campaign) => {
      if (!acc[campaign.platform]) {
        acc[campaign.platform] = { impressions: 0, engagement: 0 };
      }
      acc[campaign.platform].impressions += campaign.impressions;
      acc[campaign.platform].engagement += campaign.engagement;
      return acc;
    },
    {} as Record<string, { impressions: number; engagement: number }>
  );

  return (
    <div>
      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {marketingHeadStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Campaign Performance */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title={t("activeCampaignPerformance")} icon="Megaphone" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {activeCampaigns.map((campaign) => {
            const engagementRate = (campaign.engagement / campaign.impressions) * 100;
            return (
              <div
                key={campaign.id}
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#E8E0D4",
                        marginBottom: "4px",
                      }}
                    >
                      {campaign.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9A9080" }}>
                      {campaign.platform.toUpperCase()} • {campaign.region}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      background: "#5B8C5A20",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#5B8C5A",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("active")}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#9A9080", marginBottom: "4px" }}>
                    {t("budgetUtilization")}
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
                        height: "100%",
                        width: `${(campaign.spent / campaign.budget) * 100}%`,
                        background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9A9080",
                      marginTop: "4px",
                    }}
                  >
                    {formatCrores(campaign.spent)} / {formatCrores(campaign.budget)}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "4px" }}>
                      {t("impressions")}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                      {(campaign.impressions / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "4px" }}>
                      {t("engagement")}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#C4A882" }}>
                      {(campaign.engagement / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    background: "#242424",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "4px" }}>
                      {t("sentiment")}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#5B8C5A" }}>
                      {campaign.sentimentScore}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "4px" }}>
                      {t("engagementRate")}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#C4A882" }}>
                      {engagementRate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Platform Distribution */}
        <div>
          <SectionHeader title={t("platformDistribution")} icon="Globe" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {Object.entries(platformStats)
                .sort(([, a], [, b]) => b.impressions - a.impressions)
                .map(([platform, stats]) => {
                  const percentage = (stats.impressions / totalReach) * 100;
                  return (
                    <div key={platform}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                          {platform.toUpperCase()}
                        </div>
                        <div style={{ fontSize: "13px", color: "#9A9080" }}>
                          {(stats.impressions / 1000000).toFixed(1)}M impressions
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "#242424",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                        {percentage.toFixed(1)}% {t("ofTotalReach")}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Upcoming Campaigns */}
        <div>
          <SectionHeader title={t("upcomingCampaigns")} icon="Calendar" />
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {upcomingCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    padding: "16px",
                    background: "#242424",
                    borderRadius: "12px",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                      {campaign.name}
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        background: "#5B7C8C20",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#5B7C8C",
                        textTransform: "uppercase",
                      }}
                    >
                      PLANNED
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "12px",
                      color: "#9A9080",
                    }}
                  >
                    <span>{campaign.platform.toUpperCase()}</span>
                    <span>•</span>
                    <span>{campaign.region}</span>
                    <span>•</span>
                    <span style={{ color: "#C4A882", fontWeight: "600" }}>
                      {formatCrores(campaign.budget)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// ADMIN DASHBOARD
// ====================================================

const AdminDashboard = () => {
  const { t } = useTranslation(dashboardHomeTranslations);
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalScenes = scenes.length;
  const completedScenes = scenes.filter((s) => s.status === "completed").length;

  return (
    <div>
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <LucideIcon name="Settings" size={64} color="#C4A882" />
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#E8E0D4",
            margin: "24px 0 12px",
          }}
        >
          {t("adminDashboard")}
        </h2>
        <p style={{ fontSize: "16px", color: "#9A9080", marginBottom: "32px" }}>
          {t("systemOverview")}
        </p>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div style={{ padding: "24px", background: "#242424", borderRadius: "12px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#C4A882" }}>
              {formatCrores(totalBudget)}
            </div>
            <div style={{ fontSize: "14px", color: "#9A9080", marginTop: "8px" }}>
              {t("totalBudget")}
            </div>
          </div>
          <div style={{ padding: "24px", background: "#242424", borderRadius: "12px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#5B8C5A" }}>
              {completedScenes}/{totalScenes}
            </div>
            <div style={{ fontSize: "14px", color: "#9A9080", marginTop: "8px" }}>
              {t("scenesCompleted")}
            </div>
          </div>
          <div style={{ padding: "24px", background: "#242424", borderRadius: "12px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#5B7C8C" }}>
              {campaigns.length}
            </div>
            <div style={{ fontSize: "14px", color: "#9A9080", marginTop: "8px" }}>
              {t("campaigns")}
            </div>
          </div>
          <div style={{ padding: "24px", background: "#242424", borderRadius: "12px" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#C4A042" }}>78</div>
            <div style={{ fontSize: "14px", color: "#9A9080", marginTop: "8px" }}>
              {t("healthScore")}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {[
            { label: t("scriptIntelligence"), icon: "FileText", href: "/dashboard/script" },
            { label: t("budgetManagement"), icon: "IndianRupee", href: "/dashboard/budget" },
            { label: t("scheduleControl"), icon: "Calendar", href: "/dashboard/schedule" },
            { label: t("vfxPipeline"), icon: "Sparkles", href: "/dashboard/vfx" },
            { label: t("marketingHub"), icon: "Megaphone", href: "/dashboard/marketing" },
            { label: t("financialAnalytics"), icon: "TrendingUp", href: "/dashboard/finance" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "20px",
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "12px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C4A882";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2A2A2A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LucideIcon name={link.icon} size={24} color="#C4A882" />
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#E8E0D4" }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ====================================================
// MAIN DASHBOARD PAGE
// ====================================================

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation(dashboardHomeTranslations);

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "#9A9080",
        }}
      >
        {t("pleaseLogin")}
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "producer":
        return <ProducerDashboard />;
      case "director":
        return <DirectorDashboard />;
      case "production_head":
        return <ProductionHeadDashboard />;
      case "vfx_head":
        return <VfxHeadDashboard />;
      case "financier":
        return <FinancierDashboard />;
      case "marketing_head":
        return <MarketingHeadDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <ProducerDashboard />;
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: "32px",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#E8E0D4",
            marginBottom: "8px",
          }}
        >
          {t("welcomeBack")} {user.name}
        </h1>
        <p style={{ fontSize: "16px", color: "#9A9080" }}>
          {t("projectsToday")}
        </p>
      </div>

      {/* Role-specific Dashboard */}
      {renderDashboard()}
    </div>
  );
}
