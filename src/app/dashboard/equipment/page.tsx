"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { equipmentTranslations } from "@/lib/translations/equipment";

// Mock equipment data
const equipmentData = [
  // Cameras
  { id: "eq_001", name: "ARRI Alexa LF", category: "Cameras", status: "in-use", dailyRate: 0.8, location: "Vizag Port Area" },
  { id: "eq_002", name: "RED V-Raptor 8K", category: "Cameras", status: "available", dailyRate: 0.7, location: "Equipment Yard" },
  { id: "eq_003", name: "Sony Venice 2", category: "Cameras", status: "in-use", dailyRate: 0.75, location: "Ramoji Film City" },
  { id: "eq_004", name: "Canon C500 Mark II", category: "Cameras", status: "maintenance", dailyRate: 0.5, location: "Maintenance Bay" },
  // Lighting
  { id: "eq_005", name: "ARRI SkyPanel S360", category: "Lighting", status: "in-use", dailyRate: 0.15, location: "Indoor Studio" },
  { id: "eq_006", name: "HMI 18K", category: "Lighting", status: "available", dailyRate: 0.12, location: "Equipment Yard" },
  { id: "eq_007", name: "LED Panel Kit (10x)", category: "Lighting", status: "in-use", dailyRate: 0.08, location: "Ramoji Film City" },
  { id: "eq_008", name: "Tungsten 5K Kit", category: "Lighting", status: "available", dailyRate: 0.06, location: "Equipment Yard" },
  // Sound
  { id: "eq_009", name: "Sound Devices 888", category: "Sound", status: "in-use", dailyRate: 0.25, location: "Vizag Port Area" },
  { id: "eq_010", name: "Sennheiser MKH416", category: "Sound", status: "available", dailyRate: 0.05, location: "Equipment Yard" },
  { id: "eq_011", name: "Wireless Lav Kit", category: "Sound", status: "in-use", dailyRate: 0.08, location: "Indoor Studio" },
  { id: "eq_012", name: "Boom Pole Kit", category: "Sound", status: "available", dailyRate: 0.03, location: "Equipment Yard" },
  // Grip
  { id: "eq_013", name: "Dolly Track System", category: "Grip", status: "in-use", dailyRate: 0.2, location: "Ramoji Film City" },
  { id: "eq_014", name: "Crane (100ft)", category: "Grip", status: "available", dailyRate: 0.35, location: "Equipment Yard" },
  { id: "eq_015", name: "Steadicam Rig", category: "Grip", status: "in-use", dailyRate: 0.18, location: "Vizag Port Area" },
  { id: "eq_016", name: "Jib Arm (30ft)", category: "Grip", status: "available", dailyRate: 0.12, location: "Equipment Yard" },
  // Special
  { id: "eq_017", name: "Drone - DJI Inspire 3", category: "Special", status: "available", dailyRate: 0.4, location: "Equipment Yard" },
  { id: "eq_018", name: "Underwater Housing", category: "Special", status: "maintenance", dailyRate: 0.3, location: "Maintenance Bay" },
  { id: "eq_019", name: "Rain Machine System", category: "Special", status: "available", dailyRate: 0.25, location: "Equipment Yard" },
  { id: "eq_020", name: "Wind Machines (4x)", category: "Special", status: "in-use", dailyRate: 0.15, location: "Outer Ring Road" },
];

