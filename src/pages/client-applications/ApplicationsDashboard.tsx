import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Empty,
  Spin,
  Tag,
  Progress,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  ExperimentOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useGetAdminApplicationEntityStatsQuery } from "../../redux/features/general/client-applications";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const STATUS_ALIAS: Record<string, string> = {
  processing_fee_pending_payment: "pending_processing_fee",
};

const normalizeStatusKey = (s: string) => STATUS_ALIAS[s] ?? s;

const STATUS_CONFIG: Record<string, { label: string; color: string; tagColor: string }> = {
  draft: { label: "Draft", color: "#9ca3af", tagColor: "default" },
  pending_processing_fee: { label: "Permit Fee Pending Payment", color: "#a78bfa", tagColor: "purple" },
  submitted: { label: "Submitted", color: "#3b82f6", tagColor: "blue" },
  under_review: { label: "Under Review", color: "#f59e0b", tagColor: "orange" },
  corrections_required: { label: "Corrections Req.", color: "#ef4444", tagColor: "red" },
  reports_required: { label: "Reports Req.", color: "#f97316", tagColor: "volcano" },
  payment_pending: { label: "Payment Pending", color: "#ec4899", tagColor: "magenta" },
  awaiting_issuance: { label: "Awaiting Issuance", color: "#06b6d4", tagColor: "cyan" },
  completed: { label: "Completed", color: "#10b981", tagColor: "green" },
  rejected: { label: "Rejected", color: "#dc2626", tagColor: "red" },
};

const mergeStatusMaps = (map: StatusMap): StatusMap => {
  const result: StatusMap = {};
  for (const [k, v] of Object.entries(map)) {
    const key = normalizeStatusKey(k);
    result[key] = (result[key] ?? 0) + v;
  }
  return result;
};

const TYPE_CONFIG = [
  {
    key: "permits" as const,
    label: "Permits",
    icon: <FileTextOutlined />,
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    link: "/applications/permit-applications",
  },
  {
    key: "authorizations" as const,
    label: "Authorizations",
    icon: <SafetyCertificateOutlined />,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    link: "/applications/authorization-applications",
  },
  {
    key: "licenses" as const,
    label: "Licenses",
    icon: <BankOutlined />,
    color: "#10b981",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    link: "/applications/license-applications",
  },
  {
    key: "efficacy" as const,
    label: "Efficacy Trials",
    icon: <ExperimentOutlined />,
    color: "#3b82f6",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    link: "/applications/bio-efficacy",
  },
];

const normalizeStatus = (s: string) =>
  STATUS_CONFIG[s]?.label ?? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type StatusMap = Record<string, number>;

interface EntityStat {
  entityId: string;
  entityName: string;
  total: number;
  totals: { permits: number; authorizations: number; licenses: number; efficacy: number };
  byStatus: StatusMap;
  statusBreakdown: {
    permits: StatusMap;
    authorizations: StatusMap;
    licenses: StatusMap;
    efficacy: StatusMap;
  };
}

const StatusBreakdownTable = ({ record }: { record: EntityStat }) => {
  const byStatus = mergeStatusMaps(record.byStatus);
  const allStatuses = Object.keys(byStatus).filter((s) => byStatus[s] > 0);
  if (!allStatuses.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />;

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (s: string) => {
        const cfg = STATUS_CONFIG[s];
        return (
          <Tag color={cfg?.tagColor ?? "default"} className="text-[11px] font-medium">
            {normalizeStatus(s)}
          </Tag>
        );
      },
    },
    ...TYPE_CONFIG.map((t) => ({
      title: <span className={`text-[11px] font-semibold ${t.text}`}>{t.label}</span>,
      key: t.key,
      dataIndex: t.key,
      width: 110,
      align: "center" as const,
      render: (v: number) =>
        v > 0 ? (
          <Text strong style={{ color: t.color, fontSize: "12px" }}>{v}</Text>
        ) : (
          <Text className="text-gray-300 text-xs">—</Text>
        ),
    })),
    {
      title: <span className="text-[11px] font-semibold text-gray-700">Total</span>,
      key: "rowTotal",
      dataIndex: "rowTotal",
      width: 80,
      align: "center" as const,
      render: (v: number) => <Text strong className="text-sm">{v}</Text>,
    },
  ];

  const rows = allStatuses.map((status) => {
    const row: any = { key: status, status };
    let rowTotal = 0;
    for (const t of TYPE_CONFIG) {
      const merged = mergeStatusMaps(record.statusBreakdown[t.key] ?? {});
      const v = merged[status] ?? 0;
      row[t.key] = v;
      rowTotal += v;
    }
    row.rowTotal = rowTotal;
    return row;
  });

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={false}
      size="small"
      className="rounded-lg overflow-hidden border border-gray-100"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
    />
  );
};

