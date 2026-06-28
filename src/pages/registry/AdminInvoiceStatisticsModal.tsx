import { useState, useMemo } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Table,
  Empty,
  Spin,
  DatePicker,
  Select,
  Input,
  Button,
  Progress,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  SearchOutlined,
  ReloadOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useGetAdminInvoiceStatsQuery } from "@/redux/features/general/client-applications";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import {
  invoicesStatusOptions,
  paymentForOptions,
} from "@/employee_portal_pages/lib/helpers";
import { Dayjs } from "dayjs";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import { formatNumber } from "@/utils/helperFunction";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface MonthlyTrend {
  month: string;
  earned: number;
  collected: number;
}

interface DepartmentStat {
  invoiceCount: number;
  earned: number;
  collected: number;
  departmentId: string | null;
  departmentName: string;
}

interface PaymentTypeStat {
  count: number;
  earned: number;
  collected: number;
  paymentFor: string;
}

interface InvoiceStats {
  totalInvoices: number;
  totalRevenueEarned: number;
  totalCashCollected: number;
  totalOutstandingAmount: number;
  statusBreakdown: Record<string, number>;
  monthlyTrends: MonthlyTrend[];
  statsByDepartment: DepartmentStat[];
  statsByPaymentFor: PaymentTypeStat[];
}

interface AdminInvoiceStatisticsModalProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  paid: "#52c41a",
  unpaid: "#faad14",
  overdue: "#ff4d4f",
  void: "#bfbfbf",
  processing: "#1890ff",
  draft: "#8c8c8c",
};

