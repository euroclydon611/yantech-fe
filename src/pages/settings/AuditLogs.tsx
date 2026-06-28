import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import {
  Table,
  Tabs,
  Tag,
  Space,
  Card,
  Input,
  DatePicker,
  Select,
  Pagination,
  Button,
  Tooltip,
  Statistic,
  Row,
  Col,
  Badge,
  Progress,
  Typography,
  Switch,
  Avatar,
} from "antd";
import { PageTitle } from "../../utils/PageTitle";
import {
  useGetAuditLogsQuery,
  useGetChangeHistoryQuery,
  useGetSuspiciousActivitiesQuery,
  useUpdateSuspiciousActivityStatusMutation,
  useGetIntelligenceQuery,
  useGetIntelligenceStatsQuery,
  useReviewIntelligenceEventMutation,
} from "../../redux/features/audit/auditApi";
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  GlobalOutlined,
  LaptopOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { formatDate4 } from "@/utils/helperFunction";
import LogDetailDrawer from "./LogDetailDrawer";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea } = Input;

const getRiskColor = (score: number) => {
  if (score >= 90) return "#cf1322";
  if (score >= 70) return "#d4380d";
  if (score >= 30) return "#d48806";
  return "#389e0d";
};

const getRiskLabel = (score: number) => {
  if (score >= 90) return "Critical";
  if (score >= 70) return "High";
  if (score >= 30) return "Medium";
  return "Low";
};

const eventTypeColor: Record<string, string> = {
  PERMIT_SIGNED: "blue",
  LOGIN: "default",
  OTP_VERIFIED: "cyan",
  FAILED_SIGN_ATTEMPT: "red",
  SUSPICIOUS_ACCESS: "volcano",
  ACCOUNT_LOCKED: "magenta",
  SESSION_EXPIRED: "orange",
  LOGOUT: "geekblue",
};

const anomalySeverityColor: Record<string, string> = {
  low: "blue",
  medium: "orange",
  high: "volcano",
  critical: "red",
};

const getCountryFlag = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = [...countryCode.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0),
  );
  return String.fromCodePoint(...codePoints);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard?.writeText(text).catch(() => {});
};

