import { useEffect, useState } from "react";
import AddRank from "./AddRank";
import EditRank from "./EditRank";
import LoadRanks from "./LoadRanks";
import CustomModal from "../../../utils/CustomModal";
import RanksNotchesDrawer from "./RanksNotchesDrawer";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaFile } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Table, Pagination, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import { styles } from "../../../styles";
import {
  useRankListQuery,
  useRankDeleteMutation,
} from "../../../redux/features/sections/ranksApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Swal from "sweetalert2";

function formatNames(names: string[]): string {
  return names.join(", ");
}

const Ranks = () => {
  PageTitle("Ranks | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasRankCreateAccess = privileges?.includes("HR_RANK_CREATE");
  const hasRankEditAccess = privileges?.includes("HR_RANK_EDIT");
  const hasRankDeleteAccess = privileges?.includes("HR_RANK_DELETE");

  const [add, setAdd] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [rank, setRank] = useState<any>("");
  const [showNotches, setShowNotches] = useState(false);
  const [selectedRankNotches, setSelectedRankNotches] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState("");
  const [historyRecordName, setHistoryRecordName] = useState("");

  const [
    deleteRank,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useRankDeleteMutation();

  const {
    data: rankListData,
    isLoading: isRankListLoading,
    refetch,
  } = useRankListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (rank: any) => {
    const result = await Swal.fire({
      title: "Delete Rank",
      text: "Do you want to delete this rank ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteRank(rank._id);
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

  const handleEditPopUp = (rank: any) => {
    setRank(rank);
    setEdit(true);
  };

  const handleViewNotches = (rank: any) => {
    setSelectedRankNotches(rank);
    setShowNotches(true);
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
      <AddRank open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditRank
        open={edit}
        onClose={() => setEdit(false)}
        itemData={rank}
        refetch={refetch}
      />
      {loadOpen && (
        <CustomModal
          open={loadOpen}
          setOpen={setLoadOpen}
          Component={LoadRanks}
          refetch={refetch}
        />
      )}
      <RanksNotchesDrawer
        open={showNotches}
        onClose={() => setShowNotches(false)}
        selectedRankNotches={selectedRankNotches}
      />
      <PageLayout
        title="Grades & Ranks"
        subtitle="Staff classification levels"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Grades & Ranks" }]}
        actions={
          hasRankCreateAccess ? (
            <>
              <button className={`${styles.primary_button}`} onClick={() => setAdd(true)}>
                <LiaPlusSquareSolid size={16} />
                <span className="ml-1.5 font-medium">New Rank</span>
              </button>
              <button className={`${styles.primary_button}`} onClick={() => setLoadOpen(true)}>
                <FaFile size={14} />
                <span className="ml-1.5 font-medium">Load</span>
              </button>
            </>
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
                  title: "Notches",
                  key: "notches",
                  width: 200,
                  align: "center" as const,
                  render: (_text, record: any) => (
                    <button
                      onClick={() => handleViewNotches(record)}
                      className="inline-flex items-center justify-center px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded transition-colors duration-200"
                    >
                      View
                    </button>
                  ),
                },
                // {
                //   title: "Basic Salary",
                //   dataIndex: "basic_salary",
                //   key: "basic_salary",
                //   align: "right" as const,
                //   sorter: true,
                //   render: (text) => formatNumber(text) || "0.00",
                //   onHeaderCell: () => ({
                //     onClick: () => handleSort("basic_salary"),
                //     style: { cursor: "pointer" },
                //   }),
                // },
                // {
                //   title: "Hourly Rate",
                //   dataIndex: "hourly_rate",
                //   key: "hourly_rate",
                //   align: "right" as const,
                //   sorter: true,
                //   render: (text) => formatNumber(text) || "0.00",
                //   onHeaderCell: () => ({
                //     onClick: () => handleSort("hourly_rate"),
                //     style: { cursor: "pointer" },
                //   }),
                // },
                {
                  title: "Allowances",
                  dataIndex: "allowance_names",
                  key: "allowance_names",
                  render: (names) => formatNames(names),
                },
                {
                  title: "Deduction",
                  dataIndex: "deduction_names",
                  key: "deduction_names",
                  render: (names) => formatNames(names),
                },

                {
                  title: "Action",
                  key: "action",
                  width: 120,
                  align: "center" as const,
                  render: (_text, record) => (
                    <span className="flex items-center justify-center gap-2">
                      {hasRankEditAccess && (
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
                      {hasRankDeleteAccess && (
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
                      <div className="relative group">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setHistoryRecordId(record._id);
                            setHistoryRecordName(record.name);
                            setHistoryOpen(true);
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: 14 }} />
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          History
                        </span>
                      </div>
                    </span>
                  ),
                },
              ].filter((col: any) => {
                if (col.key === "action") {
                  return hasRankEditAccess || hasRankDeleteAccess;
                }
                return true;
              }) as any[]}
              dataSource={rankListData?.data || []}
              rowKey="_id"
              loading={isRankListLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No data" }}
              scroll={{ x: 1200, y: "65vh" }}
            />
          </div>
          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={rankListData?.totalCount || 0}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </PageLayout>
      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        recordId={historyRecordId}
        modelName="Grade"
        recordName={historyRecordName}
      />
    </>
  );
};

export default Ranks;
