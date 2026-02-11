"use client";

import { useState } from "react";
import { formatCrores, formatDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { releaseStrategyTranslations } from "@/lib/translations/release-strategy";

const releaseWindows = [
  {
    id: "sankranti",
    name: "Sankranti 2027",
    date: "2027-01-14",
    pros: ["Festival premium pricing", "Holiday period - high footfall", "Strong Telugu market sentiment"],
    cons: ["High competition (2-3 big releases)", "Increased marketing costs", "Theater availability constraints"],
    projectedRevenue: 761,
    competition: 3,
    sentiment: 88,
  },
  {
    id: "summer",
    name: "Summer 2027",
    date: "2027-05-01",
    pros: ["Longer theatrical run", "Less competition", "Good for pan-India releases"],
    cons: ["No festival premium", "Heat affects footfall in some regions", "Lower initial buzz"],
    projectedRevenue: 685,
    competition: 1,
    sentiment: 82,
  },
  {
    id: "dasara",
    name: "Dasara 2027",
    date: "2027-10-15",
    pros: ["Major festival advantage", "Pan-India holiday", "Premium pricing justified"],
    cons: ["Too far - loses current buzz", "Other major releases likely", "VFX timeline tight"],
    projectedRevenue: 720,
    competition: 2,
    sentiment: 85,
  },
  {
    id: "solo",
    name: "Solo Window (Mar)",
    date: "2027-03-12",
    pros: ["Zero competition", "Can monopolize screens", "Strong word-of-mouth potential"],
    cons: ["No festival boost", "Mid-week release risks", "Requires aggressive marketing"],
    projectedRevenue: 640,
    competition: 0,
    sentiment: 79,
  },
];

const competitors = [
  { name: "Film A (Unnamed Mega Film)", star: "Major Star", budget: 400, threat: "high" },
  { name: "Film B (Sequel)", star: "A-list Hero", budget: 280, threat: "medium" },
  { name: "Film C (Pan-India)", star: "Pan-India Star", budget: 320, threat: "high" },
];

const territorySequence = [
  { territory: "Andhra Pradesh & Telangana", date: "2027-01-14", day: 0, screens: 1200 },
  { territory: "Karnataka", date: "2027-01-14", day: 0, screens: 450 },
  { territory: "Hindi Belt", date: "2027-01-14", day: 0, screens: 2800 },
  { territory: "Tamil Nadu & Kerala", date: "2027-01-14", day: 0, screens: 380 },
  { territory: "USA & Canada", date: "2027-01-13", day: -1, screens: 520 },
  { territory: "Middle East", date: "2027-01-14", day: 0, screens: 180 },
  { territory: "Rest of World", date: "2027-01-15", day: 1, screens: 95 },
];

export default function ReleaseStrategyPage() {
  const { t } = useTranslation(releaseStrategyTranslations);
  const [selectedWindow, setSelectedWindow] = useState("sankranti");
  const [simulatedDate, setSimulatedDate] = useState("2027-01-14");
  const [simulatedRevenue, setSimulatedRevenue] = useState(761);

  const currentPlan = releaseWindows.find((w) => w.id === "sankranti");

  const handleDateChange = (date: string) => {
    setSimulatedDate(date);
    // Simple revenue simulation based on date
    const selectedDate = new Date(date);
    const sankrantiDate = new Date("2027-01-14");
    const daysDiff = Math.abs((selectedDate.getTime() - sankrantiDate.getTime()) / (1000 * 60 * 60 * 24));

    let revenueImpact = 1.0;
    if (daysDiff < 7) {
      revenueImpact = 1.0 - daysDiff * 0.02; // 2% loss per day away from Sankranti
    } else if (daysDiff < 30) {
      revenueImpact = 0.9 - (daysDiff - 7) * 0.01;
    } else {
      revenueImpact = 0.7 - (daysDiff - 30) * 0.005;
    }

    setSimulatedRevenue(Math.round(761 * Math.max(revenueImpact, 0.5)));
  };

  return (
    <div style={{ padding: "32px", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", marginBottom: "8px" }}>
          {t("pageTitle")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Current Release Plan */}
      {currentPlan && (
        <div
          style={{
            background: "#262626",
            padding: "32px",
            borderRadius: "16px",
            border: "2px solid #C4A882",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <LucideIcon name="Calendar" size={24} style={{ color: "#C4A882" }} />
            <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", margin: 0 }}>
              {t("currentReleasePlan")}
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div>
              <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "8px" }}>{t("releaseDate")}</div>
              <div style={{ color: "#C4A882", fontSize: "24px", fontWeight: "700" }}>
                {formatDate(currentPlan.date)}
              </div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>{currentPlan.name}</div>
            </div>
            <div>
              <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "8px" }}>{t("releaseType")}</div>
              <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "700" }}>{t("theatrical")}</div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>{t("panIndiaOverseas")}</div>
            </div>
            <div>
              <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "8px" }}>{t("ottWindow")}</div>
              <div style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "700" }}>45 {t("days")}</div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginTop: "4px" }}>{t("postTheatricalRelease")}</div>
            </div>
          </div>

          <div style={{ background: "#333333", padding: "20px", borderRadius: "12px" }}>
            <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "12px" }}>{t("projectedRevenue")}</div>
            <div style={{ color: "#5B8C5A", fontSize: "36px", fontWeight: "700" }}>
              {formatCrores(currentPlan.projectedRevenue)}
            </div>
          </div>
        </div>
      )}

      {/* Release Window Comparison */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          {t("releaseWindowAnalysis")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {releaseWindows.map((window) => (
            <div
              key={window.id}
              onClick={() => setSelectedWindow(window.id)}
              style={{
                background: "#262626",
                padding: "24px",
                borderRadius: "16px",
                border: selectedWindow === window.id ? "2px solid #C4A882" : "1px solid #3A3A3A",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedWindow !== window.id) {
                  e.currentTarget.style.borderColor = "#4A4A4A";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedWindow !== window.id) {
                  e.currentTarget.style.borderColor = "#3A3A3A";
                }
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                  {window.name}
                </h4>
                <div style={{ color: "#9A9080", fontSize: "13px" }}>{formatDate(window.date)}</div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ color: "#5B8C5A", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                  {formatCrores(window.projectedRevenue)}
                </div>
                <div style={{ color: "#6B6560", fontSize: "12px" }}>{t("projectedRevenue")}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("competition")}</div>
                  <div
                    style={{
                      color: window.competition === 0 ? "#5B8C5A" : window.competition >= 3 ? "#C45C5C" : "#C4A042",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                  >
                    {window.competition} {t("films")}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("sentiment")}</div>
                  <div style={{ color: "#C4A882", fontSize: "18px", fontWeight: "700" }}>{window.sentiment}%</div>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ color: "#5B8C5A", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                  {t("pros")}
                </div>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {window.pros.map((pro, idx) => (
                    <li key={idx} style={{ color: "#9A9080", fontSize: "12px", marginBottom: "4px" }}>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ color: "#C45C5C", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                  {t("cons")}
                </div>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {window.cons.map((con, idx) => (
                    <li key={idx} style={{ color: "#9A9080", fontSize: "12px", marginBottom: "4px" }}>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition Analysis */}
      <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("competitionInSankrantiWindow")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {competitors.map((comp, idx) => (
            <div
              key={idx}
              style={{
                background: "#333333",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #3A3A3A",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                  {comp.name}
                </div>
                <div style={{ color: "#9A9080", fontSize: "13px" }}>
                  {comp.star} • {t("budget")}: {formatCrores(comp.budget)}
                </div>
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  background:
                    comp.threat === "high" ? "#C45C5C20" : comp.threat === "medium" ? "#C4A04220" : "#5B8C5A20",
                  color: comp.threat === "high" ? "#C45C5C" : comp.threat === "medium" ? "#C4A042" : "#5B8C5A",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {comp.threat} {t("threat")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Window Recommendation */}
      <div
        style={{
          background: "#262626",
          padding: "24px",
          borderRadius: "16px",
          border: "2px solid #5B8C5A",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <LucideIcon name="Sparkles" size={24} style={{ color: "#5B8C5A" }} />
          <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", margin: 0 }}>
            {t("aiRecommendation")}
          </h3>
        </div>
        <div style={{ background: "#333333", padding: "20px", borderRadius: "12px" }}>
          <div style={{ color: "#5B8C5A", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            {t("stickWithSankranti")}
          </div>
          <p style={{ color: "#E8E0D4", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
            {t("recommendationText")}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ background: "#262626", padding: "12px 16px", borderRadius: "8px" }}>
              <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("revenueUpside")}</div>
              <div style={{ color: "#5B8C5A", fontSize: "18px", fontWeight: "700" }}>+₹76 Cr</div>
            </div>
            <div style={{ background: "#262626", padding: "12px 16px", borderRadius: "8px" }}>
              <div style={{ color: "#6B6560", fontSize: "11px", marginBottom: "4px" }}>{t("confidence")}</div>
              <div style={{ color: "#C4A882", fontSize: "18px", fontWeight: "700" }}>88%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Territory-wise Release Sequence */}
      <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A", marginBottom: "32px" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("territoryReleaseSequence")}
        </h3>
        <div style={{ position: "relative", paddingTop: "20px", paddingBottom: "20px" }}>
          {/* Timeline */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "40px",
              right: "40px",
              height: "2px",
              background: "#3A3A3A",
              transform: "translateY(-50%)",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {territorySequence.map((item, idx) => {
              const dayOffset = item.day;
              const leftPosition = `${((dayOffset + 1) / 3) * 100}%`;

              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
                  {/* Marker */}
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: dayOffset === 0 ? "#C4A882" : dayOffset < 0 ? "#5B7C8C" : "#5B8C5A",
                      border: "3px solid #262626",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1, background: "#333333", padding: "12px 16px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>
                          {item.territory}
                        </div>
                        <div style={{ color: "#9A9080", fontSize: "12px" }}>
                          {formatDate(item.date)} • Day {item.day >= 0 ? `+${item.day}` : item.day}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#C4A882", fontSize: "16px", fontWeight: "700" }}>
                          {item.screens}
                        </div>
                        <div style={{ color: "#6B6560", fontSize: "11px" }}>{t("screens")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue Impact Simulator */}
      <div style={{ background: "#262626", padding: "24px", borderRadius: "16px", border: "1px solid #3A3A3A" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
          {t("releaseDateSimulator")}
        </h3>
        <p style={{ color: "#9A9080", fontSize: "13px", marginBottom: "20px" }}>
          {t("simulatorDescription")}
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            {t("releaseDate")}
          </label>
          <input
            type="date"
            value={simulatedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#333333",
              border: "1px solid #3A3A3A",
              borderRadius: "8px",
              color: "#E8E0D4",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ background: "#333333", padding: "24px", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ color: "#9A9080", fontSize: "12px", marginBottom: "8px" }}>{t("projectedRevenue")}</div>
          <div style={{ color: "#C4A882", fontSize: "48px", fontWeight: "700", marginBottom: "8px" }}>
            {formatCrores(simulatedRevenue)}
          </div>
          <div
            style={{
              color: simulatedRevenue >= 761 ? "#5B8C5A" : simulatedRevenue >= 700 ? "#C4A042" : "#C45C5C",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {simulatedRevenue >= 761
              ? t("optimalWindow")
              : simulatedRevenue >= 700
              ? t("acceptableWindow")
              : t("suboptimalWindow")}
          </div>
        </div>
      </div>
    </div>
  );
}
