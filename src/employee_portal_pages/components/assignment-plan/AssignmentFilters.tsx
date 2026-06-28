import React from "react";
import { Input, Button, Tooltip } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  IssuesCloseOutlined,
  FileSearchOutlined,
  CheckSquareOutlined,
  SyncOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  DollarOutlined,
  AuditOutlined,
  SnippetsOutlined,
  SafetyCertificateOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

interface StatusOption {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  active: string;
  group: "quick" | "stage" | "payment" | "terminal";
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    label: "All Pending",
    value: "pending_assignments",
    icon: <ClockCircleOutlined />,
    color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
    active: "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200",
    group: "quick",
  },
  {
    label: "Review (HOD)",
    value: "review",
    icon: <CheckSquareOutlined />,
    color: "text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100",
    active: "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-200",
    group: "quick",
  },
  {
    label: "In Progress",
    value: "in_progress",
    icon: <SyncOutlined />,
    color: "text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-100",
    active: "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200",
    group: "quick",
  },
  {
    label: "Processing Fee",
    value: "pending_processing_fee_assignment",
    icon: <DollarOutlined />,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
    active: "bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-200",
    group: "stage",
  },
  {
    label: "Completeness",
    value: "pending_completeness_check_assignment",
    icon: <SnippetsOutlined />,
    color: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100",
    active: "bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-200",
    group: "stage",
  },
  {
    label: "Evaluation",
    value: "pending_evaluation_assignment",
    icon: <AuditOutlined />,
    color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100",
    active: "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200",
    group: "stage",
  },
  {
    label: "Permit Fee",
    value: "pending_permit_fee_assignment",
    icon: <SafetyCertificateOutlined />,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    active: "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200",
    group: "stage",
  },
  {
    label: "Issuance",
    value: "pending_issuance_assignment",
    icon: <FileDoneOutlined />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    active: "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200",
    group: "stage",
  },
  {
    label: "Awaiting Processing Fee",
    value: "awaiting_processing_fee_payment",
    icon: <DollarOutlined />,
    color: "text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100",
    active: "bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-200",
    group: "payment",
  },
  {
    label: "Awaiting Permit Fee",
    value: "awaiting_permit_fee_payment",
    icon: <DollarOutlined />,
    color: "text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100",
    active: "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200",
    group: "payment",
  },
  {
    label: "Group Final Approval",
    value: "pending_hod_final_approval",
    icon: <AuditOutlined />,
    color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100",
    active: "bg-fuchsia-600 text-white border-fuchsia-600 shadow-sm shadow-fuchsia-200",
    group: "terminal",
  },
  {
    label: "Completed",
    value: "completed",
    icon: <CheckCircleOutlined />,
    color: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100",
    active: "bg-green-600 text-white border-green-600 shadow-sm shadow-green-200",
    group: "terminal",
  },
  {
    label: "On Hold",
    value: "on_hold",
    icon: <PauseCircleOutlined />,
    color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
    active: "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-200",
    group: "terminal",
  },
  {
    label: "Rejected",
    value: "rejected",
    icon: <CloseCircleOutlined />,
    color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    active: "bg-red-600 text-white border-red-600 shadow-sm shadow-red-200",
    group: "terminal",
  },
  {
    label: "All",
    value: "all",
    icon: <GlobalOutlined />,
    color: "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100",
    active: "bg-gray-700 text-white border-gray-700 shadow-sm shadow-gray-200",
    group: "terminal",
  },
];

const GROUP_LABELS: Record<string, string> = {
  quick: "Overview",
  stage: "By Stage",
  payment: "Awaiting Payment",
  terminal: "Status",
};

interface AssignmentFiltersProps {
  filters: {
    searchTerm: string;
    statusFilter: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectedCount: number;
  openBulkAssignModal: () => void;
}

export const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  filters,
  handleFilterChange,
  viewMode,
  setViewMode,
  selectedCount,
  openBulkAssignModal,
}) => {
  const showBulkAssign = [
    "pending_completeness_check_assignment",
    "pending_evaluation_assignment",
    "pending_processing_fee_assignment",
    "pending_permit_fee_assignment",
    "pending_issuance_assignment",
  ].includes(filters.statusFilter);

  const groups = ["quick", "stage", "payment", "terminal"] as const;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
      {/* Top Row: Search + Actions */}
      <div className="px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-100">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search by code, name, client, email, phone..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          className="w-full lg:max-w-md rounded-xl h-10 border-gray-200 hover:border-[#0D4A2A] focus:border-[#0D4A2A] transition-all shadow-sm bg-gray-50/50"
          allowClear
        />

        <div className="flex items-center gap-3 shrink-0">
          {/* View toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200">
            <Tooltip title="Grid view">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#0D4A2A] shadow-sm border border-gray-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <AppstoreOutlined />
                <span>Grid</span>
              </button>
            </Tooltip>
            <Tooltip title="List view">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-[#0D4A2A] shadow-sm border border-gray-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <UnorderedListOutlined />
                <span>List</span>
              </button>
            </Tooltip>
          </div>

          {showBulkAssign && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={openBulkAssignModal}
              disabled={selectedCount === 0}
              className="bg-[#0D4A2A] hover:!bg-[#0a3a21] h-9 px-5 rounded-lg font-semibold border-none shadow-sm"
            >
              Bulk Assign{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-4 py-2.5 bg-gray-50/40">
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-start">
          {groups.map((group, gi) => {
            const groupOptions = STATUS_OPTIONS.filter((o) => o.group === group);
            return (
              <div key={group} className="flex items-center gap-1.5 flex-wrap">
                {/* Group label divider */}
                {gi > 0 && (
                  <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
                )}
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mr-0.5 self-center">
                  {GROUP_LABELS[group]}
                </span>
                {groupOptions.map((opt) => {
                  const isActive = filters.statusFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleFilterChange("statusFilter", opt.value)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all leading-none select-none ${
                        isActive ? opt.active : opt.color
                      }`}
                    >
                      <span className="text-[10px]">{opt.icon}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
