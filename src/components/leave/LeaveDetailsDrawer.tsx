import { formatDate2, formatDate4 } from "@/utils/helperFunction";
import {
  Drawer,
  Space,
  Typography,
  Divider,
  Tag,
  Descriptions,
  Avatar,
  Alert,
} from "antd";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Info,
  ShieldCheck,
} from "lucide-react";

const { Text, Title } = Typography;

interface LeaveDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const LeaveDetailsDrawer = ({
  open,
  onClose,
  data,
}: LeaveDetailsDrawerProps) => {
  if (!data) return null;

  const getStatusTag = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Tag color="success" className="m-0">
            <div className="flex items-center gap-1">
              <CheckCircle size={14} />
              <span>Approved</span>
            </div>
          </Tag>
        );
      case "rejected":
        return (
          <Tag color="error" className="m-0">
            <div className="flex items-center gap-1">
              <XCircle size={14} />
              <span>Rejected</span>
            </div>
          </Tag>
        );
      default:
        return (
          <Tag color="warning" className="m-0">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Pending</span>
            </div>
          </Tag>
        );
    }
  };

  const approverName = [
    data.approving_employee_firstname,
    data.approving_employee_lastname,
    data.approving_admin_firstname,
    data.approving_admin_lastname,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Drawer
      title={
        <Space>
          <FileText size={18} className="text-blue-500" />
          <Title level={4} style={{ margin: 0 }}>
            Leave Request Details
          </Title>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <section className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
          <Avatar
            size={64}
            style={{
              backgroundColor:
                data.status === "approved"
                  ? "#52c41a"
                  : data.status === "rejected"
                  ? "#ff4d4f"
                  : "#1890ff",
              marginBottom: "12px",
            }}
          >
            {data.firstname?.[0]}
            {data.lastname?.[0]}
          </Avatar>
          <Title level={4} style={{ margin: 0 }}>
            {data.firstname} {data.lastname}
          </Title>
          <Text type="secondary">Staff ID: {data.staff_id}</Text>
          <div className="mt-2">{getStatusTag(data.status)}</div>
        </section>

        {/* Leave Information */}
        <section>
          <Title level={5} className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-blue-500" />
            Leave Information
          </Title>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Leave Name">
              {data.leave_name}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {data.duration} {data.duration === 1 ? "Day" : "Days"}
            </Descriptions.Item>
            <Descriptions.Item label="Period">
              {formatDate2(data.start_date)} - {formatDate2(data.end_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Leave Type">
              <Tag
                color={data.type === "paid" ? "blue" : "default"}
                className="m-0"
              >
                <div className="flex items-center gap-1">
                  {data.type === "paid" ? (
                    <CheckCircle size={12} />
                  ) : (
                    <Info size={12} />
                  )}
                  <span>{data.type === "paid" ? "Paid" : "Unpaid"}</span>
                </div>
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Applied On">
              {formatDate4(data.created_at || data.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </section>

        {/* Reason Section */}
        <section>
          <Title level={5} className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-blue-500" />
            Employee Reason
          </Title>
          <Alert
            message={data.reason || "No reason provided"}
            type="info"
            className="bg-blue-50 border-blue-100"
          />
        </section>

        <Divider style={{ margin: "12px 0" }} />

        {/* Decision Section */}
        {(data.status === "approved" || data.status === "rejected") && (
          <section
            className={`${
              data.status === "approved" ? "bg-green-50/30" : "bg-red-50/30"
            } p-4 rounded-lg border ${
              data.status === "approved" ? "border-green-100" : "border-red-100"
            }`}
          >
            <Title level={5} className="flex items-center gap-2 mb-4">
              <ShieldCheck
                size={16}
                className={
                  data.status === "approved" ? "text-green-500" : "text-red-500"
                }
              />
              Decision Details
            </Title>

            <div className="space-y-4">
              <div>
                <Text
                  type="secondary"
                  className="block text-xs uppercase font-semibold mb-1"
                >
                  Processed By
                </Text>
                <Text strong>{approverName || "System Admin"}</Text>
              </div>

              {data.decision_note && (
                <div>
                  <Text
                    type="secondary"
                    className="block text-xs uppercase font-semibold mb-1"
                  >
                    Decision Note
                  </Text>
                  <Text>{data.decision_note}</Text>
                </div>
              )}

              <div>
                <Text
                  type="secondary"
                  className="block text-xs uppercase font-semibold mb-1"
                >
                  Processed On
                </Text>
                <Text>
                  {formatDate4(data.updated_at || data.updatedAt)}
                </Text>
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
        <section>
          <div className="bg-gray-50 p-3 rounded border border-dashed border-gray-300">
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Remaining Leave Balance at time of request:{" "}
              <strong>{data.remaining_leave_days || 0} Days</strong>
            </Text>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default LeaveDetailsDrawer;
