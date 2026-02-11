"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { audienceTranslations } from "@/lib/translations/audience";

// Mock sentiment data
const platformSentiment = [
  { platform: "Instagram", score: 91, trend: "up", engagement: 12500000, volume: 85000000 },
  { platform: "YouTube", score: 93, trend: "up", engagement: 45000000, volume: 150000000 },
  { platform: "X (Twitter)", score: 84, trend: "down", engagement: 8500000, volume: 42000000 },
  { platform: "Facebook", score: 87, trend: "up", engagement: 6200000, volume: 38000000 },
];

const regionalSentiment = [
  { region: "Andhra Pradesh", score: 95, volume: 28000000, sentiment: "Excellent" },
  { region: "Telangana", score: 94, volume: 25000000, sentiment: "Excellent" },
  { region: "Karnataka", score: 88, volume: 18000000, sentiment: "Very Good" },
  { region: "Hindi Belt", score: 86, volume: 120000000, sentiment: "Very Good" },
  { region: "Overseas", score: 89, volume: 42000000, sentiment: "Very Good" },
];

const buzzTimeline = [
  { date: "2026-01-15", event: "First Look", sentiment: 92, volume: 12000000 },
  { date: "2026-01-28", event: "Teaser", sentiment: 95, volume: 45000000 },
  { date: "2026-02-05", event: "Song #1", sentiment: 91, volume: 28000000 },
  { date: "2026-02-08", event: "Trailer", sentiment: 88, volume: 45000000 },
  { date: "2026-02-10", event: "BTS Content", sentiment: 87, volume: 12000000 },
];

const topKeywords = [
  { word: "Mass", mentions: 1200000 },
  { word: "Pushpa", mentions: 8500000 },
  { word: "Allu Arjun", mentions: 6200000 },
  { word: "Action", mentions: 950000 },
  { word: "Blockbuster", mentions: 780000 },
  { word: "Sukumar", mentions: 650000 },
  { word: "Rashmika", mentions: 520000 },
  { word: "Music", mentions: 480000 },
  { word: "Stunning", mentions: 420000 },
  { word: "Epic", mentions: 380000 },
  { word: "Anticipation", mentions: 320000 },
  { word: "Hype", mentions: 280000 },
];

const negativeAlerts = [
  { date: "2026-02-09", issue: "Sound mixing concerns in teaser", sentiment: 68, platform: "X (Twitter)", volume: 42000 },
  { date: "2026-02-07", issue: "Release date clash speculation", sentiment: 72, platform: "Multiple", volume: 125000 },
];

