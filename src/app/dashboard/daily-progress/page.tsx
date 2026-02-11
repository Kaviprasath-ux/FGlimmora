"use client";

import { useState } from "react";
import { dailyProgress, scenes } from "@/data/mock-data";
import { formatCrores, formatDate, formatShortDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { DailyProgress } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { dailyProgressTranslations } from "@/lib/translations/daily-progress";

export default function DailyProgressPage() {
  const { t } = useTranslation(dailyProgressTranslations);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    scenesCompleted: "",
    budgetSpent: "",
    notes: "",
    issues: "",
  });

  // Sort by date (most recent first)
  const sortedProgress = [...dailyProgress].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Today's entry (most recent)
  const today = sortedProgress[0];

  // Calculate totals
  const totalScenes = dailyProgress.reduce((sum, p) => sum + p.scenesCompleted, 0);
  const totalBudget = dailyProgress.reduce((sum, p) => sum + p.budgetSpentToday, 0);
  const totalIssues = dailyProgress.reduce((sum, p) => sum + p.issues.length, 0);
  const avgDailySpend = totalBudget / dailyProgress.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding daily progress:", formData);
    // In real app, add to dailyProgress array
    setShowAddForm(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      scenesCompleted: "",
      budgetSpent: "",
      notes: "",
      issues: "",
    });
  };

  return (
    <div style={{ padding: "2rem", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <LucideIcon name="Calendar" size={32} color="#C4A882" />
            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>{t("pageTitle")}</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              background: "#C4A882",
              color: "#0F0F0F",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <LucideIcon name="PieChart" size={16} color="#0F0F0F" />
            {t("addEntry")}
          </button>
        </div>
        <p style={{ color: "#9A9080", margin: 0 }}>{t("pageSubtitle")}</p>
      </div>

      {/* Today's Summary Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #242424 100%)",
          border: "1px solid #C4A882",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              background: "#C4A88220",
              padding: "0.75rem",
              borderRadius: "0.75rem",
            }}
          >
            <LucideIcon name="Star" size={24} color="#C4A882" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>{t("todaysSummary")}</h2>
            <p style={{ color: "#9A9080", fontSize: "0.875rem", margin: 0 }}>{formatDate(today.date)}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <LucideIcon name="Camera" size={16} color="#5B8C5A" />
              <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{t("scenesCompleted")}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4" }}>{today.scenesCompleted}</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <LucideIcon name="IndianRupee" size={16} color="#C4A882" />
              <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{t("budgetSpent")}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#C4A882" }}>
              {formatCrores(today.budgetSpentToday)}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <LucideIcon name="AlertTriangle" size={16} color={today.issues.length > 0 ? "#C45C5C" : "#6B6560"} />
              <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{t("issues")}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: today.issues.length > 0 ? "#C45C5C" : "#5B8C5A" }}>
              {today.issues.length}
            </div>
          </div>
        </div>

        {today.notes && (
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("notes")}</div>
            <div style={{ color: "#E8E0D4", lineHeight: "1.6" }}>{today.notes}</div>
          </div>
        )}

        {today.issues.length > 0 && (
          <div>
            <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{t("issuesToday")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {today.issues.map((issue, i) => (
                <div
                  key={i}
                  style={{
                    background: "#C45C5C20",
                    border: "1px solid #C45C5C40",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <LucideIcon name="AlertTriangle" size={14} color="#C45C5C" />
                  {issue}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: t("totalDaysLogged"), value: dailyProgress.length, icon: "Calendar", color: "#C4A882" },
          { label: t("totalScenes"), value: totalScenes, icon: "Camera", color: "#5B8C5A" },
          { label: t("totalSpent"), value: formatCrores(totalBudget), icon: "IndianRupee", color: "#C4A882" },
          { label: t("avgDailySpend"), value: formatCrores(avgDailySpend), icon: "TrendingUp", color: "#5B7C8C" },
          { label: t("totalIssues"), value: totalIssues, icon: "AlertTriangle", color: "#C45C5C" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
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

      {/* Progress Timeline */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
          {t("recentProgress")}
        </h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {sortedProgress.slice(0, 5).map((progress, i) => (
            <div
              key={progress.id}
              style={{
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "0.25rem" }}>
                    {formatDate(progress.date)}
                  </div>
                  <div style={{ color: "#6B6560", fontSize: "0.875rem" }}>{t("day")} {dailyProgress.length - i}</div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#9A9080", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("scenesLabel")}</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#5B8C5A" }}>
                      {progress.scenesCompleted}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#9A9080", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("spentLabel")}</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#C4A882" }}>
                      {formatCrores(progress.budgetSpentToday)}
                    </div>
                  </div>
                </div>
              </div>

              {progress.notes && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ color: "#9A9080", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("notes")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "0.875rem", lineHeight: "1.5" }}>{progress.notes}</div>
                </div>
              )}

              {progress.issues.length > 0 && (
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    {t("issuesCount")} ({progress.issues.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {progress.issues.map((issue, j) => (
                      <div
                        key={j}
                        style={{
                          color: "#C45C5C",
                          fontSize: "0.875rem",
                          paddingLeft: "0.75rem",
                          borderLeft: "2px solid #C45C5C",
                        }}
                      >
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Burn Rate Visual */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
          {t("dailyBurnRate")}
        </h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {sortedProgress.slice(0, 7).reverse().map((progress, i) => {
            const maxSpend = Math.max(...dailyProgress.map((p) => p.budgetSpentToday));
            const percentage = (progress.budgetSpentToday / maxSpend) * 100;

            return (
              <div key={progress.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>
                    {formatShortDate(progress.date)}
                  </span>
                  <span style={{ color: "#C4A882", fontSize: "0.875rem", fontWeight: "600" }}>
                    {formatCrores(progress.budgetSpentToday)}
                  </span>
                </div>
                <div
                  style={{
                    height: "0.75rem",
                    background: "#242424",
                    borderRadius: "0.375rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, #C4A882 0%, ${progress.budgetSpentToday > avgDailySpend ? "#C45C5C" : "#5B8C5A"} 100%)`,
                      width: `${percentage}%`,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#242424",
            borderRadius: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("averageDailySpend")}</div>
            <div style={{ color: "#C4A882", fontSize: "1.5rem", fontWeight: "700" }}>
              {formatCrores(avgDailySpend)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("totalLoggedDays")}</div>
            <div style={{ color: "#E8E0D4", fontSize: "1.5rem", fontWeight: "700" }}>{dailyProgress.length}</div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div
          onClick={() => setShowAddForm(false)}
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
                {t("addDailyProgress")}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
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
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {t("labelDate")}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
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
                  {t("labelScenesCompleted")}
                </label>
                <input
                  type="number"
                  value={formData.scenesCompleted}
                  onChange={(e) => setFormData({ ...formData, scenesCompleted: e.target.value })}
                  required
                  min="0"
                  placeholder="0"
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
                  {t("labelBudgetSpent")}
                </label>
                <input
                  type="number"
                  value={formData.budgetSpent}
                  onChange={(e) => setFormData({ ...formData, budgetSpent: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="0.0"
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
                  {t("labelNotes")}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t("placeholderNotes")}
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
                <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {t("labelIssues")}
                </label>
                <textarea
                  value={formData.issues}
                  onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                  placeholder={t("placeholderIssues")}
                  rows={2}
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
              <button
                type="submit"
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
                {t("submitEntry")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
