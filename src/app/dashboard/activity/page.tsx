"use client";

import { useState, useMemo } from "react";
import { activityEvents } from "@/data/mock-data";
import { getInitials } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { activityTranslations } from "@/lib/translations/activity";
import type { ActivityEvent } from "@/lib/types";

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  approval: { bg: "#C4A882", text: "#1A1A1A", icon: "CheckCircle" },
  budget: { bg: "#5B8C5A", text: "#fff", icon: "IndianRupee" },
  schedule: { bg: "#5B7C8C", text: "#fff", icon: "Calendar" },
  vfx: { bg: "#7B68EE", text: "#fff", icon: "Sparkles" },
  marketing: { bg: "#E87C9A", text: "#fff", icon: "Megaphone" },
  access: { bg: "#C4A042", text: "#1A1A1A", icon: "Lock" },
  system: { bg: "#6B6560", text: "#fff", icon: "Settings" },
};

const filterCategories = [
  "all",
  "approval",
  "budget",
  "schedule",
  "vfx",
  "marketing",
  "access",
  "system",
] as const;

const filterLabelKeys: Record<string, string> = {
  all: "all",
  approval: "approvals",
  budget: "budget",
  schedule: "schedule",
  vfx: "vfx",
  marketing: "marketing",
  access: "access",
  system: "system",
};

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");
  return `${h}:${m} ${ampm}`;
}

function getDateKey(timestamp: string): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatFullDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isToday(dateKey: string): boolean {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return dateKey === todayKey;
}

function isYesterday(dateKey: string): boolean {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  return dateKey === yKey;
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "approved":
    case "completed":
    case "success":
      return { bg: "rgba(91, 140, 90, 0.2)", text: "#5B8C5A" };
    case "rejected":
      return { bg: "rgba(196, 92, 92, 0.2)", text: "#C45C5C" };
    case "warning":
      return { bg: "rgba(196, 160, 66, 0.2)", text: "#C4A042" };
    case "pending":
      return { bg: "rgba(91, 124, 140, 0.2)", text: "#5B7C8C" };
    case "active":
      return { bg: "rgba(123, 104, 238, 0.2)", text: "#7B68EE" };
    default:
      return { bg: "rgba(107, 101, 96, 0.2)", text: "#9A9080" };
  }
}

