"use client";

import { useState } from "react";
import { scenes } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { setsTranslations } from "@/lib/translations/sets";

export default function SetsPage() {
  const { t } = useTranslation(setsTranslations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSet, setNewSet] = useState({
    name: "",
    status: "planned",
    budget: "",
  });

  // Extract unique locations/sets from scenes
  const setData = Array.from(new Set(scenes.map((s) => s.location))).map((location) => {
    const scenesUsingSet = scenes.filter((s) => s.location === location);
    const totalCost = scenesUsingSet.reduce((sum, s) => sum + s.estimatedCost, 0);
    const completedScenes = scenesUsingSet.filter((s) => s.status === "completed").length;

    // Determine status based on scene progress
    let status: "built" | "in-progress" | "planned";
    if (completedScenes === scenesUsingSet.length) {
      status = "built";
    } else if (completedScenes > 0) {
      status = "in-progress";
    } else {
      status = "planned";
    }

    return {
      id: location.toLowerCase().replace(/\s+/g, "_"),
      name: location,
      scenesCount: scenesUsingSet.length,
      status,
      allocated: totalCost,
      spent: status === "built" ? totalCost : status === "in-progress" ? totalCost * 0.6 : 0,
    };
  });

  const stats = {
    totalSets: setData.length,
    built: setData.filter((s) => s.status === "built").length,
    inProgress: setData.filter((s) => s.status === "in-progress").length,
    planned: setData.filter((s) => s.status === "planned").length,
    totalBudget: setData.reduce((sum, s) => sum + s.allocated, 0),
    totalSpent: setData.reduce((sum, s) => sum + s.spent, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "built":
        return { bg: "rgba(91, 140, 90, 0.15)", text: "#5B8C5A" };
      case "in-progress":
        return { bg: "rgba(196, 160, 66, 0.15)", text: "#C4A042" };
      case "planned":
        return { bg: "rgba(91, 124, 140, 0.15)", text: "#5B7C8C" };
      default:
        return { bg: "rgba(154, 144, 128, 0.15)", text: "#9A9080" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LucideIcon name="Landmark" size={32} style={{ color: "#C4A882" }} />
            <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
              {t("pageTitle")}
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "#C4A882",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LucideIcon name="Building" size={18} />
            {t("addSet")}
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Warehouse" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalSets")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalSets}</div>
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
            <LucideIcon name="CheckCircle" size={20} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("built")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.built}</div>
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
            <LucideIcon name="HardHat" size={20} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("inProgress")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.inProgress}</div>
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
            <LucideIcon name="Clock" size={20} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("planned")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.planned}</div>
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
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("allocated")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalBudget)}
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
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("spent")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalSpent)}
          </div>
        </div>
      </div>

      {/* Set Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {setData.map((set) => {
          const statusStyle = getStatusColor(set.status);
          const budgetPercent = set.allocated > 0 ? (set.spent / set.allocated) * 100 : 0;

          return (
            <div
              key={set.id}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4A4A4A";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3A3A3A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 8px 0" }}>
                    {set.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LucideIcon name="Film" size={14} style={{ color: "#9A9080" }} />
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>
                      {set.scenesCount} {set.scenesCount !== 1 ? t("scenes") : t("scene")}
                    </span>
                  </div>
                </div>
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
                  {set.status === "in-progress" ? t("statusInProgress") : set.status === "built" ? t("statusBuilt") : t("statusPlanned")}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("budgetProgress")}</span>
                  <span style={{ fontSize: "13px", color: "#E8E0D4", fontWeight: "600" }}>
                    {budgetPercent.toFixed(0)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#333333",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(budgetPercent, 100)}%`,
                      height: "100%",
                      background: budgetPercent > 100 ? "#C45C5C" : budgetPercent > 80 ? "#C4A042" : "#5B8C5A",
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("allocated")}</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#C4A882" }}>
                    {formatCrores(set.allocated)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("spent")}</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                    {formatCrores(set.spent)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Construction Timeline & Budget Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Timeline */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
            {t("constructionTimeline")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {setData.slice(0, 5).map((set, idx) => (
              <div key={set.id}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#333333",
                      border: "2px solid #C4A882",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#C4A882",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{set.name}</div>
                    <div style={{ fontSize: "12px", color: "#9A9080", marginTop: "2px" }}>
                      {set.status === "built"
                        ? t("completed")
                        : set.status === "in-progress"
                        ? t("underConstruction")
                        : t("planningPhase")}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color:
                        set.status === "built" ? "#5B8C5A" : set.status === "in-progress" ? "#C4A042" : "#5B7C8C",
                    }}
                  >
                    {set.status === "built" ? "100%" : set.status === "in-progress" ? "60%" : "0%"}
                  </span>
                </div>
                {idx < 4 && (
                  <div
                    style={{
                      width: "2px",
                      height: "20px",
                      background: "#3A3A3A",
                      marginLeft: "15px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
            {t("budgetBySet")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {setData
              .sort((a, b) => b.allocated - a.allocated)
              .slice(0, 6)
              .map((set) => {
                const percentage = (set.allocated / stats.totalBudget) * 100;
                return (
                  <div key={set.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#E8E0D4" }}>
                        {set.name.length > 30 ? set.name.slice(0, 30) + "..." : set.name}
                      </span>
                      <span style={{ fontSize: "13px", color: "#C4A882", fontWeight: "600" }}>
                        {formatCrores(set.allocated)}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "#333333",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#C4A882",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Add Set Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "24px" }}>
              {t("addNewSet")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelSetName")}
                </label>
                <input
                  type="text"
                  value={newSet.name}
                  onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("placeholderSetName")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelStatus")}
                </label>
                <select
                  value={newSet.status}
                  onChange={(e) => setNewSet({ ...newSet, status: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                >
                  <option value="planned">{t("statusPlanned")}</option>
                  <option value="in-progress">{t("statusInProgress")}</option>
                  <option value="built">{t("statusBuilt")}</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelBudget")}
                </label>
                <input
                  type="number"
                  value={newSet.budget}
                  onChange={(e) => setNewSet({ ...newSet, budget: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="5.0"
                  step="0.1"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid #4A4A4A",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#9A9080",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                }}
                style={{
                  flex: 1,
                  background: "#C4A882",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#1A1A1A",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("addSet")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
