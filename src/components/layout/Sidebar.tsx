"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getNavigationForRole, roleLabels } from "@/lib/navigation";
import { getInitials } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { useTranslation } from "@/lib/translations";
import { navigationTranslations } from "@/lib/translations/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation(navigationTranslations);

  if (!user) return null;

  const navItems = getNavigationForRole(user.role);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        width: "var(--sidebar-width)",
        background: "#141414",
        borderRight: "1px solid #1E1E1E",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          height: 64,
          borderBottom: "1px solid #1E1E1E",
          flexShrink: 0,
        }}
      >
        <img
          src="/logo.png"
          alt="FilmGlimmora"
          style={{
            width: "80%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Role Badge */}
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#1A1A1A",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#C4A882",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 500, color: "#9A9080" }}>
            {t(roleLabels[user.role])}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                position: "relative",
                background: isActive ? "rgba(196,168,130,0.1)" : "transparent",
                color: isActive ? "#C4A882" : "#7A756E",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#E8E0D4";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#7A756E";
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: "0 4px 4px 0",
                    background: "#C4A882",
                  }}
                />
              )}
              <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                <LucideIcon name={item.icon} size={18} />
              </span>
              <span style={{ flex: 1 }}>{t(item.label)}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 10,
                    background: "rgba(196,168,130,0.2)",
                    color: "#C4A882",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Project Selector */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #1E1E1E" }}>
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "#1A1A1A",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
          onClick={() => router.push("/dashboard/projects")}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#242424"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1A1A1A"; }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2A2A2A, #1A1A1A)",
              border: "1px solid #3A3A3A",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#E8E0D4", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Pushpa 3: The Rampage
            </p>
            <p style={{ fontSize: 10, color: "#6B6560", margin: 0 }}>{t("Active Project")}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* User Profile */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1E1E1E" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#E8E0D4", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </p>
            <p style={{ fontSize: 10, color: "#6B6560", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: 6,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: "#6B6560",
              transition: "all 0.15s ease",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#C45C5C"; e.currentTarget.style.background = "rgba(196,92,92,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B6560"; e.currentTarget.style.background = "transparent"; }}
            title={t("Sign out")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
