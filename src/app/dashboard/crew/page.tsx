"use client";

import { useState } from "react";
import { crewMembers } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { crewTranslations } from "@/lib/translations/crew";

export default function CrewPage() {
  const { t } = useTranslation(crewTranslations);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCrew, setNewCrew] = useState({
    name: "",
    department: "",
    role: "",
    dailyRate: "",
  });

  // Calculate stats
  const totalCrew = crewMembers.length;
  const assigned = crewMembers.filter((c) => c.availability === "assigned").length;
  const available = crewMembers.filter((c) => c.availability === "available").length;
  const departments = [...new Set(crewMembers.map((c) => c.department))];
  const dailyCost = crewMembers
    .filter((c) => c.availability === "assigned")
    .reduce((sum, c) => sum + c.dailyRate, 0);

  // Filter crew
  const filteredCrew = crewMembers.filter((crew) => {
    if (filterDepartment !== "all" && crew.department !== filterDepartment) return false;
    if (filterAvailability !== "all" && crew.availability !== filterAvailability) return false;
    return true;
  });

  // Department breakdown
  const departmentStats = departments.map((dept) => {
    const deptCrew = crewMembers.filter((c) => c.department === dept);
    const count = deptCrew.length;
    const percentage = (count / totalCrew) * 100;
    return { dept, count, percentage };
  });

  const stats = [
    { label: t("totalCrew"), value: totalCrew.toString(), icon: "Users", color: "#C4A882" },
    { label: t("assigned"), value: assigned.toString(), icon: "CheckCircle", color: "#5B8C5A" },
    { label: t("available"), value: available.toString(), icon: "Clock", color: "#5B7C8C" },
    { label: t("departments"), value: departments.length.toString(), icon: "Building", color: "#C4A882" },
    { label: t("dailyCost"), value: formatCrores(dailyCost), icon: "IndianRupee", color: "#C4A042" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LucideIcon name="Users" size={32} style={{ color: "#C4A882" }} />
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
            {t("addCrewMember")}
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <LucideIcon name={stat.icon} size={20} style={{ color: stat.color }} />
              <span style={{ fontSize: "13px", color: "#9A9080" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Crew Table */}
        <div>
          {/* Filters */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", color: "#9A9080", fontWeight: "500" }}>{t("filters")}</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{
                background: "#333333",
                border: "1px solid #4A4A4A",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#E8E0D4",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <option value="all">{t("allDepartments")}</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              style={{
                background: "#333333",
                border: "1px solid #4A4A4A",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#E8E0D4",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <option value="all">{t("allStatus")}</option>
              <option value="assigned">{t("statusAssigned")}</option>
              <option value="available">{t("statusAvailable")}</option>
            </select>
            {(filterDepartment !== "all" || filterAvailability !== "all") && (
              <button
                onClick={() => {
                  setFilterDepartment("all");
                  setFilterAvailability("all");
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #4A4A4A",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#9A9080",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {t("clearFilters")}
              </button>
            )}
          </div>

          {/* Table */}
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#333333", borderBottom: "1px solid #3A3A3A" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thName")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thDepartment")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thRole")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thDailyRate")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thAvailability")}
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: "#9A9080", fontWeight: "600" }}>
                    {t("thActions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCrew.map((crew, idx) => (
                  <tr
                    key={crew.id}
                    style={{
                      borderBottom: idx < filteredCrew.length - 1 ? "1px solid #3A3A3A" : "none",
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{crew.name}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "13px", color: "#9A9080" }}>{crew.department}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "13px", color: "#9A9080" }}>{crew.role}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "14px", color: "#C4A882", fontWeight: "600" }}>
                        {formatCrores(crew.dailyRate)}
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
                          background: crew.availability === "assigned" ? "rgba(91, 140, 90, 0.15)" : "rgba(91, 124, 140, 0.15)",
                          color: crew.availability === "assigned" ? "#5B8C5A" : "#5B7C8C",
                        }}
                      >
                        {crew.availability === "assigned" ? t("statusAssigned") : t("statusAvailable")}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <button
                        style={{
                          background: "transparent",
                          border: "1px solid #4A4A4A",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          color: "#9A9080",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        {t("edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Breakdown */}
        <div>
          <div
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("departmentBreakdown")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {departmentStats.map((stat) => (
                <div key={stat.dept}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#E8E0D4" }}>{stat.dept}</span>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{stat.count} {t("crewCount")}</span>
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
                        width: `${stat.percentage}%`,
                        height: "100%",
                        background: "#C4A882",
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

      {/* Add Crew Modal */}
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
              {t("addCrewTitle")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelName")}
                </label>
                <input
                  type="text"
                  value={newCrew.name}
                  onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("placeholderName")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelDepartment")}
                </label>
                <select
                  value={newCrew.department}
                  onChange={(e) => setNewCrew({ ...newCrew, department: e.target.value })}
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
                  <option value="">{t("selectDepartment")}</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelRole")}
                </label>
                <input
                  type="text"
                  value={newCrew.role}
                  onChange={(e) => setNewCrew({ ...newCrew, role: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("placeholderRole")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#9A9080", marginBottom: "8px" }}>
                  {t("labelDailyRate")}
                </label>
                <input
                  type="number"
                  value={newCrew.dailyRate}
                  onChange={(e) => setNewCrew({ ...newCrew, dailyRate: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="0.5"
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
                  // Add crew logic here
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
                {t("addCrew")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
