import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useOvertimeDecisionAdminMutation } from "../../../redux/features/reports/payrollRun";
import Swal from "sweetalert2";
import { useOvertimeFullListQuery } from "../../../redux/features/configurations/overtimeApi";
import { Select } from "antd";
const { Option } = Select;

const schema = Yup.object().shape({
  overtime_config_id: Yup.string().required("Overtime type is required"),
  overtime_date: Yup.string().required("Overtime date is required"),
});
const EditOvertime = ({ setOpen, itemData, refetch }: any) => {
  const [overtimeDecision, { data, isSuccess, isLoading, error }] =
    useOvertimeDecisionAdminMutation();

  const { data: overtimeList } = useOvertimeFullListQuery({});

  const formik = useFormik({
    initialValues: {
      overtime_config_id: (itemData?.overtime_config_id as string) || "",
      overtime_date:
        (itemData?.overtime_date?.substring(0, 10) as string) || "",
      status: (itemData?.status as string) || "",
      decision_note: (itemData?.decision_note as string) || "",
    },
    validationSchema: schema,
    onSubmit: async ({
      overtime_config_id,
      overtime_date,
      decision_note,
      status,
    }) => {
      await overtimeDecision({
        overtime_id: itemData?._id,
        decision_note: decision_note,
        overtime_config_id,
        overtime_date,
        status: status,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message =
        `${data?.message ? data?.message : "Completed"}` || "Completed";

      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch();
          setOpen(false);
        }
      });
    }
    if (error) {
      if ("data" in error) {
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
  }, [isSuccess, error]);

  const { errors, touched, values, setFieldValue, handleChange, handleSubmit } =
    formik;

  return (
    <div className="fade-in">
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}
      <h2 className="text-center text-[20px] my-3">Overtime Actions</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="end_date" className={`${styles.label} `}>
            Staff ID
          </label>
          <input
            type="text"
            name="staff_id"
            id="staff_id"
            value={itemData?.staff_id}
            readOnly
            disabled
            className={`${styles.input} bg-[#00000005] disabled:bg-gray-100`}
          />
        </div>

        <div>
          <label htmlFor="overtime_config_id" className={`${styles.label}`}>
            Overtime type
          </label>
          <Select
            id="overtime_config_id"
            style={{ width: "100%" }}
            value={values.overtime_config_id} // Assuming this is the selected value
            onChange={(value) => setFieldValue("overtime_config_id", value)} // Update formik's value
            placeholder="Select Overtime Type"
          >
            <Option value="">- - - - - -</Option>
            {overtimeList &&
              overtimeList?.data?.length > 0 &&
              overtimeList?.data?.map((overtime: any) => (
                <Option key={overtime._id} value={overtime._id}>
                  {overtime.name}
                </Option>
              ))}
          </Select>

          {errors.overtime_config_id && touched.overtime_config_id && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.overtime_config_id}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="overtime_date" className={`${styles.label}`}>
            Date
          </label>
          <input
            type="date"
            id="overtime_date"
            value={values.overtime_date}
            onChange={handleChange}
            className={`${styles.input}`}
          />
          {errors.overtime_date && touched.overtime_date && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.overtime_date}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="status" className={`${styles.label}`}>
            Take Action
          </label>
          <select
            name="status"
            id="status"
            value={values.status}
            onChange={handleChange}
            className={`${styles.input} !border-orange-700`}
          >
            <option value="">- - - - - - </option>
            <option value="pending">Pending</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
          {errors.status && touched.status && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.status}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="decision_note" className={`${styles.label}`}>
            Decision Note
          </label>
          <textarea
            id="decision_note"
            value={values.decision_note}
            onChange={handleChange}
            className={`w-full text-[14px]  border h-[100px] rounded text-[#6c757d] px-2 outline-none mt-[4px] !border-orange-700`}
            placeholder="Add extra note"
          />
          {errors.decision_note && touched.decision_note && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.decision_note}
            </span>
          )}
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

export default EditOvertime;
