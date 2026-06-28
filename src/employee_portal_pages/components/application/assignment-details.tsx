import React from "react";
import {
  Modal,
  Card,
  Timeline,
  Tag,
  Divider,
  Row,
  Col,
  Statistic,
  Typography,
  Badge,
  Progress,
  Empty,
  Alert,
  Tooltip,
} from "antd";
import AssignmentAIGuide from "@/employee_portal_pages/components/assignment-plan/AssignmentAIGuide";
import {
  ProjectOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { GoSkip } from "react-icons/go";
import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";
import {
  formatDate,
  formatDate4,
  formatNumber,
  normalizeText,
} from "@/utils/helperFunction";

const { Text, Title } = Typography;

interface AssignmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

const AssignmentPlanModal: React.FC<AssignmentPlanModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const { data, isLoading, error } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId }
  );

  const assignmentData = data?.data;

  // Helper functions for safe data access
  const getClientInfo = () => {
    const client = assignmentData?.application?.clientId;
    const agent = assignmentData?.application?.submittedByAgent;

    return { client, agent };
  };

  const getWorkflowStats = () => {
    const steps = assignmentData?.workflowSteps || [];
    const completed = steps.filter(
      (step) => step.status === "completed" || step.status === "skipped"
    ).length;
    const total = steps.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, progress };
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      completed: {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: "Completed",
      },
      reverted: {
        color: "warning",
        icon: <ExclamationCircleOutlined />,
        text: "Reverted",
      },
      pending: {
        color: "processing",
        icon: <ClockCircleOutlined />,
        text: "Pending",
      },
      skipped: {
        color: "default",
        icon: <GoSkip />,
        text: "Skipped",
      },
      default: {
        color: "default",
        icon: <ClockCircleOutlined />,
        text: normalizeText(status),
      },
    };

    return statusMap[status] || statusMap.default;
  };

  const renderClientInfo = () => {
    const { client, agent } = getClientInfo();

    if (!client && !agent) return null;

    return (
      <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
          <UserOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
          <span className="font-semibold text-gray-800">
            Client Information
          </span>
        </div>

        <Row gutter={[16, 16]}>
          {/* Primary Client */}
          {client && (
            <Col xs={24} md={12}>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  {client.userType === "organization"
                    ? "Organization"
                    : client.userType === "government"
                    ? "Government Agency"
                    : "Individual Client"}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {client.userType === "organization"
                      ? client.organizationName
                      : client.userType === "government"
                      ? client.agencyName
                      : `${client.firstName || ""} ${
                          client.lastName || ""
                        }`.trim()}
                  </p>
                  {client.email && (
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-400 mr-2">✉</span>
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-400 mr-2">☎</span>
                      {client.phone}
                    </p>
                  )}
                </div>
              </div>
            </Col>
          )}

          {/* Submitted by Agent */}
          {agent && (
            <Col xs={24} md={12}>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  Submitted By Agent
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {`${agent.firstName || ""} ${agent.lastName || ""}`.trim()}
                  </p>
                  <Badge status="processing" text={"Agent"} />
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Card>
    );
  };

  const renderWorkflowProgress = () => {
    const { completed, total, progress } = getWorkflowStats();

    return (
      <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
          <ProjectOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
          <span className="font-semibold text-gray-800">Workflow Progress</span>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                Completed Steps
              </p>
              <Statistic
                value={completed}
                suffix={`/ ${total}`}
                prefix={<CheckCircleOutlined style={{ color: "#1D9C4E" }} />}
                valueStyle={{
                  color: "#1D9C4E",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                Current Status
              </p>
              <Statistic
                value={normalizeText(assignmentData?.internalStatus) || "N/A"}
                valueStyle={{
                  fontSize: "14px",
                  textTransform: "capitalize",
                  color: "#374151",
                  fontWeight: 600,
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                Overall Progress
              </p>
              <Progress
                percent={Math.round(progress)}
                size="small"
                status={progress === 100 ? "success" : "active"}
                strokeColor={{ "0%": "#0B6BC3", "100%": "#1D9C4E" }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderWorkflowSteps = () => {
    const steps = assignmentData?.workflowSteps || [];

    if (steps.length === 0) {
      return (
        <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No workflow steps found"
          />
        </Card>
      );
    }

    return (
      <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
          <TeamOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
          <span className="font-semibold text-gray-800">Workflow Steps</span>
        </div>

        <Timeline>
          {steps.map((step, index) => {
            const statusInfo = getStatusInfo(step.status);
            const dotColorMap = {
              success: "bg-green-100 text-white",
              warning: "bg-yellow-100 text-white",
              processing: "bg-blue-100 text-white",
              skipped: "bg-red-100 text-white",
              default: "bg-gray-200 text-gray-700",
            };
            const dotColorStyleMap = {
              success: { backgroundColor: "#1D9C4E", color: "white" },
              warning: { backgroundColor: "#FFA200", color: "white" },
              processing: { backgroundColor: "#0B6BC3", color: "white" },
              skipped: { backgroundColor: "#fca5a5", color: "white" },
              default: { backgroundColor: "#e5e7eb" },
            };

            return (
              <Timeline.Item
                key={step._id || index}
                dot={
                  <div
                    className="p-1.5 rounded-full flex items-center justify-center"
                    style={
                      dotColorStyleMap[statusInfo.color] ||
                      dotColorStyleMap.default
                    }
                  >
                    {statusInfo.icon}
                  </div>
                }
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 capitalize">
                      {normalizeText(step.stageName)}
                    </h4>
                    <Badge status={statusInfo.color} text={statusInfo.text} />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span className="font-medium">
                          Started:{" "}
                          <span className="font-normal">
                            {formatDate(step.startedAt)}
                          </span>
                        </span>
                      </div>
                      {step.completedAt && (
                        <div className="flex items-center space-x-2">
                          <CheckCircleOutlined className="text-gray-500" />
                          <span className="font-medium">
                            Completed:{" "}
                            <span className="font-normal">
                              {formatDate(step.completedAt)}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {step.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-start space-x-2">
                          <FileTextOutlined className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Notes:
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {step.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
    );
  };

  const renderApplicationHistory = () => {
    const history = assignmentData?.history || [];

    if (history.length === 0) {
      return (
        <Alert
          message="No History Available"
          description="No historical actions have been recorded for this application yet."
          type="info"
          icon={<InfoCircleOutlined />}
          className="mb-4"
          style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
        />
      );
    }

    return (
      <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined
              style={{ fontSize: "16px", color: "#1D9C4E" }}
            />
            <span className="font-semibold text-gray-800">
              Application History
            </span>
          </div>
          <Badge
            count={history.length}
            style={{ backgroundColor: "#1D9C4E" }}
            title={`${history.length} historical actions`}
          />
        </div>

        <div
          style={{ maxHeight: "450px", overflowY: "auto" }}
          className="py-2 pr-2"
        >
          <Timeline>
            {history.map((historyItem, index) => {
              const isRecentAction = index >= history.length - 3;
              const isApprovalAction = historyItem.action
                ?.toLowerCase()
                .includes("approved");
              const isReworkAction = historyItem.action
                ?.toLowerCase()
                .includes("rework");
              const isAssignmentAction = historyItem.action
                ?.toLowerCase()
                .includes("assigned");

              let dotColor = "gray";
              let dotIcon = <ClockCircleOutlined />;
              let dotBgStyle: React.CSSProperties = {
                backgroundColor: "#e5e7eb",
              };

              if (isApprovalAction) {
                dotColor = "green";
                dotIcon = <CheckCircleOutlined />;
                dotBgStyle = { backgroundColor: "#1D9C4E", color: "white" };
              } else if (isReworkAction) {
                dotColor = "orange";
                dotIcon = <ExclamationCircleOutlined />;
                dotBgStyle = { backgroundColor: "#FFA200", color: "white" };
              } else if (isAssignmentAction) {
                dotColor = "blue";
                dotIcon = <TeamOutlined />;
                dotBgStyle = { backgroundColor: "#0B6BC3", color: "white" };
              }

              return (
                <Timeline.Item
                  key={historyItem._id || index}
                  dot={
                    <Tooltip title={historyItem.action}>
                      <div
                        className="p-1.5 rounded-full flex items-center justify-center"
                        style={dotBgStyle}
                      >
                        {dotIcon}
                      </div>
                    </Tooltip>
                  }
                  color={dotColor}
                >
                  <div
                    className={`space-y-2 ${
                      isRecentAction ? "p-3 rounded-lg border-2" : ""
                    }`}
                    style={
                      isRecentAction
                        ? {
                            borderColor: "#1D9C4E",
                            backgroundColor: "rgba(29, 156, 78, 0.05)",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm mb-1">
                          {historyItem.action}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <UserOutlined />
                            <span className="font-medium">
                              {historyItem.user}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarOutlined />
                            <span>{formatDate4(historyItem.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      {isRecentAction && (
                        <Badge size="small" status="processing" text="Recent" />
                      )}
                    </div>

                    {historyItem.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-start space-x-1">
                          <FileTextOutlined className="text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              Notes:
                            </p>
                            <Typography.Paragraph
                              ellipsis={{
                                rows: 2,
                                expandable: true,
                                symbol: (expanded) => (
                                  <span className="text-blue-600 cursor-pointer text-xs">
                                    {expanded ? "Show Less" : "Show More"}
                                  </span>
                                ),
                              }}
                              className="text-xs text-gray-600 mb-0"
                              style={{ marginBottom: 0 }}
                            >
                              {historyItem.notes}
                            </Typography.Paragraph>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>

        {history.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200 text-center">
            <Text type="secondary" className="text-xs">
              Showing all {history.length} historical actions
            </Text>
          </div>
        )}
      </Card>
    );
  };

  const renderInvoiceInfo = () => {
    const invoice = assignmentData?.proposedInvoice;

    if (!invoice) {
      return (
        <Alert
          message="No Invoice Generated"
          description="An invoice will be generated during the billing stage of the workflow."
          type="info"
          icon={<InfoCircleOutlined />}
          className="mb-4"
          style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
        />
      );
    }

    return (
      <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
          <DollarOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
          <span className="font-semibold text-gray-800">Proposed Invoice</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-3 uppercase tracking-wider text-xs">
                  Line Items
                </h4>
                {invoice.lineItems?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-white p-3 rounded-lg border border-gray-200 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Qty: {item.quantity} × GH₵
                          {formatNumber(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800 flex-shrink-0 ml-2">
                        GH₵{formatNumber(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 uppercase tracking-wider text-xs">
                  Invoice Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-800">
                      GH₵{formatNumber(invoice.subtotal)}
                    </span>
                  </div>
                  <Divider style={{ margin: "12px 0" }} />
                  <div className="flex justify-between font-semibold text-base pt-2">
                    <span className="text-gray-800">Total Amount:</span>
                    <span style={{ color: "#1D9C4E" }}>
                      GH₵{formatNumber(invoice.totalAmount)}
                    </span>
                  </div>
                </div>

                {invoice.preparedAt && (
                  <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
                    <p>Prepared: {formatDate(invoice.preparedAt)}</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    );
  };

  const renderApplicationInfo = () => (
    <Card size="small" className="mb-4" style={{ borderColor: "#e5e7eb" }}>
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
        <FolderOpenOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
        <span className="font-semibold text-gray-800">Application Details</span>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                  Application Title
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {assignmentData?.application?.title || "N/A"}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">
                Application ID
              </p>
              <p className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                {assignmentData?.application?.code || "N/A"}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <ProjectOutlined style={{ fontSize: "18px", color: "#1D9C4E" }} />
          <span className="text-gray-800 font-semibold">
            Assignment Plan -{" "}
            {assignmentData?.application?.code || "Application"}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      width="95%"
      style={{ maxWidth: "1200px", top: "16px" }}
      className="assignment-plan-modal"
      bodyStyle={{
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        padding: "20px",
      }}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Text type="secondary" className="text-base">
              Loading assignment details...
            </Text>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert
            message="Error Loading Assignment"
            description="Unable to load assignment details. Please try again."
            type="error"
            icon={<WarningOutlined />}
            className="mb-4"
            style={{ borderColor: "#fecaca", backgroundColor: "#fef2f2" }}
          />
        )}

        {/* Success State */}
        {assignmentData && !isLoading && !error && (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-4">
              {renderApplicationInfo()}
              {renderClientInfo()}
              {renderWorkflowProgress()}
              {renderInvoiceInfo()}
              {renderWorkflowSteps()}
              {renderApplicationHistory()}
            </div>

            {/* AI Guide sidebar */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="sticky top-0">
                <AssignmentAIGuide
                  assignmentId={String(assignmentData._id)}
                  applicationCode={assignmentData?.application?.code}
                />
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!assignmentData && !isLoading && !error && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No assignment data available for this application."
          />
        )}
      </div>
    </Modal>
  );
};

export default AssignmentPlanModal;
