"use client";

import { useState } from "react";
import { scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { shotPlanningTranslations } from "@/lib/translations/shot-planning";

type CameraAngle = "wide" | "medium" | "close-up" | "POV" | "tracking" | "crane" | "overhead";

interface Shot {
  id: string;
  shotNumber: number;
  description: string;
  cameraAngle: CameraAngle;
  estimatedDuration: number;
}

export default function ShotPlanningPage() {
  const { t } = useTranslation(shotPlanningTranslations);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || "");
  const [shots, setShots] = useState<Record<string, Shot[]>>({
    [scenes[0]?.id]: [
      { id: "shot_1", shotNumber: 1, description: "Establishing shot of forest", cameraAngle: "wide", estimatedDuration: 5 },
      { id: "shot_2", shotNumber: 2, description: "Pushpa running through trees", cameraAngle: "tracking", estimatedDuration: 8 },
      { id: "shot_3", shotNumber: 3, description: "Close-up of determined face", cameraAngle: "close-up", estimatedDuration: 3 },
    ],
  });
  const [addShotForm, setAddShotForm] = useState({ description: "", cameraAngle: "wide" as CameraAngle, estimatedDuration: 5 });
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedScene = scenes.find(s => s.id === selectedSceneId);
  const sceneShots = shots[selectedSceneId] || [];
  const totalShots = sceneShots.length;
  const totalDuration = sceneShots.reduce((sum, shot) => sum + shot.estimatedDuration, 0);

  const cameraAngles: CameraAngle[] = ["wide", "medium", "close-up", "POV", "tracking", "crane", "overhead"];

  const cameraEquipmentSuggestions = () => {
    const angles = sceneShots.map(s => s.cameraAngle);
    const equipment: string[] = [];

    if (angles.includes("crane") || angles.includes("overhead")) {
      equipment.push("Crane/Jib");
    }
    if (angles.includes("tracking")) {
      equipment.push("Dolly Track", "Steadicam");
    }
    if (angles.includes("POV")) {
      equipment.push("Body Mount Camera");
    }
    if (angles.some(a => ["wide", "medium", "close-up"].includes(a))) {
      equipment.push("Tripod", "Prime Lenses");
    }

    return equipment.length > 0 ? equipment : ["Standard Camera Kit"];
  };

  const addShot = () => {
    if (!addShotForm.description.trim()) return;

    const newShot: Shot = {
      id: `shot_${Date.now()}`,
      shotNumber: sceneShots.length + 1,
      description: addShotForm.description,
      cameraAngle: addShotForm.cameraAngle,
      estimatedDuration: addShotForm.estimatedDuration,
    };

    setShots(prev => ({
      ...prev,
      [selectedSceneId]: [...(prev[selectedSceneId] || []), newShot],
    }));

    setAddShotForm({ description: "", cameraAngle: "wide", estimatedDuration: 5 });
    setShowAddForm(false);
  };

  const updateShot = (shotId: string, field: keyof Shot, value: string | number) => {
    setShots(prev => ({
      ...prev,
      [selectedSceneId]: prev[selectedSceneId]?.map(shot =>
        shot.id === shotId ? { ...shot, [field]: value } : shot
      ) || [],
    }));
  };

  const deleteShot = (shotId: string) => {
    setShots(prev => ({
      ...prev,
      [selectedSceneId]: (prev[selectedSceneId] || [])
        .filter(shot => shot.id !== shotId)
        .map((shot, idx) => ({ ...shot, shotNumber: idx + 1 })),
    }));
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

      {/* Scene Selector */}
      <div style={{ marginBottom: "32px", background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#C4A882", marginBottom: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {t("selectScene")}
        </label>
        <select
          value={selectedSceneId}
          onChange={(e) => setSelectedSceneId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#1A1A1A",
            border: "1px solid #4A4A4A",
            borderRadius: "12px",
            color: "#E8E0D4",
            fontSize: "15px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {scenes.map(scene => (
            <option key={scene.id} value={scene.id}>
              {t("scene")} {scene.sceneNumber} - {scene.description}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Scene Details */}
      {selectedScene && (
        <div style={{ marginBottom: "32px", background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Camera" size={24} color="#1A1A1A" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                {t("scene")} {selectedScene.sceneNumber}
              </h2>
              <p style={{ fontSize: "14px", color: "#9A9080" }}>{selectedScene.description}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginTop: "20px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("location")}</div>
              <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{selectedScene.location}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("complexity")}</div>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
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
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("estimatedCost")}</div>
              <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{formatCrores(selectedScene.estimatedCost)}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("vfxRequired")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {selectedScene.vfxRequired ? (
                  <>
                    <LucideIcon name="Sparkles" size={14} color="#C4A882" />
                    <span style={{ fontSize: "14px", color: "#C4A882", fontWeight: "500" }}>
                      {selectedScene.vfxIntensity || "Yes"}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "14px", color: "#6B6560" }}>No</span>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("castNeeded")}</div>
              <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>{selectedScene.castNeeded.length} {t("actors")}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Layers" size={20} color="#C4A882" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalShots")}</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>{totalShots}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Clock" size={20} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalDuration")}</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>{totalDuration} {t("sec")}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#5B8C5A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Film" size={20} color="#5B8C5A" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("avgShotLength")}</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
                {totalShots > 0 ? (totalDuration / totalShots).toFixed(1) : 0} {t("sec")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shot Cards Grid */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("shotList")}</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: "10px 20px",
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
            <LucideIcon name="Camera" size={16} />
            {t("addShot")}
          </button>
        </div>

        {/* Add Shot Form */}
        {showAddForm && (
          <div style={{ background: "#262626", border: "1px solid #C4A882", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "16px" }}>{t("newShot")}</h4>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                  {t("shotDescription")}
                </label>
                <input
                  type="text"
                  value={addShotForm.description}
                  onChange={(e) => setAddShotForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t("shotDescriptionPlaceholder")}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                    {t("cameraAngle")}
                  </label>
                  <select
                    value={addShotForm.cameraAngle}
                    onChange={(e) => setAddShotForm(prev => ({ ...prev, cameraAngle: e.target.value as CameraAngle }))}
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
                    {cameraAngles.map(angle => (
                      <option key={angle} value={angle}>{angle.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                    {t("durationSeconds")}
                  </label>
                  <input
                    type="number"
                    value={addShotForm.estimatedDuration}
                    onChange={(e) => setAddShotForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 5 }))}
                    min="1"
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
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: "10px 20px",
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
                  onClick={addShot}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#1A1A1A",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addShot")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shot Cards */}
        <div style={{ display: "grid", gap: "16px" }}>
          {sceneShots.map((shot) => (
            <div
              key={shot.id}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "20px",
                cursor: "move",
                transition: "all 0.2s ease",
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
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{
                  minWidth: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1A1A1A",
                }}>
                  {shot.shotNumber}
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={shot.description}
                    onChange={(e) => updateShot(shot.id, "description", e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "#E8E0D4",
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "12px",
                      outline: "none",
                      padding: "4px 0",
                    }}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {t("cameraAngle")}
                      </div>
                      <select
                        value={shot.cameraAngle}
                        onChange={(e) => updateShot(shot.id, "cameraAngle", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "#1A1A1A",
                          border: "1px solid #4A4A4A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "13px",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {cameraAngles.map(angle => (
                          <option key={angle} value={angle}>{angle.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {t("duration")}
                      </div>
                      <input
                        type="number"
                        value={shot.estimatedDuration}
                        onChange={(e) => updateShot(shot.id, "estimatedDuration", parseInt(e.target.value) || 5)}
                        min="1"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "#1A1A1A",
                          border: "1px solid #4A4A4A",
                          borderRadius: "8px",
                          color: "#E8E0D4",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <button
                      onClick={() => deleteShot(shot.id)}
                      style={{
                        padding: "8px 12px",
                        background: "#C45C5C22",
                        border: "1px solid #C45C5C",
                        borderRadius: "8px",
                        color: "#C45C5C",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginTop: "18px",
                      }}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sceneShots.length === 0 && (
            <div style={{
              background: "#262626",
              border: "1px dashed #4A4A4A",
              borderRadius: "16px",
              padding: "48px",
              textAlign: "center",
            }}>
              <LucideIcon name="Camera" size={48} color="#4A4A4A" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: "15px", color: "#6B6560", marginBottom: "8px" }}>{t("noShotsPlanned")}</p>
              <p style={{ fontSize: "13px", color: "#6B6560" }}>{t("clickAddShot")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Equipment Suggestions */}
      <div style={{ background: "#262626", border: "1px solid #3A3A3A", borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LucideIcon name="Film" size={20} color="#5B7C8C" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("cameraEquipmentSuggestions")}</h3>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {cameraEquipmentSuggestions().map(equipment => (
            <span
              key={equipment}
              style={{
                padding: "8px 16px",
                background: "#C4A88222",
                border: "1px solid #C4A882",
                borderRadius: "8px",
                color: "#C4A882",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {equipment}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "16px", padding: "16px", background: "#1A1A1A", borderRadius: "12px", border: "1px solid #3A3A3A" }}>
          <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>{t("equipmentNote")}</div>
          <p style={{ fontSize: "14px", color: "#9A9080" }}>
            {t("equipmentNoteText")}
          </p>
        </div>
      </div>
    </div>
  );
}
