"use client";

import { useState } from "react";
import { campaigns, revenueStreams } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { attributionTranslations } from "@/lib/translations/attribution";

const attributionData = [
  {
    id: 1,
    source: "Trailer Views",
    sourceMetric: "150M views",
    attributedRevenue: 85,
    confidence: 92,
    channel: "YouTube",
  },
  {
    id: 2,
    source: "Social Buzz",
    sourceMetric: "320M reach",
    attributedRevenue: 45,
    confidence: 78,
    channel: "Instagram + X",
  },
  {
    id: 3,
    source: "First Look Campaign",
    sourceMetric: "85M impressions",
    attributedRevenue: 22,
    confidence: 85,
    channel: "Instagram",
  },
  {
    id: 4,
    source: "Song Releases",
    sourceMetric: "120M streams",
    attributedRevenue: 38,
    confidence: 81,
    channel: "Music Platforms",
  },
  {
    id: 5,
    source: "TV Spots",
    sourceMetric: "95M reach",
    attributedRevenue: 28,
    confidence: 72,
    channel: "Television",
  },
  {
    id: 6,
    source: "Teaser Campaign",
    sourceMetric: "150M views",
    attributedRevenue: 65,
    confidence: 88,
    channel: "YouTube",
  },
];

const campaignRevenueMapping = [
  { campaign: "First Look Reveal", spend: 1.8, attributedRevenue: 22, roi: 12.2, bookings: 280000 },
  { campaign: "Teaser Launch", spend: 4.5, attributedRevenue: 65, roi: 14.4, bookings: 820000 },
  { campaign: "Trailer Campaign", spend: 3.2, attributedRevenue: 85, roi: 26.6, bookings: 1200000 },
  { campaign: "Song Promo - Angaaron", spend: 1.5, attributedRevenue: 38, roi: 25.3, bookings: 450000 },
  { campaign: "BTS Content Series", spend: 0.8, attributedRevenue: 18, roi: 22.5, bookings: 220000 },
];

type AttributionModel = "first-touch" | "last-touch" | "linear";

