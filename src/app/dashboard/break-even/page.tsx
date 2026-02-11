"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores } from "@/lib/utils";
import { revenueStreams } from "@/data/mock-data";
import { useTranslation } from "@/lib/translations";
import { breakEvenTranslations } from "@/lib/translations/break-even";

export default function BreakEvenPage() {
  const { t } = useTranslation(breakEvenTranslations);
  const [selectedScenario, setSelectedScenario] = useState("expected");

  // Budget data
  const totalBudget = 35000000000; // 350 Cr
  const projectedRevenue = 76100000000; // 761 Cr
  const breakEvenPoint = 28500000000; // 285 Cr (including distribution costs)

  // Revenue streams with cumulative data
  const revenueBreakdown = [
    { name: "Theatrical", amount: 45000000000, color: "#C4A882", cumulative: 45000000000 },
    { name: "OTT Rights", amount: 18000000000, color: "#5B7C8C", cumulative: 63000000000 },
    { name: "Satellite Rights", amount: 8500000000, color: "#5B8C5A", cumulative: 71500000000 },
    { name: "Music Rights", amount: 4600000000, color: "#C4A042", cumulative: 76100000000 },
  ];

  // Scenarios comparison
  const scenarios = {
    best: {
      nameKey: "bestCase",
      revenue: 92000000000,
      roi: 162.9,
      breakEvenWeek: 1,
      color: "#5B8C5A",
    },
    expected: {
      nameKey: "expectedCase",
      revenue: 76100000000,
      roi: 117.4,
      breakEvenWeek: 2,
      color: "#C4A882",
    },
    worst: {
      nameKey: "worstCase",
      revenue: 52000000000,
      roi: 48.6,
      breakEvenWeek: 4,
      color: "#C4A042",
    },
  };

  // Time to break-even (weekly collection curve)
  const collectionCurve = [
    { week: "Week 1", collection: 18500000000, cumulative: 18500000000 },
    { week: "Week 2", collection: 12000000000, cumulative: 30500000000 },
    { week: "Week 3", collection: 7500000000, cumulative: 38000000000 },
    { week: "Week 4", collection: 4200000000, cumulative: 42200000000 },
    { week: "Week 5+", collection: 3800000000, cumulative: 46000000000 },
  ];

  const maxCollection = Math.max(...collectionCurve.map((w) => w.collection));
  const safetyMargin = projectedRevenue - breakEvenPoint;

  return (
    <div style={{ padding: "32px", backgroundColor: "#1A1A1A", minHeight: "100vh" }}>
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
          {t("breakEvenAnalysis")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "15px" }}>
          {t("breakEvenDescription")}
        </p>
      </div>

      {/* Budget vs Revenue Comparison */}
      <div
        style={{
          backgroundColor: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#E8E0D4",
            marginBottom: "32px",
          }}
        >
          {t("budgetVsProjectedRevenue")}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
          {/* Budget Bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LucideIcon name="DollarSign" size={20} color="#C45C5C" />
                <span style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "500" }}>
                  {t("totalBudget")}
                </span>
              </div>
              <span style={{ color: "#C45C5C", fontSize: "24px", fontWeight: "600" }}>
                {formatCrores(totalBudget)}
              </span>
            </div>
            <div
              style={{
                height: "48px",
                backgroundColor: "#C45C5C",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8E0D4",
                fontWeight: "600",
              }}
            >
              {t("productionMarketingDistribution")}
            </div>
          </div>

          {/* Revenue Bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LucideIcon name="TrendingUp" size={20} color="#5B8C5A" />
                <span style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "500" }}>
                  {t("projectedRevenue")}
                </span>
              </div>
              <span style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "600" }}>
                {formatCrores(projectedRevenue)}
              </span>
            </div>
            <div
              style={{
                height: "48px",
                backgroundColor: "#5B8C5A",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8E0D4",
                fontWeight: "600",
                position: "relative",
                width: `${(projectedRevenue / totalBudget) * 100}%`,
              }}
            >
              {t("allRevenueStreams")}
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: "#333333",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LucideIcon name="TrendingUp" size={20} color="#C4A882" />
            <span style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "500" }}>
              {t("projectedNetProfit")}
            </span>
          </div>
          <span style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>
            {formatCrores(projectedRevenue - totalBudget)}
          </span>
        </div>
      </div>

      {/* Break-even Point Indicator */}
      <div
        style={{
          backgroundColor: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "32px",
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
          {t("breakEvenPoint")}
        </h2>

        <div style={{ position: "relative", marginBottom: "48px" }}>
          {/* Number line */}
          <div
            style={{
              height: "12px",
              backgroundColor: "#333333",
              borderRadius: "6px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                height: "100%",
                width: `${(breakEvenPoint / projectedRevenue) * 100}%`,
                backgroundColor: "#C4A042",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${(breakEvenPoint / projectedRevenue) * 100}%`,
                top: "0",
                height: "100%",
                width: `${((projectedRevenue - breakEvenPoint) / projectedRevenue) * 100}%`,
                backgroundColor: "#5B8C5A",
                borderRadius: "0 6px 6px 0",
              }}
            />
          </div>

          {/* Break-even marker */}
          <div
            style={{
              position: "absolute",
              left: `${(breakEvenPoint / projectedRevenue) * 100}%`,
              top: "-32px",
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#C4A882",
                borderRadius: "8px",
                color: "#1A1A1A",
                fontSize: "14px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {t("breakEven")}: {formatCrores(breakEvenPoint)}
            </div>
            <div
              style={{
                width: "2px",
                height: "24px",
                backgroundColor: "#C4A882",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <span style={{ color: "#9A9080", fontSize: "13px" }}>₹0</span>
            <span style={{ color: "#9A9080", fontSize: "13px" }}>
              {formatCrores(projectedRevenue)}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#333333",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: "#C4A042", fontSize: "24px", fontWeight: "600" }}>
              {formatCrores(breakEvenPoint)}
            </div>
            <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>
              {t("breakEvenPoint")}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#333333",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "600" }}>
              {formatCrores(safetyMargin)}
            </div>
            <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>
              {t("safetyMargin")}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#333333",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: "#C4A882", fontSize: "24px", fontWeight: "600" }}>
              {((safetyMargin / breakEvenPoint) * 100).toFixed(0)}%
            </div>
            <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>
              {t("aboveBreakEven")}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Streams to Break-even */}
      <div
        style={{
          backgroundColor: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "32px",
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
          {t("revenueStreamsContributing")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {revenueBreakdown.map((stream, idx) => (
            <div key={idx}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      backgroundColor: stream.color,
                    }}
                  />
                  <span style={{ color: "#E8E0D4", fontSize: "15px", fontWeight: "500" }}>
                    {stream.name}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600" }}>
                    {formatCrores(stream.amount)}
                  </div>
                  <div style={{ color: "#9A9080", fontSize: "12px" }}>
                    {t("cumulative")}: {formatCrores(stream.cumulative)}
                  </div>
                </div>
              </div>

              {/* Cumulative bar */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    height: "32px",
                    backgroundColor: "#333333",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(stream.cumulative / projectedRevenue) * 100}%`,
                      background: `linear-gradient(90deg, ${stream.color}40, ${stream.color})`,
                      borderRadius: "8px",
                      transition: "width 0.5s",
                    }}
                  />

                  {/* Break-even line */}
                  {stream.cumulative >= breakEvenPoint && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${(breakEvenPoint / projectedRevenue) * 100}%`,
                        top: "0",
                        height: "100%",
                        width: "2px",
                        backgroundColor: "#C4A882",
                      }}
                    >
                      {idx === revenueBreakdown.findIndex(s => s.cumulative >= breakEvenPoint) && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-28px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "4px 8px",
                            backgroundColor: "#C4A882",
                            borderRadius: "6px",
                            color: "#1A1A1A",
                            fontSize: "11px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t("breakEven")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Scenarios Comparison */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
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
            {t("revenueScenarios")}
          </h2>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {Object.entries(scenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => setSelectedScenario(key)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: selectedScenario === key ? scenario.color : "#3A3A3A",
                  backgroundColor: selectedScenario === key ? `${scenario.color}20` : "#333333",
                  color: selectedScenario === key ? scenario.color : "#9A9080",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {t(scenario.nameKey)}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(scenarios).map(([key, scenario]) => (
              <div
                key={key}
                style={{
                  padding: "20px",
                  backgroundColor: selectedScenario === key ? `${scenario.color}10` : "#333333",
                  border: "1px solid",
                  borderColor: selectedScenario === key ? scenario.color : "#3A3A3A",
                  borderRadius: "12px",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: scenario.color,
                    marginBottom: "12px",
                  }}
                >
                  {t(scenario.nameKey)}
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
                      {t("revenue")}
                    </div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "600" }}>
                      {formatCrores(scenario.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                      {t("roi")}
                    </div>
                    <div style={{ color: scenario.color, fontSize: "14px", fontWeight: "600" }}>
                      {scenario.roi.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                      {t("breakEven")}
                    </div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "600" }}>
                      Week {scenario.breakEvenWeek}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Break-even */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
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
            {t("timeToBreakEven")}
          </h2>

          <div style={{ height: "280px", display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "24px" }}>
            {collectionCurve.map((week, idx) => (
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
                    height: `${(week.collection / maxCollection) * 220}px`,
                    backgroundColor: week.cumulative >= breakEvenPoint ? "#5B8C5A" : "#C4A042",
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.querySelector('div') as HTMLElement;
                    if (tooltip) tooltip.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector('div') as HTMLElement;
                    if (tooltip) tooltip.style.opacity = "0";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-56px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "8px 12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      whiteSpace: "nowrap",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ color: "#E8E0D4", fontSize: "12px", fontWeight: "600" }}>
                      {formatCrores(week.collection)}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "11px" }}>
                      {t("total")}: {formatCrores(week.cumulative)}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                  {week.week}
                </div>
              </div>
            ))}
          </div>

          {/* Break-even achievement */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#5B8C5A20",
              border: "1px solid #5B8C5A",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <LucideIcon name="CheckCircle" size={24} color="#5B8C5A" />
            <div>
              <div style={{ color: "#5B8C5A", fontSize: "15px", fontWeight: "600" }}>
                {t("breakEvenExpectedWeek2")}
              </div>
              <div style={{ color: "#9A9080", fontSize: "13px" }}>
                {t("basedOnExpectedCase")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
