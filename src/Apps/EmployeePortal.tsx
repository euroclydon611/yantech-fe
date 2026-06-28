import { Routes, Route, Navigate } from "react-router-dom";
import EmployeePortalLayout from "../layout/EmployeePortalLayout";
import Login from "../employee_portal_pages/Login";
import Activate_account from "../employee_portal_pages/Activate_account";
import Verify_otp from "../employee_portal_pages/Verify_otp";
import Set_password from "../employee_portal_pages/Set_password";
import { useLoadEmployeeQuery } from "../redux/features/api/employee-portalSlice";
import Loader from "../components/Loader";
import Notifications from "../employee_portal_pages/Notifications";
import EmployeeRequestOtpReset from "../employee_portal_pages/reset_password/EmployeeRequestOtpReset";
import EmployeeSetNewPassword from "../employee_portal_pages/reset_password/EmployeeSetNewPassword";
import ProfilePage from "../employee_portal_pages/pages/profile-page";
import ReportingEntitiesPage from "../employee_portal_pages/pages/reporting-entities-page";
import StaffPage from "../employee_portal_pages/pages/staff-page";
import SubDivisionsPage from "../employee_portal_pages/pages/sub-divisions";
import GroupHeadAssignmentsPage from "@/employee_portal_pages/pages/assignment-plan/group-head-assignments";
//payroll validation
//payroll validation 
import PayrollValidation from "@/employee_portal_pages/pages/payroll-validation/payroll-validation";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LeavePage from "../employee_portal_pages/pages/leave-page";
import LeaveManagementPage from "../employee_portal_pages/pages/leave-management-page";
import SettingsPage from "../employee_portal_pages/pages/settings-page";
import PayslipsPage from "../employee_portal_pages/pages/payslips-page";
import StaffDashboard from "@/employee_portal_pages/pages/dashboard";
import IndustryAndForms from "@/employee_portal_pages/pages/industry-and-form";
import HodAssignmentsPage from "@/employee_portal_pages/pages/assignment-plan/hod-Assignments";
import OfficerTasksPage from "@/employee_portal_pages/pages/assignment-plan/officer-tasks";
import PermitApplications from "@/employee_portal_pages/pages/applications/permit-applications";
import AuthorizationRequests from "@/employee_portal_pages/pages/applications/authorization-requests";

import ProvisionalApprovals from "@/employee_portal_pages/pages/registry/provisional-approvals";
import FullRegistrations from "@/employee_portal_pages/pages/registry/full-registrations";
import WorkingArea from "@/employee_portal_pages/pages/assignment-plan/working-area";
import Movements from "@/employee_portal_pages/pages/shipments-monitoring/movements";
import EfficacyTrialsBf1GapTable from "@/employee_portal_pages/pages/technical-approvals/efficacy-trials-bf1-gap";
import IssuedPermits from "@/employee_portal_pages/pages/registry/issued-permits";
import Invoices from "@/employee_portal_pages/pages/invoices/invoices";
import { SessionTimeout } from "@/employee_portal_pages/components/auth/session-timeout";
import PaymentTransactionsPage from "@/employee_portal_pages/pages/payment-transactioins/account-transcripts";

import LicenseApplications from "@/employee_portal_pages/pages/applications/license-applications";
import MainLicenseConfig from "@/employee_portal_pages/pages/configs/license/main-config";
import PermitFeesConfigs from "@/employee_portal_pages/pages/configs/permit/permit-config";
import IssuedLicenses from "@/employee_portal_pages/pages/registry/issued-licenses";
// registered clients
import RegisteredClients from "@/employee_portal_pages/pages/clients/registered-clients";
import NotificationHub from "@/employee_portal_pages/pages/notification-hub";
import { setCsrfToken } from "@/redux/features/employee-portal-api/authSlice";
import { useGetCsrfTokenQuery } from "@/redux/features/employee-portal-api/authApi";
import { useEffect, ReactNode } from "react";
import { Result, Button as AntButton } from "antd";
import { useNavigate } from "react-router-dom";
import NotFound from "../employee_portal_pages/pages/not-found";
import TrainingSeriesPage from "@/employee_portal_pages/pages/training-series/training-series-page";

