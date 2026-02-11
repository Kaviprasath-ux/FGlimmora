"use client";

import { useState } from "react";
import { shootingSchedule, scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { locationsTranslations } from "@/lib/translations/locations";

interface Location {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  city: string;
  dailyCost: number;
  weatherRisk: "low" | "medium" | "high";
  usageCount: number;
  totalScenes: number;
  shootDays: string[];
}

export default function LocationsPage() {
  const { t } = useTranslation(locationsTranslations);
  // Extract unique locations from scenes
  const extractLocations = (): Location[] => {
    const locationMap = new Map<string, Location>();

    scenes.forEach(scene => {
      const existingLocation = locationMap.get(scene.location);
      const shootDaysForLocation = shootingSchedule
        .filter(day => day.location === scene.location)
        .map(day => day.date);

      const isOutdoor = scene.location.toLowerCase().includes("outdoor") ||
        scene.location.toLowerCase().includes("forest") ||
        scene.location.toLowerCase().includes("highway") ||
        scene.location.toLowerCase().includes("switzerland") ||
        scene.location.toLowerCase().includes("port") ||
        scene.location.toLowerCase().includes("shipyard");

      const weatherRisk: "low" | "medium" | "high" = isOutdoor
        ? (scene.location.toLowerCase().includes("switzerland") ? "high" : "medium")
        : "low";

      if (existingLocation) {
        existingLocation.usageCount += shootDaysForLocation.length;
        existingLocation.totalScenes += 1;
        existingLocation.shootDays = Array.from(new Set([...existingLocation.shootDays, ...shootDaysForLocation]));
      } else {
        locationMap.set(scene.location, {
          id: `loc_${locationMap.size + 1}`,
          name: scene.location,
          type: isOutdoor ? "outdoor" : "indoor",
          city: scene.location.includes("Switzerland") ? "Switzerland" : "Hyderabad",
          dailyCost: isOutdoor ? 0.8 : 0.5,
          weatherRisk,
          usageCount: shootDaysForLocation.length,
          totalScenes: 1,
          shootDays: shootDaysForLocation,
        });
      }
    });

    return Array.from(locationMap.values());
  };

  const [locations, setLocations] = useState<Location[]>(extractLocations());
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "indoor" as "indoor" | "outdoor",
    city: "",
    dailyCost: 0.5,
    weatherRisk: "low" as "low" | "medium" | "high",
  });

  const totalLocations = locations.length;
  const totalCost = locations.reduce((sum, loc) => sum + (loc.dailyCost * loc.usageCount), 0);
  const mostUsedLocation = locations.reduce((max, loc) => loc.usageCount > max.usageCount ? loc : max, locations[0]);
  const leastUsedLocation = locations.reduce((min, loc) => loc.usageCount < min.usageCount ? loc : min, locations[0]);

  const addLocation = () => {
    if (!newLocation.name.trim() || !newLocation.city.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const location: Location = {
      id: `loc_${locations.length + 1}`,
      name: newLocation.name,
      type: newLocation.type,
      city: newLocation.city,
      dailyCost: newLocation.dailyCost,
      weatherRisk: newLocation.weatherRisk,
      usageCount: 0,
      totalScenes: 0,
      shootDays: [],
    };

    setLocations(prev => [...prev, location]);
    setNewLocation({ name: "", type: "indoor", city: "", dailyCost: 0.5, weatherRisk: "low" });
    setShowAddModal(false);
  };

  const getTypeColor = (type: string) => {
    return type === "outdoor" ? { bg: "#5B7C8C22", color: "#5B7C8C" } : { bg: "#C4A88222", color: "#C4A882" };
  };

  const getWeatherRiskColor = (risk: string) => {
    if (risk === "high") return { bg: "#C45C5C22", color: "#C45C5C" };
    if (risk === "medium") return { bg: "#C4A04222", color: "#C4A042" };
    return { bg: "#5B8C5A22", color: "#5B8C5A" };
  };

  const maxUsage = Math.max(...locations.map(l => l.usageCount), 1);

  return (
    <div style={{ padding: "32px", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4", letterSpacing: "-0.02em" }}>
            {t("pageTitle")}
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#1A1A1A",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LucideIcon name="MapPin" size={16} />
            {t("addLocation")}
          </button>
        </div>
        <p style={{ fontSize: "15px", color: "#9A9080" }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="MapPin" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalLocations")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{totalLocations}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="IndianRupee" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalLocationCost")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#C4A882" }}>{formatCrores(totalCost)}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Building" size={24} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("indoorLocations")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>
                {locations.filter(l => l.type === "indoor").length}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Sparkles" size={24} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("outdoorLocations")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>
                {locations.filter(l => l.type === "outdoor").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {locations.map((location) => {
          const typeColors = getTypeColor(location.type);
          const weatherColors = getWeatherRiskColor(location.weatherRisk);

          return (
            <div
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C4A882";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3A3A3A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                <div style={{
                  minWidth: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <LucideIcon name="MapPin" size={24} color="#1A1A1A" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                    {location.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#9A9080" }}>{location.city}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: typeColors.bg,
                  color: typeColors.color,
                  textTransform: "capitalize",
                }}>
                  {location.type}
                </span>

                {location.type === "outdoor" && (
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    background: weatherColors.bg,
                    color: weatherColors.color,
                    textTransform: "capitalize",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    <LucideIcon name="AlertTriangle" size={12} />
                    {location.weatherRisk} {t("risk")}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("usageCount")}</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#C4A882" }}>{location.usageCount} {t("days")}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("totalScenes")}</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#E8E0D4" }}>{location.totalScenes}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("dailyCost")}</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#C4A882" }}>
                  {formatCrores(location.dailyCost)} {t("perDay")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Cost Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="BarChart3" size={24} color="#C4A882" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("costPerLocation")}</h3>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {locations.map(location => {
              const totalLocationCost = location.dailyCost * location.usageCount;
              return (
                <div key={location.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#9A9080" }}>{location.name}</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#C4A882" }}>
                      {formatCrores(totalLocationCost)}
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#1A1A1A",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${(totalLocationCost / totalCost) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #C4A882 0%, #8C7A62 100%)",
                      borderRadius: "3px",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Utilization */}
        <div style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="TrendingUp" size={24} color="#5B7C8C" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("locationUtilization")}</h3>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{
              padding: "16px",
              background: "#5B8C5A11",
              border: "1px solid #5B8C5A",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "12px", color: "#5B8C5A", marginBottom: "8px", fontWeight: "600" }}>{t("mostUsed")}</div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                {mostUsedLocation?.name}
              </div>
              <div style={{ fontSize: "14px", color: "#9A9080" }}>
                {mostUsedLocation?.usageCount} {t("days")} · {mostUsedLocation?.totalScenes} {t("scenes")}
              </div>
            </div>

            <div style={{
              padding: "16px",
              background: "#C4A04211",
              border: "1px solid #C4A042",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "12px", color: "#C4A042", marginBottom: "8px", fontWeight: "600" }}>{t("leastUsed")}</div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                {leastUsedLocation?.name}
              </div>
              <div style={{ fontSize: "14px", color: "#9A9080" }}>
                {leastUsedLocation?.usageCount} {t("days")} · {leastUsedLocation?.totalScenes} {t("scenes")}
              </div>
            </div>

            <div style={{
              padding: "16px",
              background: "#1A1A1A",
              border: "1px solid #3A3A3A",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "8px" }}>{t("utilizationInsight")}</div>
              <div style={{ fontSize: "13px", color: "#9A9080", lineHeight: "1.6" }}>
                {locations.filter(l => l.type === "outdoor").length > 0
                  ? t("outdoorWeatherWarning")
                  : t("allIndoorNote")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div style={{
        background: "#262626",
        border: "1px solid #3A3A3A",
        borderRadius: "16px",
        padding: "24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LucideIcon name="Globe" size={24} color="#5B7C8C" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("locationMap")}</h3>
        </div>

        <div style={{
          width: "100%",
          height: "400px",
          background: "#1A1A1A",
          border: "2px solid #3A3A3A",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <LucideIcon name="MapPin" size={64} color="#4A4A4A" />

          {/* Location pins (positioned divs) */}
          {locations.slice(0, 5).map((location, idx) => (
            <div
              key={location.id}
              style={{
                position: "absolute",
                left: `${20 + idx * 15}%`,
                top: `${30 + idx * 10}%`,
                padding: "8px 12px",
                background: "#262626CC",
                backdropFilter: "blur(10px)",
                border: "2px solid #C4A882",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#C4A882",
                cursor: "pointer",
              }}
            >
              <LucideIcon name="MapPin" size={12} style={{ marginRight: "4px", display: "inline" }} />
              {location.name.split(" ").slice(0, 2).join(" ")}
            </div>
          ))}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
        }}>
          <div style={{
            background: "#262626",
            border: "1px solid #C4A882",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E8E0D4", marginBottom: "24px" }}>
              {t("addNewLocation")}
            </h2>

            <div style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                  {t("locationName")} *
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t("locationNamePlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#1A1A1A",
                    border: "1px solid #4A4A4A",
                    borderRadius: "10px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                  {t("type")}
                </label>
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, type: e.target.value as "indoor" | "outdoor" }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#1A1A1A",
                    border: "1px solid #4A4A4A",
                    borderRadius: "10px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="indoor">{t("indoor")}</option>
                  <option value="outdoor">{t("outdoor")}</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                  {t("city")} *
                </label>
                <input
                  type="text"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                  placeholder={t("cityPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#1A1A1A",
                    border: "1px solid #4A4A4A",
                    borderRadius: "10px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                  {t("dailyCostCrores")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newLocation.dailyCost}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, dailyCost: parseFloat(e.target.value) || 0.5 }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#1A1A1A",
                    border: "1px solid #4A4A4A",
                    borderRadius: "10px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {newLocation.type === "outdoor" && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                    {t("weatherRisk")}
                  </label>
                  <select
                    value={newLocation.weatherRisk}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, weatherRisk: e.target.value as "low" | "medium" | "high" }))}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#1A1A1A",
                      border: "1px solid #4A4A4A",
                      borderRadius: "10px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="low">{t("low")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="high">{t("high")}</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: "12px 24px",
                  background: "#333333",
                  border: "1px solid #4A4A4A",
                  borderRadius: "10px",
                  color: "#9A9080",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={addLocation}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#1A1A1A",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t("addLocation")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div
          onClick={() => setSelectedLocation(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #C4A882",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
              <div style={{
                minWidth: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <LucideIcon name="MapPin" size={32} color="#1A1A1A" />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E8E0D4", marginBottom: "6px" }}>
                  {selectedLocation.name}
                </h2>
                <p style={{ fontSize: "14px", color: "#9A9080" }}>{selectedLocation.city}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
              <div style={{
                padding: "16px",
                background: "#1A1A1A",
                border: "1px solid #3A3A3A",
                borderRadius: "12px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("type")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", textTransform: "capitalize" }}>
                      {selectedLocation.type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("dailyCost")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#C4A882" }}>
                      {formatCrores(selectedLocation.dailyCost)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("usageCount")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                      {selectedLocation.usageCount} {t("days")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("totalScenes")}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                      {selectedLocation.totalScenes}
                    </div>
                  </div>
                </div>
              </div>

              {selectedLocation.type === "outdoor" && (
                <div style={{
                  padding: "16px",
                  background: getWeatherRiskColor(selectedLocation.weatherRisk).bg,
                  border: `1px solid ${getWeatherRiskColor(selectedLocation.weatherRisk).color}`,
                  borderRadius: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <LucideIcon name="AlertTriangle" size={16} color={getWeatherRiskColor(selectedLocation.weatherRisk).color} />
                    <div style={{ fontSize: "12px", fontWeight: "600", color: getWeatherRiskColor(selectedLocation.weatherRisk).color }}>
                      {t("weatherRiskLabel")}: {selectedLocation.weatherRisk.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#9A9080" }}>
                    {t("outdoorContingency")}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882", marginBottom: "12px" }}>
                  {t("shootDaysAtLocation")}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedLocation.shootDays.length > 0 ? (
                    selectedLocation.shootDays.map((day, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "6px 12px",
                          background: "#1A1A1A",
                          border: "1px solid #4A4A4A",
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: "#E8E0D4",
                        }}
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "13px", color: "#6B6560" }}>{t("noShootDaysScheduled")}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLocation(null)}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "#333333",
                border: "1px solid #4A4A4A",
                borderRadius: "10px",
                color: "#9A9080",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
