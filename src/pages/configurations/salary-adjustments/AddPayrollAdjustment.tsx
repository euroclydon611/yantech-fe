import { styles } from "../../../styles";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { 
  useCreatePayrollAdjustmentMutation,
  useUpdatePayrollAdjustmentMutation 
} from "../../../redux/features/reports/payrollAdjustmentApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import { useGetLoansByEmployeeQuery } from "../../../redux/features/configurations/employeeLoanApi";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { Drawer, Select, Tooltip, Button, Checkbox } from "antd";
import { FaPlus, FaTrash } from "react-icons/fa";
import { AiOutlineFilePdf } from "react-icons/ai";

const itemSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  category: Yup.string().required("Category is required"),
  amount: Yup.number().min(0, "Min 0").when("percentage", {
    is: (val: any) => !val || val === 0,
    then: (schema) => schema.required("Amount is required"),
    otherwise: (schema) => schema.optional()
  }),
  percentage: Yup.number().min(0, "Min 0").max(100, "Max 100"),
  has_employer_contribution: Yup.boolean(),
  employer_percentage: Yup.number().min(0, "Min 0").max(100, "Max 100"),
  is_taxable: Yup.boolean(),
  is_pensionable: Yup.boolean(),
  description: Yup.string(),
});

const schema = Yup.object().shape({
  staff_id: Yup.string().when("is_group", {
    is: false,
    then: (schema) => schema.required("Please select employee"),
    otherwise: (schema) => schema.optional()
  }),
  employee_ids: Yup.array().when("is_group", {
    is: true,
    then: (schema) => schema.min(1, "Please select at least one employee"),
    otherwise: (schema) => schema.optional()
  }),
  period_month: Yup.string().required("Please select period month"),
  period_year: Yup.number().required("Please select period year"),
  effective_month: Yup.string().required("Please select effective month"),
  effective_year: Yup.number().required("Please select effective year"),
  items: Yup.array().when("mode", {
    is: "automated_retro",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.of(itemSchema).min(1, "Please add at least one item"),
  }),
});

interface AddPayrollAdjustmentProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  editData?: any;
}

const months = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const categories = [
  { label: "Arrears", value: "arrears" },
  { label: "Overpayment Recovery", value: "overpayment_recovery" },
  { label: "Manual Adjustment", value: "manual_adjustment" },
  { label: "Bonus Correction", value: "bonus_correction" },
  { label: "Tax Exemption Adj", value: "tax_exemption_adjustment" },
];

