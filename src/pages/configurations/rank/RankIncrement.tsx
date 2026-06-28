import { useEffect, useState } from "react";
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
import { useRankDeleteMutation } from "../../../redux/features/sections/ranksApi";
import CustomModal from "../../../utils/CustomModal";
import AddRankIncrement from "./AddRankIncrement";
import { styles } from "../../../styles";
import { useRankIncrementListQuery } from "../../../redux/features/configurations/rankIncrementApi";
import { formatDate } from "../../../utils/helperFunction";
import EditRankIncrement from "./EditRankIncrement";
import EditModal from "../../../utils/EditModal";

const RankIncrement = () => {
  PageTitle("Ranks Increment | Payroll");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [rank, setRank] = useState("");

  const [
    deleteRank,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useRankDeleteMutation();

  const {
    data: rankListData,
    isLoading: isRankListLoading,
    refetch,
  } = useRankIncrementListQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
  });

  console.log(rankListData);

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (rank: any) => {
    ConfirmationDialog({
      title: "Delete Rank",
      message: "Do you want to delete this rank?",
      onConfirm: async () => {
        await deleteRank(rank._id);
        refetch();
      },
    });
  };

  //everything will still work without this
  useEffect(() => {
    const fetchRankListData = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Error fetching rank list data:", error);
      }
    };

    fetchRankListData();
  }, [page, limit, searchTerm, sortField, sortOrder, refetch]);

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

  const handleEditPopUp = (rank: any) => {
    setRank(rank);
    setEdit(true);
  };

  if (isRankListLoading) {
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
          Component={AddRankIncrement}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditRankIncrement}
          itemData={rank}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Ranks Increment</h1>

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
              <span className="max-md:hidden">New Rank Increment</span>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto bg-white rounded-sm shadow-sm">
            <table className="table-auto w-full bg-white">
              <thead className="sticky -top-1 text-[14.4px] z-[9] bg-slate-100">
                <tr className="">
                  <th className="text-center p-[15px]">No</th>
                  <th className={`${styles.wide_tb_th}`}>
                    <span
                      className={`${styles.sort_span}`}
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <BiSortAlt2 className="text-[18px]" />
                    </span>
                  </th>
                  <th className={`${styles.wide_tb_th}`}>
                    <span
                      className={`${styles.sort_span}`}
                      onClick={() => handleSort("amooun")}
                    >
                      Amount
                      <BiSortAlt2 className="text-[18px]" />
                    </span>
                  </th>
                  <th className={`${styles.wide_tb_th}`}>
                    <span
                      className={`${styles.sort_span}`}
                      onClick={() => handleSort("amooun")}
                    >
                      Created At
                      <BiSortAlt2 className="text-[18px]" />
                    </span>
                  </th>
                  <th className="text-center p-[15px] min-w-[150px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rankListData && rankListData.data !== null ? (
                  rankListData.data.map((rank: any, index: any) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="text-center p-[10px]">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="text-center">{rank?.name}</td>
                      <td className="text-center">{rank?.percentage}</td>
                      <td className="text-center">
                        {formatDate(rank?.created_at)}
                      </td>
                      <td className="text-center">
                        <span className="flex items-center justify-center gap-4">
                          <span
                            className="border border-yellow-500 text-yellow-500 hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300 cursor-pointer"
                            title="Edit"
                            onClick={() => handleEditPopUp(rank)}
                          >
                            <FaEdit size={14} className="" />
                          </span>
                          <span
                            className="border border-[#f43f5e] text-[#f43f5e] hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#f43f5e] transition-all duration-300 cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteButtonClick(rank)}
                          >
                            <AiFillDelete size={14} />
                          </span>
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
              total={rankListData && rankListData.totalCount}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RankIncrement;
