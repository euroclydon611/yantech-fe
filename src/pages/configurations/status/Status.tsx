import { useEffect, useState } from "react";
import CustomModal from "../../../utils/CustomModal";
import EditModal from "../../../utils/EditModal";
import AddStatus from "./AddStatus";
import EditStatus from "./EditStatus";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import Loader from "../../../components/Loader";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { toast } from "react-hot-toast";
import {
  useStatusListQuery,
  useStatusDeleteMutation,
} from "../../../redux/features/configurations/statusApi";
import { styles } from "../../../styles";

const Status = () => {
  PageTitle("Employee Status | Payroll");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState("");

  const [
    deleteStatus,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useStatusDeleteMutation();

  const {
    data: statusListData,
    isLoading: isStatusListLoading,
    refetch,
  } = useStatusListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (status: any) => {
    ConfirmationDialog({
      title: "Delete Status",
      message: "Do you want to delete this status?",
      onConfirm: async () => {
        await deleteStatus(status._id);
        refetch();
      },
    });
  };

  useEffect(() => {
    if (isDeletingSuccess) {
      const message = `${deletedData?.message}` || "Successful!";
      toast.success(message, { duration: 5000 });
    }
    if (deletionError) {
      if ("data" in deletionError) {
        const errorData = deletionError as any;
        toast.error(errorData.data.error, { duration: 5000 });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData]);

  const handleEditPopUp = (status: any) => {
    setStatus(status);
    setEdit(true);
  };

  if (isStatusListLoading) {
    return <Loader />;
  }

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
      {add && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          Component={AddStatus}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditStatus}
          itemData={status}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Employee Status</h1>

        <div className="bg-white p-4">
          <div className="flex justify-between mb-2">
            <div className="flex gap-1 items-center">
              <span className="max-md:hidden">Show</span>
              <select
                name="limit"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`text-[14px] px-[1rem] py-[0.2rem] border border-gray-400 rounded-[0.25rem] shadow-md placeholder-[#8391a2] focus:ring-[0.3px] focus:ring-gray-300 focus:border-gray-500`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="max-md:hidden">entries</span>
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
                className={`w-full text-[14px] px-[0.75rem] border border-gray-400 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.2px] focus:ring-gray-300 focus:border-gray-400`}
              />
              <AiOutlineSearch
                size={18}
                className="absolute right-2 top-[7px]  text-gray-400"
              />
            </div>
            <button
              className="flex items-center justify-center bg-[#39afd1] text-white py-[7.2px] px-[14.4px] max-md:px-[10px] shadow-md rounded-sm focus:ring-2 focus:ring-[#39afd1] hover:bg-[#2c8eae] transition-all duration-300"
              onClick={() => setAdd(true)}
            >
              <LiaPlusSquareSolid size={18} />
              <span className="max-md:hidden">New Status</span>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto bg-white rounded-sm shadow-sm">
            <table className={`${styles.table}`}>
              <thead className={`${styles.thead}`}>
                <tr className="">
                  <th className={`${styles.th} border`}>No</th>
                  <th className={`${styles.th} border`}>
                    <span
                      className="flex relative cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <BiSortAlt2 className=" absolute right-0 text-[18px]" />
                    </span>
                  </th>
                  <th className={`${styles.th} border text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {statusListData && statusListData.data !== null ? (
                  statusListData.data.map((status: any, index: any) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className={`${styles.td} border`}>
                      {(page - 1) * limit + index + 1}
                      </td>
                      <td className={`${styles.td} border`}>
                        {status.name}</td>
                      <td className={`${styles.td} border`}>
                        <span className="flex items-center justify-center gap-4">
                          <button
                            className="border border-yellow-500 text-yellow-500 disabled:bg-yellow-50 disabled:border-yellow-50 pointer-events-none hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300 cursor-pointer"
                            title="Edit"
                            disabled
                            onClick={() => handleEditPopUp(status)}
                          >
                            <FaEdit size={14} className="" />
                          </button>
                          <button
                            className="border border-[#f43f5e] text-[#f43f5e] disabled:text-red-300  disabled:bg-red-100 disabled:border-red-100 pointer-events-none hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#f43f5e] transition-all duration-300 cursor-pointer"
                            title="Delete"
                            disabled
                            onClick={() => handleDeleteButtonClick(status)}
                          >
                            <AiFillDelete size={14} />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-y text-center py-2" colSpan={12}>
                      <span className="text-red-500 font-extrabold">
                        No results found
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex  mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={statusListData && statusListData.totalCount}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Status;
