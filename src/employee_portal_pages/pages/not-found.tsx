import { Card, Button, Typography, Space } from "antd";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function NotFound({ backLink = "/employee-portal", backLabel = "Back to Dashboard" }: { backLink?: string; backLabel?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card 
        className="w-full max-w-md shadow-lg rounded-xl border-gray-200"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          
          <Space direction="vertical" size={4}>
            <Title level={2} style={{ margin: 0 }}>404</Title>
            <Title level={4} type="secondary" style={{ margin: 0 }}>Page Not Found</Title>
          </Space>

          <Text className="text-gray-600 block mb-6">
            The page you are looking for doesn't exist or has been moved. 
          </Text>

          <Link to={backLink} className="w-full">
            <Button 
              type="primary" 
              size="large" 
              icon={<Home size={18} />} 
              className="w-full bg-green-700 hover:!bg-green-800 border-none flex items-center justify-center gap-2"
            >
              {backLabel}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
