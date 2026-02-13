"use client";

import { useState, useMemo } from "react";
import { purchaseOrders, auditEntries, budgetCategories } from "@/data/mock-data";
import { formatCrores, formatDate, generateId } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { PurchaseOrder, AuditEntry } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { financeTranslations } from "@/lib/translations/finance";

export default function FinancePage() {
  const { t } = useTranslation(financeTranslations);

  const [activeTab, setActiveTab] = useState<"po" | "costs" | "audit">("po");
  const [poList, setPOList] = useState<PurchaseOrder[]>(purchaseOrders);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showNewPO, setShowNewPO] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [rejectionNotes, setRejectionNotes] = useState("");

  // New PO form state
  const [newPOForm, setNewPOForm] = useState({
    vendor: "",
    amount: "",
    description: "",
    category: "",
  });

  // ---------- Derived data ----------

  const pendingCount = useMemo(
    () => poList.filter((po) => po.status === "pending").length,
    [poList]
  );

  const totalPOValue = useMemo(
    () => poList.reduce((sum, po) => sum + po.amount, 0),
    [poList]
  );

  const approvedCount = useMemo(
    () => poList.filter((po) => po.status === "approved").length,
    [poList]
  );

  const filteredPOs = useMemo(() => {
    if (filterStatus === "all") return poList;
    return poList.filter((po) => po.status === filterStatus);
  }, [poList, filterStatus]);

  // Cost report data derived from budgetCategories
  const costReportRows = useMemo(() => {
    return budgetCategories.map((cat) => {
      const committed = parseFloat((cat.actual * 1.1).toFixed(1));
      const variance = parseFloat((cat.actual - cat.planned).toFixed(1));
      const variancePct = cat.planned > 0 ? ((cat.actual - cat.planned) / cat.planned) * 100 : 0;
      return {
        id: cat.id,
        name: cat.name,
        planned: cat.planned,
        actual: cat.actual,
        committed,
        variance,
        variancePct,
      };
    });
  }, []);

  const costTotals = useMemo(() => {
    const totals = costReportRows.reduce(
      (acc, row) => ({
        planned: acc.planned + row.planned,
        actual: acc.actual + row.actual,
        committed: acc.committed + row.committed,
        variance: acc.variance + row.variance,
      }),
      { planned: 0, actual: 0, committed: 0, variance: 0 }
    );
    const variancePct =
      totals.planned > 0 ? ((totals.actual - totals.planned) / totals.planned) * 100 : 0;
    return { ...totals, variancePct };
  }, [costReportRows]);

  // Audit entries grouped by date
  const groupedAudit = useMemo(() => {
    const groups: Record<string, AuditEntry[]> = {};
    const sorted = [...auditEntries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    sorted.forEach((entry) => {
      const dateKey = new Date(entry.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(entry);
    });
    return groups;
  }, []);

  // ---------- Handlers ----------

  const openConfirmModal = (po: PurchaseOrder, action: "approve" | "reject") => {
    setSelectedPO(po);
    setModalAction(action);
    setRejectionNotes("");
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!selectedPO || !modalAction) return;
    setPOList((prev) =>
      prev.map((po) => {
        if (po.id === selectedPO.id) {
          if (modalAction === "approve") {
            return {
              ...po,
              status: "approved" as const,
              approvedBy: "Dil Raju",
              approvedDate: new Date().toISOString().split("T")[0],
            };
          } else {
            return {
              ...po,
              status: "rejected" as const,
              notes: rejectionNotes || "Rejected by producer",
            };
          }
        }
        return po;
      })
    );
    setShowModal(false);
    setSelectedPO(null);
    setModalAction(null);
    setRejectionNotes("");
  };

  const handleSubmitNewPO = () => {
    if (!newPOForm.vendor || !newPOForm.amount || !newPOForm.description || !newPOForm.category)
      return;
    const newPO: PurchaseOrder = {
      id: generateId(),
      poNumber: `PO-2026-${String(poList.length + 1).padStart(3, "0")}`,
      vendor: newPOForm.vendor,
      description: newPOForm.description,
      category: newPOForm.category,
      amount: parseFloat(newPOForm.amount),
      requestedBy: "Current User",
      requestedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setPOList((prev) => [newPO, ...prev]);
    setNewPOForm({ vendor: "", amount: "", description: "", category: "" });
    setShowNewPO(false);
  };

  const formatTime = (timestamp: string) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // ---------- Status helpers ----------

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#C4A882";
      case "approved":
      case "success":
        return "#5B8C5A";
      case "rejected":
        return "#C45C5C";
      case "warning":
        return "#C4A042";
      case "info":
        return "#5B7C8C";
      default:
        return "#9A9080";
    }
  };

  const getProgressColor = (ratio: number) => {
    if (ratio > 1) return "#C45C5C";
    if (ratio >= 0.9) return "#C4A042";
    return "#5B8C5A";
  };

  // ---------- Stats cards ----------

  const stats = [
    {
      label: t("pendingPOs"),
      value: String(pendingCount),
      icon: "Receipt",
      color: "#C4A882",
    },
    {
      label: t("totalPOValue"),
      value: formatCrores(totalPOValue),
      icon: "Banknote",
      color: "#5B8C5A",
    },
    {
      label: t("approvedThisMonth"),
      value: String(approvedCount),
      icon: "CheckCircle",
      color: "#5B8C5A",
    },
    {
      label: t("budgetUtilization"),
      value: "53.6%",
      icon: "TrendingUp",
      color: "#5B7C8C",
    },
  ];

  const tabs: { key: "po" | "costs" | "audit"; label: string }[] = [
    { key: "po", label: t("poApprovals") },
    { key: "costs", label: t("costReports") },
    { key: "audit", label: t("auditLog") },
  ];

  const filterChips: { key: typeof filterStatus; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "pending", label: t("pending") },
    { key: "approved", label: t("approved") },
    { key: "rejected", label: t("rejected") },
  ];

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div style={{ background: "#1A1A1A", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* ─── Header ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "#262626",
                borderRadius: "12px",
                border: "1px solid #3A3A3A",
              }}
            >
              <LucideIcon name="Receipt" size={28} style={{ color: "#C4A882" }} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#E8E0D4",
                  margin: 0,
                }}
              >
                {t("pageTitle")}
              </h1>
              <p style={{ fontSize: "14px", color: "#9A9080", margin: "4px 0 0 0" }}>
                {t("pageSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <LucideIcon name={stat.icon} size={20} style={{ color: stat.color }} />
                <span style={{ fontSize: "13px", color: "#9A9080", fontWeight: "500" }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: "#E8E0D4" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Tab Bar ─── */}
        <div
          style={{
            display: "flex",
            background: "#333333",
            borderRadius: "12px 12px 0 0",
            overflow: "hidden",
            marginBottom: "0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab.key ? "3px solid #C4A882" : "3px solid transparent",
                color: activeTab === tab.key ? "#E8E0D4" : "#9A9080",
                fontSize: "14px",
                fontWeight: activeTab === tab.key ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content Container ─── */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "24px",
            minHeight: "500px",
          }}
        >
          {/* ════════════════════════════════════════════════ */}
          {/* TAB 1 — PO Approvals                           */}
          {/* ════════════════════════════════════════════════ */}
          {activeTab === "po" && (
            <div>
              {/* Filter chips + New PO button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {filterChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => setFilterStatus(chip.key)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border:
                          filterStatus === chip.key
                            ? "1px solid #C4A882"
                            : "1px solid #3A3A3A",
                        background: filterStatus === chip.key ? "#C4A88220" : "#333333",
                        color: filterStatus === chip.key ? "#C4A882" : "#9A9080",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowNewPO(!showNewPO)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "1px solid #C4A882",
                    background: "transparent",
                    color: "#C4A882",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t("newPO")}
                </button>
              </div>

              {/* ─── New PO Form (inline) ─── */}
              {showNewPO && (
                <div
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #3A3A3A",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#E8E0D4",
                      margin: "0 0 16px 0",
                    }}
                  >
                    {t("newPO")}
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {/* Vendor */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9A9080",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        {t("vendor")}
                      </label>
                      <input
                        type="text"
                        value={newPOForm.vendor}
                        onChange={(e) =>
                          setNewPOForm({ ...newPOForm, vendor: e.target.value })
                        }
                        placeholder="Enter vendor name"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "#333333",
                          border: "1px solid #3A3A3A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    {/* Amount */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9A9080",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        {t("amount")} (Cr)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPOForm.amount}
                        onChange={(e) =>
                          setNewPOForm({ ...newPOForm, amount: e.target.value })
                        }
                        placeholder="0.0"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "#333333",
                          border: "1px solid #3A3A3A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    {/* Description */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9A9080",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        {t("description")}
                      </label>
                      <input
                        type="text"
                        value={newPOForm.description}
                        onChange={(e) =>
                          setNewPOForm({ ...newPOForm, description: e.target.value })
                        }
                        placeholder="Enter PO description"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "#333333",
                          border: "1px solid #3A3A3A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    {/* Category dropdown */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9A9080",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        {t("category")}
                      </label>
                      <select
                        value={newPOForm.category}
                        onChange={(e) =>
                          setNewPOForm({ ...newPOForm, category: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "#333333",
                          border: "1px solid #3A3A3A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="">Select category</option>
                        {budgetCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Submit */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "12px",
                      }}
                    >
                      <button
                        onClick={handleSubmitNewPO}
                        style={{
                          padding: "10px 24px",
                          background: "#C4A882",
                          border: "1px solid #C4A882",
                          borderRadius: "8px",
                          color: "#1A1A1A",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {t("submitPO")}
                      </button>
                      <button
                        onClick={() => setShowNewPO(false)}
                        style={{
                          padding: "10px 24px",
                          background: "#333333",
                          border: "1px solid #3A3A3A",
                          borderRadius: "8px",
                          color: "#9A9080",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── PO Card Grid ─── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
                  gap: "16px",
                }}
              >
                {filteredPOs.map((po) => (
                  <div
                    key={po.id}
                    style={{
                      background: "#1A1A1A",
                      border: "1px solid #3A3A3A",
                      borderRadius: "14px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#4A4A4A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#3A3A3A";
                    }}
                  >
                    {/* Top: PO number + status */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "#333333",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#E8E0D4",
                          fontFamily: "monospace",
                        }}
                      >
                        {po.poNumber}
                      </span>
                      <span
                        style={{
                          padding: "4px 12px",
                          background: `${statusColor(po.status)}20`,
                          border: `1px solid ${statusColor(po.status)}`,
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: statusColor(po.status),
                          textTransform: "uppercase",
                        }}
                      >
                        {po.status}
                      </span>
                    </div>

                    {/* Vendor */}
                    <div
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#E8E0D4",
                      }}
                    >
                      {po.vendor}
                    </div>

                    {/* Description */}
                    <div style={{ fontSize: "13px", color: "#9A9080", lineHeight: "1.5" }}>
                      {po.description}
                    </div>

                    {/* Category tag */}
                    <div>
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "#5B7C8C20",
                          border: "1px solid #5B7C8C40",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#5B7C8C",
                        }}
                      >
                        {po.category}
                      </span>
                    </div>

                    {/* Amount */}
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: po.status === "pending" ? "#C4A882" : "#E8E0D4",
                      }}
                    >
                      {formatCrores(po.amount)}
                    </div>

                    {/* Metadata */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        fontSize: "12px",
                        color: "#9A9080",
                      }}
                    >
                      <span>
                        {t("requestedBy")}: <strong style={{ color: "#E8E0D4" }}>{po.requestedBy}</strong>{" "}
                        &middot; {formatDate(po.requestedDate)}
                      </span>
                      {po.status === "approved" && po.approvedBy && (
                        <span>
                          {t("approvedBy")}: <strong style={{ color: "#5B8C5A" }}>{po.approvedBy}</strong>{" "}
                          &middot; {po.approvedDate ? formatDate(po.approvedDate) : ""}
                        </span>
                      )}
                      {po.status === "rejected" && po.notes && (
                        <span style={{ color: "#C45C5C" }}>
                          {t("notes")}: {po.notes}
                        </span>
                      )}
                    </div>

                    {/* Action buttons for pending */}
                    {po.status === "pending" && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                        <button
                          onClick={() => openConfirmModal(po, "approve")}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#5B8C5A20",
                            border: "1px solid #5B8C5A",
                            borderRadius: "8px",
                            color: "#5B8C5A",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#5B8C5A40";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#5B8C5A20";
                          }}
                        >
                          <LucideIcon name="CheckCircle" size={16} />
                          {t("approve")}
                        </button>
                        <button
                          onClick={() => openConfirmModal(po, "reject")}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#C45C5C20",
                            border: "1px solid #C45C5C",
                            borderRadius: "8px",
                            color: "#C45C5C",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#C45C5C40";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#C45C5C20";
                          }}
                        >
                          <LucideIcon name="X" size={16} />
                          {t("reject")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredPOs.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 0",
                    color: "#9A9080",
                    fontSize: "15px",
                  }}
                >
                  No purchase orders found for this filter.
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════ */}
          {/* TAB 2 — Cost Reports                            */}
          {/* ════════════════════════════════════════════════ */}
          {activeTab === "costs" && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #3A3A3A" }}>
                    {[
                      t("category"),
                      t("planned"),
                      t("actual"),
                      t("committed"),
                      t("variance"),
                      t("variancePercent"),
                      t("progress"),
                    ].map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#9A9080",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {costReportRows.map((row) => {
                    const ratio = row.planned > 0 ? row.actual / row.planned : 0;
                    const barWidth = Math.min(ratio * 100, 100);
                    const barColor = getProgressColor(ratio);
                    const varianceColor = row.variance <= 0 ? "#5B8C5A" : "#C45C5C";

                    return (
                      <tr
                        key={row.id}
                        style={{ borderBottom: "1px solid #333333" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#333333";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#E8E0D4",
                          }}
                        >
                          {row.name}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#9A9080",
                          }}
                        >
                          {formatCrores(row.planned)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#E8E0D4",
                          }}
                        >
                          {formatCrores(row.actual)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#C4A882",
                          }}
                        >
                          {formatCrores(row.committed)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: varianceColor,
                          }}
                        >
                          {row.variance > 0 ? "+" : ""}
                          {formatCrores(row.variance)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: varianceColor,
                          }}
                        >
                          {row.variancePct > 0 ? "+" : ""}
                          {row.variancePct.toFixed(1)}%
                        </td>
                        <td style={{ padding: "16px", minWidth: "160px" }}>
                          <div
                            style={{
                              width: "100%",
                              height: "10px",
                              background: "#333333",
                              borderRadius: "5px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${barWidth}%`,
                                height: "100%",
                                background: barColor,
                                borderRadius: "5px",
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: barColor,
                              fontWeight: "600",
                              marginTop: "4px",
                            }}
                          >
                            {(ratio * 100).toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* TOTALS row */}
                  <tr
                    style={{
                      borderTop: "2px solid #C4A882",
                      background: "#1A1A1A",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#C4A882",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("total")}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#9A9080",
                      }}
                    >
                      {formatCrores(costTotals.planned)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#E8E0D4",
                      }}
                    >
                      {formatCrores(costTotals.actual)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#C4A882",
                      }}
                    >
                      {formatCrores(costTotals.committed)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: costTotals.variance <= 0 ? "#5B8C5A" : "#C45C5C",
                      }}
                    >
                      {costTotals.variance > 0 ? "+" : ""}
                      {formatCrores(costTotals.variance)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: costTotals.variancePct <= 0 ? "#5B8C5A" : "#C45C5C",
                      }}
                    >
                      {costTotals.variancePct > 0 ? "+" : ""}
                      {costTotals.variancePct.toFixed(1)}%
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          background: "#333333",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min((costTotals.actual / costTotals.planned) * 100, 100)}%`,
                            height: "100%",
                            background: getProgressColor(
                              costTotals.actual / costTotals.planned
                            ),
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: getProgressColor(
                            costTotals.actual / costTotals.planned
                          ),
                          fontWeight: "600",
                          marginTop: "4px",
                        }}
                      >
                        {((costTotals.actual / costTotals.planned) * 100).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ════════════════════════════════════════════════ */}
          {/* TAB 3 — Audit Log                               */}
          {/* ════════════════════════════════════════════════ */}
          {activeTab === "audit" && (
            <div
              style={{
                maxHeight: "700px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {Object.entries(groupedAudit).map(([dateLabel, entries]) => (
                <div key={dateLabel} style={{ marginBottom: "28px" }}>
                  {/* Date header with line */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#C4A882",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dateLabel}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "#3A3A3A",
                      }}
                    />
                  </div>

                  {/* Entries for this date */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "14px",
                          padding: "14px 16px",
                          background: "#1A1A1A",
                          borderRadius: "10px",
                          border: "1px solid #333333",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#4A4A4A";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#333333";
                        }}
                      >
                        {/* Time */}
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#9A9080",
                            minWidth: "48px",
                            fontFamily: "monospace",
                            paddingTop: "2px",
                          }}
                        >
                          {formatTime(entry.timestamp)}
                        </div>

                        {/* Colored dot */}
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: statusColor(entry.status || "info"),
                            marginTop: "5px",
                            flexShrink: 0,
                          }}
                        />

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "4px",
                              flexWrap: "wrap",
                            }}
                          >
                            {/* Action badge */}
                            <span
                              style={{
                                padding: "3px 10px",
                                background: `${statusColor(entry.status || "info")}20`,
                                border: `1px solid ${statusColor(entry.status || "info")}40`,
                                borderRadius: "5px",
                                fontSize: "11px",
                                fontWeight: "700",
                                color: statusColor(entry.status || "info"),
                              }}
                            >
                              {entry.action}
                            </span>
                            {/* User */}
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#E8E0D4",
                              }}
                            >
                              {entry.user}
                            </span>
                          </div>
                          {/* Details */}
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#9A9080",
                              lineHeight: "1.5",
                            }}
                          >
                            {entry.details}
                          </div>
                        </div>

                        {/* Right side: amount + module */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "6px",
                            flexShrink: 0,
                          }}
                        >
                          {entry.amount !== undefined && (
                            <span
                              style={{
                                padding: "3px 10px",
                                background: "#C4A88220",
                                border: "1px solid #C4A88240",
                                borderRadius: "5px",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#C4A882",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatCrores(entry.amount)}
                            </span>
                          )}
                          <span
                            style={{
                              padding: "2px 8px",
                              background: "#333333",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#6B6560",
                            }}
                          >
                            {entry.module}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* Confirmation Modal                                  */}
        {/* ═══════════════════════════════════════════════════ */}
        {showModal && selectedPO && modalAction && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "1rem",
                padding: "32px",
                maxWidth: "520px",
                width: "100%",
              }}
            >
              {/* Modal title */}
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#E8E0D4",
                  margin: "0 0 20px 0",
                }}
              >
                {modalAction === "approve" ? t("confirmApproval") : t("confirmRejection")}
              </h2>

              {/* PO Summary */}
              <div
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #333333",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#E8E0D4",
                    }}
                  >
                    {selectedPO.poNumber}
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#C4A882",
                    }}
                  >
                    {formatCrores(selectedPO.amount)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#E8E0D4",
                    marginBottom: "4px",
                  }}
                >
                  {selectedPO.vendor}
                </div>
                <div style={{ fontSize: "13px", color: "#9A9080" }}>
                  {selectedPO.description}
                </div>
              </div>

              {/* Rejection notes */}
              {modalAction === "reject" && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#9A9080",
                      marginBottom: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {t("notes")} (optional)
                  </label>
                  <textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Reason for rejection..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#9A9080",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmAction}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background:
                      modalAction === "approve" ? "#5B8C5A" : "#C45C5C",
                    border: "none",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
