import { FC, useState } from "react";
import {
  Drawer,
  Select,
  InputNumber,
  Button,
  Space,
  Alert,
  Switch,
  Tooltip,
} from "antd";
import { SearchOutlined, SnippetsOutlined, CheckCircleOutlined, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEmployeeFullListQuery } from "@/redux/features/employee/employeeApi";

interface MonthOption {
  label: string;
  value: string;
}

interface RefreshPayrollSnapshotDrawerProps {
  open: boolean;
  onClose: () => void;
  payMonth: string;
  year: number;
  onPayMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
  monthOptions: MonthOption[];
  isRefreshing: boolean;
  onRefreshForSelected: (employeeIds: string[], preserveVerificationStatus: boolean) => void;
}

type SelectionMode = "search" | "paste";

const RefreshPayrollSnapshotDrawer: FC<RefreshPayrollSnapshotDrawerProps> = ({
  open,
  onClose,
  payMonth,
  year,
  onPayMonthChange,
  onYearChange,
  monthOptions,
  isRefreshing,
  onRefreshForSelected,
}) => {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("search");
  const [pasteInput, setPasteInput] = useState("");
  const [pasteResult, setPasteResult] = useState<{ matched: string[]; notFound: string[] } | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [preserveVerificationStatus, setPreserveVerificationStatus] = useState(false);

  const { data: allEmployeesData, isLoading: allEmployeesLoading } = useEmployeeFullListQuery(
    {},
    { skip: !open }
  );

  const { data: searchedEmployeesData } = useEmployeeFullListQuery(
    { search: employeeSearch } as any,
    { skip: !open }
  );

  const employeeOptions = (searchedEmployeesData || allEmployeesData || []).map((e: any) => ({
    label: `${e.staff_id} — ${e.firstname} ${e.lastname}`,
    value: e._id,
  }));

  const handleApplyPaste = () => {
    if (!pasteInput.trim() || !allEmployeesData) return;
    const rawIds = pasteInput
      .split(/[\n,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const matched: string[] = [];
    const notFound: string[] = [];

    rawIds.forEach((sid) => {
      const emp = (allEmployeesData as any[]).find(
        (e: any) => String(e.staff_id).toLowerCase() === sid.toLowerCase()
      );
      if (emp) {
        matched.push(emp._id);
      } else {
        notFound.push(sid);
      }
    });

    const merged = Array.from(new Set([...selectedEmployees, ...matched]));
    setSelectedEmployees(merged);
    setPasteResult({ matched, notFound });
  };

  const handleSubmit = () => {
    if (selectedEmployees.length === 0) return;
    onRefreshForSelected(selectedEmployees, preserveVerificationStatus);
  };

  const handleClose = () => {
    setSelectedEmployees([]);
    setPasteInput("");
    setPasteResult(null);
    setSelectionMode("search");
    setPreserveVerificationStatus(false);
    onClose();
  };

  return (
    <Drawer
      title="Refresh Payroll Snapshots"
      placement="right"
      onClose={handleClose}
      open={open}
      width={600}
    >
      <div style={{ marginBottom: "20px" }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pay Month:
        </label>
        <Select
          style={{ width: "100%" }}
          placeholder="Select month"
          value={payMonth || undefined}
          onChange={onPayMonthChange}
          options={monthOptions}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year:
        </label>
        <InputNumber
          style={{ width: "100%" }}
          value={year}
          onChange={(val) => onYearChange(val || new Date().getFullYear())}
          min={2020}
          max={2100}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Employees{" "}
            {selectedEmployees.length > 0 && (
              <span className="ml-1 text-purple-600 font-semibold">({selectedEmployees.length} selected)</span>
            )}
          </label>
        </div>

        <div className="flex mb-3 rounded-md overflow-hidden border border-gray-200 w-fit">
          <button
            type="button"
            onClick={() => { setSelectionMode("search"); setPasteResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors ${
              selectionMode === "search" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SearchOutlined />
            Search &amp; Select
          </button>
          <button
            type="button"
            onClick={() => { setSelectionMode("paste"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors border-l border-gray-200 ${
              selectionMode === "paste" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SnippetsOutlined />
            Paste Staff IDs
          </button>
        </div>

        {selectionMode === "search" ? (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Search and select employees"
            value={selectedEmployees}
            onChange={setSelectedEmployees}
            options={employeeOptions}
            onSearch={setEmployeeSearch}
            filterOption={false}
          />
        ) : (
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
              <p className="text-[12px] text-purple-700">
                Paste staff IDs separated by commas, spaces, or new lines (e.g. copy a column from Excel).
                Matched IDs will be <strong>added</strong> to any existing selection.
              </p>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={5}
              placeholder={"1173\n1174\n1177\n1183, 1186, 1187\n..."}
              value={pasteInput}
              onChange={(e) => { setPasteInput(e.target.value); setPasteResult(null); }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? "s" : ""} selected total
              </span>
              <div className="flex gap-2">
                {selectedEmployees.length > 0 && (
                  <Button size="small" type="dashed" danger onClick={() => setSelectedEmployees([])}>
                    Clear All
                  </Button>
                )}
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  disabled={!pasteInput.trim() || allEmployeesLoading}
                  loading={allEmployeesLoading}
                  onClick={handleApplyPaste}
                  style={{ backgroundColor: "#7c3aed", borderColor: "#7c3aed" }}
                >
                  Apply IDs
                </Button>
              </div>
            </div>
            {pasteResult && (
              <div className="space-y-2">
                {pasteResult.matched.length > 0 && (
                  <Alert
                    type="success"
                    showIcon
                    message={
                      <span className="text-[12px]">
                        <strong>{pasteResult.matched.length}</strong> employee{pasteResult.matched.length !== 1 ? "s" : ""} matched and added to selection.
                      </span>
                    }
                  />
                )}
                {pasteResult.notFound.length > 0 && (
                  <Alert
                    type="warning"
                    showIcon
                    message={
                      <span className="text-[12px]">
                        <strong>{pasteResult.notFound.length}</strong> ID{pasteResult.notFound.length !== 1 ? "s" : ""} not found:{" "}
                        <span className="font-mono text-[11px] text-gray-600">
                          {pasteResult.notFound.slice(0, 10).join(", ")}
                          {pasteResult.notFound.length > 10 ? ` ...and ${pasteResult.notFound.length - 10} more` : ""}
                        </span>
                      </span>
                    }
                  />
                )}
                {pasteResult.matched.length === 0 && (
                  <Alert
                    type="error"
                    showIcon
                    message={<span className="text-[12px]">None of the pasted IDs matched any employee records.</span>}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-5 p-3 rounded-lg border" style={{ borderColor: preserveVerificationStatus ? "#d97706" : "#e5e7eb", backgroundColor: preserveVerificationStatus ? "#fffbeb" : "#f9fafb" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={preserveVerificationStatus}
              onChange={setPreserveVerificationStatus}
              size="small"
              style={preserveVerificationStatus ? { backgroundColor: "#d97706" } : {}}
            />
            <span className="text-[13px] font-medium text-gray-700">Recalculate figures only</span>
            <Tooltip title="When ON: recalculates salary figures without changing the current verification status. When OFF: verification status resets to Pending Review.">
              <InfoCircleOutlined className="text-gray-400 cursor-help" />
            </Tooltip>
          </div>
        </div>
        {preserveVerificationStatus && (
          <p className="text-[11px] text-amber-700 mt-2 mb-0">
            Salaries and figures will be recalculated. Existing verification statuses will <strong>not</strong> be changed.
          </p>
        )}
      </div>

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={isRefreshing}
          onClick={handleSubmit}
          disabled={selectedEmployees.length === 0 || !payMonth}
          style={{ backgroundColor: preserveVerificationStatus ? "#d97706" : "#722ed1", borderColor: preserveVerificationStatus ? "#d97706" : "#722ed1" }}
        >
          {preserveVerificationStatus ? "Recalculate" : "Refresh"} {selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : "Selected"}
        </Button>
      </Space>
    </Drawer>
  );
};

export default RefreshPayrollSnapshotDrawer;
