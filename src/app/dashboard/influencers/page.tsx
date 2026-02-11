"use client";

import { useState } from "react";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { influencersTranslations } from "@/lib/translations/influencers";

const influencers = [
  {
    id: 1,
    name: "Telugu Cinema Hub",
    platform: "youtube",
    tier: "mega",
    followers: 2800000,
    engagementRate: 8.5,
    cost: 0.8,
    roi: 15.2,
    assignedCampaigns: ["Trailer Campaign", "BTS Content"],
    engagement: 4200000,
    revenueImpact: 12,
  },
  {
    id: 2,
    name: "Tollywood Updates",
    platform: "instagram",
    tier: "mega",
    followers: 1500000,
    engagementRate: 12.3,
    cost: 0.5,
    roi: 18.6,
    assignedCampaigns: ["Song Promo"],
    engagement: 2850000,
    revenueImpact: 9.3,
  },
  {
    id: 3,
    name: "FilmyFever",
    platform: "youtube",
    tier: "macro",
    followers: 850000,
    engagementRate: 9.8,
    cost: 0.3,
    roi: 22.4,
    assignedCampaigns: ["First Look"],
    engagement: 1200000,
    revenueImpact: 6.7,
  },
  {
    id: 4,
    name: "CineReview Telugu",
    platform: "instagram",
    tier: "macro",
    followers: 620000,
    engagementRate: 11.2,
    cost: 0.25,
    roi: 19.8,
    assignedCampaigns: ["Teaser"],
    engagement: 980000,
    revenueImpact: 5.0,
  },
  {
    id: 5,
    name: "MasalaMovies",
    platform: "x",
    tier: "macro",
    followers: 450000,
    engagementRate: 7.5,
    cost: 0.15,
    roi: 16.3,
    assignedCampaigns: ["Trailer Campaign"],
    engagement: 520000,
    revenueImpact: 2.4,
  },
  {
    id: 6,
    name: "HyderabadFilmReview",
    platform: "instagram",
    tier: "micro",
    followers: 95000,
    engagementRate: 15.8,
    cost: 0.08,
    roi: 28.5,
    assignedCampaigns: ["BTS Content"],
    engagement: 185000,
    revenueImpact: 2.3,
  },
  {
    id: 7,
    name: "TeluguCinemaVibes",
    platform: "youtube",
    tier: "micro",
    followers: 72000,
    engagementRate: 13.2,
    cost: 0.05,
    roi: 24.8,
    assignedCampaigns: ["Song Promo"],
    engagement: 128000,
    revenueImpact: 1.2,
  },
  {
    id: 8,
    name: "MovieBuffTelugu",
    platform: "instagram",
    tier: "micro",
    followers: 48000,
    engagementRate: 18.5,
    cost: 0.04,
    roi: 32.0,
    assignedCampaigns: ["First Look"],
    engagement: 95000,
    revenueImpact: 1.3,
  },
];

const platformColors: Record<string, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  x: "#1DA1F2",
  facebook: "#1877F2",
};

const tierColors = {
  mega: "#C4A882",
  macro: "#5B7C8C",
  micro: "#5B8C5A",
};

