import { styles } from "../../styles";
import { MdDownload } from "react-icons/md";
import { useState } from "react";
import { Pagination, Table } from "antd";
import { useSummaryReportQuery } from "../../redux/features/reports/summaryApi";
import { AiOutlineSearch } from "react-icons/ai";
import {
  capitalizeFirstLetter,
  exportData,
  formatDate2,
  formatNumber,
} from "../../utils/helperFunction";

const SummaryReportOnTestRunPage = ({ currency }) => {
  const year1 = localStorage.getItem("year");
  const pay_month = localStorage.getItem("pay_month");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [forecast, setForecast] = useState("1");

  const { data: SummaryReportData } = useSummaryReportQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    month: pay_month,
    year: year1,
    forecast,
    currency,
  });

  const handleChangePage = (page: any) => {
    setPage(page);
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
      <div className="mx-2 bg-white p-2 rounded-md">
        <div className="flex justify-between w-full p-4">
          <h1 className="text-[15px] font-medium">
            Summary Report | {pay_month + " " + year1}
          </h1>
          <div className="flex gap-x-4">
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() =>
                exportData(
                  `reports/export-summary?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Summary_report_${pay_month}_${year1}_${currency}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Export</span>
            </button>
            <hr />
          </div>
        </div>
        <div>
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
                  className="absolute right-2 top-[7px] text-gray-400"
                />
              </div>
            </div>
            <div className="table-wrapper max-h-[50vh] overflow-y-auto overflow-x-auto bg-white rounded-sm shadow-sm">
              <table className="table-auto w-full bg-white overflow-x-auto text-xs">
                <thead className="sticky -top-1 text-[12px] z-[9] bg-slate-100">
                  <tr>
                    <th className="min-w-[50px]">No</th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span}`}
                        onClick={() => handleSort("pay_month")}
                      >
                        <span>Pay Period</span>
                        {sortField === "pay_month" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span className={`${styles.sort_span}`}>
                        <span>Start Date</span>
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span className={`${styles.sort_span}`}>
                        <span>End Date</span>
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span}`}
                        onClick={() => handleSort("number_of_employees")}
                      >
                        <span>Employees</span>
                        {sortField === "number_of_employees" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_earnings")}
                      >
                        <span>Gross</span>
                        {sortField === "summerized_total_earnings" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_allowances")
                        }
                      >
                        <span>Allowances</span>
                        {sortField === "summerized_total_allowances" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_deductions")
                        }
                      >
                        <span>Deductions</span>
                        {sortField === "summerized_total_deductions" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_bonus_tax")}
                      >
                        <span>Bonus Tax</span>
                        {sortField === "summerized_total_bonus_tax" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_overtime_tax")
                        }
                      >
                        <span>Overtime Tax</span>
                        {sortField === "summerized_total_overtime_tax" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_casual_worker_tax")
                        }
                      >
                        <span>Casual Tax</span>
                        {sortField === "summerized_total_casual_worker_tax" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_ssnit_employer")
                        }
                      >
                        <span>Tier 1</span>
                        {sortField === "summerized_total_ssnit_employer" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() =>
                          handleSort("summerized_total_ssnit_employee")
                        }
                      >
                        <span>Tier 2</span>
                        {sortField === "summerized_total_ssnit_employee" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_tier3")}
                      >
                        <span>Tier 3</span>
                        {sortField === "summerized_total_tier3" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_reliefs")}
                      >
                        <span>Reliefs</span>
                        {sortField === "summerized_total_reliefs" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_welfare")}
                      >
                        <span>Welfare</span>
                        {sortField === "summerized_total_welfare" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_total_paye")}
                      >
                        <span>PAYE</span>
                        {sortField === "summerized_total_paye" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>

                    <th className={`${styles.wide_tb_th}`}>
                      <span
                        className={`${styles.sort_span} justify-end`}
                        onClick={() => handleSort("summerized_net_amount")}
                      >
                        <span>Net</span>
                        {sortField === "summerized_net_amount" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {SummaryReportData && SummaryReportData.length !== null ? (
                    SummaryReportData.data.map((employee: any, index: any) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="text-center p-[10px]">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className={`${styles.td} border`}>
                          {employee?.pay_month &&
                            capitalizeFirstLetter(employee?.pay_month)}{" "}
                          {employee?.year}
                        </td>
                        <td className={`${styles.td} border`}>
                          {formatDate2(employee?.payroll_start_date) ||
                            "Start Of Month"}
                        </td>
                        <td className={`${styles.td} border`}>
                          {formatDate2(employee?.payroll_end_date) ||
                            "End Of Month"}
                        </td>
                        <td className={`${styles.td} border`}>
                          {employee.number_of_employees}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_earnings) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_allowances
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_deductions
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_bonus_tax) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_overtime_tax
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_casual_worker_tax
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_ssnit_employer
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(
                            employee?.summerized_total_ssnit_employee
                          ) || "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_tier3) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_reliefs) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_welfare) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_total_paye) ||
                            "0.00"}
                        </td>
                        <td className="text-right border">
                          {formatNumber(employee?.summerized_net_amount) ||
                            "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border-y text-center py-2" colSpan={18}>
                        <span className="text-red-500 font-extrabold">
                          No results found
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex mt-4 justify-end">
              <Pagination
                current={page}
                pageSize={1}
                total={SummaryReportData && SummaryReportData.totalCount}
                onChange={handleChangePage}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryReportOnTestRunPage;
