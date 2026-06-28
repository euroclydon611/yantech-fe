import { useState } from "react";
import {
  Table,
  Button,
  Card,
  Tag,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  useFetchBaseFeesQuery,
  useUpdateBaseFeeMutation,
} from "@/redux/features/employee-portal-api/application/fees-config";
import { formatNumber } from "@/utils/helperFunction";
import { showSuccess, showError, showConfirm } from "@/lib/alert";

const PermitProcessingFeesConfigs = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: configResponse, isLoading, refetch } =
    useFetchBaseFeesQuery({ type: "permit" });
  const [updateBaseFee, { isLoading: isUpdating }] =
    useUpdateBaseFeeMutation();

  const processingFees = configResponse?.data?.processing_fees || [];

  const handleEditOpen = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({ amount: item.amount });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    const confirmed = await showConfirm({
      title: "Update Configuration?",
      message: `Are you sure you want to update the processing fee for <strong>${editingItem.name}</strong>? This action cannot be undone.`,
      confirmText: "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      const payload = {
        applicationType: "permit",
        processing_fees_id: editingItem._id,
        processing_fees: { amount: values.amount },
      };

      await updateBaseFee({ payload }).unwrap();
      showSuccess("Processing fee updated successfully!");
      setEditModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update configuration");
    }
  };

  const columns = [
    {
      title: "Application Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag color="blue">{code.toUpperCase()}</Tag>,
    },
    {
      title: "Amount (GHS)",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (amount: number) => <strong>{formatNumber(amount)}</strong>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Tooltip title="Edit Amount">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditOpen(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <span className="text-sm font-bold text-gray-700">
            1. Processing Fees
          </span>
        }
        className="shadow-sm border-slate-200"
      >
        <Table
          columns={columns}
          dataSource={processingFees}
          pagination={false}
          loading={isLoading}
          rowKey="_id"
          size="small"
        />
      </Card>

      <Modal
        title="Edit Processing Fee"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-6"
        >
          <Form.Item label="Application Type">
            <Input value={editingItem?.name} disabled className="bg-gray-50" />
          </Form.Item>

          <Form.Item
            label="Amount (GHS)"
            name="amount"
            rules={[{ required: true, message: "Amount is required" }]}
          >
            <InputNumber min={0} step={0.01} precision={2} className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="!bg-green-700"
              >
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PermitProcessingFeesConfigs;
