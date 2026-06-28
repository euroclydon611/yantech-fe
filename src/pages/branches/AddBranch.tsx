import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useBranchStoreMutation } from "../../redux/features/bank/branchApi";
import { useBankFullListQuery } from "../../redux/features/bank/bankApi";
import Swal from "sweetalert2";
import { Drawer, Select } from "antd";
const { Option } = Select;

const schema = Yup.object().shape({
  branch: Yup.string().required("Please enter branch name"),
  bank: Yup.string().required("Please select bank"),
  code: Yup.string(),
});

interface AddBranchProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddBranch = ({ open, onClose, refetch }: AddBranchProps) => {
  const [branchStore, { data, isSuccess, isLoading, error }] =
    useBranchStoreMutation();

  const { data: bankList } = useBankFullListQuery({},  {
    refetchOnMountOrArgChange: true,
  });

  const formik = useFormik({
    initialValues: { branch: "", bank: "", code: "" },
    validationSchema: schema,
    onSubmit: async ({ branch, bank, code }) => {
      await branchStore({ name: branch, bank_id: bank, code });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

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

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Drawer
      title="Add Branch"
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
          <label htmlFor="bank" className={`${styles.label}`}>
            Bank
          </label>
          <Select
            showSearch
            placeholder="Select Bank"
            optionFilterProp="label"
            id="bank"
            style={{
              width: "100%",
              height: "38px",
            }}
            value={values.bank || undefined}
            onChange={(value) => {
              handleChange({
                target: { name: "bank", value },
              });
            }}
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                ?.includes(input.toLowerCase())
            }
          >
            <Option value="">------</Option>
            {bankList &&
              bankList.data !== null &&
              bankList.data.map((bank: any, i: number) => (
                <Option key={i} value={bank.id} label={bank.name}>
                  {bank.name}
                </Option>
              ))}
          </Select>
          {errors.bank && touched.bank && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.bank}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="branch" className={`${styles.label}`}>
            Branch Name
          </label>
          <input
            type="text"
            id="branch"
            value={values.branch}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Branch Name"
          />
          {errors.branch && touched.branch && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.branch}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="code" className={`${styles.label}`}>
            Branch Sort Code
          </label>
          <input
            type="text"
            id="code"
            value={values.code}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Branch Sort Code"
          />
          {errors.code && touched.code && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.code}
            </span>
          )}
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn}`} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
        </form>
      </div>
    </Drawer>
  );
};

export default AddBranch;
