import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Table,
  Pagination,
  Button,
  Space,
  Select,
  InputNumber,
  Tag,
  Input,
  Statistic,
  Alert,
  Tooltip,
  Drawer,
} from "antd";
const { Countdown } = Statistic;
const { Option } = Select;
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  UndoOutlined,
  LockOutlined,
  SearchOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  SyncOutlined,
  ReloadOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import Swal from "sweetalert2";
import { showError, showSuccess } from "@/lib/alert";
import {
  useCreatePayrollSnapshotMutation,
  useCreatePayrollSnapshotForAllMutation,
  useRefreshPayrollSnapshotMutation,
  useBulkRefreshPayrollSnapshotsMutation,
  useListPayrollSnapshotsQuery,
  useDeletePayrollSnapshotMutation,
  useDeletePayrollSnapshotsByMonthMutation,
  useUpdatePayrollSnapshotStatusMutation,
  useUpdateEmployeeVerificationStatusMutation,
  useBulkUpdateEmployeeVerificationStatusMutation,
  useGetSnapshotVerificationSummaryQuery,
  useOpenVerificationForSnapshotsMutation,
  useCloseVerificationForSnapshotsMutation,
  useExtendVerificationDeadlineMutation,
  useReopenVerificationForSnapshotsMutation,
  useExportPayrollSnapshotsMutation,
} from "../../redux/features/reports/payrollSnapshotApi";
import { useEmployeeListQuery } from "../../redux/features/employee/employeeApi";
import moment from "moment";
import { styles } from "@/styles";
import {
  capitalizeFirstLetter,
  formatDate4,
  normalizeText,
} from "@/utils/helperFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import VerificationSummaryDrawer from "./snapshot-components/VerificationSummaryDrawer";
import ManageVerificationStatusDrawer from "./snapshot-components/ManageVerificationStatusDrawer";
import VerifyEmployeeSnapshotDrawer from "./snapshot-components/VerifyEmployeeSnapshotDrawer";
import PayrollSnapshotDetailsDrawer from "./snapshot-components/PayrollSnapshotDetailsDrawer";
import CreatePayrollSnapshotDrawer from "./snapshot-components/CreatePayrollSnapshotDrawer";
import RefreshPayrollSnapshotDrawer from "./snapshot-components/RefreshPayrollSnapshotDrawer";
import BulkVerifyDrawer from "./snapshot-components/BulkVerifyDrawer";
import Loader from "@/components/Loader";
import { useStatusFullListQuery } from "@/redux/features/configurations/statusApi";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useRankFullListQuery } from "@/redux/features/sections/ranksApi";



// Validation Schema matching Payroll_run.tsx rules
const getSnapshotValidationSchema = (year: number) =>
  Yup.object().shape({
    payMonth: Yup.string().required("Pay month is required"),
    payrollStartDate: Yup.date()
      .nullable()
      .typeError("Invalid date format")
      .test(
        "valid-start-date",
        "Start date can only be from the previous month of the payroll period",
        function (value) {
          const { payMonth } = this.parent;
          if (!payMonth || !value) return true;
          const payrollMonth = moment(
            `${payMonth.toLowerCase()} ${year}`,
            "MMMM YYYY"
          );
          const previousMonth = payrollMonth.clone().subtract(1, "months");
          return (
            value >= previousMonth.startOf("month").toDate() &&
            value <= previousMonth.endOf("month").toDate()
          );
        }
      ),
    payrollEndDate: Yup.date()
      .typeError("Invalid date format")
      .test(
        "valid-end-date",
        "End date can only be within the payroll month",
        function (value) {
          const { payMonth } = this.parent;
          if (!payMonth || !value) return true;
          const payrollMonth = moment(
            `${payMonth.toLowerCase()} ${year}`,
            "MMMM YYYY"
          );
          return (
            value >= payrollMonth.startOf("month").toDate() &&
            value <= payrollMonth.endOf("month").toDate()
          );
        }
      )
      .test(
        "end-after-start",
        "End date cannot be earlier than the start date",
        function (value) {
          const { payrollStartDate } = this.parent;
          return !payrollStartDate || !value || value >= payrollStartDate;
        }
      ),
  });

