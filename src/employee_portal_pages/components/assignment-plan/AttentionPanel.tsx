import React, { useMemo, useState, useEffect } from "react";
import { Badge, Collapse, Tag, Tooltip } from "antd";
import {
  WarningOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// ---------------------------------------------------------------------------
// Thresholds (days)
// ---------------------------------------------------------------------------
const THRESHOLDS = {
  ACTIVE_BLOCKER_DAYS: 7,
  DELEGATION_STALE_DAYS: 5,
  UNATTENDED_DAYS: 5,
  OFFICER_OVERDUE_DAYS: 7,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AlertCategory =
  | "active_blocker"
  | "report_pending_review"
  | "stale_delegation"
  | "unattended"
  | "officer_overdue";

export interface AttentionAlert {
  category: AlertCategory;
  assignmentId: string;
  appCode: string;
  applicantName: string;
  detail: string;
  ageDays: number;
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------
export const CATEGORY_CONFIG: Record<
  AlertCategory,
  { label: string; color: string; tagColor: string; icon: React.ReactNode; description: string }
> = {
  active_blocker: {
    label: "Active Blockers",
    color: "#dc2626",
    tagColor: "red",
    icon: <WarningOutlined />,
    description: `Application stalled by unpaid fee or pending corrections/reports ≥${THRESHOLDS.ACTIVE_BLOCKER_DAYS} days — follow up with client`,
  },
  report_pending_review: {
    label: "Reports Awaiting Review",
    color: "#0891b2",
    tagColor: "cyan",
    icon: <FileTextOutlined />,
    description: `Client submitted report(s) past due date — pending your review`,
  },
  stale_delegation: {
    label: "Stale Delegation",
    color: "#ca8a04",
    tagColor: "gold",
    icon: <ShareAltOutlined />,
    description: `Active cross-office task pending > ${THRESHOLDS.DELEGATION_STALE_DAYS} days`,
  },
  unattended: {
    label: "Unattended",
    color: "#2563eb",
    tagColor: "blue",
    icon: <ClockCircleOutlined />,
    description: `Not yet assigned to any officer > ${THRESHOLDS.UNATTENDED_DAYS} days`,
  },
  officer_overdue: {
    label: "Officer Overdue",
    color: "#7c3aed",
    tagColor: "purple",
    icon: <FileTextOutlined />,
    description: `Assigned to officer with no completion > ${THRESHOLDS.OFFICER_OVERDUE_DAYS} days`,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const ageDays = (date: string | Date | undefined): number => {
  if (!date) return 0;
  return dayjs().diff(dayjs(date), "day");
};

const resolveCode = (a: any): string =>
  a.applicationDetails?.code || a.applicationDetails?.title || a._id?.slice(-6) || "—";

const resolveApplicant = (a: any): string => {
  const c = a.applicationDetails?.clientDetails;
  if (!c) return "Unknown";
  if (c.userType === "individual") return `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  if (c.userType === "organization") return c.organizationName || "Organization";
  if (c.userType === "government") return c.agencyName || "Agency";
  return c.organizationName || c.agencyName || `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Unknown";
};

// ---------------------------------------------------------------------------
// Alert computation
// ---------------------------------------------------------------------------
export function computeAlerts(assignments: any[]): AttentionAlert[] {
  const alerts: AttentionAlert[] = [];

  for (const a of assignments) {
    const code = resolveCode(a);
    const applicant = resolveApplicant(a);
    const id = a._id;
    const status = a.internalStatus || "";
    const blockers: any[] = a.activeBlockers || [];
    const delegations: any[] = a.delegations || [];
    const updatedAt: string = a.updatedAt;

    // A — Active blockers (fees, corrections, reports) stalling the application
    const activeBlockers = blockers.filter((b) => !b.isResolved && (
      b.type === "awaiting_processing_fee_payment" ||
      b.type === "awaiting_permit_fee_payment" ||
      b.type === "corrections_required" ||
      b.type === "reports_required"
    ));
    for (const b of activeBlockers) {
      const age = ageDays(b.createdAt);
      if (age >= THRESHOLDS.ACTIVE_BLOCKER_DAYS) {
        const detail =
          b.type === "awaiting_processing_fee_payment" ? "Processing fee unpaid" :
          b.type === "awaiting_permit_fee_payment"     ? "Permit fee unpaid" :
          b.type === "corrections_required"            ? "Corrections requested — awaiting client" :
          "Reports requested — awaiting client";
        alerts.push({
          category: "active_blocker",
          assignmentId: id,
          appCode: code,
          applicantName: applicant,
          detail,
          ageDays: age,
        });
      }
    }

    // B — Reports submitted past due date without HOD action
    const overdueSubmittedReports = (a.applicationDetails?.reportRequirements || []).filter(
      (r: any) => r.status === "submitted" && r.dueDate && dayjs().isAfter(dayjs(r.dueDate))
    );
    for (const r of overdueSubmittedReports) {
      const age = dayjs().diff(dayjs(r.dueDate), "day");
      const reportNames = (r.reportTypes || []).map((t: any) => t.name).filter(Boolean).join(", ");
      alerts.push({
        category: "report_pending_review",
        assignmentId: id,
        appCode: code,
        applicantName: applicant,
        detail: reportNames
          ? `Past due: ${reportNames} (${age}d overdue)`
          : `Submitted report past due date (${age}d overdue)`,
        ageDays: age,
      });
    }

    // D — Stale delegation
    const activeDelegations = delegations.filter(
      (d) => d.status === "pending" || d.status === "in_progress"
    );
    for (const d of activeDelegations) {
      const age = ageDays(d.requestedAt);
      if (age >= THRESHOLDS.DELEGATION_STALE_DAYS) {
        alerts.push({
          category: "stale_delegation",
          assignmentId: id,
          appCode: code,
          applicantName: applicant,
          detail: `${d.taskType}${d.toEntityName ? ` → ${d.toEntityName}` : ""} (${d.status.replace("_", " ")})`,
          ageDays: age,
        });
      }
    }

    // D — Unattended (pending assignment, no officer assigned)
    if (status.startsWith("pending_")) {
      const age = ageDays(updatedAt);
      if (age >= THRESHOLDS.UNATTENDED_DAYS) {
        alerts.push({
          category: "unattended",
          assignmentId: id,
          appCode: code,
          applicantName: applicant,
          detail: `Waiting for assignment (${status.replace(/_/g, " ")})`,
          ageDays: age,
        });
      }
    }

    // E — Officer overdue (in_progress, assigned but stale)
    if (status.endsWith("_in_progress")) {
      const lastStep = a.workflowSteps?.at(-1);
      const startedAt = lastStep?.startedAt || updatedAt;
      const age = ageDays(startedAt);
      if (age >= THRESHOLDS.OFFICER_OVERDUE_DAYS) {
        const assignedName = lastStep?.assignedTo
          ? typeof lastStep.assignedTo === "object"
            ? `${lastStep.assignedTo.firstname || ""} ${lastStep.assignedTo.lastname || ""}`.trim()
            : ""
          : "";
        alerts.push({
          category: "officer_overdue",
          assignmentId: id,
          appCode: code,
          applicantName: applicant,
          detail: assignedName ? `Assigned to ${assignedName}` : "In progress — no update",
          ageDays: age,
        });
      }
    }
  }

  // Sort: most urgent first (highest age)
  return alerts.sort((a, b) => b.ageDays - a.ageDays);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface AttentionPanelProps {
  assignments: any[];
  onViewApp: (assignmentId: string) => void;
}

const STORAGE_KEY = "attention-panel-collapsed";

const AttentionPanel: React.FC<AttentionPanelProps> = ({ assignments, onViewApp }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });

  const alerts = useMemo(() => computeAlerts(assignments), [assignments]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch {}
  }, [collapsed]);

  if (!alerts.length) return null;

  const byCategory = Object.fromEntries(
    (Object.keys(CATEGORY_CONFIG) as AlertCategory[]).map((cat) => [
      cat,
      alerts.filter((a) => a.category === cat),
    ])
  ) as Record<AlertCategory, AttentionAlert[]>;

  const categoriesWithAlerts = (Object.keys(CATEGORY_CONFIG) as AlertCategory[]).filter(
    (cat) => byCategory[cat].length > 0
  );

  return (
    <div className="mx-4 mt-3 mb-0">
      <Collapse
        activeKey={collapsed ? [] : ["attention"]}
        onChange={(keys) => setCollapsed(!Array.isArray(keys) ? keys !== "attention" : !keys.includes("attention"))}
        className="!border-orange-200 !rounded-xl overflow-hidden shadow-sm"
        style={{ background: "white" }}
        items={[
          {
            key: "attention",
            label: (
              <div className="flex items-center gap-2">
                <WarningOutlined className="text-orange-500 text-sm" />
                <span className="font-bold text-sm text-gray-800">Needs Attention</span>
                <Badge
                  count={alerts.length}
                  style={{ backgroundColor: "#ea580c" }}
                  overflowCount={99}
                />
                <span className="ml-auto text-[11px] text-gray-400 font-normal">
                  {categoriesWithAlerts.length} categor{categoriesWithAlerts.length === 1 ? "y" : "ies"} flagged
                </span>
              </div>
            ),
            children: (
              <div className="flex flex-col gap-4">
                {/* Summary chips */}
                <div className="flex flex-wrap gap-2">
                  {categoriesWithAlerts.map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    return (
                      <Tooltip key={cat} title={cfg.description}>
                        <Tag
                          icon={cfg.icon}
                          color={cfg.tagColor}
                          className="!text-[11px] !font-semibold cursor-help"
                        >
                          {cfg.label} · {byCategory[cat].length}
                        </Tag>
                      </Tooltip>
                    );
                  })}
                </div>

                {/* Per-category rows */}
                {categoriesWithAlerts.map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const items = byCategory[cat];
                  return (
                    <div key={cat}>
                      <div
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: cfg.color }}
                      >
                        {cfg.icon}
                        <span>{cfg.label}</span>
                        <span className="text-gray-400 font-normal normal-case tracking-normal ml-1">
                          — {cfg.description}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {items.map((alert, i) => (
                          <div
                            key={`${alert.assignmentId}-${i}`}
                            className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 hover:bg-white transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span
                                className="w-1.5 h-8 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cfg.color }}
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-bold text-gray-900 font-mono">
                                    {alert.appCode}
                                  </span>
                                  <span className="text-[11px] text-gray-600 truncate max-w-[180px]">
                                    {alert.applicantName}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{alert.detail}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Tag
                                className="!text-[10px] !m-0"
                                color={alert.ageDays >= 14 ? "red" : alert.ageDays >= 7 ? "orange" : "gold"}
                              >
                                {alert.ageDays}d
                              </Tag>
                              <button
                                onClick={() => onViewApp(alert.assignmentId)}
                                className="text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Scroll to application"
                              >
                                <EyeOutlined className="text-[12px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <p className="text-[10px] text-gray-400 italic text-right mt-0">
                  Thresholds: blockers ≥{THRESHOLDS.ACTIVE_BLOCKER_DAYS}d · delegation ≥{THRESHOLDS.DELEGATION_STALE_DAYS}d · unattended ≥{THRESHOLDS.UNATTENDED_DAYS}d · officer ≥{THRESHOLDS.OFFICER_OVERDUE_DAYS}d
                </p>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AttentionPanel;
