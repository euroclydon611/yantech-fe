import { useMemo } from "react";
import { useSelector } from "react-redux";

export const usePrivileges = () => {
  const { privileges } = useSelector((state: any) => state.auth);

  const checks = useMemo(() => {
    return {
      // HR Module
      hasBankAccess:
        privileges?.includes("HR_BANK_VIEW") ||
        privileges?.includes("HR_BANK_CREATE") ||
        privileges?.includes("HR_BANK_EDIT") ||
        privileges?.includes("HR_BANK_DELETE") ||
        privileges?.includes("HR_BRANCH_VIEW") ||
        privileges?.includes("HR_BRANCH_CREATE") ||
        privileges?.includes("HR_BRANCH_EDIT") ||
        privileges?.includes("HR_BRANCH_DELETE"),
      hasRankAccess:
        privileges?.includes("HR_RANK_VIEW") ||
        privileges?.includes("HR_RANK_CREATE") ||
        privileges?.includes("HR_RANK_EDIT") ||
        privileges?.includes("HR_RANK_UPDATE") ||
        privileges?.includes("HR_RANK_DELETE"),
      hasSectionAccess:
        privileges?.includes("HR_SECTION") ||
        privileges?.includes("HR_SECTION_CREATE") ||
        privileges?.includes("HR_SECTION_EDIT") ||
        privileges?.includes("HR_SECTION_DELETE"),
      hasEntitiesAccess:
        privileges?.includes("HR_ENTITIES_VIEW") ||
        privileges?.includes("HR_ENTITIES_CREATE") ||
        privileges?.includes("HR_ENTITIES_EDIT") ||
        privileges?.includes("HR_ENTITIES_DELETE"),
      hasEmployeeViewAccess:
        privileges?.includes("HR_EMPLOYEE_VIEW") ||
        privileges?.includes("HR_EMPLOYEE_CREATE") ||
        privileges?.includes("HR_EMPLOYEE_EDIT") ||
        privileges?.includes("HR_EMPLOYEE_DELETE") ||
        privileges?.includes("HR_EMPLOYEE_FINANCIAL"),
      hasEmployeeCreateAccess: privileges?.includes("HR_EMPLOYEE_CREATE"),
      hasEmployeeEditAccess: privileges?.includes("HR_EMPLOYEE_EDIT"),
      hasEmployeeDeleteAccess: privileges?.includes("HR_EMPLOYEE_DELETE"),
      hasEmployeeFinancialAccess: privileges?.includes("HR_EMPLOYEE_FINANCIAL"),
      hasLeaveViewAccess:
        privileges?.includes("HR_LEAVE_VIEW") ||
        privileges?.includes("HR_LEAVE_CREATE") ||
        privileges?.includes("HR_LEAVE_EDIT") ||
        privileges?.includes("HR_LEAVE_DELETE") ||
        privileges?.includes("HR_LEAVE_CONFIGURATION"),
      hasHRCongfigAccess: privileges?.includes("HR_CONFIGURATION"),
      hasBankViewAccess: privileges?.includes("HR_BANK_VIEW"),
      hasBranchViewAccess: privileges?.includes("HR_BRANCH_VIEW"),

      // Payroll Configuration
      hasPayrollPmElementsViewAccess: privileges?.includes("PAYROLL_PM_ELEMENTS_VIEW"),
      hasPayrollPmElementsCreateAccess: privileges?.includes("PAYROLL_PM_ELEMENTS_CREATE"),
      hasPayrollPmElementsEditAccess: privileges?.includes("PAYROLL_PM_ELEMENTS_EDIT"),
      hasPayrollPmElementsDeleteAccess: privileges?.includes("PAYROLL_PM_ELEMENTS_DELETE"),

      hasPayrollLoanDeductionsViewAccess: privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_VIEW"),
      hasPayrollLoanDeductionsCreateAccess: privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_CREATE"),
      hasPayrollLoanDeductionsEditAccess: privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_EDIT"),
      hasPayrollLoanDeductionsDeleteAccess: privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_DELETE"),

      hasPayrollLendersViewAccess: privileges?.includes("PAYROLL_LENDERS_VIEW"),
      hasPayrollLendersCreateAccess: privileges?.includes("PAYROLL_LENDERS_CREATE"),
      hasPayrollLendersEditAccess: privileges?.includes("PAYROLL_LENDERS_EDIT"),
      hasPayrollLendersDeleteAccess: privileges?.includes("PAYROLL_LENDERS_DELETE"),

      hasPayrollTaxViewAccess: privileges?.includes("PAYROLL_TAX_VIEW"),
      hasPayrollTaxCreateAccess: privileges?.includes("PAYROLL_TAX_CREATE"),
      hasPayrollTaxEditAccess: privileges?.includes("PAYROLL_TAX_EDIT"),
      hasPayrollTaxDeleteAccess: privileges?.includes("PAYROLL_TAX_DELETE"),

      hasPayrollTaxReliefViewAccess: privileges?.includes("PAYROLL_TAX_RELIEF_VIEW"),
      hasPayrollTaxReliefCreateAccess: privileges?.includes("PAYROLL_TAX_RELIEF_CREATE"),
      hasPayrollTaxReliefEditAccess: privileges?.includes("PAYROLL_TAX_RELIEF_EDIT"),
      hasPayrollTaxReliefDeleteAccess: privileges?.includes("PAYROLL_TAX_RELIEF_DELETE"),

      hasPayrollStaffTaxReliefViewAccess: privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_VIEW"),
      hasPayrollStaffTaxReliefCreateAccess: privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_CREATE"),
      hasPayrollStaffTaxReliefEditAccess: privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_EDIT"),
      hasPayrollStaffTaxReliefDeleteAccess: privileges?.includes("PAYROLL_STAFF_TAX_RELIEF_DELETE"),

      hasPayrollSSNITViewAccess: privileges?.includes("PAYROLL_SSNIT_VIEW"),
      hasPayrollSSNITCreateAccess: privileges?.includes("PAYROLL_SSNIT_CREATE"),
      hasPayrollSSNITEditAccess: privileges?.includes("PAYROLL_SSNIT_EDIT"),
      hasPayrollSSNITDeleteAccess: privileges?.includes("PAYROLL_SSNIT_DELETE"),

      hasPayrollOvertimeConfigViewAccess: privileges?.includes("PAYROLL_OVERTIME_CONFIG_VIEW"),
      hasPayrollOvertimeConfigCreateAccess: privileges?.includes("PAYROLL_OVERTIME_CONFIG_CREATE"),
      hasPayrollOvertimeConfigEditAccess: privileges?.includes("PAYROLL_OVERTIME_CONFIG_EDIT"),
      hasPayrollOvertimeConfigDeleteAccess: privileges?.includes("PAYROLL_OVERTIME_CONFIG_DELETE"),

      hasPayrollAdjustmentsViewAccess: privileges?.includes("PAYROLL_ADJUSTMENTS_VIEW"),
      hasPayrollAdjustmentsCreateAccess: privileges?.includes("PAYROLL_ADJUSTMENTS_CREATE"),
      hasPayrollAdjustmentsEditAccess: privileges?.includes("PAYROLL_ADJUSTMENTS_EDIT"),
      hasPayrollAdjustmentsDeleteAccess: privileges?.includes("PAYROLL_ADJUSTMENTS_DELETE"),
      hasPayrollAdjustmentsBulkStoreAccess: privileges?.includes("PAYROLL_ADJUSTMENTS_BULK_STORE"),

      // Payroll Processing
      hasPayrollTimesheetViewAccess: privileges?.includes("PAYROLL_TIMESHEET_VIEW"),
      hasPayrollTimesheetCreateAccess: privileges?.includes("PAYROLL_TIMESHEET_CREATE"),
      hasPayrollTimesheetDeleteAccess: privileges?.includes("PAYROLL_TIMESHEET_DELETE"),

      hasPayrollLeaveViewAccess: privileges?.includes("PAYROLL_LEAVE_ENCASHMENT_VIEW"),
      hasPayrollLeaveCreateAccess: privileges?.includes("PAYROLL_LEAVE_ENCASHMENT_CREATE"),

      hasPayrollOvertimeViewAccess: privileges?.includes("PAYROLL_OVERTIME_VIEW"),
      hasPayrollOvertimeCreateAccess: privileges?.includes("PAYROLL_OVERTIME_CREATE"),
      hasPayrollOvertimeEditAccess: privileges?.includes("PAYROLL_OVERTIME_EDIT"),
      hasPayrollOvertimeDeleteAccess: privileges?.includes("PAYROLL_OVERTIME_DELETE"),
      hasPayrollOvertimeApproveAccess: privileges?.includes("PAYROLL_OVERTIME_APPROVE"),
      hasPayrollOvertimeRejectAccess: privileges?.includes("PAYROLL_OVERTIME_REJECT"),

      hasPayrollRunViewAccess: privileges?.includes("PAYROLL_RUN_VIEW"),
      hasPayrollRunCreateAccess: privileges?.includes("PAYROLL_RUN_CREATE"),
      hasPayrollTestRunViewAccess: privileges?.includes("PAYROLL_TEST_RUN_VIEW"),
      hasPayrollFinalizeAccess: privileges?.includes("PAYROLL_FINALIZE_EXECUTE"),
      hasPayrollReportAccess: privileges?.includes("PAYROLL_REPORT"),

      // Snapshots
      hasPayrollSnapshotViewAccess: privileges?.includes("PAYROLL_SNAPSHOT_VIEW"),
      hasPayrollSnapshotCreateAccess: privileges?.includes("PAYROLL_SNAPSHOT_CREATE"),
      hasPayrollSnapshotEditAccess: privileges?.includes("PAYROLL_SNAPSHOT_EDIT"),
      hasPayrollSnapshotDeleteAccess: privileges?.includes("PAYROLL_SNAPSHOT_DELETE"),
      hasPayrollSnapshotVerifyAccess: privileges?.includes("PAYROLL_SNAPSHOT_VERIFY"),
      hasPayrollSnapshotOpenVerificationAccess: privileges?.includes("PAYROLL_SNAPSHOT_OPEN_VERIFICATION"),
      hasPayrollSnapshotCloseVerificationAccess: privileges?.includes("PAYROLL_SNAPSHOT_CLOSE_VERIFICATION"),
      hasPayrollSnapshotExtendDeadlineAccess: privileges?.includes("PAYROLL_SNAPSHOT_EXTEND_DEADLINE"),

      userAdmin: privileges?.includes("SETTINGS_USER_VIEW"),
      hasBackupAccess: privileges?.includes("SETTINGS_BACKUP_VIEW"),
      hasAuditLogsAccess: privileges?.includes("SETTINGS_AUDIT_LOGS_VIEW"),

      // Main Config Configuration
      hasHsCodesAccess: privileges?.includes("CONFIG_HS_CODES_VIEW"),
      hasHsCodesCreate: privileges?.includes("CONFIG_HS_CODES_CREATE"),
      hasHsCodesEdit: privileges?.includes("CONFIG_HS_CODES_EDIT"),
      hasHsCodesDelete: privileges?.includes("CONFIG_HS_CODES_DELETE"),
      hasHsCodesLoad: privileges?.includes("CONFIG_HS_CODES_LOAD"),

      hasServiceCodesAccess: privileges?.includes("CONFIG_SERVICE_CODES_VIEW"),
      hasServiceCodesCreate: privileges?.includes("CONFIG_SERVICE_CODES_CREATE"),
      hasServiceCodesEdit: privileges?.includes("CONFIG_SERVICE_CODES_EDIT"),
      hasServiceCodesDelete: privileges?.includes("CONFIG_SERVICE_CODES_DELETE"),

      hasServiceChargesAccess: privileges?.includes("CONFIG_SERVICE_CHARGES_VIEW"),
      hasServiceChargesCreate: privileges?.includes("CONFIG_SERVICE_CHARGES_CREATE"),
      hasServiceChargesEdit: privileges?.includes("CONFIG_SERVICE_CHARGES_EDIT"),
      hasServiceChargesDelete: privileges?.includes("CONFIG_SERVICE_CHARGES_DELETE"),

      hasReportTemplatesAccess: privileges?.includes("CONFIG_REPORTS_TEMPLATES_VIEW"),
      hasReportTemplatesCreate: privileges?.includes("CONFIG_REPORTS_TEMPLATES_CREATE"),
      hasReportTemplatesEdit: privileges?.includes("CONFIG_REPORTS_TEMPLATES_EDIT"),
      hasReportTemplatesDelete: privileges?.includes("CONFIG_REPORTS_TEMPLATES_DELETE"),

      hasEntityRoutingAccess: privileges?.includes("CONFIG_ENTITY_ROUTING_VIEW"),
      hasEntityRoutingCreate: privileges?.includes("CONFIG_ENTITY_ROUTING_CREATE"),
      hasEntityRoutingEdit: privileges?.includes("CONFIG_ENTITY_ROUTING_EDIT"),
      hasEntityRoutingDelete: privileges?.includes("CONFIG_ENTITY_ROUTING_DELETE"),

      hasRegistrationFeesAccess: privileges?.includes("CONFIG_REGISTRATION_FEES_VIEW"),
      hasRegistrationFeesUpdate: privileges?.includes("CONFIG_REGISTRATION_FEES_UPDATE"),
      
      // Settings
      hasUserView: privileges?.includes("SETTINGS_USER_VIEW"),
      hasUserCreate: privileges?.includes("SETTINGS_USER_CREATE"),
      hasUserEdit: privileges?.includes("SETTINGS_USER_EDIT"),
      hasUserDelete: privileges?.includes("SETTINGS_USER_DELETE"),
      hasUserEnableDisable: privileges?.includes("SETTINGS_USER_ENABLE_DISABLE"),
      
      hasBackupView: privileges?.includes("SETTINGS_BACKUP_VIEW"),
      hasBackupExport: privileges?.includes("SETTINGS_BACKUP_EXPORT"),
      hasBackupRestore: privileges?.includes("SETTINGS_BACKUP_RESTORE"),
    };
  }, [privileges]);

  const fullChecks = useMemo(() => {
    const hasSectionAccess = checks.hasEntitiesAccess || checks.hasRankAccess;
    const hasBankAccess = checks.hasBankAccess;
    const hasSettingsAccess = checks.userAdmin || checks.hasBackupAccess || checks.hasAuditLogsAccess;

    const hasConfigAccess = 
      checks.hasHsCodesAccess ||
      checks.hasServiceCodesAccess ||
      checks.hasServiceChargesAccess ||
      checks.hasReportTemplatesAccess ||
      checks.hasEntityRoutingAccess ||
      checks.hasRegistrationFeesAccess;

    const hasPayrollProcessingAccess = 
      checks.hasPayrollTimesheetViewAccess ||
      checks.hasPayrollLeaveViewAccess ||
      checks.hasPayrollOvertimeViewAccess ||
      checks.hasPayrollSnapshotViewAccess ||
      checks.hasPayrollRunViewAccess ||
      checks.hasPayrollTestRunViewAccess;

    const hasPayrollConfigAccess = 
      checks.hasPayrollPmElementsViewAccess ||
      checks.hasPayrollLoanDeductionsViewAccess ||
      checks.hasPayrollLendersViewAccess ||
      checks.hasPayrollTaxViewAccess ||
      checks.hasPayrollTaxReliefViewAccess ||
      checks.hasPayrollStaffTaxReliefViewAccess ||
      checks.hasPayrollSSNITViewAccess ||
      checks.hasPayrollOvertimeConfigViewAccess ||
      checks.hasPayrollAdjustmentsViewAccess;

    const hasPayrollAccess = hasPayrollConfigAccess || hasPayrollProcessingAccess || checks.hasPayrollReportAccess;

    const hasHRAccess = hasSectionAccess || hasBankAccess || checks.hasEmployeeViewAccess || checks.hasLeaveViewAccess;

    return {
      ...checks,
      hasSectionAccess,
      hasBankAccess,
      hasSettingsAccess,
      hasConfigAccess,
      hasPayrollProcessingAccess,
      hasPayrollConfigAccess,
      hasPayrollAccess,
      hasHRAccess,
    };
  }, [checks]);

  return fullChecks;
};
