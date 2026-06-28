import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useReportsDashboardDataQuery } from "../../redux/features/dashboard/dashboardApi";
import { usePayrollTestRunMutation } from "../../redux/features/reports/payrollRun";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import ReportOnTestRunPage from "./ReportOnTestRunPage";
import Swal from "sweetalert2";
import BankReportOnTestRunPage from "./BankReportOnTestRunPage";
import SsnitReport1OnTestRunPage from "./Tier1ReportOnTestRunPage";
import SsnitReport2OnTestRunPage from "./Tier2ReportOnTestRunPage";
import SsnitReport3OnTestRunPage from "./Tier3ReportOnTestRunPage";
import TaxReportOnTestRunPage from "./TaxReportOnTestRunPage";
import LoanReportOnTestRunPage from "./LoanReportOnTestRunPage";
import OtherDeductionReportOnTestRunPage from "./OtherDeductionReportOnTestRunPage";
import AllowanceReportOnTestRunPage from "./AllowanceReportOnTestRunPage";
import SummaryReportOnTestRunPage from "./SummaryReportOnTestRunPage";
import { ChevronDown } from "lucide-react";
import { popularCurrencies } from "@/utils/generalData";
import { useNavigate } from "react-router-dom";
import { usePrivileges } from "../../hooks/usePrivileges";
import { Select } from "antd";

const { Option } = Select;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());

