import { useState, useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  useYelTaxConfigListQuery,
  useYelTaxConfigCreateMutation,
  useYelTaxConfigUpdateMutation,
  useYelTaxConfigToggleMutation,
  useYelTaxConfigDeleteMutation,
  useYelTaxConfigSeedMutation,
} from "../../redux/features/yel/yelApi";
import { Table, Modal, Form, Input, InputNumber, Select, Switch, Tag, Tooltip } from "antd";
import { FaEdit, FaTrash, FaSeedling, FaPlus } from "react-icons/fa";
import { MdOutlineToggleOn, MdOutlineToggleOff } from "react-icons/md";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const { Option } = Select;

const CATEGORY_COLORS: Record<string, string> = {
  levy: "orange",
  vat: "blue",
  withholding: "purple",
};

const BASE_LABELS: Record<string, string> = {
  subtotal: "On Subtotal",
  cumulative: "On Cumulative (cascaded)",
};

const YELTaxConfig = () => {
  PageTitle("Tax Configuration | YANTEC ERP");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form] = Form.useForm();

  const { data, refetch, isLoading } = useYelTaxConfigListQuery();
  const [createConfig, { isLoading: creating }] = useYelTaxConfigCreateMutation();
  const [updateConfig, { isLoading: updating }] = useYelTaxConfigUpdateMutation();
  const [toggleConfig] = useYelTaxConfigToggleMutation();
  const [deleteConfig] = useYelTaxConfigDeleteMutation();
  const [seedDefaults, { isLoading: seeding }] = useYelTaxConfigSeedMutation();

  const configs: any[] = data?.data ?? [];

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, base: "subtotal", category: "levy", order: configs.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditTarget(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editTarget) {
        await updateConfig({ id: editTarget._id, body: values }).unwrap();
        toast.success("Tax config updated");
      } else {
        await createConfig(values).unwrap();
        toast.success("Tax config created");
      }
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.message || "Failed");
    }
  };

  const handleToggle = async (record: any) => {
    try {
      await toggleConfig(record._id).unwrap();
      toast.success(`${record.name} ${record.isActive ? "disabled" : "enabled"}`);
      refetch();
    } catch { toast.error("Failed to toggle"); }
  };

  const handleDelete = async (record: any) => {
    const res = await Swal.fire({
      title: `Delete ${record.name}?`,
      text: "This will remove the levy from future calculations.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;
    try {
      await deleteConfig(record._id).unwrap();
      toast.success("Deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  const handleSeed = async () => {
    const res = await Swal.fire({
      title: "Seed GRA Defaults?",
      text: "This will add NHIL, GETFL, COVID-19 Levy, and VAT if they don't already exist.",
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#0A1628", confirmButtonText: "Seed",
    });
    if (!res.isConfirmed) return;
    try {
      const result = await seedDefaults().unwrap();
      toast.success(result.message);
      refetch();
    } catch { toast.error("Seeding failed"); }
  };

  const subtotal = 1000;
  const preview = configs
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order)
    .reduce(
      (acc: any, c: any) => {
        const base = c.base === "cumulative" ? acc.cumulative : subtotal;
        const amount = parseFloat(((base * c.rate) / 100).toFixed(2));
        acc.rows.push({ ...c, computedBase: base, amount });
        acc.cumulative = parseFloat((acc.cumulative + amount).toFixed(2));
        acc.total = parseFloat((acc.total + amount).toFixed(2));
        return acc;
      },
      { rows: [], cumulative: subtotal, total: 0 },
    );

  const columns = [
    {
      title: "Order", dataIndex: "order", key: "order", width: 60,
      render: (v: number) => <span className="font-bold text-gray-500">{v}</span>,
    },
    {
      title: "Name", dataIndex: "name", key: "name",
      render: (v: string, r: any) => (
        <div>
          <p className="font-bold text-xs" style={{ color: "#0A1628" }}>{v}</p>
          <p className="text-[10px] text-gray-400">{r.description}</p>
        </div>
      ),
    },
    { title: "Code", dataIndex: "code", key: "code", render: (v: string) => <Tag>{v}</Tag> },
    { title: "Rate", dataIndex: "rate", key: "rate", render: (v: number) => <span className="font-bold">{v}%</span> },
    {
      title: "Base", dataIndex: "base", key: "base",
      render: (v: string) => <span className="text-xs text-gray-500">{BASE_LABELS[v] ?? v}</span>,
    },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (v: string) => <Tag color={CATEGORY_COLORS[v] ?? "default"}>{v?.toUpperCase()}</Tag>,
    },
    {
      title: "Legal Ref", dataIndex: "legalReference", key: "legalReference",
      render: (v: string) => <span className="text-[10px] text-gray-400 italic">{v || "—"}</span>,
    },
    {
      title: "Active", dataIndex: "isActive", key: "isActive",
      render: (v: boolean, r: any) => (
        <Tooltip title={v ? "Click to disable" : "Click to enable"}>
          <button onClick={() => handleToggle(r)} className={v ? "text-green-500" : "text-gray-400"}>
            {v ? <MdOutlineToggleOn size={26} /> : <MdOutlineToggleOff size={26} />}
          </button>
        </Tooltip>
      ),
    },
    {
      title: "Actions", key: "actions",
      render: (_: any, r: any) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit">
            <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><FaEdit size={13} /></button>
          </Tooltip>
          <Tooltip title="Delete">
            <button onClick={() => handleDelete(r)} className="text-red-400 hover:text-red-600"><FaTrash size={12} /></button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "#0A1628" }}>Tax Configuration</h1>
          <p className="text-xs text-gray-400">Manage GRA levies and VAT applied to quotations & invoices</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border"
            style={{ borderColor: "#F5A623", color: "#F5A623" }}
          >
            <FaSeedling size={13} /> Seed GRA Defaults
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #0A1628, #1A3A6B)" }}
          >
            <FaPlus size={13} /> Add Levy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Table
            dataSource={configs} columns={columns} rowKey="_id"
            loading={isLoading} pagination={false} size="small" className="text-xs"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Live Preview — GHS 1,000 Subtotal
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">1,000.00</span>
            </div>
            {preview.rows.map((r: any) => (
              <div key={r.code} className="flex justify-between py-1.5 border-b border-gray-100">
                <div>
                  <span className={r.isActive ? "font-medium" : "text-gray-300 line-through"}>{r.name}</span>
                  <span className="ml-1 text-gray-400">({r.rate}%{r.base === "cumulative" ? " ↗" : ""})</span>
                </div>
                <span className={r.isActive ? "font-semibold" : "text-gray-300"}>{r.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 rounded-lg px-2 font-bold text-sm" style={{ background: "#0A1628", color: "#fff" }}>
              <span>TOTAL</span>
              <span>{(subtotal + preview.total).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400 italic mt-1">
              ↗ = applied on subtotal + all preceding levies (cascaded)
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={520} destroyOnClose
        title={<span className="font-bold text-sm">{editTarget ? "Edit Tax Levy" : "Add Tax Levy"}</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2">
          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. NHIL" />
            </Form.Item>
            <Form.Item label="Code" name="code" rules={[{ required: true }]}>
              <Input placeholder="e.g. NHIL" disabled={!!editTarget} className="uppercase" />
            </Form.Item>
            <Form.Item label="Rate (%)" name="rate" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} step={0.5} className="w-full" addonAfter="%" />
            </Form.Item>
            <Form.Item label="Order" name="order" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item label="Base Calculation" name="base" rules={[{ required: true }]}>
              <Select>
                <Option value="subtotal">On Subtotal</Option>
                <Option value="cumulative">On Cumulative (cascaded)</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
              <Select>
                <Option value="levy">Levy</Option>
                <Option value="vat">VAT</Option>
                <Option value="withholding">Withholding Tax</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Description" name="description">
            <Input placeholder="e.g. National Health Insurance Levy" />
          </Form.Item>
          <Form.Item label="Legal Reference" name="legalReference">
            <Input placeholder="e.g. NHIL Act, 2012 (Act 852)" />
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-1.5 rounded border border-gray-200 text-xs">Cancel</button>
            <button
              type="submit"
              disabled={creating || updating}
              className="px-4 py-1.5 rounded text-white text-xs font-bold"
              style={{ background: "#0A1628" }}
            >
              {editTarget ? "Update" : "Create"}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default YELTaxConfig;
