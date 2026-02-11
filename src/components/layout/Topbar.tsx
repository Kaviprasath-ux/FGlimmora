"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { roleLabels } from "@/lib/navigation";
import { getInitials } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { navigationTranslations } from "@/lib/translations/navigation";

export function Topbar() {
  const { user } = useAuthStore();
  const { lang, setLang } = useLanguageStore();
  const { t } = useTranslation(navigationTranslations);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return null;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: "var(--sidebar-width)",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "var(--topbar-height)",
        background: "rgba(15,15,15,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #1E1E1E",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
        <div
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={searchFocused ? "#C4A882" : "#6B6560"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "color 0.15s ease" }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 40,
            paddingRight: 64,
            borderRadius: 12,
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s ease",
            background: searchFocused ? "#1A1A1A" : "#161616",
            border: `1px solid ${searchFocused ? "#C4A882" : "#1E1E1E"}`,
            color: "#E8E0D4",
            fontFamily: "inherit",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              background: "#242424",
              color: "#6B6560",
              border: "1px solid #2A2A2A",
              fontFamily: "inherit",
            }}
          >
            ⌘
          </kbd>
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              background: "#242424",
              color: "#6B6560",
              border: "1px solid #2A2A2A",
              fontFamily: "inherit",
            }}
          >
            K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notifications */}
        <button
          style={{
            position: "relative",
            padding: 8,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#7A756E",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "#E8E0D4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7A756E"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#C45C5C",
            }}
          />
        </button>

        {/* Settings */}
        <button
          style={{
            padding: 8,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#7A756E",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "#E8E0D4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7A756E"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        {/* Language Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: 8,
            padding: 2,
            gap: 0,
          }}
        >
          <button
            onClick={() => setLang("en")}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              background: lang === "en" ? "#C4A882" : "transparent",
              color: lang === "en" ? "#0F0F0F" : "#6B6560",
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang("te")}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              background: lang === "te" ? "#C4A882" : "transparent",
              color: lang === "te" ? "#0F0F0F" : "#6B6560",
            }}
          >
            తెలుగు
          </button>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: "#2A2A2A" }} />

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#E8E0D4", margin: 0, lineHeight: 1.3 }}>
              {user.name}
            </p>
            <p style={{ fontSize: 10, color: "#6B6560", margin: 0, lineHeight: 1.3 }}>
              {t(roleLabels[user.role])}
            </p>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              background: "linear-gradient(135deg, #C4A882, #8B7355)",
              color: "#0F0F0F",
              flexShrink: 0,
            }}
          >
            {getInitials(user.name)}
          </div>
        </div>
      </div>
    </header>
  );
}
