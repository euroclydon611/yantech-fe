// this routes are for the hr, payroll, login, dashboard
import Activate_account from "../pages/users/Activate_account.tsx";
import Verify_otp from "../pages/users/Verify_otp.tsx";
import Set_password from "../pages/users/Set_password.tsx";
import RequestOtpReset from "../pages/users/reset_password/RequestOtpReset.tsx";
import SetNewPassword from "../pages/users/reset_password/SetNewPassword.tsx";

import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layout/MainLayout.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Departments from "../pages/sections/departments/Departments.tsx";
import Entities from "../pages/sections/entity/Entities.tsx";
import Units from "../pages/sections/units/Units.tsx";
import Ranks from "../pages/sections/ranks/Ranks.tsx";
import Banks from "../pages/banks/Banks.tsx";
import Branches from "../pages/branches/Branches.tsx";
import Attendants from "../pages/payroll_processing/Attendants.tsx";
import OutstandingLeavePay from "../pages/payroll_processing/OutstandingLeavePay.tsx";
import Payroll_run from "../pages/payroll_processing/Payroll_run.tsx";
import Payroll_test_run from "../pages/payroll_processing/Payroll_test_run.tsx";
import PayrollSnapshot from "../pages/payroll_processing/PayrollSnapshot.tsx";
import PayrollAdjustments from "../pages/configurations/salary-adjustments/PayrollAdjustments.tsx";
import PME from "../pages/configurations/pme/PME.tsx";
import Users from "../pages/users/Users.tsx";
import PayslipEmailBody from "../pages/configurations/email/PayslipEmailBody.tsx";
import Status from "../pages/configurations/status/Status.tsx";
import CreateEmployee from "../pages/employee/CreateEmployee.tsx";
import EditEmployee from "../pages/employee/EditEmployee.tsx";
import ListEmployees from "../pages/employee/ListEmployees.tsx";
import EmployeesOnLeave from "../pages/employee/EmployeesOnLeave.tsx";
import FinancialDetails from "../pages/employee/FinancialDetails.tsx";
import BankReport from "../pages/reports/BankReport";
import LoanReport from "../pages/reports/LoanReport";
import OtherDeductionReport from "../pages/reports/OtherDeductionReport";
import AllowanceReport from "../pages/reports/AllowanceReport";
import PaySlipReport from "../pages/reports/PaySlipReport.tsx";
import SummaryReport from "../pages/reports/SummaryReport";
import TaxReport from "../pages/reports/TaxReport";
import SummaryPayReport from "../pages/reports/SummaryPayReport";
import SsnitReport1 from "../pages/reports/SsnitReport1.tsx";
import SsnitReport2 from "../pages/reports/SsnitReport2.tsx";
import SsnitReport3 from "../pages/reports/SsnitReport3.tsx";
import BackupAndRestore from "../pages/settings/BackupAndRestore";
import ChangeLog from "../pages/settings/ChangeLog";
import AuditLogs from "../pages/settings/AuditLogs";
import TaxConfiguration from "../pages/configurations/tax/TaxConfiguration.tsx";
import TaxRelief from "../pages/configurations/tax/TaxRelief.tsx";
import SsnitConfiguration from "../pages/configurations/ssnit/SsnitConfiguration.tsx";
import OvertimeConfig from "../pages/configurations/overtime/OvertimeConfig.tsx";
import LoanDeductions from "../pages/configurations/loans/LoanDeductions.tsx";
import Lenders from "../pages/configurations/loans/Lenders.tsx";
import StaffTaxRelief from "../pages/configurations/staff-tax-relief/StaffTaxRelief.tsx";
import Pending_leaves from "../pages/leaves/Pending_leaves.tsx";
import Approved_leaves from "../pages/leaves/Approved_leaves.tsx";
import Rejected_leaves from "../pages/leaves/Rejected_leaves.tsx";
import Leaves from "../pages/leaves/Leaves.tsx";
import HrConfig from "../pages/configurations/HrConfig.tsx";
import AddRankIncrement from "../pages/configurations/rank/RankIncrement.tsx";
import Notifications from "../pages/notifications/Notifications.tsx";
import RegisteredClients from "../pages/registry/RegisteredClients.tsx";
import RegistryDashboard from "@/pages/registry/RegistryDashboard.tsx";
import PermitRegistry from "@/pages/registry/PermitRegistry.tsx";
import LicenseRegistry from "@/pages/registry/LicenseRegistry.tsx";
import InvoiceRegistry from "@/pages/registry/InvoiceRegistry.tsx";
import LineItemRegistry from "@/pages/registry/LineItemRegistry.tsx";
import PermitApplications from "@/pages/client-applications/PermitApplications.tsx";
import LicenseApplications from "@/pages/client-applications/LicenseApplications.tsx";
import AuthorizationRequests from "@/pages/client-applications/AuthorizationRequests.tsx";
import EfficacyTrials from "@/pages/client-applications/EfficacyTrials.tsx";
import ApplicationsDashboard from "@/pages/client-applications/ApplicationsDashboard.tsx";
import YELClients from "@/pages/yel/YELClients.tsx";
import YELQuotations from "@/pages/yel/YELQuotations.tsx";
import YELInvoices from "@/pages/yel/YELInvoices.tsx";
import YELTaxConfig from "@/pages/yel/YELTaxConfig.tsx";
import YELBankAccounts from "@/pages/yel/YELBankAccounts.tsx";

//overtime
import Approved_overtime from "../pages/payroll_processing/overtime/Approved_overtime.tsx";
import Pending_overtime from "../pages/payroll_processing/overtime/Pending_overtime.tsx";
import Rejected_overtime from "../pages/payroll_processing/overtime/Rejected_overtime.tsx";
import Batch_overtime from "../pages/payroll_processing/overtime/Batch_overtime.tsx";


export {
  Activate_account,
  Verify_otp,
  Set_password,
  RequestOtpReset,
  SetNewPassword,
  Login,
  Register,
  MainLayout,
  Dashboard,
  Departments,
  Entities,
  Units,
  Ranks,
  Banks,
  Branches,
  CreateEmployee,
  EditEmployee,
  ListEmployees,
  EmployeesOnLeave,
  FinancialDetails,
  Pending_leaves,
  Approved_leaves,
  Rejected_leaves,
  Leaves,
  Attendants,
  OutstandingLeavePay,
  Payroll_run,
  Payroll_test_run,
  PayrollSnapshot,
  PayrollAdjustments,
  Rejected_overtime,
  Pending_overtime,
  Approved_overtime,
  HrConfig,
  Batch_overtime,
  PME,
  Users,
  Notifications,
  ///
  PayslipEmailBody,
  Status,
  BankReport,
  LoanReport,
  OtherDeductionReport,
  AllowanceReport,
  PaySlipReport,
  SummaryReport,
  TaxReport,
  SummaryPayReport,
  SsnitReport1,
  SsnitReport2,
  SsnitReport3,
  BackupAndRestore,
  ChangeLog,
  AuditLogs,
  TaxConfiguration,
  TaxRelief,
  SsnitConfiguration,
  OvertimeConfig,
  LoanDeductions,
  Lenders,
  StaffTaxRelief,
  AddRankIncrement,
  RegisteredClients,
  RegistryDashboard,
  PermitRegistry,
  LicenseRegistry,
  InvoiceRegistry,
  LineItemRegistry,

  PermitApplications,
  LicenseApplications,
  AuthorizationRequests,
  EfficacyTrials,
  ApplicationsDashboard,

  YELClients,
  YELQuotations,
  YELInvoices,
  YELTaxConfig,
  YELBankAccounts,
};
