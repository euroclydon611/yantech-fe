import { styles } from "../../../styles";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRankFullListQuery } from "../../../redux/features/sections/ranksApi";
import { Select } from "antd";
import { useRankIncrementStoreMutation } from "../../../redux/features/configurations/rankIncrementApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter rank name"),
  type: Yup.string().required("Please select type"),
  value: Yup.number().required("Please enter value"),
});
const { Option } = Select;

const EditRankIncrement = ({ setOpen, refetch, itemData }: any) => {
  const [rankIncrementStore, { data, isSuccess, isLoading, error }] =
    useRankIncrementStoreMutation();

  const [employees, setEmployees] = useState([]);
  const [ranks, setRanks] = useState([]);

  const { data: rankListData } = useRankFullListQuery({});
  const { data: employeeList } = useEmployeeFullListQuery({});

  const formik = useFormik({
    initialValues: {
      name: itemData?.name as string,
      type: "percentage",
      value: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, type, value }) => {
      console.log({
        name,
        grade_ids: ranks,
        percentage: value,
        users: employees,
        is_flat_amount_val: type === "percentage" ? "1" : "0",
      });
      await rankIncrementStore({
        name,
        grade_ids: ranks,
        percentage: value?.toString(),
        users: employees,
        is_flat_amount_val: type === "percentage" ? "1" : "0",
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Successful!";
      toast.success(message, { duration: 5000 });
      setOpen(false);
      refetch();
    }
    if (error) {
      console.log(error);
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.error, { duration: 5000 });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Rank Increment Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Rank Increment Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="type" className={`${styles.label}`}>
            Select Type
          </label>
          <select
            id="type"
            value={values.type}
            onChange={handleChange}
            className={`${styles.input}`}
          >
            <option value="percentage">Percentage</option>
            <option value="rate">Amount</option>
          </select>
          {errors.type && touched.type && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.type}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="value" className={`${styles.label}`}>
            Enter {values?.type === "percentage" ? "Percentage" : "Rate"}
          </label>
          <input
            type="number"
            id="value"
            value={values.value}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder={`Enter ${
              values?.type === "percentage" ? "Percentage" : "Rate"
            }`}
          />
          {errors.value && touched.value && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.value}
            </span>
          )}
        </div>
        <div className="overflow-y">
          <label htmlFor="value" className={`${styles.label}`}>
            Select Rank(s)
          </label>
          <div>
            <Select
              mode="multiple"
              value={ranks}
              placeholder="Please select Rank(s)"
              onChange={(selectedOptions: any) => {
                if (selectedOptions.includes("")) {
                  setRanks(
                    rankListData.data.map((rank: any) => rank.id).concat("")
                  );
                } else {
                  setRanks(selectedOptions);
                }
              }}
              style={{ width: "100%" }}
            >
              <Option value="">Select All</Option>
              {rankListData &&
                rankListData !== null &&
                rankListData?.data?.map((rank: any, index: any) => (
                  <Option key={index} value={rank.id}>
                    {rank.name}
                  </Option>
                ))}
            </Select>
          </div>
        </div>
        <div className="overflow-y">
          <label htmlFor="value" className={`${styles.label}`}>
            Select Employee(s)
          </label>
          <div>
            <Select
              mode="multiple"
              value={employees}
              placeholder="Please select Employee(s)"
              onChange={(selectedOptions: any) => {
                if (selectedOptions.includes("")) {
                  setEmployees(
                    employeeList.map((employee: any) => employee.id).concat("")
                  );
                } else {
                  setEmployees(selectedOptions);
                }
              }}
              style={{ width: "100%" }}
            >
              <Option value="">Select All</Option>
              {employeeList &&
                employeeList !== null &&
                employeeList.map((employee: any, i: number) => (
                  <Option key={i} value={employee.id}>
                    {employee.staff_id} - {employee.firstname}{" "}
                    {employee.lastname}
                  </Option>
                ))}
            </Select>
          </div>
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default EditRankIncrement;