const ExpandedIntelligenceRow = ({
  record,
  onReview,
}: {
  record: any;
  onReview: (id: string, status: string, notes: string) => void;
}) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState(record.reviewStatus);

  const handleReview = (status: string) => {
    setReviewStatus(status);
    onReview(record._id, status, reviewNotes);
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            size="small"
            title={
              <span className="text-[12px] font-semibold text-slate-700">
                <UserOutlined className="mr-1" /> Actor & Session
              </span>
            }
            className="h-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <Avatar
                style={{ backgroundColor: "#1677ff" }}
                size={36}
                className="text-[14px] font-bold"
              >
                {record.actor?.fullName?.charAt(0) || "?"}
              </Avatar>
              <div>
                <div className="font-semibold text-[12px]">
                  {record.actor?.fullName}
                </div>
                <div className="text-[11px] text-slate-500">
                  {record.actor?.staffId} ·{" "}
                  {record.actor?.isHead ? (
                    <Tag color="gold" className="text-[9px]">
                      HOD
                    </Tag>
                  ) : null}
                </div>
                <div className="text-[11px] text-slate-500">
                  {record.actor?.entityName}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-[11px]">
              <div>
                <Text type="secondary">Login time: </Text>
                <Text>
                  {record.session?.loginTime
                    ? formatDate4(record.session.loginTime)
                    : "—"}
                </Text>
              </div>
              <div>
                <Text type="secondary">Action time: </Text>
                <Text>
                  {record.session?.actionTime
                    ? formatDate4(record.session.actionTime)
                    : "—"}
                </Text>
              </div>
              <div>
                <Text type="secondary">Time since login: </Text>
                <Text>{record.session?.timeSinceLogin ?? "—"} min</Text>
              </div>
              <div>
                <Text type="secondary">Actions before signing: </Text>
                <Text>{record.session?.actionsBeforeSigning ?? "—"}</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            size="small"
            title={
              <span className="text-[12px] font-semibold text-slate-700">
                <GlobalOutlined className="mr-1" /> Network Intelligence
              </span>
            }
            className="h-full"
          >
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <Text type="secondary">IP Address:</Text>
                <span className="flex items-center gap-1 font-mono">
                  {record.network?.ipAddress}
                  <Tooltip title="Copy">
                    <CopyOutlined
                      className="cursor-pointer text-blue-500"
                      onClick={() => copyToClipboard(record.network?.ipAddress)}
                    />
                  </Tooltip>
                </span>
              </div>
              <div>
                <Text type="secondary">ISP: </Text>
                <Text>{record.network?.isp || "—"}</Text>
              </div>
              <div>
                <Text type="secondary">Organization: </Text>
                <Text>{record.network?.org || "—"}</Text>
              </div>
              <div>
                <Text type="secondary">ASN: </Text>
                <Text>{record.network?.asn || "—"}</Text>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {record.network?.proxy && (
                  <Tag color="red" className="text-[9px]">
                    VPN/PROXY
                  </Tag>
                )}
                {record.network?.hosting && (
                  <Tag color="volcano" className="text-[9px]">
                    DATACENTER
                  </Tag>
                )}
                {record.network?.mobile && (
                  <Tag color="cyan" className="text-[9px]">
                    MOBILE NET
                  </Tag>
                )}
              </div>
              <div>
                <Text type="secondary">Location: </Text>
                <Text>
                  {getCountryFlag(record.network?.countryCode)}{" "}
                  {record.network?.city}, {record.network?.regionName},{" "}
                  {record.network?.country}
                </Text>
              </div>
              {record.network?.lat && (
                <div>
                  <Text type="secondary">Coordinates: </Text>
                  <Text>
                    {record.network.lat?.toFixed(4)},{" "}
                    {record.network.lon?.toFixed(4)}
                  </Text>
                </div>
              )}
              <div>
                <Text type="secondary">Timezone: </Text>
                <Text>{record.network?.timezone || "—"}</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            size="small"
            title={
              <span className="text-[12px] font-semibold text-slate-700">
                <LaptopOutlined className="mr-1" /> Device Fingerprint
              </span>
            }
            className="h-full"
          >
            <div className="space-y-1 text-[11px]">
              <div>
                <Text type="secondary">Browser: </Text>
                <Text>
                  {record.device?.browser} {record.device?.browserVersion}
                </Text>
              </div>
              <div>
                <Text type="secondary">OS: </Text>
                <Text>
                  {record.device?.os} {record.device?.osVersion}
                </Text>
              </div>
              <div>
                <Text type="secondary">Device type: </Text>
                <Text className="capitalize">{record.device?.deviceType || "—"}</Text>
              </div>
              {record.device?.screenResolution && (
                <div>
                  <Text type="secondary">Screen: </Text>
                  <Text>{record.device.screenResolution}</Text>
                </div>
              )}
              {record.device?.language && (
                <div>
                  <Text type="secondary">Language: </Text>
                  <Text>{record.device.language}</Text>
                </div>
              )}
              {record.device?.platform && (
                <div>
                  <Text type="secondary">Platform: </Text>
                  <Text>{record.device.platform}</Text>
                </div>
              )}
              {record.device?.fingerprint && (
                <Tooltip title={record.device.fingerprint}>
                  <div>
                    <Text type="secondary">Fingerprint: </Text>
                    <Text className="font-mono text-[10px]">
                      {record.device.fingerprint.slice(0, 16)}…
                    </Text>
                  </div>
                </Tooltip>
              )}
            </div>
          </Card>
        </Col>

        {record.clientGeo && (
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <span className="text-[12px] font-semibold text-slate-700">
                  <EnvironmentOutlined className="mr-1" /> GPS Location
                </span>
              }
            >
              {record.clientGeo.permissionGranted ? (
                <div className="space-y-2">
                  <div className="text-[11px]">
                    <Text type="secondary">Coordinates: </Text>
                    <Text className="font-mono">
                      {record.clientGeo.latitude?.toFixed(5)},{" "}
                      {record.clientGeo.longitude?.toFixed(5)}
                    </Text>
                    <Tooltip title="Copy">
                      <CopyOutlined
                        className="ml-1 cursor-pointer text-blue-500"
                        onClick={() =>
                          copyToClipboard(
                            `${record.clientGeo.latitude},${record.clientGeo.longitude}`,
                          )
                        }
                      />
                    </Tooltip>
                  </div>
                  <div className="text-[11px]">
                    <Text type="secondary">Accuracy: </Text>
                    <Text>±{record.clientGeo.accuracy?.toFixed(0)}m</Text>
                  </div>
                  <iframe
                    title="map"
                    className="w-full rounded border"
                    height={180}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${record.clientGeo.longitude - 0.01},${record.clientGeo.latitude - 0.01},${record.clientGeo.longitude + 0.01},${record.clientGeo.latitude + 0.01}&layer=mapnik&marker=${record.clientGeo.latitude},${record.clientGeo.longitude}`}
                  />
                </div>
              ) : record.clientGeo.permissionGranted === false ? (
                <div className="text-[11px] text-red-500 flex items-center gap-2">
                  <CloseCircleOutlined />
                  Location permission denied
                  {record.clientGeo.permissionDeniedReason && (
                    <span className="text-slate-400">
                      : {record.clientGeo.permissionDeniedReason}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Awaiting GPS data…
                </div>
              )}
            </Card>
          </Col>
        )}

        {record.permitContext?.permitId && (
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <span className="text-[12px] font-semibold text-slate-700">
                  Permit Info
                </span>
              }
            >
              <div className="space-y-1 text-[11px]">
                <div>
                  <Text type="secondary">Permit #: </Text>
                  <Text strong>{record.permitContext.permitNumber}</Text>
                </div>
                <div>
                  <Text type="secondary">Type: </Text>
                  <Text>{record.permitContext.permitType}</Text>
                </div>
                <div>
                  <Text type="secondary">Company: </Text>
                  <Text>{record.permitContext.companyName}</Text>
                </div>
                <div>
                  <Text type="secondary">Signed at: </Text>
                  <Text>
                    {record.permitContext.signedAt
                      ? formatDate4(record.permitContext.signedAt)
                      : "—"}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        )}

        {record.anomalies?.length > 0 && (
          <Col xs={24}>
            <Card
              size="small"
              title={
                <span className="text-[12px] font-semibold text-slate-700">
                  <WarningOutlined className="mr-1 text-orange-500" /> Anomaly
                  Details
                </span>
              }
            >
              <div className="flex flex-wrap gap-2">
                {record.anomalies.map((a: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded p-2 text-[11px] min-w-[200px] flex-1"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Tag
                        color={anomalySeverityColor[a.severity]}
                        className="text-[9px]"
                      >
                        {a.severity?.toUpperCase()}
                      </Tag>
                      <span className="font-semibold text-[11px]">{a.type}</span>
                    </div>
                    <div className="text-slate-500">{a.description}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        )}

        <Col xs={24}>
          <Card
            size="small"
            title={
              <span className="text-[12px] font-semibold text-slate-700">
                <SafetyOutlined className="mr-1" /> Review
              </span>
            }
          >
            {reviewStatus === "pending" ? (
              <div className="space-y-2">
                <TextArea
                  rows={2}
                  placeholder="Review notes…"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="text-[11px]"
                />
                <Space wrap>
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: "#389e0d" }}
                    onClick={() => handleReview("cleared")}
                  >
                    Clear
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => handleReview("escalated")}
                  >
                    Escalate
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleReview("reviewed")}
                  >
                    Flag as False Positive
                  </Button>
                </Space>
              </div>
            ) : (
              <div className="text-[11px] space-y-1">
                <div>
                  <Text type="secondary">Status: </Text>
                  <Tag
                    color={
                      reviewStatus === "cleared"
                        ? "green"
                        : reviewStatus === "escalated"
                        ? "red"
                        : "default"
                    }
                  >
                    {reviewStatus?.toUpperCase()}
                  </Tag>
                </div>
                {record.reviewedAt && (
                  <div>
                    <Text type="secondary">Reviewed: </Text>
                    <Text>{formatDate4(record.reviewedAt)}</Text>
                  </div>
                )}
                {record.reviewNotes && (
                  <div>
                    <Text type="secondary">Notes: </Text>
                    <Text>{record.reviewNotes}</Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const AuditLogs = () => {
  PageTitle("Audit Logs");
  const [activeTab, setActiveTab] = useState("1");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState<any>({});
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [intelPage, setIntelPage] = useState(1);
  const [intelFilters, setIntelFilters] = useState<any>({});
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const {
    data: auditLogs,
    isLoading: loadingLogs,
    refetch: refetchLogs,
  } = useGetAuditLogsQuery(
    { page, limit, ...filters },
    { skip: activeTab !== "1" },
  );

  const {
    data: changeHistory,
    isLoading: loadingHistory,
    refetch: refetchHistory,
  } = useGetChangeHistoryQuery(
    { page, limit, ...filters },
    { skip: activeTab !== "2" },
  );

  const {
    data: suspiciousActivities,
    isLoading: loadingSuspicious,
    refetch: refetchSuspicious,
  } = useGetSuspiciousActivitiesQuery(
    { page, limit, ...filters },
    { skip: activeTab !== "3" },
  );

  const {
    data: intelligence,
    isLoading: loadingIntel,
    refetch: refetchIntel,
  } = useGetIntelligenceQuery(
    { page: intelPage, limit: 20, ...intelFilters },
    { skip: activeTab !== "4" },
  );

  const { data: intelStats } = useGetIntelligenceStatsQuery(undefined, {
    skip: activeTab !== "4",
  });

  const [updateStatus] = useUpdateSuspiciousActivityStatusMutation();
  const [reviewEvent] = useReviewIntelligenceEventMutation();

  const handleRefresh = () => {
    if (activeTab === "1") refetchLogs();
    else if (activeTab === "2") refetchHistory();
    else if (activeTab === "3") refetchSuspicious();
    else refetchIntel();
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleReview = async (id: string, status: string, notes: string) => {
    try {
      await reviewEvent({ id, reviewStatus: status, reviewNotes: notes }).unwrap();
    } catch (error) {
      console.error("Failed to review event:", error);
    }
  };

  const handleIntelFilter = (key: string, value: any) => {
    setIntelFilters((prev: any) => ({ ...prev, [key]: value }));
    setIntelPage(1);
  };

  const suspiciousColumns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
      width: 50,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => formatDate4(text),
      width: 180,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: string) => {
        const colors: any = {
          low: "blue",
          medium: "orange",
          high: "volcano",
          critical: "red",
          1: "blue",
          2: "orange",
          3: "volcano",
          4: "red",
        };
        const severityMap: any = { 1: "low", 2: "medium", 3: "high", 4: "critical" };
        const displaySeverity = severityMap[severity] || severity;
        return (
          <Tag color={colors[severity]} className="text-[10px] uppercase">
            {displaySeverity}
          </Tag>
        );
      },
      width: 120,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 400,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Rule",
      dataIndex: "rule_type",
      key: "rule_type",
      render: (text: string) => (
        <Tag color="default" className="text-[10px]">
          {text}
        </Tag>
      ),
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any, record: any) => {
        const statusMap: any = { 1: "open", 2: "investigating", 3: "resolved", 4: "false_positive" };
        const displayStatus = statusMap[status] || status;
        return (
          <Select
            value={displayStatus}
            size="small"
            style={{ width: 140, fontSize: "11px" }}
            onChange={(val) => handleStatusChange(record.id || record._id, val)}
            onClick={(e) => e.stopPropagation()}
          >
            <Option value="open">Open</Option>
            <Option value="investigating">Investigating</Option>
            <Option value="resolved">Resolved</Option>
            <Option value="false_positive">False Positive</Option>
          </Select>
        );
      },
      width: 160,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
  ];

  const auditColumns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
      width: 50,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => formatDate4(text),
      width: 180,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => {
        let color =
          action === "CREATE" ? "green" : action === "UPDATE" ? "blue" : "red";
        return (
          <Tag color={color} className="text-[10px] uppercase">
            {action}
          </Tag>
        );
      },
      width: 100,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Model",
      dataIndex: "model_name",
      key: "model_name",
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Actor",
      key: "actor",
      render: (record: any) => (
        <div>
          <div className="font-medium text-[11px]">
            {record.actor_name || "System"}
          </div>
        </div>
      ),
      width: 200,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (source: string) => (
        <Tag color="geekblue" className="text-[10px] uppercase">
          {source}
        </Tag>
      ),
      width: 120,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      width: 120,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Device / Location",
      key: "deviceLocation",
      render: (record: any) => (
        <div className="text-[10px] text-gray-500 leading-tight">
          {record.device_info && (
            <div>
              {record.device_info.os?.split(" ")[0]} /{" "}
              {record.device_info.browser?.split(" ")[0]}
            </div>
          )}
          {record.location_info && (
            <div className="text-blue-500 font-medium">
              {record.location_info.city || record.location_info.country}
            </div>
          )}
          {!record.device_info && !record.location_info && <span>-</span>}
        </div>
      ),
      width: 140,
      onCell: () => ({ style: { padding: "4px 8px" } }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => {
        const displayStatus =
          status === 1 || status === "SUCCESS" ? "SUCCESS" : "FAILURE";
        return (
          <Tag
            color={displayStatus === "SUCCESS" ? "success" : "error"}
            className="text-[10px] uppercase"
          >
            {displayStatus}
          </Tag>
        );
      },
      width: 100,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "View",
      key: "view",
      width: 60,
      render: (_: any, record: any) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(record);
              setModalOpen(true);
            }}
          />
        </Tooltip>
      ),
      onCell: () => ({ style: { padding: "4px 8px" } }),
    },
  ];

  const historyColumns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
      width: 50,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => formatDate4(text),
      width: 180,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Model",
      dataIndex: "model_name",
      key: "model_name",
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Record ID",
      dataIndex: "record_id",
      key: "record_id",
      width: 220,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Changes",
      dataIndex: "changes",
      key: "changes",
      render: (changes: any[]) => (
        <div className="max-h-32 overflow-y-auto text-[11px]">
          {changes?.map((change, index) => (
            <div key={index} className="mb-1 border-b last:border-0 pb-1">
              <span className="font-bold text-gray-700">{change.field}:</span>{" "}
              <span className="text-red-500 line-through mr-2">
                {typeof change.oldValue === "object"
                  ? JSON.stringify(change.oldValue)
                  : String(change.oldValue ?? "")}
              </span>
              <span className="text-green-600 font-medium">
                →{" "}
                {typeof change.newValue === "object"
                  ? JSON.stringify(change.newValue)
                  : String(change.newValue ?? "")}
              </span>
            </div>
          ))}
        </div>
      ),
      onCell: () => ({ style: { padding: "4px 8px" } }),
    },
    {
      title: "Actor",
      key: "actor",
      render: (record: any) => (
        <div>
          <div className="font-medium text-[11px]">
            {record.actor_name || "System"}
          </div>
        </div>
      ),
      width: 180,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "View",
      key: "view",
      width: 60,
      render: (_: any, record: any) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(record);
              setModalOpen(true);
            }}
          />
        </Tooltip>
      ),
      onCell: () => ({ style: { padding: "4px 8px" } }),
    },
  ];

  const intelligenceColumns = [
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (
        <Tooltip title={formatDate4(text)}>
          <span className="text-[11px]">{formatDate4(text)}</span>
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Actor",
      key: "actor",
      render: (_: any, record: any) => (
        <div className="text-[11px]">
          <div className="font-semibold">{record.actor?.fullName}</div>
          <div className="text-slate-400">{record.actor?.staffId}</div>
          <Tag color="geekblue" className="text-[9px] mt-0.5">
            {record.actor?.entityName}
          </Tag>
        </div>
      ),
      width: 160,
    },
    {
      title: "Event",
      dataIndex: "eventType",
      key: "eventType",
      render: (t: string) => (
        <Tag color={eventTypeColor[t] || "default"} className="text-[10px]">
          {t}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Risk",
      dataIndex: "riskScore",
      key: "riskScore",
      render: (score: number) => (
        <Tooltip title={`${getRiskLabel(score)} risk`}>
          <div className="flex items-center gap-1">
            <Progress
              type="circle"
              percent={score}
              size={32}
              strokeColor={getRiskColor(score)}
              format={(p) => (
                <span
                  style={{ fontSize: 9, color: getRiskColor(score) }}
                >
                  {p}
                </span>
              )}
            />
          </div>
        </Tooltip>
      ),
      width: 70,
      sorter: (a: any, b: any) => a.riskScore - b.riskScore,
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, record: any) => (
        <div className="text-[11px]">
          {getCountryFlag(record.network?.countryCode)}{" "}
          {record.network?.city || "—"}, {record.network?.country || "—"}
        </div>
      ),
      width: 150,
    },
    {
      title: "Device",
      key: "device",
      render: (_: any, record: any) => (
        <div className="text-[11px] text-slate-600">
          <div>{record.device?.os?.split(" ")[0]}</div>
          <div className="text-slate-400">{record.device?.browser?.split(" ")[0]}</div>
        </div>
      ),
      width: 100,
    },
    {
      title: "Network",
      key: "network",
      render: (_: any, record: any) => (
        <div className="text-[11px]">
          <div className="font-mono text-slate-600">
            {record.network?.ipAddress}
          </div>
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {record.network?.proxy && (
              <Tag color="red" className="text-[9px]">
                VPN
              </Tag>
            )}
            {record.network?.hosting && (
              <Tag color="volcano" className="text-[9px]">
                DC
              </Tag>
            )}
          </div>
        </div>
      ),
      width: 130,
    },
    {
      title: "Anomalies",
      key: "anomalies",
      render: (_: any, record: any) => {
        const list = record.anomalies || [];
        const visible = list.slice(0, 3);
        const rest = list.length - visible.length;
        return (
          <div className="flex flex-wrap gap-0.5">
            {visible.map((a: any, i: number) => (
              <Tooltip key={i} title={a.description}>
                <Tag
                  color={anomalySeverityColor[a.severity]}
                  className="text-[9px] cursor-help"
                >
                  {a.type?.replace("_", " ")}
                </Tag>
              </Tooltip>
            ))}
            {rest > 0 && (
              <Tag className="text-[9px]">+{rest} more</Tag>
            )}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Permit #",
      key: "permit",
      render: (_: any, record: any) =>
        record.permitContext?.permitNumber ? (
          <Tag color="blue" className="text-[10px] font-mono">
            {record.permitContext.permitNumber}
          </Tag>
        ) : (
          <span className="text-slate-300">—</span>
        ),
      width: 110,
    },
    {
      title: "Review",
      key: "review",
      render: (_: any, record: any) => {
        const statusColors: Record<string, string> = {
          pending: "orange",
          reviewed: "default",
          escalated: "red",
          cleared: "green",
        };
        return (
          <Tag
            color={statusColors[record.reviewStatus] || "default"}
            className="text-[10px]"
          >
            {record.reviewStatus?.toUpperCase()}
          </Tag>
        );
      },
      width: 90,
    },
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters((prev: any) => ({
        ...prev,
        startDate: dates[0].startOf("day").toISOString(),
        endDate: dates[1].endOf("day").toISOString(),
      }));
    } else {
      const newFilters = { ...filters };
      delete newFilters.startDate;
      delete newFilters.endDate;
      setFilters(newFilters);
    }
    setPage(1);
  };

  const stats = intelStats?.data;
  const pendingCritical =
    intelligence?.data?.filter(
      (e: any) => e.reviewStatus === "pending" && e.riskScore >= 90,
    ).length || 0;

  return (
    <>
      <PageLayout
        title="Audit & Change Logs"
        breadcrumbs={[{ label: "Settings" }, { label: "Audit Logs" }]}
      />
      <div className="p-4">
      <Card className="mb-6 shadow-sm">
        <Space wrap size="large" className="w-full">
          <Input
            placeholder="Search Model..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={(e) => handleFilterChange("modelName", e.target.value)}
          />
          <Select
            placeholder="Action"
            style={{ width: 120 }}
            allowClear
            onChange={(val) => handleFilterChange("action", val)}
          >
            <Option value="CREATE">CREATE</Option>
            <Option value="UPDATE">UPDATE</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
          <Select
            placeholder="Source"
            style={{ width: 150 }}
            allowClear
            onChange={(val) => handleFilterChange("source", val)}
          >
            <Option value="main">Main Portal</Option>
            <Option value="hremployees">HR Portal</Option>
            <Option value="client_portal">Client Portal</Option>
            <Option value="cron">System Cron</Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} />

          <Tooltip title="Refresh">
            <Button
              type="text"
              icon={
                <ReloadOutlined
                  className={loadingHistory ? "animate-spin" : ""}
                />
              }
              onClick={handleRefresh}
              disabled={loadingLogs || loadingHistory}
            />
          </Tooltip>
        </Space>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setPage(1);
        }}
        type="card"
        className="bg-white p-4 rounded-lg shadow-sm"
        items={[
          {
            key: "1",
            label: "System Audit Logs",
            children: (
              <Table
                sticky
                columns={auditColumns}
                dataSource={auditLogs?.data}
                loading={loadingLogs}
                size="small"
                pagination={false}
                scroll={{ x: 1200, y: "60vh" }}
                rowKey="_id"
                rowClassName={(_record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedLog(record);
                    setModalOpen(true);
                  },
                  className:
                    "cursor-pointer hover:bg-blue-50 transition-colors",
                })}
              />
            ),
          },
          {
            key: "2",
            label: "Field-Level Change History",
            children: (
              <Table
                sticky
                columns={historyColumns}
                dataSource={changeHistory?.data}
                loading={loadingHistory}
                size="small"
                pagination={false}
                scroll={{ x: 1200, y: "60vh" }}
                rowKey="_id"
                rowClassName={(_record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedLog(record);
                    setModalOpen(true);
                  },
                  className:
                    "cursor-pointer hover:bg-blue-50 transition-colors",
                })}
              />
            ),
          },
          {
            key: "3",
            label: "Suspicious Activity Flags",
            children: (
              <Table
                sticky
                columns={suspiciousColumns}
                dataSource={suspiciousActivities?.data}
                loading={loadingSuspicious}
                size="small"
                pagination={false}
                scroll={{ x: 1200, y: "60vh" }}
                rowKey="_id"
                rowClassName={(_record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }
                onRow={(record) => ({
                  onClick: () => {
                    if (record.auditLogIds?.length > 0) {
                      setSelectedLog(record.auditLogIds[0]);
                      setModalOpen(true);
                    }
                  },
                  className:
                    "cursor-pointer hover:bg-red-50 transition-colors",
                })}
              />
            ),
          },
          {
            key: "4",
            label: (
              <span>
                <SafetyCertificateOutlined className="mr-1" />
                Events Breakdown
                {pendingCritical > 0 && (
                  <Badge
                    count={pendingCritical}
                    size="small"
                    className="ml-1"
                  />
                )}
              </span>
            ),
            children: (
              <div className="space-y-4">
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <Card size="small">
                      <Statistic
                        title="Signing Events (this month)"
                        value={stats?.totalThisMonth ?? "—"}
                        valueStyle={{ fontSize: 22 }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small">
                      <Statistic
                        title="High Risk Events"
                        value={stats?.highRisk ?? "—"}
                        valueStyle={{ fontSize: 22, color: "#cf1322" }}
                        prefix={<WarningOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small">
                      <Statistic
                        title="Anomalies (this week)"
                        value={stats?.anomaliesThisWeek ?? "—"}
                        valueStyle={{ fontSize: 22, color: "#d4380d" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small">
                      <Statistic
                        title="Pending Review"
                        value={stats?.pendingReview ?? "—"}
                        valueStyle={{ fontSize: 22, color: "#d48806" }}
                        prefix={<SafetyOutlined />}
                      />
                    </Card>
                  </Col>
                </Row>

                {stats?.actorLeaderboard?.length > 0 && (
                  <Card
                    size="small"
                    title={
                      <span className="text-[12px] font-semibold">
                        Actor Risk Leaderboard (Top 10 this month)
                      </span>
                    }
                  >
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={stats.actorLeaderboard}
                      rowKey="_id"
                      columns={[
                        {
                          title: "Actor",
                          key: "actor",
                          render: (_: any, r: any) => (
                            <div className="flex items-center gap-2">
                              <Avatar size={24} style={{ background: "#1677ff", fontSize: 11 }}>
                                {r.fullName?.charAt(0)}
                              </Avatar>
                              <div>
                                <div className="text-[11px] font-medium">{r.fullName}</div>
                                <div className="text-[10px] text-slate-400">{r.staffId}</div>
                              </div>
                            </div>
                          ),
                          width: 180,
                        },
                        {
                          title: "Entity",
                          dataIndex: "entityName",
                          key: "entityName",
                          render: (v: string) => <span className="text-[11px]">{v}</span>,
                          width: 140,
                        },
                        {
                          title: "Events",
                          dataIndex: "totalEvents",
                          key: "totalEvents",
                          render: (v: number) => <span className="text-[11px]">{v}</span>,
                          width: 70,
                        },
                        {
                          title: "Avg Risk",
                          dataIndex: "avgRisk",
                          key: "avgRisk",
                          render: (v: number) => {
                            const score = Math.round(v || 0);
                            return (
                              <span
                                className="font-semibold text-[12px]"
                                style={{ color: getRiskColor(score) }}
                              >
                                {score}
                              </span>
                            );
                          },
                          sorter: (a: any, b: any) => a.avgRisk - b.avgRisk,
                          width: 80,
                        },
                        {
                          title: "Last Activity",
                          dataIndex: "lastActivity",
                          key: "lastActivity",
                          render: (v: string) => (
                            <span className="text-[11px]">{formatDate4(v)}</span>
                          ),
                          width: 150,
                        },
                      ]}
                    />
                  </Card>
                )}

                <Card size="small">
                  <Space wrap size="middle" className="mb-3">
                    <Input
                      placeholder="Search actor..."
                      prefix={<SearchOutlined />}
                      style={{ width: 180 }}
                      size="small"
                      onChange={(e) =>
                        handleIntelFilter("actorSearch", e.target.value)
                      }
                    />
                    <Select
                      placeholder="Event type"
                      style={{ width: 160 }}
                      allowClear
                      size="small"
                      mode="multiple"
                      onChange={(val) => handleIntelFilter("eventType", val)}
                    >
                      {[
                        "PERMIT_SIGNED",
                        "LOGIN",
                        "OTP_VERIFIED",
                        "FAILED_SIGN_ATTEMPT",
                        "SUSPICIOUS_ACCESS",
                        "LOGOUT",
                      ].map((t) => (
                        <Option key={t} value={t}>
                          {t}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Risk level"
                      style={{ width: 130 }}
                      allowClear
                      size="small"
                      onChange={(val) => handleIntelFilter("riskLevel", val)}
                    >
                      <Option value="low">Low (&lt;30)</Option>
                      <Option value="medium">Medium (30–70)</Option>
                      <Option value="high">High (&gt;70)</Option>
                      <Option value="critical">Critical (&gt;90)</Option>
                    </Select>
                    <Select
                      placeholder="Review status"
                      style={{ width: 130 }}
                      allowClear
                      size="small"
                      onChange={(val) =>
                        handleIntelFilter("reviewStatus", val)
                      }
                    >
                      <Option value="pending">Pending</Option>
                      <Option value="reviewed">Reviewed</Option>
                      <Option value="escalated">Escalated</Option>
                      <Option value="cleared">Cleared</Option>
                    </Select>
                    <RangePicker
                      size="small"
                      onChange={(dates) => {
                        if (dates) {
                          setIntelFilters((prev: any) => ({
                            ...prev,
                            startDate: (dates[0] as any)
                              .startOf("day")
                              .toISOString(),
                            endDate: (dates[1] as any)
                              .endOf("day")
                              .toISOString(),
                          }));
                        } else {
                          setIntelFilters((prev: any) => {
                            const f = { ...prev };
                            delete f.startDate;
                            delete f.endDate;
                            return f;
                          });
                        }
                        setIntelPage(1);
                      }}
                    />
                    <Tooltip title="HOD/CEO events only">
                      <span className="text-[11px] flex items-center gap-1">
                        <Switch
                          size="small"
                          onChange={(v) =>
                            handleIntelFilter("hodOnly", v || undefined)
                          }
                        />
                        HOD only
                      </span>
                    </Tooltip>
                  </Space>

                  <Table
                    sticky
                    columns={intelligenceColumns}
                    dataSource={intelligence?.data}
                    loading={loadingIntel}
                    size="small"
                    pagination={false}
                    scroll={{ x: 1300, y: "55vh" }}
                    rowKey="_id"
                    expandable={{
                      expandedRowRender: (record) => (
                        <ExpandedIntelligenceRow
                          record={record}
                          onReview={handleReview}
                        />
                      ),
                      expandedRowKeys: expandedRows,
                      onExpand: (expanded, record) => {
                        setExpandedRows(
                          expanded
                            ? [...expandedRows, record._id]
                            : expandedRows.filter((k) => k !== record._id),
                        );
                      },
                    }}
                    rowClassName={(record) => {
                      if (record.riskScore >= 90)
                        return "bg-red-50 hover:bg-red-100 cursor-pointer transition-colors";
                      if (record.riskScore >= 70)
                        return "bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors";
                      return "hover:bg-blue-50 cursor-pointer transition-colors";
                    }}
                  />
                </Card>

                <div className="flex justify-end bg-white p-3 rounded-b-lg border-t">
                  <Pagination
                    current={intelPage}
                    pageSize={20}
                    total={intelligence?.pagination?.total}
                    onChange={(p) => setIntelPage(p)}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
            ),
          },
        ]}
      />

      <LogDetailDrawer
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />

      {activeTab !== "4" && (
        <div className="flex mt-4 justify-end bg-white p-4 rounded-b-lg shadow-sm border-t">
          <Pagination
            current={page}
            pageSize={limit}
            total={
              activeTab === "1"
                ? auditLogs?.pagination?.total
                : activeTab === "2"
                ? changeHistory?.pagination?.total
                : suspiciousActivities?.pagination?.total
            }
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
      </div>
    </>
  );
};

export default AuditLogs;
