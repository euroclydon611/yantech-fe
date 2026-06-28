import React from "react";
import { List, Card, Button, Alert, Typography } from "antd";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";
import { formatLabel, normalizeText } from "@/utils/helperFunction";

const { Text } = Typography;

interface SupportingDocumentsGridProps {
  attachments?: any[];
  onDocumentView: (attachment: any) => void;
}

export const SupportingDocumentsGrid: React.FC<SupportingDocumentsGridProps> = ({
  attachments,
  onDocumentView,
}) => {
  if (!attachments || attachments.length === 0) {
    return (
      <Alert
        message="No Documents Attached"
        type="info"
        showIcon
        style={{ textAlign: "center", marginTop: 16 }}
      />
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-2">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={attachments}
        renderItem={(attachment: any) => (
          <List.Item key={attachment._id}>
            <Card
              size="small"
              className="h-full hover:shadow-md transition-shadow bg-white border border-gray-200 !p-3"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <FileOutlined className="text-red-600" />
                  <Text
                    strong
                    className="text-gray-800 text-[10px] uppercase"
                  >
                    {formatLabel(normalizeText(attachment.label))}
                  </Text>
                </div>
                <Text
                  className="text-gray-600 text-xs"
                  ellipsis={{ tooltip: attachment.originalname }}
                >
                  {attachment.originalname}
                </Text>
                <Button
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => onDocumentView(attachment)}
                  className="text-red-600 hover:text-red-800 p-0 h-auto font-medium text-xs"
                >
                  View Document
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
