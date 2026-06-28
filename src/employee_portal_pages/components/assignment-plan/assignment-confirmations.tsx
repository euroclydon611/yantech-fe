import { Modal, message, Form, Input, Select, DatePicker, Tooltip, Upload, Button } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  EditOutlined,
  RollbackOutlined,
  WarningOutlined,
  FolderOpenOutlined,
  CloseCircleOutlined,
  FastForwardOutlined,
  UploadOutlined,
  FileOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Assignment, Officer } from "@/employee_portal_pages/types/assignments";
import { formatDate } from "@/utils/helpers";
import { normalizeText, handleDocumentView } from "@/utils/helperFunction";
import dayjs from "dayjs";

const { confirm } = Modal;
const { TextArea } = Input;

export interface AssignFormValues {
  assignedTo?: string;
  subDivisionId?: string;
  copiedEmployees?: string[];
  deadline?: dayjs.Dayjs;
  deadlineTime?: dayjs.Dayjs;
  notes?: string;
  requiresInspection?: boolean;
  requiresAnalysis?: boolean;
  requiresPublicHearing?: boolean;
}

interface AssignConfirmationProps {
  assignment: Assignment;
  selectedOfficer: Officer | undefined;
  copiedEmployees: Officer[];
  values: AssignFormValues;
  onConfirm: () => Promise<void>;
}

