"use client";

import { useState, useEffect } from "react";
import { liveStreamSessions, streamActivityLog, liveCameras } from "@/data/mock-data";
import { formatCrores } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { liveProductionTranslations } from "@/lib/translations/live-production";
import type { LiveCamera, LiveStreamSession } from "@/lib/types";

// ─── Timecode display ──────────────────────────────────────
function useTimecode(startIso: string) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    function update() {
      const start = new Date(startIso).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - start) / 1000));
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      const f = String(Math.floor(Math.random() * 24)).padStart(2, "0");
      setElapsed(`${h}:${m}:${s}:${f}`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startIso]);

  return elapsed;
}

// ─── Camera feed placeholder (animated) ────────────────────
function CameraFeed({
  camera,
  isMain,
  session,
  onClick,
}: {
  camera: LiveCamera;
  isMain?: boolean;
  session: LiveStreamSession;
  onClick?: () => void;
}) {
  const timecode = useTimecode(session.startTime);
  const isLive = camera.status === "live";
  const height = isMain ? 420 : 130;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        height,
        borderRadius: isMain ? 16 : 12,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        border: `1px solid ${isLive ? "rgba(220,60,60,0.3)" : "#3A3A3A"}`,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.borderColor = isLive ? "rgba(220,60,60,0.6)" : "#C4A882";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.borderColor = isLive ? "rgba(220,60,60,0.3)" : "#3A3A3A";
      }}
    >
      {/* Animated background */}
      <div
        className="live-feed-bg live-feed-scanline live-feed-sweep"
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* HUD Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, padding: isMain ? 20 : 10 }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isLive && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(220,60,60,0.85)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: isMain ? 11 : 9,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: 1,
                }}
              >
                <span
                  className="animate-live-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                    flexShrink: 0,
                  }}
                />
                LIVE
              </span>
            )}
            {isLive && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(0,0,0,0.5)",
                  padding: "3px 7px",
                  borderRadius: 4,
                  fontSize: isMain ? 10 : 8,
                  fontWeight: 600,
                  color: "#E85C5C",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E85C5C" }} />
                REC
              </span>
            )}
            {camera.status === "standby" && (
              <span
                style={{
                  background: "rgba(196,160,66,0.7)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: isMain ? 11 : 9,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: 1,
                }}
              >
                STANDBY
              </span>
            )}
          </div>

          {/* Camera label */}
          <span
            style={{
              background: "rgba(0,0,0,0.55)",
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: isMain ? 11 : 9,
              fontWeight: 600,
              color: "#C4A882",
              letterSpacing: 0.5,
            }}
          >
            {camera.label.split("—")[0]?.trim()}
          </span>
        </div>

        {/* Bottom HUD */}
        <div
          style={{
            position: "absolute",
            bottom: isMain ? 20 : 10,
            left: isMain ? 20 : 10,
            right: isMain ? 20 : 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Timecode */}
          <span
            className="animate-timecode"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: isMain ? 14 : 10,
              fontWeight: 700,
              color: isLive ? "#E8E0D4" : "#6B6560",
              background: "rgba(0,0,0,0.5)",
              padding: "2px 8px",
              borderRadius: 3,
              letterSpacing: 1,
            }}
          >
            {isLive ? timecode : "00:00:00:00"}
          </span>

          {/* Scene watermark */}
          {isMain && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(196,168,130,0.35)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              SC{session.sceneNumber} · PUSHPA 3
            </span>
          )}

          {/* Resolution */}
          <span
            style={{
              fontSize: isMain ? 10 : 8,
              color: "#6B6560",
              background: "rgba(0,0,0,0.5)",
              padding: "2px 6px",
              borderRadius: 3,
            }}
          >
            {camera.resolution}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function LiveProductionPage() {
  const { t } = useTranslation(liveProductionTranslations);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("cam_a");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("sess_001");

  const activeSession = liveStreamSessions.find((s) => s.id === selectedSessionId) ?? liveStreamSessions[0];
  const mainCamera = liveCameras.find((c) => c.id === selectedCameraId) ?? liveCameras[0];

  const sortedLog = [...streamActivityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const statusColor: Record<string, string> = {
    live: "#5B8C5A",
    completed: "#9A9080",
    scheduled: "#5B7C8C",
    paused: "#C4A042",
  };

  const logTypeIcon: Record<string, { icon: string; color: string }> = {
    scene_start: { icon: "Play", color: "#5B8C5A" },
    scene_wrap: { icon: "CheckCircle", color: "#C4A882" },
    shot_approved: { icon: "Check", color: "#5B8C5A" },
    viewer_joined: { icon: "Eye", color: "#5B7C8C" },
    alert: { icon: "AlertTriangle", color: "#C45C5C" },
  };

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }} className="animate-fade-in">
      {/* ─── Header ─────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(220,60,60,0.2), rgba(196,168,130,0.15))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon name="Radio" size={20} color="#E85C5C" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#E8E0D4", margin: 0 }}>{t("pageTitle")}</h1>
              <p style={{ fontSize: 13, color: "#9A9080", margin: 0 }}>
                {t("pageSubtitle")} · {activeSession.viewers.length} {t("viewersActive")}
              </p>
            </div>
          </div>
        </div>

        {/* Security badges + session selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              background: "rgba(91,140,90,0.12)",
              border: "1px solid rgba(91,140,90,0.25)",
              fontSize: 11,
              fontWeight: 600,
              color: "#5B8C5A",
            }}
          >
            <LucideIcon name="Lock" size={13} />
            {t("encrypted")}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              background: "rgba(196,168,130,0.08)",
              border: "1px solid rgba(196,168,130,0.2)",
              fontSize: 11,
              fontWeight: 600,
              color: "#C4A882",
            }}
          >
            <LucideIcon name="Shield" size={13} />
            {t("ndaProtected")}
          </span>

          {/* Scene selector */}
          <select
            value={selectedSessionId}
            onChange={(e) => {
              setSelectedSessionId(e.target.value);
              setSelectedCameraId("cam_a");
            }}
            style={{
              padding: "7px 12px",
              borderRadius: 10,
              border: "1px solid #3A3A3A",
              background: "#262626",
              color: "#E8E0D4",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {liveStreamSessions.map((s) => (
              <option key={s.id} value={s.id}>
                Scene {s.sceneNumber} — {s.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Main Grid: Feed + Info Panel ───────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>
        {/* Main Camera Feed */}
        <div>
          <CameraFeed camera={mainCamera} isMain session={activeSession} />

          {/* Camera Thumbnail Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginTop: 12,
            }}
          >
            {liveCameras.map((cam) => (
              <div key={cam.id} style={{ position: "relative" }}>
                <CameraFeed
                  camera={activeSession.status === "live" ? cam : { ...cam, status: "offline" }}
                  session={activeSession}
                  onClick={() => setSelectedCameraId(cam.id)}
                />
                {/* Selected indicator */}
                {cam.id === selectedCameraId && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 30,
                      height: 3,
                      borderRadius: 2,
                      background: "#C4A882",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scene Info Panel */}
        <div
          style={{
            background: "#262626",
            borderRadius: 16,
            border: "1px solid #3A3A3A",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Scene header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <LucideIcon name="Camera" size={16} color="#C4A882" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#C4A882", letterSpacing: 0.5 }}>
                {t("sceneInfo")}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#E8E0D4", margin: 0, marginBottom: 4 }}>
              Scene #{activeSession.sceneNumber}
            </h3>
            <p style={{ fontSize: 12, color: "#9A9080", margin: 0, lineHeight: 1.5 }}>
              {activeSession.sceneDescription}
            </p>
          </div>

          {/* Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Shot progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#9A9080", fontWeight: 500 }}>{t("shotProgress")}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#E8E0D4" }}>
                  {activeSession.shotNumber} / {activeSession.totalShots}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "#1A1A1A",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(activeSession.shotNumber / activeSession.totalShots) * 100}%`,
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #5B8C5A, #C4A882)",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Budget burn */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9A9080", fontWeight: 500 }}>{t("budgetBurn")}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#C4A882" }}>
                {formatCrores(activeSession.budgetBurn)}
              </span>
            </div>

            {/* Schedule status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9A9080", fontWeight: 500 }}>{t("scheduleStatus")}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background:
                    new Date(activeSession.startTime) <= new Date(activeSession.scheduledStart)
                      ? "rgba(91,140,90,0.15)"
                      : "rgba(196,92,92,0.15)",
                  color:
                    new Date(activeSession.startTime) <= new Date(activeSession.scheduledStart)
                      ? "#5B8C5A"
                      : "#C45C5C",
                }}
              >
                {new Date(activeSession.startTime) <= new Date(activeSession.scheduledStart)
                  ? t("onTime")
                  : t("delayed")}
              </span>
            </div>

            {/* Risk */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9A9080", fontWeight: 500 }}>{t("riskLevel")}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 6,
                  letterSpacing: 0.5,
                  background: activeSession.isHighRisk ? "rgba(196,92,92,0.15)" : "rgba(91,140,90,0.15)",
                  color: activeSession.isHighRisk ? "#C45C5C" : "#5B8C5A",
                }}
              >
                {activeSession.isHighRisk ? t("highRisk") : t("normalRisk")}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#3A3A3A" }} />

          {/* Active Viewers */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <LucideIcon name="Eye" size={14} color="#9A9080" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9A9080" }}>
                {t("activeViewers")} ({activeSession.viewers.length})
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeSession.viewers.length === 0 && (
                <span style={{ fontSize: 12, color: "#6B6560", fontStyle: "italic" }}>No viewers yet</span>
              )}
              {activeSession.viewers.map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #C4A882, #8B7355)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      flexShrink: 0,
                    }}
                  >
                    {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#E8E0D4", margin: 0 }}>{v.name}</p>
                    <p style={{ fontSize: 10, color: "#6B6560", margin: 0 }}>{v.role}</p>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#5B8C5A",
                      boxShadow: "0 0 4px rgba(91,140,90,0.5)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#3A3A3A" }} />

          {/* Camera details */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#9A9080", marginBottom: 8, display: "block" }}>
              {mainCamera.label}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6B6560" }}>Location</span>
                <span style={{ fontSize: 11, color: "#E8E0D4" }}>{mainCamera.location}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6B6560" }}>Operator</span>
                <span style={{ fontSize: 11, color: "#E8E0D4" }}>{mainCamera.operator}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6B6560" }}>Resolution</span>
                <span style={{ fontSize: 11, color: "#E8E0D4" }}>{mainCamera.resolution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Grid: Sessions + Activity Log ───────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Session History */}
        <div
          style={{
            background: "#262626",
            borderRadius: 16,
            border: "1px solid #3A3A3A",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <LucideIcon name="History" size={16} color="#C4A882" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#E8E0D4" }}>{t("todaySessions")}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {liveStreamSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setSelectedCameraId("cam_a");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: session.id === selectedSessionId ? "1px solid rgba(196,168,130,0.3)" : "1px solid #3A3A3A",
                  background: session.id === selectedSessionId ? "rgba(196,168,130,0.06)" : "#1A1A1A",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (session.id !== selectedSessionId) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "#4A4A4A";
                  }
                }}
                onMouseLeave={(e) => {
                  if (session.id !== selectedSessionId) {
                    e.currentTarget.style.background = "#1A1A1A";
                    e.currentTarget.style.borderColor = "#3A3A3A";
                  }
                }}
              >
                {/* Status indicator */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: statusColor[session.status] ?? "#6B6560",
                    flexShrink: 0,
                    ...(session.status === "live"
                      ? { boxShadow: "0 0 6px rgba(91,140,90,0.6)", animation: "liveDot 1.5s ease-in-out infinite" }
                      : {}),
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D4", margin: 0 }}>
                    Scene {session.sceneNumber} — {session.sceneDescription.length > 35 ? session.sceneDescription.slice(0, 35) + "…" : session.sceneDescription}
                  </p>
                  <p style={{ fontSize: 11, color: "#6B6560", margin: 0, marginTop: 2 }}>
                    {formatTime(session.startTime)}
                    {session.endTime && ` — ${formatTime(session.endTime)}`}
                    {" · "}
                    {session.shotNumber}/{session.totalShots} {t("shots")}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    background: `${statusColor[session.status] ?? "#6B6560"}20`,
                    color: statusColor[session.status] ?? "#6B6560",
                    flexShrink: 0,
                  }}
                >
                  {session.status === "live" && "● "}
                  {t(session.status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div
          style={{
            background: "#262626",
            borderRadius: 16,
            border: "1px solid #3A3A3A",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <LucideIcon name="Activity" size={16} color="#C4A882" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#E8E0D4" }}>{t("activityLog")}</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              maxHeight: 380,
              overflowY: "auto",
            }}
          >
            {sortedLog.map((entry, i) => {
              const typeInfo = logTypeIcon[entry.type] ?? { icon: "Circle", color: "#6B6560" };
              return (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: i < sortedLog.length - 1 ? "1px solid rgba(58,58,58,0.6)" : "none",
                  }}
                >
                  {/* Timeline dot + icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `${typeInfo.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LucideIcon name={typeInfo.icon} size={14} color={typeInfo.color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: "#E8E0D4", margin: 0, lineHeight: 1.4 }}>{entry.message}</p>
                    {entry.user && (
                      <p style={{ fontSize: 10, color: "#6B6560", margin: 0, marginTop: 2 }}>{entry.user}</p>
                    )}
                  </div>

                  <span style={{ fontSize: 10, color: "#6B6560", flexShrink: 0, fontFamily: "monospace" }}>
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
