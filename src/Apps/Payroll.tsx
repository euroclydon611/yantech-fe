import { Routes, Route } from "react-router-dom";
import {
  MainLayout,
  Attendants,
  Payroll_run,
  Payroll_test_run,
  PME,
  PayslipEmailBody,
  Status,
  BankReport,
  PaySlipReport,
  SummaryReport,
  TaxReport,
  SummaryPayReport,
  SsnitReport1,
  SsnitReport2,
  SsnitReport3,
  BackupAndRestore,
  ChangeLog,
  TaxConfiguration,
  SsnitConfiguration,
  AddRankIncrement,

  //overtime
  Rejected_overtime,
  Pending_overtime,
  Approved_overtime,
} from "../routes/routes";

const Payroll = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="pending-overtime" element={<Pending_overtime />} />;
          <Route path="approved-overtime" element={<Approved_overtime />} />;
          <Route path="rejected-overtime" element={<Rejected_overtime />} />;
          <Route path="attendants" element={<Attendants />} />
          <Route path="payroll-run" element={<Payroll_run />} />
          <Route path="payroll-test-run" element={<Payroll_test_run />} />
          <Route path="payroll-monetary" element={<PME />} />
          <Route path="email-body" element={<PayslipEmailBody />} />
          <Route path="employee-status" element={<Status />} />
          <Route path="bank-report" element={<BankReport />} />
          <Route path="payslip-report" element={<PaySlipReport />} />
          <Route path="summary-report" element={<SummaryReport />} />
          <Route path="summary-pay-report" element={<SummaryPayReport />} />
          <Route path="tax-report" element={<TaxReport />} />
          <Route path="ssnit-tier1-report" element={<SsnitReport1 />} />
          <Route path="ssnit-tier2-report" element={<SsnitReport2 />} />
          <Route path="ssnit-tier3-report" element={<SsnitReport3 />} />
          <Route path="backup-restore" element={<BackupAndRestore />} />
          <Route path="change-log" element={<ChangeLog />} />
          <Route path="tax" element={<TaxConfiguration />} />
          <Route path="ssnit" element={<SsnitConfiguration />} />
          <Route path="rank-increments" element={<AddRankIncrement />} />
        </Route>
      </Routes>
    </>
  );
};

export default Payroll;