export const showAssignConfirmation = ({
  assignment,
  selectedOfficer,
  copiedEmployees,
  values,
  onConfirm,
}: AssignConfirmationProps) => {
  const deadlineText = values.deadline
    ? values.deadline.locale("en").format("MMMM DD, YYYY")
    : "No deadline set";

  const deadlineTimeText = values.deadlineTime
    ? values.deadlineTime.format("HH:mm")
    : "";

  confirm({
    title: "Confirm Task Assignment",
    icon: <TeamOutlined style={{ color: "#1890ff" }} />,
    width: 520,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to assign this task? The selected officer will
          be notified and the task will appear in their dashboard.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <div className="pb-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Application Details:
            </p>
            <p className="text-sm text-gray-800">
              <strong>{assignment.applicationDetails.title}</strong>
            </p>
            <p className="text-xs text-gray-600">
              Code: {assignment.applicationDetails.code}
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <UserOutlined className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Assigned Officer:
              </p>
              <p className="text-sm text-gray-800">
                {selectedOfficer
                  ? `${selectedOfficer.staff_id} - ${
                      selectedOfficer.firstname
                    } ${selectedOfficer.lastname} ${
                      selectedOfficer.other_names || ""
                    }`.trim()
                  : "Officer not found"}
              </p>
            </div>
          </div>

          {copiedEmployees.length > 0 && (
            <div className="flex items-start space-x-2">
              <TeamOutlined className="text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Copied Employees (CC):
                </p>
                <p className="text-sm text-gray-800">
                  {copiedEmployees
                    .map((emp) => `${emp.firstname} ${emp.lastname}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}

          {assignment.internalStatus === "pending_evaluation_assignment" && (
            <>
              <div className="flex items-start space-x-2">
                <ExclamationCircleOutlined className="text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-700">
                    Requires a physical inspection:
                  </p>
                  <p className="text-sm text-gray-800">
                    {values.requiresInspection ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FileSearchOutlined className="text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-700">
                    Requires laboratory analysis:
                  </p>
                  <p className="text-sm text-gray-800">
                    {values.requiresAnalysis ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FastForwardOutlined className="text-amber-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-700">
                    Requires public hearing:
                  </p>
                  <p className="text-sm text-gray-800">
                    {values.requiresPublicHearing ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-start space-x-2">
            <CalendarOutlined className="text-orange-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Deadline:</p>
              <p className="text-sm text-gray-800">
                {deadlineText} {deadlineTimeText && `@ ${deadlineTimeText}`}
              </p>
            </div>
          </div>

          {values.notes && (
            <div className="flex items-start space-x-2">
              <FileTextOutlined className="text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Instructions:
                </p>
                <div className="text-sm text-gray-800 bg-white p-2 rounded border max-h-20 overflow-y-auto italic">
                  "{values.notes}"
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                What happens next:
              </p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>
                  • The officer will receive a notification about this
                  assignment
                </li>
                <li>
                  • The task will appear in their dashboard with your
                  instructions
                </li>
                <li>
                  • You can track progress and receive updates on completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    okText: "Yes, Assign Task",
    okType: "primary",
    okButtonProps: {
      className: "bg-blue-600 hover:!bg-blue-700 text-white",
      icon: <TeamOutlined />,
    },
    cancelText: "Cancel",
    onOk: onConfirm,
  });
};

export interface BulkAssignFormValues {
  assignedToIds?: string[];
  copiedEmployees?: string[];
  deadline?: dayjs.Dayjs;
  deadlineTime?: dayjs.Dayjs;
  notes?: string;
  requiresInspection?: boolean;
  requiresAnalysis?: boolean;
  requiresPublicHearing?: boolean;
}

interface BulkAssignConfirmationProps {
  selectedCount: number;
  selectedOfficers: Officer[];
  copiedEmployees: Officer[];
  values: BulkAssignFormValues;
  statusFilter: string;
  onConfirm: () => Promise<void>;
}

export const showBulkAssignConfirmation = ({
  selectedCount,
  selectedOfficers,
  copiedEmployees,
  values,
  statusFilter,
  onConfirm,
}: BulkAssignConfirmationProps) => {
  const deadlineText = values.deadline
    ? values.deadline.locale("en").format("MMMM DD, YYYY")
    : "No deadline set";

  const deadlineTimeText = values.deadlineTime
    ? values.deadlineTime.format("HH:mm")
    : "";

  confirm({
    title: "Confirm Bulk Task Assignment",
    icon: <TeamOutlined style={{ color: "#1890ff" }} />,
    width: 520,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to assign <strong>{selectedCount}</strong>{" "}
          applications? The selected officers will be notified immediately.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <div className="pb-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Applications:
            </p>
            <p className="text-sm text-blue-600 font-bold">
              {selectedCount} items selected for assignment
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <UserOutlined className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Assigned Officers:
              </p>
              <p className="text-sm text-gray-800">
                {selectedOfficers.length > 0
                  ? selectedOfficers
                      .map((o) => `${o.firstname} ${o.lastname}`)
                      .join(", ")
                  : "No officers selected"}
              </p>
            </div>
          </div>

          {copiedEmployees.length > 0 && (
            <div className="flex items-start space-x-2">
              <TeamOutlined className="text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Copied Employees (CC):
                </p>
                <p className="text-sm text-gray-800">
                  {copiedEmployees
                    .map((e) => `${e.firstname} ${e.lastname}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}

          {statusFilter === "pending_evaluation_assignment" && (
            <div className="bg-yellow-50 p-2 rounded border border-yellow-100 text-[11px] text-yellow-700">
              <strong>Settings:</strong> Inspection:{" "}
              {values.requiresInspection ? "Yes" : "No"}, Analysis:{" "}
              {values.requiresAnalysis ? "Yes" : "No"}, Public Hearing:{" "}
              {values.requiresPublicHearing ? "Yes" : "No"}
            </div>
          )}

          <div className="flex items-start space-x-2">
            <CalendarOutlined className="text-orange-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Deadline:</p>
              <p className="text-sm text-gray-800">
                {deadlineText} {deadlineTimeText && `@ ${deadlineTimeText}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    okText: "Yes, Assign All",
    okButtonProps: {
      className: "bg-blue-600 hover:!bg-blue-700 text-white",
    },
    cancelText: "Cancel",
    onOk: onConfirm,
  });
};

interface RejectionConfirmationProps {
  assignment: Assignment;
  rejectionReason: string;
  onConfirm: () => Promise<void>;
}

export const showRejectionConfirmation = ({
  assignment,
  rejectionReason,
  onConfirm,
}: RejectionConfirmationProps) => {
  confirm({
    title: "FINAL CONFIRMATION - Reject Application",
    icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
    width: 650,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        {/* CRITICAL WARNING */}
        <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
          <div className="flex items-center space-x-2 mb-3">
            <WarningOutlined className="text-red-600 text-xl" />
            <span className="font-bold text-red-800 text-lg">
              CRITICAL ACTION WARNING
            </span>
          </div>
          <div className="bg-red-200 p-3 rounded border border-red-400">
            <p className="text-sm font-bold text-red-800 mb-2">
              ⚠️ THIS ACTION IS PERMANENT AND IRREVERSIBLE ⚠️
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• The entire application workflow will be TERMINATED</li>
              <li>• The applicant will be notified of the rejection</li>
              <li>• This decision cannot be undone or reversed</li>
              <li>• The application will be marked as permanently rejected</li>
            </ul>
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <FolderOpenOutlined className="text-gray-600" />
            <span className="font-semibold text-gray-800">
              Application to be Rejected
            </span>
          </div>
          <div className="ml-6 space-y-2">
            <p className="text-sm font-medium text-gray-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-gray-600">
              ID: {assignment.applicationDetails?.code || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Current Status: {normalizeText(assignment.internalStatus)}
            </p>
          </div>
        </div>

        {/* Rejection Reason Preview */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <FileTextOutlined className="text-red-600" />
            <span className="font-medium text-red-800">
              Your Rejection Reason:
            </span>
          </div>
          <div className="bg-white p-3 rounded border border-red-200 max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {rejectionReason}
            </p>
          </div>
        </div>

        {/* Final Confirmation Text */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            To proceed with this PERMANENT rejection, please confirm:
          </p>
          <p className="text-sm text-yellow-700 italic">
            "I understand that rejecting this application will permanently
            terminate the entire workflow, notify the applicant, and cannot be
            reversed."
          </p>
        </div>
      </div>
    ),
    okText: "YES, PERMANENTLY REJECT APPLICATION",
    okType: "danger",
    okButtonProps: {
      danger: true,
      size: "large",
      className: "font-bold bg-red-600 hover:!bg-red-700 text-white",
    },
    cancelText: "Cancel - Do Not Reject",
    cancelButtonProps: {
      size: "large",
      type: "default",
      className: "bg-blue-600 hover:!bg-blue-700 text-white",
    },
    onOk: onConfirm,
  });
};

export interface ReportRequestValues {
  reportTypes: {
    name: string;
    description?: string;
    template?: {
      filename?: string;
      mimetype?: string;
      s3Url?: string;
      originalname?: string;
      uploadedAt?: Date;
    };
  }[];
  dueDate?: dayjs.Dayjs | null;
  notes?: string;
  attachment?: any;
}

interface ReportRequestConfirmationProps {
  assignment: Assignment;
  reportData: ReportRequestValues;
  onConfirm: () => Promise<void>;
}

export const showReportRequestConfirmation = ({
  assignment,
  reportData,
  onConfirm,
}: ReportRequestConfirmationProps) => {
  confirm({
    title: "Confirm Report Request",
    icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
    width: 580,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-3">
        <p className="text-sm">
          You are about to <strong>request a report from the client</strong>{" "}
          for:
        </p>
        <p className="text-sm font-medium">
          {assignment.applicationDetails?.code} -{" "}
          {assignment.applicationDetails?.title}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <div className="pb-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Reports Required:
            </p>
            <div className="space-y-1">
              {reportData.reportTypes?.map(
                (reportType: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-blue-100 border border-blue-300 rounded px-3 py-2 text-sm text-blue-800"
                  >
                    • {reportType.name}
                  </div>
                )
              )}
            </div>
          </div>

          {reportData.dueDate && (
            <div className="flex items-start space-x-2">
              <CalendarOutlined className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Due Date:</p>
                <p className="text-sm text-gray-800">
                  {formatDate(reportData.dueDate.toDate())}
                </p>
              </div>
            </div>
          )}

          {reportData.notes && (
            <div className="flex items-start space-x-2">
              <FileTextOutlined className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Additional Notes:
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap italic">
                  "{reportData.notes}"
                </p>
              </div>
            </div>
          )}

          {reportData.attachment && (
            <div className="flex items-start space-x-2">
              <UploadOutlined className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Attachment:</p>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200">
                  <FileOutlined className="text-blue-500" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {reportData.attachment.name}
                  </span>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EyeOutlined />} 
                    className="p-0 h-auto text-xs"
                    onClick={() => handleDocumentView(reportData.attachment)}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="flex items-start space-x-2">
            <WarningOutlined className="text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-orange-700 font-bold mb-1">
                PLEASE NOTE:
              </p>
              <p className="text-xs text-orange-700 m-0">
                A notification will be sent to the client with this request. They
                will be given the due date to submit the required documentation.
                <strong> This action cannot be undone.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    okText: "Yes, Send Request",
    okButtonProps: {
      className: "bg-blue-600 text-white hover:!bg-blue-700",
    },
    cancelText: "Cancel",
    onOk: onConfirm,
  });
};

interface SkipConfirmationProps {
  assignment: Assignment;
  reason: string;
  onConfirm: () => Promise<void>;
}

export const showSkipConfirmation = ({
  assignment,
  reason,
  onConfirm,
}: SkipConfirmationProps) => {
  confirm({
    title: "Final Confirmation - Skip Step",
    icon: <FastForwardOutlined style={{ color: "#faad14" }} />,
    width: 480,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-3 mt-3">
        <p className="text-sm">
          You are about to <strong>skip the current step</strong> for:
        </p>
        <p className="text-sm font-medium">
          {assignment.applicationDetails?.code} -{" "}
          {assignment.applicationDetails?.title}
        </p>
        <div className="bg-orange-50 p-3 rounded border border-orange-200">
          <p className="text-xs font-bold text-orange-800 uppercase mb-1">
            Reason for Skip:
          </p>
          <p className="text-sm text-orange-900 italic">"{reason}"</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start space-x-2">
          <ExclamationCircleOutlined className="text-yellow-600 mt-1 flex-shrink-0" />
          <p className="text-xs text-yellow-700">
            This action will move the application to the next workflow stage
            immediately. This action cannot be undone.
          </p>
        </div>
      </div>
    ),
    okText: "Yes, Skip Step",
    okType: "primary",
    okButtonProps: {
      className:
        "bg-orange-500 hover:!bg-orange-600 border-orange-500 text-white",
    },
    cancelText: "Cancel",
    onOk: onConfirm,
  });
};

interface ReviewConfirmationProps {
  assignment: Assignment;
  reviewAction: "approve" | "rework_officer" | "rework_applicant";
  notes: string;
  onConfirm: () => Promise<void>;
}

export const showReviewConfirmation = ({
  assignment,
  reviewAction,
  notes,
  onConfirm,
}: ReviewConfirmationProps) => {
  const actionConfig = {
    approve: {
      title: "Confirm Approval",
      content:
        "Are you sure you want to approve this application stage? This will move it to the next stage in the workflow.",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      okText: "Yes, Approve",
      okType: "primary" as const,
      okButtonProps: {
        className:
          "!bg-green-600 hover:!bg-green-700 border-green-600 text-white",
      },
    },
    rework_officer: {
      title: "Request Officer Rework",
      content:
        "Send this back to the assigned officer for corrections? They will be notified to review and resubmit.",
      icon: <EditOutlined style={{ color: "#ff4d4f" }} />,
      okText: "Yes, Request Rework",
      okType: "danger" as const,
      okButtonProps: {
        className: "!bg-red-600 hover:!bg-red-700 border-red-600 text-white",
      },
    },
    rework_applicant: {
      title: "Return to Applicant",
      content:
        "Return this application to the applicant for additional information or corrections?",
      icon: <RollbackOutlined style={{ color: "#ff4d4f" }} />,
      okText: "Yes, Return to Applicant",
      okType: "danger" as const,
      okButtonProps: {
        className: "!bg-red-600 hover:!bg-red-700 border-red-600 text-white",
      },
    },
  };

  const config = actionConfig[reviewAction];

  confirm({
    title: config.title,
    icon: config.icon,
    width: 480,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-3">
        <p className="text-gray-600">{config.content}</p>
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Application
          </p>
          <p className="text-sm font-medium text-gray-800 mb-2">
            {assignment.applicationDetails.code} -{" "}
            {assignment.applicationDetails.title}
          </p>
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Your Review Notes
          </p>
          <p className="text-sm text-gray-700 italic bg-white p-2 rounded border max-h-24 overflow-y-auto">
            "{notes}"
          </p>
        </div>
      </div>
    ),
    okText: config.okText,
    okType: config.okType,
    okButtonProps: config.okButtonProps,
    cancelText: "Cancel",
    onOk: onConfirm,
  });
};

/**
 * High-level actions that combine reason collection and final confirmation
 */

export const triggerRejectAction = ({
  assignment,
  onReject,
}: {
  assignment: Assignment;
  onReject: (notes: string) => Promise<void>;
}) => {
  let reasonForm: any = null;

  confirm({
    title: "Reject Application - Provide Reason",
    icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
    width: 600,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-red-600" />
            <span className="font-semibold text-red-800">
              Application Details
            </span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-red-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-red-700">
              Application ID:{" "}
              <span className="font-medium">
                {assignment.applicationDetails?.code || "N/A"}
              </span>
            </p>
            <p className="text-xs text-red-600">
              Current Status: {normalizeText(assignment.internalStatus)}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
          initialValues={{ rejectionReason: "" }}
        >
          <Form.Item
            name="rejectionReason"
            label={
              <div className="flex items-center space-x-2">
                <FileTextOutlined className="text-red-600" />
                <span className="font-medium">Detailed Rejection Reason</span>
                <span className="text-red-500">*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message:
                  "Please provide a detailed reason for rejecting this application.",
              },
              {
                min: 20,
                message:
                  "Please provide a more detailed explanation (at least 20 characters).",
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Provide comprehensive reasoning for the rejection..."
              className="resize-none"
            />
          </Form.Item>
        </Form>
      </div>
    ),
    okText: "Continue to Final Confirmation",
    okType: "danger",
    okButtonProps: {
      danger: true,
      className: "bg-red-600 text-white hover:!bg-red-700",
    },
    cancelText: "Cancel",
    onOk: async () => {
      try {
        if (!reasonForm) return;
        const values = await reasonForm.validateFields();
        showRejectionConfirmation({
          assignment,
          rejectionReason: values.rejectionReason,
          onConfirm: () => onReject(values.rejectionReason),
        });
      } catch (err) {
        message.error("Please provide a valid rejection reason");
        throw err;
      }
    },
  });
};

export const triggerSkipAction = ({
  assignment,
  onSkip,
}: {
  assignment: Assignment;
  onSkip: (notes: string) => Promise<void>;
}) => {
  let reasonForm: any = null;

  confirm({
    title: "Skip Current Step - Provide Reason",
    icon: <FastForwardOutlined style={{ color: "#faad14" }} />,
    width: 600,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-yellow-600" />
            <span className="font-semibold text-yellow-800">
              Application Details
            </span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-yellow-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-yellow-700">
              Application ID: {assignment.applicationDetails?.code}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason for Skipping Step"
            rules={[
              {
                required: true,
                min: 10,
                message: "Provide a detailed reason (min 10 chars)",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Why is this step being bypassed?" />
          </Form.Item>
        </Form>
      </div>
    ),
    okText: "Continue to Final Confirmation",
    okButtonProps: {
      className:
        "bg-orange-500 text-white hover:!bg-orange-600 border-orange-500",
    },
    cancelText: "Cancel",
    onOk: async () => {
      if (!reasonForm) return;
      const values = await reasonForm.validateFields();
      showSkipConfirmation({
        assignment,
        reason: values.reason,
        onConfirm: () => onSkip(values.reason),
      });
    },
  });
};

//KEEPING FOR FUTURE REFERENCE
// const reportTypesList = [
//   "Preliminary Environmental Report (PER)",
//   "Scoping Report",
//   "Draft Terms of Reference (ToR)",
//   "Draft Environmental Impact Statement (EIS)",
//   "Final Environmental Impact Statement (EIS)",
//   "Environmental Management Plan (EMP)",
// ];

export const triggerReportRequestAction = ({
  assignment,
  reportTypesAndTemplates,
  onSend,
}: {
  assignment: Assignment;
  reportTypesAndTemplates: any[];
  onSend: (reportData: ReportRequestValues) => Promise<void>;
}) => {
  let reportForm: any = null;

  confirm({
    title: "Request Report from Client",
    icon: <FileSearchOutlined style={{ color: "#1890ff" }} />,
    width: 680,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start space-x-2">
          <FileSearchOutlined className="text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-xs text-blue-700 font-medium m-0">
              Use this to formally request a technical report from the applicant. The client will be notified by email and SMS and must upload the report through their portal before processing can continue. Common examples include:{" "}
              <span className="font-semibold">Scoping Report, Preliminary Environmental Report (PER), Environmental Impact Assessment (EIA),</span>{" "}
              and <span className="font-semibold">Environmental Management Plan (EMP)</span>.
              If the report type you need is not in the list, type it in directly.
            </p>
            <p className="text-xs text-orange-700 font-semibold m-0">
              ⚠ If you need the applicant to correct or update their submitted application documents, use <span className="underline">Request Corrections from Applicant</span> instead — not this function.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-blue-600" />
            <span className="font-semibold text-blue-800">Application Details</span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-blue-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-blue-700">
              Code: {assignment.applicationDetails?.code}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => {
            reportForm = form;
          }}
          layout="vertical"
          initialValues={{ reportTypes: [], dueDate: null }}
        >
          <Form.Item
            name="reportTypes"
            label="Type of Report Required (select from list or type a custom name)"
            rules={[
              { required: true, message: "Select at least one report type" },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Select from list or type a custom report name..."
              optionLabelProp="label"
              className="w-full"
              tokenSeparators={[","]}
            >
              {reportTypesAndTemplates?.map((template: any) => (
                <Select.Option
                  key={template._id}
                  value={template.name}
                  label={template.name}
                >
                  <div className="flex items-center justify-between w-full py-1">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="font-medium text-gray-900 truncate">
                        {template.name}
                      </div>
                      {template.description && (
                        <Tooltip title={template.description}>
                          <div className="text-xs text-gray-500 truncate italic max-w-md">
                            {template.description}
                          </div>
                        </Tooltip>
                      )}
                    </div>
                    {(template.templateFile || template.template) && (
                      <button
                        type="button"
                        className="flex-shrink-0 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:!bg-blue-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentView(template.templateFile || template.template);
                        }}
                      >
                        View Template
                      </button>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Expected Due Date (Optional)"
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select a due date (optional)"
              disabledDate={(c) => c && c < dayjs().startOf("day")}
            />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes / Instructions for Client">
            <TextArea rows={4} placeholder="Describe what is needed, any specific guidelines the client should follow, or reference the relevant regulation..." />
          </Form.Item>

          <Form.Item
            name="attachment"
            label="Reference Attachment (Optional — e.g. Terms of Reference, Guideline Document)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              listType="text"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#1890ff", fontSize: 28 }} />
              </p>
              <p className="ant-upload-text text-sm font-medium text-gray-700">
                Click or drag a reference document here
              </p>
              <p className="ant-upload-hint text-xs text-gray-400">
                Single file — PDF, DOC, DOCX, XLS, XLSX, images
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </div>
    ),
    okText: "Continue to Final Confirmation",
    okButtonProps: {
      className: "bg-blue-600 text-white hover:!bg-blue-700",
    },
    cancelText: "Cancel",
    onOk: async () => {
      if (!reportForm) return;
      const formValues = await reportForm.validateFields();

      const selectedReports = (formValues.reportTypes || []).map((name: string) => {
        const fullReport = reportTypesAndTemplates.find((r) => r.name === name);
        if (fullReport) {
          return {
            name: fullReport.name,
            description: fullReport.description,
            template: fullReport.templateFile || fullReport.template,
          };
        }
        return { name, description: undefined, template: undefined };
      });

      const rawFile = (formValues.attachment || [])[0]?.originFileObj || null;

      const reportData: ReportRequestValues = {
        ...formValues,
        reportTypes: selectedReports,
        attachment: rawFile,
      };

      showReportRequestConfirmation({
        assignment,
        reportData,
        onConfirm: () => onSend(reportData),
      });
    },
  });
};

export interface CorrectionRequestValues {
  notes: string;
  attachments?: File[];
}

const showCorrectionRequestConfirmation = ({
  assignment,
  values,
  onConfirm,
}: {
  assignment: Assignment;
  values: CorrectionRequestValues;
  onConfirm: () => Promise<void>;
}) => {
  confirm({
    title: "Confirm Correction Request",
    icon: <EditOutlined style={{ color: "#d97706" }} />,
    width: 560,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-3">
        <p className="text-sm text-gray-700">
          You are about to <strong>request corrections from the applicant</strong> for:
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {assignment.applicationDetails?.code} — {assignment.applicationDetails?.title}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-2">
            <EditOutlined className="text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Correction Notes:</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap italic">"{values.notes}"</p>
            </div>
          </div>

          {values.attachments && values.attachments.length > 0 && (
            <div className="border-t border-amber-200 pt-3 flex items-start space-x-2">
              <UploadOutlined className="text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                  Attachments ({values.attachments.length}):
                </p>
                <div className="space-y-1">
                  {values.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-amber-200">
                      <FileOutlined className="text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 truncate max-w-[200px]">{file.name}</span>
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        className="p-0 h-auto text-xs ml-auto flex-shrink-0"
                        onClick={() => handleDocumentView(file)}
                      >
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start space-x-2">
          <ExclamationCircleOutlined className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            The applicant will be notified by email and SMS. Any attached files will be sent directly to them and will also appear in their portal.
          </p>
        </div>
      </div>
    ),
    okText: "Yes, Send Request",
    okButtonProps: { className: "bg-amber-600 text-white hover:!bg-amber-700" },
    cancelText: "Go Back",
    onOk: onConfirm,
  });
};

export const triggerCorrectionRequestAction = ({
  assignment,
  onSend,
}: {
  assignment: Assignment;
  onSend: (values: CorrectionRequestValues) => Promise<void>;
}) => {
  let correctionForm: any = null;

  confirm({
    title: "Request Corrections from Applicant",
    icon: <EditOutlined style={{ color: "#faad14" }} />,
    width: 650,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start space-x-2">
          <ExclamationCircleOutlined className="text-amber-600 mt-1 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Use this to request corrections from the applicant. You can attach reference
            documents or guidelines from other institutions. All attachments will be sent
            directly to the applicant via email and will also be visible in their portal.
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-amber-600" />
            <span className="font-semibold text-amber-800">Application Details</span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-amber-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-amber-700">
              Code: {assignment.applicationDetails?.code}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => { correctionForm = form; }}
          layout="vertical"
        >
          <Form.Item
            name="notes"
            label="Correction Notes / Instructions for Applicant"
            rules={[{ required: true, min: 10, message: "Provide detailed notes (min 10 chars)" }]}
          >
            <TextArea
              rows={5}
              placeholder="Describe what corrections are needed, what documents are required, or what action the applicant must take..."
              className="resize-none"
            />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="Attachments (Optional — up to 10 files)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              beforeUpload={() => false}
              multiple
              maxCount={10}
              listType="text"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.csv"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#d97706", fontSize: 28 }} />
              </p>
              <p className="ant-upload-text text-sm font-medium text-gray-700">
                Click or drag files here to attach
              </p>
              <p className="ant-upload-hint text-xs text-gray-400">
                Up to 10 files — PDF, DOC, DOCX, XLS, XLSX, images
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </div>
    ),
    okText: "Continue to Confirmation",
    okButtonProps: {
      className: "bg-amber-600 text-white hover:!bg-amber-700",
    },
    cancelText: "Cancel",
    onOk: async () => {
      if (!correctionForm) return;
      const formValues = await correctionForm.validateFields();
      const files = (formValues.attachments || []).map((f: any) => f.originFileObj).filter(Boolean);
      const values: CorrectionRequestValues = { notes: formValues.notes, attachments: files };
      showCorrectionRequestConfirmation({
        assignment,
        values,
        onConfirm: () => onSend(values),
      });
    },
  });
};

export const triggerRecallAction = ({
  assignment,
  onRecall,
}: {
  assignment: Assignment;
  onRecall: (notes: string) => Promise<void>;
}) => {
  let reasonForm: any = null;

  confirm({
    title: "Recall Assignment - Provide Reason",
    icon: <RollbackOutlined style={{ color: "#1890ff" }} />,
    width: 600,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-blue-600" />
            <span className="font-semibold text-blue-800">
              Application Details
            </span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-blue-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-blue-700">
              Application ID: {assignment.applicationDetails?.code}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason for Recalling Assignment"
            rules={[
              {
                required: true,
                min: 10,
                message: "Provide a detailed reason (min 10 chars)",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Why is this assignment being recalled?"
              className="resize-none"
            />
          </Form.Item>
        </Form>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start space-x-2">
          <ExclamationCircleOutlined className="text-blue-600 mt-1 flex-shrink-0" />
          <p className="text-xs text-blue-700 font-medium">
            This action will revert the assignment to your queue and allow you
            to re-assign it to another officer.
          </p>
        </div>
      </div>
    ),
    okText: "Confirm Recall",
    okButtonProps: {
      className: "bg-blue-600 text-white hover:!bg-blue-700",
    },
    cancelText: "Cancel",
    onOk: async () => {
      if (!reasonForm) return;
      const values = await reasonForm.validateFields();
      await onRecall(values.reason);
    },
  });
};

export const triggerReviewAction = ({
  assignment,
  reviewAction,
  notes,
  onConfirm,
}: {
  assignment: Assignment;
  reviewAction: "approve" | "rework_officer" | "rework_applicant";
  notes: string;
  onConfirm: () => Promise<void>;
}) => {
  showReviewConfirmation({
    assignment,
    reviewAction,
    notes,
    onConfirm,
  });
};

export const triggerAssignAction = ({
  assignment,
  selectedOfficer,
  copiedEmployees,
  values,
  onAssign,
}: {
  assignment: Assignment;
  selectedOfficer: Officer | undefined;
  copiedEmployees: Officer[];
  values: AssignFormValues;
  onAssign: (values: AssignFormValues) => Promise<void>;
}) => {
  showAssignConfirmation({
    assignment,
    selectedOfficer,
    copiedEmployees,
    values,
    onConfirm: () => onAssign(values),
  });
};

export const triggerBulkAssignAction = ({
  selectedCount,
  selectedOfficers,
  copiedEmployees,
  values,
  statusFilter,
  onAssignBulk,
}: {
  selectedCount: number;
  selectedOfficers: Officer[];
  copiedEmployees: Officer[];
  values: BulkAssignFormValues;
  statusFilter: string;
  onAssignBulk: (values: BulkAssignFormValues) => Promise<void>;
}) => {
  showBulkAssignConfirmation({
    selectedCount,
    selectedOfficers,
    copiedEmployees,
    values,
    statusFilter,
    onConfirm: () => onAssignBulk(values),
  });
};

export const triggerRevertAction = ({
  assignment,
  onRevert,
}: {
  assignment: Assignment;
  onRevert: (notes: string) => Promise<void>;
}) => {
  let reasonForm: any = null;

  confirm({
    title: "Revert to Previous Stage",
    icon: <ArrowLeftOutlined style={{ color: "#faad14" }} />,
    width: 600,
    centered: true,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-amber-600" />
            <span className="font-semibold text-amber-800">
              Application Details
            </span>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-sm font-medium text-amber-800">
              {assignment.applicationDetails?.title || "Application Title"}
            </p>
            <p className="text-xs text-amber-700">
              Application ID: {assignment.applicationDetails?.code}
            </p>
            <p className="text-xs text-amber-700">
              Current Stage: {normalizeText(assignment.internalStatus)}
            </p>
          </div>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason for Reverting to Previous Stage"
            rules={[
              {
                required: true,
                min: 10,
                message: "Provide a detailed reason (min 10 chars)",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Provide a reason for reverting this application to the previous stage..."
              className="resize-none"
            />
          </Form.Item>
        </Form>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start space-x-2">
          <ExclamationCircleOutlined className="text-amber-600 mt-1 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            This action will move the application back to the immediately
            preceding stage in the workflow.
          </p>
        </div>
      </div>
    ),
    okText: "Yes, Revert Stage",
    okButtonProps: {
      className: "bg-amber-600 text-white hover:!bg-amber-700",
    },
    cancelText: "Cancel",
    onOk: async () => {
      if (!reasonForm) return;
      const values = await reasonForm.validateFields();
      await onRevert(values.reason);
    },
  });
};