export default function AttributionPage() {
  const { t } = useTranslation(attributionTranslations);
  const [selectedModel, setSelectedModel] = useState<AttributionModel>("linear");

  const totalMarketing = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalAttributedRevenue = attributionData.reduce((sum, a) => sum + a.attributedRevenue, 0);
  const totalROI = totalAttributedRevenue / totalMarketing;
  const totalProjectedRevenue = revenueStreams.reduce((sum, r) => sum + r.projected, 0);
  const attributionPercentage = (totalAttributedRevenue / totalProjectedRevenue) * 100;

  const getModelMultiplier = () => {
    switch (selectedModel) {
      case "first-touch":
        return { firstLook: 1.5, teaser: 1.3, trailer: 0.8, song: 0.7, bts: 0.5 };
      case "last-touch":
        return { firstLook: 0.5, teaser: 0.7, trailer: 1.5, song: 1.2, bts: 1.3 };
      default:
        return { firstLook: 1.0, teaser: 1.0, trailer: 1.0, song: 1.0, bts: 1.0 };
    }
  };

  const adjustedAttributions = attributionData.map((attr) => {
    const multipliers = getModelMultiplier();
    let multiplier = 1.0;

    if (attr.source.includes("First Look")) multiplier = multipliers.firstLook;
    else if (attr.source.includes("Teaser")) multiplier = multipliers.teaser;
    else if (attr.source.includes("Trailer")) multiplier = multipliers.trailer;
    else if (attr.source.includes("Song")) multiplier = multipliers.song;
    else if (attr.source.includes("Social Buzz")) multiplier = multipliers.bts;

    return {
      ...attr,
      attributedRevenue: attr.attributedRevenue * multiplier,
    };
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "#5B8C5A";
    if (confidence >= 75) return "#C4A882";
    return "#C4A042";
  };

  return (
    <div style={{ padding: "32px", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", marginBottom: "8px" }}>
          {t("pageTitle")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("totalMarketingSpend")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalMarketing)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("attributedRevenue")}</div>
          <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "600" }}>{formatCrores(totalAttributedRevenue)}</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("overallROI")}</div>
          <div style={{ color: "#C4A882", fontSize: "28px", fontWeight: "600" }}>{totalROI.toFixed(2)}x</div>
        </div>
        <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("attributionRate")}</div>
          <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>{attributionPercentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Attribution Model Selector */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
          {t("attributionModel")}
        </h3>
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { value: "first-touch", label: t("firstTouch"), description: t("firstTouchDesc") },
            { value: "last-touch", label: t("lastTouch"), description: t("lastTouchDesc") },
            { value: "linear", label: t("linear"), description: t("linearDesc") },
          ].map((model) => (
            <button
              key={model.value}
              onClick={() => setSelectedModel(model.value as AttributionModel)}
              style={{
                flex: 1,
                padding: "16px",
                background: selectedModel === model.value ? "#C4A882" : "#242424",
                border: selectedModel === model.value ? "1px solid #C4A882" : "1px solid #2A2A2A",
                borderRadius: "12px",
                color: selectedModel === model.value ? "#0F0F0F" : "#E8E0D4",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>{model.label}</div>
              <div
                style={{
                  fontSize: "12px",
                  color: selectedModel === model.value ? "#0F0F0F" : "#9A9080",
                  opacity: selectedModel === model.value ? 0.8 : 1,
                }}
              >
                {model.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Attribution Cards */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          {t("revenueAttributionBySource")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {adjustedAttributions.map((attr) => (
            <div
              key={attr.id}
              style={{
                background: "#1A1A1A",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #2A2A2A",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Connection line visual */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0",
                  width: "4px",
                  height: "60%",
                  background: `linear-gradient(180deg, ${getConfidenceColor(attr.confidence)}, transparent)`,
                  transform: "translateY(-50%)",
                  borderRadius: "2px",
                }}
              />

              <div style={{ marginBottom: "16px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "6px" }}>{t("source")}</div>
                <h4 style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                  {attr.source}
                </h4>
                <div style={{ color: "#9A9080", fontSize: "13px" }}>{attr.sourceMetric}</div>
              </div>

              <div
                style={{
                  padding: "12px 0",
                  borderTop: "1px solid #2A2A2A",
                  borderBottom: "1px solid #2A2A2A",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
                  <LucideIcon name="Link" size={16} style={{ color: "#C4A882" }} />
                  <div style={{ color: "#C4A882", fontSize: "14px", fontWeight: "600" }}>{t("attribution")}</div>
                  <LucideIcon name="TrendingUp" size={16} style={{ color: "#C4A882" }} />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "6px" }}>{t("attributedRevenueLabel")}</div>
                <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "700" }}>
                  {formatCrores(attr.attributedRevenue)}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("channel")}</div>
                  <div style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "600" }}>{attr.channel}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("confidence")}</div>
                  <div style={{ color: getConfidenceColor(attr.confidence), fontSize: "16px", fontWeight: "700" }}>
                    {attr.confidence}%
                  </div>
                </div>
              </div>

              <div style={{ width: "100%", height: "6px", background: "#242424", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${attr.confidence}%`,
                    height: "100%",
                    background: getConfidenceColor(attr.confidence),
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign to Revenue Mapping */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("campaignRevenueMapping")}
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                <th style={{ color: "#9A9080", fontSize: "12px", fontWeight: "600", textAlign: "left", padding: "12px 16px" }}>
                  {t("campaign")}
                </th>
                <th style={{ color: "#9A9080", fontSize: "12px", fontWeight: "600", textAlign: "right", padding: "12px 16px" }}>
                  {t("spend")}
                </th>
                <th style={{ color: "#9A9080", fontSize: "12px", fontWeight: "600", textAlign: "right", padding: "12px 16px" }}>
                  {t("attributedRevenue")}
                </th>
                <th style={{ color: "#9A9080", fontSize: "12px", fontWeight: "600", textAlign: "right", padding: "12px 16px" }}>
                  {t("roi")}
                </th>
                <th style={{ color: "#9A9080", fontSize: "12px", fontWeight: "600", textAlign: "right", padding: "12px 16px" }}>
                  {t("estBookings")}
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignRevenueMapping.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #2A2A2A" }}>
                  <td style={{ color: "#E8E0D4", fontSize: "14px", padding: "16px", fontWeight: "500" }}>
                    {item.campaign}
                  </td>
                  <td style={{ color: "#C4A882", fontSize: "14px", padding: "16px", textAlign: "right", fontWeight: "600" }}>
                    {formatCrores(item.spend)}
                  </td>
                  <td style={{ color: "#5B8C5A", fontSize: "14px", padding: "16px", textAlign: "right", fontWeight: "600" }}>
                    {formatCrores(item.attributedRevenue)}
                  </td>
                  <td style={{ color: "#C4A882", fontSize: "14px", padding: "16px", textAlign: "right", fontWeight: "700" }}>
                    {item.roi.toFixed(1)}x
                  </td>
                  <td style={{ color: "#9A9080", fontSize: "14px", padding: "16px", textAlign: "right" }}>
                    {item.bookings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Visual */}
      <div style={{ background: "#1A1A1A", padding: "32px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>
          {t("marketingSpendVsRevenue")}
        </h3>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "48px", height: "300px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "200px" }}>
            <div
              style={{
                width: "100%",
                height: `${(totalMarketing / totalAttributedRevenue) * 300}px`,
                background: "linear-gradient(180deg, #C4A882, #8B7355)",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: "#0F0F0F", fontSize: "24px", fontWeight: "700" }}>
                {formatCrores(totalMarketing)}
              </div>
            </div>
            <div style={{ color: "#C4A882", fontSize: "16px", fontWeight: "600" }}>{t("marketingSpend")}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <LucideIcon name="TrendingUp" size={48} style={{ color: "#5B8C5A", marginBottom: "16px" }} />
            <div style={{ color: "#5B8C5A", fontSize: "32px", fontWeight: "700" }}>
              {totalROI.toFixed(2)}x
            </div>
            <div style={{ color: "#9A9080", fontSize: "14px" }}>ROI</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "200px" }}>
            <div
              style={{
                width: "100%",
                height: "300px",
                background: "linear-gradient(180deg, #5B8C5A, #3D5E3C)",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "700" }}>
                {formatCrores(totalAttributedRevenue)}
              </div>
            </div>
            <div style={{ color: "#5B8C5A", fontSize: "16px", fontWeight: "600" }}>{t("attributedRevenue")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
