"use client";

import { useState } from "react";
import { approvals } from "@/data/mock-data";
import { formatCrores, formatDate, getRelativeTime } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { approvalsTranslations } from "@/lib/translations/approvals";
import type { Approval } from "@/lib/types";

export default function ApprovalsPage() {
  const { t } = useTranslation(approvalsTranslations);
  const [filter, setFilter] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<{ id: string; action: "approved" | "rejected" } | null>(
    null
  );

  // Calculate stats
  const totalRequests = approvals.length;
  const pending = approvals.filter((a) => a.status === "pending").length;
  const approved = approvals.filter((a) => a.status === "approved").length;
  const rejected = approvals.filter((a) => a.status === "rejected").length;
  const totalAmountPending = approvals
    .filter((a) => a.status === "pending" && a.amount)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  // Apply filter
  const filteredApprovals = approvals.filter((approval) => {
    if (filter === "all") return true;
    return approval.status === filter;
  });

  // Sort by date (most recent first)
  const sortedApprovals = [...filteredApprovals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      Budget: "IndianRupee",
      Schedule: "Calendar",
      Vendor: "Building",
      Casting: "Users",
      Marketing: "Megaphone",
    };
    return icons[type] || "FileText";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Budget: "#C4A882",
      Schedule: "#5B7C8C",
      Vendor: "#9A9080",
      Casting: "#C4A042",
      Marketing: "#5B8C5A",
    };
    return colors[type] || "#6B6560";
  };

  const handleApprove = (id: string) => {
    setShowConfirmation({ id, action: "approved" });
  };

  const handleReject = (id: string) => {
    setShowConfirmation({ id, action: "rejected" });
  };

  const confirmAction = () => {
    if (showConfirmation) {
      console.log(`${showConfirmation.action} approval ${showConfirmation.id}`);
      // In real app, update the approval status
      setShowConfirmation(null);
      setSelectedApproval(null);
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <LucideIcon name="CheckCircle" size={32} color="#C4A882" />
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>{t("pageTitle")}</h1>
          {pending > 0 && (
            <span
              style={{
                background: "#C45C5C",
                color: "#E8E0D4",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {pending} {t("pending")}
            </span>
          )}
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
          { label: t("totalRequests"), value: totalRequests, icon: "FileText", color: "#C4A882" },
          { label: t("pendingLabel"), value: pending, icon: "Clock", color: "#C4A042" },
          { label: t("approved"), value: approved, icon: "CheckCircle", color: "#5B8C5A" },
          { label: t("rejected"), value: rejected, icon: "AlertTriangle", color: "#C45C5C" },
          {
            label: t("pendingAmount"),
            value: totalAmountPending > 0 ? formatCrores(totalAmountPending) : "-",
            icon: "IndianRupee",
            color: "#C4A882",
          },
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

      {/* Tab Filters */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { label: t("all"), value: "all", count: totalRequests },
            { label: t("pendingLabel"), value: "pending", count: pending },
            { label: t("approved"), value: "approved", count: approved },
            { label: t("rejected"), value: "rejected", count: rejected },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                background: filter === tab.value ? "#C4A882" : "#262626",
                color: filter === tab.value ? "#1A1A1A" : "#E8E0D4",
                border: `1px solid ${filter === tab.value ? "#C4A882" : "#3A3A3A"}`,
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Approval Cards */}
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        {sortedApprovals.map((approval) => (
          <div
            key={approval.id}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "1rem",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onClick={() => setSelectedApproval(approval)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4A4A4A")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3A3A3A")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "start", flex: 1 }}>
                <div
                  style={{
                    background: getTypeColor(approval.type) + "20",
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                  }}
                >
                  <LucideIcon name={getTypeIcon(approval.type)} size={24} color={getTypeColor(approval.type)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        background: getTypeColor(approval.type) + "20",
                        color: getTypeColor(approval.type),
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      {approval.type}
                    </span>
                    <span style={{ color: "#6B6560", fontSize: "0.875rem" }}>
                      {getRelativeTime(approval.createdAt)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", margin: "0 0 0.5rem 0" }}>
                    {approval.title}
                  </h3>
                  <p style={{ color: "#9A9080", fontSize: "0.875rem", margin: "0 0 0.75rem 0", lineHeight: "1.5" }}>
                    {approval.description}
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
                    <div>
                      <span style={{ color: "#6B6560" }}>{t("requestedBy")} </span>
                      <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{approval.requestedBy}</span>
                    </div>
                    {approval.amount && (
                      <div>
                        <span style={{ color: "#6B6560" }}>{t("amount")} </span>
                        <span style={{ color: "#C4A882", fontWeight: "600" }}>{formatCrores(approval.amount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {approval.status === "pending" ? (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(approval.id);
                      }}
                      style={{
                        background: "#5B8C5A",
                        color: "#E8E0D4",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {t("approve")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(approval.id);
                      }}
                      style={{
                        background: "transparent",
                        color: "#C45C5C",
                        border: "1px solid #C45C5C",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {t("reject")}
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      background:
                        approval.status === "approved"
                          ? "#5B8C5A20"
                          : approval.status === "rejected"
                            ? "#C45C5C20"
                            : "#6B656020",
                      color:
                        approval.status === "approved"
                          ? "#5B8C5A"
                          : approval.status === "rejected"
                            ? "#C45C5C"
                            : "#6B6560",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {approval.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval History Timeline */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "1.5rem" }}>
          {t("approvalHistory")}
        </h2>
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              left: "0.5rem",
              top: "0.5rem",
              bottom: "0.5rem",
              width: "2px",
              background: "#3A3A3A",
            }}
          />
          {sortedApprovals.slice(0, 5).map((approval, i) => (
            <div key={approval.id} style={{ marginBottom: "1.5rem", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "-1.5rem",
                  top: "0.25rem",
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "50%",
                  background:
                    approval.status === "approved"
                      ? "#5B8C5A"
                      : approval.status === "rejected"
                        ? "#C45C5C"
                        : "#C4A042",
                  border: "2px solid #262626",
                }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#E8E0D4", fontSize: "0.875rem", fontWeight: "600" }}>
                    {approval.title}
                  </span>
                  <span
                    style={{
                      color:
                        approval.status === "approved"
                          ? "#5B8C5A"
                          : approval.status === "rejected"
                            ? "#C45C5C"
                            : "#C4A042",
                      fontSize: "0.75rem",
                      textTransform: "capitalize",
                    }}
                  >
                    • {approval.status}
                  </span>
                </div>
                <div style={{ color: "#6B6560", fontSize: "0.75rem" }}>
                  {formatDate(approval.createdAt)} by {approval.requestedBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <div
          onClick={() => setSelectedApproval(null)}
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
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                {t("approvalRequestDetails")}
              </h2>
              <button
                onClick={() => setSelectedApproval(null)}
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
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("type")}</div>
                <span
                  style={{
                    background: getTypeColor(selectedApproval.type) + "20",
                    color: getTypeColor(selectedApproval.type),
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {selectedApproval.type}
                </span>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("title")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "1.125rem", fontWeight: "600" }}>
                  {selectedApproval.title}
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("description")}</div>
                <div style={{ color: "#E8E0D4", lineHeight: "1.6" }}>{selectedApproval.description}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("requestedBy")}</div>
                  <div style={{ color: "#E8E0D4", fontWeight: "600" }}>{selectedApproval.requestedBy}</div>
                </div>
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("date")}</div>
                  <div style={{ color: "#E8E0D4" }}>{formatDate(selectedApproval.createdAt)}</div>
                </div>
              </div>
              {selectedApproval.amount && (
                <div>
                  <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("amount")}</div>
                  <div style={{ color: "#C4A882", fontSize: "1.5rem", fontWeight: "700" }}>
                    {formatCrores(selectedApproval.amount)}
                  </div>
                </div>
              )}
              <div>
                <div style={{ color: "#9A9080", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{t("status")}</div>
                <div
                  style={{
                    color:
                      selectedApproval.status === "approved"
                        ? "#5B8C5A"
                        : selectedApproval.status === "rejected"
                          ? "#C45C5C"
                          : "#C4A042",
                    textTransform: "capitalize",
                    fontWeight: "600",
                    fontSize: "1.125rem",
                  }}
                >
                  {selectedApproval.status}
                </div>
              </div>
              {selectedApproval.status === "pending" && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    style={{
                      flex: 1,
                      background: "#5B8C5A",
                      color: "#E8E0D4",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("approve")}
                  </button>
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      color: "#C45C5C",
                      border: "1px solid #C45C5C",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("reject")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          onClick={() => setShowConfirmation(null)}
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
            zIndex: 1001,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#E8E0D4", marginBottom: "1rem" }}>
              {showConfirmation.action === "approved" ? t("confirmApproval") : t("confirmRejection")}
            </h3>
            <p style={{ color: "#9A9080", marginBottom: "1.5rem" }}>
              {showConfirmation.action === "approved" ? t("confirmApproveMessage") : t("confirmRejectMessage")}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={confirmAction}
                style={{
                  flex: 1,
                  background: showConfirmation.action === "approved" ? "#5B8C5A" : "#C45C5C",
                  color: "#E8E0D4",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("confirm")}
              </button>
              <button
                onClick={() => setShowConfirmation(null)}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "#9A9080",
                  border: "1px solid #3A3A3A",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
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
    </div>
  );
}
