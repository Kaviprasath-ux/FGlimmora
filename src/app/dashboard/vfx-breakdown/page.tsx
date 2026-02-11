"use client";

import { useState } from "react";
import { vfxShots, scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { VfxShot } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { vfxBreakdownTranslations } from "@/lib/translations/vfx-breakdown";

export default function VfxBreakdownPage() {
  const { t } = useTranslation(vfxBreakdownTranslations);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [selectedShot, setSelectedShot] = useState<VfxShot | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate stats
  const totalShots = vfxShots.length;
  const completed = vfxShots.filter((s) => s.status === "approved").length;
  const inProgress = vfxShots.filter((s) => s.status === "in_progress").length;
  const pending = vfxShots.filter((s) => s.status === "pending").length;
  const rework = vfxShots.filter((s) => s.status === "rework").length;
  const totalBudget = vfxShots.reduce((sum, s) => sum + s.estimatedCost, 0);
  const totalActual = vfxShots.reduce((sum, s) => sum + s.actualCost, 0);

  // Get unique values for filters
  const vendors = [...new Set(vfxShots.map((s) => s.vendor))];
  const types = [...new Set(vfxShots.map((s) => s.type))];
  const complexities = ["low", "medium", "high", "extreme"];

  // Apply filters
  const filteredShots = vfxShots.filter((shot) => {
    if (statusFilter !== "all" && shot.status !== statusFilter) return false;
    if (typeFilter !== "all" && shot.type !== typeFilter) return false;
    if (complexityFilter !== "all" && shot.complexity !== complexityFilter) return false;
    if (vendorFilter !== "all" && shot.vendor !== vendorFilter) return false;
    return true;
  });

  // Vendor summary
  const vendorSummary = vendors.map((vendor) => {
    const vendorShots = vfxShots.filter((s) => s.vendor === vendor);
    return {
      vendor,
      shots: vendorShots.length,
      estimated: vendorShots.reduce((sum, s) => sum + s.estimatedCost, 0),
      actual: vendorShots.reduce((sum, s) => sum + s.actualCost, 0),
    };
  });

  // Complexity distribution
  const complexityDist = complexities.map((c) => ({
    complexity: c,
    count: vfxShots.filter((s) => s.complexity === c).length,
  }));

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "#6B6560",
      in_progress: "#5B7C8C",
      review: "#C4A042",
      approved: "#5B8C5A",
      rework: "#C45C5C",
    };
    return colors[status as keyof typeof colors] || "#6B6560";
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      low: "#5B8C5A",
      medium: "#C4A042",
      high: "#C45C5C",
      extreme: "#8B1E3F",
    };
    return colors[complexity as keyof typeof colors] || "#6B6560";
  };

  return (
    <div style={{ padding: "2rem", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <LucideIcon name="Sparkles" size={32} color="#C4A882" />
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
          <span
            style={{
              background: "#242424",
              color: "#C4A882",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            {totalShots} {t("shotsLabel")}
          </span>
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
          { label: t("totalShots"), value: totalShots, icon: "Layers", color: "#C4A882" },
          { label: t("completed"), value: completed, icon: "CheckCircle", color: "#5B8C5A" },
          { label: t("inProgress"), value: inProgress, icon: "GitBranch", color: "#5B7C8C" },
          { label: t("pending"), value: pending, icon: "Clock", color: "#9A9080" },
          { label: t("rework"), value: rework, icon: "RotateCcw", color: "#C45C5C" },
          { label: t("totalBudget"), value: formatCrores(totalBudget), icon: "IndianRupee", color: "#C4A882" },
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
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("filterStatus")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allStatus")}</option>
              <option value="pending">{t("statusPending")}</option>
              <option value="in_progress">{t("statusInProgress")}</option>
              <option value="review">{t("statusReview")}</option>
              <option value="approved">{t("statusApproved")}</option>
              <option value="rework">{t("statusRework")}</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("filterType")}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allTypes")}</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("filterComplexity")}
            </label>
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allComplexity")}</option>
              {complexities.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {t("filterVendor")}
            </label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#242424",
                border: "1px solid #2A2A2A",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                color: "#E8E0D4",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allVendors")}</option>
              {vendors.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shot Table */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #2A2A2A",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>{t("vfxShots")}</h2>
          <button
            onClick={() => setShowAddModal(true)}
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
            {t("addShot")}
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#242424", borderBottom: "1px solid #2A2A2A" }}>
                {[t("thScene"), t("thShot"), t("thType"), t("thComplexity"), t("thEstCost"), t("thActualCost"), t("thVendor"), t("thStatus"), t("thRework")].map(
                  (header) => (
                    <th
                      key={header}
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        color: "#9A9080",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredShots.map((shot) => (
                <tr
                  key={shot.id}
                  onClick={() => setSelectedShot(shot)}
                  style={{
                    borderBottom: "1px solid #2A2A2A",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#242424")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "1rem 1.5rem", color: "#E8E0D4", fontWeight: "600" }}>
                    {shot.sceneNumber}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#E8E0D4" }}>{shot.shotNumber}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        background: "#242424",
                        color: "#C4A882",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {shot.type}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        background: getComplexityColor(shot.complexity) + "20",
                        color: getComplexityColor(shot.complexity),
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {shot.complexity}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#E8E0D4" }}>
                    {formatCrores(shot.estimatedCost)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#E8E0D4" }}>
                    {shot.actualCost > 0 ? formatCrores(shot.actualCost) : "-"}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#9A9080", fontSize: "0.875rem" }}>
                    {shot.vendor}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        background: getStatusColor(shot.status) + "20",
                        color: getStatusColor(shot.status),
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {shot.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: shot.reworkCount > 0 ? "#C45C5C" : "#6B6560" }}>
                    {shot.reworkCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Summary & Complexity Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {/* Vendor Summary */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
            {t("vendorSummary")}
          </h3>
          {vendorSummary.map((vendor, i) => (
            <div key={i} style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#E8E0D4", fontSize: "0.875rem", fontWeight: "600" }}>{vendor.vendor}</span>
                <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{vendor.shots} {t("shotsLabel")}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: "0.5rem",
                      background: "#242424",
                      borderRadius: "0.25rem",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "#C4A882",
                        width: `${(vendor.actual / vendor.estimated) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9A9080", fontSize: "0.75rem" }}>
                  {t("est")}: {formatCrores(vendor.estimated)}
                </span>
                <span style={{ color: "#C4A882", fontSize: "0.75rem" }}>
                  {t("act")}: {formatCrores(vendor.actual)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Complexity Distribution */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
            {t("complexityDistribution")}
          </h3>
          {complexityDist.map((item, i) => (
            <div key={i} style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    color: getComplexityColor(item.complexity),
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {item.complexity}
                </span>
                <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>
                  {item.count} {t("shotsLabel")} ({Math.round((item.count / totalShots) * 100)}%)
                </span>
              </div>
              <div
                style={{
                  height: "0.5rem",
                  background: "#242424",
                  borderRadius: "0.25rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: getComplexityColor(item.complexity),
                    width: `${(item.count / totalShots) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shot Detail Modal */}
      {selectedShot && (
        <div
          onClick={() => setSelectedShot(null)}
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
                {t("shotDetails")}
              </h2>
              <button
                onClick={() => setSelectedShot(null)}
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
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("sceneLabel")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "1.25rem", fontWeight: "600" }}>
                    {selectedShot.sceneNumber}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("shotLabel")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "1.25rem", fontWeight: "600" }}>
                    {selectedShot.shotNumber}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("typeLabel")}</div>
                <div style={{ color: "#E8E0D4" }}>{selectedShot.type.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("complexityLabel")}</div>
                <div style={{ color: getComplexityColor(selectedShot.complexity), textTransform: "capitalize" }}>
                  {selectedShot.complexity}
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("vendorLabel")}</div>
                <div style={{ color: "#E8E0D4" }}>{selectedShot.vendor}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                    {t("estimatedCost")}
                  </div>
                  <div style={{ color: "#E8E0D4", fontWeight: "600" }}>
                    {formatCrores(selectedShot.estimatedCost)}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("actualCost")}</div>
                  <div style={{ color: "#C4A882", fontWeight: "600" }}>
                    {selectedShot.actualCost > 0 ? formatCrores(selectedShot.actualCost) : t("notStarted")}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("statusLabel")}</div>
                <div
                  style={{
                    color: getStatusColor(selectedShot.status),
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  {selectedShot.status.replace("_", " ")}
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{t("reworkCount")}</div>
                <div style={{ color: selectedShot.reworkCount > 0 ? "#C45C5C" : "#5B8C5A", fontWeight: "600" }}>
                  {selectedShot.reworkCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Shot Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
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
                {t("addNewVfxShot")}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
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
            <div style={{ color: "#9A9080", textAlign: "center", padding: "2rem" }}>
              {t("addShotFormPlaceholder")}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
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
              {t("createShot")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
