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
  Badge,
  DatePicker,
  Button,
  Card,
  Col,
  Empty,
  Row,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";
import {
  FileDoneOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ExportOutlined,
  SyncOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import {
  useGetAdminLicenseRegistryQuery,
  useAdminReverseLicenseIssuanceMutation,
} from "../../redux/features/general/client-applications";
import { formatDate2, handleDocumentView, normalizeText } from "../../utils/helperFunction";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import {
  issuedStatuses,
  VALID_LICENSE_TYPES,
} from "@/employee_portal_pages/lib/helpers";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import axios from "axios";
import Swal from "sweetalert2";
import type { Dayjs } from "dayjs";

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

const statusStatCards = [
  { key: "active", label: "Active", color: "text-green-600 bg-green-50 border-green-200" },
  { key: "pending", label: "Pending", color: "text-gray-600 bg-gray-50 border-gray-200" },
  { key: "expired", label: "Expired", color: "text-red-600 bg-red-50 border-red-200" },
  { key: "revoked", label: "Revoked", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { key: "suspended", label: "Suspended", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
];

const LicenseRegistry = () => {
  PageTitle("License Registry | EPA Ghana Admin");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [resigningAll, setResigningAll] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth) as any;
  const isAdmin = user?.type?.toUpperCase() === "ADMIN";
  const [reverseIssuance, { isLoading: isReversing }] = useAdminReverseLicenseIssuanceMutation();
  const getCsrf = () => {
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const expiryDateStart = dateFilterType === "expiryDate" ? startDateVal : "";
  const expiryDateEnd = dateFilterType === "expiryDate" ? endDateVal : "";

  const { data: entitiesData } = useEntityFullListQuery({ designation: "" });
  const entities = entitiesData?.data || [];

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminLicenseRegistryQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      status,
      licenseType,
      assigningEntity,
      startDate,
      endDate,
      issueDateStart,
      issueDateEnd,
      expiryDateStart,
      expiryDateEnd,
    },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true }
  );

  const licenses = response?.data || [];
  const stats = response?.stats || {};
  const paginationInfo = response?.pagination;

  const handleResetFilters = () => {
    setStatus("");
    setLicenseType("");
    setAssigningEntity("");
    setDateRange(null);
    setDateFilterType("issueDate");
    setPage(1);
  };

  const handleViewPDF = async (licenseId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/license-pdf?licenseId=${licenseId}`,
        { withCredentials: true, responseType: "blob" }
      );
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Unable to fetch license PDF.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  const handleRegenerateAllPdfs = async () => {
    const confirm = await Swal.fire({
      title: "Regenerate all pending PDFs?",
      text: "This will regenerate the PDF for all DRAFT/PENDING licenses.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Yes, regenerate",
    });
    if (!confirm.isConfirmed) return;
    setRegeneratingAll(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}license/regenerate-all-pending-pdfs`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": getCsrf() } }
      );
      const { regenerated, failed, details } = response.data;
      Swal.fire({
        title: `Done — ${regenerated} regenerated${failed > 0 ? `, ${failed} failed` : ""}`,
        html: details
          .map((d: any) => `<div class="text-xs text-left">${d.licenseNumber || d.licenseId} — <b style="color:${d.status === "ok" ? "green" : "red"}">${d.status}</b>${d.error ? `: ${d.error}` : ""}</div>`)
          .join(""),
        icon: failed > 0 ? "warning" : "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({ title: "Error", text: error?.response?.data?.error || "Failed to regenerate PDFs.", icon: "error", confirmButtonColor: "#727cf5" });
    } finally {
      setRegeneratingAll(false);
    }
  };

  const handleResignAllLicenses = async () => {
    const confirm = await Swal.fire({
      title: "Re-sign all active licenses?",
      text: "This will regenerate the signed PDF for all ACTIVE licenses using the original signatory.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Yes, re-sign all",
    });
    if (!confirm.isConfirmed) return;
    setResigningAll(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}license/resign-all-active-licenses`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": getCsrf() } }
      );
      const { resigned, failed, skipped, details } = response.data;
      Swal.fire({
        title: `Done — ${resigned} re-signed${failed > 0 ? `, ${failed} failed` : ""}${skipped > 0 ? `, ${skipped} skipped` : ""}`,
        html: details
          .map((d: any) => `<div class="text-xs text-left">${d.licenseNumber || d.licenseId} — <b style="color:${d.status === "ok" ? "green" : d.status === "skipped" ? "orange" : "red"}">${d.status}</b>${d.error ? `: ${d.error}` : ""}</div>`)
          .join(""),
        icon: failed > 0 ? "warning" : "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({ title: "Error", text: error?.response?.data?.error || "Failed to re-sign licenses.", icon: "error", confirmButtonColor: "#727cf5" });
    } finally {
      setResigningAll(false);
    }
  };

  const handleReverseIssuance = async (record: any) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Reverse Issuance",
      html: `
        <p style="font-size:13px;color:#555;margin-bottom:12px">
          This will revert <strong>${record.licenseNumber}</strong> from
          <span style="color:#f59e0b;font-weight:600">${record.status}</span> back to
          <strong>DRAFT</strong> and return the assignment to <strong>review_issuance</strong> stage.
        </p>
        <p style="font-size:12px;color:#888;margin-bottom:8px">Please provide a reason for this reversal:</p>
      `,
      input: "textarea",
      inputPlaceholder: "e.g. Wrong license type was selected, needs correction...",
      inputAttributes: { rows: "3" },
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reverse",
      inputValidator: (value) => {
        if (!value || !value.trim()) return "A reason is required.";
        if (value.trim().length < 10) return "Please provide a more descriptive reason (min 10 characters).";
      },
    });
    if (!isConfirmed || !reason) return;
    try {
      await reverseIssuance({ licenseId: record._id, reason: reason.trim() }).unwrap();
      Swal.fire({ title: "Reversed", text: "The license has been set back to DRAFT and the assignment returned to review_issuance.", icon: "success", confirmButtonColor: "#727cf5" });
    } catch (error: any) {
      Swal.fire({ title: "Reversal Failed", text: error?.data?.error || error?.data?.message || "Unable to reverse the issuance.", icon: "error", confirmButtonColor: "#727cf5" });
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
      title: "License Details",
      key: "details",
      width: 320,
      render: (_: any, record: any) => (
        <div className="flex items-start gap-2 py-0.5">
          <div className="flex-shrink-0 w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-extrabold border border-blue-200 mt-0.5">
            <FileDoneOutlined />
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip
              title={`${record.licenseNumber || "N/A"} — ${normalizeText(record.licenseType || "")}`}
              placement="topLeft"
            >
              <p className="text-xs font-semibold text-gray-900 leading-tight truncate w-full font-mono">
                {record.licenseNumber || "N/A"}
              </p>
            </Tooltip>
            <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 truncate w-full">
              {getClientName(record.clientId)}
            </p>
            <div className="flex gap-2 items-center mt-1 flex-wrap">
              <Tag
                color="blue"
                className="text-[9px] font-semibold uppercase m-0 leading-tight"
              >
                {normalizeText(record.licenseType || "N/A")}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Issuing Entity",
      key: "assigningEntity",
      width: 180,
      render: (_: any, record: any) => (
        <Tooltip title={record.assigningEntity?.name}>
          <span className="text-xs text-gray-700 truncate block max-w-[170px]">
            {record.assigningEntity?.name || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Date of Issue",
      key: "issueDate",
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <CalendarOutlined className="text-gray-400 text-[10px]" />
          {formatDate2(record.issueDate)}
        </div>
      ),
    },
    {
      title: "Expiry Date",
      key: "expiryDate",
      width: 120,
      render: (_: any, record: any) => {
        const isPast = record.expiryDate && new Date(record.expiryDate) < new Date();
        return (
          <div className={`flex items-center gap-1 text-xs ${isPast ? "text-red-500 font-semibold" : "text-gray-600"}`}>
            <CalendarOutlined className="text-[10px]" />
            {formatDate2(record.expiryDate)}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_: any, record: any) => {
        const key = record.status?.toUpperCase();
        const s = issuedStatuses[key] || issuedStatuses.DEFAULT;
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
            style={{ color: s.color, backgroundColor: s.bg }}
          >
            {s.icon}
            {s.label}
          </span>
        );
      },
    },
    {
      title: "Reports",
      key: "reports",
      width: 80,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Badge
          count={record.reportDocuments?.length || 0}
          showZero
          color={record.reportDocuments?.length > 0 ? "#1890ff" : "#d9d9d9"}
          className="cursor-pointer"
          onClick={() => {
            setSelectedRecord(record);
            setDrawerVisible(true);
          }}
        >
          <FileTextOutlined style={{ fontSize: "16px", color: "#8c8c8c" }} />
        </Badge>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Tooltip title="View License PDF">
            <button
              onClick={() => handleViewPDF(record._id)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-600 border border-red-300 rounded hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaFilePdf className="text-[11px]" />
              License
            </button>
          </Tooltip>
          {isAdmin && ["PENDING", "DRAFT"].includes(record.status) && (
            <Tooltip title="Reverse issuance back to review stage">
              <button
                onClick={() => handleReverseIssuance(record)}
                disabled={isReversing}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-400 rounded hover:bg-amber-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RollbackOutlined className="text-[11px]" />
                Reverse
              </button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const totalAll = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <>
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
              <Option value="ACTIVE">Active</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="EXPIRED">Expired</Option>
              <Option value="REVOKED">Revoked</Option>
              <Option value="SUSPENDED">Suspended</Option>
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">License Type</p>
            <Select
              value={licenseType}
              onChange={(v) => { setLicenseType(v); setPage(1); }}
              className="w-full"
              size="middle"
              placeholder="All License Types"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              <Option value="">All License Types</Option>
              {VALID_LICENSE_TYPES.map((t) => (
                <Option key={t} value={t}>
                  {normalizeText(t)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Issuing Entity</p>
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
              <Option value="expiryDate">Expiry Date</Option>
              <Option value="createdAt">Created Date</Option>
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
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">License Registry</h1>
          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest font-medium">
            Admin-wide view of all issued licenses across entities
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button
              icon={<SyncOutlined spin={resigningAll} />}
              loading={resigningAll}
              onClick={handleResignAllLicenses}
              className="text-xs font-semibold border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Re-sign Licenses
            </Button>
            <Button
              icon={<SyncOutlined spin={regeneratingAll} />}
              loading={regeneratingAll}
              onClick={handleRegenerateAllPdfs}
              type="primary"
              className="text-xs font-semibold"
            >
              Regenerate PDFs
            </Button>
          </div>
        )}
      </div>

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
            onClick={() => { setStatus(key.toUpperCase()); setPage(1); }}
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
              placeholder="Search by license no., type, holder..."
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
            className="text-xs min-w-[120px]"
            placeholder="All Statuses"
          >
            <Option value="">All Statuses</Option>
            <Option value="ACTIVE">Active</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="EXPIRED">Expired</Option>
            <Option value="REVOKED">Revoked</Option>
            <Option value="SUSPENDED">Suspended</Option>
          </Select>

          <Select
            value={licenseType}
            onChange={(v) => { setLicenseType(v); setPage(1); }}
            size="small"
            className="text-xs min-w-[160px]"
            placeholder="All License Types"
            showSearch
            allowClear
            optionFilterProp="children"
          >
            <Option value="">All License Types</Option>
            {VALID_LICENSE_TYPES.map((t) => (
              <Option key={t} value={t}>{normalizeText(t)}</Option>
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
          dataSource={licenses}
          loading={isLoading || isFetching}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1100, y: "60vh" }}
          size="small"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
          }
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

    {/* Reports Drawer */}
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">
            License Details & Reports
          </span>
        </div>
      }
      placement="right"
      width={500}
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
    >
      {selectedRecord && (
        <div className="space-y-6">
          <Card className="bg-gray-50 border-none shadow-none rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  License No.
                </div>
                <div className="text-lg font-bold text-gray-900 leading-tight">
                  {selectedRecord.licenseNumber}
                </div>
                <Tag color="blue" className="mt-2 text-[10px] font-bold">
                  {normalizeText(selectedRecord.licenseType || "N/A")}
                </Tag>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Expires
                </div>
                <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                  <CalendarOutlined />
                  {formatDate2(selectedRecord.expiryDate)}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b pb-2">
              Reference
            </div>
            <Row gutter={12}>
              <Col span={24}>
                <Button
                  block
                  icon={<ExportOutlined />}
                  className="text-[11px] font-bold border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center gap-2 h-10 rounded-lg"
                  onClick={() => handleViewPDF(selectedRecord._id)}
                >
                  View License
                </Button>
              </Col>
            </Row>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <HistoryOutlined className="text-gray-400" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                  Previous Submissions
                </span>
              </div>
              <Badge
                count={selectedRecord.reportDocuments?.length || 0}
                color="#52c41a"
                className="scale-90"
              />
            </div>

            {!selectedRecord.reportDocuments || selectedRecord.reportDocuments.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400 text-xs">No reports submitted yet.</span>
                }
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {selectedRecord.reportDocuments.map((report: any) => (
                  <Card
                    key={report._id}
                    size="small"
                    className="border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-default group rounded-xl"
                    bodyStyle={{ padding: "12px" }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                          {report.reportType}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          {report.originalname}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-1">
                          <CalendarOutlined />
                          {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <Tooltip title="View Document">
                        <Button
                          icon={<ExportOutlined />}
                          size="small"
                          type="primary"
                          ghost
                          className="rounded-lg h-8 w-8 flex items-center justify-center"
                          onClick={() => handleDocumentView(report)}
                        />
                      </Tooltip>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
    </>
  );
};

export default LicenseRegistry;
