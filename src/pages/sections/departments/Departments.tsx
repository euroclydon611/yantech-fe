import { useEffect, useState } from "react";
import CustomModal from "../../../utils/CustomModal";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi2";
import { Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import Loader from "../../../components/Loader";
import {
  useDepartmentListQuery,
  useDepartmentDeleteMutation,
} from "../../../redux/features/sections/departmentApi";
import EditModal from "../../../utils/EditModal";
import AppointDepartmentHead from "./AppointHead";
import { styles } from "../../../styles";
import Swal from "sweetalert2";

const Departments = () => {
  PageTitle("Departments | Payroll");
  const [add, setAdd] = useState(false);
  const [selectHead, setSelectHead] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [department, setDepartment] = useState("");

  const [
    deleteDepartment,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useDepartmentDeleteMutation();

  const {
    data: departmentListData,
    isLoading: isDepartmentListLoading,
    refetch,
  } = useDepartmentListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (department: any) => {
    const result = await Swal.fire({
      title: "Delete Department",
      text: "Do you want to delete this department ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteDepartment(department._id);
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
          text: errorData.data.error || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData]);

  const handleEditPopUp = (department: any) => {
    setDepartment(department);
    setEdit(true);
  };

  const handleHeadPopUp = (department: any) => {
    setDepartment(department);
    setSelectHead(true);
  };

  if (isDepartmentListLoading) {
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
          Component={AddDepartment}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditDepartment}
          itemData={department}
          refetch={refetch}
        />
      )}

      {selectHead && (
        <EditModal
          open={edit}
          setOpen={setSelectHead}
          Component={AppointDepartmentHead}
          itemData={department}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-medium">Departments</h1>

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
              <span className="max-md:hidden">New Department</span>
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
                  <th className={`${styles.wide_tb_th}`}>
                    <span
                      className={`${styles.sort_span}`}
                      onClick={() => handleSort("current_head_name")}
                    >
                      HOD
                      {sortField === "current_head_name" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </span>
                  </th>
                  <th className={`${styles.th} text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {departmentListData && departmentListData.data?.length > 0 ? (
                  departmentListData.data.map((department: any, index: any) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className={`${styles.td}`}>
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className={`${styles.td}`}>{department.name}</td>
                      <td className={`${styles.td}`}>
                        {department?.current_head_name || ""}
                      </td>
                      <td className={`${styles.td}`}>
                        <span className="flex items-center justify-center gap-4">
                          <span
                            className="border border-yellow-500 text-yellow-500 hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300 cursor-pointer"
                            title="Edit"
                            onClick={() => handleEditPopUp(department)}
                          >
                            <FaEdit size={14} className="" />
                          </span>
                          <span
                            className="border border-purple-500 text-purple-500 hover:text-[white] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-purple-500 transition-all duration-300 cursor-pointer"
                            title="Select Head"
                            onClick={() => handleHeadPopUp(department)}
                          >
                            <HiUserGroup size={14} className="" />
                          </span>
                          <span
                            className="border border-[#f43f5e] text-[#f43f5e] hover:text-[#6c757d] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#f43f5e] transition-all duration-300 cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteButtonClick(department)}
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
              total={departmentListData && departmentListData.totalCount}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Departments;
