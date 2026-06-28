import { useState, useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  useYelQuotationListMutation,
  useYelQuotationCreateMutation,
  useYelQuotationUpdateMutation,
  useYelQuotationStatusMutation,
  useYelQuotationConvertMutation,
  useYelQuotationDeleteMutation,
  useYelClientAllQuery,
  useYelTaxConfigListQuery,
  useYelTaxConfigPreviewMutation,
} from "../../redux/features/yel/yelApi";
import {
  Table, Input, Button, Modal, Form, Select, Pagination,
  Tag, DatePicker, InputNumber, Divider, Tooltip, Checkbox, Radio,
} from "antd";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaFileInvoiceDollar, FaFilePdf } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineMoreVert } from "react-icons/md";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Option } = Select;

const executePdfDownload = async (type: string, id: string, filename: string, includeBankDetails = false) => {
  const params = includeBankDetails ? "?includeBankDetails=true" : "";
  const url = `${import.meta.env.VITE_PUBLIC_SERVER_URI}yel/${type}/pdf/${id}${params}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) { toast.error("Failed to generate PDF"); return; }
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

const STATUS_COLORS: Record<string, string> = {
  draft: "default",
  sent: "blue",
  accepted: "green",
  rejected: "red",
  expired: "orange",
  converted: "purple",
};

const emptyItem = () => ({ description: "", quantity: 1, unitPrice: 0, total: 0 });
const emptyBoqItem = () => ({ description: "", quantity: 1, unit: "No", supplyUnitRate: 0, supplyTotal: 0, installUnitRate: 0, installTotal: 0, total: 0, isSection: false });

const LineItemsEditor = ({ value = [], onChange }: any) => {
  const items: any[] = value;

  const update = (idx: number, field: string, val: any) => {
    const next = items.map((it, i) => {
      if (i !== idx) return it;
      const updated = { ...it, [field]: val };
      if (field === "quantity" || field === "unitPrice") {
        updated.total = parseFloat(((updated.quantity || 0) * (updated.unitPrice || 0)).toFixed(2));
      }
      return updated;
    });
    onChange?.(next);
  };

  const addRow = () => onChange?.([...items, emptyItem()]);
  const removeRow = (idx: number) => onChange?.(items.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="grid grid-cols-[2fr_80px_100px_100px_32px] gap-1 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <span>Description</span><span>Qty</span><span>Unit Price</span><span>Total</span><span />
      </div>
      {items.map((it, idx) => (
        <div key={idx} className="grid grid-cols-[2fr_80px_100px_100px_32px] gap-1 mb-1">
          <Input size="small" value={it.description} onChange={(e) => update(idx, "description", e.target.value)} placeholder="Item description" />
          <InputNumber size="small" min={1} value={it.quantity} onChange={(v) => update(idx, "quantity", v)} className="w-full" />
          <InputNumber size="small" min={0} value={it.unitPrice} onChange={(v) => update(idx, "unitPrice", v)} className="w-full" />
          <InputNumber size="small" value={it.total} readOnly className="w-full !bg-gray-50" />
          <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 flex items-center justify-center">✕</button>
        </div>
      ))}
      <Button size="small" onClick={addRow} type="dashed" className="mt-1 w-full text-xs">+ Add Line Item</Button>
    </div>
  );
};

const BoQLineItemsEditor = ({ value = [], onChange }: any) => {
  const items: any[] = value;

  const update = (idx: number, field: string, val: any) => {
    const next = items.map((it, i) => {
      if (i !== idx) return it;
      const updated = { ...it, [field]: val };
      if (["quantity", "supplyUnitRate", "installUnitRate"].includes(field)) {
        const qty = updated.quantity || 0;
        updated.supplyTotal = parseFloat(((qty) * (updated.supplyUnitRate || 0)).toFixed(2));
        updated.installTotal = parseFloat(((qty) * (updated.installUnitRate || 0)).toFixed(2));
        updated.total = parseFloat((updated.supplyTotal + updated.installTotal).toFixed(2));
      }
      return updated;
    });
    onChange?.(next);
  };

  const addRow = () => onChange?.([...items, emptyBoqItem()]);
  const addSection = () => onChange?.([...items, { description: "", isSection: true, quantity: 0, total: 0 }]);
  const removeRow = (idx: number) => onChange?.(items.filter((_, i) => i !== idx));

  return (
    <div className="text-xs">
      <div className="grid grid-cols-[2.5fr_50px_60px_80px_80px_80px_80px_80px_28px] gap-1 mb-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-amber-50 rounded px-1 py-1.5 border border-amber-200">
        <span>Description</span><span>Qty</span><span>Unit</span>
        <span className="text-center">Sup.Unit</span><span className="text-center">Sup.Total</span>
        <span className="text-center">Ins.Unit</span><span className="text-center">Ins.Total</span>
        <span className="text-center">Total</span><span />
      </div>
      {items.map((it, idx) => (
        it.isSection ? (
          <div key={idx} className="grid grid-cols-[1fr_28px] gap-1 mb-1">
            <Input
              size="small"
              value={it.description}
              onChange={(e) => update(idx, "description", e.target.value)}
              placeholder="Section heading (e.g. CABLES AND ACCESSORIES)"
              className="!font-bold !bg-amber-50 !border-amber-300 !text-xs uppercase"
            />
            <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 flex items-center justify-center">✕</button>
          </div>
        ) : (
          <div key={idx} className="grid grid-cols-[2.5fr_50px_60px_80px_80px_80px_80px_80px_28px] gap-1 mb-1">
            <Input size="small" value={it.description} onChange={(e) => update(idx, "description", e.target.value)} placeholder="Description" />
            <InputNumber size="small" min={0} value={it.quantity} onChange={(v) => update(idx, "quantity", v)} className="w-full" />
            <Input size="small" value={it.unit} onChange={(e) => update(idx, "unit", e.target.value)} placeholder="m / No" />
            <InputNumber size="small" min={0} value={it.supplyUnitRate} onChange={(v) => update(idx, "supplyUnitRate", v)} className="w-full" />
            <InputNumber size="small" value={it.supplyTotal} readOnly className="w-full !bg-gray-50" />
            <InputNumber size="small" min={0} value={it.installUnitRate} onChange={(v) => update(idx, "installUnitRate", v)} className="w-full" />
            <InputNumber size="small" value={it.installTotal} readOnly className="w-full !bg-gray-50" />
            <InputNumber size="small" value={it.total} readOnly className="w-full !bg-amber-50 !font-bold" />
            <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 flex items-center justify-center">✕</button>
          </div>
        )
      ))}
      <div className="flex gap-2 mt-1">
        <Button size="small" onClick={addRow} type="dashed" className="flex-1 text-xs">+ Add Item</Button>
        <Button size="small" onClick={addSection} type="dashed" className="flex-1 text-xs !border-amber-400 !text-amber-600">+ Add Section Header</Button>
      </div>
    </div>
  );
};

const TaxBreakdownPreview = ({ items = [], allTaxConfigs = [], selectedTaxIds = [] }: { items: any[], allTaxConfigs: any[], selectedTaxIds: string[] }) => {
  const configs = allTaxConfigs.filter((c: any) => selectedTaxIds.includes(c._id));
  const subtotal = items.reduce((s: number, i: any) => s + (i.total || 0), 0);

  const { breakdown, taxAmount } = configs.reduce(
    (acc: any, c: any) => {
      const base = c.base === "cumulative" ? acc.cumulative : subtotal;
      const amount = parseFloat(((base * c.rate) / 100).toFixed(2));
      acc.breakdown.push({ ...c, amount });
      acc.cumulative = parseFloat((acc.cumulative + amount).toFixed(2));
      acc.taxAmount = parseFloat((acc.taxAmount + amount).toFixed(2));
      return acc;
    },
    { breakdown: [], cumulative: subtotal, taxAmount: 0 },
  );
  const total = parseFloat((subtotal + taxAmount).toFixed(2));
  const fmt = (n: number) => n.toLocaleString("en-GH", { minimumFractionDigits: 2 });

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
      <div className="flex justify-between"><span className="text-gray-500">Subtotal (GHS)</span><span className="font-semibold">{fmt(subtotal)}</span></div>
      {breakdown.map((t: any) => (
        <div key={t.code} className="flex justify-between text-gray-500">
          <span>{t.name} ({t.rate}%{t.base === "cumulative" ? " ↗" : ""})</span>
          <span>{fmt(t.amount)}</span>
        </div>
      ))}
      <Divider className="!my-1" />
      <div className="flex justify-between text-sm font-bold"><span>Total (GHS)</span><span style={{ color: "#F5A623" }}>{fmt(total)}</span></div>
    </div>
  );
};

const YELQuotations = () => {
  PageTitle("Quotations | YANTEC ERP");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [convertModal, setConvertModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [convertTarget, setConvertTarget] = useState<any>(null);
  const [form] = Form.useForm();
  const [convertForm] = Form.useForm();
  const [pdfModal, setPdfModal] = useState<{ open: boolean; type: string; id: string; filename: string } | null>(null);
  const [includeBankDetails, setIncludeBankDetails] = useState(false);
  const lineItems = Form.useWatch("lineItems", form) ?? [];
  const docType = Form.useWatch("documentType", form) ?? "standard";

  const [fetchList, { data, isLoading }] = useYelQuotationListMutation();
  const [createQ, { isLoading: creating }] = useYelQuotationCreateMutation();
  const [updateQ, { isLoading: updating }] = useYelQuotationUpdateMutation();
  const [statusQ] = useYelQuotationStatusMutation();
  const [convertQ, { isLoading: converting }] = useYelQuotationConvertMutation();
  const [deleteQ] = useYelQuotationDeleteMutation();
  const { data: clientsData } = useYelClientAllQuery();
  const { data: taxData } = useYelTaxConfigListQuery();
  const allActiveTaxConfigs = (taxData?.data ?? []).filter((c: any) => c.isActive).sort((a: any, b: any) => a.order - b.order);
  const selectedTaxIds: string[] = Form.useWatch("selectedTaxIds", form) ?? [];

  const load = () => fetchList({ page, limit, searchQuery, status: statusFilter });
  useEffect(() => { load(); }, [page, searchQuery, statusFilter]);

  const openCreate = () => {
    setEditTarget(null);
    form.resetFields();
    form.setFieldsValue({ documentType: "standard", lineItems: [emptyItem()] });
    setModalOpen(true);
  };
  const openEdit = (r: any) => {
    setEditTarget(r);
    const breakdownCodes = new Set(r.taxBreakdown?.map((t: any) => t.code) ?? []);
    const preSelectedIds = allActiveTaxConfigs.filter((c: any) => breakdownCodes.has(c.code)).map((c: any) => c._id);
    form.setFieldsValue({
      ...r,
      client: r.client?._id ?? r.client,
      validUntil: r.validUntil ? dayjs(r.validUntil) : null,
      lineItems: r.lineItems,
      documentType: r.documentType ?? "standard",
      selectedTaxIds: preSelectedIds,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const { lineItems: li, validUntil, ...rest } = values;
    const payload = { ...rest, lineItems: li, validUntil: validUntil?.toISOString() };
    try {
      if (editTarget) {
        await updateQ({ id: editTarget._id, body: payload }).unwrap();
        toast.success("Quotation updated");
      } else {
        await createQ(payload).unwrap();
        toast.success("Quotation created");
      }
      setModalOpen(false);
      load();
    } catch (err: any) { toast.error(err?.data?.error || err?.data?.message || "Error"); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await statusQ({ id, status }).unwrap();
      toast.success("Status updated");
      load();
    } catch (err: any) { toast.error(err?.data?.error || "Failed"); }
  };

  const handleConvert = async (values: any) => {
    try {
      await convertQ({ id: convertTarget._id, body: { dueDate: values.dueDate?.toISOString(), notes: values.notes } }).unwrap();
      toast.success("Converted to invoice");
      setConvertModal(false);
      convertForm.resetFields();
      load();
    } catch (err: any) { toast.error(err?.data?.error || "Conversion failed"); }
  };

  const handleDelete = async (r: any) => {
    const res = await Swal.fire({ title: "Delete Quotation?", text: r.quotationNumber, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!res.isConfirmed) return;
    try { await deleteQ(r._id).unwrap(); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err?.data?.error || "Delete failed"); }
  };

  const columns = [
    { title: "#", render: (_: any, __: any, i: number) => (page - 1) * limit + i + 1, width: 45 },
    {
      title: "Quotation #", dataIndex: "quotationNumber", key: "quotationNumber",
      render: (v: string) => <span className="font-bold text-xs" style={{ color: "#0A1628" }}>{v}</span>,
    },
    { title: "Client", key: "client", render: (_: any, r: any) => r.client?.name ?? "—" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Total (GHS)", dataIndex: "totalAmount", key: "totalAmount",
      render: (v: number) => <span className="font-semibold">{v?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span>,
    },
    {
      title: "Valid Until", dataIndex: "validUntil", key: "validUntil",
      render: (v: string) => v ? dayjs(v).format("DD MMM YYYY") : "—",
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: string) => <Tag color={STATUS_COLORS[v] ?? "default"}>{v?.toUpperCase()}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: any, r: any) => (
        <div className="flex gap-1.5 items-center">
          {!["converted", "rejected"].includes(r.status) && (
            <Tooltip title="Edit">
              <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700"><FaEdit size={13} /></button>
            </Tooltip>
          )}
          {["draft", "sent", "accepted"].includes(r.status) && (
            <Tooltip title="Convert to Invoice">
              <button onClick={() => { setConvertTarget(r); setConvertModal(true); }} className="text-purple-500 hover:text-purple-700">
                <FaFileInvoiceDollar size={13} />
              </button>
            </Tooltip>
          )}
          {r.status === "draft" && (
            <Tooltip title="Mark as Sent">
              <button onClick={() => handleStatusChange(r._id, "sent")} className="text-xs px-1.5 py-0.5 rounded border border-blue-300 text-blue-500 hover:bg-blue-50">Sent</button>
            </Tooltip>
          )}
          {!["converted"].includes(r.status) && (
            <Tooltip title="Delete">
              <button onClick={() => handleDelete(r)} className="text-red-400 hover:text-red-600"><AiFillDelete size={13} /></button>
            </Tooltip>
          )}
          <Tooltip title="Download PDF">
            <button
              onClick={() => { setIncludeBankDetails(false); setPdfModal({ open: true, type: "quotations", id: r._id, filename: `YANTEC-${r.quotationNumber}.pdf` }); }}
              className="text-rose-600 hover:text-rose-800"
            >
              <FaFilePdf size={13} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "#0A1628" }}>Quotations</h1>
          <p className="text-xs text-gray-400">Create and manage client quotations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
          style={{ background: "linear-gradient(135deg, #0A1628, #1A3A6B)" }}
        >
          <LiaPlusSquareSolid size={16} /> New Quotation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text" placeholder="Search quotations…" value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#F5A623]"
            />
          </div>
          <Select
            allowClear placeholder="All Statuses" className="w-36 text-xs" size="middle"
            value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }}
          >
            {["draft","sent","accepted","rejected","expired","converted"].map((s) => (
              <Option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</Option>
            ))}
          </Select>
        </div>

        <Table dataSource={data?.data ?? []} columns={columns} rowKey="_id" loading={isLoading} pagination={false} size="small" className="text-xs" />
        <div className="flex justify-end mt-3">
          <Pagination current={page} pageSize={limit} total={data?.totalCount ?? 0} onChange={setPage} size="small" showTotal={(t) => `${t} quotations`} />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={780} destroyOnClose
        title={<span className="font-bold text-sm">{editTarget ? `Edit — ${editTarget.quotationNumber}` : "New Quotation"}</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2">
          <Form.Item name="documentType" initialValue="standard" className="mb-3">
            <Radio.Group
              onChange={(e) => {
                const type = e.target.value;
                form.setFieldValue("lineItems", type === "boq" ? [emptyBoqItem()] : [emptyItem()]);
              }}
            >
              <Radio.Button value="standard">Standard Invoice / Quotation</Radio.Button>
              <Radio.Button value="boq">Bill of Quantity (BoQ)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item label="Client" name="client" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children" placeholder="Select client">
                {clientsData?.data?.map((c: any) => (
                  <Option key={c._id} value={c._id}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input placeholder="HV Substation Supply & Installation" />
            </Form.Item>
            <Form.Item label="Valid Until" name="validUntil" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item label="Currency" name="currency" initialValue="GHS">
              <Select>
                <Option value="GHS">GHS</Option>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input placeholder="Brief description" />
            </Form.Item>
          </div>

          <Form.Item label="Line Items" name="lineItems" rules={[{ required: true, message: "Add at least one line item" }]}>
            {docType === "boq" ? <BoQLineItemsEditor /> : <LineItemsEditor />}
          </Form.Item>

          <Form.Item label="Applicable Taxes" name="selectedTaxIds" initialValue={[]}>
            <Checkbox.Group>
              <div className="flex flex-wrap gap-4">
                {allActiveTaxConfigs.map((c: any) => (
                  <Checkbox key={c._id} value={c._id}>
                    <span className="text-xs">{c.name} <span className="text-gray-400">({c.rate}%)</span></span>
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <TaxBreakdownPreview items={lineItems} allTaxConfigs={allActiveTaxConfigs} selectedTaxIds={selectedTaxIds} />

          <div className="grid grid-cols-2 gap-x-3 mt-3">
            <Form.Item label="Notes" name="notes"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item label="Terms & Conditions" name="terms"><Input.TextArea rows={2} /></Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating} style={{ background: "#0A1628" }}>
              {editTarget ? "Save Changes" : "Create Quotation"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Convert to Invoice Modal */}
      <Modal
        open={convertModal} onCancel={() => { setConvertModal(false); convertForm.resetFields(); }}
        footer={null} width={420} destroyOnClose
        title={<span className="font-bold text-sm">Convert to Invoice — {convertTarget?.quotationNumber}</span>}
      >
        <Form form={convertForm} layout="vertical" onFinish={handleConvert} className="mt-2">
          <p className="text-xs text-gray-500 mb-4">
            This will create a new invoice based on <strong>{convertTarget?.quotationNumber}</strong> (GHS {convertTarget?.totalAmount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}) and mark the quotation as converted.
          </p>
          <Form.Item label="Invoice Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker className="w-full" format="DD/MM/YYYY" disabledDate={(d) => d && d.isBefore(dayjs(), "day")} />
          </Form.Item>
          <Form.Item label="Additional Notes (optional)" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setConvertModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={converting} style={{ background: "#6d28d9" }}>
              Convert to Invoice
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── PDF Download Modal ── */}
      <Modal
        title="Download PDF"
        open={!!pdfModal?.open}
        onCancel={() => setPdfModal(null)}
        footer={null}
        width={380}
        destroyOnClose
      >
        <div className="py-2">
          <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-lg border border-gray-200 hover:border-orange-400 transition-colors">
            <input
              type="checkbox"
              checked={includeBankDetails}
              onChange={(e) => setIncludeBankDetails(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <div>
              <p className="font-semibold text-sm text-gray-800">Include Bank Details</p>
              <p className="text-xs text-gray-400 mt-0.5">Append YANTEC bank accounts at the bottom of the PDF</p>
            </div>
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setPdfModal(null)}>Cancel</Button>
            <Button
              type="primary"
              style={{ background: "#0A1628", borderColor: "#0A1628" }}
              onClick={() => {
                if (pdfModal) {
                  executePdfDownload(pdfModal.type, pdfModal.id, pdfModal.filename, includeBankDetails);
                  setPdfModal(null);
                }
              }}
            >
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default YELQuotations;
