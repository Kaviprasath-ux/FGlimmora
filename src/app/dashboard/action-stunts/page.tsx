"use client";

import { useState } from "react";
import { scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { actionStuntsTranslations } from "@/lib/translations/action-stunts";

type ChoreographyStatus = "Planned" | "In Rehearsal" | "Locked";

interface Stunt {
  id: string;
  name: string;
  riskLevel: number;
  equipment: string[];
  doublesRequired: number;
}

interface SafetyCheckItem {
  id: string;
  label: string;
  checked: boolean;
}

export default function ActionStuntsPage() {
  const { t } = useTranslation(actionStuntsTranslations);
  const actionStuntScenes = scenes.filter(s => s.complexity === "action" || s.complexity === "stunt");

  const [stunts, setStunts] = useState<Record<string, Stunt[]>>({
    sc_001: [
      { id: "st_1", name: "Tree-to-tree parkour chase", riskLevel: 3, equipment: ["Crash mats", "Harnesses"], doublesRequired: 2 },
      { id: "st_2", name: "20ft jump from cliff", riskLevel: 5, equipment: ["Airbag", "Wire rig", "Safety harness"], doublesRequired: 1 },
    ],
    sc_004: [
      { id: "st_3", name: "Warehouse fight sequence", riskLevel: 4, equipment: ["Breakaway props", "Stunt pads"], doublesRequired: 3 },
      { id: "st_4", name: "Explosion near actors", riskLevel: 5, equipment: ["Fire blankets", "Protective gear", "Blast shields"], doublesRequired: 0 },
    ],
    sc_005: [
      { id: "st_5", name: "Highway truck chase", riskLevel: 5, equipment: ["Stunt vehicles", "Roll cages", "Safety rigs"], doublesRequired: 4 },
      { id: "st_6", name: "Jump from truck to car", riskLevel: 5, equipment: ["Wire rig", "Crash pad", "Safety cables"], doublesRequired: 2 },
    ],
    sc_009: [
      { id: "st_7", name: "Cargo ship deck fight", riskLevel: 4, equipment: ["Water safety", "Life vests", "Stunt pads"], doublesRequired: 5 },
      { id: "st_8", name: "Fall from ship structure", riskLevel: 5, equipment: ["Airbag", "Wire descender", "Safety nets"], doublesRequired: 1 },
    ],
  });

  const [choreographyStatus, setChoreographyStatus] = useState<Record<string, ChoreographyStatus>>({
    sc_001: "Locked",
    sc_002: "Locked",
    sc_004: "In Rehearsal",
    sc_005: "Planned",
    sc_009: "Planned",
  });

  const [safetyChecks, setSafetyChecks] = useState<SafetyCheckItem[]>([
    { id: "check_1", label: "safetyHarnessesInspected", checked: true },
    { id: "check_2", label: "crashMatsPositioned", checked: true },
    { id: "check_3", label: "medicOnSet", checked: true },
    { id: "check_4", label: "fireSafetyEquipmentReady", checked: false },
    { id: "check_5", label: "stuntCoordinatorBriefingComplete", checked: true },
    { id: "check_6", label: "emergencyProtocolsReviewed", checked: false },
    { id: "check_7", label: "weatherConditionsChecked", checked: true },
    { id: "check_8", label: "insuranceDocumentationVerified", checked: true },
  ]);

  const toggleSafetyCheck = (id: string) => {
    setSafetyChecks(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const getStatusColor = (status: ChoreographyStatus) => {
    if (status === "Locked") return { bg: "#5B8C5A22", color: "#5B8C5A" };
    if (status === "In Rehearsal") return { bg: "#C4A04222", color: "#C4A042" };
    return { bg: "#5B7C8C22", color: "#5B7C8C" };
  };

  const renderStars = (count: number) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <LucideIcon
            key={i}
            name="Star"
            size={14}
            color={i <= count ? "#C4A042" : "#3A3A3A"}
            fill={i <= count ? "#C4A042" : "none"}
          />
        ))}
      </div>
    );
  };

  const totalActionCost = actionStuntScenes.reduce((sum, scene) => sum + scene.estimatedCost, 0);
  const maxCost = Math.max(...actionStuntScenes.map(s => s.estimatedCost));

  return (
    <div style={{ padding: "32px", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          {t("pageTitle")}
        </h1>
        <p style={{ fontSize: "15px", color: "#9A9080" }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A04222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Flame" size={24} color="#C4A042" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("actionScenes")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{actionStuntScenes.length}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="IndianRupee" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalActionBudget")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#C4A882" }}>{formatCrores(totalActionCost)}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B8C5A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="CheckCircle" size={24} color="#5B8C5A" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("safetyCompliance")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#5B8C5A" }}>
                {Math.round((safetyChecks.filter(c => c.checked).length / safetyChecks.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Sequence Cards */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "20px" }}>{t("actionSequences")}</h2>
        <div style={{ display: "grid", gap: "20px" }}>
          {actionStuntScenes.map((scene) => {
            const sceneStunts = stunts[scene.id] || [];
            const avgRisk = sceneStunts.length > 0
              ? Math.round(sceneStunts.reduce((sum, s) => sum + s.riskLevel, 0) / sceneStunts.length)
              : 0;
            const status = choreographyStatus[scene.id] || "Planned";
            const statusColors = getStatusColor(status);

            return (
              <div
                key={scene.id}
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <div style={{ display: "flex", gap: "24px" }}>
                  {/* Scene Number Badge */}
                  <div style={{
                    minWidth: "80px",
                    height: "80px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #C4A882 0%, #8C7A62 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#0F0F0F",
                  }}>
                    {scene.sceneNumber}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Header Row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "6px" }}>
                          {scene.description}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#9A9080" }}>{scene.location}</p>
                      </div>

                      <span style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: statusColors.bg,
                        color: statusColors.color,
                        whiteSpace: "nowrap",
                      }}>
                        {status === "Planned" ? t("planned") : status === "In Rehearsal" ? t("inRehearsal") : t("locked")}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {t("safetyRating")}
                        </div>
                        {renderStars(avgRisk)}
                      </div>

                      <div>
                        <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {t("estimatedCost")}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#C4A882" }}>
                          {formatCrores(scene.estimatedCost)}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {t("vfxIntensity")}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: scene.vfxIntensity === "extreme" ? "#C45C5C" : "#C4A042", textTransform: "capitalize" }}>
                          {scene.vfxIntensity || "N/A"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {t("complexity")}
                        </div>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: "#C4A04222",
                          color: "#C4A042",
                          textTransform: "capitalize",
                        }}>
                          {scene.complexity}
                        </span>
                      </div>
                    </div>

                    {/* Stunt Breakdown */}
                    {sceneStunts.length > 0 && (
                      <div style={{
                        background: "#0F0F0F",
                        border: "1px solid #2A2A2A",
                        borderRadius: "12px",
                        padding: "16px",
                      }}>
                        <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {t("stuntBreakdown")}
                        </h4>
                        <div style={{ display: "grid", gap: "12px" }}>
                          {sceneStunts.map(stunt => (
                            <div key={stunt.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                              <div style={{ minWidth: "80px" }}>
                                {renderStars(stunt.riskLevel)}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500", marginBottom: "4px" }}>
                                  {stunt.name}
                                </div>
                                <div style={{ fontSize: "12px", color: "#9A9080", marginBottom: "6px" }}>
                                  {t("equipment")}: {stunt.equipment.join(", ")}
                                </div>
                                <div style={{ fontSize: "12px", color: "#6B6560" }}>
                                  {t("doublesRequired")}: <span style={{ color: "#C4A882", fontWeight: "600" }}>{stunt.doublesRequired}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B8C5A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Shield" size={24} color="#5B8C5A" />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("safetyChecklist")}</h3>
              <p style={{ fontSize: "12px", color: "#6B6560" }}>
                {safetyChecks.filter(c => c.checked).length} / {safetyChecks.length} {t("itemsComplete")}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {safetyChecks.map(item => (
              <label
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: item.checked ? "#5B8C5A11" : "#0F0F0F",
                  border: `1px solid ${item.checked ? "#5B8C5A" : "#2A2A2A"}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!item.checked) e.currentTarget.style.borderColor = "#3A3A3A";
                }}
                onMouseLeave={(e) => {
                  if (!item.checked) e.currentTarget.style.borderColor = "#2A2A2A";
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleSafetyCheck(item.id)}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    accentColor: "#5B8C5A",
                  }}
                />
                <span style={{
                  fontSize: "14px",
                  color: item.checked ? "#E8E0D4" : "#9A9080",
                  fontWeight: item.checked ? "500" : "400",
                }}>
                  {t(item.label)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="BarChart3" size={24} color="#C4A882" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>{t("costBreakdown")}</h3>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {actionStuntScenes.map(scene => (
              <div key={scene.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("scene")} {scene.sceneNumber}</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#C4A882" }}>
                    {formatCrores(scene.estimatedCost)}
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: "8px",
                  background: "#0F0F0F",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${(scene.estimatedCost / maxCost) * 100}%`,
                    height: "100%",
                    background: scene.estimatedCost === maxCost
                      ? "linear-gradient(90deg, #C45C5C 0%, #C4A042 100%)"
                      : "linear-gradient(90deg, #C4A882 0%, #8C7A62 100%)",
                    borderRadius: "4px",
                  }} />
                </div>
              </div>
            ))}

            <div style={{
              marginTop: "12px",
              paddingTop: "16px",
              borderTop: "1px solid #2A2A2A",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>{t("total")}</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#C4A882" }}>
                {formatCrores(totalActionCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
