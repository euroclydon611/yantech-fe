import React, { FC, useState } from "react";
import {
  Drawer,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Alert,
} from "antd";
import { SearchOutlined, SnippetsOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { styles } from "@/styles";
import moment from "moment";
import { useEmployeeFullListQuery } from "@/redux/features/employee/employeeApi";

interface MonthOption {
  label: string;
  value: string;
}

interface CreatePayrollSnapshotDrawerProps {
  open: boolean;
  onClose: () => void;
  payMonth: string;
  year: number;
  onPayMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
  payrollStartDate: any;
  onPayrollStartDateChange: (date: any) => void;
  payrollEndDate: any;
  onPayrollEndDateChange: (date: any) => void;
  selectedEmployees: string[];
  onSelectedEmployeesChange: (employees: string[]) => void;
  employeeSearch: string;
  onEmployeeSearchChange: (search: string) => void;
  employeeOptions: any[];
  monthOptions: MonthOption[];
  isCreating: boolean;
  isCreatingAll: boolean;
  onCreateForSelected: () => void;
  onCreateForAll: () => void;
  formik: any;
}

type SelectionMode = "search" | "paste";

const CreatePayrollSnapshotDrawer: FC<CreatePayrollSnapshotDrawerProps> = ({
  open,
  onClose,
  payMonth,
  year,
  onPayMonthChange,
  onYearChange,
  payrollStartDate,
  onPayrollStartDateChange,
  payrollEndDate,
  onPayrollEndDateChange,
  selectedEmployees,
  onSelectedEmployeesChange,
  employeeSearch,
  onEmployeeSearchChange,
  employeeOptions,
  monthOptions,
  isCreating,
  isCreatingAll,
  onCreateForSelected,
  onCreateForAll,
  formik,
}) => {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("search");
  const [pasteInput, setPasteInput] = useState("");
  const [pasteResult, setPasteResult] = useState<{ matched: string[]; notFound: string[] } | null>(null);

  const { data: allEmployeesData, isLoading: allEmployeesLoading } = useEmployeeFullListQuery(
    {},
    { skip: !open }
  );

  const handleApplyPaste = () => {
    if (!pasteInput.trim() || !allEmployeesData) return;
    const rawIds = pasteInput
      .split(/[\n,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const matched: string[] = [];
    const notFound: string[] = [];

    rawIds.forEach((sid) => {
      const emp = allEmployeesData.find(
        (e: any) => String(e.staff_id).toLowerCase() === sid.toLowerCase()
      );
      if (emp) {
        matched.push(emp._id);
      } else {
        notFound.push(sid);
      }
    });

    const merged = Array.from(new Set([...selectedEmployees, ...matched]));
    onSelectedEmployeesChange(merged);
    setPasteResult({ matched, notFound });
  };

  return (
    <Drawer
      title="Create Payroll Snapshot"
      placement="right"
      onClose={onClose}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payroll Start Date (Optional):
        </label>
        <DatePicker
          style={{ width: "100%" }}
          value={payrollStartDate}
          onChange={(date) => {
            onPayrollStartDateChange(date);
            formik.setFieldValue(
              "payrollStartDate",
              date ? date.toDate() : null
            );
          }}
          disabledDate={(current) => {
            if (!payMonth || !current) return true;
            const payrollMonth = moment(
              `${payMonth.toLowerCase()} ${year}`,
              "MMMM YYYY"
            );
            const previousMonth = payrollMonth.clone().subtract(1, "months");
            const currentDate = current.toDate ? current.toDate() : current;
            return (
              currentDate < previousMonth.startOf("month").toDate() ||
              currentDate > previousMonth.endOf("month").toDate()
            );
          }}
          placeholder="Must be in previous month"
        />
        {formik.errors.payrollStartDate && (
          <span className="text-red-500 pt-2 block text-sm">
            {formik.errors.payrollStartDate as string}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payroll End Date (Optional):
        </label>
        <DatePicker
          style={{ width: "100%" }}
          value={payrollEndDate}
          onChange={(date) => {
            onPayrollEndDateChange(date);
            formik.setFieldValue("payrollEndDate", date ? date.toDate() : null);
          }}
          disabledDate={(current) => {
            if (!payMonth || !current) return true;
            const payrollMonth = moment(
              `${payMonth.toLowerCase()} ${year}`,
              "MMMM YYYY"
            );
            const currentDate = current.toDate ? current.toDate() : current;
            const isInPayrollMonth =
              currentDate >= payrollMonth.startOf("month").toDate() &&
              currentDate <= payrollMonth.endOf("month").toDate();
            const isAfterStartDate =
              !payrollStartDate || currentDate >= payrollStartDate.toDate();
            return !isInPayrollMonth || !isAfterStartDate;
          }}
          placeholder="Must be in payroll month"
        />
        {formik.errors.payrollEndDate && (
          <span className="text-red-500 pt-2 block text-sm">
            {formik.errors.payrollEndDate as string}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Employees{" "}
            {selectedEmployees.length > 0 && (
              <span className="ml-1 text-blue-600 font-semibold">({selectedEmployees.length} selected)</span>
            )}
          </label>
        </div>

        {/* Mode toggle */}
        <div className="flex mb-3 rounded-md overflow-hidden border border-gray-200 w-fit">
          <button
            type="button"
            onClick={() => { setSelectionMode("search"); setPasteResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors ${
              selectionMode === "search" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SearchOutlined />
            Search & Select
          </button>
          <button
            type="button"
            onClick={() => { setSelectionMode("paste"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors border-l border-gray-200 ${
              selectionMode === "paste" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
            onChange={onSelectedEmployeesChange}
            options={employeeOptions}
            onSearch={onEmployeeSearchChange}
            filterOption={false}
          />
        ) : (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-[12px] text-amber-700">
                Paste staff IDs separated by commas, spaces, or new lines (e.g. copy a column from Excel).
                Matched IDs will be <strong>added</strong> to any existing selection.
              </p>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <Button size="small" type="dashed" danger onClick={() => onSelectedEmployeesChange([])}>
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
                  className="!bg-green-800"
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

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          loading={isCreatingAll}
          onClick={onCreateForAll}
          className={`${styles.primary_button}`}
        >
          Create for All
        </Button>
        <Button
          type="primary"
          loading={isCreating}
          onClick={onCreateForSelected}
          disabled={selectedEmployees.length === 0}
          className={`${styles.primary_button}`}
        >
          Create for Selected
        </Button>
      </Space>
    </Drawer>
  );
};

export default CreatePayrollSnapshotDrawer;
