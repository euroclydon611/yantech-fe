import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
  Input,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Row,
  Col,
  Button,
  Tag,
  Modal,
  Select,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  TeamOutlined,
  StopOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  useEntitySubordinateStaffsQuery,
  useEntityStaffStatusChangeMutation,
  useEntityStaffPermissionChangeMutation,
} from "../../../redux/features/employee-portal-api/entityApi";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import { useStatusFullListQuery } from "@/redux/features/configurations/statusApi";
import { Checkbox, List } from "antd";
import Swal from "sweetalert2";

export const permissions = [
  {
    value: "assignment_plan",
    label: "Access Assignment Plan",
    description:
      "Can view and access the Assignment Plan to manage task allocation.",
  },
  {
    value: "assign_task",
    label: "Assign Tasks",
    description: "Can assign tasks to staff members from the Assignment Plan.",
  },
  {
    value: "review_completed_task",
    label: "Review Completed Assignments",
    description:
      "Can review and validate tasks that have been marked as completed.",
  },
  {
    value: "reject_applications",
    label: "Reject Applications (Final)",
    description:
      "Can permanently reject an application. Rejected applications are closed and cannot be resubmitted or reassigned.",
  },
  {
    value: "view_invoices",
    label: "View Invoices",
    description: "Can view invoices generated.",
  },
  {
    value: "account_transcripts",
    label: "Payment Transactions",
    description:
      "Review transaction history and monitor all payment activities.",
  },
  {
    value: "transfer_application",
    label: "Transfer Applications",
    description:
      "Can transfer an application to another organizational entity for handling or further processing.",
  },
  {
    value: "registered_clients",
    label: "Registered Clients",
    description:
      "View and manage all registered clients within the system.",
  },
  {
    value: "payroll_validation",
    label: "Payroll Verification",
    description:
      "Review and verify employee payroll records for your department before payroll processing.",
  },
];

