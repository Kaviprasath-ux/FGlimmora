"use client";

import { useState } from "react";
import { vfxShots } from "@/data/mock-data";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores, formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { deliveryTranslations } from "@/lib/translations/delivery";

export default function DeliveryPage() {
  const { t } = useTranslation(deliveryTranslations);
  // Generate delivery dates for each shot
  const shotsWithDelivery = vfxShots.map((shot) => {
    // Calculate expected delivery based on complexity
    let daysToDeliver = 0;
    switch (shot.complexity) {
      case "extreme":
        daysToDeliver = 45;
        break;
      case "high":
        daysToDeliver = 30;
        break;
      case "medium":
        daysToDeliver = 20;
        break;
      case "low":
        daysToDeliver = 10;
        break;
    }

    const startDate = new Date("2026-01-15");
    const expectedDelivery = new Date(startDate);
    expectedDelivery.setDate(startDate.getDate() + daysToDeliver);

    // Determine if on-track or at-risk
    const today = new Date();
    const daysRemaining = Math.ceil((expectedDelivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let deliveryStatus: "delivered" | "on-track" | "at-risk" | "delayed";
    if (shot.status === "approved") {
      deliveryStatus = "delivered";
    } else if (daysRemaining < 0) {
      deliveryStatus = "delayed";
    } else if (daysRemaining < 7 && shot.status !== "in_progress") {
      deliveryStatus = "at-risk";
    } else {
      deliveryStatus = "on-track";
    }

    return {
      ...shot,
      expectedDelivery,
      daysRemaining,
      deliveryStatus,
    };
  });

  const stats = {
    totalShots: shotsWithDelivery.length,
    delivered: shotsWithDelivery.filter((s) => s.deliveryStatus === "delivered").length,
    onTrack: shotsWithDelivery.filter((s) => s.deliveryStatus === "on-track").length,
    atRisk: shotsWithDelivery.filter((s) => s.deliveryStatus === "at-risk").length,
    delayed: shotsWithDelivery.filter((s) => s.deliveryStatus === "delayed").length,
  };

  // Key milestones
  const milestones = [
    { id: "m1", name: "Action Sequence VFX", date: new Date("2026-03-15"), shots: 3, status: "upcoming" },
    { id: "m2", name: "Song Composite Shots", date: new Date("2026-02-28"), shots: 2, status: "on-track" },
    { id: "m3", name: "Climax Ship Sequence", date: new Date("2026-04-30"), shots: 3, status: "upcoming" },
    { id: "m4", name: "Final VFX Delivery", date: new Date("2026-05-15"), shots: 12, status: "upcoming" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return { bg: "rgba(91, 140, 90, 0.15)", text: "#5B8C5A", icon: "CheckCircle" };
      case "on-track":
        return { bg: "rgba(91, 124, 140, 0.15)", text: "#5B7C8C", icon: "Clock" };
      case "at-risk":
        return { bg: "rgba(196, 160, 66, 0.15)", text: "#C4A042", icon: "AlertTriangle" };
      case "delayed":
        return { bg: "rgba(196, 92, 92, 0.15)", text: "#C45C5C", icon: "AlertTriangle" };
      default:
        return { bg: "rgba(154, 144, 128, 0.15)", text: "#9A9080", icon: "Clock" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return t("statusDelivered");
      case "on-track":
        return t("statusOnTrack");
      case "at-risk":
        return t("statusAtRisk");
      case "delayed":
        return t("statusDelayed");
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Vendor performance
  const vendorPerformance = Array.from(new Set(vfxShots.map((s) => s.vendor))).map((vendor) => {
    const vendorShots = shotsWithDelivery.filter((s) => s.vendor === vendor);
    const delivered = vendorShots.filter((s) => s.deliveryStatus === "delivered").length;
    const onTime = vendorShots.filter(
      (s) => s.deliveryStatus === "delivered" || s.deliveryStatus === "on-track"
    ).length;
    const onTimeRate = vendorShots.length > 0 ? (onTime / vendorShots.length) * 100 : 0;

    return {
      vendor,
      totalShots: vendorShots.length,
      delivered,
      onTimeRate,
    };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F0F", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <LucideIcon name="Calendar" size={32} style={{ color: "#C4A882" }} />
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#9A9080", margin: 0 }}>
          {t("pageDescription")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Layers" size={20} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("totalShots")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalShots}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="CheckCircle" size={20} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("delivered")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.delivered}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="Clock" size={20} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("onTrack")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.onTrack}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("atRisk")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.atRisk}</div>
        </div>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C45C5C" }} />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("delayed")}</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{stats.delayed}</div>
        </div>
      </div>

      {/* At-Risk Alert */}
      {stats.atRisk > 0 && (
        <div
          style={{
            background: "rgba(196, 160, 66, 0.1)",
            border: "1px solid rgba(196, 160, 66, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C4A042" }} />
          <div>
            <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "600" }}>{t("attentionRequired")}</span>
            <span style={{ fontSize: "14px", color: "#9A9080" }}>
              {stats.atRisk} {stats.atRisk !== 1 ? t("atRiskPlural") : t("atRiskSingular")}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Timeline View */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "16px" }}>
            {t("deliveryTimeline")}
          </h2>
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {shotsWithDelivery
                .sort((a, b) => a.expectedDelivery.getTime() - b.expectedDelivery.getTime())
                .map((shot) => {
                  const statusStyle = getStatusColor(shot.deliveryStatus);
                  return (
                    <div
                      key={shot.id}
                      style={{
                        background: "#242424",
                        border: "1px solid #2A2A2A",
                        borderRadius: "12px",
                        padding: "16px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#3A3A3A";
                        e.currentTarget.style.background = "#2A2A2A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#2A2A2A";
                        e.currentTarget.style.background = "#242424";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                            Scene {shot.sceneNumber} - Shot {shot.shotNumber}
                          </div>
                          <div style={{ fontSize: "12px", color: "#9A9080" }}>
                            {shot.type.toUpperCase()} • {shot.vendor}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                            {formatDate(shot.expectedDelivery)}
                          </div>
                          {shot.deliveryStatus !== "delivered" && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: shot.daysRemaining < 0 ? "#C45C5C" : "#9A9080",
                              }}
                            >
                              {shot.daysRemaining < 0
                                ? `${Math.abs(shot.daysRemaining)} ${t("daysOverdue")}`
                                : `${shot.daysRemaining} ${t("daysLeft")}`}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        >
                          <LucideIcon name={statusStyle.icon} size={12} />
                          {getStatusLabel(shot.deliveryStatus)}
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>
                          {formatCrores(shot.estimatedCost)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Milestones & Performance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Key Milestones */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("keyMilestones")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {milestones.map((milestone, idx) => {
                const today = new Date();
                const daysToMilestone = Math.ceil(
                  (milestone.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isPast = daysToMilestone < 0;
                const isUpcoming = daysToMilestone >= 0 && daysToMilestone <= 30;

                return (
                  <div
                    key={milestone.id}
                    style={{
                      background: "#242424",
                      border: `1px solid ${isUpcoming ? "#C4A88240" : "#2A2A2A"}`,
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "start", gap: "12px", marginBottom: "8px" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: isUpcoming ? "#C4A882" : "#3A3A3A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <LucideIcon
                          name="Flag"
                          size={14}
                          style={{ color: isUpcoming ? "#0F0F0F" : "#6B6560" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                          {milestone.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#9A9080", marginBottom: "4px" }}>
                          {formatDate(milestone.date)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6B6560" }}>
                          {milestone.shots} {t("shots")}
                          {!isPast && (
                            <span style={{ marginLeft: "8px" }}>
                              • {daysToMilestone} {t("days")} {isUpcoming && "⚠"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vendor Performance */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
              {t("vendorPerformance")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {vendorPerformance.map((vendor) => (
                <div key={vendor.vendor}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>{vendor.vendor}</div>
                      <div style={{ fontSize: "12px", color: "#9A9080", marginTop: "2px" }}>
                        {vendor.delivered} / {vendor.totalShots} {t("deliveredCount")}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color:
                          vendor.onTimeRate >= 80
                            ? "#5B8C5A"
                            : vendor.onTimeRate >= 60
                            ? "#C4A042"
                            : "#C45C5C",
                      }}
                    >
                      {vendor.onTimeRate.toFixed(0)}%
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
                        width: `${vendor.onTimeRate}%`,
                        height: "100%",
                        background:
                          vendor.onTimeRate >= 80
                            ? "#5B8C5A"
                            : vendor.onTimeRate >= 60
                            ? "#C4A042"
                            : "#C45C5C",
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

      {/* Delivery Summary Chart */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginTop: 0, marginBottom: "20px" }}>
          {t("deliveryStatusOverview")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { status: "delivered", label: t("statusDelivered"), count: stats.delivered, color: "#5B8C5A" },
            { status: "on-track", label: t("statusOnTrack"), count: stats.onTrack, color: "#5B7C8C" },
            { status: "at-risk", label: t("statusAtRisk"), count: stats.atRisk, color: "#C4A042" },
            { status: "delayed", label: t("statusDelayed"), count: stats.delayed, color: "#C45C5C" },
          ].map((item) => {
            const percentage = (item.count / stats.totalShots) * 100;
            return (
              <div
                key={item.status}
                style={{
                  background: "#242424",
                  border: "1px solid #2A2A2A",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 12px",
                    position: "relative",
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#2A2A2A" strokeWidth="8" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 30 * (percentage / 100)} ${2 * Math.PI * 30}`}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: item.color,
                    }}
                  >
                    {item.count}
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "12px", color: "#9A9080" }}>{percentage.toFixed(0)}% {t("ofTotal")}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
