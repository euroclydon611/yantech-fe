import { styles } from "../../styles";
import { MdDownload } from "react-icons/md";
import { useState } from "react";
import { Pagination, Table } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { useOtherDeductionReportQuery } from "../../redux/features/reports/otherDeductionReportApi";
import {
  capitalizeFirstLetter,
  exportData,
  exportZipData,
  formatNumber,
} from "../../utils/helperFunction";

const OtherDeductionReportOnTestRunPage = ({ currency, year, payMonth }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [forecast, setForecast] = useState("1");

  const year1 = year || localStorage.getItem("year");
  const pay_month = payMonth || localStorage.getItem("pay_month");

  const { data: reportData, isLoading: reportLoading } =
    useOtherDeductionReportQuery({
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      month: pay_month || "",
      year: year1 || "",
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
      <div className="mx-2 p-2 bg-white rounded-md mt-4">
        <div className="flex justify-between w-full p-4">
          <h1 className="text-[15px] font-medium">
            Other Deductions Report | {pay_month + " " + year1}
          </h1>
          <div className="flex gap-x-4">
            <button
              className={styles.export_btn}
              onClick={() =>
                exportData(
                  `reports/export-other-deductions?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Consolidated_Other_Deductions_Report_${pay_month}_${year1}_${currency}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Consolidated (Excel)</span>
            </button>

            <button
              className={styles.export_btn}
              onClick={() =>
                exportZipData(
                  `reports/export-other-deductions-zip?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Deduction_wise_Other_Deduction_Reports_${pay_month}_${year1}_${currency}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Deduction-wise (ZIP)</span>
            </button>
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
                  className={`${styles.limit_select}`}
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  autoFocus
                  placeholder="Search..."
                  className={`${styles.input} h-[34px]`}
                />
                <AiOutlineSearch
                  size={18}
                  className="absolute right-2 top-[50%] -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            <div className="table-wrapper bg-white rounded-sm shadow-sm">
              <Table
                sticky
                dataSource={reportData?.data || []}
                rowKey={(record: any, index: any) => index}
                loading={reportLoading}
                pagination={false}
                size="small"
                scroll={{ x: "max-content", y: "65vh" }}
                rowClassName={(_record, index) =>
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }
                columns={[
                  {
                    title: "No",
                    key: "no",
                    width: 50,
                    align: "center",
                    fixed: "left" as const,
                    render: (_text, _record, index) =>
                      (page - 1) * limit + index + 1,
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Staff ID",
                    dataIndex: "staff_id",
                    key: "staff_id",
                    width: 100,
                    sorter: true,
                    fixed: "left" as const,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("staff_id"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Full Name",
                    dataIndex: "full_name",
                    key: "full_name",
                    width: 180,
                    sorter: true,
                    fixed: "left" as const,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("full_name"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Deduction Name",
                    dataIndex: "deduction_name",
                    key: "deduction_name",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("deduction_name"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Pay Period",
                    key: "period",
                    width: 120,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("pay_period"),
                      style: { cursor: "pointer" },
                    }),
                    render: (_text, record: any) =>
                      record.pay_month
                        ? `${capitalizeFirstLetter(record.pay_month)} ${
                            record.year
                          }`
                        : "-",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Earn Period",
                    key: "month_year",
                    width: 120,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("month_year"),
                      style: { cursor: "pointer" },
                    }),
                    render: (_text, record: any) =>
                      record.month_year ||
                      (record.pay_month
                        ? `${capitalizeFirstLetter(record.pay_month)} ${
                            record.year
                          }`
                        : "-"),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("amount"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                ]}
              />
            </div>
            <div className="flex mt-4 justify-end">
              <Pagination
                current={page}
                pageSize={limit}
                total={reportData && reportData.totalCount}
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

export default OtherDeductionReportOnTestRunPage;
