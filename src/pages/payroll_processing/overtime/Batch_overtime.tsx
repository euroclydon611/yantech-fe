import { useState } from "react";
import { styles } from "../../../styles";
import { Modal, Pagination } from "antd";
import { FaEdit } from "react-icons/fa";
import EditModal from "../../../utils/EditModal";
import { formatDate } from "../../../utils/helperFunction";
import { Link } from "react-router-dom";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { useBatchOvertimeEmployeesQuery } from "../../../redux/features/employee-portal-api/overtime";
import {
  usePendingOvertimeQuery,
  useApprovedOvertimeQuery,
  useRejectedOvertimeQuery,
  useBatchOvertimesAdminQuery,
} from "../../../redux/features/reports/payrollRun";
import { AiOutlineTeam } from "react-icons/ai";
import EditBatchOvertime from "./EditBatchOvertime";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const Batch_overtime = () => {
  PageTitle("Pending Overtime");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [overtime, setOvertime] = useState("");
  const [overtimeId, setOvertimeId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasOvertimeViewAccess = privileges?.includes("PAYROLL_OVERTIME_VIEW");
  const hasOvertimeEditAccess = privileges?.includes("PAYROLL_OVERTIME_EDIT");

  if (!hasOvertimeViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const monthYear = selectedMonth.split("-");
  const year = monthYear[0];
  const monthNo = monthYear[1];
  let month = "March";

  if (monthNo == "01") {
    month = "January";
  }
  if (monthNo == "02") {
    month = "February";
  }
  if (monthNo == "03") {
    month = "March";
  }
  if (monthNo == "04") {
    month = "April";
  }
  if (monthNo == "05") {
    month = "May";
  }
  if (monthNo == "06") {
    month = "June";
  }
  if (monthNo == "07") {
    month = "July";
  }
  if (monthNo == "08") {
    month = "August";
  }
  if (monthNo == "09") {
    month = "September";
  }
  if (monthNo == "10") {
    month = "October";
  }
  if (monthNo == "11") {
    month = "November";
  }
  if (monthNo == "12") {
    month = "December";
  }

  const handleDateChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const {
    data: batchList,
    isLoading: batchLoading,
    refetch,
  } = useBatchOvertimesAdminQuery({ page, limit });

  const { data: pendingList } = usePendingOvertimeQuery({
    page,
    limit,
    month,
    year,
  });
  const { data: rejectedList } = useRejectedOvertimeQuery({
    limit,
    page,
    month,
    year,
  });

  const { data: approvedList, isLoading: approvedLoading } =
    useApprovedOvertimeQuery({ limit, page, month, year });
  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleEditPopUp = (overtime: any) => {
    setOvertime(overtime);
    setEdit(true);
  };

  //view qualifications
  const handleViewRelatedEmployees = (id: any) => {
    setOvertimeId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOvertimeId("");
  };

  // if (batchLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      {edit && hasOvertimeEditAccess && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditBatchOvertime}
          itemData={overtime}
          refetch={refetch}
        />
      )}

      <Modal open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <div className="mt-6">
          <ViewRelatedEmployees id={overtimeId} />
        </div>
      </Modal>

      <PageLayout
        title="Batch Overtime"
        subtitle="Manage batch overtime requests and assignments"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Overtime Mgt" }]}
      />
      <section className="flex gap-6 mt-6 px-4 overflow-x-auto text-black">
        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link to={"/batch-overtime"} className="flex flex-col items-center">
            <span className="text-lg font-bold text-blue-500">Batch</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {batchList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>
        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link to={"/pending-overtime"} className="flex flex-col items-center">
            <span className="text-lg font-bold text-yellow-500">Pending</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {pendingList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>

        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link
            to={"/approved-overtime"}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-bold text-green-600">Approved</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {approvedList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>

        <div className="w-[260px] min-h-[120px] p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link
            to={"/rejected-overtime"}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-bold text-red-600">Rejected</span>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-xl font-semibold">
              {rejectedList?.data?.totalCount || 0}
            </span>
          </Link>
        </div>
      </section>

      <section className="pt-6 px-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Batch Overtime Applications
        </h3>
      </section>

      <div className="bg-white mt-5 p-4">
        <div className="flex justify-between mb-2 max-sm:flex-wrap gap-2">
          <div className="flex gap-2 items-center">
            <span className="max-md:hidden text-gray-700 font-medium">
              Show
            </span>
            <select
              name="limit"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className={`${styles.limit_select}`}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="max-md:hidden text-gray-700 font-medium">
              entries
            </span>
          </div>
        </div>
        <div className="table-wrapper max-h-[40vh] overflow-y-auto bg-white shadow-sm">
          <table className={`${styles.table}`}>
            <thead className={`${styles.thead} text-xs`}>
              <tr>
                <th className={`${styles.th} border`}>No</th>
                <th className={`${styles.wide_tb_th2} border`}>Employees</th>
                <th className={`${styles.wide_tb_th2} border`}>
                  Overtime Type
                </th>
                <th className={`${styles.wide_tb_th2} border`}>
                  Overtime Date
                </th>
                <th className={`${styles.wide_tb_th2} border`}>
                  Requested Date
                </th>
                <th className="px-4 py-2">Status</th>
                <th className={`${styles.th} text-center`}>Action</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {batchList?.data?.overtime_data &&
              batchList?.data?.overtime_data.length > 0 ? (
                batchList?.data?.overtime_data?.map((overtime: any, i: any) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className={`${styles.td}`}>
                      {(page - 1) * limit + i + 1}
                    </td>
                    <td className={`${styles.td}`}>
                      <span
                        className="cursor-pointer flex"
                        onClick={() =>
                          handleViewRelatedEmployees(overtime?._id)
                        }
                      >
                        <AiOutlineTeam size={24} color="#6f42c1" />
                        <span className="font-bold">
                          {overtime?.employee_ids?.length}
                        </span>
                      </span>
                    </td>

                    <td className={`${styles.td}`}>
                      {overtime?.overtime_name}
                    </td>
                    <td className={`${styles.td}`}>
                      {overtime?.overtime_date &&
                        formatDate(overtime?.overtime_date)}
                    </td>

                    <td className={`${styles.td}`}>
                      {overtime?.created_at && formatDate(overtime?.created_at)}
                    </td>
                    <td className={`${styles.td}`}>
                      {overtime?.status === "approved" ? (
                        <span className="text-green-700 font-bold">
                          Approved
                        </span>
                      ) : overtime?.status === "rejected" ? (
                        <span className="text-red-700 font-bold">Rejected</span>
                      ) : (
                        <span className="text-yellow-700 font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className={`${styles.td} !text-center`}>
                      <span className="flex items-center justify-center gap-4">
                        {hasOvertimeEditAccess && (
                          <button
                            className="border border-yellow-500 text-yellow-500 hover:text-white py-[5px] px-3 rounded-full hover:bg-yellow-500 transition-all duration-300"
                            title="Edit"
                            onClick={() => handleEditPopUp(overtime)}
                          >
                            <FaEdit size={14} />
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="text-center py-4 text-red-500 font-bold"
                    colSpan={9}
                  >
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex  mt-4 justify-end">
          <Pagination
            current={page}
            pageSize={limit}
            total={(batchList?.data && batchList?.data.totalCount) || 1}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

const ViewRelatedEmployees = ({ id }: any) => {
  const { data } = useBatchOvertimeEmployeesQuery({ id });

  return (
    <div>
      <div className="table-wrapper max-h-[35vh] overflow-y-auto bg-white rounded-sm shadow-sm">
        <table className={`${styles.table}`}>
          <thead className={`${styles.thead} max-sm:text-[13px]`}>
            <tr>
              <th className={`${styles.th}`}>No</th>
              <th className={`${styles.th} p-2`}>Staff ID</th>
              <th className={`${styles.th}`}>Name </th>
              <th className={`${styles.th}`}>Gender </th>
            </tr>
          </thead>
          <tbody className="text-sm max-sm:text-xs">
            {data && data.data.length > 0 ? (
              data.data.map((staff: any, index: any) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className={`${styles.td}`}>{index + 1}</td>
                  <td className={`${styles.td}`}>{staff.staff_id}</td>
                  <td className={`${styles.td}`}>
                    {staff?.firstname} {staff?.lastname} {staff?.other_names}
                  </td>
                  <td className={`${styles.td}`}>{staff.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border-y text-center py-2" colSpan={3}>
                  <span className="text-red-500">No data</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Batch_overtime;