const SectionHeader = ({ title, accent }: { title: string; accent: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
    <Title level={5} className="!mb-0 !text-gray-800 !font-bold tracking-tight">
      {title}
    </Title>
  </div>
);

const AdminInvoiceStatisticsModal: React.FC<AdminInvoiceStatisticsModalProps> = ({
  open,
  onClose,
}) => {
  const { data: entitiesResponse } = useEntityFullListQuery({});
  const entities = entitiesResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentFor, setPaymentFor] = useState("all");
  const [assigningEntity, setAssigningEntity] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const paidAtStart = dateFilterType === "paidAt" ? startDateVal : "";
  const paidAtEnd = dateFilterType === "paidAt" ? endDateVal : "";

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: statsResponse, isLoading } = useGetAdminInvoiceStatsQuery(
    {
      searchTerm: debouncedSearchTerm,
      status: status === "all" ? "" : status,
      paymentFor: paymentFor === "all" ? "" : paymentFor,
      assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
      issueDateStart,
      issueDateEnd,
      startDate,
      endDate,
      paidAtStart,
      paidAtEnd,
    },
    { refetchOnMountOrArgChange: true, skip: !open }
  );

  const invoiceStats = statsResponse?.data as InvoiceStats | undefined;

  const collectionRate = useMemo(() => {
    if (!invoiceStats?.totalRevenueEarned || !invoiceStats?.totalCashCollected) return 0;
    return (invoiceStats.totalCashCollected / invoiceStats.totalRevenueEarned) * 100;
  }, [invoiceStats]);

  const statusPieData = useMemo(() => {
    if (!invoiceStats?.statusBreakdown) return [];
    return Object.entries(invoiceStats.statusBreakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      value,
      color: STATUS_COLORS[key] ?? "#8c8c8c",
    }));
  }, [invoiceStats]);

  const filterOptions = useMemo(
    () => ({
      statusOptions: [
        { label: "All Statuses", value: "all" },
        ...invoicesStatusOptions.map((s) => ({
          label: s.charAt(0).toUpperCase() + s.slice(1).replace("_", " "),
          value: s,
        })),
      ],
      paymentForOptions: [
        { label: "All Payment Types", value: "all" },
        ...paymentForOptions.map((type) => ({
          label: type.replace(/([A-Z])/g, " $1").trim(),
          value: type,
        })),
      ],
      entityOptions: [
        { label: "All Entities", value: "all" },
        ...entities.map((entity: any) => ({
          label: entity.name,
          value: entity.id,
        })),
      ],
    }),
    [entities]
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatus("all");
    setPaymentFor("all");
    setAssigningEntity("all");
    setDateFilterType("issueDate");
    setDateRange([null, null]);
  };

  const kpiCards = [
    {
      label: "Total Revenue Earned",
      value: `GH₵ ${formatNumber(invoiceStats?.totalRevenueEarned ?? 0)}`,
      icon: <DollarCircleOutlined />,
      accent: "#ffa940",
      bg: "#fffbe6",
      border: "#ffe58f",
      iconBg: "#fff7e6",
    },
    {
      label: "Cash Collected",
      value: `GH₵ ${formatNumber(invoiceStats?.totalCashCollected ?? 0)}`,
      icon: <CheckCircleOutlined />,
      accent: "#52c41a",
      bg: "#f6ffed",
      border: "#b7eb8f",
      iconBg: "#f0fff0",
    },
    {
      label: "Outstanding Balance",
      value: `GH₵ ${formatNumber(invoiceStats?.totalOutstandingAmount ?? 0)}`,
      icon: <AlertOutlined />,
      accent: "#ff4d4f",
      bg: "#fff1f0",
      border: "#ffa39e",
      iconBg: "#fff2f0",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate.toFixed(1)}%`,
      icon: <PercentageOutlined />,
      accent: collectionRate >= 80 ? "#52c41a" : collectionRate >= 50 ? "#faad14" : "#ff4d4f",
      bg: collectionRate >= 80 ? "#f6ffed" : collectionRate >= 50 ? "#fffbe6" : "#fff1f0",
      border: collectionRate >= 80 ? "#b7eb8f" : collectionRate >= 50 ? "#ffe58f" : "#ffa39e",
      iconBg: collectionRate >= 80 ? "#f0fff0" : collectionRate >= 50 ? "#fff7e6" : "#fff2f0",
      extra: (
        <Progress
          percent={parseFloat(collectionRate.toFixed(1))}
          showInfo={false}
          size="small"
          strokeColor={collectionRate >= 80 ? "#52c41a" : collectionRate >= 50 ? "#faad14" : "#ff4d4f"}
          trailColor="#f0f0f0"
          className="mt-2"
        />
      ),
    },
    {
      label: "Total Invoices",
      value: (invoiceStats?.totalInvoices ?? 0).toLocaleString(),
      icon: <FileTextOutlined />,
      accent: "#1890ff",
      bg: "#e6f7ff",
      border: "#91d5ff",
      iconBg: "#e6f4ff",
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
            <FileTextOutlined className="text-white text-sm" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-tight">Invoice Statistics</div>
            <div className="text-[10px] text-gray-400 font-normal leading-tight uppercase tracking-widest">
              Admin-wide financial overview
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      wrapClassName="invoice-statistics-modal-wrap"
      style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
      bodyStyle={{ height: "calc(100vh - 109px)", overflowY: "auto", padding: "24px", backgroundColor: "#f8fafc" }}
      className="invoice-statistics-modal"
    >
      <Spin spinning={isLoading}>
        <div className="space-y-6">

          {/* ── Filters ── */}
          <Card
            bodyStyle={{ padding: "16px 20px" }}
            className="shadow-sm border border-gray-200 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <FilterOutlined className="text-gray-400 text-sm" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filters</span>
            </div>
            <div className="space-y-3">
              <Row gutter={[12, 12]}>
                <Col xs={24} md={10}>
                  <Input
                    placeholder="Search by Invoice No, Client Name or Application Code..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-full h-9 rounded-lg text-xs"
                  />
                </Col>
                <Col xs={24} sm={12} md={7}>
                  <Select
                    className="w-full h-9"
                    placeholder="Filter by Status"
                    value={status}
                    onChange={setStatus}
                    options={filterOptions.statusOptions}
                  />
                </Col>
                <Col xs={24} sm={12} md={7}>
                  <Select
                    className="w-full h-9"
                    placeholder="Payment For"
                    value={paymentFor}
                    onChange={setPaymentFor}
                    options={filterOptions.paymentForOptions}
                  />
                </Col>
              </Row>
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={12} md={5}>
                  <Select
                    value={dateFilterType}
                    onChange={setDateFilterType}
                    className="w-full h-9"
                    options={[
                      { label: "Issue Date", value: "issueDate" },
                      { label: "Payment Date", value: "paidAt" },
                      { label: "Creation Date", value: "createdAt" },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={9}>
                  <RangePicker
                    className="w-full h-9"
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                  />
                </Col>
                <Col xs={24} md={7}>
                  <Select
                    showSearch
                    className="w-full h-9"
                    placeholder="All Entities"
                    value={assigningEntity}
                    onChange={setAssigningEntity}
                    options={filterOptions.entityOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Col>
                <Col xs={24} md={3}>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={clearAllFilters}
                    className="w-full h-9 rounded-lg text-xs font-semibold"
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>

          {/* ── KPI Cards ── */}
          <div>
            <SectionHeader title="Financial Overview" accent="#1890ff" />
            <Row gutter={[14, 14]}>
              {kpiCards.map((card) => (
                <Col key={card.label} xs={24} sm={12} md={8} lg={24 / kpiCards.length}>
                  <div
                    className="rounded-xl p-4 border flex flex-col gap-1 h-full"
                    style={{ backgroundColor: card.bg, borderColor: card.border }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-tight">
                        {card.label}
                      </p>
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-base flex-shrink-0"
                        style={{ backgroundColor: card.iconBg, color: card.accent }}
                      >
                        {card.icon}
                      </div>
                    </div>
                    <p
                      className="text-2xl font-extrabold leading-tight mt-1"
                      style={{ color: card.accent }}
                    >
                      {card.value}
                    </p>
                    {card.extra}
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* ── Monthly Trends Chart ── */}
          {invoiceStats?.monthlyTrends && invoiceStats.monthlyTrends.length > 0 && (
            <Card
              bodyStyle={{ padding: "20px 24px" }}
              className="shadow-sm border border-gray-200 rounded-xl"
            >
              <SectionHeader title="Monthly Revenue Trends" accent="#ffa940" />
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={invoiceStats.monthlyTrends} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#8c8c8c", fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-");
                        return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", {
                          month: "short",
                          year: "2-digit",
                        });
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#8c8c8c" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `GH₵ ${formatNumber(value)}`}
                    />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }}
                      formatter={(value: number, name: string) => [
                        `GH₵ ${formatNumber(value)}`,
                        name,
                      ]}
                      labelFormatter={(label) => {
                        const [year, month] = label.split("-");
                        return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                    <Bar name="Revenue Earned" dataKey="earned" fill="#ffa940" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar name="Cash Collected" dataKey="collected" fill="#52c41a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* ── Pie + Payment Type Charts ── */}
          <Row gutter={[14, 14]}>
            <Col xs={24} lg={10}>
              <Card
                bodyStyle={{ padding: "20px 24px" }}
                className="shadow-sm border border-gray-200 rounded-xl h-full"
              >
                <SectionHeader title="Status Distribution" accent="#1890ff" />
                {statusPieData.length === 0 ? (
                  <Empty description="No data" className="py-10" />
                ) : (
                  <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={{ strokeWidth: 1 }}
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }}
                          formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={14}>
              <Card
                bodyStyle={{ padding: "20px 24px" }}
                className="shadow-sm border border-gray-200 rounded-xl h-full"
              >
                <SectionHeader title="Revenue by Application Type" accent="#ffa940" />
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart
                      layout="vertical"
                      data={invoiceStats?.statsByPaymentFor || []}
                      margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10, fill: "#8c8c8c" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `GH₵ ${formatNumber(v)}`}
                      />
                      <YAxis
                        dataKey="paymentFor"
                        type="category"
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#595959" }}
                        width={110}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => value.replace(/([A-Z])/g, " $1").trim()}
                      />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }}
                        formatter={(value: number) => [`GH₵ ${formatNumber(value)}`, "Revenue Earned"]}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                      <Bar name="Revenue Earned" dataKey="earned" fill="#ffa940" radius={[0, 4, 4, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          {/* ── By Department Table ── */}
          {invoiceStats?.statsByDepartment && invoiceStats.statsByDepartment.length > 0 && (
            <Card
              bodyStyle={{ padding: "20px 24px" }}
              className="shadow-sm border border-gray-200 rounded-xl"
            >
              <SectionHeader title="Invoices by Department" accent="#722ed1" />
              <Table<DepartmentStat>
                columns={[
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Department</span>,
                    dataIndex: "departmentName",
                    key: "departmentName",
                    render: (text) => (
                      <Text strong className="text-xs text-gray-800">{text}</Text>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Invoices</span>,
                    dataIndex: "invoiceCount",
                    key: "invoiceCount",
                    width: "10%",
                    align: "center",
                    render: (count) => (
                      <span className="inline-flex items-center justify-center w-8 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        {count}
                      </span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Earned (GH₵)</span>,
                    dataIndex: "earned",
                    key: "earned",
                    width: "18%",
                    align: "right",
                    render: (amount) => (
                      <span className="text-xs font-bold text-amber-600">{formatNumber(amount)}</span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Collected (GH₵)</span>,
                    dataIndex: "collected",
                    key: "collected",
                    width: "18%",
                    align: "right",
                    render: (amount) => (
                      <span className="text-xs font-bold text-green-600">{formatNumber(amount)}</span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Outstanding (GH₵)</span>,
                    key: "outstanding",
                    width: "18%",
                    align: "right",
                    render: (_, record) => {
                      const outstanding = record.earned - record.collected;
                      return (
                        <span className={`text-xs font-bold ${outstanding > 0 ? "text-red-500" : "text-gray-400"}`}>
                          {formatNumber(outstanding)}
                        </span>
                      );
                    },
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Efficiency</span>,
                    key: "efficiency",
                    width: "18%",
                    render: (_, record) => {
                      const efficiency = record.earned ? (record.collected / record.earned) * 100 : 0;
                      const color = efficiency >= 90 ? "#52c41a" : efficiency >= 50 ? "#faad14" : "#ff4d4f";
                      return (
                        <div className="flex items-center gap-2">
                          <Progress
                            percent={parseFloat(efficiency.toFixed(1))}
                            showInfo={false}
                            size="small"
                            strokeColor={color}
                            trailColor="#f0f0f0"
                            className="flex-1 !mb-0"
                          />
                          <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color }}>
                            {efficiency.toFixed(1)}%
                          </span>
                        </div>
                      );
                    },
                  },
                ]}
                dataSource={invoiceStats.statsByDepartment}
                rowKey={(r) => r.departmentId ?? r.departmentName}
                pagination={false}
                size="small"
                rowClassName={(_, i) => i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                locale={{ emptyText: <Empty description="No invoices" /> }}
              />
            </Card>
          )}

          {/* ── By Application Type Table ── */}
          {invoiceStats?.statsByPaymentFor && invoiceStats.statsByPaymentFor.length > 0 && (
            <Card
              bodyStyle={{ padding: "20px 24px" }}
              className="shadow-sm border border-gray-200 rounded-xl"
            >
              <SectionHeader title="Invoices by Application Type" accent="#13c2c2" />
              <Table<PaymentTypeStat>
                columns={[
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Application Type</span>,
                    dataIndex: "paymentFor",
                    key: "paymentFor",
                    render: (text) => (
                      <Text strong className="text-xs text-gray-800">
                        {text.replace(/([A-Z])/g, " $1").trim()}
                      </Text>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Count</span>,
                    dataIndex: "count",
                    key: "count",
                    width: "10%",
                    align: "center",
                    render: (count) => (
                      <span className="inline-flex items-center justify-center w-8 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        {count}
                      </span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Earned (GH₵)</span>,
                    dataIndex: "earned",
                    key: "earned",
                    width: "22%",
                    align: "right",
                    render: (amount) => (
                      <span className="text-xs font-bold text-amber-600">{formatNumber(amount)}</span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Collected (GH₵)</span>,
                    dataIndex: "collected",
                    key: "collected",
                    width: "22%",
                    align: "right",
                    render: (amount) => (
                      <span className="text-xs font-bold text-green-600">{formatNumber(amount)}</span>
                    ),
                  },
                  {
                    title: <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Outstanding (GH₵)</span>,
                    key: "outstanding",
                    width: "22%",
                    align: "right",
                    render: (_, record) => {
                      const outstanding = record.earned - record.collected;
                      return (
                        <span className={`text-xs font-bold ${outstanding > 0 ? "text-red-500" : "text-gray-400"}`}>
                          {formatNumber(outstanding)}
                        </span>
                      );
                    },
                  },
                ]}
                dataSource={invoiceStats.statsByPaymentFor}
                rowKey="paymentFor"
                pagination={false}
                size="small"
                rowClassName={(_, i) => i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                locale={{ emptyText: <Empty description="No invoices" /> }}
              />
            </Card>
          )}

        </div>
      </Spin>
    </Modal>
  );
};

export default AdminInvoiceStatisticsModal;
