import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Spin,
  Input,
  Empty,
  Tag,
  Pagination as AntPagination,
  Typography,
  Badge,
  Select,
  Modal,
  Form,
  Collapse,
  Breadcrumb,
} from "antd";
import { CheckCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  ProfileOutlined,
  SearchOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  FilterOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { useFetchAssignmentPlanForStaffQuery, useGetMyDelegatedTasksQuery, useCompleteDelegatedTaskMutation } from "@/redux/features/employee-portal-api/application/assignment";
import { formatDate, formatDate2, normalizeText } from "@/utils/helperFunction";
import { getDaysUntilDeadline } from "@/utils/helpers";
import { DeadlineDisplay, ProcessingTypeTag } from "@/employee_portal_pages/components/assignment-plan/assignment-items";
import enUS from "antd/locale/en_US";
import "dayjs/locale/en";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import ViewApplicationDetail from "@/employee_portal_pages/components/assignment-plan/application-review";

import { BsPersonWorkspace } from "react-icons/bs";
dayjs.locale("en");

const ASSIGN_FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

function OfficerTasksPage() {
  const navigate = useNavigate();
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("assign-font-size") || "base"
  );
  const zoom = ASSIGN_FONT_SIZES.find((f) => f.key === fontSizeKey)?.zoom ?? 1;
  const handleFontSize = (key: string) => { setFontSizeKey(key); localStorage.setItem("assign-font-size", key); };

  // Initialize viewType from localStorage with fallback to "grid"
  const [viewType, setViewType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('officer-tasks-view-type') || "grid";
    }
    return "grid";
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>({});
  const [applicationType, setApplicationType] = useState<any>({});

  // Handle view type change with persistence
  const handleViewTypeChange = (newViewType: string) => {
    setViewType(newViewType);
    if (typeof window !== 'undefined') {
      localStorage.setItem('officer-tasks-view-type', newViewType);
    }
  };

  const openViewApplicationModal = (app, applicationType) => {
    setSelectedApplication(app._id);
    setApplicationType(applicationType);
    setViewModalOpen(true);
  };

  // --- State Management ---
  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
    searchTerm: "",
    statusFilter: "in_progress",
    sortField: "updatedAt",
    sortOrder: "desc",
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // --- RTK Query & Hooks ---
  const queryParams = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );
  const {
    data: tasksData,
    isLoading,
    refetch,
  } = useFetchAssignmentPlanForStaffQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: myDelegatedData, isLoading: isDelegatedLoading, refetch: refetchDelegated } = useGetMyDelegatedTasksQuery({}, { refetchOnMountOrArgChange: true });
  const [completeDelegatedTask, { isLoading: isCompletingDelegated }] = useCompleteDelegatedTaskMutation();
  const [completeDelModal, setCompleteDelModal] = useState(false);
  const [selectedDelItem, setSelectedDelItem] = useState<any>(null);
  const [completeDelForm] = Form.useForm();

  const myDelegatedItems: any[] = (myDelegatedData?.data || [])
    .flatMap((assignment: any) =>
      (assignment.delegations || []).map((d: any) => ({ ...d, assignment }))
    )
    .filter((item: any) => item.status === "pending" || item.status === "in_progress")
    .sort((a: any, b: any) => dayjs(b.requestedAt).valueOf() - dayjs(a.requestedAt).valueOf());

  const handleCompleteDelegated = async () => {
    try {
      const values = await completeDelForm.validateFields();
      await completeDelegatedTask({
        assignmentId: selectedDelItem.assignment._id,
        delegationId: selectedDelItem._id,
        formData: (() => { const fd = new FormData(); fd.append("result", values.result || ""); return fd; })(),
      }).unwrap();
      Swal.fire({ title: "Done", text: "Task marked as complete", icon: "success", timer: 1800, showConfirmButton: false });
      setCompleteDelModal(false);
      refetchDelegated();
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err?.data?.error || "Failed", icon: "error" });
    }
  };

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
        return clientDetails.organizationName || clientDetails.agencyName || `${clientDetails.firstName ?? ""} ${clientDetails.lastName ?? ""}`.trim() || "Unknown Applicant";
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Task priority indicator
  const TaskPriorityIndicator = ({ item }) => {
    const deadlineInfo = getDaysUntilDeadline(item.task.deadline, item.task.deadlineTime);
    const isOverdue = deadlineInfo.color === "red" || deadlineInfo.color === "error";
    const isUrgent = deadlineInfo.color === "orange" || deadlineInfo.color === "warning";

    if (isOverdue) {
      return <Badge status="error" text="Overdue" />;
    } else if (isUrgent) {
      return <Badge status="warning" text="Urgent" />;
    } else {
      return <Badge status="success" text="On Track" />;
    }
  };

  // Action buttons component
  const TaskActionButtons = ({ item }) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        type="default"
        size="small"
        icon={<EyeOutlined />}
        onClick={() =>
          openViewApplicationModal(item.application, item.applicationType)
        }
        className="w-full sm:w-auto text-xs"
      >
        <span className="hidden sm:inline">View App</span>
        <span className="sm:hidden">View</span>
      </Button>

      <Button
        type="primary"
        size="small"
        icon={<BsPersonWorkspace />}
        onClick={() => navigate(`workspace/${item.application._id}`)}
        className="bg-green-600 hover:!bg-green-700 w-full sm:w-auto text-xs"
      >
        <span className="hidden sm:inline">Workspace</span>
        <span className="sm:hidden">Work</span>
      </Button>
    </div>
  );

  const tasks = tasksData?.data || [];

  const pagination = tasksData?.pagination || {
    total: 0,
    page: 1,
    limit: 5,
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
            { title: <span className="text-green-700 font-medium">My Assignments</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* Header section replacing PageContainer header */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
              My Active Tasks
            </h1>
            <p className="text-xs text-gray-500 font-medium leading-tight">
              EPA Ghana Officer Workspace
            </p>
          </div>
          <span className="hidden sm:block text-gray-500 font-medium bg-blue-50 px-3 py-1 rounded-full text-xs">
            {tasks.length} Pending Task(s)
          </span>
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
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
            size="small"
            className="rounded-md"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Enhanced Filter Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search by ID, Title, or Stage..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="max-w-md rounded-lg h-10 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all shadow-sm"
                allowClear
              />

              <Select
                prefix={<FilterOutlined className="text-gray-400" />}
                placeholder="Filter by Status"
                value={filters.statusFilter}
                onChange={(value) => handleFilterChange("statusFilter", value)}
                className="w-48 h-10 custom-select"
                options={[
                  { label: "Active Tasks", value: "in_progress" },
                  { label: "Completed Tasks", value: "completed" },
                  { label: "Recalled Tasks", value: "recalled" },
                ]}
              />

              <div className="flex items-center gap-3">
                <Badge
                  status="error"
                  text={`${
                    tasks.filter((t) => {
                      const info = getDaysUntilDeadline(
                        t.task.deadline,
                        t.task.deadlineTime
                      );
                      return info?.color === "red" || info?.color === "error";
                    }).length
                  } Overdue`}
                  className="text-xs font-semibold"
                />
                <Badge
                  status="warning"
                  text={`${
                    tasks.filter((t) => {
                      const info = getDaysUntilDeadline(
                        t.task.deadline,
                        t.task.deadlineTime
                      );
                      return info?.color === "orange" || info?.color === "warning";
                    }).length
                  } Urgent`}
                  className="text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1.5 rounded-xl flex items-center border border-gray-200 shadow-sm">
                <Button
                  type={viewType === "grid" ? "primary" : "text"}
                  icon={<AppstoreOutlined />}
                  onClick={() => handleViewTypeChange("grid")}
                  className={`rounded-lg transition-all px-4 h-9 flex items-center gap-2 ${
                    viewType === "grid"
                      ? "shadow-md bg-blue-600"
                      : "text-gray-500 hover:text-blue-600 font-medium"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Grid
                  </span>
                </Button>
                <Button
                  type={viewType === "list" ? "primary" : "text"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => handleViewTypeChange("list")}
                  className={`rounded-lg transition-all px-4 h-9 flex items-center gap-2 ${
                    viewType === "list"
                      ? "shadow-md bg-blue-600"
                      : "text-gray-500 hover:text-blue-600 font-medium"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    List
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delegated Tasks Panel */}
        {myDelegatedItems.length > 0 && (
          <div className="mx-4 mt-2">
            <Collapse
              size="small"
              defaultActiveKey={["delegated"]}
              className="bg-blue-50 border border-blue-200 rounded-lg"
              items={[{
                key: "delegated",
                label: (
                  <div className="flex items-center gap-2">
                    <ShareAltOutlined className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">
                      Tasks Assigned to Me by My HOD
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {myDelegatedItems.length}
                    </span>
                  </div>
                ),
                children: (
                  <Spin spinning={isDelegatedLoading}>
                    <div className="flex flex-col gap-2">
                      {myDelegatedItems.map((item: any) => {
                        const app = item.assignment?.application;
                        const appCode = app?.code || item.assignment?.applicationType || "Application";
                        return (
                          <div key={`${item.assignment._id}-${item._id}`}
                            className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex items-start justify-between gap-2 shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-[11px] text-gray-800">{item.taskType}</span>
                                <Tag color={item.status === "in_progress" ? "blue" : "orange"} className="text-[10px]">
                                  {item.status.replace("_", " ").toUpperCase()}
                                </Tag>

                              </div>
                              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{appCode}</p>
                              <p className="text-[11px] text-gray-600 mt-1 leading-snug">{item.description}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                From: <span className="text-gray-600 font-medium">{item.fromEntity?.name || "—"}</span>
                                {" · "}{dayjs(item.requestedAt).fromNow()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 flex-shrink-0">
                              <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() =>
                                  openViewApplicationModal(
                                    item.assignment?.application,
                                    item.assignment?.applicationType
                                  )
                                }
                              >
                                View App
                              </Button>
                              <Button
                                size="small"
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                className="!bg-green-700 !border-green-700"
                                onClick={() => {
                                  setSelectedDelItem(item);
                                  completeDelForm.resetFields();
                                  setCompleteDelModal(true);
                                }}
                              >
                                Complete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Spin>
                ),
              }]}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <Spin spinning={isLoading} tip="Loading tasks..." className="h-full">
            {tasks.length > 0 ? (
              <div
                key={`${filters.statusFilter}-${debouncedSearchTerm}-${filters.page}-${viewType}`}
                className="h-full overflow-y-auto pt-4 pb-20 px-4 custom-scrollbar"
                style={{ maxHeight: "calc(100vh - 190px)" }}
              >
                  {/* Grid View */}
                  {viewType === "grid" && (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-6">
                      {tasks.map((item) => (
                        <Card
                          key={item._id}
                          className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white h-full"
                          styles={{ body: { padding: 0 } }}
                        >
                          <div className="p-5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                                  <ProfileOutlined />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-bold text-gray-900 uppercase line-clamp-1 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                                    {normalizeText(item.task.stageName)}
                                  </h3>
                                  <div className="mb-2">
                                    <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-tight line-clamp-1">
                                      {resolveApplicantName(item.application.clientId)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{item.application.code}</span>
                                    <ProcessingTypeTag processingType={item.application?.processingType} compact={true} minimal={true} />
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      Assigned: {formatDate2(item.task.startedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {item.task.deadline && (
                                <DeadlineDisplay
                                  deadline={item.task.deadline}
                                  deadlineTime={item.task.deadlineTime}
                                />
                              )}
                            </div>

                            <div className="mb-4">
                              <p className="text-xs text-gray-500 font-medium line-clamp-2 italic mb-3">
                                {item.application.title}
                              </p>
                              
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority</span>
                                <TaskPriorityIndicator item={item} />
                              </div>
                            </div>

                            {item.task.notes && (
                              <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Instructions</p>
                                <Typography.Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                    symbol: (expanded) => (
                                      <span className="text-blue-600 cursor-pointer text-xs font-semibold ml-1">
                                        {expanded ? "Less" : "More"}
                                      </span>
                                    ),
                                  }}
                                  className="text-[11px] text-gray-600 mb-0 leading-relaxed"
                                >
                                  {item.task.notes}
                                </Typography.Paragraph>
                              </div>
                            )}

                            <div className="mt-auto pt-4 border-t border-gray-50">
                              <TaskActionButtons item={item} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewType === "list" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Application & Applicant</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stage & Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {tasks.map((item, index) => (
                            <tr key={item._id} className="hover:!bg-blue-50/30 transition-colors group">
                              <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shadow-xs">
                                    <ProfileOutlined />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 leading-tight">{item.application.title}</h4>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">
                                      {resolveApplicantName(item.application.clientId)}
                                    </p>
                                    <div className="flex gap-2 items-center mt-1">
                                      <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1 rounded uppercase tracking-tighter">{item.application.code}</span>
                                      <ProcessingTypeTag processingType={item.application?.processingType} minimal={true} />
                                      <span className="text-[10px] text-gray-400">Assigned: {formatDate(item.task.startedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5">
                                  <Tag className="m-0 px-2 py-0 text-[10px] font-bold uppercase w-fit bg-gray-100 border-none text-gray-600">
                                    {normalizeText(item.task.stageName)}
                                  </Tag>
                                  <TaskPriorityIndicator item={item} />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {item.task.deadline ? (
                                  <DeadlineDisplay
                                    deadline={item.task.deadline}
                                    deadlineTime={item.task.deadlineTime}
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400 italic">No deadline</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <TaskActionButtons item={item} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 m-6 p-12">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <Empty description={false} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Tasks</h3>
                  <p className="text-gray-500 text-center max-w-xs mb-6">
                    You don't have any active tasks assigned to you at the moment.
                  </p>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => setFilters({ ...filters, searchTerm: "" })}
                    className="rounded-lg h-10 px-6"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </Spin>
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
                  Showing <span className="text-gray-900">{range[0]}-{range[1]}</span> of <span className="text-gray-900">{total}</span> tasks
                </span>
              )}
              className="modern-pagination"
              size="small"
              responsive
            />
          </div>
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

        /* Full Width Overrides if any Pro components are still used sub-components */
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
        <ViewApplicationDetail
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={selectedApplication}
          applicationType={
            applicationType == "AuthorizationApplication"
              ? "authorization"
              : applicationType == "LicenseApplication"
              ? "license"
              : applicationType == "EfficacyTrial"
              ? "efficacy-trial"
              : "permit"
          }
        />
      )}

      <Modal
        open={completeDelModal}
        onCancel={() => setCompleteDelModal(false)}
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-600" />
            <span className="text-sm font-bold">Complete Delegated Task</span>
          </div>
        }
        footer={[
          <Button key="cancel" onClick={() => setCompleteDelModal(false)}>Cancel</Button>,
          <Button
            key="ok"
            type="primary"
            loading={isCompletingDelegated}
            onClick={handleCompleteDelegated}
            className="!bg-green-700 !border-green-700"
          >
            Mark Complete
          </Button>,
        ]}
        width={480}
      >
        <div className="mb-3 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
          Task: <strong>{selectedDelItem?.taskType}</strong>
          <br />
          {selectedDelItem?.description}
        </div>
        <Form form={completeDelForm} layout="vertical">
          <Form.Item
            name="result"
            label="Summary / Result"
            rules={[{ required: true, message: "Please provide a summary of what was done" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe what was done, findings, outcomes..." maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default OfficerTasksPage;