const AddPayrollAdjustment = ({ open, onClose, refetch, editData }: AddPayrollAdjustmentProps) => {
  const guidePdfPath = "/Payroll_PEN_TAX_Business_Rules.pdf";
  const [createAdjustment, { data, isSuccess, isLoading, error }] = useCreatePayrollAdjustmentMutation();
  const [updateAdjustment, { isSuccess: isUpdateSuccess, isLoading: isUpdating, error: updateError, data: updateData }] = useUpdatePayrollAdjustmentMutation();
  const { data: employeesData, isLoading: employeesLoading } = useEmployeeFullListQuery({}, { skip: !open });
  
  const formik = useFormik({
    initialValues: {
      staff_id: "",
      employee_ids: [],
      is_group: false,
      mode: "manual",
      period_month: months[new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1],
      period_year: new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
      effective_month: months[new Date().getMonth()],
      effective_year: new Date().getFullYear(),
      include_basic: true,
      include_pmes: true,
      include_loans: true,
      include_reliefs: true,
      items: [
        {
          name: "",
          type: "",
          category: "",
          amount: 0,
          percentage: 0,
          has_employer_contribution: false,
          employer_percentage: 0,
          is_taxable: true,
          is_pensionable: true,
          description: "",
          loan_id: null,
        }
      ],
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (editData) {
        await updateAdjustment({ ...values, _id: editData.id });
      } else {
        await createAdjustment(values);
      }
    },
  });

  // Find current employee object to get its _id for loan fetching
  const selectedEmployee = employeesData?.find((e: any) => e.staff_id === formik.values.staff_id);
  const employeeId = selectedEmployee?._id || "";
  
  const { data: loansData, isLoading: loansLoading } = useGetLoansByEmployeeQuery(employeeId, {
    skip: !employeeId || formik.values.is_group
  });

  useEffect(() => {
    if (editData) {
      formik.setValues({
        staff_id: typeof editData.staff_id === 'object' ? editData.staff_id?.staff_id : (editData.staff_id || ""),
        employee_ids: editData.employee_ids?.map((emp: any) => typeof emp === 'object' ? emp._id : emp) || [],
        is_group: editData.is_group || false,
        mode: editData.mode || "manual",
        period_month: editData.period_month,
        period_year: editData.period_year,
        effective_month: editData.effective_month,
        effective_year: editData.effective_year,
        include_basic: editData.include_basic ?? true,
        include_pmes: editData.include_pmes ?? true,
        include_loans: editData.include_loans ?? true,
        include_reliefs: editData.include_reliefs ?? true,
        items: (editData.items && editData.items.length > 0) ? editData.items.map((item: any) => ({
          name: item.name,
          type: item.type,
          category: item.category,
          amount: item.amount || 0,
          percentage: item.percentage || 0,
          has_employer_contribution: item.has_employer_contribution || false,
          employer_percentage: item.employer_percentage || 0,
          is_taxable: item.is_taxable,
          is_pensionable: item.is_pensionable,
          description: item.description,
          loan_id: item.loan_id || null,
        })) : [
          {
            name: "",
            type: "",
            category: "",
            amount: 0,
            percentage: 0,
            has_employer_contribution: false,
            employer_percentage: 0,
            is_taxable: true,
            is_pensionable: true,
            description: "",
            loan_id: null,
          }
        ],
      });
    } else {
      formik.resetForm();
    }
  }, [editData, open]);

  useEffect(() => {
    const success = isSuccess || isUpdateSuccess;
    const err = error || updateError;
    const responseData = data || updateData;

    if (success) {
      Swal.fire({
        title: responseData?.message || `Adjustment ${editData ? "updated" : "created"} successfully`,
        icon: "success",
        timer: 3000,
        confirmButtonColor: "#727cf5",
      }).then(() => {
        refetch();
        onClose();
      });
    }
    if (err) {
      const errorData = err as any;
      Swal.fire({
        title: "Error",
        text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [isSuccess, isUpdateSuccess, error, updateError]);

  const { errors, touched, values, setFieldValue, handleSubmit } = formik;

  const isProcessing = isLoading || isUpdating;

  return (
    <Drawer 
      title={editData ? "Edit Payroll Adjustment Group" : "Add Payroll Adjustment Group"} 
      onClose={onClose} 
      open={open} 
      width={800} 
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
          Download Business Rules Guide
        </Button>
      }
    >
      <FormikProvider value={formik}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-amber-50 p-3 rounded-md border border-amber-100 flex flex-col gap-1">
             <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
               <FaPlus size={10} /> Usage Guidance
             </p>
             <p className="text-[11px] text-amber-600 leading-relaxed">
               Use this form to record variations to regular pay. **Origin Period** is the month being corrected (the past), while **Payout Period** is when the money is actually added/deducted from the payslip (usually the current month).
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className={styles.label}>{values.is_group ? "Selected Employees (Multiple)" : "Employee"}</label>
              {values.is_group ? (
                <Select
                  mode="multiple"
                  showSearch
                  className="w-full"
                  placeholder="Select employees"
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
              ) : (
                <Select
                  showSearch
                  className="w-full"
                  placeholder="Select employee"
                  optionFilterProp="label"
                  loading={employeesLoading}
                  onChange={(value) => setFieldValue("staff_id", value)}
                  value={values.staff_id || undefined}
                  options={employeesData?.map((emp: any) => ({
                    value: emp.staff_id,
                    label: `${emp.staff_id} - ${emp.firstname} ${emp.lastname}`,
                  }))}
                />
              )}
              {values.is_group ? (
                errors.employee_ids && touched.employee_ids && <span className="text-red-500 text-xs">{errors.employee_ids as string}</span>
              ) : (
                errors.staff_id && touched.staff_id && <span className="text-red-500 text-xs">{errors.staff_id}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <Tooltip title="The specific month in the past that you are providing an adjustment for.">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 cursor-help underline decoration-dotted">Origin Period (The month being fixed)</p>
              </Tooltip>
              <div className="flex gap-2">
                <Select
                  className="flex-1"
                  placeholder="Month"
                  value={values.period_month}
                  onChange={(v) => setFieldValue("period_month", v)}
                  options={months.map(m => ({ label: m.toUpperCase(), value: m }))}
                />
                <Select
                  className="w-32"
                  placeholder="Year"
                  value={values.period_year}
                  onChange={(v) => setFieldValue("period_year", v)}
                  options={Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => ({ label: y.toString(), value: y }))}
                />
              </div>
            </div>
            <div>
              <Tooltip title="The payroll month when this money will be paid or deducted. Usually the current open month.">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2 cursor-help underline decoration-dotted">Payout Period (When money hits pocket)</p>
              </Tooltip>
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

          {values.mode === "automated_retro" ? (
             <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
               <h3 className="text-sm font-bold text-blue-700 border-b border-blue-200 pb-2 uppercase tracking-wide">Elements to Process</h3>
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
               <p className="text-[11px] text-blue-500 italic mt-2">
                 * Automated retro engine calculates these dynamically based on the difference between the Origin Period and the Payout Period.
               </p>
             </div>
          ) : (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-700">Adjustment Items</h3>
              <button
                type="button"
                className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  const newItems = [...values.items, {
                    name: "",
                    type: "",
                    category: "",
                    amount: 0,
                    percentage: 0,
                    has_employer_contribution: false,
                    employer_percentage: 0,
                    is_taxable: true,
                    is_pensionable: true,
                    description: "",
                    loan_id: null,
                  }];
                  setFieldValue("items", newItems);
                }}
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>

            <FieldArray name="items">
              {() => (
                <div className="space-y-3">
                  {values.items.map((item, index) => (
                    <div key={index} className="relative p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-blue-200 transition-colors">
                      {values.items.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                          onClick={() => {
                            const newItems = values.items.filter((_, i) => i !== index);
                            setFieldValue("items", newItems);
                          }}
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Element Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Basic Salary"
                            className={`${styles.input} !py-1 !px-2 !text-sm`}
                            value={item.name}
                            onChange={(e) => setFieldValue(`items.${index}.name`, e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Type</label>
                          <Select
                            className="w-full"
                            size="small"
                            value={item.type}
                            onChange={(v) => {
                              setFieldValue(`items.${index}.type`, v);
                              
                              // Auto-fill Name based on type if empty
                              if (v === "basic_salary") {
                                setFieldValue(`items.${index}.name`, "Basic Salary");
                                setFieldValue(`items.${index}.is_taxable`, true);
                                setFieldValue(`items.${index}.is_pensionable`, true);
                              } else if (v === "bonus") {
                                setFieldValue(`items.${index}.name`, "Bonus");
                                setFieldValue(`items.${index}.is_taxable`, true);
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              } else if (v === "tier_3_non_taxable") {
                                setFieldValue(`items.${index}.name`, "Provident Fund (Non Taxable)");
                                setFieldValue(`items.${index}.is_taxable`, true); // Reduces tax base
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              } else if (v === "tier_3_taxable") {
                                setFieldValue(`items.${index}.name`, "Provident Fund (Taxable)");
                                setFieldValue(`items.${index}.is_taxable`, false);
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              } else if (v === "tax_relief") {
                                setFieldValue(`items.${index}.name`, "Tax Relief");
                                setFieldValue(`items.${index}.is_taxable`, false);
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              } else if (v === "deduction") {
                                setFieldValue(`items.${index}.is_taxable`, false);
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              } else if (v === "allowance") {
                                setFieldValue(`items.${index}.is_taxable`, true);
                                setFieldValue(`items.${index}.is_pensionable`, false);
                              }
                            }}
                            options={[
                              { label: "Basic Salary", value: "basic_salary" },
                              { label: "Allowance", value: "allowance" },
                              { label: "Bonus", value: "bonus" },
                              { label: "Deduction", value: "deduction" },
                              { label: "Tax Relief", value: "tax_relief" },
                              { label: "Tier 3 (Non Taxable)", value: "tier_3_non_taxable" },
                              { label: "Tier 3 (Taxable)", value: "tier_3_taxable" },
                            ]}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Category</label>
                          <Select
                            className="w-full"
                            size="small"
                            value={item.category}
                            onChange={(v) => setFieldValue(`items.${index}.category`, v)}
                            options={categories}
                          />
                        </div>
                      </div>

                      {item.type === "deduction" && (
                        <div className="mb-3">
                           <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Link to Specific Loan (Optional)</label>
                           <Select
                            className="w-full"
                            size="small"
                            placeholder="Select a loan to attribute this deduction"
                            value={item.loan_id || undefined}
                            loading={loansLoading}
                            allowClear
                            onChange={(v) => {
                              setFieldValue(`items.${index}.loan_id`, v);
                              // If a loan is selected, auto-fill the name and amount no matter what
                              if (v) {
                                const selectedLoan = loansData?.data?.find((l: any) => l._id === v);
                                if (selectedLoan) {
                                  setFieldValue(`items.${index}.name`, `Loan: ${selectedLoan.lender_id?.name || "Repayment"}`);
                                  setFieldValue(`items.${index}.amount`, selectedLoan.monthly_deduction);
                                  // Loan deductions are typically not taxable or pensionable adjustments
                                  setFieldValue(`items.${index}.is_taxable`, false);
                                  setFieldValue(`items.${index}.is_pensionable`, false);
                                }
                              }
                            }}
                            options={loansData?.data?.map((l: any) => ({
                              label: `${l.lender_id?.name} (Bal: ${l.outstanding_balance})`,
                              value: l._id
                            }))}
                          />
                        </div>
                      )}

                      {(item.type === "tier_3_non_taxable" || item.type === "tier_3_taxable") && (
                        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-medium text-blue-600 mb-1 block uppercase text-xs">Employee Percentage (%)</label>
                            <input
                              type="number"
                              placeholder="e.g. 5"
                              className={`${styles.input} !py-1 !px-2 !text-sm`}
                              value={item.percentage}
                              onChange={(e) => setFieldValue(`items.${index}.percentage`, e.target.value)}
                            />
                            <p className="text-[10px] text-blue-400 mt-1 italic">* Calculated on Basic Salary adjustment in this set</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <label className="text-[11px] font-medium text-blue-600 block uppercase text-xs">Employer Percentage (%)</label>
                              <input
                                type="checkbox"
                                checked={item.has_employer_contribution}
                                onChange={(e) => setFieldValue(`items.${index}.has_employer_contribution`, e.target.checked)}
                              />
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Enable</span>
                            </div>
                            <input
                              type="number"
                              disabled={!item.has_employer_contribution}
                              placeholder="e.g. 10"
                              className={`${styles.input} !py-1 !px-2 !text-sm ${!item.has_employer_contribution ? "bg-gray-100" : ""}`}
                              value={item.employer_percentage}
                              onChange={(e) => setFieldValue(`items.${index}.employer_percentage`, e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div className="md:col-span-2">
                          <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Description</label>
                          <input
                            type="text"
                            placeholder="Reason for adjustment"
                            className={`${styles.input} !py-1 !px-2 !text-sm`}
                            value={item.description}
                            onChange={(e) => setFieldValue(`items.${index}.description`, e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 mb-1 block uppercase">Amount (GHS)</label>
                          <input
                            type="number"
                            className={`${styles.input} !py-1 !px-2 !text-sm text-right font-bold`}
                            value={item.amount}
                            onChange={(e) => setFieldValue(`items.${index}.amount`, e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3 pb-2">
                          <Tooltip title="Is this taxable?">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.is_taxable}
                                onChange={(e) => setFieldValue(`items.${index}.is_taxable`, e.target.checked)}
                                className="w-3 h-3"
                              />
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Tax</span>
                            </label>
                          </Tooltip>
                          <Tooltip title="Is this pensionable?">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.is_pensionable}
                                onChange={(e) => setFieldValue(`items.${index}.is_pensionable`, e.target.checked)}
                                className="w-3 h-3"
                              />
                              <span className="text-[10px] font-bold text-gray-400 uppercase">PEN</span>
                            </label>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
             {values.mode !== "automated_retro" ? (
               <>
                 <div className="flex flex-col gap-2">
                    <div className="text-right flex gap-4">
                        <div className="bg-green-50 px-3 py-1 rounded border border-green-100">
                          <p className="text-[10px] text-green-600 font-bold uppercase">Total Earning</p>
                          <p className="text-lg font-bold text-green-700">
                            {values.items.reduce((acc, curr) => ["earning", "basic_salary", "allowance", "bonus"].includes(curr.type) ? acc + Number(curr.amount || 0) : acc, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="bg-red-50 px-3 py-1 rounded border border-red-100">
                          <p className="text-[10px] text-red-600 font-bold uppercase">Total Deduction</p>
                          <p className="text-lg font-bold text-red-700">
                            {values.items.reduce((acc, curr) => ["deduction", "tier_3", "tier_3_non_taxable", "tier_3_taxable"].includes(curr.type) ? acc + Number(curr.amount || 0) : acc, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">* Values shown here are gross figures. Final net pay will be calculated based on tax and pension rules.</p>
                 </div>
                 <button type="submit" className={`${styles.small_btn} !px-8 !py-2`} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : editData ? "Update" : "Submit"}
                 </button>
               </>
             ) : (
               <div className="w-full flex justify-end">
                 <button type="submit" className={`${styles.small_btn} !px-8 !py-2 !bg-blue-600 !text-white`} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : editData ? "Update" : "Submit"}
                 </button>
               </div>
             )}
          </div>
        </form>
      </FormikProvider>
    </Drawer>
  );
};

export default AddPayrollAdjustment;
