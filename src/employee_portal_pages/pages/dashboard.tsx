import { useState } from "react";
import { Card, Row, Col, Select, DatePicker, Spin, Button, Tooltip } from "antd";
import NewEpisodeBanner from "@/employee_portal_pages/components/training/NewEpisodeBanner";
import {
  DollarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  BankOutlined,
  AlertOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useFetchInvoicesStatisticsQuery } from "@/redux/features/employee-portal-api/invoices/invoices-payment-transactions";
import { Dayjs } from "dayjs";
import ApplicationEntityStatsDrawer from "@/components/application-entity-stats/application-entity-stats-drawer";

const { RangePicker } = DatePicker;
const { Option } = Select;

const StatCard = ({ title, value, prefix = "", icon, color, description = "" }: any) => (
  <Card
    className="shadow-sm hover:shadow-md transition-shadow duration-200 h-full"
    styles={{ body: { padding: "10px 12px" } }}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-[10px] truncate mb-0.5">{title}</p>
        <p className="font-bold text-sm leading-tight m-0" style={{ color }}>
          {prefix}{typeof value === "number" ? value.toLocaleString("en-US") : value}
        </p>
        {description && (
          <p className="text-gray-400 text-[9px] mt-0.5 m-0 leading-tight">{description}</p>
        )}
      </div>
      <div className="opacity-15 ml-2 flex-shrink-0 text-lg" style={{ color }}>{icon}</div>
    </div>
  </Card>
);


const FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

const EPAAdminDashboard = () => {
  const [period, setPeriod] = useState("month");
  const [entityStatsOpen, setEntityStatsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("dash-font-size") || "base"
  );

  const zoom = FONT_SIZES.find((f) => f.key === fontSizeKey)?.zoom ?? 1;

  const handleFontSize = (key: string) => {
    setFontSizeKey(key);
    localStorage.setItem("dash-font-size", key);
  };

  const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const { data: invoiceStats, isLoading: isLoadingInvoices } = useFetchInvoicesStatisticsQuery(
    { startDate, endDate },
    { refetchOnMountOrArgChange: true }
  );

  const overview = invoiceStats?.data || {};

  const mainStatsCards = [
    { title: "Total Invoiced",     value: overview.totalRevenueEarned ?? 0,  prefix: "GH₵ ", icon: <DollarOutlined />,  color: "#1890ff", description: "Total value of all generated invoices" },
    { title: "Revenue Collected",  value: overview?.totalCashCollected ?? 0,  prefix: "GH₵ ", icon: <BankOutlined />,    color: "#52c41a", description: "Total payments received from clients" },
    { title: "Outstanding",        value: overview?.totalOutstandingAmount ?? 0, prefix: "GH₵ ", icon: <AlertOutlined />, color: "#ff4d4f", description: "Pending payments" },
    { title: "Total Invoices",     value: overview?.totalInvoices ?? 0,       icon: <FileTextOutlined />, color: "#722ed1", description: "Generated invoices count" },
  ];

  return (
    <div className="p-2 sm:p-3 bg-gray-50 min-h-screen" style={{ zoom }}>

      {/* New episode banner */}
      <NewEpisodeBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <EnvironmentOutlined className="text-sm" style={{ color: "#D4A017" }} />
            <h1 className="text-sm font-bold text-gray-800 m-0">YANTEC Engineering</h1>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5 ml-5">Staff Portal — Finance Overview</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Font size controls */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden" title="Adjust text size">
            {FONT_SIZES.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFontSize(f.key)}
                title={f.key === "sm" ? "Small" : f.key === "base" ? "Normal" : "Large"}
                className={`px-2 py-0.5 text-[10px] font-bold border-r last:border-r-0 border-gray-200 transition-colors ${
                  fontSizeKey === f.key
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Select value={period} onChange={setPeriod} size="small" className="w-28 text-xs">
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="quarter">This Quarter</Option>
            <Option value="year">This Year</Option>
          </Select>
          <RangePicker size="small" className="text-xs" value={dateRange} onChange={(d) => setDateRange(d as any)} />
          <Tooltip title="Application Entity Statistics">
            <Button
              icon={<BarChartOutlined />}
              size="small"
              onClick={() => setEntityStatsOpen(true)}
              className="!bg-green-700 !text-white !border-green-700 !text-[10px]"
            >
              <span className="hidden sm:inline">Entity Stats</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Revenue Cards */}
      <Spin spinning={isLoadingInvoices}>
        <Row gutter={[8, 8]} className="mb-3">
          {mainStatsCards.map((stat, i) => (
            <Col xs={12} sm={12} md={6} key={i}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </Spin>

      <ApplicationEntityStatsDrawer
        isOpen={entityStatsOpen}
        onClose={() => setEntityStatsOpen(false)}
        mode="hr"
      />
    </div>
  );
};

export default EPAAdminDashboard;
