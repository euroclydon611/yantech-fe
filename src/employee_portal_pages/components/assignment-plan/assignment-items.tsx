import React, { useState } from "react";
import {
  Tag,
  Tooltip,
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Popover,
  Modal,
  Input,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  SendOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  EditOutlined,
  FileTextOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatDate, getDaysUntilDeadline } from "@/utils/helpers";
import { HistoryTimeline } from "@/employee_portal_pages/components/assignment-plan/helpers";
import { ActiveBlocker, AssignmentDelegation, BlockerType } from "@/employee_portal_pages/types/assignments";
import { ShareAltOutlined } from "@ant-design/icons";
import {
  useCancelDelegationMutation,
  useRequesterCompleteDelegationMutation,
} from "@/redux/features/employee-portal-api/application/assignment";

const BLOCKER_CONFIG: Record<BlockerType, { label: string; color: string; tagColor: string; icon: React.ReactNode }> = {
  awaiting_processing_fee_payment: {
    label: "Awaiting Processing Fee",
    color: "#d97706",
    tagColor: "orange",
    icon: <DollarOutlined />,
  },
  awaiting_permit_fee_payment: {
    label: "Awaiting Permit Fee",
    color: "#7c3aed",
    tagColor: "purple",
    icon: <DollarOutlined />,
  },
  corrections_required: {
    label: "Corrections Pending",
    color: "#dc2626",
    tagColor: "red",
    icon: <EditOutlined />,
  },
  reports_required: {
    label: "Reports Pending",
    color: "#0284c7",
    tagColor: "blue",
    icon: <FileTextOutlined />,
  },
};

const RESOLVED_LABEL: Partial<Record<string, string>> = {
  awaiting_processing_fee_payment: "Processing Fee Paid",
  awaiting_permit_fee_payment: "Permit Fee Paid",
  corrections_required: "Corrections Submitted",
  reports_required: "Reports Submitted",
};

interface ActiveBlockersBadgeProps {
  activeBlockers?: ActiveBlocker[];
  compact?: boolean;
}