const PayrollSnapshot = () => {
  PageTitle("Payroll Window | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasViewAccess = privileges?.includes("PAYROLL_SNAPSHOT_VIEW");
  const hasCreateAccess = privileges?.includes("PAYROLL_SNAPSHOT_CREATE");
  const hasDeleteAccess = privileges?.includes("PAYROLL_SNAPSHOT_DELETE");
  const hasVerifyAccess = privileges?.includes("PAYROLL_SNAPSHOT_VERIFY");
  const hasOpenVerificationAccess = privileges?.includes("PAYROLL_SNAPSHOT_OPEN_VERIFICATION");
  const hasCloseVerificationAccess = privileges?.includes("PAYROLL_SNAPSHOT_CLOSE_VERIFICATION");
  const hasExtendDeadlineAccess = privileges?.includes("PAYROLL_SNAPSHOT_EXTEND_DEADLINE");
  const hasReopenVerificationAccess = privileges?.includes("PAYROLL_SNAPSHOT_REOPEN_VERIFICATION");

  if (!hasViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const currentMonth = moment().format("MMMM").toLowerCase();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [payMonth, setPayMonth] = useState<string>(currentMonth);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [verificationStatusFilter, setVerificationStatusFilter] =
    useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [payrollStartDate, setPayrollStartDate] = useState<any>(null);
  const [payrollEndDate, setPayrollEndDate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<any>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationRecord, setVerificationRecord] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [verificationNotes, setVerificationNotes] = useState<string>("");
  const [showVerificationSummaryDrawer, setShowVerificationSummaryDrawer] =
    useState(false);
  const [showVerificationStatusModal, setShowVerificationStatusModal] =
    useState(false);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [additionalDays, setAdditionalDays] = useState(3);
  const [notifyManagementHead, setNotifyManagementHead] = useState(true);
  const [autoClose, setAutoClose] = useState(false);
  const [verificationDeadline, setVerificationDeadline] = useState<Date | null>(
    null
  );
  const [countdownKey, setCountdownKey] = useState(0);
  const [snapshotStatus, setSnapshotStatus] = useState<string>("pending");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [bulkVerificationStatus, setBulkVerificationStatus] = useState<string>("");
  const [bulkVerificationNotes, setBulkVerificationNotes] = useState<string>("");
  const [showBulkVerificationDrawer, setShowBulkVerificationDrawer] =
    useState(false);
  const [showRefreshDrawer, setShowRefreshDrawer] = useState(false);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [employeeStatus, setEmployeeStatus] = useState("");
  const [gender, setGender] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [notch, setNotch] = useState("");
  const [entityId, setEntityId] = useState("");
  const [entityDesignation, setEntityDesignation] = useState("");
  const [graEmploymentType, setGraEmploymentType] = useState("");
  const [staffIdStart, setStaffIdStart] = useState("");
  const [staffIdEnd, setStaffIdEnd] = useState("");
  const [sortBy, setSortBy] = useState("staff_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: statusList } = useStatusFullListQuery({});
  const { data: rankList } = useRankFullListQuery({});
  const { data: entityList } = useEntityFullListQuery({ designation: entityDesignation });

  const handleResetFilters = () => {
    setEmployeeStatus("");
    setGender("");
    setGradeId("");
    setNotch("");
    setEntityId("");
    setEntityDesignation("");
    setGraEmploymentType("");
    setStaffIdStart("");
    setStaffIdEnd("");
    setVerificationStatusFilter("");
    setSearchTerm("");
    setSortBy("staff_id");
    setSortOrder("asc");
  };

  const [createSnapshot, { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError, data: createData }] =
    useCreatePayrollSnapshotMutation();
  const [createSnapshotAll, { isLoading: isCreatingAll, isSuccess: isCreateAllSuccess, error: createAllError, data: createAllData }] =
    useCreatePayrollSnapshotForAllMutation();
  const [refreshSnapshot, { isLoading: isRefreshing, isSuccess: isRefreshSuccess, error: refreshError, data: refreshData }] = useRefreshPayrollSnapshotMutation();
  const [bulkRefreshSnapshots, { isLoading: isBulkRefreshing, isSuccess: isBulkRefreshSuccess, error: bulkRefreshError, data: bulkRefreshData }] = useBulkRefreshPayrollSnapshotsMutation();

  const [deleteSnapshot, { isLoading: isDeleting, isSuccess: isDeleteSuccess, error: deleteError, data: deleteData }] = useDeletePayrollSnapshotMutation();
  const [deleteByMonth, { isLoading: isDeletingByMonth, isSuccess: isDeleteByMonthSuccess, error: deleteByMonthError, data: deleteByMonthData }] = useDeletePayrollSnapshotsByMonthMutation();
  
  const [updateVerificationStatus, { isLoading: isUpdatingVerification, isSuccess: isUpdateVerificationSuccess, error: updateVerificationError, data: updateVerificationData }] =
    useUpdateEmployeeVerificationStatusMutation();
  const [bulkUpdateVerificationStatus, { isLoading: isBulkUpdatingVerification, isSuccess: isBulkUpdateVerificationSuccess, error: bulkUpdateVerificationError, data: bulkUpdateVerificationData }] =
    useBulkUpdateEmployeeVerificationStatusMutation();
  const [openVerification, { isLoading: isOpeningVerification, isSuccess: isOpenVerificationSuccess, error: openVerificationError, data: openVerificationData }] =
    useOpenVerificationForSnapshotsMutation();
  const [closeVerification, { isLoading: isClosingVerification, isSuccess: isCloseVerificationSuccess, error: closeVerificationError, data: closeVerificationData }] =
    useCloseVerificationForSnapshotsMutation();
  const [extendDeadline, { isLoading: isExtendingDeadline, isSuccess: isExtendDeadlineSuccess, error: extendDeadlineError, data: extendDeadlineData }] =
    useExtendVerificationDeadlineMutation();
  const [reopenVerification, { isLoading: isReopeningVerification, isSuccess: isReopenVerificationSuccess, error: reopenVerificationError, data: reopenVerificationData }] =
    useReopenVerificationForSnapshotsMutation();
  const [exportSnapshots, { isLoading: isExporting }] = useExportPayrollSnapshotsMutation();

  const handleExport = async () => {
    try {
      const blob = await exportSnapshots({
        pay_month: payMonth,
        year: year,
        search: searchTerm,
        verification_status: verificationStatusFilter,
        employee_status: employeeStatus,
        gender: gender,
        grade_id: gradeId,
        notch: notch,
        entity_id: entityId,
        employment_type: graEmploymentType,
        staff_id_start: staffIdStart,
        staff_id_end: staffIdEnd,
        sortBy: sortBy,
        sortOrder: sortOrder,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payroll_Snapshots_${payMonth}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError("Failed to export payroll snapshots");
    }
  };

  const { data: verificationSummary, refetch: refetchSummary } =
    useGetSnapshotVerificationSummaryQuery(
      {
        pay_month: payMonth,
        year: year,
      },
      {
        skip: !payMonth || !year,
        refetchOnMountOrArgChange: true,
      }
    );

  // Unified status handling for all mutations
  useEffect(() => {
    const mutations = [
      { isSuccess: isCreateSuccess, error: createError, data: createData, defaultSuccess: "Payroll snapshot created successfully" },
      { isSuccess: isCreateAllSuccess, error: createAllError, data: createAllData, defaultSuccess: "Payroll snapshot created for all employees" },
      { isSuccess: isRefreshSuccess, error: refreshError, data: refreshData, defaultSuccess: "Snapshot refreshed successfully" },
      { isSuccess: isBulkRefreshSuccess, error: bulkRefreshError, data: bulkRefreshData, defaultSuccess: "Snapshots refreshed successfully" },
      { isSuccess: isDeleteSuccess, error: deleteError, data: deleteData, defaultSuccess: "Snapshot deleted successfully" },
      { isSuccess: isDeleteByMonthSuccess, error: deleteByMonthError, data: deleteByMonthData, defaultSuccess: "Snapshots deleted successfully" },
      { isSuccess: isUpdateVerificationSuccess, error: updateVerificationError, data: updateVerificationData, defaultSuccess: "Verification status updated" },
      { isSuccess: isBulkUpdateVerificationSuccess, error: bulkUpdateVerificationError, data: bulkUpdateVerificationData, defaultSuccess: "Bulk verification completed" },
      { isSuccess: isOpenVerificationSuccess, error: openVerificationError, data: openVerificationData, defaultSuccess: "Verification period opened" },
      { isSuccess: isCloseVerificationSuccess, error: closeVerificationError, data: closeVerificationData, defaultSuccess: "Verification period closed" },
      { isSuccess: isExtendDeadlineSuccess, error: extendDeadlineError, data: extendDeadlineData, defaultSuccess: "Verification deadline extended" },
      { isSuccess: isReopenVerificationSuccess, error: reopenVerificationError, data: reopenVerificationData, defaultSuccess: "Verification period reopened" },
    ];

    mutations.forEach((m) => {
      if (m.isSuccess) {
        showSuccess(m.data?.message || m.defaultSuccess);
        
        // Reset specific UI states if needed
        if (m.isSuccess === isCreateSuccess || m.isSuccess === isCreateAllSuccess) {
          setShowCreateModal(false);
          setEmployeeSearch("");
          setSelectedEmployees([]);
          setPayrollStartDate(null);
          setPayrollEndDate(null);
        }
        if (m.isSuccess === isUpdateVerificationSuccess) {
          setShowVerificationModal(false);
          setVerificationRecord(null);
          setVerificationStatus("");
          setVerificationNotes("");
        }
        if (m.isSuccess === isBulkUpdateVerificationSuccess || m.isSuccess === isBulkRefreshSuccess) {
          setSelectedRowKeys([]);
          setBulkVerificationStatus("");
          setBulkVerificationNotes("");
          setShowBulkVerificationDrawer(false);
        }
        if (m.isSuccess === isOpenVerificationSuccess || m.isSuccess === isCloseVerificationSuccess || m.isSuccess === isExtendDeadlineSuccess || m.isSuccess === isReopenVerificationSuccess) {
          setShowVerificationStatusModal(false);
          setDeadlineDays(7);
          setAdditionalDays(3);
          setNotifyManagementHead(true);
          setAutoClose(false);
        }

        refetchSnapshots();
        refetchSummary();
      }

      if (m.error) {
        const errorData = m.error as any;
        showError(errorData?.data?.message || errorData?.data?.error || "An operation failed");
      }
    });
  }, [
    isCreateSuccess, createError, createData,
    isCreateAllSuccess, createAllError, createAllData,
    isRefreshSuccess, refreshError, refreshData,
    isBulkRefreshSuccess, bulkRefreshError, bulkRefreshData,
    isDeleteSuccess, deleteError, deleteData,
    isDeleteByMonthSuccess, deleteByMonthError, deleteByMonthData,
    isUpdateVerificationSuccess, updateVerificationError, updateVerificationData,
    isBulkUpdateVerificationSuccess, bulkUpdateVerificationError, bulkUpdateVerificationData,
    isOpenVerificationSuccess, openVerificationError, openVerificationData,
    isCloseVerificationSuccess, closeVerificationError, closeVerificationData,
    isExtendDeadlineSuccess, extendDeadlineError, extendDeadlineData,
    isReopenVerificationSuccess, reopenVerificationError, reopenVerificationData
  ]);

  const formik = useFormik({
    initialValues: {
      payMonth,
      payrollStartDate,
      payrollEndDate,
    },
    validationSchema: getSnapshotValidationSchema(year),
    enableReinitialize: true,
    onSubmit: () => {},
  });

  const {
    data: snapshotData,
    isLoading: isLoadingSnapshots,
    refetch: refetchSnapshots,
  } = useListPayrollSnapshotsQuery(
    {
      page,
      limit,
      pay_month: payMonth,
      year: year,
      search: searchTerm,
      verification_status: verificationStatusFilter,
      employee_status: employeeStatus,
      gender,
      grade_id: gradeId,
      notch,
      entity_id: entityId,
      employment_type: graEmploymentType,
      staff_id_start: staffIdStart,
      staff_id_end: staffIdEnd,
      sortBy,
      sortOrder,
    },
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const { data: employeeListData } = useEmployeeListQuery(
    {
      page: 1,
      limit: 500,
      searchTerm: employeeSearch,
      sortOrder: "asc",
      sortField: "",
      status: "",
      subcontractor: "",
      consultant: "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const isAnyMutationLoading = 
    isCreating || 
    isCreatingAll || 
    isRefreshing || 
    isBulkRefreshing || 
    isDeleting || 
    isDeletingByMonth || 
    isUpdatingVerification || 
    isBulkUpdatingVerification || 
    isOpeningVerification || 
    isClosingVerification || 
    isExtendingDeadline;

  useEffect(() => {
    if (snapshotData?.data && snapshotData.data.length > 0) {
      const firstSnapshot = snapshotData.data[0];
      setSnapshotStatus(firstSnapshot.status || "pending");

      if (
        firstSnapshot.status === "verification_open" &&
        firstSnapshot.verification_deadline
      ) {
        setVerificationDeadline(new Date(firstSnapshot.verification_deadline));
        setCountdownKey((prev) => prev + 1);
      } else {
        setVerificationDeadline(null);
      }
    }
  }, [snapshotData]);

  const handleCreateSnapshot = async () => {
    if (!payMonth) {
      Swal.fire({
        title: "Error",
        text: "Please select a pay month",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    if (selectedEmployees.length === 0) {
      Swal.fire({
        title: "Info",
        text: "Please select at least one employee or click 'Create for All'",
        icon: "info",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    // Validate dates
    const validationErrors = await formik.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors as any).join("\n");
      Swal.fire({
        title: "Validation Error",
        text: errorMessages,
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    try {
      await createSnapshot({
        pay_month: payMonth,
        year: year || new Date().getFullYear(),
        employee_ids: selectedEmployees,
        payroll_start_date: payrollStartDate
          ? payrollStartDate.toISOString()
          : undefined,
        payroll_end_date: payrollEndDate
          ? payrollEndDate.toISOString()
          : undefined,
      }).unwrap();
    } catch (error: any) {
      // Handled by useEffect
    }
  };

  const handleCreateSnapshotForAll = async () => {
    if (!payMonth) {
      Swal.fire({
        title: "Error",
        text: "Please select a pay month",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    // Validate dates
    const validationErrors = await formik.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors as any).join("\n");
      Swal.fire({
        title: "Validation Error",
        text: errorMessages,
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Create Snapshot for All Employees",
      text: `Are you sure you want to create a payroll snapshot for all employees for ${payMonth}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, create it!",
    });

    if (result.isConfirmed) {
      try {
        await createSnapshotAll({
          pay_month: payMonth,
          year: year || new Date().getFullYear(),
          payroll_start_date: payrollStartDate
            ? payrollStartDate.toISOString()
            : undefined,
          payroll_end_date: payrollEndDate
            ? payrollEndDate.toISOString()
            : undefined,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleRefreshSnapshot = async (record: any) => {
    const result = await Swal.fire({
      title: "Refresh Snapshot",
      text: `Are you sure you want to re-compute the payroll snapshot for ${record.employee_data.full_name}? This will update their payroll values with the latest system data.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, refresh it!",
    });

    if (result.isConfirmed) {
      try {
        await refreshSnapshot({
          pay_month: record.pay_month,
          year: record.year,
          employee_id: record.employee_id,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleBulkRefresh = async () => {
    if (selectedRowKeys.length === 0) {
      showError("Please select employees to refresh");
      return;
    }

    const result = await Swal.fire({
      title: "Bulk Refresh Snapshots",
      text: `Are you sure you want to re-compute payroll for ${selectedRowKeys.length} selected employees? This will reset their verification status to Pending Review.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#722ed1",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, refresh them!",
    });

    if (result.isConfirmed) {
      try {
        await bulkRefreshSnapshots({
          snapshotIds: selectedRowKeys,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleBulkRefreshFromDrawer = async (employeeIds: string[], preserveVerificationStatus: boolean) => {
    const modeText = preserveVerificationStatus
      ? "Figures will be recalculated. Verification statuses will NOT be changed."
      : `This will reset their verification status to Pending Review.`;
    const result = await Swal.fire({
      title: preserveVerificationStatus ? "Recalculate Figures" : "Bulk Refresh Snapshots",
      text: `Are you sure you want to re-compute payroll for ${employeeIds.length} employee(s) for ${payMonth} ${year}? ${modeText}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: preserveVerificationStatus ? "#d97706" : "#722ed1",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: preserveVerificationStatus ? "Yes, recalculate!" : "Yes, refresh them!",
    });

    if (result.isConfirmed) {
      try {
        await bulkRefreshSnapshots({
          employeeIds,
          pay_month: payMonth,
          year,
          preserve_verification_status: preserveVerificationStatus,
        }).unwrap();
        setShowRefreshDrawer(false);
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    const result = await Swal.fire({
      title: "Delete Snapshot",
      text: "Are you sure you want to delete this snapshot?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSnapshot(snapshotId).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleDeleteByMonth = async () => {
    if (!payMonth) {
      showError("Please select a pay month");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Snapshots by Month",
      text: `Delete all snapshots for ${payMonth}/${year}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await deleteByMonth({
          pay_month: payMonth,
          year: year || new Date().getFullYear(),
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleOpenVerificationModal = (record: any) => {
    setVerificationRecord(record);
    setVerificationStatus(
      record.employee_verification_status || "PENDING_REVIEW"
    );
    setVerificationNotes("");
    setShowHistoryOnly(false);
    setShowVerificationModal(true);
  };

  const handleViewVerificationHistory = (record: any) => {
    setVerificationRecord(record);
    setVerificationStatus("");
    setVerificationNotes("");
    setShowHistoryOnly(true);
    setShowVerificationModal(true);
  };

  const handleUpdateVerificationStatus = async () => {
    if (!verificationRecord || !verificationStatus) {
      showError("Please select a verification status");
      return;
    }

    try {
      await updateVerificationStatus({
        snapshotId: verificationRecord._id,
        status: verificationStatus,
        notes: verificationNotes || undefined,
      }).unwrap();
    } catch (error: any) {
      // Handled by useEffect
    }
  };

  const getVerificationStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING_REVIEW: "blue",
      APPROVED_FOR_PAY: "green",
      EXCLUDED: "orange",
      FLAGGED_FOR_REVIEW: "red",
      ON_HOLD: "cyan",
      AUTO_EXCLUDED: "default",
    };
    return colorMap[status] || "default";
  };

  const handleOpenVerification = async () => {
    if (!payMonth || !year) {
      showError("Please select pay month and year");
      return;
    }

    const result = await Swal.fire({
      title: "Open Verification Period?",
      html: `<p style="margin-bottom: 12px;">You are about to open the verification period for <strong>${payMonth}/${year}</strong>.</p>
             <p style="margin-bottom: 12px;">Department heads will be able to review and approve/exclude employees for payroll.</p>
             <p style="color: #d33; font-weight: bold;">⚠️ This action cannot be undone. Proceed with caution.</p>
             <p style="margin-top: 12px; font-size: 12px;">Deadline will be set to <strong>${deadlineDays} days</strong> from now.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0050b3",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, Open Verification",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await openVerification({
          pay_month: payMonth,
          year,
          deadline_days: deadlineDays,
          notify_management_head: notifyManagementHead,
          auto_close: autoClose,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleCloseVerification = async () => {
    if (!payMonth || !year) {
      showError("Please select pay month and year");
      return;
    }

    const result = await Swal.fire({
      title: "Close Verification Period?",
      html: `<p style="margin-bottom: 12px;">You are about to close the verification period for <strong>${payMonth}/${year}</strong>.</p>
             <p style="margin-bottom: 12px;">Once closed, no further changes can be made to employee verification statuses.</p>
             <p style="color: #d33; font-weight: bold;">⚠️ This action cannot be undone. Proceed with caution.</p>
             <p style="margin-top: 12px; font-size: 12px;">The system will move to the next payroll processing stage.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, Close Verification",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await closeVerification({
          pay_month: payMonth,
          year,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleBulkVerify = async () => {
    if (!bulkVerificationStatus) {
      showError("Please select a verification status");
      return;
    }

    if (bulkVerificationStatus !== "APPROVED_FOR_PAY" && !bulkVerificationNotes) {
      showError("Notes are required for non-approved statuses");
      return;
    }

    const result = await Swal.fire({
      title: "Bulk Verify Employees",
      html: `<div style="text-align: left;">
        <p><strong>Status:</strong> ${bulkVerificationStatus.replace(/_/g, " ")}</p>
        <p><strong>Employees:</strong> ${selectedRowKeys.length}</p>
        ${bulkVerificationNotes ? `<p><strong>Notes:</strong> ${bulkVerificationNotes}</p>` : ""}
        <p style="color: #d97706; margin-top: 16px;">
          ⚠️ This action will update verification status for ${selectedRowKeys.length} employees
        </p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Verify",
      confirmButtonColor: "#0050b3",
      cancelButtonColor: "#6b6a66",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await bulkUpdateVerificationStatus({
        snapshotIds: selectedRowKeys,
        status: bulkVerificationStatus,
        notes: bulkVerificationNotes || undefined,
      }).unwrap();
    } catch (error: any) {
      // Handled by useEffect
    }
  };

  const handleExtendDeadline = async () => {
    if (!payMonth || !year) {
      showError("Please select pay month and year");
      return;
    }

    const result = await Swal.fire({
      title: "Extend Verification Deadline?",
      html: `<p style="margin-bottom: 12px;">You are about to extend the verification deadline for <strong>${payMonth}/${year}</strong>.</p>
             <p style="margin-bottom: 12px;">This will give department heads additional time to complete employee verifications.</p>
             <p style="color: #d33; font-weight: bold;">⚠️ This action cannot be undone. Proceed with caution.</p>
             <p style="margin-top: 12px; font-size: 12px;">Deadline will be extended by <strong>${additionalDays} days</strong>.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#faad14",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, Extend Deadline",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await extendDeadline({
          pay_month: payMonth,
          year,
          additional_days: additionalDays,
          notify_management_head: notifyManagementHead,
          auto_close: autoClose,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleReopenVerification = async () => {
    if (!payMonth || !year) {
      showError("Please select pay month and year");
      return;
    }

    const result = await Swal.fire({
      title: "Reopen Verification Period?",
      html: `<p style="margin-bottom: 12px;">You are about to reopen the verification period for <strong>${payMonth}/${year}</strong>.</p>
             <p style="margin-bottom: 12px;">Department heads will be able to review and make changes to employee verification statuses again.</p>
             <p style="color: #d33; font-weight: bold;">⚠️ This will reopen a previously closed verification window.</p>
             <p style="margin-top: 12px; font-size: 12px;">New deadline will be set to <strong>${deadlineDays} days</strong> from now.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#722ed1",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, Reopen Verification",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await reopenVerification({
          pay_month: payMonth,
          year,
          deadline_days: deadlineDays,
          notify_management_head: notifyManagementHead,
          auto_close: autoClose,
        }).unwrap();
      } catch (error: any) {
        // Handled by useEffect
      }
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      const field = Array.isArray(sorter.field) ? sorter.field[sorter.field.length - 1] : sorter.field;
      setSortBy(field);
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    } else {
      setSortBy("staff_id");
      setSortOrder("asc");
    }
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={
            selectedRowKeys.length > 0 &&
            selectedRowKeys.length === snapshotData?.data?.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(
                snapshotData?.data?.map((emp: any) => emp._id) || []
              );
            } else {
              setSelectedRowKeys([]);
            }
          }}
          title="Select all"
        />
      ),
      key: "checkbox",
      fixed: "left" as const,
      width: 50,
      render: (_: any, record: any) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record._id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((id) => id !== record._id));
            }
          }}
        />
      ),
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "No",
      key: "no",
      fixed: "left" as const,
      width: 50,
      render: (_text: any, _record: any, index: number) =>
        (page - 1) * limit + index + 1,
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Staff ID",
      dataIndex: ["employee_data", "staff_id"],
      key: "staff_id",
      fixed: "left" as const,
      width: 90,
      sorter: true,
      sortOrder: sortBy === "staff_id" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Employee Name",
      key: "employee_name",
      fixed: "left" as const,
      width: 180,
      render: (_: any, record: any) => {
        const emp = record.employee_data;
        return <span className="text-[10px]">{emp?.full_name || "N/A"}</span>;
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Employee Status",
      key: "status_name",
      width: 150,
      render: (_: any, record: any) => {
        const status = record.employee_data?.status_name || "N/A";
        return <span className="text-[10px]">{status}</span>;
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Employment Type",
      key: "employment_type",
      width: 150,
      render: (_: any, record: any) => {
        const employment_type = record.employee_data?.employment_type || "N/A";
        return (
          <span className="text-[10px]">
            {capitalizeFirstLetter(employment_type)}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Employment Position",
      key: "gra_position",
      width: 150,
      render: (_: any, record: any) => {
        const gra_position = record.employee_data?.gra_position || "N/A";
        return (
          <span className="text-[10px]">
            {capitalizeFirstLetter(gra_position)}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Mgt Unit",
      key: "entity_name",
      width: 150,
      render: (_: any, record: any) => {
        const entity_name = record.employee_data?.entity_name || "N/A";
        return <span className="text-[10px]">{entity_name}</span>;
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Pay Period",
      key: "pay_period",
      width: 120,
      render: (_, record) => {
        return (
          <span className="text-[10px]">
            {capitalizeFirstLetter(record?.pay_month)}, {record?.year}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },

    {
      title: "Verification Status",
      key: "employee_verification_status",
      width: 170,
      render: (_, record: any) => {
        const status = record.employee_verification_status || "PENDING_REVIEW";
        return (
          <Tag
            color={getVerificationStatusColor(status)}
            className="text-[10px]"
          >
            {normalizeText(status)}
          </Tag>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Snapshot Status",
      key: "snapshot_status",
      width: 170,
      render: (_: any, record: any) => {
        const status = record.status || "pending";
        const statusColors: { [key: string]: string } = {
          pending: "default",
          finalized: "processing",
          locked: "error",
        };
        return (
          <Tag color={statusColors[status]} className="text-[10px]">
            {normalizeText(status).toUpperCase()}
          </Tag>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Created Date",
      key: "createdAt",
      width: 160,
      render: (_: any, record: any) => {
        return (
          <span className="text-[10px]">{formatDate4(record.createdAt)}</span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Created By",
      key: "created_by",
      width: 130,
      render: (_: any, record: any) => {
        const createdBy = record.created_by;
        if (!createdBy) return <span className="text-[10px]">N/A</span>;
        const name = `${createdBy.firstname || ""} ${
          createdBy.lastname || ""
        }`.trim();
        return (
          <span className="text-[10px]">
            {name || createdBy.email || "N/A"}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Finalized By",
      key: "finalized_by",
      width: 130,
      render: (_: any, record: any) => {
        const finalizedBy = record.finalized_by;
        if (!finalizedBy) return <span className="text-[10px]">N/A</span>;
        const name = `${finalizedBy.firstname || ""} ${
          finalizedBy.lastname || ""
        }`.trim();
        return (
          <span className="text-[10px]">
            {name || finalizedBy.email || "N/A"}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Finalized At",
      key: "finalized_at",
      width: 160,
      render: (_: any, record: any) => {
        return (
          <span className="text-[10px]">
            {record.finalized_at ? formatDate4(record.finalized_at) : "N/A"}
          </span>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 170,
      fixed: "right" as const,
      render: (_: any, record: any) => {
        const status = record.status || "pending";
        return (
          <Space size="small" wrap={false}>
            <Tooltip title="View Details">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                className={styles.primary_button}
                onClick={() => {
                  setDetailsRecord(record);
                  setShowDetailsDrawer(true);
                }}
              />
            </Tooltip>

            {hasCreateAccess && (
              <Tooltip title="Refresh Snapshot (Re-compute)">
                <Button
                  icon={<ReloadOutlined />}
                  size="small"
                  style={{ color: "#722ed1", borderColor: "#722ed1" }}
                  disabled={["locked", "finalized"].includes(status)}
                  loading={isRefreshing}
                  onClick={() => handleRefreshSnapshot(record)}
                />
              </Tooltip>
            )}

            {hasVerifyAccess && (
              <Tooltip title="Verify (Approve/Flag/Exclude)">
                <Button
                  type="dashed"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  style={{ color: "#52c41a", borderColor: "#52c41a" }}
                  disabled={["locked", "finalized"].includes(status)}
                  onClick={() => handleOpenVerificationModal(record)}
                >
                  <span className="text-[10px]">Verify</span>
                </Button>
              </Tooltip>
            )}

            {record.verification_history && record.verification_history.length > 0 && (
              <Tooltip title="View History">
                <Button
                  icon={<HistoryOutlined />}
                  size="small"
                  style={{ color: "#faad14", borderColor: "#faad14" }}
                  onClick={() => handleViewVerificationHistory(record)}
                />
              </Tooltip>
            )}

            {hasDeleteAccess && (
              <Tooltip title="Delete">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  disabled={status !== "pending"}
                  onClick={() => handleDeleteSnapshot(record._id)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
      onCell: () => ({ style: { fontSize: "10px" } }),
    },
  ];

  const monthOptions = moment.months().map((month) => ({
    label: month,
    value: month.toLowerCase(),
  }));

  const employeeOptions =
    employeeListData?.data?.map((emp: any) => ({
      label: `${emp.staff_id} - ${emp.firstname} ${emp.lastname}`,
      value: emp._id,
    })) || [];

  if (isLoadingSnapshots || isAnyMutationLoading) {
    return <Loader />;
  }

  return (
    <>
      <PageLayout
        title="Payroll Window"
        subtitle="Manage payroll snapshots and verification windows"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Payroll Window" }]}
      />
      <div className="px-2">
      {snapshotData?.data && snapshotData.data.length > 0 && (
        <div className="mb-2">
          {snapshotStatus === "verification_open" && verificationDeadline && (
            <Alert
              message={
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    ✓ Verification Period Active
                  </span>
                  <div className="flex items-center gap-4">
                    <Countdown
                      key={countdownKey}
                      value={new Date(verificationDeadline).getTime()}
                      format="D[d] H[h] m[m] s[s]"
                      onFinish={() => {
                        setVerificationDeadline(null);
                      }}
                      valueStyle={{ fontSize: "11px", fontWeight: "bold", color: "#d46b08" }}
                    />
                  </div>
                </div>
              }
              type="warning"
              showIcon
              className="py-0.5 px-3 border-x-0 border-t-0 rounded-none bg-orange-50"
            />
          )}

          {snapshotStatus === "verification_closed" && (
            <Alert
              message={<span className="text-[10px] font-medium uppercase">Verification Window Closed</span>}
              type="info"
              showIcon
              className="py-0.5 px-3 border-x-0 border-t-0 rounded-none"
            />
          )}

          {snapshotStatus === "pending" && (
            <Alert
              message={<span className="text-[10px] font-medium uppercase">Verification Not Yet Opened</span>}
              type="info"
              showIcon
              className="py-0.5 px-3 border-x-0 border-t-0 rounded-none"
            />
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-4 max-sm:flex-wrap gap-2">
        <div>
          <h1 className="text-[18px] font-medium">Payroll Window</h1>
          {selectedRowKeys.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {selectedRowKeys.length} employee(s) selected
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedRowKeys.length > 0 && hasVerifyAccess && (
            <>
              <Button
                type="primary"
                onClick={() => setShowBulkVerificationDrawer(true)}
                className={styles.primary_button}
              >
                Bulk Verify ({selectedRowKeys.length})
              </Button>
              {hasCreateAccess && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleBulkRefresh}
                  style={{ color: "#722ed1", borderColor: "#722ed1" }}
                  disabled={["locked", "finalized"].includes(snapshotStatus)}
                >
                  Bulk Refresh ({selectedRowKeys.length})
                </Button>
              )}
              <Button onClick={() => setSelectedRowKeys([])}>Clear</Button>
            </>
          )}
          {hasCreateAccess && (
            <>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setShowRefreshDrawer(true)}
                style={{ color: "#722ed1", borderColor: "#722ed1" }}
                loading={isBulkRefreshing}
              >
                <span className="max-md:hidden">Bulk Refresh</span>
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateModal(true)}
                loading={isCreating || isCreatingAll}
                className={`${styles.primary_button}`}
              >
                <span className="max-md:hidden">Create Snapshot</span>
              </Button>
            </>
          )}
          {(hasOpenVerificationAccess ||
            hasCloseVerificationAccess ||
            hasExtendDeadlineAccess ||
            hasReopenVerificationAccess) && (
            <Button
              icon={<LockOutlined />}
              onClick={() => setShowVerificationStatusModal(true)}
            >
              <span className="max-md:hidden">Manage Verification</span>
            </Button>
          )}
          {hasDeleteAccess && (
            <Button danger icon={<UndoOutlined />} onClick={handleDeleteByMonth}>
              <span className="max-md:hidden">Delete by Month</span>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white p-2">
        <div className="flex justify-between items-end mb-4 max-sm:flex-wrap gap-2">
          {/* Filters on the left */}
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Month:
              </label>
              <Select
                style={{ width: 180 }}
                placeholder="Select month"
                value={payMonth || undefined}
                onChange={setPayMonth}
                options={monthOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year:
              </label>
              <InputNumber
                style={{ width: 100 }}
                value={year}
                onChange={(val) => setYear(val || new Date().getFullYear())}
                min={2020}
                max={2100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search:
              </label>
              <Input
                placeholder="Staff ID, Name, or Status"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                prefix={<SearchOutlined />}
                style={{ width: 220 }}
                allowClear
                onPressEnter={() => refetchSnapshots()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Status:
              </label>
              <Select
                style={{ width: 180 }}
                placeholder="All Statuses"
                value={verificationStatusFilter || undefined}
                onChange={(value) => {
                  setVerificationStatusFilter(value);
                  setPage(1);
                }}
                allowClear
                options={[
                  { label: "Pending Review", value: "PENDING_REVIEW" },
                  { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
                  {
                    label: "Excluded",
                    value: "EXCLUDED",
                  },
                  { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
                  { label: "On Hold", value: "ON_HOLD" },
                  { label: "Auto Excluded", value: "AUTO_EXCLUDED" },
                ]}
              />
            </div>
            <Button 
              icon={<SyncOutlined />} 
              onClick={() => setShowFilters(true)}
              className="flex items-center"
            >
              Advanced Filters
            </Button>
          </div>

          {/* Verification Summary button on the right */}
          <div className="flex items-center gap-2">
            {payMonth && year && verificationSummary && (
              <Button
                icon={<FileTextOutlined />}
                onClick={() => setShowVerificationSummaryDrawer(true)}
              >
                <span className="max-md:hidden">Verification Summary</span>
              </Button>
            )}
            {payMonth && year && (
              <Button
                icon={<FileExcelOutlined />}
                onClick={handleExport}
                loading={isExporting}
                className="flex items-center"
                style={{ 
                  backgroundColor: "#1D6F42", 
                  borderColor: "#1D6F42", 
                  color: "#fff" 
                }}
              >
                <span className="max-md:hidden">Export Excel</span>
              </Button>
            )}
          </div>
        </div>

      </div>

      <CreatePayrollSnapshotDrawer
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEmployeeSearch("");
          setSelectedEmployees([]);
          setPayrollStartDate(null);
          setPayrollEndDate(null);
        }}
        payMonth={payMonth}
        year={year}
        onPayMonthChange={setPayMonth}
        onYearChange={setYear}
        payrollStartDate={payrollStartDate}
        onPayrollStartDateChange={setPayrollStartDate}
        payrollEndDate={payrollEndDate}
        onPayrollEndDateChange={setPayrollEndDate}
        selectedEmployees={selectedEmployees}
        onSelectedEmployeesChange={setSelectedEmployees}
        employeeSearch={employeeSearch}
        onEmployeeSearchChange={setEmployeeSearch}
        employeeOptions={employeeOptions}
        monthOptions={monthOptions}
        isCreating={isCreating}
        isCreatingAll={isCreatingAll}
        onCreateForSelected={handleCreateSnapshot}
        onCreateForAll={handleCreateSnapshotForAll}
        formik={formik}
      />

      <RefreshPayrollSnapshotDrawer
        open={showRefreshDrawer}
        onClose={() => setShowRefreshDrawer(false)}
        payMonth={payMonth}
        year={year}
        onPayMonthChange={setPayMonth}
        onYearChange={setYear}
        monthOptions={monthOptions}
        isRefreshing={isBulkRefreshing}
        onRefreshForSelected={handleBulkRefreshFromDrawer}
      />

      <ManageVerificationStatusDrawer
        open={showVerificationStatusModal}
        onClose={() => {
          setShowVerificationStatusModal(false);
          setDeadlineDays(7);
          setAdditionalDays(3);
        }}
        payMonth={payMonth}
        year={year}
        onPayMonthChange={setPayMonth}
        onYearChange={setYear}
        deadlineDays={deadlineDays}
        onDeadlineDaysChange={setDeadlineDays}
        additionalDays={additionalDays}
        onAdditionalDaysChange={setAdditionalDays}
        notifyManagementHead={notifyManagementHead}
        onNotifyManagementHeadChange={setNotifyManagementHead}
        autoClose={autoClose}
        onAutoCloseChange={setAutoClose}
        onOpenVerification={handleOpenVerification}
        onCloseVerification={handleCloseVerification}
        onExtendDeadline={handleExtendDeadline}
        onReopenVerification={handleReopenVerification}
        isOpeningVerification={isOpeningVerification}
        isClosingVerification={isClosingVerification}
        isExtendingDeadline={isExtendingDeadline}
        isReopeningVerification={isReopeningVerification}
        monthOptions={monthOptions}
        hasOpenVerificationAccess={hasOpenVerificationAccess}
        hasCloseVerificationAccess={hasCloseVerificationAccess}
        hasExtendDeadlineAccess={hasExtendDeadlineAccess}
        hasReopenVerificationAccess={hasReopenVerificationAccess}
      />

      <Table
        size="small"
        columns={columns as any}
        dataSource={snapshotData?.data || []}
        rowKey="_id"
        pagination={false}
        onChange={handleTableChange}
        scroll={{ x: 2500, y: "60vh" }}
        sticky={true}
        style={{ minWidth: "100%" }}
      />

      {snapshotData?.pagination && (
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Pagination
            current={page}
            pageSize={limit}
            total={snapshotData.pagination.total}
            onChange={setPage}
            pageSizeOptions={[10, 20, 50, 100,150]}
            onShowSizeChange={(_, pageSize) => {
              setLimit(pageSize);
              setPage(1);
            }}
            showTotal={(total) => `Total ${total} items`}
          />
        </div>
      )}


      <PayrollSnapshotDetailsDrawer
        open={showDetailsDrawer}
        onClose={() => {
          setShowDetailsDrawer(false);
          setDetailsRecord(null);
        }}
        record={detailsRecord?.employee_data}
      />

      <VerifyEmployeeSnapshotDrawer
        open={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setVerificationRecord(null);
          setVerificationStatus("");
          setVerificationNotes("");
          setShowHistoryOnly(false);
        }}
        record={verificationRecord}
        status={verificationStatus}
        notes={verificationNotes}
        onStatusChange={setVerificationStatus}
        onNotesChange={setVerificationNotes}
        onSubmit={handleUpdateVerificationStatus}
        isLoading={isUpdatingVerification}
        showHistoryOnly={showHistoryOnly}
      />


      <VerificationSummaryDrawer
        open={showVerificationSummaryDrawer}
        onClose={() => setShowVerificationSummaryDrawer(false)}
        verificationSummary={verificationSummary}
        payMonth={payMonth}
        year={year}
      />

      <BulkVerifyDrawer
        open={showBulkVerificationDrawer}
        onClose={() => {
          setShowBulkVerificationDrawer(false);
          setBulkVerificationStatus("");
          setBulkVerificationNotes("");
        }}
        selectedCount={selectedRowKeys.length}
        verificationStatus={bulkVerificationStatus}
        onStatusChange={setBulkVerificationStatus}
        verificationNotes={bulkVerificationNotes}
        onNotesChange={setBulkVerificationNotes}
        onSubmit={handleBulkVerify}
        isLoading={isBulkUpdatingVerification}
      />

      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="flex items-center gap-2">
              Advanced Filters
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
            <label className="text-[12px] font-medium text-gray-500 uppercase">Employee Status</label>
            <Select
              showSearch
              placeholder="All Statuses"
              value={employeeStatus || undefined}
              onChange={(val) => setEmployeeStatus(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
              allowClear
            >
              <Option value="">All Statuses</Option>
              {statusList?.data?.map((s: any, i: number) => (
                <Option key={i} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </div>

          {/* Gender */}
          {/* <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Gender</label>
            <Select
              showSearch
              placeholder="All Genders"
              value={gender || undefined}
              onChange={(val) => setGender(val || "")}
              optionFilterProp="children"
              className="w-full text-[13px]"
              allowClear
            >
              <Option value="">All Genders</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </div> */}

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
              allowClear
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
              allowClear
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
              allowClear
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
              optionFilterProp="children"
              className="w-full text-[13px]"
              allowClear
            >
              <Option value="">All Entities</Option>
              {entityList?.data?.map((e: any, i: number) => (
                <Option key={i} value={e.id}>{e.name}</Option>
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
              allowClear
            >
              <Option value="">All Types</Option>
              <Option value="permanent">Permanent</Option>
              <Option value="contract">Contract</Option>
              <Option value="part_time">Part-Time</Option>
              <Option value="casual">Casual</Option>
              <Option value="expatriate">Expatriate</Option>
            </Select>
          </div>

          {/* Staff ID Range */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Staff ID From</label>
            <Input
              placeholder="e.g. 7748"
              value={staffIdStart}
              onChange={(e) => setStaffIdStart(e.target.value)}
              className="w-full text-[13px]"
              allowClear
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Staff ID To</label>
            <Input
              placeholder="e.g. 7849"
              value={staffIdEnd}
              onChange={(e) => setStaffIdEnd(e.target.value)}
              className="w-full text-[13px]"
              allowClear
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button type="primary" onClick={() => setShowFilters(false)} className={styles.primary_button}>
            Apply Filters
          </Button>
        </div>
      </Drawer>

      <style>{`
        .verify-employee-modal .ant-modal-footer .ant-btn-primary {
          background-color: #15803d !important;
          border-color: #15803d !important;
        }
        .verify-employee-modal .ant-modal-footer .ant-btn-primary:hover {
          background-color: #166534 !important;
          border-color: #166534 !important;
        }
      `}</style>
      </div>
    </>
  );
};

export default PayrollSnapshot;
