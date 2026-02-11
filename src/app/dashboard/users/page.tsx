"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { getInitials } from "@/lib/utils";
import { roleLabels } from "@/lib/navigation";
import type { UserRole } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { usersTranslations } from "@/lib/translations/users";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@filmglimmora.com",
    role: "admin" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T10:30:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "2",
    name: "Priya Mehta",
    email: "priya.mehta@filmglimmora.com",
    role: "producer" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T09:15:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "3",
    name: "Arjun Kapoor",
    email: "arjun.kapoor@filmglimmora.com",
    role: "director" as UserRole,
    status: "active",
    lastLogin: "2025-02-09T18:45:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "4",
    name: "Ananya Desai",
    email: "ananya.desai@filmglimmora.com",
    role: "financier" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T08:20:00Z",
    project: "Multiple Projects",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@filmglimmora.com",
    role: "production-manager" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T11:00:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "6",
    name: "Meera Iyer",
    email: "meera.iyer@filmglimmora.com",
    role: "line-producer" as UserRole,
    status: "active",
    lastLogin: "2025-02-09T16:30:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "7",
    name: "Sanjay Gupta",
    email: "sanjay.gupta@filmglimmora.com",
    role: "cinematographer" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T07:45:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "8",
    name: "Kavita Rao",
    email: "kavita.rao@filmglimmora.com",
    role: "casting-director" as UserRole,
    status: "inactive",
    lastLogin: "2025-02-05T14:20:00Z",
    project: "Not Assigned",
  },
  {
    id: "9",
    name: "Rahul Malhotra",
    email: "rahul.malhotra@filmglimmora.com",
    role: "vfx-supervisor" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T10:15:00Z",
    project: "Kingdom of Dreams",
  },
  {
    id: "10",
    name: "Deepa Nair",
    email: "deepa.nair@filmglimmora.com",
    role: "marketing-head" as UserRole,
    status: "active",
    lastLogin: "2025-02-10T09:30:00Z",
    project: "Kingdom of Dreams",
  },
];

// Mock activity log
const recentActivities = [
  {
    id: "1",
    user: "Rajesh Sharma",
    action: "Updated budget allocation",
    time: "2 hours ago",
    type: "update",
  },
  {
    id: "2",
    user: "Priya Mehta",
    action: "Created new milestone",
    time: "3 hours ago",
    type: "create",
  },
  {
    id: "3",
    user: "Arjun Kapoor",
    action: "Approved scene breakdown",
    time: "5 hours ago",
    type: "approve",
  },
  {
    id: "4",
    user: "Vikram Singh",
    action: "Added new crew member",
    time: "6 hours ago",
    type: "create",
  },
  {
    id: "5",
    user: "Ananya Desai",
    action: "Reviewed financial report",
    time: "8 hours ago",
    type: "review",
  },
  {
    id: "6",
    user: "Deepa Nair",
    action: "Launched marketing campaign",
    time: "1 day ago",
    type: "launch",
  },
];

export default function UsersPage() {
  const { t } = useTranslation(usersTranslations);
  const [users, setUsers] = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "crew-member" as UserRole,
    project: "",
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "#C4A882",
      producer: "#5B8C5A",
      director: "#5B7C8C",
      financier: "#C4A042",
      production_head: "#9A9080",
      vfx_head: "#7C6B8C",
      marketing_head: "#8C8C5B",
    };
    return colors[role] || "#9A9080";
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      update: "Edit",
      create: "Plus",
      approve: "CheckCircle",
      review: "Eye",
      launch: "Rocket",
    };
    return icons[type] || "Activity";
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const roleDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddUser = () => {
    console.log("Adding user:", newUser);
    setShowAddModal(false);
    setNewUser({
      name: "",
      email: "",
      role: "crew-member" as UserRole,
      project: "",
    });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
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
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#C4A882",
            color: "#1A1A1A",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#D4B892";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#C4A882";
          }}
        >
          <LucideIcon name="UserPlus" size={18} color="#1A1A1A" />
          {t("addUser")}
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#5B7C8C20",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon name="Users" size={24} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("totalUsers")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {users.length}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#5B8C5A20",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon name="CheckCircle" size={24} color="#5B8C5A" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("activeUsers")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {activeUsers}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#C4A88220",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon name="Briefcase" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("roles")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {Object.keys(roleDistribution).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* User Table */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4" }}>
              {t("teamMembers")}
            </h2>
            {selectedUsers.length > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {t("assignToProject")}
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {t("changeRole")}
                </button>
              </div>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3A3A3A" }}>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("name")}
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("email")}
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("role")}
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("status")}
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("lastLogin")}
                  </th>
                  <th style={{ padding: "12px 8px", textAlign: "left", color: "#9A9080", fontSize: "12px", fontWeight: "500" }}>
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #3A3A3A",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#333333";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "16px 8px" }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: getRoleColor(user.role),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1A1A1A",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <span style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500" }}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#9A9080", fontSize: "13px" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          backgroundColor: `${getRoleColor(user.role)}20`,
                          color: getRoleColor(user.role),
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          backgroundColor: user.status === "active" ? "#5B8C5A20" : "#C45C5C20",
                          color: user.status === "active" ? "#5B8C5A" : "#C45C5C",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#9A9080", fontSize: "13px" }}>
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            padding: "6px",
                            backgroundColor: "#333333",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <LucideIcon name="Edit" size={16} color="#9A9080" />
                        </button>
                        <button
                          style={{
                            padding: "6px",
                            backgroundColor: "#333333",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <LucideIcon name="Trash2" size={16} color="#C45C5C" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Distribution */}
        <div
          style={{
            backgroundColor: "#262626",
            border: "1px solid #3A3A3A",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "24px" }}>
            {t("roleDistribution")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(roleDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([role, count]) => (
                <div key={role}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#E8E0D4", fontSize: "13px" }}>
                      {roleLabels[role as UserRole]}
                    </span>
                    <span style={{ color: "#9A9080", fontSize: "13px" }}>
                      {count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      backgroundColor: "#333333",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(count / users.length) * 100}%`,
                        backgroundColor: getRoleColor(role as UserRole),
                        borderRadius: "3px",
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* User Activity Log */}
      <div
        style={{
          backgroundColor: "#262626",
          border: "1px solid #3A3A3A",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", marginBottom: "24px" }}>
          {t("recentActivity")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                padding: "16px",
                backgroundColor: "#333333",
                border: "1px solid #3A3A3A",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3A3A3A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#333333";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#262626",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LucideIcon name={getActivityIcon(activity.type) as any} size={18} color="#C4A882" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#E8E0D4", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                  <span style={{ color: "#C4A882" }}>{activity.user}</span> {activity.action}
                </div>
                <div style={{ color: "#9A9080", fontSize: "12px" }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E8E0D4" }}>
                {t("addNewUser")}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#333333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LucideIcon name="X" size={18} color="#9A9080" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterFullName")}
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder="user@filmglimmora.com"
                />
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("roleLabel")}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
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
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("projectAssignment")}
                </label>
                <input
                  type="text"
                  value={newUser.project}
                  onChange={(e) => setNewUser({ ...newUser, project: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterProjectName")}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {t("cancelBtn")}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#C4A882",
                    border: "none",
                    borderRadius: "8px",
                    color: "#1A1A1A",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {t("addUserBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
