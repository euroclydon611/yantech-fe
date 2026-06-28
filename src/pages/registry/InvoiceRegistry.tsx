import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  Drawer,
  Pagination,
  Table,
  Tooltip,
  Select,
  Tag,
  Space,
  DatePicker,
  Button,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";
import {
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  StopOutlined,
  BarChartOutlined,
  BellOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { exportData } from "../../utils/helperFunction";
import AdminInvoiceStatisticsModal from "./AdminInvoiceStatisticsModal";
import { useGetAdminInvoiceRegistryQuery } from "../../redux/features/general/client-applications";
import { formatDate2, formatNumber, normalizeText } from "../../utils/helperFunction";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import {
  invoicesStatusOptions,
  paymentForOptions,
} from "@/employee_portal_pages/lib/helpers";
import axios from "axios";
import Swal from "sweetalert2";
import type { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const { RangePicker } = DatePicker;
const { Option } = Select;

function getClientName(client: any): string {
  if (!client) return "N/A";
  return (
    client.organizationName ||
    client.agencyName ||
    [client.firstName, client.lastName].filter(Boolean).join(" ").trim() ||
    "N/A"
  );
}

const getInvoiceStatusTag = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-green-700 bg-green-50 border border-green-200">
          <CheckCircleOutlined className="text-[10px]" /> Paid
        </span>
      );
    case "unpaid":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-200">
          <FileTextOutlined className="text-[10px]" /> Unpaid
        </span>
      );
    case "overdue":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-red-700 bg-red-50 border border-red-200">
          <WarningOutlined className="text-[10px]" /> Overdue
        </span>
      );
    case "void":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-gray-600 bg-gray-100 border border-gray-200">
          <StopOutlined className="text-[10px]" /> Void
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200">
          <ClockCircleOutlined className="text-[10px]" /> Processing
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200">
          <FileTextOutlined className="text-[10px]" /> Draft
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-red-600 bg-red-50 border border-red-200">
          <CloseCircleOutlined className="text-[10px]" /> Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200">
          {normalizeText(status || "Unknown")}
        </span>
      );
  }
};

