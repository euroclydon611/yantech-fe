import { Select, Drawer } from "antd";
const { Option } = Select;
import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/helperFunction";
import Swal from "sweetalert2";
import {
  useAppointEntityHeadMutation,
  useEmployeeListByEntityQuery,
} from "../../../redux/features/sections/entityApi";

const schema = Yup.object().shape({
  name: Yup.string().required("Department name is required"),
});

interface AppointHeadProps {
  open: boolean;
  onClose: () => void;
  itemData: any;
  refetch: () => void;
}

const AppointEntityHead = ({ open, onClose, itemData, refetch }: AppointHeadProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [head, setHead] = useState(itemData?.current_head_id);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employeeListByEntity } = useEmployeeListByEntityQuery(
    {
      entityId: itemData?._id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const headHistory = itemData?.head_history;
  const head_start_date =
    (headHistory && headHistory[headHistory?.length - 1]?.start) || "";
  const head_end_date =
    (headHistory && headHistory[headHistory?.length - 1]?.end) || "";

  // const { data: employeeList } = useEmployeeFullListQuery({});

  const [appointDepartmentHead, { data, isSuccess, error, isLoading }] =
    useAppointEntityHeadMutation();

  const formik = useFormik({
    initialValues: {
      name: (itemData?.name as string) || "",
      head_start_date: head_start_date,
      head_end_date: head_end_date,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async ({ head_start_date, head_end_date }) => {
      await appointDepartmentHead({
        idToEdit: itemData._id,
        new_head_id: head,
        head_start_date,
        head_end_date,
      });
    },
  });

  useEffect(() => {
    if (open) {
      setHead(itemData?.current_head_id);
    } else {
      formik.resetForm();
      setShowHistory(false);
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
    <Drawer
      title="Appoint Entity Head"
      onClose={onClose}
      open={open}
      width={900}
      maskClosable={false}
    >
      <div className="fade-in">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/epa-logo.png" alt="EPA Logo" className="h-12" />
        </div>
        {!showHistory ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input} bg-[#00000010]`}
            readOnly
            placeholder="Enter Entity Name"
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
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Option value="">- - - - -</Option>
            {employeeListByEntity?.data &&
              employeeListByEntity?.data.length > 0 &&
              employeeListByEntity?.data.map((employee: any, i: number) => (
                <Option key={i} value={employee._id}>
                  {employee.staff_id} - {employee.firstname} {employee.lastname}{" "}
                  {employee.other_names}
                </Option>
              ))}
          </Select>
        </div>

        <div className="flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="fromDate" className={`${styles.label}`}>
              Head Start Date
            </label>
            <input
              type="date"
              name="head_start_date"
              id="head_start_date"
              value={values.head_start_date?.slice(0, 10)}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="toDate" className={`${styles.label} `}>
              Head End Date
            </label>
            <input
              type="date"
              name="head_end_date"
              id="head_end_date"
              value={values.head_end_date?.slice(0, 10)}
              onChange={handleChange}
              className={`${styles.input}`}
            />
          </div>
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center ">
          <button type="submit" className={`${styles.small_btn}`}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
        <div
          className="text-[13px] text-center text-blue-500 hover:text-blue-600 cursor-pointer transition duration-200 "
          onClick={() => setShowHistory(true)}
        >
          View Head History
        </div>
          </form>
        ) : (
          <div>
            <History data={itemData} />
            <div className="mt-4">
              <button
                onClick={() => setShowHistory(false)}
                className={`${styles.small_btn}`}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
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

export default AppointEntityHead;
