import  { useState, useEffect, useMemo } from "react";
import {
  Button,
  Spin,
  Empty,
  Form,
  message,
  Pagination as AntPagination,
  Breadcrumb,
} from "antd";
import {
  ReloadOutlined,
  ApartmentOutlined,
  HomeOutlined,
  CalendarOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  useGetGroupHeadAssignmentsQuery,
  useAssignNextStageMutation,
  useHodReviewCompletionMutation,
  useSkipAssignmentStageMutation,
  useRevertStageMutation,
  useCallBackAssignedStageMutation,
  useRejectAssignmentAndApplicationMutation,
  useRequestReportFromClientMutation,
  useRequestCorrectionsFromClientMutation,
} from "@/redux/features/employee-portal-api/application/assignment";
import { useEntityStaffsQuery } from "@/redux/features/employee-portal-api/entityApi";
import { useGetSubDivisionQuery } from "@/redux/features/employee-portal-api/subdivisionApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import "dayjs/locale/en";
dayjs.locale("en");
import { getStageInfo } from "@/employee_portal_pages/components/assignment-plan/helpers";
import { ReviewModal } from "@/employee_portal_pages/components/assignment-plan/review-modal";
import { AssignModal } from "@/employee_portal_pages/components/assignment-plan/assign-modal";
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
  ReportRequestValues,
  CorrectionRequestValues,
} from "@/employee_portal_pages/components/assignment-plan/assignment-confirmations";
import { AssignmentGrid } from "@/employee_portal_pages/components/assignment-plan/AssignmentGrid";
import { AssignmentList } from "@/employee_portal_pages/components/assignment-plan/AssignmentList";
import { AssignmentFilters } from "@/employee_portal_pages/components/assignment-plan/AssignmentFilters";
import { useReportTemplatesFullListQuery } from "@/redux/features/employee-portal-api/general";
import ApplicationReview from "@/employee_portal_pages/components/assignment-plan/application-review";
import DelegatedTasksTab from "@/employee_portal_pages/components/assignment-plan/DelegatedTasksTab";
import RequestDelegationModal from "@/employee_portal_pages/components/assignment-plan/RequestDelegationModal";
import RemindersWidget from "@/employee_portal_pages/components/assignment-plan/RemindersWidget";
import enUS from "antd/locale/en_US";

const ASSIGN_FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

