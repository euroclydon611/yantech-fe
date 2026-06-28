import { useState } from "react";
import { Card, Tabs, Button, Typography, Empty, Space } from "antd";
import { Employee } from "../../types/employee";
import { PlusCircle, Edit, Trash2, Calendar } from "lucide-react";

const { Title, Text } = Typography;

interface QualificationsTabProps {
  employee: Employee;
}

export default function QualificationsTab({
  employee,
}: QualificationsTabProps) {
  const [activeTab, setActiveTab] = useState("academic");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const tabItems = [
    {
      key: "academic",
      label: "Academic Qualifications",
      children: (
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0">Academic Qualifications</Title>
            <Button
              size="small"
              icon={<PlusCircle className="w-4 h-4" />}
              hidden
            >
              Add Qualification
            </Button>
          </div>

          {employee.academic_qualifications &&
          employee.academic_qualifications.length > 0 ? (
            employee.academic_qualifications.map((qual) => (
              <div
                key={qual._id}
                className="border rounded-lg p-4 mb-4 bg-gray-50 border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong className="text-gray-900 block">{qual.name}</Text>
                    <Text type="secondary" className="text-sm">{qual.institution}</Text>
                  </div>
                  <Space size={0}>
                    <Button
                      type="text"
                      icon={<Edit size={16} />}
                      className="text-gray-400 hover:text-blue-600"
                    />
                    <Button
                      type="text"
                      icon={<Trash2 size={16} />}
                      className="text-gray-400 hover:text-red-600"
                    />
                  </Space>
                </div>
                <div className="mt-2">
                  <Text type="secondary" className="text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(qual.start_date)} - {formatDate(qual.end_date)}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <Empty description="No academic qualifications added yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
    {
      key: "professional",
      label: "Professional Qualifications",
      children: (
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0">Professional Qualifications</Title>
            <Button
              size="small"
              icon={<PlusCircle className="w-4 h-4" />}
              hidden
            >
              Add Qualification
            </Button>
          </div>

          {employee.professional_qualifications &&
          employee.professional_qualifications.length > 0 ? (
            employee.professional_qualifications.map((qual) => (
              <div
                key={qual._id}
                className="border rounded-lg p-4 mb-4 bg-gray-50 border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong className="text-gray-900 block">{qual.name}</Text>
                    <Text type="secondary" className="text-sm">{qual.institution}</Text>
                  </div>
                  <Space size={0}>
                    <Button
                      type="text"
                      icon={<Edit size={16} />}
                      className="text-gray-400 hover:text-blue-600"
                    />
                    <Button
                      type="text"
                      icon={<Trash2 size={16} />}
                      className="text-gray-400 hover:text-red-600"
                    />
                  </Space>
                </div>
                <div className="mt-2">
                  <Text type="secondary" className="text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(qual.start_date)} - {formatDate(qual.end_date)}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <Empty description="No professional qualifications added yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
    {
      key: "trainings",
      label: "Trainings",
      children: (
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0">Training History</Title>
            <Button
              size="small"
              icon={<PlusCircle className="w-4 h-4" />}
              hidden
            >
              Add Training
            </Button>
          </div>

          {employee.trainings && employee.trainings.length > 0 ? (
            employee.trainings.map((training) => (
              <div
                key={training._id}
                className="border rounded-lg p-4 mb-4 bg-gray-50 border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong className="text-gray-900 block">
                      {training.name}
                    </Text>
                    <Text type="secondary" className="text-sm">{training.body}</Text>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        Certificate: {training.certification}
                      </span>
                      {training.expires && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                          Expires
                        </span>
                      )}
                    </div>
                  </div>
                  <Space size={0}>
                    <Button
                      type="text"
                      icon={<Edit size={16} />}
                      className="text-gray-400 hover:text-blue-600"
                    />
                    <Button
                      type="text"
                      icon={<Trash2 size={16} />}
                      className="text-gray-400 hover:text-red-600"
                    />
                  </Space>
                </div>
                <div className="mt-3">
                  <Text type="secondary" className="text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(training.start_date)} -{" "}
                    {formatDate(training.end_date)}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <Empty description="No training history added yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
    {
      key: "skills",
      label: "Special Skills",
      children: (
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0">Special Skills</Title>
            <Button
              size="small"
              icon={<PlusCircle className="w-4 h-4" />}
              hidden
            >
              Add Skill
            </Button>
          </div>

          {employee.special_skills && employee.special_skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employee.special_skills.map((skill) => (
                <div
                  key={skill._id}
                  className="border rounded-lg p-4 bg-gray-50 border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong className="text-gray-900 block">
                        {skill.name}
                      </Text>
                      <Text type="secondary" className="text-sm">
                        Proficiency: {skill.proficiency_level}
                      </Text>
                    </div>
                    <Space size={0}>
                      <Button
                        type="text"
                        icon={<Edit size={16} />}
                        className="text-gray-400 hover:text-blue-600"
                      />
                      <Button
                        type="text"
                        icon={<Trash2 size={16} />}
                        className="text-gray-400 hover:text-red-600"
                      />
                    </Space>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No special skills added yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
  ];

  return (
    <Card 
      className="border border-gray-200 shadow-sm"
      styles={{ body: { padding: '0 24px 24px 24px' } }}
    >
      <Tabs
        defaultActiveKey="academic"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Card>
  );
}