const Payroll_test_run = () => {
  PageTitle("Payroll Test Run | Payroll");
  const navigate = useNavigate();

  const [selectedCurrency, setSelectedCurrency] = useState("GHS");
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    setIsOpen(false);
  };

  const selectedCurrencyData = popularCurrencies.find(
    (curr) => curr.code === selectedCurrency
  );

  const { hasPayrollTestRunViewAccess, hasPayrollRunCreateAccess, hasPayrollFinalizeAccess } = usePrivileges();

  const [year, setYear] = useState(localStorage.getItem("year") || new Date().getFullYear().toString());
  const [payMonth, setPayMonth] = useState(localStorage.getItem("pay_month") || months[new Date().getMonth()]);

  if (!hasPayrollTestRunViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const [payrollTestRun, { data, isLoading, isSuccess, error }] =
    usePayrollTestRunMutation();

  const { data: reportsData, refetch } = useReportsDashboardDataQuery({
    year,
    pay_month: payMonth,
    forecast: 1,
    currency: selectedCurrencyData.code,
  });

  // console.log(reportsData);
  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handlePayrollTestRun = async (bank: any) => {
    const confirmationCode = generateConfirmationCode();

    const step1 = await Swal.fire({
      title: "⚠️ WARNING: Final Payroll Run",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p style="color: #d33; font-weight: bold; margin-bottom: 12px;">This action CANNOT be undone!</p>
          <p style="margin-bottom: 8px;">You are about to finalize the payroll for <strong>${payMonth} ${year}</strong>.</p>
          <p style="margin-bottom: 8px;">Once finalized:</p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>All forecasted data will become permanent</li>
            <li>Reports cannot be modified</li>
            <li>Payslips will be locked and cannot be changed</li>
            <li>All records will be marked as finalized in the audit trail</li>
          </ul>
          <p style="color: #d33; font-weight: bold; margin-top: 12px;">Are you absolutely certain you want to proceed?</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I Understand the Risks",
      cancelButtonText: "Cancel",
    });

    if (!step1.isConfirmed) return;

    const step2 = await Swal.fire({
      title: "Confirm Payroll Details",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p style="margin-bottom: 12px;">Please confirm the payroll details:</p>
          <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
            <p style="margin: 4px 0;"><strong>Pay Month:</strong> ${payMonth}</p>
            <p style="margin: 4px 0;"><strong>Year:</strong> ${year}</p>
            <p style="margin: 4px 0;"><strong>Action:</strong> Finalize Payroll (Irreversible)</p>
          </div>
          <p style="color: #d33; margin: 0;">Once you proceed, this cannot be reversed.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalize & Lock Payroll Period",
      cancelButtonText: "Cancel",
    });

    if (!step2.isConfirmed) return;

    const step3 = await Swal.fire({
      title: "Final Verification Required",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p style="margin-bottom: 12px;">To confirm this irreversible action, please type the following code:</p>
          <div style="background-color: #fff3cd; padding: 12px; border-radius: 4px; margin-bottom: 16px; border-left: 4px solid #ffc107; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;">
            <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: bold; letter-spacing: 2px; cursor: default;">${confirmationCode}</p>
          </div>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">This code is case-sensitive • Copy/Paste disabled</p>
        </div>
      `,
      input: "text",
      inputPlaceholder: "Enter the code above",
      icon: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalize & Lock Payroll Period",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter the confirmation code";
        }
        if (value.toUpperCase() !== confirmationCode) {
          return "Confirmation code is incorrect. Please try again.";
        }
      },
      didOpen: (modal) => {
        const input = modal.querySelector(
          "input[type='text']"
        ) as HTMLInputElement;
        if (input) {
          input.addEventListener("paste", (e) => {
            e.preventDefault();
          });
          input.addEventListener("copy", (e) => {
            e.preventDefault();
          });
          input.addEventListener("cut", (e) => {
            e.preventDefault();
          });
          input.addEventListener("contextmenu", (e) => {
            e.preventDefault();
          });
          input.focus();
        }
      },
    });

    if (step3.isConfirmed) {
      await payrollTestRun({
        year,
        pay_month: payMonth?.toLowerCase(),
        confirm: 1,
      });
    }
  };

  const cancelPayrollTestRun = async (bank: any) => {
    const result = await Swal.fire({
      title: "Cancel this payroll ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#0000cc",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, Cancel it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await payrollTestRun({
        year,
        pay_month: payMonth?.toLowerCase(),
        confirm: 0,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Complete!";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          localStorage.setItem("year", year);
          localStorage.setItem("pay_month", payMonth);
          refetch();
          navigate("/payroll-test-run", { replace: true });
        }
      });
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Error",
          text: errorData.data.error || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#d33",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, refetch, navigate, year, payMonth]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <PageLayout
        title="Payroll Test Run"
        subtitle="Preview payroll calculations before finalizing"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Payroll Test Run" }]}
        actions={
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <label className="block text-xs font-medium text-gray-600">Year</label>
              <Select value={year} onChange={(val) => setYear(val)} size="small" className="w-20">
                {years.map((y) => (<Option key={y} value={y}>{y}</Option>))}
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="block text-xs font-medium text-gray-600">Month</label>
              <Select value={payMonth} onChange={(val) => setPayMonth(val)} size="small" className="w-28">
                {months.map((m) => (<Option key={m} value={m}>{m}</Option>))}
              </Select>
            </div>
          </div>
        }
      />
      <div className="p-4">
        <div className="flex gap-2 items-center" hidden>
              <label className="block text-sm font-medium text-gray-700">
                Currency
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
        <section className="flex justify-between gap-3 pt-5 pb-2 px-2 overflow-x-auto">
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Gross</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalGross : "0.00"}
              </span>
            </div>
          </div>
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Net</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalNet : "0.00"}
              </span>
            </div>
          </div>
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span
                className="text-[12px] font-bold"
                title="PAYE, bonus, overtime, and casual staff taxes"
              >
                Total Taxes
              </span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalPaye : "0.00"}
              </span>
            </div>
          </div>
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">
                Total Deductions
              </span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data
                  ? reportsData?.data?.totalDeductions
                  : "0.00"}
              </span>
            </div>
          </div>
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Tier 1</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalTier1 : "0.00"}
              </span>
            </div>
          </div>
          <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Tier 2</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalTier2 : "0.00"}
              </span>
            </div>
          </div>
          {/* <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Tier 3</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalTier3 : "0.00"}
              </span>
            </div>
          </div> */}
          {/* <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Loans</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalLoans : "0.00"}
              </span>
            </div>
          </div> */}
          {/* <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Other Deductions</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalOtherDeductions : "0.00"}
              </span>
            </div>
          </div> */}
          {/* <div className="w-[206px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
            <div className="flex flex-col">
              <span className="text-[12px] font-extrabold">Total Allowances</span>
              <span>-</span>
              <span className="text-[14.4px]">
                {selectedCurrencyData.code}{" "}
                {reportsData?.data ? reportsData?.data?.totalAllowances : "0.00"}
              </span>
            </div>
          </div> */}
        </section>

        <section className="px-2">
          <div className="bg-white py-5 px-3 flex justify-between">
            {hasPayrollRunCreateAccess && (
              <button
                className={` border border-red-600 text-red-500 text-sm px-[14.4px] py-[7.2px] shadow-md rounded-sm focus:ring-2 focus:ring-red-600 hover:bg-red-400 hover:text-white transition-all duration-300`}
                onClick={cancelPayrollTestRun}
              >
                Cancel
              </button>
            )}

            {hasPayrollFinalizeAccess && (
              <button
                className={`${
                  reportsData?.data?.isFinalRunExists &&
                  "border-purple-400 text-purple-300 pointer-events-none"
                } border border-purple-600 text-purple-500 text-sm px-[14.4px] py-[7.2px] shadow-md rounded-sm focus:ring-2 focus:ring-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300`}
                onClick={handlePayrollTestRun}
                disabled={reportsData?.data?.isFinalRunExists}
              >
                Final Run
              </button>
            )}
          </div>
        </section>
        <br />

        {/* <SummaryReportOnTestRunPage currency={selectedCurrencyData.code} />
        <br /> */}
        <ReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <BankReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <SsnitReport1OnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <SsnitReport2OnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <SsnitReport3OnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <TaxReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <LoanReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <OtherDeductionReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
        <AllowanceReportOnTestRunPage 
          currency={selectedCurrencyData.code} 
          year={year}
          payMonth={payMonth}
        />
        <br />
      </div>
    </>
  );
};

export default Payroll_test_run;