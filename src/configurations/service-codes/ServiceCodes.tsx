import { useEffect, useState } from "react";
import CustomModal from "../../utils/CustomModal";
import EditModal from "../../utils/EditModal";
import AddServiceCode from "./AddServiceCode";
import EditServiceCode from "./EditServiceCode";
import { PageTitle } from "../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Pagination, Table, Tag, Select, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { HistoryOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../pages/settings/RecordHistoryDrawer";
import {
  useListServiceCodesQuery,
  useDeleteServiceCodeMutation,
  useUpdateServiceCodeMutation,
} from "../../redux/features/configurations/service_codes";
import Swal from "sweetalert2";
import { styles } from "../../styles";
import { usePrivileges } from "../../hooks/usePrivileges";


const ServiceCodes = () => {
  PageTitle("Service Codes | Configuration");
  const { 
    hasServiceCodesAccess, 
    hasServiceCodesCreate, 
    hasServiceCodesEdit, 
    hasServiceCodesDelete 
  } = usePrivileges();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [serviceCode, setServiceCode] = useState<any>("");
  const [statusFilter, setStatusFilter] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  const [
    deleteServiceCode,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useDeleteServiceCodeMutation();

  const [updateServiceCode] = useUpdateServiceCodeMutation();

  const {
    data: serviceCodeListData,
    isLoading: isServiceCodeListLoading,
    refetch,
  } = useListServiceCodesQuery({ page, limit, searchTerm, sortField, sortOrder, status: statusFilter });

  const handleToggleStatus = async (record: any) => {
    const newStatus = record.status === "active" ? "inactive" : "active";
    const result = await Swal.fire({
      title: `${newStatus === "active" ? "Activate" : "Deactivate"} Service Code`,
      text: `Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} "${record.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "active" ? "#52c41a" : "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: `Yes, ${newStatus === "active" ? "activate" : "deactivate"} it!`,
    });

    if (result.isConfirmed) {
      await updateServiceCode({ _id: record._id, status: newStatus });
      refetch();
    }
  };

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (code: any) => {
    const result = await Swal.fire({
      title: "Delete Service Code",
      text: "Do you want to delete this service code?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteServiceCode(code._id);
      refetch();
    }
  };

  useEffect(() => {
    if (isDeletingSuccess) {
      const message = `${deletedData?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
    }
    if (deletionError) {
      if ("data" in deletionError) {
        const errorData = deletionError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData]);

  const handleEditPopUp = (code: any) => {
    setServiceCode(code);
    setEdit(true);
  };

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (!hasServiceCodesAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view Service Codes.
        </h1>
      </div>
    );
  }

  return (
    <>
      {add && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          Component={AddServiceCode}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditServiceCode}
          itemData={serviceCode}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Service Codes</h1>

        <div className="bg-white p-4">
          <div className="flex justify-between mb-2">
            <div className="flex gap-2 items-center">
              <span className="max-md:hidden text-gray-700 font-medium">
                Show
              </span>
              <select
                name="limit"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`${styles.limit_select}`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="max-md:hidden text-gray-700 font-medium">
                entries
              </span>
            </div>
            <div className="flex relative w-[25%] max-md:w-[55%]">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                placeholder="Search..."
                className={`w-full text-[14px] px-[1rem] py-[0.5rem] border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#39afd1] focus:border-transparent transition duration-200`}
              />
              <AiOutlineSearch
                size={18}
                className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
              />
            </div>
            <div className="flex gap-3 items-center">
              <Select
                value={statusFilter || "all"}
                onChange={(val) => setStatusFilter(val === "all" ? "" : val)}
                style={{ width: 130 }}
                size="middle"
              >
                <Select.Option value="all">All Statuses</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
              {hasServiceCodesCreate && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">New Service Code</span>
                </button>
              )}
            </div>
          </div>
          <div className="table-wrapper max-h-[65vh] overflow-y-auto bg-white rounded-sm shadow-sm">
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 60,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("name"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Service Code",
                  dataIndex: "service_code",
                  key: "service_code",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("service_code"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 100,
                  align: "center" as const,
                  render: (status: string) =>
                    status === "active" ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>
                    ) : (
                      <Tag icon={<StopOutlined />} color="default">Inactive</Tag>
                    ),
                },
                {
                  title: "Actions",
                  key: "action",
                  width: 140,
                  align: "center" as const,
                  render: (_text, record: any) => (
                    <div className="flex items-center justify-center gap-1">
                      {hasServiceCodesEdit && (
                        <Tooltip title="Edit">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleEditPopUp(record)}
                          >
                            <FaEdit size={14} />
                          </span>
                        </Tooltip>
                      )}

                      {hasServiceCodesEdit && (
                        <Tooltip title={record.status === "active" ? "Deactivate" : "Activate"}>
                          <span
                            className={`inline-flex items-center justify-center p-1.5 rounded transition-colors duration-200 cursor-pointer ${
                              record.status === "active"
                                ? "text-orange-600 hover:bg-orange-100"
                                : "text-green-600 hover:bg-green-100"
                            }`}
                            onClick={() => handleToggleStatus(record)}
                          >
                            {record.status === "active" ? <StopOutlined style={{ fontSize: 14 }} /> : <CheckCircleOutlined style={{ fontSize: 14 }} />}
                          </span>
                        </Tooltip>
                      )}

                      <Tooltip title="History">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setSelectedHistoryRecord(record);
                            setHistoryOpen(true);
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: 14 }} />
                        </span>
                      </Tooltip>

                      {hasServiceCodesDelete && (
                        <Tooltip title="Delete">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleDeleteButtonClick(record)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  ),
                },
              ]}
              dataSource={serviceCodeListData?.data || []}
              rowKey="_id"
              loading={isServiceCodeListLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No service codes found" }}
              scroll={{ x: 900 }}
            />
          </div>

          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={serviceCodeListData?.totalCount || 0}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="ServiceCode"
        recordId={selectedHistoryRecord?._id}
        recordName={selectedHistoryRecord?.name}
      />
    </>
  );
};

export default ServiceCodes;
