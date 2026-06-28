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
  Space,
  Table,
  Badge,
  Divider,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  ProjectOutlined,
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import {
  useFetchAllMovementDocumentsQuery,
} from "@/redux/features/employee-portal-api/application/application";
import { formatDate2 } from "@/utils/helperFunction";
import ViewApplicationDetail from "@/employee_portal_pages/components/assignment-plan/application-review";
import {
  getStatusBadge,
  movementStatusOptions,
  permitTypes,
} from "@/employee_portal_pages/lib/helpers";
import AssignmentPlanModal from "@/employee_portal_pages/components/application/assignment-details";
import Swal from "sweetalert2";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";

const { Option } = Select;


const Movements = () => {
  PageTitle("Permit Applications | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("all");
  const [permitType, setPermitType] = useState("all");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [assignmentPlanModalOpen, setAssignmentPlanModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>({});

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: applicationsResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchAllMovementDocumentsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      permitType: permitType === "all" ? "" : permitType,
      status,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const applications = applicationsResponse?.data || [];
  const paginationInfo = applicationsResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: movementStatusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
      permitTypeOptions: [
        { label: "All Permit Types", value: "all" },
        ...permitTypes.map((type: string) => ({
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
      case "permitType":
        setPermitType(value);
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
    setPermitType("all");
    setSortField("createdAt");
    setSortOrder("desc");
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
        width: 50,
        fixed: "left",
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-xs">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },
      {
        title: "Notification No.",
        key: "notificationId",
        width: 140,
        fixed: "left",
        sortOrder: sortField === "notificationId" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (_, record) => (
          <span className="font-mono text-xs font-medium text-blue-600">
            {record?.notificationId?.code || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("movementNo")}
          >
            <span>Movement No.</span>
            <SortIndicator field="movementNo" />
          </div>
        ),
        dataIndex: "movementNo",
        key: "movementNo",
        width: 140,
        fixed: "left",
        sorter: true,
        sortOrder: sortField === "movementNo" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (movementNo) => (
          <span className="font-mono text-xs font-medium text-blue-600">
            {movementNo || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("actualQuantity")}
          >
            <span>Actual Qty</span>
            <SortIndicator field="actualQuantity" />
          </div>
        ),
        dataIndex: "actualQuantity",
        key: "actualQuantity",
        width: 140,
        sorter: true,
        sortOrder: sortField === "actualQuantity" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (actualQuantity, record) => (
          <span className="font-mono text-xs font-bold">
            {actualQuantity || "N/A"}{" "}
            {
              record.notificationId?.hazardousWasteDetails?.shipmentDetails
                ?.quantityUnit
            }
          </span>
        ),
      },
      {
        title: "No. of packages",
        dataIndex: "numberOfPackages",
        key: "numberOfPackages",
        width: 140,
        render: (numberOfPackages) => (
          <p className="font-medium text-gray-800 text-xs truncate">
            {numberOfPackages || "N/A"}
          </p>
        ),
      },

      {
        title: " No. in Series",
        dataIndex: "actualQuantity",
        key: "actualQuantity",
        width: 140,
        sorter: true,
        sortOrder: sortField === "actualQuantity" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (_, record) => (
          <span className="font-mono text-xs font-bold">
            {record?.serialNumber + "/" + record?.totalInSeries}{" "}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("createdAt")}
          >
            <span>Submitted</span>
            <SortIndicator field="createdAt" />
          </div>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        sorter: true,
        sortOrder: sortField === "createdAt" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (date) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-xs text-gray-600 font-mono">
              {formatDate2(date)}
            </span>
          </div>
        ),
      },
      {
        title: (
          <div
            className="flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("status")}
          >
            <span>Status</span>
            <SortIndicator field="status" />
          </div>
        ),
        dataIndex: "status",
        key: "status",
        width: 140,
        align: "center",
        sorter: true,
        sortOrder: sortField === "status" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (status) => getStatusBadge(status),
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        align: "center",
        render: (_, app) => (
          <Space size="small">
            <Tooltip title="View Application Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                onClick={() => {
                  setSelectedApplication(app);
                  setViewModalOpen(true);
                }}
                className="hover:bg-blue-50 hover:border-blue-300"
              />
            </Tooltip>
            <Tooltip title="View Application History">
              <Button
                icon={<ProjectOutlined />}
                size="small"
                type="default"
                onClick={() => {
                  setSelectedApplication(app._id);
                  setAssignmentPlanModalOpen(true);
                }}
                className="hover:bg-green-50 hover:border-green-300"
              />
            </Tooltip>
            <Tooltip title="View PDF">
              <Button
                icon={<FaFilePdf />}
                size="small"
                className="text-green-700 border-green-700 hover:!bg-green-700 hover:!text-white !transition !duration-200"
                // onClick={() => {
                //   setInvoice(invoice);
                //   setViewInvoice(true);
                // }}
                onClick={() => handleViewPDF(app._id)}
              />
            </Tooltip>
          </Space>
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
    if (permitType !== "all") count++;
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    return count;
  }, [searchTerm, status, permitType, sortField, sortOrder]);

  const handleViewPDF = async (invoiceId: string) => {
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
        }/revenue/application/permit-applications/${invoiceId}/view`,
        {
          withCredentials: true,
        }
      );

      const documentUrl = response?.data?.document_url;

      if (documentUrl) {
        // 3. Redirect the opened popup to the actual invoice PDF
        popup.location.href = documentUrl;
      } else {
        popup.close(); // Close the empty tab if the doc failed to load
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

  return (
    <>
      {viewModalOpen && (
        <ViewApplicationDetail
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={selectedApplication._id}
          applicationType={"movement"}
        />
      )}

      {assignmentPlanModalOpen && (
        <AssignmentPlanModal
          isOpen={assignmentPlanModalOpen}
          onClose={() => setAssignmentPlanModalOpen(false)}
          applicationId={selectedApplication}
        />
      )}

      <div className="p-2 md:p-2">
        <Card
          variant="borderless"
          className="shadow-sm border bg-white"
          styles={{
            body: { padding: "16px" },
          }}
        >
          {/* Enhanced Header with Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Shipment Monitoring
                </h2>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-600">
                    Track and oversee all hazardous waste movements
                  </p>
                  {activeFiltersCount > 0 && (
                    <Badge
                      count={activeFiltersCount}
                      style={{ backgroundColor: "#1890ff" }}
                    >
                      <FilterOutlined className="text-gray-400" />
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  count={paginationInfo?.total || 0}
                  showZero
                  style={{ backgroundColor: "#52c41a" }}
                >
                  <FolderOpenOutlined className="text-gray-400 text-lg" />
                </Badge>
                <span className="text-sm text-gray-600">Total Movements</span>
              </div>
            </div>

            {/* Enhanced Filters Row */}
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} lg={6}>
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  allowClear
                  className="rounded-lg"
                />
              </Col>

              <Col xs={24} sm={12} lg={5}>
                <Select
                  value={status}
                  onChange={(value) => handleFilterChange("status", value)}
                  className="w-full"
                  placeholder="Filter by status"
                  options={filterOptions.statusOptions}
                />
              </Col>
{/* 
              <Col xs={24} sm={12} lg={5}>
                <Select
                  value={permitType}
                  onChange={(value) => handleFilterChange("permitType", value)}
                  className="w-full"
                  placeholder="Filter by permit type"
                  options={filterOptions.permitTypeOptions}
                />
              </Col> */}

              <Col xs={12} sm={6} lg={3}>
                <Select
                  value={limit}
                  onChange={(value) => {
                    setLimit(value);
                    setPage(1);
                  }}
                  className="w-full"
                >
                  <Option value={10}>10 / page</Option>
                  <Option value={25}>25 / page</Option>
                  <Option value={50}>50 / page</Option>
                </Select>
              </Col>

              <Col xs={12} sm={6} lg={5} className="text-right">
                <Space>
                  {activeFiltersCount > 0 && (
                    <Button
                      size="small"
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Clear All
                    </Button>
                  )}
                  <Tooltip title="Refresh Data">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={refetch}
                      loading={isFetchingApplications}
                      className="hover:bg-blue-50"
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-2 p-1 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <Tag
                      closable
                      onClose={() => handleFilterChange("search", "")}
                      color="blue"
                    >
                      Search: "{searchTerm}"
                    </Tag>
                  )}
                  {status !== "all" && (
                    <Tag
                      closable
                      onClose={() => handleFilterChange("status", "all")}
                      color="green"
                    >
                      Status: {status.replace("_", " ")}
                    </Tag>
                  )}
                  {permitType !== "all" && (
                    <Tag
                      closable
                      onClose={() => handleFilterChange("permitType", "all")}
                      color="purple"
                    >
                      Type: {permitType.replace(/_/g, " ")}
                    </Tag>
                  )}
                  {(sortField !== "createdAt" || sortOrder !== "desc") && (
                    <Tag
                      closable
                      onClose={() => {
                        setSortField("createdAt");
                        setSortOrder("desc");
                      }}
                      color="orange"
                    >
                      Sort: {sortField} {sortOrder}
                    </Tag>
                  )}
                </div>
              </div>
            )}
          </div>

          <Divider className="my-4" />

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Spin spinning={isLoadingApplications || isFetchingApplications}>
              <Table
                columns={tableColumns as any}
                dataSource={applications}
                rowKey="_id"
                pagination={false}
                size="small"
                scroll={{
                  x: 1000,
                  y: "calc(100vh - 420px)",
                }}
                className="applications-table"
                rowClassName={(record, index) =>
                  `hover:bg-blue-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`
                }
                onChange={(pagination, filters, sorter: any) => {
                  if (sorter && sorter.field) {
                    setSortField(sorter.field);
                    setSortOrder(sorter.order || "asc");
                    setPage(1);
                  }
                }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            {searchTerm ||
                            status !== "all" ||
                            permitType !== "all"
                              ? "No applications match your current filters"
                              : "No applications found"}
                          </p>
                          {activeFiltersCount > 0 && (
                            <Button
                              type="link"
                              size="small"
                              onClick={clearAllFilters}
                            >
                              Clear All Filters
                            </Button>
                          )}
                        </div>
                      }
                    />
                  ),
                }}
              />
            </Spin>
          </div>

          {/* Enhanced Pagination */}
          {paginationInfo && paginationInfo.total > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {Math.min((page - 1) * limit + 1, paginationInfo.total)}{" "}
                to {Math.min(page * limit, paginationInfo.total)} of{" "}
                {paginationInfo.total} applications
                {activeFiltersCount > 0 && (
                  <span className="text-blue-600 ml-2">
                    (filtered from{" "}
                    {paginationInfo.totalUnfiltered || paginationInfo.total})
                  </span>
                )}
              </div>

              <Pagination
                current={page}
                pageSize={limit}
                total={paginationInfo.total}
                onChange={(p, l) => {
                  setPage(p);
                  if (l) setLimit(l);
                }}
                showSizeChanger={false}
                showQuickJumper
                className="custom-pagination"
              />
            </div>
          )}
        </Card>
      </div>
      <style>{`
        .applications-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .applications-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
        }
        
        .applications-table .ant-table-tbody > tr:hover > td {
          background-color: #eff6ff !important;
        }
        
        .custom-pagination .ant-pagination-item-active {
          border-color: #16a34a;
          background-color: #16a34a;
        }
        .custom-pagination .ant-pagination-item-active:hover {
           border-color: #16a34a; /* Tailwind green-600 */
           background-color: #16a34a;
          }
        
        .custom-pagination .ant-pagination-item-active a {
          color: #ffffff;
        }
        
        .applications-table .ant-table-column-sorters {
          padding: 8px 12px;
        }
        
        .applications-table .ant-table-column-sorter {
          color: #9ca3af;
        }
        
        .applications-table .ant-table-column-sorter.ant-table-column-sorter-up.active,
        .applications-table .ant-table-column-sorter.ant-table-column-sorter-down.active {
          color: #3b82f6;
        }
      `}</style>
    </>
  );
};

export default Movements;
