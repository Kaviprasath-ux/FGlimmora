"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/role-select");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "#0F0F0F",
      }}
    >
      {/* Background cinematic grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow behind card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          opacity: 0.2,
          background: "radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          padding: "0 24px",
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        {/* Logo & Title */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <img
            src="/logo.png"
            alt="FilmGlimmora"
            style={{
              height: 120,
              objectFit: "contain",
              filter: "brightness(1.1)",
            }}
          />
        </div>

        {/* Login Card */}
        <div
          style={{
            borderRadius: 16,
            padding: 32,
            border: "1px solid #2A2A2A",
            background: "#1A1A1A",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 80px rgba(196,168,130,0.03)",
          }}
        >
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  color: "#9A9080",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="producer@filmglimmora.com"
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                  transition: "all 0.2s ease",
                  background: "#242424",
                  border: "1px solid #2A2A2A",
                  color: "#E8E0D4",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C4A882";
                  e.target.style.boxShadow = "0 0 0 3px rgba(196,168,130,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2A2A2A";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  color: "#9A9080",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                  transition: "all 0.2s ease",
                  background: "#242424",
                  border: "1px solid #2A2A2A",
                  color: "#E8E0D4",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C4A882";
                  e.target.style.boxShadow = "0 0 0 3px rgba(196,168,130,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2A2A2A";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  fontSize: 13,
                  padding: "10px 14px",
                  borderRadius: 8,
                  color: "#C45C5C",
                  background: "rgba(196,92,92,0.1)",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: isLoading ? "#8B7355" : "linear-gradient(135deg, #C4A882, #A88E6A)",
                color: "#0F0F0F",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #D4B892, #B89E7A)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(196,168,130,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #C4A882, #A88E6A)";
                }
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? (
                <svg className="animate-spin" style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" />
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick access for demo */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #2A2A2A" }}>
            <p style={{ fontSize: 12, textAlign: "center", marginBottom: 12, color: "#6B6560" }}>
              Quick access (demo)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {(["producer", "director", "vfx_head", "financier"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setEmail(`${role}@filmglimmora.com`);
                    setPassword("demo");
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    transition: "all 0.15s ease",
                    background: "#242424",
                    border: "1px solid #2A2A2A",
                    color: "#9A9080",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#C4A882";
                    e.currentTarget.style.color = "#C4A882";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2A2A2A";
                    e.currentTarget.style.color = "#9A9080";
                  }}
                >
                  {role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "#6B6560" }}>
          FilmGlimmora v1.0 — Tollywood Edition
        </p>
      </div>
    </div>
  );
}
