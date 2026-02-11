"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { settingsTranslations } from "@/lib/translations/settings";

type Section = "general" | "notifications" | "security" | "integrations" | "data";

export default function SettingsPage() {
  const { t } = useTranslation(settingsTranslations);
  const [expandedSection, setExpandedSection] = useState<Section | null>("general");
  const [showSuccess, setShowSuccess] = useState(false);

  // General settings
  const [general, setGeneral] = useState({
    platformName: "FilmGlimmora",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "English",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    scheduleReminders: true,
    teamUpdates: false,
    weeklyReports: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  // Integration settings
  const [integrations] = useState([
    { name: "Slack", status: "connected", lastSync: "2 hours ago" },
    { name: "Google Drive", status: "connected", lastSync: "5 minutes ago" },
    { name: "Dropbox", status: "disconnected", lastSync: "Never" },
    { name: "Microsoft Teams", status: "disconnected", lastSync: "Never" },
  ]);

  // Data settings
  const [data] = useState({
    storageUsed: 245,
    storageTotal: 500,
    lastBackup: "2025-02-09T10:00:00Z",
    autoBackup: true,
    backupFrequency: "daily",
  });

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = () => {
    // In real app, this would save to backend
    console.log("Saving settings:", { general, notifications, security });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportData = () => {
    console.log("Exporting data...");
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            color: "#E8E0D4",
            marginBottom: "8px",
          }}
        >
          {t("pageTitle")}
        </h1>
        <p style={{ color: "#9A9080", fontSize: "15px" }}>
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            padding: "16px 24px",
            backgroundColor: "#5B8C5A",
            color: "#E8E0D4",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          <LucideIcon name="CheckCircle" size={20} color="#E8E0D4" />
          <span style={{ fontWeight: "500" }}>{t("settingsSavedSuccess")}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        {/* General Settings */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => toggleSection("general")}
            style={{
              width: "100%",
              padding: "24px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LucideIcon name="Settings" size={20} color="#C4A882" />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {t("general")}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "13px" }}>
                  {t("generalDescription")}
                </p>
              </div>
            </div>
            <LucideIcon
              name={expandedSection === "general" ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#9A9080"
            />
          </button>

          {expandedSection === "general" && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #3A3A3A" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "24px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("platformName")}
                  </label>
                  <input
                    type="text"
                    value={general.platformName}
                    onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("timezone")}
                  </label>
                  <select
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("currency")}
                  </label>
                  <select
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("language")}
                  </label>
                  <select
                    value={general.language}
                    onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => toggleSection("notifications")}
            style={{
              width: "100%",
              padding: "24px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LucideIcon name="Bell" size={20} color="#C4A882" />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {t("notifications")}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "13px" }}>
                  {t("notificationsDescription")}
                </p>
              </div>
            </div>
            <LucideIcon
              name={expandedSection === "notifications" ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#9A9080"
            />
          </button>

          {expandedSection === "notifications" && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #3A3A3A" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: "#333333",
                      borderRadius: "12px",
                    }}
                  >
                    <div>
                      <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </div>
                      <div style={{ color: "#9A9080", fontSize: "12px" }}>
                        {value ? t("enabled") : t("disabled")}
                      </div>
                    </div>
                    <label
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "50px",
                        height: "26px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotifications({ ...notifications, [key]: e.target.checked })
                        }
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: value ? "#C4A882" : "#3A3A3A",
                          transition: "0.3s",
                          borderRadius: "13px",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            content: "",
                            height: "20px",
                            width: "20px",
                            left: value ? "27px" : "3px",
                            bottom: "3px",
                            backgroundColor: "#E8E0D4",
                            transition: "0.3s",
                            borderRadius: "50%",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => toggleSection("security")}
            style={{
              width: "100%",
              padding: "24px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LucideIcon name="Shield" size={20} color="#C4A882" />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {t("security")}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "13px" }}>
                  {t("securityDescription")}
                </p>
              </div>
            </div>
            <LucideIcon
              name={expandedSection === "security" ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#9A9080"
            />
          </button>

          {expandedSection === "security" && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #3A3A3A" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("minimumPasswordLength")}
                  </label>
                  <input
                    type="number"
                    value={security.passwordMinLength}
                    onChange={(e) =>
                      setSecurity({ ...security, passwordMinLength: parseInt(e.target.value) })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    min="6"
                    max="20"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: "#E8E0D4", fontSize: "14px" }}>{t("requireUppercaseLetters")}</span>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={security.requireUppercase}
                      onChange={(e) =>
                        setSecurity({ ...security, requireUppercase: e.target.checked })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: security.requireUppercase ? "#C4A882" : "#3A3A3A",
                        transition: "0.3s",
                        borderRadius: "13px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          height: "20px",
                          width: "20px",
                          left: security.requireUppercase ? "27px" : "3px",
                          bottom: "3px",
                          backgroundColor: "#E8E0D4",
                          transition: "0.3s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: "#E8E0D4", fontSize: "14px" }}>{t("requireNumbers")}</span>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={security.requireNumbers}
                      onChange={(e) =>
                        setSecurity({ ...security, requireNumbers: e.target.checked })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: security.requireNumbers ? "#C4A882" : "#3A3A3A",
                        transition: "0.3s",
                        borderRadius: "13px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          height: "20px",
                          width: "20px",
                          left: security.requireNumbers ? "27px" : "3px",
                          bottom: "3px",
                          backgroundColor: "#E8E0D4",
                          transition: "0.3s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: "#E8E0D4", fontSize: "14px" }}>{t("requireSpecialCharacters")}</span>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={security.requireSpecialChars}
                      onChange={(e) =>
                        setSecurity({ ...security, requireSpecialChars: e.target.checked })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: security.requireSpecialChars ? "#C4A882" : "#3A3A3A",
                        transition: "0.3s",
                        borderRadius: "13px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          height: "20px",
                          width: "20px",
                          left: security.requireSpecialChars ? "27px" : "3px",
                          bottom: "3px",
                          backgroundColor: "#E8E0D4",
                          transition: "0.3s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                  }}
                >
                  <div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                      {t("twoFactorAuthentication")}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "12px", marginTop: "4px" }}>
                      {t("twoFactorDescription")}
                    </div>
                  </div>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={security.twoFactorAuth}
                      onChange={(e) =>
                        setSecurity({ ...security, twoFactorAuth: e.target.checked })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: security.twoFactorAuth ? "#C4A882" : "#3A3A3A",
                        transition: "0.3s",
                        borderRadius: "13px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          height: "20px",
                          width: "20px",
                          left: security.twoFactorAuth ? "27px" : "3px",
                          bottom: "3px",
                          backgroundColor: "#E8E0D4",
                          transition: "0.3s",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("sessionTimeout")}
                  </label>
                  <input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) =>
                      setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    min="5"
                    max="120"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integrations */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => toggleSection("integrations")}
            style={{
              width: "100%",
              padding: "24px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LucideIcon name="Plug" size={20} color="#C4A882" />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {t("integrations")}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "13px" }}>
                  {t("integrationsDescription")}
                </p>
              </div>
            </div>
            <LucideIcon
              name={expandedSection === "integrations" ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#9A9080"
            />
          </button>

          {expandedSection === "integrations" && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #3A3A3A" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
                {integrations.map((integration, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: "#333333",
                      borderRadius: "12px",
                    }}
                  >
                    <div>
                      <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                        {integration.name}
                      </div>
                      <div style={{ color: "#9A9080", fontSize: "12px" }}>
                        {t("lastSync")}: {integration.lastSync}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          backgroundColor: integration.status === "connected" ? "#5B8C5A20" : "#C45C5C20",
                          color: integration.status === "connected" ? "#5B8C5A" : "#C45C5C",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {integration.status}
                      </span>
                      <button
                        style={{
                          padding: "6px 12px",
                          backgroundColor: integration.status === "connected" ? "#C45C5C20" : "#C4A88220",
                          border: "1px solid",
                          borderColor: integration.status === "connected" ? "#C45C5C" : "#C4A882",
                          borderRadius: "6px",
                          color: integration.status === "connected" ? "#C45C5C" : "#C4A882",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {integration.status === "connected" ? t("disconnect") : t("connect")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => toggleSection("data")}
            style={{
              width: "100%",
              padding: "24px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LucideIcon name="Database" size={20} color="#C4A882" />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", marginBottom: "4px" }}>
                  {t("dataManagement")}
                </h3>
                <p style={{ color: "#9A9080", fontSize: "13px" }}>
                  {t("dataManagementDescription")}
                </p>
              </div>
            </div>
            <LucideIcon
              name={expandedSection === "data" ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#9A9080"
            />
          </button>

          {expandedSection === "data" && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #3A3A3A" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
                {/* Storage Usage */}
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                      {t("storageUsage")}
                    </span>
                    <span style={{ color: "#9A9080", fontSize: "14px" }}>
                      {data.storageUsed} GB / {data.storageTotal} GB
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      backgroundColor: "#262626",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(data.storageUsed / data.storageTotal) * 100}%`,
                        backgroundColor: "#C4A882",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>

                {/* Last Backup */}
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                      {t("lastBackup")}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "12px", marginTop: "4px" }}>
                      {new Date(data.lastBackup).toLocaleString()}
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#C4A88220",
                      border: "1px solid #C4A882",
                      borderRadius: "8px",
                      color: "#C4A882",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    {t("backupNow")}
                  </button>
                </div>

                {/* Export Data */}
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#333333",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                      {t("exportAllData")}
                    </div>
                    <div style={{ color: "#9A9080", fontSize: "12px", marginTop: "4px" }}>
                      {t("exportAllDataDescription")}
                    </div>
                  </div>
                  <button
                    onClick={handleExportData}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#5B7C8C20",
                      border: "1px solid #5B7C8C",
                      borderRadius: "8px",
                      color: "#5B7C8C",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <LucideIcon name="Download" size={16} color="#5B7C8C" />
                    {t("export")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div
        style={{
          position: "sticky",
          bottom: "32px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: "14px 32px",
            backgroundColor: "#C4A882",
            color: "#1A1A1A",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 16px rgba(196, 168, 130, 0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#D4B892";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#C4A882";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <LucideIcon name="Save" size={18} color="#1A1A1A" />
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
}
