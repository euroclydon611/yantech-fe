import { useState } from "react";
import { useEmployeesOnLeaveQuery } from "../../redux/features/employee/employeeApi";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "antd";
import { styles } from "../../styles";
import { formatDate2 } from "../../utils/helperFunction";
import { AiOutlineSearch } from "react-icons/ai";

// Function to calculate remaining days from today until the leave end date
const calculateDaysLeft = (leaveEndDate: string): number => {
  const today = new Date();
  const leaveEnd = new Date(leaveEndDate);
  const diffInMilliseconds = leaveEnd.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return daysLeft;
};

// const leaveEndDate = "2024-12-25"; // Example leave end date
// const daysLeft = calculateDaysLeft(leaveEndDate);
// console.log(`Days left until leave ends: ${daysLeft}`);

const EmployeesOnLeave = () => {
  PageTitle("Employees On Leave | HR");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("end_date");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const { data, refetch } = useEmployeesOnLeaveQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
  });

  return (
    <div className="pt-4 px-2">
      <h1 className="text-[18px] mb-3 font-medium">Employees On Leave</h1>
      <div className="bg-white mt-5 p-4">
        <div className="flex justify-between mb-2 max-sm:flex-wrap gap-2">
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

          {/* <div className="flex relative w-[25%] max-md:w-[55%]">
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
          </div> */}
        </div>
        <div className="table-wrapper max-h-[60vh] overflow-y-auto bg-white rounded-sm shadow-sm">
          <table className={`${styles.table}`}>
            <thead className={`${styles.thead}`}>
              <tr>
                <th className={`${styles.th}`}>No</th>
                <th className={`${styles.th}`}>Staff ID</th>
                <th className={`${styles.th}`}>Staff Name</th>
                <th className={`${styles.th}`}>Leave Name</th>
                <th className={`${styles.th}`}>Period</th>
                <th className={`${styles.th}`}>Days</th>
                <th className={`${styles.th}`}>Days Left</th>
              </tr>
            </thead>
            <tbody>
              {data?.data && data?.data?.length > 0 ? (
                data?.data?.map((leave: any, i: any) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className={`${styles.td}`}>
                      {(page - 1) * limit + i + 1}
                    </td>
                    <td className={`${styles.td}`}>
                      {leave?.employee?.staff_id || ""}
                    </td>
                    <td className={`${styles.td}`}>
                      {leave?.employee?.lastname +
                        " " +
                        leave?.employee?.firstname || ""}
                    </td>
                    <td className={`${styles.td}`}>{leave?.leave_name}</td>
                    <td className={`${styles.td}`}>
                      {formatDate2(leave?.start_date) +
                        "-" +
                        formatDate2(leave?.end_date)}
                    </td>
                    <td className={`${styles.td}`}>{leave?.duration}</td>
                    <td className={`${styles.td}`}>
                      {calculateDaysLeft(leave?.end_date) || "0"}
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
            total={(data && data?.totalCount) || 1}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeesOnLeave;
