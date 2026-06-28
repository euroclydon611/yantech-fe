import { styles } from "../../../styles";
import { Select, Drawer, Table, Button, InputNumber } from "antd";
const { Option } = Select;
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRankUpdateMutation } from "../../../redux/features/sections/ranksApi";
import { usePmeFullListQuery } from "../../../redux/features/configurations/pmeApi";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Rank name is required"),
  basic_salary: Yup.string().required("Basic salary is required"),
});

interface EditRankProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData: any;
  refetch: () => void;
}

const EditRank = ({ open, onClose, itemData, refetch }: EditRankProps) => {
  const [allowances_ids, setAllowances] = useState(
    itemData?.allowances_ids || []
  );
  const [deductions_ids, setDeductions] = useState(
    itemData?.deductions_ids || []
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notches, setNotches] = useState<Record<string, any>>(
    itemData?.notches || {}
  );

  const { data: allowancesList } = usePmeFullListQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [rankUpdate, { data, isSuccess, error, isLoading }] =
    useRankUpdateMutation();

  const formik = useFormik({
    initialValues: {
      name: itemData?.name || "",
      basic_salary: itemData?.basic_salary || "0",
      hourly_rate: itemData?.hourly_rate || "0",
      allowable_leave_days: itemData?.allowable_leave_days || "0",
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async ({
      name,
      basic_salary,
      hourly_rate,
      // allowable_leave_days,
    }) => {
      await rankUpdate({
        idToEdit: itemData._id,
        name,
        basic_salary: basic_salary?.toString(),
        allowances_ids,
        deductions_ids,
        hourly_rate,
        notches,
        // allowable_leave_days,
      });
    },
  });

  useEffect(() => {
    if (open) {
      setAllowances(itemData?.allowances_ids || []);
      setDeductions(itemData?.deductions_ids || []);
      setNotches(itemData?.notches || {});
    } else {
      formik.resetForm();
      setAllowances([]);
      setDeductions([]);
      setNotches({});
    }
  }, [open, itemData]);

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch();
          onClose();
        }
      });
    }
    if (error) {
      if ("data" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          // timer: 5000,
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const getNextNotchNumber = () => {
    const notchKeys = Object.keys(notches);
    if (notchKeys.length === 0) return 1;
    const numbers = notchKeys
      .map((key) => parseInt(key.replace("notch_", "")))
      .filter((num) => !isNaN(num));
    return Math.max(...numbers) + 1;
  };

  const handleAddNotch = () => {
    const nextNumber = getNextNotchNumber();
    const newNotchKey = `notch_${nextNumber}`;
    setNotches({
      ...notches,
      [newNotchKey]: {
        basic_salary: 0,
        hourly_rate: 0,
        allowances_ids: [],
        deductions_ids: [],
      },
    });
  };

  const handleRemoveNotch = (notchKey: string) => {
    const newNotches = { ...notches };
    delete newNotches[notchKey];
    setNotches(newNotches);
  };

  const handleNotchFieldChange = (
    notchKey: string,
    fieldName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setNotches({
      ...notches,
      [notchKey]: {
        ...notches[notchKey],
        [fieldName]: value,
      },
    });
  };

  const notchTableColumns: any[] = [
    {
      title: "Notch",
      key: "notch",
      width: 80,
      render: (record: any) => {
        return record.notch;
      },
    },
    {
      title: "Basic Salary",
      key: "basic_salary",
      width: 100,
      render: (record: any) => {
        const notchKey = record.notch;
        return (
          <InputNumber
            type="number"
            value={notches[notchKey]?.basic_salary}
            onChange={(value) =>
              handleNotchFieldChange(notchKey, "basic_salary", value)
            }
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Hourly Rate",
      key: "hourly_rate",
      width: 100,
      render: (record: any) => {
        const notchKey = record.notch;
        return (
          <InputNumber
            type="number"
            value={notches[notchKey]?.hourly_rate}
            onChange={(value) =>
              handleNotchFieldChange(notchKey, "hourly_rate", value)
            }
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 70,
      align: "center" as const,
      render: (record: any) => {
        const notchKey = record.notch;
        return (
          <button
            type="button"
            onClick={() => handleRemoveNotch(notchKey)}
            className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
          >
            <MinusOutlined />
          </button>
        );
      },
    },
  ];

  const notchDataSource = Object.keys(notches).map((key) => ({
    key: key,
    notch: key,
  }));

  return (
    <Drawer
      title="Edit Rank"
      onClose={onClose}
      open={open}
      width={900}
      maskClosable={false}
    >
      <div className="fade-in">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/epa-logo.png" alt="EPA Logo" className="h-12" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={`${styles.label}`}>
              Rank Name
            </label>
            <input
              type="text"
              id="name"
              value={values.name}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Department Name"
            />
            {errors.name && touched.name && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.name as string}
              </span>
            )}
          </div>
          <div className="!hidden">
            <label htmlFor="salary" className={`${styles.label}`}>
              Basic Salary
            </label>
            <input
              type="number"
              id="basic_salary"
              value={values.basic_salary}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Basic Salary"
            />
            {errors.basic_salary && touched.basic_salary && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.basic_salary as string}
              </span>
            )}
          </div>

          <div className="!hidden">
            <label htmlFor="hourly_rate" className={`${styles.label}`}>
              Hourly Rate
            </label>
            <input
              type="number"
              id="hourly_rate"
              value={values.hourly_rate}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Ex: 200"
            />
          </div>

          <div>
            <label htmlFor="allowances">Select Allowances</label>
            <Select
              mode="multiple"
              id="allowances"
              style={{ width: "100%" }}
              placeholder="Choose..."
              value={allowances_ids}
              onChange={(selectedOptions) => setAllowances(selectedOptions)}
            >
              {allowancesList &&
                allowancesList.data?.length > 0 &&
                 
                allowancesList.data
                  .filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (allowance: any) =>
                      (allowance.type === "allowance" &&
                        allowance.level === "General") ||
                      (allowance.type === "bonus" &&
                        allowance.level === "General")
                  )
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((allowance: any) => (
                    <Option key={allowance._id} value={allowance._id}>
                      {allowance.name}
                    </Option>
                  ))}{" "}
            </Select>
          </div>

          <div>
            <label htmlFor="deductions">Select Deductions</label>
            <Select
              mode="multiple"
              id="deductions"
              style={{ width: "100%" }}
              placeholder="Choose..."
              value={deductions_ids}
              onChange={(selectedOptions) => setDeductions(selectedOptions)}
            >
              {allowancesList &&
                allowancesList.data?.length > 0 &&
                 
                allowancesList.data
                  .filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (allowance: any) =>
                      allowance.type === "deduction" &&
                      allowance.level === "General"
                  )
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((allowance: any) => (
                    <Option key={allowance._id} value={allowance._id}>
                      {allowance.name}
                    </Option>
                  ))}{" "}
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className={`${styles.label} !mb-0`}>Notches</label>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNotch}
                size="small"
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Add Notch
              </Button>
            </div>
            {Object.keys(notches).length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-sm border border-gray-200">
                <Table
                  columns={notchTableColumns}
                  dataSource={notchDataSource}
                  pagination={false}
                  size="small"
                  rowKey="key"
                />
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-gray-500 text-sm">No notches added yet</p>
              </div>
            )}
          </div>

          {/* <div>
          <label htmlFor="allowable_leave_day" className={`${styles.label}`}>
            Allowable leave days
          </label>
          <input
            type="number"
            id="allowable_leave_days"
            value={values.allowable_leave_days}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Ex: 15"
          />
        </div> */}

          <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
            <button type="submit" className={`${styles.small_btn}`}>
              {isLoading ? "Please wait" : "Submit"}
            </button>
          </div>
          <br />
        </form>
      </div>
    </Drawer>
  );
};

export default EditRank;