export default function EquipmentPage() {
  const { t } = useTranslation(equipmentTranslations);
  const [selectedCategory, setSelectedCategory] = useState<string>("Cameras");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    equipment: "",
    shootDate: "",
    duration: "",
    purpose: "",
  });

  const categories = ["Cameras", "Lighting", "Sound", "Grip", "Special"];

  // Calculate stats
  const totalEquipment = equipmentData.length;
  const inUse = equipmentData.filter((e) => e.status === "in-use").length;
  const available = equipmentData.filter((e) => e.status === "available").length;
  const maintenance = equipmentData.filter((e) => e.status === "maintenance").length;
  const utilizationPercent = (inUse / totalEquipment) * 100;
  const dailyRentalCost = equipmentData
    .filter((e) => e.status === "in-use")
    .reduce((sum, e) => sum + e.dailyRate, 0);

  const categoryEquipment = equipmentData.filter((e) => e.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-use":
        return { bg: "rgba(196, 160, 66, 0.15)", text: "#C4A042" };
      case "available":
        return { bg: "rgba(91, 140, 90, 0.15)", text: "#5B8C5A" };
      case "maintenance":
        return { bg: "rgba(196, 92, 92, 0.15)", text: "#C45C5C" };
      default:
        return { bg: "rgba(154, 144, 128, 0.15)", text: "#9A9080" };
    }
  };

  // Category utilization
  const categoryStats = categories.map((cat) => {
    const items = equipmentData.filter((e) => e.category === cat);
    const inUse = items.filter((e) => e.status === "in-use").length;
    const utilization = items.length > 0 ? (inUse / items.length) * 100 : 0;
    return { category: cat, total: items.length, inUse, utilization };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LucideIcon name="Wrench" size={32} style={{ color: "#C4A882" }} />
            <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
              {t("pageTitle")}
            </h1>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
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
            <LucideIcon name="ClipboardList" size={18} />
            {t("requestEquipment")}
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageSubtitle")}
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
            <LucideIcon name="Box" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalEquipment")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{totalEquipment}</div>
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
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("inUse")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{inUse}</div>
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
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("available")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{available}</div>
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
            <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C45C5C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("maintenance")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{maintenance}</div>
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
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("dailyCost")}</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
            ₹{dailyRentalCost.toFixed(1)} Cr
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Equipment List with Tabs */}
        <div>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  flex: 1,
                  background: selectedCategory === category ? "#C4A882" : "#262626",
                  border: `1px solid ${selectedCategory === category ? "#C4A882" : "#3A3A3A"}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: selectedCategory === category ? "#1A1A1A" : "#9A9080",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Equipment Cards */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categoryEquipment.map((equipment) => {
                const statusStyle = getStatusColor(equipment.status);
                return (
                  <div
                    key={equipment.id}
                    style={{
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#4A4A4A";
                      e.currentTarget.style.background = "#3A3A3A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#3A3A3A";
                      e.currentTarget.style.background = "#333333";
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                        {equipment.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LucideIcon name="MapPin" size={12} style={{ color: "#6B6560" }} />
                        <span style={{ fontSize: "12px", color: "#6B6560" }}>{equipment.location}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "2px" }}>{t("dailyRate")}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#C4A882" }}>
                          ₹{equipment.dailyRate} Cr
                        </div>
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          textTransform: "capitalize",
                          minWidth: "100px",
                          textAlign: "center",
                        }}
                      >
                        {equipment.status === "in-use" ? t("statusInUse") : equipment.status === "available" ? t("statusAvailable") : t("statusMaintenance")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Utilization Chart */}
        <div>
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "8px" }}>
              {t("overallUtilization")}
            </h3>
            <div
              style={{
                position: "relative",
                width: "180px",
                height: "180px",
                margin: "20px auto",
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#333333"
                  strokeWidth="20"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#C4A882"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 70 * (utilizationPercent / 100)} ${2 * Math.PI * 70}`}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "36px", fontWeight: "700", color: "#C4A882" }}>
                  {utilizationPercent.toFixed(0)}%
                </div>
                <div style={{ fontSize: "12px", color: "#9A9080", marginTop: "4px" }}>{t("utilization")}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#C4A042" }}>{inUse}</div>
                <div style={{ fontSize: "11px", color: "#9A9080", marginTop: "4px" }}>{t("inUse")}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#5B8C5A" }}>{available}</div>
                <div style={{ fontSize: "11px", color: "#9A9080", marginTop: "4px" }}>{t("available")}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#C45C5C" }}>{maintenance}</div>
                <div style={{ fontSize: "11px", color: "#9A9080", marginTop: "4px" }}>{t("maintenance")}</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("categoryUtilization")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {categoryStats.map((stat) => (
                <div key={stat.category}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#E8E0D4" }}>{stat.category}</span>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>
                      {stat.inUse}/{stat.total}
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
                        width: `${stat.utilization}%`,
                        height: "100%",
                        background:
                          stat.utilization > 80 ? "#C45C5C" : stat.utilization > 50 ? "#C4A042" : "#5B8C5A",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
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
          onClick={() => setShowRequestModal(false)}
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
              {t("requestEquipmentTitle")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelEquipment")}
                </label>
                <select
                  value={requestForm.equipment}
                  onChange={(e) => setRequestForm({ ...requestForm, equipment: e.target.value })}
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
                  <option value="">{t("selectEquipment")}</option>
                  {equipmentData
                    .filter((e) => e.status === "available")
                    .map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} - {eq.category}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelShootDate")}
                </label>
                <input
                  type="date"
                  value={requestForm.shootDate}
                  onChange={(e) => setRequestForm({ ...requestForm, shootDate: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelDuration")}
                </label>
                <input
                  type="number"
                  value={requestForm.duration}
                  onChange={(e) => setRequestForm({ ...requestForm, duration: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="3"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelPurpose")}
                </label>
                <textarea
                  value={requestForm.purpose}
                  onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    resize: "vertical",
                    minHeight: "80px",
                  }}
                  placeholder={t("placeholderPurpose")}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setShowRequestModal(false)}
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
                  setShowRequestModal(false);
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
                {t("submitRequest")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
