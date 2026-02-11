"use client";

import { useState, useMemo } from "react";
import { budgetCategories } from "@/data/mock-data";
import { cn, formatCrores, generateId } from "@/lib/utils";
import { LucideIcon } from "@/components/icons/LucideIcon";
import type { BudgetCategory, BudgetItem } from "@/lib/types";
import { useTranslation } from "@/lib/translations";
import { budgetTranslations } from "@/lib/translations/budget";

type AlertSeverity = "low" | "medium" | "high" | "critical";

interface CostAlert {
  id: string;
  category: string;
  severity: AlertSeverity;
  message: string;
  amount: number;
}

const severityColors = {
  low: { bg: "#5B7C8C20", border: "#5B7C8C", text: "#5B7C8C" },
  medium: { bg: "#C4A04220", border: "#C4A042", text: "#C4A042" },
  high: { bg: "#C45C5C20", border: "#C45C5C", text: "#C45C5C" },
  critical: { bg: "#C45C5C40", border: "#C45C5C", text: "#C45C5C" },
};

export default function BudgetPage() {
  const { t } = useTranslation(budgetTranslations);
  const [categories, setCategories] = useState<BudgetCategory[]>(budgetCategories);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    categoryId: "",
    description: "",
    planned: 0,
    vendor: "",
  });

  // Calculate overall budget stats
  const budgetStats = useMemo(() => {
    const totalBudget = 350; // From project data
    const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.actual, 0);
    const remaining = totalBudget - totalSpent;
    const overrunRisk = ((totalSpent / totalPlanned) * 100) - 100;
    const contingency = categories.find(c => c.name === "Contingency");
    const contingencyLeft = contingency ? contingency.planned - contingency.actual : 0;
    const avgDailyBurn = totalSpent / 42; // 42 days in production

    return {
      totalBudget,
      totalPlanned,
      totalSpent,
      remaining,
      overrunRisk,
      contingencyLeft,
      avgDailyBurn,
    };
  }, [categories]);

  // Generate cost alerts
  const costAlerts = useMemo(() => {
    const alerts: CostAlert[] = [];

    categories.forEach((category) => {
      const utilization = (category.actual / category.planned) * 100;

      if (utilization > 95) {
        alerts.push({
          id: generateId(),
          category: category.name,
          severity: "critical",
          message: `${category.name} is at ${utilization.toFixed(1)}% utilization - critically over budget`,
          amount: category.actual - category.planned,
        });
      } else if (utilization > 85) {
        alerts.push({
          id: generateId(),
          category: category.name,
          severity: "high",
          message: `${category.name} is at ${utilization.toFixed(1)}% utilization - approaching limit`,
          amount: category.actual - category.planned,
        });
      }

      // Check for over-budget line items
      category.items.forEach((item) => {
        if (item.status === "over_budget") {
          alerts.push({
            id: generateId(),
            category: category.name,
            severity: "medium",
            message: `${item.description} is over budget by ${formatCrores(item.actual - item.planned)}`,
            amount: item.actual - item.planned,
          });
        }
      });
    });

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 95) return "#C45C5C";
    if (utilization > 80) return "#C4A042";
    return "#5B8C5A";
  };

  const handleAddBudgetItem = () => {
    if (!newItem.categoryId || !newItem.description || newItem.planned <= 0) return;

    const updatedCategories = categories.map((category) => {
      if (category.id === newItem.categoryId) {
        const item: BudgetItem = {
          id: generateId(),
          description: newItem.description,
          planned: newItem.planned,
          actual: 0,
          status: "pending",
          vendor: newItem.vendor || undefined,
        };
        return {
          ...category,
          items: [...category.items, item],
          planned: category.planned + newItem.planned,
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setShowAddModal(false);
    setNewItem({
      categoryId: "",
      description: "",
      planned: 0,
      vendor: "",
    });
  };

  return (
    <div style={{ background: "#0F0F0F", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              padding: "12px",
              background: "#1A1A1A",
              borderRadius: "12px",
              border: "1px solid #2A2A2A"
            }}>
              <LucideIcon name="IndianRupee" size={28} style={{ color: "#C4A882" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#E8E0D4", margin: 0 }}>
                {t("pageTitle")}
              </h1>
              <p style={{ fontSize: "14px", color: "#9A9080", margin: "4px 0 0 0" }}>
                {t("pageSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              background: "#C4A882",
              border: "1px solid #C4A882",
              borderRadius: "12px",
              color: "#0F0F0F",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LucideIcon name="IndianRupee" size={18} />
            {t("addBudgetItem")}
          </button>
        </div>

        {/* Budget Health Bar */}
        <div style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 4px 0" }}>
                {t("budgetHealth")}
              </h3>
              <p style={{ fontSize: "13px", color: "#9A9080", margin: 0 }}>
                {t("totalBudgetVsSpend")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#C4A882" }}>
                {((budgetStats.totalSpent / budgetStats.totalBudget) * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "13px", color: "#9A9080" }}>
                {t("utilization")}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: "100%",
            height: "32px",
            background: "#242424",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}>
            <div
              style={{
                width: `${(budgetStats.totalSpent / budgetStats.totalBudget) * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, #5B8C5A, ${
                  budgetStats.totalSpent > budgetStats.totalBudget * 0.9 ? "#C4A042" : "#C4A882"
                })`,
                transition: "width 0.5s",
              }}
            />
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "13px",
              fontWeight: "600",
              color: "#E8E0D4",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}>
              {formatCrores(budgetStats.totalSpent)} / {formatCrores(budgetStats.totalBudget)}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <span style={{ fontSize: "12px", color: "#9A9080" }}>{t("spent")}</span>
            <span style={{ fontSize: "12px", color: "#9A9080" }}>{t("totalBudgetLabel")}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {[
            {
              label: t("totalBudget"),
              value: formatCrores(budgetStats.totalBudget),
              icon: "PiggyBank",
              color: "#C4A882"
            },
            {
              label: t("totalSpent"),
              value: formatCrores(budgetStats.totalSpent),
              icon: "TrendingUp",
              color: "#C4A042",
              sublabel: `${((budgetStats.totalSpent / budgetStats.totalBudget) * 100).toFixed(1)}% ${t("used")}`
            },
            {
              label: t("remaining"),
              value: formatCrores(budgetStats.remaining),
              icon: "IndianRupee",
              color: "#5B8C5A"
            },
            {
              label: t("overrunRisk"),
              value: `${budgetStats.overrunRisk > 0 ? '+' : ''}${budgetStats.overrunRisk.toFixed(1)}%`,
              icon: "AlertTriangle",
              color: budgetStats.overrunRisk > 5 ? "#C45C5C" : "#5B7C8C"
            },
            {
              label: t("contingencyLeft"),
              value: formatCrores(budgetStats.contingencyLeft),
              icon: "Shield",
              color: "#5B7C8C"
            },
            {
              label: t("avgDailyBurn"),
              value: formatCrores(budgetStats.avgDailyBurn),
              icon: "Flame",
              color: "#C4A882"
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <LucideIcon name={stat.icon} size={20} style={{ color: stat.color }} />
                <span style={{ fontSize: "13px", color: "#9A9080", fontWeight: "500" }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4" }}>
                {stat.value}
              </div>
              {stat.sublabel && (
                <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Budget Alerts */}
        {costAlerts.length > 0 && (
          <div style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <LucideIcon name="AlertTriangle" size={20} style={{ color: "#C45C5C" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
                {t("costAlerts")} ({costAlerts.length})
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {costAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: "16px",
                    background: severityColors[alert.severity].bg,
                    border: `1px solid ${severityColors[alert.severity].border}`,
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      padding: "6px 12px",
                      background: severityColors[alert.severity].border,
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#0F0F0F",
                      textTransform: "uppercase",
                    }}>
                      {alert.severity}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8E0D4", marginBottom: "2px" }}>
                        {alert.category}
                      </div>
                      <div style={{ fontSize: "13px", color: "#9A9080" }}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                  {alert.amount > 0 && (
                    <div style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: severityColors[alert.severity].text,
                    }}>
                      +{formatCrores(alert.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Categories */}
        <div style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "32px",
        }}>
          <div style={{ padding: "24px", borderBottom: "1px solid #2A2A2A" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
              {t("budgetCategories")}
            </h3>
            <p style={{ fontSize: "13px", color: "#9A9080", margin: "4px 0 0 0" }}>
              {t("detailedBreakdown")}
            </p>
          </div>

          {categories.map((category) => {
            const utilization = (category.actual / category.planned) * 100;
            const isExpanded = expandedCategories.has(category.id);
            const utilizationColor = getUtilizationColor(utilization);

            return (
              <div
                key={category.id}
                style={{
                  borderBottom: "1px solid #2A2A2A",
                }}
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    padding: "24px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#242424";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        color: "#9A9080",
                      }}>
                        ▶
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4", margin: 0 }}>
                        {category.name}
                      </h4>
                      <span style={{ fontSize: "13px", color: "#6B6560" }}>
                        ({category.items.length} {t("items")})
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("planned")}</div>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#9A9080" }}>
                          {formatCrores(category.planned)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "2px" }}>{t("actual")}</div>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#E8E0D4" }}>
                          {formatCrores(category.actual)}
                        </div>
                      </div>
                      <div style={{
                        padding: "6px 12px",
                        background: `${utilizationColor}20`,
                        border: `1px solid ${utilizationColor}`,
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: utilizationColor,
                      }}>
                        {utilization.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div style={{
                    width: "100%",
                    height: "8px",
                    background: "#242424",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}>
                    <div
                      style={{
                        width: `${Math.min(utilization, 100)}%`,
                        height: "100%",
                        background: utilizationColor,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Line Items */}
                {isExpanded && (
                  <div style={{
                    background: "#0F0F0F",
                    padding: "0 24px 24px 64px",
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                          {[t("description"), t("planned"), t("actual"), t("utilizationHeader"), t("status"), t("vendorHeader")].map((header) => (
                            <th
                              key={header}
                              style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#6B6560",
                                textTransform: "uppercase",
                              }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item) => {
                          const itemUtilization = item.planned > 0 ? (item.actual / item.planned) * 100 : 0;
                          const statusColor = item.status === "over_budget"
                            ? "#C45C5C"
                            : item.status === "on_track"
                            ? "#5B8C5A"
                            : "#5B7C8C";

                          return (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: "1px solid #242424",
                              }}
                            >
                              <td style={{ padding: "16px", fontSize: "14px", color: "#E8E0D4" }}>
                                {item.description}
                              </td>
                              <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#9A9080" }}>
                                {formatCrores(item.planned)}
                              </td>
                              <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#E8E0D4" }}>
                                {formatCrores(item.actual)}
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{
                                    flex: 1,
                                    height: "6px",
                                    background: "#242424",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                  }}>
                                    <div
                                      style={{
                                        width: `${Math.min(itemUtilization, 100)}%`,
                                        height: "100%",
                                        background: getUtilizationColor(itemUtilization),
                                      }}
                                    />
                                  </div>
                                  <span style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: getUtilizationColor(itemUtilization),
                                  }}>
                                    {itemUtilization.toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div style={{
                                  padding: "4px 10px",
                                  background: `${statusColor}20`,
                                  border: `1px solid ${statusColor}`,
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: statusColor,
                                  textTransform: "capitalize",
                                  display: "inline-block",
                                }}>
                                  {item.status.replace("_", " ")}
                                </div>
                              </td>
                              <td style={{ padding: "16px", fontSize: "13px", color: "#9A9080" }}>
                                {item.vendor || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cost Comparison Chart */}
        <div style={{
          background: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E8E0D4", margin: "0 0 20px 0" }}>
            {t("plannedVsActual")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {categories.map((category) => {
              const maxValue = Math.max(category.planned, category.actual, 100);
              const plannedWidth = (category.planned / maxValue) * 100;
              const actualWidth = (category.actual / maxValue) * 100;

              return (
                <div key={category.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#E8E0D4", fontWeight: "500" }}>
                      {category.name}
                    </span>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ fontSize: "13px", color: "#9A9080" }}>
                        {t("planned")}: {formatCrores(category.planned)}
                      </span>
                      <span style={{ fontSize: "13px", color: "#C4A882" }}>
                        {t("actual")}: {formatCrores(category.actual)}
                      </span>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: "40px" }}>
                    {/* Planned bar (background) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: `${plannedWidth}%`,
                        height: "16px",
                        background: "#242424",
                        border: "1px solid #3A3A3A",
                        borderRadius: "8px",
                      }}
                    />
                    {/* Actual bar (foreground) */}
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: 0,
                        width: `${actualWidth}%`,
                        height: "16px",
                        background: `linear-gradient(90deg, ${getUtilizationColor((category.actual / category.planned) * 100)}, #C4A882)`,
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "24px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #2A2A2A" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", background: "#242424", border: "1px solid #3A3A3A", borderRadius: "4px" }} />
              <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("plannedBudget")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", background: "#C4A882", borderRadius: "4px" }} />
              <span style={{ fontSize: "13px", color: "#9A9080" }}>{t("actualSpent")}</span>
            </div>
          </div>
        </div>

        {/* Add Budget Item Modal */}
        {showAddModal && (
          <div
            onClick={() => setShowAddModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "20px",
                padding: "32px",
                maxWidth: "600px",
                width: "100%",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#E8E0D4", marginBottom: "24px" }}>
                {t("addBudgetItemTitle")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("category")}
                  </label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#242424",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      color: "#E8E0D4",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">{t("selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("descriptionLabel")}
                  </label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
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
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("plannedAmountCr")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.planned}
                    onChange={(e) => setNewItem({ ...newItem, planned: parseFloat(e.target.value) })}
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
                  <label style={{ fontSize: "13px", color: "#9A9080", marginBottom: "8px", display: "block" }}>
                    {t("vendorOptional")}
                  </label>
                  <input
                    type="text"
                    value={newItem.vendor}
                    onChange={(e) => setNewItem({ ...newItem, vendor: e.target.value })}
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

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    onClick={handleAddBudgetItem}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#C4A882",
                      border: "1px solid #C4A882",
                      borderRadius: "8px",
                      color: "#0F0F0F",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("addItem")}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#242424",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      color: "#9A9080",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