const statusStatCards = [
  { key: "paid", label: "Paid", color: "text-green-600 bg-green-50 border-green-200" },
  { key: "unpaid", label: "Unpaid", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { key: "overdue", label: "Overdue", color: "text-red-600 bg-red-50 border-red-200" },
  { key: "void", label: "Void", color: "text-gray-500 bg-gray-50 border-gray-200" },
  { key: "processing", label: "Processing", color: "text-blue-600 bg-blue-50 border-blue-200" },
];

const InvoiceRegistry = () => {
  PageTitle("Invoice Registry | EPA Ghana Admin");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const { csrfToken } = useSelector((state: RootState) => state.auth);

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const paidAtStart = dateFilterType === "paidAt" ? startDateVal : "";
  const paidAtEnd = dateFilterType === "paidAt" ? endDateVal : "";

  const { data: entitiesData } = useEntityFullListQuery({ designation: "" });
  const entities = entitiesData?.data || [];

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminInvoiceRegistryQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      status,
      paymentFor,
      assigningEntity,
      issueDateStart,
      issueDateEnd,
      startDate,
      endDate,
      paidAtStart,
      paidAtEnd,
    },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true }
  );

  const invoices = response?.data || [];
  const stats = response?.stats || {};
  const paginationInfo = response?.pagination;

  const handleResetFilters = () => {
    setStatus("");
    setPaymentFor("");
    setAssigningEntity("");
    setDateRange(null);
    setDateFilterType("issueDate");
    setPage(1);
  };

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const popup = window.open("", "_blank");
      if (!popup) {
        Swal.fire({
          title: "Popup Blocked",
          text: "Please allow popups in your browser to view the invoice.",
          icon: "warning",
          confirmButtonColor: "#727cf5",
        });
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/invoice-registry/${invoiceId}/view`,
        { withCredentials: true }
      );

      const documentUrl = res?.data?.document_url;
      if (documentUrl) {
        popup.location.href = documentUrl;
      } else {
        popup.close();
        Swal.fire({
          title: "Not Found",
          text: "Invoice document not available.",
          icon: "warning",
          confirmButtonColor: "#727cf5",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Unable to fetch invoice PDF.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  const handleSendAdminReminder = async (record: any) => {
    const clientName = getClientName(record.client);
    const { isConfirmed } = await Swal.fire({
      title: "Send Payment Reminder?",
      html: `Send a payment reminder to <strong>${clientName}</strong> for invoice <strong>${record.gatewayInvoiceNumber || record.invoiceNumber}</strong>?<br/><br/>They will receive an SMS and email with payment instructions.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send Reminder",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6c757d",
    });
    if (!isConfirmed) return;
    setSendingReminderId(record._id);
    try {
      await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/invoice-registry/${record._id}/remind`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      Swal.fire({
        title: "Reminder Sent!",
        text: `Payment reminder sent to ${clientName}.`,
        icon: "success",
        confirmButtonColor: "#52c41a",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Failed",
        text: error?.response?.data?.error || "Failed to send payment reminder.",
        icon: "error",
        confirmButtonColor: "#ff4d4f",
      });
    } finally {
      setSendingReminderId(null);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);

  const handleSendBulkAdminReminders = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Send Bulk Reminders?",
      html: `This will send payment reminders to <strong>all</strong> unpaid/overdue invoice clients across all pages. Each client will receive an SMS and email with payment instructions.<br/><br/>The process runs in the background — you can continue working.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Send All Reminders",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6c757d",
    });
    if (!isConfirmed) return;
    setIsBulkSending(true);
    try {
      const qs = assigningEntity && assigningEntity !== "all" ? `?assigningEntity=${assigningEntity}` : "";
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/invoice-registry/bulk-remind${qs}`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      const data = response.data;
      Swal.fire({
        title: "Reminders Queued",
        html: data.message || `Bulk reminder job started for <strong>${data.total ?? "all"}</strong> invoice(s). Notifications will be delivered in the background.`,
        icon: "success",
        confirmButtonColor: "#52c41a",
      });
    } catch (err: any) {
      Swal.fire({
        title: "Failed",
        text: err?.response?.data?.error || "Failed to start bulk reminder job.",
        icon: "error",
        confirmButtonColor: "#ff4d4f",
      });
    } finally {
      setIsBulkSending(false);
    }
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchQuery", searchTerm);
    if (status) params.append("status", status);
    if (paymentFor) params.append("paymentFor", paymentFor);
    if (assigningEntity) params.append("assigningEntity", assigningEntity);
    if (startDateVal) params.append(dateFilterType === "createdAt" ? "startDate" : dateFilterType === "issueDate" ? "issueDateStart" : "paidAtStart", startDateVal);
    if (endDateVal) params.append(dateFilterType === "createdAt" ? "endDate" : dateFilterType === "issueDate" ? "issueDateEnd" : "paidAtEnd", endDateVal);
    params.append("sortField", sortField);
    params.append("sortOrder", sortOrder);
    setIsExporting(true);
    try {
      await exportData(`general/invoice-registry/export?${params.toString()}`, "Invoice_Registry");
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono text-xs">
          {(page - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: "Inv. No.",
      key: "invoiceNumber",
      width: 160,
      render: (_: any, record: any) => (
        <div>
          <Tooltip title={record.invoiceNumber}>
            <p
              className={`text-xs font-semibold font-mono leading-tight truncate max-w-[150px] ${
                record.status === "void" ? "line-through text-gray-400" : "text-blue-600 cursor-pointer"
              }`}
              onClick={() => record.status !== "void" && handleViewInvoice(record._id)}
            >
              {record.invoiceNumber || "N/A"}
            </p>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "App. Code",
      key: "appCode",
      width: 150,
      render: (_: any, record: any) => (
        <span className="text-[10px] font-mono text-gray-600">
          {record.application?.code || "—"}
        </span>
      ),
    },
    {
      title: "Gateway Ref.",
      key: "gatewayRef",
      width: 160,
      render: (_: any, record: any) => (
        <Tooltip title={record.gatewayInvoiceNumber}>
          <span className="text-[10px] font-mono text-gray-500 truncate block max-w-[150px]">
            {record.gatewayInvoiceNumber || "—"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      render: (_: any, record: any) => getInvoiceStatusTag(record.status),
    },
    {
      title: "Client",
      key: "client",
      width: 180,
      render: (_: any, record: any) => (
        <div>
          <p className="text-xs font-semibold text-gray-800 truncate max-w-[170px]">
            {getClientName(record.client)}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] text-gray-400 font-mono">
              {record.client?.clientId || "N/A"}
            </span>
            {record.client?.userType && (
              <Tag color="blue" className="text-[8px] px-1 py-0 m-0 leading-none">
                {record.client.userType}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Entity/Department",
      key: "assigningEntity",
      width: 180,
      render: (_: any, record: any) => (
        <Tooltip title={record.assigningEntity?.name}>
          <span className="text-[10px] text-gray-600 truncate block max-w-[170px]">
            {record.assigningEntity?.name || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Issue Date",
      key: "issueDate",
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <CalendarOutlined className="text-gray-400 text-[10px]" />
          {formatDate2(record.issueDate)}
        </div>
      ),
    },
    {
      title: "Due Date",
      key: "dueDate",
      width: 110,
      render: (_: any, record: any) => {
        const isPast = record.dueDate && new Date(record.dueDate) < new Date() && record.status !== "paid";
        return (
          <div className={`flex items-center gap-1 text-xs ${isPast ? "text-red-500 font-semibold" : "text-gray-600"}`}>
            <CalendarOutlined className="text-[10px]" />
            {formatDate2(record.dueDate)}
          </div>
        );
      },
    },
    {
      title: "Date Paid",
      key: "paidAt",
      width: 110,
      render: (_: any, record: any) => {
        const paidAt = record.paymentDetails?.paidAt;
        if (!paidAt) return <span className="text-[10px] text-gray-400">—</span>;
        return (
          <div className="flex items-center gap-1 text-xs text-green-700">
            <FileDoneOutlined className="text-[10px]" />
            {formatDate2(paidAt)}
          </div>
        );
      },
    },
    {
      title: "Method",
      key: "paymentMethod",
      width: 110,
      render: (_: any, record: any) => {
        const method = record.paymentDetails?.paymentMethod;
        if (!method) return <span className="text-[10px] text-gray-400">—</span>;
        const labels: Record<string, string> = {
          "ghana.gov": "Ghana.gov",
          bank_transfer: "Bank Transfer",
          other: "Other",
        };
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {labels[method] ?? method}
          </span>
        );
      },
    },
    {
      title: "Payment Ref.",
      key: "paymentReference",
      width: 140,
      render: (_: any, record: any) => {
        const ref = record.paymentDetails?.paymentReference;
        if (!ref) return <span className="text-[10px] text-gray-400">—</span>;
        return (
          <Tooltip title={ref}>
            <span className="text-[10px] font-mono text-gray-600 truncate block max-w-[130px]">
              {ref}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <div className="text-xs text-gray-500">Amount (GH₵)</div>,
      key: "totalAmount",
      width: 120,
      align: "right" as const,
      render: (_: any, record: any) => (
        <span className="text-[10px] font-mono font-bold text-gray-900">
          {formatNumber(record.totalAmount)}
        </span>
      ),
    },
    {
      title: "Generated By",
      key: "generatedBy",
      width: 130,
      render: (_: any, record: any) => {
        const gb = record.generatedBy;
        if (!gb?.firstname && !gb?.lastname) return <span className="text-[10px] text-gray-400">—</span>;
        return (
          <span className="text-[10px] text-gray-700">
            {`${gb.firstname || ""} ${gb.lastname || ""}`.trim()}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Invoice PDF">
            <button
              onClick={() => handleViewInvoice(record._id)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-600 border border-red-300 rounded hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaFilePdf className="text-[11px]" />
              Invoice
            </button>
          </Tooltip>
          {["unpaid", "overdue", "processing"].includes(record.status) && (
            <Tooltip title="Send Payment Reminder (SMS + Email)">
              <Button
                icon={<BellOutlined />}
                size="small"
                className="flex items-center justify-center border-amber-500 text-amber-600 hover:!bg-amber-50 hover:!border-amber-600"
                onClick={() => handleSendAdminReminder(record)}
                loading={sendingReminderId === record._id}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const totalAll = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">

      {/* ── Filter Drawer ── */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="flex items-center gap-2">
              <MdFilterList className="text-[#39afd1]" /> Advanced Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-500 border border-red-300 rounded px-2 py-1 hover:bg-red-50 transition"
            >
              Reset All
            </button>
          </div>
        }
        placement="right"
        width={360}
        open={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <div className="space-y-5 pt-1">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Status</p>
            <Select
              value={status}
              onChange={(v) => { setStatus(v); setPage(1); }}
              className="w-full"
              size="middle"
              placeholder="All Statuses"
              allowClear
            >
              <Option value="">All Statuses</Option>
              {invoicesStatusOptions.filter(s => s !== "all").map((s) => (
                <Option key={s} value={s}>{normalizeText(s)}</Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Payment Type</p>
            <Select
              value={paymentFor}
              onChange={(v) => { setPaymentFor(v); setPage(1); }}
              className="w-full"
              size="middle"
              placeholder="All Payment Types"
              allowClear
            >
              <Option value="">All Payment Types</Option>
              {paymentForOptions.map((p) => (
                <Option key={p} value={p}>{normalizeText(p)}</Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Entity/Department</p>
            <Select
              value={assigningEntity}
              onChange={(v) => { setAssigningEntity(v); setPage(1); }}
              className="w-full"
              size="middle"
              placeholder="All Entities"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              <Option value="">All Entities</Option>
              {entities.map((e: any) => (
                <Option key={e._id || e.id} value={e._id || e.id}>{e.name}</Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Date Filter Type</p>
            <Select
              value={dateFilterType}
              onChange={(v) => setDateFilterType(v)}
              className="w-full"
              size="middle"
            >
              <Option value="issueDate">Issue Date</Option>
              <Option value="createdAt">Created Date</Option>
              <Option value="paidAt">Payment Date</Option>
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Date Range</p>
            <RangePicker
              className="w-full"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
              size="middle"
            />
          </div>
        </div>
      </Drawer>

      {/* ── Header ── */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Invoice Registry</h1>
          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest font-medium">
            Admin-wide view of all generated invoices across entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Send payment reminders to ALL unpaid/overdue invoices (processed in background)">
            <Button
              type="primary"
              icon={<NotificationOutlined />}
              style={{ backgroundColor: "#d97706", borderColor: "#b45309" }}
              className="font-semibold text-xs"
              loading={isBulkSending}
              onClick={handleSendBulkAdminReminders}
            >
              Send Reminders
            </Button>
          </Tooltip>
          <Tooltip title="Export to Excel (respects current filters)">
            <Button
              icon={<FaFileExcel className="text-sm" />}
              style={{ backgroundColor: "#16a34a", borderColor: "#15803d", color: "#fff" }}
              className="font-semibold text-xs flex items-center gap-1"
              loading={isExporting}
              onClick={handleExport}
            >
              Export
            </Button>
          </Tooltip>
          <Tooltip title="View Invoice Statistics">
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <BarChartOutlined className="text-sm" />
              Statistics
            </button>
          </Tooltip>
        </div>
      </div>

      <AdminInvoiceStatisticsModal
        open={showStats}
        onClose={() => setShowStats(false)}
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <div
          className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white border-gray-200"
          onClick={() => { setStatus(""); setPage(1); }}
        >
          <div className="text-xl font-extrabold text-gray-700">{totalAll}</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-0.5">Total</div>
        </div>
        {statusStatCards.map(({ key, label, color }) => (
          <div
            key={key}
            className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${color}`}
            onClick={() => { setStatus(key); setPage(1); }}
          >
            <div className="text-xl font-extrabold">{stats[key] ?? 0}</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Search & Filters bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <AiOutlineSearch className="text-gray-400 text-base flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by invoice no., gateway ref., client name, email, app code..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent text-xs outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MdFilterList className="text-base" />
            Advanced Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-2 p-3 items-center">
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            size="small"
            className="text-xs min-w-[130px]"
            placeholder="All Statuses"
          >
            <Option value="">All Statuses</Option>
            {invoicesStatusOptions.filter(s => s !== "all").map((s) => (
              <Option key={s} value={s}>{normalizeText(s)}</Option>
            ))}
          </Select>

          <Select
            value={paymentFor}
            onChange={(v) => { setPaymentFor(v); setPage(1); }}
            size="small"
            className="text-xs min-w-[160px]"
            placeholder="All Payment Types"
            allowClear
          >
            <Option value="">All Payment Types</Option>
            {paymentForOptions.map((p) => (
              <Option key={p} value={p}>{normalizeText(p)}</Option>
            ))}
          </Select>

          <Select
            value={assigningEntity}
            onChange={(v) => { setAssigningEntity(v); setPage(1); }}
            size="small"
            className="text-xs min-w-[180px]"
            placeholder="All Entities"
            showSearch
            allowClear
            optionFilterProp="children"
          >
            <Option value="">All Entities</Option>
            {entities.map((e: any) => (
              <Option key={e._id || e.id} value={e._id || e.id}>{e.name}</Option>
            ))}
          </Select>

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-gray-500">{paginationInfo?.total ?? 0} total</span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={invoices}
          loading={isLoading || isFetching}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1760, y: "60vh" }}
          size="small"
          rowClassName={(record, index) => {
            const base = index % 2 === 0 ? "bg-white" : "bg-gray-50/30";
            if (record.status === "void") return `${base} opacity-60`;
            return base;
          }}
        />

        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Showing{" "}
            {paginationInfo?.total
              ? Math.min((page - 1) * limit + 1, paginationInfo.total)
              : 0}{" "}
            to {Math.min(page * limit, paginationInfo?.total ?? 0)} of{" "}
            {paginationInfo?.total ?? 0} entries
          </div>
          <Pagination
            current={page}
            total={paginationInfo?.total || 0}
            pageSize={limit}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceRegistry;
