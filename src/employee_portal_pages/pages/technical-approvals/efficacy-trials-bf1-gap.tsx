import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
  Select,
  Input,
  Button,
  Tag,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Row,
  Col,
  Segmented,
  Breadcrumb,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  HistoryOutlined,
  SwapRightOutlined,
  HomeOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { useFetchAllEfficacyTrialsQuery } from "@/redux/features/employee-portal-api/application/application";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { formatDate2 } from "@/utils/helperFunction";
import ApplicationPreview from "@/employee_portal_pages/components/application-preview/application-preview";
import {
  getStatusBadge,
  statusOptions,
} from "@/employee_portal_pages/lib/helpers";
import AssignmentPlanModal from "@/employee_portal_pages/components/application/assignment-details";
import TransferHistoryDrawer from "@/employee_portal_pages/components/application/transfer-history-drawer";
import TransferEfficacyTrialApplicationModal from "@/employee_portal_pages/components/application/transfer-efficacy-trial-application-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Swal from "sweetalert2";
import axios from "axios";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";


const EFFICACY_FONT_SIZES = [
  { key: "sm",   label: "A−", zoom: 0.88 },
  { key: "base", label: "A",  zoom: 1    },
  { key: "lg",   label: "A+", zoom: 1.15 },
];

const EfficacyTrialsBf1GapTable = () => {
  PageTitle("Efficacy Trials (BF1 & GAP) | EPA Ghana");
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [fontSizeKey, setFontSizeKey] = useState<string>(
    () => localStorage.getItem("efficacy-font-size") || "base"
  );
  const zoom = EFFICACY_FONT_SIZES.find((f) => f.key === fontSizeKey)?.zoom ?? 1;
  const handleFontSize = (key: string) => { setFontSizeKey(key); localStorage.setItem("efficacy-font-size", key); };

  const { data: entitiesResponse } = useEntityFullListQuery({});
  const entities = entitiesResponse?.data || [];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("all");
  const [assigningEntity, setAssigningEntity] = useState("all");
  const [currentView, setCurrentView] = useState("current");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [assignmentPlanModalOpen, setAssignmentPlanModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferHistoryDrawerOpen, setTransferHistoryDrawerOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>({});

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: applicationsResponse,
    isLoading: isLoadingApplications,
    isFetching: isFetchingApplications,
    refetch,
  } = useFetchAllEfficacyTrialsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      status,
      assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
      view: currentView,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const applications = applicationsResponse?.data || [];
  const paginationInfo = applicationsResponse?.pagination;

  // Memoized filter options
  const filterOptions = useMemo(
    () => ({
      statusOptions: statusOptions.map((status) => ({
        label: status
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: status,
      })),
      entityOptions: [
        { label: "All Entities", value: "all" },
        ...entities.map((entity: any) => ({
          label: entity.name,
          value: entity.id,
        })),
      ],
    }),
    [entities]
  );

  // Sorting handlers
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [sortField, sortOrder]
  );

  // Filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    switch (filterType) {
      case "search":
        setSearchTerm(value);
        setPage(1);
        break;
      case "status":
        setStatus(value);
        setPage(1);
        break;
      case "assigningEntity":
        setAssigningEntity(value);
        setPage(1);
        break;
      default:
        break;
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("all");
    setAssigningEntity("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setPage(1);
  }, []);

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <SortAscendingOutlined className="text-gray-400 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <SortAscendingOutlined className="text-blue-600 ml-1" />
    ) : (
      <SortDescendingOutlined className="text-blue-600 ml-1" />
    );
  };

  // Memoized table columns with sorting
  const tableColumns = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 30,
        fixed: "left",
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-[10px]">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },

      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("code")}
          >
            <span>Trial ID</span>
            <SortIndicator field="code" />
          </div>
        ),
        dataIndex: "code",
        key: "code",
        width: 150,
        fixed: "left",
        sorter: true,
        sortOrder: sortField === "code" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (code) => (
          <span className="font-mono text-[10px] font-medium text-blue-600">
            {code || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div className="text-xs">Permit No</div>
        ),
        dataIndex: "permitNo",
        key: "permitNo",
        width: 150,
        render: (permitNo) => (
          <span className="font-mono text-[10px] font-medium text-blue-600">
            {permitNo || "N/A"}
          </span>
        ),
      },
      {
        title: (
          <div className="text-xs">Product Name</div>
        ),
        dataIndex: "productName",
        key: "productName",
        width: 250,
        render: (productName) => (
          <Tooltip title={productName}>
            <span className="font-mono text-[10px] font-medium text-blue-600 line-clamp-2">
              {productName || "N/A"}
            </span>
          </Tooltip>
        ),
      },

      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("createdAt")}
          >
            <span>Submitted</span>
            <SortIndicator field="createdAt" />
          </div>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        sorter: true,
        sortOrder: sortField === "createdAt" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (date) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">
              {formatDate2(date)}
            </span>
          </div>
        ),
      },
      {
        title: <div className="text-xs">Priority</div>,
        dataIndex: "processingType",
        key: "processingType",
        width: 100,
        align: "center",
        render: (type: string) => {
          const color = type === "expedited" ? "volcano" : "blue";
          return (
            <Tag color={color} className="text-[9px] uppercase font-bold">
              {type || "standard"}
            </Tag>
          );
        },
      },
      {
        title: (
          <div
            className="flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors text-xs"
            onClick={() => handleSort("status")}
          >
            <span>Status</span>
            <SortIndicator field="status" />
          </div>
        ),
        dataIndex: "status",
        key: "status",
        width: 160,
        align: "center",
        sorter: true,
        sortOrder: sortField === "status" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (status) => getStatusBadge(status),
      },
      {
        title: <div className="text-xs">Mgt Unit</div>,
        key: "assigningEntity",
        width: 180,
        render: (_, record: any) => (
          <span className="font-mono text-[10px] font-medium">
            {record.assigningEntity?.name || "N/A"}
          </span>
        ),
      },
      {
        title: <div className="text-xs">Client</div>,
        key: "client",
        width: 220,
        render: (_, record: any) => (
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-800 uppercase">
              {record.client?.name || "N/A"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500 font-mono">
                {record.client?.clientId || "N/A"}
              </span>
              {record.client?.userType && (
                <Tag color="blue" className="text-[8px] px-1 py-0 m-0 leading-none">
                  {record.client.userType}
                </Tag>
              )}
            </div>
          </div>
        ),
      },
      {
        title: (
          <div className="text-xs">Actions</div>
        ),
        key: "actions",
        width: 80,
        align: "center",
        fixed: "right",
        render: (_, app) => (
          <Space size="small">
            <Tooltip title="View Application Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                onClick={() => {
                  setSelectedApplication(app);
                  setViewModalOpen(true);
                }}
                className="hover:bg-blue-50 hover:border-blue-300"
              />
            </Tooltip>
            {currentView === "current" && (employee?.is_head ||
              employee?.permissions?.includes("transfer_application")) && (
              <Tooltip title="Transfer Application">
                <Button
                  icon={<SwapRightOutlined />}
                  size="small"
                  type="default"
                  onClick={() => {
                    setSelectedApplication(app);
                    setTransferModalOpen(true);
                  }}
                  className="hover:bg-orange-50 hover:border-orange-300"
                />
              </Tooltip>
            )}
            {app?.transferHistory?.length > 0 && (
              <Tooltip title="View Transfer History">
                <Button
                  icon={<HistoryOutlined />}
                  size="small"
                  type="default"
                  onClick={() => {
                    setSelectedApplication(app);
                    setTransferHistoryDrawerOpen(true);
                  }}
                  className="hover:bg-purple-50 hover:border-purple-300"
                />
              </Tooltip>
            )}

            {/* <Tooltip title="View PDF">
              <Button
                icon={<FaFilePdf />}
                size="small"
                className="text-red-700 border-red-700 hover:!bg-red-700 hover:!text-white !transition !duration-200"
                onClick={() => handleViewPDF(app._id)}
              />
            </Tooltip> */}
          </Space>
        ),
      },
    ],
    [page, limit, sortField, sortOrder, handleSort, employee, currentView]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (status !== "all") count++;
    if (assigningEntity !== "all") count++;
    if (sortField !== "createdAt" || sortOrder !== "desc") count++;
    return count;
  }, [searchTerm, status, assigningEntity, sortField, sortOrder]);

  const handleViewPDF = async (invoiceId: string) => {
    try {
      const popup = window.open("", "_blank");

      if (!popup) {
        Swal.fire({
          title: "Popup Blocked",
          text: "Please allow popups in your browser to view the invoice.",
          icon: "warning",
          confirmButtonColor: "#727cf5",
        });
        return;
      }

      // 2. Fetch the invoice document
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }/revenue/application/permit-applications/${invoiceId}/view`,
        {
          withCredentials: true,
        }
      );

      const documentUrl = response?.data?.document_url;

      if (documentUrl) {
        // 3. Redirect the opened popup to the actual invoice PDF
        popup.location.href = documentUrl;
      } else {
        popup.close(); // Close the empty tab if the doc failed to load
        Swal.fire({
          title: "Not Found",
          text: "Invoice document not available.",
          icon: "error",
          confirmButtonColor: "#727cf5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Oops...",
        text:
          error?.response?.data?.error ||
          "Something went wrong while fetching the invoice.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
      console.error("Failed to fetch invoice document:", error);
    }
  };

  return (
    <>
      {viewModalOpen && (
        <ApplicationPreview
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false), refetch();
          }}
          applicationId={selectedApplication._id}
          type="efficacy-trial"
        />
      )}

      {assignmentPlanModalOpen && (
        <AssignmentPlanModal
          isOpen={assignmentPlanModalOpen}
          onClose={() => setAssignmentPlanModalOpen(false)}
          applicationId={selectedApplication}
        />
      )}

      {transferModalOpen && (
        <TransferEfficacyTrialApplicationModal
          isOpen={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          applicationId={selectedApplication}
          refreshData={refetch}
        />
      )}

      <TransferHistoryDrawer
        open={transferHistoryDrawerOpen}
        onClose={() => setTransferHistoryDrawerOpen(false)}
        history={selectedApplication?.transferHistory || []}
        applicationCode={selectedApplication?.code}
      />

      <div className="efficacy-page-root flex flex-col" style={{ zoom }}>

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Licensing MGT" },
              { title: <span className="text-green-700 font-medium">Efficacy Trials (BF1 &amp; GAP)</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <ExperimentOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Efficacy Trials (BF1 &amp; GAP)</h1>
              <p className="text-[11px] text-gray-500 leading-tight">
                {(employee as any)?.entity?.name || "All Entities"} &mdash; Manage &amp; review efficacy trial applications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <Segmented
              options={[{ label: "Current", value: "current" }, { label: "Transferred", value: "transferred" }]}
              value={currentView}
              onChange={(v: any) => setCurrentView(v)}
              size="small"
              className="bg-gray-100"
            />
            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
              {EFFICACY_FONT_SIZES.map((f) => (
                <button key={f.key} onClick={() => handleFontSize(f.key)}
                  title={f.key === "sm" ? "Small" : f.key === "base" ? "Normal" : "Large"}
                  className={`px-2 py-[3px] text-[10px] font-bold border-r last:border-r-0 border-gray-200 transition-colors ${fontSizeKey === f.key ? "bg-green-700 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetchingApplications} />
            </Tooltip>
          </div>
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={7} lg={6} xl={5}>
              <Input prefix={<SearchOutlined className="text-gray-400 text-xs" />} placeholder="Search code, name, client…"
                value={searchTerm} onChange={(e) => handleFilterChange("search", e.target.value)} allowClear size="small" />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Select value={status} onChange={(v) => handleFilterChange("status", v)} className="w-full" size="small" placeholder="Status" options={filterOptions.statusOptions} />
            </Col>
            <Col xs={24} sm={10} md={13} lg={9} xl={10}>
              <Select showSearch value={assigningEntity} onChange={(v) => handleFilterChange("assigningEntity", v)}
                className="w-full" size="small" placeholder="All Entities / Departments" options={filterOptions.entityOptions}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">Clear filters</Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => handleFilterChange("search", "")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {status !== "all" && <Tag closable onClose={() => handleFilterChange("status", "all")} color="green" className="text-[10px] leading-tight m-0">Status: {status.replace(/_/g, " ")}</Tag>}
              {assigningEntity !== "all" && <Tag closable onClose={() => handleFilterChange("assigningEntity", "all")} color="cyan" className="text-[10px] leading-tight m-0">Entity: {(entities as any[]).find((e: any) => (e.id || e._id) === assigningEntity)?.name || assigningEntity}</Tag>}
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
          <Spin spinning={isLoadingApplications || isFetchingApplications}>
            <Table
              columns={tableColumns as any}
              dataSource={applications}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1300, y: "calc(100vh - 260px)" }}
              className="efficacy-app-table"
              rowClassName={(_, index) => `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
              onChange={(_, __, sorter: any) => {
                if (sorter?.field) { setSortField(sorter.field); setSortOrder(sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "asc"); setPage(1); }
              }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No applications match the current filters." : "No applications found."}</p>
                      {activeFiltersCount > 0 && <Button type="link" size="small" onClick={clearAllFilters}>Clear filters</Button>}
                    </div>
                  } />
                ),
              }}
            />
          </Spin>
        </div>

        {/* ── FOOTER / PAGINATION ── */}
        <div className="px-4 py-2 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            {paginationInfo && paginationInfo.total > 0
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} applications`
              : "No applications"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination current={page} pageSize={limit} total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger showQuickJumper size="small" className="efficacy-pagination" />
          )}
        </div>
      </div>
      <style>{`
        .efficacy-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .efficacy-app-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .efficacy-app-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .efficacy-app-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .efficacy-app-table .ant-table-body { overflow-y: auto !important; }
        .efficacy-app-table .ant-table-cell-fix-right { background: #fff; }
        .efficacy-app-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .efficacy-app-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .efficacy-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .efficacy-pagination .ant-pagination-item-active a { color: #fff; }
        .efficacy-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>
    </>
  );
};

export default EfficacyTrialsBf1GapTable;
