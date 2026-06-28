import PageLayout from "../../components/PageLayout";
import { styles } from "../../styles";
import { PageTitle } from "../../utils/PageTitle";
import { MdDownload } from "react-icons/md";
import { useState } from "react";
import { Pagination, Table } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { useSummaryPayReportQuery } from "../../redux/features/reports/summaryPayApi";
import { exportData, formatNumber } from "../../utils/helperFunction";
import DashboardSummarizedReports from "../../components/DashboardSummarizedReports";
import { popularCurrencies } from "@/utils/generalData";
import { ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const SummaryPayReport = () => {
  PageTitle("Summary Pay Report | Payroll");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [forecast, setForecast] = useState("0");

  const [selectedCurrency, setSelectedCurrency] = useState("GHS");
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    setIsOpen(false);
  };

  const selectedCurrencyData = popularCurrencies.find(
    (curr) => curr.code === selectedCurrency
  );

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

  const { data: SummaryReportData, isLoading } = useSummaryPayReportQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    month,
    year,
    forecast,
    currency: selectedCurrencyData.code,
  });

  const handleDateChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

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

  const handleVarianceExport = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Select Periods for Variance Report",
      html:
        '<div style="display: flex; flex-direction: column; gap: 10px; padding: 10px;">' +
        '<div><label style="display: block; text-align: left; font-size: 14px; margin-bottom: 5px;">Start Period</label><input id="startPeriod" type="month" class="swal2-input" style="margin: 0; width: 100%;"></div>' +
        '<div><label style="display: block; text-align: left; font-size: 14px; margin-bottom: 5px;">End Period</label><input id="endPeriod" type="month" class="swal2-input" style="margin: 0; width: 100%;"></div>' +
        "</div>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Export Variance",
      confirmButtonColor: "#0000cc",
      preConfirm: () => {
        const start = (document.getElementById("startPeriod") as HTMLInputElement).value;
        const end = (document.getElementById("endPeriod") as HTMLInputElement).value;
        if (!start || !end) {
          Swal.showValidationMessage("Please select both periods");
          return false;
        }
        return { start, end };
      },
    });

    if (formValues) {
      const { start, end } = formValues;
      const [startYear, startMonthNo] = start.split("-");
      const [endYear, endMonthNo] = end.split("-");

      const startPeriod = `${startMonthNo}/${startYear}`;
      const endPeriod = `${endMonthNo}/${endYear}`;

      exportData(
        `reports/export-variance?startPeriod=${startPeriod}&endPeriod=${endPeriod}&currency=${selectedCurrencyData.code}&forecast=${forecast}`,
        `Variance_Report_${startPeriod.replace("/", "_")}_vs_${endPeriod.replace(
          "/",
          "_"
        )}`
      );
    }
  };

  return (
    <>
      <PageLayout
        title="Summary Pay Report"
        breadcrumbs={[{ label: "Payroll" }, { label: "Reports" }, { label: "Summary Pay" }]}
      />
      <div className="p-4">
        <div className="flex justify-end mb-3" hidden>
          <div className="flex gap-2 items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Currency
            </label>
            <div className="relative">
              <button
                type="button"
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm hover:border-gray-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">
                    {selectedCurrencyData?.symbol}
                  </span>
                  <span className="block truncate">
                    {selectedCurrencyData?.code} - {selectedCurrencyData?.name}
                  </span>
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {popularCurrencies.map((currency) => (
                    <div
                      key={currency.code}
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                        selectedCurrency === currency.code
                          ? "bg-blue-50 text-blue-900"
                          : "text-gray-900"
                      }`}
                      onClick={() => handleCurrencySelect(currency.code)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-2 text-gray-600">
                          {currency.symbol}
                        </span>
                        <span className="block truncate">
                          {currency.code} - {currency.name}
                        </span>
                      </div>
                      {selectedCurrency === currency.code && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DashboardSummarizedReports
          year={year}
          pay_month={month}
          currency={selectedCurrencyData.code}
        />
        <br />
        <div className="flex justify-between items-center w-full p-4 bg-white rounded-md">
          <div className="flex items-center gap-1">
            <span className="max-md:hidden">Period: </span>
            <input
              type="month"
              id="month"
              className={`${styles.period_date_input}`}
              value={selectedMonth}
              onChange={handleDateChange}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() =>
                exportData(
                  `reports/export-bank-summary?forecast=${forecast}&year=${year}&month=${month}&currency=${selectedCurrencyData.code}`,
                  `Summary_pay_report_${month}_${year}_${selectedCurrencyData.code}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Export</span>
            </button>

            <button
              className={styles.export_btn}
              title="Variance Report"
              onClick={handleVarianceExport}
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Variance Report</span>
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
                dataSource={SummaryReportData?.data || []}
                rowKey={(record: any, index: any) => index}
                loading={isLoading}
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
                    title: "Rank",
                    dataIndex: "grade",
                    key: "grade",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("grade"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Notch",
                    dataIndex: "notch",
                    key: "notch",
                    width: 80,
                    align: "center" as const,
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Employment Type",
                    dataIndex: "employment_type",
                    key: "employment_type",
                    width: 130,
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Position",
                    dataIndex: "gra_position",
                    key: "gra_position",
                    width: 130,
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Entity",
                    dataIndex: "entity",
                    key: "entity",
                    width: 120,
                    align: "center",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("entity"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Ghana Card No",
                    dataIndex: "ghana_card_number",
                    key: "ghana_card_number",
                    width: 130,
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
                  {
                    title: "Months Ran",
                    dataIndex: "total_months_ran",
                    key: "total_months_ran",
                    width: 100,
                    align: "center",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "1",
                  },
                  {
                    title: "Pay Period",
                    key: "period",
                    width: 120,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("pay_month"),
                      style: { cursor: "pointer" },
                    }),
                    render: (_text, record: any) =>
                      record.pay_month ? `${record.pay_month} ${record.year}` : "-",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Bank Name",
                    dataIndex: "bank",
                    key: "bank",
                    width: 150,
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
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Account Number",
                    dataIndex: "bank_account_number",
                    key: "bank_account_number",
                    width: 150,
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Hourly Rate",
                    dataIndex: "hourly_rate",
                    key: "hourly_rate",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("hourly_rate"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Hrs Worked (Inc. Leave)",
                    dataIndex: "hours_worked",
                    key: "hours_worked",
                    width: 120,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("hours_worked"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => val?.toLocaleString() || "0",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Overtime Hrs",
                    dataIndex: "overtime_hours_worked",
                    key: "overtime_hours_worked",
                    width: 100,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("overtime_hours_worked"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => val?.toLocaleString() || "0",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Basic Salary",
                    dataIndex: "basic_salary",
                    key: "basic_salary",
                    width: 110,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("basic_salary"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Allowances",
                    dataIndex: "total_allowances",
                    key: "total_allowances",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_allowances"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Overtime Amount",
                    dataIndex: "overtime_amount",
                    key: "overtime_amount",
                    width: 110,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("overtime_amount"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Bonus",
                    dataIndex: "bonus_amount",
                    key: "bonus_amount",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("bonus_amount"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Gross Salary",
                    dataIndex: "total_earnings",
                    key: "total_earnings",
                    width: 110,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_earnings"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "SSF",
                    dataIndex: "employee_ssnit_contribution",
                    key: "employee_ssnit_contribution",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("employee_ssnit_contribution"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Tier 3",
                    dataIndex: "tier_3",
                    key: "tier_3",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("tier_3"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Total Exemptions",
                    dataIndex: "total_exemptions",
                    key: "total_exemptions",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_exemptions"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Total Reliefs",
                    dataIndex: "total_reliefs",
                    key: "total_reliefs",
                    width: 110,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_reliefs"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Taxable Income",
                    dataIndex: "taxable_income",
                    key: "taxable_income",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("taxable_income"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "PAYE",
                    dataIndex: "income_tax",
                    key: "income_tax",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("income_tax"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Overtime Tax",
                    dataIndex: "overtime_tax",
                    key: "overtime_tax",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("overtime_tax"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Bonus Tax",
                    dataIndex: "bonus_tax",
                    key: "bonus_tax",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("bonus_tax"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Welfare",
                    dataIndex: "welfare",
                    key: "welfare",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("welfare"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Other Deductions",
                    dataIndex: "other_deductions",
                    key: "other_deductions",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("other_deductions"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Loans",
                    dataIndex: "total_loan_deductions",
                    key: "total_loan_deductions",
                    width: 100,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_loan_deductions"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Total Deductions",
                    dataIndex: "total_deductions",
                    key: "total_deductions",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("total_deductions"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Net Salary",
                    dataIndex: "net_amount",
                    key: "net_amount",
                    width: 110,
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
                ]}
              />
            </div>
            <div className="flex  mt-4 justify-end">
              <Pagination
                current={page}
                pageSize={limit}
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

export default SummaryPayReport;
