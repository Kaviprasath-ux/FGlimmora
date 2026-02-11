"use client";

import { useState } from "react";
import { campaigns } from "@/data/mock-data";
import { formatCrores, formatDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { campaignsTranslations } from "@/lib/translations/campaigns";

const platformIcons: Record<string, string> = {
  instagram: "Heart",
  youtube: "Film",
  x: "Globe",
  facebook: "Users",
  tiktok: "Sparkles",
};

const platformColors: Record<string, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  x: "#1DA1F2",
  facebook: "#1877F2",
  tiktok: "#000000",
};

const statusColors = {
  active: "#5B8C5A",
  completed: "#5B7C8C",
  planned: "#C4A042",
};

export default function CampaignsPage() {
  const { t } = useTranslation(campaignsTranslations);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    platform: "instagram",
    budget: "",
    region: "",
    startDate: "",
    endDate: "",
  });

  const filteredCampaigns = campaigns.filter((c) => {
    const platformMatch = filterPlatform === "all" || c.platform === filterPlatform;
    const statusMatch = filterStatus === "all" || c.status === filterStatus;
    return platformMatch && statusMatch;
  });

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const plannedCampaigns = campaigns.filter((c) => c.status === "planned").length;
  const completedCampaigns = campaigns.filter((c) => c.status === "completed").length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);

  const platformDistribution = campaigns.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const selectedCampaignData = campaigns.find((c) => c.id === selectedCampaign);

  const getSentimentColor = (score: number) => {
    if (score >= 90) return "#5B8C5A";
    if (score >= 75) return "#C4A882";
    if (score >= 60) return "#C4A042";
    return "#C45C5C";
  };

  const handleAddCampaign = () => {
    console.log("Adding campaign:", newCampaign);
    setShowAddModal(false);
    setNewCampaign({
      name: "",
      platform: "instagram",
      budget: "",
      region: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div style={{ padding: "32px", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("marketingCampaigns")}
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "#C4A882",
              color: "#0F0F0F",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {t("addCampaign")}
          </button>
        </div>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {activeCampaigns} {t("activeCampaignsRunning")}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalCampaigns")}</div>
          <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>{totalCampaigns}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("active")}</div>
          <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "600" }}>{activeCampaigns}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("planned")}</div>
          <div style={{ color: "#C4A042", fontSize: "28px", fontWeight: "600" }}>{plannedCampaigns}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("completed")}</div>
          <div style={{ color: "#5B7C8C", fontSize: "28px", fontWeight: "600" }}>{completedCampaigns}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalBudget")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalBudget)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalSpent")}</div>
          <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalSpent)}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          style={{
            padding: "10px 16px",
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "12px",
            color: "#E8E0D4",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="all">{t("allPlatforms")}</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="x">X (Twitter)</option>
          <option value="facebook">Facebook</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "10px 16px",
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "12px",
            color: "#E8E0D4",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="all">{t("allStatus")}</option>
          <option value="active">{t("active")}</option>
          <option value="planned">{t("planned")}</option>
          <option value="completed">{t("completed")}</option>
        </select>
      </div>

      {/* Platform Distribution */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>
          {t("platformDistribution")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Object.entries(platformDistribution).map(([platform, count]) => (
            <div key={platform}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#E8E0D4", fontSize: "14px", textTransform: "capitalize" }}>{platform}</span>
                <span style={{ color: "#9A9080", fontSize: "14px" }}>{count} {t("campaigns")}</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#242424", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(count / totalCampaigns) * 100}%`,
                    height: "100%",
                    background: platformColors[platform] || "#C4A882",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
        {filteredCampaigns.map((campaign) => {
          const spentPercentage = (campaign.spent / campaign.budget) * 100;
          const engagementRate = campaign.impressions > 0 ? (campaign.engagement / campaign.impressions) * 100 : 0;

          return (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign.id)}
              style={{
                background: "#1A1A1A",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #2A2A2A",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C4A882";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2A2A2A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                    {campaign.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        background: "#242424",
                        borderRadius: "6px",
                      }}
                    >
                      <div style={{ color: platformColors[campaign.platform] }}>
                        <LucideIcon name={platformIcons[campaign.platform]} size={14} />
                      </div>
                      <span style={{ color: "#E8E0D4", fontSize: "12px", textTransform: "capitalize" }}>
                        {campaign.platform}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        background: statusColors[campaign.status as keyof typeof statusColors] + "20",
                        color: statusColors[campaign.status as keyof typeof statusColors],
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {campaign.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Progress */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("budgetUtilization")}</span>
                  <span style={{ color: "#E8E0D4", fontSize: "12px" }}>
                    {formatCrores(campaign.spent)} / {formatCrores(campaign.budget)}
                  </span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#242424", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(spentPercentage, 100)}%`,
                      height: "100%",
                      background: spentPercentage > 90 ? "#C45C5C" : spentPercentage > 70 ? "#C4A042" : "#5B8C5A",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("impressions")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600" }}>
                    {campaign.impressions > 0 ? `${(campaign.impressions / 1000000).toFixed(1)}M` : "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagement")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600" }}>
                    {campaign.engagement > 0 ? `${(campaign.engagement / 1000000).toFixed(1)}M` : "—"}
                  </div>
                </div>
              </div>

              {/* Region and Sentiment */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <LucideIcon name="MapPin" size={14} style={{ color: "#9A9080" }} />
                  <span style={{ color: "#9A9080", fontSize: "13px" }}>{campaign.region}</span>
                </div>
                {campaign.sentimentScore > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#6B6560", fontSize: "12px" }}>{t("sentiment")}</span>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: `3px solid ${getSentimentColor(campaign.sentimentScore)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        background: "#242424",
                      }}
                    >
                      <span style={{ color: getSentimentColor(campaign.sentimentScore), fontSize: "14px", fontWeight: "700" }}>
                        {campaign.sentimentScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaignData && (
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
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>
                  {selectedCampaignData.name}
                </h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: "#242424",
                      borderRadius: "6px",
                      color: platformColors[selectedCampaignData.platform],
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedCampaignData.platform}
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: statusColors[selectedCampaignData.status as keyof typeof statusColors] + "20",
                      color: statusColors[selectedCampaignData.status as keyof typeof statusColors],
                      borderRadius: "6px",
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedCampaignData.status}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
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

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#242424", padding: "20px", borderRadius: "12px" }}>
                <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "12px" }}>{t("budgetAndSpend")}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("budget")}</div>
                    <div style={{ color: "#C4A882", fontSize: "20px", fontWeight: "600" }}>
                      {formatCrores(selectedCampaignData.budget)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("spent")}</div>
                    <div style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600" }}>
                      {formatCrores(selectedCampaignData.spent)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("remainingLabel")}</div>
                    <div style={{ color: "#5B8C5A", fontSize: "20px", fontWeight: "600" }}>
                      {formatCrores(selectedCampaignData.budget - selectedCampaignData.spent)}
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#1A1A1A", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(selectedCampaignData.spent / selectedCampaignData.budget) * 100}%`,
                      height: "100%",
                      background: "#C4A882",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ background: "#242424", padding: "20px", borderRadius: "12px" }}>
                <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "16px" }}>{t("performanceMetrics")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("impressions")}</div>
                    <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600" }}>
                      {selectedCampaignData.impressions > 0
                        ? `${(selectedCampaignData.impressions / 1000000).toFixed(1)}M`
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagement")}</div>
                    <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600" }}>
                      {selectedCampaignData.engagement > 0
                        ? `${(selectedCampaignData.engagement / 1000000).toFixed(1)}M`
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagementRate")}</div>
                    <div style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "600" }}>
                      {selectedCampaignData.impressions > 0
                        ? `${((selectedCampaignData.engagement / selectedCampaignData.impressions) * 100).toFixed(2)}%`
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("sentimentScore")}</div>
                    <div style={{ color: getSentimentColor(selectedCampaignData.sentimentScore), fontSize: "24px", fontWeight: "600" }}>
                      {selectedCampaignData.sentimentScore > 0 ? selectedCampaignData.sentimentScore : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: "#242424", padding: "20px", borderRadius: "12px" }}>
                <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("region")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "16px" }}>{selectedCampaignData.region}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
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
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
              {t("addNewCampaign")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("campaignName")}
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterCampaignName")}
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("platform")}
                </label>
                <select
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
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
                  {t("budgetCr")}
                </label>
                <input
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="5.0"
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("region")}
                </label>
                <input
                  type="text"
                  value={newCampaign.region}
                  onChange={(e) => setNewCampaign({ ...newCampaign, region: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="Pan India"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("startDate")}
                  </label>
                  <input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#242424",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    {t("endDate")}
                  </label>
                  <input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#242424",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleAddCampaign}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#C4A882",
                    border: "none",
                    borderRadius: "8px",
                    color: "#0F0F0F",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addCampaign")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
