import { Drawer, Table, Tag, Spin, Empty, Typography, Progress, Tooltip } from "antd";
import { BankOutlined, BarChartOutlined } from "@ant-design/icons";
import { useGetAdminApplicationEntityStatsQuery } from "@/redux/features/general/client-applications";
import { useFetchApplicationEntityStatsQuery } from "@/redux/features/employee-portal-api/application/application";

const { Text } = Typography;

export type EntityStatsMode = "admin" | "hr";

interface ApplicationEntityStatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EntityStatsMode;
}

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

const STATUS_ALIAS: Record<string, string> = {
  processing_fee_pending_payment: "pending_processing_fee",
};

const normalizeStatusKey = (s: string) => STATUS_ALIAS[s] ?? s;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#9ca3af" },
  pending_processing_fee: { label: "Permit Fee Pending Payment", color: "#a78bfa" },
  submitted: { label: "Submitted", color: "#3b82f6" },
  under_review: { label: "Under Review", color: "#f59e0b" },
  corrections_required: { label: "Corrections", color: "#ef4444" },
  reports_required: { label: "Reports Req.", color: "#f97316" },
  payment_pending: { label: "Payment Pending", color: "#ec4899" },
  awaiting_issuance: { label: "Awaiting Issuance", color: "#06b6d4" },
  completed: { label: "Completed", color: "#10b981" },
  rejected: { label: "Rejected", color: "#dc2626" },
};

