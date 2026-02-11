"use client";

import { useState, useMemo } from "react";
import { revenueStreams } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { RevenueStream } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { revenueTranslations } from "@/lib/translations/revenue";

export default function RevenuePage() {
  const { t } = useTranslation(revenueTranslations);
  const [scenarioMultiplier, setScenarioMultiplier] = useState({
    theatrical: 1,
    ott: 1,
  });

  // Calculate revenue stats
  const stats = useMemo(() => {
    const theatrical = revenueStreams
      .filter((r) => r.type === "theatrical")
      .reduce((sum, r) => sum + r.projected, 0);
    const ott = revenueStreams
      .filter((r) => r.type === "ott")
      .reduce((sum, r) => sum + r.projected, 0);
    const satellite = revenueStreams
      .filter((r) => r.type === "satellite")
      .reduce((sum, r) => sum + r.projected, 0);
    const music = revenueStreams
      .filter((r) => r.type === "music")
      .reduce((sum, r) => sum + r.projected, 0);
    const dubbing = revenueStreams
      .filter((r) => r.type === "dubbing")
      .reduce((sum, r) => sum + r.projected, 0);
    const overseas = revenueStreams
      .filter((r) => r.type === "overseas")
      .reduce((sum, r) => sum + r.projected, 0);
    const total = theatrical + ott + satellite + music + dubbing + overseas;

    return {
      total,
      theatrical,
      ott,
      satellite,
      music,
      dubbing,
      overseas,
    };
  }, []);

  // Group by stream type
  const streamGroups = useMemo(() => {
    const groups: Record<string, RevenueStream[]> = {};
    revenueStreams.forEach((stream) => {
      if (!groups[stream.type]) {
        groups[stream.type] = [];
      }
      groups[stream.type].push(stream);
    });
    return groups;
  }, []);

  const streamColors: Record<string, string> = {
    theatrical: "#C4A882",
    ott: "#5B7C8C",
    satellite: "#8B7355",
    music: "#C4A042",
    dubbing: "#5B8C5A",
    overseas: "#9A9080",
  };

  const streamNames: Record<string, string> = {
    theatrical: t("theatricalStream"),
    ott: t("ottPlatform"),
    satellite: t("satelliteRights"),
    music: t("musicRights"),
    dubbing: t("dubbingRights"),
    overseas: t("overseasStream"),
  };

  // Calculate pie chart percentages
  const pieData = useMemo(() => {
    return [
      { type: "theatrical", value: stats.theatrical, percentage: (stats.theatrical / stats.total) * 100 },
      { type: "ott", value: stats.ott, percentage: (stats.ott / stats.total) * 100 },
      { type: "satellite", value: stats.satellite, percentage: (stats.satellite / stats.total) * 100 },
      { type: "music", value: stats.music, percentage: (stats.music / stats.total) * 100 },
      { type: "dubbing", value: stats.dubbing, percentage: (stats.dubbing / stats.total) * 100 },
      { type: "overseas", value: stats.overseas, percentage: (stats.overseas / stats.total) * 100 },
    ];
  }, [stats]);

  // Create conic gradient for pie chart
  const createConicGradient = () => {
    let currentAngle = 0;
    const gradientStops = pieData.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      currentAngle = end;
      return `${streamColors[item.type]} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${gradientStops.join(", ")})`;
  };

  // Break-even analysis
  const totalBudget = 350; // From project data
  const breakEvenPoint = totalBudget * 0.81; // Considering distributor share

  // Simulate scenario
  const simulatedRevenue = useMemo(() => {
    const theatrical = stats.theatrical * scenarioMultiplier.theatrical;
    const ott = stats.ott * scenarioMultiplier.ott;
    return theatrical + ott + stats.satellite + stats.music + stats.dubbing + stats.overseas;
  }, [scenarioMultiplier, stats]);

  // Weekly timeline (simulated)
  const weeklyRevenue = useMemo(() => {
    const weeks = 12;
    const data = [];
    let cumulative = 0;

    for (let i = 1; i <= weeks; i++) {
      let weekRevenue;
      if (i === 1) weekRevenue = stats.theatrical * 0.4;
      else if (i === 2) weekRevenue = stats.theatrical * 0.25;
      else if (i === 3) weekRevenue = stats.theatrical * 0.15;
      else if (i === 4) weekRevenue = stats.theatrical * 0.1;
      else if (i <= 8) weekRevenue = stats.theatrical * 0.025;
      else weekRevenue = (stats.ott + stats.satellite + stats.music) / 4;

      cumulative += weekRevenue;
      data.push({
        week: i,
        revenue: weekRevenue,
        cumulative,
      });
    }

    return data;
  }, [stats]);

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", color: "#E8E0D4", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", marginBottom: "0.5rem" }}>
              {t("pageTitle")}
            </h1>
            <p style={{ color: "#9A9080", fontSize: "0.95rem" }}>
              {t("pageSubtitle")}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.25rem" }}>
              {t("totalProjectedRevenue")}
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#C4A882" }}>
              {formatCrores(stats.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Film" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("theatrical")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.theatrical)}
          </div>
        </div>

        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Globe" size={18} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("ott")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>{formatCrores(stats.ott)}</div>
        </div>

        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="TrendingUp" size={18} style={{ color: "#8B7355" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("satellite")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.satellite)}
          </div>
        </div>

        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Heart" size={18} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("music")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>{formatCrores(stats.music)}</div>
        </div>

        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Globe" size={18} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("dubbing")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.dubbing)}
          </div>
        </div>

        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="MapPin" size={18} style={{ color: "#9A9080" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("overseas")}</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.overseas)}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown & Pie Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Revenue by Stream */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
            {t("revenueByStreamTerritory")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {Object.entries(streamGroups).map(([type, streams]) => {
              const total = streams.reduce((sum, s) => sum + s.projected, 0);
              const maxRevenue = Math.max(...streams.map((s) => s.projected));

              return (
                <div key={type}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "3px",
                          background: streamColors[type],
                        }}
                      />
                      <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#E8E0D4" }}>
                        {streamNames[type]}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.95rem", fontWeight: "700", color: streamColors[type] }}>
                      {formatCrores(total)}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.5rem" }}>
                    {streams.map((stream) => {
                      const width = (stream.projected / maxRevenue) * 100;
                      return (
                        <div key={stream.id}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.25rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            <span style={{ color: "#9A9080" }}>{stream.territory}</span>
                            <span style={{ color: "#E8E0D4", fontWeight: "600" }}>
                              {formatCrores(stream.projected)}
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "24px",
                              background: "#333333",
                              borderRadius: "0.5rem",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${width}%`,
                                background: `linear-gradient(90deg, ${streamColors[type]} 0%, ${streamColors[type]}CC 100%)`,
                                borderRadius: "0.5rem",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart */}
        <div
          style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
            {t("revenueDistribution")}
          </h2>
          <div
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background: createConicGradient(),
              margin: "0 auto 1.5rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pieData.map((item) => (
              <div key={item.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: streamColors[item.type],
                    }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#E8E0D4" }}>{streamNames[item.type]}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#E8E0D4" }}>
                    {item.percentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9A9080" }}>{formatCrores(item.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("breakEvenAnalysis")}
        </h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("totalBudget")}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#C45C5C" }}>
                  {formatCrores(totalBudget)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#333333",
                  borderRadius: "0.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(totalBudget / stats.total) * 100}%`,
                    background: "linear-gradient(90deg, #C45C5C 0%, #E47C7C 100%)",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("breakEvenPoint")}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#C4A042" }}>
                  {formatCrores(breakEvenPoint)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#333333",
                  borderRadius: "0.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(breakEvenPoint / stats.total) * 100}%`,
                    background: "linear-gradient(90deg, #C4A042 0%, #E4C062 100%)",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("projectedRevenue")}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#5B8C5A" }}>
                  {formatCrores(stats.total)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#333333",
                  borderRadius: "0.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    background: "linear-gradient(90deg, #5B8C5A 0%, #7BAC7A 100%)",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "#333333",
              borderRadius: "1rem",
              textAlign: "center",
              minWidth: "200px",
            }}
          >
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>{t("netProfit")}</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#5B8C5A", marginBottom: "0.5rem" }}>
              {formatCrores(stats.total - totalBudget)}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "1rem" }}>
              {t("roiLabel")} {((stats.total / totalBudget - 1) * 100).toFixed(1)}%
            </div>
            <div
              style={{
                padding: "0.5rem 1rem",
                background: "#5B8C5A33",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                color: "#5B8C5A",
                fontWeight: "600",
              }}
            >
              {t("aboveBreakEven")}
            </div>
          </div>
        </div>
      </div>

      {/* Territory Performance */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#E8E0D4" }}>
          {t("territoryPerformance")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {revenueStreams
            .filter((r) => r.type === "theatrical" || r.type === "overseas")
            .map((stream) => (
              <div
                key={stream.id}
                style={{
                  background: "#262626",
                  border: "1px solid #3A3A3A",
                  borderRadius: "1rem",
                  padding: "1.25rem",
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.25rem" }}>
                    {stream.territory}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#E8E0D4" }}>
                    {formatCrores(stream.projected)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "0.5rem",
                    background: "#333333",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    color: streamColors[stream.type],
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {streamNames[stream.type]}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Scenario Simulator */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("scenarioSimulator")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
              {t("theatricalMultiplier")} {scenarioMultiplier.theatrical.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scenarioMultiplier.theatrical}
              onChange={(e) =>
                setScenarioMultiplier({ ...scenarioMultiplier, theatrical: parseFloat(e.target.value) })
              }
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: "0.875rem", color: "#E8E0D4", marginTop: "0.5rem" }}>
              {formatCrores(stats.theatrical * scenarioMultiplier.theatrical)}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
              {t("ottDealMultiplier")} {scenarioMultiplier.ott.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scenarioMultiplier.ott}
              onChange={(e) => setScenarioMultiplier({ ...scenarioMultiplier, ott: parseFloat(e.target.value) })}
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: "0.875rem", color: "#E8E0D4", marginTop: "0.5rem" }}>
              {formatCrores(stats.ott * scenarioMultiplier.ott)}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "#333333",
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
              {t("simulatedTotalRevenue")}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#C4A882" }}>
              {formatCrores(simulatedRevenue)}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginTop: "0.5rem" }}>
              {t("roiLabel")} {((simulatedRevenue / totalBudget - 1) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Timeline */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("projectedCollectionTimeline")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {weeklyRevenue.map((week) => {
            const maxWeekRevenue = Math.max(...weeklyRevenue.map((w) => w.revenue));
            const width = (week.revenue / maxWeekRevenue) * 100;

            return (
              <div key={week.week}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("week")} {week.week}</span>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#E8E0D4", fontWeight: "600" }}>
                      {formatCrores(week.revenue)}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>
                      {t("cumulative")} {formatCrores(week.cumulative)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "32px",
                    background: "#333333",
                    borderRadius: "0.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${width}%`,
                      background:
                        week.week <= 4
                          ? "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)"
                          : "linear-gradient(90deg, #5B7C8C 0%, #7B9CAC 100%)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "0.75rem",
                    }}
                  >
                    {width > 15 && (
                      <span style={{ fontSize: "0.75rem", color: "#1A1A1A", fontWeight: "700" }}>
                        {week.week <= 4 ? t("theatrical") : t("digital")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
