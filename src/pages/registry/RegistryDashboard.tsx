import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  DatePicker,
  Table,
  Empty,
  Spin,
} from "antd";
import {
  DollarOutlined,
  FileTextOutlined,
  BankOutlined,
  AlertOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useGetAdminRegistryDashboardQuery } from "../../redux/features/general/client-applications";
import type { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const formatCurrency = (value: number) =>
  value?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00";

const StatCard = ({
  title,
  value,
  prefix,
  description,
  icon,
  color,
  isCurrency = false,
}: {
  title: string;
  value: number;
  prefix?: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  isCurrency?: boolean;
}) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 h-full" bodyStyle={{ padding: "20px" }}>
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <Text className="text-gray-500 block text-xs mb-1 uppercase tracking-wide font-medium">{title}</Text>
        <div className="font-bold text-xl" style={{ color }}>
          {prefix && <span className="text-sm mr-0.5">{prefix}</span>}
          {isCurrency ? formatCurrency(value) : value}
        </div>
        {description && (
          <Text className="text-gray-400 block mt-1 text-[11px]">{description}</Text>
        )}
      </div>
      <div className="opacity-20 ml-3 flex-shrink-0 text-3xl" style={{ color }}>{icon}</div>
    </div>
  </Card>
);

const RegistryDashboard = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const { data, isLoading } = useGetAdminRegistryDashboardQuery(
    { startDate, endDate },
    { refetchOnMountOrArgChange: true }
  );

  const invoiceStats = data?.data?.invoiceStats || {};

  const invoiceCards = [
    {
      title: "Total Invoiced",
      value: invoiceStats.totalRevenueEarned ?? 0,
      prefix: "GH₵",
      description: "Total value of all generated invoices",
      icon: <DollarOutlined />,
      color: "#1890ff",
      isCurrency: true,
    },
    {
      title: "Revenue Collected",
      value: invoiceStats.totalCashCollected ?? 0,
      prefix: "GH₵",
      description: "Total payments received from clients",
      icon: <BankOutlined />,
      color: "#52c41a",
      isCurrency: true,
    },
    {
      title: "Outstanding Amount",
      value: invoiceStats.totalOutstandingAmount ?? 0,
      prefix: "GH₵",
      description: "Pending payments",
      icon: <AlertOutlined />,
      color: "#ff4d4f",
      isCurrency: true,
    },
    {
      title: "Total Invoices",
      value: invoiceStats.totalInvoices ?? 0,
      description: "Generated invoices count",
      icon: <FileTextOutlined />,
      color: "#722ed1",
    },
  ];

  const invoicesByStatus = Object.entries(invoiceStats.statusBreakdown || {}).map(([status, count]) => ({ key: status, status, count }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div>
          <Title level={2} className="mb-1 flex items-center" style={{ fontSize: "24px" }}>
            <EnvironmentOutlined className="text-green-600 mr-2" />
            Registry Dashboard
          </Title>
          <p className="text-gray-500 text-sm mb-0">
            Environmental Protection Authority — Registry Overview
          </p>
        </div>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
          placeholder={["Start date", "End date"]}
          allowClear
        />
      </div>

      <Spin spinning={isLoading}>
        {/* ── Invoice Stats ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <Title level={4} className="mb-0" style={{ fontSize: "16px" }}>
              Invoice Overview
            </Title>
          </div>
          <Row gutter={[16, 16]}>
            {invoiceCards.map((card, i) => (
              <Col xs={12} sm={12} md={12} lg={6} key={i}>
                <StatCard {...card} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Invoice Status Breakdown */}
        {invoicesByStatus.length > 0 && (
          <div className="mb-8">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card className="shadow-sm" bodyStyle={{ padding: "20px" }}>
                  <Title level={5} className="mb-4" style={{ fontSize: "14px" }}>
                    Invoices by Status
                  </Title>
                  <Table
                    columns={[
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (text: string) => (
                          <span className="capitalize text-sm">{text?.toLowerCase()}</span>
                        ),
                      },
                      {
                        title: "Count",
                        dataIndex: "count",
                        key: "count",
                        width: "30%",
                        render: (count: number) => (
                          <Text strong style={{ color: "#722ed1", fontSize: "13px" }}>{count}</Text>
                        ),
                      },
                    ]}
                    dataSource={invoicesByStatus}
                    pagination={false}
                    size="small"
                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}


      </Spin>
    </div>
  );
};

export default RegistryDashboard;
