import { useState, useRef, useEffect, useCallback } from "react";
import LeafletMap, { type MarkerData } from "../../components/LeafletMap";
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
  Tabs,
  InputNumber,
  Dropdown,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import { useGetPermitsWithCoordinatesQuery } from "../../redux/features/revenue/permitGeoApi";
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
  MoreOutlined,
  BellOutlined,
  CalendarFilled,
} from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  useGetAdminPermitRegistryQuery,
  useAdminReverseIssuanceMutation,
} from "../../redux/features/general/client-applications";
import { formatDate2, handleDocumentView, normalizeText } from "../../utils/helperFunction";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import {
  issuedPermitTypes,
  issuedStatuses,
} from "@/employee_portal_pages/lib/helpers";
import axios from "axios";
import Swal from "sweetalert2";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSocket } from "../../context/SocketContext";
import { Progress } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;

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
  { key: "ACTIVE", label: "Active", color: "text-green-600 bg-green-50 border-green-200" },
  { key: "PENDING", label: "Pending", color: "text-gray-600 bg-gray-50 border-gray-200" },
  { key: "EXPIRED", label: "Expired", color: "text-red-600 bg-red-50 border-red-200" },
  { key: "REVOKED", label: "Revoked", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { key: "SUSPENDED", label: "Suspended", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
];

const PermitRegistry = () => {
  PageTitle("Permit Registry | EPA Ghana Admin");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [permitType, setPermitType] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [resigningAll, setResigningAll] = useState(false);
  const [resigningPermitId, setResigningPermitId] = useState<string | null>(null);
  const [settingIssueDateId, setSettingIssueDateId] = useState<string | null>(null);
  const [resendingNotifId, setResendingNotifId] = useState<string | null>(null);
  const { socket } = useSocket();
  const [bulkJobOpen, setBulkJobOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    done: number; total: number; percentage: number;
    current: string; status: "running" | "complete" | "error";
    fixed?: number; failed?: number; log: string[];
  }>({ done: 0, total: 0, percentage: 0, current: "", status: "running", log: [] });
  const [editCertModalOpen, setEditCertModalOpen] = useState(false);
  const [editCertRecord, setEditCertRecord] = useState<any>(null);
  const [editCertSaving, setEditCertSaving] = useState(false);
  const [editCertScheduleFile, setEditCertScheduleFile] = useState<File | null>(null);
  const [editCertForm] = Form.useForm();
  const [mapView, setMapView] = useState(false);
  const [focusedPermitIndex, setFocusedPermitIndex] = useState<number | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [coordLat, setCoordLat] = useState<number | null>(null);
  const [coordLng, setCoordLng] = useState<number | null>(null);
  const [savingCoords, setSavingCoords] = useState(false);
  const { user, csrfToken } = useSelector((state: RootState) => state.auth) as any;
  const isAdmin = user?.type?.toUpperCase() === "ADMIN";
  const [reverseIssuance, { isLoading: isReversing }] = useAdminReverseIssuanceMutation();

  const { data: geoPermits = [] } = useGetPermitsWithCoordinatesQuery(undefined, { skip: !mapView });

  const filteredGeoPermits = geoPermits.filter((p: any) => {
    if (!mapSearch) return true;
    const q = mapSearch.toLowerCase();
    return (
      (p.permitNumber || "").toLowerCase().includes(q) ||
      (p.companyName || getClientName(p.clientId) || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (focusedPermitIndex === null) return;
    const el = cardRefs.current[focusedPermitIndex];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [focusedPermitIndex]);

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
  } = useGetAdminPermitRegistryQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      status,
      permitType,
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

  const permits = response?.data || [];
  const stats = response?.stats || {};
  const paginationInfo = response?.pagination;

  const handleResetFilters = () => {
    setStatus("");
    setPermitType("");
    setAssigningEntity("");
    setDateRange(null);
    setDateFilterType("issueDate");
    setPage(1);
  };

  const handleViewPermitSchedule = async (permitId: string, isSigned = false) => {
    const fileType = isSigned ? "signedSchedule" : "schedule";
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/permit-schedule-pdf?certificateId=${permitId}&fileType=${fileType}`,
        { withCredentials: true, responseType: "blob" }
      );
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Unable to fetch permit schedule.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  const handleResignAllCertificates = async () => {
    const confirm = await Swal.fire({
      title: "Re-sign all active certificates?",
      text: "This will regenerate the signed schedule PDF for all ACTIVE environmental permits using the original signatory. Use this to fix the regulation text (LI 2504).",
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
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/resign-all-active-certificates`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      const { resigned, failed, skipped, details } = response.data;
      Swal.fire({
        title: `Done — ${resigned} re-signed${failed > 0 ? `, ${failed} failed` : ""}${skipped > 0 ? `, ${skipped} skipped` : ""}`,
        html: details
          .map((d: any) => `<div class="text-xs text-left">${d.permitNumber || d.permitId} — <b style="color:${d.status === 'ok' ? 'green' : d.status === 'skipped' ? 'orange' : 'red'}">${d.status}</b>${d.error ? `: ${d.error}` : ""}</div>`)
          .join(""),
        icon: failed > 0 ? "warning" : "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Failed to re-sign certificates.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setResigningAll(false);
    }
  };

  const handleResignSinglePermit = async (record: any) => {
    const confirm = await Swal.fire({
      title: `Re-sign permit?`,
      html: `<p style="font-size:13px;color:#555">Re-sign <strong>${record.permitNumber}</strong> using the original signatory. This will regenerate the permit PDF with the CEO signature.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Yes, re-sign",
    });
    if (!confirm.isConfirmed) return;

    setResigningPermitId(record._id);
    try {
      await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/resign-single-certificate`,
        { permitId: record._id },
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      Swal.fire({
        title: "Re-signed",
        text: `${record.permitNumber} has been re-signed successfully.`,
        icon: "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Failed to re-sign this permit.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setResigningPermitId(null);
    }
  };

  const handleSetIssueDate = async (record: any) => {
    setSettingIssueDateId(record._id);
    try {
      await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/set-issue-date`,
        { permitId: record._id },
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      Swal.fire({
        title: "Done",
        text: `Issue date set for ${record.permitNumber}.`,
        icon: "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Failed to set issue date.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setSettingIssueDateId(null);
    }
  };

  const handleResendNotification = async (record: any) => {
    const confirm = await Swal.fire({
      title: "Resend notification?",
      html: `<p style="font-size:13px;color:#555">Resend the "permit issued" email/SMS to the client for <strong>${record.permitNumber}</strong>.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Yes, resend",
    });
    if (!confirm.isConfirmed) return;

    setResendingNotifId(record._id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/resend-notification`,
        { permitId: record._id },
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      Swal.fire({
        title: "Sent",
        text: response.data.message || "Notification resent successfully.",
        icon: "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Failed to resend notification.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setResendingNotifId(null);
    }
  };

  // Socket listener for bulk job progress
  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      if (data.status === "complete") {
        setBulkProgress((p) => ({
          ...p,
          done: data.total,
          total: data.total,
          percentage: 100,
          status: "complete",
          fixed: data.fixed,
          failed: data.failed,
          current: "Done",
        }));
        return;
      }
      if (data.status === "fatal_error") {
        setBulkProgress((p) => ({ ...p, status: "error", current: data.error || "Fatal error" }));
        return;
      }
      setBulkProgress((p) => ({
        ...p,
        done: data.done,
        total: data.total,
        percentage: data.percentage,
        current: data.permitNumber || "",
        status: "running",
        log: [
          `${data.done}/${data.total} — ${data.permitNumber} — ${data.status === "ok" ? "✓" : "✗ " + (data.error || "")}`,
          ...p.log.slice(0, 49),
        ],
      }));
    };
    socket.on("bulk_cert_progress", handler);
    return () => { socket.off("bulk_cert_progress", handler); };
  }, [socket]);

  const handleBulkFixPending = async () => {
    const confirm = await Swal.fire({
      title: "Fix all pending environmental permits?",
      html: `<p style="font-size:13px;color:#555">This will set <strong>issueDate</strong> and regenerate the PDF (with validity period) for <strong>all PENDING/DRAFT environmental certificates</strong>.<br/><br/>The job runs in the background — you can monitor progress here.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Start bulk fix",
    });
    if (!confirm.isConfirmed) return;

    setBulkProgress({ done: 0, total: 0, percentage: 0, current: "Starting…", status: "running", log: [] });
    setBulkJobOpen(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}certificate/bulk-fix-pending`,
        {},
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } },
      );
      setBulkProgress((p) => ({ ...p, total: res.data.total, current: "Processing…" }));
    } catch (err: any) {
      setBulkProgress((p) => ({
        ...p, status: "error",
        current: err?.response?.data?.error || "Failed to start job",
      }));
    }
  };

  const openEditCertModal = useCallback((record: any) => {
    setEditCertRecord(record);
    setEditCertScheduleFile(null);
    editCertForm.setFieldsValue({
      permitNumber: record.permitNumber || "",
      companyName: record.companyName || "",
      projectDescription: record.projectDescription || "",
      validityStartDate: record.validityStartDate ? dayjs(record.validityStartDate) : null,
      validityEndDate: record.validityEndDate ? dayjs(record.validityEndDate) : null,
      issueDate: record.issueDate ? dayjs(record.issueDate) : null,
      signatoryName: record.signatoryName || "",
      signatoryTitle: record.signatoryTitle || "",
    });
    setEditCertModalOpen(true);
  }, [editCertForm]);

  const handleEditCertSave = async () => {
    let values: any;
    try {
      values = await editCertForm.validateFields();
    } catch {
      return;
    }

    setEditCertSaving(true);
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName || "");
      formData.append("projectDescription", values.projectDescription || "");
      formData.append("validityStartDate", values.validityStartDate.toISOString());
      formData.append("validityEndDate", values.validityEndDate.toISOString());
      if (values.issueDate) formData.append("issueDate", values.issueDate.toISOString());
      if (values.signatoryName) formData.append("signatoryName", values.signatoryName);
      if (values.signatoryTitle) formData.append("signatoryTitle", values.signatoryTitle);
      if (values.permitNumber) formData.append("permitNumber", values.permitNumber);
      if (editCertScheduleFile) formData.append("file", editCertScheduleFile);

      await axios.patch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}certificate/admin-edit/${editCertRecord._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "x-csrf-token": csrfToken, "Content-Type": "multipart/form-data" },
        }
      );

      setEditCertModalOpen(false);
      Swal.fire({ title: "Saved", text: "Certificate updated and PDF regenerated.", icon: "success", confirmButtonColor: "#727cf5" });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || error?.response?.data?.message || "Failed to update certificate.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setEditCertSaving(false);
    }
  };

  const handleRegenerateAllPdfs = async () => {
    const confirm = await Swal.fire({
      title: "Regenerate all pending PDFs?",
      text: "This will regenerate the PDF for all DRAFT/PENDING permits and environmental certificates.",
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
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/regenerate-all-pending-pdfs`,
        {},
        {
          withCredentials: true,
          headers: { "x-csrf-token": csrfToken },
        }
      );
      const { regenerated, failed, details } = response.data;
      Swal.fire({
        title: `Done — ${regenerated} regenerated${failed > 0 ? `, ${failed} failed` : ""}`,
        html: details
          .map((d: any) => `<div class="text-xs text-left">${d.permitNumber || d.permitId} — <b style="color:${d.status === 'ok' ? 'green' : 'red'}">${d.status}</b>${d.error ? `: ${d.error}` : ""}</div>`)
          .join(""),
        icon: failed > 0 ? "warning" : "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Failed to regenerate PDFs.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    } finally {
      setRegeneratingAll(false);
    }
  };

  const handleViewPDF = async (permitId: string, productId?: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}general/permit-pdf?permitId=${permitId}&productId=${productId || ""}`,
        { withCredentials: true, responseType: "blob" }
      );
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Unable to fetch permit PDF.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  const handleReverseIssuance = async (record: any) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Reverse Issuance",
      html: `
        <p style="font-size:13px;color:#555;margin-bottom:12px">
          This will revert <strong>${record.permitNumber}</strong> from
          <span style="color:#f59e0b;font-weight:600">${record.status}</span> back to
          <strong>DRAFT</strong> and return the assignment to <strong>review_issuance</strong> stage.
        </p>
        <p style="font-size:12px;color:#888;margin-bottom:8px">Please provide a reason for this reversal:</p>
      `,
      input: "textarea",
      inputPlaceholder: "e.g. Wrong permit type was selected, needs correction...",
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
      await reverseIssuance({ permitId: record._id, reason: reason.trim() }).unwrap();
      Swal.fire({
        title: "Reversed",
        text: "The permit has been set back to DRAFT and the assignment returned to review_issuance.",
        icon: "success",
        confirmButtonColor: "#727cf5",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Reversal Failed",
        text: error?.data?.error || error?.data?.message || "Unable to reverse the issuance.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  const handleSaveCoordinates = async () => {
    if (!selectedRecord || coordLat == null || coordLng == null) return;
    setSavingCoords(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE}permit/coordinates/${selectedRecord._id}`,
        { latitude: coordLat, longitude: coordLng },
        { withCredentials: true, headers: { "x-csrf-token": csrfToken } }
      );
      setSelectedRecord({ ...selectedRecord, latitude: coordLat, longitude: coordLng });
      Swal.fire({ title: "Saved", text: "Coordinates updated.", icon: "success", confirmButtonColor: "#727cf5" });
    } catch (error: any) {
      Swal.fire({ title: "Error", text: error?.response?.data?.error || "Failed to save coordinates.", icon: "error", confirmButtonColor: "#727cf5" });
    } finally {
      setSavingCoords(false);
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
      title: "Permit Details",
      key: "details",
      width: 320,
      render: (_: any, record: any) => (
        <div className="flex items-start gap-2 py-0.5">
          <div className="flex-shrink-0 w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-extrabold border border-emerald-200 mt-0.5">
            <FileDoneOutlined />
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip
              title={`${record.permitNumber || "N/A"} — ${normalizeText(record.permitType || "")}`}
              placement="topLeft"
            >
              <p className="text-xs font-semibold text-gray-900 leading-tight truncate w-full font-mono">
                {record.permitNumber || "N/A"}
              </p>
            </Tooltip>
            <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 truncate w-full">
              {getClientName(record.clientId)}
            </p>
            <div className="flex gap-2 items-center mt-1 flex-wrap">
              <Tag
                color="cyan"
                className="text-[9px] font-semibold uppercase m-0 leading-tight"
              >
                {normalizeText(record.permitType || "N/A")}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Issuing Entity",
      key: "entity",
      width: 180,
      render: (_: any, record: any) => (
        <Tooltip title={record.assigningEntity?.name}>
          <span className="text-xs text-gray-600 truncate block max-w-[170px]">
            {record.assigningEntity?.name || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Date of Issue",
      key: "issueDate",
      width: 130,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <CalendarOutlined className="text-gray-400" />
          {formatDate2(record.issueDate) || "N/A"}
        </div>
      ),
    },
    {
      title: "Expiry Date",
      key: "expiryDate",
      width: 130,
      render: (_: any, record: any) => {
        const isExpired = record.expiryDate && new Date(record.expiryDate) < new Date();
        return (
          <div className={`flex items-center gap-1 text-xs ${isExpired ? "text-red-500" : "text-gray-500"}`}>
            <CalendarOutlined className={isExpired ? "text-red-400" : "text-gray-400"} />
            {formatDate2(record.expiryDate) || "N/A"}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_: any, record: any) => {
        const s = issuedStatuses[record.status] || issuedStatuses.DEFAULT;
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
            setCoordLat(record.latitude ?? null);
            setCoordLng(record.longitude ?? null);
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
      width: 130,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: any) => {
        const adminMenuItems: any[] = [];

        if (isAdmin && record.permitType === "environmental_permit") {
          adminMenuItems.push({
            key: "edit",
            label: (
              <span className="flex items-center gap-2 text-[12px]">
                <FileTextOutlined className="text-slate-500" />
                Edit certificate
              </span>
            ),
            onClick: () => openEditCertModal(record),
          });
        }

        if (isAdmin && record.permitType === "environmental_permit" && record.status === "ACTIVE") {
          adminMenuItems.push({
            key: "resign",
            label: (
              <span className="flex items-center gap-2 text-[12px]">
                <SyncOutlined spin={resigningPermitId === record._id} className="text-emerald-600" />
                Re-sign permit
              </span>
            ),
            onClick: () => handleResignSinglePermit(record),
            disabled: resigningPermitId === record._id,
          });
          adminMenuItems.push({
            key: "resend",
            label: (
              <span className="flex items-center gap-2 text-[12px]">
                <BellOutlined className="text-blue-500" />
                {resendingNotifId === record._id ? "Sending…" : "Resend notification"}
              </span>
            ),
            onClick: () => handleResendNotification(record),
            disabled: resendingNotifId === record._id,
          });
        }

        if (isAdmin && ["PENDING", "DRAFT"].includes(record.status) && record.permitType === "environmental_permit" && !record.issueDate) {
          adminMenuItems.push({
            key: "setissue",
            label: (
              <span className="flex items-center gap-2 text-[12px]">
                <CalendarFilled className="text-violet-500" />
                {settingIssueDateId === record._id ? "Setting…" : "Set issue date"}
              </span>
            ),
            onClick: () => handleSetIssueDate(record),
            disabled: settingIssueDateId === record._id,
          });
        }

        if (isAdmin && ["PENDING", "DRAFT", ""].includes(record.status)) {
          adminMenuItems.push({
            key: "reverse",
            label: (
              <span className="flex items-center gap-2 text-[12px]">
                <RollbackOutlined className="text-amber-600" />
                Reverse issuance
              </span>
            ),
            onClick: () => handleReverseIssuance(record),
            disabled: isReversing,
          });
        }

        return (
          <Space size={4}>
            <Tooltip title="View Permit PDF">
              <button
                onClick={() => handleViewPDF(record._id, record.productId)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-600 border border-red-300 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaFilePdf className="text-[10px]" />
                PDF
              </button>
            </Tooltip>
            {(record.schedulePdfUrl || record.signedSchedulePdfUrl) && (
              <Tooltip title={record.signedSchedulePdfUrl ? "View Signed Schedule" : "View Schedule"}>
                <button
                  onClick={() => handleViewPermitSchedule(record._id, !!record.signedSchedulePdfUrl)}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-700 border border-red-400 rounded hover:bg-red-700 hover:text-white transition-colors"
                >
                  <FaFilePdf className="text-[10px]" />
                  Sched.
                </button>
              </Tooltip>
            )}
            {isAdmin && adminMenuItems.length > 0 && (
              <Dropdown
                menu={{ items: adminMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="flex items-center justify-center w-7 h-7 border border-slate-300 rounded hover:bg-slate-100 transition-colors">
                  <MoreOutlined className="text-slate-600 text-[14px]" />
                </button>
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

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
        open={showFilters}
        onClose={() => setShowFilters(false)}
        width={340}
      >
        <div className="space-y-5">

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Status</p>
            <Select
              value={status || "all"}
              onChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}
              className="w-full"
            >
              <Option value="all">All Statuses</Option>
              <Option value="ACTIVE">Active</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="EXPIRED">Expired</Option>
              <Option value="REVOKED">Revoked</Option>
              <Option value="SUSPENDED">Suspended</Option>
              <Option value="DRAFT">Draft</Option>
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Permit Type</p>
            <Select
              value={permitType || "all"}
              onChange={(v) => { setPermitType(v === "all" ? "" : v); setPage(1); }}
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              <Option value="all">All Permit Types</Option>
              {issuedPermitTypes.map((type) => (
                <Option key={type} value={type}>
                  {normalizeText(type)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Issuing Entity</p>
            <Select
              value={assigningEntity || "all"}
              onChange={(v) => { setAssigningEntity(v === "all" ? "" : v); setPage(1); }}
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              <Option value="all">All Entities</Option>
              {entities.map((e: any) => (
                <Option key={e.id || e._id} value={e.id || e._id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Date Filter Type</p>
            <Select
              value={dateFilterType}
              onChange={(v) => setDateFilterType(v)}
              className="w-full"
            >
              <Option value="issueDate">Issue Date</Option>
              <Option value="expiryDate">Expiry Date</Option>
              <Option value="createdAt">Created Date</Option>
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Date Range</p>
            <RangePicker
              className="w-full"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
            />
          </div>
        </div>
      </Drawer>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Permit Registry</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Admin-wide view of all issued permits across entities
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <>
              <Tooltip title="Re-sign all ACTIVE environmental certificates (fixes regulation text LI 2504 + schedule)">
                <button
                  onClick={handleResignAllCertificates}
                  disabled={resigningAll}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  <SyncOutlined spin={resigningAll} />
                  {resigningAll ? "Re-signing..." : "Re-sign Certificates"}
                </button>
              </Tooltip>
              <Tooltip title="Regenerate PDFs for all DRAFT/PENDING permits with logo issues">
                <button
                  onClick={handleRegenerateAllPdfs}
                  disabled={regeneratingAll}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded shadow-sm hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  <SyncOutlined spin={regeneratingAll} />
                  {regeneratingAll ? "Regenerating..." : "Regenerate PDFs"}
                </button>
              </Tooltip>
              <Tooltip title="Set issue date + regenerate PDF for ALL pending environmental certificates in one shot">
                <button
                  onClick={handleBulkFixPending}
                  className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded shadow-sm hover:bg-violet-700 transition-all text-sm font-medium"
                >
                  <CalendarFilled />
                  Fix All Pending
                </button>
              </Tooltip>
            </>
          )}
          <button
            onClick={() => setMapView((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm transition-all text-sm font-medium border ${mapView ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            🗺 Map View
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <MdFilterList /> Advanced Filters
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {statusStatCards.map((s) => (
          <button
            key={s.key}
            onClick={() => { setStatus(status === s.key ? "" : s.key); setPage(1); }}
            className={`rounded-lg border p-3 text-left transition-all hover:shadow-md ${s.color} ${status === s.key ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            <p className="text-xl font-bold">{(stats as any)[s.key] ?? 0}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide">{s.label}</p>
          </button>
        ))}
      </div>

      {/* ── Map View ── */}
      {mapView ? (
        <div className="space-y-3">
          {/* Full-width map */}
          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <LeafletMap
              center={[7.9465, -1.0232]}
              showGhanaOnly={true}
              focusIndex={focusedPermitIndex}
              onMarkerClick={(_: MarkerData, idx: number) => setFocusedPermitIndex(idx)}
              height={typeof window !== "undefined" && window.innerWidth < 768 ? 300 : 500}
              markers={filteredGeoPermits.map((p: any) => ({
                lat: Number(p.latitude),
                lng: Number(p.longitude),
                status: p.status,
                popupHtml: `<b style="font-size:12px">${p.permitNumber}</b><br/><span style="font-size:11px">${p.companyName || getClientName(p.clientId)}</span><br/><span style="font-size:10px;color:#666">${p.status}</span>`,
              }))}
            />
          </div>

          {/* Search + count */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search permit no. or company..."
                className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={mapSearch}
                onChange={(e) => { setMapSearch(e.target.value); setFocusedPermitIndex(null); }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {filteredGeoPermits.length} of {geoPermits.length} permit{geoPermits.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Horizontal card strip */}
          {filteredGeoPermits.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x scroll-smooth flex-nowrap">
              {filteredGeoPermits.map((p: any, idx: number) => {
                const isFocused = focusedPermitIndex === idx;
                const statusColors: Record<string, string> = {
                  ACTIVE: "bg-green-100 text-green-700",
                  EXPIRED: "bg-red-100 text-red-700",
                  SUSPENDED: "bg-orange-100 text-orange-700",
                };
                const sc = statusColors[p.status] || "bg-gray-100 text-gray-600";
                return (
                  <div
                    key={p._id}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    onClick={() => setFocusedPermitIndex(isFocused ? null : idx)}
                    className={`flex-shrink-0 w-64 cursor-pointer rounded-xl border-2 p-3 transition-all snap-start ${
                      isFocused
                        ? "border-emerald-600 shadow-lg bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900 font-mono leading-tight">{p.permitNumber}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc}`}>{p.status}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 truncate mb-2">{p.companyName || getClientName(p.clientId)}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{Number(p.latitude).toFixed(5)}°N</span>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{Number(p.longitude).toFixed(5)}°E</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
      <>
      {/* ── Table Card ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Show</span>
            <Select
              value={limit}
              onChange={(val) => { setLimit(val); setPage(1); }}
              className="w-20"
              size="small"
            >
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span className="text-sm font-medium text-gray-600">entries</span>
          </div>

          <div className="relative w-full md:w-80">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search by permit no., type or holder..."
              className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={permits}
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
      </>
      )}
    </div>

    {/* Reports Drawer */}
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">
            Permit Details & Reports
          </span>
        </div>
      }
      placement="right"
      width={500}
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
    >
      {selectedRecord && (
        <Tabs
          defaultActiveKey="details"
          items={[
            {
              key: "details",
              label: "Details",
              children: (
                <div className="space-y-6">
                  <Card className="bg-gray-50 border-none shadow-none rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                          Permit No.
                        </div>
                        <div className="text-lg font-bold text-gray-900 leading-tight">
                          {selectedRecord.permitNumber}
                        </div>
                        <Tag color="cyan" className="mt-2 text-[10px] font-bold">
                          {normalizeText(selectedRecord.permitType || "N/A")}
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
                      <Col span={selectedRecord.schedulePdfUrl || selectedRecord.signedSchedulePdfUrl ? 12 : 24}>
                        <Button
                          block
                          icon={<ExportOutlined />}
                          className="text-[11px] font-bold border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center gap-2 h-10 rounded-lg"
                          onClick={() => handleViewPDF(selectedRecord._id, selectedRecord.productId)}
                        >
                          View Permit
                        </Button>
                      </Col>
                      {(selectedRecord.schedulePdfUrl || selectedRecord.signedSchedulePdfUrl) && (
                        <Col span={12}>
                          <Button
                            block
                            icon={<ExportOutlined />}
                            className="text-[11px] font-bold border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center gap-2 h-10 rounded-lg"
                            onClick={() => handleViewPermitSchedule(selectedRecord._id, !!selectedRecord.signedSchedulePdfUrl)}
                          >
                            View Schedule
                          </Button>
                        </Col>
                      )}
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
              ),
            },
            ...(isAdmin ? [{
              key: "location",
              label: "📍 Location",
              children: (
                <div className="space-y-4">
                  {/* Current saved coords */}
                  {selectedRecord.latitude != null && selectedRecord.longitude != null && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 font-medium flex items-center gap-2">
                      <span>📍</span>
                      <span>
                        {Math.abs(Number(selectedRecord.latitude)).toFixed(6)}°{Number(selectedRecord.latitude) >= 0 ? "N" : "S"},&nbsp;
                        {Math.abs(Number(selectedRecord.longitude)).toFixed(6)}°{Number(selectedRecord.longitude) >= 0 ? "E" : "W"}
                      </span>
                    </div>
                  )}

                  {/* Helper */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 leading-relaxed">
                    <strong>Format from schedule :</strong><br/>
                    N = positive latitude &nbsp;·&nbsp; S = negative latitude<br/>
                    E = positive longitude &nbsp;·&nbsp; W = <strong>negative</strong> longitude<br/>
                    <span className="mt-1 block text-amber-700">Ex: <code>N5.70352° / W0.01508°</code> → Lat <code>5.70352</code>, Long <code>-0.01508</code></span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Latitude <span className="font-normal text-gray-400">(N = + , S = −)</span></p>
                      <InputNumber
                        value={coordLat}
                        onChange={(v) => setCoordLat(v)}
                        min={-90}
                        max={90}
                        step={0.000001}
                        precision={6}
                        className="w-full"
                        placeholder="e.g. 5.70352"
                        status={coordLat == null ? "warning" : undefined}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Longitude <span className="font-normal text-gray-400">(E = + , W = −)</span></p>
                      <InputNumber
                        value={coordLng}
                        onChange={(v) => setCoordLng(v)}
                        min={-180}
                        max={180}
                        step={0.000001}
                        precision={6}
                        className="w-full"
                        placeholder="e.g. -0.01508  (W → negative)"
                        status={coordLng == null ? "warning" : undefined}
                      />
                    </div>
                    <Button
                      type="primary"
                      block
                      loading={savingCoords}
                      onClick={() => {
                        if (coordLat == null || coordLng == null) {
                          Swal.fire({ title: "Missing coordinates", text: "Please fill both Latitude and Longitude.", icon: "warning", confirmButtonColor: "#1b5e20" });
                          return;
                        }
                        handleSaveCoordinates();
                      }}
                      className="mt-2 bg-emerald-700 border-emerald-700 hover:bg-emerald-800"
                    >
                      💾 Save Coordinates
                    </Button>
                  </div>

                  {coordLat != null && coordLng != null && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Map Preview</p>
                      <LeafletMap
                        center={[coordLat, coordLng]}
                        zoom={15}
                        height={260}
                        markers={[{
                          lat: coordLat,
                          lng: coordLng,
                          color: "#1b5e20",
                          popupHtml: `<b>${selectedRecord?.permitNumber || ""}</b><br/><small>${coordLat.toFixed(5)}, ${coordLng.toFixed(5)}</small>`,
                        }]}
                      />
                    </div>
                  )}
                </div>
              ),
            }] : []),
          ]}
        />
      )}
    </Drawer>

    {/* ── Bulk Fix Progress Modal ── */}
    <Modal
      open={bulkJobOpen}
      onCancel={() => { if (bulkProgress.status !== "running") setBulkJobOpen(false); }}
      title={
        <span className="font-bold text-slate-800">
          Fix All Pending Environmental Certificates
        </span>
      }
      width={560}
      footer={
        bulkProgress.status !== "running" ? (
          <Button onClick={() => setBulkJobOpen(false)}>Close</Button>
        ) : null
      }
      closable={bulkProgress.status !== "running"}
      maskClosable={false}
    >
      <div className="py-4 space-y-4">
        <Progress
          percent={bulkProgress.percentage}
          status={
            bulkProgress.status === "complete" ? "success"
            : bulkProgress.status === "error" ? "exception"
            : "active"
          }
          strokeColor={bulkProgress.status === "running" ? "#727cf5" : undefined}
        />

        <div className="flex justify-between text-sm text-slate-600">
          <span>
            {bulkProgress.status === "complete"
              ? `Done — ${bulkProgress.fixed} fixed, ${bulkProgress.failed} failed`
              : bulkProgress.status === "error"
              ? `Error: ${bulkProgress.current}`
              : `Processing ${bulkProgress.done} / ${bulkProgress.total || "…"}`}
          </span>
          {bulkProgress.status === "running" && (
            <span className="text-slate-400 text-xs truncate max-w-[220px]">
              {bulkProgress.current}
            </span>
          )}
        </div>

        {bulkProgress.log.length > 0 && (
          <div className="bg-slate-900 rounded p-3 max-h-48 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-0.5">
            {bulkProgress.log.map((line, i) => (
              <div key={i} className={line.includes("✗") ? "text-red-400" : "text-emerald-400"}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>

    {/* ── Admin Edit Certificate Modal ── */}
    <Modal
      open={editCertModalOpen}
      onCancel={() => { if (!editCertSaving) setEditCertModalOpen(false); }}
      title={<span className="font-bold text-slate-800">Edit Environmental Certificate</span>}
      width={640}
      footer={[
        <Button key="cancel" onClick={() => setEditCertModalOpen(false)} disabled={editCertSaving}>Cancel</Button>,
        <Button
          key="save"
          type="primary"
          loading={editCertSaving}
          onClick={handleEditCertSave}
          style={{ backgroundColor: "#727cf5" }}
        >
          Save & Regenerate PDF
        </Button>,
      ]}
      destroyOnClose
    >
      <Spin spinning={editCertSaving} tip="Regenerating PDF…">
        <Form form={editCertForm} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="permitNumber" label="Permit Number">
              <Input placeholder="EPA/..." />
            </Form.Item>
            <Form.Item
              name="issueDate"
              label="Date of Issue"
            >
              <DatePicker className="w-full" suffixIcon={<CalendarOutlined />} />
            </Form.Item>
          </div>

          <Form.Item
            name="companyName"
            label="Company Name / Holder"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Company name" />
          </Form.Item>

          <Form.Item
            name="projectDescription"
            label="Project Description"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.TextArea rows={3} placeholder="Project description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="validityStartDate"
              label="Validity Start Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker className="w-full" suffixIcon={<CalendarOutlined />} />
            </Form.Item>
            <Form.Item
              name="validityEndDate"
              label="Validity End Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker className="w-full" suffixIcon={<CalendarOutlined />} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="signatoryName" label="Signatory Name">
              <Input placeholder="e.g., PROF. NANA AMA BROWNE KLUTSE" />
            </Form.Item>
            <Form.Item name="signatoryTitle" label="Signatory Title">
              <Input placeholder="e.g., AG. CHIEF EXECUTIVE OFFICER" />
            </Form.Item>
          </div>

          <Form.Item label="Replace Schedule PDF (optional)">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setEditCertScheduleFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-600"
            />
            {editCertScheduleFile && (
              <p className="text-xs text-emerald-600 mt-1">{editCertScheduleFile.name} selected</p>
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
    </>
  );
};

export default PermitRegistry;