const TYPE_CONFIG = [
  { key: "permits" as const, label: "Permits", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { key: "authorizations" as const, label: "Authorizations", color: "#8b5cf6", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { key: "licenses" as const, label: "Licenses", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { key: "efficacy" as const, label: "Efficacy Trials", color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
];

const normalizeStatus = (s: string) =>
  STATUS_CONFIG[s]?.label ?? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusColor = (s: string) => STATUS_CONFIG[s]?.color ?? "#6b7280";

const mergeStatusMaps = (map: StatusMap): StatusMap => {
  const result: StatusMap = {};
  for (const [k, v] of Object.entries(map)) {
    const key = normalizeStatusKey(k);
    result[key] = (result[key] ?? 0) + v;
  }
  return result;
};

const StatusBreakdownTable = ({ record }: { record: EntityStat }) => {
  const byStatus = mergeStatusMaps(record.byStatus);
  const allStatuses = Object.keys(byStatus).filter((s) => byStatus[s] > 0);

  if (allStatuses.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" className="py-4" />;
  }

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (s: string) => (
        <Tag
          style={{ color: statusColor(s), borderColor: statusColor(s), backgroundColor: statusColor(s) + "15" }}
          className="text-[11px] font-medium"
        >
          {normalizeStatus(s)}
        </Tag>
      ),
    },
    ...TYPE_CONFIG.map((t) => ({
      title: (
        <span className={`text-[11px] font-semibold ${t.text}`}>{t.label}</span>
      ),
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
      render: (v: number) => <Text strong className="text-sm text-gray-800">{v}</Text>,
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
      className="border border-gray-100 rounded-lg overflow-hidden"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
    />
  );
};

const useEntityStats = (mode: EntityStatsMode, enabled: boolean) => {
  const adminResult = useGetAdminApplicationEntityStatsQuery(undefined, {
    skip: mode !== "admin" || !enabled,
    refetchOnMountOrArgChange: true,
  });
  const hrResult = useFetchApplicationEntityStatsQuery(undefined, {
    skip: mode !== "hr" || !enabled,
    refetchOnMountOrArgChange: true,
  });
  return mode === "admin" ? adminResult : hrResult;
};

const ApplicationEntityStatsDrawer = ({
  isOpen,
  onClose,
  mode,
}: ApplicationEntityStatsDrawerProps) => {
  const { data, isLoading } = useEntityStats(mode, isOpen);
  const stats: EntityStat[] = data?.data ?? [];

  const grandTotal = stats.reduce((s, e) => s + e.total, 0);

  const mainColumns = [
    {
      title: "#",
      key: "index",
      width: 48,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-400 text-xs font-mono">{index + 1}</span>
      ),
    },
    {
      title: "Entity",
      key: "entityName",
      render: (_: any, record: EntityStat) => (
        <div className="flex items-center gap-2 py-0.5">
          <div className="w-7 h-7 rounded bg-green-50 border border-green-200 text-green-700 flex items-center justify-center flex-shrink-0">
            <BankOutlined style={{ fontSize: "13px" }} />
          </div>
          <Text className="text-sm font-semibold text-gray-800 leading-tight">
            {record.entityName}
          </Text>
        </div>
      ),
    },
    ...TYPE_CONFIG.map((t) => ({
      title: (
        <Tooltip title={t.label}>
          <span className={`text-[11px] font-semibold uppercase tracking-wide ${t.text}`}>
            {t.label}
          </span>
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
      title: (
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
          Total
        </span>
      ),
      key: "total",
      width: 100,
      align: "center" as const,
      render: (_: any, record: EntityStat) => (
        <div className="flex flex-col items-center gap-1">
          <Text strong className="text-sm text-gray-900">{record.total}</Text>
          {grandTotal > 0 && (
            <Tooltip title={`${((record.total / grandTotal) * 100).toFixed(1)}% of total`}>
              <Progress
                percent={Math.round((record.total / grandTotal) * 100)}
                size="small"
                showInfo={false}
                strokeColor="#3b82f6"
                trailColor="#e5e7eb"
                style={{ width: 60 }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <BarChartOutlined className="text-white text-sm" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-gray-900 leading-tight m-0">
              Application Statistics by Entity
            </p>
            <p className="text-[11px] text-gray-400 m-0 uppercase tracking-wider">
              Breakdown across all application types
            </p>
          </div>
        </div>
      }
      open={isOpen}
      onClose={onClose}
      width="100%"
      placement="right"
      bodyStyle={{ padding: 0, backgroundColor: "#f9fafb" }}
      headerStyle={{ borderBottom: "1px solid #e5e7eb" }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      ) : stats.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Empty description="No application data found" />
        </div>
      ) : (
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-1">
              <Text className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Total Applications
              </Text>
              <span className="text-2xl font-bold text-gray-900">{grandTotal}</span>
              <Text className="text-[11px] text-gray-400">across {stats.length} entities</Text>
            </div>
            {TYPE_CONFIG.map((t) => {
              const typeTotal = stats.reduce((s, e) => s + e.totals[t.key], 0);
              return (
                <div key={t.key} className={`rounded-xl border shadow-sm p-4 flex flex-col gap-1 ${t.bg} border-${t.border}`}>
                  <Text className={`text-[11px] uppercase tracking-wider font-medium ${t.text}`}>
                    {t.label}
                  </Text>
                  <span className={`text-2xl font-bold ${t.text}`}>{typeTotal}</span>
                  <Text className={`text-[11px] ${t.text} opacity-70`}>
                    {grandTotal > 0 ? `${((typeTotal / grandTotal) * 100).toFixed(1)}% of total` : "—"}
                  </Text>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-green-600 rounded-full" />
              <Text className="text-[13px] font-semibold text-gray-700 uppercase tracking-wider">
                Entity Overview
              </Text>
              <Text className="text-[11px] text-gray-400 ml-1">
                — expand a row to see status breakdown
              </Text>
            </div>

            <Table
              columns={mainColumns}
              dataSource={stats.map((s) => ({ ...s, key: s.entityId }))}
              pagination={{ pageSize: 10, size: "small", showTotal: (t) => `${t} entities` }}
              size="small"
              scroll={{ x: 700 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-4 py-3 bg-gray-50">
                    <Text className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Status Breakdown — {record.entityName}
                    </Text>
                    <StatusBreakdownTable record={record} />
                  </div>
                ),
                rowExpandable: (record) => record.total > 0,
              }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No entities found" /> }}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default ApplicationEntityStatsDrawer;
