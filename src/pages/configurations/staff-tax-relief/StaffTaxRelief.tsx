import { useState } from "react";
import AddStaffTaxRelief from "./AddStaffTaxRelief";
import EditStaffTaxRelief from "./EditStaffTaxRelief";
import LoadStaffTaxRelief from "./LoadStaffTaxRelief";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pagination, Table, Tag, Tooltip, Switch } from "antd";
import { AiOutlineSearch, AiOutlineCloudUpload } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import {
  useGetStaffTaxReliefsQuery,
  useChangeStaffTaxReliefStatusMutation,
  useDeleteStaffTaxReliefMutation,
  useBulkDeleteStaffTaxReliefsMutation,
} from "../../../redux/features/configurations/staffTaxReliefApi";
import { styles } from "../../../styles";
import Swal from "sweetalert2";
import {
  capitalizeFirstLetter,
  exportData,
  formatNumber,
} from "../../../utils/helperFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const StaffTaxRelief = () => {
  PageTitle("Staff Tax Relief | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_DELETE");
  const hasUpdateAccess = privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_UPDATE");

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRelief, setSelectedRelief] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState<string>("");
  const [historyRecordName, setHistoryRecordName] = useState<string>("");

  const {
    data: reliefData,
    isLoading,
    refetch,
  } = useGetStaffTaxReliefsQuery(
    {
      page,
      limit,
      searchQuery: searchTerm,
      status: statusFilter.toLowerCase(),
      sortField,
      sortOrder,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [changeStatus] = useChangeStaffTaxReliefStatusMutation();
  const [deleteRelief] = useDeleteStaffTaxReliefMutation();
  const [bulkDelete] = useBulkDeleteStaffTaxReliefsMutation();

  const handleExport = async () => {
    const route = `/staff-tax-relief/export?searchQuery=${searchTerm}&status=${statusFilter}`;
    await exportData(route, "Staff_Tax_Reliefs");
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await changeStatus({ id, status: newStatus }).unwrap();
      Swal.fire({
        title: "Success",
        text: `Status changed to ${newStatus}`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      refetch();
    } catch (error: any) {
      Swal.fire("Error", error?.data?.error || error?.data?.message || "Failed to change status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRelief(id).unwrap();
        Swal.fire("Deleted!", "Staff tax relief has been deleted.", "success");
        refetch();
      } catch (error: any) {
        Swal.fire("Error", error?.data?.error || error?.data?.message || "Failed to delete", "error");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRowKeys.length} items. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await bulkDelete({ ids: selectedRowKeys }).unwrap();
        Swal.fire("Deleted!", `${selectedRowKeys.length} items have been deleted.`, "success");
        setSelectedRowKeys([]);
        refetch();
      } catch (error: any) {
        Swal.fire("Error", error?.data?.message || "Failed to delete items", "error");
      }
    }
  };

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleEditPopUp = (relief: any) => {
    setSelectedRelief(relief);
    setEdit(true);
  };

  return (
    <>
      <AddStaffTaxRelief open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditStaffTaxRelief
        open={edit}
        onClose={() => setEdit(false)}
        itemData={selectedRelief}
        refetch={refetch}
      />
      <LoadStaffTaxRelief open={load} onClose={() => setLoad(false)} refetch={refetch} />

      <PageLayout
        title="Staff Tax Relief"
        subtitle="Manage tax relief assignments for staff"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Staff Tax Relief" }]}
        actions={
          selectedRowKeys.length > 0 && hasDeleteAccess ? (
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
              onClick={handleBulkDelete}
            >
              <FaTrash size={12} />
              <span>Delete Selected ({selectedRowKeys.length})</span>
            </button>
          ) : undefined
        }
      />
      <div className="p-4">

        <div className="bg-white p-4">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span className="max-md:hidden text-gray-700 font-medium">Show</span>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`${styles.limit_select}`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="max-md:hidden text-gray-700 font-medium">entries</span>
            </div>

            <div className="flex gap-2 items-center flex-1 max-w-md">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${styles.limit_select} h-[38px]`}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search relief name or staff ID..."
                  className={`w-full text-[14px] px-[1rem] py-[0.5rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39afd1] focus:border-transparent transition duration-200`}
                />
                <AiOutlineSearch
                  size={18}
                  className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className={`${styles.primary_button} !bg-green-600`}
                onClick={handleExport}
              >
                <AiOutlineCloudUpload size={18} />
                <span className="ml-2 max-md:hidden font-medium">Export</span>
              </button>
              {hasCreateAccess && (
                <button
                  className={`${styles.primary_button} !bg-[#39afd1]`}
                  onClick={() => setLoad(true)}
                >
                  <AiOutlineCloudUpload size={18} />
                  <span className="ml-2 max-md:hidden font-medium">
                    Load Reliefs
                  </span>
                </button>
              )}
              {hasCreateAccess && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">
                    New Relief
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              sticky
              rowSelection={rowSelection}
              dataSource={reliefData?.data || []}
              rowKey="_id"
              loading={isLoading}
              pagination={false}
              size="small"
              scroll={{ x: 1000, y: "65vh" }}
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 50,
                  render: (_text, _record, index) => (page - 1) * limit + index + 1,
                },
                {
                  title: "Relief Name",
                  dataIndex: "name",
                  key: "name",
                  width: 150,
                },
                {
                  title: "Staff ID",
                  dataIndex: "staff_id",
                  key: "staff_id",
                  width: 100,
                },
                {
                  title: "Employee",
                  dataIndex: "employee_name",
                  key: "employee",
                  width: 200,
                  render: (text: string) => text || "N/A",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                  width: 120,
                  align: "right",
                  render: (val) => formatNumber(val),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 120,
                  render: (status: string, record: any) => (
                    <div className="flex items-center gap-2">
                      <Tag color={status === "active" ? "green" : "red"}>
                        {status.toUpperCase()}
                      </Tag>
                      <Switch
                        size="small"
                        checked={status === "active"}
                        onChange={() => handleStatusChange(record._id, status)}
                        disabled={!hasUpdateAccess}
                      />
                    </div>
                  ),
                },
                {
                  title: "Action",
                  key: "action",
                  width: 120,
                  align: "center",
                  render: (_text, record: any) => (
                    <span className="flex items-center justify-center gap-2">
                      {hasEditAccess && (
                        <Tooltip title="Edit">
                          <span
                            className="text-blue-600 cursor-pointer p-1.5 hover:bg-blue-100 rounded"
                            onClick={() => handleEditPopUp(record)}
                          >
                            <FaEdit size={14} />
                          </span>
                        </Tooltip>
                      )}
                      {hasDeleteAccess && (
                        <Tooltip title="Delete">
                          <span
                            className="text-red-600 cursor-pointer p-1.5 hover:bg-red-100 rounded"
                            onClick={() => handleDelete(record._id)}
                          >
                            <FaTrash size={14} />
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title="History">
                        <span
                          className="text-gray-600 cursor-pointer p-1.5 hover:bg-gray-100 rounded"
                          onClick={() => {
                            setHistoryRecordId(record._id);
                            setHistoryRecordName(`${record.employee_name || 'Staff'} - ${record.name}`);
                            setHistoryDrawerVisible(true);
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: 14 }} />
                        </span>
                      </Tooltip>
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={reliefData?.totalCount || 0}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <RecordHistoryDrawer
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
        recordId={historyRecordId}
        modelName="StaffTaxRelief"
        recordName={historyRecordName}
      />
    </>
  );
};

export default StaffTaxRelief;
