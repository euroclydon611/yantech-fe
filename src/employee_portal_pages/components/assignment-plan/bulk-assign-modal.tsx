import React from "react";
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
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface BulkAssignModalProps {
  isBulkAssignModalOpen: boolean;
  closeBulkAssignModal: () => void;
  selectedIds: Set<string>;
  form: any;
  handleAssignBulk: () => void;
  isLoadingMembers: boolean;
  activeEntityMembers: any;
  isAssigning: boolean;
  getStageInfo: (status: string) => any;
  statusFilter: string;
}

export const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  isBulkAssignModalOpen,
  closeBulkAssignModal,
  selectedIds,
  form,
  handleAssignBulk,
  isLoadingMembers,
  activeEntityMembers,
  isAssigning,
  getStageInfo,
  statusFilter,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <TeamOutlined className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              Assign Officers
            </p>
            <Tag
              color="geekblue"
              icon={<ClockCircleOutlined />}
              className="text-xs"
            >
              {getStageInfo(statusFilter).text}
            </Tag>
          </div>
        </div>
      }
      open={isBulkAssignModalOpen}
      onCancel={closeBulkAssignModal}
      maskClosable={false}
      width={600}
      className="professional-modal"
      footer={[
        <Button
          key="back"
          onClick={closeBulkAssignModal}
          icon={<CloseOutlined />}
          className="h-10"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isAssigning}
          onClick={handleAssignBulk}
          icon={<CheckCircleOutlined />}
          className="bg-green-600 hover:!bg-green-700 h-10 font-medium"
        >
          Confirm Assignment
        </Button>,
      ]}
    >
      {selectedIds.size > 0 && (
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
                <em> Total Applications(s) Selected: </em>{" "}
                <strong>{selectedIds.size}</strong>
              </p>
            </div>
          </div>

          <Divider className="my-4" />

          {/* Assignment Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              assignedToIds: null,
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
            <Form.Item
              name="assignedToIds"
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
                mode="multiple"
                placeholder="Search and select an officer from your department..."
                loading={isLoadingMembers}
                optionFilterProp="children"
                className="m-h-10"
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

            {/* Task Requirements Section */}
            {(statusFilter === "pending_evaluation_assignment") && (
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
                        Requires a physical inspection
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
                    Instructions for Officer
                  </span>
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </div>
              }
            >
              <TextArea
                rows={4}
                placeholder="Add any special instructions, priorities, or notes for the assigned officer..."
                className="resize-none"
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};
