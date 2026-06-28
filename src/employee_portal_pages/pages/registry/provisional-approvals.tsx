import { useState, useMemo, useCallback, useEffect } from "react";
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
  Modal,
  Upload,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { formatDate2 } from "@/utils/helperFunction";
import { pa_freStatusOptions } from "@/employee_portal_pages/lib/helpers";
import {
  useFetchPAsQuery,
  useImportAuthorizationFileMutation,
} from "@/redux/features/employee-portal-api/authoirzations/fre-pa";
import Swal from "sweetalert2";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";

const { Option } = Select;



const ProvisionalApprovals = () => {
  PageTitle("Provisional Approvals |  IPMS EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("all");
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: pasResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchPAsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      status,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [loadData, { data, isSuccess, isLoading, error }] =
    useImportAuthorizationFileMutation();

  const provisionalApprovals = pasResponse?.data || [];
  const paginationInfo = pasResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: pa_freStatusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
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
            onClick={() => handleSort("productName")}
          >
            <span>Product</span>
            <SortIndicator field="productName" />
          </div>
        ),
        dataIndex: "productName",
        key: "productName",
        width: 100,
        fixed: "left",
        sorter: true,
        sortOrder: sortField === "productName" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (productName) => (
          <span className="font-mono text-[10px] font-medium">
            {productName || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("company")}
          >
            <span>Company</span>
            <SortIndicator field="company" />
          </div>
        ),
        dataIndex: "company",
        key: "company",
        width: 100,
        sorter: true,
        sortOrder: sortField === "company" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (company) => (
          <span className="font-mono text-[10px] font-medium">
            {company || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("provisionalApprovalNumber")}
          >
            <span>PA No.</span>
            <SortIndicator field="provisionalApprovalNumber" />
          </div>
        ),
        dataIndex: "provisionalApprovalNumber",
        key: "provisionalApprovalNumber",
        width: 80,
        sorter: true,
        sortOrder: sortField === "provisionalApprovalNumber" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (provisionalApprovalNumber) => (
          <span className="font-mono text-[10px] font-medium text-blue-600">
            {provisionalApprovalNumber || "N/A"}
          </span>
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
        dataIndex: "issuanceDate",
        key: "issuanceDate",
        width: 90,
        sorter: true,
        sortOrder: sortField === "issuanceDate" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (issuanceDate) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(issuanceDate)}
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
        width: 90,
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
      //   {
      //     title: "Actions",
      //     key: "actions",
      //     width: 100,
      //     align: "center",
      //     render: (_, app) => (
      //       <Space size="small">
      //         <Tooltip title="View Application Details">
      //           {/* action buttions here */}
      //         </Tooltip>
      //       </Space>
      //     ),
      //   },
    ],
    [page, limit, sortField, sortOrder, handleSort]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (status !== "all") count++;
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    return count;
  }, [searchTerm, status, sortField, sortOrder]);

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Data Import Completed";

      const {
        totalRecords,
        insertedRecords,
        failedRecords,
        invalidLines = [],
      } = data;

      // Construct message for failed records
      const failedMessage = invalidLines
        .map(
          (item) => `
            <strong>Line ${item.line}</strong>: ${item.reason}<br/>
            <strong>Missing Fields:</strong> ${
              item.missingFields?.join(", ") || "N/A"
            }<br/>
            <strong>Data:</strong> ${Object.entries(item.data)
              .map(([key, value]) => `${key}: ${value || "N/A"}`)
              .join(", ")}
            `
        )
        .join("<br><hr>");

      const outcome = `
          <strong>Total Records:</strong> ${totalRecords}<br><br>
          <strong>Inserted:</strong> ${insertedRecords}<br><br>
          <strong>Failed Records:</strong> ${failedRecords}<br><br>
          ${failedMessage || "None"}
        `;

      Swal.fire({
        title: message,
        icon: "success",
        html: outcome,
        confirmButtonColor: "#2E7D32",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch();
          setUploadModalVisible(false);
        }
      });
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  return (
    <>
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
                  Provisional Approvals (PA)
                </h2>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-600">
                    Manage and review products with provisional approval status.
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
                <span className="text-sm text-gray-600">
                  Total Applications
                </span>
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

                  {/* Add Upload Button */}
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setUploadModalVisible(true)}
                    className="bg-green-600 hover:!bg-green-700 border-green-600"
                    disabled={isLoading}
                  >
                    Import
                  </Button>
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
                dataSource={provisionalApprovals}
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
                    const order =
                      sorter.order === "ascend"
                        ? "asc"
                        : sorter.order === "descend"
                        ? "desc"
                        : "asc";
                    setSortOrder(order);
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
                            {searchTerm || status !== "all"
                              ? "No data match your current filters"
                              : "No data found"}
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
                {paginationInfo.total} PA(s)
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

      {/* upload modal */}
      <>
        <Modal
          title="Import Provisional Approvals"
          open={uploadModalVisible}
          onCancel={() => {
            setUploadModalVisible(false);
            setExcelFile(null);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setUploadModalVisible(false);
                setExcelFile(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="import"
              type="primary"
              disabled={!excelFile || isLoading}
              onClick={() => {
                loadData({ file: excelFile, type: "pa" });

                setUploadModalVisible(false);
                setExcelFile(null);
                refetch();
              }}
              className="bg-green-600 hover:!bg-green-700 !border-green-600"
            >
              Import Data
            </Button>,
          ]}
          width={600}
        >
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <InboxOutlined className="text-blue-600" />
              Upload Excel File
            </h4>
            <p className="text-sm text-gray-600">
              Select an Excel file containing provisional approval data to import
            </p>
          </div>

          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".xlsx,.xls,.csv"
            beforeUpload={(file) => {
              const isExcel =
                file.type ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel" ||
                file.name.endsWith(".csv");
              if (!isExcel) {
                message.error("You can only upload Excel or CSV files!");
                return Upload.LIST_IGNORE;
              }
              setExcelFile(file);
              return false;
            }}
            onRemove={() => {
              setExcelFile(null);
            }}
            fileList={excelFile ? [excelFile as any] : []}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. (.xlsx, .xls, .csv)
            </p>
          </Upload.Dragger>
        </Modal>
      </>

      <style>{`
        .applications-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          font-size: 0.75rem;
        }
        
        .applications-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.75rem;
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

export default ProvisionalApprovals;
