"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { contentCalendarTranslations } from "@/lib/translations/content-calendar";

const eventTypes = {
  teaser: { color: "#C4A882", label: "Teaser" },
  trailer: { color: "#5B8C5A", label: "Trailer" },
  song: { color: "#5B7C8C", label: "Song Release" },
  press: { color: "#C4A042", label: "Press Meet" },
  social: { color: "#E1306C", label: "Social Push" },
  bts: { color: "#9A9080", label: "BTS Content" },
};

const calendarEvents = [
  { id: 1, type: "teaser", title: "First Teaser Launch", date: "2026-02-15", platform: "YouTube", status: "scheduled" },
  { id: 2, type: "song", title: "Song #1 - Angaaron Release", date: "2026-02-20", platform: "Music Platforms", status: "scheduled" },
  { id: 3, type: "social", title: "Instagram Reels Campaign", date: "2026-02-22", platform: "Instagram", status: "scheduled" },
  { id: 4, type: "press", title: "Pre-Release Press Conference", date: "2026-02-25", platform: "Live Event", status: "scheduled" },
  { id: 5, type: "trailer", title: "Official Trailer Launch", date: "2026-03-01", platform: "YouTube", status: "scheduled" },
  { id: 6, type: "bts", title: "Making Video - Action Sequences", date: "2026-03-05", platform: "YouTube", status: "scheduled" },
  { id: 7, type: "song", title: "Song #2 - Romantic Track", date: "2026-03-10", platform: "Music Platforms", status: "scheduled" },
  { id: 8, type: "social", title: "Twitter Trend Campaign", date: "2026-03-12", platform: "X", status: "scheduled" },
  { id: 9, type: "press", title: "Regional Media Tour - AP", date: "2026-03-15", platform: "Live Event", status: "scheduled" },
  { id: 10, type: "social", title: "Fan Engagement Week", date: "2026-03-18", platform: "Multi-Platform", status: "scheduled" },
  { id: 11, type: "song", title: "Item Song Reveal", date: "2026-03-22", platform: "Music Platforms", status: "scheduled" },
  { id: 12, type: "bts", title: "VFX Breakdown Teaser", date: "2026-03-25", platform: "YouTube", status: "scheduled" },
  { id: 13, type: "press", title: "Mumbai Promotional Event", date: "2026-04-01", platform: "Live Event", status: "scheduled" },
  { id: 14, type: "social", title: "Countdown Campaign Begins", date: "2026-04-05", platform: "Multi-Platform", status: "scheduled" },
  { id: 15, type: "trailer", title: "Final Trailer Cut", date: "2026-04-10", platform: "YouTube", status: "scheduled" },
];

