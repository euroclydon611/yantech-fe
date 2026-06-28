// helpers/taskCompletionHelpers.tsx
import React from "react";
import { Modal, message } from "antd";
import {
  CheckCircleOutlined,
  FolderOpenOutlined,
  TagOutlined,
  FileTextOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import type { FormInstance } from "antd/es/form";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

// Types
export interface InvoicePayload {
  lineItems: any[];
  totalAmount?: number;
}

export interface IssuancePayload {
  applicationId?: string;
  companyName?: string;
  permitNumber: string;
  validityStartDate: string;
  validityEndDate: string;
  issueDate?: string;
  expiryDate?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  actYear?: string;
  actNumber?: string;
  regulationName?: string;
  regulationYear?: string;
  regulationNumber?: string;
  certificationText?: string;
  authorizationText?: string;
  issuanceDate: string;
}

export interface Task {
  _id: string;
  application?: {
    title?: string;
    code?: string;
  };
  applicationDetails?: {
    title?: string;
    code?: string;
  };
  task: {
    stageName: string;
  };
}

export interface CompleteTaskParams {
  form: FormInstance;
  currentTask: Task;
  invoicePayload?: InvoicePayload;
  issuancePayload?: IssuancePayload;
  officerCompleteStage: (params: {
    assignmentId: string;
    payload: any;
  }) => { unwrap: () => Promise<any> };
  closeCompleteModal: () => void;
  closeInvoiceModal?: () => void;
  refetch: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

// Confirmation Dialog Content Component
const TaskConfirmationContent: React.FC<{
  currentTask: Task;
  values: any;
  invoicePayload?: InvoicePayload;
  issuancePayload?: IssuancePayload;
}> = ({ currentTask, values, invoicePayload, issuancePayload }) => (
  <div
    className="space-y-4 mt-4"
    style={{ maxHeight: "60vh", overflowY: "auto" }}
  >
    <p className="text-gray-700 text-sm sm:text-base">
      Are you sure you want to submit this completed task for review? Your work
      will be sent to your supervisor for approval.
    </p>

    {/* Task Summary Card */}
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 space-y-3 sm:space-y-4">
      {/* Application Details */}
      <div className="pb-2 sm:pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <FolderOpenOutlined className="text-blue-600 flex-shrink-0" />
          <span className="font-semibold text-gray-800 text-sm sm:text-base">
            Application Details
          </span>
        </div>
        <div className="ml-6 space-y-1">
          <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
            {currentTask.application?.title ||
              currentTask.applicationDetails?.title ||
              "Application Title"}
          </p>
          <p className="text-xs text-gray-600">
            Application ID:{" "}
            <span className="font-medium">
              {currentTask.application?.code ||
                currentTask.applicationDetails?.code ||
                "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Current Stage */}
      <div className="flex items-start space-x-2 sm:space-x-3">
        <TagOutlined className="text-purple-600 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Stage Completed:
          </p>
          <p className="text-xs sm:text-sm text-gray-800 bg-purple-50 px-2 py-1 rounded border border-purple-200 inline-block truncate">
            {currentTask.task?.stageName?.replace(/_/g, " ") || "Current Stage"}
          </p>
        </div>
      </div>

      {/* Work Summary */}
      {values.completionNotes && (
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FileTextOutlined className="text-orange-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Your Completion Notes:
            </p>
            <div className="text-xs sm:text-sm text-gray-800 bg-white p-2 sm:p-3 rounded border border-gray-200 max-h-20 overflow-y-auto">
              {values.completionNotes}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Information */}
      {invoicePayload &&
        invoicePayload.lineItems &&
        invoicePayload.lineItems.length > 0 && (
          <div className="flex items-start space-x-2 sm:space-x-3">
            <DollarOutlined className="text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Invoice Details:
              </p>
              <div className="text-xs sm:text-sm text-gray-800 bg-green-50 p-2 sm:p-3 rounded border border-green-200">
                <p className="font-medium">
                  {invoicePayload.lineItems.length} line item(s) included
                </p>
                {invoicePayload.totalAmount && (
                  <p className="text-green-700">
                    Total Amount:{" "}
                    <span className="font-semibold">
                      GHS{invoicePayload.totalAmount}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Issuance Information */}
      {issuancePayload && (
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FileTextOutlined className="text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Permit Issuance Details:
            </p>
            <div className="text-xs sm:text-sm text-gray-800 bg-blue-50 p-2 sm:p-3 rounded border border-blue-200 space-y-1">
              <p>
                <span className="font-medium">Company/Holder:</span>{" "}
                {issuancePayload.companyName || "N/A"}
              </p>
              <p>
                <span className="font-medium">Permit Number:</span>{" "}
                {issuancePayload.permitNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Validity Start Date:</span>{" "}
                {issuancePayload.validityStartDate &&
                !isNaN(new Date(issuancePayload.validityStartDate).getTime())
                  ? new Date(issuancePayload.validityStartDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium">Validity End Date:</span>{" "}
                {issuancePayload.validityEndDate &&
                !isNaN(new Date(issuancePayload.validityEndDate).getTime())
                  ? new Date(issuancePayload.validityEndDate).toLocaleDateString()
                  : "N/A"}
              </p>
              {issuancePayload.signatoryName && (
                <p>
                  <span className="font-medium">Signatory:</span>{" "}
                  {issuancePayload.signatoryName}
                  {issuancePayload.signatoryTitle &&
                    ` (${issuancePayload.signatoryTitle})`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Important Notice */}
    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
      <div className="flex items-center space-x-2">
        <ExclamationCircleOutlined className="text-yellow-600 flex-shrink-0" />
        <p className="text-xs text-yellow-800">
          <strong>Important:</strong> Once you submit, you will not be able to
          make any further changes. Please make sure all required tasks are
          completed before proceeding.
        </p>
      </div>
    </div>
  </div>
);

// Main helper function
export const handleCompleteTask = async ({
  form,
  currentTask,
  invoicePayload,
  issuancePayload,
  officerCompleteStage,
  closeCompleteModal,
  closeInvoiceModal = () => {},
  refetch,
  navigate,
}: CompleteTaskParams): Promise<void> => {
  try {
    // Validate form first (optional for issuance flow)
    let values: any = {};
    if (!issuancePayload) {
      values = await form.validateFields();
    }

    // Prepare payload
    const payload: any = {
      stageName: currentTask.task.stageName,
      ...values,
    };

    // Add invoice data if present
    if (
      invoicePayload &&
      typeof invoicePayload === "object" &&
      invoicePayload.lineItems &&
      Array.isArray(invoicePayload.lineItems)
    ) {
      payload.invoiceData = invoicePayload;
    }

    // Add issuance data if present
    if (issuancePayload && typeof issuancePayload === "object") {
      payload.issuanceData = issuancePayload;
    }

    // Show confirmation dialog
    confirm({
      title: "Submit Task for Review",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      width: "90%",
      style: { maxWidth: "580px" },
      centered: true,
      content: (
        <TaskConfirmationContent
          currentTask={currentTask}
          values={values}
          invoicePayload={invoicePayload}
          issuancePayload={issuancePayload}
        />
      ),
      okText: "Complete & Exit",
      okType: "primary" as const,
      okButtonProps: {
        className:
          "bg-green-600 hover:!bg-green-700 border-green-600 font-medium",
        icon: <SendOutlined />,
        size: "large",
      },
      cancelText: "Cancel",
      cancelButtonProps: {
        size: "large",
      },
      onOk: async () => {
        try {
          // Show loading state with specific message
          const loadingMessage = message.loading(
            "Submitting your completed work for review...",
            0
          );

          // Submit the completed task
          await officerCompleteStage({
            assignmentId: currentTask._id,
            payload,
          }).unwrap();

          // Hide loading message
          loadingMessage();

          // Success notification
          await Swal.fire({
            title: "Task Completed!",
            text: `Task submitted successfully! Your supervisor has been notified for review.`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#2E7D32",
          });

          // Close modals and refresh data

          closeCompleteModal();
          closeInvoiceModal();
          navigate("/employee-portal/assignment/my-assignments");
          refetch();
        } catch (err: any) {
          // Hide loading message
          message.destroy();

          // Show detailed error message
          const errorMsg =
            err?.data?.error ||
            err?.message ||
            "Failed to submit task for review.";

          // Show error message
          Swal.fire({
            title: "Failed to Complete Task",
            text: errorMsg,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });

          // Keep the confirmation dialog open by throwing an error
          throw new Error("Task submission failed");
        }
      },
      onCancel: () => {
        // Show cancellation feedback
        message.info(
          "Task submission cancelled. You can continue working and submit when ready."
        );
      },
    });
  } catch (err: any) {
    // Handle form validation errors
    if (err?.errorFields) {
      message.error({
        content:
          "Please complete all required fields before submitting your work.",
        duration: 4,
      });
    } else if (err?.message !== "Task submission failed") {
      console.log("error", err);
      // Handle other unexpected errors (but not our intentional error from onOk)
      console.error("Unexpected error in task completion:", err);
      message.error("An unexpected error occurred. Please try again.");
    }
  }
};
