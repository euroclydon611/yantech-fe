import { useEffect } from "react";
import { Drawer, Form, Input, Select, Button, Switch } from "antd";
import { useUpdateLenderMutation } from "../../../redux/features/configurations/lenderApi";
import Swal from "sweetalert2";

interface EditLenderProps {
  open: boolean;
  onClose: () => void;
  itemData: any;
  refetch: () => void;
}

const EditLender = ({ open, onClose, itemData, refetch }: EditLenderProps) => {
  const [form] = Form.useForm();
  const [updateLender, { isLoading }] = useUpdateLenderMutation();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  useEffect(() => {
    if (itemData) {
      form.setFieldsValue({
        name: itemData.name,
        code: itemData.code,
        type: itemData.type,
        description: itemData.description,
        is_active: itemData.is_active,
      });
    }
  }, [itemData, form]);

  const onFinish = async (values: any) => {
    try {
      await updateLender({ id: itemData._id, data: values }).unwrap();
      Swal.fire("Success", "Lender updated successfully", "success");
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
      title="Edit Lender"
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

        <Form.Item name="is_active" label="Active Status" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full bg-[#14532D]"
          >
            Update Lender
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditLender;
