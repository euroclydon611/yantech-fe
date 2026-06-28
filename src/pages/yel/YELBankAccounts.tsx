import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  useYelBankAccountListQuery,
  useYelBankAccountCreateMutation,
  useYelBankAccountUpdateMutation,
  useYelBankAccountToggleMutation,
  useYelBankAccountDeleteMutation,
} from "../../redux/features/yel/yelApi";
import { Table, Button, Modal, Form, Input, Select, Tag, Tooltip, Switch } from "antd";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const { Option } = Select;

const CURRENCY_COLORS: Record<string, string> = {
  GHS: "green",
  USD: "blue",
  EUR: "purple",
  GBP: "gold",
};

export default function YELBankAccounts() {
  PageTitle("Bank Accounts – YANTEC");

  const { data, isLoading, refetch } = useYelBankAccountListQuery();
  const [createAccount] = useYelBankAccountCreateMutation();
  const [updateAccount] = useYelBankAccountUpdateMutation();
  const [toggleAccount] = useYelBankAccountToggleMutation();
  const [deleteAccount] = useYelBankAccountDeleteMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const accounts: any[] = data?.data ?? [];

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ currency: "GHS", sortOrder: accounts.length });
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditingId(record._id);
    form.setFieldsValue({
      bankName:      record.bankName,
      branch:        record.branch,
      accountName:   record.accountName,
      accountNumber: record.accountNumber,
      currency:      record.currency,
      swiftCode:     record.swiftCode ?? "",
      sortOrder:     record.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        const res = await updateAccount({ id: editingId, body: values }).unwrap();
        toast.success(res.message ?? "Bank account updated");
      } else {
        const res = await createAccount(values).unwrap();
        toast.success(res.message ?? "Bank account added");
      }
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      if (err?.data?.message) toast.error(err.data.message);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const res = await toggleAccount(id).unwrap();
      toast.success(res.message ?? (current ? "Deactivated" : "Activated"));
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to toggle");
    }
  };

  const handleDelete = async (id: string, bankName: string) => {
    const result = await Swal.fire({
      title: "Delete bank account?",
      text: `Remove "${bankName}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await deleteAccount(id).unwrap();
      toast.success(res.message ?? "Deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete");
    }
  };

  const columns = [
    { title: "#", dataIndex: "sortOrder", key: "sortOrder", width: 50, render: (_: any, __: any, i: number) => i + 1 },
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      render: (v: string) => <span className="font-semibold">{v}</span>,
    },
    { title: "Branch", dataIndex: "branch", key: "branch" },
    { title: "Account Name", dataIndex: "accountName", key: "accountName" },
    {
      title: "Account No.",
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (v: string) => <span className="font-mono text-sm">{v}</span>,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (v: string) => <Tag color={CURRENCY_COLORS[v] ?? "default"}>{v}</Tag>,
    },
    { title: "Swift / IBAN", dataIndex: "swiftCode", key: "swiftCode", render: (v: string) => v || "—" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (v: boolean, record: any) => (
        <Switch
          checked={v}
          size="small"
          onChange={() => handleToggle(record._id, v)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Tooltip title="Edit">
            <button
              onClick={() => openEdit(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit size={15} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDelete(record._id, record.bankName)}
              className="text-red-500 hover:text-red-700"
            >
              <AiFillDelete size={15} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bank Accounts</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage YANTEC bank accounts — include on quotations &amp; invoices when downloading PDFs
          </p>
        </div>
        <Button
          type="primary"
          icon={<LiaPlusSquareSolid size={16} />}
          onClick={openCreate}
          style={{ background: "#0A1628", borderColor: "#0A1628" }}
        >
          Add Bank Account
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table
          dataSource={accounts}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
          size="middle"
          locale={{ emptyText: "No bank accounts added yet. Click 'Add Bank Account' to get started." }}
        />
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal
        title={editingId ? "Edit Bank Account" : "Add Bank Account"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editingId ? "Update" : "Add"}
        okButtonProps={{ style: { background: "#0A1628", borderColor: "#0A1628" } }}
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: "Bank name is required" }]}
            >
              <Input placeholder="e.g. GCB, Zenith, Ecobank" />
            </Form.Item>

            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: "Branch is required" }]}
            >
              <Input placeholder="e.g. Takoradi Main" />
            </Form.Item>

            <Form.Item
              label="Account Name"
              name="accountName"
              className="col-span-2"
              rules={[{ required: true, message: "Account name is required" }]}
            >
              <Input placeholder="e.g. YANTEC ENGINEERING LIMITED" />
            </Form.Item>

            <Form.Item
              label="Account Number"
              name="accountNumber"
              rules={[{ required: true, message: "Account number is required" }]}
            >
              <Input placeholder="e.g. 1234567890" />
            </Form.Item>

            <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
              <Select>
                <Option value="GHS">GHS — Ghana Cedi</Option>
                <Option value="USD">USD — US Dollar</Option>
                <Option value="EUR">EUR — Euro</Option>
                <Option value="GBP">GBP — British Pound</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Swift / IBAN (optional)" name="swiftCode">
              <Input placeholder="e.g. GHCBGHAC" />
            </Form.Item>

            <Form.Item label="Sort Order" name="sortOrder">
              <Input type="number" min={0} placeholder="0" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
