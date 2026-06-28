import { useState, useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  useYelInvoiceListMutation,
  useYelInvoiceGetQuery,
  useYelInvoiceSummaryQuery,
  useYelInvoiceCreateMutation,
  useYelInvoiceStatusMutation,
  useYelReceiptIssueMutation,
  useYelReceiptVoidMutation,
  useYelClientAllQuery,
  useYelTaxConfigListQuery,
} from "../../redux/features/yel/yelApi";
import {
  Table, Input, Button, Modal, Form, Select, Pagination,
  Tag, DatePicker, InputNumber, Divider, Tooltip, Drawer, Descriptions, Checkbox, Radio,
} from "antd";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { AiOutlineSearch } from "react-icons/ai";
import { FaFileInvoiceDollar, FaMoneyBillWave, FaFilePdf } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
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

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: "default",
  sent: "blue",
  partially_paid: "orange",
  paid: "green",
  overdue: "red",
  void: "volcano",
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
          <Input size="small" value={it.description} onChange={(e) => update(idx, "description", e.target.value)} placeholder="Description" />
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
        updated.supplyTotal = parseFloat((qty * (updated.supplyUnitRate || 0)).toFixed(2));
        updated.installTotal = parseFloat((qty * (updated.installUnitRate || 0)).toFixed(2));
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
            <Input size="small" value={it.description} onChange={(e) => update(idx, "description", e.target.value)} placeholder="Section heading (e.g. CABLES AND ACCESSORIES)" className="!font-bold !bg-amber-50 !border-amber-300 !text-xs uppercase" />
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

