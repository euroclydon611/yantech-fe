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
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useFetchBaseFeesQuery,
  useUpdateBaseFeeMutation,
  useAddItemToBaseFeeMutation,
  useRemoveItemFromBaseFeeMutation,
} from "@/redux/features/employee-portal-api/application/fees-config";
import { showSuccess, showError, showConfirm } from "@/lib/alert";

const PermitVolumeMultiplierConfigs = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const { data: configResponse, isLoading, refetch } =
    useFetchBaseFeesQuery({ type: "permit" });
  const [updateBaseFee, { isLoading: isUpdating }] =
    useUpdateBaseFeeMutation();
  const [addItem, { isLoading: isAdding }] = useAddItemToBaseFeeMutation();
  const [removeItem] = useRemoveItemFromBaseFeeMutation();

  const volumeMultipliers = configResponse?.data?.volume_multipliers || [];

  const handleEditOpen = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      description: item.description,
      min_volume: item.min_volume,
      max_volume: item.max_volume,
      multiplier: item.multiplier,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    const confirmed = await showConfirm({
      title: "Update Configuration?",
      message: `Are you sure you want to update the volume multiplier for <strong>${editingItem.description}</strong>? This action cannot be undone.`,
      confirmText: "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      const payload = {
        applicationType: "permit",
        volume_multipliers_id: editingItem._id,
        volume_multipliers: values,
      };

      await updateBaseFee({ payload }).unwrap();
      showSuccess("Volume multiplier updated successfully!");
      setEditModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update configuration");
    }
  };

  const handleAddSubmit = async (values: any) => {
    try {
      const payload = {
        applicationType: "permit",
        arrayName: "volume_multipliers",
        itemData: values,
      };

      await addItem({ payload }).unwrap();
      showSuccess("Volume multiplier added successfully!");
      setAddModalOpen(false);
      addForm.resetFields();
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to add configuration");
    }
  };

  const handleDelete = async (item: any) => {
    const confirmed = await showConfirm({
      title: "Delete Configuration?",
      message: `Are you sure you want to delete <strong>${item.description}</strong>? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!confirmed) return;

    try {
      const payload = {
        applicationType: "permit",
        arrayName: "volume_multipliers",
        itemId: item._id,
      };

      await removeItem({ payload }).unwrap();
      showSuccess("Volume multiplier removed successfully!");
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to remove configuration");
    }
  };

  const columns = [
    {
      title: "Volume Range",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Min Volume",
      dataIndex: "min_volume",
      key: "min_volume",
      align: "right" as const,
    },
    {
      title: "Max Volume",
      dataIndex: "max_volume",
      key: "max_volume",
      align: "right" as const,
      render: (max: number | null) => (max === null ? "and above" : max),
    },
    {
      title: "Multiplier",
      dataIndex: "multiplier",
      key: "multiplier",
      align: "center" as const,
      render: (m: number) => <Tag color="purple">{m}x</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit Multiplier">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditOpen(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <span className="text-sm font-bold text-gray-700">
            2. Volume-Based Multipliers
          </span>
        }
        extra={
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
            className="!bg-green-700"
          >
            Add Line
          </Button>
        }
        className="shadow-sm border-slate-200"
      >
        <Table
          columns={columns}
          dataSource={volumeMultipliers}
          pagination={false}
          loading={isLoading}
          rowKey="_id"
          size="small"
        />
      </Card>

      {/* Add Modal */}
      <Modal
        title="Add Volume Multiplier"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={null}
        width={450}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
          className="mt-6"
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input placeholder="e.g. 0 – 1,000 kg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Min Volume"
              name="min_volume"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="Max Volume (null for 'and above')" name="max_volume">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            label="Multiplier"
            name="multiplier"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber min={0} step={0.1} precision={1} className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isAdding}
                className="!bg-green-700"
              >
                Add
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Volume Multiplier"
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
          <Form.Item
            label="Volume Range"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input placeholder="e.g. 0 – 1,000 kg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Min Volume"
              name="min_volume"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="Max Volume" name="max_volume">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            label="Multiplier"
            name="multiplier"
            rules={[{ required: true, message: "Multiplier is required" }]}
          >
            <InputNumber min={0} step={0.1} precision={1} className="w-full" />
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

export default PermitVolumeMultiplierConfigs;
