import { useEffect, useState } from "react";
import CustomModal from "../../utils/CustomModal";
import LoadEmployees from "./LoadEmployees";
import BulkUpdateEmployees from "./BulkUpdateEmployees";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { PiExportBold } from "react-icons/pi";
import { FaFile } from "react-icons/fa";
import { Drawer, Modal, Pagination, Table, Tooltip, Typography, Select, Tag, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
const { RangePicker } = DatePicker;
import { AiOutlineSearch } from "react-icons/ai";
const { Option } = Select;
import {
  useEmployeeListQuery,
  useEmployeeDeleteMutation,
} from "../../redux/features/employee/employeeApi";
import { useNavigate } from "react-router-dom";
import { styles } from "../../styles";
import {
  capitalizeFirstLetter,
  exportData,
  formatDate2,
} from "../../utils/helperFunction";
import Swal from "sweetalert2";
import { MdCastForEducation, MdFilterList, MdFilterListOff, MdHistory } from "react-icons/md";
import Qualifications from "./Qualifications";
import RecordHistoryDrawer from "../settings/RecordHistoryDrawer";
import { useStatusFullListQuery } from "../../redux/features/configurations/statusApi";
import { useRankFullListQuery } from "../../redux/features/sections/ranksApi";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import { useBankFullListQuery } from "../../redux/features/bank/bankApi";
import { useBranchListByBankIdQuery } from "../../redux/features/bank/branchApi";
import EditEmployee from "./EditEmployee";
import CreateEmployee from "./CreateEmployee";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const { Text } = Typography;

const ListEmployees = () => {
  PageTitle("Employees List | HR");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEmployeeFinancialAccess = privileges?.includes("HR_EMPLOYEE_FINANCIAL");
  const hasEmployeeCreateAccess = privileges?.includes("HR_EMPLOYEE_CREATE");
  const hasEmployeeEditAccess = privileges?.includes("HR_EMPLOYEE_EDIT");
  const hasEmployeeDeleteAccess = privileges?.includes("HR_EMPLOYEE_DELETE");
  const hasEmployeeExportAccess = privileges?.includes("HR_EMPLOYEE_EXPORT");
  const hasAuditLogsAccess = privileges?.includes("SETTINGS_AUDIT_LOGS_VIEW");
  
  const navigate = useNavigate();
  const [qualification, SetQualification] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState("");
  const [consultant, setConsultant] = useState("");
  const [wageType, setWageType] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [bankId, setBankId] = useState("");
  const [bankBranchId, setBankBranchId] = useState("");
  const [notch, setNotch] = useState("");
  const [gender, setGender] = useState("");
  const [entityId, setEntityId] = useState("");
  const [isAutoNotchUpdate, setIsAutoNotchUpdate] = useState("");
  const [isPayrollEligible, setIsPayrollEligible] = useState("");
  const [entityDesignation, setEntityDesignation] = useState("");
  const [graEmploymentType, setGraEmploymentType] = useState("");
  const [graPosition, setGraPosition] = useState("");
  const [isActivated, setIsActivated] = useState("");
  const [isOnline, setIsOnline] = useState("");
  const [assumptionDateRange, setAssumptionDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [dobDateRange, setDobDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: statusList } = useStatusFullListQuery({});
  const { data: rankList } = useRankFullListQuery({});
  const { data: entityList } = useEntityFullListQuery({ designation: entityDesignation });
  const { data: bankList } = useBankFullListQuery({});
  const { data: branchList } = useBranchListByBankIdQuery({ id: bankId }, { skip: !bankId });

  const [
    deleteEmployee,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useEmployeeDeleteMutation();

  const {
    data: employeeListData,
    isLoading: isEmployeeListLoading,
    refetch,
  } = useEmployeeListQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      status,
      consultant: consultant,
      subcontractor: "",
      wage_type: wageType,
      grade_id: gradeId,
      bank_id: bankId,
      bank_branch_id: bankBranchId,
      notch,
      gender,
      entity_id: entityId,
      is_auto_notch_update: isAutoNotchUpdate,
      is_payroll_eligible: isPayrollEligible,
      gra_employment_type: graEmploymentType,
      gra_position: graPosition,
      isActivated,
      isOnline,
      assumption_date_from: assumptionDateRange[0]?.format("YYYY-MM-DD") || "",
      assumption_date_to: assumptionDateRange[1]?.format("YYYY-MM-DD") || "",
      dob_from: dobDateRange[0]?.format("YYYY-MM-DD") || "",
      dob_to: dobDateRange[1]?.format("YYYY-MM-DD") || "",
    },
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const handleResetFilters = () => {
    setStatus("");
    setConsultant("");
    setWageType("");
    setGradeId("");
    setBankId("");
    setBankBranchId("");
    setNotch("");
    setGender("");
    setEntityId("");
    setIsAutoNotchUpdate("");
    setIsPayrollEligible("");
    setEntityDesignation("");
    setGraEmploymentType("");
    setGraPosition("");
    setIsActivated("");
    setIsOnline("");
    setAssumptionDateRange([null, null]);
    setDobDateRange([null, null]);
  };

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (employee: any) => {
    const result = await Swal.fire({
      title: "Delete Employee",
      text: "Do you want to delete this employee ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteEmployee(employee._id);
      refetch();
    }
  };

  useEffect(() => {
    if (isDeletingSuccess) {
      const message = `${deletedData?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
    }
    if (deletionError) {
      if ("data" in deletionError) {
        const errorData = deletionError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError]);

  //view qualifications
  const handleViewQualification = (employee: any) => {
    SetQualification(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    SetQualification([]);
  };

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    refetch(); // Refetch data with new filters
  };

  // if (isEmployeeListLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      {add && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          Component={LoadEmployees}
          refetch={refetch}
        />
      )}
      {bulkUpdateOpen && (
        <CustomModal
          open={bulkUpdateOpen}
          setOpen={setBulkUpdateOpen}
          Component={BulkUpdateEmployees}
          refetch={refetch}
        />
      )}
      <Modal open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <div className="mt-6">
          <Qualifications
            employee={qualification}
            // data={executivesData}
            // level={level}
            // id={id}
          />
        </div>
      </Modal>
      <Drawer
        title="Edit Employee"
        onClose={() => setEditOpen(false)}
        open={editOpen}
        width={1100}
        destroyOnClose={true}
        maskClosable={false}
      >
        {selectedId && (
          <EditEmployee
            id={selectedId}
            isDrawer={true}
            onClose={() => setEditOpen(false)}
            refetchList={refetch}
          />
        )}
      </Drawer>
      <Drawer
        title="Create Employee"
        onClose={() => setCreateOpen(false)}
        open={createOpen}
        width={1100}
        destroyOnClose={true}
        maskClosable={false}
      >
        <CreateEmployee
          isDrawer={true}
          onClose={() => setCreateOpen(false)}
          refetchList={refetch}
        />
      </Drawer>
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="flex items-center gap-2">
              <MdFilterList className="text-[#39afd1]" /> Advanced Filters
            </span>
            <button 
              onClick={handleResetFilters}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors uppercase"
            >
              Reset All
            </button>
          </div>
        }
        onClose={() => setShowFilters(false)}
        open={showFilters}
        width={window.innerWidth > 768 ? 600 : "100%"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Status</label>
            <Select
              showSearch
              placeholder="All Statuses"
              value={status || undefined}
              onChange={(val) => setStatus(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Statuses</Option>
              {statusList?.data?.map((s: any, i: number) => (
                <Option key={i} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Gender</label>
            <Select
              showSearch
              placeholder="All Genders"
              value={gender || undefined}
              onChange={(val) => setGender(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Genders</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </div>

          {/* Grade/Rank */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Rank (Grade)</label>
            <Select
              showSearch
              placeholder="All Ranks"
              value={gradeId || undefined}
              onChange={(val) => setGradeId(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Ranks</Option>
              {rankList?.data?.map((r: any, i: number) => (
                <Option key={i} value={r._id}>{r.name}</Option>
              ))}
            </Select>
          </div>

          {/* Notch */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Notch</label>
            <Select
              showSearch
              placeholder="All Notches"
              value={notch || undefined}
              onChange={(val) => setNotch(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Notches</Option>
              {Array.from({ length: 15 }, (_, i) => (
                <Option key={i} value={`notch_${i + 1}`}>Notch {i + 1}</Option>
              ))}
            </Select>
          </div>

          {/* Entity Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Entity Category</label>
            <Select
              showSearch
              placeholder="All Categories"
              value={entityDesignation || undefined}
              onChange={(val) => {
                setEntityDesignation(val || "");
                setEntityId("");
              }}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Categories</Option>
              <Option value="ceo office">CEO Office</Option>
              <Option value="division">Division</Option>
              <Option value="department">Department/Directorate</Option>
              <Option value="unit">Unit</Option>
            </Select>
          </div>

          {/* Entity */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Entity</label>
            <Select
              showSearch
              placeholder="Select Entity"
              value={entityId || undefined}
              onChange={(val) => setEntityId(val || "")}
              disabled={!entityDesignation && !entityId}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">Select Entity</Option>
              {entityList?.data?.map((e: any, i: number) => (
                <Option key={i} value={e._id}>{e.name}</Option>
              ))}
            </Select>
          </div>

          {/* Bank */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Bank</label>
            <Select
              showSearch
              placeholder="All Banks"
              value={bankId || undefined}
              onChange={(val) => {
                setBankId(val || "");
                setBankBranchId("");
              }}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Banks</Option>
              {bankList?.data?.map((b: any, i: number) => (
                <Option key={i} value={b._id}>{b.name}</Option>
              ))}
            </Select>
          </div>

          {/* Bank Branch */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Branch</label>
            <Select
              showSearch
              placeholder="Select Branch"
              value={bankBranchId || undefined}
              onChange={(val) => setBankBranchId(val || "")}
              disabled={!bankId}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">Select Branch</Option>
              {branchList?.data?.map((br: any, i: number) => (
                <Option key={i} value={br._id}>{br.name}</Option>
              ))}
            </Select>
          </div>

          {/* Employment Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Employment Type</label>
            <Select
              showSearch
              placeholder="All Types"
              value={graEmploymentType || undefined}
              onChange={(val) => setGraEmploymentType(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
            >
              <Option value="">All Types</Option>
              <Option value="permanent">Permanent</Option>
              <Option value="contract">Contract</Option>
              <Option value="casual">Casual</Option>
            </Select>
          </div>

          {/* Employment Position */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Position</label>
            <input
              type="text"
              value={graPosition}
              onChange={(e) => setGraPosition(e.target.value)}
              placeholder="Filter position..."
              className="w-full text-[13px] border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-[#39afd1] outline-none h-[32px]"
            />
          </div>

          {/* Auto Notch Update */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Auto Notch</label>
            <Select
              placeholder="All"
              value={isAutoNotchUpdate || undefined}
              onChange={(val) => setIsAutoNotchUpdate(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="true">Enabled</Option>
              <Option value="false">Disabled</Option>
            </Select>
          </div>

          {/* Payroll Eligibility */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Payroll Eligible</label>
            <Select
              placeholder="All"
              value={isPayrollEligible || undefined}
              onChange={(val) => setIsPayrollEligible(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          </div>

          {/* Consultant */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Consultant</label>
            <Select
              placeholder="All"
              value={consultant || undefined}
              onChange={(val) => setConsultant(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          </div>

          {/* wage type */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Wage Type</label>
            <Select
              placeholder="All"
              value={wageType || ""}
              onChange={(val) => setWageType(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="established">Established</Option>
              <Option value="clock_in">Clock-In</Option>
              <Option value="none">None</Option>
            </Select>
          </div>

          {/* Activation */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Activation</label>
            <Select
              placeholder="All"
              value={isActivated || undefined}
              onChange={(val) => setIsActivated(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="true">Activated</Option>
              <Option value="false">Pending</Option>
            </Select>
          </div>

          {/* Online Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Online Status</label>
            <Select
              placeholder="All"
              value={isOnline || undefined}
              onChange={(val) => setIsOnline(val || "")}
              className="w-full text-[13px]"
            >
              <Option value="">All</Option>
              <Option value="true">Online</Option>
              <Option value="false">Offline</Option>
            </Select>
          </div>

          {/* Assumption Date Range */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Assumption Date Range</label>
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              value={assumptionDateRange}
              onChange={(dates) => setAssumptionDateRange(dates ? [dates[0], dates[1]] : [null, null])}
              placeholder={["From", "To"]}
            />
          </div>

          {/* Date of Birth Range */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Date of Birth Range</label>
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              value={dobDateRange}
              onChange={(dates) => setDobDateRange(dates ? [dates[0], dates[1]] : [null, null])}
              placeholder={["From", "To"]}
            />
          </div>
          
          <div className="md:col-span-2">
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full bg-[#39afd1] text-white py-2 rounded-md font-medium hover:bg-[#2e8da8] transition-colors mt-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Drawer>
      <PageLayout
        title="Staff Members"
        subtitle="All active employees in the system"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Staff Members" }]}
        actions={
          <>
            {hasEmployeeCreateAccess && (
              <>
                <button className={`${styles.primary_button}`} onClick={() => setCreateOpen(true)}>
                  <LiaPlusSquareSolid size={15} />
                  <span className="ml-1.5 font-medium">New</span>
                </button>
                <button className={`${styles.primary_button}`} onClick={() => setAdd(true)}>
                  <FaFile size={14} />
                  <span className="ml-1.5 font-medium">Load</span>
                </button>
                <button className={`${styles.primary_button}`} onClick={() => setBulkUpdateOpen(true)}>
                  <FaFile size={14} />
                  <span className="ml-1.5 font-medium">Update</span>
                </button>
              </>
            )}
            {hasEmployeeExportAccess && (
              <button className={`${styles.primary_button}`} onClick={() => exportData("employees/export", "Employee_list")}>
                <PiExportBold size={14} />
                <span className="ml-1.5 font-medium">Export</span>
              </button>
            )}
          </>
        }
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-2 justify-between mb-3">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-500">Show</span>
              <select
                name="limit"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`${styles.limit_select}`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-gray-500">entries</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  autoFocus
                  placeholder="Search staff ID, name, email..."
                  className="w-full text-sm px-4 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
                />
                <AiOutlineSearch size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-200 ${
                  showFilters
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-700"
                }`}
              >
                {showFilters ? <MdFilterListOff size={16} /> : <MdFilterList size={16} />}
                {showFilters ? "Hide" : "Filters"}
              </button>
            </div>
          </div>
          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 60,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Staff ID",
                  dataIndex: "staff_id",
                  key: "staff_id",
                  width: 110,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("staff_id"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                // {
                //   title: "Personal File No",
                //   dataIndex: "personal_file_no",
                //   key: "personal_file_no",
                //   width: 130,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                {
                  title: "Last Name",
                  dataIndex: "lastname",
                  key: "lastname",
                  width: 120,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("lastname"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "First Name",
                  dataIndex: "firstname",
                  key: "firstname",
                  width: 120,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("firstname"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Other Name",
                  dataIndex: "other_names",
                  key: "other_names",
                  width: 120,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Date of Birth",
                  dataIndex: "date_of_birth",
                  key: "date_of_birth",
                  width: 130,
                  sorter: true,
                  render: (text) => (text ? formatDate2(text) : ""),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("date_of_birth"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Gender",
                  dataIndex: "gender",
                  key: "gender",
                  width: 90,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("gender"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Qualification",
                  dataIndex: "qualification",
                  key: "qualification",
                  width: 240,
                  render: (qualification: string) => (
                    <Tooltip title={qualification}>
                      <Text className="text-[11px] line-clamp-2">
                        {qualification}
                      </Text>
                    </Tooltip>
                  ),
                },
                {
                  title: "Entity",
                  dataIndex: "entity",
                  key: "entity",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("entity_id"),
                    style: { cursor: "pointer" },
                  }),
                  render: (entity: string) => (
                    <Tooltip title={entity}>
                      <Text className="text-[11px] line-clamp-2">{entity}</Text>
                    </Tooltip>
                  ),
                },
                {
                  title: "Designation",
                  dataIndex: "entity_designation",
                  key: "entity_designation",
                  width: 140,
                  render: (text) => capitalizeFirstLetter(text) || "",
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Rank",
                  dataIndex: "grade",
                  key: "grade",
                  width: 200,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("grade"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Rank Title",
                  dataIndex: "rank_title",
                  key: "rank_title",
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("rank_title"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Notch",
                  dataIndex: "notch",
                  key: "notch",
                  width: 200,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("notch"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Auto Notch Update",
                  dataIndex: "is_auto_notch_update",
                  key: "is_auto_notch_update",
                  width: 150,
                  render: (text) => (text ? "Yes" : "No"),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },

                {
                  title: "Last Promotion Date",
                  dataIndex: "effective_date_of_last_promotion",
                  key: "effective_date_of_last_promotion",
                  width: 200,
                  sorter: true,
                  render: (text) => (text ? formatDate2(text) : ""),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("effective_date_of_last_promotion"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Phone Number 1",
                  dataIndex: "phone_number_1",
                  key: "phone_number_1",
                  width: 140,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("phone_number_1"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Phone Number 2",
                  dataIndex: "phone_number_2",
                  sorter: true,
                  key: "phone_number_2",
                  width: 140,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("phone_number_2"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Qualifications",
                  key: "qualifications",
                  align: "center" as const,
                  width: 120,
                  render: (_text, record: any) => (
                    <div className="relative group">
                      <span
                        className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                        onClick={() => handleViewQualification(record)}
                      >
                        <MdCastForEducation size={14} />
                      </span>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        View
                      </span>
                    </div>
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Office Email",
                  dataIndex: "email",
                  key: "email",
                  width: 200,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("email"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Personal Email",
                  dataIndex: "personal_email",
                  key: "personal_email",
                  width: 170,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("personal_email"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Ghana Card Number",
                  dataIndex: "ghana_card_number",
                  key: "ghana_card_number",
                  width: 170,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("ghana_card_number"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "SSNIT Number",
                  dataIndex: "ssnit_number",
                  key: "ssnit_number",
                  width: 170,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("ssnit_number"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Tier 2 Number",
                  dataIndex: "ssnit_tier2_number",
                  key: "ssnit_tier2_number",
                  width: 170,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Tier 3 Number",
                  dataIndex: "ssnit_tier3_number",
                  key: "ssnit_tier3_number",
                  width: 130,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "TIN",
                  dataIndex: "tin_number",
                  key: "tin_number",
                  width: 170,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("tin_number"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Bank Name",
                  dataIndex: "bank",
                  key: "bank",
                  width: 130,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("bank"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Bank Branch",
                  dataIndex: "bank_branch",
                  key: "bank_branch",
                  width: 130,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Bank Account Number",
                  dataIndex: "bank_account_number",
                  key: "bank_account_number",
                  width: 180,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("bank_account_number"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Bank Account Name",
                  dataIndex: "bank_account_name",
                  key: "bank_account_name",
                  width: 170,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("bank_account_name"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                // {
                //   title: "Marital Status",
                //   dataIndex: "marital_status",
                //   key: "marital_status",
                //   width: 130,
                //   sorter: true,
                //   render: (text) => capitalizeFirstLetter(text) || "",
                //   onHeaderCell: () => ({
                //     onClick: () => handleSort("marital_status"),
                //     style: { cursor: "pointer" },
                //   }),
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
             
                // {
                //   title: "NOK Name",
                //   dataIndex: "nok_name",
                //   key: "nok_name",
                //   width: 130,
                //   sorter: true,
                //   onHeaderCell: () => ({
                //     onClick: () => handleSort("nok_name"),
                //     style: { cursor: "pointer" },
                //   }),
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "NOK Relationship",
                //   dataIndex: "nok_relationship",
                //   key: "nok_relationship",
                //   width: 140,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "NOK Phone",
                //   dataIndex: "nok_phone",
                //   key: "nok_phone",
                //   width: 130,
                //   render: (text, record: any) =>
                //     text || record.nok_phone_number,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "NOK Email",
                //   dataIndex: "nok_email",
                //   key: "nok_email",
                //   width: 140,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "Emergency Contact Name",
                //   dataIndex: "emergency_contact_name",
                //   key: "emergency_contact_name",
                //   width: 200,
                //   sorter: true,
                //   onHeaderCell: () => ({
                //     onClick: () => handleSort("emergency_contact_name"),
                //     style: { cursor: "pointer" },
                //   }),
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "Emergency Contact Phone",
                //   dataIndex: "emergency_contact_number",
                //   key: "emergency_contact_number",
                //   width: 200,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "Emergency Contact Relationship",
                //   dataIndex: "emergency_contact_relationship",
                //   key: "emergency_contact_relationship",
                //   width: 240,
                //   render: (text) => capitalizeFirstLetter(text) || "",
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                {
                  title: "Date Of First Appointment",
                  dataIndex: "hire_start_date",
                  key: "hire_start_date",
                  width: 230,
                  sorter: true,
                  render: (text) => (text ? formatDate2(text) : ""),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("hire_start_date"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Assumption Date",
                  dataIndex: "assumption_date",
                  key: "assumption_date",
                  width: 150,
                  sorter: true,
                  render: (text) => (text ? formatDate2(text) : ""),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("assumption_date"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                // {
                //   title: "GRA Resident",
                //   dataIndex: "gra_resident",
                //   key: "gra_resident",
                //   width: 120,
                //   render: (text) => (text ? "Yes" : "No"),
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                {
                  title: "Employment Type",
                  dataIndex: "gra_employment_type",
                  sorter: true,
                  key: "gra_employment_type",
                  width: 170,
                  render: (text) => capitalizeFirstLetter(text) || "",
                  onHeaderCell: () => ({
                    onClick: () => handleSort("gra_employment_type"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "GRA Position",
                  dataIndex: "gra_position",
                  key: "gra_position",
                  width: 140,
                  render: (text) => capitalizeFirstLetter(text) || "",
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "End Date",
                  dataIndex: "hire_end_date",
                  key: "hire_end_date",
                  width: 130,
                  sorter: true,
                  render: (text) => (text ? formatDate2(text) : ""),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("hire_end_date"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
            
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 110,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("status"),
                    style: { cursor: "pointer" },
                  }),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Wage Type",
                  dataIndex: "wage_type",
                  key: "wage_type",
                  width: 120,
                  render: (text) => capitalizeFirstLetter(text),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                // {
                //   title: "Allowable Leave Days",
                //   dataIndex: "allowable_leave_days",
                //   key: "allowable_leave_days",
                //   width: 170,
                //   align: "center" as const,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                // {
                //   title: "Rem. Leave Days",
                //   dataIndex: "remaining_leave_days",
                //   key: "remaining_leave_days",
                //   width: 140,
                //   align: "center" as const,
                //   onCell: () => ({ style: { fontSize: "11px" } }),
                // },
                {
                  title: "Online Status",
                  key: "isOnline",
                  width: 100,
                  render: (_text, record: any) => (
                    <Tag color={record.isOnline ? "green" : "default"} className="text-[10px]">
                      {record.isOnline ? "Online" : "Offline"}
                    </Tag>
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Activation",
                  key: "isActivated",
                  width: 120,
                  render: (_text, record: any) => (
                    <div className="flex flex-col gap-0.5">
                      <Tag color={record.isActivated ? "blue" : "orange"} className="text-[10px] w-fit">
                        {record.isActivated ? "Activated" : "Pending"}
                      </Tag>
                      {record.activatedAt && (
                        <span className="text-[9px] text-gray-400">
                          {new Date(record.activatedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Last Seen",
                  key: "lastLogout",
                  width: 160,
                  render: (_text, record: any) => record.lastLogout ? new Date(record.lastLogout).toLocaleString() : "Never",
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Action",
                  key: "action",
                  width: 100,
                  align: "center" as const,
                  fixed: "right" as const,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                  render: (_text, record: any) => (
                    <span className="flex items-center justify-center gap-2">
                      {hasEmployeeEditAccess && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                              setSelectedId(record._id);
                              setEditOpen(true);
                            }}
                          >
                            <FaEdit size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Edit
                          </span>
                        </div>
                      )}
                      {hasAuditLogsAccess && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                              setSelectedRecord(record);
                              setHistoryOpen(true);
                            }}
                          >
                            <MdHistory size={16} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            History
                          </span>
                        </div>
                      )}
                      {hasEmployeeDeleteAccess && (
                        <div className="relative group pointer-events-none">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-red-200 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleDeleteButtonClick(record)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Delete
                          </span>
                        </div>
                      )}
                    </span>
                  ),
                },
              ].filter((col: any) => {
                const financialCols = [
                  "ghana_card_number",
                  "ssnit_number",
                  "ssnit_tier2_number",
                  "ssnit_tier3_number",
                  "tin_number",
                  "bank",
                  "bank_branch",
                  "bank_account_number",
                  "bank_account_name",
                ];
                if (financialCols.includes(col.key)) {
                  return hasEmployeeFinancialAccess;
                }
                if (col.key === "action") {
                  return hasEmployeeEditAccess || hasEmployeeDeleteAccess;
                }
                return true;
              }) as any[]}
              dataSource={employeeListData?.data || []}
              rowKey="_id"
              loading={isEmployeeListLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No employees found" }}
              scroll={{ x: 3500, y: "65vh" }}
              rowClassName={(record: any) => {
                if (record.status === "Separated") {
                  return "bg-red-200 hover:bg-red-100";
                }
                return "";
              }}
            />
          </div>
        </div>

        <div className="flex  mt-4 justify-end">
          <Pagination
            current={page}
            pageSize={limit}
            total={employeeListData && employeeListData.totalCount}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      </PageLayout>
      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="Employee"
        recordId={selectedRecord?._id}
        recordName={`${selectedRecord?.firstname} ${selectedRecord?.lastname}`}
      />
      {/* </div> */}
    </>
  );
};

export default ListEmployees;
