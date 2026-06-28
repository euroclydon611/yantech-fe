import { useEffect, useState } from "react";
import { Drawer, Form, Input, Select, Button, Switch } from "antd";
import { useCreateLenderMutation } from "../../../redux/features/configurations/lenderApi";
import Swal from "sweetalert2";

interface AddLenderProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddLender = ({ open, onClose, refetch }: AddLenderProps) => {
  const [form] = Form.useForm();
  const [createLender, { isLoading }] = useCreateLenderMutation();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const onFinish = async (values: any) => {
    try {
      await createLender(values).unwrap();
      Swal.fire("Success", "Lender created successfully", "success");
      form.resetFields();
      refetch();
      onClose();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <Drawer
      title="Add New Lender"
      width={400}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Lender Name"
          rules={[{ required: true, message: "Please enter lender name" }]}
        >
          <Input placeholder="e.g. Ecobank, GCB, SSNIT" />
        </Form.Item>

        <Form.Item name="code" label="Lender Code">
          <Input placeholder="e.g. ECOBANK, GCB" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Lender Type"
          initialValue="bank"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="bank">Bank</Select.Option>
            <Select.Option value="scheme">Scheme</Select.Option>
            <Select.Option value="welfare">Welfare</Select.Option>
            <Select.Option value="credit_union">Credit Union</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Optional description..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full bg-[#14532D]"
          >
            Create Lender
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddLender;
