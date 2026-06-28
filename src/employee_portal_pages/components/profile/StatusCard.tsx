import { formatDate2 } from "@/utils/helperFunction";
import { Card, Tag, Typography } from "antd";
import { Employee } from "../../types/employee";

const { Title, Text } = Typography;

interface StatusCardProps {
  employee: Employee;
}

export default function StatusCard({ employee }: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "interdicted":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Card
      className="border border-gray-200 shadow-sm"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={5} className="!m-0">
            Employment Status
          </Title>
          <Text type="secondary" className="text-sm">
            Current employment information
          </Text>
        </div>
        <Tag
          color={getStatusColor(employee.status)}
          className="m-0 border-none px-3 py-1 rounded-full font-medium"
        >
          {employee.status}
        </Tag>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <Text type="secondary" className="text-sm">
            Staff ID
          </Text>
          <Text strong className="text-sm">
            {employee.staff_id}
          </Text>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <Text type="secondary" className="text-sm">
            Rank
          </Text>
          <Text strong className="text-sm">
            {employee.grade}
          </Text>
        </div>
        {employee.rank_title && (
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <Text type="secondary" className="text-sm">
              Rank Title
            </Text>
            <Text strong className="text-sm">
              {employee.rank_title}
            </Text>
          </div>
        )}

        <div className="flex justify-between border-b border-gray-100 pb-3">
          <Text type="secondary" className="text-sm">
            Hire Date
          </Text>
          <Text strong className="text-sm">
            {formatDate2(employee.hire_start_date)}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text type="secondary" className="text-sm">
            Contract End Date
          </Text>
          <Text strong className="text-sm">
            {employee.hire_end_date || "N/A"}
          </Text>
        </div>
      </div>
    </Card>
  );
}
