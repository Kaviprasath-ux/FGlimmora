"use client";

import { useState } from "react";
import { campaigns } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { spendTranslations } from "@/lib/translations/spend";

const platformColors: Record<string, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  x: "#1DA1F2",
  facebook: "#1877F2",
  tv: "#C4A882",
  print: "#5B7C8C",
};

const aiRecommendations = [
  {
    id: 1,
    title: "Increase Instagram Spend by 25%",
    description: "Instagram campaigns showing 15% better engagement rate than average. Reallocate ₹1.2 Cr from TV.",
    impact: "+₹8.5 Cr projected revenue",
    confidence: 87,
    priority: "high",
  },
  {
    id: 2,
    title: "Reduce TV Ad Budget",
    description: "TV campaigns showing diminishing returns. Consider reducing by 20% and shift to digital.",
    impact: "Save ₹3 Cr, minimal revenue impact",
    confidence: 78,
    priority: "medium",
  },
  {
    id: 3,
    title: "Boost YouTube Pre-Roll Ads",
    description: "YouTube showing highest sentiment scores. Increase pre-roll budget for trailer campaign.",
    impact: "+₹12 Cr projected revenue",
    confidence: 92,
    priority: "high",
  },
  {
    id: 4,
    title: "Launch Influencer Partnerships",
    description: "Micro-influencer partnerships showing 3x ROI in test campaigns. Scale up.",
    impact: "+₹6.5 Cr projected revenue",
    confidence: 83,
    priority: "medium",
  },
];

