import { Drawer, Timeline, Typography, Tag, Empty } from "antd";
import { ArrowRightOutlined, HistoryOutlined } from "@ant-design/icons";
import { formatDate4 } from "@/utils/helperFunction";

const { Text } = Typography;

export interface TransferRecord {
  fromEntity: any;
  toEntity: any;
  transferredBy: any;
  reason: string;
  transferredAt: string;
}

interface TransferHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: TransferRecord[];
  applicationCode?: string;
}

export default function TransferHistoryDrawer({
  open,
  onClose,
  history,
  applicationCode,
}: TransferHistoryDrawerProps) {
  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-blue-600" />
          <span>Transfer History {applicationCode ? `- ${applicationCode}` : ""}</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={550}
      className="transfer-history-drawer"
    >
      {!history || history.length === 0 ? (
        <Empty description="No transfer history found" />
      ) : (
        <Timeline
          className="mt-4"
          items={history.map((item, index) => ({
            color: 'blue',
            children: (
              <div className="mb-8">
                <div className="flex justify-between items-start mb-3">
                  <Text type="secondary" className="text-xs font-medium uppercase tracking-wider">
                    {formatDate4(item.transferredAt)}
                  </Text>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex flex-col flex-1">
                    <Text type="secondary" className="text-[10px] uppercase font-bold mb-1">From</Text>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2">
                      <Text className="font-semibold text-gray-700">
                        {typeof item.fromEntity === 'object' ? item.fromEntity?.name : 'Source'}
                      </Text>
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <ArrowRightOutlined className="text-gray-400" />
                  </div>

                  <div className="flex flex-col flex-1">
                    <Text type="secondary" className="text-[10px] uppercase font-bold mb-1">To</Text>
                    <div className="bg-blue-50 border border-blue-100 rounded px-3 py-2">
                      <Text className="font-semibold text-blue-700">
                        {typeof item.toEntity === 'object' ? item.toEntity?.name : 'Destination'}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                  
                  <div className="mb-3">
                    <Text type="secondary" className="text-[10px] uppercase font-bold block mb-1">Reason for Transfer</Text>
                    <Text className="text-sm text-gray-800 leading-relaxed italic">
                      "{item.reason}"
                    </Text>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-50">
                    <Text type="secondary" className="text-[10px] uppercase font-bold block mb-1">Transferred By</Text>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {typeof item.transferredBy === 'object' ? (item.transferredBy?.firstname?.[0] || '') + (item.transferredBy?.lastname?.[0] || '') : 'S'}
                      </div>
                      <Text className="text-sm font-medium">
                        {typeof item.transferredBy === 'object' 
                          ? `${item.transferredBy?.firstname || ''} ${item.transferredBy?.lastname || ''}`
                          : 'Staff Member'}
                      </Text>
                      {typeof item.transferredBy === 'object' && item.transferredBy?.staff_id && (
                        <Tag className="m-0 text-[10px] border-none bg-gray-100 text-gray-500">
                          {item.transferredBy.staff_id}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          }))}
        />
      )}
    </Drawer>
  );
}