const ApplicationsDashboard = () => {
  PageTitle("Applications Dashboard | EPA Ghana Admin");

  const { data, isLoading } = useGetAdminApplicationEntityStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const stats: EntityStat[] = data?.data ?? [];
  const grandTotal = stats.reduce((s, e) => s + e.total, 0);

  const typeTotals = TYPE_CONFIG.map((t) => ({
    ...t,
    total: stats.reduce((s, e) => s + e.totals[t.key], 0),
  }));

  const allStatuses = Array.from(
    new Set(
      stats.flatMap((e) => Object.keys(e.byStatus).map(normalizeStatusKey))
    )
  ).filter((s) => stats.some((e) => mergeStatusMaps(e.byStatus)[s] > 0));

  const globalStatusRows = allStatuses
    .map((status) => {
      const row: any = { key: status, status };
      let rowTotal = 0;
      for (const t of TYPE_CONFIG) {
        const v = stats.reduce(
          (s, e) => s + (mergeStatusMaps(e.statusBreakdown[t.key] ?? {})[status] ?? 0),
          0
        );
        row[t.key] = v;
        rowTotal += v;
      }
      row.rowTotal = rowTotal;
      return row;
    })
    .filter((r) => r.rowTotal > 0)
    .sort((a, b) => b.rowTotal - a.rowTotal);

  const globalStatusColumns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => {
        const cfg = STATUS_CONFIG[s];
        return (
          <Tag color={cfg?.tagColor ?? "default"} className="text-[11px] font-semibold">
            {normalizeStatus(s)}
          </Tag>
        );
      },
    },
    ...TYPE_CONFIG.map((t) => ({
      title: <span className={`text-[11px] font-semibold ${t.text}`}>{t.label}</span>,
      key: t.key,
      dataIndex: t.key,
      align: "center" as const,
      render: (v: number) =>
        v > 0 ? (
          <Text strong style={{ color: t.color, fontSize: "12px" }}>{v}</Text>
        ) : (
          <Text className="text-gray-300 text-xs">—</Text>
        ),
    })),
    {
      title: <span className="text-[11px] font-semibold text-gray-700">Total</span>,
      key: "rowTotal",
      dataIndex: "rowTotal",
      align: "center" as const,
      render: (v: number) => <Text strong className="text-sm text-gray-900">{v}</Text>,
    },
  ];

  const entityColumns = [
    {
      title: "#",
      key: "index",
      width: 48,
      render: (_: any, __: any, i: number) => (
        <Text className="text-gray-400 text-xs font-mono">{i + 1}</Text>
      ),
    },
    {
      title: "Entity",
      key: "entityName",
      render: (_: any, record: EntityStat) => (
        <div className="flex items-center gap-2 py-0.5">
          <div className="w-7 h-7 rounded bg-green-50 border border-green-200 text-green-700 flex items-center justify-center flex-shrink-0">
            <BankOutlined style={{ fontSize: "12px" }} />
          </div>
          <Text className="text-sm font-semibold text-gray-800">{record.entityName}</Text>
        </div>
      ),
    },
    ...TYPE_CONFIG.map((t) => ({
      title: (
        <Tooltip title={t.label}>
          <span className={`text-[11px] font-semibold uppercase ${t.text}`}>{t.label}</span>
        </Tooltip>
      ),
      key: t.key,
      width: 110,
      align: "center" as const,
      render: (_: any, record: EntityStat) => {
        const v = record.totals[t.key];
        if (!v) return <Text className="text-gray-300 text-xs">—</Text>;
        return (
          <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${t.bg} ${t.text} border ${t.border}`}>
            {v}
          </div>
        );
      },
    })),
    {
      title: <span className="text-[11px] font-semibold uppercase text-gray-600">Total</span>,
      key: "total",
      width: 100,
      align: "center" as const,
      render: (_: any, record: EntityStat) => (
        <div className="flex flex-col items-center gap-1">
          <Text strong className="text-sm text-gray-900">{record.total}</Text>
          {grandTotal > 0 && (
            <Tooltip title={`${((record.total / grandTotal) * 100).toFixed(1)}%`}>
              <Progress
                percent={Math.round((record.total / grandTotal) * 100)}
                size="small"
                showInfo={false}
                strokeColor="#16a34a"
                trailColor="#e5e7eb"
                style={{ width: 56 }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8">
        <div>
          <Title level={2} className="mb-1 flex items-center gap-2" style={{ fontSize: "22px" }}>
            <AppstoreOutlined className="text-green-600" />
            Applications Dashboard
          </Title>
          <p className="text-gray-500 text-sm mb-0">
            Environmental Protection Authority — Cross-application overview by entity
          </p>
        </div>
      </div>

      <Spin spinning={isLoading}>
        {/* ── Type Summary Cards ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-green-600 rounded-full" />
            <Title level={4} className="mb-0" style={{ fontSize: "15px" }}>
              Application Overview
            </Title>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={6} lg={4}>
              <Card className="shadow-sm h-full" bodyStyle={{ padding: "16px" }}>
                <Text className="text-[11px] text-gray-400 block uppercase tracking-wide mb-1">
                  All Types
                </Text>
                <div className="text-2xl font-bold text-gray-900">{grandTotal}</div>
                <Text className="text-[11px] text-gray-400">across {stats.length} entities</Text>
              </Card>
            </Col>
            {typeTotals.map((t) => (
              <Col xs={12} sm={12} md={6} lg={5} key={t.key}>
                <Link to={t.link}>
                  <Card
                    className={`shadow-sm h-full cursor-pointer hover:shadow-md transition-shadow border ${t.border}`}
                    bodyStyle={{ padding: "16px" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Text className={`text-[11px] block uppercase tracking-wide mb-1 ${t.text}`}>
                          {t.label}
                        </Text>
                        <div className="text-2xl font-bold" style={{ color: t.color }}>
                          {t.total}
                        </div>
                        {grandTotal > 0 && (
                          <Text className="text-[11px] text-gray-400">
                            {((t.total / grandTotal) * 100).toFixed(1)}% of total
                          </Text>
                        )}
                      </div>
                      <div className="opacity-20 text-2xl" style={{ color: t.color }}>
                        {t.icon}
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        {/* ── Global Status Breakdown ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <Title level={4} className="mb-0" style={{ fontSize: "15px" }}>
              Status Breakdown — All Applications
            </Title>
          </div>
          <Card className="shadow-sm" bodyStyle={{ padding: "20px" }}>
            <Table
              columns={globalStatusColumns}
              dataSource={globalStatusRows}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
            />
          </Card>
        </div>

        {/* ── Entity Breakdown Table ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-green-600 rounded-full" />
            <Title level={4} className="mb-0" style={{ fontSize: "15px" }}>
              Applications by Entity
            </Title>
            <Text className="text-[11px] text-gray-400 ml-1">
              — expand a row to see status breakdown
            </Text>
          </div>
          <Card className="shadow-sm" bodyStyle={{ padding: 0 }}>
            <Table
              columns={entityColumns}
              dataSource={stats.map((s) => ({ ...s, key: s.entityId }))}
              pagination={{ pageSize: 15, size: "small", showTotal: (t) => `${t} entities` }}
              size="small"
              scroll={{ x: 700 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-4 py-3 bg-gray-50">
                    <Text className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
                      Status Breakdown — {record.entityName}
                    </Text>
                    <StatusBreakdownTable record={record} />
                  </div>
                ),
                rowExpandable: (record) => record.total > 0,
              }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
            />
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default ApplicationsDashboard;
