"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { roleLabels, roleDescriptions } from "@/lib/navigation";
import type { UserRole } from "@/lib/types";

const roleCards: { role: UserRole; icon: React.ReactNode; gradientBg: string }[] = [
  {
    role: "producer",
    gradientBg: "linear-gradient(135deg, #C4A882, #8B7355)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4v16M17 4v16M3 8h4M17 8h4M3 12h18M3 16h4M17 16h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    role: "director",
    gradientBg: "linear-gradient(135deg, #7C9EB5, #4A6B7C)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11v8a1 1 0 001 1h14a1 1 0 001-1v-8" />
        <path d="M4 11l3-7h10l3 7" />
        <path d="M8 4l1 7M16 4l-1 7M12 4v7" />
      </svg>
    ),
  },
  {
    role: "production_head",
    gradientBg: "linear-gradient(135deg, #8BAA7C, #5B7C4A)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18h20M2 18v-2l4-8h12l4 8v2" />
        <circle cx="12" cy="7" r="3" />
        <path d="M12 10v4" />
      </svg>
    ),
  },
  {
    role: "vfx_head",
    gradientBg: "linear-gradient(135deg, #B57CB5, #7C4A7C)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l1 3 3-1" />
        <path d="M19 19l-1 3-3-1" />
      </svg>
    ),
  },
  {
    role: "financier",
    gradientBg: "linear-gradient(135deg, #C4A042, #8B7020)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="1" />
        <path d="M7 8V6a4 4 0 018 0v2" />
        <circle cx="12" cy="14" r="2" />
        <path d="M12 16v2" />
      </svg>
    ),
  },
  {
    role: "marketing_head",
    gradientBg: "linear-gradient(135deg, #C47C5C, #8B4A30)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
      </svg>
    ),
  },
  {
    role: "admin",
    gradientBg: "linear-gradient(135deg, #6B6560, #4A4540)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { selectRole, user } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        position: "relative",
        background: "#1A1A1A",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 900,
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#E8E0D4", margin: 0 }}>
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#9A9080" }}>
            Select your role to access the platform
          </p>
        </div>

        {/* Role Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {roleCards.map(({ role, icon, gradientBg }) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              style={{
                position: "relative",
                textAlign: "left",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #3A3A3A",
                background: "#262626",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4A4A4A";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(196,168,130,0.05)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3A3A3A";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  marginBottom: 16,
                  background: gradientBg,
                  color: "#1A1A1A",
                }}
              >
                {icon}
              </div>

              {/* Label */}
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#E8E0D4", margin: "0 0 6px 0" }}>
                {roleLabels[role]}
              </h3>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: "#6B6560", margin: 0 }}>
                {roleDescriptions[role]}
              </p>

              {/* Arrow */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  opacity: 0.4,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              router.push("/");
            }}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#6B6560",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#C4A882"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B6560"; }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
