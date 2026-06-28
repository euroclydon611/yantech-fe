import { Card, Typography } from "antd";
import { Employee } from "../../types/employee";

const { Text } = Typography;

interface ProfileImagesProps {
  employee: Employee;
}

export default function ProfileImages({ employee }: ProfileImagesProps) {


  return (
    <Card 
      className="border border-gray-200 shadow-sm"
      title={<span className="text-lg font-semibold text-gray-900">Profile Images</span>}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Passport Image */}
        <div className="flex flex-col items-center">
          <Text type="secondary" className="mb-3 block text-sm font-medium">Passport Image</Text>
          <div className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {employee?.passport_image_url ? (
              <img 
                src={employee?.passport_image_url} 
                alt="Passport" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-xs text-center p-2">No passport image uploaded</div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          <Text type="secondary" className="mb-3 block text-sm font-medium">Digital Signature</Text>
          <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {employee?.signature_url ? (
              <img 
                src={employee?.signature_url} 
                alt="Signature" 
                className="max-w-full max-h-full object-contain p-4"
              />
            ) : (
              <div className="text-gray-400 text-xs text-center p-2">No signature uploaded</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
