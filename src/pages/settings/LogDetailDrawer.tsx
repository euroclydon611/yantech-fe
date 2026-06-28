import { Drawer, Descriptions, Tag, Table, Typography, Card, Divider, Empty } from "antd";
import { UserOutlined, GlobalOutlined, DesktopOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { formatDate4 } from "@/utils/helperFunction";
const { Text } = Typography;

interface LogDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  log: any;
}

const LogDetailDrawer = ({ open, onClose, log }: LogDetailDrawerProps) => {
  if (!log) return null;

  const changesColumns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: "25%",
      render: (text: string) => <Text strong className="text-[12px]">{text}</Text>,
    },
    {
      title: "Old Value",
      dataIndex: "oldValue",
      key: "oldValue",
      render: (val: any) => (
        <Text delete type="danger" className="text-[12px]">
          {typeof val === "object" ? JSON.stringify(val) : String(val ?? "")}
        </Text>
      ),
    },
    {
      title: "New Value",
      dataIndex: "newValue",
      key: "newValue",
      render: (val: any) => (
        <Text type="success" className="text-[12px] font-bold">
          {typeof val === "object" ? JSON.stringify(val) : String(val ?? "")}
        </Text>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-blue-600" />
          <span>Audit Log Details</span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={800}
      className="audit-detail-drawer"
    >
      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label="Timestamp" span={1}>
          {formatDate4(log.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Action" span={1}>
          <Tag color={log.action === "CREATE" ? "green" : log.action === "UPDATE" ? "blue" : "red"}>
            {log.action}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Model" span={1}>
          {log.model_name}
        </Descriptions.Item>
        <Descriptions.Item label="Record ID" span={1}>
          {log.record_id}
        </Descriptions.Item>
        <Descriptions.Item label="Source" span={1}>
          <Tag icon={<GlobalOutlined />} color="geekblue">
            {log.source?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="IP Address" span={1}>
          <Tag icon={<DesktopOutlined />} color="orange">
            {log.ip_address}
          </Tag>
        </Descriptions.Item>
        {log.device_info && (
          <Descriptions.Item label="Device" span={1}>
            <div className="text-[11px]">
              <DesktopOutlined className="mr-1" />
              {log.device_info.os || "Unknown OS"} / {log.device_info.browser || "Unknown Browser"}
              <div className="text-gray-400">({log.device_info.device || "desktop"})</div>
            </div>
          </Descriptions.Item>
        )}
        {log.location_info && (
          <Descriptions.Item label="Location" span={1}>
            <div className="text-[11px]">
              <GlobalOutlined className="mr-1" />
              {log.location_info.city ? `${log.location_info.city}, ` : ""}
              {log.location_info.region ? `${log.location_info.region}, ` : ""}
              {log.location_info.country || "Unknown Location"}
            </div>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Status" span={log.device_info || log.location_info ? 2 : 2}>
          <Tag color={log.status === 1 || log.status === "SUCCESS" ? "success" : "error"}>
            {log.status === 1 || log.status === "SUCCESS" ? "SUCCESS" : "FAILURE"}
          </Tag>
          {log.error_message && (
            <div className="mt-1 text-red-500 text-[12px]">
              {log.error_message}
            </div>
          )}
        </Descriptions.Item>
      </Descriptions>
      
      <Divider orientation="left" className="m-4">
        <UserOutlined className="mr-2" />
        Actor Information
      </Divider>

      <Card size="small" className="bg-slate-50 border-gray-200">
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Name">
            <Text strong>{log.actor_name || "System"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="ID">
            <Text type="secondary" className="text-[11px]">{log.actor_id || "N/A"}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider orientation="left" className="m-4">Field-Level Changes</Divider>

      {log.changes && log.changes.length > 0 ? (
        <Table
          columns={changesColumns}
          dataSource={log.changes}
          pagination={false}
          size="small"
          bordered
          className="changes-table"
          rowKey={(record:any, index) => `${record.field}-${index}`}
        />
      ) : (
        <Empty description="No field-level changes recorded" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <>
          <Divider orientation="left" className="m-4">Metadata</Divider>
          <Card size="small" className="bg-gray-50">
            <pre className="text-[11px] whitespace-pre-wrap">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </Card>
        </>
      )}
    </Drawer>
  );
};

export default LogDetailDrawer;
