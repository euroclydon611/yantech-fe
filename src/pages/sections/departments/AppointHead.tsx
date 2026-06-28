import { Select } from "antd";
const { Option } = Select;
import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAppointHeadMutation,
  useEmployeeListByDepartmentQuery,
} from "../../../redux/features/sections/departmentApi";
import { useEffect, useState } from "react";
import CustomModal from "../../../utils/CustomModal";
import { formatDate } from "../../../utils/helperFunction";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Department name is required"),
});

const AppointDepartmentHead = ({ setOpen, itemData, refetch }: any) => {
  const [view, setView] = useState(false);
  const [head, setHead] = useState(itemData?.current_head_id);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employeeList } = useEmployeeListByDepartmentQuery({
    searchTerm,
    departmentId: itemData?._id,
  });

  const [appointDepartmentHead, { data, isSuccess, error, isLoading }] =
    useAppointHeadMutation();

  const formik = useFormik({
    initialValues: { name: itemData?.name as string },
    validationSchema: schema,
    onSubmit: async ({}) => {
      await appointDepartmentHead({
        idToEdit: itemData._id,
        new_head_id: head,
      });
    },
  });

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
          setOpen(false);
        }
      });
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData.data.error || "Something went wrong!",
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
    <div className="fade-in">
      {view && (
        <CustomModal
          open={view}
          setOpen={setView}
          Component={History}
          refetch={refetch}
          data={itemData}
        />
      )}
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Department Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input} bg-[#00000010]`}
            readOnly
            placeholder="Enter Department Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="level" className={`${styles.label}`}>
            Select Head
          </label>
          <Select
            id="employees"
            style={{ width: "100%" }}
            placeholder="Choose..."
            value={head}
            onChange={(selectedValue) => setHead(selectedValue)}
            onSearch={(searchValue) => setSearchTerm(searchValue)}
          >
            <Option value="">- - - - -</Option>
            {employeeList &&
              employeeList?.data !== null &&
              employeeList?.data?.map((employee: any, i: number) => (
                <Option key={i} value={employee._id}>
                  {employee.staff_id} - {employee.firstname} {employee.lastname}
                </Option>
              ))}
          </Select>
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center ">
          <button type="submit" className={`${styles.small_btn}`}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
        <div
          className="text-[13px] text-center text-blue-500 hover:text-blue-600 cursor-pointer transition duration-200 "
          onClick={() => setView(true)}
        >
          View Head History
        </div>
      </form>
    </div>
  );
};

const History = ({ data }: any) => {
  return (
    <>
      <table className="table-auto w-full bg-white">
        <thead className="sticky -top-1 text-[14.4px] z-[9] bg-slate-100">
          <tr className="">
            <th className={`text-center p-[6px] border`}>No</th>
            <th className={`text-center p-[6px] border`}>Name</th>
            <th className={`text-center p-[6px] border`}>Start</th>
            <th className={`text-center p-[6px] border`}>End</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data && data.head_history !== null ? (
            data?.head_history.map((head: any, index: any) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="text-center p-[6px] border">{index + 1}</td>
                <td className="text-center p-[6px] border">{head.name}</td>
                <td className="text-center p-[8px] border">
                  {head?.start ? formatDate(head.start) : ""}
                </td>
                <td className="text-center p-[8px] border">
                  {head?.end ? formatDate(head.end) : ""}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border-y text-center py-2" colSpan={12}>
                <span className="text-red-500 font-extrabold">
                  No results found
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default AppointDepartmentHead;
