import React, { useState } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  Divider,
  Tag,
  Checkbox,
  DatePicker,
  TimePicker,
  Input,
  Switch,
} from "antd";
import {
  TeamOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface AssignModalProps {
  isAssignModalOpen: boolean;
  closeAssignModal: () => void;
  currentAssignment: any;
  form: any;
  handleAssign: () => void;
  isLoadingMembers: boolean;
  activeEntityMembers: any;
  isAssigning: boolean;
  getStageInfo: (status: string) => any;
  subDivisions?: any[];
  isLoadingSubDivisions?: boolean;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  isAssignModalOpen,
  closeAssignModal,
  currentAssignment,
  form,
  handleAssign,
  isLoadingMembers,
  activeEntityMembers,
  isAssigning,
  getStageInfo,
  subDivisions = [],
  isLoadingSubDivisions = false,
}) => {
  const [isGroupMode, setIsGroupMode] = useState(false);

  const handleClose = () => {
    setIsGroupMode(false);
    closeAssignModal();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            {isGroupMode ? (
              <ApartmentOutlined className="text-purple-600 text-lg" />
            ) : (
              <TeamOutlined className="text-blue-600 text-lg" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              {isGroupMode ? "Assign to Group" : "Assign Officer"}
            </p>
            <Tag
              color="geekblue"
              icon={<ClockCircleOutlined />}
              className="text-xs"
            >
              {getStageInfo(currentAssignment?.internalStatus).text}
            </Tag>
          </div>
        </div>
      }
      open={isAssignModalOpen}
      onCancel={handleClose}
      maskClosable={false}
      width={600}
      className="professional-modal"
      footer={[
        <Button
          key="back"
          onClick={handleClose}
          icon={<CloseOutlined />}
          className="h-10"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isAssigning}
          onClick={handleAssign}
          icon={<CheckCircleOutlined />}
          className="bg-green-600 hover:!bg-green-700 h-10 font-medium"
        >
          Confirm Assignment
        </Button>,
      ]}
    >
      {currentAssignment && (
        <div className="space-y-6">
          {/* Application Details Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpenOutlined className="text-blue-600" />
              <span className="font-medium text-gray-700">
                Application Details
              </span>
            </div>
            <div className="ml-6">
              <p className="text-gray-800">
                <strong>{currentAssignment.applicationDetails.title}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Code: {currentAssignment.applicationDetails.code}
              </p>
            </div>
          </div>

          {/* Group / Individual Toggle */}
          {subDivisions.length > 0 && (
            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-purple-800">Assign to a Sub-division Group</p>
                <p className="text-xs text-purple-600">
                  The group head will manage the entire workflow for this application
                </p>
              </div>
              <Switch
                checked={isGroupMode}
                onChange={(checked) => {
                  setIsGroupMode(checked);
                  form.setFieldsValue({ assignedTo: undefined, subDivisionId: undefined, copiedEmployees: [] });
                }}
                checkedChildren={<ApartmentOutlined />}
                unCheckedChildren={<UserOutlined />}
                className="bg-purple-400"
              />
            </div>
          )}

          <Divider className="my-4" />

          {/* Assignment Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              assignedTo: "",
              subDivisionId: undefined,
              notes: "",
              deadline: null,
              deadlineTime: null,
              requiresInspection: false,
              requiresAnalysis: false,
              requiresPublicHearing: false,
              copiedEmployees: [],
            }}
            className="space-y-4"
          >
            {isGroupMode ? (
              <Form.Item
                name="subDivisionId"
                label={
                  <div className="flex items-center space-x-2">
                    <ApartmentOutlined className="text-purple-600" />
                    <span className="font-medium">Select Group / Sub-division</span>
                    <span className="text-red-500">*</span>
                  </div>
                }
                rules={[{ required: true, message: "Please select a group." }]}
              >
                <Select
                  showSearch
                  placeholder="Select a sub-division group..."
                  loading={isLoadingSubDivisions}
                  optionFilterProp="children"
                  className="h-10"
                  filterOption={(input, option: any) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {subDivisions.map((div: any) => {
                    const headName = div.head
                      ? `${div.head.firstname} ${div.head.lastname}`
                      : "No head";
                    const label = `${div.name} — Head: ${headName}`;
                    return (
                      <Option key={div._id} value={div._id} label={label}>
                        <div className="flex items-center gap-2">
                          <ApartmentOutlined className="text-purple-400" />
                          <div>
                            <span className="font-medium">{div.name}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              Head: {headName} · {div.members?.length || 0} member(s)
                            </span>
                          </div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="assignedTo"
                  label={
                    <div className="flex items-center space-x-2">
                      <UserOutlined className="text-gray-600" />
                      <span className="font-medium">Assign To</span>
                      <span className="text-red-500">*</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select an officer to assign.",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Search and select an officer from your department..."
                    loading={isLoadingMembers}
                    optionFilterProp="children"
                    className="h-10"
                    suffixIcon={<TeamOutlined className="text-gray-400" />}
                    filterOption={(input, option: any) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="">
                      <span className="text-gray-400">Select an officer...</span>
                    </Option>
                    {activeEntityMembers?.data.map((member: any) => {
                      const label = `${member.staff_id} - ${member.firstname} ${
                        member.lastname
                      } ${member.other_names || ""}`;
                      return (
                        <Option key={member._id} value={member._id} label={label}>
                          <div className="flex items-center space-x-2">
                            <UserOutlined className="text-gray-400" />
                            <span>{label}</span>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="copiedEmployees"
                  label={
                    <div className="flex items-center space-x-2">
                      <TeamOutlined className="text-gray-600" />
                      <span className="font-medium">Copy Employees (CC)</span>
                      <span className="text-gray-400 text-sm">(Optional)</span>
                    </div>
                  }
                >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select employees to copy on this assignment..."
                    loading={isLoadingMembers}
                    optionFilterProp="children"
                    className="min-h-10"
                    suffixIcon={<TeamOutlined className="text-gray-400" />}
                    filterOption={(input, option: any) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {activeEntityMembers?.data.map((member: any) => {
                      const label = `${member.staff_id} - ${member.firstname} ${
                        member.lastname
                      } ${member.other_names || ""}`;
                      return (
                        <Option key={member._id} value={member._id} label={label}>
                          <div className="flex items-center space-x-2">
                            <UserOutlined className="text-gray-400" />
                            <span>{label}</span>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </>
            )}

            {/* Task Requirements Section */}
            {(currentAssignment.internalStatus === "pending_evaluation_assignment") && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircleOutlined className="text-blue-600 text-xs" />
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Specific Requirements</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Form.Item
                    name="requiresInspection"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>
                      <span className="text-sm text-gray-700 font-medium">
                        Requires a physical inspection / Screening
                      </span>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item
                    name="requiresAnalysis"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>
                      <span className="text-sm text-gray-700 font-medium">
                        Requires laboratory analysis
                      </span>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item
                    name="requiresPublicHearing"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>
                      <span className="text-sm text-gray-700 font-medium">
                        Requires public hearing
                      </span>
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="deadline"
                label={
                  <div className="flex items-center space-x-2">
                    <CalendarOutlined className="text-gray-600" />
                    <span className="font-medium">Set Deadline</span>
                    <span className="text-gray-400 text-sm">(Optional)</span>
                  </div>
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  className="h-10"
                  placeholder="Select date"
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                name="deadlineTime"
                label={
                  <div className="flex items-center space-x-2">
                    <ClockCircleOutlined className="text-gray-600" />
                    <span className="font-medium">Time</span>
                  </div>
                }
              >
                <TimePicker
                  style={{ width: "100%" }}
                  className="h-10"
                  format="HH:mm"
                  placeholder="Select time"
                  needConfirm={false}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="notes"
              label={
                <div className="flex items-center space-x-2">
                  <FileTextOutlined className="text-gray-600" />
                  <span className="font-medium">
                    Instructions for {isGroupMode ? "Group" : "Officer"}
                  </span>
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </div>
              }
            >
              <TextArea
                rows={4}
                placeholder={`Add any special instructions, priorities, or notes for the assigned ${isGroupMode ? "group" : "officer"}...`}
                className="resize-none"
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};
