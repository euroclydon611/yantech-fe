import {
  Drawer,
  Tag,
  Timeline,
  Card,
  Typography,
  Empty,
  Spin,
  Tooltip,
  Button,
} from "antd";
import { useGetRecordHistoryQuery } from "../../redux/features/audit/auditApi";
import {
  HistoryOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DesktopOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { formatDate4 } from "@/utils/helperFunction";

const { Text } = Typography;

interface RecordHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  modelName: string;
  recordId: string;
  recordName?: string;
}

const RecordHistoryDrawer = ({
  open,
  onClose,
  modelName,
  recordId,
  recordName,
}: RecordHistoryDrawerProps) => {
  const {
    data: historyData,
    isLoading,
    refetch,
  } = useGetRecordHistoryQuery(
    { modelName, recordId },
    { skip: !open || !recordId }
  );

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined />
          <span>Change History: {recordName || recordId}</span>
        </div>
      }
      extra={
        <Tooltip title="Refresh History">
          <Button
            type="text"
            icon={
              <ReloadOutlined className={isLoading ? "animate-spin" : ""} />
            }
            onClick={() => refetch()}
            disabled={isLoading || isLoading}
          />
        </Tooltip>
      }
      open={open}
      onClose={onClose}
      width={1000}
      className="history-drawer"
    >
      <div className="py-2 overflow-y-auto px-1">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" tip="Loading history..." />
          </div>
        ) : !historyData?.data?.length ? (
          <Empty description="No history found for this record" />
        ) : (
          <Timeline
            className="mt-6 ml-2"
            items={(historyData?.data || []).map((item: any) => ({
              children: (
                <div className="flex flex-col gap-1 -mt-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-[12px] text-gray-700">
                      {formatDate4(item.createdAt)}
                    </div>
                  </div>

                  <Card
                    size="small"
                    className="mb-4 border-l-4 border-l-purple-500 shadow-sm overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        <Tag
                          color={
                            item.action === "CREATE"
                              ? "green"
                              : item.action === "DELETE"
                              ? "red"
                              : "blue"
                          }
                          className="text-[10px]"
                        >
                          {item.action}
                        </Tag>
                        {item.locationInfo && (
                          <div className="text-[10px] text-blue-500 font-medium ml-1">
                            <GlobalOutlined className="mr-1 text-[10px]" />
                            {item.locationInfo.city || item.locationInfo.country}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[10px] text-gray-600">
                        <div className="flex items-center gap-1">
                          <UserOutlined />
                          <span>{item.actor?.name || "System"}</span>
                        </div>
                        {item.deviceInfo && (
                          <div className="text-gray-400 text-[9px]">
                            <DesktopOutlined className="mr-1" />
                            {item.deviceInfo.os} / {item.deviceInfo.browser}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2 rounded">
                      {item.changes && item.changes.length > 0 ? (
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="text-left text-gray-500 border-b">
                              <th className="pb-1 w-8">#</th>
                              <th className="pb-1">Field</th>
                              <th className="pb-1">Old Value</th>
                              <th className="pb-1">New Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.changes.map((change: any, idx: number) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-white transition-colors duration-150">
                                <td className="py-1.5 text-gray-400 font-mono">
                                  {idx + 1}
                                </td>
                                <td className="py-1.5 font-medium">
                                  {change.field}
                                </td>
                                <td className="py-1.5 text-red-500 line-through">
                                  {typeof change.oldValue === "object"
                                    ? JSON.stringify(change.oldValue)
                                    : String(change.oldValue ?? "")}
                                </td>
                                <td className="py-1.5 text-green-600 font-bold">
                                  {typeof change.newValue === "object"
                                    ? JSON.stringify(change.newValue)
                                    : String(change.newValue ?? "")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <Text type="secondary" italic className="text-[10px]">
                          No field-level changes recorded
                        </Text>
                      )}
                    </div>
                  </Card>
                </div>
              ),
              dot: <ClockCircleOutlined className="text-purple-500 text-lg" />,
            }))}
          />
        )}
      </div>
    </Drawer>
  );
};

export default RecordHistoryDrawer;