export default function SpendPage() {
  const { t } = useTranslation(spendTranslations);
  const totalBudget = 50;
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const efficiencyScore = 84;

  const [platformAllocations, setPlatformAllocations] = useState({
    instagram: 25,
    youtube: 30,
    x: 15,
    facebook: 10,
    tv: 15,
    print: 5,
  });

  const platformSpend = campaigns.reduce((acc, c) => {
    acc[c.platform] = {
      budget: (acc[c.platform]?.budget || 0) + c.budget,
      spent: (acc[c.platform]?.spent || 0) + c.spent,
      impressions: (acc[c.platform]?.impressions || 0) + c.impressions,
      engagement: (acc[c.platform]?.engagement || 0) + c.engagement,
    };
    return acc;
  }, {} as Record<string, { budget: number; spent: number; impressions: number; engagement: number }>);

  // Add TV and Print mock data
  platformSpend.tv = { budget: 8, spent: 6.5, impressions: 95000000, engagement: 4200000 };
  platformSpend.print = { budget: 3, spent: 2.2, impressions: 15000000, engagement: 850000 };

  const handleAllocationChange = (platform: string, value: number) => {
    const diff = value - platformAllocations[platform as keyof typeof platformAllocations];
    const totalOthers = 100 - value;

    const newAllocations = { ...platformAllocations, [platform]: value };

    // Distribute the difference proportionally among other platforms
    Object.keys(newAllocations).forEach((p) => {
      if (p !== platform) {
        const currentRatio = newAllocations[p as keyof typeof platformAllocations] / (100 - platformAllocations[platform as keyof typeof platformAllocations]);
        newAllocations[p as keyof typeof platformAllocations] = Math.max(0, Math.round(currentRatio * totalOthers));
      }
    });

    setPlatformAllocations(newAllocations);
  };

  const calculateProjectedReach = () => {
    const baseReach = 320000000;
    const allocationFactor = Object.entries(platformAllocations).reduce((sum, [platform, pct]) => {
      const efficiency = platform === "instagram" || platform === "youtube" ? 1.2 : platform === "tv" ? 0.8 : 1.0;
      return sum + (pct / 100) * efficiency;
    }, 0);
    return Math.round(baseReach * allocationFactor);
  };

  return (
    <div style={{ padding: "32px", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", marginBottom: "8px" }}>
          {t("marketingSpendOptimization")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("spendDescription")}
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalBudget")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalBudget)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("spent")}</div>
          <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalSpent)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("remaining")}</div>
          <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "600" }}>{formatCrores(remaining)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("efficiencyScore")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            {efficiencyScore}
            <span style={{ fontSize: "16px", color: "#9A9080" }}>/100</span>
          </div>
        </div>
      </div>

      {/* Spend by Platform */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("spendByPlatform")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {Object.entries(platformSpend).map(([platform, data]) => {
            const spentPct = (data.spent / data.budget) * 100;
            return (
              <div key={platform}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: platformColors[platform] || "#C4A882",
                      }}
                    />
                    <span style={{ color: "#E8E0D4", fontSize: "15px", fontWeight: "600", textTransform: "capitalize" }}>
                      {platform}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "2px" }}>{t("budget")}</div>
                      <div style={{ color: "#C4A882", fontSize: "14px", fontWeight: "600" }}>
                        {formatCrores(data.budget)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "2px" }}>{t("spent")}</div>
                      <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "600" }}>
                        {formatCrores(data.spent)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: "60px" }}>
                      <div style={{ color: "#9A9080", fontSize: "13px", fontWeight: "600" }}>
                        {spentPct.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", height: "10px", background: "#242424", borderRadius: "5px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(spentPct, 100)}%`,
                      height: "100%",
                      background: platformColors[platform] || "#C4A882",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI per Platform */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("roiAndEfficiency")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {Object.entries(platformSpend).map(([platform, data]) => {
            const costPerImpression = data.spent > 0 && data.impressions > 0 ? (data.spent * 10000000) / data.impressions : 0;
            const costPerEngagement = data.spent > 0 && data.engagement > 0 ? (data.spent * 10000000) / data.engagement : 0;
            const engagementRate = data.impressions > 0 ? (data.engagement / data.impressions) * 100 : 0;

            return (
              <div
                key={platform}
                style={{
                  background: "#242424",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #2A2A2A",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "2px",
                      background: platformColors[platform] || "#C4A882",
                    }}
                  />
                  <h4 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", textTransform: "capitalize", margin: 0 }}>
                    {platform}
                  </h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("costPerImpression")}</div>
                    <div style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600" }}>
                      ₹{costPerImpression.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("costPerEngagement")}</div>
                    <div style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600" }}>
                      ₹{costPerEngagement.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("engagementRate")}</div>
                    <div style={{ color: engagementRate > 5 ? "#5B8C5A" : "#C4A042", fontSize: "18px", fontWeight: "600" }}>
                      {engagementRate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #C4A882", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <LucideIcon name="Sparkles" size={24} style={{ color: "#C4A882" }} />
          <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", margin: 0 }}>
            {t("aiRecommendations")}
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: "#242424",
                padding: "20px",
                borderRadius: "12px",
                border: rec.priority === "high" ? "1px solid #C4A882" : "1px solid #2A2A2A",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h4 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", margin: 0, flex: 1 }}>
                  {rec.title}
                </h4>
                <div
                  style={{
                    padding: "4px 8px",
                    background: rec.priority === "high" ? "#C4A88220" : "#C4A04220",
                    color: rec.priority === "high" ? "#C4A882" : "#C4A042",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  {rec.priority}
                </div>
              </div>

              <p style={{ color: "#9A9080", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
                {rec.description}
              </p>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ color: "#5B8C5A", fontSize: "14px", fontWeight: "600" }}>
                  {rec.impact}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ color: "#6B6560", fontSize: "12px" }}>{t("confidence")}:</div>
                <div style={{ flex: 1, height: "6px", background: "#1A1A1A", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${rec.confidence}%`,
                      height: "100%",
                      background: rec.confidence >= 85 ? "#5B8C5A" : "#C4A882",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <div style={{ color: "#E8E0D4", fontSize: "12px", fontWeight: "600" }}>
                  {rec.confidence}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spend Allocation Optimizer */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
          {t("spendAllocationOptimizer")}
        </h3>
        <p style={{ color: "#9A9080", fontSize: "13px", marginBottom: "24px" }}>
          {t("adjustBudgetAllocation")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {Object.entries(platformAllocations).map(([platform, value]) => (
            <div key={platform}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "2px",
                      background: platformColors[platform] || "#C4A882",
                    }}
                  />
                  <span style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "600", textTransform: "capitalize" }}>
                    {platform}
                  </span>
                </div>
                <span style={{ color: "#C4A882", fontSize: "14px", fontWeight: "600" }}>
                  {value}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={value}
                onChange={(e) => handleAllocationChange(platform, parseInt(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, ${platformColors[platform] || "#C4A882"} 0%, ${
                    platformColors[platform] || "#C4A882"
                  } ${value * 2}%, #242424 ${value * 2}%, #242424 100%)`,
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ background: "#242424", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("projectedTotalReach")}</div>
          <div style={{ color: "#C4A882", fontSize: "32px", fontWeight: "700" }}>
            {(calculateProjectedReach() / 1000000).toFixed(0)}M
          </div>
        </div>
      </div>
    </div>
  );
}
