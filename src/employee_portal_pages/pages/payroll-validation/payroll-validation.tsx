import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Pagination,
  Input,
  Button,
  Breadcrumb,
  Tag,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Descriptions,
  Drawer,
  Select,
  Row,
  Col,
  Alert,
  Statistic,
} from "antd";
const { Countdown } = Statistic;
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { PageTitle } from "@/utils/PageTitle";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import {
  formatDate2,
  formatDate4,
  formatNumber,
  normalizeText,
} from "@/utils/helperFunction";
import {
  useEntityPayrollSnapShotsQuery,
  useVerifySnapshotEmployeeMutation,
  useBulkVerifySnapshotEmployeesMutation,
  useGetSnapshotVerificationSummaryByEntityQuery,
} from "@/redux/features/employee-portal-api/entityApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import { showError, showSuccess } from "@/lib/alert";
import VerifyEmployeeDrawer from "./components/VerifyEmployeeDrawer";
import PayrollSnapshotDetailsDrawer from "@/pages/payroll_processing/snapshot-components/PayrollSnapshotDetailsDrawer";
import { styles } from "@/styles";

const PayrollValidation = () => {
  PageTitle("Payroll Validation | EPA Ghana");
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const currentMonth = moment().format("MMMM").toLowerCase();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [payMonth, setPayMonth] = useState<string>(currentMonth);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [verificationStatusFilter, setVerificationStatusFilter] =
    useState<string>("");
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationSnapshot, setVerificationSnapshot] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<string>("APPROVED_FOR_PAY");
  const [verificationNotes, setVerificationNotes] = useState<string>("");
  const [showVerificationSummaryDrawer, setShowVerificationSummaryDrawer] =
    useState(false);
  const [verificationDeadline, setVerificationDeadline] = useState<Date | null>(
    null
  );
  const [countdownKey, setCountdownKey] = useState(0);
  const [snapshotStatus, setSnapshotStatus] = useState<string>("pending");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showBulkVerificationDrawer, setShowBulkVerificationDrawer] =
    useState(false);
  const [bulkVerificationStatus, setBulkVerificationStatus] =
    useState<string>("");
  const [bulkVerificationNotes, setBulkVerificationNotes] =
    useState<string>("");
  const [isBulkVerifying, setIsBulkVerifying] = useState(false);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [verifyEmployee, { isLoading: isVerifying }] =
    useVerifySnapshotEmployeeMutation();
  const [bulkVerifyEmployees, { isLoading: isBulkVerifyingMutation }] =
    useBulkVerifySnapshotEmployeesMutation();

  const { data: verificationSummary } =
    useGetSnapshotVerificationSummaryByEntityQuery(
      {
        pay_month: payMonth,
        year: year,
        entity_id: employee.entity_id || employee?.entity?._id || "",
      },
      {
        skip:
          !payMonth || !year || (!employee.entity_id && !employee?.entity?._id),
        refetchOnMountOrArgChange: true,
      }
    );

  const {
    data: snapshotsResponse,
    isLoading: isLoadingSnapshots,
    isFetching: isFetchingSnapshots,
    refetch,
  } = useEntityPayrollSnapShotsQuery(
    {
      page,
      limit,
      pay_month: payMonth,
      year: year,
      searchTerm: debouncedSearchTerm,
      entity_id: employee.entity_id || employee?.entity?._id,
      verification_status: verificationStatusFilter,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const snapshots = snapshotsResponse?.data || [];
  const paginationInfo = snapshotsResponse?.pagination;

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      const firstSnapshot = snapshots[0];
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
  }, [snapshots]);

  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === "search") {
      setSearchTerm(value);
      setPage(1);
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setPayMonth(moment().format("MMMM").toLowerCase());
    setYear(new Date().getFullYear());
    setVerificationStatusFilter("");
    setPage(1);
  }, []);

  const handleViewDetails = useCallback((record: any) => {
    setSelectedSnapshot(record);
    setViewDrawerOpen(true);
  }, []);

  const handleVerifyClick = useCallback((record: any) => {
    setVerificationSnapshot(record);
    setVerificationStatus("APPROVED_FOR_PAY");
    setVerificationNotes("");
    setShowHistoryOnly(false);
    setVerificationModalOpen(true);
  }, []);

  const handleViewVerificationHistory = useCallback((record: any) => {
    setVerificationSnapshot(record);
    setVerificationStatus("");
    setVerificationNotes("");
    setShowHistoryOnly(true);
    setVerificationModalOpen(true);
  }, []);

  const getVerificationStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDING_REVIEW: "blue",
      APPROVED_FOR_PAY: "green",
      EXCLUDED_BY_DEPARTMENT: "orange",
      FLAGGED_FOR_REVIEW: "red",
      ON_HOLD: "cyan",
      AUTO_EXCLUDED: "default",
    };
    return colorMap[status] || "default";
  };

  const handleBulkVerify = async () => {
    if (!bulkVerificationStatus) {
      showError("Please select a verification status");
      return;
    }

    if (
      bulkVerificationStatus !== "APPROVED_FOR_PAY" &&
      !bulkVerificationNotes
    ) {
      showError("Notes are required for non-approved statuses");
      return;
    }

    const result = await Swal.fire({
      title: "Bulk Verify Employees",
      html: `<div style="text-align: left;">
        <p><strong>Status:</strong> ${bulkVerificationStatus.replace(
          /_/g,
          " "
        )}</p>
        <p><strong>Employees:</strong> ${selectedRowKeys.length}</p>
        ${
          bulkVerificationNotes
            ? `<p><strong>Notes:</strong> ${bulkVerificationNotes}</p>`
            : ""
        }
        <p style="color: #d97706; margin-top: 16px;">
          ⚠️ This action will update verification status for ${
            selectedRowKeys.length
          } employees
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

    setIsBulkVerifying(true);
    try {
      const response = await bulkVerifyEmployees({
        snapshotIds: selectedRowKeys,
        status: bulkVerificationStatus,
        notes: bulkVerificationNotes || undefined,
      }).unwrap();

      showSuccess(response.message || "Bulk verification completed successfully");
      
      setSelectedRowKeys([]);
      setBulkVerificationStatus("");
      setBulkVerificationNotes("");
      setShowBulkVerificationDrawer(false);
      
      // Small delay to ensure backend has persisted the change
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error: any) {
      showError(error?.data?.message || error?.data?.error || "Bulk verification failed");
    } finally {
      setIsBulkVerifying(false);
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        title: (
          <input
            type="checkbox"
            checked={
              selectedRowKeys.length > 0 &&
              selectedRowKeys.length === snapshots?.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRowKeys(snapshots?.map((emp: any) => emp._id) || []);
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
                setSelectedRowKeys(
                  selectedRowKeys.filter((id) => id !== record._id)
                );
              }
            }}
          />
        ),
      },
      {
        title: "No",
        key: "index",
        width: 50,
        fixed: "left" as const,
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-xs">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },
      {
        title: "Staff ID",
        dataIndex: ["employee_data", "staff_id"],
        key: "staff_id",
        width: 100,
        fixed: "left" as const,
        render: (text) => (
          <span className="text-xs font-mono">{text || "N/A"}</span>
        ),
      },
      {
        title: "Employee Name",
        key: "employee_name",
        fixed: "left" as const,
        width: 200,
        render: (_, record: any) => {
          const emp = record.employee_data;
          const name = emp?.full_name || "N/A";
          return (
            <Tooltip title={name}>
              <span className="text-xs font-medium text-gray-800 truncate block">
                {name}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Pay Month",
        dataIndex: "pay_month",
        key: "pay_month",
        width: 100,
        render: (text) => (
          <span className="text-xs text-gray-600">
            {text?.toUpperCase() || "N/A"}
          </span>
        ),
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
        width: 80,
        render: (text) => (
          <span className="text-xs text-gray-600">{text || "N/A"}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "employee_verification_status",
        key: "employee_verification_status",
        width: 140,
        render: (status) => (
          <Tag color={getVerificationStatusColor(status)} className="text-xs">
            {normalizeText(status) || "PENDING_REVIEW"}
          </Tag>
        ),
      },
      {
        title: "Mgt Unit",
        key: "entity_name",
        fixed: "left" as const,
        width: 200,
        render: (_, record: any) => {
          const emp = record.employee_data;
          const entity_name = emp?.entity_name || "N/A";
          return (
            <Tooltip title={entity_name}>
              <span className="text-xs font-medium text-gray-800 truncate block">
                {entity_name}
              </span>
            </Tooltip>
          );
        },
      },
      // "entity_name": "Akim Oda Area Office",
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (date) => (
          <span className="text-xs text-gray-600">
            {date ? formatDate4(date) : "N/A"}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        fixed: "right" as const,
        align: "center" as const,
        render: (_, record: any) => {
          const isVerificationOpen = record.status === "verification_open";
          const hasDeadlinePassed =
            verificationDeadline && new Date() > verificationDeadline;
          const canVerify =
            isVerificationOpen && !hasDeadlinePassed;

          return (
            <Space size="small">
              <Tooltip title="View Details">
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  type="default"
                  onClick={() => handleViewDetails(record)}
                  className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                />
              </Tooltip>
              <Tooltip
                title={
                  snapshotStatus === "pending"
                    ? "Verification window not yet opened"
                    : snapshotStatus === "verification_closed"
                    ? "Verification window is closed"
                    : !isVerificationOpen
                    ? "Verification not open"
                    : hasDeadlinePassed
                    ? "Verification deadline passed"
                    : "Verify or Update"
                }
              >
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="default"
                  onClick={() => handleVerifyClick(record)}
                  disabled={
                    !canVerify || snapshotStatus !== "verification_open"
                  }
                  className={
                    canVerify && snapshotStatus === "verification_open"
                      ? "text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 hover:border-green-300"
                      : "text-gray-400 border-gray-200"
                  }
                />
              </Tooltip>
              {record.verification_history && record.verification_history.length > 0 && (
                <Tooltip title="View History">
                  <Button
                    icon={<FileTextOutlined />}
                    size="small"
                    type="default"
                    onClick={() => handleViewVerificationHistory(record)}
                    className="text-orange-600 border-orange-200 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                  />
                </Tooltip>
              )}
            </Space>
          );
        },
      },
    ],
    [
      page,
      limit,
      handleViewDetails,
      handleVerifyClick,
      handleViewVerificationHistory,
      verificationDeadline,
      selectedRowKeys,
      snapshots,
      snapshotStatus,
    ]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (payMonth !== currentMonth) count++;
    if (year !== new Date().getFullYear()) count++;
    if (verificationStatusFilter) count++;
    return count;
  }, [searchTerm, payMonth, year, verificationStatusFilter, currentMonth]);

  const monthOptions = moment.months().map((month, index) => ({
    label: month,
    value: month.toLowerCase(),
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: y.toString(), value: y };
  });

  return (
    <>
      <VerifyEmployeeDrawer
        open={verificationModalOpen}
        onClose={() => {
          setVerificationModalOpen(false);
          setVerificationSnapshot(null);
          setVerificationStatus("");
          setVerificationNotes("");
          setShowHistoryOnly(false);
        }}
        snapshot={verificationSnapshot}
        verificationStatus={verificationStatus}
        verificationNotes={verificationNotes}
        onStatusChange={setVerificationStatus}
        onNotesChange={setVerificationNotes}
        onSubmit={async () => {
          if (!verificationStatus) {
            showError("Please select a verification status");
            return;
          }

          const isNotesRequired = verificationStatus !== "APPROVED_FOR_PAY";
          if (isNotesRequired && !verificationNotes.trim()) {
            showError(
              "Notes are required when status is not 'Approved for Pay'"
            );
            return;
          }

          try {
            await verifyEmployee({
              snapshotId: verificationSnapshot._id,
              status: verificationStatus,
              notes: verificationNotes,
            }).unwrap();
            showSuccess(
              `Employee verified: ${normalizeText(verificationStatus)}`
            );
            setVerificationModalOpen(false);
            setVerificationSnapshot(null);
            setVerificationStatus("");
            setVerificationNotes("");
            setShowHistoryOnly(false);
            await refetch();
          } catch (error: any) {
            showError(error?.data?.error || "Failed to verify employee");
          }
        }}
        isLoading={isVerifying}
        showHistoryOnly={showHistoryOnly}
      />

      <PayrollSnapshotDetailsDrawer
        open={viewDrawerOpen}
        onClose={() => {
          setViewDrawerOpen(false);
          setSelectedSnapshot(null);
        }}
        record={
          selectedSnapshot
            ? {
                ...selectedSnapshot.employee_data,
                pay_month: selectedSnapshot.pay_month,
                year: selectedSnapshot.year,
              }
            : null
        }
      />

      <div className="payroll-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Personal" },
              { title: <span className="text-green-700 font-medium">Payroll Validation</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <AuditOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Payroll Snapshot Verification</h1>
              <p className="text-[11px] text-gray-500 leading-tight">
                Review and verify employee payroll snapshots for your department
                {selectedRowKeys.length > 0 && (
                  <span className="text-blue-600 ml-2 font-medium">· {selectedRowKeys.length} selected</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            {selectedRowKeys.length > 0 && (
              <>
                <Button size="small" type="primary" onClick={() => setShowBulkVerificationDrawer(true)} className={styles.primary_button + " text-[11px]"}>
                  Bulk Verify ({selectedRowKeys.length})
                </Button>
                <Button size="small" onClick={() => setSelectedRowKeys([])} className="text-[11px]">Clear</Button>
              </>
            )}
            {payMonth && year && verificationSummary && (
              <Tooltip title="Verification Summary">
                <Button size="small" icon={<FileTextOutlined />} onClick={() => setShowVerificationSummaryDrawer(true)} className="border-blue-300 text-blue-600 hover:!bg-blue-50" />
              </Tooltip>
            )}
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetchingSnapshots} />
            </Tooltip>
          </div>
        </div>

        {/* ── STATUS ALERT ── */}
        {snapshots && snapshots.length > 0 && (
          <div className="px-4 py-2 bg-white border-b border-gray-200">
            {snapshotStatus === "verification_open" && verificationDeadline && (
              <Alert
                message={
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">✓ Verification Period Active — Review and verify employees</span>
                    <Countdown
                      key={countdownKey}
                      value={new Date(verificationDeadline).getTime()}
                      format="D[d] H[h] m[m] s[s]"
                      onFinish={() => setVerificationDeadline(null)}
                    />
                  </div>
                }
                type="warning"
                showIcon
                className="mb-0"
              />
            )}
            {snapshotStatus === "verification_closed" && (
              <Alert message="Verification Window Closed — No further changes allowed" type="info" showIcon className="mb-0" />
            )}
            {snapshotStatus === "pending" && (
              <Alert message="Verification Not Yet Opened — Waiting for admin to open the verification window" type="info" showIcon className="mb-0" />
            )}
          </div>
        )}

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={6} lg={5} xl={4}>
              <Input
                prefix={<SearchOutlined className="text-gray-400 text-xs" />}
                placeholder="Search staff ID or name…"
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                size="small"
                className="rounded"
              />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={3}>
              <Select
                placeholder="Month"
                value={payMonth || undefined}
                onChange={setPayMonth}
                options={monthOptions}
                className="w-full"
                size="small"
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={2} lg={2} xl={2}>
              <Select
                placeholder="Year"
                value={year}
                onChange={setYear}
                options={yearOptions}
                className="w-full"
                size="small"
              />
            </Col>
            <Col xs={12} sm={8} md={4} lg={4} xl={3}>
              <Select
                placeholder="Verif. Status"
                value={verificationStatusFilter || undefined}
                onChange={(v) => { setVerificationStatusFilter(v); setPage(1); }}
                allowClear
                className="w-full"
                size="small"
                options={[
                  { label: "Pending Review", value: "PENDING_REVIEW" },
                  { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
                  { label: "Excluded", value: "EXCLUDED" },
                  { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
                  { label: "On Hold", value: "ON_HOLD" },
                  { label: "Auto Excluded", value: "AUTO_EXCLUDED" },
                ]}
              />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">
                  Clear filters
                </Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => handleFilterChange("search", "")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {payMonth !== currentMonth && <Tag closable onClose={() => setPayMonth(currentMonth)} color="purple" className="text-[10px] leading-tight m-0">Month: {payMonth?.toUpperCase()}</Tag>}
              {year !== new Date().getFullYear() && <Tag closable onClose={() => setYear(new Date().getFullYear())} color="cyan" className="text-[10px] leading-tight m-0">Year: {year}</Tag>}
              {verificationStatusFilter && <Tag closable onClose={() => { setVerificationStatusFilter(""); setPage(1); }} color="orange" className="text-[10px] leading-tight m-0">Status: {verificationStatusFilter.replace(/_/g, " ")}</Tag>}
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
          <Spin spinning={isLoadingSnapshots || isFetchingSnapshots}>
            <Table
              columns={tableColumns as any}
              dataSource={snapshots}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1400, y: "calc(100vh - 260px)" }}
              sticky
              className="payroll-snapshots-table"
              rowClassName={(_, index) =>
                `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`
              }
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No snapshots match your filters." : "No snapshots found."}</p>
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
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} snapshots`
              : "No snapshots"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination
              current={page}
              pageSize={limit}
              total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger
              showQuickJumper
              size="small"
              className="payroll-pagination"
            />
          )}
        </div>
      </div>

      <style>{`
        .payroll-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .payroll-snapshots-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .payroll-snapshots-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .payroll-snapshots-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .payroll-snapshots-table .ant-table-body { overflow-y: auto !important; }
        .payroll-snapshots-table .ant-table-cell-fix-right { background: #fff; }
        .payroll-snapshots-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .payroll-snapshots-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .payroll-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .payroll-pagination .ant-pagination-item-active a { color: #fff; }
        .payroll-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>

      {/* Bulk Verify Drawer */}
      <Drawer
        title="Bulk Verify Employees"
        placement="right"
        onClose={() => {
          setShowBulkVerificationDrawer(false);
          setBulkVerificationStatus("");
          setBulkVerificationNotes("");
        }}
        open={showBulkVerificationDrawer}
        width={450}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Verification Status <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              placeholder="Select status"
              value={bulkVerificationStatus || undefined}
              onChange={setBulkVerificationStatus}
              options={[
                { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
                {
                  label: "Excluded by Department",
                  value: "EXCLUDED_BY_DEPARTMENT",
                },
                { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
                { label: "On Hold", value: "ON_HOLD" },
              ]}
              style={{ width: "100%" }}
            />
          </div>

          {bulkVerificationStatus !== "APPROVED_FOR_PAY" && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Notes <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                placeholder="Add verification notes..."
                value={bulkVerificationNotes}
                onChange={(e) => setBulkVerificationNotes(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "8px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                }}
              />
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                Notes are required for non-approved statuses
              </p>
            </div>
          )}

          <div
            style={{
              backgroundColor: "#f0f5ff",
              padding: "12px",
              borderRadius: "4px",
              borderLeft: "4px solid #1890ff",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: "13px" }}>
              <strong>Summary:</strong>
            </p>
            <p style={{ margin: "4px 0", fontSize: "12px" }}>
              Employees: {selectedRowKeys.length}
            </p>
            <p style={{ margin: "4px 0", fontSize: "12px" }}>
              Status:{" "}
              {bulkVerificationStatus?.replace(/_/g, " ") || "Not selected"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Button
              type="primary"
              onClick={handleBulkVerify}
              loading={isBulkVerifying}
              disabled={!bulkVerificationStatus}
              style={{ flex: 1 }}
              className={styles.primary_button}
            >
              Verify All
            </Button>
            <Button
              onClick={() => {
                setShowBulkVerificationDrawer(false);
                setBulkVerificationStatus("");
                setBulkVerificationNotes("");
              }}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      <Drawer
        title="Verification Summary"
        onClose={() => setShowVerificationSummaryDrawer(false)}
        open={showVerificationSummaryDrawer}
        width={500}
      >
        {verificationSummary && (
          <>
            <div
              style={{
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                Payroll Period: {payMonth?.toUpperCase()} {year}
              </div>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Pending Review
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary
                      ?.PENDING_REVIEW || 0}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Approved for Pay
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary
                      ?.APPROVED_FOR_PAY || 0}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Excluded by Department
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#faad14",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary
                      ?.EXCLUDED_BY_DEPARTMENT || 0}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Flagged for Review
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ff4d4f",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary
                      ?.FLAGGED_FOR_REVIEW || 0}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>On Hold</div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#13c2c2",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary?.ON_HOLD ||
                      0}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12}>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Auto Excluded
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#f57800",
                    }}
                  >
                    {verificationSummary?.data?.verification_summary
                      ?.AUTO_EXCLUDED || 0}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Drawer>
    </>
  );
};

export default PayrollValidation;
