"use client";

import { useState } from "react";
import { vfxShots, scenes } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { vfxReviewTranslations } from "@/lib/translations/vfx-review";

interface ReviewNote {
  shotId: string;
  note: string;
}

export default function VFXReviewPage() {
  const { t } = useTranslation(vfxReviewTranslations);
  const [reviewNotes, setReviewNotes] = useState<ReviewNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [shotStatuses, setShotStatuses] = useState<Record<string, string>>(
    vfxShots.reduce((acc, shot) => ({ ...acc, [shot.id]: shot.status }), {})
  );

  const reviewQueue = vfxShots.filter(
    shot => shotStatuses[shot.id] === "review" || shotStatuses[shot.id] === "in_progress"
  );

  const approvedShots = vfxShots.filter(shot => shotStatuses[shot.id] === "approved");

  const totalReviewed = vfxShots.filter(
    shot => shotStatuses[shot.id] === "approved" || shotStatuses[shot.id] === "rework"
  ).length;

  const approvalRate = vfxShots.length > 0
    ? Math.round((approvedShots.length / vfxShots.length) * 100)
    : 0;

  const avgReworkCycles = vfxShots.length > 0
    ? (vfxShots.reduce((sum, shot) => sum + shot.reworkCount, 0) / vfxShots.length).toFixed(1)
    : "0";

  const handleApprove = (shotId: string) => {
    setShotStatuses(prev => ({ ...prev, [shotId]: "approved" }));
    setActiveNoteId(null);
  };

  const handleRequestChanges = (shotId: string) => {
    const note = reviewNotes.find(n => n.shotId === shotId)?.note || "";
    if (!note.trim()) {
      alert(t("addNotesBeforeChanges"));
      return;
    }
    setShotStatuses(prev => ({ ...prev, [shotId]: "rework" }));
    setActiveNoteId(null);
  };

  const handleReject = (shotId: string) => {
    if (window.confirm(t("confirmReject"))) {
      setShotStatuses(prev => ({ ...prev, [shotId]: "pending" }));
      setActiveNoteId(null);
    }
  };

  const updateNote = (shotId: string, note: string) => {
    setReviewNotes(prev => {
      const existing = prev.find(n => n.shotId === shotId);
      if (existing) {
        return prev.map(n => n.shotId === shotId ? { ...n, note } : n);
      }
      return [...prev, { shotId, note }];
    });
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity === "extreme") return { bg: "#C45C5C22", color: "#C45C5C" };
    if (complexity === "high") return { bg: "#C4A04222", color: "#C4A042" };
    if (complexity === "medium") return { bg: "#5B7C8C22", color: "#5B7C8C" };
    return { bg: "#5B8C5A22", color: "#5B8C5A" };
  };

  const getStatusColor = (status: string) => {
    if (status === "approved") return { bg: "#5B8C5A22", color: "#5B8C5A" };
    if (status === "review") return { bg: "#C4A04222", color: "#C4A042" };
    if (status === "rework") return { bg: "#C45C5C22", color: "#C45C5C" };
    return { bg: "#5B7C8C22", color: "#5B7C8C" };
  };

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

      {/* Review Statistics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B7C8C22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Layers" size={24} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("totalReviewed")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>
                {totalReviewed} / {vfxShots.length}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#5B8C5A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="CheckCircle" size={24} color="#5B8C5A" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("approvalRate")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#5B8C5A" }}>{approvalRate}%</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A04222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="RotateCcw" size={24} color="#C4A042" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("avgReworkCycles")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#E8E0D4" }}>{avgReworkCycles}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#C4A88222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="Clock" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("inReviewQueue")}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#C4A882" }}>{reviewQueue.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Queue */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "20px" }}>{t("reviewQueue")}</h2>

        {reviewQueue.length === 0 ? (
          <div style={{
            background: "#1A1A1A",
            border: "1px dashed #3A3A3A",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
          }}>
            <LucideIcon name="CheckCircle" size={48} color="#5B8C5A" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "16px", color: "#5B8C5A", marginBottom: "8px", fontWeight: "600" }}>{t("allCaughtUp")}</p>
            <p style={{ fontSize: "13px", color: "#6B6560" }}>{t("noShotsWaiting")}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {reviewQueue.map((shot) => {
              const scene = scenes.find(s => s.sceneNumber === shot.sceneNumber);
              const complexityColors = getComplexityColor(shot.complexity);
              const isNoteActive = activeNoteId === shot.id;
              const currentNote = reviewNotes.find(n => n.shotId === shot.id)?.note || "";

              return (
                <div
                  key={shot.id}
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #2A2A2A",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                    {/* Left - Shot Details */}
                    <div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                        <div style={{
                          minWidth: "80px",
                          height: "80px",
                          borderRadius: "12px",
                          background: "#0F0F0F",
                          border: "2px solid #2A2A2A",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "2px" }}>{t("scene")}</div>
                          <div style={{ fontSize: "24px", fontWeight: "700", color: "#C4A882" }}>{shot.sceneNumber}</div>
                          <div style={{ fontSize: "10px", color: "#6B6560" }}>{t("shot")} {shot.shotNumber}</div>
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "6px" }}>
                            {scene?.description || `Scene ${shot.sceneNumber}`}
                          </h3>
                          <p style={{ fontSize: "13px", color: "#9A9080", marginBottom: "12px" }}>
                            {t("shot")} {shot.shotNumber} - {shot.type.toUpperCase()}
                          </p>

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: complexityColors.bg,
                              color: complexityColors.color,
                              textTransform: "capitalize",
                            }}>
                              {shot.complexity}
                            </span>
                            <span style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: "#C4A88222",
                              color: "#C4A882",
                            }}>
                              {shot.vendor}
                            </span>
                            {shot.reworkCount > 0 && (
                              <span style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "#C4A04222",
                                color: "#C4A042",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}>
                                <LucideIcon name="RotateCcw" size={12} />
                                {shot.reworkCount} {t("iterations")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cost Info */}
                      <div style={{
                        background: "#0F0F0F",
                        border: "1px solid #2A2A2A",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("estimatedCost")}</div>
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#9A9080" }}>
                              {formatCrores(shot.estimatedCost)}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "4px" }}>{t("actualCost")}</div>
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#C4A882" }}>
                              {shot.actualCost > 0 ? formatCrores(shot.actualCost) : "TBD"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Notes */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9A9080", marginBottom: "8px" }}>
                          {t("reviewNotes")}
                        </label>
                        <textarea
                          value={currentNote}
                          onChange={(e) => updateNote(shot.id, e.target.value)}
                          onFocus={() => setActiveNoteId(shot.id)}
                          placeholder={t("reviewNotesPlaceholder")}
                          style={{
                            width: "100%",
                            minHeight: "100px",
                            padding: "12px 16px",
                            background: "#0F0F0F",
                            border: `1px solid ${isNoteActive ? "#C4A882" : "#3A3A3A"}`,
                            borderRadius: "10px",
                            color: "#E8E0D4",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            outline: "none",
                            resize: "vertical",
                            fontFamily: "inherit",
                            transition: "border-color 0.2s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right - Preview & Actions */}
                    <div>
                      {/* Before/After Comparison */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{
                          width: "100%",
                          height: "160px",
                          background: "#0F0F0F",
                          border: "2px solid #2A2A2A",
                          borderRadius: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "8px",
                        }}>
                          <LucideIcon name="Film" size={40} color="#3A3A3A" />
                          <span style={{ fontSize: "12px", color: "#6B6560", marginTop: "8px" }}>{t("before")}</span>
                        </div>

                        <div style={{
                          width: "100%",
                          height: "160px",
                          background: "#0F0F0F",
                          border: "2px solid #2A2A2A",
                          borderRadius: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <LucideIcon name="Sparkles" size={40} color="#C4A882" />
                          <span style={{ fontSize: "12px", color: "#C4A882", marginTop: "8px" }}>{t("afterVfx")}</span>
                        </div>
                      </div>

                      {/* Review Actions */}
                      <div style={{ display: "grid", gap: "10px" }}>
                        <button
                          onClick={() => handleApprove(shot.id)}
                          style={{
                            padding: "12px 16px",
                            background: "linear-gradient(135deg, #5B8C5A 0%, #4A7A49 100%)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <LucideIcon name="CheckCircle" size={16} />
                          {t("approve")}
                        </button>

                        <button
                          onClick={() => handleRequestChanges(shot.id)}
                          style={{
                            padding: "12px 16px",
                            background: "#C4A04222",
                            border: "1px solid #C4A042",
                            borderRadius: "10px",
                            color: "#C4A042",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <LucideIcon name="RotateCcw" size={16} />
                          {t("requestChanges")}
                        </button>

                        <button
                          onClick={() => handleReject(shot.id)}
                          style={{
                            padding: "12px 16px",
                            background: "#C45C5C22",
                            border: "1px solid #C45C5C",
                            borderRadius: "10px",
                            color: "#C45C5C",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <LucideIcon name="AlertTriangle" size={16} />
                          {t("reject")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approved Shots Gallery */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#E8E0D4", marginBottom: "20px" }}>
          {t("approvedShots")} ({approvedShots.length})
        </h2>

        {approvedShots.length === 0 ? (
          <div style={{
            background: "#1A1A1A",
            border: "1px dashed #3A3A3A",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
          }}>
            <LucideIcon name="Layers" size={48} color="#3A3A3A" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "15px", color: "#6B6560" }}>{t("noApprovedShots")}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {approvedShots.map((shot) => {
              const scene = scenes.find(s => s.sceneNumber === shot.sceneNumber);
              const complexityColors = getComplexityColor(shot.complexity);

              return (
                <div
                  key={shot.id}
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #5B8C5A",
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                >
                  <div style={{
                    width: "100%",
                    height: "160px",
                    background: "#0F0F0F",
                    border: "2px solid #2A2A2A",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    position: "relative",
                  }}>
                    <LucideIcon name="CheckCircle" size={40} color="#5B8C5A" />
                    <span style={{ fontSize: "12px", color: "#5B8C5A", marginTop: "8px", fontWeight: "600" }}>{t("approved")}</span>

                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "6px 10px",
                      background: "#1A1A1ACC",
                      backdropFilter: "blur(10px)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#C4A882",
                    }}>
                      S{shot.sceneNumber}-{shot.shotNumber}
                    </div>
                  </div>

                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "6px" }}>
                    {scene?.description || `Scene ${shot.sceneNumber}`}
                  </h4>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "5px",
                      fontSize: "10px",
                      fontWeight: "600",
                      background: complexityColors.bg,
                      color: complexityColors.color,
                      textTransform: "capitalize",
                    }}>
                      {shot.complexity}
                    </span>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "5px",
                      fontSize: "10px",
                      fontWeight: "600",
                      background: "#C4A88222",
                      color: "#C4A882",
                    }}>
                      {shot.vendor}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", color: "#9A9080" }}>
                    {t("cost")}: <span style={{ color: "#C4A882", fontWeight: "600" }}>{formatCrores(shot.actualCost || shot.estimatedCost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
