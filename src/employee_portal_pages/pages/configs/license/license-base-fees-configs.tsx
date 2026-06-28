import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
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
  Modal,
  Form,
  InputNumber,
  Select,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import {
  useFetchBaseFeesQuery,
  useUpdateBaseFeeMutation,
} from "@/redux/features/employee-portal-api/application/fees-config";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import { formatNumber, normalizeText } from "@/utils/helperFunction";
import { showSuccess, showError, showConfirm } from "@/lib/alert";

const LicenseBaseFeesConfigs = () => {
  PageTitle("License Base Fee Configurations | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("baseFee");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [form] = Form.useForm();

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Mutations
  const [updateBaseFee, { isLoading: isUpdating }] = useUpdateBaseFeeMutation();

  const {
    data: feesResponse,
    isLoading: isLoadingFees,
    isFetching: isFetchingFees,
    refetch,
  } = useFetchBaseFeesQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      type: "license",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const fees = feesResponse?.data || [];
  const paginationInfo = feesResponse?.pagination;

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
    if (filterType === "search") {
      setSearchTerm(value);
      setPage(1);
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setPage(1);
  }, []);

  // Handle edit modal open
  const handleEditOpen = useCallback(
    (record) => {
      setEditingConfig(record);
      form.setFieldsValue({
        baseFee: record.baseFee,
        paymentMode: record.paymentMode,
        // isActive: record.isActive,
      });
      setEditModalOpen(true);
    },
    [form]
  );

  // Handle edit form submission
  const handleEditSubmit = async (values: any) => {
    // Show confirmation dialog
    const confirmed = await showConfirm({
      title: "Update Configuration?",
      message: `Are you sure you want to update the license base fee configuration for <strong>${editingConfig?.name}</strong>? This action cannot be undone.`,
      confirmText: "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) {
      return;
    }

    try {
      const payload = {
        base_fees_id: editingConfig._id,
        applicationType: "license",
        base_fees: {
          baseFee: values.baseFee,
          paymentMode: values.paymentMode,
        },
      };

      await updateBaseFee({ payload }).unwrap();
      showSuccess("Configuration updated successfully!");
      setEditModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update configuration");
      console.error("Update error:", error);
    }
  };

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
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 100,
        fixed: "left",
        render: (type) => (
          <span className="text-xs font-medium text-gray-800">
            {normalizeText(type)}
          </span>
        ),
      },

      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("name")}
          >
            <span>Name</span>
            <SortIndicator field="name" />
          </div>
        ),
        dataIndex: "name",
        key: "name",
        width: 160,
        sorter: true,
        sortOrder: sortField === "name" ? sortOrder : null,
        render: (name) => (
          <Tooltip title={name}>
            <span className="text-xs font-medium text-gray-800 truncate">
              {name || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: (
          <div
            className="flex items-center justify-end cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("baseFee")}
          >
            <span>Base Fee (GHS)</span>
            <SortIndicator field="baseFee" />
          </div>
        ),
        dataIndex: "baseFee",
        key: "baseFee",
        width: 120,
        sorter: true,
        sortOrder: sortField === "baseFee" ? sortOrder : null,
        align: "right",
        render: (baseFee) => (
          <span className="text-xs font-medium text-gray-800">
            {baseFee !== undefined && baseFee !== null
              ? `${formatNumber(baseFee)}`
              : "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("paymentMode")}
          >
            <span>Payment Mode</span>
            <SortIndicator field="paymentMode" />
          </div>
        ),
        dataIndex: "paymentMode",
        key: "paymentMode",
        width: 130,
        sorter: true,
        sortOrder: sortField === "paymentMode" ? sortOrder : null,
        render: (paymentMode) => (
          <Tag
            color={
              paymentMode === "on_submission"
                ? "green"
                : paymentMode === "on_permit"
                ? "orange"
                : "default"
            }
            className="text-xs uppercase"
          >
            {paymentMode ? normalizeText(paymentMode) : "N/A"}
          </Tag>
        ),
      },
      // {
      //   title: (
      //     <div
      //       className="flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors"
      //       onClick={() => handleSort("isActive")}
      //     >
      //       <span>Status</span>
      //       <SortIndicator field="isActive" />
      //     </div>
      //   ),
      //   dataIndex: "isActive",
      //   key: "isActive",
      //   width: 100,
      //   align: "center",
      //   sorter: true,
      //   sortOrder: sortField === "isActive" ? sortOrder : null,
      //   render: (isActive) => (
      //     <Badge
      //       status={isActive ? "success" : "error"}
      //       text={isActive ? "Active" : "Inactive"}
      //     />
      //   ),
      // },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, record) => (
          <Space size="small">
            {/* <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                onClick={() => {
                  setSelectedConfig(record);
                  setViewModalOpen(true);
                }}
                className="hover:bg-blue-50 hover:border-blue-300"
              />
            </Tooltip> */}
            <Tooltip title="Edit Configuration">
              <Button
                icon={<EditOutlined />}
                size="small"
                type="default"
                onClick={() => handleEditOpen(record)}
                className="hover:bg-amber-50 hover:border-amber-300"
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [page, limit, sortField, sortOrder, handleSort, handleEditOpen]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    return count;
  }, [searchTerm]);

  return (
    <>
      {/* Edit Modal */}
      <Modal
        title="Edit License Base Fee Configuration"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-6"
        >
          <Form.Item label="Name" tooltip="Configuration name (read-only)">
            <Input
              value={editingConfig?.name}
              disabled
              className="bg-gray-50"
            />
          </Form.Item>

          <Form.Item
            label="Base Fee (GHS)"
            name="baseFee"
            rules={[
              { required: true, message: "Base fee is required" },
              {
                type: "number",
                min: 0,
                message: "Base fee must be a positive number",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              placeholder="Enter base fee"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Payment Mode"
            name="paymentMode"
            rules={[{ required: true, message: "Payment mode is required" }]}
          >
            <Select
              placeholder="Select payment mode"
              options={[
                { label: "On Submission", value: "on_submission" },
                { label: "On Permit", value: "on_permit" },
              ]}
            />
          </Form.Item>

          {/* <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
            initialValue={editingConfig?.isActive}
          >
            <Select
              placeholder="Select status"
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
            />
          </Form.Item> */}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setEditModalOpen(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="!bg-[#2E7D32]"
            >
              Update Configuration
            </Button>
          </div>
        </Form>
      </Modal>

      <div className="p-2 md:p-2">
        <Card
          variant="borderless"
          className="shadow-sm border bg-white"
          styles={{
            body: { padding: "16px" },
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  License Base Fee Configurations
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and configure license base fee settings
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-medium">
                  Total Configurations:
                </span>
                <Badge
                  count={paginationInfo?.total || 0}
                  showZero
                  style={{ backgroundColor: "#52c41a" }}
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 items-center">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search by code or name..."
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                className="rounded-lg flex-1 max-w-xs"
              />
              <Space>
                {activeFiltersCount > 0 && (
                  <Button
                    size="small"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Clear
                  </Button>
                )}
                <Tooltip title="Refresh Data">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={refetch}
                    loading={isFetchingFees}
                    className="hover:bg-blue-50"
                  />
                </Tooltip>
              </Space>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Spin spinning={isLoadingFees || isFetchingFees}>
              <Table
                columns={tableColumns as any}
                dataSource={fees}
                rowKey="_id"
                pagination={false}
                size="small"
                scroll={{
                  x: 1000,
                  y: "calc(100vh - 400px)",
                }}
                className="fees-table"
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
                            {searchTerm
                              ? "No configurations match your search"
                              : "No configurations found"}
                          </p>
                          {activeFiltersCount > 0 && (
                            <Button
                              type="link"
                              size="small"
                              onClick={clearAllFilters}
                            >
                              Clear Search
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

          {/* Pagination */}
          {paginationInfo && paginationInfo.total > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {Math.min((page - 1) * limit + 1, paginationInfo.total)}{" "}
                to {Math.min(page * limit, paginationInfo.total)} of{" "}
                {paginationInfo.total} configurations
              </div>

              <Pagination
                current={page}
                pageSize={limit}
                total={paginationInfo.total}
                onChange={(p, l) => {
                  setPage(p);
                  if (l) setLimit(l);
                }}
                showSizeChanger={true}
                showQuickJumper
                className="custom-pagination"
              />
            </div>
          )}
        </Card>
      </div>
      <style>{`
        .fees-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .fees-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
        }
        
        .fees-table .ant-table-tbody > tr:hover > td {
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

export default LicenseBaseFeesConfigs;
