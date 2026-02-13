"use client";

import { useState, useMemo, useCallback } from "react";
import { stripBoardScenes, dayBreaks } from "@/data/mock-data";
import { formatCrores, generateId } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { stripBoardTranslations } from "@/lib/translations/strip-board";
import type { StripBoardScene, DayBreak } from "@/lib/types";

type ComplexityType = StripBoardScene["complexity"];

interface StripFormData {
  sceneNumber: number;
  description: string;
  location: string;
  complexity: ComplexityType;
  castNeeded: string;
  estimatedCost: number;
  estimatedDuration: number;
}

// ═══════════════════════════════════════════════════════════
// Strip Board Page
// Movie Magic-style strip board with drag-and-drop reordering,
// day-break dividers, and actor conflict detection.
// ═══════════════════════════════════════════════════════════

export default function StripBoardPage() {
  const { t } = useTranslation(stripBoardTranslations);

  // ── State ──────────────────────────────────────────────────
  const [strips, setStrips] = useState<StripBoardScene[]>(stripBoardScenes);
  const [breaks, setBreaks] = useState<DayBreak[]>(dayBreaks);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ── CRUD State ────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStrip, setEditingStrip] = useState<StripBoardScene | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const emptyForm: StripFormData = {
    sceneNumber: 0,
    description: "",
    location: "",
    complexity: "dialogue" as ComplexityType,
    castNeeded: "",
    estimatedCost: 0,
    estimatedDuration: 0,
  };
  const [formData, setFormData] = useState<StripFormData>(emptyForm);

  // ── Complexity color map ───────────────────────────────────
  const complexityColors: Record<string, { bg: string; text: string; label: string }> = {
    action: { bg: "#C45C5C", text: "#fff", label: t("action") },
    dialogue: { bg: "#5B8C5A", text: "#fff", label: t("dialogue") },
    vfx: { bg: "#7B68EE", text: "#fff", label: t("vfx") },
    romantic: { bg: "#E87C9A", text: "#fff", label: t("romantic") },
    song: { bg: "#C4A042", text: "#1A1A1A", label: t("song") },
    stunt: { bg: "#E8812A", text: "#fff", label: t("stunt") },
  };

  // ── Sorted strips ─────────────────────────────────────────
  const sortedStrips = useMemo(
    () => [...strips].sort((a, b) => a.order - b.order),
    [strips]
  );

  // ── Stats ──────────────────────────────────────────────────
  const totalScenes = strips.length;
  const shootDays = breaks.length;
  const totalCost = useMemo(
    () => strips.reduce((sum, s) => sum + s.estimatedCost, 0),
    [strips]
  );
  const avgScenesPerDay = shootDays > 0 ? (totalScenes / shootDays).toFixed(1) : "0";

  // ── Conflict detection ─────────────────────────────────────
  // For each "day" (region between consecutive day-break afterOrders),
  // collect all cast. If any actor appears 2+ times, flag it.
  const conflicts = useMemo(() => {
    const sortedBreaks = [...breaks].sort((a, b) => a.afterOrder - b.afterOrder);
    const result: { actor: string; dayNumber: number }[] = [];

    for (let i = 0; i < sortedBreaks.length; i++) {
      const db = sortedBreaks[i];
      const startOrder = db.afterOrder + 1;
      const endOrder =
        i + 1 < sortedBreaks.length
          ? sortedBreaks[i + 1].afterOrder
          : Infinity;

      // Collect scenes in this day
      const dayScenes = sortedStrips.filter(
        (s) => s.order >= startOrder && s.order <= endOrder
      );

      // Count actor appearances
      const actorCount: Record<string, number> = {};
      dayScenes.forEach((scene) => {
        scene.castNeeded.forEach((actor) => {
          actorCount[actor] = (actorCount[actor] || 0) + 1;
        });
      });

      // Find conflicts (actor in 2+ scenes same day)
      Object.entries(actorCount).forEach(([actor, count]) => {
        if (count >= 2) {
          result.push({ actor, dayNumber: db.dayNumber });
        }
      });
    }

    return result;
  }, [sortedStrips, breaks]);

  // ── Get conflicts for a specific day ──────────────────────
  const getConflictsForDay = useCallback(
    (dayNumber: number) => conflicts.filter((c) => c.dayNumber === dayNumber),
    [conflicts]
  );

  // ── Drag-and-drop handlers ─────────────────────────────────
  const handleDragStart = useCallback(
    (index: number) => {
      setDraggedIndex(index);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      setDragOverIndex(index);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      setDragOverIndex(null);

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        return;
      }

      setStrips((prevStrips) => {
        const sorted = [...prevStrips].sort((a, b) => a.order - b.order);
        const [movedItem] = sorted.splice(draggedIndex, 1);
        sorted.splice(dropIndex, 0, movedItem);

        // Reassign order values
        return sorted.map((strip, idx) => ({ ...strip, order: idx }));
      });

      setDraggedIndex(null);
    },
    [draggedIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // ── CRUD handlers ────────────────────────────────────────────
  const openCreateModal = useCallback(() => {
    const maxScene = strips.length > 0
      ? Math.max(...strips.map((s) => s.sceneNumber))
      : 0;
    setFormData({
      ...emptyForm,
      sceneNumber: maxScene + 1,
    });
    setShowCreateModal(true);
  }, [strips]);

  const openEditModal = useCallback((strip: StripBoardScene) => {
    setEditingStrip(strip);
    setFormData({
      sceneNumber: strip.sceneNumber,
      description: strip.description,
      location: strip.location,
      complexity: strip.complexity,
      castNeeded: strip.castNeeded.join(", "),
      estimatedCost: strip.estimatedCost,
      estimatedDuration: strip.estimatedDuration,
    });
    setShowEditModal(true);
  }, []);

  const handleCreateScene = useCallback(() => {
    const maxOrder = strips.length > 0
      ? Math.max(...strips.map((s) => s.order))
      : -1;
    const newScene: StripBoardScene = {
      sceneId: generateId(),
      sceneNumber: formData.sceneNumber,
      description: formData.description,
      location: formData.location,
      complexity: formData.complexity,
      castNeeded: formData.castNeeded.split(",").map((s) => s.trim()).filter(Boolean),
      estimatedCost: formData.estimatedCost,
      estimatedDuration: formData.estimatedDuration,
      order: maxOrder + 1,
    };
    setStrips((prev) => [...prev, newScene]);
    setShowCreateModal(false);
    setFormData(emptyForm);
  }, [formData, strips]);

  const handleUpdateScene = useCallback(() => {
    if (!editingStrip) return;
    setStrips((prev) =>
      prev.map((s) =>
        s.sceneId === editingStrip.sceneId
          ? {
              ...s,
              sceneNumber: formData.sceneNumber,
              description: formData.description,
              location: formData.location,
              complexity: formData.complexity,
              castNeeded: formData.castNeeded.split(",").map((c) => c.trim()).filter(Boolean),
              estimatedCost: formData.estimatedCost,
              estimatedDuration: formData.estimatedDuration,
            }
          : s
      )
    );
    setShowEditModal(false);
    setEditingStrip(null);
    setFormData(emptyForm);
  }, [editingStrip, formData]);

  const handleDeleteScene = useCallback((sceneId: string) => {
    setStrips((prev) => {
      const filtered = prev.filter((s) => s.sceneId !== sceneId);
      // Reassign order values
      const sorted = [...filtered].sort((a, b) => a.order - b.order);
      return sorted.map((strip, idx) => ({ ...strip, order: idx }));
    });
    setDeleteConfirmId(null);
  }, []);

  const closeModals = useCallback(() => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingStrip(null);
    setDeleteConfirmId(null);
    setFormData(emptyForm);
  }, []);

  // ── Check if a day break should appear before a given order ─
  const getBreakBefore = useCallback(
    (order: number): DayBreak | undefined => {
      return breaks.find((db) => db.afterOrder + 1 === order);
    },
    [breaks]
  );

  // ── Stats data ─────────────────────────────────────────────
  const statsCards = [
    {
      icon: "Film",
      label: t("totalScenes"),
      value: totalScenes.toString(),
      accent: "#C4A882",
    },
    {
      icon: "Calendar",
      label: t("shootDays"),
      value: shootDays.toString(),
      accent: "#5B8C5A",
    },
    {
      icon: "IndianRupee",
      label: t("totalCost"),
      value: formatCrores(totalCost),
      accent: "#C4A042",
    },
    {
      icon: "BarChart3",
      label: t("avgScenesPerDay"),
      value: avgScenesPerDay,
      accent: "#7B68EE",
    },
  ];

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div
      style={{
        padding: "32px",
        minHeight: "100vh",
        background: "#1A1A1A",
        color: "#E8E0D4",
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #C4A882 0%, #8B7355 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LucideIcon name="ArrowUpDown" size={24} color="#1A1A1A" />
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#E8E0D4",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {t("pageTitle")}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#9A9080",
              margin: "4px 0 0 0",
            }}
          >
            {t("pageSubtitle")}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #C4A882 0%, #8B7355 100%)",
            color: "#1A1A1A",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LucideIcon name="Plus" size={18} color="#1A1A1A" />
          {t("addScene")}
        </button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          margin: "24px 0",
        }}
      >
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `${stat.accent}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LucideIcon name={stat.icon} size={22} color={stat.accent} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#9A9080",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#E8E0D4",
                  margin: "2px 0 0 0",
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Legend Row ───────────────────────────────────────── */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#9A9080",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginRight: "8px",
            }}
          >
            {t("legend")}
          </span>
          {Object.entries(complexityColors).map(([key, color]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "4px",
                  background: color.bg,
                }}
              />
              <span style={{ fontSize: "13px", color: "#E8E0D4" }}>
                {color.label}
              </span>
            </div>
          ))}

          {/* Drag hint */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <LucideIcon name="GripVertical" size={14} color="#9A9080" />
            <span style={{ fontSize: "12px", color: "#9A9080", fontStyle: "italic" }}>
              {t("dragToReorder")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Conflict Summary ────────────────────────────────── */}
      {conflicts.length > 0 && (
        <div
          style={{
            background: "#3A2020",
            border: "1px solid #C45C5C",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <LucideIcon name="AlertTriangle" size={18} color="#E87C7C" />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#E87C7C",
              }}
            >
              {conflicts.length} {t("conflict")}
              {conflicts.length > 1 ? "s" : ""}{" "}
              {t("scenesCount") === "scenes" ? "Detected" : ""}
            </span>
          </div>
          {conflicts.map((c, idx) => (
            <p
              key={`conflict-${idx}`}
              style={{
                fontSize: "13px",
                color: "#E87C7C",
                margin: idx === 0 ? 0 : "6px 0 0 0",
                paddingLeft: "28px",
              }}
            >
              {c.actor} {t("actorConflict")} {c.dayNumber}
            </p>
          ))}
        </div>
      )}

      {conflicts.length === 0 && (
        <div
          style={{
            background: "#1E2E1E",
            border: "1px solid #3A5A3A",
            borderRadius: "12px",
            padding: "14px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <LucideIcon name="CheckCircle" size={18} color="#5B8C5A" />
          <span style={{ fontSize: "13px", color: "#7CBC7C" }}>
            {t("noConflicts")}
          </span>
        </div>
      )}

      {/* ── Strip Board ─────────────────────────────────────── */}
      <div
        style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "24px",
          minHeight: "400px",
        }}
      >
        {sortedStrips.map((strip, index) => {
          const color = complexityColors[strip.complexity] || {
            bg: "#666",
            text: "#fff",
            label: strip.complexity,
          };
          const breakBefore = getBreakBefore(strip.order);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const dayConflicts = breakBefore
            ? getConflictsForDay(breakBefore.dayNumber)
            : [];

          return (
            <div key={strip.sceneId}>
              {/* ── Day Break Divider ────────────────────────── */}
              {breakBefore && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0",
                      margin: index === 0 ? "0 0 12px 0" : "20px 0 12px 0",
                    }}
                  >
                    {/* Left line */}
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        background:
                          "linear-gradient(90deg, transparent, #C4A882)",
                      }}
                    />

                    {/* Day label */}
                    <div
                      style={{
                        background: "#333333",
                        border: "1px solid #4A4A4A",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >
                      <LucideIcon
                        name="Calendar"
                        size={14}
                        color="#C4A882"
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#C4A882",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        {t("day")} {breakBefore.dayNumber}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#9A9080",
                          fontWeight: 400,
                        }}
                      >
                        &mdash; {breakBefore.location}
                      </span>
                    </div>

                    {/* Right line */}
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        background:
                          "linear-gradient(90deg, #C4A882, transparent)",
                      }}
                    />
                  </div>

                  {/* ── Day-specific conflicts ────────────────── */}
                  {dayConflicts.length > 0 &&
                    dayConflicts.map((c, ci) => (
                      <div
                        key={`dayconflict-${breakBefore.dayNumber}-${ci}`}
                        style={{
                          background: "#3A2020",
                          border: "1px solid #C45C5C",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <LucideIcon
                          name="AlertTriangle"
                          size={14}
                          color="#E87C7C"
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#E87C7C",
                            fontWeight: 500,
                          }}
                        >
                          {t("conflict")}: {c.actor}{" "}
                          {t("actorConflict")} {c.dayNumber}
                        </span>
                      </div>
                    ))}
                </>
              )}

              {/* ── Strip Row ────────────────────────────────── */}
              <div
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: isDragging
                    ? "#1A1A1A"
                    : isDragOver
                    ? "#2E2E2E"
                    : "#1E1E1E",
                  border: isDragOver
                    ? "1px dashed #C4A882"
                    : "1px solid #333333",
                  borderLeft: `4px solid ${color.bg}`,
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "6px",
                  cursor: "grab",
                  opacity: isDragging ? 0.5 : 1,
                  transition: "background 0.15s, border 0.15s, opacity 0.15s",
                  userSelect: "none",
                }}
              >
                {/* Grip Handle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    color: "#666",
                  }}
                >
                  <LucideIcon name="GripVertical" size={18} color="#666" />
                </div>

                {/* Scene Number Badge */}
                <div
                  style={{
                    background: color.bg,
                    color: color.text,
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    minWidth: "52px",
                    textAlign: "center",
                  }}
                >
                  {t("scene")}{strip.sceneNumber}
                </div>

                {/* Complexity Label Badge */}
                <div
                  style={{
                    background: `${color.bg}25`,
                    color: color.bg,
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    border: `1px solid ${color.bg}40`,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    minWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  {color.label}
                </div>

                {/* Description */}
                <div
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    color: "#E8E0D4",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}
                >
                  {strip.description}
                </div>

                {/* Cast Tags */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                    maxWidth: "280px",
                    overflow: "hidden",
                  }}
                >
                  {strip.castNeeded.slice(0, 3).map((actor) => (
                    <span
                      key={actor}
                      style={{
                        background: "#333333",
                        border: "1px solid #444444",
                        color: "#C4A882",
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {actor}
                    </span>
                  ))}
                  {strip.castNeeded.length > 3 && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9A9080",
                        whiteSpace: "nowrap",
                      }}
                    >
                      +{strip.castNeeded.length - 3}
                    </span>
                  )}
                </div>

                {/* Duration */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                    minWidth: "60px",
                  }}
                >
                  <LucideIcon name="Clock" size={13} color="#9A9080" />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#9A9080",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {strip.estimatedDuration} {t("hours")}
                  </span>
                </div>

                {/* Cost */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#C4A042",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    minWidth: "75px",
                    textAlign: "right",
                  }}
                >
                  {formatCrores(strip.estimatedCost)}
                </div>

                {/* Edit / Delete Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(strip); }}
                    title={t("editScene")}
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#333333";
                      e.currentTarget.style.borderColor = "#4A4A4A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <LucideIcon name="Pencil" size={14} color="#9A9080" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(strip.sceneId); }}
                    title={t("deleteScene")}
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#3A2020";
                      e.currentTarget.style.borderColor = "#C45C5C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <LucideIcon name="Trash2" size={14} color="#C45C5C" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Final day total footer ────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "24px",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #3A3A3A",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LucideIcon name="Film" size={16} color="#9A9080" />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>
              {totalScenes} {t("scenesCount")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LucideIcon name="Clock" size={16} color="#9A9080" />
            <span style={{ fontSize: "13px", color: "#9A9080" }}>
              {t("duration")}:{" "}
              {strips.reduce((sum, s) => sum + s.estimatedDuration, 0)}{" "}
              {t("hours")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LucideIcon name="IndianRupee" size={16} color="#C4A042" />
            <span
              style={{ fontSize: "14px", fontWeight: 700, color: "#C4A042" }}
            >
              {t("cost")}: {formatCrores(totalCost)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Day Breakdown Summary ───────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {breaks.map((db) => {
          const sortedBreaks = [...breaks].sort(
            (a, b) => a.afterOrder - b.afterOrder
          );
          const idx = sortedBreaks.findIndex((b) => b.id === db.id);
          const startOrder = db.afterOrder + 1;
          const endOrder =
            idx + 1 < sortedBreaks.length
              ? sortedBreaks[idx + 1].afterOrder
              : Infinity;

          const dayScenes = sortedStrips.filter(
            (s) => s.order >= startOrder && s.order <= endOrder
          );
          const dayCost = dayScenes.reduce(
            (sum, s) => sum + s.estimatedCost,
            0
          );
          const dayDuration = dayScenes.reduce(
            (sum, s) => sum + s.estimatedDuration,
            0
          );
          const dayConflicts = getConflictsForDay(db.dayNumber);

          return (
            <div
              key={db.id}
              style={{
                background: "#262626",
                border: dayConflicts.length > 0
                  ? "1px solid #C45C5C"
                  : "1px solid #3A3A3A",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#C4A882",
                  }}
                >
                  {t("day")} {db.dayNumber}
                </span>
                {dayConflicts.length > 0 && (
                  <LucideIcon
                    name="AlertTriangle"
                    size={14}
                    color="#E87C7C"
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9A9080",
                  margin: "0 0 8px 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {db.location}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#E8E0D4",
                }}
              >
                <span>
                  {dayScenes.length} {t("scenesCount")}
                </span>
                <span>{dayDuration} {t("hours")}</span>
                <span style={{ color: "#C4A042", fontWeight: 600 }}>
                  {formatCrores(dayCost)}
                </span>
              </div>

              {/* Scene complexity mini-bars */}
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                  marginTop: "10px",
                  height: "4px",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                {dayScenes.map((scene) => {
                  const sceneColor =
                    complexityColors[scene.complexity]?.bg || "#666";
                  return (
                    <div
                      key={scene.sceneId}
                      style={{
                        flex: 1,
                        background: sceneColor,
                        borderRadius: "2px",
                      }}
                    />
                  );
                })}
                {dayScenes.length === 0 && (
                  <div
                    style={{
                      flex: 1,
                      background: "#3A3A3A",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CREATE / EDIT MODAL                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {(showCreateModal || showEditModal) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModals}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "32px",
              width: "560px",
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E0D4",
                  margin: 0,
                }}
              >
                {showCreateModal ? t("addScene") : t("editScene")}
              </h2>
              <button
                onClick={closeModals}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <LucideIcon name="X" size={20} color="#9A9080" />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Row 1: Scene Number + Complexity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#9A9080",
                      marginBottom: "6px",
                    }}
                  >
                    {t("sceneNumber")}
                  </label>
                  <input
                    type="number"
                    value={formData.sceneNumber}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, sceneNumber: parseInt(e.target.value) || 0 }))
                    }
                    style={{
                      width: "100%",
                      background: "#1E1E1E",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#9A9080",
                      marginBottom: "6px",
                    }}
                  >
                    {t("complexityLabel")}
                  </label>
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, complexity: e.target.value as ComplexityType }))
                    }
                    style={{
                      width: "100%",
                      background: "#1E1E1E",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  >
                    {Object.entries(complexityColors).map(([key, color]) => (
                      <option key={key} value={key}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#9A9080",
                    marginBottom: "6px",
                  }}
                >
                  {t("descriptionLabel")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                  style={{
                    width: "100%",
                    background: "#1E1E1E",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Location */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#9A9080",
                    marginBottom: "6px",
                  }}
                >
                  {t("locationLabel")}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, location: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "#1E1E1E",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Cast (comma-separated) */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#9A9080",
                    marginBottom: "6px",
                  }}
                >
                  {t("castLabel")}
                </label>
                <input
                  type="text"
                  value={formData.castNeeded}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, castNeeded: e.target.value }))
                  }
                  placeholder={t("castPlaceholder")}
                  style={{
                    width: "100%",
                    background: "#1E1E1E",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Row 2: Cost + Duration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#9A9080",
                      marginBottom: "6px",
                    }}
                  >
                    {t("costLabel")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.estimatedCost}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, estimatedCost: parseFloat(e.target.value) || 0 }))
                    }
                    style={{
                      width: "100%",
                      background: "#1E1E1E",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#9A9080",
                      marginBottom: "6px",
                    }}
                  >
                    {t("durationLabel")}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.estimatedDuration}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        estimatedDuration: parseFloat(e.target.value) || 0,
                      }))
                    }
                    style={{
                      width: "100%",
                      background: "#1E1E1E",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: "1px solid #3A3A3A",
              }}
            >
              <button
                onClick={closeModals}
                style={{
                  background: "transparent",
                  border: "1px solid #3A3A3A",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color: "#9A9080",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={showCreateModal ? handleCreateScene : handleUpdateScene}
                disabled={!formData.description || !formData.location}
                style={{
                  background:
                    !formData.description || !formData.location
                      ? "#4A4A4A"
                      : "linear-gradient(135deg, #C4A882 0%, #8B7355 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color:
                    !formData.description || !formData.location
                      ? "#666"
                      : "#1A1A1A",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor:
                    !formData.description || !formData.location
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {showCreateModal ? t("createScene") : t("saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION MODAL                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#262626",
              border: "1px solid #C45C5C",
              borderRadius: "16px",
              padding: "32px",
              width: "420px",
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#3A2020",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <LucideIcon name="AlertTriangle" size={28} color="#E87C7C" />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#E8E0D4",
                margin: "0 0 10px 0",
              }}
            >
              {t("deleteScene")}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#9A9080",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              {t("deleteConfirmMsg")}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  background: "transparent",
                  border: "1px solid #3A3A3A",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color: "#9A9080",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => handleDeleteScene(deleteConfirmId)}
                style={{
                  background: "#C45C5C",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
