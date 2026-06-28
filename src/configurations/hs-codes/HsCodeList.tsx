import { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { PageTitle } from "../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import CustomModal from "../../utils/CustomModal";
import { Pagination, Table } from "antd";
import EditModal from "../../utils/EditModal";
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../pages/settings/RecordHistoryDrawer";
import EditHSCode from "./EditHSCode";
import AddHSCode from "./AddHSCode";
import LoadCodes from "./LoadHSCodes";
import {
  useDeleteHsCodeMutation,
  useFetchHsCodesQuery,
} from "../../redux/features/configurations/hscodes";
import Swal from "sweetalert2";
import { styles } from "../../styles";
import { usePrivileges } from "../../hooks/usePrivileges";

const HsCodesList = () => {
  PageTitle("HS Codes | Configs");
  const { 
    hasHsCodesAccess, 
    hasHsCodesCreate, 
    hasHsCodesEdit, 
    hasHsCodesDelete, 
    hasHsCodesLoad 
  } = usePrivileges();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("hsCode");
  const [sortOrder, setSortOrder] = useState("asc");
  const [add, setAdd] = useState(false);
  const [load, setLoad] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hsCodeData, setHsCodeData] = useState<any>("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const { data: hsCodes, isLoading: isHsCodesLoading, refetch } = useFetchHsCodesQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
    }
  );

  const [deleteHSCode, { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError }] = useDeleteHsCodeMutation();

  const handleDeleteButtonClick = async (hsCode: any) => {
    const result = await Swal.fire({
      title: "Delete HS Code",
      text: "Do you want to delete this HS Code?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteHSCode(hsCode._id);
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

  const handleEditPopUp = (hsCode: any) => {
    setHsCodeData(hsCode);
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

  if (!hasHsCodesAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view HS Codes.
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
          Component={AddHSCode}
          refetch={refetch}
        />
      )}

      {load && (
        <CustomModal
          open={load}
          setOpen={setLoad}
          Component={LoadCodes}
          refetch={refetch}
        />
      )}

      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditHSCode}
          itemData={hsCodeData}
          refetch={refetch}
        />
      )}

      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Harmonized System (HS) Codes</h1>

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
            <div className="flex gap-2">
              {hasHsCodesLoad && (
                <button
                  className={`${styles.primary_button} !bg-blue-600 hover:!bg-blue-700`}
                  onClick={() => setLoad(true)}
                >
                  <FaFileUpload size={14} />
                  <span className="ml-2 max-md:hidden font-medium">Import</span>
                </button>
              )}
              {hasHsCodesCreate && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">New HS Code</span>
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
                  title: "HS Code",
                  dataIndex: "hsCode",
                  key: "hsCode",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("hsCode"),
                    style: { cursor: "pointer" },
                  }),
                  render: (text) => (
                    <span className="font-mono font-semibold text-gray-800">
                      {text}
                    </span>
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("name"),
                    style: { cursor: "pointer" },
                  }),
                  render: (text) => (
                    <div className="line-clamp-2" title={text}>
                      {text}
                    </div>
                  ),
                },
                {
                  title: "Actions",
                  key: "action",
                  width: 100,
                  align: "center" as const,
                  render: (_text, record) => (
                    <div className="flex items-center justify-center gap-1">
                      {hasHsCodesEdit && (
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

                      <div className="relative group">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setSelectedHistoryRecord(record);
                            setHistoryOpen(true);
                          }}
                        >
                          <HistoryOutlined size={16} />
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          History
                        </span>
                      </div>

                      {hasHsCodesDelete && (
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
                },
              ]}
              dataSource={hsCodes?.data || []}
              rowKey="_id"
              loading={isHsCodesLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No HS codes found" }}
              scroll={{ x: 800 }}
            />
          </div>

          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={hsCodes?.pagination?.total || 0}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="HscodeSetup"
        recordId={selectedHistoryRecord?._id}
        recordName={selectedHistoryRecord?.hsCode}
      />

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default HsCodesList;
