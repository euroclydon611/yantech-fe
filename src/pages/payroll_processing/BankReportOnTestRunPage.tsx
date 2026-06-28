import { styles } from "../../styles";
import { MdDownload } from "react-icons/md";
import { useState } from "react";
import { Pagination, Table } from "antd";
import { useBankReportQuery } from "../../redux/features/reports/bankReportApi";
import { AiOutlineSearch } from "react-icons/ai";
import {
  capitalizeFirstLetter,
  exportData,
  exportZipData,
  formatNumber,
} from "../../utils/helperFunction";

const BankReportOnTestRunPage = ({currency, year, payMonth}) => {
  const year1 = year || localStorage.getItem("year");
  const pay_month = payMonth || localStorage.getItem("pay_month");
  // const forecast = localStorage.getItem("forecast");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [forecast, setForecast] = useState("1");

  const { data: bankReportData, isLoading: reportLoading } = useBankReportQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      month: pay_month,
      year: year1,
      forecast,
      currency
    }
  );

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  // if (reportLoading) {
  //   return <Loader />;
  // }

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // if (reportLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <div className="mx-2 bg-white p-2 rounded-md">
        <div className="flex justify-between w-full p-4">
          <h1 className="text-[15px] font-medium">
            Bank Report | {pay_month + " " + year1}
          </h1>
          <div className="flex gap-x-4">
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() =>
                exportData(
                  `reports/export-consolidated-net-pay?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Consolidated_Bank_report_${pay_month}_${year1}_${currency}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex"> Netpay Summary (Excel)</span>
            </button>
            <button
              className={styles.export_btn}
              onClick={() =>
                exportZipData(
                  `reports/export-net-pay-zip?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Bank_report_${pay_month}_${year1}_${currency}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Bank-wise Netpay (ZIP)</span>
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
                dataSource={bankReportData?.data || []}
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
                    title: "Bank Account",
                    dataIndex: "bank_account_number",
                    key: "bank_account",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("bank_account"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Bank Name",
                    dataIndex: "bank",
                    key: "bank_name",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("bank_name"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Bank Branch",
                    dataIndex: "bank_branch",
                    key: "bank_branch",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("bank_branch"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Net Salary",
                    dataIndex: "net_amount",
                    key: "net_amount",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("net_amount"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Ghana Card No",
                    dataIndex: "ghana_card_number",
                    key: "ghana_card_number",
                    width: 140,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("ghana_card_number"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                ]}
              />
            </div>
            <div className="flex mt-4 justify-end">
              <Pagination
                current={page}
                pageSize={limit}
                total={bankReportData && bankReportData.totalCount}
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

export default BankReportOnTestRunPage;
