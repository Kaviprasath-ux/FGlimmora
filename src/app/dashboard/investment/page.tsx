"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { budgetCategories } from "@/data/mock-data";
import { useTranslation } from "@/lib/translations";
import { investmentTranslations } from "@/lib/translations/investment";

export default function InvestmentPage() {
  const { t } = useTranslation(investmentTranslations);
  const [selectedTimeline, setSelectedTimeline] = useState("6m");

  // Investment data
  const totalInvestment = 35000000000; // 350 Cr
  const capitalDeployed = 24500000000; // 245 Cr
  const remaining = totalInvestment - capitalDeployed;

  // Deployment timeline data (monthly)
  const deploymentData = [
    { month: "Jan", amount: 2800000000 },
    { month: "Feb", amount: 3200000000 },
    { month: "Mar", amount: 4100000000 },
    { month: "Apr", amount: 3800000000 },
    { month: "May", amount: 4200000000 },
    { month: "Jun", amount: 6400000000 },
  ];

  const maxDeployment = Math.max(...deploymentData.map((d) => d.amount));

  // Investment breakdown by category
  const colors = ["#C4A882", "#5B8C5A", "#C4A042", "#5B7C8C", "#C45C5C", "#8B7355", "#7C9EB5"];
  const categoryBreakdown = budgetCategories.map((cat, i) => ({
    name: cat.name,
    amount: cat.planned * 10000000,
    color: colors[i % colors.length],
    percentage: (cat.planned / 350) * 100,
  }));

  // Comparable films
  const comparableFilms = [
    {
      name: "Epic Saga Returns",
      budget: 32000000000,
      revenue: 68000000000,
      roi: 112.5,
    },
    {
      name: "Kingdom Chronicles",
      budget: 38000000000,
      revenue: 82000000000,
      roi: 115.8,
    },
    {
      name: "Legacy of Warriors",
      budget: 29000000000,
      revenue: 59000000000,
      roi: 103.4,
    },
  ];

  // Investment protection score (0-100)
  const protectionScore = 87;

  // Capital call schedule
  const capitalCalls = [
    { date: "2025-03-15", amount: 2500000000, purposeKey: "vfxProduction" },
    { date: "2025-04-01", amount: 1800000000, purposeKey: "marketingCampaign" },
    { date: "2025-04-20", amount: 3200000000, purposeKey: "postProduction" },
    { date: "2025-05-10", amount: 2500000000, purposeKey: "distribution" },
  ];

  return (
    <div style={{ padding: "32px", backgroundColor: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            color: "#E8E0D4",
            marginBottom: "8px",
          }}
        >
          {t("investmentSummary")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "15px" }}>
          {t("investmentDescription")}
        </p>
      </div>

      {/* Large Investment Card */}
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <LucideIcon name="TrendingUp" size={20} color="#C4A882" />
              <span style={{ color: "#9A9080", fontSize: "14px" }}>
                {t("totalInvestment")}
              </span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "600", color: "#E8E0D4" }}>
              {formatCrores(totalInvestment)}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <LucideIcon name="CheckCircle" size={20} color="#5B8C5A" />
              <span style={{ color: "#9A9080", fontSize: "14px" }}>
                {t("capitalDeployed")}
              </span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "600", color: "#5B8C5A" }}>
              {formatCrores(capitalDeployed)}
            </div>
            <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>
              {((capitalDeployed / totalInvestment) * 100).toFixed(1)}% {t("deployed")}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <LucideIcon name="Clock" size={20} color="#C4A042" />
              <span style={{ color: "#9A9080", fontSize: "14px" }}>
                {t("remainingCapital")}
              </span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "600", color: "#E8E0D4" }}>
              {formatCrores(remaining)}
            </div>
            <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>
              {((remaining / totalInvestment) * 100).toFixed(1)}% {t("remaining")}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Deployment Timeline */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
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
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>
              {t("capitalDeploymentTimeline")}
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              {["3m", "6m", "1y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeline(period)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: selectedTimeline === period ? "#C4A882" : "#2A2A2A",
                    backgroundColor: selectedTimeline === period ? "#C4A88220" : "#242424",
                    color: selectedTimeline === period ? "#C4A882" : "#9A9080",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "240px", display: "flex", alignItems: "flex-end", gap: "16px" }}>
            {deploymentData.map((data, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(data.amount / maxDeployment) * 200}px`,
                    backgroundColor: "#C4A882",
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#D4B892";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#C4A882";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "#E8E0D4",
                      fontSize: "12px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCrores(data.amount)}
                  </div>
                </div>
                <div style={{ color: "#9A9080", fontSize: "13px", fontWeight: "500" }}>
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Protection Score */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#E8E0D4",
              marginBottom: "24px",
            }}
          >
            {t("investmentProtection")}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#242424"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#5B8C5A"
                  strokeWidth="12"
                  strokeDasharray={`${(protectionScore / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "36px", fontWeight: "600", color: "#5B8C5A" }}>
                  {protectionScore}
                </div>
                <div style={{ color: "#9A9080", fontSize: "13px" }}>{t("score")}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: t("contractSecurity"), status: t("strong") },
              { label: t("collateralCoverage"), status: t("excellent") },
              { label: t("revenueGuarantee"), status: t("good") },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  backgroundColor: "#242424",
                  borderRadius: "8px",
                }}
              >
                <span style={{ color: "#E8E0D4", fontSize: "13px" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    color: "#5B8C5A",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Breakdown by Category */}
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#E8E0D4",
            marginBottom: "24px",
          }}
        >
          {t("investmentBreakdownByCategory")}
        </h2>

        <div style={{ display: "flex", gap: "32px" }}>
          {/* Bar Chart */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#E8E0D4", fontSize: "14px" }}>
                    {cat.name}
                  </span>
                  <span style={{ color: "#9A9080", fontSize: "14px" }}>
                    {formatCrores(cat.amount)}
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "#242424",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              width: "200px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {categoryBreakdown.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  backgroundColor: "#242424",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "3px",
                    backgroundColor: cat.color,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "500" }}>
                    {cat.percentage.toFixed(1)}%
                  </div>
                  <div style={{ color: "#9A9080", fontSize: "11px" }}>
                    {cat.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Comparable Films */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#E8E0D4",
              marginBottom: "24px",
            }}
          >
            {t("comparableFilms")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {comparableFilms.map((film, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#242424",
                  border: "1px solid #2A2A2A",
                  borderRadius: "12px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C4A882";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2A2A2A";
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#E8E0D4",
                    marginBottom: "12px",
                  }}
                >
                  {film.name}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                      {t("budget")}
                    </div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                      {formatCrores(film.budget)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                      {t("revenue")}
                    </div>
                    <div style={{ color: "#5B8C5A", fontSize: "14px", fontWeight: "500" }}>
                      {formatCrores(film.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                      {t("roi")}
                    </div>
                    <div style={{ color: "#C4A882", fontSize: "14px", fontWeight: "500" }}>
                      {film.roi.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capital Call Schedule */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            <LucideIcon name="Calendar" size={20} color="#C4A882" />
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>
              {t("capitalCallSchedule")}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {capitalCalls.map((call, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#242424",
                  border: "1px solid #2A2A2A",
                  borderRadius: "12px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2A2A2A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#242424";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#E8E0D4",
                        fontSize: "15px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      {formatCrores(call.amount)}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "13px" }}>
                      {t(call.purposeKey)}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#C4A88220",
                      borderRadius: "6px",
                      color: "#C4A882",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {new Date(call.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
