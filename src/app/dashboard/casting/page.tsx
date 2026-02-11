"use client";

import { useState, useMemo } from "react";
import { actors, scenes } from "@/data/mock-data";
import { formatCrores, getInitials } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { Actor } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { castingTranslations } from "@/lib/translations/casting";

export default function CastingPage() {
  const { t } = useTranslation(castingTranslations);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<"fee" | "fanBase" | "overseas">("fee");
  const [filterTier, setFilterTier] = useState<"all" | "A" | "B" | "C">("all");
  const [newActor, setNewActor] = useState({
    name: "",
    fee: 0,
    tier: "B" as "A" | "B" | "C",
    fanBaseScore: 50,
    overseasPull: 50,
    socialFollowing: 0,
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalCast = actors.length;
    const aTier = actors.filter((a) => a.tier === "A").length;
    const bTier = actors.filter((a) => a.tier === "B").length;
    const totalBudget = actors.reduce((sum, a) => sum + a.fee, 0);
    const avgROI = actors.reduce((sum, a) => sum + a.fanBaseScore, 0) / actors.length;
    const avgOverseas = actors.reduce((sum, a) => sum + a.overseasPull, 0) / actors.length;

    return {
      totalCast,
      aTier,
      bTier,
      totalBudget,
      avgROI,
      avgOverseas,
    };
  }, []);

  // Filter and sort actors
  const filteredActors = useMemo(() => {
    let filtered = [...actors];

    if (filterTier !== "all") {
      filtered = filtered.filter((a) => a.tier === filterTier);
    }

    filtered.sort((a, b) => {
      if (sortBy === "fee") return b.fee - a.fee;
      if (sortBy === "fanBase") return b.fanBaseScore - a.fanBaseScore;
      if (sortBy === "overseas") return b.overseasPull - a.overseasPull;
      return 0;
    });

    return filtered;
  }, [filterTier, sortBy]);

  const toggleActorSelection = (id: string) => {
    setSelectedActors((prev) => {
      if (prev.includes(id)) {
        return prev.filter((actorId) => actorId !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const getAvatarGradient = (tier: "A" | "B" | "C") => {
    if (tier === "A") return "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)";
    if (tier === "B") return "linear-gradient(135deg, #5B7C8C 0%, #7B9CAC 100%)";
    return "linear-gradient(135deg, #6B6560 0%, #8B8580 100%)";
  };

  const getTierBadgeColor = (tier: "A" | "B" | "C") => {
    if (tier === "A") return "#C4A882";
    if (tier === "B") return "#5B7C8C";
    return "#6B6560";
  };

  const comparisonActors = useMemo(() => {
    return selectedActors.map((id) => actors.find((a) => a.id === id)!).filter(Boolean);
  }, [selectedActors]);

  // Calculate projected ROI
  const calculateROI = (actor: Actor) => {
    const baseROI = (actor.fanBaseScore + actor.overseasPull) / 2;
    const multiplier = actor.fee > 0 ? (baseROI / actor.fee) * 2 : baseROI;
    return Math.min(multiplier, 100);
  };

  // Cast to scene mapping
  const getCastScenes = (actorName: string) => {
    return scenes.filter((scene) =>
      scene.castNeeded.some((cast) => cast.toLowerCase().includes(actorName.split(" ")[0].toLowerCase()))
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F0F", color: "#E8E0D4", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#E8E0D4", marginBottom: "0.5rem" }}>
          {t("pageTitle")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "0.95rem" }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Users" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("totalCast")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalCast}</div>
        </div>

        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Star" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("aTierStars")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.aTier}</div>
        </div>

        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Users" size={18} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("bTier")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.bTier}</div>
        </div>

        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="IndianRupee" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("castBudget")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalBudget)}
          </div>
        </div>

        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="TrendingUp" size={18} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("avgRoiScore")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
            {stats.avgROI.toFixed(0)}/100
          </div>
        </div>

        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <LucideIcon name="Globe" size={18} style={{ color: "#5B7C8C" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("overseasPull")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
            {stats.avgOverseas.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "0.875rem", color: "#9A9080", marginRight: "0.5rem" }}>{t("filter")}</label>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as any)}
              style={{
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                color: "#E8E0D4",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">{t("allTiers")}</option>
              <option value="A">{t("aTier")}</option>
              <option value="B">{t("bTierOption")}</option>
              <option value="C">{t("cTier")}</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.875rem", color: "#9A9080", marginRight: "0.5rem" }}>{t("sortBy")}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                color: "#E8E0D4",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <option value="fee">{t("feeHighToLow")}</option>
              <option value="fanBase">{t("fanBaseScore")}</option>
              <option value="overseas">{t("overseasPullSort")}</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#C4A882",
            color: "#0F0F0F",
            padding: "0.625rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {t("addActor")}
        </button>
      </div>

      {/* Actor Cards Grid */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#E8E0D4" }}>
          {t("castMembers")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => toggleActorSelection(actor.id)}
              style={{
                background: selectedActors.includes(actor.id) ? "#242424" : "#1A1A1A",
                border: selectedActors.includes(actor.id) ? "2px solid #C4A882" : "1px solid #2A2A2A",
                borderRadius: "1rem",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: getAvatarGradient(actor.tier),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#0F0F0F",
                  }}
                >
                  {getInitials(actor.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "0.25rem" }}>
                    {actor.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        background: getTierBadgeColor(actor.tier) + "22",
                        color: getTierBadgeColor(actor.tier),
                      }}
                    >
                      {actor.tier}-Tier
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#C4A882" }}>
                      {formatCrores(actor.fee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#9A9080" }}>{t("fanBaseScoreLabel")}</span>
                    <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{actor.fanBaseScore}/100</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "#242424", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${actor.fanBaseScore}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#9A9080" }}>{t("overseasPullLabel")}</span>
                    <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{actor.overseasPull}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "#242424", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${actor.overseasPull}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #5B7C8C 0%, #7B9CAC 100%)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                  <LucideIcon name="Users" size={14} style={{ color: "#9A9080" }} />
                  <span style={{ color: "#9A9080" }}>{t("social")}</span>
                  <span style={{ color: "#E8E0D4", fontWeight: "600" }}>
                    {(actor.socialFollowing / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* ROI Indicator */}
              <div
                style={{
                  padding: "0.5rem",
                  background: "#242424",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#9A9080" }}>{t("projectedRoi")} </span>
                <span style={{ color: "#5B8C5A", fontWeight: "700" }}>{calculateROI(actor).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actor Comparison */}
      {comparisonActors.length === 2 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#E8E0D4" }}>
            {t("actorComparison")}
          </h2>
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "1rem",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {comparisonActors.map((actor) => (
                <div key={actor.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: getAvatarGradient(actor.tier),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        color: "#0F0F0F",
                      }}
                    >
                      {getInitials(actor.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4" }}>{actor.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "#C4A882", fontWeight: "600" }}>
                        {formatCrores(actor.fee)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9A9080" }}>{t("fanBase")}</span>
                      <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{actor.fanBaseScore}/100</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9A9080" }}>{t("overseasPullLabel")}</span>
                      <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{actor.overseasPull}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9A9080" }}>{t("socialFollowing")}</span>
                      <span style={{ color: "#E8E0D4", fontWeight: "600" }}>
                        {(actor.socialFollowing / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9A9080" }}>{t("roiScore")}</span>
                      <span style={{ color: "#5B8C5A", fontWeight: "700" }}>{calculateROI(actor).toFixed(0)}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9A9080" }}>{t("scenesLabel")}</span>
                      <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{getCastScenes(actor.name).length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROI Analysis */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#E8E0D4" }}>
          {t("feeVsRoiAnalysis")}
        </h2>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredActors.map((actor) => {
              const roi = calculateROI(actor);
              const maxFee = Math.max(...actors.map((a) => a.fee));
              const feeWidth = (actor.fee / maxFee) * 100;
              const roiWidth = roi;

              return (
                <div key={actor.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#E8E0D4", fontWeight: "600" }}>{actor.name}</span>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      <span style={{ color: "#C4A882" }}>{t("fee")} {formatCrores(actor.fee)}</span>
                      <span style={{ color: "#5B8C5A" }}>{t("roiLabel")} {roi.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div
                      style={{
                        flex: 1,
                        height: "32px",
                        background: "#242424",
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
                          width: `${feeWidth}%`,
                          background: "linear-gradient(90deg, #C4A882 0%, #D4B892 100%)",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "32px",
                        background: "#242424",
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
                          width: `${roiWidth}%`,
                          background: "linear-gradient(90deg, #5B8C5A 0%, #7BAC7A 100%)",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cast-to-Scene Mapping */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#E8E0D4" }}>
          {t("castToSceneMapping")}
        </h2>
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem",
                    borderBottom: "1px solid #2A2A2A",
                    color: "#9A9080",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {t("actor")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "0.75rem",
                    borderBottom: "1px solid #2A2A2A",
                    color: "#9A9080",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {t("totalScenes")}
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.75rem",
                    borderBottom: "1px solid #2A2A2A",
                    color: "#9A9080",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {t("sceneNumbers")}
                </th>
              </tr>
            </thead>
            <tbody>
              {actors.map((actor) => {
                const actorScenes = getCastScenes(actor.name);
                return (
                  <tr key={actor.id}>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #2A2A2A" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: getAvatarGradient(actor.tier),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#0F0F0F",
                          }}
                        >
                          {getInitials(actor.name)}
                        </div>
                        <span style={{ color: "#E8E0D4", fontWeight: "600", fontSize: "0.875rem" }}>
                          {actor.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        borderBottom: "1px solid #2A2A2A",
                        textAlign: "center",
                        color: "#E8E0D4",
                        fontWeight: "700",
                      }}
                    >
                      {actorScenes.length}
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #2A2A2A" }}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {actorScenes.map((scene) => (
                          <span
                            key={scene.id}
                            style={{
                              display: "inline-block",
                              padding: "0.25rem 0.5rem",
                              background: "#242424",
                              borderRadius: "0.25rem",
                              fontSize: "0.75rem",
                              color: "#C4A882",
                              fontWeight: "600",
                            }}
                          >
                            #{scene.sceneNumber}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Actor Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem", color: "#E8E0D4" }}>
              {t("addNewActor")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("name")}
                </label>
                <input
                  type="text"
                  value={newActor.name}
                  onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                  placeholder={t("enterActorName")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("feeCr")}
                </label>
                <input
                  type="number"
                  value={newActor.fee}
                  onChange={(e) => setNewActor({ ...newActor, fee: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                  placeholder="0"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("tier")}
                </label>
                <select
                  value={newActor.tier}
                  onChange={(e) => setNewActor({ ...newActor, tier: e.target.value as "A" | "B" | "C" })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="A">A-Tier</option>
                  <option value="B">B-Tier</option>
                  <option value="C">C-Tier</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("fanBaseScoreSlider")} {newActor.fanBaseScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newActor.fanBaseScore}
                  onChange={(e) => setNewActor({ ...newActor, fanBaseScore: parseInt(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("overseasPullSlider")} {newActor.overseasPull}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newActor.overseasPull}
                  onChange={(e) => setNewActor({ ...newActor, overseasPull: parseInt(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("socialFollowingLabel")}
                </label>
                <input
                  type="number"
                  value={newActor.socialFollowing}
                  onChange={(e) => setNewActor({ ...newActor, socialFollowing: parseInt(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                  placeholder="0"
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    console.log("Adding actor:", newActor);
                    setShowAddModal(false);
                    setNewActor({
                      name: "",
                      fee: 0,
                      tier: "B",
                      fanBaseScore: 50,
                      overseasPull: 50,
                      socialFollowing: 0,
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#C4A882",
                    color: "#0F0F0F",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addActorBtn")}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#242424",
                    color: "#E8E0D4",
                    border: "1px solid #2A2A2A",
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
        </div>
      )}
    </div>
  );
}
