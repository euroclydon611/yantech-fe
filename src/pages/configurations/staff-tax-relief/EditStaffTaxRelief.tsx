import { styles } from "../../../styles";
import { Drawer } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import {
  useUpdateStaffTaxReliefMutation,
} from "../../../redux/features/configurations/staffTaxReliefApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Relief name is required"),
  amount: Yup.number().required("Amount is required").min(0),
});

interface EditStaffTaxReliefProps {
  open: boolean;
  onClose: () => void;
  itemData: any;
  refetch: () => void;
}

const EditStaffTaxRelief = ({ open, onClose, itemData, refetch }: EditStaffTaxReliefProps) => {
  const [updateRelief, { isSuccess, isLoading, error, data }] = useUpdateStaffTaxReliefMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      status: "active",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (itemData?._id) {
        await updateRelief({ id: itemData._id, data: values });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (itemData) {
      formik.setValues({
        name: itemData.name || "",
        amount: itemData.amount || "",
        status: itemData.status || "active",
      });
    }
  }, [itemData]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: data?.message || "Staff tax relief updated successfully",
        icon: "success",
        confirmButtonColor: "#727cf5",
      }).then(() => {
        refetch();
        onClose();
      });
    }
    if (error) {
      const errorData = error as any;
      Swal.fire({
        title: "Error",
        text: errorData?.data?.message || "Failed to update staff tax relief",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [isSuccess, error]);

  return (
    <Drawer
      title="Edit Staff Tax Relief"
      onClose={onClose}
      open={open}
      width={500}
      maskClosable={false}
    >
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm font-medium">Employee: <span className="text-gray-600">{itemData?.employee_id?.firstname} {itemData?.employee_id?.lastname}</span></p>
        <p className="text-sm font-medium">Staff ID: <span className="text-gray-600">{itemData?.staff_id}</span></p>
      </div>

      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div>
          <label className={`${styles.label}`}>Relief Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          />
          {formik.errors.name && formik.touched.name && (
            <span className="text-red-500 text-xs">{formik.errors.name}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Amount</label>
          <input
            type="number"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          />
          {formik.errors.amount && formik.touched.amount && (
            <span className="text-red-500 text-xs">{formik.errors.amount}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.primary_button} w-full mt-4 !h-[42px]`}
        >
          {isLoading ? "Updating..." : "Update Relief"}
        </button>
      </form>
    </Drawer>
  );
};

export default EditStaffTaxRelief;
