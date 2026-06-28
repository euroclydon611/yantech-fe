import { useEffect, useState } from "react";
import CustomModal from "../../utils/CustomModal";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { FaCheckCircle, FaFile, FaTrash } from "react-icons/fa";
import { Modal, Pagination } from "antd";
import { styles } from "../../styles";
import UploadAttendants from "./UploadAttendants";
import {
  useEmployeesWorkedHoursListQuery,
  useDeleteAttendanceEntryMutation,
  useAwardHoursMutation,
} from "../../redux/features/reports/payrollRun";
// import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BsFillCalendar3WeekFill } from "react-icons/bs";

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const Attendants = () => {
  PageTitle("Attendance | Payroll");
  const [add, setAdd] = useState(false);
  const [remove, setRemove] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [exportAtt, setExportAtt] = useState(false);
  const startDate = "2025-04-16";
  const endDate = "2025-05-15";

  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasTimesheetViewAccess = privileges?.includes("PAYROLL_TIMESHEET_VIEW");
  const hasTimesheetCreateAccess = privileges?.includes("PAYROLL_TIMESHEET_CREATE");
  const hasTimesheetDeleteAccess = privileges?.includes("PAYROLL_TIMESHEET_DELETE");

  if (!hasTimesheetViewAccess) {
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

  const { data: employeeWorkedHoursListData, refetch } =
    useEmployeesWorkedHoursListQuery({
      month,
      year,
      page,
      limit,
      searchTerm,
    });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [awardHoursPopup, setAwardHoursPopup] = useState(false);
  const [calendarData, setCalendarData] = useState<any>([]);

  //view attendance days
  const handlePreviewDays = (data: any) => {
    setCalendarData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCalendarData([]);
  };

  //view attendance days
  const handleAwardHours = (data: any) => {
    setCalendarData(data);
    setAwardHoursPopup(true);
  };

  const handleClosAwardHours = () => {
    setAwardHoursPopup(false);
    setCalendarData([]);
  };

  // Map hours to days
  const daysWithHours = calendarData?.days
    ?.map((hour: any, index: any) =>
      hour > 0 ? { day: index + 1, hours: hour } : null
    )
    ?.filter((entry: any) => entry !== null);

  const countDays = (days: any) => {
    const daysWithHours = days
      ?.map((hour: any, index: any) =>
        hour > 0 ? { day: index + 1, hours: hour } : null
      )
      ?.filter((entry) => entry !== null);

    return daysWithHours?.length || 0;
  };

  const calculateTotalHours = (days: any) => {
    const totalHours = days
      ?.map((hour: any) => (hour > 0 ? hour : 0))
      ?.reduce((total: number, currentHour: number) => total + currentHour, 0);

    return totalHours || 0;
  };

  const countAwardableHours = (clock_in, days_present) => {
    const awardableDays = clock_in.reduce((count, time, index) => {
      if (time !== "" && days_present[index] === 0) {
        return count + 1;
      }
      return count;
    }, 0);

    return awardableDays;
  };

  return (
    <>
      {add && hasTimesheetCreateAccess && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          Component={UploadAttendants}
          refetch={refetch}
        />
      )}

      {remove && hasTimesheetDeleteAccess && (
        <CustomModal
          open={remove}
          setOpen={setRemove}
          Component={DeleteAttendanceEntry}
          refetch={refetch}
        />
      )}

      {exportAtt && (
        <CustomModal
          open={remove}
          setOpen={setExportAtt}
          Component={ExportAttendance}
          refetch={refetch}
        />
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => handleCloseModal()}
        footer={null}
      >
        <div className="mt-6">
          <HighlightedCalendar
            daysWithHours={daysWithHours as any}
            month={monthNo}
            year={parseInt(year)}
          />
        </div>
      </Modal>

      {hasTimesheetCreateAccess && (
        <AwardHours
          isOpen={awardHoursPopup}
          calendarData={calendarData}
          onClose={handleClosAwardHours}
          refetch={refetch}
        />
      )}

      <PageLayout
        title="Attendance"
        subtitle="Manage employee working hours and timesheets"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Attendance" }]}
      />
      <div className="p-4">

        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-2 max-sm:flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <span className="max-md:hidden block">Period: </span>
              <input
                type="month"
                id="month"
                className={`${styles.period_date_input}`}
                value={selectedMonth}
                onChange={handleDateChange}
              />
            </div>
            <div className="w-[25%] max-md:w-[55%] ">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                placeholder="Search..."
                className={`w-full text-[14px] px-[0.75rem] py-1.5 border border-gray-400 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.2px] focus:ring-gray-300 focus:border-gray-400`}
              />
            </div>

            <div className="flex items-center gap-2">
              {hasTimesheetCreateAccess && (
                <button
                  className={styles.primary_button}
                  onClick={() => setAdd(true)}
                  disabled={!hasTimesheetCreateAccess}
                >
                  <FaFile size={15} />
                  <span className="max-md:hidden">Load</span>
                </button>
              )}
              <button
                className={styles.primary_button}
                onClick={() => setExportAtt(true)}
              >
                <MdDownload size={18} />
                <span className="max-md:hidden flex">Export</span>
              </button>

              {hasTimesheetDeleteAccess && (
                <button
                  className={`${styles.primary_button} gap-1 bg-red-500 focus:ring-red-800 hover:bg-red-800`}
                  onClick={() => setRemove(true)}
                  title="Delete Attendance Entry"
                  disabled={!hasTimesheetDeleteAccess}
                >
                  <FaTrash size={14} />
                  <span className="max-md:hidden">Delete Attendance Entry</span>
                </button>
              )}
            </div>
          </div>
          <div className="table-wrapper max-h-[65vh] overflow-auto bg-white shadow-sm">
            <div className="overflow-auto">
              <table className={`${styles.table}`}>
                <thead className={`${styles.thead}`}>
                  <tr className="">
                    <th className={`${styles.th}`}>No</th>
                    <th className={`${styles.th}`}>
                      <span
                        className={`${styles.sort_span}`}
                        // onClick={() => handleSort("staff_id")}
                      >
                        Staff ID
                        {/* <BiSortAlt2 className="text-[18px]" /> */}
                      </span>
                    </th>

                    <th className={`${styles.th}`}>
                      <span
                        className={`${styles.sort_span}`}
                        // onClick={() => handleSort("staff_name")}
                      >
                        Staff Name
                        {/* <BiSortAlt2 className="text-[18px]" /> */}
                      </span>
                    </th>

                    <th className={`${styles.th}`}>
                      <span>Days Count</span>
                    </th>
                    <th className={`${styles.th}`}>
                      <span>Awardable Hours (Clocked In Only)</span>
                    </th>
                    <th className={`${styles.th}`}>
                      <span>Total Net Hours</span>
                    </th>
                    <th className={`${styles.th}`}>
                      <span>Days Preview</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {employeeWorkedHoursListData?.data &&
                  employeeWorkedHoursListData?.data?.hours?.length > 0 ? (
                    employeeWorkedHoursListData?.data?.hours?.map(
                      (employee: any, index: any) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }
                        >
                          <td className={`${styles.td}`}>
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className={`${styles.td}`}>
                            {employee.staff_id}
                          </td>
                          <td className={`${styles.td}`}>
                            {employee?.staff_name}
                          </td>
                          <td className={`${styles.td}`}>
                            {employee?.days && countDays(employee?.days)}
                          </td>
                          <td className={`${styles.td}`}>
                            <button
                              className="flex items-center cursor-pointer"
                              onClick={() => handleAwardHours(employee)}
                              title="Click to Award Hours"
                              disabled={!hasTimesheetCreateAccess}
                            >
                              <FaCheckCircle
                                size={22}
                                className="text-green-600 mr-2"
                                title="Award Hours"
                              />
                              <span className="text-gray-700 font-semibold">
                                {employee?.days
                                  ? countAwardableHours(
                                      employee?.clock_in,
                                      employee.days
                                    )
                                  : 0}
                              </span>
                              <span className="text-gray-500 ml-2">
                                {countAwardableHours(
                                  employee?.clock_in,
                                  employee.days
                                ) === 1
                                  ? "day without clock-out"
                                  : "days without clock-out"}
                              </span>
                            </button>
                          </td>

                          <td className={`${styles.td}`}>
                            {employee?.days &&
                              calculateTotalHours(employee?.days)}
                          </td>

                          <td className={`${styles.td}`}>
                            <span
                              className="flex items-center text-gray-700 gap-4 cursor-pointer"
                              onClick={() => handlePreviewDays(employee)}
                            >
                              <BsFillCalendar3WeekFill
                                size={22}
                                title="Days Preview"
                              />
                            </span>
                          </td>
                        </tr>
                      )
                    )
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
          </div>

          <div className="flex  mt-4 justify-between">
            <div className="flex gap-1 items-center">
              <span className="max-md:hidden">Show</span>
              <select
                name="limit"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={`text-[14px] px-[1rem] py-[0.2rem] border border-gray-400 rounded-[0.25rem] shadow-md placeholder-[#8391a2] focus:ring-[0.3px] focus:ring-gray-300 focus:border-gray-500`}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="max-md:hidden">entries</span>
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={
                employeeWorkedHoursListData?.data &&
                employeeWorkedHoursListData?.data?.totalCount
              }
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

import { Dialog } from "@headlessui/react";

const AwardHours = ({ isOpen, refetch, onClose, calendarData }) => {
  const [awardHours, { data, isLoading, isSuccess, error }] =
    useAwardHoursMutation();

  const [hoursData, setHoursData] = useState([]);

  // Map days without clockout to their corresponding dates and clock-in times
  const daysWithClockInDetails =
    calendarData?.clock_in
      ?.map((time, index) => {
        if (time !== "" && calendarData.days[index] === 0) {
          const monthNumber = monthMap[calendarData.month.toLowerCase()];
          const date = `${calendarData.year}-${monthNumber
            .toString()
            .padStart(2, "0")}-${(index + 1).toString().padStart(2, "0")}`;
          return { date, clockInTime: time };
        }
        return null;
      })
      ?.filter((entry) => entry !== null) || [];

  // Initialize hoursData when the modal opens and calendarData is provided
  useEffect(() => {
    if (daysWithClockInDetails.length > 0) {
      const initialHoursData = daysWithClockInDetails.map(() => ({
        hours: "",
      }));
      setHoursData(initialHoursData);
    }
  }, [calendarData]);

  // Handle changes to input values
  // const handleHoursChange = (index, value) => {
  //   const parsedValue = value.replace(/\D/g, "");
  //   setHoursData((prevHours) =>
  //     prevHours.map((entry, i) =>
  //       i === index ? { ...entry, hours: parsedValue } : entry
  //     )
  //   );
  // };
  const handleHoursChange = (index, value) => {
    const parsedValue = value.replace(/\D/g, "");
    const numericValue = Number(parsedValue);
    const finalValue = numericValue > 10 ? 10 : numericValue;
    setHoursData((prevHours) =>
      prevHours.map((entry, i) =>
        i === index ? { ...entry, hours: finalValue } : entry
      )
    );
  };

  // Handle form submission
  const onSubmit = () => {
    // Check if any hours exceed the maximum limit of 10
    const exceedsLimit = hoursData.some((data) => data.hours > 10);

    if (exceedsLimit) {
      // Show an alert if any hours exceed 10
      Swal.fire({
        title: "Error!",
        text: "Hours cannot exceed 10. Please correct the input.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return; // Stop the submission
    }

    const submissionData = daysWithClockInDetails.map((entry, index) => ({
      date: entry.date,
      staff_id: calendarData.staff_id,
      hours: hoursData[index]?.hours || 0,
    }));

    // SweetAlert confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you want to proceed with awarding these hours?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, award hours!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Submit the data if confirmed
        awardHours(submissionData);
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Hours awarded successfully.";

      const failedEntries = data?.data?.failed || [];
      const failedHTML = failedEntries.length
        ? `<ul style="text-align: left;">
             ${failedEntries
               .map(
                 (fail) =>
                   `<li><strong>Staff ID:</strong> ${fail.staff_id} - <strong>Date:</strong> ${fail.date} - <strong>Reason:</strong> ${fail.reason}</li>`
               )
               .join("")}
           </ul>`
        : "";

      Swal.fire({
        title: message,
        icon: "success",
        html: failedHTML || null,
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

    // Handle error case
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, data, refetch]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 max-h-[80vh] flex flex-col">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Award Hours
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Please enter the hours to award for the following days without
            clock-out.
          </Dialog.Description>

          {/* Scrollable Content */}
          <div className="mt-4 flex-grow overflow-y-auto px-5">
            <p className="text-black font-bold">
              Staff ID : {calendarData?.staff_id}
            </p>
            <br />
            <br />
            {daysWithClockInDetails.length > 0 &&
              daysWithClockInDetails.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-700">{entry.date}</span>
                    <span className="text-gray-500">{entry.clockInTime}</span>
                  </div>
                  <input
                    type="text" // Make sure this is text for flexibility in numeric parsing
                    placeholder="Hours to Award"
                    className="border border-gray-300 rounded px-2 py-1"
                    style={{ width: "150px" }}
                    value={hoursData[index]?.hours || ""} // Bind to the hours state
                    onChange={(e) => handleHoursChange(index, e.target.value)} // Handle input change
                  />
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end">
            <button
              className="mr-2 rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>

    // <Dialog open={isOpen} onClose={onClose}>
    //   <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    //   <div className="fixed inset-0 flex items-center justify-center">
    //     <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
    //       <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
    //         Award Hours
    //       </Dialog.Title>
    //       <Dialog.Description className="mt-2 text-sm text-gray-500">
    //         Please enter the hours to award for the following days without
    //         clock-out.
    //       </Dialog.Description>
    //       <div className="mt-4">
    //         <p className="text-black font-bold">
    //           Staff ID : {calendarData?.staff_id}
    //         </p>
    //         <br />
    //         <br />
    //         {daysWithClockInDetails.length > 0 &&
    //           daysWithClockInDetails.map((entry, index) => (
    //             <div
    //               key={index}
    //               className="flex items-center justify-between mb-4"
    //             >
    //               <div className="flex flex-col">
    //                 <span className="text-gray-700">{entry.date}</span>
    //                 <span className="text-gray-500">{entry.clockInTime}</span>
    //               </div>
    //               <input
    //                 type="text" // Make sure this is text for flexibility in numeric parsing
    //                 placeholder="Hours to Award"
    //                 className="border border-gray-300 rounded px-2 py-1"
    //                 style={{ width: "150px" }}
    //                 value={hoursData[index]?.hours || ""} // Bind to the hours state
    //                 onChange={(e) => handleHoursChange(index, e.target.value)} // Handle input change
    //               />
    //             </div>
    //           ))}
    //       </div>
    //       <div className="mt-4 flex justify-end">
    //         <button
    //           className="mr-2 rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-700"
    //           onClick={onClose}
    //         >
    //           Cancel
    //         </button>
    //         <button
    //           className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
    //           onClick={onSubmit}
    //         >
    //           Submit
    //         </button>
    //       </div>
    //     </Dialog.Panel>
    //   </div>
    // </Dialog>
  );
};

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { exportData, formatDate2, monthMap } from "../../utils/helperFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdDownload } from "react-icons/md";

interface HighlightedCalendarProps {
  daysWithHours: { day: number; hours: number }[];
  month: string;
  year: number;
}

const HighlightedCalendar: React.FC<HighlightedCalendarProps> = ({
  daysWithHours,
  month,
  year,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | any>(null);

  const numericMonth = parseInt(month, 10);

  const tileClassName = ({ date, view }: any) => {
    if (view === "month" && date.getMonth() === numericMonth - 1) {
      const day = date.getDate();
      const dayEntry = daysWithHours?.find((entry) => entry.day === day);
      if (dayEntry) {
        return "highlight"; // Apply the highlight class
      }
    }
    return null;
  };

  const getTileContent = ({ date }: { date: Date }) => {
    const day = date.getDate();
    const monthValue = date.getMonth() + 1;
    const yearValue = date.getFullYear();

    if (monthValue === numericMonth && yearValue === year) {
      const dayEntry = daysWithHours?.find((entry) => entry.day === day);
      if (dayEntry) {
        return <div className="tile-content">{dayEntry.hours} hrs</div>;
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        tileClassName={tileClassName}
        tileContent={getTileContent}
        activeStartDate={new Date(year, numericMonth - 1)}
      />
      <style>
        {`
          .highlight {
            background-color: #28a745 !important;
            color: white !important;
          }
          .tile-content {
            font-size: 12px;
            padding-top: 5px;
          }
        `}
      </style>
    </div>
  );
};

const schema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
});

const DeleteAttendanceEntry = ({ setOpen, refetch }) => {
  const [removeAttendance, { data, isSuccess, isLoading, error }] =
    useDeleteAttendanceEntryMutation();

  const formik = useFormik({
    initialValues: {
      date: "",
    },
    validationSchema: schema,
    onSubmit: async ({ date }) => {
      await removeAttendance({
        date,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${
        data?.message
          ? data?.message
          : `${formatDate2(values.date)} Attendance Removed Successfully`
      }`;

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

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div>
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}
      <br />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="date"
            className={`${styles.label} text-red-500 font-bold`}
          >
            Select Attendance Date to Delete
          </label>
          <input
            type="date"
            id="date"
            value={values.date}
            onChange={handleChange}
            className={`${styles.input}`}
          />
          {errors.date && touched.date && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.date}
            </span>
          )}
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `}>
            {isLoading ? "Please wait" : "Remove"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ExportAttendance = ({ setOpen, refetch }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle date changes
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);

    // Ensure end date is not before start date
    if (endDate && selectedDate > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setEndDate(selectedDate);
  };

  const handleExport = async (e) => {
    e.preventDefault();

    try {
      await exportData(
        `hours/export-attendance?startDate=${startDate}&endDate=${endDate}`,
        `Attendance_Report_${formatDate2(startDate)}-${formatDate2(endDate)}`
      );

      Swal.fire({
        title: "Success!",
        text: "Attendance report exported successfully.",
        icon: "success",
        confirmButtonColor: "#727cf5",
        timer: 3000,
      }).then(() => {
        setOpen(false);
        refetch();
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to export attendance report.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  return (
    <div>
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}

      <br />

      <form className="space-y-4">
        <div className="flex flex-col justify-center sm:flex-row gap-4">
          <div className="flex flex-col gap-1  w-1/2">
            <label
              htmlFor="start-date"
              className="text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out`}
              aria-label="Filter start date"
            />
          </div>

          <div className="flex flex-col gap-1 w-1/2">
            <label
              htmlFor="end-date"
              className="text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out`}
              aria-label="Filter end date"
            />
          </div>
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button
            type="submit"
            className={`${styles.small_btn} flex items-center gap-2`}
            onClick={handleExport}
          >
            <MdDownload size={18} />
            {"Export"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Attendants;
