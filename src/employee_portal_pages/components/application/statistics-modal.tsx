import { Modal, Row, Col, Card, Statistic, Typography } from "antd";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";

const { Text } = Typography;

interface StatsData {
  draft?: number;
  pending_processing_fee?: number;
  submitted?: number;
  under_review?: number;
  corrections_required?: number;
  reports_required?: number;
  payment_pending?: number;
  pending_permit_fee?: number;
  awaiting_issuance?: number;
  completed?: number;
  rejected?: number;
  [key: string]: number | undefined;
}

interface StatisticsModalProps {
  open: boolean;
  onClose: () => void;
  stats: StatsData;
  title?: string;
}

export default function StatisticsModal({
  open,
  onClose,
  stats,
  title = "Application Statistics",
}: StatisticsModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isExtraSmall = useMediaQuery("(max-width: 480px)");
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    if (open) {
      setChartKey((prev) => prev + 1);
    }
  }, [open]);

  const statsData = [
    { label: "Draft", value: stats.draft || 0, color: "#999999" },
    { label: "Submitted", value: stats.submitted || 0, color: "#1890ff" },
    {
      label: "Under Review",
      value: stats.under_review || 0,
      color: "#faad14",
    },
    {
      label: "Corrections Required",
      value: stats.corrections_required || 0,
      color: "#ff4d4f",
    },
    {
      label: "Awaiting Issuance",
      value: stats.awaiting_issuance || 0,
      color: "#52c41a",
    },
    { label: "Completed", value: stats.completed || 0, color: "#13c2c2" },
    {
      label: "Payment Pending",
      value: stats.payment_pending || 0,
      color: "#eb2f96",
    },
    {
      label: "Reports Required",
      value: stats.reports_required || 0,
      color: "#fa8c16",
    },
    {
      label: "Pending Processing Fee",
      value: stats.pending_processing_fee || 0,
      color: "#722ed1",
    },
    { label: "Rejected", value: stats.rejected || 0, color: "#f5222d" },
  ];

  const filteredStats = statsData.filter((stat) => stat.value > 0);

  const pieOptions: ApexOptions = {
    series: filteredStats.map((stat) => stat.value),
    labels: filteredStats.map((stat) => stat.label),
    chart: {
      width: "100%",
      height: 300,
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: filteredStats.map((stat) => stat.color),
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      width={isMobile ? "95%" : isExtraSmall ? "100%" : "90%"}
      footer={null}
      centered
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat) => (
          <Col xs={24} sm={12} md={8} key={stat.label}>
            <Card
              className="text-center rounded-lg shadow-sm hover:shadow-md transition-shadow"
              bodyStyle={{ padding: "16px" }}
            >
              <Statistic
                title={
                  <Text className="text-gray-600 text-xs md:text-sm">
                    {stat.label}
                  </Text>
                }
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {filteredStats.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <ApexCharts
              key={chartKey}
              options={pieOptions}
              series={pieOptions?.series}
              type="pie"
              height={300}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
