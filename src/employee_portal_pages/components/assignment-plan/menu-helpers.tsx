import React from "react";
import {
  ProjectOutlined,
  SendOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
  FastForwardOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  AuditOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Assignment } from "@/employee_portal_pages/types/assignments";
import type { MenuProps } from "antd";

interface MenuHandlers {
  openAssignModal: (assignment: Assignment) => void;
  openReviewModal: (assignment: Assignment) => void;
  handleCallBackStage: (assignment: Assignment) => void;
  handleSkipStep: (assignment: Assignment) => void;
  handleRevertStep: (assignment: Assignment) => void;
  handleReject: (assignment: Assignment) => void;
  handleRequestReport: (assignment: Assignment) => void;
  handleRequestCorrections: (assignment: Assignment) => void;
  setSelectedApplication: (assignment: Assignment) => void;
  setAssignmentPlanModalOpen: (open: boolean) => void;
  handleHodFinalApproval?: (assignment: Assignment) => void;
  handleDelegateTask?: (assignment: Assignment) => void;
}

export const getActionMenu = (
  assignment: Assignment,
  handlers: MenuHandlers
): MenuProps => ({
  items: [
    {
      key: "plan",
      icon: <ProjectOutlined />,
      label: "View Plan",
      onClick: () => {
        handlers.setSelectedApplication(assignment);
        handlers.setAssignmentPlanModalOpen(true);
      },
    },
    {
      key: "assign",
      icon: <SendOutlined />,
      label: "Assign Officer",
      disabled: !assignment.internalStatus.startsWith("pending_"),
      onClick: () => handlers.openAssignModal(assignment),
    },
    {
      key: "review",
      icon: <CheckCircleOutlined />,
      label: "Review Stage",
      disabled: !assignment.internalStatus.startsWith("review_"),
      onClick: () => handlers.openReviewModal(assignment),
    },
    { type: "divider" },
    {
      key: "recall",
      icon: <RollbackOutlined />,
      label: "Recall",
      disabled: !assignment.internalStatus.endsWith("_in_progress"),
      onClick: () => handlers.handleCallBackStage(assignment),
    },
    {
      key: "skip",
      icon: <FastForwardOutlined />,
      label: "Skip Current Step",
      disabled:
        assignment.internalStatus === "pending_issuance_assignment" ||
        !assignment.internalStatus.startsWith("pending_"),
      onClick: () => handlers.handleSkipStep(assignment),
    },
    {
      key: "revert",
      icon: <ArrowLeftOutlined />,
      label: "Revert Stage",
      disabled:
        !assignment.internalStatus.startsWith("pending_") ||
        !assignment.history?.length,
      onClick: () => handlers.handleRevertStep(assignment),
    },
    {
      key: "reject",
      icon: <CloseCircleOutlined />,
      label: "Reject Application",
      danger: true,
      disabled:
        assignment.internalStatus === "pending_issuance_assignment" ||
        !assignment.internalStatus.startsWith("pending_"),
      onClick: () => handlers.handleReject(assignment),
    },
    {
      key: "request_report",
      icon: <FileTextOutlined />,
      label: "Request Report from Client",
      disabled:
        assignment.internalStatus === "pending_issuance_assignment" ||
        !assignment.internalStatus.startsWith("pending_") || assignment.applicationType== "EfficacyTrial",
      onClick: () => handlers.handleRequestReport(assignment),
    },
    {
      key: "request_corrections",
      icon: <EditOutlined />,
      label: "Request Corrections from Applicant",
      disabled: !assignment.internalStatus.startsWith("pending_"),
      onClick: () => handlers.handleRequestCorrections(assignment),
    },
    ...(assignment.internalStatus === "pending_hod_final_approval" && handlers.handleHodFinalApproval
      ? [
          { type: "divider" as const },
          {
            key: "hod_final_approval",
            icon: <AuditOutlined />,
            label: "Grant Final Approval",
            style: { color: "#7c3aed", fontWeight: 600 },
            onClick: () => handlers.handleHodFinalApproval!(assignment),
          },
        ]
      : []),
    ...(handlers.handleDelegateTask
      ? [
          { type: "divider" as const },
          {
            key: "delegate_task",
            icon: <ShareAltOutlined />,
            label: "Request External Task",
            style: { color: "#0369a1", fontWeight: 600 },
            onClick: () => handlers.handleDelegateTask!(assignment),
          },
        ]
      : []),
  ],
});
