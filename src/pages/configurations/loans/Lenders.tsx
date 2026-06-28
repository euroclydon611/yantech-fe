import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import AddLender from "./AddLender";
import EditLender from "./EditLender";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pagination, Table, Tag, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import {
  useGetLendersQuery,
  useDeleteLenderMutation,
} from "../../../redux/features/configurations/lenderApi";
import { styles } from "../../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Swal from "sweetalert2";

const Lenders = () => {
  PageTitle("Lenders | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_LENDERS_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_LENDERS_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_LENDERS_DELETE");

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLender, setSelectedLender] = useState<any>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState<string>("");
  const [historyRecordName, setHistoryRecordName] = useState<string>("");

  const {
    data: lendersData,
    isLoading,
    refetch,
  } = useGetLendersQuery(
    {
      page,
      limit,
      searchQuery: searchTerm,
      sortField: "name",
      sortOrder: "asc",
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteLender] = useDeleteLenderMutation();

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Lender",
      text: "Are you sure you want to delete this lender?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteLender(id).unwrap();
        Swal.fire("Deleted!", "Lender has been deleted.", "success");
        refetch();
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.data?.error || error?.data?.error || "Something went wrong",
          "error"
        );
      }
    }
  };

  const handleEditPopUp = (lender: any) => {
    setSelectedLender(lender);
    setEdit(true);
  };

  return (
    <>
      <AddLender open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditLender
        open={edit}
        onClose={() => setEdit(false)}
        itemData={selectedLender}
        refetch={refetch}
      />

      <PageLayout
        title="Lenders"
        subtitle="Manage lending institutions for loan deductions"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Lenders" }]}
      />
      <div className="p-4">

        <div className="bg-white p-4">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span className="max-md:hidden text-gray-700 font-medium">
                Show
              </span>
              <select
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

            <div className="flex gap-2 items-center flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search lender name or code..."
                  className={`w-full text-[14px] px-[1rem] py-[0.5rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39afd1] focus:border-transparent transition duration-200`}
                />
                <AiOutlineSearch
                  size={18}
                  className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {hasCreateAccess && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">New Lender</span>
                </button>
              )}
            </div>
          </div>

          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              sticky
              dataSource={lendersData?.data || []}
              rowKey="_id"
              loading={isLoading}
              pagination={false}
              size="small"
              scroll={{ x: 1200, y: "65vh" }}
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 50,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                },
                {
                  title: "Lender Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                },
                {
                  title: "Code",
                  dataIndex: "code",
                  key: "code",
                  width: 120,
                  render: (code) => code || "N/A",
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  key: "type",
                  width: 120,
                  render: (type) => (
                    <Tag color="blue">{type.toUpperCase()}</Tag>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "is_active",
                  key: "is_active",
                  width: 100,
                  render: (isActive) => (
                    <Tag color={isActive ? "green" : "red"}>
                      {isActive ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                  ),
                },
                {
                  title: "Created By",
                  key: "created_by",
                  width: 180,
                  render: (_text, record: any) =>
                    record.created_by
                      ? `${record.created_by.firstname} ${record.created_by.lastname}`
                      : "System",
                },
                {
                  title: "Action",
                  key: "action",
                  width: 120,
                  align: "center",
                  hidden: !hasEditAccess && !hasDeleteAccess,
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
                            setHistoryRecordName(record.name);
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
              total={lendersData?.totalCount || 0}
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
        modelName="Lender"
        recordName={historyRecordName}
      />
    </>
  );
};

export default Lenders;
