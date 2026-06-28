import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Pagination,
  Select,
  Input,
  Button,
  Breadcrumb,
  Tag,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Divider,
  Row,
  Col,
  Modal,
  DatePicker,
  Result,
  Descriptions,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  FileDoneOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ExportOutlined,
  StopOutlined,
  BellOutlined,
  NotificationOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { formatDate2, formatDate4, formatNumber } from "@/utils/helperFunction";
import {
  invoicesStatusOptions,
  paymentForOptions,
} from "@/employee_portal_pages/lib/helpers";
import {
  useFetchInvoicesQuery,
  useVoidInvoiceMutation,
  useSendPaymentReminderMutation,
  useBulkSendPaymentRemindersMutation,
  useSyncInvoicePaymentStatusQuery,
} from "@/redux/features/employee-portal-api/invoices/invoices-payment-transactions";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useEntityReporteesQuery } from "@/redux/features/employee-portal-api/entityApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import InvoiceStatisticsModal from "@/employee_portal_pages/components/statistics-modals/InvoiceStatisticsModal";
import Swal from "sweetalert2";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { message } from "antd";
import { Dayjs } from "dayjs";
import { useMediaQuery } from "@/employee_portal_pages/hooks/useMediaQuery";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  applicationId: string;
  applicationTitle?: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: "unpaid" | "partially_paid" | "paid" | "overdue" | "void";
  issueDate: string | Date;
  dueDate: string | Date;
  invoiceExpires?: string | Date;
  items: InvoiceItem[];
}

const getInvoiceStatusAntDTag = (
  status: Invoice["status"]
): React.ReactNode => {
  let color = "";
  let icon: React.ReactNode = null;
  const text = status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");

  switch (status) {
    case "paid":
      color = "success";
      icon = <CheckCircleOutlined />;
      break;
    case "partially_paid":
      color = "processing";
      icon = <ClockCircleOutlined />;
      break;
    case "overdue":
      color = "warning";
      icon = <WarningOutlined />;
      break;
    case "void":
      color = "warning";
      icon = <CloseCircleOutlined />;
      break;
    default: // unpaid
      color = "error";
      icon = <FileTextOutlined />;
  }
  return (
    <Tag
      icon={icon}
      color={color}
      className="font-mono text-xs whitespace-nowrap"
    >
      {text}
    </Tag>
  );
};



