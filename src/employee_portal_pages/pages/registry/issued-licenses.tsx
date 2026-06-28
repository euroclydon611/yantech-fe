import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
  Select,
  Input,
  Button,
  Card,
  Tag,
  Tooltip,
  Spin,
  Empty,
  Table,
  Badge,
  Row,
  Col,
  DatePicker,
  message,
  Drawer,
  Breadcrumb,
  Space,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  ExportOutlined,
  FileTextOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { formatDate2, handleDocumentView } from "@/utils/helperFunction";
import {
  issuedPermitsStatusOptions,
  VALID_LICENSE_TYPES,
  issuedStatuses
} from "@/employee_portal_pages/lib/helpers";
import {
  useFetchIssuedLicensesQuery,
  useApproveLicenseCertificateMutation,
} from "@/redux/features/employee-portal-api/authoirzations/main";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useEntityReporteesQuery } from "@/redux/features/employee-portal-api/entityApi";
import LicenseStatisticsModal from "@/employee_portal_pages/components/statistics-modals/LicenseStatisticsModal";
import Swal from "sweetalert2";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const { Option } = Select;
const { RangePicker } = DatePicker;

const ISSUED_LICENSES_FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

function getClientName(client: any): string {
  if (!client) return "";

  return (
    client.organizationName ||
    client.agencyName ||
    [client.firstName, client.lastName].filter(Boolean).join(" ").trim()
  );
}

