"use client";

import { useState, useRef, useCallback } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { scriptImportTranslations } from "@/lib/translations/script-import";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedScene {
  id: string;
  sceneNumber: number;
  heading: string;
  location: string;
  timeOfDay: string;
  intExt: "INT" | "EXT" | "INT/EXT";
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

const parseFDX = (text: string): ParsedScene[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const paragraphs = doc.querySelectorAll('Paragraph[Type="Scene Heading"]');
  const scenes: ParsedScene[] = [];
  paragraphs.forEach((p, i) => {
    const content = p.textContent?.trim() || "";
    const match = content.match(
      /^(INT|EXT|INT\/EXT)[.\s]+(.+?)(?:\s*[-\u2013]\s*(DAY|NIGHT|MORNING|EVENING|DAWN|DUSK))?$/i
    );
    scenes.push({
      id: `parsed_${i + 1}`,
      sceneNumber: i + 1,
      heading: content,
      location: match ? match[2].trim() : content,
      timeOfDay: match?.[3] || "DAY",
      intExt: (match?.[1]?.toUpperCase() as "INT" | "EXT" | "INT/EXT") || "INT",
    });
  });
  return scenes;
};

const parseFountain = (text: string): ParsedScene[] => {
  const lines = text.split("\n");
  const scenes: ParsedScene[] = [];
  let count = 0;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (/^(INT|EXT|INT\/EXT|I\/E)[.\s]/i.test(trimmed)) {
      count++;
      const match = trimmed.match(
        /^(INT|EXT|INT\/EXT|I\/E)[.\s]+(.+?)(?:\s*[-\u2013]\s*(DAY|NIGHT|MORNING|EVENING|DAWN|DUSK))?$/i
      );
      scenes.push({
        id: `parsed_${count}`,
        sceneNumber: count,
        heading: trimmed,
        location: match ? match[2].trim() : trimmed,
        timeOfDay: match?.[3] || "DAY",
        intExt: (match?.[1]?.toUpperCase() as "INT" | "EXT" | "INT/EXT") || "INT",
      });
    }
  });
  return scenes;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const detectFormat = (name: string): string => {
  if (name.endsWith(".fdx")) return "FDX (Final Draft)";
  if (name.endsWith(".fountain")) return "Fountain";
  return "Plain Text (Fountain)";
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ScriptImportPage() {
  const { t } = useTranslation(scriptImportTranslations);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scenes, setScenes] = useState<ParsedScene[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Editing buffers
  const [editLocation, setEditLocation] = useState("");
  const [editTimeOfDay, setEditTimeOfDay] = useState("");

  // -----------------------------------------------------------------------
  // File handling
  // -----------------------------------------------------------------------

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setParseError(null);
    setImported(false);
    setEditingId(null);
    const text = await f.text();
    if (f.name.endsWith(".fdx")) {
      const parsed = parseFDX(text);
      if (parsed.length === 0) setParseError("No scene headings found in FDX file");
      setScenes(parsed);
    } else {
      const parsed = parseFountain(text);
      if (parsed.length === 0) setParseError("No scene headings found in file");
      setScenes(parsed);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile]
  );

  const clearFile = () => {
    setFile(null);
    setScenes([]);
    setParseError(null);
    setImported(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -----------------------------------------------------------------------
  // Scene actions
  // -----------------------------------------------------------------------

  const startEditing = (scene: ParsedScene) => {
    setEditingId(scene.id);
    setEditLocation(scene.location);
    setEditTimeOfDay(scene.timeOfDay);
  };

  const saveEditing = () => {
    if (!editingId) return;
    setScenes((prev) =>
      prev.map((s) =>
        s.id === editingId ? { ...s, location: editLocation, timeOfDay: editTimeOfDay } : s
      )
    );
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const deleteScene = (id: string) => {
    setScenes((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    });
  };

  const handleImport = () => {
    setImported(true);
  };

  // -----------------------------------------------------------------------
  // Styles
  // -----------------------------------------------------------------------

  const pageStyle: React.CSSProperties = {
    padding: "32px",
    color: "#E8E0D4",
    minHeight: "100vh",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "8px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: "#E8E0D4",
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#9A9080",
    marginBottom: "24px",
  };

  const iconCircleStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const formatsRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const formatBadgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "8px",
    background: "#2A2A2A",
    border: "1px solid #3A3A3A",
    fontSize: "13px",
    color: "#E8E0D4",
  };

  const formatExtStyle: React.CSSProperties = {
    fontWeight: 700,
    color: "#C4A882",
    fontSize: "12px",
  };

  const formatDescStyle: React.CSSProperties = {
    color: "#9A9080",
    fontSize: "12px",
  };

  const dropZoneStyle: React.CSSProperties = {
    height: "200px",
    border: `2px dashed ${isDragging ? "#C4A882" : "#3A3A3A"}`,
    borderRadius: "16px",
    background: isDragging ? "rgba(196,168,130,0.06)" : "#262626",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "24px",
  };

  const dropZoneTextStyle: React.CSSProperties = {
    fontSize: "16px",
    color: isDragging ? "#C4A882" : "#9A9080",
    fontWeight: 500,
  };

  const dropZoneBrowseStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#C4A882",
    textDecoration: "underline",
    cursor: "pointer",
  };

  const fileInfoBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "#262626",
    border: "1px solid #3A3A3A",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const fileInfoItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const fileInfoLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#9A9080",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  const fileInfoValueStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#E8E0D4",
    fontWeight: 500,
  };

  const clearBtnStyle: React.CSSProperties = {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "8px",
    background: "transparent",
    border: "1px solid #3A3A3A",
    color: "#9A9080",
    fontSize: "13px",
    cursor: "pointer",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#E8E0D4",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const tableCardStyle: React.CSSProperties = {
    borderRadius: "12px",
    background: "#262626",
    border: "1px solid #3A3A3A",
    overflow: "hidden",
    marginBottom: "24px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse" as const,
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontSize: "12px",
    fontWeight: 600,
    color: "#9A9080",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    borderBottom: "1px solid #3A3A3A",
    background: "#222222",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#E8E0D4",
    borderBottom: "1px solid #2E2E2E",
    verticalAlign: "middle" as const,
  };

  const intExtBadge = (type: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    background:
      type === "EXT"
        ? "rgba(76,175,80,0.15)"
        : type === "INT/EXT"
        ? "rgba(255,193,7,0.15)"
        : "rgba(100,149,237,0.15)",
    color:
      type === "EXT"
        ? "#66BB6A"
        : type === "INT/EXT"
        ? "#FFD54F"
        : "#7BAAF7",
  });

  const actionBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const editInputStyle: React.CSSProperties = {
    background: "#1A1A1A",
    border: "1px solid #C4A882",
    borderRadius: "6px",
    color: "#E8E0D4",
    padding: "6px 10px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  };

  const bottomBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "16px 0",
  };

  const cancelBtnStyle: React.CSSProperties = {
    padding: "10px 24px",
    borderRadius: "10px",
    background: "transparent",
    border: "1px solid #3A3A3A",
    color: "#9A9080",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  };

  const importBtnStyle: React.CSSProperties = {
    padding: "10px 28px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #C4A882 0%, #D4B892 100%)",
    border: "none",
    color: "#1A1A1A",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const successBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "rgba(76,175,80,0.12)",
    border: "1px solid rgba(76,175,80,0.3)",
    color: "#66BB6A",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "24px",
  };

  const errorBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "rgba(244,67,54,0.1)",
    border: "1px solid rgba(244,67,54,0.3)",
    color: "#EF5350",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "24px",
  };

  const formatDetectedBadge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 10px",
    borderRadius: "6px",
    background: "rgba(196,168,130,0.15)",
    color: "#C4A882",
    fontSize: "12px",
    fontWeight: 600,
  };

  const headingCellStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "13px",
    color: "#9A9080",
    fontStyle: "italic" as const,
    maxWidth: "280px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div style={pageStyle}>
      {/* ---- Header ---- */}
      <div style={headerStyle}>
        <div style={iconCircleStyle}>
          <LucideIcon name="FileUp" size={24} color="#1A1A1A" />
        </div>
        <div>
          <h1 style={titleStyle}>{t("pageTitle")}</h1>
        </div>
      </div>
      <p style={subtitleStyle}>{t("pageSubtitle")}</p>

      {/* ---- Success notification ---- */}
      {imported && (
        <div style={successBarStyle}>
          <LucideIcon name="CheckCircle" size={20} />
          <span>{t("importSuccess").replace("{n}", String(scenes.length))}</span>
        </div>
      )}

      {/* ---- Parse error ---- */}
      {parseError && (
        <div style={errorBarStyle}>
          <LucideIcon name="AlertCircle" size={20} />
          <span>{parseError}</span>
        </div>
      )}

      {/* ---- Supported formats row ---- */}
      <div style={formatsRowStyle}>
        <span style={{ fontSize: "13px", color: "#9A9080", fontWeight: 600 }}>
          {t("supportedFormats")}:
        </span>
        <div style={formatBadgeStyle}>
          <span style={formatExtStyle}>.fdx</span>
          <span style={formatDescStyle}>{t("fdxFormat")}</span>
        </div>
        <div style={formatBadgeStyle}>
          <span style={formatExtStyle}>.fountain</span>
          <span style={formatDescStyle}>{t("fountainFormat")}</span>
        </div>
        <div style={formatBadgeStyle}>
          <span style={formatExtStyle}>.txt</span>
          <span style={formatDescStyle}>{t("txtFormat")}</span>
        </div>
      </div>

      {/* ---- Drop zone ---- */}
      {!file && (
        <div
          style={dropZoneStyle}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <LucideIcon
            name="Upload"
            size={40}
            color={isDragging ? "#C4A882" : "#6B6560"}
            strokeWidth={1.5}
          />
          <span style={dropZoneTextStyle}>{t("dropZoneText")}</span>
          <span style={dropZoneBrowseStyle}>{t("dropZoneBrowse")}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fdx,.fountain,.txt"
            style={{ display: "none" }}
            onChange={onFileInputChange}
          />
        </div>
      )}

      {/* ---- File info bar ---- */}
      {file && (
        <div style={fileInfoBarStyle}>
          <div style={fileInfoItemStyle}>
            <LucideIcon name="File" size={16} color="#C4A882" />
            <div>
              <div style={fileInfoLabelStyle}>{t("fileName")}</div>
              <div style={fileInfoValueStyle}>{file.name}</div>
            </div>
          </div>

          <div style={{ width: "1px", height: "32px", background: "#3A3A3A" }} />

          <div style={fileInfoItemStyle}>
            <div>
              <div style={fileInfoLabelStyle}>{t("fileSize")}</div>
              <div style={fileInfoValueStyle}>{formatFileSize(file.size)}</div>
            </div>
          </div>

          <div style={{ width: "1px", height: "32px", background: "#3A3A3A" }} />

          <div style={fileInfoItemStyle}>
            <div>
              <div style={fileInfoLabelStyle}>{t("fileType")}</div>
              <div style={formatDetectedBadge}>{detectFormat(file.name)}</div>
            </div>
          </div>

          <button style={clearBtnStyle} onClick={clearFile}>
            <LucideIcon name="X" size={14} color="#9A9080" />
            {t("clearFile")}
          </button>
        </div>
      )}

      {/* ---- Extracted scenes table ---- */}
      {scenes.length > 0 && (
        <>
          <div style={sectionTitleStyle}>
            <LucideIcon name="Layers" size={20} color="#C4A882" />
            {t("extractedScenes")} ({scenes.length})
          </div>

          <div style={tableCardStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "50px", textAlign: "center" }}>
                    {t("sceneNumber")}
                  </th>
                  <th style={{ ...thStyle, width: "90px" }}>{t("intExt")}</th>
                  <th style={thStyle}>{t("location")}</th>
                  <th style={{ ...thStyle, width: "110px" }}>{t("timeOfDay")}</th>
                  <th style={thStyle}>{t("heading")}</th>
                  <th style={{ ...thStyle, width: "100px", textAlign: "center" }}>
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {scenes.map((scene) => {
                  const isEditing = editingId === scene.id;
                  return (
                    <tr
                      key={scene.id}
                      style={{
                        background: isEditing ? "rgba(196,168,130,0.05)" : "transparent",
                        transition: "background 0.15s ease",
                      }}
                    >
                      {/* Scene number */}
                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#9A9080",
                        }}
                      >
                        {scene.sceneNumber}
                      </td>

                      {/* INT/EXT badge */}
                      <td style={tdStyle}>
                        <span style={intExtBadge(scene.intExt)}>{scene.intExt}</span>
                      </td>

                      {/* Location */}
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input
                            style={editInputStyle}
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span style={{ fontWeight: 500 }}>{scene.location}</span>
                        )}
                      </td>

                      {/* Time of day */}
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input
                            style={{ ...editInputStyle, width: "90px" }}
                            value={editTimeOfDay}
                            onChange={(e) => setEditTimeOfDay(e.target.value)}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#C4A882",
                              fontWeight: 600,
                            }}
                          >
                            {scene.timeOfDay}
                          </span>
                        )}
                      </td>

                      {/* Heading */}
                      <td style={headingCellStyle}>{scene.heading}</td>

                      {/* Actions */}
                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                        }}
                      >
                        {isEditing ? (
                          <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                            <button
                              style={actionBtnStyle}
                              title={t("save")}
                              onClick={saveEditing}
                            >
                              <LucideIcon name="Check" size={16} color="#66BB6A" />
                            </button>
                            <button
                              style={actionBtnStyle}
                              title={t("cancel")}
                              onClick={cancelEditing}
                            >
                              <LucideIcon name="X" size={16} color="#EF5350" />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                            <button
                              style={actionBtnStyle}
                              title={t("edit")}
                              onClick={() => startEditing(scene)}
                            >
                              <LucideIcon name="Pencil" size={15} color="#9A9080" />
                            </button>
                            <button
                              style={actionBtnStyle}
                              title={t("delete")}
                              onClick={() => deleteScene(scene.id)}
                            >
                              <LucideIcon name="Trash2" size={15} color="#9A9080" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ---- Bottom action bar ---- */}
          {!imported && (
            <div style={bottomBarStyle}>
              <button style={cancelBtnStyle} onClick={clearFile}>
                {t("cancel")}
              </button>
              <button style={importBtnStyle} onClick={handleImport}>
                <LucideIcon name="Download" size={16} color="#1A1A1A" />
                {t("importScenes").replace("{n}", String(scenes.length))}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