const Invoices = () => {
  PageTitle("Invoices | IPMS EPA Ghana");

  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const ownEntityId = (employee as any)?.entity?._id || (employee as any)?.entity_id;
  const isCEO =
    (employee as any)?.entity?.designation?.toLowerCase() === "ceo office" ||
    (employee as any)?.entity?.name?.toLowerCase() === "ceo office";

  const { data: allEntitiesResponse } = useEntityFullListQuery({}, { skip: !isCEO });
  const { data: reporteesResponse } = useEntityReporteesQuery(
    { page: 1, limit: 200, searchTerm: "", entity_id: ownEntityId },
    { skip: !ownEntityId || isCEO }
  );
  const reporteeEntities = reporteesResponse?.data || [];
  const ownEntityOption =
    ownEntityId && (employee as any)?.entity?.name
      ? [{ _id: ownEntityId, id: ownEntityId, name: (employee as any)?.entity?.name }]
      : [];
  const entities = isCEO
    ? (allEntitiesResponse?.data || [])
    : [...ownEntityOption, ...reporteeEntities];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("all");
  const [paymentFor, setPaymentFor] = useState("all");
  const [assigningEntity, setAssigningEntity] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);

  const [voidInvoice, { isLoading: isVoiding }] = useVoidInvoiceMutation();
  const [sendPaymentReminder, { isLoading: isSendingReminder }] = useSendPaymentReminderMutation();
  const [bulkSendPaymentReminders, { isLoading: isBulkSending }] = useBulkSendPaymentRemindersMutation();
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [syncInvoiceId, setSyncInvoiceId] = useState<string | null>(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const {
    data: syncData,
    isLoading: isSyncing,
    isFetching: isSyncFetching,
    error: syncError,
    refetch: refetchSync,
  } = useSyncInvoicePaymentStatusQuery(
    { invoiceId: syncInvoiceId! },
    { skip: !syncModalOpen || !syncInvoiceId, refetchOnMountOrArgChange: true }
  );

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  // Map dates based on filter type
  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const paidAtStart = dateFilterType === "paidAt" ? startDateVal : "";
  const paidAtEnd = dateFilterType === "paidAt" ? endDateVal : "";

  const isMobile = useMediaQuery("(max-width: 575px)");

  const handleRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: permitsResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchInvoicesQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      status: status === "all" ? "" : status,
      paymentFor: paymentFor === "all" ? "" : paymentFor,
      assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
      issueDateStart,
      issueDateEnd,
      startDate,
      endDate,
      paidAtStart,
      paidAtEnd,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const fullRegistrations = permitsResponse?.data || [];
  const paginationInfo = permitsResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: invoicesStatusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
      paymentForOptions: [
        { label: "All Payment Types", value: "all" },
        ...paymentForOptions.map((type) => ({
          label: type.replace(/([A-Z])/g, " $1").trim(),
          value: type,
        })),
      ],
      entityOptions: [
        { label: "All Entities", value: "all" },
        ...entities.map((entity: any) => ({
          label: entity.name,
          value: entity.id || entity._id,
        })),
      ],
    }),
    [entities]
  );

  // Sorting handlers
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [sortField, sortOrder]
  );

  // Filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    switch (filterType) {
      case "search":
        setSearchTerm(value);
        setPage(1);
        break;
      case "status":
        setStatus(value);
        setPage(1);
        break;
      case "paymentFor":
        setPaymentFor(value);
        setPage(1);
        break;
      case "assigningEntity":
        setAssigningEntity(value);
        setPage(1);
        break;
      case "dateRange":
        setDateRange([value[0], value[1]]);
        setPage(1);
        break;
      case "dateFilterType":
        setDateFilterType(value);
        setPage(1);
        break;
      default:
        break;
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("all");
    setPaymentFor("all");
    setAssigningEntity("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setDateRange(null);
    setDateFilterType("issueDate");
    setPage(1);
  }, []);

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <SortAscendingOutlined className="text-gray-400 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <SortAscendingOutlined className="text-blue-600 ml-1" />
    ) : (
      <SortDescendingOutlined className="text-blue-600 ml-1" />
    );
  };

  // Memoized table columns with sorting
  const tableColumns = useMemo(
    () => [
      {
        title: <div className="text-xs">#</div>,
        key: "index",
        width: 30,
        fixed: "left",
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-[10px]">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("invoiceNumber")}
          >
            <span>Inv. No.</span>
            <SortIndicator field="invoiceNumber" />
          </div>
        ),
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 120,
        fixed: "left",
        sorter: true,
        sortOrder:
          sortField === "invoiceNumber"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (invoiceNumber, record) => (
          <span
            className="font-mono text-[10px] font-medium text-blue-600"
            style={{
              textDecoration: record.status === "void" ? "line-through" : "none",
              opacity: record.status === "void" ? 0.6 : 1,
            }}
          >
            {invoiceNumber || "N/A"}
          </span>
        ),
      },
      {
        title: <div className="text-xs">App. Code</div>,
        dataIndex: "application",
        key: "application",
        width: 120,
        render: (_, record) => (
          <span className="font-mono text-[10px] font-semibold text-gray-700">
            {record.application?.code || "—"}
          </span>
        ),
      },
      {
        title: <div className="text-xs">Gateway Ref.</div>,
        dataIndex: "gatewayInvoiceNumber",
        key: "gatewayInvoiceNumber",
        width: 130,
        render: (gatewayInvoiceNumber, record) => (
          <span
            className="font-mono text-[10px] font-medium text-gray-500"
            style={{
              textDecoration: record.status === "void" ? "line-through" : "none",
              opacity: record.status === "void" ? 0.6 : 1,
            }}
          >
            {gatewayInvoiceNumber || "—"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("status")}
          >
            <span>Status</span>
            <SortIndicator field="status" />
          </div>
        ),
        dataIndex: "status",
        key: "status",
        width: 110,
        align: "center",
        sorter: true,
        sortOrder:
          sortField === "status"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (status) => getInvoiceStatusAntDTag(status),
      },
      {
        title: <div className="text-xs">Client</div>,
        key: "client",
        width: 200,
        render: (_, record: any) => (
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-800 uppercase line-clamp-1">
              {record.client?.name || "N/A"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500 font-mono">
                {record.client?.clientId || "N/A"}
              </span>
              {record.client?.userType && (
                <Tag
                  color="blue"
                  className="text-[8px] px-1 py-0 m-0 leading-none"
                >
                  {record.client.userType}
                </Tag>
              )}
            </div>
          </div>
        ),
      },
      {
        title: <div className="text-xs">Contact</div>,
        key: "contact",
        width: 160,
        render: (_, record: any) => (
          <div className="flex flex-col gap-0.5">
            {record.client?.phone && (
              <a
                href={`tel:${record.client.phone}`}
                className="text-[10px] text-blue-600 hover:underline font-mono leading-tight"
              >
                {record.client.phone}
              </a>
            )}
            {record.client?.email && (
              <a
                href={`mailto:${record.client.email}`}
                className="text-[10px] text-gray-500 hover:underline leading-tight truncate max-w-[150px] block"
                title={record.client.email}
              >
                {record.client.email}
              </a>
            )}
            {!record.client?.phone && !record.client?.email && (
              <span className="text-[10px] text-gray-400">—</span>
            )}
          </div>
        ),
      },
      {
        title: <div className="text-xs">Entity/Department</div>,
        key: "assigningEntity",
        width: 180,
        render: (_, record: any) => (
          <span className="text-[10px] text-gray-600 line-clamp-1">
            {record.assigningEntity?.name || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("issueDate")}
          >
            <span>Issue Date</span>
            <SortIndicator field="issueDate" />
          </div>
        ),
        dataIndex: "issueDate",
        key: "issueDate",
        width: 120,
        sorter: true,
        sortOrder:
          sortField === "issueDate"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (issueDate) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate4(issueDate)}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("dueDate")}
          >
            <span>Due Date</span>
            <SortIndicator field="dueDate" />
          </div>
        ),
        dataIndex: "dueDate",
        key: "dueDate",
        width: 110,
        sorter: true,
        sortOrder:
          sortField === "dueDate"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (dueDate) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(dueDate)}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div className="text-xs text-red-600 font-bold uppercase">
            Exp. Date
          </div>
        ),
        dataIndex: "invoiceExpires",
        key: "invoiceExpires",
        width: 110,
        render: (invoiceExpires, record: any) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-red-400 text-[10px]" />
            <span
              className="text-[10px] text-red-500 font-mono font-bold"
              style={{
                textDecoration:
                  record.status === "void" ? "line-through" : "none",
                opacity: record.status === "void" ? 0.6 : 1,
              }}
            >
              {invoiceExpires ? formatDate2(invoiceExpires) : "—"}
            </span>
          </div>
        ),
      },

      {
        title: <div className="text-xs">Date Paid</div>,
        key: "paidAt",
        width: 110,
        render: (_: any, record: any) => {
          const paidAt = record.paymentDetails?.paidAt;
          if (!paidAt) return <span className="text-[10px] text-gray-400">—</span>;
          return (
            <div className="flex items-center gap-1 text-[10px] text-green-700 font-mono">
              <FileDoneOutlined className="text-[10px]" />
              {formatDate4(paidAt)}
            </div>
          );
        },
      },
      {
        title: <div className="text-xs">Method</div>,
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
        title: <div className="text-xs">Payment Ref.</div>,
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
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("totalAmount")}
          >
            <span>Amount (GH₵)</span>
            <SortIndicator field="totalAmount" />
          </div>
        ),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 110,
        sorter: true,
        sortOrder:
          sortField === "totalAmount"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        align: "right",
        render: (totalAmount) => (
          <span className="text-[10px] text-gray-900 font-mono font-bold">
            {formatNumber(totalAmount)}
          </span>
        ),
      },
      {
        title: <div className="text-xs">Generated By</div>,
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
        title: <div className="text-xs">Actions</div>,
        key: "actions",
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, invoice) => (
          <div className="flex items-center justify-center gap-2">
            {/* View Permit PDF */}
            <Tooltip title="View Invoice/Bill/Receipt PDF">
              <Button
                icon={<FaFilePdf />}
                size="small"
                className="text-red-600 border-red-600 hover:!bg-red-600 hover:!text-white flex items-center justify-center !transition !duration-200"
                onClick={() => handleViewInvoice(invoice._id)} // your handler
              />
            </Tooltip>

            {/* Sync payment status — unpaid/overdue/processing only */}
            {["unpaid", "overdue", "processing"].includes(invoice.status) && (
              <Tooltip title="Sync payment status with Ghana.gov gateway">
                <Button
                  icon={<SyncOutlined />}
                  size="small"
                  className="flex items-center justify-center border-blue-400 text-blue-600 hover:!bg-blue-50 hover:!border-blue-500"
                  onClick={() => {
                    setSyncInvoiceId(invoice._id);
                    setSyncModalOpen(true);
                  }}
                />
              </Tooltip>
            )}

            {/* Send Payment Reminder — unpaid/overdue only */}
            {["unpaid", "overdue", "processing"].includes(invoice.status) && (
              <Tooltip title="Send Payment Reminder (SMS + Email)">
                <Button
                  icon={<BellOutlined />}
                  size="small"
                  className="flex items-center justify-center border-amber-500 text-amber-600 hover:!bg-amber-50 hover:!border-amber-600"
                  onClick={() => handleSendReminder(invoice)}
                  loading={sendingReminderId === invoice._id}
                />
              </Tooltip>
            )}

            {/* Void Invoice */}
            {!["void", "cancelled", "paid"].includes(invoice.status) && (
              <Tooltip title="Void/Cancel Invoice">
                <Button
                  icon={<StopOutlined />}
                  size="small"
                  danger
                  className="flex items-center justify-center"
                  onClick={() => handleVoidInvoice(invoice)}
                  loading={isVoiding}
                />
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [page, limit, sortField, sortOrder, handleSort]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (status !== "all") count++;
    if (paymentFor !== "all") count++;
    if (assigningEntity !== "all") count++;
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    if (startDateVal !== "" || endDateVal !== "") count++;

    return count;
  }, [
    searchTerm,
    status,
    paymentFor,
    assigningEntity,
    sortField,
    sortOrder,
    startDateVal,
    endDateVal,
  ]);

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

      // 2. Fetch the invoice document
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }/revenue/invoice/${invoiceId}/view`,
        {
          withCredentials: true,
        }
      );

      const documentUrl = response?.data?.document_url;

      if (documentUrl) {
        popup.location.href = documentUrl;
      } else {
        popup.close();
        Swal.fire({
          title: "Not Found",
          text: "Invoice document not available.",
          icon: "error",
          confirmButtonColor: "#727cf5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Oops...",
        text:
          error?.response?.data?.error ||
          "Something went wrong while fetching the invoice.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      console.error("Failed to fetch invoice document:", error);
    }
  };

  const handleVoidInvoice = async (invoice: any) => {
    const invoiceId = invoice._id;
    const targetInvoiceNumber = invoice.invoiceNumber;

    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to void invoice ${targetInvoiceNumber}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#ff4d4f",
      cancelButtonColor: "#6c757d",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!isConfirmed) return;

    const { value: typedInvoiceNumber } = await Swal.fire({
      title: "Confirm Invoice Number",
      input: "text",
      inputLabel: `Please type the invoice number "${targetInvoiceNumber}" to confirm.`,
      inputPlaceholder: "Enter invoice number...",
      showCancelButton: true,
      confirmButtonText: "Next",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "#6c757d",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) return "You need to enter the invoice number!";
        if (value !== targetInvoiceNumber)
          return "Invoice number does not match!";
      },
    });

    if (!typedInvoiceNumber) return;

    const { value: reason } = await Swal.fire({
      title: "Void Reason",
      input: "textarea",
      inputLabel: "Please provide a reason for voiding this invoice.",
      inputPlaceholder: "Enter reason here...",
      showCancelButton: true,
      confirmButtonText: "Void Invoice",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff4d4f",
      cancelButtonColor: "#6c757d",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) return "You need to provide a reason!";
      },
    });

    if (reason) {
      try {
        await voidInvoice({
          invoiceId,
          reason,
          invoiceNumber: typedInvoiceNumber,
        }).unwrap();
        refetch();
        Swal.fire({
          title: "Success",
          text: "Invoice has been voided successfully.",
          icon: "success",
          confirmButtonColor: "#52c41a",
        });
      } catch (error: any) {
        Swal.fire({
          title: "Failed",
          text: error?.data?.error || "Failed to void invoice",
          icon: "error",
          confirmButtonColor: "#ff4d4f",
        });
      }
    }
  };

  const handleSendReminder = async (invoice: any) => {
    const { isConfirmed } = await Swal.fire({
      title: "Send Payment Reminder?",
      html: `Send a payment reminder to <strong>${invoice.client?.name || "this client"}</strong> for invoice <strong>${invoice.invoiceNumber}</strong>?<br/><br/>They will receive an SMS and email with payment instructions and guidelines.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send Reminder",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6c757d",
    });
    if (!isConfirmed) return;
    setSendingReminderId(invoice._id);
    try {
      const result = await sendPaymentReminder({ invoiceId: invoice._id }).unwrap();
      Swal.fire({
        title: "Reminder Sent!",
        text: result.message || "Payment reminder sent successfully.",
        icon: "success",
        confirmButtonColor: "#52c41a",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Failed",
        text: error?.data?.error || "Failed to send payment reminder.",
        icon: "error",
        confirmButtonColor: "#ff4d4f",
      });
    } finally {
      setSendingReminderId(null);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        searchQuery: debouncedSearchTerm,
        status: status === "all" ? "" : status,
        paymentFor: paymentFor === "all" ? "" : paymentFor,
        assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
        issueDateStart,
        issueDateEnd,
        startDate,
        endDate,
      });

      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }/revenue/invoice/export?${params.toString()}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoices-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export invoices data");
    }
  };

  return (
    <>
      <div className="invoices-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Finance" },
              { title: <span className="text-green-700 font-medium">Generated Invoices</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <FileDoneOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Generated Invoices</h1>
              <p className="text-[11px] text-gray-500 leading-tight">View and manage all generated invoices</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <Tooltip title="Send payment reminders to ALL unpaid/overdue invoices (processed in background)">
              <Button
                type="primary"
                size="small"
                icon={<NotificationOutlined />}
                style={{ backgroundColor: "#d97706", borderColor: "#b45309" }}
                className="font-semibold text-[11px]"
                loading={isBulkSending}
                onClick={async () => {
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
                  try {
                    const result = await bulkSendPaymentReminders({ assigningEntity }).unwrap();
                    Swal.fire({
                      title: "Reminders Queued",
                      html: result.message || `Bulk reminder job started for <strong>${result.total ?? "all"}</strong> invoice(s). Notifications will be delivered in the background.`,
                      icon: "success",
                      confirmButtonColor: "#52c41a",
                    });
                  } catch (err: any) {
                    Swal.fire({
                      title: "Failed",
                      text: err?.data?.error || "Failed to start bulk reminder job.",
                      icon: "error",
                      confirmButtonColor: "#ff4d4f",
                    });
                  }
                }}
              >
                Reminders
              </Button>
            </Tooltip>
            <Tooltip title="View Statistics">
              <Button size="small" icon={<BarChartOutlined />} onClick={() => setStatisticsModalVisible(true)} className="border-blue-300 text-blue-600 hover:!bg-blue-50" />
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button size="small" icon={<ExportOutlined />} onClick={handleExport} className="border-green-600 text-green-700 hover:!bg-green-50" />
            </Tooltip>
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetchingApplications} />
            </Tooltip>
          </div>
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={6} lg={5} xl={4}>
              <Input
                prefix={<SearchOutlined className="text-gray-400 text-xs" />}
                placeholder="Search invoice no, client, code…"
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                size="small"
                className="rounded"
              />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={2}>
              <Select
                value={status}
                onChange={(v) => handleFilterChange("status", v)}
                className="w-full"
                size="small"
                placeholder="Status"
                options={filterOptions.statusOptions}
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Select
                value={paymentFor}
                onChange={(v) => handleFilterChange("paymentFor", v)}
                className="w-full"
                size="small"
                placeholder="Payment For"
                options={filterOptions.paymentForOptions}
              />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={2}>
              <Select
                value={dateFilterType}
                onChange={(v) => handleFilterChange("dateFilterType", v)}
                className="w-full"
                size="small"
                options={[
                  { label: "Issue Date", value: "issueDate" },
                  { label: "Payment Date", value: "paidAt" },
                  { label: "Created At", value: "createdAt" },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={5} lg={5} xl={5}>
              <RangePicker size="small" className="w-full" value={dateRange} onChange={handleRangeChange} />
            </Col>
            <Col xs={24} sm={12} md={24} lg={6} xl={5}>
              <Select
                showSearch
                value={assigningEntity}
                onChange={(v) => handleFilterChange("assigningEntity", v)}
                className="w-full"
                size="small"
                placeholder="All Entities / Departments"
                options={filterOptions.entityOptions}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">
                  Clear filters
                </Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => handleFilterChange("search", "")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {status !== "all" && <Tag closable onClose={() => handleFilterChange("status", "all")} color="green" className="text-[10px] leading-tight m-0">Status: {status.replace(/_/g, " ")}</Tag>}
              {paymentFor !== "all" && <Tag closable onClose={() => handleFilterChange("paymentFor", "all")} color="purple" className="text-[10px] leading-tight m-0">Type: {paymentFor.replace(/([A-Z])/g, " $1").trim()}</Tag>}
              {assigningEntity !== "all" && <Tag closable onClose={() => handleFilterChange("assigningEntity", "all")} color="cyan" className="text-[10px] leading-tight m-0">Entity: {entities.find((e: any) => (e.id || e._id) === assigningEntity)?.name || assigningEntity}</Tag>}
              {(startDateVal !== "" || endDateVal !== "") && (
                <Tag closable onClose={() => handleFilterChange("dateRange", [null, null])} color="orange" className="text-[10px] leading-tight m-0">
                  {dateFilterType === "issueDate" ? "Issue" : dateFilterType === "paidAt" ? "Payment" : "Creation"} Date: {formatDate2(startDateVal)} – {formatDate2(endDateVal)}
                </Tag>
              )}
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
          <Spin spinning={isLoadingApplications || isFetchingApplications}>
            <Table
              columns={tableColumns as any}
              dataSource={fullRegistrations}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1400, y: "calc(100vh - 260px)" }}
              className="invoices-table"
              rowClassName={(_, index) =>
                `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`
              }
              onChange={(_, __, sorter: any) => {
                if (sorter?.field) {
                  setSortField(sorter.field);
                  setSortOrder(sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "asc");
                  setPage(1);
                }
              }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No invoices match the current filters." : "No invoices found."}</p>
                      {activeFiltersCount > 0 && <Button type="link" size="small" onClick={clearAllFilters}>Clear filters</Button>}
                    </div>
                  } />
                ),
              }}
            />
          </Spin>
        </div>

        {/* ── FOOTER / PAGINATION ── */}
        <div className="px-4 py-2 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            {paginationInfo && paginationInfo.total > 0
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} invoice(s)`
              : "No invoices"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination
              current={page}
              pageSize={limit}
              total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger
              showQuickJumper
              size="small"
              className="invoices-pagination"
            />
          )}
        </div>
      </div>

      {/* upload modal */}

      <InvoiceStatisticsModal
        open={statisticsModalVisible}
        onClose={() => setStatisticsModalVisible(false)}
      />

      <style>{`
        .invoices-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .invoices-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .invoices-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .invoices-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .invoices-table .ant-table-body { overflow-y: auto !important; }
        .invoices-table .ant-table-cell-fix-right { background: #fff; }
        .invoices-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .invoices-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .invoices-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .invoices-pagination .ant-pagination-item-active a { color: #fff; }
        .invoices-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>

      {/* Payment Sync Modal */}
      <Modal
        title={null}
        open={syncModalOpen}
        onCancel={() => { setSyncModalOpen(false); setSyncInvoiceId(null); }}
        footer={null}
        centered
        width={480}
        maskClosable={!isSyncing && !isSyncFetching}
        styles={{ content: { padding: "24px", borderRadius: "16px" } }}
      >
        <div className="mb-4">
          <Title level={5} className="m-0 flex items-center gap-2">
            <SyncOutlined className="text-blue-500" />
            Manual Payment Sync
          </Title>
        </div>

        {(isSyncing || isSyncFetching) && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spin size="large" indicator={<SyncOutlined spin style={{ fontSize: 32 }} />} />
            <Text className="mt-4 text-slate-500 font-medium">Synchronising with Ghana.gov gateway...</Text>
            <Text className="text-xs text-slate-400 mt-1">This may take a few seconds</Text>
          </div>
        )}

        {!isSyncing && !isSyncFetching && syncError && (
          <Result
            status="error"
            title="Sync Failed"
            subTitle={
              <div className="flex flex-col items-center">
                <Text type="secondary">
                  {(syncError as any)?.data?.error || "An error occurred while checking the payment status."}
                </Text>
                <Button type="primary" icon={<SyncOutlined />} onClick={refetchSync} className="mt-4">Try Again</Button>
              </div>
            }
          />
        )}

        {!isSyncing && !isSyncFetching && !syncError && syncData?.data && (
          syncData.data.status === "paid" ? (
            <Result
              status="success"
              title={<Title level={4} className="mb-0">Payment Confirmed</Title>}
              subTitle="The payment has been verified and the invoice has been updated to Paid."
              extra={[
                <Button type="primary" key="close" onClick={() => { setSyncModalOpen(false); setSyncInvoiceId(null); }} size="large">Done</Button>
              ]}
            />
          ) : (
            <div className="flex flex-col items-center">
              <Result
                status="info"
                icon={<ExclamationCircleOutlined className="text-amber-500" />}
                title={<Title level={4} className="mb-0">No Payment Confirmation Yet</Title>}
                subTitle={
                  syncData.data.statusCode === 4
                    ? "The gateway reports this payment is awaiting confirmation from the bank."
                    : "The gateway has not yet reported a successful payment for this invoice."
                }
              />
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 w-full mb-6">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Gateway Status">
                    <Tag color={syncData.data.statusCode === 2 ? "error" : "warning"}>
                      {syncData.data.statusText?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Divider className="my-3" />
                <Paragraph className="text-[11px] text-slate-500 m-0 leading-relaxed italic">
                  {syncData.data.statusCode === 4
                    ? "Bank payments can take time to reflect. Check again shortly."
                    : "If the client has paid, there may be a delay in synchronisation. Try again."}
                </Paragraph>
              </div>
              <Space>
                <Button onClick={() => { setSyncModalOpen(false); setSyncInvoiceId(null); }}>Close</Button>
                <Button type="primary" icon={<SyncOutlined />} onClick={refetchSync} className="bg-blue-600">Check Again</Button>
              </Space>
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default Invoices;
