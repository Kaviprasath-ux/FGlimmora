"use client";

import { useState } from "react";
import { vfxShots } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { vendorsTranslations } from "@/lib/translations/vendors";

export default function VendorsPage() {
  const { t } = useTranslation(vendorsTranslations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    speciality: "",
    contactPerson: "",
    email: "",
  });

  // Extract vendor data from VFX shots
  const vendorNames = Array.from(new Set(vfxShots.map((s) => s.vendor)));

  const vendorData = vendorNames.map((vendor) => {
    const vendorShots = vfxShots.filter((s) => s.vendor === vendor);
    const totalCost = vendorShots.reduce((sum, s) => sum + s.estimatedCost, 0);
    const completed = vendorShots.filter((s) => s.status === "approved").length;
    const totalReworks = vendorShots.reduce((sum, s) => sum + s.reworkCount, 0);
    const avgTurnaround = vendor === "DNEG" ? 12 : vendor === "Framestore" ? 14 : 10; // Mock data

    // Quality rating based on rework count
    const qualityRating = totalReworks === 0 ? 5 : totalReworks === 1 ? 4.5 : totalReworks <= 3 ? 4 : 3.5;

    // Speciality based on shot types
    const shotTypes = vendorShots.map((s) => s.type);
    let speciality = "";
    if (shotTypes.includes("full_cg")) speciality = t("fullCgAction");
    else if (shotTypes.includes("crowd")) speciality = t("crowdSimulation");
    else if (shotTypes.includes("CGI")) speciality = t("cgiCompositing");
    else speciality = t("compositing");

    return {
      id: vendor.toLowerCase().replace(/\s+/g, "_"),
      name: vendor,
      shotsAssigned: vendorShots.length,
      totalCost,
      completed,
      qualityRating,
      avgTurnaround,
      speciality,
      contact: vendor === "DNEG" ? "John Smith" : vendor === "Framestore" ? "Sarah Johnson" : "Ravi Kumar",
    };
  });

  const stats = {
    totalVendors: vendorData.length,
    totalShots: vfxShots.length,
    totalCost: vendorData.reduce((sum, v) => sum + v.totalCost, 0),
    avgQuality: vendorData.reduce((sum, v) => sum + v.qualityRating, 0) / vendorData.length,
    avgTurnaround: vendorData.reduce((sum, v) => sum + v.avgTurnaround, 0) / vendorData.length,
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <LucideIcon key={i} name="Star" size={14} style={{ color: "#C4A882", fill: "#C4A882" }} />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <LucideIcon key={i} name="Star" size={14} style={{ color: "#C4A882", fill: "rgba(196, 168, 130, 0.5)" }} />
        );
      } else {
        stars.push(
          <LucideIcon key={i} name="Star" size={14} style={{ color: "#4A4A4A" }} />
        );
      }
    }
    return stars;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LucideIcon name="Building" size={32} style={{ color: "#C4A882" }} />
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
            <LucideIcon name="UserCog" size={18} />
            {t("addVendor")}
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageDescription")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Building" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalVendors")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalVendors}</div>
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
            <LucideIcon name="Layers" size={20} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalShots")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalShots}</div>
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
            <LucideIcon name="IndianRupee" size={20} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalValue")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalCost)}
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
            <LucideIcon name="Star" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("avgQuality")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>
            {stats.avgQuality.toFixed(1)}
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
            <LucideIcon name="Clock" size={20} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("avgTurnaround")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            {stats.avgTurnaround.toFixed(0)} {t("days")}
          </div>
        </div>
      </div>

      {/* Vendor Cards */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "16px" }}>
          {t("activeVendors")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {vendorData.map((vendor) => (
            <div
              key={vendor.id}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C4A882";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3A3A3A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 4px 0" }}>
                    {vendor.name}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#9A9080" }}>{vendor.speciality}</div>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {renderStars(vendor.qualityRating)}
                </div>
              </div>

              <div
                style={{
                  background: "#333333",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("shotsAssigned")}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#E8E0D4" }}>
                      {vendor.shotsAssigned}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("completed")}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#5B8C5A" }}>
                      {vendor.completed}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("totalValueLabel")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#C4A882" }}>
                      {formatCrores(vendor.totalCost)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("turnaround")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#5B7C8C" }}>
                      {vendor.avgTurnaround} {t("days")}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid #3A3A3A",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <LucideIcon name="Users" size={14} style={{ color: "#9A9080" }} />
                  <span style={{ fontSize: "13px", color: "#9A9080" }}>{vendor.contact}</span>
                </div>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: "#9A9080",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Comparison & Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Comparison Table */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
            {t("vendorComparison")}
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #3A3A3A" }}>
                <th style={{ padding: "12px 0", textAlign: "left", fontSize: "12px", color: "#9A9080" }}>{t("vendor")}</th>
                <th style={{ padding: "12px 0", textAlign: "center", fontSize: "12px", color: "#9A9080" }}>{t("shots")}</th>
                <th style={{ padding: "12px 0", textAlign: "center", fontSize: "12px", color: "#9A9080" }}>{t("quality")}</th>
                <th style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", color: "#9A9080" }}>{t("cost")}</th>
              </tr>
            </thead>
            <tbody>
              {vendorData.map((vendor, idx) => (
                <tr key={vendor.id} style={{ borderBottom: idx < vendorData.length - 1 ? "1px solid #3A3A3A" : "none" }}>
                  <td style={{ padding: "16px 0" }}>
                    <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{vendor.name}</span>
                  </td>
                  <td style={{ padding: "16px 0", textAlign: "center" }}>
                    <span style={{ fontSize: "14px", color: "#E8E0D4" }}>{vendor.shotsAssigned}</span>
                  </td>
                  <td style={{ padding: "16px 0", textAlign: "center" }}>
                    <span style={{ fontSize: "14px", color: "#C4A882", fontWeight: "600" }}>
                      {vendor.qualityRating.toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding: "16px 0", textAlign: "right" }}>
                    <span style={{ fontSize: "14px", color: "#E8E0D4" }}>{formatCrores(vendor.totalCost)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Metrics */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
            {t("performanceMetrics")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {vendorData.map((vendor) => {
              const completionRate = (vendor.completed / vendor.shotsAssigned) * 100;
              return (
                <div key={vendor.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{vendor.name}</div>
                      <div style={{ fontSize: "12px", color: "#9A9080", marginTop: "2px" }}>
                        {vendor.completed} {t("ofShotsCompleted")} {vendor.shotsAssigned} {t("shotsCompleted")}
                      </div>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#C4A882" }}>
                      {completionRate.toFixed(0)}%
                    </div>
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
                        width: `${completionRate}%`,
                        height: "100%",
                        background: completionRate > 70 ? "#5B8C5A" : completionRate > 40 ? "#C4A042" : "#C45C5C",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Vendor Modal */}
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
              {t("addVfxVendor")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("vendorName")}
                </label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("vendorNamePlaceholder")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("speciality")}
                </label>
                <input
                  type="text"
                  value={newVendor.speciality}
                  onChange={(e) => setNewVendor({ ...newVendor, speciality: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("specialityPlaceholder")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("contactPerson")}
                </label>
                <input
                  type="text"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("fullNamePlaceholder")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("emailPlaceholder")}
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
                {t("addVendor")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