export default function AudiencePage() {
  const { t } = useTranslation(audienceTranslations);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const overallScore = 89;
  const totalVolume = platformSentiment.reduce((sum, p) => sum + p.volume, 0);

  const getSentimentColor = (score: number) => {
    if (score >= 90) return "#5B8C5A";
    if (score >= 80) return "#C4A882";
    if (score >= 70) return "#C4A042";
    if (score >= 60) return "#C45C5C";
    return "#8B4545";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 90) return t("excellent");
    if (score >= 80) return t("veryGood");
    if (score >= 70) return t("good");
    if (score >= 60) return t("fair");
    return t("poor");
  };

  return (
    <div style={{ padding: "32px", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", marginBottom: "8px" }}>
          {t("audienceIntelligence")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("audienceDescription")}
        </p>
      </div>

      {/* Overall Sentiment Score */}
      <div style={{ background: "#262626", padding: "32px", borderRadius: "16px", border: "1px solid #3A3A3A", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: `12px solid ${getSentimentColor(overallScore)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#333333",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "64px", fontWeight: "700", color: getSentimentColor(overallScore) }}>
                {overallScore}
              </div>
              <div style={{ fontSize: "14px", color: "#9A9080", marginTop: "4px" }}>
                {getSentimentLabel(overallScore)}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
              {t("overallAudienceSentiment")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("totalReach")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600" }}>
                  {(totalVolume / 1000000).toFixed(0)}M
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("platformsTracked")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600" }}>
                  {platformSentiment.length}
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("positiveSentiment")}</div>
                <div style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "600" }}>
                  82%
                </div>
              </div>
              <div>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("trend")}</div>
                <div style={{ color: "#5B8C5A", fontSize: "24px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <LucideIcon name="TrendingUp" size={20} />
                  +5%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform-wise Sentiment */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          {t("platformWiseSentiment")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {platformSentiment.map((platform) => (
            <div
              key={platform.platform}
              style={{
                background: "#262626",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #3A3A3A",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                    {platform.platform}
                  </h4>
                  <div style={{ color: "#6B6560", fontSize: "12px" }}>
                    {(platform.volume / 1000000).toFixed(1)}M {t("reach")}
                  </div>
                </div>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    border: `4px solid ${getSentimentColor(platform.score)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#333333",
                  }}
                >
                  <span style={{ color: getSentimentColor(platform.score), fontSize: "18px", fontWeight: "700" }}>
                    {platform.score}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("sentimentDistribution")}</span>
                  <span style={{ color: getSentimentColor(platform.score), fontSize: "12px", fontWeight: "600" }}>
                    {getSentimentLabel(platform.score)}
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#333333", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${platform.score}%`,
                      height: "100%",
                      background: getSentimentColor(platform.score),
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LucideIcon
                  name={platform.trend === "up" ? "TrendingUp" : "TrendingDown"}
                  size={16}
                  style={{ color: platform.trend === "up" ? "#5B8C5A" : "#C45C5C" }}
                />
                <span style={{ color: platform.trend === "up" ? "#5B8C5A" : "#C45C5C", fontSize: "13px" }}>
                  {platform.trend === "up" ? t("positiveTrend") : t("needsAttention")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buzz Timeline */}
      <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("buzzTimeline")}
        </h3>
        <div style={{ position: "relative", paddingTop: "20px" }}>
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "0",
              right: "0",
              height: "2px",
              background: "#3A3A3A",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {buzzTimeline.map((item, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                {/* Dot */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: getSentimentColor(item.sentiment),
                    margin: "0 auto 12px",
                    border: "3px solid #262626",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                {/* Score */}
                <div
                  style={{
                    color: getSentimentColor(item.sentiment),
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  {item.sentiment}
                </div>
                {/* Event */}
                <div style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  {item.event}
                </div>
                {/* Date */}
                <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>
                  {new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </div>
                {/* Volume */}
                <div style={{ color: "#9A9080", fontSize: "11px" }}>
                  {(item.volume / 1000000).toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Sentiment & Keywords */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        {/* Regional Sentiment */}
        <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
            {t("regionalSentiment")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {regionalSentiment.map((region) => (
              <div
                key={region.region}
                style={{
                  background: "#333333",
                  padding: "16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: selectedRegion === region.region ? "1px solid #C4A882" : "1px solid transparent",
                }}
                onClick={() => setSelectedRegion(region.region)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <div style={{ color: "#E8E0D4", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
                      {region.region}
                    </div>
                    <div style={{ color: "#6B6560", fontSize: "12px" }}>
                      {(region.volume / 1000000).toFixed(1)}M {t("reach")}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      border: `3px solid ${getSentimentColor(region.score)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#262626",
                    }}
                  >
                    <span style={{ color: getSentimentColor(region.score), fontSize: "16px", fontWeight: "700" }}>
                      {region.score}
                    </span>
                  </div>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#262626", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${region.score}%`,
                      height: "100%",
                      background: getSentimentColor(region.score),
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Keywords */}
        <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
          <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
            {t("trendingKeywords")}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {topKeywords.map((keyword, idx) => {
              const maxMentions = Math.max(...topKeywords.map((k) => k.mentions));
              const size = 12 + (keyword.mentions / maxMentions) * 16;
              const opacity = 0.6 + (keyword.mentions / maxMentions) * 0.4;

              return (
                <div
                  key={idx}
                  style={{
                    padding: "8px 16px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "#C4A882",
                      fontSize: `${size}px`,
                      fontWeight: "600",
                      opacity: opacity,
                    }}
                  >
                    {keyword.word}
                  </span>
                  <span style={{ color: "#6B6560", fontSize: "11px" }}>
                    {keyword.mentions > 1000000
                      ? `${(keyword.mentions / 1000000).toFixed(1)}M`
                      : `${(keyword.mentions / 1000).toFixed(0)}K`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Negative Alerts */}
      {negativeAlerts.length > 0 && (
        <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #C45C5C" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <LucideIcon name="AlertTriangle" size={24} style={{ color: "#C45C5C" }} />
            <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", margin: 0 }}>
              {t("sentimentAlerts")}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {negativeAlerts.map((alert, idx) => (
              <div
                key={idx}
                style={{
                  background: "#333333",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #3A3A3A",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#E8E0D4", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
                      {alert.issue}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "12px" }}>
                      {alert.platform} • {new Date(alert.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {alert.volume.toLocaleString()} {t("mentions")}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: getSentimentColor(alert.sentiment) + "20",
                      color: getSentimentColor(alert.sentiment),
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    {alert.sentiment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
