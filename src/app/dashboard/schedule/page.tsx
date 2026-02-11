"use client";

import { useState, useMemo } from "react";
import { shootingSchedule, scenes } from "@/data/mock-data";
import { cn, formatDate, formatShortDate, generateId } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { ShootDay, Scene } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { scheduleTranslations } from "@/lib/translations/schedule";

type StatusFilter = "all" | "completed" | "planned" | "delayed";

const statusColors = {
  planned: { bg: "#5B7C8C20", border: "#5B7C8C", text: "#5B7C8C" },
  completed: { bg: "#5B8C5A20", border: "#5B8C5A", text: "#5B8C5A" },
  delayed: { bg: "#C45C5C20", border: "#C45C5C", text: "#C45C5C" },
  cancelled: { bg: "#6B656020", border: "#6B6560", text: "#6B6560" },
};

export default function SchedulePage() {
  const { t } = useTranslation(scheduleTranslations);
  const [schedule, setSchedule] = useState<ShootDay[]>(shootingSchedule);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShootDay, setNewShootDay] = useState({
    dayNumber: shootingSchedule.length + 1,
    date: "",
    location: "",
    scenes: [] as string[],
    notes: "",
  });

  // Filter schedule
  const filteredSchedule = useMemo(() => {
    return schedule.filter((day) => {
      return statusFilter === "all" || day.status === statusFilter;
    });
  }, [schedule, statusFilter]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, ShootDay[]> = {};

    filteredSchedule.forEach((day) => {
      const date = new Date(day.date);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(day);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(a[1][0].date).getTime() - new Date(b[1][0].date).getTime();
    });
  }, [filteredSchedule]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = schedule.length;
    const completed = schedule.filter((d) => d.status === "completed").length;
    const planned = schedule.filter((d) => d.status === "planned").length;
    const delayed = schedule.filter((d) => d.status === "delayed").length;
    const remaining = planned + delayed;

    // Calculate days behind (simple approximation)
    const today = new Date();
    const expectedCompletedDays = schedule.filter(
      (d) => new Date(d.date) < today
    ).length;
    const daysBehind = Math.max(0, expectedCompletedDays - completed);

    return {
      totalDays,
      completed,
      planned,
      delayed,
      remaining,
      daysBehind,
    };
  }, [schedule]);

  // Get upcoming shoot days
  const upcomingDays = useMemo(() => {
    const today = new Date();
    return schedule
      .filter((day) => new Date(day.date) >= today && day.status === "planned")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [schedule]);

  // Calculate location frequency
  const locationFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    schedule.forEach((day) => {
      freq[day.location] = (freq[day.location] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [schedule]);

  // Schedule health
  const scheduleHealth = useMemo(() => {
    const onTime = stats.completed;
    const total = stats.completed + stats.delayed;
    const percentage = total > 0 ? (onTime / total) * 100 : 100;
    return {
      onTimeCount: onTime,
      delayedCount: stats.delayed,
      percentage,
    };
  }, [stats]);

  const getSceneDetails = (sceneId: string): Scene | undefined => {
    return scenes.find((s) => s.id === sceneId);
  };

  const handleAddShootDay = () => {
    if (!newShootDay.date || !newShootDay.location) return;

    const day: ShootDay = {
      id: generateId(),
      dayNumber: newShootDay.dayNumber,
      date: newShootDay.date,
      location: newShootDay.location,
      scenes: newShootDay.scenes,
      status: "planned",
      notes: newShootDay.notes || undefined,
    };

    setSchedule([...schedule, day].sort((a, b) => a.dayNumber - b.dayNumber));
    setShowAddModal(false);
    setNewShootDay({
      dayNumber: schedule.length + 2,
      date: "",
      location: "",
      scenes: [],
      notes: "",
    });
  };

  const toggleSceneSelection = (sceneId: string) => {
    const scenes = newShootDay.scenes.includes(sceneId)
      ? newShootDay.scenes.filter((id) => id !== sceneId)
      : [...newShootDay.scenes, sceneId];
    setNewShootDay({ ...newShootDay, scenes });
  };

  return (
    <div style={{ background: "#1A1A1A", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              padding: "12px",
              background: "#262626",
              borderRadius: "12px",
              border: "1px solid #3A3A3A"
            }}>
              <LucideIcon name="Calendar" size={28} style={{ color: "#C4A882" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                {t("pageTitle")}
              </h1>
              <p style={{ fontSize: "14px", color: "#9A9080", margin: "4px 0 0 0" }}>
                {t("pageSubtitle")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              padding: "8px 16px",
              background: "#C4A88220",
              borderRadius: "12px",
              border: "1px solid #C4A882"
            }}>
              <span style={{ fontSize: "14px", color: "#C4A882", fontWeight: "600" }}>
                {t("dayOf")} {stats.completed} {t("of")} {stats.totalDays}
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: "#C4A882",
                border: "1px solid #C4A882",
                borderRadius: "12px",
                color: "#1A1A1A",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <LucideIcon name="Calendar" size={18} />
              {t("addShootDay")}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {[
            { label: t("totalShootDays"), value: stats.totalDays, icon: "Calendar", color: "#C4A882" },
            { label: t("completed"), value: stats.completed, icon: "CheckCircle", color: "#5B8C5A" },
            { label: t("inProgress"), value: "1", icon: "Camera", color: "#C4A042" },
            { label: t("delayed"), value: stats.delayed, icon: "AlertTriangle", color: "#C45C5C" },
            { label: t("remaining"), value: stats.remaining, icon: "Clock", color: "#5B7C8C" },
            { label: t("daysBehind"), value: stats.daysBehind, icon: "TrendingUp", color: stats.daysBehind > 0 ? "#C45C5C" : "#5B8C5A" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <LucideIcon name={stat.icon} size={20} style={{ color: stat.color }} />
                <span style={{ fontSize: "13px", color: "#9A9080", fontWeight: "500" }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Health & Upcoming Days */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Schedule Health */}
          <div style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <LucideIcon name="Shield" size={20} style={{ color: "#C4A882" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
                {t("scheduleHealth")}
              </h3>
            </div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", fontWeight: "700", color: "#C4A882" }}>
                {scheduleHealth.percentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: "13px", color: "#9A9080" }}>
                {t("onTimeCompletionRate")}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#5B8C5A" }}>
                  {scheduleHealth.onTimeCount}
                </div>
                <div style={{ fontSize: "12px", color: "#9A9080" }}>{t("onTime")}</div>
              </div>
              <div style={{ width: "1px", background: "#3A3A3A" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#C45C5C" }}>
                  {scheduleHealth.delayedCount}
                </div>
                <div style={{ fontSize: "12px", color: "#9A9080" }}>{t("delayed")}</div>
              </div>
            </div>
          </div>

          {/* Location Frequency */}
          <div style={{
            background: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <LucideIcon name="MapPin" size={20} style={{ color: "#C4A882" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
                {t("topLocations")}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {locationFrequency.map(([location, count]) => {
                const maxCount = locationFrequency[0][1];
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={location}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#9A9080" }}>
                        {location}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#E8E0D4" }}>
                        {count} {t("days")}
                      </span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      background: "#333333",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#C4A882",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Shoot Days */}
        <div style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <LucideIcon name="Rocket" size={20} style={{ color: "#C4A882" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
              {t("next5UpcomingDays")}
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {upcomingDays.map((day) => (
              <div
                key={day.id}
                style={{
                  padding: "16px",
                  background: "#333333",
                  border: "1px solid #C4A88240",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{
                    padding: "4px 10px",
                    background: "#C4A88230",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#C4A882",
                  }}>
                    {t("dayOf")} {day.dayNumber}
                  </div>
                  <div style={{ fontSize: "13px", color: "#9A9080" }}>
                    {formatShortDate(day.date)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <LucideIcon name="MapPin" size={14} style={{ color: "#9A9080" }} />
                  <span style={{ fontSize: "14px", color: "#E8E0D4" }}>{day.location}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#6B6560" }}>
                  {day.scenes.length} {day.scenes.length !== 1 ? t("scenesCount") : t("sceneCount")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter Bar */}
        <div style={{
          background: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {(["all", "completed", "planned", "delayed"] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "10px 20px",
                  background: statusFilter === status ? "#C4A882" : "#333333",
                  border: `1px solid ${statusFilter === status ? "#C4A882" : "#3A3A3A"}`,
                  borderRadius: "8px",
                  color: statusFilter === status ? "#1A1A1A" : "#9A9080",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {groupedByMonth.map(([month, days]) => (
            <div key={month}>
              <div style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#C4A882",
                marginBottom: "16px",
                paddingLeft: "8px",
              }}>
                {month}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "16px" }}>
                {days.map((day) => {
                  const isExpanded = expandedDay === day.id;
                  const dayScenes = day.scenes.map(getSceneDetails).filter(Boolean) as Scene[];

                  return (
                    <div
                      key={day.id}
                      style={{
                        background: "#262626",
                        border: `1px solid ${statusColors[day.status].border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Card Header */}
                      <div
                        onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                        style={{
                          padding: "20px",
                          cursor: "pointer",
                          background: `${statusColors[day.status].bg}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                          <div>
                            <div style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: statusColors[day.status].text,
                              marginBottom: "4px",
                            }}>
                              {t("dayOf")} {day.dayNumber}
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                              {formatDate(day.date)}
                            </div>
                          </div>
                          <div style={{
                            padding: "6px 12px",
                            background: statusColors[day.status].border,
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#1A1A1A",
                            textTransform: "capitalize",
                          }}>
                            {day.status}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <LucideIcon name="MapPin" size={16} style={{ color: "#C4A882" }} />
                          <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                            {day.location}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <LucideIcon name="Film" size={16} style={{ color: "#9A9080" }} />
                          <span style={{ fontSize: "13px", color: "#9A9080" }}>
                            {day.scenes.length} {day.scenes.length !== 1 ? t("scenesCount") : t("sceneCount")}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ padding: "20px", borderTop: "1px solid #3A3A3A" }}>
                          {/* Scenes */}
                          {dayScenes.length > 0 && (
                            <div style={{ marginBottom: "16px" }}>
                              <div style={{ fontSize: "13px", color: "#9A9080", fontWeight: "600", marginBottom: "12px" }}>
                                {t("scenesBeingShot")}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {dayScenes.map((scene) => (
                                  <div
                                    key={scene.id}
                                    style={{
                                      padding: "12px",
                                      background: "#333333",
                                      border: "1px solid #3A3A3A",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#C4A882" }}>
                                        {t("sceneLabel")} {scene.sceneNumber}
                                      </span>
                                      <span style={{
                                        padding: "2px 8px",
                                        background: "#C4A88220",
                                        border: "1px solid #C4A88240",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        color: "#C4A882",
                                        textTransform: "capitalize",
                                      }}>
                                        {scene.complexity}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#E8E0D4" }}>
                                      {scene.description}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {day.notes && (
                            <div style={{
                              padding: "12px",
                              background: "#333333",
                              border: "1px solid #3A3A3A",
                              borderRadius: "8px",
                              marginTop: "12px",
                            }}>
                              <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "4px" }}>
                                {t("notes")}
                              </div>
                              <div style={{ fontSize: "13px", color: "#E8E0D4" }}>
                                {day.notes}
                              </div>
                            </div>
                          )}

                          {/* Mock Crew Assignment */}
                          <div style={{
                            padding: "12px",
                            background: "#333333",
                            border: "1px solid #3A3A3A",
                            borderRadius: "8px",
                            marginTop: "12px",
                          }}>
                            <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "8px" }}>
                              {t("crewAssigned")}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {["Sukumar", "Miroslaw", "Naveen Nooli"].map((crew) => (
                                <div
                                  key={crew}
                                  style={{
                                    padding: "4px 10px",
                                    background: "#1A1A1A",
                                    border: "1px solid #3A3A3A",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    color: "#9A9080",
                                  }}
                                >
                                  {crew}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Shoot Day Modal */}
        {showAddModal && (
          <div
            onClick={() => setShowAddModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#262626",
                border: "1px solid #3A3A3A",
                borderRadius: "20px",
                padding: "32px",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4", marginBottom: "24px" }}>
                {t("addShootDayTitle")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                      {t("dayNumber")}
                    </label>
                    <input
                      type="number"
                      value={newShootDay.dayNumber}
                      onChange={(e) => setNewShootDay({ ...newShootDay, dayNumber: parseInt(e.target.value) })}
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
                  <div>
                    <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                      {t("date")}
                    </label>
                    <input
                      type="date"
                      value={newShootDay.date}
                      onChange={(e) => setNewShootDay({ ...newShootDay, date: e.target.value })}
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
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    value={newShootDay.location}
                    onChange={(e) => setNewShootDay({ ...newShootDay, location: e.target.value })}
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

                <div>
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("selectScenes")}
                  </label>
                  <div style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "12px",
                    background: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                  }}>
                    {scenes.map((scene) => (
                      <div
                        key={scene.id}
                        onClick={() => toggleSceneSelection(scene.id)}
                        style={{
                          padding: "10px",
                          marginBottom: "8px",
                          background: newShootDay.scenes.includes(scene.id) ? "#C4A88220" : "#262626",
                          border: `1px solid ${newShootDay.scenes.includes(scene.id) ? "#C4A882" : "#3A3A3A"}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="checkbox"
                            checked={newShootDay.scenes.includes(scene.id)}
                            readOnly
                            style={{ width: "16px", height: "16px", cursor: "pointer" }}
                          />
                          <div>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#C4A882", marginRight: "8px" }}>
                              {t("sceneLabel")} {scene.sceneNumber}
                            </span>
                            <span style={{ fontSize: "13px", color: "#E8E0D4" }}>
                              {scene.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("notesOptional")}
                  </label>
                  <textarea
                    value={newShootDay.notes}
                    onChange={(e) => setNewShootDay({ ...newShootDay, notes: e.target.value })}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    onClick={handleAddShootDay}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#C4A882",
                      border: "1px solid #C4A882",
                      borderRadius: "8px",
                      color: "#1A1A1A",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("addShootDay")}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#9A9080",
                      fontSize: "15px",
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
    </div>
  );
}