export default function ActivityPage() {
  const { t } = useTranslation(activityTranslations);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const todayKey = getDateKey(new Date().toISOString());
  const totalEvents = activityEvents.length;
  const todaysEventCount = activityEvents.filter(
    (e) => getDateKey(e.timestamp) === todayKey
  ).length;
  const approvalsCount = activityEvents.filter(
    (e) => e.category === "approval"
  ).length;
  const alertsCount = activityEvents.filter(
    (e) => e.metadata?.status === "warning"
  ).length;

  // Filter and group events by date
  const groupedEvents = useMemo(() => {
    // Step 1: Filter by category
    let filtered = activityEvents as ActivityEvent[];
    if (filter !== "all") {
      filtered = filtered.filter((e) => e.category === filter);
    }

    // Step 2: Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) => e.description.toLowerCase().includes(q)
      );
    }

    // Step 3: Group by date
    const groups: Record<string, ActivityEvent[]> = {};
    filtered.forEach((event) => {
      const key = getDateKey(event.timestamp);
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    // Step 4: Sort groups newest first, and events within groups newest first
    const sortedKeys = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedKeys.map((key) => ({
      dateKey: key,
      label: isToday(key)
        ? `${t("today")} \u2014 ${formatFullDate(key)}`
        : isYesterday(key)
          ? `${t("yesterday")} \u2014 ${formatFullDate(key)}`
          : formatFullDate(key),
      events: groups[key].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }));
  }, [filter, searchQuery, t]);

  const stats = [
    {
      label: t("totalEvents"),
      value: totalEvents,
      icon: "Activity",
      color: "#C4A882",
    },
    {
      label: t("todaysEvents"),
      value: todaysEventCount,
      icon: "Clock",
      color: "#5B8C5A",
    },
    {
      label: t("approvalsCount"),
      value: approvalsCount,
      icon: "CheckCircle",
      color: "#5B7C8C",
    },
    {
      label: t("alertsCount"),
      value: alertsCount,
      icon: "AlertTriangle",
      color: "#C45C5C",
    },
  ];

  return (
    <div style={{ padding: "2rem", background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "0.75rem",
            background: "rgba(196, 168, 130, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LucideIcon name="Activity" size={24} color="#C4A882" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
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
              fontSize: "0.875rem",
              color: "#9A9080",
              margin: "0.25rem 0 0 0",
            }}
          >
            {t("pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.625rem",
                background: `${stat.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LucideIcon name={stat.icon} size={20} color={stat.color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#E8E0D4",
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9A9080",
                  marginTop: "0.15rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar + Filter Chips */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <LucideIcon name="Eye" size={16} color="#6B6560" />
          </div>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              background: "#333333",
              border: "1px solid #3A3A3A",
              borderRadius: "0.625rem",
              color: "#E8E0D4",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filter Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "#6B6560",
              marginRight: "0.25rem",
            }}
          >
            {t("filterBy")}:
          </span>
          {filterCategories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "999px",
                  border: isActive ? "1px solid #C4A882" : "1px solid #3A3A3A",
                  background: isActive ? "#C4A882" : "#333333",
                  color: isActive ? "#1A1A1A" : "#9A9080",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                {cat !== "all" && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: categoryColors[cat]?.bg || "#6B6560",
                      display: "inline-block",
                    }}
                  />
                )}
                {t(filterLabelKeys[cat])}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Content */}
      {groupedEvents.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            color: "#6B6560",
          }}
        >
          <LucideIcon name="Activity" size={48} color="#3A3A3A" />
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1rem",
              color: "#6B6560",
            }}
          >
            {t("noEvents")}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {groupedEvents.map((group) => (
            <div key={group.dateKey}>
              {/* Date Section Header */}
              <div
                style={{
                  background: "#333333",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <LucideIcon name="Calendar" size={14} color="#C4A882" />
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#C4A882",
                    letterSpacing: "0.05em",
                  }}
                >
                  {group.label}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B6560",
                    marginLeft: "auto",
                  }}
                >
                  {group.events.length} event{group.events.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Events in this date group */}
              <div
                style={{
                  position: "relative",
                  paddingLeft: "2rem",
                }}
              >
                {/* Vertical timeline line */}
                <div
                  style={{
                    position: "absolute",
                    left: "0.55rem",
                    top: "0.5rem",
                    bottom: "0.5rem",
                    width: "2px",
                    background:
                      "linear-gradient(to bottom, #C4A882, rgba(196, 168, 130, 0.15))",
                    borderRadius: "1px",
                  }}
                />

                {group.events.map((event, idx) => {
                  const catColor = categoryColors[event.category] || {
                    bg: "#6B6560",
                    text: "#fff",
                    icon: "Circle",
                  };
                  return (
                    <div
                      key={event.id}
                      style={{
                        position: "relative",
                        marginBottom:
                          idx === group.events.length - 1 ? 0 : "0.75rem",
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.7rem",
                          top: "1.1rem",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: catColor.bg,
                          border: "2px solid #262626",
                          zIndex: 1,
                        }}
                      />

                      {/* Event Card */}
                      <div
                        style={{
                          background: "#262626",
                          border: "1px solid #3A3A3A",
                          borderRadius: "0.75rem",
                          padding: "1rem 1.25rem",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "1rem",
                          transition: "border-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#4A4A4A";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#3A3A3A";
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            background: `${catColor.bg}22`,
                            border: `1px solid ${catColor.bg}44`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: catColor.bg,
                          }}
                        >
                          {getInitials(event.user)}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Top row: user, role, time */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.35rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "#E8E0D4",
                              }}
                            >
                              {event.user}
                            </span>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                color: "#9A9080",
                                background: "#333333",
                                padding: "0.125rem 0.5rem",
                                borderRadius: "999px",
                                border: "1px solid #3A3A3A",
                              }}
                            >
                              {event.userRole}
                            </span>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#6B6560",
                                marginLeft: "auto",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <LucideIcon
                                name="Clock"
                                size={12}
                                color="#6B6560"
                              />
                              {formatTime(event.timestamp)}
                            </span>
                          </div>

                          {/* Description */}
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "#B8B0A4",
                              margin: 0,
                              lineHeight: 1.5,
                            }}
                          >
                            {event.description}
                          </p>

                          {/* Metadata tags */}
                          {event.metadata && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginTop: "0.625rem",
                                flexWrap: "wrap",
                              }}
                            >
                              {/* Amount badge */}
                              {event.metadata.amount && (
                                <span
                                  style={{
                                    fontSize: "0.725rem",
                                    fontWeight: 600,
                                    color: "#C4A882",
                                    background: "rgba(196, 168, 130, 0.12)",
                                    border: "1px solid rgba(196, 168, 130, 0.25)",
                                    padding: "0.2rem 0.625rem",
                                    borderRadius: "999px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <LucideIcon
                                    name="IndianRupee"
                                    size={11}
                                    color="#C4A882"
                                  />
                                  {event.metadata.amount} Cr
                                </span>
                              )}

                              {/* Module badge */}
                              {event.metadata.module && (
                                <span
                                  style={{
                                    fontSize: "0.725rem",
                                    color: "#9A9080",
                                    background: "rgba(154, 144, 128, 0.1)",
                                    border: "1px solid rgba(154, 144, 128, 0.2)",
                                    padding: "0.2rem 0.625rem",
                                    borderRadius: "999px",
                                  }}
                                >
                                  {event.metadata.module}
                                </span>
                              )}

                              {/* Status badge */}
                              {event.metadata.status && (
                                <span
                                  style={{
                                    fontSize: "0.725rem",
                                    fontWeight: 500,
                                    color: getStatusColor(event.metadata.status).text,
                                    background: getStatusColor(event.metadata.status).bg,
                                    border: `1px solid ${getStatusColor(event.metadata.status).text}33`,
                                    padding: "0.2rem 0.625rem",
                                    borderRadius: "999px",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {event.metadata.status}
                                </span>
                              )}

                              {/* Old/New value badges */}
                              {event.metadata.oldValue && event.metadata.newValue && (
                                <span
                                  style={{
                                    fontSize: "0.725rem",
                                    color: "#9A9080",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "#6B6560",
                                    }}
                                  >
                                    {event.metadata.oldValue}
                                  </span>
                                  <span style={{ color: "#6B6560" }}>{"\u2192"}</span>
                                  <span style={{ color: "#C4A882" }}>
                                    {event.metadata.newValue}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Category Badge (right side) */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            background: `${catColor.bg}18`,
                            border: `1px solid ${catColor.bg}33`,
                            padding: "0.3rem 0.75rem",
                            borderRadius: "999px",
                            flexShrink: 0,
                            alignSelf: "center",
                          }}
                        >
                          <LucideIcon
                            name={catColor.icon}
                            size={13}
                            color={catColor.bg}
                          />
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 500,
                              color: catColor.bg,
                              textTransform: "capitalize",
                            }}
                          >
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