export default function InfluencersPage() {
  const { t } = useTranslation(influencersTranslations);
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<number | null>(null);

  const [newInfluencer, setNewInfluencer] = useState({
    name: "",
    platform: "instagram",
    tier: "micro",
    followers: "",
    engagementRate: "",
    cost: "",
  });

  const filteredInfluencers = influencers.filter((inf) => {
    if (selectedTier === "all") return true;
    return inf.tier === selectedTier;
  });

  const totalSpend = influencers.reduce((sum, inf) => sum + inf.cost, 0);
  const totalRevenueImpact = influencers.reduce((sum, inf) => sum + inf.revenueImpact, 0);
  const avgROI = influencers.reduce((sum, inf) => sum + inf.roi, 0) / influencers.length;

  const topPerformers = [...influencers].sort((a, b) => b.roi - a.roi).slice(0, 5);

  const handleAddInfluencer = () => {
    console.log("Adding influencer:", newInfluencer);
    setShowAddModal(false);
    setNewInfluencer({
      name: "",
      platform: "instagram",
      tier: "micro",
      followers: "",
      engagementRate: "",
      cost: "",
    });
  };

  const selectedInfluencerData = influencers.find((inf) => inf.id === selectedInfluencer);

  return (
    <div style={{ padding: "32px", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "#C4A882",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {t("addInfluencer")}
          </button>
        </div>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#262626", padding: "20px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalInfluencers")}</div>
          <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>{influencers.length}</div>
        </div>
        <div style={{ background: "#262626", padding: "20px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalSpend")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalSpend)}</div>
        </div>
        <div style={{ background: "#262626", padding: "20px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("revenueImpact")}</div>
          <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalRevenueImpact)}</div>
        </div>
        <div style={{ background: "#262626", padding: "20px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("avgROI")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{avgROI.toFixed(1)}x</div>
        </div>
      </div>

      {/* Tier Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {[
          { value: "all", label: t("allTiers") },
          { value: "mega", label: t("megaTier") },
          { value: "macro", label: t("macroTier") },
          { value: "micro", label: t("microTier") },
        ].map((tier) => (
          <button
            key={tier.value}
            onClick={() => setSelectedTier(tier.value)}
            style={{
              padding: "10px 20px",
              background: selectedTier === tier.value ? "#C4A882" : "#262626",
              border: selectedTier === tier.value ? "1px solid #C4A882" : "1px solid #3A3A3A",
              borderRadius: "12px",
              color: selectedTier === tier.value ? "#1A1A1A" : "#E8E0D4",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Influencer Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {filteredInfluencers.map((influencer) => (
          <div
            key={influencer.id}
            onClick={() => setSelectedInfluencer(influencer.id)}
            style={{
              background: "#262626",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #3A3A3A",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C4A882";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#3A3A3A";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                  {influencer.name}
                </h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: "#333333",
                      borderRadius: "6px",
                      color: platformColors[influencer.platform],
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {influencer.platform}
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: tierColors[influencer.tier as keyof typeof tierColors] + "20",
                      color: tierColors[influencer.tier as keyof typeof tierColors],
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {influencer.tier}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("followers")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600" }}>
                  {influencer.followers >= 1000000
                    ? `${(influencer.followers / 1000000).toFixed(1)}M`
                    : `${(influencer.followers / 1000).toFixed(0)}K`}
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagementRate")}</div>
                <div style={{ color: "#5B8C5A", fontSize: "16px", fontWeight: "600" }}>
                  {influencer.engagementRate}%
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("cost")}</div>
                <div style={{ color: "#C4A882", fontSize: "16px", fontWeight: "600" }}>
                  {formatCrores(influencer.cost)}
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("roi")}</div>
                <div style={{ color: "#C4A882", fontSize: "16px", fontWeight: "700" }}>
                  {influencer.roi.toFixed(1)}x
                </div>
              </div>
            </div>

            {/* ROI Bar */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("performance")}</span>
                <span style={{ color: "#C4A882", fontSize: "12px", fontWeight: "600" }}>
                  {influencer.roi >= 25 ? t("excellent") : influencer.roi >= 18 ? t("good") : t("average")}
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#333333", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min((influencer.roi / 35) * 100, 100)}%`,
                    height: "100%",
                    background:
                      influencer.roi >= 25 ? "#5B8C5A" : influencer.roi >= 18 ? "#C4A882" : "#C4A042",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>

            {/* Assigned Campaigns */}
            <div>
              <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "6px" }}>{t("assignedCampaigns")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {influencer.assignedCampaigns.map((campaign, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "4px 10px",
                      background: "#333333",
                      borderRadius: "6px",
                      color: "#9A9080",
                      fontSize: "11px",
                    }}
                  >
                    {campaign}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #C4A882" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <LucideIcon name="Star" size={24} style={{ color: "#C4A882" }} />
          <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", margin: 0 }}>
            {t("topPerformers")}
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {topPerformers.map((influencer, idx) => (
            <div
              key={influencer.id}
              style={{
                background: "#333333",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #3A3A3A",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: idx === 0 ? "#C4A882" : idx === 1 ? "#5B7C8C" : idx === 2 ? "#5B8C5A" : "#333333",
                  border: idx >= 3 ? "2px solid #3A3A3A" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: idx < 3 ? "#1A1A1A" : "#9A9080",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                {idx + 1}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                  {influencer.name}
                </div>
                <div style={{ color: "#9A9080", fontSize: "12px" }}>
                  {influencer.followers >= 1000000
                    ? `${(influencer.followers / 1000000).toFixed(1)}M`
                    : `${(influencer.followers / 1000).toFixed(0)}K`}{" "}
                  {t("followers")} • {influencer.platform}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "2px" }}>{t("roi")}</div>
                  <div style={{ color: "#C4A882", fontSize: "18px", fontWeight: "700" }}>
                    {influencer.roi.toFixed(1)}x
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "2px" }}>{t("revenueImpact")}</div>
                  <div style={{ color: "#5B8C5A", fontSize: "18px", fontWeight: "700" }}>
                    {formatCrores(influencer.revenueImpact)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "2px" }}>{t("engagement")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "700" }}>
                    {influencer.engagement >= 1000000
                      ? `${(influencer.engagement / 1000000).toFixed(1)}M`
                      : `${(influencer.engagement / 1000).toFixed(0)}K`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Influencer Detail Modal */}
      {selectedInfluencerData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedInfluencer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>
                  {selectedInfluencerData.name}
                </h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: "#333333",
                      borderRadius: "6px",
                      color: platformColors[selectedInfluencerData.platform],
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedInfluencerData.platform}
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: tierColors[selectedInfluencerData.tier as keyof typeof tierColors] + "20",
                      color: tierColors[selectedInfluencerData.tier as keyof typeof tierColors],
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedInfluencerData.tier}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfluencer(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9A9080",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "0",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ background: "#333333", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("followers")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "700" }}>
                  {selectedInfluencerData.followers.toLocaleString()}
                </div>
              </div>
              <div style={{ background: "#333333", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagementRate")}</div>
                <div style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "700" }}>
                  {selectedInfluencerData.engagementRate}%
                </div>
              </div>
              <div style={{ background: "#333333", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("cost")}</div>
                <div style={{ color: "#C4A882", fontSize: "24px", fontWeight: "700" }}>
                  {formatCrores(selectedInfluencerData.cost)}
                </div>
              </div>
              <div style={{ background: "#333333", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("roi")}</div>
                <div style={{ color: "#C4A882", fontSize: "24px", fontWeight: "700" }}>
                  {selectedInfluencerData.roi.toFixed(1)}x
                </div>
              </div>
            </div>

            <div style={{ background: "#333333", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
              <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "12px" }}>{t("performance")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("totalEngagement")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600" }}>
                    {(selectedInfluencerData.engagement / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("revenueImpact")}</div>
                  <div style={{ color: "#5B8C5A", fontSize: "20px", fontWeight: "600" }}>
                    {formatCrores(selectedInfluencerData.revenueImpact)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "12px" }}>{t("assignedCampaigns")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedInfluencerData.assignedCampaigns.map((campaign, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 16px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "13px",
                    }}
                  >
                    {campaign}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Influencer Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
              {t("addNewInfluencer")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("influencerName")}
                </label>
                <input
                  type="text"
                  value={newInfluencer.name}
                  onChange={(e) => setNewInfluencer({ ...newInfluencer, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterName")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("platform")}
                  </label>
                  <select
                    value={newInfluencer.platform}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, platform: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="x">X (Twitter)</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("tier")}
                  </label>
                  <select
                    value={newInfluencer.tier}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, tier: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="mega">Mega (1M+)</option>
                    <option value="macro">Macro (100K-1M)</option>
                    <option value="micro">Micro (10K-100K)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("followers")}
                </label>
                <input
                  type="number"
                  value={newInfluencer.followers}
                  onChange={(e) => setNewInfluencer({ ...newInfluencer, followers: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="500000"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("engagementRatePercent")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newInfluencer.engagementRate}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, engagementRate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder="8.5"
                  />
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("costLakhs")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInfluencer.cost}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, cost: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder="0.5"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("cancelBtn")}
                </button>
                <button
                  onClick={handleAddInfluencer}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#C4A882",
                    border: "none",
                    borderRadius: "8px",
                    color: "#1A1A1A",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addInfluencerBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