export default function Staff({ employee }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("staff_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [updateStaffStatus, { isLoading: isStatusUpdating }] =
    useEntityStaffStatusChangeMutation();
  const [updateStaffPermissions, { isLoading: isPermissionsUpdating }] =
    useEntityStaffPermissionChangeMutation();

  const { data: statuses } = useStatusFullListQuery({});

  const {
    data: staffResponse,
    isLoading,
    isFetching,
    refetch,
  } = useEntitySubordinateStaffsQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
    sortField,
    sortOrder,
    entity_id: employee.entity_id || employee?.entity?._id,
  });

  const handleOpenStatusModal = useCallback(
    (staff: any) => {
      setSelectedStaff(staff);
      // Try to find the status ID by name if status_id is not directly on the staff object
      const currentStatusId =
        staff?.status_id ||
        statuses?.data?.find(
          (s: any) => s.name.toLowerCase() === staff?.status?.toLowerCase()
        )?.id ||
        null;
      setSelectedStatusId(currentStatusId);
      setStatusModalVisible(true);
    },
    [statuses]
  );

  const handleOpenPermissionModal = useCallback((staff: any) => {
    setSelectedStaff(staff);
    setSelectedPermissions(staff.permissions || []);
    setPermissionModalVisible(true);
  }, []);

  const handleUpdatePermissions = useCallback(async () => {
    if (!selectedStaff) return;

    try {
      await updateStaffPermissions({
        staff_id: selectedStaff.staff_id,
        permissions: selectedPermissions,
      }).unwrap();

      setPermissionModalVisible(false);
      setSelectedStaff(null);
      setSelectedPermissions([]);

      Swal.fire({
        icon: "success",
        title: "Permissions Updated",
        text: "Staff permissions have been successfully updated.",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      setTimeout(() => refetch(), 500);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "There was an error updating staff permissions. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    }
  }, [selectedStaff, selectedPermissions, updateStaffPermissions, refetch]);

  const handleConfirmStatusChange = useCallback(async () => {
    if (!selectedStaff || !selectedStatusId) return;

    try {
      await updateStaffStatus({
        staff_id: selectedStaff.staff_id,
        status: selectedStatusId,
      }).unwrap();

      setStatusModalVisible(false);
      setSelectedStaff(null);
      setSelectedStatusId(null);

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Staff status has been successfully updated.`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      setTimeout(() => refetch(), 500);
    } catch (error: any) {
      console.error("Failed to update staff status:", error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "There was an error updating staff status. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    }
  }, [selectedStaff, selectedStatusId, updateStaffStatus, refetch]);

  const staffList = staffResponse?.data || [];
  const paginationInfo = staffResponse?.pagination;

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

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSortField("staff_id");
    setSortOrder("asc");
    setPage(1);
  }, []);

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
            onClick={() => handleSort("staff_id")}
          >
            <span>Staff ID</span>
            <SortIndicator field="staff_id" />
          </div>
        ),
        dataIndex: "staff_id",
        key: "staff_id",
        width: 100,
        sorter: true,
        sortOrder: sortField === "staff_id" ? sortOrder : null,
        render: (staff_id, staff) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-medium text-blue-600">
              {staff_id || "N/A"}
            </span>
            {staff?.is_head && <Badge color="orange" text="HOD" />}
          </div>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("firstname")}
          >
            <span>Name</span>
            <SortIndicator field="firstname" />
          </div>
        ),
        dataIndex: "firstname",
        key: "firstname",
        width: 150,
        sorter: true,
        sortOrder: sortField === "firstname" ? sortOrder : null,
        render: (_, staff) => (
          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs ${
                staff?.is_head
                  ? "bg-orange-500 text-white"
                  : "bg-green-100 text-green-700"
              } mr-3`}
            >
              <span>
                {(staff?.firstname?.[0] || "?") + (staff?.lastname?.[0] || "")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {staff?.firstname} {staff?.lastname}
              </p>
            </div>
          </div>
        ),
      },
      {
        title: <div className="text-xs">Grade</div>,
        dataIndex: "grade",
        key: "grade",
        width: 100,
        render: (grade) => (
          <span className="text-[10px] text-gray-600">{grade || "N/A"}</span>
        ),
      },
      {
        title: <div className="text-xs">Entity/Unit</div>,
        dataIndex: "entity_name",
        key: "entity_name",
        width: 120,
        render: (entity_name) => (
          <span className="text-[10px] text-gray-600">{entity_name || "N/A"}</span>
        ),
      },
      {
        title: <div className="text-xs">Email</div>,
        key: "email",
        width: 150,
        render: (_, staff) => (
          <Tooltip title={staff?.email || "No email"}>
            <p className="text-[10px] text-gray-600 truncate">
              {staff?.email || "N/A"}
            </p>
          </Tooltip>
        ),
      },
      {
        title: <div className="text-xs">Phone</div>,
        key: "phone",
        width: 120,
        render: (_, staff) => (
          <p className="text-[10px] text-gray-600">
            {staff?.phone_number_1 || "N/A"}
          </p>
        ),
      },
      {
        title: <div className="text-xs">Status</div>,
        key: "status",
        width: 90,
        render: (_, staff) => {
          const isActive =
            staff?.status?.toLowerCase() === "active" ||
            staff?.is_active === true;
          return (
            <Badge color={isActive ? "green" : "red"} text={staff?.status} />
          );
        },
      },
      {
        title: <div className="text-xs">Actions</div>,
        key: "actions",
        width: 200,
        render: (_, staff) => {
          const isActive =
            staff?.status?.toLowerCase() === "active" ||
            staff?.is_active === true;
          return (
            <Space size={4}>
              <Button
                icon={<StopOutlined />}
                size="small"
                type="default"
                onClick={() => handleOpenStatusModal(staff)}
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
              >
                Change Status
              </Button>
              <Button
                icon={<LockOutlined />}
                size="small"
                type="default"
                onClick={() => handleOpenPermissionModal(staff)}
                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
              >
                Permissions
              </Button>
            </Space>
          );
        },
      },
    ],
    [
      page,
      limit,
      sortField,
      sortOrder,
      handleSort,
      handleOpenStatusModal,
      handleOpenPermissionModal,
    ]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (sortField !== "staff_id" || sortOrder !== "asc") count++;
    return count;
  }, [searchTerm, sortField, sortOrder]);

  const isHR = employee?.permissions?.includes('payroll_validation') || employee?.department?.toLowerCase()?.includes('human resource') || employee?.department?.toLowerCase()?.includes('hr');

  if (!employee?.is_head && !isHR) {
    return null;
  }

  return (
    <>
      {/* ── FILTER TOOLBAR ── */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="mb-0">
          {/* Enhanced Filters Row */}
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                allowClear
                className="rounded-lg"
              />
            </Col>

            <Col xs={12} sm={6} lg={4}>
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
                    loading={isFetching}
                    className="hover:bg-blue-50"
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && searchTerm && (
            <div className="mt-2 p-1 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Active Filters:
                </span>
                <Tag closable onClose={() => setSearchTerm("")} color="blue">
                  Search: "{searchTerm}"
                </Tag>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Spin spinning={isLoading || isFetching}>
            <Table
              columns={tableColumns as any}
              dataSource={staffList}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{
                x: 1100,
                y: "calc(100vh - 260px)",
              }}
              className="staff-table"
              rowClassName={(record: any, index) =>
                `hover:bg-blue-50 transition-colors duration-150 ${
                  record?.is_head
                    ? "bg-orange-50 border-l-4 border-orange-400"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`
              }
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          {searchTerm
                            ? "No team members match your search"
                            : "No team members found"}
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
      </div>

      {/* ── PAGINATION ── */}
      {paginationInfo && paginationInfo.total > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            Showing {Math.min((page - 1) * limit + 1, paginationInfo.total)}–{Math.min(page * limit, paginationInfo.total)} of {paginationInfo.total} team members
          </span>
          <Pagination
            current={page}
            pageSize={limit}
            total={paginationInfo.total}
            onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
            showSizeChanger
            showQuickJumper
            size="small"
            className="staff-pagination"
          />
        </div>
      )}

      <style>{`
        .staff-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .staff-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
        }
        
        .staff-table .ant-table-tbody > tr:hover > td {
          background-color: #eff6ff !important;
        }
        
        .staff-pagination .ant-pagination-item-active,
        .custom-pagination .ant-pagination-item-active {
          border-color: #15803d;
          background-color: #15803d;
        }
        .staff-pagination .ant-pagination-item-active:hover,
        .custom-pagination .ant-pagination-item-active:hover {
          border-color: #166534;
          background-color: #166534;
        }
        .staff-pagination .ant-pagination-item-active a,
        .custom-pagination .ant-pagination-item-active a {
          color: #ffffff;
        }
        .staff-table .ant-table-body { overflow-y: auto !important; }
        
        .staff-table .ant-table-column-sorters {
          padding: 8px 12px;
        }
        
        .staff-table .ant-table-column-sorter {
          color: #9ca3af;
        }
        
        .staff-table .ant-table-column-sorter.ant-table-column-sorter-up.active,
        .staff-table .ant-table-column-sorter.ant-table-column-sorter-down.active {
          color: #3b82f6;
        }
      `}</style>

      <Modal
        title={`Change Status for ${selectedStaff?.firstname} ${selectedStaff?.lastname}`}
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false);
          setSelectedStaff(null);
          setSelectedStatusId(null);
        }}
        okText="Confirm"
        cancelText="Cancel"
        onOk={handleConfirmStatusChange}
        okButtonProps={{
          style: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
        }}
        confirmLoading={isStatusUpdating}
        width={500}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <Select
              placeholder="Choose a status"
              value={selectedStatusId}
              onChange={setSelectedStatusId}
              disabled={isStatusUpdating}
              style={{ width: "100%" }}
              options={statuses?.data?.map((status: any) => ({
                label: status.name,
                value: status.id,
              }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={`Update Permissions for ${selectedStaff?.firstname} ${selectedStaff?.lastname}`}
        open={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false);
          setSelectedStaff(null);
          setSelectedPermissions([]);
        }}
        okText="Update"
        cancelText="Cancel"
        onOk={handleUpdatePermissions}
        okButtonProps={{
          style: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
        }}
        confirmLoading={isPermissionsUpdating}
        width={600}
      >
        <div className="space-y-4 px-2">
          <p className="text-sm text-gray-600">
            Select the permissions you want to grant to this staff member.
          </p>
          <div className="border rounded-lg overflow-hidden">
            <List
              itemLayout="horizontal"
              dataSource={permissions}
              renderItem={(permission) => (
                <List.Item
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  actions={[
                    <Checkbox
                      key={permission.value}
                      checked={selectedPermissions.includes(permission.value)}
                      style={{ transform: "scale(1.2)" }}
                      disabled={isPermissionsUpdating}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([
                            ...selectedPermissions,
                            permission.value,
                          ]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter(
                              (p) => p !== permission.value
                            )
                          );
                        }
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span className="font-medium text-gray-800">
                        {permission.label}
                      </span>
                    }
                    description={
                      <span className="text-xs text-gray-500">
                        {permission.description}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