const SummaryCards = () => {
  const { data } = useYelInvoiceSummaryQuery();
  const totals = data?.data?.totals ?? {};
  const cards = [
    { label: "Total Revenue", value: totals.totalRevenue, color: "#0A1628" },
    { label: "Collected", value: totals.totalCollected, color: "#16a34a" },
    { label: "Outstanding", value: totals.totalOutstanding, color: "#F5A623" },
    { label: "Invoices", value: totals.invoiceCount, isCount: true, color: "#6d28d9" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{c.label}</p>
          <p className="text-xl font-extrabold mt-1" style={{ color: c.color }}>
            {c.isCount ? c.value ?? 0 : `GHS ${(c.value ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
          </p>
        </div>
      ))}
    </div>
  );
};

const InvoiceDetailDrawer = ({ invoiceId, open, onClose, onReceiptIssued }: any) => {
  const { data, refetch } = useYelInvoiceGetQuery(invoiceId, { skip: !invoiceId || !open });
  const [issueReceipt, { isLoading: issuingReceipt }] = useYelReceiptIssueMutation();
  const [voidReceipt] = useYelReceiptVoidMutation();
  const [receiptForm] = Form.useForm();
  const [receiptModal, setReceiptModal] = useState(false);

  const invoice = data?.data?.invoice;
  const receipts = data?.data?.receipts ?? [];

  const handleIssueReceipt = async (values: any) => {
    try {
      await issueReceipt({ ...values, invoiceId, paymentDate: values.paymentDate?.toISOString() }).unwrap();
      toast.success("Receipt issued");
      setReceiptModal(false);
      receiptForm.resetFields();
      refetch();
      onReceiptIssued?.();
    } catch (err: any) { toast.error(err?.data?.error || err?.data?.message || "Failed"); }
  };

  const handleVoidReceipt = async (receipt: any) => {
    const { value: voidReason } = await Swal.fire({
      title: "Void Receipt",
      text: `Void ${receipt.receiptNumber}? This will reverse the payment on the invoice.`,
      input: "text",
      inputLabel: "Reason for voiding",
      inputPlaceholder: "Enter reason…",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Void Receipt",
      inputValidator: (v) => !v ? "Reason is required" : null,
    });
    if (!voidReason) return;
    try {
      await voidReceipt({ id: receipt._id, voidReason }).unwrap();
      toast.success("Receipt voided");
      refetch();
      onReceiptIssued?.();
    } catch (err: any) { toast.error(err?.data?.error || "Failed"); }
  };

  return (
    <Drawer
      open={open} onClose={onClose} width={620} destroyOnClose
      title={
        <div className="flex items-center gap-2">
          <FaFileInvoiceDollar style={{ color: "#F5A623" }} />
          <span className="font-bold">{invoice?.invoiceNumber ?? "Invoice Detail"}</span>
          {invoice?.status && <Tag color={INVOICE_STATUS_COLORS[invoice.status]}>{invoice.status.toUpperCase().replace("_", " ")}</Tag>}
        </div>
      }
    >
      {invoice && (
        <>
          <Descriptions size="small" column={2} bordered className="mb-4">
            <Descriptions.Item label="Client" span={2}>{invoice.client?.name}</Descriptions.Item>
            <Descriptions.Item label="Contact">{invoice.client?.contactPerson}</Descriptions.Item>
            <Descriptions.Item label="Email">{invoice.client?.email}</Descriptions.Item>
            <Descriptions.Item label="Issue Date">{dayjs(invoice.issueDate).format("DD MMM YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Due Date">
              <span style={{ color: invoice.status === "overdue" ? "#d33" : undefined }}>
                {dayjs(invoice.dueDate).format("DD MMM YYYY")}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Line Items {invoice.documentType === "boq" && <span className="text-amber-600 text-[9px] ml-1">— Bill of Quantity</span>}
            </p>
            {invoice.documentType === "boq" ? (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-[9px] font-bold uppercase text-gray-600">
                    <th className="text-left p-1.5 border border-amber-200">Description</th>
                    <th className="p-1.5 border border-amber-200 text-center">Qty</th>
                    <th className="p-1.5 border border-amber-200 text-center">Unit</th>
                    <th className="p-1.5 border border-amber-200 text-right">Sup.Unit</th>
                    <th className="p-1.5 border border-amber-200 text-right">Sup.Total</th>
                    <th className="p-1.5 border border-amber-200 text-right">Ins.Unit</th>
                    <th className="p-1.5 border border-amber-200 text-right">Ins.Total</th>
                    <th className="p-1.5 border border-amber-200 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems?.map((it: any, i: number) => it.isSection ? (
                    <tr key={i} className="bg-gray-100">
                      <td colSpan={8} className="p-1.5 font-bold text-[10px] uppercase tracking-wide border border-gray-200">{it.description}</td>
                    </tr>
                  ) : (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-1.5">{it.description}</td>
                      <td className="p-1.5 text-center">{it.quantity}</td>
                      <td className="p-1.5 text-center">{it.unit || "—"}</td>
                      <td className="p-1.5 text-right">{(it.supplyUnitRate ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                      <td className="p-1.5 text-right">{(it.supplyTotal ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                      <td className="p-1.5 text-right">{(it.installUnitRate ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                      <td className="p-1.5 text-right">{(it.installTotal ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                      <td className="p-1.5 text-right font-bold">{it.total?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50"><th className="text-left p-1.5">Description</th><th className="text-right p-1.5">Qty</th><th className="text-right p-1.5">Unit Price</th><th className="text-right p-1.5">Total</th></tr></thead>
              <tbody>
                {invoice.lineItems?.map((it: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-1.5">{it.description}</td>
                    <td className="p-1.5 text-right">{it.quantity}</td>
                    <td className="p-1.5 text-right">GHS {it.unitPrice?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                    <td className="p-1.5 text-right">GHS {it.total?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            <div className="bg-gray-50 rounded-lg p-3 mt-2 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>GHS {invoice.subtotal?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span></div>
              {invoice.taxBreakdown?.length > 0
                ? invoice.taxBreakdown.map((t: any) => (
                    <div key={t.code} className="flex justify-between text-gray-400 text-[11px]">
                      <span>{t.name} ({t.rate}%{t.base === "cumulative" ? " ↗" : ""})</span>
                      <span>GHS {t.amount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))
                : invoice.taxAmount > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>GHS {invoice.taxAmount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span></div>
                  )
              }
              <Divider className="!my-1" />
              <div className="flex justify-between font-bold text-sm"><span>Total</span><span>GHS {invoice.totalAmount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between text-green-600"><span>Amount Paid</span><span>GHS {invoice.amountPaid?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between font-bold" style={{ color: invoice.balanceDue > 0 ? "#F5A623" : "#16a34a" }}>
                <span>Balance Due</span><span>GHS {invoice.balanceDue?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Receipts ({receipts.length})</p>
            <div className="flex items-center gap-2">
              <Tooltip title="Download Invoice PDF">
                <button
                  onClick={() => { setIncludeBankDetails(false); setPdfModal({ open: true, type: "invoices", id: invoice._id, filename: `YANTEC-${invoice.invoiceNumber}.pdf` }); }}
                  className="text-rose-600 hover:text-rose-800"
                >
                  <FaFilePdf size={15} />
                </button>
              </Tooltip>
              {!["paid", "void"].includes(invoice.status) && (
                <Button
                  size="small" type="primary" icon={<FaMoneyBillWave size={11} />}
                  onClick={() => setReceiptModal(true)} style={{ background: "#16a34a", borderColor: "#16a34a" }}
                >
                  Issue Receipt
                </Button>
              )}
            </div>
          </div>

          {receipts.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {receipts.map((r: any) => (
                <div key={r._id} className={`rounded-lg border p-3 text-xs ${r.isVoided ? "bg-gray-50 border-gray-200 opacity-60" : "bg-green-50 border-green-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: r.isVoided ? "#6b7280" : "#16a34a" }}>{r.receiptNumber}</span>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Download Receipt PDF">
                        <button onClick={() => executePdfDownload("receipts", r._id, `YANTEC-${r.receiptNumber}.pdf`)} className="text-rose-600 hover:text-rose-800">
                          <FaFilePdf size={13} />
                        </button>
                      </Tooltip>
                      {r.isVoided ? <Tag color="volcano" className="text-[9px]">VOIDED</Tag> : (
                        <Tooltip title="Void receipt">
                          <button onClick={() => handleVoidReceipt(r)} className="text-red-400 hover:text-red-600">
                            <MdOutlineCancel size={15} />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 mt-1 text-gray-600">
                    <span>Amount: <strong>GHS {r.amountPaid?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</strong></span>
                    <span>Method: <strong>{r.paymentMethod?.replace("_", " ")}</strong></span>
                    <span>Date: {dayjs(r.paymentDate).format("DD MMM YYYY")}</span>
                    {r.transactionReference && <span>Ref: {r.transactionReference}</span>}
                    {r.isVoided && <span className="col-span-2 text-red-500">Void reason: {r.voidReason}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        open={receiptModal} onCancel={() => setReceiptModal(false)} footer={null} width={420} destroyOnClose
        title={<span className="font-bold text-sm">Issue Receipt — {invoice?.invoiceNumber}</span>}
      >
        {invoice && (
          <p className="text-xs text-gray-500 mb-4">
            Balance due: <strong className="text-orange-500">GHS {invoice.balanceDue?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</strong>
          </p>
        )}
        <Form form={receiptForm} layout="vertical" onFinish={handleIssueReceipt}>
          <Form.Item label="Amount Paid (GHS)" name="amountPaid" rules={[{ required: true }]}>
            <InputNumber min={0.01} max={invoice?.balanceDue} className="w-full" step={0.01} />
          </Form.Item>
          <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
            <Select>
              <Option value="cash">Cash</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="cheque">Cheque</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Payment Date" name="paymentDate" initialValue={dayjs()} rules={[{ required: true }]}>
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Transaction Reference (optional)" name="transactionReference">
            <Input placeholder="Bank ref / MoMo transaction ID" />
          </Form.Item>
          <Form.Item label="Bank Name (if applicable)" name="bankName">
            <Input placeholder="GCB, Ecobank, etc." />
          </Form.Item>
          <Form.Item label="Notes (optional)" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setReceiptModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={issuingReceipt} style={{ background: "#16a34a", borderColor: "#16a34a" }}>
              Issue Receipt
            </Button>
          </div>
        </Form>
      </Modal>
    </Drawer>
  );
};

const YELInvoices = () => {
  PageTitle("Invoices | YANTEC ERP");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [createModal, setCreateModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [pdfModal, setPdfModal] = useState<{ open: boolean; type: string; id: string; filename: string } | null>(null);
  const [includeBankDetails, setIncludeBankDetails] = useState(false);
  const lineItems = Form.useWatch("lineItems", form) ?? [];
  const docType = Form.useWatch("documentType", form) ?? "standard";
  const selectedTaxIds: string[] = Form.useWatch("selectedTaxIds", form) ?? [];
  const { data: taxData } = useYelTaxConfigListQuery();

  const [fetchList, { data, isLoading }] = useYelInvoiceListMutation();
  const [createInvoice, { isLoading: creating }] = useYelInvoiceCreateMutation();
  const [statusInvoice] = useYelInvoiceStatusMutation();
  const { data: clientsData } = useYelClientAllQuery();

  const load = () => fetchList({ page, limit, searchQuery, status: statusFilter });
  useEffect(() => { load(); }, [page, searchQuery, statusFilter]);

  const handleCreate = async (values: any) => {
    const { lineItems: li, dueDate, ...rest } = values;
    try {
      await createInvoice({ ...rest, lineItems: li, dueDate: dueDate?.toISOString() }).unwrap();
      toast.success("Invoice created");
      setCreateModal(false);
      form.resetFields();
      load();
    } catch (err: any) { toast.error(err?.data?.error || err?.data?.message || "Error"); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await statusInvoice({ id, status }).unwrap();
      toast.success("Status updated");
      load();
    } catch (err: any) { toast.error(err?.data?.error || "Failed"); }
  };

  const handleVoidInvoice = async (r: any) => {
    const res = await Swal.fire({ title: "Void Invoice?", text: `${r.invoiceNumber} — this cannot be undone if no payments exist.`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Void" });
    if (!res.isConfirmed) return;
    try {
      await statusInvoice({ id: r._id, status: "void" }).unwrap();
      toast.success("Invoice voided");
      load();
    } catch (err: any) { toast.error(err?.data?.error || "Failed"); }
  };

  const subtotal = lineItems.reduce((s: number, i: any) => s + (i.total || 0), 0);
  const allActiveTaxConfigs: any[] = (taxData?.data ?? []).filter((c: any) => c.isActive).sort((a: any, b: any) => a.order - b.order);
  const selectedTaxConfigs = allActiveTaxConfigs.filter((c: any) => selectedTaxIds.includes(c._id));
  const { taxBreakdown: invBreakdown, taxAmt: invTaxAmt } = selectedTaxConfigs.reduce(
    (acc: any, c: any) => {
      const base = c.base === "cumulative" ? acc.cumulative : subtotal;
      const amount = parseFloat(((base * c.rate) / 100).toFixed(2));
      acc.taxBreakdown.push({ ...c, amount });
      acc.cumulative = parseFloat((acc.cumulative + amount).toFixed(2));
      acc.taxAmt = parseFloat((acc.taxAmt + amount).toFixed(2));
      return acc;
    },
    { taxBreakdown: [], cumulative: subtotal, taxAmt: 0 },
  );
  const invTotal = parseFloat((subtotal + invTaxAmt).toFixed(2));
  const fmt = (n: number) => n.toLocaleString("en-GH", { minimumFractionDigits: 2 });

  const columns = [
    { title: "#", render: (_: any, __: any, i: number) => (page - 1) * limit + i + 1, width: 45 },
    {
      title: "Invoice #", dataIndex: "invoiceNumber", key: "invoiceNumber",
      render: (v: string) => <span className="font-bold text-xs" style={{ color: "#0A1628" }}>{v}</span>,
    },
    { title: "Client", key: "client", render: (_: any, r: any) => r.client?.name ?? "—" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Total (GHS)", dataIndex: "totalAmount", key: "totalAmount",
      render: (v: number) => <span className="font-semibold">{v?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span>,
    },
    {
      title: "Balance (GHS)", dataIndex: "balanceDue", key: "balanceDue",
      render: (v: number, r: any) => (
        <span style={{ color: v > 0 ? "#F5A623" : "#16a34a", fontWeight: 600 }}>
          {r.status === "void" ? "—" : v?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Due Date", dataIndex: "dueDate", key: "dueDate",
      render: (v: string, r: any) => (
        <span style={{ color: r.status === "overdue" ? "#d33" : undefined }}>
          {v ? dayjs(v).format("DD MMM YYYY") : "—"}
        </span>
      ),
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: string) => <Tag color={INVOICE_STATUS_COLORS[v] ?? "default"}>{v?.toUpperCase().replace("_", " ")}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: any, r: any) => (
        <div className="flex gap-1.5 items-center">
          <Tooltip title="View / Issue Receipt">
            <button onClick={() => setSelectedInvoiceId(r._id)} className="text-blue-500 hover:text-blue-700">
              <FaFileInvoiceDollar size={14} />
            </button>
          </Tooltip>
          {r.status === "draft" && (
            <Tooltip title="Mark as Sent">
              <button
                onClick={() => handleStatusChange(r._id, "sent")}
                className="text-xs px-1.5 py-0.5 rounded border border-blue-300 text-blue-500 hover:bg-blue-50"
              >
                Sent
              </button>
            </Tooltip>
          )}
          {!["paid", "void"].includes(r.status) && (
            <Tooltip title="Void Invoice">
              <button onClick={() => handleVoidInvoice(r)} className="text-red-400 hover:text-red-600">
                <MdOutlineCancel size={15} />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Download Invoice PDF">
            <button
              onClick={() => { setIncludeBankDetails(false); setPdfModal({ open: true, type: "invoices", id: r._id, filename: `YANTEC-${r.invoiceNumber}.pdf` }); }}
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
          <h1 className="text-lg font-bold" style={{ color: "#0A1628" }}>Invoices</h1>
          <p className="text-xs text-gray-400">Issue invoices and record payments</p>
        </div>
        <button
          onClick={() => { form.resetFields(); form.setFieldsValue({ documentType: "standard", lineItems: [emptyItem()] }); setCreateModal(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
          style={{ background: "linear-gradient(135deg, #0A1628, #1A3A6B)" }}
        >
          <LiaPlusSquareSolid size={16} /> New Invoice
        </button>
      </div>

      <SummaryCards />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text" placeholder="Search invoices…" value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#F5A623]"
            />
          </div>
          <Select
            allowClear placeholder="All Statuses" className="w-40 text-xs" size="middle"
            value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }}
          >
            {["draft","sent","partially_paid","paid","overdue","void"].map((s) => (
              <Option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Option>
            ))}
          </Select>
        </div>

        <Table dataSource={data?.data ?? []} columns={columns} rowKey="_id" loading={isLoading} pagination={false} size="small" className="text-xs" />
        <div className="flex justify-end mt-3">
          <Pagination current={page} pageSize={limit} total={data?.totalCount ?? 0} onChange={setPage} size="small" showTotal={(t) => `${t} invoices`} />
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        open={createModal} onCancel={() => setCreateModal(false)} footer={null} width={780} destroyOnClose
        title={<span className="font-bold text-sm">New Invoice</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-2">
          <Form.Item name="documentType" initialValue="standard" className="mb-3">
            <Radio.Group
              onChange={(e) => {
                const type = e.target.value;
                form.setFieldValue("lineItems", type === "boq" ? [emptyBoqItem()] : [emptyItem()]);
              }}
            >
              <Radio.Button value="standard">Standard Invoice</Radio.Button>
              <Radio.Button value="boq">Bill of Quantity (BoQ)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item label="Client" name="client" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children" placeholder="Select client">
                {clientsData?.data?.map((c: any) => <Option key={c._id} value={c._id}>{c.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input placeholder="Invoice title" />
            </Form.Item>
            <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item label="Currency" name="currency" initialValue="GHS">
              <Select>
                <Option value="GHS">GHS</Option><Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option><Option value="GBP">GBP</Option>
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

          <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1 mb-3">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal (GHS)</span><span className="font-semibold">{fmt(subtotal)}</span></div>
            {invBreakdown.map((t: any) => (
              <div key={t.code} className="flex justify-between text-gray-500">
                <span>{t.name} ({t.rate}%{t.base === "cumulative" ? " ↗" : ""})</span>
                <span>{fmt(t.amount)}</span>
              </div>
            ))}
            <Divider className="!my-1" />
            <div className="flex justify-between text-sm font-bold"><span>Total (GHS)</span><span style={{ color: "#F5A623" }}>{fmt(invTotal)}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item label="Notes" name="notes"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item label="Terms & Conditions" name="terms"><Input.TextArea rows={2} /></Form.Item>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating} style={{ background: "#0A1628" }}>Create Invoice</Button>
          </div>
        </Form>
      </Modal>

      {/* Invoice Detail Drawer */}
      <InvoiceDetailDrawer
        invoiceId={selectedInvoiceId}
        open={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onReceiptIssued={load}
      />

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

export default YELInvoices;
