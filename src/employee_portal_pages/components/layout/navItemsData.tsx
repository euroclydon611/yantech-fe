import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { PiFilesFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";

// Data for the main IPMS sections
export const getIPMSNavItems = (employee, isGroupHead = false) => [
  {
    section: "MAIN MENU",
    items: [
      {
        path: "/employee-portal/dashboard",
        label: "Dashboard",
        icon: <DashboardOutlined />,
      },
    ],
  },
  {
    section: "PERMIT MGT",
    sectionKey: "permit-management",
    collapsible: true,
    items: [
      {
        path: "/employee-portal/permit/new-applications",
        label: "Applications",
        icon: <FileTextOutlined />,
        show: true,
      },
      {
        path: "/employee-portal/permit/issued-permits",
        label: "Permit Registry",
        icon: <DatabaseOutlined />,
      },
      {
        path: "/employee-portal/permit/configuration",
        label: "Configuration",
        icon: <SettingOutlined />,
      },
    ],
  },

  {
    section: "ASSIGNMENTS",
    sectionKey: "assignments",
    collapsible: true,
    items: [
      {
        path: "/employee-portal/assignment/assignment-plan",
        label: "Assignment Plan",
        icon: <ProjectOutlined />,
        show: employee?.is_head || ["assignment_plan", "assign_task", "review_completed_task", "reject_applications"].some((p) => employee?.permissions?.includes(p)),
      },
      {
        path: "/employee-portal/group-assignments",
        label: "My Group Dashboard",
        icon: <ApartmentOutlined />,
        show: !!isGroupHead,
      },
      {
        path: "/employee-portal/assignment/my-assignments",
        label: "My Assignments",
        icon: <CheckSquareOutlined />,
        show: true,
      },
    ],
  },

  {
    section: "FINANCE",
    sectionKey: "financial-management",
    collapsible: true,
    items: [
      {
        path: "/employee-portal/finance/invoices",
        label: "Invoices",
        icon: <DollarOutlined />,
        show: employee?.is_head || employee?.permissions?.includes("view_invoices"),
      },
    ],
  },
  {
    section: null, // no section header
    items: [
      {
        path: "/employee-portal/account-transcripts",
        label: "Account Transcripts",
        show: employee?.is_head || employee?.permissions?.includes("account_transcripts"),      },
    ],
  },
  {
    section: null, // no section header
    items: [
      {
        path: "/employee-portal/registered-clients",
        label: "Registered Clients",
        show: employee?.is_head || employee?.permissions?.includes("registered_clients"),
      },
    ],
  },
  {
    section: null, // no section header
    items: [
      {
        path: "/employee-portal/payroll-validation",
        label: "Payroll Validation",
        show: employee?.is_head || employee?.permissions?.includes("payroll_validation"),
      },
    ],
  },
];

// Data for the Employee Portal section
export const getEmployeeNavItems = (employee) => [
  {
    section: "PERSONAL",
    sectionKey: "employee-portal",
    collapsible: true,
    items: [
      {
        path: "/employee-portal/profile",
        label: "My Profile",
        icon: <UserOutlined />,
        show: true,
      },
      {
        path: "/employee-portal/reporting-entities",
        label: "Reporting Entities",
        icon: <ApartmentOutlined />,
        show: employee?.is_head || employee?.permissions?.includes('payroll_validation') || employee?.department?.toLowerCase()?.includes('human resource') || employee?.department?.toLowerCase()?.includes('hr'),
      },
      {
        path: "/employee-portal/team-members",
        label: "Team Members",
        icon: <RiTeamFill />,
        show: true,
      },
      {
        path: "/employee-portal/sub-divisions",
        label: "Sub-divisions",
        icon: <ApartmentOutlined />,
        show: employee?.is_head === true,
      },
      {
        path: "/employee-portal/payslips",
        label: "My Payslips",
        icon: <PiFilesFill />,
        show: true,
      },
      {
        path: "/employee-portal/settings",
        label: "Settings",
        icon: <SettingOutlined />,
        show: true,
      },
    ],
  },
];
