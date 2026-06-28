import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Spin,
  Empty,
  Form,
  message,
  Pagination as AntPagination,
  Popover,
  Breadcrumb,
} from "antd";

import { ReloadOutlined, RobotOutlined, CloseOutlined, BulbOutlined, CheckCircleFilled, StarFilled, HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useGetHodActionRequiredQuery,
  useAssignNextStageMutation,
  useAssignNextStageBulkMutation,
  useHodReviewCompletionMutation,
  useSkipAssignmentStageMutation,
  useRevertStageMutation,
  useRejectAssignmentAndApplicationMutation,
  useCallBackAssignedStageMutation,
  useRequestReportFromClientMutation,
  useRequestCorrectionsFromClientMutation,
  useHodFinalApprovalMutation,
} from "@/redux/features/employee-portal-api/application/assignment";
import { useReportTemplatesFullListQuery } from "@/redux/features/employee-portal-api/general";
import { useEntityStaffsQuery } from "@/redux/features/employee-portal-api/entityApi";
import { useGetSubDivisionsQuery } from "@/redux/features/employee-portal-api/subdivisionApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import enUS from "antd/locale/en_US";
import "dayjs/locale/en";
import dayjs from "dayjs";
import { getStageInfo } from "@/employee_portal_pages/components/assignment-plan/helpers";
dayjs.locale("en");
import ApplicationReview from "@/employee_portal_pages/components/assignment-plan/application-review";
import { ReviewModal, HodFinalApprovalModal } from "@/employee_portal_pages/components/assignment-plan/review-modal";
import { AssignModal } from "@/employee_portal_pages/components/assignment-plan/assign-modal";
import { BulkAssignModal } from "@/employee_portal_pages/components/assignment-plan/bulk-assign-modal";
import AssignmentPlanModal from "@/employee_portal_pages/components/application/assignment-details";
import Swal from "sweetalert2";
import { getActionMenu } from "@/employee_portal_pages/components/assignment-plan/menu-helpers";
import { Assignment, Officer } from "@/employee_portal_pages/types/assignments";
import {
  triggerRejectAction,
  triggerReportRequestAction,
  triggerCorrectionRequestAction,
  triggerSkipAction,
  triggerRecallAction,
  triggerRevertAction,
  triggerReviewAction,
  triggerAssignAction,
  triggerBulkAssignAction,
  ReportRequestValues,
  CorrectionRequestValues,
} from "@/employee_portal_pages/components/assignment-plan/assignment-confirmations";

import { AssignmentGrid } from "@/employee_portal_pages/components/assignment-plan/AssignmentGrid";
import { AssignmentList } from "@/employee_portal_pages/components/assignment-plan/AssignmentList";
import { AssignmentFilters } from "@/employee_portal_pages/components/assignment-plan/AssignmentFilters";
import RequestDelegationModal from "@/employee_portal_pages/components/assignment-plan/RequestDelegationModal";
import DelegatedTasksTab from "@/employee_portal_pages/components/assignment-plan/DelegatedTasksTab";
import RemindersWidget from "@/employee_portal_pages/components/assignment-plan/RemindersWidget";

import { ShareAltOutlined } from "@ant-design/icons";

const ASSIGN_FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

