import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGenerateGroupRetroMutation
} from "../../../redux/features/reports/payrollAdjustmentApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import { useRankFullListQuery } from "../../../redux/features/sections/ranksApi";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Drawer, Select, Button, Checkbox, Spin, Tag, Alert } from "antd";
import { AiOutlineFilePdf } from "react-icons/ai";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { SearchOutlined, SnippetsOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { formatDate, formatDate4 } from "@/utils/helperFunction";

const { Option } = Select;

type SelectionMode = "search" | "paste";

const schema = Yup.object().shape({
  employee_ids: Yup.array().of(Yup.string()).min(1, "Please select at least one employee"),
  period_month: Yup.string().required("Please select period month"),
  period_year: Yup.number().required("Please select period year"),
  effective_month: Yup.string().required("Please select payout month"),
  effective_year: Yup.number().required("Please select payout year"),
});

interface GroupRetroAdjustmentProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const months = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const GroupRetroAdjustment = ({ open, onClose, refetch }: GroupRetroAdjustmentProps) => {
  const guidePdfPath = "/Payroll_PEN_TAX_Business_Rules.pdf";

  const [selectionMode, setSelectionMode] = useState<SelectionMode>("search");
  const [pasteInput, setPasteInput] = useState("");
  const [pasteResult, setPasteResult] = useState<{ matched: string[]; notFound: string[] } | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [gender, setGender] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [graEmploymentType, setGraEmploymentType] = useState("");
  const [graPosition, setGraPosition] = useState("");

  const [generateRetro, { data, isSuccess, isLoading, error }] = useGenerateGroupRetroMutation();

  const { data: employeesData, isLoading: employeesLoading } = useEmployeeFullListQuery(
    { gender, grade_id: gradeId, gra_employment_type: graEmploymentType, gra_position: graPosition },
    { skip: !open }
  );
  const { data: rankList } = useRankFullListQuery({}, { skip: !open });

  const formik = useFormik({
    initialValues: {
      employee_ids: [] as string[],
      period_month: months[new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1],
      period_year: new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
      effective_month: months[new Date().getMonth()],
      effective_year: new Date().getFullYear(),
      include_basic: true,
      include_pmes: true,
      include_loans: true,
      include_reliefs: true
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Confirm Retro Generation",
        text: `Are you sure you want to generate retroactive adjustments for ${values.employee_ids.length} employees? This will automatically calculate active elements for ${values.period_month.toUpperCase()} ${values.period_year}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Generate All"
      });

      if (result.isConfirmed) {
        await generateRetro(values);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSelectionMode("search");
      setPasteInput("");
      setPasteResult(null);
      setShowFilters(false);
      setGender("");
      setGradeId("");
      setGraEmploymentType("");
      setGraPosition("");
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: "Retro Generation Complete",
        text: data?.message || "Successfully generated retroactive adjustments",
        icon: "success",
        confirmButtonColor: "#727cf5",
      }).then(() => {
        refetch();
        onClose();
        formik.resetForm();
      });
    }
    if (error) {
      const errorData = error as any;
      Swal.fire({
        title: "Error",
        text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [isSuccess, error]);

  const { errors, touched, values, setFieldValue, handleSubmit } = formik;

  const filteredEmployeeIds = employeesData?.map((e: any) => e._id) || [];
  const hasActiveFilters = !!(gender || gradeId || graEmploymentType || graPosition);

  const handleSelectAllFiltered = () => {
    const merged = Array.from(new Set([...values.employee_ids, ...filteredEmployeeIds]));
    setFieldValue("employee_ids", merged);
  };

  const handleClearAll = () => setFieldValue("employee_ids", []);

  const handleResetFilters = () => {
    setGender("");
    setGradeId("");
    setGraEmploymentType("");
    setGraPosition("");
  };

  const handleApplyPaste = () => {
    if (!pasteInput.trim() || !employeesData) return;
    const allEmployees: any[] = employeesData;

    const rawIds = pasteInput
      .split(/[\n,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const matched: string[] = [];
    const notFound: string[] = [];

    rawIds.forEach((sid) => {
      const emp = allEmployees.find(
        (e) => String(e.staff_id).toLowerCase() === sid.toLowerCase()
      );
      if (emp) {
        matched.push(emp._id);
      } else {
        notFound.push(sid);
      }
    });

    const merged = Array.from(new Set([...values.employee_ids, ...matched]));
    setFieldValue("employee_ids", merged);
    setPasteResult({ matched, notFound });
  };

  return (
    <Drawer
      title="Automated Salary Retro Engine (Bulk Mode)"
      onClose={onClose}
      open={open}
      width={700}
      maskClosable={false}
      extra={
        <Button
          type="link"
          icon={<AiOutlineFilePdf size={18} />}
          href={guidePdfPath}
          target="_blank"
          download="Payroll_Adjustment_Business_Rules.pdf"
          className="flex items-center gap-1 font-bold text-red-600"
        >
          Guide
        </Button>
      }
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">
            This engine automatically fetches and calculates active pay elements (Basic, PMEs, Loans, Reliefs) for the selected employees during the **Origin Period** and adds them as adjustments to be paid in the **Payout Period**.
          </p>
        </div>

        {/* ── Employee Selection ── */}
        <div>
          {/* Header row */}
          <div className="flex justify-between items-center mb-2">
            <label className={styles.label}>
              Select Employees{" "}
              <Tag color="blue" className="ml-1">
                Selected: ({values.employee_ids.length})
              </Tag>
            </label>
            {selectionMode === "search" && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showFilters ? <MdFilterListOff size={18} /> : <MdFilterList size={18} />}
                {showFilters ? "Hide Filters" : "Advanced Filters"}
                {hasActiveFilters && !showFilters && (
                  <span className="ml-1 bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0 leading-4">
                    {[gender, gradeId, graEmploymentType, graPosition].filter(Boolean).length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mode toggle */}
          <div className="flex gap-0 mb-3 rounded-md overflow-hidden border border-gray-200 w-fit">
            <button
              type="button"
              onClick={() => { setSelectionMode("search"); setPasteResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors ${
                selectionMode === "search"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SearchOutlined />
              Search & Select
            </button>
            <button
              type="button"
              onClick={() => { setSelectionMode("paste"); setShowFilters(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors border-l border-gray-200 ${
                selectionMode === "paste"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SnippetsOutlined />
              Paste Staff IDs
            </button>
          </div>

          {selectionMode === "search" ? (
            <>
              {/* Advanced Filters panel */}
              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md mb-3 border border-gray-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-gray-500 uppercase">Gender</label>
                    <Select
                      placeholder="All Genders"
                      value={gender || undefined}
                      onChange={(val) => setGender(val || "")}
                      size="small"
                      className="w-full"
                      allowClear
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-gray-500 uppercase">Rank</label>
                    <Select
                      showSearch
                      placeholder="All Ranks"
                      value={gradeId || undefined}
                      onChange={(val) => setGradeId(val || "")}
                      size="small"
                      className="w-full"
                      optionFilterProp="children"
                      allowClear
                    >
                      {rankList?.data?.map((r: any) => (
                        <Option key={r._id} value={r._id}>{r.name}</Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-gray-500 uppercase">Employment Type</label>
                    <Select
                      placeholder="All Types"
                      value={graEmploymentType || undefined}
                      onChange={(val) => setGraEmploymentType(val || "")}
                      size="small"
                      className="w-full"
                      allowClear
                    >
                      <Option value="permanent">Permanent</Option>
                      <Option value="contract">Contract</Option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-gray-500 uppercase">Position</label>
                    <Select
                      placeholder="All Positions"
                      value={graPosition || undefined}
                      onChange={(val) => setGraPosition(val || "")}
                      size="small"
                      className="w-full"
                      allowClear
                    >
                      <Option value="senior">Senior</Option>
                      <Option value="junior">Junior</Option>
                    </Select>
                  </div>
                  {hasActiveFilters && (
                    <div className="col-span-full flex justify-end">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Employee multi-select */}
              <Select
                mode="multiple"
                showSearch
                className="w-full"
                placeholder="Search and select employees"
                optionFilterProp="label"
                loading={employeesLoading}
                onChange={(value) => setFieldValue("employee_ids", value)}
                value={values.employee_ids}
                options={employeesData?.map((emp: any) => ({
                  value: emp._id,
                  label: `${emp.staff_id} - ${emp.firstname} ${emp.lastname}`,
                }))}
                maxTagCount="responsive"
              />

              {/* Count + action buttons */}
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {values.employee_ids.length} of {employeesData?.length || 0}{" "}
                  {hasActiveFilters ? "filtered" : ""} employees selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    type="dashed"
                    disabled={employeesLoading || filteredEmployeeIds.length === 0}
                    onClick={handleSelectAllFiltered}
                  >
                    {hasActiveFilters ? "Select All Filtered" : "Select All"}
                  </Button>
                  <Button
                    size="small"
                    type="dashed"
                    danger
                    disabled={values.employee_ids.length === 0}
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Paste mode */}
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-[12px] text-amber-700">
                    Paste staff IDs separated by commas, spaces, or new lines (e.g. copy a column from Excel). 
                    Matched IDs will be <strong>added</strong> to any existing selection.
                  </p>
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder={"1173\n1174\n1177\n1183, 1186, 1187\n..."}
                  value={pasteInput}
                  onChange={(e) => { setPasteInput(e.target.value); setPasteResult(null); }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {values.employee_ids.length} employee{values.employee_ids.length !== 1 ? "s" : ""} selected total
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      type="dashed"
                      danger
                      disabled={values.employee_ids.length === 0}
                      onClick={handleClearAll}
                    >
                      Clear All
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      disabled={!pasteInput.trim() || employeesLoading}
                      loading={employeesLoading}
                      onClick={handleApplyPaste}
                      className="!bg-green-800"
                    >
                      Apply IDs
                    </Button>
                  </div>
                </div>

                {/* Paste results */}
                {pasteResult && (
                  <div className="space-y-2">
                    {pasteResult.matched.length > 0 && (
                      <Alert
                        type="success"
                        icon={<CheckCircleOutlined />}
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
                        icon={<CloseCircleOutlined />}
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
                    {pasteResult.matched.length === 0 && pasteResult.notFound.length > 0 && (
                      <Alert
                        type="error"
                        showIcon
                        message={<span className="text-[12px]">None of the pasted IDs matched any employee records.</span>}
                      />
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {errors.employee_ids && touched.employee_ids && (
            <span className="text-red-500 text-xs mt-1 block">{errors.employee_ids as string}</span>
          )}
        </div>

        {/* ── Periods ── */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Origin Period (The month being fixed)</p>
            <div className="flex gap-2">
              <Select
                className="flex-1"
                value={values.period_month}
                onChange={(v) => setFieldValue("period_month", v)}
                options={months.map(m => ({ label: m.toUpperCase(), value: m }))}
              />
              <Select
                className="w-32"
                value={values.period_year}
                onChange={(v) => setFieldValue("period_year", v)}
                options={Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => ({ label: y.toString(), value: y }))}
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Payout Period (When money hits pocket)</p>
            <div className="flex gap-2">
              <Select
                className="flex-1"
                value={values.effective_month}
                onChange={(v) => setFieldValue("effective_month", v)}
                options={months.map(m => ({ label: m.toUpperCase(), value: m }))}
              />
              <Select
                className="w-32"
                value={values.effective_year}
                onChange={(v) => setFieldValue("effective_year", v)}
                options={Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => ({ label: y.toString(), value: y }))}
              />
            </div>
          </div>
        </div>

        {/* ── Elements ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-wide">Elements to Process</h3>
          <div className="grid grid-cols-2 gap-4">
            <Checkbox
              checked={values.include_basic}
              onChange={e => setFieldValue("include_basic", e.target.checked)}
            >
              Basic Salary
            </Checkbox>
            <Checkbox
              checked={values.include_pmes}
              onChange={e => setFieldValue("include_pmes", e.target.checked)}
            >
              Allowances & PME Deductions
            </Checkbox>
            <Checkbox
              checked={values.include_loans}
              onChange={e => setFieldValue("include_loans", e.target.checked)}
            >
              Active Loan Deductions
            </Checkbox>
            <Checkbox
              checked={values.include_reliefs}
              onChange={e => setFieldValue("include_reliefs", e.target.checked)}
            >
              Personal Tax Reliefs
            </Checkbox>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-3">
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-blue-600 h-10 px-8 font-bold"
          >
            {isLoading ? <Spin size="small" /> : "Run Retro Engine"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default GroupRetroAdjustment;
