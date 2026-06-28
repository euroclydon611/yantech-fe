import { useEffect, useState } from "react";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";
import LoadBranches from "./LoadBranches";
import CustomModal from "../../utils/CustomModal";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaFile } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Pagination, Table, Select, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../settings/RecordHistoryDrawer";
import {
  useBranchListQuery,
  useBranchDeleteMutation,
} from "../../redux/features/bank/branchApi";
import { useBankFullListQuery } from "../../redux/features/bank/bankApi";
import Swal from "sweetalert2";
import { styles } from "../../styles";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const { Option } = Select;

const Branches = () => {
  PageTitle("Branches | HR");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasBranchCreateAccess = privileges?.includes("HR_BRANCH_CREATE");
  const hasBranchEditAccess = privileges?.includes("HR_BRANCH_EDIT");
  const hasBranchDeleteAccess = privileges?.includes("HR_BRANCH_DELETE");

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("branch");
  const [sortOrder, setSortOrder] = useState("asc");
  const [branch, setBranch] = useState<any>("");
  const [bankId, setBankId] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState("");
  const [historyRecordName, setHistoryRecordName] = useState("");

  const { data: bankList } = useBankFullListQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [
    deleteBranch,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useBranchDeleteMutation();

  const {
    data: branchListData,
    isLoading: isBranchListLoading,
    refetch,
  } = useBranchListQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    bankId,
  });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (branch: any) => {
    const result = await Swal.fire({
      title: "Delete Branch",
      text: "Do you want to delete this branch ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteBranch(branch._id);
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
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData]);

  const handleEditPopUp = (bank: any) => {
    setBranch(bank);
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

  // if (isBranchListLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <AddBranch open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditBranch
        open={edit}
        onClose={() => setEdit(false)}
        itemData={branch}
        refetch={refetch}
      />
      {loadOpen && (
        <CustomModal
          open={loadOpen}
          setOpen={setLoadOpen}
          Component={LoadBranches}
          refetch={refetch}
        />
      )}
      <PageLayout
        title="Bank Branches"
        subtitle="All branches across registered banks"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Bank Branches" }]}
        actions={
          hasBranchCreateAccess ? (
            <>
              <button className={`${styles.primary_button}`} onClick={() => setAdd(true)}>
                <LiaPlusSquareSolid size={16} />
                <span className="ml-1.5 font-medium">New Branch</span>
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
            <Select
              showSearch
              placeholder="Filter by Bank"
              optionFilterProp="label"
              style={{ width: 200 }}
              value={bankId || undefined}
              onChange={(value) => { setBankId(value); setPage(1); }}
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase()?.includes(input.toLowerCase())
              }
              allowClear
              size="small"
            >
              {bankList &&
                bankList.data !== null &&
                bankList.data.map((bank: any, i: number) => (
                  <Option key={i} value={bank.id} label={bank.name}>
                    {bank.name}
                  </Option>
                ))}
            </Select>
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
                  title: "Bank",
                  dataIndex: "bank",
                  key: "bank",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("bank_id"),
                    style: { cursor: "pointer" },
                  }),
                },

                {
                  title: "Branch Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("name"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Branch Sort Code",
                  dataIndex: "code",
                  key: "code",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("code"),
                    style: { cursor: "pointer" },
                  }),
                },
                ...(hasBranchEditAccess || hasBranchDeleteAccess
                  ? [
                      {
                        title: "Actions",
                        key: "action",
                        width: 100,
                        align: "center" as const,
                        render: (_text: any, record: any) => (
                          <div className="flex items-center justify-center gap-1">
                            {hasBranchEditAccess && (
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
                            {hasBranchDeleteAccess && (
                              <div className="relative group">
                                <span
                                  className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                                  onClick={() =>
                                    handleDeleteButtonClick(record)
                                  }
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
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
              dataSource={branchListData?.data || []}
              rowKey="_id"
              loading={false}
              pagination={false}
              size="small"
              locale={{ emptyText: "No branches found" }}
              scroll={{ x: 1200, y: "65vh" }}
            />
          </div>

          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={branchListData?.totalCount || 0}
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
        modelName="BankBranch"
        recordName={historyRecordName}
      />
    </>
  );
};

export default Branches;
