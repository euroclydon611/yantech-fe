import PageLayout from "../components/layout/PageLayout";
import LeaveApproval from "../components/leave/LeaveApproval";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import ApprovedLeaves from "../components/leave/ApprovedLeaves";
import RejectedLeaves from "../components/leave/RejectedLeaves";
import { Clock, CheckCircle2, XCircle, ShieldAlert, AlertCircle } from "lucide-react";

export default function LeaveManagementPage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "pending"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (!employee.is_head) {
    return (
      <PageLayout
        title="Leave Management"
        description="Manage team leave requests"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 bg-red-50 rounded-full mb-4">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 text-center max-w-md px-6">
            You do not have the necessary permissions to access this page. Leave management is only available to Department Heads and authorized personnel.
          </p>
          <div className="mt-8 flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 max-w-md">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Admin Notice</p>
              <p className="text-sm opacity-90">If you believe this is an error, please contact the HR department or your system administrator.</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const items = [
    {
      key: "pending",
      label: (
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending Requests
        </span>
      ),
      children: <LeaveApproval employee={employee} />,
    },
    {
      key: "approved",
      label: (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Approved
        </span>
      ),
      children: <ApprovedLeaves employee={employee} />,
    },
    {
      key: "rejected",
      label: (
        <span className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Rejected
        </span>
      ),
      children: <RejectedLeaves employee={employee} />,
    },
  ];

  return (
    <PageLayout
      title="Leave Management"
      description="Review and manage leave requests from your team"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="custom-management-tabs"
          size="large"
          tabBarStyle={{ 
            padding: '0 24px', 
            marginBottom: 0,
            background: '#f9fafb'
          }}
        />
      </div>
    </PageLayout>
  );
}
