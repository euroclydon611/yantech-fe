import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
  Input,
  Button,
  Card,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Divider,
  Modal,
  Form,
  InputNumber,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import {
  useFetchBaseFeesQuery,
  useUpdateBaseFeeMutation,
} from "@/redux/features/employee-portal-api/application/fees-config";

import { formatNumber, normalizeText } from "@/utils/helperFunction";
import { showSuccess, showError, showConfirm } from "@/lib/alert";

const LicenseLocationConfigs = () => {
  PageTitle("License Location Configurations | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [form] = Form.useForm();

  console.log("editingConfig",editingConfig)


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

  const fees = feesResponse?.business_locations || [];
  const paginationInfo = feesResponse?.pagination;

  // Handle edit modal open
  const handleEditOpen = useCallback(
    (record) => {
      setEditingConfig(record);
      form.setFieldsValue({
        surcharge: record.surcharge,
        description: record.description,
        sub_description: record.sub_description,
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
      message: `Are you sure you want to update the configuration for <strong>${editingConfig?.name}</strong>? This action cannot be undone.`,
      confirmText: "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) {
      return;
    }

    try {
      const payload = {
        business_locations_id: editingConfig._id,
        applicationType: "license",
        business_locations: {
          surcharge: values.surcharge,
          description: values.description,
          sub_description: values.sub_description,
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
        width: 100,
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
        width: 180,
        render: (description) => (
          <Tooltip title={description}>
            <span className="text-xs font-medium text-gray-800 truncate">
              {description || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Sub Description",
        dataIndex: "sub_description",
        key: "sub_description",
        width: 200,
        render: (sub_description) => (
          <Tooltip title={sub_description}>
            <span className="text-xs text-gray-600 truncate">
              {sub_description || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Surcharge (GHS)",
        dataIndex: "surcharge",
        key: "surcharge",
        width: 120,
        align: "right",
        render: (surcharge) => (
          <span className="text-xs font-medium text-gray-800">
            {surcharge !== undefined && surcharge !== null
              ? `${formatNumber(surcharge)}`
              : "N/A"}
          </span>
        ),
      },

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
        title="Edit Location Configuration"
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
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input placeholder="e.g., Tier 1: Major Urban" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Sub Description"
            name="sub_description"
            rules={[{ required: true, message: "Sub description is required" }]}
          >
            <Input
              placeholder="e.g., Accra, Tema, Kumasi, Takoradi etc"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Surcharge (GHS)"
            name="surcharge"
            rules={[
              { required: true, message: "Surcharge is required" },
              {
                type: "number",
                min: 0,
                message: "Surcharge must be a positive number",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              placeholder="Enter surcharge"
              className="w-full"
            />
          </Form.Item>

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
                  License Location Configurations
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and configure business location surcharge settings
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

export default LicenseLocationConfigs;