const IssuedLicenses = () => {
  PageTitle("Issued Licenses | IPMS EPA Ghana");

  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("issued-licenses-font-size") || "base"
  );
  const handleFontSize = (key: string) => { setFontSizeKey(key); localStorage.setItem("issued-licenses-font-size", key); };

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
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [excelFile, setExcelFile] = useState(null);
  const [licenseType, setLicenseType] = useState("all");

  // New filter states
  const [clientId, setClientId] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("all");
  const [expiringInDays, setExpiringInDays] = useState(null);
  const [dateFilterType, setDateFilterType] = useState("issueDate");

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
  const expiryDateStart = dateFilterType === "expiryDate" ? startDateVal : "";
  const expiryDateEnd = dateFilterType === "expiryDate" ? endDateVal : "";

  const handleRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: licensesResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchIssuedLicensesQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      status: status === "all" ? "" : status,
      licenseType: licenseType === "all" ? "" : licenseType,
      startDate,
      endDate,
      clientId,
      assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
      expiringInDays,
      issueDateStart,
      issueDateEnd,
      expiryDateStart,
      expiryDateEnd,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [approveLicense, { isLoading: isApprovingLicense }] =
    useApproveLicenseCertificateMutation();

  const fullRegistrations = licensesResponse?.data || [];
  const paginationInfo = licensesResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: issuedPermitsStatusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
      licenseTypeOptions: [
        { label: "All License Types", value: "all" },
        ...VALID_LICENSE_TYPES.map((type) => ({
          label: type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
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
      case "dateRange":
        setDateRange([value[0], value[1]]);
        break;
      case "dateFilterType":
        setDateFilterType(value);
        break;
      default:
        break;
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setDateRange(null);
    setDateFilterType("issueDate");
    setClientId("");
    setAssigningEntity("all");
    setExpiringInDays("");
    setLicenseType("all");
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
            onClick={() => handleSort("licenseNumber")}
          >
            <span>License No.</span>
            <SortIndicator field="licenseNumber" />
          </div>
        ),
        dataIndex: "licenseNumber",
        key: "licenseNumber",
        width: 70,
        sorter: true,
        sortOrder: sortField === "licenseNumber" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (licenseNumber) => (
          <span className="font-mono text-[10px] font-medium text-blue-600">
            {licenseNumber || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div className="text-xs">
            <span>Holder</span>
          </div>
        ),
        dataIndex: "company",
        key: "company",
        width: 100,
        render: (_, record) => (
          <span className="font-mono text-[10px] font-medium">
            {getClientName(record?.clientId) || "N/A"}
          </span>
        ),
      },
    
      {
        title: <div className="text-xs">Issuing Entity</div>,
        dataIndex: "assigningEntity",
        key: "assigningEntity",
        width: 100,
        render: (assigningEntity) => (
          <Tooltip title={assigningEntity?.name}>
            <div className="font-mono text-[10px] font-medium truncate max-w-[150px]">
              {assigningEntity?.name || "N/A"}
            </div>
          </Tooltip>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("issuanceDate")}
          >
            <span>Date of Issue</span>
            <SortIndicator field="issuanceDate" />
          </div>
        ),
        dataIndex: "issueDate",
        key: "issueDate",
        width: 80,
        sorter: true,
        sortOrder: sortField === "issueDate" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (issueDate) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(issueDate)}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("expiryDate")}
          >
            <span>Expiry Date</span>
            <SortIndicator field="expiryDate" />
          </div>
        ),
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 80,
        sorter: true,
        sortOrder: sortField === "expiryDate" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (expiryDate) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(expiryDate)}
            </span>
          </div>
        ),
      },
      {
        title: <div className="text-xs">Status</div>,
        dataIndex: "status",
        key: "status",
        width: 80,
        render: (status) => {
          const s = issuedStatuses[status] || issuedStatuses.DEFAULT;
          return (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
              style={{ color: s.color, backgroundColor: s.bg }}
            >
              {s.icon}
              {s.label}
            </span>
          );
        },
      },
      {
        title: <div className="text-xs">Reports</div>,
        dataIndex: "reportDocuments",
        key: "reportDocuments",
        width: 60,
        align: "center",
        render: (reports, record) => (
          <Badge
            count={reports?.length || 0}
            showZero
            color={reports?.length > 0 ? "#1890ff" : "#d9d9d9"}
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
        title: <div className="text-xs">Actions</div>,
        key: "actions",
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, license) => {
          const isHeadOfEntity =
            employee?.entity?.current_head_id === employee?._id;

          const isCEOOfficeHead =
            employee?.entity?.name === "CEO Office" && isHeadOfEntity;

          const isAssigningEntityHead =
            license?.assigningEntity?._id === employee?.entity?._id &&
            isHeadOfEntity;

          const canApprove = isCEOOfficeHead || isAssigningEntityHead;

          const isApproveDisabled =
            isApprovingLicense ||
            !["PENDING"].includes(license?.status) ||
            !canApprove;

          return (
            <Space size="small">
              <Tooltip title="View License / Certificate">
                <Button
                  icon={<FaFilePdf />}
                  size="small"
                  className="!text-[10px] !px-1.5 !h-6 text-red-600 border-red-600 hover:!bg-red-600 hover:!text-white !transition !duration-200"
                  onClick={() => handleViewPDF(license._id)}
                >
                  <span className="!text-[10px] font-semibold">LIC</span>
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  canApprove
                    ? "Sign License"
                    : "Only CEO Office Head or Assigning Entity Head can approve licenses"
                }
              >
                <Button
                  icon={<CheckCircleOutlined style={{ fontSize: "11px" }} />}
                  size="small"
                  disabled={isApproveDisabled}
                  className="!text-[10px] !px-1.5 !h-6 text-green-600 !font-bold border-green-600 hover:!bg-green-600 hover:!text-white !transition !duration-200 disabled:pointer-events-none"
                  onClick={() =>
                    handleApproveLicense(license._id, license.licenseNumber)
                  }
                  loading={isApprovingLicense}
                >
                  <span className="!text-[10px] font-semibold">SGN</span>
                </Button>
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [page, limit, sortField, sortOrder, handleSort, isApprovingLicense]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (status !== "all") count++;
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    if (startDateVal !== "") count++;
    if (clientId) count++;
    if (assigningEntity && assigningEntity !== "all") count++;
    if (expiringInDays) count++;
    if (licenseType && licenseType !== "all") count++;
    return count;
  }, [
    searchTerm,
    status,
    sortField,
    sortOrder,
    startDateVal,
    clientId,
    assigningEntity,
    expiringInDays,
    licenseType,
  ]);

  const handleViewPDF = async (licenseId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/licenses/pdf?licenseId=${licenseId}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      // Create a blob from the response
      const fileBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in new tab
      window.open(fileURL, "_blank");
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

  const handleApproveLicense = async (
    licenseId: string,
    licenseNumber: string
  ) => {
    const { isConfirmed } = await Swal.fire({
      title: "Approve License",
      text: `Are you sure you want to approve license ${licenseNumber}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!isConfirmed) return;

    const { value: typedLicenseNumber } = await Swal.fire({
      title: "Confirm License Number",
      input: "text",
      inputLabel: `Please type the license number "${licenseNumber}" to confirm.`,
      inputPlaceholder: "Enter license number...",
      showCancelButton: true,
      confirmButtonText: "Sign License",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6c757d",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) return "You need to enter the license number!";
        if (value !== licenseNumber) return "License number does not match!";
      },
    });

    if (!typedLicenseNumber) return;

    try {
      await approveLicense({
        licenseId,
        employeeId: employee?._id,
        approvalNotes: "",
      }).unwrap();
      Swal.fire({
        title: "Success",
        text: "License approved successfully",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.data?.error || "Failed to approve license",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        searchQuery: debouncedSearchTerm,
        licenseType: licenseType === "all" ? "" : licenseType,
        status: status === "all" ? "" : status,
        startDate,
        endDate,
        clientId,
        assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
      });

      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/licenses/export?${params.toString()}`,
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
        `issued-licenses-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export licenses data");
    }
  };



  return (
    <>
      <div className="issued-licenses-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Licensing MGT" },
              { title: <span className="text-green-700 font-medium">License Registry</span> },
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
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">License Registry</h1>
              <p className="text-[11px] text-gray-500 leading-tight">
                {(employee as any)?.entity?.name || "All Entities"} &mdash; View &amp; track all officially issued licenses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
              {ISSUED_LICENSES_FONT_SIZES.map((f) => (
                <button key={f.key} onClick={() => handleFontSize(f.key)}
                  title={f.key === "sm" ? "Small" : f.key === "base" ? "Normal" : "Large"}
                  className={`px-2 py-[3px] text-[10px] font-bold border-r last:border-r-0 border-gray-200 transition-colors ${fontSizeKey === f.key ? "bg-green-700 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <Tooltip title="Statistics">
              <Button size="small" icon={<BarChartOutlined />} onClick={() => setStatisticsModalVisible(true)} className="border-blue-300 text-blue-600 hover:!bg-blue-50" />
            </Tooltip>
            <Tooltip title="Export">
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
              <Input prefix={<SearchOutlined className="text-gray-400 text-xs" />} placeholder="Search licenses…"
                value={searchTerm} onChange={(e) => handleFilterChange("search", e.target.value)} allowClear size="small" />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={2}>
              <Select value={status} onChange={(v) => handleFilterChange("status", v)} className="w-full" size="small" placeholder="Status" options={filterOptions.statusOptions} />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Select value={licenseType} onChange={(v) => setLicenseType(v)} className="w-full" size="small" placeholder="License Type"
                options={filterOptions.licenseTypeOptions} showSearch filterOption={(i, o) => (o?.label ?? "").toLowerCase().includes(i.toLowerCase())} />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={2}>
              <Select value={dateFilterType} onChange={(v) => handleFilterChange("dateFilterType", v)} className="w-full" size="small"
                options={[{ label: "Issue Date", value: "issueDate" }, { label: "Expiry Date", value: "expiryDate" }, { label: "Created At", value: "createdAt" }]} />
            </Col>
            <Col xs={24} sm={12} md={5} lg={5} xl={5}>
              <RangePicker size="small" className="w-full" value={dateRange} onChange={handleRangeChange} />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={3}>
              <Select value={expiringInDays} onChange={(v) => setExpiringInDays(v)} className="w-full" size="small" placeholder="Expiring In" allowClear
                options={[
                  { label: "Urgent", options: [{ label: "7 Days", value: "7" }, { label: "14 Days", value: "14" }] },
                  { label: "Standard", options: [{ label: "30 Days", value: "30" }, { label: "60 Days", value: "60" }, { label: "90 Days", value: "90" }] },
                  { label: "Long Term", options: [{ label: "120 Days", value: "120" }, { label: "6 Months", value: "180" }, { label: "1 Year", value: "365" }] },
                ]} />
            </Col>
            <Col xs={24} sm={12} md={24} lg={8} xl={5}>
              <Select showSearch value={assigningEntity} onChange={(v) => setAssigningEntity(v)} className="w-full" size="small"
                placeholder="All Entities / Departments" options={filterOptions.entityOptions}
                filterOption={(i, o) => (o?.label ?? "").toLowerCase().includes(i.toLowerCase())} />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">Clear filters</Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => handleFilterChange("search", "")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {status !== "all" && <Tag closable onClose={() => handleFilterChange("status", "all")} color="green" className="text-[10px] leading-tight m-0">Status: {status.replace(/_/g, " ")}</Tag>}
              {licenseType !== "all" && <Tag closable onClose={() => setLicenseType("all")} color="magenta" className="text-[10px] leading-tight m-0">Type: {licenseType.replace(/_/g, " ")}</Tag>}
              {startDateVal !== "" && (
                <Tag closable onClose={() => handleFilterChange("dateRange", [null, null])} color="orange" className="text-[10px] leading-tight m-0">
                  {dateFilterType.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: {formatDate2(startDateVal)} – {formatDate2(endDateVal)}
                </Tag>
              )}
              {expiringInDays && <Tag closable onClose={() => setExpiringInDays(null)} color="volcano" className="text-[10px] leading-tight m-0">Expiring: {expiringInDays} days</Tag>}
              {assigningEntity !== "all" && <Tag closable onClose={() => setAssigningEntity("all")} color="purple" className="text-[10px] leading-tight m-0">Entity: {entities.find((e: any) => (e.id || e._id) === assigningEntity)?.name || assigningEntity}</Tag>}
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
              scroll={{ x: 1000, y: "calc(100vh - 260px)" }}
              className="issued-licenses-table"
              rowClassName={(_, index) => `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
              onChange={(_, __, sorter: any) => {
                if (sorter?.field) { setSortField(sorter.field); setSortOrder(sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "asc"); setPage(1); }
              }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No licenses match the current filters." : "No licenses found."}</p>
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
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} licenses`
              : "No licenses"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination current={page} pageSize={limit} total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger showQuickJumper size="small" className="issued-licenses-pagination" />
          )}
        </div>
      </div>

      <style>{`
        .issued-licenses-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .issued-licenses-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .issued-licenses-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .issued-licenses-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .issued-licenses-table .ant-table-body { overflow-y: auto !important; }
        .issued-licenses-table .ant-table-cell-fix-right { background: #fff; }
        .issued-licenses-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .issued-licenses-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .issued-licenses-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .issued-licenses-pagination .ant-pagination-item-active a { color: #fff; }
        .issued-licenses-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>

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
        className="reports-drawer"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header Info */}
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
                    {selectedRecord.code || "LIC-2026-00010"}
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

            {/* Reference Actions */}
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

            {/* Previous Submissions */}
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

              {!selectedRecord.reportDocuments ||
              selectedRecord.reportDocuments.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-400 text-xs">
                      No reports submitted yet.
                    </span>
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
      <LicenseStatisticsModal
        open={statisticsModalVisible}
        onClose={() => setStatisticsModalVisible(false)}
      />
    </>
  );
};

export default IssuedLicenses;
