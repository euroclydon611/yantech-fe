import PageLayout from "../../components/PageLayout";
import { styles } from "../../styles";
import { PageTitle } from "../../utils/PageTitle";
import { MdDownload } from "react-icons/md";
import { useEffect, useState } from "react";
import { Pagination, Table } from "antd";
import { AiOutlineFilePdf, AiOutlineSearch } from "react-icons/ai";
import { SiMinutemailer, SiMicrosoftexcel } from "react-icons/si";
import { BsSendFill } from "react-icons/bs";
import { useSummaryPayReportQuery } from "../../redux/features/reports/summaryPayApi";
import { useEmailPaySlipMutation } from "../../redux/features/reports/emailServiceApi";
import DashboardSummarizedReports from "../../components/DashboardSummarizedReports";
import { exportData, formatNumber } from "../../utils/helperFunction";
import Swal from "sweetalert2";
import axios from "axios";
import { popularCurrencies } from "@/utils/generalData";
import { ChevronDown } from "lucide-react";
import { exportErrorDataToPDF, openPdfFromApi } from "@/utils/payslip.service";

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const PaySlipReport = () => {
  PageTitle("Payslip Report | Payroll");
  const [accumulationStartMonth, setAccumulationStartMonth] = useState(
    getCurrentMonth()
  );
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [forecast, setForecast] = useState("0");
  const [loading, setLoading] = useState(false);

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

  const handleStartDateChange = (e) => {
    const selectedMonthVal = e.target.value;
    setAccumulationStartMonth(selectedMonthVal);
  };

  const handleDateChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const [
    sendPayslip,
    {
      data: sentData,
      isLoading: emailsLoading,
      isSuccess: isSendingSuccess,
      error: isSendingError,
    },
  ] = useEmailPaySlipMutation();

  const [
    sendIndividualPayslip,
    {
      data: individualData,
      isSuccess: individualSuccess,
      isLoading: individualLoading,
      error: individualError,
    },
  ] = useEmailPaySlipMutation();

  const handleEmailButtonClick = async () => {
    const result = await Swal.fire({
      title: "Send Payslips",
      text: "Do you want to send payslips to corresponding staffs? Please note that this action may take some time to complete",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#0000cc",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await sendPayslip({
        year: year,
        month: month,
        is_single: 0,
        forecast,
        currency: selectedCurrencyData.code,
      });
    }
  };

  const handleIndividualEmailButtonClick = async (employee: any) => {
    const result = await Swal.fire({
      title: "Send Payslip",
      text: `Do you want to send payslips to ${employee?.full_name}?`,
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#0000cc",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await sendIndividualPayslip({
        year: year,
        month: month,
        is_single: 1,
        forecast,
        staff_id: employee?.staff_id,
        currency: selectedCurrencyData.code,
      });
    }
  };

  useEffect(() => {
    if (isSendingSuccess) {
      const emailFailures = sentData?.data || [];
      const smsFailures = sentData?.smsResponse?.failedData || [];

      const emailFailureList = emailFailures.length
        ? `<strong>Email Failures (${
            emailFailures.length
          }):</strong><ul style="text-align:left;">${emailFailures
            .map(
              (item: any) =>
                `<li>${item.full_name} (${item.employee_number}) – ${item.error_message}</li>`
            )
            .join("")}</ul>`
        : "";

      const smsFailureList = smsFailures.length
        ? `<strong>SMS Failures (${
            smsFailures.length
          }):</strong><ul style="text-align:left;">${smsFailures
            .map(
              (item: any) =>
                `<li>${item.full_name} (${item.employee_number}) – ${item.error_message}</li>`
            )
            .join("")}</ul>`
        : "";

      const hasFailures = emailFailures.length > 0 || smsFailures.length > 0;

      Swal.fire({
        title: hasFailures
          ? "Completed with some issues"
          : sentData?.message || "Completed",
        html: `${emailFailureList}${smsFailureList}`,
        icon: hasFailures ? "warning" : "success",
        confirmButtonText: "OK",
        showDenyButton: hasFailures,
        denyButtonText: "Download Report",
        denyButtonColor: "#99002E",
        confirmButtonColor: "#727cf5",
      }).then((result) => {
        if (result.isDenied) {
          exportErrorDataToPDF(emailFailures, smsFailures);
        }
      });
    }

    if (isSendingError) {
      if ("data" in isSendingError) {
        const errorData = isSendingError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSendingSuccess, isSendingError]);

  useEffect(() => {
    if (individualSuccess) {
      const emailFailures = individualData?.data || [];
      const smsFailures = individualData?.smsResponse?.failedData || [];

      const emailFailureList = emailFailures.length
        ? `<strong>Email Failures (${
            emailFailures.length
          }):</strong><ul style="text-align:left;">${emailFailures
            .map(
              (item: any) =>
                `<li>${item.full_name} (${item.employee_number}) – ${item.error_message}</li>`
            )
            .join("")}</ul>`
        : "";

      const smsFailureList = smsFailures.length
        ? `<strong>SMS Failures (${
            smsFailures.length
          }):</strong><ul style="text-align:left;">${smsFailures
            .map(
              (item: any) =>
                `<li>${item.full_name} (${item.employee_number}) – ${item.error_message}</li>`
            )
            .join("")}</ul>`
        : "";

      const hasFailures = emailFailures.length > 0 || smsFailures.length > 0;

      Swal.fire({
        title: hasFailures
          ? "Completed with some issues"
          : sentData?.message || "Completed",
        html: `${emailFailureList}${smsFailureList}`,
        icon: hasFailures ? "warning" : "success",
        confirmButtonText: "OK",
        showDenyButton: hasFailures,
        denyButtonText: "Download Report",
        denyButtonColor: "#99002E",
        confirmButtonColor: "#727cf5",
      }).then((result) => {
        if (result.isDenied) {
          exportErrorDataToPDF(emailFailures, smsFailures);
        }
      });
    }

    if (individualError) {
      if ("data" in individualError) {
        const errorData = individualError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [individualSuccess, individualError]);

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleViewPaySlip = async (employee: any) => {
    const url = `${
      import.meta.env.VITE_PUBLIC_SERVER_URI
    }/reports/view-pay-slip-pdf`;
    const params = {
      month: month,
      year: year,
      forecast,
      staff_id: employee?.staff_id,
      startDate: `${accumulationStartMonth.split("-")[1]}/${
        accumulationStartMonth.split("-")[0]
      }`,
      endDate: `${monthNo}/${year}`,
      currency: selectedCurrencyData.code,
    };
    await openPdfFromApi(url, params, "single pay slip");
  };

  const handleViewAllPaySlips = async (employee: any) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_PUBLIC_SERVER_URI}/reports/bulk-payslip`;
    const params = {
      month: month,
      year: year,
      forecast,
      startDate: `${accumulationStartMonth.split("-")[1]}/${
        accumulationStartMonth.split("-")[0]
      }`,
      endDate: `${monthNo}/${year}`,
      currency: selectedCurrencyData.code,
    };
    try {
      await openPdfFromApi(url, params, "bulk pay slips");
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllPaySlipsExcel = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}/reports/bulk-payslip-excel`,
        {
          params: {
            month: month,
            year: year,
            forecast,
            startDate: `${accumulationStartMonth.split("-")[1]}/${
              accumulationStartMonth.split("-")[0]
            }`,
            endDate: `${monthNo}/${year}`,
            currency: selectedCurrencyData.code,
          },
          withCredentials: true,
        }
      );

      const fileBase64 = response?.data?.file;

      if (fileBase64) {
        const byteCharacters = atob(fileBase64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Payslips_${month}_${year}_${selectedCurrencyData.code}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        alert("Excel file not available");
      }
    } catch (error) {
      Swal.fire({
        title: "Oops...",
        text: error?.response?.data?.error
          ? error?.response?.data?.error
          : "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
      console.error("Failed to export payslips to excel:", error);
    } finally {
      setLoading(false);
    }
  };

  if (individualLoading || emailsLoading || loading) {
    return (
      <div className="email_loader-overlay">
        <div className="email_loader">
          <div className="email_spinner"></div>
          <p>Please Wait...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageLayout
        title="Payslip Report"
        breadcrumbs={[{ label: "Payroll" }, { label: "Reports" }, { label: "Payslip" }]}
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
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="max-md:hidden">Accumulation Start Month:</span>
              <input
                type="month"
                id="accumulation-start-month"
                className={`${styles.period_date_input}`}
                value={accumulationStartMonth}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="flex flex-col  gap-1">
              <span className="max-md:hidden text-green-600">
                Payroll End Month:
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
          <div className="flex gap-x-4">
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() => handleViewAllPaySlips({})}
              hidden
            >
              <AiOutlineFilePdf size={18} />
              <span className="max-md:hidden flex">View All Payslips</span>
            </button>
            <button
              className={styles.export_btn}
              title="Export to Excel"
              onClick={() => handleExportAllPaySlipsExcel()}
            >
              <SiMicrosoftexcel size={18} />
              <span className="max-md:hidden flex">Bulk Payslips Excel</span>
            </button>
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() =>
                exportData(
                  `reports/export-bank-summary?forecast=${forecast}&year=${year}&month=${month}&currency=${selectedCurrencyData.code}`,
                  `Payslip_report_${month}_${year}_${selectedCurrencyData.code}`
                )
              }
            >
              <MdDownload size={18} />
              <span className="max-md:hidden flex">Export Excel</span>
            </button>
            <button
              className={styles.export_btn}
              onClick={handleEmailButtonClick}
            >
              <SiMinutemailer size={18} />
              <span className="max-md:hidden flex">Email Payslips</span>
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
                    title: "Department",
                    dataIndex: "department",
                    key: "department",
                    width: 150,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("department"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "-",
                  },
                  {
                    title: "Unit",
                    dataIndex: "unit",
                    key: "unit",
                    width: 130,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("unit"),
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
                    title: "Default Basic",
                    dataIndex: "default_salary",
                    key: "default_salary",
                    width: 120,
                    align: "right",
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("default_salary"),
                      style: { cursor: "pointer" },
                    }),
                    render: (val) => formatNumber(val) || "0.00",
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                  },
                  {
                    title: "Hours Worked",
                    dataIndex: "hours_worked",
                    key: "hours_worked",
                    width: 100,
                    sorter: true,
                    onHeaderCell: () => ({
                      onClick: () => handleSort("hours_worked"),
                      style: { cursor: "pointer" },
                    }),
                    onCell: () => ({
                      style: { fontSize: "11px", padding: "4px 8px" },
                    }),
                    render: (val) => val || "0",
                  },
                  {
                    title: "Basic Salary",
                    dataIndex: "basic_salary",
                    key: "basic_salary",
                    width: 120,
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
                    title: "Overtime Amount",
                    dataIndex: "overtime_amount",
                    key: "overtime_amount",
                    width: 120,
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
                    title: "Allowances",
                    dataIndex: "total_allowances",
                    key: "total_allowances",
                    width: 120,
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
                    title: "Bonus",
                    dataIndex: "bonus_amount",
                    key: "bonus_amount",
                    width: 120,
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
                    width: 120,
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
                    title: "Tier 2 (5%)",
                    dataIndex: "employee_ssnit_contribution",
                    key: "employee_ssnit_contribution",
                    width: 120,
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
                    width: 120,
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
                    title: "Welfare",
                    dataIndex: "welfare",
                    key: "welfare",
                    width: 120,
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
                    title: "Total Reliefs",
                    dataIndex: "total_reliefs",
                    key: "total_reliefs",
                    width: 120,
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
                    width: 120,
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
                    title: "Actions",
                    key: "actions",
                    width: 120,
                    align: "center",
                    fixed: "right" as const,
                    render: (_text, employee: any) => (
                      <span className="flex items-center justify-center gap-4">
                        <span
                          className="border border-[#39afd1] text-[#39afd1] hover:text-[white] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#39afd1] transition-all duration-300 cursor-pointer"
                          title="Send Payslip"
                          onClick={() => handleIndividualEmailButtonClick(employee)}
                        >
                          <BsSendFill size={14} />
                        </span>
                        <span
                          className="border border-[#4caf50] text-[#4caf50] hover:text-[white] flex justify-center items-center py-[5px] px-3 rounded-full hover:bg-[#4caf50] transition-all duration-300 cursor-pointer"
                          title="View Pay Slip"
                          onClick={() => handleViewPaySlip(employee)}
                        >
                          <AiOutlineFilePdf size={14} />
                        </span>
                      </span>
                    ),
                    onCell: () => ({
                      style: { padding: "4px 8px" },
                    }),
                  },
                ]}
              />
            </div>
            <div className="flex mt-4 justify-end">
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

export default PaySlipReport;
