"use client";

import { useState, useMemo } from "react";
import { distributionTerritories } from "@/data/mock-data";
import { formatCrores, formatDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { distributionTranslations } from "@/lib/translations/distribution";
import type { DistributionTerritory } from "@/lib/types";

export default function DistributionPage() {
  const { t } = useTranslation(distributionTranslations);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    territory: "",
    mgValuation: 0,
    distributor: "",
    status: "negotiating" as "negotiating" | "confirmed" | "released" | "collected",
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalTerritories = distributionTerritories.length;
    const confirmed = distributionTerritories.filter((d) => d.status === "confirmed").length;
    const negotiating = distributionTerritories.filter((d) => d.status === "negotiating").length;
    const totalMG = distributionTerritories.reduce((sum, d) => sum + d.mgValuation, 0);
    const confirmedValue = distributionTerritories
      .filter((d) => d.actualDeal > 0)
      .reduce((sum, d) => sum + d.actualDeal, 0);
    const gap = totalMG - confirmedValue;

    return {
      totalTerritories,
      confirmed,
      negotiating,
      totalMG,
      confirmedValue,
      gap,
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#5B8C5A";
      case "negotiating":
        return "#C4A042";
      case "released":
        return "#5B7C8C";
      case "collected":
        return "#C4A882";
      default:
        return "#6B6560";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return t("confirmed");
      case "negotiating":
        return t("negotiating");
      case "released":
        return t("released");
      case "collected":
        return t("collected");
      default:
        return t("unknown");
    }
  };

  // OTT & Satellite deals
  const digitalDeals = [
    { platform: "Netflix", type: "OTT", value: 65, status: "negotiating" },
    { platform: "Amazon Prime", type: "OTT", value: 55, status: "confirmed" },
    { platform: "Aha", type: "OTT", value: 25, status: "confirmed" },
    { platform: "Star Maa", type: "Satellite", value: 45, status: "confirmed" },
    { platform: "Zee Cinema", type: "Satellite", value: 35, status: "negotiating" },
  ];

  // Negotiation tracker
  const negotiatingDeals = useMemo(() => {
    return distributionTerritories
      .filter((d) => d.status === "negotiating")
      .map((d) => ({
        ...d,
        expectedClose: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: Math.floor(Math.random() * 30) + 1,
      }));
  }, []);

  // India map territories with positions
  const mapTerritories = [
    { name: "AP (Nizam)", x: 60, y: 65, value: 80 },
    { name: "AP (Ceded)", x: 50, y: 70, value: 30 },
    { name: "Telangana", x: 55, y: 60, value: 65 },
    { name: "Karnataka", x: 40, y: 70, value: 25 },
    { name: "Tamil Nadu", x: 50, y: 80, value: 20 },
    { name: "Hindi Belt", x: 40, y: 40, value: 120 },
    { name: "Kerala", x: 35, y: 85, value: 15 },
  ];

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
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
            <LucideIcon name="MapPin" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("totalTerritories")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.totalTerritories}</div>
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
            <LucideIcon name="CheckCircle" size={18} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("confirmedDeals")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.confirmed}</div>
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
            <LucideIcon name="Clock" size={18} style={{ color: "#C4A042" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("negotiating")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{stats.negotiating}</div>
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
            <LucideIcon name="Target" size={18} style={{ color: "#C4A882" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("totalMG")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.totalMG)}
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
            <LucideIcon name="IndianRupee" size={18} style={{ color: "#5B8C5A" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("confirmedValue")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>
            {formatCrores(stats.confirmedValue)}
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
            <LucideIcon name="TrendingUp" size={18} style={{ color: "#C45C5C" }} />
            <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("gap")}</span>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#E8E0D4" }}>{formatCrores(stats.gap)}</div>
        </div>
      </div>

      {/* Territory Cards */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#E8E0D4" }}>{t("territoryDistributionDeals")}</h2>
          <button
            onClick={() => setShowAddDealModal(true)}
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
            {t("addDeal")}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {distributionTerritories.map((territory) => {
            const dealPercentage = territory.actualDeal > 0 ? (territory.actualDeal / territory.mgValuation) * 100 : 0;

            return (
              <div
                key={territory.id}
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "0.25rem" }}>
                      {territory.territory}
                    </h3>
                    <div style={{ fontSize: "0.875rem", color: "#9A9080" }}>{territory.distributor}</div>
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      background: getStatusColor(territory.status) + "22",
                      color: getStatusColor(territory.status),
                      height: "fit-content",
                    }}
                  >
                    {getStatusLabel(territory.status)}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("mgValuation")}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#E8E0D4" }}>
                      {formatCrores(territory.mgValuation)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("actualDeal")}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#C4A882" }}>
                      {territory.actualDeal > 0 ? formatCrores(territory.actualDeal) : t("tbd")}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#9A9080" }}>{t("dealProgress")}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#E8E0D4" }}>
                      {dealPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "#242424",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${dealPercentage}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${getStatusColor(territory.status)} 0%, ${getStatusColor(territory.status)}CC 100%)`,
                      }}
                    />
                  </div>
                </div>

                {territory.actualDeal > 0 && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem",
                      background: "#242424",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      color: territory.actualDeal >= territory.mgValuation ? "#5B8C5A" : "#C45C5C",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {territory.actualDeal >= territory.mgValuation
                      ? `+${formatCrores(territory.actualDeal - territory.mgValuation)} ${t("aboveMG")}`
                      : `${formatCrores(territory.mgValuation - territory.actualDeal)} ${t("belowMG")}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal Progress Overview */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("overallDealProgress")}
        </h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("targetMGValuation")}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#E8E0D4" }}>
                  {formatCrores(stats.totalMG)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
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
                    width: "100%",
                    background: "linear-gradient(90deg, #3A3A3A 0%, #2A2A2A 100%)",
                    borderRadius: "0.5rem",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#9A9080" }}>{t("confirmedValue")}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#5B8C5A" }}>
                  {formatCrores(stats.confirmedValue)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
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
                    width: `${(stats.confirmedValue / stats.totalMG) * 100}%`,
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
              background: "#242424",
              borderRadius: "1rem",
              textAlign: "center",
              minWidth: "200px",
            }}
          >
            <div style={{ fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>{t("progress")}</div>
            <div style={{ fontSize: "3rem", fontWeight: "700", color: "#C4A882", marginBottom: "0.5rem" }}>
              {((stats.confirmedValue / stats.totalMG) * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: "0.875rem", color: "#9A9080" }}>
              {stats.confirmed} / {stats.totalTerritories} {t("confirmed")}
            </div>
          </div>
        </div>
      </div>

      {/* Territory Map Visual */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("indiaTerritoryMap")}
        </h2>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            background: "#242424",
            borderRadius: "1rem",
            border: "2px dashed #2A2A2A",
          }}
        >
          {/* Simplified India shape outline */}
          <div
            style={{
              position: "absolute",
              left: "20%",
              top: "10%",
              width: "60%",
              height: "80%",
              border: "3px solid #3A3A3A",
              borderRadius: "20% 20% 10% 10%",
            }}
          />

          {/* Territory markers */}
          {mapTerritories.map((territory, idx) => {
            const size = Math.max(30, (territory.value / 120) * 80);
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${territory.x}%`,
                  top: `${territory.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #C4A882 0%, #C4A88244 100%)",
                    border: "2px solid #C4A882",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#E8E0D4",
                    position: "relative",
                  }}
                >
                  {formatCrores(territory.value)}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "0.5rem",
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem",
                    color: "#9A9080",
                    fontWeight: "600",
                  }}
                >
                  {territory.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OTT & Satellite Deals */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* OTT Deals */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
            {t("ottPlatformDeals")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {digitalDeals
              .filter((d) => d.type === "OTT")
              .map((deal, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    background: "#242424",
                    borderRadius: "0.75rem",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "0.25rem" }}>
                        {deal.platform}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9A9080" }}>{t("streamingRights")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#C4A882" }}>
                        {formatCrores(deal.value)}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          background: getStatusColor(deal.status) + "22",
                          color: getStatusColor(deal.status),
                        }}
                      >
                        {getStatusLabel(deal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Satellite Deals */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
            {t("satelliteRights")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {digitalDeals
              .filter((d) => d.type === "Satellite")
              .map((deal, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    background: "#242424",
                    borderRadius: "0.75rem",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: "600", color: "#E8E0D4", marginBottom: "0.25rem" }}>
                        {deal.platform}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9A9080" }}>{t("tvBroadcastRights")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#C4A882" }}>
                        {formatCrores(deal.value)}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          background: getStatusColor(deal.status) + "22",
                          color: getStatusColor(deal.status),
                        }}
                      >
                        {getStatusLabel(deal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Negotiation Tracker */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "#E8E0D4" }}>
          {t("activeNegotiations")}
        </h2>
        <div style={{ overflowX: "auto" }}>
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
                  {t("territory")}
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
                  {t("distributor")}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.75rem",
                    borderBottom: "1px solid #2A2A2A",
                    color: "#9A9080",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {t("mgValuation")}
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
                  {t("expectedClose")}
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
                  {t("daysRemaining")}
                </th>
              </tr>
            </thead>
            <tbody>
              {negotiatingDeals.map((deal) => (
                <tr key={deal.id}>
                  <td style={{ padding: "1rem 0.75rem", borderBottom: "1px solid #2A2A2A" }}>
                    <span style={{ color: "#E8E0D4", fontWeight: "600", fontSize: "0.875rem" }}>
                      {deal.territory}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", borderBottom: "1px solid #2A2A2A" }}>
                    <span style={{ color: "#9A9080", fontSize: "0.875rem" }}>{deal.distributor}</span>
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      borderBottom: "1px solid #2A2A2A",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "#C4A882", fontWeight: "700", fontSize: "0.875rem" }}>
                      {formatCrores(deal.mgValuation)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      borderBottom: "1px solid #2A2A2A",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ color: "#E8E0D4", fontSize: "0.875rem" }}>{formatDate(deal.expectedClose)}</span>
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      borderBottom: "1px solid #2A2A2A",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        background: deal.daysRemaining <= 7 ? "#C45C5C22" : "#C4A04222",
                        color: deal.daysRemaining <= 7 ? "#C45C5C" : "#C4A042",
                      }}
                    >
                      {deal.daysRemaining} {t("days")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDealModal && (
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
          onClick={() => setShowAddDealModal(false)}
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
              {t("addTerritoryDeal")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("territory")}
                </label>
                <input
                  type="text"
                  value={newDeal.territory}
                  onChange={(e) => setNewDeal({ ...newDeal, territory: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                  placeholder={t("enterTerritoryName")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("mgValuationLabel")}
                </label>
                <input
                  type="number"
                  value={newDeal.mgValuation}
                  onChange={(e) => setNewDeal({ ...newDeal, mgValuation: parseFloat(e.target.value) || 0 })}
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
                  {t("distributor")}
                </label>
                <input
                  type="text"
                  value={newDeal.distributor}
                  onChange={(e) => setNewDeal({ ...newDeal, distributor: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "0.5rem",
                    color: "#E8E0D4",
                    fontSize: "0.875rem",
                  }}
                  placeholder={t("enterDistributorName")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#9A9080", marginBottom: "0.5rem" }}>
                  {t("status")}
                </label>
                <select
                  value={newDeal.status}
                  onChange={(e) =>
                    setNewDeal({
                      ...newDeal,
                      status: e.target.value as "negotiating" | "confirmed" | "released" | "collected",
                    })
                  }
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
                  <option value="negotiating">{t("negotiating")}</option>
                  <option value="confirmed">{t("confirmed")}</option>
                  <option value="released">{t("released")}</option>
                  <option value="collected">{t("collected")}</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    console.log("Adding deal:", newDeal);
                    setShowAddDealModal(false);
                    setNewDeal({
                      territory: "",
                      mgValuation: 0,
                      distributor: "",
                      status: "negotiating",
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
                  {t("addDeal")}
                </button>
                <button
                  onClick={() => setShowAddDealModal(false)}
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
