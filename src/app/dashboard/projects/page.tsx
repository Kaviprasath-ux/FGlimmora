"use client";

import { useState } from "react";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { formatCrores, formatDate } from "@/lib/utils";
import { projects } from "@/data/mock-data";
import { useTranslation } from "@/lib/translations";
import { projectsTranslations } from "@/lib/translations/projects";

export default function ProjectsPage() {
  const { t } = useTranslation(projectsTranslations);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    genre: "",
    language: "",
    budget: "",
    director: "",
    producer: "",
    releaseDate: "",
  });

  const statuses = ["All", "Pre-Production", "Production", "Post-Production", "Released"];

  const filteredProjects = selectedStatus === "All"
    ? projects
    : projects.filter(p => p.status === selectedStatus);

  // Calculate portfolio summary
  const portfolioStats = {
    totalProjects: projects.length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    avgHealthScore: Math.round(
      projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length
    ),
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Pre-Production": "#5B7C8C",
      "Production": "#C4A042",
      "Post-Production": "#C4A882",
      "Released": "#5B8C5A",
      "Planning": "#9A9080",
    };
    return colors[status] || "#9A9080";
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#5B8C5A";
    if (score >= 60) return "#C4A882";
    if (score >= 40) return "#C4A042";
    return "#C45C5C";
  };

  const handleAddProject = () => {
    // In real app, this would save to backend
    console.log("Adding project:", newProject);
    setShowAddModal(false);
    setNewProject({
      name: "",
      description: "",
      genre: "",
      language: "",
      budget: "",
      director: "",
      producer: "",
      releaseDate: "",
    });
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
          <LucideIcon name="Plus" size={18} color="#1A1A1A" />
          {t("addNewProject")}
        </button>
      </div>

      {/* Portfolio Summary */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
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
              <LucideIcon name="Film" size={24} color="#C4A882" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("totalProjects")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {portfolioStats.totalProjects}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
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
              <LucideIcon name="DollarSign" size={24} color="#5B8C5A" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("totalBudget")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {formatCrores(portfolioStats.totalBudget)}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
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
              <LucideIcon name="Activity" size={24} color="#5B7C8C" />
            </div>
            <div>
              <div style={{ color: "#9A9080", fontSize: "13px", marginBottom: "4px" }}>
                {t("avgHealthScore")}
              </div>
              <div style={{ color: "#E8E0D4", fontSize: "28px", fontWeight: "600" }}>
                {portfolioStats.avgHealthScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: selectedStatus === status ? "#C4A882" : "#3A3A3A",
              backgroundColor: selectedStatus === status ? "#C4A88220" : "#262626",
              color: selectedStatus === status ? "#C4A882" : "#9A9080",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {status}
            <span
              style={{
                marginLeft: "8px",
                padding: "2px 8px",
                backgroundColor: selectedStatus === status ? "#C4A882" : "#333333",
                color: selectedStatus === status ? "#1A1A1A" : "#9A9080",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {status === "All" ? projects.length : projects.filter(p => p.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "#262626",
              border: "1px solid #3A3A3A",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C4A882";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#3A3A3A";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Header with title and badges */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#E8E0D4",
                    flex: 1,
                  }}
                >
                  {project.name}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor: `${getStatusColor(project.status)}20`,
                    color: getStatusColor(project.status),
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {project.status}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#333333",
                    color: "#9A9080",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {project.genre}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#333333",
                    color: "#9A9080",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {project.language}
                </span>
              </div>
            </div>

            {/* Director & Producer */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                  {t("director")}
                </div>
                <div style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "500" }}>
                  {project.director}
                </div>
              </div>
              <div>
                <div style={{ color: "#9A9080", fontSize: "11px", marginBottom: "4px" }}>
                  {t("producer")}
                </div>
                <div style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "500" }}>
                  {project.producer}
                </div>
              </div>
            </div>

            {/* Budget Bar */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("budget")}</span>
                <span style={{ color: "#E8E0D4", fontSize: "12px", fontWeight: "600" }}>
                  {formatCrores(project.budget)}
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
                    width: `${(project.spent / project.budget) * 100}%`,
                    backgroundColor: "#C4A882",
                    borderRadius: "3px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <div style={{ color: "#9A9080", fontSize: "11px", marginTop: "4px" }}>
                {formatCrores(project.spent)} {t("spent")} ({((project.spent / project.budget) * 100).toFixed(0)}%)
              </div>
            </div>

            {/* Health Score */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("healthScore")}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "6px",
                      backgroundColor: "#333333",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${project.healthScore}%`,
                        backgroundColor: getHealthColor(project.healthScore),
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      color: getHealthColor(project.healthScore),
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {project.healthScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Release Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "#333333",
                borderRadius: "8px",
              }}
            >
              <LucideIcon name="Calendar" size={16} color="#9A9080" />
              <span style={{ color: "#9A9080", fontSize: "12px" }}>{t("release")}</span>
              <span style={{ color: "#E8E0D4", fontSize: "13px", fontWeight: "500" }}>
                {project.releaseDate ? formatDate(project.releaseDate) : t("tbd")}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#333333",
                  border: "1px solid #3A3A3A",
                  borderRadius: "8px",
                  color: "#E8E0D4",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3A3A3A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#333333";
                }}
              >
                <LucideIcon name="Eye" size={16} color="#E8E0D4" />
                {t("view")}
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#C4A88220",
                  border: "1px solid #C4A882",
                  borderRadius: "8px",
                  color: "#C4A882",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#C4A88230";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#C4A88220";
                }}
              >
                <LucideIcon name="Edit" size={16} color="#C4A882" />
                {t("edit")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
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
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E8E0D4" }}>
                {t("addNewProjectModal")}
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
                  {t("projectName")}
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
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

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("description")}
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                  placeholder={t("enterProjectDescription")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("genre")}
                  </label>
                  <input
                    type="text"
                    value={newProject.genre}
                    onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder={t("genrePlaceholder")}
                  />
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("language")}
                  </label>
                  <input
                    type="text"
                    value={newProject.language}
                    onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder={t("languagePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("budgetInCrores")}
                </label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#333333",
                    border: "1px solid #3A3A3A",
                    borderRadius: "8px",
                    color: "#E8E0D4",
                    fontSize: "14px",
                  }}
                  placeholder={t("enterBudgetAmount")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("director")}
                  </label>
                  <input
                    type="text"
                    value={newProject.director}
                    onChange={(e) => setNewProject({ ...newProject, director: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder={t("directorName")}
                  />
                </div>

                <div>
                  <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {t("producer")}
                  </label>
                  <input
                    type="text"
                    value={newProject.producer}
                    onChange={(e) => setNewProject({ ...newProject, producer: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#333333",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                    placeholder={t("producerName")}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "#9A9080", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                  {t("releaseDate")}
                </label>
                <input
                  type="date"
                  value={newProject.releaseDate}
                  onChange={(e) => setNewProject({ ...newProject, releaseDate: e.target.value })}
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
                  onClick={handleAddProject}
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
                  {t("addProjectBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