const ProtectedRoute = ({
  children,
  employee,
  requiredPermission,
  requireHead = false,
}: {
  children: ReactNode;
  employee: any;
  requiredPermission?: string | string[];
  requireHead?: boolean;
}) => {
  const navigate = useNavigate();

  const hasPermission =
    employee?.is_head ||
    (requiredPermission && (
      Array.isArray(requiredPermission)
        ? requiredPermission.some((p) => employee?.permissions?.includes(p))
        : employee?.permissions?.includes(requiredPermission)
    ));

  const isAuthorized = requireHead ? employee?.is_head : hasPermission;

  if (!isAuthorized) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <AntButton
              type="primary"
              className="!bg-red-600"
              onClick={() => navigate("/employee-portal/dashboard")}
            >
              Back Home
            </AntButton>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

const EmployeePortal = () => {
  const dispatch = useDispatch();
  const { isLoading } = useLoadEmployeeQuery({});
  const { employee, csrfToken } = useSelector(
    (state: RootState) => state.employee_auth
  );
  const { data: csrfData } = useGetCsrfTokenQuery({}, { skip: !!csrfToken });

  useEffect(() => {
    if (csrfData?.csrf_token && !csrfToken) {
      dispatch(setCsrfToken(csrfData.csrf_token));
    }
  }, [csrfData, csrfToken, dispatch]);

  // console.log("csrfData",csrfData)

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {employee && <SessionTimeout />}

      <Routes>
        {/* Auth routes (relative to /employee) */}
        <Route
          index
          element={
            employee ? <Navigate to="/employee-portal/dashboard" /> : <Login />
          }
        />
        <Route
          path="activate-account"
          element={
            employee ? <Navigate to="/employee-portal" /> : <Activate_account />
          }
        />
        <Route
          path="verify-otp"
          element={
            employee ? <Navigate to="/employee-portal" /> : <Verify_otp />
          }
        />
        <Route
          path="set-password"
          element={
            employee ? <Navigate to="/employee-portal" /> : <Set_password />
          }
        />

        <Route
          path="password-reset/request-otp"
          element={
            employee ? (
              <Navigate to="/employee-portal" />
            ) : (
              <EmployeeRequestOtpReset />
            )
          }
        />
        <Route
          path="password-reset/verify-otp-set-password"
          element={
            employee ? (
              <Navigate to="/employee-portal" />
            ) : (
              <EmployeeSetNewPassword />
            )
          }
        />

        {/* Layout routes (relative to /employee-portal) */}
        <Route
          path="/"
          element={
            employee ? <EmployeePortalLayout /> : <Navigate to="/employee" />
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="my-industry-and-forms" element={<IndustryAndForms />} />
          {/* permits */}
          <Route
            path="permit/new-applications"
            element={<PermitApplications />}
          />
          <Route
            path="permit/authorization-requests"
            element={<AuthorizationRequests />}
          />
          <Route path="permit/issued-permits" element={<IssuedPermits />} />
          <Route path="permit/configuration" element={<PermitFeesConfigs />} />
          {/* licenses */}
          <Route
            path="license/new-applications"
            element={<LicenseApplications />}
          />

          <Route path="license/issued-licenses" element={<IssuedLicenses />} />
          <Route path="license/configuration" element={<MainLicenseConfig />} />

          {/* assignment plan */}
          {/* <Route
            path="permit/hod-assignments"
            element={<HodAssignmentsPage />}
          />
          <Route path="permit/my-assignments" element={<OfficerTasksPage />} />
          <Route
            path="permit/my-assignments/review/:applicationId"
            element={<WorkingArea />}
          /> */}

          {/* Assignment */}
          <Route
            path="assignment/assignment-plan"
            element={
              <ProtectedRoute
                employee={employee}
                requiredPermission={["assignment_plan", "assign_task", "review_completed_task", "reject_applications"]}
              >
                <HodAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignment/my-assignments"
            element={<OfficerTasksPage />}
          />
          <Route
            path="assignment/my-assignments/workspace/:applicationId"
            element={<WorkingArea />}
          />

          {/* authorizations */}
          <Route
            path="authorizations/provisional-approvals"
            element={<ProvisionalApprovals />}
          />
          <Route
            path="authorizations/full-registrations"
            element={<FullRegistrations />}
          />

          {/* finance */}
          <Route
            path="finance/invoices"
            element={
              <ProtectedRoute
                employee={employee}
                requiredPermission="view_invoices"
              >
                <Invoices />
              </ProtectedRoute>
            }
          />

          <Route
            path="account-transcripts"
            element={
              <ProtectedRoute
                employee={employee}
                requireHead={true}
                requiredPermission="account_transcripts"
              >
                <PaymentTransactionsPage />
              </ProtectedRoute>
            }
          />

          {/* movements */}
          <Route path="shipment-monitoring/movements" element={<Movements />} />

          {/* movements */}
          <Route
            path="technical-approval/bio-efficacy-trials"
            element={<EfficacyTrialsBf1GapTable />}
          />

          {/* registered clients */}
          <Route
            path="registered-clients"
            element={
              <ProtectedRoute
                employee={employee}
                requireHead={true}
                requiredPermission="registered_clients"
              >
                <RegisteredClients />
              </ProtectedRoute>
            }
          />

          {/* notification hub */}
          <Route path="notification-hub" element={<NotificationHub />} />

          {/* payroll validation */}
          <Route
            path="payroll-validation"
            element={
              <ProtectedRoute
                employee={employee}
                requireHead={true}
                requiredPermission="payroll_validation"
              >
                <PayrollValidation />
              </ProtectedRoute>
            }
          />

          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reporting-entities" element={<ReportingEntitiesPage />} />
          <Route path="team-members" element={<StaffPage />} />
          <Route path="sub-divisions" element={<SubDivisionsPage />} />
          <Route path="group-assignments" element={<GroupHeadAssignmentsPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route
            path="leave-management"
            element={
              <ProtectedRoute employee={employee} requireHead={true}>
                <LeaveManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="payslips" element={<PayslipsPage />} />
          <Route path="training-series" element={<TrainingSeriesPage />} />
          <Route
            path="*"
            element={
              <NotFound
                backLink="/employee-portal"
                backLabel="Back to Dashboard"
              />
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <NotFound
              backLink="/employee-portal"
              backLabel="Back to Dashboard"
            />
          }
        />
      </Routes>
    </>
  );
};

export default EmployeePortal;
