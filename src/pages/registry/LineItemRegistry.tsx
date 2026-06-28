import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  Drawer,
  Pagination,
  Table,
  Tooltip,
  Select,
  Tag,
  DatePicker,
  Card,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";
import {
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  NumberOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useGetAdminInvoiceLineItemsQuery } from "../../redux/features/general/client-applications";
import {
  formatDate2,
  formatNumber,
  normalizeText,
} from "../../utils/helperFunction";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import {
  invoicesStatusOptions,
  paymentForOptions,
} from "@/employee_portal_pages/lib/helpers";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

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

const LineItemRegistry = () => {
  PageTitle("Revenue Breakdown | EPA Ghana Admin");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("issueDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("");
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [showFilters, setShowFilters] = useState(false);
  const [serviceCodes, setServiceCodes] = useState("");

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const dueDateStart = dateFilterType === "dueDate" ? startDateVal : "";
  const dueDateEnd = dateFilterType === "dueDate" ? endDateVal : "";
  const expiryDateStart =
    dateFilterType === "invoiceExpires" ? startDateVal : "";
  const expiryDateEnd = dateFilterType === "invoiceExpires" ? endDateVal : "";

  const { data: entitiesData } = useEntityFullListQuery({ designation: "" });
  const entities = entitiesData?.data || [];

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminInvoiceLineItemsQuery(
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
      dueDateStart,
      dueDateEnd,
      expiryDateStart,
      expiryDateEnd,
      serviceCodes,
    },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true }
  );

  const lineItems = response?.data || [];
  const summary = response?.summary || {
    byServiceCode: [],
    grandTotal: { totalLineItems: 0, totalAmount: 0, totalQuantity: 0 },
  };
  const paginationInfo = response?.pagination;

  const handleResetFilters = () => {
    setStatus("");
    setPaymentFor("");
    setAssigningEntity("");
    setDateRange(null);
    setDateFilterType("issueDate");
    setServiceCodes("");
    setPage(1);
  };

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 45,
      fixed: "left" as const,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono text-[10px]">
          {(page - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
      fixed: "left" as const,
      sorter: true,
      render: (text: string) => (
        <span className="text-xs font-semibold font-mono text-blue-600">
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Gateway Ref.",
      dataIndex: "gatewayInvoiceNumber",
      key: "gatewayInvoiceNumber",
      width: 150,
      fixed: "left" as const,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-[10px] font-mono text-gray-500 truncate block max-w-[140px]">
            {text || "—"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Service Code",
      dataIndex: "service_code",
      key: "service_code",
      width: 130,
      sorter: true,
      render: (text: string) => (
        <Tag color="blue" className="text-[10px] font-mono">
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      sorter: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-xs text-gray-700 truncate block max-w-[240px]">
            {text}
          </span>
        </Tooltip>
      ),
    },

    // {
    //   title: "Qty",
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   width: 60,
    //   align: "center" as const,
    //   sorter: true,
    //   render: (val: number) => (
    //     <span className="text-xs font-mono font-semibold text-gray-700">{val}</span>
    //   ),
    // },
    // {
    //   title: <div className="text-xs text-gray-500">Unit Price (GH₵)</div>,
    //   dataIndex: "unitPrice",
    //   key: "unitPrice",
    //   width: 120,
    //   align: "right" as const,
    //   sorter: true,
    //   render: (val: number) => (
    //     <span className="text-[10px] font-mono text-gray-600">{formatNumber(val)}</span>
    //   ),
    // },
    {
      title: <div className="text-xs text-gray-500">Line Total (GH₵)</div>,
      dataIndex: "lineTotal",
      key: "lineTotal",
      width: 120,
      align: "right" as const,
      sorter: true,
      render: (val: number) => (
        <span className="text-[10px] font-mono font-bold text-gray-900">
          {formatNumber(val)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      sorter: true,
      render: (text: string) => getInvoiceStatusTag(text),
    },
    {
      title: "Entity",
      dataIndex: "entityName",
      key: "entityName",
      width: 160,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-[10px] text-gray-600 truncate block max-w-[150px]">
            {text}
          </span>
        </Tooltip>
      ),
    },

    {
      title: "Client",
      key: "client",
      width: 170,
      render: (_: any, record: any) => (
        <div>
          <p className="text-xs font-semibold text-gray-800 truncate max-w-[160px]">
            {record.clientName?.trim() || "N/A"}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] text-gray-400 font-mono">
              {record.clientId || "N/A"}
            </span>
            {record.clientType && (
              <Tag
                color="blue"
                className="text-[8px] px-1 py-0 m-0 leading-none"
              >
                {record.clientType}
              </Tag>
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Issue Date",
      dataIndex: "issueDate",
      key: "issueDate",
      width: 105,
      sorter: true,
      render: (text: string) => (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <CalendarOutlined className="text-gray-400 text-[10px]" />
          {formatDate2(text)}
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
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
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Service Codes
            </p>
            <input
              type="text"
              placeholder="e.g. FEE-001,FEE-003"
              value={serviceCodes}
              onChange={(e) => {
                setServiceCodes(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md outline-none focus:border-blue-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Comma-separated. Only matching line items will show.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Status
            </p>
            <Select
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              placeholder="All Statuses"
              allowClear
            >
              <Option value="">All Statuses</Option>
              {invoicesStatusOptions
                .filter((s) => s !== "all")
                .map((s) => (
                  <Option key={s} value={s}>
                    {normalizeText(s)}
                  </Option>
                ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Payment Type
            </p>
            <Select
              value={paymentFor}
              onChange={(v) => {
                setPaymentFor(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              placeholder="All Payment Types"
              allowClear
            >
              <Option value="">All Payment Types</Option>
              {paymentForOptions.map((p) => (
                <Option key={p} value={p}>
                  {normalizeText(p)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Entity/Department
            </p>
            <Select
              value={assigningEntity}
              onChange={(v) => {
                setAssigningEntity(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              placeholder="All Entities"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              <Option value="">All Entities</Option>
              {entities.map((e: any) => (
                <Option key={e._id || e.id} value={e._id || e.id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Date Filter Type
            </p>
            <Select
              value={dateFilterType}
              onChange={(v) => setDateFilterType(v)}
              className="w-full"
              size="middle"
            >
              <Option value="issueDate">Issue Date</Option>
              <Option value="dueDate">Due Date</Option>
              <Option value="invoiceExpires">Expiry Date</Option>
              <Option value="createdAt">Created Date</Option>
            </Select>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Date Range
            </p>
            <RangePicker
              className="w-full"
              value={dateRange}
              onChange={(dates) =>
                setDateRange(dates as [Dayjs | null, Dayjs | null])
              }
              size="middle"
            />
          </div>
        </div>
      </Drawer>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Revenue Breakdown
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest font-medium">
            Line-item level breakdown of all invoices across entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {serviceCodes && (
            <button
              onClick={() => { setServiceCodes(""); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Show All
            </button>
          )}
          <Tooltip title="Refresh data">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-600 hover:text-white transition-colors ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ReloadOutlined className={`text-sm ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </Tooltip>
        </div>
      </div>

      {summary.byServiceCode.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
            <Card
              bodyStyle={{ padding: "12px" }}
              className="border-blue-200 bg-blue-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <UnorderedListOutlined className="text-blue-500 text-xs" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                  Total Line Items
                </span>
              </div>
              <div className="text-lg font-extrabold text-blue-700">
                {summary.grandTotal.totalLineItems}
              </div>
            </Card>
            <Card
              bodyStyle={{ padding: "12px" }}
              className="border-green-200 bg-green-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarOutlined className="text-green-500 text-xs" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                  Total Amount
                </span>
              </div>
              <div className="text-lg font-extrabold text-green-700">
                GH₵ {formatNumber(summary.grandTotal.totalAmount)}
              </div>
            </Card>
            <Card
              bodyStyle={{ padding: "12px" }}
              className="border-purple-200 bg-purple-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <NumberOutlined className="text-purple-500 text-xs" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">
                  Total Quantity
                </span>
              </div>
              <div className="text-lg font-extrabold text-purple-700">
                {summary.grandTotal.totalQuantity}
              </div>
            </Card>
            <Card
              bodyStyle={{ padding: "12px" }}
              className="border-amber-200 bg-amber-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileTextOutlined className="text-amber-500 text-xs" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  Service Types
                </span>
              </div>
              <div className="text-lg font-extrabold text-amber-700">
                {summary.byServiceCode.length}
              </div>
            </Card>
          </div>

          <Card bodyStyle={{ padding: "0" }} className="mb-4">
            <Table
              dataSource={summary.byServiceCode}
              rowKey="service_code"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Service Code",
                  dataIndex: "service_code",
                  key: "service_code",
                  width: 150,
                  render: (text: string) => (
                    <Tag
                      color="blue"
                      className="text-[10px] font-mono cursor-pointer"
                      onClick={() => {
                        setServiceCodes(text || "");
                        setPage(1);
                      }}
                    >
                      {text || "N/A"}
                    </Tag>
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  render: (text: string) => (
                    <span className="text-xs text-gray-700">{text}</span>
                  ),
                },
                {
                  title: "Count",
                  dataIndex: "count",
                  key: "count",
                  width: 80,
                  align: "center" as const,
                  render: (val: number) => (
                    <span className="text-xs font-semibold text-blue-600">
                      {val}
                    </span>
                  ),
                },
                {
                  title: "Total Qty",
                  dataIndex: "totalQuantity",
                  key: "totalQuantity",
                  width: 90,
                  align: "center" as const,
                  render: (val: number) => (
                    <span className="text-xs font-mono">{val}</span>
                  ),
                },
                {
                  title: "Total Amount (GH₵)",
                  dataIndex: "totalAmount",
                  key: "totalAmount",
                  width: 150,
                  align: "right" as const,
                  render: (val: number) => (
                    <span className="text-xs font-mono font-bold text-gray-900">
                      {formatNumber(val)}
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <AiOutlineSearch className="text-gray-400 text-base flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by invoice no., service code, description, client name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            size="small"
            className="text-xs min-w-[130px]"
            placeholder="All Statuses"
          >
            <Option value="">All Statuses</Option>
            {invoicesStatusOptions
              .filter((s) => s !== "all")
              .map((s) => (
                <Option key={s} value={s}>
                  {normalizeText(s)}
                </Option>
              ))}
          </Select>

          <Select
            value={paymentFor}
            onChange={(v) => {
              setPaymentFor(v);
              setPage(1);
            }}
            size="small"
            className="text-xs min-w-[160px]"
            placeholder="All Payment Types"
            allowClear
          >
            <Option value="">All Payment Types</Option>
            {paymentForOptions.map((p) => (
              <Option key={p} value={p}>
                {normalizeText(p)}
              </Option>
            ))}
          </Select>

          <Select
            value={assigningEntity}
            onChange={(v) => {
              setAssigningEntity(v);
              setPage(1);
            }}
            size="small"
            className="text-xs min-w-[180px]"
            placeholder="All Entities"
            showSearch
            allowClear
            optionFilterProp="children"
          >
            <Option value="">All Entities</Option>
            {entities.map((e: any) => (
              <Option key={e._id || e.id} value={e._id || e.id}>
                {e.name}
              </Option>
            ))}
          </Select>

          <Select
            value={dateFilterType}
            onChange={(v) => setDateFilterType(v)}
            size="small"
            className="text-xs min-w-[120px]"
          >
            <Option value="issueDate">Issue Date</Option>
            <Option value="dueDate">Due Date</Option>
            <Option value="invoiceExpires">Expiry Date</Option>
            <Option value="createdAt">Created Date</Option>
          </Select>

          <RangePicker
            size="small"
            className="text-xs"
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates as [Dayjs | null, Dayjs | null]);
              setPage(1);
            }}
          />

          {serviceCodes && (
            <div className="flex items-center gap-1">
              <Tag
                color="purple"
                closable
                onClose={() => {
                  setServiceCodes("");
                  setPage(1);
                }}
                className="text-[10px]"
              >
                Codes: {serviceCodes}
              </Tag>
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-gray-500">
              {paginationInfo?.total ?? 0} total
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={lineItems}
          loading={isLoading || isFetching}
          pagination={false}
          rowKey={(_, index) => `${index}`}
          scroll={{ x: 1700, y: "60vh" }}
          size="small"
          onChange={handleTableChange}
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
            {paginationInfo?.total ?? 0} line items
          </div>
          <Pagination
            current={page}
            total={paginationInfo?.total || 0}
            pageSize={limit}
            onChange={(p) => setPage(p)}
            showSizeChanger
            onShowSizeChange={(_, size) => {
              setLimit(size);
              setPage(1);
            }}
            pageSizeOptions={["10", "25", "50", "100"]}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default LineItemRegistry;
