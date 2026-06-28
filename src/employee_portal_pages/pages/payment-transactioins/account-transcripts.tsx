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
  Row,
  Col,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { formatDate2, formatNumber } from "@/utils/helperFunction";
import {
  paymentTransactionsStatusOptions,
  paymentForOptions,
  getPaymentTransactionStatusBadge,
} from "@/employee_portal_pages/lib/helpers";
import AssignmentPlanModal from "@/employee_portal_pages/components/application/assignment-details";
import ApplicationPreview from "@/employee_portal_pages/components/application-preview/application-preview";
import { useMediaQuery } from "@/employee_portal_pages/hooks/useMediaQuery";
import { Dayjs } from "dayjs";
import { useFetchPaymentTransactionsQuery } from "@/redux/features/employee-portal-api/invoices/invoices-payment-transactions";
import axios from "axios";
import Swal from "sweetalert2";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
const { RangePicker } = DatePicker;



const PaymentTransactionsPage = () => {
  PageTitle("Account Transcripts | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("all");
  const [paymentFor, setPaymentFor] = useState("all");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [assignmentPlanModalOpen, setAssignmentPlanModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>({});

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const handleRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
  };

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 575px)");

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: apiResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchPaymentTransactionsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      paymentFor: paymentFor === "all" ? "" : paymentFor,
      status,
      startDate,
      endDate,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const applications = apiResponse?.data || [];
  const paginationInfo = apiResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: paymentTransactionsStatusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
      paymentForOptions: [
        { label: "All Payment Types", value: "all" },
        ...paymentForOptions.map((type: string) => ({
          label: type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          value: type,
        })),
      ],
    }),
    []
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
      case "dateRange":
        setDateRange([value[0], value[1]]);
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
    setSortField("createdAt");
    setSortOrder("desc");
    setDateRange(null);
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
        title: "#",
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
            onClick={() => handleSort("transactionId")}
          >
            <span>Trans. ID</span>
            <SortIndicator field="code" />
          </div>
        ),
        dataIndex: "transactionId",
        key: "transactionId",
        width: 70,
        fixed: "left",
        sorter: true,
        sortOrder: sortField === "transactionId" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (transactionId) => (
          <span className="font-mono text-[10px] font-medium text-blue-600">
            {transactionId || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("gatewayInvoiceNumber")}
          >
            <span>.GOV ID</span>
            <SortIndicator field="code" />
          </div>
        ),
        dataIndex: "gatewayInvoiceNumber",
        key: "gatewayInvoiceNumber",
        width: 70,
        fixed: "left",
        sorter: true,
        sortOrder: sortField === "gatewayInvoiceNumber" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (gatewayInvoiceNumber, record) => (
          <span className="font-mono text-[10px] font-medium text-green-600">
            {gatewayInvoiceNumber ||
              record?.invoice?.gatewayInvoiceNumber ||
              "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("paymentFor")}
          >
            <span>Type</span>
            <SortIndicator field="code" />
          </div>
        ),
        dataIndex: "paymentFor",
        key: "paymentFor",
        width: 70,
        sorter: true,
        sortOrder: sortField === "paymentFor" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (paymentFor, record) => (
          <span className="font-mono text-[10px] font-medium">
            {paymentFor || record?.invoice?.paymentFor || "N/A"}
          </span>
        ),
      },

      // {
      //   title: "Description",
      //   key: "notes",
      //   dataIndex: "notes",
      //   width: 300,
      //   render: (notes) => (
      //     <div className="space-y-1">
      //       <Tooltip title={notes}>
      //         <p
      //           className="font-medium text-gray-800 text-xs truncate"
      //           title={notes}
      //         >
      //           {notes || "Untitled Application"}
      //         </p>
      //       </Tooltip>
      //     </div>
      //   ),
      // },

      {
        title: (
          <div
            className="flex items-center justify-end cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("amount")}
          >
            <span>Amount (₵)</span>
            <SortIndicator field="amount" />
          </div>
        ),
        dataIndex: "amount",
        key: "amount",
        width: 70,
        sorter: true,
        sortOrder: sortField === "amount" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        align: "right",
        render: (amount) => (
          <span className="text-[10px] text-red-500 font-mono font-extrabold">
            {formatNumber(amount)}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("createdAt")}
          >
            <span>Trans. Date</span>
            <SortIndicator field="createdAt" />
          </div>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 70,
        sorter: true,
        sortOrder: sortField === "createdAt" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (date) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(date)}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("completedAt")}
          >
            <span>Pymt Date</span>
            <SortIndicator field="completedAt" />
          </div>
        ),
        dataIndex: "completedAt",
        key: "completedAt",
        width: 70,
        sorter: true,
        sortOrder: sortField === "completedAt" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (completedAt, record) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {completedAt || record?.invoice?.paymentDetails?.paidAt
                ? formatDate2(
                    completedAt || record?.invoice?.paymentDetails?.paidAt
                  )
                : "N/A"}
            </span>
          </div>
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
        width: 80,
        align: "center",
        sorter: true,
        sortOrder: sortField === "status" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (status) => getPaymentTransactionStatusBadge(status),
      },

      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs">
            <span>Payee ID</span>
          </div>
        ),
        dataIndex: "client",
        key: "client",
        width: 50,
        sortOrder: sortField === "client" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (client) => (
          <span className="font-mono text-[10px] font-medium">
            {`${client?.clientId}` || "N/A"}
          </span>
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
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    if (startDate !== "") count++;
    return count;
  }, [
    searchTerm,
    status,
    paymentFor,
    sortField,
    sortOrder,
    startDate,
    endDate,
  ]);

  const handleExportPDF = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }revenue/payment-transactions/pdf`,
        {
          params: {
            searchQuery: debouncedSearchTerm,
            status,
            startDate,
            endDate,
          },
          withCredentials: true,
          responseType: "blob", // 👈 important: treat response as a file
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

  return (
    <>
      {viewModalOpen && (
        <ApplicationPreview
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={selectedApplication._id}
          type={"permit"}
        />
      )}

      {assignmentPlanModalOpen && (
        <AssignmentPlanModal
          isOpen={assignmentPlanModalOpen}
          onClose={() => setAssignmentPlanModalOpen(false)}
          applicationId={selectedApplication}
        />
      )}

      <div className="transcripts-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Finance" },
              { title: <span className="text-green-700 font-medium">Account Transcripts</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <CreditCardOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Payment Transactions</h1>
              <p className="text-[11px] text-gray-500 leading-tight">Review transaction history and monitor payment activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <Tooltip title="Export as PDF">
              <Button size="small" icon={<FilePdfOutlined />} onClick={handleExportPDF} className="bg-red-500 hover:!bg-red-600 border-none text-white text-[11px]">PDF</Button>
            </Tooltip>
            <Tooltip title="Export as Excel">
              <Button size="small" icon={<FileExcelOutlined />} className="bg-green-500 hover:!bg-green-600 border-none text-white text-[11px]">Excel</Button>
            </Tooltip>
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetchingApplications} />
            </Tooltip>
          </div>
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6} xl={5}>
              <Input
                prefix={<SearchOutlined className="text-gray-400 text-xs" />}
                placeholder="Search transactions…"
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                size="small"
                className="rounded"
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Select
                value={status}
                onChange={(v) => handleFilterChange("status", v)}
                className="w-full"
                size="small"
                placeholder="Status"
                options={filterOptions.statusOptions}
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={5} xl={5}>
              <RangePicker size="small" className="w-full" value={dateRange} onChange={handleRangeChange} />
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
              {startDate !== "" && endDate !== "" && (
                <Tag closable onClose={() => handleFilterChange("dateRange", [null, null])} color="orange" className="text-[10px] leading-tight m-0">
                  Date: {formatDate2(startDate)} – {formatDate2(endDate)}
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
              dataSource={applications}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1000, y: "calc(100vh - 260px)" }}
              className="transcripts-table"
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
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No transactions match the current filters." : "No transactions found."}</p>
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
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} transactions`
              : "No transactions"}
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
              className="transcripts-pagination"
            />
          )}
        </div>
      </div>
      <style>{`
        .transcripts-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .transcripts-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .transcripts-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .transcripts-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .transcripts-table .ant-table-body { overflow-y: auto !important; }
        .transcripts-table .ant-table-cell-fix-right { background: #fff; }
        .transcripts-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .transcripts-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .transcripts-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .transcripts-pagination .ant-pagination-item-active a { color: #fff; }
        .transcripts-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>
    </>
  );
};

export default PaymentTransactionsPage;