export const ActiveBlockersBadge: React.FC<ActiveBlockersBadgeProps> = ({
  activeBlockers,
  compact = false,
}) => {
  const all = activeBlockers ?? [];
  if (!all.length) return null;

  const unresolved = all.filter((b) => !b.isResolved);
  const resolved = all.filter((b) => b.isResolved);

  const content = (
    <div className="flex flex-col gap-1 max-w-[280px]">
      {unresolved.length > 0 && (
        <>
          <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
            Pending Client Actions
          </p>
          {unresolved.map((b) => {
            const cfg = BLOCKER_CONFIG[b.type] ?? {
              label: b.type.replace(/_/g, " "),
              tagColor: "default",
              icon: <WarningOutlined />,
            };
            return (
              <div key={b._id} className="flex flex-col gap-0.5">
                <Tag
                  icon={cfg.icon}
                  color={cfg.tagColor}
                  className="text-[11px] font-semibold w-fit"
                >
                  {cfg.label}
                </Tag>
                {b.notes && (
                  <p className="text-[10px] text-gray-400 italic pl-1 line-clamp-2">
                    {b.notes}
                  </p>
                )}
                {b.dueDate && (
                  <p className="text-[10px] text-gray-400 pl-1">
                    Due: {new Date(b.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            );
          })}
        </>
      )}
      {resolved.length > 0 && (
        <>
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mt-1 mb-1">
            Client Fulfilled
          </p>
          {resolved.map((b) => {
            const label = RESOLVED_LABEL[b.type] ?? `${b.type.replace(/_/g, " ")} (Done)`;
            return (
              <Tag
                key={b._id}
                icon={<CheckCircleOutlined />}
                color="success"
                className="text-[11px] font-semibold w-fit"
              >
                {label}
              </Tag>
            );
          })}
        </>
      )}
    </div>
  );

  if (compact) {
    return (
      <Tooltip title={content} overlayClassName="max-w-xs">
        <Tag
          icon={<WarningOutlined />}
          color="warning"
          className="text-[10px] font-semibold cursor-help border-amber-300 bg-amber-50 text-amber-700 flex items-center gap-1 w-fit"
        >
          {unresolved.length} Pending
        </Tag>
      </Tooltip>
    );
  }

  return (
    <Popover
      content={content}
      title={null}
      trigger="hover"
      placement="top"
      overlayClassName="max-w-xs"
    >
      <div className="flex flex-wrap gap-1 cursor-help">
        {unresolved.map((b) => {
          const cfg = BLOCKER_CONFIG[b.type];
          return (
            <Tag
              key={b._id}
              icon={cfg?.icon ?? <WarningOutlined />}
              color={cfg?.tagColor ?? "warning"}
              className="text-[10px] font-semibold"
            >
              {cfg?.label ?? b.type.replace(/_/g, " ")}
            </Tag>
          );
        })}
        {resolved.map((b) => {
          const label = RESOLVED_LABEL[b.type] ?? `${b.type.replace(/_/g, " ")} (Done)`;
          return (
            <Tag
              key={b._id}
              icon={<CheckCircleOutlined />}
              color="success"
              className="text-[10px] font-semibold"
            >
              {label}
            </Tag>
          );
        })}
      </div>
    </Popover>
  );
};

interface DelegationBadgeProps {
  delegations?: AssignmentDelegation[];
  assignmentId?: string;
  onRefresh?: () => void;
}

export const DelegationBadge: React.FC<DelegationBadgeProps> = ({ delegations, assignmentId, onRefresh }) => {
  const [cancelDelegation, { isLoading: isCancelling }] = useCancelDelegationMutation();
  const [requesterComplete, { isLoading: isForceCompleting }] = useRequesterCompleteDelegationMutation();
  const [actionModal, setActionModal] = useState<{ type: "cancel" | "complete"; delegationId: string; taskType: string } | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  const all = delegations ?? [];
  const active = all.filter((d) => d.status === "pending" || d.status === "in_progress");
  const completed = all.filter((d) => d.status === "completed");

  if (!all.length) return null;

  const handleActionConfirm = async () => {
    if (!actionModal || !assignmentId) return;
    try {
      if (actionModal.type === "cancel") {
        await cancelDelegation({ assignmentId, delegationId: actionModal.delegationId, reason: actionNotes }).unwrap();
        message.success("Delegation cancelled");
      } else {
        await requesterComplete({ assignmentId, delegationId: actionModal.delegationId, notes: actionNotes }).unwrap();
        message.success("Delegation marked as complete");
      }
      setActionModal(null);
      setActionNotes("");
      onRefresh?.();
    } catch (err: any) {
      message.error(err?.data?.error || "Action failed");
    }
  };

  const popoverContent = (
    <div className="flex flex-col gap-2 max-w-[320px]">
      {active.length > 0 && (
        <>
          <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">
            Awaiting External Office
          </p>
          {active.map((d) => (
            <div key={d._id} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <Tag icon={<ShareAltOutlined />} color="orange" className="text-[11px] font-semibold w-fit">
                {d.taskType}{d.toEntityName ? ` → ${d.toEntityName}` : ""}
              </Tag>
              <p className="text-[10px] text-gray-400 italic pl-1 line-clamp-2">{d.description}</p>
              <span className="text-[10px] text-orange-500 pl-1 capitalize">{d.status.replace("_", " ")}</span>
              {assignmentId && (
                <div className="flex gap-1 mt-0.5">
                  <Button
                    size="small"
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    className="!text-[10px] !h-5 !px-1.5 !bg-green-600 !border-green-600"
                    onClick={(e) => { e.stopPropagation(); setActionNotes(""); setActionModal({ type: "complete", delegationId: d._id, taskType: d.taskType }); }}
                  >
                    Mark Done
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<CloseCircleOutlined />}
                    className="!text-[10px] !h-5 !px-1.5"
                    onClick={(e) => { e.stopPropagation(); setActionNotes(""); setActionModal({ type: "cancel", delegationId: d._id, taskType: d.taskType }); }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      {completed.length > 0 && (
        <>
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mt-1 mb-1">
            External Task Resolved
          </p>
          {completed.map((d) => (
            <div key={d._id} className="flex flex-col gap-0.5">
              <Tag icon={<CheckCircleOutlined />} color="success" className="text-[11px] font-semibold w-fit">
                {d.taskType}{d.toEntityName ? ` → ${d.toEntityName}` : ""}
              </Tag>
              {d.result && (
                <p className="text-[10px] text-gray-400 italic pl-1 line-clamp-2">Result: {d.result}</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <>
      <Popover content={popoverContent} title="External Tasks" trigger="click" placement="top">
        <div className="flex flex-wrap gap-1 cursor-pointer">
          {active.map((d) => (
            <Tag key={d._id} icon={<ShareAltOutlined />} color="orange" className="text-[10px] font-semibold">
              {d.taskType}{d.toEntityName ? ` → ${d.toEntityName}` : ""}
            </Tag>
          ))}
          {completed.map((d) => (
            <Tag key={d._id} icon={<CheckCircleOutlined />} color="success" className="text-[10px] font-semibold">
              {d.taskType}{d.toEntityName ? ` → ${d.toEntityName}` : ""} ✓
            </Tag>
          ))}
        </div>
      </Popover>

      <Modal
        open={!!actionModal}
        title={actionModal?.type === "cancel" ? `Cancel: ${actionModal?.taskType}` : `Mark Done: ${actionModal?.taskType}`}
        onOk={handleActionConfirm}
        onCancel={() => setActionModal(null)}
        okText={actionModal?.type === "cancel" ? "Cancel Delegation" : "Mark as Done"}
        okButtonProps={{
          danger: actionModal?.type === "cancel",
          className: actionModal?.type === "complete" ? "!bg-green-600 !border-green-600" : undefined,
          loading: isCancelling || isForceCompleting,
        }}
        width={400}
      >
        <p className="text-sm text-gray-600 mb-3">
          {actionModal?.type === "cancel"
            ? "Are you sure you want to cancel this external task request? The delegated office will be notified."
            : "Mark this external task as done from your end. The delegated office will be notified."}
        </p>
        <Input.TextArea
          rows={3}
          placeholder={actionModal?.type === "cancel" ? "Reason for cancellation (optional)" : "Notes (optional)"}
          value={actionNotes}
          onChange={(e) => setActionNotes(e.target.value)}
        />
      </Modal>
    </>
  );
};

interface StatusDisplayProps {
  assignment: any;
  getStageInfo: (status: string) => any;
  minimal?: boolean;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  assignment,
  getStageInfo,
  minimal = false,
}) => {
  const stageInfo = getStageInfo(assignment.internalStatus);
  return (
    <div className={`flex flex-col ${minimal ? 'items-start' : 'items-center'} space-y-1`}>
      <Tag
        icon={stageInfo.icon}
        color={stageInfo.color}
        className={`font-medium ${minimal ? 'px-2 py-0 text-[10px]' : 'px-3 py-1'}`}
      >
        {stageInfo.text}
      </Tag>
      {!minimal && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(assignment.updatedAt)}
        </span>
      )}
    </div>
  );
};

interface ProcessingTypeTagProps {
  processingType?: string;
  minimal?: boolean;
  compact?: boolean;
}

export const ProcessingTypeTag: React.FC<ProcessingTypeTagProps> = ({
  processingType,
  minimal = false,
  compact = false,
}) => {
  if (!processingType) return null;

  const isExpedited = processingType.toLowerCase() === "expedited";

  if (compact) {
    return (
      <Tooltip title={`${isExpedited ? "Expedited" : "Standard"} Processing`}>
        <div 
          className={`inline-flex items-center justify-center rounded shadow-sm ${
            isExpedited 
              ? "bg-amber-500 text-white" 
              : "bg-blue-500 text-white"
          } ${minimal ? "w-[18px] h-[18px] text-[10px]" : "w-[22px] h-[22px] text-[12px]"}`}
          style={{ fontWeight: 900 }}
        >
          {isExpedited ? (
            <ThunderboltOutlined style={{ fontSize: minimal ? '10px' : '12px' }} />
          ) : (
            "S"
          )}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isExpedited ? "Expedited Processing" : "Standard Processing"}>
      <Tag
        icon={isExpedited ? <ThunderboltOutlined /> : null}
        color={isExpedited ? "volcano" : "blue"}
        className={`font-bold uppercase tracking-wider ${
          minimal ? "text-[9px] px-1 py-0 leading-tight" : "text-[10px] px-2 py-0.5"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {processingType}
      </Tag>
    </Tooltip>
  );
};

interface DeadlineDisplayProps {
  deadline: string;
  deadlineTime?: string;
}

export const DeadlineDisplay: React.FC<DeadlineDisplayProps> = ({
  deadline,
  deadlineTime,
}) => {
  const deadlineInfo = getDaysUntilDeadline(deadline, deadlineTime);
  return (
    <Tooltip
      title={`Deadline: ${formatDate(deadline)}${
        deadlineTime ? ` at ${deadlineTime}` : ""
      }`}
    >
      <Tag
        color={deadlineInfo.color}
        icon={<ClockCircleOutlined />}
        className="font-medium"
      >
        {deadlineInfo.text}
      </Tag>
    </Tooltip>
  );
};

interface TaskPriorityIndicatorProps {
  assignment: any;
}

export const TaskPriorityIndicator: React.FC<TaskPriorityIndicatorProps> = ({
  assignment,
}) => {
  const deadlineInfo = getDaysUntilDeadline(
    assignment?.workflowSteps.at(-1)?.deadline,
    assignment?.workflowSteps.at(-1)?.deadlineTime
  );
  const isOverdue =
    deadlineInfo.color === "red" || deadlineInfo.color === "error";
  const isUrgent =
    deadlineInfo.color === "orange" || deadlineInfo.color === "warning";

  if (isOverdue) {
    return <Badge status="error" text={deadlineInfo.text || "Overdue"} />;
  } else if (isUrgent) {
    return <Badge status="warning" text={deadlineInfo.text || "Urgent"} />;
  } else {
    return <Badge status="success" text={deadlineInfo.text || "On Track"} />;
  }
};

interface ActionButtonsProps {
  assignment: any;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  statusFilter: string;
  openAssignModal: (assignment: any) => void;
  openReviewModal: (assignment: any) => void;
  setSelectedApplication: (assignment: any) => void;
  setViewModalOpen: (open: boolean) => void;
  getActionMenu: (assignment: any) => any;
  onHodFinalApproval?: (assignment: any) => void;
  minimal?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  assignment,
  selectedIds,
  setSelectedIds,
  statusFilter,
  openAssignModal,
  openReviewModal,
  setSelectedApplication,
  setViewModalOpen,
  getActionMenu,
  onHodFinalApproval,
  minimal = false,
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);

    if (checked) {
      newSelectedIds.add(assignment._id);
    } else {
      newSelectedIds.delete(assignment._id);
    }

    setSelectedIds(newSelectedIds);
    console.log("Selected IDs:", Array.from(newSelectedIds));
  };

  return (
    <div className="flex items-center space-x-2">
      {!minimal && (
        <div
          hidden={
            ![
              "pending_completeness_check_assignment",
              "pending_evaluation_assignment",
              "pending_processing_fee_assignment",
              "pending_permit_fee_assignment",
              "pending_issuance_assignment",
            ].includes(statusFilter)
          }
        >
          <Checkbox
            checked={selectedIds.has(assignment._id)}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="custom-checkbox"
          />
        </div>
      )}

      {assignment.internalStatus.startsWith("pending_") &&
        assignment.internalStatus !== "pending_hod_final_approval" && (
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => openAssignModal(assignment)}
          className="bg-green-600 hover:!bg-green-700"
          size="small"
        >
          Assign
        </Button>
      )}

      {assignment.internalStatus === "pending_hod_final_approval" && onHodFinalApproval && (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => onHodFinalApproval(assignment)}
          size="small"
          style={{ backgroundColor: "#7c3aed", borderColor: "#7c3aed" }}
        >
          Grant Final Approval
        </Button>
      )}

      {assignment.internalStatus.startsWith("review_") && (
        <Button
          type="primary"
          ghost
          icon={<CheckCircleOutlined />}
          onClick={() => openReviewModal(assignment)}
          size="small"
        >
          Review
        </Button>
      )}

      <Button
        type="default"
        size="small"
        icon={<EyeOutlined />}
        onClick={() => {
          setSelectedApplication(assignment);
          setViewModalOpen(true);
        }}
        className="w-full sm:w-auto"
      />

      {!minimal && (
        <Dropdown
          menu={getActionMenu(assignment) as any}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      )}
    </div>
  );
};



interface HistoryButtonProps {
  assignment: any;
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({ assignment }) => (
  <Popover
    placement="left"
    title={
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0D4A2A]/10 flex items-center justify-center">
            <HistoryOutlined className="text-[#0D4A2A] text-xs" />
          </div>
          <span className="text-sm font-semibold text-gray-800">Application History</span>
        </div>
        {assignment.history?.length > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0D4A2A]/10 text-[#0D4A2A]">
            {assignment.history.length} {assignment.history.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>
    }
    content={<HistoryTimeline history={assignment.history} />}
    trigger="click"
    overlayStyle={{
      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      borderRadius: "12px",
    }}
    overlayInnerStyle={{ padding: "12px" }}
  >
    <Button
      type="text"
      size="small"
      icon={<HistoryOutlined className="text-[#0D4A2A]" />}
      className="text-xs text-[#0D4A2A] hover:bg-[#0D4A2A]/10"
    >
      History
    </Button>
  </Popover>
);



export const assignmentPlanStatusOptions = [
  { label: "All Pending Assignments", value: "pending_assignments" },
  { label: "Review (HOD)", value: "review" },
  {
    label: "Pending Processing Fee",
    value: "pending_processing_fee_assignment",
  },
  {
    label: "Pending Completeness Check",
    value: "pending_completeness_check_assignment",
  },
  {
    label: "Pending Evaluation",
    value: "pending_evaluation_assignment",
  },
  { label: "Pending Permit Fee", value: "pending_permit_fee_assignment" },
  { label: "Pending Issuance", value: "pending_issuance_assignment" },

  { label: "In Progress", value: "in_progress" },
  {
    label: "Awaiting Processing Fee Payment",
    value: "awaiting_processing_fee_payment",
  },
  {
    label: "Awaiting Permit Fee Payment",
    value: "awaiting_permit_fee_payment",
  },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];