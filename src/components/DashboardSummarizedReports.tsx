import { useReportsDashboardDataQuery } from "../redux/features/dashboard/dashboardApi";
import {
  useSsnitTier1ListQuery,
  useSsnitTier2ListQuery,
} from "../redux/features/configurations/ssnitApi";

const DashboardSummarizedReports = ({ year, pay_month, currency }: any) => {
  const { data: employerData, isLoading: isEmployerDataLoading } =
    useSsnitTier1ListQuery({});
  const { data: employeeData, isLoading: isEmployeeDataLoading } =
    useSsnitTier2ListQuery({});

  const { data: reportsData, isLoading: reportLoading } =
    useReportsDashboardDataQuery({
      year,
      pay_month,
      currency,
      // forecast: 0,
    });

  const tier_1_rate = employerData?.data[0]?.rate;
  const tier_2_rate = employeeData?.data[0]?.rate;

  // if (reportLoading || isEmployeeDataLoading || isEmployerDataLoading) {
  //   return <Loader />;
  // }

  return (
    <div>
      <section className="flex justify-between gap-3 pt-5 px-2 overflow-x-auto">
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Basic Salary</span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalBasicSalary : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Bonus</span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalBonusAmount : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Overtime</span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalOvertimeAmount : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Gross</span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalGross : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Net</span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalNet : "0.00"}
            </span>{" "}
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span
              className="text-[12px] font-bold"
              title="PAYE, bonus, overtime, and casual staff taxes"
            >
              Total Taxes
            </span>
            <span>-</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalPaye : "0.00"}
            </span>{" "}
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Tier 1</span>
            <span>{tier_1_rate ? `(${tier_1_rate})` : "-"}</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalTier1 : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Tier 2</span>
            <span>{tier_2_rate ? `(${tier_2_rate})` : "-"}</span>
            <span className="text-[14.4px]">
              {currency || "GHS"} {reportsData?.data ? reportsData?.data?.totalTier2 : "0.00"}
            </span>
          </div>
        </div>
        {/* <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm ml-2">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Tier 3</span>
            <span>-</span>
            <span className="text-[14.4px]">
              GHS {reportsData?.data ? reportsData?.data?.totalTier3 : "0.00"}
            </span>
          </div>
        </div>
        <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm ml-2">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Tier 3 Taxable</span>
            <span>-</span>
            <span className="text-[14.4px]">
              GHS {reportsData?.data ? reportsData?.data?.totalTier3Taxable : "0.00"}
            </span>
          </div>
        </div> */}
        {/* <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm ml-2">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Loans</span>
            <span>-</span>
            <span className="text-[14.4px]">
              GHS {reportsData?.data ? reportsData?.data?.totalLoans : "0.00"}
            </span>
          </div>
        </div> */}
        {/* <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm ml-2">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Other Deductions</span>
            <span>-</span>
            <span className="text-[14.4px]">
              GHS {reportsData?.data ? reportsData?.data?.totalOtherDeductions : "0.00"}
            </span>
          </div>
        </div> */}
        {/* <div className="w-[240px] min-h-[116px] p-[24px] bg-white rounded-md shadow-sm ml-2">
          <div className="flex flex-col gap-y-1">
            <span className="text-[12px] font-bold">Total Allowances</span>
            <span>-</span>
            <span className="text-[14.4px]">
              GHS {reportsData?.data ? reportsData?.data?.totalAllowances : "0.00"}
            </span>
          </div>
        </div> */}
      </section>
    </div>
  );
};

export default DashboardSummarizedReports;
