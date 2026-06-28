import { useFormik } from "formik";
import Swal from "sweetalert2";
import {
  useContributionCeilingQuery,
  useContributionCeilingUpdateMutation,
} from "../../../redux/features/configurations/ssnitApi";
import * as Yup from "yup";
import { styles } from "../../../styles";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const hoursPerDaySchema = Yup.object({
  contribution_ceiling: Yup.number()
    .required("SSNIT contribution ceiling required")
    .min(0, "Hours per day cannot be less than 0"),
});

const ContributionCeiling = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasUpdateAccess = privileges?.includes("PAYROLL_SSNIT_EDIT");

  // Fetch the configuration data
  const { data: contribution_ceilingResponse } = useContributionCeilingQuery(
    {}
  );

  const [updateCeiling] = useContributionCeilingUpdateMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      contribution_ceiling: (contribution_ceilingResponse?.data as string) || 8,
    },
    validationSchema: hoursPerDaySchema,
    onSubmit: async ({ contribution_ceiling }) => {
      try {
        await updateCeiling({ contribution_ceiling })
          .unwrap()
          .then((res) => {
            toast.success(res?.message);
          });
      } catch (error) {
        toast.error("Error occurred");
      }
    },
  });

  return (
    <div className=" flex pt-4 px-2">
      <form onSubmit={formik.handleSubmit} className="bg-white p-3 w-full lg:w-1/2">
        <h1 className="text-[18px] font-bold">SSNIT Contribution Ceiling</h1>
        <div className="mb-4">
          <input
            type="number"
            id="contribution_ceiling"
            name="contribution_ceiling"
            className="border p-2 w-full border-blue-500 ring-2"
            value={formik.values.contribution_ceiling}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!hasUpdateAccess}
          />
          {formik.touched.contribution_ceiling &&
          formik.errors.contribution_ceiling ? (
            <div className="text-red-500">
              {formik.errors.contribution_ceiling}
            </div>
          ) : null}
        </div>
        {hasUpdateAccess && (
          <button type="submit" className={`${styles.primary_button}`}>
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default ContributionCeiling;
