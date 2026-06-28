import {
  Drawer,
  Card,
  Timeline,
  Tag,
  Row,
  Col,
  Statistic,
  Typography,
  Badge,
  Progress,
  Empty,
  Alert,
  Tooltip,
  Spin,
} from "antd";
import {
  ProjectOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { GoSkip } from "react-icons/go";
import { useGetAdminApplicationHistoryQuery } from "@/redux/features/general/client-applications";
import { formatDate, formatDate4, normalizeText } from "@/utils/helperFunction";

const { Text } = Typography;

interface AdminAssignmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

const AdminAssignmentPlanModal: React.FC<AdminAssignmentPlanModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const { data, isLoading, error } = useGetAdminApplicationHistoryQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId || !isOpen }
  );

  const assignmentData = data?.data;

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, any> = {
      completed: { color: "success", icon: <CheckCircleOutlined />, text: "Completed" },
      reverted: { color: "warning", icon: <ExclamationCircleOutlined />, text: "Reverted" },
      pending: { color: "processing", icon: <ClockCircleOutlined />, text: "Pending" },
      skipped: { color: "default", icon: <GoSkip />, text: "Skipped" },
    };
    return statusMap[status] || { color: "default", icon: <ClockCircleOutlined />, text: normalizeText(status) };
  };

  const getWorkflowStats = () => {
    const steps = assignmentData?.workflowSteps || [];
    const completed = steps.filter(
      (step: any) => step.status === "completed" || step.status === "skipped"
    ).length;
    const total = steps.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, progress };
  };

  const dotColorStyleMap: Record<string, React.CSSProperties> = {
    success: { backgroundColor: "#1D9C4E", color: "white" },
    warning: { backgroundColor: "#FFA200", color: "white" },
    processing: { backgroundColor: "#0B6BC3", color: "white" },
    skipped: { backgroundColor: "#fca5a5", color: "white" },
    default: { backgroundColor: "#e5e7eb" },
  };

  const { completed, total, progress } = getWorkflowStats();
  const steps = assignmentData?.workflowSteps || [];
  const history = assignmentData?.history || [];
  const client = assignmentData?.application?.clientId;
  const agent = assignmentData?.application?.submittedByAgent;

  return (
    <Drawer
      title={
        <div className="flex items-center space-x-2">
          <ProjectOutlined style={{ fontSize: "18px", color: "#1D9C4E" }} />
          <span className="text-gray-800 font-semibold">
            Application History — {assignmentData?.application?.code || "Loading..."}
          </span>
        </div>
      }
      placement="right"
      open={isOpen}
      onClose={onClose}
      width={720}
      destroyOnClose
    >
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" tip="Loading application history..." />
        </div>
      )}

      {error && (
        <Alert
          message="Error Loading History"
          description="Unable to load application history. Please try again."
          type="error"
          icon={<WarningOutlined />}
          className="mb-4"
        />
      )}

      {!isLoading && !error && !assignmentData && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No assignment history found for this application."
        />
      )}

      {assignmentData && !isLoading && (
        <div className="space-y-4">
          {/* Application Info */}
          <Card size="small" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
              <FileTextOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
              <span className="font-semibold text-gray-800">Application Information</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Row gutter={[16, 12]}>
                <Col xs={24} sm={12}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Application ID</p>
                  <p className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-800">
                    {assignmentData?.application?.code || "N/A"}
                  </p>
                </Col>
                <Col xs={24} sm={12}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</p>
                  <Tag color="green">
                    {normalizeText(
                      assignmentData?.application?.permitType ||
                      assignmentData?.application?.authorizationType ||
                      assignmentData?.application?.licenseType ||
                      "N/A"
                    )}
                  </Tag>
                </Col>
                <Col xs={24}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Title</p>
                  <p className="text-sm font-medium text-gray-900">
                    {assignmentData?.application?.title || "N/A"}
                  </p>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Client Info */}
          {(client || agent) && (
            <Card size="small" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
                <UserOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
                <span className="font-semibold text-gray-800">Client Information</span>
              </div>
              <Row gutter={[16, 12]}>
                {client && (
                  <Col xs={24} sm={agent ? 12 : 24}>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        {client.userType === "organization" ? "Organization" : client.userType === "government" ? "Government Agency" : "Individual"}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {client.userType === "organization"
                          ? client.organizationName
                          : client.userType === "government"
                          ? client.agencyName
                          : `${client.firstName || ""} ${client.lastName || ""}`.trim()}
                      </p>
                      {client.email && <p className="text-xs text-gray-500 mt-1">✉ {client.email}</p>}
                      {client.phone && <p className="text-xs text-gray-500 mt-1">☎ {client.phone}</p>}
                    </div>
                  </Col>
                )}
                {agent && (
                  <Col xs={24} sm={client ? 12 : 24}>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Submitted By Agent</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {`${agent.firstName || ""} ${agent.lastName || ""}`.trim()}
                      </p>
                      <Badge status="processing" text="Agent" className="mt-1" />
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          )}

          {/* Workflow Progress */}
          <Card size="small" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
              <ProjectOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
              <span className="font-semibold text-gray-800">Workflow Progress</span>
            </div>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={8}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Completed Steps</p>
                <Statistic
                  value={completed}
                  suffix={`/ ${total}`}
                  prefix={<CheckCircleOutlined style={{ color: "#1D9C4E" }} />}
                  valueStyle={{ color: "#1D9C4E", fontSize: "20px", fontWeight: 600 }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Internal Status</p>
                <Statistic
                  value={normalizeText(assignmentData?.internalStatus) || "N/A"}
                  valueStyle={{ fontSize: "13px", textTransform: "capitalize", color: "#374151", fontWeight: 600 }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Overall Progress</p>
                <Progress
                  percent={Math.round(progress)}
                  size="small"
                  status={progress === 100 ? "success" : "active"}
                  strokeColor={{ "0%": "#0B6BC3", "100%": "#1D9C4E" }}
                />
              </Col>
            </Row>
          </Card>

          {/* Workflow Steps */}
          <Card size="small" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
              <TeamOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
              <span className="font-semibold text-gray-800">Workflow Steps</span>
              <Badge count={steps.length} style={{ backgroundColor: "#1D9C4E" }} />
            </div>
            {steps.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No workflow steps found" />
            ) : (
              <Timeline>
                {steps.map((step: any, index: number) => {
                  const statusInfo = getStatusInfo(step.status);
                  return (
                    <Timeline.Item
                      key={step._id || index}
                      dot={
                        <div
                          className="p-1.5 rounded-full flex items-center justify-center"
                          style={dotColorStyleMap[statusInfo.color] || dotColorStyleMap.default}
                        >
                          {statusInfo.icon}
                        </div>
                      }
                    >
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {normalizeText(step.stageName)}
                          </h4>
                          <Badge status={statusInfo.color} text={statusInfo.text} />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                            {step.assignedToName && (
                              <div className="flex items-center space-x-2">
                                <UserOutlined className="text-gray-400" />
                                <span className="font-medium">Assigned: <span className="font-normal">{step.assignedToName}</span></span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <CalendarOutlined className="text-gray-400" />
                              <span className="font-medium">Started: <span className="font-normal">{formatDate(step.startedAt)}</span></span>
                            </div>
                            {step.completedAt && (
                              <div className="flex items-center space-x-2">
                                <CheckCircleOutlined className="text-gray-400" />
                                <span className="font-medium">Completed: <span className="font-normal">{formatDate(step.completedAt)}</span></span>
                              </div>
                            )}
                          </div>
                          {step.notes && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-start space-x-2">
                                <FileTextOutlined className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-1">Notes:</p>
                                  <p className="text-xs text-gray-600 leading-relaxed">{step.notes}</p>
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
            )}
          </Card>

          {/* Application History */}
          <Card size="small" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined style={{ fontSize: "16px", color: "#1D9C4E" }} />
                <span className="font-semibold text-gray-800">Action History</span>
              </div>
              <Badge count={history.length} style={{ backgroundColor: "#1D9C4E" }} />
            </div>
            {history.length === 0 ? (
              <Alert
                message="No History Available"
                description="No historical actions have been recorded for this application yet."
                type="info"
                icon={<InfoCircleOutlined />}
                style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
              />
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }} className="pr-1">
                <Timeline>
                  {history.map((item: any, index: number) => {
                    const isApproval = item.action?.toLowerCase().includes("approved");
                    const isRework = item.action?.toLowerCase().includes("rework");
                    const isAssignment = item.action?.toLowerCase().includes("assigned");

                    let dotBgStyle: React.CSSProperties = { backgroundColor: "#e5e7eb" };
                    let dotIcon = <ClockCircleOutlined />;
                    let dotColor = "gray";

                    if (isApproval) {
                      dotBgStyle = { backgroundColor: "#1D9C4E", color: "white" };
                      dotIcon = <CheckCircleOutlined />;
                      dotColor = "green";
                    } else if (isRework) {
                      dotBgStyle = { backgroundColor: "#FFA200", color: "white" };
                      dotIcon = <ExclamationCircleOutlined />;
                      dotColor = "orange";
                    } else if (isAssignment) {
                      dotBgStyle = { backgroundColor: "#0B6BC3", color: "white" };
                      dotIcon = <TeamOutlined />;
                      dotColor = "blue";
                    }

                    const isRecent = index >= history.length - 3;

                    return (
                      <Timeline.Item
                        key={item._id || index}
                        color={dotColor}
                        dot={
                          <Tooltip title={item.action}>
                            <div className="p-1.5 rounded-full flex items-center justify-center" style={dotBgStyle}>
                              {dotIcon}
                            </div>
                          </Tooltip>
                        }
                      >
                        <div
                          className={`space-y-1 ${isRecent ? "p-2 rounded-lg border-2" : ""}`}
                          style={isRecent ? { borderColor: "#1D9C4E", backgroundColor: "rgba(29,156,78,0.05)" } : {}}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm mb-1">{item.action}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><UserOutlined />{item.user}</span>
                                <span className="flex items-center gap-1"><CalendarOutlined />{formatDate4(item.timestamp)}</span>
                              </div>
                            </div>
                            {isRecent && <Badge size="small" status="processing" text="Recent" />}
                          </div>
                          {item.notes && (
                            <div className="mt-1 pt-1 border-t border-gray-100">
                              <p className="text-xs text-gray-500 leading-relaxed">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
                <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                  <Text type="secondary" className="text-xs">Showing all {history.length} actions</Text>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </Drawer>
  );
};

export default AdminAssignmentPlanModal;
