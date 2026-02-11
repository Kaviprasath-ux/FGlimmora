"use client";

import { useState } from "react";
import { scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { previsualizationTranslations } from "@/lib/translations/previsualization";

type TimeOfDay = "Dawn" | "Morning" | "Noon" | "Evening" | "Night";

export default function PrevisualizationPage() {
  const { t } = useTranslation(previsualizationTranslations);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [cameraControls, setCameraControls] = useState({ pan: 0, tilt: 0, zoom: 50 });
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("Noon");
  const [showCostOverlay, setShowCostOverlay] = useState(false);
  const [directorNotes, setDirectorNotes] = useState<Record<string, string>>({});

  const selectedScene = selectedSceneId ? scenes.find(s => s.id === selectedSceneId) : null;
  const timesOfDay: TimeOfDay[] = ["Dawn", "Morning", "Noon", "Evening", "Night"];

  const getTimeColor = (time: TimeOfDay) => {
    const colors = {
      Dawn: "#FF9E6D",
      Morning: "#FFD06D",
      Noon: "#FFE66D",
      Evening: "#FF8C6D",
      Night: "#6D8CFF",
    };
    return colors[time];
  };

  return (
    <div style={{ padding: "32px", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          {t("pageTitle")}
        </h1>
        <p style={{ fontSize: "15px", color: "#9A9080" }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Scene Grid */}
      {!selectedSceneId && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {scenes.map((scene) => (
            <div
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
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
              {/* 3D Preview Placeholder */}
              <div style={{
                width: "100%",
                height: "180px",
                background: "#1A1A1A",
                border: "2px solid #3A3A3A",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                position: "relative",
              }}>
                <LucideIcon name="Camera" size={48} color="#4A4A4A" />
                <span style={{ fontSize: "13px", color: "#6B6560", marginTop: "8px" }}>{t("preview3d")}</span>
                {scene.vfxRequired && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "6px 12px",
                    background: "#C4A88244",
                    border: "1px solid #C4A882",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#C4A882",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    <LucideIcon name="Sparkles" size={12} />
                    VFX
                  </div>
                )}
              </div>

              {/* Scene Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1A1A1A",
                }}>
                  {scene.sceneNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                    {t("scene")} {scene.sceneNumber}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#9A9080" }}>{scene.location}</p>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#9A9080", marginBottom: "12px", lineHeight: "1.5" }}>
                {scene.description}
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: scene.complexity === "action" || scene.complexity === "stunt" ? "#C4A04222" : "#5B8C5A22",
                  color: scene.complexity === "action" || scene.complexity === "stunt" ? "#C4A042" : "#5B8C5A",
                  textTransform: "capitalize",
                }}>
                  {scene.complexity}
                </span>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: "#5B7C8C22",
                  color: "#5B7C8C",
                }}>
                  {formatCrores(scene.estimatedCost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Scene Detail Panel */}
      {selectedScene && (
        <div>
          <button
            onClick={() => setSelectedSceneId(null)}
            style={{
              padding: "10px 20px",
              background: "#333333",
              border: "1px solid #4A4A4A",
              borderRadius: "10px",
              color: "#9A9080",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LucideIcon name="Camera" size={16} />
            {t("backToSceneGrid")}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            {/* Left Column - Preview */}
            <div>
              {/* Large Preview Area */}
              <div style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4" }}>
                    {t("scene")} {selectedScene.sceneNumber} {t("scenePreview")}
                  </h2>
                  <button
                    onClick={() => setShowCostOverlay(!showCostOverlay)}
                    style={{
                      padding: "8px 16px",
                      background: showCostOverlay ? "#C4A88244" : "#333333",
                      border: `1px solid ${showCostOverlay ? "#C4A882" : "#4A4A4A"}`,
                      borderRadius: "8px",
                      color: showCostOverlay ? "#C4A882" : "#9A9080",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("costOverlay")}
                  </button>
                </div>

                <div style={{
                  width: "100%",
                  height: "400px",
                  background: "#1A1A1A",
                  border: "2px solid #3A3A3A",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}>
                  <LucideIcon name="Camera" size={64} color="#4A4A4A" />
                  <span style={{ fontSize: "15px", color: "#6B6560", marginTop: "12px" }}>{t("preview3dArea")}</span>
                  <span style={{ fontSize: "13px", color: "#6B6560", marginTop: "4px" }}>
                    {t("scene")}: {selectedScene.description}
                  </span>

                  {/* Cost Overlay */}
                  {showCostOverlay && (
                    <div style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      padding: "16px",
                      background: "#262626CC",
                      backdropFilter: "blur(10px)",
                      border: "1px solid #C4A882",
                      borderRadius: "10px",
                    }}>
                      <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "8px" }}>{t("estimatedCost")}</div>
                      <div style={{ fontSize: "24px", fontWeight: "700", color: "#C4A882" }}>
                        {formatCrores(selectedScene.estimatedCost)}
                      </div>
                      {selectedScene.vfxRequired && (
                        <div style={{ marginTop: "8px", fontSize: "12px", color: "#9A9080" }}>
                          {t("vfxIntensityLabel")}: <span style={{ color: "#C4A882", fontWeight: "600" }}>{selectedScene.vfxIntensity}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lighting Indicator */}
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    padding: "10px 16px",
                    background: "#262626CC",
                    backdropFilter: "blur(10px)",
                    border: `2px solid ${getTimeColor(timeOfDay)}`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: getTimeColor(timeOfDay),
                      boxShadow: `0 0 12px ${getTimeColor(timeOfDay)}`,
                    }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#E8E0D4" }}>{timeOfDay}</span>
                  </div>
                </div>
              </div>

              {/* Camera Position Controls */}
              <div style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LucideIcon name="Film" size={20} color="#5B7C8C" />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("cameraPositionControls")}</h3>
                </div>

                <div style={{ display: "grid", gap: "20px" }}>
                  {/* Pan */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#9A9080" }}>{t("pan")}</label>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>{cameraControls.pan}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={cameraControls.pan}
                      onChange={(e) => setCameraControls(prev => ({ ...prev, pan: parseInt(e.target.value) }))}
                      style={{
                        width: "100%",
                        height: "6px",
                        borderRadius: "3px",
                        background: "#1A1A1A",
                        outline: "none",
                        accentColor: "#C4A882",
                      }}
                    />
                  </div>

                  {/* Tilt */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#9A9080" }}>{t("tilt")}</label>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>{cameraControls.tilt}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={cameraControls.tilt}
                      onChange={(e) => setCameraControls(prev => ({ ...prev, tilt: parseInt(e.target.value) }))}
                      style={{
                        width: "100%",
                        height: "6px",
                        borderRadius: "3px",
                        background: "#1A1A1A",
                        outline: "none",
                        accentColor: "#C4A882",
                      }}
                    />
                  </div>

                  {/* Zoom */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#9A9080" }}>{t("zoom")}</label>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882" }}>{cameraControls.zoom}mm</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="200"
                      value={cameraControls.zoom}
                      onChange={(e) => setCameraControls(prev => ({ ...prev, zoom: parseInt(e.target.value) }))}
                      style={{
                        width: "100%",
                        height: "6px",
                        borderRadius: "3px",
                        background: "#1A1A1A",
                        outline: "none",
                        accentColor: "#C4A882",
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setCameraControls({ pan: 0, tilt: 0, zoom: 50 })}
                  style={{
                    marginTop: "16px",
                    padding: "10px 20px",
                    background: "#333333",
                    border: "1px solid #4A4A4A",
                    borderRadius: "10px",
                    color: "#9A9080",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {t("resetCamera")}
                </button>
              </div>

              {/* Lighting Controls */}
              <div style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LucideIcon name="Sparkles" size={20} color="#C4A882" />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("lightingControls")}</h3>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {timesOfDay.map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeOfDay(time)}
                      style={{
                        padding: "12px 20px",
                        background: timeOfDay === time ? `${getTimeColor(time)}22` : "#333333",
                        border: `2px solid ${timeOfDay === time ? getTimeColor(time) : "#4A4A4A"}`,
                        borderRadius: "10px",
                        color: timeOfDay === time ? getTimeColor(time) : "#9A9080",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Scene Info & Notes */}
            <div>
              {/* Scene Metadata */}
              <div style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "16px" }}>{t("sceneDetails")}</h3>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("description")}</div>
                    <div style={{ fontSize: "14px", color: "#E8E0D4", lineHeight: "1.5" }}>{selectedScene.description}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("location")}</div>
                    <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{selectedScene.location}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("complexity")}</div>
                    <span style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: selectedScene.complexity === "action" || selectedScene.complexity === "stunt" ? "#C4A04222" : "#5B8C5A22",
                      color: selectedScene.complexity === "action" || selectedScene.complexity === "stunt" ? "#C4A042" : "#5B8C5A",
                      textTransform: "capitalize",
                    }}>
                      {selectedScene.complexity}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("estimatedCostLabel")}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#C4A882" }}>{formatCrores(selectedScene.estimatedCost)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("duration")}</div>
                    <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{selectedScene.estimatedDuration} {t("days")}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("status")}</div>
                    <span style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: selectedScene.status === "completed" ? "#5B8C5A22" : "#5B7C8C22",
                      color: selectedScene.status === "completed" ? "#5B8C5A" : "#5B7C8C",
                      textTransform: "capitalize",
                    }}>
                      {selectedScene.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* VFX Overlays Info */}
              {selectedScene.vfxRequired && (
                <div style={{
                  background: "#262626",
                  border: "1px solid #C4A882",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#C4A88244", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LucideIcon name="Sparkles" size={20} color="#C4A882" />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>{t("vfxRequirements")}</h3>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9A9080", marginBottom: "4px" }}>{t("vfxIntensity")}</div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#C4A882", textTransform: "capitalize" }}>
                        {selectedScene.vfxIntensity || "Medium"}
                      </div>
                    </div>

                    <div style={{ padding: "12px", background: "#C4A88211", borderRadius: "8px", border: "1px solid #C4A88233" }}>
                      <div style={{ fontSize: "12px", color: "#9A9080", lineHeight: "1.5" }}>
                        {t("vfxCoordinateNote")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Director Notes */}
              <div style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#5B8C5A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LucideIcon name="FileText" size={20} color="#5B8C5A" />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>{t("directorNotes")}</h3>
                </div>

                <textarea
                  value={directorNotes[selectedScene.id] || ""}
                  onChange={(e) => setDirectorNotes(prev => ({ ...prev, [selectedScene.id]: e.target.value }))}
                  placeholder={t("directorNotesPlaceholder")}
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    padding: "16px",
                    background: "#1A1A1A",
                    border: "1px solid #4A4A4A",
                    borderRadius: "12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
