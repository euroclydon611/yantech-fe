import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import AddLoan from "./AddLoan";
import EditLoan from "./EditLoan";
import LoadLoans from "./LoadLoans";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaPause, FaPlay, FaCheck } from "react-icons/fa";
import { Pagination, Table, Tag, Tooltip, Select } from "antd";
import { AiOutlineSearch, AiOutlineCloudUpload } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import {
  useGetEmployeeLoansQuery,
  usePauseEmployeeLoanMutation,
  useResumeEmployeeLoanMutation,
  useCompleteEmployeeLoanMutation,
} from "../../../redux/features/configurations/employeeLoanApi";
import { useGetFullLenderListQuery } from "../../../redux/features/configurations/lenderApi";
import { styles } from "../../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Swal from "sweetalert2";
import { exportData, formatNumber } from "../../../utils/helperFunction";

const LoanDeductions = () => {
  PageTitle("Loan Deductions | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_LOAN_DEDUCTIONS_EDIT");

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lenderFilter, setLenderFilter] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState<string>("");
  const [historyRecordName, setHistoryRecordName] = useState<string>("");

  const { data: lendersData, isLoading: lendersLoading } = useGetFullLenderListQuery({});

  const {
    data: loansData,
    isLoading,
    refetch,
  } = useGetEmployeeLoansQuery(
    {
      page,
      limit,
      searchQuery: searchTerm,
      status: statusFilter,
      lender_id: lenderFilter,
      sortField,
      sortOrder,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [pauseLoan] = usePauseEmployeeLoanMutation();
  const [resumeLoan] = useResumeEmployeeLoanMutation();
  const [completeLoan] = useCompleteEmployeeLoanMutation();

  const handleExport = async () => {
    const route = `/employee-loans/export?searchQuery=${searchTerm}&status=${statusFilter}&lender_id=${lenderFilter || ""}`;
    await exportData(route, "Employee_Loans");
  };

  const handleAction = async (actionFn: any, title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        await actionFn().unwrap();
        Swal.fire("Success", "Action completed successfully", "success");
        refetch();
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  const handleEditPopUp = (loan: any) => {
    setSelectedLoan(loan);
    setEdit(true);
  };

  return (
    <>
      <AddLoan open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditLoan
        open={edit}
        onClose={() => setEdit(false)}
        itemData={selectedLoan}
        refetch={refetch}
      />
      <LoadLoans open={load} onClose={() => setLoad(false)} refetch={refetch} />

      <PageLayout
        title="Loan Deductions"
        subtitle="Manage loan deductions for staff"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Loan Deductions" }]}
      />
      <div className="p-4">

        <div className="bg-white p-4">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span className="max-md:hidden text-gray-700 font-medium">
                Show
              </span>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`${styles.limit_select}`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="max-md:hidden text-gray-700 font-medium">
                entries
              </span>
            </div>

            <div className="flex gap-2 items-center flex-1 max-w-2xl">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${styles.limit_select} h-[38px] min-w-[120px]`}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>

              <Select
                showSearch
                placeholder="Filter by Lender"
                className="h-[38px] flex-1 min-w-[180px]"
                onChange={(value) => setLenderFilter(value)}
                value={lenderFilter}
                allowClear
                loading={lendersLoading}
                optionFilterProp="label"
                options={[
                  ...(lendersData?.data || []).map((lender: any) => ({
                    value: lender._id,
                    label: lender.name,
                  })),
                ]}
              />

              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff ID..."
                  className={`w-full text-[14px] px-[1rem] py-[0.5rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39afd1] focus:border-transparent transition duration-200`}
                />
                <AiOutlineSearch
                  size={18}
                  className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className={`${styles.primary_button} !bg-green-600`}
                onClick={handleExport}
              >
                <AiOutlineCloudUpload size={18} />
                <span className="ml-2 max-md:hidden font-medium">Export</span>
              </button>
              {hasCreateAccess && (
                <>
                  <button
                    className={`${styles.primary_button} !bg-[#39afd1]`}
                    onClick={() => setLoad(true)}
                  >
                    <AiOutlineCloudUpload size={18} />
                    <span className="ml-2 max-md:hidden font-medium">
                      Load Loans
                    </span>
                  </button>
                  <button
                    className={`${styles.primary_button}`}
                    onClick={() => setAdd(true)}
                  >
                    <LiaPlusSquareSolid size={18} />
                    <span className="ml-2 max-md:hidden font-medium">New Loan</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              sticky
              dataSource={loansData?.data || []}
              rowKey="_id"
              loading={isLoading}
              pagination={false}
              size="small"
              scroll={{ x: 1200, y: "65vh" }}
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 50,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                },
                {
                  title: "Staff ID",
                  dataIndex: "staff_id",
                  key: "staff_id",
                  width: 100,
                },
                {
                  title: "Employee",
                  key: "employee",
                  width: 200,
                  render: (_text, record: any) =>
                    record.employee_id
                      ? `${record.employee_id.firstname} ${record.employee_id.lastname}`
                      : "N/A",
                },
                {
                  title: "Lender",
                  key: "lender",
                  width: 150,
                  render: (_text, record: any) =>
                    record.lender_id ? record.lender_id.name : "N/A",
                },
                {
                  title: "Original Amount",
                  dataIndex: "original_amount",
                  key: "original_amount",
                  width: 130,
                  align: "right",
                  render: (val) => formatNumber(val),
                },
                {
                  title: "Monthly",
                  dataIndex: "monthly_deduction",
                  key: "monthly_deduction",
                  width: 100,
                  align: "right",
                  render: (val) => formatNumber(val),
                },
                {
                  title: "Outstanding",
                  dataIndex: "outstanding_balance",
                  key: "outstanding_balance",
                  width: 130,
                  align: "right",
                  render: (val) => formatNumber(val),
                },
                {
                  title: "Start",
                  key: "start",
                  width: 120,
                  render: (_text, record: any) =>
                    `${record.start_month} ${record.start_year}`,
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 100,
                  render: (status) => {
                    const colors: any = {
                      active: "green",
                      paused: "orange",
                      completed: "blue",
                    };
                    return (
                      <Tag color={colors[status]}>{status.toUpperCase()}</Tag>
                    );
                  },
                },
                {
                  title: "Action",
                  key: "action",
                  width: 180,
                  align: "center",
                  hidden: !hasEditAccess,
                  render: (_text, record: any) => (
                    <span className="flex items-center justify-center gap-2">
                      <Tooltip title="Edit">
                        <span
                          className="text-blue-600 cursor-pointer p-1.5 hover:bg-blue-100 rounded"
                          onClick={() => handleEditPopUp(record)}
                        >
                          <FaEdit size={14} />
                        </span>
                      </Tooltip>

                      {record.status === "active" && (
                        <Tooltip title="Pause">
                          <span
                            className="text-orange-600 cursor-pointer p-1.5 hover:bg-orange-100 rounded"
                            onClick={() =>
                              handleAction(
                                () => pauseLoan(record._id),
                                "Pause Loan",
                                "Pause deductions for this loan?"
                              )
                            }
                          >
                            <FaPause size={14} />
                          </span>
                        </Tooltip>
                      )}

                      {record.status === "paused" && (
                        <Tooltip title="Resume">
                          <span
                            className="text-green-600 cursor-pointer p-1.5 hover:bg-green-100 rounded"
                            onClick={() =>
                              handleAction(
                                () => resumeLoan(record._id),
                                "Resume Loan",
                                "Resume deductions for this loan?"
                              )
                            }
                          >
                            <FaPlay size={14} />
                          </span>
                        </Tooltip>
                      )}

                      {record.status !== "completed" && (
                        <Tooltip title="Complete">
                          <span
                            className="text-purple-600 cursor-pointer p-1.5 hover:bg-purple-100 rounded"
                            onClick={() =>
                              handleAction(
                                () => completeLoan(record._id),
                                "Complete Loan",
                                "Mark this loan as fully paid?"
                              )
                            }
                          >
                            <FaCheck size={14} />
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title="History">
                        <span
                          className="text-gray-600 cursor-pointer p-1.5 hover:bg-gray-100 rounded"
                          onClick={() => {
                            setHistoryRecordId(record._id);
                            setHistoryRecordName(record.employee_id ? `${record.employee_id.firstname} ${record.employee_id.lastname} - ${record.lender_id?.name || 'Loan'}` : 'Loan');
                            setHistoryDrawerVisible(true);
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: 14 }} />
                        </span>
                      </Tooltip>
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={loansData?.totalCount || 0}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <RecordHistoryDrawer
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
        recordId={historyRecordId}
        modelName="EmployeeLoan"
        recordName={historyRecordName}
      />
    </>
  );
};

export default LoanDeductions;