function GroupHeadAssignmentsPage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("assign-font-size") || "base"
  );
  const zoom = ASSIGN_FONT_SIZES.find((f) => f.key === fontSizeKey)?.zoom ?? 1;
  const handleFontSize = (key: string) => { setFontSizeKey(key); localStorage.setItem("assign-font-size", key); };

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

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filters.searchTerm);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Assignment | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [assignmentPlanModalOpen, setAssignmentPlanModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [pageView, setPageView] = useState<"assignments" | "delegated">(
    (searchParams.get("tab") as "assignments" | "delegated") || "assignments"
  );
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);

  // Sync filters to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.page !== 1) params.page = filters.page.toString();
    if (filters.limit !== 15) params.limit = filters.limit.toString();
    if (filters.searchTerm) params.search = filters.searchTerm;
    if (filters.statusFilter !== "pending_assignments") params.status = filters.statusFilter;
    if (filters.sortField !== "updatedAt") params.sortField = filters.sortField;
    if (filters.sortOrder !== "desc") params.sortOrder = filters.sortOrder;
    if (viewMode !== "grid") params.view = viewMode;
    if (pageView !== "assignments") params.tab = pageView;
    setSearchParams(params, { replace: true });
  }, [filters, viewMode, pageView, setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(filters.searchTerm), 500);
    return () => clearTimeout(handler);
  }, [filters.searchTerm]);

  const queryParams = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data: assignmentsData, isLoading, isFetching, refetch } =
    useGetGroupHeadAssignmentsQuery(queryParams, { refetchOnMountOrArgChange: true });

  const { data: entityMembers, isLoading: isLoadingMembers } = useEntityStaffsQuery({
    page: 1,
    limit: 500,
    searchTerm: "",
    sortField: "firstname",
    sortOrder: "asc",
    entity_id: employee?.entity?._id || employee?.entity_id,
  });

  const currentSubDivisionId = (currentAssignment as any)?.subDivisionId as string | undefined;
  const { data: subDivisionData } = useGetSubDivisionQuery(currentSubDivisionId!, {
    skip: !currentSubDivisionId || !isAssignModalOpen,
  });

  const activeEntityMembers = useMemo(() => {
    if (!entityMembers?.data) return { data: [] as Officer[] };
    const allActive = entityMembers.data.filter(
      (member: Officer) =>
        member?.status?.toLowerCase() === "active" || member?.is_active === true
    );

    if (currentSubDivisionId && subDivisionData?.data) {
      const subdivision = subDivisionData.data;
      const allowedIds = new Set<string>([
        ...(subdivision.members || []).map((m: any) => (m._id || m).toString()),
        (subdivision.head?._id || subdivision.head)?.toString(),
      ].filter(Boolean));
      return { ...entityMembers, data: allActive.filter((m: Officer) => allowedIds.has((m as any)._id?.toString())) };
    }

    return { ...entityMembers, data: allActive };
  }, [entityMembers, currentSubDivisionId, subDivisionData, isAssignModalOpen]);

  const { data: reportTemplatesData } = useReportTemplatesFullListQuery({});
  const reportTemplates = reportTemplatesData?.data || [];

  const [assignNextStage, { isLoading: isAssigning }] = useAssignNextStageMutation();
  const [hodReviewCompletion, { isLoading: isReviewing }] = useHodReviewCompletionMutation();
  const [skipApplicationStep] = useSkipAssignmentStageMutation();
  const [revertApplicationStep] = useRevertStageMutation();
  const [callBackStage] = useCallBackAssignedStageMutation();
  const [rejectApplication] = useRejectAssignmentAndApplicationMutation();
  const [requestReport] = useRequestReportFromClientMutation();
  const [requestCorrections] = useRequestCorrectionsFromClientMutation();

  const [singleAssignForm] = Form.useForm();
  const [reviewForm] = Form.useForm();

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const openAssignModal = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setCurrentAssignment(null);
    singleAssignForm.resetFields();
  };

  const openReviewModal = (assignment: Assignment) => {
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
      const values = await singleAssignForm.validateFields();
      const selectedOfficer = activeEntityMembers?.data.find(
        (member: Officer) => member._id === values.assignedTo
      );
      const copiedEmployees =
        activeEntityMembers?.data.filter((member: Officer) =>
          values.copiedEmployees?.includes(member._id)
        ) || [];

      triggerAssignAction({
        assignment: currentAssignment,
        selectedOfficer,
        copiedEmployees,
        values,
        onAssign: async (formValues) => {
          const loadingMessage = message.loading("Assigning task...", 0);
          try {
            await assignNextStage({
              assignmentId: currentAssignment._id,
              payload: {
                ...formValues,
                deadlineTime: formValues.deadlineTime
                  ? formValues.deadlineTime.format("HH:mm")
                  : null,
              },
            }).unwrap();
            loadingMessage();
            await Swal.fire({
              title: "Task Assigned!",
              text: `Task assigned to ${selectedOfficer?.firstname} ${selectedOfficer?.lastname}.`,
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
              text: err?.data?.error || err?.message || "An unknown error occurred.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        },
      });
    } catch {}
  };

  const handleReview = async (reviewAction: "approve" | "rework_officer" | "rework_applicant") => {
    try {
      if (!currentAssignment) return;
      const values = await reviewForm.validateFields(["reviewNotes"]);
      triggerReviewAction({
        assignment: currentAssignment,
        reviewAction,
        notes: values.reviewNotes,
        onConfirm: async () => {
          const loadingMessage = message.loading("Processing review...", 0);
          try {
            await hodReviewCompletion({
              assignmentId: currentAssignment._id,
              payload: { action: reviewAction, notes: values.reviewNotes },
            }).unwrap();
            loadingMessage();
            await Swal.fire({
              title: "Review Submitted",
              text: "Review action processed successfully.",
              icon: "success",
              confirmButtonColor: "#2E7D32",
            });
            closeReviewModal();
            refetch();
          } catch (err: any) {
            loadingMessage();
            Swal.fire({
              title: "Review Failed",
              text: err?.data?.error || err?.message || "An unknown error occurred.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
            throw err;
          }
        },
      });
    } catch {}
  };

  const handleSkipStep = async (assignment: Assignment) => {
    await triggerSkipAction({
      assignment,
      onSkip: async (reason: string) => {
        await skipApplicationStep({ assignmentId: assignment._id, payload: { notes: reason } }).unwrap();
        refetch();
      },
    });
  };

  const handleRevertStep = async (assignment: Assignment) => {
    await triggerRevertAction({
      assignment,
      onRevert: async (payload: any) => {
        await revertApplicationStep({ assignmentId: assignment._id, payload }).unwrap();
        refetch();
      },
    });
  };

  const handleCallBackStage = async (assignment: Assignment) => {
    await triggerRecallAction({
      assignment,
      onRecall: async (reason: string) => {
        await callBackStage({ assignmentId: assignment._id, payload: { notes: reason } }).unwrap();
        refetch();
      },
    });
  };

  const handleReject = async (assignment: Assignment) => {
    await triggerRejectAction({
      assignment,
      onReject: async (payload: any) => {
        await rejectApplication({ assignmentId: assignment._id, payload }).unwrap();
        refetch();
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
          if (values.attachment) formData.append("attachment", values.attachment);
          await requestReport({ assignmentId: assignment._id, payload: formData }).unwrap();
          hideLoading();
          Swal.fire({ title: "Sent", icon: "success", confirmButtonColor: "#2E7D32" });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({ title: "Error", text: err?.data?.error || "Request failed", icon: "error" });
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
            values.attachments.forEach((file: any) => {
              formData.append("attachments", file);
            });
          }
          await requestCorrections({ assignmentId: assignment._id, payload: formData }).unwrap();
          hideLoading();
          Swal.fire({ title: "Correction Request Sent", text: "The applicant has been notified.", icon: "success", confirmButtonColor: "#2E7D32" });
          refetch();
        } catch (err: any) {
          hideLoading();
          Swal.fire({ title: "Error", text: err?.data?.error || "Request failed", icon: "error" });
          throw err;
        }
      },
    });
  };

  const resolveApplicantName = (clientDetails: any) => {
    if (!clientDetails) return "Unknown Applicant";
    switch (clientDetails.userType) {
      case "individual": return `${clientDetails.firstName ?? ""} ${clientDetails.lastName ?? ""}`.trim();
      case "organization": return clientDetails.organizationName || "Unknown Organization";
      case "government": return clientDetails.agencyName || "Unknown Agency";
      default: return clientDetails.firstName || clientDetails.organizationName || clientDetails.agencyName || "Unknown Applicant";
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
      handleDelegateTask,
    });

  const assignments: Assignment[] = useMemo(() => {
    if (!assignmentsData?.data) return [];
    return [...assignmentsData.data].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [assignmentsData]);

  const pagination = assignmentsData?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden" style={{ zoom }}>
      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-2 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: <><CalendarOutlined /><span>Assignments</span></> },
            { title: <span className="text-green-700 font-medium">My Group Dashboard</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <ApartmentOutlined className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
              Group Assignment Dashboard
            </h1>
            <p className="text-xs text-gray-500 font-medium leading-tight">
              Applications assigned to your group
            </p>
          </div>
          {/* Page view toggle */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden ml-2">
            <button
              onClick={() => setPageView("assignments")}
              className={`px-3 py-1 text-[11px] font-semibold border-r border-gray-200 transition-colors ${
                pageView === "assignments" ? "bg-purple-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
                  fontSizeKey === f.key ? "bg-purple-700 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >{f.label}</button>
            ))}
          </div>
          <Button
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

      {/* Note Banner */}
      <div className="bg-purple-50 border-b border-purple-200 px-4 py-2">
        <p className="text-xs text-purple-700">
          <strong>Group Head Mode:</strong> You manage the full workflow for these applications. Assign stages to your group members, review their work, and approve stages. When you approve the issuance stage, it will be escalated to your HOD for final sign-off before CEO signing.
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {pageView === "delegated" ? (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center gap-2 mb-3">
              <ShareAltOutlined className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800 m-0">Cross-Office Tasks</h2>
              <span className="text-[10px] text-gray-400">— tasks sent to or received from other offices outside your group</span>
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
          openBulkAssignModal={() => {}}
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
                We couldn't find any applications matching your current filters. Try adjusting your search or filter settings.
              </p>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: "",
                    statusFilter: "pending_assignments",
                  }))
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

      {/* Footer Pagination */}
      <div className="flex justify-center w-full py-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <AntPagination
          locale={enUS.Pagination}
          current={filters.page}
          pageSize={filters.limit}
          total={pagination.total}
          pageSizeOptions={["10", "15", "25", "50", "100"]}
          onChange={(page, pageSize) =>
            setFilters((prev) => ({ ...prev, page, limit: pageSize || 15 }))
          }
          showSizeChanger
          showTotal={(total, range) => (
            <span className="text-gray-500 font-medium text-xs">
              Showing{" "}
              <span className="text-gray-900">{range[0]}-{range[1]}</span>{" "}
              of <span className="text-gray-900">{total}</span> records
            </span>
          )}
          className="modern-pagination"
          size="small"
          responsive
        />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .modern-pagination .ant-pagination-item-active { border-color: #7c3aed; background: #7c3aed; }
        .modern-pagination .ant-pagination-item-active a { color: white !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ant-pro-page-container-children-content { padding: 0 !important; max-width: 100% !important; }
        .ant-pro-page-container-content { padding: 0 !important; max-width: 100% !important; }
        .ant-pro-grid-content-children { max-width: 100% !important; }
      `}</style>

      {/* Assign Modal */}
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
      />

      {/* Review Modal */}
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

      {/* Application View Modal */}
      {viewModalOpen && (
        <ApplicationReview
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={selectedApplication?.application}
          applicationType={
            selectedApplication?.applicationType === "AuthorizationApplication"
              ? "authorization"
              : selectedApplication?.applicationType === "LicenseApplication"
              ? "license"
              : selectedApplication?.applicationType === "EfficacyTrial"
              ? "efficacy-trial"
              : "permit"
          }
        />
      )}

      {/* Assignment Plan Modal */}
      {assignmentPlanModalOpen && selectedApplication && (
        <AssignmentPlanModal
          isOpen={assignmentPlanModalOpen}
          onClose={() => setAssignmentPlanModalOpen(false)}
          applicationId={selectedApplication._id || (selectedApplication as any).application?._id}
        />
      )}

      {/* Request Delegation Modal */}
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

export default GroupHeadAssignmentsPage;