export default function ContentCalendarPage() {
  const { t } = useTranslation(contentCalendarTranslations);
  const [selectedView, setSelectedView] = useState<"calendar" | "timeline">("calendar");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(2); // February = 2
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const [newEvent, setNewEvent] = useState({
    type: "social",
    title: "",
    date: "",
    platform: "",
    notes: "",
  });

  const handleAddEvent = () => {
    console.log("Adding event:", newEvent);
    setShowAddModal(false);
    setNewEvent({
      type: "social",
      title: "",
      date: "",
      platform: "",
      notes: "",
    });
  };

  // Generate calendar days for selected month
  const generateCalendarDays = (month: number) => {
    const year = 2026;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty days for offset
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDate = (day: number | null, month: number) => {
    if (!day) return [];
    const dateStr = `2026-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((event) => event.date === dateStr);
  };

  const upcomingEvents = calendarEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  const eventTypeStats = Object.keys(eventTypes).map((type) => ({
    type,
    count: calendarEvents.filter((e) => e.type === type).length,
  }));

  const selectedEventData = calendarEvents.find((e) => e.id === selectedEvent);

  const calendarDays = generateCalendarDays(selectedMonth);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={{ padding: "32px", background: "#0F0F0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
            {t("pageTitle")}
          </h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: "#C4A882",
                color: "#0F0F0F",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {t("addEvent")}
            </button>
          </div>
        </div>
        <p style={{ color: "#9A9080", fontSize: "14px", margin: 0 }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* View Toggle */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setSelectedView("calendar")}
          style={{
            padding: "10px 24px",
            background: selectedView === "calendar" ? "#C4A882" : "#1A1A1A",
            border: selectedView === "calendar" ? "1px solid #C4A882" : "1px solid #2A2A2A",
            borderRadius: "12px",
            color: selectedView === "calendar" ? "#0F0F0F" : "#E8E0D4",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LucideIcon name="Calendar" size={16} />
          {t("calendarView")}
        </button>
        <button
          onClick={() => setSelectedView("timeline")}
          style={{
            padding: "10px 24px",
            background: selectedView === "timeline" ? "#C4A882" : "#1A1A1A",
            border: selectedView === "timeline" ? "1px solid #C4A882" : "1px solid #2A2A2A",
            borderRadius: "12px",
            color: selectedView === "timeline" ? "#0F0F0F" : "#E8E0D4",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LucideIcon name="GitBranch" size={16} />
          {t("timelineView")}
        </button>
      </div>

      {/* Event Type Legend */}
      <div style={{ background: "#1A1A1A", padding: "20px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "#9A9080", fontSize: "13px", fontWeight: "600" }}>{t("eventTypes")}</span>
          {Object.entries(eventTypes).map(([key, value]) => {
            const stat = eventTypeStats.find((s) => s.type === key);
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "3px",
                    background: value.color,
                  }}
                />
                <span style={{ color: "#E8E0D4", fontSize: "13px" }}>
                  {value.label}
                  <span style={{ color: "#6B6560", marginLeft: "6px" }}>({stat?.count || 0})</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedView === "calendar" ? (
        <>
          {/* Month Selector */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" }}>
            <button
              onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
              disabled={selectedMonth === 0}
              style={{
                padding: "8px 16px",
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                color: "#E8E0D4",
                cursor: selectedMonth === 0 ? "not-allowed" : "pointer",
                opacity: selectedMonth === 0 ? 0.5 : 1,
              }}
            >
              ‹ {t("prev")}
            </button>
            <div style={{ color: "#C4A882", fontSize: "18px", fontWeight: "600" }}>
              {monthNames[selectedMonth]} 2026
            </div>
            <button
              onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
              disabled={selectedMonth === 11}
              style={{
                padding: "8px 16px",
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                color: "#E8E0D4",
                cursor: selectedMonth === 11 ? "not-allowed" : "pointer",
                opacity: selectedMonth === 11 ? 0.5 : 1,
              }}
            >
              {t("next")} ›
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "16px" }}>
              {[t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].map((day) => (
                <div
                  key={day}
                  style={{
                    color: "#9A9080",
                    fontSize: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
              {calendarDays.map((day, idx) => {
                const events = getEventsForDate(day, selectedMonth);
                const isToday =
                  day &&
                  new Date().getDate() === day &&
                  new Date().getMonth() === selectedMonth &&
                  new Date().getFullYear() === 2026;

                return (
                  <div
                    key={idx}
                    style={{
                      minHeight: "100px",
                      background: day ? "#242424" : "transparent",
                      border: isToday ? "2px solid #C4A882" : "1px solid #2A2A2A",
                      borderRadius: "8px",
                      padding: "8px",
                      position: "relative",
                    }}
                  >
                    {day && (
                      <>
                        <div
                          style={{
                            color: isToday ? "#C4A882" : "#E8E0D4",
                            fontSize: "14px",
                            fontWeight: isToday ? "700" : "600",
                            marginBottom: "6px",
                          }}
                        >
                          {day}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {events.map((event) => (
                            <div
                              key={event.id}
                              onClick={() => setSelectedEvent(event.id)}
                              style={{
                                background: eventTypes[event.type as keyof typeof eventTypes].color,
                                padding: "4px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: "600",
                                color: "#0F0F0F",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Timeline View */
        <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A", marginBottom: "32px" }}>
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "12px",
                top: "0",
                bottom: "0",
                width: "2px",
                background: "#2A2A2A",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {calendarEvents.map((event, idx) => (
                <div key={event.id} style={{ position: "relative", paddingLeft: "32px" }}>
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: eventTypes[event.type as keyof typeof eventTypes].color,
                      border: "3px solid #1A1A1A",
                      zIndex: 1,
                    }}
                  />

                  {/* Content */}
                  <div
                    onClick={() => setSelectedEvent(event.id)}
                    style={{
                      background: "#242424",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: "1px solid #2A2A2A",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#C4A882";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2A2A2A";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                          {event.title}
                        </h4>
                        <div style={{ color: "#9A9080", fontSize: "13px" }}>
                          {formatDate(event.date)} • {event.platform}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "4px 12px",
                          background: eventTypes[event.type as keyof typeof eventTypes].color + "20",
                          color: eventTypes[event.type as keyof typeof eventTypes].color,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {eventTypes[event.type as keyof typeof eventTypes].label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events List */}
      <div style={{ background: "#1A1A1A", padding: "24px", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
        <h3 style={{ color: "#E8E0D4", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {t("upcomingEvents")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {upcomingEvents.map((event, idx) => {
            const daysUntil = Math.ceil(
              (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                style={{
                  background: "#242424",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: "1px solid #2A2A2A",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C4A882";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2A2A2A";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: eventTypes[event.type as keyof typeof eventTypes].color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0F0F0F",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {new Date(event.date).getDate()}
                  </div>
                  <div>
                    <h4 style={{ color: "#E8E0D4", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                      {event.title}
                    </h4>
                    <div style={{ color: "#9A9080", fontSize: "13px" }}>
                      {formatDate(event.date)} • {event.platform}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      padding: "6px 14px",
                      background: eventTypes[event.type as keyof typeof eventTypes].color + "20",
                      color: eventTypes[event.type as keyof typeof eventTypes].color,
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {eventTypes[event.type as keyof typeof eventTypes].label}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: daysUntil <= 7 ? "#C45C5C" : "#9A9080", fontSize: "18px", fontWeight: "700" }}>
                      {daysUntil}
                    </div>
                    <div style={{ color: "#6B6560", fontSize: "11px" }}>{t("days")}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEventData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>
                  {selectedEventData.title}
                </h2>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    background: eventTypes[selectedEventData.type as keyof typeof eventTypes].color + "20",
                    color: eventTypes[selectedEventData.type as keyof typeof eventTypes].color,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {eventTypes[selectedEventData.type as keyof typeof eventTypes].label}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9A9080",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "0",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#242424", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("date")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600" }}>
                  {formatDate(selectedEventData.date)}
                </div>
              </div>

              <div style={{ background: "#242424", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("platformLabel")}</div>
                <div style={{ color: "#E8E0D4", fontSize: "18px", fontWeight: "600" }}>
                  {selectedEventData.platform}
                </div>
              </div>

              <div style={{ background: "#242424", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: "#6B6560", fontSize: "12px", marginBottom: "4px" }}>{t("status")}</div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    background: "#5B8C5A20",
                    color: "#5B8C5A",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedEventData.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h2 style={{ color: "#E8E0D4", fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
              {t("addNewEvent")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("eventType")}
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("eventTitle")}
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterEventTitle")}
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("dateLabel")}
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("platformInput")}
                </label>
                <input
                  type="text"
                  value={newEvent.platform}
                  onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("platformPlaceholder")}
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {t("notesOptional")}
                </label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    minHeight: "80px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder={t("notesPlaceholder")}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("cancelBtn")}
                </button>
                <button
                  onClick={handleAddEvent}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#C4A882",
                    border: "none",
                    borderRadius: "8px",
                    color: "#0F0F0F",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addEventBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
