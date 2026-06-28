import { useEffect, useState } from "react";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaUserCheck, FaUserLock } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Table, Pagination, Tag, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdHistory } from "react-icons/md";
import RecordHistoryDrawer from "../settings/RecordHistoryDrawer";
import {
  useUserListQuery,
  useUserDeleteMutation,
  useDisableUserMutation,
} from "../../redux/features/users/userApi";
import Swal from "sweetalert2";
import { styles } from "../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDate4 } from "@/utils/helperFunction";

const Users = () => {
  PageTitle("Users");
  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasUserViewAccess = privileges?.includes("SETTINGS_USER_VIEW");
  const hasUserCreateAccess = privileges?.includes("SETTINGS_USER_CREATE");
  const hasUserEditAccess = privileges?.includes("SETTINGS_USER_EDIT");
  const hasUserDeleteAccess = privileges?.includes("SETTINGS_USER_DELETE");
  const hasUserEnableDisableAccess = privileges?.includes("SETTINGS_USER_ENABLE_DISABLE");
  const hasAuditLogsAccess = privileges?.includes("SETTINGS_AUDIT_LOGS_VIEW");

  if (!hasUserViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("firstname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [user, setUser] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryUser, setSelectedHistoryUser] = useState<any>(null);

  const [disableUser, { data, isSuccess, error }] = useDisableUserMutation();

  const [
    deleteUser,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useUserDeleteMutation();

  const {
    data: userListData,
    isLoading: isUserListLoading,
    refetch,
  } = useUserListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (user: any) => {
    const result = await Swal.fire({
      title: "Delete User",
      text: "Do you want to delete this user ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteUser(user._id);
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

  const handleDisableButtonClick = async (user: any) => {
    const result = await Swal.fire({
      title: "Disable User",
      text: "Do you want to disable this User ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Disable",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await disableUser({ _id: user._id });
      refetch();
    }
  };

  const handleEnableButtonClick = async (user: any) => {
    const result = await Swal.fire({
      title: "Enable User",
      text: "Do you want to enable this User ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Enable",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await disableUser({ _id: user._id });
      refetch();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
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
  }, [isSuccess, error, data]);

  const handleEditPopUp = (user: any) => {
    setUser(user);
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

  return (
    <>
      <AddUser open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditUser
        open={edit}
        onClose={() => setEdit(false)}
        itemData={user}
        refetch={refetch}
      />
      
      <PageLayout
        title="Users & Privileges"
        subtitle="Manage system users and access control"
        breadcrumbs={[{ label: "Settings" }, { label: "Users & Privileges" }]}
        actions={
          hasUserCreateAccess ? (
            <button className={`${styles.primary_button}`} onClick={() => setAdd(true)}>
              <LiaPlusSquareSolid size={16} />
              <span className="ml-1.5 font-medium">New User</span>
            </button>
          ) : undefined
        }
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-2 justify-between mb-3">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-500">Show</span>
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
              <span className="text-xs text-gray-500">entries</span>
            </div>
            <div className="flex relative w-full sm:w-64">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                placeholder="Search..."
                className="w-full text-sm px-4 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
              />
              <AiOutlineSearch size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 60,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "First Name",
                  dataIndex: "firstname",
                  key: "firstname",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("firstname"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Last Name",
                  dataIndex: "lastname",
                  key: "lastname",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("lastname"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Other Name",
                  dataIndex: "other_names",
                  key: "other_names",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("other_names"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                  width: 250,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("email"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Phone",
                  dataIndex: "phone",
                  key: "phone",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("phone"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Role",
                  dataIndex: "type",
                  key: "type",
                  width: 120,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("type"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Online Status",
                  key: "online",
                  width: 120,
                  render: (_text, record: any) => (
                    <Tag color={record.isOnline ? "green" : "default"} style={{ fontSize: '10px' }}>
                      {record.isOnline ? "● Online" : "Offline"}
                    </Tag>
                  ),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Last Seen",
                  key: "lastSeen",
                  width: 200,
                  render: (_text, record: any) => {
                    if (record.isOnline) return <span className="text-green-600 font-medium text-xs">Now</span>;
                    const ref = record.lastActivity || record.lastLogout;
                    if (!ref) return <span className="text-gray-400 text-xs">Never</span>;
                    const diff = Date.now() - new Date(ref).getTime();
                    const mins = Math.floor(diff / 60000);
                    const hrs = Math.floor(mins / 60);
                    const days = Math.floor(hrs / 24);
                    const label = days > 0 ? `${days}d ago` : hrs > 0 ? `${hrs}h ago` : mins > 1 ? `${mins}m ago` : "Just now";
                    return <span className="text-gray-500 text-xs">{label}</span>;
                  },
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Status",
                  key: "status",
                  width: 100,
                  render: (_text, record: any) => (
                    <span
                      className={
                        record.enabled
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {record.enabled ? "Enabled" : "Disabled"}
                    </span>
                  ),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
                {
                  title: "Actions",
                  key: "action",
                  width: 180,
                  align: "center" as const,
                  fixed: "right" as const,
                  render: (_text, record: any) => (
                    <div className="flex items-center justify-center gap-2">
                      {hasUserEditAccess && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleEditPopUp(record)}
                          >
                            <FaEdit size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Edit
                          </span>
                        </div>
                      )}
                      
                      {hasAuditLogsAccess && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                              setSelectedHistoryUser(record);
                              setHistoryOpen(true);
                            }}
                          >
                            <MdHistory size={16} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            History
                          </span>
                        </div>
                      )}

                      {hasUserEnableDisableAccess && (
                        record.enabled ? (
                          <div className="relative group">
                            <span
                              className="inline-flex items-center justify-center p-1.5 text-yellow-600 hover:bg-yellow-100 rounded transition-colors duration-200 cursor-pointer"
                              onClick={() => handleDisableButtonClick(record)}
                            >
                              <FaUserLock size={14} />
                            </span>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              Disable
                            </span>
                          </div>
                        ) : (
                          <div className="relative group">
                            <span
                              className="inline-flex items-center justify-center p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors duration-200 cursor-pointer"
                              onClick={() => handleEnableButtonClick(record)}
                            >
                              <FaUserCheck size={14} />
                            </span>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              Enable
                            </span>
                          </div>
                        )
                      )}
                      
                      {hasUserDeleteAccess && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleDeleteButtonClick(record)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                  onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
                },
              ]}
              dataSource={userListData?.data || []}
              rowKey="_id"
              loading={isUserListLoading}
              pagination={false}
              size="small"
              scroll={{ x: 1800, y: "65vh" }}
            />
          </div>
        </div>

        <div className="flex mt-4 justify-end">
          <Pagination
            current={page}
            pageSize={limit}
            total={userListData?.totalCount || 0}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      </PageLayout>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="User"
        recordId={selectedHistoryUser?._id}
        recordName={`${selectedHistoryUser?.firstname} ${selectedHistoryUser?.lastname}`}
      />
    </>
  );
};

export default Users;
