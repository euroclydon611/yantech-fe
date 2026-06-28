import { styles } from "../../styles";
import { MdDownload } from "react-icons/md";
import { useEffect, useState } from "react";
import { Pagination, Table, Tooltip, Typography, Spin } from "antd";
import { ExpandOutlined, CloseOutlined } from "@ant-design/icons";
const { Text } = Typography;
import {
  AiOutlineFilePdf,
  AiOutlineSearch,
  AiOutlineEye,
} from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
import { BsSendFill } from "react-icons/bs";
import { useSummaryPayReportQuery } from "../../redux/features/reports/summaryPayApi";
import { useEmailPaySlipMutation } from "../../redux/features/reports/emailServiceApi";
import {
  useListPayrollSnapshotsQuery,
  useGetPayrollSnapshotQuery,
} from "../../redux/features/reports/payrollSnapshotApi";
import PayrollSnapshotDetailsDrawer from "./snapshot-components/PayrollSnapshotDetailsDrawer";
import {
  capitalizeFirstLetter,
  exportData,
  formatNumber,
} from "../../utils/helperFunction";
import Swal from "sweetalert2";
import axios from "axios";
import {
  exportErrorDataToExcel,
  exportErrorDataToPDF,
  openPdfFromApi,
} from "@/utils/payslip.service";

const monthNameToNumber = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

