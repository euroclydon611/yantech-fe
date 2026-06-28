import { useState } from "react";
import { styles } from "../../../styles";
import { Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import EditOvertime from "./EditOvertime";
import EditModal from "../../../utils/EditModal";
import { Link } from "react-router-dom";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  capitalizeFirstLetter,
  formatDate,
} from "../../../utils/helperFunction";

import {
  usePendingOvertimeQuery,
  useApprovedOvertimeQuery,
  useRejectedOvertimeQuery,
  useBatchOvertimesAdminQuery,
} from "../../../redux/features/reports/payrollRun";

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};
const Rejected_overtime = () => {
  PageTitle("Rejected Overtime | Payroll");
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [overtime, setOvertime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasOvertimeViewAccess = privileges?.includes("PAYROLL_OVERTIME_VIEW");
  const hasOvertimeCreateAccess = privileges?.includes("PAYROLL_OVERTIME_CREATE");
  const hasOvertimeEditAccess = privileges?.includes("PAYROLL_OVERTIME_EDIT");

  if (!hasOvertimeViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const monthYear = selectedMonth.split("-");
  const year = monthYear[0];
  const monthNo = monthYear[1];
  let month = "March";

  if (monthNo == "01") {
    month = "January";
  }
  if (monthNo == "02") {
    month = "February";
  }
  if (monthNo == "03") {
    month = "March";
  }
  if (monthNo == "04") {
    month = "April";
  }
  if (monthNo == "05") {
    month = "May";
  }
  if (monthNo == "06") {
    month = "June";
  }
  if (monthNo == "07") {
    month = "July";
  }
  if (monthNo == "08") {
    month = "August";
  }
  if (monthNo == "09") {
    month = "September";
  }
  if (monthNo == "10") {
    month = "October";
  }
  if (monthNo == "11") {
    month = "November";
  }
  if (monthNo == "12") {
    month = "December";
  }

  const handleDateChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);

    if (endDate && selectedDate > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setEndDate(selectedDate);
  };

  const { data: batchList } = useBatchOvertimesAdminQuery({ page, limit });

  const { data: pendingList } = usePendingOvertimeQuery({
    page,
    limit,
    month,
    year,
    startDate,
    endDate,
    searchTerm,
  });
  const { data: rejectedList, refetch } = useRejectedOvertimeQuery({
    limit,
    page,
    month,
    year,
    startDate,
    endDate,
    searchTerm,
  });

  const { data: approvedList } = useApprovedOvertimeQuery({
    limit,
    page,
    month,
    year,
    startDate,
    endDate,
    searchTerm,
  });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleEditPopUp = (overtime: any) => {
    setOvertime(overtime);
    setEdit(true);
  };

  return (
    <>
      {edit && hasOvertimeEditAccess && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditOvertime}
          itemData={overtime}
          refetch={refetch}
        />
      )}

      <PageLayout
        title="Rejected Overtime"
        subtitle="View rejected overtime requests"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Overtime Mgt" }]}
      />
      <section className="flex gap-6 mt-6 px-4 overflow-x-auto text-black">
        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link to={"/batch-overtime"} className="flex flex-col items-center">
            <span className="text-lg font-bold text-blue-500">Batch</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {batchList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>
        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link to={"/pending-overtime"} className="flex flex-col items-center">
            <span className="text-lg font-bold text-yellow-500">Pending</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {pendingList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>

        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link
            to={"/approved-overtime"}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-bold text-green-600">Approved</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {approvedList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>

        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link
            to={"/rejected-overtime"}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-bold text-red-600">Rejected</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {rejectedList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>
      </section>

      <section className="pt-6 px-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Rejected Overtime Applications
        </h3>
      </section>

      <div className="bg-white mt-5 p-4">
        <div className="space-y-4">
          <div className="flex justify-between mb-2 max-sm:flex-wrap gap-2">
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

            <div className="relative w-full sm:w-80">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
              <AiOutlineSearch
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="max-md:hidden text-gray-700 font-medium">
                Period:
              </span>
              <input
                type="month"
                id="month"
                className={`${styles.period_date_input}`}
                value={selectedMonth}
                onChange={handleDateChange}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <details className="bg-gray-50 rounded-lg border border-gray-200 mb-6">
            <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                Advanced Filters
              </span>
              <svg
                className="w-4 h-4 text-gray-400 transform transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    aria-label="Filter start date"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    aria-label="Filter end date"
                  />
                </div>
              </div>
            </div>
          </details>
          <br />
        </div>
        <div className="table-wrapper max-h-[50vh] overflow-y-auto bg-white border-gray-200">
          <table className={`${styles.table}`}>
            <thead className={`${styles.thead} text-xs`}>
              <tr>
                <th className={`${styles.th}`}>No</th>
                <th className={`${styles.wide_tb_th2}`}>Staff ID</th>
                <th className={`${styles.wide_tb_th2}`}>Employee Name</th>
                <th className={`${styles.wide_tb_th2}`}>Overtime Type</th>
                <th className={`${styles.wide_tb_th2}`}>Overtime Date</th>
                <th className={`${styles.wide_tb_th2}`}>Requested Date</th>
                <th className={`${styles.wide_tb_th2}`}>Status</th>
                <th className={`${styles.wide_tb_th2}`}>Decision Note</th>
                <th className={`${styles.wide_tb_th2}`}>Action Taken By</th>
                <th className={`${styles.wide_tb_th2}`}>Role</th>
                <th className={`${styles.wide_tb_th2}`}>Action</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {rejectedList?.data?.overtime_data &&
              rejectedList?.data?.overtime_data.length > 0 ? (
                rejectedList?.data?.overtime_data?.map(
                  (overtime: any, i: any) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className={`${styles.td}`}>
                        {(page - 1) * limit + i + 1}
                      </td>
                      <td className={`${styles.td}`}>{overtime?.staff_id}</td>
                      <td className={`${styles.td} !text-left`}>
                        {overtime?.firstname + " " + overtime?.lastname}
                      </td>
                      <td className={`${styles.td} truncate-25`}>
                        {overtime?.overtime_name}
                      </td>
                      <td className={`${styles.td}`}>
                        {overtime?.overtime_date &&
                          formatDate(overtime?.overtime_date)}
                      </td>
                      <td className={`${styles.td}`}>
                        {overtime?.created_at &&
                          formatDate(overtime?.created_at)}
                      </td>
                      <td className={`${styles.td}`}>
                        <span className="text-red-600 font-semibold">
                          {capitalizeFirstLetter(overtime?.status) ||
                            "Rejected"}
                        </span>
                      </td>
                      <td className={`${styles.td}`}>
                        {overtime?.decision_note}
                      </td>
                      <td className={`${styles.td}`}>
                        {overtime.approving_admin_firstname ||
                        overtime.approving_admin_lastname ? (
                          <span>{`${overtime?.approving_admin_firstname} ${overtime?.approving_admin_lastname}`}</span>
                        ) : (
                          <span>{`${overtime?.approving_employee_firstname} ${overtime?.approving_employee_lastname}`}</span>
                        )}
                      </td>

                      <td className={`${styles.td}`}>
                        {overtime?.approving_admin_firstname ||
                        overtime?.approving_admin_lastname ? (
                          <span>Admin</span>
                        ) : (
                          <span>Entity Head</span>
                        )}
                      </td>
                      <td className={`${styles.td} !text-center`}>
                        <span className="flex items-center justify-center gap-4">
                          {hasOvertimeEditAccess && (
                            <button
                              className="border border-yellow-500 text-yellow-500 hover:text-white py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300"
                              title="Edit"
                              onClick={() => handleEditPopUp(overtime)}
                            >
                              <FaEdit size={14} className="" />
                            </button>
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td className="border-y text-center py-2" colSpan={12}>
                    <span className="text-red-500 font-extrabold">No data</span>
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
            total={(rejectedList?.data && rejectedList.data.totalCount) || 1}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default Rejected_overtime;
