import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Drawer, Pagination, Table, Tooltip, Select, Tag, Space, Popconfirm, message } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";
import { DeleteOutlined, EyeOutlined, HistoryOutlined, ProjectOutlined } from "@ant-design/icons";
import TransferHistoryDrawer from "@/employee_portal_pages/components/application/transfer-history-drawer";
import AdminAssignmentPlanModal from "@/components/application-preview/admin-assignment-plan-modal";
import { useDeleteSubmittedApplicationMutation, useGetAdminPermitApplicationsQuery } from "../../redux/features/general/client-applications";
import { formatDate4, normalizeText } from "../../utils/helperFunction";
import AdminApplicationPreview from "@/components/application-preview/admin-application-preview";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import {
  permitTypes,
  statusOptions,
  getStatusBadge,
} from "@/employee_portal_pages/lib/helpers";


const { Option } = Select;


const PermitApplications = () => {
  PageTitle("Permit Applications | EPA Ghana Admin");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [status, setStatus] = useState("");
  const [permitType, setPermitType] = useState("");
  const [assigningEntity, setAssigningEntity] = useState("");
  const [view, setView] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [transferHistoryOpen, setTransferHistoryOpen] = useState(false);
  const [selectedTransferApp, setSelectedTransferApp] = useState<any | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryAppId, setSelectedHistoryAppId] = useState<string | null>(null);
  const { data: entitiesData } = useEntityFullListQuery({ designation: "" });
  const entities = entitiesData?.data || [];

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminPermitApplicationsQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
      status,
      permitType,
      assigningEntity,
      view,
      startDate,
      endDate,
    },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true }
  );

  const applications = response?.data || [];
  const stats = response?.stats || {};
  const paginationInfo = response?.pagination;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteSubmittedApplicationMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication({ applicationType: "permit", id }).unwrap();
      message.success("Application deleted successfully.");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete application.");
    }
  };

  const handleResetFilters = () => {
    setStatus("");
    setPermitType("");
    setAssigningEntity("");
    setView("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 55,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono text-xs">
          {(page - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: "Application Details",
      key: "details",
      width: 340,
      render: (_: any, record: any) => (
        <div className="flex items-start gap-2 py-0.5">
          <div className="flex-shrink-0 w-7 h-7 rounded bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-extrabold border border-amber-200 mt-0.5">
            P
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip title={record.title || record.permitType} placement="topLeft">
              <p className="text-xs font-semibold text-gray-900 leading-tight truncate w-full">
                {record.title || record.permitType || "N/A"}
              </p>
            </Tooltip>
            <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 truncate w-full">
              {record.client?.name || "N/A"}
            </p>
            <div className="flex gap-2 items-center mt-1 flex-wrap">
              <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1 rounded uppercase tracking-tighter">
                {record.code}
              </span>
              <Tag
                color={record.processingType === "express" ? "orange" : "blue"}
                className="text-[9px] font-bold uppercase m-0 leading-tight"
              >
                {normalizeText(record.processingType || "standard")}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Entity",
      key: "entity",
      width: 180,
      render: (_: any, record: any) => (
        <span className="text-xs text-gray-600 truncate block">
          {record.assigningEntity?.name || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (s) => getStatusBadge(s),
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date: any) => (
        <span className="text-xs text-gray-500">{formatDate4(date)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Details">
            <button
              onClick={() => { setSelectedAppId(record._id); setPreviewOpen(true); }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="View Application History">
            <button
              onClick={() => { setSelectedHistoryAppId(record._id); setHistoryOpen(true); }}
              className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
            >
              <ProjectOutlined />
            </button>
          </Tooltip>
          {record.transferHistory?.length > 0 && (
            <Tooltip title="Transfer History">
              <button
                onClick={() => { setSelectedTransferApp(record); setTransferHistoryOpen(true); }}
                className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
              >
                <HistoryOutlined />
              </button>
            </Tooltip>
          )}
          {/* TEMPORARY — remove after cleanup */}
          {record.status === "submitted" && (
            <Popconfirm
              title="Delete this application?"
              description="This will permanently delete the application and its assignment."
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Tooltip title="Delete Submitted Application">
                <button className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors">
                  <DeleteOutlined />
                </button>
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      {/* ── Filter Drawer ── */}
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
        width={window.innerWidth > 768 ? 450 : "100%"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              Status
            </label>
            <Select
              value={status || null}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              allowClear
            >
              {statusOptions.map((s) => (
                <Option key={s} value={s}>
                  {normalizeText(s)}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              Permit Type
            </label>
            <Select
              value={permitType}
              onChange={(v) => {
                setPermitType(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              allowClear
            >
              {permitTypes.map((t) => (
                <Option key={t} value={t}>
                  {normalizeText(t)}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              Assigning Entity
            </label>
            <Select
              value={assigningEntity}
              onChange={(v) => {
                setAssigningEntity(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
              showSearch
              allowClear
              placeholder="All Entities"
              optionFilterProp="children"
            >
              <Option value="">All Entities</Option>
              {entities.map((e: any) => (
                <Option key={e._id} value={e._id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              View
            </label>
            <Select
              value={view}
              onChange={(v) => {
                setView(v);
                setPage(1);
              }}
              className="w-full"
              size="middle"
            >
              <Option value="">All Applications</Option>
              <Option value="transferred">Transferred Only</Option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">
              End Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </Drawer>

      {/* ── Application Preview ── */}
      <AdminApplicationPreview
        applicationId={selectedAppId}
        isOpen={previewOpen}
        onClose={() => { setPreviewOpen(false); setSelectedAppId(null); }}
        type="permit"
      />

      {/* ── Transfer History ── */}
      <TransferHistoryDrawer
        open={transferHistoryOpen}
        onClose={() => { setTransferHistoryOpen(false); setSelectedTransferApp(null); }}
        history={selectedTransferApp?.transferHistory || []}
        applicationCode={selectedTransferApp?.code}
      />

      {/* ── Application History ── */}
      <AdminAssignmentPlanModal
        isOpen={historyOpen}
        onClose={() => { setHistoryOpen(false); setSelectedHistoryAppId(null); }}
        applicationId={selectedHistoryAppId || ""}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Permit Applications
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Admin-wide view of all permit applications across entities
          </p>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-all text-sm font-medium"
        >
          <MdFilterList /> Advanced Filters
        </button>
      </div>

      {/* ── Status Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Submitted",
            key: "submitted",
            color: "bg-blue-50 border-blue-200 text-blue-700",
          },
          {
            label: "Under Review",
            key: "under_review",
            color: "bg-orange-50 border-orange-200 text-orange-700",
          },
          {
            label: "Corrections",
            key: "corrections_required",
            color: "bg-yellow-50 border-yellow-200 text-yellow-700",
          },
          {
            label: "Awaiting Issuance",
            key: "awaiting_issuance",
            color: "bg-cyan-50 border-cyan-200 text-cyan-700",
          },
          {
            label: "Completed",
            key: "completed",
            color: "bg-green-50 border-green-200 text-green-700",
          },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setStatus(status === s.key ? "" : s.key);
              setPage(1);
            }}
            className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
              s.color
            } ${status === s.key ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            <p className="text-xl font-bold">{(stats as any)[s.key] ?? 0}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide">
              {s.label}
            </p>
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Show</span>
            <Select
              value={limit}
              onChange={(val) => {
                setLimit(val);
                setPage(1);
              }}
              className="w-20"
              size="small"
            >
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span className="text-sm font-medium text-gray-600">entries</span>
          </div>

          <div className="relative w-full md:w-80">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search by App ID, type or applicant..."
              className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={applications}
          loading={isLoading || isFetching}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1300, y: "60vh" }}
          size="small"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
          }
        />

        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Showing{" "}
            {paginationInfo?.total
              ? Math.min((page - 1) * limit + 1, paginationInfo.total)
              : 0}{" "}
            to {Math.min(page * limit, paginationInfo?.total ?? 0)} of{" "}
            {paginationInfo?.total ?? 0} entries
          </div>
          <Pagination
            current={page}
            total={paginationInfo?.total || 0}
            pageSize={limit}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default PermitApplications;