function HodAssignmentsPage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("assign-font-size") || "base"
  );
  const zoom = ASSIGN_FONT_SIZES.find((f) => f.key === fontSizeKey)?.zoom ?? 1;
  const handleFontSize = (key: string) => { setFontSizeKey(key); localStorage.setItem("assign-font-size", key); };

  // --- State Management ---
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [filters, setFilters] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 15,
    searchTerm: searchParams.get("search") || "",
    statusFilter: searchParams.get("status") || "pending_assignments",
    sortField: searchParams.get("sortField") || "updatedAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });
  const [pageView, setPageView] = useState<"assignments" | "delegated">(
    (searchParams.get("tab") as "assignments" | "delegated") || "assignments"
  );

  // Sync filters to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.page !== 1) params.page = filters.page.toString();
    if (filters.limit !== 15) params.limit = filters.limit.toString();
    if (filters.searchTerm) params.search = filters.searchTerm;
    if (filters.statusFilter !== "pending_assignments")
      params.status = filters.statusFilter;
    if (filters.sortField !== "updatedAt") params.sortField = filters.sortField;
    if (filters.sortOrder !== "desc") params.sortOrder = filters.sortOrder;
    if (viewMode !== "grid") params.view = viewMode;
    if (pageView !== "assignments") params.tab = pageView;

    setSearchParams(params, { replace: true });
  }, [filters, viewMode, pageView, setSearchParams]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    filters.searchTerm
  );

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Assignment | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isHodFinalApprovalModalOpen, setIsHodFinalApprovalModalOpen] = useState(false);
  const [assignmentPlanModalOpen, setAssignmentPlanModalOpen] = useState(false);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);

  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    null
  );



  // --- RTK Query & Hooks ---
  const queryParams = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const {
    data: assignmentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetHodActionRequiredQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    refetch();
  }, [filters.statusFilter]);

  const { data: entityMembers, isLoading: isLoadingMembers } =
    useEntityStaffsQuery({
      page: 1,
      limit: 500,
      searchTerm: "",
      sortField: "firstname",
      sortOrder: "asc",
      entity_id: employee?.entity?._id || employee?.entity_id,
    });

  const activeEntityMembers = useMemo(() => {
    if (!entityMembers?.data) return { data: [] as Officer[] };
    return {
      ...entityMembers,
      data: entityMembers.data.filter(
        (member: Officer) =>
          member?.status?.toLowerCase() === "active" ||
          member?.is_active === true
      ),
    };
  }, [entityMembers]);

  const { data: subDivisionsData, isLoading: isLoadingSubDivisions } = useGetSubDivisionsQuery();
  const subDivisions = subDivisionsData?.data || [];

  const { data: reportTemplatesData } = useReportTemplatesFullListQuery({});
  const reportTemplates = reportTemplatesData?.data || [];

  const [assignNextStage, { isLoading: isAssigning }] =
    useAssignNextStageMutation();
  const [assignNextStageBulk] = useAssignNextStageBulkMutation();
  const [hodReviewCompletion, { isLoading: isReviewing }] =
    useHodReviewCompletionMutation();
  const [skipApplicationStep] = useSkipAssignmentStageMutation();
  const [revertApplicationStep] = useRevertStageMutation();
  const [callBackStage] = useCallBackAssignedStageMutation();
  const [rejectApplication] = useRejectAssignmentAndApplicationMutation();
  const [requestReport] = useRequestReportFromClientMutation();
  const [requestCorrections] = useRequestCorrectionsFromClientMutation();
  const [hodFinalApproval] = useHodFinalApprovalMutation();

  const [singleAssignForm] = Form.useForm();
  const [bulkAssignForm] = Form.useForm();
  const [reviewForm] = Form.useForm();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.searchTerm]);

  // --- Handlers ---
  const resolveApplicantName = (clientDetails: any) => {
    if (!clientDetails) return "Unknown Applicant";

    switch (clientDetails.userType) {
      case "individual":
        return `${clientDetails.firstName ?? ""} ${
          clientDetails.lastName ?? ""
        }`.trim();

      case "organization":
        return clientDetails.organizationName || "Unknown Organization";

      case "government":
        return clientDetails.agencyName || "Unknown Agency";

      default:
        return (
          clientDetails.organizationName ||
          clientDetails.agencyName ||
          `${clientDetails.firstName ?? ""} ${
            clientDetails.lastName ?? ""
          }`.trim() ||
          "Unknown Applicant"
        );
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const openAssignModal = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsAssignModalOpen(true);
  };

  const openBulkAssignModal = () => {
    setIsBulkAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setCurrentAssignment(null);
    singleAssignForm.resetFields();
  };

  const closeBulkAssignModal = () => {
    setIsBulkAssignModalOpen(false);
    bulkAssignForm.resetFields();
  };

  const openReviewModal = (assignment: Assignment) => {
    console.log("Opening review modal:", assignment);
    setCurrentAssignment(assignment);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setCurrentAssignment(null);
    reviewForm.resetFields();
  };

  const handleAssign = async () => {
    try {
      if (!currentAssignment) return;
      // Validate form first
      const values = await singleAssignForm.validateFields();

      const isGroupAssignment = !!values.subDivisionId;

      // Find the selected officer details (individual mode)
      const selectedOfficer = isGroupAssignment
        ? null
        : activeEntityMembers?.data.find(
            (member: Officer) => member._id === values.assignedTo
          );

      // Find copied employees details
      const copiedEmployees = isGroupAssignment
        ? []
        : activeEntityMembers?.data.filter((member: Officer) =>
            values.copiedEmployees?.includes(member._id)
          ) || [];

      const selectedGroup = isGroupAssignment
        ? subDivisions.find((d: any) => d._id === values.subDivisionId)
        : null;

      // Use trigger action for confirmation and execution
      triggerAssignAction({
        assignment: currentAssignment,
        selectedOfficer: isGroupAssignment
          ? { firstname: selectedGroup?.name || "Group", lastname: "" }
          : selectedOfficer,
        copiedEmployees,
        values,
        onAssign: async (formValues) => {
          const loadingMessage = message.loading(
            isGroupAssignment ? "Assigning task to group..." : "Assigning task to officer...",
            0
          );
          try {
            const payload: any = {
              deadlineTime: formValues.deadlineTime
                ? formValues.deadlineTime.format("HH:mm")
                : null,
              notes: formValues.notes,
              deadline: formValues.deadline,
              requiresAnalysis: formValues.requiresAnalysis,
              requiresInspection: formValues.requiresInspection,
              requiresPublicHearing: formValues.requiresPublicHearing,
            };

            if (isGroupAssignment) {
              payload.subDivisionId = formValues.subDivisionId;
            } else {
              payload.assignedTo = formValues.assignedTo;
              payload.copiedEmployees = formValues.copiedEmployees || [];
            }

            await assignNextStage({
              assignmentId: currentAssignment._id,
              payload,
            }).unwrap();

            loadingMessage();

            await Swal.fire({
              title: "Task Assigned!",
              text: isGroupAssignment
                ? `Task assigned successfully to group "${selectedGroup?.name}". The group head will manage the workflow.`
                : `Task assigned successfully to ${selectedOfficer?.firstname} ${selectedOfficer?.lastname}.`,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#2E7D32",
            });

            closeAssignModal();
            refetch();
          } catch (err: any) {
            loadingMessage();
            Swal.fire({
              title: "Failed to Assign",
              text:
                err?.data?.error ||
                err?.message ||
                "An unknown error occurred.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
            throw new Error("Task assignment failed");
          }
        },
      });
    } catch (err: any) {
      if (err?.errorFields) {
        message.error("Please fill in all required fields before proceeding.");
      } else if (err?.message !== "Task assignment failed") {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAssignBulk = async () => {
    try {
      // Validate form first
      const values = await bulkAssignForm.validateFields();

      // Find the selected officer details
      const selectedOfficers =
        activeEntityMembers?.data.filter((member: Officer) =>
          values.assignedToIds?.includes(member._id)
        ) || [];

      // Find copied employees details
      const copiedEmployees =
        activeEntityMembers?.data.filter((member: Officer) =>
          values.copiedEmployees?.includes(member._id)
        ) || [];

      // Use trigger action for confirmation and execution
      triggerBulkAssignAction({
        selectedCount: selectedIds.size,
        selectedOfficers,
        copiedEmployees,
        values,
        statusFilter: filters.statusFilter,
        onAssignBulk: async (formValues) => {
          const loadingMessage = message.loading(
            "Assigning tasks in bulk...",
            0
          );
          try {
            await assignNextStageBulk({
              payload: {
                ...formValues,
                deadlineTime: formValues.deadlineTime
                  ? formValues.deadlineTime.format("HH:mm")
                  : null,
                assignmentIds: Array.from(selectedIds),
                internalStatus: filters.statusFilter,
              },
            }).unwrap();

            loadingMessage();

            const officerNames = selectedOfficers
              .map(
                (officer: Officer) => `${officer.firstname} ${officer.lastname}`
              )
              .join(", ");

            await Swal.fire({
              title: "Tasks Assigned!",
              text:
                selectedOfficers.length > 0
                  ? `Tasks assigned successfully to ${officerNames}.`
                  : "Tasks assigned successfully.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#2E7D32",
            });

            closeBulkAssignModal();
            setSelectedIds(new Set());
            refetch();
          } catch (err: any) {
            loadingMessage();
            Swal.fire({
              title: "Failed to Assign",
              text:
                err?.data?.error ||
                err?.message ||
                "An unknown error occurred.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
            throw new Error("Task assignment failed");
          }
        },
      });
    } catch (err: any) {
      if (err?.errorFields) {
        message.error("Please fill in all required fields before proceeding.");
      } else if (err?.message !== "Task assignment failed") {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleReview = async (
    reviewAction: "approve" | "rework_officer" | "rework_applicant"
  ) => {
    try {
      if (!currentAssignment) return;
      // Validate form first
      const values = await reviewForm.validateFields(["reviewNotes"]);

      // Use trigger action for confirmation and execution
      triggerReviewAction({
        assignment: currentAssignment,
        reviewAction,
        notes: values.reviewNotes,
        onConfirm: async () => {
          const hideLoading = message.loading("Processing your review...", 0);

          try {
            await hodReviewCompletion({
              assignmentId: currentAssignment._id,
              payload: {
                action: reviewAction,
                notes: values.reviewNotes,
              },
            }).unwrap();

            hideLoading();

            // Action success messages
            const successConfig = {
              approve: {
                title: "Stage Completed",
                text: "Stage approved. Application advanced to the next stage.",
              },
              rework_officer: {
                title: "Rework Requested",
                text: "Rework request has been sent to the assigned officer.",
              },
              rework_applicant: {
                title: "Returned to Applicant",
                text: "The application has been returned for further input.",
              },
            };

            await Swal.fire({
              title: successConfig[reviewAction].title,
              text: successConfig[reviewAction].text,
              icon: "success",
              confirmButtonColor: "#2E7D32",
              confirmButtonText: "OK",
            });

            closeReviewModal();
            refetch();
          } catch (err: any) {
            hideLoading();

            await Swal.fire({
              title: "Review Failed",
              text:
                err?.data?.error ||
                err?.message ||
                "An unexpected error occurred.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });

            // Keep modal open by throwing
            throw new Error("Review processing failed");
          }
        },
      });
    } catch (err: any) {
      // Handle form validation errors
      if (err?.errorFields) {
        message.error("Please fill in all required fields before proceeding.");
      } else if (err?.message !== "Review processing failed") {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSkipStep = async (assignment: Assignment) => {
    triggerSkipAction({
      assignment,
      onSkip: async (reason: string) => {
        const hideLoading = message.loading("Skipping...", 0);
        try {
          await skipApplicationStep({
            assignmentId: assignment._id,
            payload: { notes: reason },
          }).unwrap();
          hideLoading();
          Swal.fire({
            title: "Skipped",
            icon: "success",
            confirmButtonColor: "#2E7D32",
          });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Error",
            text: err?.data?.error || "Skip failed",
            icon: "error",
          });
          throw err;
        }
      },
    });
  };

  const handleRevertStep = async (assignment: Assignment) => {
    triggerRevertAction({
      assignment,
      onRevert: async (reason: string) => {
        const hideLoading = message.loading(
          "Reverting to previous stage...",
          0
        );
        try {
          await revertApplicationStep({
            assignmentId: assignment._id,
            payload: { notes: reason },
          }).unwrap();
          hideLoading();
          Swal.fire({
            title: "Reverted",
            text: "Application has been moved to the previous stage.",
            icon: "success",
            confirmButtonColor: "#2E7D32",
          });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Error",
            text: err?.data?.error || "Revert failed",
            icon: "error",
          });
          throw err;
        }
      },
    });
  };

  const handleCallBackStage = async (assignment: Assignment) => {
    triggerRecallAction({
      assignment,
      onRecall: async (notes: string) => {
        const hideLoading = message.loading("Recalling assignment stage...", 0);
        try {
          await callBackStage({
            assignmentId: assignment._id,
            payload: { notes },
          }).unwrap();
          hideLoading();
          Swal.fire({
            title: "Assignment Stage Recalled!",
            text: `The current task for application ${assignment.applicationDetails?.code} has been returned to you for re-assignment.`,
            icon: "success",
            confirmButtonColor: "#2E7D32",
            confirmButtonText: "OK",
          });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Failed to Recall Stage",
            text:
              err?.data?.error || err?.message || "An unknown error occurred.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
          throw err;
        }
      },
    });
  };

  const handleReject = async (assignment: Assignment) => {
    triggerRejectAction({
      assignment,
      onReject: async (reason: string) => {
        const hideLoading = message.loading("Processing rejection...", 0);
        try {
          await rejectApplication({
            assignmentId: assignment._id,
            payload: {
              notes: reason,
              rejectionTimestamp: new Date().toISOString(),
              rejectedBy: "HOD",
            },
          }).unwrap();
          hideLoading();
          Swal.fire({ title: "Rejected", icon: "success" });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Error",
            text: err?.data?.error || "Rejection failed",
            icon: "error",
          });
          throw err;
        }
      },
    });
  };

  const handleRequestReport = async (assignment: Assignment) => {
    triggerReportRequestAction({
      assignment,
      reportTypesAndTemplates: reportTemplates,
      onSend: async (values: ReportRequestValues) => {
        const hideLoading = message.loading("Sending request...", 0);
        try {
          const formData = new FormData();
          formData.append("reportTypes", JSON.stringify(values.reportTypes));
          formData.append("dueDate", values.dueDate?.toISOString());
          formData.append("notes", values.notes || "");

          if (values.attachment) {
            formData.append("attachment", values.attachment);
          }

          await requestReport({
            assignmentId: assignment._id,
            payload: formData,
          }).unwrap();
          hideLoading();
          Swal.fire({
            title: "Sent",
            icon: "success",
            confirmButtonColor: "#2E7D32",
          });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Error",
            text: err?.data?.error || "Request failed",
            icon: "error",
          });
          throw err;
        }
      },
    });
  };

  const handleRequestCorrections = async (assignment: Assignment) => {
    triggerCorrectionRequestAction({
      assignment,
      onSend: async (values: CorrectionRequestValues) => {
        const hideLoading = message.loading("Sending correction request...", 0);
        try {
          const formData = new FormData();
          formData.append("notes", values.notes || "");
          if (values.attachments && values.attachments.length > 0) {
            values.attachments.forEach((file) => {
              formData.append("attachments", file);
            });
          }
          await requestCorrections({
            assignmentId: assignment._id,
            payload: formData,
          }).unwrap();
          hideLoading();
          Swal.fire({
            title: "Correction Request Sent",
            text: "The applicant has been notified.",
            icon: "success",
            confirmButtonColor: "#2E7D32",
          });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({
            title: "Error",
            text: err?.data?.error || "Request failed",
            icon: "error",
          });
          throw err;
        }
      },
    });
  };

  const handleHodFinalApproval = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsHodFinalApprovalModalOpen(true);
  };

  const [isHodFinalApprovalLoading, setIsHodFinalApprovalLoading] = useState(false);

  const handleHodFinalApprovalConfirm = async (notes: string) => {
    if (!currentAssignment) return;
    setIsHodFinalApprovalLoading(true);
    try {
      await hodFinalApproval({ assignmentId: currentAssignment._id, notes }).unwrap();
      setIsHodFinalApprovalModalOpen(false);
      setCurrentAssignment(null);
      Swal.fire({ title: "Approved!", text: "Final approval granted. Permit submitted for CEO signing.", icon: "success", confirmButtonColor: "#7c3aed" });
      refetch();
    } catch (err: any) {
      Swal.fire({ title: "Failed", text: err?.data?.error || "An error occurred.", icon: "error", confirmButtonColor: "#d33" });
    } finally {
      setIsHodFinalApprovalLoading(false);
    }
  };

  const handleDelegateTask = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsDelegationModalOpen(true);
  };

  const getMenu = (assignment: Assignment) =>
    getActionMenu(assignment, {
      openAssignModal,
      openReviewModal,
      handleCallBackStage,
      handleSkipStep,
      handleRevertStep,
      handleReject,
      handleRequestReport,
      handleRequestCorrections,
      setSelectedApplication,
      setAssignmentPlanModalOpen,
      handleHodFinalApproval,
      handleDelegateTask,
    });

  const assignments: Assignment[] = useMemo(() => {
    if (!assignmentsData?.data) return [];
    return [...assignmentsData.data].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [assignmentsData]);
  const pagination = assignmentsData?.pagination || {
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden" style={{ zoom }}>
      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-2 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: <><CalendarOutlined /><span>Assignments</span></> },
            { title: <span className="text-green-700 font-medium">Assignment Plan</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* Header section replacing PageContainer header */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
              HOD Assignment Dashboard
            </h1>
            <p className="text-xs text-gray-500 font-medium leading-tight">
              Application Management System
            </p>
          </div>
          {/* Page view toggle */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden ml-2">
            <button
              onClick={() => setPageView("assignments")}
              className={`px-3 py-1 text-[11px] font-semibold border-r border-gray-200 transition-colors ${
                pageView === "assignments" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              My Applications
            </button>
            <button
              onClick={() => setPageView("delegated")}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                pageView === "delegated" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ShareAltOutlined className="text-[10px]" />
              Cross-Office Tasks
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Font size toggle */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden">
            {ASSIGN_FONT_SIZES.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFontSize(f.key)}
                title={f.key === "sm" ? "Small" : f.key === "base" ? "Normal" : "Large"}
                className={`px-2 py-0.5 text-[10px] font-bold border-r last:border-r-0 border-gray-200 transition-colors ${
                  fontSizeKey === f.key ? "bg-green-700 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >{f.label}</button>
            ))}
          </div>
          <Popover
            trigger="click"
            placement="bottomRight"
            overlayClassName="whats-new-popover"
            overlayStyle={{ maxWidth: 380 }}
            content={
              <div className="w-[360px]">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <StarFilled className="text-amber-400 text-base" />
                  <span className="font-bold text-gray-900 text-sm">What's New in IPMS</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-[#0D4A2A] flex items-center justify-center flex-shrink-0">
                      <RobotOutlined className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 m-0">ARIA — AI Assignment Assistant</p>
                      <p className="text-xs text-gray-500 mt-0.5 m-0">
                        Click <span className="font-semibold text-[#0D4A2A]">Ask AI</span> on any assignment card to get real-time guidance on what action to take next, understand blockers, and navigate the workflow with confidence.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircleFilled className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 m-0">Request Corrections from Applicant</p>
                      <p className="text-xs text-gray-500 mt-0.5 m-0">
                        Use the <span className="font-semibold">⋮ menu</span> on any pending assignment to request corrections from the applicant — attach up to 10 reference files. The assignment stays at its current stage and the applicant is notified by email and SMS.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircleFilled className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 m-0">Request Reports from Client — Enhanced</p>
                      <p className="text-xs text-gray-500 mt-0.5 m-0">
                        Report types now support custom names — type any report not in the configured list. Due date is now optional. Attach a reference document (e.g. Terms of Reference) using the new drag-and-drop uploader.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircleFilled className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 m-0">Correction Notes Visible in All Portals</p>
                      <p className="text-xs text-gray-500 mt-0.5 m-0">
                        Correction notes and attached files sent to applicants are now visible in the client portal, admin portal, and staff portal — so all parties can see exactly what was requested.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 mb-0 text-right">IPMS · EPA Ghana</p>
              </div>
            }
          >
            <button
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:from-amber-600 hover:to-orange-600 transition-all duration-200 cursor-pointer border-0"
              style={{ boxShadow: "0 0 0 0 rgba(245,158,11,0.7)" }}
            >
              <span
                className="absolute -top-1 -right-1 flex h-3 w-3"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <BulbOutlined className="text-white text-xs" />
              What's New
            </button>
          </Popover>

          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
            size="small"
            className="rounded-md"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Delegated Tasks View */}
        {pageView === "delegated" ? (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center gap-2 mb-3">
              <ShareAltOutlined className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800 m-0">Cross-Office Tasks</h2>
              <span className="text-[10px] text-gray-400">— tasks sent to or received from other offices outside your department</span>
            </div>
            <DelegatedTasksTab />
          </div>
        ) : (
        <>
        <AssignmentFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCount={selectedIds.size}
          openBulkAssignModal={openBulkAssignModal}
        />



        {/* Content Section */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 relative custom-scrollbar">
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Spin spinning tip="Loading assignments..." />
            </div>
          )}
          {assignments?.length > 0 ? (
            <div className="pt-4 pb-20 px-4">
              {viewMode === "grid" ? (
                <AssignmentGrid
                  assignments={assignments}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  statusFilter={filters.statusFilter}
                  openAssignModal={openAssignModal}
                  openReviewModal={openReviewModal}
                  setSelectedApplication={setSelectedApplication}
                  setViewModalOpen={setViewModalOpen}
                  getActionMenu={getMenu}
                  getStageInfo={getStageInfo}
                  resolveApplicantName={resolveApplicantName}
                  onHodFinalApproval={handleHodFinalApproval}
                />
              ) : (
                <AssignmentList
                  assignments={assignments}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  statusFilter={filters.statusFilter}
                  openAssignModal={openAssignModal}
                  openReviewModal={openReviewModal}
                  setSelectedApplication={setSelectedApplication}
                  setViewModalOpen={setViewModalOpen}
                  getActionMenu={getMenu}
                  getStageInfo={getStageInfo}
                  resolveApplicantName={resolveApplicantName}
                  onHodFinalApproval={handleHodFinalApproval}
                />
              )}
            </div>
          ) : !isLoading && !isFetching ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 m-6 p-12">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <Empty description={false} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No Applications Found
              </h3>
              <p className="text-gray-500 text-center max-w-xs mb-6">
                We couldn't find any applications matching your current
                filters. Try adjusting your search or filter settings.
              </p>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  setFilters({
                    ...filters,
                    searchTerm: "",
                    statusFilter: "pending_assignments",
                  })
                }
                className="rounded-lg h-10 px-6"
              >
                Clear All Filters
              </Button>
            </div>
          ) : null}
        </div>
        </>
        )}
      </div>

      {/* Footer Pagination Section */}
      <div className="flex justify-center w-full py-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <AntPagination
          locale={enUS.Pagination}
          current={filters.page}
          pageSize={filters.limit}
          total={pagination.total}
          pageSizeOptions={["10", "15", "25", "50", "100"]}
          onChange={(page, pageSize) =>
            setFilters((prev) => ({
              ...prev,
              page,
              limit: pageSize || 10,
            }))
          }
          showSizeChanger
          showTotal={(total, range) => (
            <span className="text-gray-500 font-medium text-xs">
              Showing{" "}
              <span className="text-gray-900">
                {range[0]}-{range[1]}
              </span>{" "}
              of <span className="text-gray-900">{total}</span> records
            </span>
          )}
          className="modern-pagination"
          size="small"
          responsive
        />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        .modern-pagination .ant-pagination-item-active {
          border-color: #2563eb;
          background: #2563eb;
        }
        .modern-pagination .ant-pagination-item-active a {
          color: white !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .group {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Full Width Overrides */
        .ant-pro-page-container-children-content {
          padding: 0 !important;
          max-width: 100% !important;
        }
        .ant-pro-page-container-content {
          padding: 0 !important;
          max-width: 100% !important;
        }
        .ant-pro-grid-content-children {
          max-width: 100% !important;
        }
      `}</style>

      {viewModalOpen && (
        <ApplicationReview
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={selectedApplication?.application}
          applicationType={
            selectedApplication?.applicationType == "AuthorizationApplication"
              ? "authorization"
              : selectedApplication?.applicationType == "LicenseApplication"
              ? "license"
              : selectedApplication?.applicationType == "EfficacyTrial"
              ? "efficacy-trial"
              : "permit"
          }
        />
      )}

      {/* Bulk Assignment */}
      <BulkAssignModal
        isBulkAssignModalOpen={isBulkAssignModalOpen}
        closeBulkAssignModal={closeBulkAssignModal}
        selectedIds={selectedIds}
        form={bulkAssignForm}
        handleAssignBulk={handleAssignBulk}
        isLoadingMembers={isLoadingMembers}
        activeEntityMembers={activeEntityMembers}
        isAssigning={isAssigning}
        getStageInfo={getStageInfo}
        statusFilter={filters.statusFilter}
      />

      {/* single assignment */}
      <AssignModal
        isAssignModalOpen={isAssignModalOpen}
        closeAssignModal={closeAssignModal}
        currentAssignment={currentAssignment}
        form={singleAssignForm}
        handleAssign={handleAssign}
        isLoadingMembers={isLoadingMembers}
        activeEntityMembers={activeEntityMembers}
        isAssigning={isAssigning}
        getStageInfo={getStageInfo}
        subDivisions={subDivisions}
        isLoadingSubDivisions={isLoadingSubDivisions}
      />

      {isReviewModalOpen && (
        <ReviewModal
          isReviewModalOpen={isReviewModalOpen}
          closeReviewModal={closeReviewModal}
          currentAssignment={currentAssignment}
          form={reviewForm}
          handleReview={handleReview}
          isReviewing={isReviewing}
          getStageInfo={getStageInfo}
        />
      )}

      {assignmentPlanModalOpen && (
        <AssignmentPlanModal
          isOpen={assignmentPlanModalOpen}
          onClose={() => setAssignmentPlanModalOpen(false)}
          applicationId={selectedApplication?.application}
        />
      )}

      {isHodFinalApprovalModalOpen && (
        <HodFinalApprovalModal
          isOpen={isHodFinalApprovalModalOpen}
          onClose={() => {
            setIsHodFinalApprovalModalOpen(false);
            setCurrentAssignment(null);
          }}
          currentAssignment={currentAssignment}
          onConfirm={handleHodFinalApprovalConfirm}
          isLoading={isHodFinalApprovalLoading}
        />
      )}

      <RequestDelegationModal
        open={isDelegationModalOpen}
        onClose={() => {
          setIsDelegationModalOpen(false);
          setCurrentAssignment(null);
        }}
        assignment={currentAssignment}
        onSuccess={() => refetch()}
      />

      {pageView === "assignments" && (
        <RemindersWidget
          onSearchApp={(appCode) => {
            setFilters((prev) => ({ ...prev, searchTerm: appCode, page: 1 }));
            setDebouncedSearchTerm(appCode);
          }}
        />
      )}
    </div>
  );
}

export default HodAssignmentsPage;
