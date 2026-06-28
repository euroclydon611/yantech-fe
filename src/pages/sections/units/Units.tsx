import { useEffect, useState } from "react";
import CustomModal from "../../../utils/CustomModal";
import AddUnit from "./AddUnit";
import EditUnit from "./EditUnit";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import Loader from "../../../components/Loader";
import Swal from "sweetalert2";

import {
  useUnitListQuery,
  useUnitDeleteMutation,
} from "../../../redux/features/sections/units";
import EditModal from "../../../utils/EditModal";
import { BiSortAlt2 } from "react-icons/bi";
import { styles } from "../../../styles";

const Units = () => {
  PageTitle("Units | Payroll");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [unit, setUnit] = useState("");
  const [
    deleteUnit,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useUnitDeleteMutation();

  const {
    data: unitListData,
    isLoading: isUnitListLoading,
    refetch,
  } = useUnitListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (unit: any) => {
    const result = await Swal.fire({
      title: "Delete Unit",
      text: "Do you want to delete this unit?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteUnit(unit._id);
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

  const handleEditPopUp = (unit: any) => {
    setUnit(unit);
    setEdit(true);
  };

  if (isUnitListLoading) {
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
          Component={AddUnit}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditUnit}
          itemData={unit}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Units</h1>

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
              <span className="max-md:hidden">New Unit</span>
            </button>
          </div>
          <div className="table-wrapper max-h-[65vh] overflow-y-auto bg-white rounded-sm shadow-sm">
            <table className={`${styles.table}`}>
              <thead className={`${styles.thead}`}>
                <tr className="">
                  <th className={`${styles.th}`}>No</th>
                  <th className={`${styles.th}`}>
                    <span
                      className={`${styles.sort_span}`}
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {sortField === "name" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </span>
                  </th>
                  <th className="text-center p-[15px]">
                    <span
                      className="flex justify-center relative cursor-pointer"
                      // onClick={() => handleSort("department_id")}
                    >
                      Department
                    </span>
                  </th>
                  <th className="text-center p-[15px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {unitListData && unitListData.data?.length > 0 ? (
                  unitListData.data.map((unit: any, index: any) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="text-center p-[10px]">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="text-center p-[10px]">{unit?.name}</td>
                      <td className="text-center p-[10px]">
                        {unit?.department[0]?.name}
                      </td>
                      <td className="text-center p-[10px]">
                        <span className="flex items-center justify-center gap-4">
                          <span
                            className="border border-yellow-500 text-yellow-500 hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300 cursor-pointer"
                            title="Edit"
                            onClick={() => handleEditPopUp(unit)}
                          >
                            <FaEdit size={14} className="" />
                          </span>
                          <span
                            className="border border-[#f43f5e] text-[#f43f5e] hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#f43f5e] transition-all duration-300 cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteButtonClick(unit)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="text-center py-4 text-red-500 font-bold"
                      colSpan={9}
                    >
                      No data
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
              total={unitListData && unitListData.totalPages}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Units;