const fetchPdfBlobUrl = async (url: string, params: object): Promise<string | null> => {
  try {
    const response = await axios.get(url, { params, withCredentials: true });
    const documentUrl = response?.data?.document_url;
    if (documentUrl) return documentUrl;
    const fileBase64 = response?.data?.file;
    if (!fileBase64 || typeof fileBase64 !== "string") return null;
    const base64Data = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const blob = new Blob([byteNumbers], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  } catch (error: any) {
    Swal.fire({ title: "Oops...", text: error?.response?.data?.error || "Could not load payslip.", icon: "error", confirmButtonColor: "#15803d" });
    return null;
  }
};

const ReportOnTestRunPage = ({ currency, year, payMonth }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [forecast, setForecast] = useState("1");
  const [loading, setLoading] = useState(false);

  const [pdfPanelOpen, setPdfPanelOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);
  const [showBreakdownDrawer, setShowBreakdownDrawer] = useState(false);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(
    null
  );
  const [fallbackParams, setFallbackParams] = useState<{
    staff_id: string;
    month: string;
    year: string;
  } | null>(null);

  const { data: snapshotDetails, isLoading: isSnapshotLoading } =
    useGetPayrollSnapshotQuery(selectedSnapshotId || "", {
      skip: !selectedSnapshotId,
    });

  const { data: listData } = useListPayrollSnapshotsQuery(
    {
      pay_month: fallbackParams?.month || "",
      year: Number(fallbackParams?.year) || 0,
      search: fallbackParams?.staff_id || "",
    },
    { skip: !fallbackParams }
  );

  useEffect(() => {
    if (fallbackParams && listData?.data && listData.data.length > 0) {
      setSelectedSnapshotId(listData.data[0]._id);
      setFallbackParams(null);
    }
  }, [listData, fallbackParams]);

  const year1 = year || localStorage.getItem("year");
  const pay_month = payMonth || localStorage.getItem("pay_month");

  const { data: SummaryReportData } = useSummaryPayReportQuery({
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

  const [
    sendPayslip,
    {
      data: sentData,
      isSuccess: isSendingSuccess,
      isLoading: emailsLoading,
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
        year: year1,
        month: pay_month,
        is_single: 0,
        forecast,
        currency: currency,
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
        year: year1,
        month: pay_month,
        is_single: 1,
        forecast,
        staff_id: employee?.staff_id,
        currency: currency,
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
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSendingSuccess, isSendingError]);

  // ========================================

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
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Something went wrong!",
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

  const columns = [
    {
      title: "No",
      key: "no",
      width: 60,
      render: (_text, _record, index) => (page - 1) * limit + index + 1,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      fixed: "left" as const,
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
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
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
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
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
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Notch",
      dataIndex: "notch",
      key: "notch",
      width: 80,
      align: "center" as const,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Employment Type",
      dataIndex: "employment_type",
      key: "employment_type",
      width: 130,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Position",
      dataIndex: "gra_position",
      key: "gra_position",
      width: 130,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      width: 150,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("entity"),
        style: { cursor: "pointer" },
      }),
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
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
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Months Ran",
      dataIndex: "total_months_ran",
      key: "total_months_ran",
      width: 100,
      align: "center" as const,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
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
        record.pay_month
          ? `${capitalizeFirstLetter(record.pay_month)} ${record.year}`
          : "-",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Bank Name",
      dataIndex: "bank",
      key: "bank",
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Bank Branch",
      dataIndex: "bank_branch",
      key: "bank_branch",
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Account Number",
      dataIndex: "bank_account_number",
      key: "bank_account_number",
      width: 150,
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val || "-",
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourly_rate",
      key: "hourly_rate",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("hourly_rate"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Hrs Worked",
      dataIndex: "hours_worked",
      key: "hours_worked",
      width: 100,
      align: "center" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("hours_worked"),
        style: { cursor: "pointer" },
      }),
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val ?? "-",
    },
    {
      title: "Overtime Hrs",
      dataIndex: "overtime_hours_worked",
      key: "overtime_hours_worked",
      width: 100,
      align: "center" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("overtime_hours_worked"),
        style: { cursor: "pointer" },
      }),
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
      render: (val) => val ?? "-",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      key: "basic_salary",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("basic_salary"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Allowances",
      dataIndex: "total_allowances",
      key: "total_allowances",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_allowances"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Overtime Amount",
      dataIndex: "overtime_amount",
      key: "overtime_amount",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("overtime_amount"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Bonus",
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("bonus_amount"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Gross Salary",
      dataIndex: "total_earnings",
      key: "total_earnings",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_earnings"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "SSF",
      dataIndex: "employee_ssnit_contribution",
      key: "employee_ssnit_contribution",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("employee_ssnit_contribution"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Tier 3",
      dataIndex: "tier_3",
      key: "tier_3",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("tier_3"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Total Exemptions",
      dataIndex: "total_exemptions",
      key: "total_exemptions",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_exemptions"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Reliefs",
      dataIndex: "total_reliefs",
      key: "total_reliefs",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_reliefs"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Taxable Income",
      dataIndex: "taxable_income",
      key: "taxable_income",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("taxable_income"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "PAYE",
      dataIndex: "income_tax",
      key: "income_tax",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("income_tax"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Overtime Tax",
      dataIndex: "overtime_tax",
      key: "overtime_tax",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("overtime_tax"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Bonus Tax",
      dataIndex: "bonus_tax",
      key: "bonus_tax",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("bonus_tax"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Welfare",
      dataIndex: "welfare",
      key: "welfare",
      width: 100,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("welfare"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Other Deds",
      dataIndex: "other_deductions",
      key: "other_deductions",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("other_deductions"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Loans",
      dataIndex: "total_loan_deductions",
      key: "total_loan_deductions",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_loan_deductions"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Total Deds",
      dataIndex: "total_deductions",
      key: "total_deductions",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("total_deductions"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Net Salary",
      dataIndex: "net_amount",
      key: "net_amount",
      width: 120,
      align: "right" as const,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("net_amount"),
        style: { cursor: "pointer" },
      }),
      render: (val) => formatNumber(val) || "0.00",
      onCell: () => ({ style: { fontSize: "11px", padding: "4px 8px" } }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      fixed: "right" as const,
      render: (_text, record: any) => (
        <span className="flex items-center justify-center gap-2">
          <Tooltip title="View Breakdown">
            <span
              className="text-purple-600 cursor-pointer p-1.5 hover:bg-purple-100 rounded"
              onClick={() => {
                if (record.snap_shot_id) {
                  setSelectedSnapshotId(record.snap_shot_id);
                } else {
                  setFallbackParams({
                    staff_id: record.staff_id,
                    month: pay_month || "",
                    year: year1 || "",
                  });
                }
                setShowBreakdownDrawer(true);
              }}
            >
              <AiOutlineEye size={14} />
            </span>
          </Tooltip>
          <Tooltip title="View Payslip">
            <span
              className="text-red-600 cursor-pointer p-1.5 hover:bg-red-100 rounded"
              onClick={() => handleViewPaySlip(record)}
            >
              <AiOutlineFilePdf size={14} />
            </span>
          </Tooltip>
          <Tooltip title="Email Payslip">
            <span
              className="text-blue-600 cursor-pointer p-1.5 hover:bg-blue-100 rounded"
              onClick={() => handleIndividualEmailButtonClick(record)}
            >
              <BsSendFill size={14} />
            </span>
          </Tooltip>
        </span>
      ),
      onCell: () => ({ style: { padding: "4px 8px" } }),
    },
  ];

  const handleViewPaySlip = async (employee: any) => {
    setActiveEmployee(employee);
    setPdfPanelOpen(true);
    setPdfUrl(null);
    setPdfLoading(true);
    const url = `${import.meta.env.VITE_PUBLIC_SERVER_URI}/reports/view-pay-slip-pdf`;
    const params = {
      month: pay_month,
      year: year1,
      forecast,
      staff_id: employee?.staff_id,
      currency,
      startDate: `${monthNameToNumber[pay_month]}/${year1}`,
      endDate: `${monthNameToNumber[pay_month]}/${year1}`,
    };
    const blobUrl = await fetchPdfBlobUrl(url, params);
    setPdfUrl(blobUrl);
    setPdfLoading(false);
  };

  const handleClosePdfPanel = () => {
    setPdfPanelOpen(false);
    setActiveEmployee(null);
    setPdfUrl(null);
  };

  const handleViewAllPaySlips = async (employee: any) => {
    setLoading(true); // Show loader
    const url = `${import.meta.env.VITE_PUBLIC_SERVER_URI}/reports/bulk-payslip`;
    const params = {
      month: pay_month,
      year: year1,
      forecast,
      startDate: `${monthNameToNumber[pay_month]}/${year1}`,
      endDate: `${monthNameToNumber[pay_month]}/${year1}`,
      currency,
    };
    try {
      await openPdfFromApi(url, params, "bulk pay slips");
    } finally {
      setLoading(false); // Hide loader
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
        const start = (
          document.getElementById("startPeriod") as HTMLInputElement
        ).value;
        const end = (document.getElementById("endPeriod") as HTMLInputElement)
          .value;
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
        `reports/export-variance?startPeriod=${startPeriod}&endPeriod=${endPeriod}&currency=${currency}&forecast=${forecast}`,
        `Variance_Report_${startPeriod.replace(
          "/",
          "_"
        )}_vs_${endPeriod.replace("/", "_")}`
      );
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
      <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      <div className="mx-2 p-2 bg-white rounded-md" style={{ flex: 1, minWidth: 0, transition: "flex 0.3s ease" }}>
        <div className="flex justify-between w-full p-4">
          <h1 className="text-[15px] font-medium">
            Summary Pay Report | {pay_month + " " + year1}
          </h1>
          <div className="flex gap-x-4">
            <button
              className={styles.export_btn}
              title="Export"
              onClick={() => handleViewAllPaySlips("")}
              hidden
            >
              <AiOutlineFilePdf size={18} />
              <span className="max-md:hidden flex">View All Payslips</span>
            </button>

            <button
              className={styles.export_btn}
              title="Export"
              onClick={() =>
                exportData(
                  `reports/export-bank-summary?forecast=${forecast}&year=${year1}&month=${pay_month}&currency=${currency}`,
                  `Summary_pay_report_${pay_month}_${year1}_${currency}`
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
            <button
              className={styles.export_btn}
              onClick={handleEmailButtonClick}
              title="Email Payslips"
            >
              <SiMinutemailer size={18} />
              <span className="max-md:hidden flex">Email Payslips</span>
            </button>
          </div>
        </div>
        <div>
          <div className="p-4">
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
              <div className="flex relative w-[22%] max-md:w-[55%]">
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
            </div>
            <div className="table-wrapper bg-white rounded-sm shadow-sm">
              <Table
                sticky
                dataSource={SummaryReportData?.data || []}
                columns={columns}
                pagination={false}
                loading={loading}
                size="small"
                scroll={{ x: 3500, y: "60vh" }}
                rowKey={(record) => record.staff_id || record._id}
                rowClassName={(record, index) =>
                  activeEmployee?.staff_id && record.staff_id === activeEmployee.staff_id
                    ? "!bg-green-50"
                    : index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }
                locale={{ emptyText: <Text className="text-red-500 font-extrabold">No data</Text> }}
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

      {/* PDF PREVIEW PANEL */}
      <div style={{
        width: pdfPanelOpen ? 620 : 0,
        minWidth: 0,
        overflow: "hidden",
        transition: "width 0.3s ease",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: pdfPanelOpen ? "1px solid #e5e7eb" : "none",
        background: "white",
        position: "sticky",
        top: 0,
        height: "calc(100vh - 60px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
          <AiOutlineFilePdf size={15} style={{ color: "#15803d", flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1f2937", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {activeEmployee?.full_name || "Payslip"} — {pay_month} {year1}
          </span>
          <Tooltip title="Open full screen in new tab">
            <button
              onClick={() => pdfUrl && window.open(pdfUrl, "_blank")}
              disabled={!pdfUrl || pdfLoading}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#15803d", border: "1px solid #22c55e", borderRadius: 4, padding: "2px 8px", background: "white", cursor: "pointer", opacity: (!pdfUrl || pdfLoading) ? 0.4 : 1 }}
            >
              <ExpandOutlined style={{ fontSize: 11 }} />
              Full
            </button>
          </Tooltip>
          <button onClick={handleClosePdfPanel} style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
            <CloseOutlined style={{ fontSize: 13 }} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden", background: "#e5e7eb" }}>
          {pdfLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "#6b7280", fontSize: 12 }}>
              <Spin size="large" />
              <span>Loading payslip...</span>
            </div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} title="Payslip Preview" style={{ width: "100%", height: "100%", border: "none" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, color: "#9ca3af", fontSize: 12 }}>
              <AiOutlineFilePdf size={36} style={{ color: "#d1d5db" }} />
              <span>Payslip could not be loaded.</span>
            </div>
          )}
        </div>
      </div>

      </div>

      <PayrollSnapshotDetailsDrawer
        open={showBreakdownDrawer}
        loading={isSnapshotLoading}
        onClose={() => {
          setShowBreakdownDrawer(false);
          setSelectedSnapshotId(null);
          setFallbackParams(null);
        }}
        record={snapshotDetails?.data?.employee_data || null}
      />
    </>
  );
};

export default ReportOnTestRunPage;
