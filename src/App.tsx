import { useEffect, useMemo } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import EmployeePortal from "./Apps/EmployeePortal";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Loader from "./components/Loader";
import NetworkBanner from "./components/NetworkBanner";
import {
  Login,
  Activate_account,
  Verify_otp,
  Set_password,
  RequestOtpReset,
  SetNewPassword,
  Users,
  Dashboard,
  MainLayout,
  Notifications,

  //HR module routes
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
  HrConfig,

  ///payroll module routes
  OutstandingLeavePay,
  Attendants,
  Payroll_run,
  Payroll_test_run,
  PayrollSnapshot,
  PayrollAdjustments,
  PME,
  PayslipEmailBody,
  Status,
  BankReport,
  PaySlipReport,
  SummaryReport,
  TaxReport,
  SummaryPayReport,
  LoanReport,
  OtherDeductionReport,
  AllowanceReport,
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
  AddRankIncrement,
  //overtime
  Rejected_overtime,
  Pending_overtime,
  Approved_overtime,
  Batch_overtime,
  LoanDeductions,
  Lenders,
  StaffTaxRelief,
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
} from "./routes/routes";

import {
  HsCodesList,
  ServiceCodes,
  ApplicationEntityRoutings,
  ReportTemplates,
  RegistrationFees,
  ServiceCharges,
  SystemMigrations,
} from "./routes/configs";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import useNotifications from "./hooks/useNotification";
import {
  useGetCsrfTokenQuery,
  useGetMeQuery,
} from "./redux/features/auth/authApi";
import useServerHealth from "./hooks/useServerHealth";
import Maintenance from "./pages/Maintenance";
import NotFound from "./employee_portal_pages/pages/not-found";
import PublicPermitMap from "./pages/public/PublicPermitMap";
import AdminTrainingSeriesPage from "./pages/training/admin-training-series";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth) as any;
  const { privileges, csrfToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { isLoading: isCsrfLoading } = useGetCsrfTokenQuery(
    {},
    { skip: !!csrfToken }
  );
  const { isLoading: isMeLoading } = useGetMeQuery({}, { skip: !csrfToken || !!privileges });

  // const { isHealthy, isChecking, checkHealth } = useServerHealth(true);

  // Initialize notifications hook (FCM token registration and foreground message handling)
  // Must be called after user is authenticated
  useNotifications();

  const accessChecks = useMemo(
    () => ({
      hasEntitiesAccess: privileges?.includes("HR_ENTITIES_VIEW") || false,
      hasRankAccess: privileges?.includes("HR_RANK_VIEW") || false,
      hasBankAccess:
        privileges?.includes("HR_BANK_VIEW") ||
        privileges?.includes("HR_BRANCH_VIEW") ||
        false,
      hasEmployeeAccess: privileges?.includes("HR_EMPLOYEE_VIEW") || false,
      hasEmployeeCreateAccess:
        privileges?.includes("HR_EMPLOYEE_CREATE") || false,
      hasEmployeeEditAccess: privileges?.includes("HR_EMPLOYEE_EDIT") || false,
      hasEmployeeDeleteAccess:
        privileges?.includes("HR_EMPLOYEE_DELETE") || false,
      hasEmployeeExportAccess:
        privileges?.includes("HR_EMPLOYEE_EXPORT") || false,
      hasLeaveAccess: privileges?.includes("HR_LEAVE_VIEW") || false,
      hasHRCongfigAccess: privileges?.includes("HR_CONFIGURATION") || false,
      hasPayrollConfigAccess:
        privileges?.includes("PAYROLL_CONFIGURATION") || false,
      hasPayrollPmElementsAccess:
        privileges?.includes("PAYROLL_PM_ELEMENTS_VIEW") || false,
      hasPayrollLoanDeductionsAccess:
        privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_VIEW") || false,
      hasPayrollLendersAccess:
        privileges?.includes("PAYROLL_LENDERS_VIEW") || false,
      hasPayrollTaxAccess: privileges?.includes("PAYROLL_TAX_VIEW") || false,
      hasPayrollTaxReliefAccess:
        privileges?.includes("PAYROLL_TAX_RELIEF_VIEW") || false,
      hasPayrollStaffTaxReliefAccess:
        privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_VIEW") || false,
      hasPayrollSsnitAccess:
        privileges?.includes("PAYROLL_SSNIT_VIEW") || false,
      hasPayrollOvertimeConfigAccess:
        privileges?.includes("PAYROLL_OVERTIME_CONFIG_VIEW") || false,
      hasPayrollAdjustmentsAccess:
        privileges?.includes("PAYROLL_ADJUSTMENTS_VIEW") || false,
      hasPayrollTimesheetAccess:
        privileges?.includes("PAYROLL_TIMESHEET_VIEW") || false,
      hasPayrollLeaveAccess:
        privileges?.includes("PAYROLL_LEAVE_ENCASHMENT_VIEW") || false,
      hasPayrollOvertimeAccess:
        privileges?.includes("PAYROLL_OVERTIME_VIEW") || false,
      hasPayrollRunAccess: privileges?.includes("PAYROLL_RUN_VIEW") || false,
      hasPayrollTestRunAccess:
        privileges?.includes("PAYROLL_TEST_RUN_VIEW") || false,
      hasPayrollSnapshotAccess:
        privileges?.includes("PAYROLL_SNAPSHOT_VIEW") || false,
      hasPayrollReportAccess: privileges?.includes("PAYROLL_REPORT") || false,
      hasUserAdminAccess: privileges?.includes("SETTINGS_USER_VIEW") || false,
      hasBackupAccess: privileges?.includes("SETTINGS_BACKUP_VIEW") || false,
      hasAuditLogsAccess:
        privileges?.includes("SETTINGS_AUDIT_LOGS_VIEW") || false,
      hasEmployeeFinancialAccess:
        privileges?.includes("HR_EMPLOYEE_FINANCIAL") || false,

      // Main Config Configuration
      hasHsCodesAccess: privileges?.includes("CONFIG_HS_CODES_VIEW") || false,
      hasServiceCodesAccess:
        privileges?.includes("CONFIG_SERVICE_CODES_VIEW") || false,
      hasServiceChargesAccess:
        privileges?.includes("CONFIG_SERVICE_CHARGES_VIEW") || false,
      hasReportTemplatesAccess:
        privileges?.includes("CONFIG_REPORTS_TEMPLATES_VIEW") || false,
      hasEntityRoutingAccess:
        privileges?.includes("CONFIG_ENTITY_ROUTING_VIEW") || false,
      hasRegistrationFeesAccess:
        privileges?.includes("CONFIG_REGISTRATION_FEES_VIEW") || false,
    }),
    [privileges]
  );

  const {
    hasEntitiesAccess,
    hasRankAccess,
    hasBankAccess,
    hasEmployeeAccess,
    hasEmployeeCreateAccess,
    hasEmployeeEditAccess,
    hasEmployeeDeleteAccess,
    hasEmployeeExportAccess,
    hasLeaveAccess,
    hasHRCongfigAccess,
    hasPayrollConfigAccess,
    hasPayrollPmElementsAccess,
    hasPayrollLoanDeductionsAccess,
    hasPayrollLendersAccess,
    hasPayrollTaxAccess,
    hasPayrollTaxReliefAccess,
    hasPayrollStaffTaxReliefAccess,
    hasPayrollSsnitAccess,
    hasPayrollOvertimeConfigAccess,
    hasPayrollAdjustmentsAccess,
    hasPayrollTimesheetAccess,
    hasPayrollLeaveAccess,
    hasPayrollOvertimeAccess,
    hasPayrollRunAccess,
    hasPayrollTestRunAccess,
    hasPayrollSnapshotAccess,
    hasPayrollReportAccess,
    hasUserAdminAccess,
    hasBackupAccess,
    hasAuditLogsAccess,
    hasEmployeeFinancialAccess,
    hasHsCodesAccess,
    hasServiceCodesAccess,
    hasServiceChargesAccess,
    hasReportTemplatesAccess,
    hasEntityRoutingAccess,
    hasRegistrationFeesAccess,
  } = accessChecks;

  // if (isChecking || isCsrfLoading || isMeLoading) {
  //   return <Loader />;
  // }

  if (isCsrfLoading || isMeLoading) {
    return <Loader />;
  }

  // if (!isHealthy) {
  //   return <Maintenance onRetry={() => checkHealth(true)} />;
  // }

  return (
    <>
      <ScrollToTop />
      <NetworkBanner />
      <Routes>
        {/* Redirect to dashboard if user is logged in */}

        <Route
          path="/user/activate-account"
          element={user ? <Navigate to="/" /> : <Activate_account />}
        />
        <Route
          path="/user/verify-otp"
          element={user ? <Navigate to="/" /> : <Verify_otp />}
        />
        <Route
          path="/user/set-password"
          element={user ? <Navigate to="/" /> : <Set_password />}
        />
        <Route
          path="/user/password-reset/request-otp"
          element={user ? <Navigate to="/" /> : <RequestOtpReset />}
        />
        <Route
          path="/user/password-reset/verify-otp-set-password"
          element={user ? <Navigate to="/" /> : <SetNewPassword />}
        />
        <Route path="/public/permits" element={<PublicPermitMap />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/"
          element={user ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="users"
            element={
              <ProtectedRoute hasAccess={hasUserAdminAccess}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="change-log" element={<ChangeLog />} />
          {/* ===============================hr routes ================================*/}

          <Route
            path="entities"
            element={
              <ProtectedRoute hasAccess={hasEntitiesAccess}>
                <Entities />
              </ProtectedRoute>
            }
          />

          <Route
            path="ranks"
            element={
              <ProtectedRoute hasAccess={hasRankAccess}>
                <Ranks />
              </ProtectedRoute>
            }
          />
          <Route
            path="banks"
            element={
              <ProtectedRoute hasAccess={hasBankAccess}>
                <Banks />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches"
            element={
              <ProtectedRoute hasAccess={hasBankAccess}>
                <Branches />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute hasAccess={hasEmployeeAccess}>
                <ListEmployees />
              </ProtectedRoute>
            }
          />

          <Route
            path="employees-on-leave"
            element={
              <ProtectedRoute hasAccess={hasLeaveAccess}>
                <EmployeesOnLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-employee"
            element={
              <ProtectedRoute hasAccess={hasEmployeeCreateAccess}>
                <CreateEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-employee/:id"
            element={
              <ProtectedRoute hasAccess={hasEmployeeEditAccess}>
                <EditEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee-status"
            element={
              <ProtectedRoute hasAccess={hasEmployeeEditAccess}>
                <Status />
              </ProtectedRoute>
            }
          />
          <Route
            path="financial-details"
            element={
              <ProtectedRoute hasAccess={hasEmployeeFinancialAccess}>
                <FinancialDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="hr-config"
            element={
              <ProtectedRoute hasAccess={hasHRCongfigAccess}>
                <HrConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="leaves"
            element={
              <ProtectedRoute hasAccess={hasLeaveAccess}>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="pending-leaves"
            element={
              <ProtectedRoute hasAccess={hasLeaveAccess}>
                <Pending_leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="approved-leaves"
            element={
              <ProtectedRoute hasAccess={hasLeaveAccess}>
                <Approved_leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="rejected-leaves"
            element={
              <ProtectedRoute hasAccess={hasLeaveAccess}>
                <Rejected_leaves />
              </ProtectedRoute>
            }
          />
          {/* ===============================payroll routes ================================*/}
          {/* Payroll routes with access control */}
          <Route
            path="pending-overtime"
            element={
              <ProtectedRoute hasAccess={hasPayrollOvertimeAccess}>
                <Pending_overtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="approved-overtime"
            element={
              <ProtectedRoute hasAccess={hasPayrollOvertimeAccess}>
                <Approved_overtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="rejected-overtime"
            element={
              <ProtectedRoute hasAccess={hasPayrollOvertimeAccess}>
                <Rejected_overtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="batch-overtime"
            element={
              <ProtectedRoute hasAccess={hasPayrollOvertimeAccess}>
                <Batch_overtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="outstanding-leave-pay"
            element={
              <ProtectedRoute hasAccess={hasPayrollLeaveAccess}>
                <OutstandingLeavePay />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendants"
            element={
              <ProtectedRoute hasAccess={hasPayrollTimesheetAccess}>
                <Attendants />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll-run"
            element={
              <ProtectedRoute hasAccess={hasPayrollRunAccess}>
                <Payroll_run />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll-test-run"
            element={
              <ProtectedRoute hasAccess={hasPayrollTestRunAccess}>
                <Payroll_test_run />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll-window"
            element={
              <ProtectedRoute hasAccess={hasPayrollSnapshotAccess}>
                <PayrollSnapshot />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll-adjustments"
            element={
              <ProtectedRoute hasAccess={hasPayrollAdjustmentsAccess}>
                <PayrollAdjustments />
              </ProtectedRoute>
            }
          />
          <Route
            path="payroll-monetary"
            element={
              <ProtectedRoute hasAccess={hasPayrollPmElementsAccess}>
                <PME />
              </ProtectedRoute>
            }
          />
          <Route
            path="loan-deductions"
            element={
              <ProtectedRoute hasAccess={hasPayrollLoanDeductionsAccess}>
                <LoanDeductions />
              </ProtectedRoute>
            }
          />
          <Route
            path="lenders"
            element={
              <ProtectedRoute hasAccess={hasPayrollLendersAccess}>
                <Lenders />
              </ProtectedRoute>
            }
          />
          <Route
            path="email-body"
            element={
              <ProtectedRoute hasAccess={hasPayrollConfigAccess}>
                <PayslipEmailBody />
              </ProtectedRoute>
            }
          />

          <Route
            path="bank-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <BankReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="payslip-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <PaySlipReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="summary-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <SummaryReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="summary-pay-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <SummaryPayReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="tax-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <TaxReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="loan-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <LoanReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="other-deduction-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <OtherDeductionReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="other-earnings-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <AllowanceReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="ssnit-tier1-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <SsnitReport1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="ssnit-tier2-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <SsnitReport2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="ssnit-tier3-report"
            element={
              <ProtectedRoute hasAccess={hasPayrollReportAccess}>
                <SsnitReport3 />
              </ProtectedRoute>
            }
          />

          {/* =============================== Registry routes ================================*/}
          <Route
            path="registry/dashboard"
            element={<RegistryDashboard />}
          />
          <Route
            path="registry/registered-clients"
            element={<RegisteredClients />}
          />
          <Route
            path="registry/permit-registry"
            element={<PermitRegistry />}
          />
          <Route
            path="registry/license-registry"
            element={<LicenseRegistry />}
          />
          <Route
            path="registry/invoice-registry"
            element={<InvoiceRegistry />}
          />
          <Route
            path="registry/revenue-breakdown"
            element={<LineItemRegistry />}
          />

          {/* =============================== Applications routes ================================*/}

          <Route
            path="applications/dashboard"
            element={<ApplicationsDashboard />}
          />
          <Route
            path="applications/permit-applications"
            element={<PermitApplications />}
          />
          <Route
            path="applications/license-applications"
            element={<LicenseApplications />}
          />
          <Route
            path="applications/authorization-applications"
            element={<AuthorizationRequests />}
          />
          <Route
            path="applications/bio-efficacy"
            element={<EfficacyTrials />}
          />

          <Route
            path="backup-restore"
            element={
              <ProtectedRoute hasAccess={hasBackupAccess}>
                <BackupAndRestore />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-migrations"
            element={
              <ProtectedRoute hasAccess={hasBackupAccess}>
                <SystemMigrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="tax"
            element={
              <ProtectedRoute hasAccess={hasPayrollTaxAccess}>
                <TaxConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="tax-relief"
            element={
              <ProtectedRoute hasAccess={hasPayrollTaxReliefAccess}>
                <TaxRelief />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff-tax-relief"
            element={
              <ProtectedRoute hasAccess={hasPayrollStaffTaxReliefAccess}>
                <StaffTaxRelief />
              </ProtectedRoute>
            }
          />
          <Route
            path="overtime-config"
            element={
              <ProtectedRoute hasAccess={hasPayrollOvertimeConfigAccess}>
                <OvertimeConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="ssnit"
            element={
              <ProtectedRoute hasAccess={hasPayrollSsnitAccess}>
                <SsnitConfiguration />
              </ProtectedRoute>
            }
          />

          {/* ===============================Configs ================================*/}
          <Route
            path="/configs/hs-codes"
            element={
              <ProtectedRoute hasAccess={hasHsCodesAccess}>
                <HsCodesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configs/service-codes"
            element={
              <ProtectedRoute hasAccess={hasServiceCodesAccess}>
                <ServiceCodes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configs/service-charges"
            element={
              <ProtectedRoute hasAccess={hasServiceChargesAccess}>
                <ServiceCharges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configs/reports-templates"
            element={
              <ProtectedRoute hasAccess={hasReportTemplatesAccess}>
                <ReportTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configs/entity-routing"
            element={
              <ProtectedRoute hasAccess={hasEntityRoutingAccess}>
                <ApplicationEntityRoutings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configs/registration-fees"
            element={
              <ProtectedRoute hasAccess={hasRegistrationFeesAccess}>
                <RegistrationFees />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute hasAccess={hasAuditLogsAccess}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route path="training-series" element={<AdminTrainingSeriesPage />} />

          {/* =============================== YEL — Invoicing Module ================================*/}
          <Route path="yel/clients" element={<YELClients />} />
          <Route path="yel/quotations" element={<YELQuotations />} />
          <Route path="yel/invoices" element={<YELInvoices />} />
          <Route path="yel/tax-config" element={<YELTaxConfig />} />
          <Route path="yel/bank-accounts" element={<YELBankAccounts />} />

          <Route
            path="*"
            element={<NotFound backLink="/" backLabel="Back to Home" />}
          />
        </Route>

        <Route path="/employee/*" element={<EmployeePortal />} />
        <Route path="/employee-portal/*" element={<EmployeePortal />} />
        <Route
          path="*"
          element={<NotFound backLink="/" backLabel="Back to Home" />}
        />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
