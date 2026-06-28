import { Layout, ConfigProvider } from "antd";
import { Menu } from "antd";
const { Sider } = Layout;
import { FaSyncAlt, FaUserFriends } from "react-icons/fa";
import {
  Database,
  Settings,
  Receipt,
  LayoutDashboard,
  FileCheck,
  FileText,
} from "lucide-react";
import { IoMdSettings, IoMdHome } from "react-icons/io";
import { GiHumanTarget } from "react-icons/gi";
import { FaLandmarkFlag, FaMoneyBillTransfer } from "react-icons/fa6";
import { DollarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { GrServices } from "react-icons/gr";
import { TbRouteAltLeft, TbSettingsBolt } from "react-icons/tb";
import { IoDocumentTextSharp } from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";
import { usePrivileges } from "../hooks/usePrivileges";

const Sidebar = ({ sidebarOpen, setSidebarOpen }: any) => {
  const privilegeChecks = usePrivileges();

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const savedKeys = localStorage.getItem("sidebarOpenKeys");
    return savedKeys ? JSON.parse(savedKeys) : [];
  });

  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    const savedKey = localStorage.getItem("sidebarSelectedKey");
    return savedKey ? [savedKey] : [];
  });

  const handleOpenChange = useCallback(
    (keys: string[]) => {
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
      if (latestOpenKey) {
        const newKeys = [
          ...keys.filter((key) => key !== latestOpenKey),
          latestOpenKey,
        ];
        setOpenKeys(newKeys);
        localStorage.setItem("sidebarOpenKeys", JSON.stringify(newKeys));
      } else {
        setOpenKeys(keys);
        localStorage.setItem("sidebarOpenKeys", JSON.stringify(keys));
      }
    },
    [openKeys]
  );

  const handleSelect = useCallback((info: any) => {
    setSelectedKeys([info.key]);
    localStorage.setItem("sidebarSelectedKey", info.key);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarOpen]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F5A623",
        },
        components: {
          Menu: {
            itemBg: "#0A1628",
            itemColor: "rgba(255,255,255,0.72)",
            itemHoverColor: "#ffffff",
            itemHoverBg: "rgba(245,166,35,0.10)",
            itemSelectedBg: "rgba(245,166,35,0.18)",
            itemSelectedColor: "#F5A623",
            subMenuItemBg: "#060f1e",
            popupBg: "#0A1628",
            itemPaddingInline: 10,
            itemMarginInline: 2,
            itemBorderRadius: 4,
            fontSize: 10,
            itemHeight: 30,
            ...({ indentSize: 14 } as any),
          },
        },
      }}
    >
    <Layout
      className={`fixed top-12 left-0 bottom-0 z-50 transition-all duration-300 ${
        sidebarOpen ? "w-44" : "w-12"
      }`}
      style={{ borderRight: "1px solid rgba(245,166,35,0.15)" }}
    >
      <Sider
        theme="dark"
        width={176}
        collapsedWidth={48}
        collapsed={!sidebarOpen}
        trigger={null}
        className="custom-sider transition-all duration-300"
        style={{
          position: "fixed",
          height: "calc(100vh - 48px)",
          overflowY: "auto",
          overflowX: "hidden",
          background: "#0A1628",
        }}
      >
        <Menu
          mode="inline"
          className="sidebar flex flex-col mt-2"
          style={{ background: "#0A1628" }}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          items={[
            // Dashboard
            {
              key: "dashboard",
              icon: <IoMdHome size={14} />,
              label: <Link to="/">Dashboard</Link>,
              className: "",
            },

            // HR MGT
            {
              key: "hr",
              icon: <GiHumanTarget size={14} />,
              label: "HR MGT",
              children: [
                // Sections
                {
                  key: "sections",
                  icon: <FaLandmarkFlag size={14} />,
                  label: "Sections",
                  children: [
                    privilegeChecks.hasEntitiesAccess && {
                      key: "entities",
                      label: <Link to="/entities">Entities</Link>,
                      className: "!text-white",
                    },

                    privilegeChecks.hasRankAccess && {
                      key: "ranks",
                      label: <Link to="/ranks">Ranks</Link>,
                      className: "!text-white",
                    },
                  ].filter(Boolean) as any[],
                  className: privilegeChecks.hasSectionAccess ? "" : "!hidden",
                },

                // Banks
                {
                  key: "banks",
                  icon: <AiFillBank size={14} />,
                  label: "Banks",
                  children: [
                    {
                      key: "bank-list",
                      label: <Link to="/banks">Bank List</Link>,
                    },
                    {
                      key: "branches",
                      label: <Link to="/branches">Bank Branches</Link>,
                    },
                  ].filter(Boolean) as any[],
                  className: privilegeChecks.hasBankAccess ? "" : "!hidden",
                },

                // Employees
                {
                  key: "employees",
                  icon: <FaUserFriends size={14} />,
                  label: "Employees",
                  children: [
                    privilegeChecks.hasEmployeeCreateAccess && {
                      key: "create",
                      label: <Link to="/create-employee">Create</Link>,
                      className: "!text-white",
                    },
                    {
                      key: "employee-list",
                      label: <Link to="/employees">List</Link>,
                      className: "!text-white",
                    },
                    privilegeChecks.hasEmployeeFinancialAccess && {
                      key: "financial-details",
                      label: (
                        <Link to="/financial-details" title="Financial Details">
                          Financial Details
                        </Link>
                      ),
                    },
                  ].filter(Boolean) as any[],
                  className: privilegeChecks.hasEmployeeViewAccess
                    ? ""
                    : "!hidden",
                },

                // Leave Configuration
                privilegeChecks.hasHRCongfigAccess && {
                  key: "hr-config",
                  icon: <TbSettingsBolt size={14} />,
                  label: <Link to="/hr-config">Configuration</Link>,
                  className: "!text-white",
                },
              ],

              className: privilegeChecks.hasHRAccess ? "" : "hidden",
            },

            // Payroll
            {
              key: "payroll",
              icon: <FaMoneyBillTransfer size={14} />,
              label: "PAYROLL",
              children: [
                // Configuration
                {
                  key: "configurations",
                  icon: <TbSettingsBolt size={14} />,
                  label: "Configs",
                  children: [
                    privilegeChecks.hasPayrollAdjustmentsViewAccess && {
                      key: "payroll-adjustments",
                      label: (
                        <Link
                          to="/payroll-adjustments"
                          title="Salary Adjustments"
                        >
                          Salary Adjustments
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollPmElementsViewAccess && {
                      key: "pm-elements",
                      label: (
                        <Link to="/payroll-monetary" title="PM Elements">
                          PM Elements
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollLoanDeductionsViewAccess && {
                      key: "loan-deductions",
                      label: (
                        <Link to="/loan-deductions" title="Loan Deductions">
                          Loan Deductions
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollLendersViewAccess && {
                      key: "lenders",
                      label: (
                        <Link to="/lenders" title="Lenders">
                          Lenders
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollTaxViewAccess && {
                      key: "tax",
                      label: (
                        <Link to="/tax" title="Tax">
                          Tax
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollTaxReliefViewAccess && {
                      key: "tax-relief",
                      label: (
                        <Link to="/tax-relief" title="Tax Relief">
                          Tax Relief
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollStaffTaxReliefViewAccess && {
                      key: "staff-tax-relief",
                      label: (
                        <Link to="/staff-tax-relief" title="Staff Tax Relief">
                          Staff Tax Relief
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollSSNITViewAccess && {
                      key: "SSNIT/Other",
                      label: (
                        <Link to="/ssnit" title="SSNIT/Other">
                          SSNIT/Other
                        </Link>
                      ),
                    },
                    privilegeChecks.hasPayrollOvertimeConfigViewAccess && {
                      key: "overtime-config",
                      label: (
                        <Link to="/overtime-config" title="Overtime">
                          Overtime
                        </Link>
                      ),
                    },
                  ].filter(Boolean) as any[],
                  className: privilegeChecks.hasPayrollConfigAccess
                    ? ""
                    : "hidden",
                },

                // Payroll Processing
                {
                  key: "payroll-processing",
                  icon: <FaSyncAlt size={14} />,
                  label: "Processing",
                  children: [
                    privilegeChecks.hasPayrollTimesheetViewAccess && {
                      key: "attendants",
                      label: <Link to="/attendants">Attendance</Link>,
                    },
                    privilegeChecks.hasPayrollLeaveViewAccess && {
                      key: "outstanding-leave-pay",
                      label: (
                        <Link to="/outstanding-leave-pay">
                          Leave Encashment{" "}
                        </Link>
                      ),
                    },

                    privilegeChecks.hasPayrollOvertimeViewAccess && {
                      key: "overtime",
                      label: <Link to="/pending-overtime">Overtime Mgt</Link>,
                    },

                    privilegeChecks.hasPayrollSnapshotViewAccess && {
                      key: "payroll-snapshot",
                      label: <Link to="/payroll-window">Payroll Window</Link>,
                    },

                    privilegeChecks.hasPayrollRunViewAccess && {
                      key: "payroll-run",
                      label: <Link to="/payroll-run">Payroll Run</Link>,
                    },
                    privilegeChecks.hasPayrollTestRunViewAccess && {
                      key: "payroll-test-run",
                      label: (
                        <Link to="/payroll-test-run">Payroll Test Run</Link>
                      ),
                    },
                  ].filter(Boolean) as any[],
                  className: privilegeChecks.hasPayrollProcessingAccess
                    ? ""
                    : "hidden",
                },

                // Payroll Reports
                {
                  key: "reports",
                  icon: <IoDocumentTextSharp size={14} />,
                  label: "Reports",
                  children: [
                    {
                      key: "summary-pay-report",
                      label: <Link to="/summary-pay-report">Summary Pay</Link>,
                    },
                    {
                      key: "bank-report",
                      label: <Link to="/bank-report">Bank Report</Link>,
                    },
                    {
                      key: "tax-report",
                      label: <Link to="/tax-report">Tax Report</Link>,
                    },
                    {
                      key: "loan-report",
                      label: <Link to="/loan-report">Loan Report</Link>,
                    },
                    {
                      key: "other-deduction-report",
                      label: (
                        <Link to="/other-deduction-report">
                          Other Deductions
                        </Link>
                      ),
                    },
                    {
                      key: "other-earnings-report",
                      label: (
                        <Link to="/other-earnings-report">Other Earnings</Link>
                      ),
                    },
                    {
                      key: "payslip-report",
                      label: <Link to="/payslip-report">Payslip Report</Link>,
                    },
                    // {
                    //   key: "summary-report",
                    //   label: (
                    //     <Link to="/summary-report" title="Summary Report">
                    //       Summary Report
                    //     </Link>
                    //   ),
                    // },
                    // SSNIT Reports
                    {
                      key: "ssnit-report-tier1",
                      label: <Link to="/ssnit-tier1-report">Tier 1</Link>,
                    },
                    {
                      key: "ssnit-report-tier2",
                      label: <Link to="/ssnit-tier2-report">Tier 2</Link>,
                    },
                    {
                      key: "ssnit-report-tier3",
                      label: <Link to="/ssnit-tier3-report">Tier 3</Link>,
                    },
                  ],
                  className: privilegeChecks.hasPayrollReportAccess
                    ? ""
                    : "hidden",
                },
              ],
              className: privilegeChecks.hasPayrollAccess ? "" : "hidden",
            },

            // YEL — Invoicing Module
            {
              key: "yel",
              icon: <FileText size={14} />,
              label: "INVOICING",
              children: [
                {
                  key: "yel-clients",
                  icon: <FaUserFriends size={13} />,
                  label: <Link to="/yel/clients">Clients</Link>,
                  className: "!text-white",
                },
                {
                  key: "yel-quotations",
                  icon: <FileCheck size={13} />,
                  label: <Link to="/yel/quotations">Quotations</Link>,
                  className: "!text-white",
                },
                {
                  key: "yel-invoices",
                  icon: <Receipt size={13} />,
                  label: <Link to="/yel/invoices">Invoices & Receipts</Link>,
                  className: "!text-white",
                },
                {
                  key: "yel-tax-config",
                  icon: <TbSettingsBolt size={13} />,
                  label: <Link to="/yel/tax-config">Tax Configuration</Link>,
                  className: "!text-white",
                },
                {
                  key: "yel-bank-accounts",
                  icon: <AiFillBank size={13} />,
                  label: <Link to="/yel/bank-accounts">Bank Accounts</Link>,
                  className: "!text-white",
                },
              ],
            },

            // REGISTRY
            {
              key: "registry",
              icon: <Database size={14} />,
              label: "REGISTRY",
              className: "!hidden",
              children: [
                {
                  key: "registry_dashboard",
                  icon: <LayoutDashboard size={14} />,
                  label: (
                    <Link to="/registry/dashboard">Registry Dashboard</Link>
                  ),
                  className: "!text-white",
                },
                {
                  key: "invoice_registry",
                  icon: <Receipt size={14} />,
                  label: (
                    <Link to="/registry/invoice-registry">
                      Invoice Registry
                    </Link>
                  ),
                  className: "!text-white",
                },
                {
                  key: "revenue_breakdown",
                  icon: <DollarOutlined style={{ fontSize: 14 }} />,
                  label: (
                    <Link to="/registry/revenue-breakdown">
                      Revenue Breakdown
                    </Link>
                  ),
                  className: "!text-white",
                },
                {
                  key: "registered_clients",
                  icon: <FaUserFriends size={14} />,
                  label: (
                    <Link to="/registry/registered-clients">
                      Registered Clients
                    </Link>
                  ),
                  className: "!text-white",
                },

              ],
            },

            // CONFIGURATION MODEL
            {
              key: "configuration",
              icon: <Settings size={14} />,
              label: "CONFIGS",
              className: `!hidden ${
                privilegeChecks.hasConfigAccess ? "" : "hidden"
              }`,
              children: [
                privilegeChecks.hasServiceCodesAccess && {
                  key: "service_codes",
                  icon: <GrServices size={14} />,
                  label: <Link to="/configs/service-codes">Service Codes</Link>,
                  className: "",
                },
                privilegeChecks.hasServiceChargesAccess && {
                  key: "service_charges",
                  icon: <FileCheck size={14} />,
                  label: (
                    <Link to="/configs/service-charges">Service Charges</Link>
                  ),
                  className: "",
                },
                privilegeChecks.hasEntityRoutingAccess && {
                  key: "application_routing",
                  icon: <TbRouteAltLeft size={14} />,
                  label: (
                    <Link to="/configs/entity-routing">
                      Application Routing
                    </Link>
                  ),
                  className: "",
                },
                privilegeChecks.hasRegistrationFeesAccess && {
                  key: "registration_fees",
                  icon: <DollarOutlined size={14} />,
                  label: (
                    <Link to="/configs/registration-fees">
                      Registration Fees
                    </Link>
                  ),
                  className: "",
                },
              ].filter(Boolean) as any[],
            },

            // Settings
            {
              key: "settings",
              icon: <IoMdSettings size={14} />,
              label: "SETTINGS",
              children: [
                privilegeChecks.userAdmin && {
                  key: "users",
                  label: <Link to="/users">Users</Link>,
                  className: "!text-white",
                },
                privilegeChecks.hasBackupAccess && {
                  key: "backup",
                  label: <Link to="/backup-restore">Backup & Restore</Link>,
                  className: "!text-white",
                },
                privilegeChecks.hasAuditLogsAccess && {
                  key: "audit_logs",
                  label: <Link to="/audit-logs">Audit Logs</Link>,
                  className: "!text-white",
                },
                privilegeChecks.hasBackupAccess && {
                  key: "system_migrations",
                  label: <Link to="/system-migrations">System Migrations</Link>,
                  className: "!text-white",
                },
              ],
              className: privilegeChecks.hasSettingsAccess ? "" : "hidden",
            },

            // Training Series
            {
              key: "training-series",
              icon: <span style={{ fontSize: 14, color: "#F5A623" }}>▶</span>,
              label: (
                <Link to="/training-series" className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "#F5A623" }}>Training Series</span>
                </Link>
              ),
              className: "",
            },

            // Logs
            /*  {
              key: "logs",
              icon: <TbHistory size={14} />,
              label: "Logs",
              className: "",
            }, */
          ]}
        />
      </Sider>
    </Layout>
    </ConfigProvider>
  );
};

export default Sidebar;
