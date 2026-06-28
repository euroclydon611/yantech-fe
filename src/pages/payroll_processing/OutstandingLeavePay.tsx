import { useEffect, useState } from "react";
import { Select, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "antd/dist/reset.css";
import { useEmployeeFullListQuery } from "../../redux/features/employee/employeeApi";
import { useOutstandingLeavePayMutation } from "../../redux/features/reports/payrollRun";
import { styles } from "../../styles";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageLayout from "../../components/PageLayout";

const { Option } = Select;

const OutstandingLeavePay = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasLeaveEncashmentViewAccess = privileges?.includes(
    "PAYROLL_LEAVE_ENCASHMENT_VIEW"
  );
  const hasLeaveEncashmentCreateAccess = privileges?.includes(
    "PAYROLL_LEAVE_ENCASHMENT_CREATE"
  );

  if (!hasLeaveEncashmentViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ month: "", year: "" });
  const [numOfDays, setNumOfDays] = useState("");
  const [submit, { data, isSuccess, isLoading, error }] =
    useOutstandingLeavePayMutation();
  const { data: employeeList } = useEmployeeFullListQuery({});

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate({
        month: dayjs(date).format("MMMM"),
        year: dayjs(date).format("YYYY"),
      });
    } else {
      setSelectedDate({ month: "", year: "" });
    }
  };

  const handleSubmit = async () => {
    if (!hasLeaveEncashmentCreateAccess) return;

    if (
      !selectedDate.month ||
      !selectedDate.year ||
      employees.length === 0 ||
      !numOfDays
    ) {
      Swal.fire(
        "Error",
        "Please select a month, year, employees, and enter the number of days.",
        "error"
      );
      return;
    }
    const result = await Swal.fire({
      title: "Confirm Submission",
      text: `You are about to submit the leave encashment for ${employees.length} employee(s) for ${selectedDate.month} ${selectedDate.year}. This submission will impact the payroll calculations for the selected period. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel",
      confirmButtonText: "Yes, proceed with submission",
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
    });

    if (result.isConfirmed) {
      try {
        await submit({
          year: selectedDate.year,
          month: selectedDate.month,
          staff_ids: employees,
          num_of_day: numOfDays,
        }).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message =
        data?.message || "Leave encashment processed successfully.";

      // Extract counts for completed and failed
      const completedCount = data?.data?.completed || 0;
      const failedCount = data?.data?.failed || 0;

      // Extract failed entries and format them
      const failedEntries = data?.data?.failed_data || [];
      const failedHTML = failedEntries.length
        ? `<ul style="text-align: left;">
             ${failedEntries
               .map(
                 (fail) =>
                   `<li><strong>Staff ID:</strong> ${fail.staff_id} - 
                    <strong>Name:</strong> ${fail.name} - 
                    <strong>Remaining Leave Days:</strong> ${fail.remaining_leave_days}</li>`
               )
               .join("")}
           </ul>`
        : "";

      Swal.fire({
        title: message,
        icon: "success",
        html: `
          <p><strong>Completed:</strong> ${completedCount}</p>
          <p><strong>Failed:</strong> ${failedCount}</p>
          ${failedHTML || ""}
        `,
        // timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          setEmployees([]);
          setNumOfDays("");
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
  }, [isSuccess, error, data]);

  return (
    <>
      <PageLayout
        title="Leave Encashment"
        subtitle="Submit leave encashment requests for payroll processing"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Leave Encashment" }]}
      />
      <div className="p-4">
      <p className="description-text text-xs text-gray-500 mb-4">
        This section allows you to submit leave encashment requests for
        employees. The submitted data will be used to calculate outstanding
        leave and will affect the payroll processing for the selected month.
      </p>

      <div className="form-section">
        <label htmlFor="employees" className={`${styles.label}`}>
          Select Employees
        </label>
        <Select
          mode="multiple"
          showSearch
          id="employees"
          style={{ width: "100%" }}
          placeholder="Select employees..."
          value={employees}
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onChange={(selectedOptions) => {
            if (selectedOptions.includes("")) {
              // Select All
              setEmployees(
                employeeList.map((employee) => employee.staff_id).concat("")
              );
            } else {
              setEmployees(selectedOptions);
            }
          }}
        >
          <Option value="" label="Select All">
            Select All
          </Option>
          {employeeList &&
            employeeList.map((employee, i) => (
              <Option
                key={i}
                value={employee.staff_id}
                label={`${employee.staff_id} - ${employee.firstname} ${employee.lastname}`}
              >
                {employee.staff_id} - {employee.firstname} {employee.lastname}
              </Option>
            ))}
        </Select>
      </div>

      <div className="form-section">
        <label htmlFor="monthYear" className={`${styles.label}`}>
          Select Month and Year
        </label>
        <DatePicker
          picker="month"
          onChange={handleDateChange}
          placeholder="Select Month and Year"
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-section">
        <label htmlFor="numOfDays" className={`${styles.label}`}>
          Enter Number of Days
        </label>
        <Input
          id="numOfDays"
          type="number"
          placeholder="Enter number of days"
          value={numOfDays}
          onChange={(e) => setNumOfDays(e.target.value)} // Update numOfDays state
          style={{ width: "100%" }}
        />
      </div>

      <div className="form-section">
        {hasLeaveEncashmentCreateAccess && (
          <button
            type="submit"
            onClick={handleSubmit}
            className={styles.primary_button}
            style={{ width: "100%", marginTop: "20px" }}
            disabled={isLoading || !hasLeaveEncashmentCreateAccess}
          >
            Submit Leave Encashment for Payroll
          </button>
        )}
      </div>

      <style>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .ant-select {
          width: 100%;
        }

        .ant-picker {
          width: 100%;
        }     
        .description-text {
          text-align: center;
          margin-bottom: 20px;
          font-size: 16px;
          color: #555; /* or any color that fits your theme}
      `}</style>
      </div>
    </>
  );
};

export default OutstandingLeavePay;
