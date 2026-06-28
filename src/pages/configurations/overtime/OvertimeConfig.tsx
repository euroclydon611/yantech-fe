import React, { useEffect, useState } from "react";
import {
  useOvertimeConfigListQuery,
  useOvertimeConfigUpdateMutation,
  useOvertimeEligibilityCriteriaListQuery,
  useOvertimeEligibilityCriteriaUpdateMutation,
} from "../../../redux/features/configurations/overtimeApi";

import { toast } from "react-hot-toast";
import { styles } from "../../../styles";
import Swal from "sweetalert2";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface OvertimeData {
  name: string;
  hourly_rate_multiplier: number;
  num_of_hours: number;
  needs_approval: boolean;
  _id?: string;
}

const OvertimeConfig: React.FC = () => {
  PageTitle("Overtime config | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_CREATE"
  );
  const hasEditAccess = privileges?.includes("PAYROLL_OVERTIME_CONFIG_EDIT");
  const hasUpdateAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_UPDATE"
  );
  const hasDeleteAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_DELETE"
  );

  const [tableDataOvertime, setTableDataOvertime] = useState<OvertimeData[]>([
    {
      name: "",
      hourly_rate_multiplier: 0,
      num_of_hours: 0,
      needs_approval: false,
    },
  ]);

  const { data: overtimeData, isLoading: isOvertimeDataLoading } =
    useOvertimeConfigListQuery({});
  const [updateOvertime, { isLoading: isSavingTypes }] =
    useOvertimeConfigUpdateMutation();

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (overtimeData?.data) {
      setTableDataOvertime([...overtimeData.data]);
    }
  }, [overtimeData]);

  const handleAddRowOvertime = () => {
    setTableDataOvertime((prevData) => [
      ...prevData,
      {
        name: "",
        hourly_rate_multiplier: 0,
        num_of_hours: 0,
        needs_approval: false,
      },
    ]);
  };

  const handleRemoveRowOvertime = (index: number) => {
    setTableDataOvertime((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleChangeOvertime = (
    index: number,
    key: keyof OvertimeData,
    value: string | number | boolean
  ) => {
    setTableDataOvertime((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleSubmitOvertime = async () => {
    // Confirm before submission
    const result = await Swal.fire({
      title: "Confirm Submission",
      text: `You are about to submit the overtime types. Would you like to proceed?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel",
      confirmButtonText: "Yes, proceed",
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
    });

    if (result.isConfirmed) {
      try {
        await updateOvertime({ data: tableDataOvertime })
          .unwrap()
          .then((res) => {
            toast.success(res?.message);
          });
      } catch (error) {
        toast.error("Make sure you fill all the available fields");
      }
    }
  };

  // if (isOvertimeDataLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <PageLayout
        title="Overtime Configuration"
        subtitle="Configure overtime types and eligibility criteria"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Overtime" }]}
      />
      <div className="p-4">
      <div className="bg-white pt-4 px-2">
        <div className="flex justify-between items-center mb-3 mx-8">
          <h1 className="text-xl font-bold">Overtime Types</h1>
        </div>

        <div className="max-h-[50vh] mx-8 overflow-y-auto bg-white rounded-sm shadow-sm">
          <table className={`${styles.table}`}>
            <thead className={`${styles.thead}`}>
              <tr>
                <th className={`${styles.th}`}>No</th>
                <th className={`${styles.th}`}>Name</th>
                <th className={`${styles.th}`}>Hourly Rate Multiplier</th>
                <th className={`${styles.th}`}>Number of Hours</th>
                <th className={`${styles.th}`}>Needs Approval</th>
                <th className={`${styles.th} text-center`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableDataOvertime.map((row: OvertimeData, index: number) => (
                <tr key={index}>
                  <td className={`${styles.td}`}>{index + 1}</td>
                  <td className={`${styles.td}`}>
                    <input
                      type="text"
                      value={row.name}
                      placeholder="Enter overtime name"
                      onChange={(e) =>
                        handleChangeOvertime(index, "name", e.target.value)
                      }
                      disabled={!hasEditAccess}
                      className="border w-[70%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500"
                    />
                  </td>
                  <td className={`${styles.td}`}>
                    <input
                      type="number"
                      value={row.hourly_rate_multiplier}
                      placeholder="Enter rate multiplier"
                      onChange={(e) =>
                        handleChangeOvertime(
                          index,
                          "hourly_rate_multiplier",
                          parseFloat(e.target.value)
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[70%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500"
                    />
                  </td>
                  <td className={`${styles.td}`}>
                    <input
                      type="number"
                      value={row.num_of_hours}
                      placeholder="Enter number of hours"
                      onChange={(e) =>
                        handleChangeOvertime(
                          index,
                          "num_of_hours",
                          parseInt(e.target.value, 10)
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[70%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500"
                    />
                  </td>
                  <td className={`${styles.td}`}>
                    <input
                      type="checkbox"
                      checked={row.needs_approval}
                      onChange={(e) =>
                        handleChangeOvertime(
                          index,
                          "needs_approval",
                          e.target.checked
                        )
                      }
                      disabled={!hasEditAccess}
                      className="focus:ring-[#39afd1] checked:ring-2 h-5 w-5"
                    />
                  </td>
                  <td
                    className={`${styles.td} flex gap-x-2 justify-center mt-1`}
                  >
                    {index === tableDataOvertime.length - 1 ? (
                      <>
                        {index !== 0 && hasDeleteAccess && (
                          <button
                            className="bg-red-500 text-white px-3 py-[4px]  rounded-sm"
                            onClick={() => handleRemoveRowOvertime(index)}
                          >
                            -
                          </button>
                        )}
                        {hasCreateAccess && (
                          <button
                            className="bg-green-700 text-white px-3 py-[4px] rounded-sm"
                            onClick={handleAddRowOvertime}
                          >
                            +
                          </button>
                        )}
                      </>
                    ) : (
                      hasDeleteAccess && (
                        <button
                          className="bg-red-500 text-white px-3 py-[4px] rounded-sm"
                          onClick={() => handleRemoveRowOvertime(index)}
                        >
                          -
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-center mt-4">
          {hasUpdateAccess && (
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
              onClick={handleSubmitOvertime}
            >
              {isSavingTypes ? "Saving..." : "Save Overtime Types"}
            </button>
          )}
        </div>
      </div>

      {/* OvertimeEligibilityCriteria */}
      <OvertimeEligibilityCriteria />
      </div>
    </>
  );
};

interface OvertimeCriteria {
  position: string;
  taxable_income: number;
  _id?: string;
}

const OvertimeEligibilityCriteria = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_CREATE"
  );
  const hasEditAccess = privileges?.includes("PAYROLL_OVERTIME_CONFIG_EDIT");
  const hasUpdateAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_UPDATE"
  );
  const hasDeleteAccess = privileges?.includes(
    "PAYROLL_OVERTIME_CONFIG_DELETE"
  );

  const [tableDataCriteria, setTableDataCriteria] = useState<
    OvertimeCriteria[]
  >([
    {
      position: "",
      taxable_income: 0,
    },
  ]);

  const { data: overtimeCriteriaData, isLoading } =
    useOvertimeEligibilityCriteriaListQuery({});
  const [updateOvertimeEligibilityCriteria, { isLoading: isSaving }] =
    useOvertimeEligibilityCriteriaUpdateMutation();

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (overtimeCriteriaData?.data) {
      setTableDataCriteria([...overtimeCriteriaData.data]);
    }
  }, [overtimeCriteriaData]);

  const handleAddRowCriteria = () => {
    setTableDataCriteria((prevData) => [
      ...prevData,
      {
        position: "",
        taxable_income: 0,
      },
    ]);
  };

  const handleRemoveRowCriteria = (index: number) => {
    setTableDataCriteria((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleChangeOvertimeCriteria = (
    index: number,
    key: keyof OvertimeCriteria,
    value: string | number
  ) => {
    setTableDataCriteria((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleSubmitOvertimeCriteria = async () => {
    // Check for duplicate positions
    const positions = tableDataCriteria.map((row) => row.position);
    const hasDuplicates = positions.some(
      (position, index) => positions.indexOf(position) !== index
    );

    if (hasDuplicates) {
      Swal.fire(
        "Error",
        "Positions should be unique. Please check for duplicates.",
        "error"
      );
      return;
    }

    // Confirm before submission
    const result = await Swal.fire({
      title: "Confirm Submission",
      text: `You are about to submit the overtime eligibility criteria. This will impact the payroll and related calculations. Would you like to proceed?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel",
      confirmButtonText: "Yes, proceed",
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
    });

    if (result.isConfirmed) {
      try {
        await updateOvertimeEligibilityCriteria({
          overtime_eligibility: tableDataCriteria,
        })
          .unwrap()
          .then((res) => {
            toast.success(res?.message, { duration: 5000 });
          });
      } catch (error) {
        toast.error("Make sure you fill all the available fields");
      }
    }
  };

  return (
    <>
      <div className="pt-4 px-2 bg-white mt-5">
        <div className="flex justify-between items-center mb-3 mx-8">
          <h1 className="text-xl font-bold">Overtime Eligibility Criteria</h1>
        </div>

        <p className="text-base text-[#555] mx-8">
          <strong>Note:</strong> The overtime eligibility is determined based on
          the employee's position and taxable income. For instance:
          <ul>
            <li>
              Junior employees with a taxable income of{" "}
              <span className="font-bold">1,500 or less</span> are eligible for
              overtime calculation.
            </li>
            <li>
              Other positions and income thresholds can be added or modified in
              the configuration as needed.
            </li>
          </ul>
          Please ensure that the correct configuration is set for accurate
          overtime computation.
        </p>

        <div className="max-h-[50vh] mx-8 overflow-y-auto bg-white rounded-sm shadow-sm mt-10">
          <table className={`${styles.table}`}>
            <thead className={`${styles.thead}`}>
              <tr>
                <th className={`${styles.th}`}>No</th>
                <th className={`${styles.th}`}>GRA Employment Position</th>
                <th className={`${styles.th}`}>Taxable Income</th>
                <th className={`${styles.th} text-center`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableDataCriteria.map((row: OvertimeCriteria, index: number) => (
                <tr key={index}>
                  <td className={`${styles.td}`}>{index + 1}</td>
                  <td className={`${styles.td}`}>
                    <select
                      name="gra_position"
                      id="gra_position"
                      value={row.position}
                      onChange={(e) =>
                        handleChangeOvertimeCriteria(
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[70%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500"
                    >
                      <option value="">------</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                      <option value="management">Management</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td className={`${styles.td}`}>
                    <input
                      type="number"
                      value={row.taxable_income}
                      placeholder="Enter rate multiplier"
                      onChange={(e) =>
                        handleChangeOvertimeCriteria(
                          index,
                          "taxable_income",
                          parseFloat(e.target.value)
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[70%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500"
                    />
                  </td>
                  <td
                    className={`${styles.td} flex gap-x-2 justify-center mt-1`}
                  >
                    {index === tableDataCriteria.length - 1 ? (
                      <>
                        {index !== 0 && hasDeleteAccess && (
                          <button
                            className="bg-red-500 text-white px-3 py-[4px] rounded-sm"
                            onClick={() => handleRemoveRowCriteria(index)}
                          >
                            -
                          </button>
                        )}
                        {hasCreateAccess && (
                          <button
                            className="bg-green-700 text-white px-3 py-[4px] rounded-sm"
                            onClick={handleAddRowCriteria}
                          >
                            +
                          </button>
                        )}
                      </>
                    ) : (
                      hasDeleteAccess && (
                        <button
                          className="bg-red-500 text-white px-3 py-[4px] rounded-sm"
                          onClick={() => handleRemoveRowCriteria(index)}
                        >
                          -
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-center mt-4">
          {hasUpdateAccess && (
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
              onClick={handleSubmitOvertimeCriteria}
            >
              {isSaving ? "Saving..." : "Save Overtime Criteria"}
            </button>
          )}
        </div>
        <br />
      </div>
    </>
  );
};

export default OvertimeConfig;
