import { useState } from "react";
import { Modal, Form, Select, Input, Button, message } from "antd";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useRequestDelegationMutation } from "@/redux/features/employee-portal-api/application/assignment";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;

const TASK_TYPES = [
  "Inspection",
  "Field Survey",
  "Laboratory Analysis",
  "Environmental Assessment",
  "Site Visit",
  "Technical Review",
  "Public Consultation",
  "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

const RequestDelegationModal = ({ open, onClose, assignment, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [requestDelegation, { isLoading }] = useRequestDelegationMutation();

  const { data: entitiesData } = useEntityFullListQuery({ designation: "" });
  const entities = (entitiesData?.data || []).filter(
    (e: any) => e._id !== assignment?.assigningEntity?._id && e._id !== assignment?.assigningEntity
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await requestDelegation({
        assignmentId: assignment._id,
        toEntityId: values.toEntityId,
        taskType: values.taskType === "Other" ? values.customTaskType : values.taskType,
        description: values.description,
      }).unwrap();

      message.success("Task delegated successfully");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err: any) {
      Swal.fire({
        title: "Failed",
        text: err?.data?.error || "An error occurred",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const [taskType, setTaskType] = useState("");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-800">Request External Task</span>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          className="!bg-green-700 !border-green-700 hover:!bg-green-800"
        >
          Delegate Task
        </Button>,
      ]}
      width={520}
    >
      <div className="text-xs text-gray-500 mb-4 bg-blue-50 border border-blue-200 rounded p-2">
        The application stays with your office. The selected office will handle this specific task and report back.
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="toEntityId"
          label="Delegate To (Office/Entity)"
          rules={[{ required: true, message: "Please select an entity" }]}
        >
          <Select
            showSearch
            placeholder="Select the office to delegate to"
            optionFilterProp="children"
            className="w-full"
          >
            {entities.map((e: any) => (
              <Option key={e._id} value={e._id}>
                {e.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="taskType"
          label="Task Type"
          rules={[{ required: true, message: "Please select a task type" }]}
        >
          <Select
            placeholder="Select task type"
            onChange={(val) => setTaskType(val)}
          >
            {TASK_TYPES.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {taskType === "Other" && (
          <Form.Item
            name="customTaskType"
            label="Custom Task Type"
            rules={[{ required: true, message: "Please specify the task type" }]}
          >
            <Input placeholder="Describe the task type" />
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Task Description"
          rules={[{ required: true, message: "Please describe what needs to be done" }]}
        >
          <TextArea
            rows={4}
            placeholder="Describe what the other office needs to do, what deliverables are expected, any relevant details..."
            showCount
            maxLength={500}
          />
        </Form.Item>


      </Form>
    </Modal>
  );
};

export default RequestDelegationModal;
