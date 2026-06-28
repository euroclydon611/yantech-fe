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
  Divider,
  Modal,
  Form,
  InputNumber,
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import {
  useFetchBaseFeesQuery,
  useUpdateBaseFeeMutation,
} from "@/redux/features/employee-portal-api/application/fees-config";

import { formatNumber, normalizeText } from "@/utils/helperFunction";
import { showSuccess, showError, showConfirm } from "@/lib/alert";

const LicenseScaleConfigs = () => {
  PageTitle("License Scale Configurations | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [form] = Form.useForm();

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
      type: "license",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const fees = feesResponse?.business_scales || [];
  const paginationInfo = feesResponse?.pagination;

  // Handle edit modal open
  const handleEditOpen = useCallback(
    (record) => {
      setEditingConfig(record);
      form.setFieldsValue({
        description: record.description,
        multiplier: record.multiplier?.$numberDecimal,
        // turnover_min: record.turnover_min,
        // turnover_max: record.turnover_max,
        // storage_min: record.storage_min,
        // storage_max: record.storage_max,
        // column_type: record.column_type,
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
      message: `Are you sure you want to update the scale configuration for <strong>${editingConfig?.name}</strong>? This action cannot be undone.`,
      confirmText: "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) {
      return;
    }

    try {
      const payload = {
        business_scales_id: editingConfig._id,
        applicationType: "license",
        business_scales: {
          description: values.description,
          multiplier: values.multiplier,
          // turnover_min: values.turnover_min || null,
          // turnover_max: values.turnover_max || null,
          // storage_min: values.storage_min || null,
          // storage_max: values.storage_max || null,
          // column_type: values.column_type,
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
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 80,
        render: (name) => (
          <span className="text-xs font-medium text-gray-800">
            {normalizeText(name) || "N/A"}
          </span>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 150,
        render: (description) => (
          <Tooltip title={description}>
            <span className="text-xs text-gray-800 truncate">
              {description || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Multiplier",
        dataIndex: "multiplier",
        key: "multiplier",
        width: 80,
        align: "right",
        render: (multiplier) => (
          <span className="text-xs font-medium text-gray-800">
            {multiplier !== undefined && multiplier !== null
              ? formatNumber(multiplier?.$numberDecimal)
              : "N/A"}
          </span>
        ),
      },
      // {
      //   title: "Turnover Min",
      //   dataIndex: "turnover_min",
      //   key: "turnover_min",
      //   width: 100,
      //   align: "right",
      //   render: (turnover_min) => (
      //     <span className="text-xs text-gray-600">
      //       {turnover_min !== undefined && turnover_min !== null
      //         ? `${formatNumber(turnover_min)}`
      //         : "—"}
      //     </span>
      //   ),
      // },
      // {
      //   title: "Turnover Max",
      //   dataIndex: "turnover_max",
      //   key: "turnover_max",
      //   width: 100,
      //   align: "right",
      //   render: (turnover_max) => (
      //     <span className="text-xs text-gray-600">
      //       {turnover_max !== undefined && turnover_max !== null
      //         ? `${formatNumber(turnover_max)}`
      //         : "—"}
      //     </span>
      //   ),
      // },
      // {
      //   title: "Storage Min",
      //   dataIndex: "storage_min",
      //   key: "storage_min",
      //   width: 90,
      //   align: "right",
      //   render: (storage_min) => (
      //     <span className="text-xs text-gray-600">
      //       {storage_min !== undefined && storage_min !== null
      //         ? `${formatNumber(storage_min)}`
      //         : "—"}
      //     </span>
      //   ),
      // },
      // {
      //   title: "Storage Max",
      //   dataIndex: "storage_max",
      //   key: "storage_max",
      //   width: 90,
      //   align: "right",
      //   render: (storage_max) => (
      //     <span className="text-xs text-gray-600">
      //       {storage_max !== undefined && storage_max !== null
      //         ? `${formatNumber(storage_max)}`
      //         : "—"}
      //     </span>
      //   ),
      // },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, record) => (
          <Space size="small">
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
    [page, limit, handleEditOpen]
  );

  return (
    <>
      {/* Edit Modal */}
      <Modal
        title="Edit Scale Configuration"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
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
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input
              placeholder="e.g., Small scale business"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Multiplier"
            name="multiplier"
            rules={[
              { required: true, message: "Multiplier is required" },
              {
                type: "number",
                min: 0,
                message: "Multiplier must be a positive number",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.1}
              precision={2}
              placeholder="e.g., 1.0"
              className="w-full"
            />
          </Form.Item>

          {/* <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Turnover Min" name="turnover_min">
              <InputNumber min={0} placeholder="Optional" className="w-full" />
            </Form.Item>
            <Form.Item label="Turnover Max" name="turnover_max">
              <InputNumber min={0} placeholder="Optional" className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Storage Min" name="storage_min">
              <InputNumber min={0} placeholder="Optional" className="w-full" />
            </Form.Item>
            <Form.Item label="Storage Max" name="storage_max">
              <InputNumber min={0} placeholder="Optional" className="w-full" />
            </Form.Item>
          </div> */}

          {/* <Form.Item
            label="Column Type"
            name="column_type"
            rules={[{ required: true, message: "Column type is required" }]}
          >
            <Select
              placeholder="Select column type"
              options={[
                { label: "Default", value: "default" },
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
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
                  License Scale Configurations
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and configure business scale multipliers and thresholds
                </p>
              </div>
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
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No configurations found"
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
      `}</style>
    </>
  );
};

export default LicenseScaleConfigs;
