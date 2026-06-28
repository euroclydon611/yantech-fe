import { useState } from "react";
import { Modal, Tag, Alert, Form, Input, Button, Divider, Empty } from "antd";
import {
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  RollbackOutlined,
  EditOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import { formatDate2, formatDate4 } from "@/utils/helperFunction";
import {
  useFetchSingleIssuedPermitQuery,
  useFetchSingleIssuedLicenseQuery,
} from "@/redux/features/employee-portal-api/authoirzations/main";
import { showError } from "@/lib/alert";
import axios from "axios";

const { TextArea } = Input;

export const ReviewModal = ({
  isReviewModalOpen,
  closeReviewModal,
  currentAssignment,
  form,
  handleReview,
  isReviewing,
  getStageInfo,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const { data: issuedPermit } = useFetchSingleIssuedPermitQuery(
    { applicationId: currentAssignment?.application || "", id: "" },
    { skip: !currentAssignment?.application }
  );

  const { data: issuedLicense } = useFetchSingleIssuedLicenseQuery(
    { applicationId: currentAssignment?.application || "", id: "" },
    { skip: !currentAssignment?.application }
  );

  const handleViewCertificate = async (
    permitId: string,
    productId?: string
  ) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/permits/pdf?permitId=${permitId}&productId=${productId}`,
        {
          withCredentials: true,
          responseType: "blob", // 👈 important: treat response as a file
        }
      );

      // Create a blob from the response
      const fileBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in new tab
      window.open(fileURL, "_blank");
    } catch (error) {
      showError(
        error?.response?.data?.error ||
          "Something went wrong while fetching the certificate."
      );
    }
  };

  const handleViewPermitSchedule = async (permitId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }revenue/certificate/schedule-pdf?certificateId=${permitId}&fileType=schedule`,
        {
          withCredentials: true,
          responseType: "blob", // 👈 important: treat response as a file
        }
      );

      // Create a blob from the response
      const fileBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in new tab
      window.open(fileURL, "_blank");
    } catch (error) {
      showError(
        error?.response?.data?.error ||
          "Something went wrong while fetching the permit schedule."
      );
    }
  };

  const handleViewLicense = async (licenseId: string, productId?: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/licenses/pdf?licenseId=${licenseId}&productId=${productId}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error) {
      showError(
        error?.response?.data?.error ||
          "Something went wrong while fetching the license."
      );
      console.error("Failed to fetch license document:", error);
    }
  };

  const stepLabels: Record<string, string> = {
    review_completeness_check: "Approve Completeness",
    review_processing_fee: "Approve Processing Fee",
    review_evaluation: "Approve Evaluation",
    review_permit_fee: "Approve Permit Fee",
    review_issuance: "Approve Issuance",
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full">
            <EyeOutlined className="text-orange-600 text-sm sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
              Review Completed Stage
            </p>
            <Tag
              color="orange"
              icon={<ClockCircleOutlined />}
              className="text-xs"
            >
              {getStageInfo(currentAssignment?.internalStatus).text.replace(
                "Reviewing ",
                ""
              )}
            </Tag>
          </div>
        </div>
      }
      open={isReviewModalOpen}
      onCancel={closeReviewModal}
      maskClosable={false}
      footer={null}
      width="95%"
      style={{ maxWidth: "700px", top: "20px" }}
      className="professional-modal"
      styles={{
        body: {
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          padding: "16px",
        },
      }}
      destroyOnClose
    >
      {currentAssignment && (
        <div className="space-y-4 sm:space-y-6">
          {/* Status Alert */}
          <Alert
            message="Task Completed - Review Required"
            description="The assigned officer has completed their task and is awaiting your review."
            type="info"
            icon={<UserOutlined />}
            showIcon
            className="mb-3 sm:mb-4"
          />

          {/* Application Details Card */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpenOutlined className="text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                Application Under Review
              </span>
            </div>
            <div className="ml-6 sm:ml-6">
              <p className="text-gray-800 text-sm sm:text-base font-medium truncate">
                {currentAssignment.applicationDetails.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Application Code:{" "}
                <span className="font-medium">
                  {currentAssignment.applicationDetails.code}
                </span>
              </p>
            </div>
          </div>

          {/* Issuance Section */}
          {currentAssignment.internalStatus === "review_issuance" && (
            <>
              <Divider className="my-3 sm:my-4" />

              {issuedPermit?.data ? (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileTextOutlined className="text-blue-600 flex-shrink-0 text-lg" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        Issued Permit
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        icon={<FaFilePdf />}
                        onClick={() =>
                          handleViewCertificate(issuedPermit.data._id)
                        }
                        className="text-red-600 border-red-600 hover:!text-red-700 hover:!border-red-700"
                        title="View Permit"
                      >
                        View Permit
                      </Button>
                      <Button
                        type="text"
                        icon={<FaFilePdf />}
                        onClick={() =>
                          handleViewPermitSchedule(issuedPermit.data._id)
                        }
                        className="text-red-600 border-red-600 hover:!text-red-700 hover:!border-red-700"
                        title="View Permit Schedule"
                        hidden={!issuedPermit?.data?.schedulePdfUrl}
                      >
                        View Permit Schedule
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    <strong>Permit Number:</strong>{" "}
                    {issuedPermit.data.permitNumber}
                  </p>
                  {issuedPermit.data.validityStartDate &&
                    issuedPermit.data.validityEndDate && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        <strong>Valid:</strong>{" "}
                        {formatDate2(issuedPermit.data.validityStartDate)} to{" "}
                        {formatDate2(issuedPermit.data.validityEndDate)}
                      </p>
                    )}
                </div>
              ) : issuedLicense?.data ? (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileTextOutlined className="text-blue-600 flex-shrink-0 text-lg" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        Issued License
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        icon={<FaFilePdf />}
                        onClick={() => handleViewLicense(issuedLicense.data._id)}
                        className="text-red-600 border-red-600 hover:!text-red-700 hover:!border-red-700"
                        title="View License"
                      >
                        View License
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    <strong>License Number:</strong>{" "}
                    {issuedLicense.data.licenseNumber ||
                      issuedLicense.data.permitNumber}
                  </p>
                  {issuedLicense.data.validityStartDate &&
                    issuedLicense.data.validityEndDate && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        <strong>Valid:</strong>{" "}
                        {formatDate2(issuedLicense.data.validityStartDate)} to{" "}
                        {formatDate2(issuedLicense.data.validityEndDate)}
                      </p>
                    )}
                </div>
              ) : (
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-red-600 text-sm">
                        No permit or license has been issued yet
                      </span>
                    }
                    className="py-4"
                  />
                </div>
              )}
            </>
          )}

          {/* Proposed Invoice Section */}
          {((currentAssignment.internalStatus === "review_permit_fee" &&
            currentAssignment.proposedInvoice) ||
            (currentAssignment.internalStatus === "review_processing_fee" &&
              currentAssignment.proposedProcessingFeeInvoice)) && (
            <>
              <Divider className="my-3 sm:my-4" />

              {currentAssignment.internalStatus === "review_permit_fee" &&
                currentAssignment.proposedInvoice && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarOutlined className="text-green-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        Proposed Invoice
                      </span>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-2 mb-3">
                      {currentAssignment.proposedInvoice.lineItems.map(
                        (item, index) => (
                          <div
                            key={item._id || index}
                            className="flex justify-between items-start bg-white p-2 rounded border border-gray-100"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                {item.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} ×{" "}
                                {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                              {formatCurrency(item.total)}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Invoice Summary */}
                    <div className="border-t border-green-200 pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            currentAssignment.proposedInvoice.subtotal
                          )}
                        </span>
                      </div>
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">{formatCurrency(currentAssignment.proposedInvoice.taxAmount)}</span>
                      </div> */}
                      <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                        <span className="font-semibold text-gray-700">
                          Total Amount:
                        </span>
                        <span className="font-bold text-green-700 text-base">
                          {formatCurrency(
                            currentAssignment.proposedInvoice.totalAmount
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Prepared By Info */}
                    {currentAssignment.proposedInvoice.preparedAt && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs text-gray-500">
                          Prepared on{" "}
                          {formatDate4(
                            currentAssignment.proposedInvoice.preparedAt
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {currentAssignment.internalStatus === "review_processing_fee" &&
                currentAssignment.proposedProcessingFeeInvoice && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarOutlined className="text-green-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        Proposed Processing Fee Invoice
                      </span>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-2 mb-3">
                      {currentAssignment.proposedProcessingFeeInvoice.lineItems.map(
                        (item, index) => (
                          <div
                            key={item._id || index}
                            className="flex justify-between items-start bg-white p-2 rounded border border-gray-100"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                {item.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} ×{" "}
                                {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                              {formatCurrency(item.total)}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Invoice Summary */}
                    <div className="border-t border-green-200 pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            currentAssignment.proposedProcessingFeeInvoice
                              .subtotal
                          )}
                        </span>
                      </div>
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">{formatCurrency(currentAssignment.proposedProcessingFeeInvoice.taxAmount)}</span>
                      </div> */}
                      <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                        <span className="font-semibold text-gray-700">
                          Total Amount:
                        </span>
                        <span className="font-bold text-green-700 text-base">
                          {formatCurrency(
                            currentAssignment.proposedProcessingFeeInvoice
                              .totalAmount
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Prepared By Info */}
                    {currentAssignment.proposedProcessingFeeInvoice
                      .preparedAt && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs text-gray-500">
                          Prepared on{" "}
                          {formatDate4(
                            currentAssignment.proposedProcessingFeeInvoice
                              .preparedAt
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
            </>
          )}

          <Divider className="my-3 sm:my-4" />

          {/* Review Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{ reviewNotes: "" }}
            className="space-y-3 sm:space-y-4"
          >


            <Form.Item
              name="reviewNotes"
              label={
                <div className="flex items-center space-x-2">
                  <FileTextOutlined className="text-gray-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Review Notes & Instructions
                  </span>
                  <span className="text-red-500">*</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message:
                    "Please provide review notes to proceed with your decision.",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Provide detailed feedback:
• For approval: 'Work completed satisfactorily. Approved to proceed to next stage.'
• For rework: 'Missing site plan and environmental assessment. Please re-engage applicant for additional documentation.'
• For officer rework: 'Technical review incomplete. Please verify compliance with section 4.2 of the guidelines.'"
                className="resize-none text-sm"
              />
            </Form.Item>

            {/* Action Buttons */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center space-x-2 mb-3">
                <ExclamationCircleOutlined className="text-gray-600 flex-shrink-0" />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Review Decision
                </span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Button
                  onClick={() => handleReview("rework_applicant")}
                  loading={isReviewing}
                  disabled={[
                    "review_issuance",
                    "review_processing_fee",
                    "review_permit_fee",
                  ].includes(currentAssignment?.internalStatus)}
                  danger
                  ghost
                  icon={<RollbackOutlined />}
                  className={`h-9 sm:h-10 font-medium text-xs sm:text-sm w-full sm:w-auto ${
                    ![
                      "review_issuance",
                      "review_processing_fee",
                      "review_permit_fee",
                    ].includes(currentAssignment?.internalStatus)
                      ? "!border-red-600 !bg-red-600 hover:!bg-red-700 !text-white"
                      : ""
                  }`}
                  size="small"
                >
                  <span className="hidden sm:inline">Return to Applicant</span>
                  <span className="sm:hidden">Return to Applicant</span>
                </Button>

                <Button
                  onClick={() => handleReview("rework_officer")}
                  loading={isReviewing}
                  danger
                  icon={<EditOutlined />}
                  className="h-9 sm:h-10 font-medium text-xs sm:text-sm w-full sm:w-auto  !border-yellow-600 !bg-yellow-500 hover:!bg-yellow-600 text-black hover:!text-black"
                  size="small"
                >
                  <span className="hidden sm:inline">
                    Request Officer Rework
                  </span>
                  <span className="sm:hidden">Request Rework</span>
                </Button>

                <Button
                  type="primary"
                  onClick={() => handleReview("approve")}
                  loading={isReviewing}
                  icon={<CheckCircleOutlined />}
                  className="bg-green-600 hover:!bg-green-700 h-9 sm:h-10 font-medium text-xs sm:text-sm w-full sm:w-auto"
                  size="small"
                >
                  <span className="hidden sm:inline">
                    {stepLabels[currentAssignment?.internalStatus] ||
                      "Complete Step"}
                  </span>
                  <span className="sm:hidden">
                    {stepLabels[currentAssignment?.internalStatus] ||
                      "Complete Step"}
                  </span>
                </Button>
              </div>

              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Return to Applicant:</strong> Send back to applicant
                  for additional information
                </p>
                <p>
                  <strong>Request Rework:</strong> Ask the assigned officer to
                  revise their work
                </p>
                <p>
                  <strong>Approve & Continue:</strong> Approves and queues for
                  the next assignment
                </p>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export const HodFinalApprovalModal = ({
  isOpen,
  onClose,
  currentAssignment,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentAssignment: any;
  onConfirm: (notes: string) => void;
  isLoading?: boolean;
}) => {
  const [notes, setNotes] = useState("");

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(notes);
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full">
            <AuditOutlined className="text-purple-600 text-sm sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
              Grant Final HOD Approval
            </p>
            <Tag color="purple" className="text-xs">
              Group Workflow — Final Sign-off
            </Tag>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      width="95%"
      style={{ maxWidth: "700px", top: "20px" }}
      className="professional-modal"
      styles={{
        body: {
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          padding: "16px",
        },
      }}
      destroyOnClose
    >
      {currentAssignment && (
        <div className="space-y-4 sm:space-y-6">
          <Alert
            message="Final HOD Approval Required"
            description="The group head has completed and approved the issuance stage. As the HOD, your final sign-off will submit this permit for CEO signing."
            type="warning"
            icon={<AuditOutlined />}
            showIcon
            className="mb-3 sm:mb-4"
          />

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpenOutlined className="text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                Application Under Review
              </span>
            </div>
            <div className="ml-6">
              <p className="text-gray-800 text-sm sm:text-base font-medium truncate">
                {currentAssignment.applicationDetails?.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Application Code:{" "}
                <span className="font-medium">
                  {currentAssignment.applicationDetails?.code}
                </span>
              </p>
            </div>
          </div>

          <Divider className="my-3 sm:my-4" />

          <Form layout="vertical">
            <Form.Item
              label={
                <div className="flex items-center space-x-2">
                  <FileTextOutlined className="text-gray-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Approval Notes
                  </span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                </div>
              }
            >
              <TextArea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any final notes or instructions for this approval (optional)."
                className="resize-none text-sm"
              />
            </Form.Item>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center space-x-2 mb-3">
                <ExclamationCircleOutlined className="text-gray-600 flex-shrink-0" />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Approval Decision
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="h-9 sm:h-10 font-medium text-xs sm:text-sm w-full sm:w-auto"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleConfirm}
                  loading={isLoading}
                  size="small"
                  className="h-9 sm:h-10 font-medium text-xs sm:text-sm w-full sm:w-auto"
                  style={{ backgroundColor: "#7c3aed", borderColor: "#7c3aed" }}
                >
                  Grant Final Approval
                </Button>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>
                  <strong>Grant Final Approval:</strong> Confirms HOD sign-off and submits the permit for CEO signing.
                </p>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
};
