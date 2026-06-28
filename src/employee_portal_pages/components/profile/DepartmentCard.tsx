import { Card, Tag } from "antd";
import { Employee } from "../../types/employee";
import { User } from "lucide-react";

interface DepartmentCardProps {
  employee: Employee;
}

export default function DepartmentCard({ employee }: DepartmentCardProps) {
  return (
    <Card 
      className="border border-gray-200 shadow-sm"
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 m-0">
            Management Unit Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your organizational unit details
          </p>
        </div>
        {employee.is_head && (
          <Tag color="success" className="px-3 py-1 flex items-center rounded-full m-0 border-none font-medium">
            <User size={14} className="mr-1" />
            Head
          </Tag>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <span className="text-sm text-gray-500">Entity</span>
          <span className="text-sm font-medium text-gray-900">
            {employee.entity?.name || "Not assigned"}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <span className="text-sm text-gray-500">Designation</span>
          <span className="text-sm font-medium text-gray-900">
            {employee.entity?.designation || "Not assigned"}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <span className="text-sm text-gray-500">Reporting To</span>
          <span className="text-sm font-medium text-gray-900">
            {employee.entity?.reporting_entity_name || "Not assigned"}
          </span>
        </div>
        {employee.entity?.officeLocation && (() => {
          const colorMap: Record<string, string> = {
            headquarters: "purple",
            region: "blue",
            district: "orange",
            area: "green",
          };
          const labelMap: Record<string, string> = {
            headquarters: "Head Quarters",
            region: "Region",
            district: "District",
            area: "Area",
          };
          const loc = employee.entity.officeLocation;
          return (
            <div className="flex justify-between pb-3">
              <span className="text-sm text-gray-500">Location Type</span>
              <Tag color={colorMap[loc] || "default"} className="m-0">
                {labelMap[loc] || loc}
              </Tag>
            </div>
          );
        })()}
      </div>
    </Card>
  );
}
