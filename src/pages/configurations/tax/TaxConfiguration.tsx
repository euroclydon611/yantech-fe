import React, { useEffect, useState } from "react";
import {
  useTaxListQuery,
  useTaxUpdateMutation,
  useCasualWorkerTaxListQuery,
  useCasualWorkerUpdateMutation,
  useOvertimeTaxRateListQuery,
  useOvertimeTaxRateUpdateMutation,
  useBonusTaxRateListQuery,
  useBonusTaxRateUpdateMutation,
} from "../../../redux/features/configurations/taxApi";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { Table, Button, Tooltip } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

interface TableData {
  name: string;
  amount: number;
  rate: number;
  start_date: string;
  end_date: string;
}

const TaxConfiguration: React.FC = () => {
  PageTitle("Tax config | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_TAX_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_TAX_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_TAX_DELETE");

  const [tableData, setTableData] = useState<TableData[]>([
    { name: "Next", amount: 0, rate: 0, start_date: "", end_date: "" },
  ]);
  const { data: taxData, isLoading: isTaxDataLoading } = useTaxListQuery({});
  const [updateTax] = useTaxUpdateMutation();

  useEffect(() => {
    if (taxData?.data) {
      setTableData([...taxData.data]);
    }
  }, [taxData]);

  const handleAddRow = () => {
    setTableData((prevData) => [
      ...prevData,
      { name: "Next", amount: 0, rate: 0, start_date: "", end_date: "" },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleChange = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    try {
      await updateTax({ tax: tableData })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // if (isTaxDataLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <PageLayout
        title="Tax Configuration"
        subtitle="PAYE tax rates and related configurations"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Tax Configuration" }]}
      />
      <div className="p-4">
        <div className="table-wrapper max-h-[50vh] overflow-y-auto bg-white rounded-sm shadow-sm mt-6">
          <h2 className="text-[18px] font-semibold p-2">PAYE Tax Rates </h2>
          <Table
            columns={[
              {
                title: "No",
                key: "no",
                width: 60,
                render: (_text, _record, index) => index + 1,
              },
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
                width: 120,
              },
              {
                title: "Amount",
                key: "amount",
                width: 140,
                render: (_text, _record, index) => (
                  <input
                    type="number"
                    value={tableData[index]?.amount || 0}
                    placeholder="Enter the amount"
                    disabled={!hasEditAccess}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.valueAsNumber)
                    }
                    className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                  />
                ),
              },
              {
                title: "Rate",
                key: "rate",
                width: 140,
                render: (_text, _record, index) => (
                  <input
                    type="number"
                    value={tableData[index]?.rate || 0}
                    placeholder="Enter the rate"
                    disabled={!hasEditAccess}
                    onChange={(e) =>
                      handleChange(index, "rate", e.target.valueAsNumber)
                    }
                    className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                  />
                ),
              },
              // {
              //   title: "Start Date",
              //   key: "start_date",
              //   width: 140,
              //   render: (_text, _record, index) => (
              //     <input
              //       type="date"
              //       value={tableData[index]?.start_date || ""}
              //       onChange={(e) =>
              //         handleChange(index, "start_date", e.target.value)
              //       }
              //       className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
              //     />
              //   ),
              // },
              // {
              //   title: "End Date",
              //   key: "end_date",
              //   width: 140,
              //   render: (_text, _record, index) => (
              //     <input
              //       type="date"
              //       value={tableData[index]?.end_date || ""}
              //       onChange={(e) =>
              //         handleChange(index, "end_date", e.target.value)
              //       }
              //       className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
              //     />
              //   ),
              // },
              {
                title: "Action",
                key: "action",
                width: 120,
                align: "center" as const,
                hidden: !hasEditAccess,
                render: (_text, _record, index) => (
                  <div className="flex gap-x-2 justify-center">
                    {index === tableData.length - 1 ? (
                      <>
                        {index !== 0 && hasDeleteAccess && (
                          <button
                            className="bg-red-500 text-white px-3 py-[4px] rounded-sm text-[11px]"
                            onClick={() => handleRemoveRow(index)}
                          >
                            -
                          </button>
                        )}
                        {hasCreateAccess && (
                          <button
                            className="bg-green-700 text-white px-3 py-[4px] rounded-sm text-[11px]"
                            onClick={handleAddRow}
                          >
                            +
                          </button>
                        )}
                      </>
                    ) : (
                      hasDeleteAccess && (
                        <button
                          className="bg-red-500 text-white px-3 py-[4px] rounded-sm text-[11px]"
                          onClick={() => handleRemoveRow(index)}
                        >
                          -
                        </button>
                      )
                    )}
                  </div>
                ),
              },
            ]}
            dataSource={tableData}
            rowKey={(_, index) => index}
            pagination={false}
            size="small"
            locale={{ emptyText: "No data" }}
            scroll={{ x: 900 }}
          />
        </div>
        {hasEditAccess && (
          <div className="w-full flex justify-center mt-4">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
      <br />
      <div className="flex max-md:flex-col gap-2 max-md:gap-10">
        <div className="w-1/2 max-md:w-full">
          <OvertimeTaxRatesConfiguration />
        </div>
        <div className="w-1/2 max-md:w-full">
          <BonusTaxRatesConfiguration />
        </div>
      </div>
      <br />
      <CasualWorkerTaxConfiguration />
      <br />
    </>
  );
};

const OvertimeTaxRatesConfiguration = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEditAccess = privileges?.includes("PAYROLL_TAX_EDIT");
  const { data } = useOvertimeTaxRateListQuery({});
  const [updateOvertimeTaxRates] = useOvertimeTaxRateUpdateMutation();

  // State to toggle descriptions
  const [showDescriptions, setShowDescriptions] = useState({
    nonResident: false,
    residentLow: false,
    residentHigh: false,
    overtimeThreshold: false,
  });

  const toggleDescription = (key: string) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      non_resident_overtime_tax_rate:
        data?.data?.non_resident_overtime_tax_rate || 0.2,
      resident_overtime_tax_rate_low:
        data?.data?.resident_overtime_tax_rate_low || 0.05,
      resident_overtime_tax_rate_high:
        data?.data?.resident_overtime_tax_rate_high || 0.1,
      overtime_basic_threshold_percentage:
        data?.data?.overtime_basic_threshold_percentage || 0.5,
    },
    validationSchema: Yup.object({
      non_resident_overtime_tax_rate: Yup.number().required(
        "Non-resident overtime tax rate is required"
      ),
      resident_overtime_tax_rate_low: Yup.number().required(
        "Resident overtime tax rate (low) is required"
      ),
      resident_overtime_tax_rate_high: Yup.number().required(
        "Resident overtime tax rate (high) is required"
      ),
      overtime_basic_threshold_percentage: Yup.number().required(
        "Overtime basic threshold percentage is required"
      ),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: "Confirm Update",
        text: `Do you want to update the overtime tax rates? This change will directly affect tax calculations.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateOvertimeTaxRates({ overtime_tax_rates: values });
            Swal.fire(
              "Success!",
              "Overtime tax rates updated successfully.",
              "success"
            );
          } catch (error) {
            Swal.fire(
              "Error!",
              "Failed to update overtime tax rates.",
              "error"
            );
          }
        }
      });
    },
  });

  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    formik;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mx-2">
      <form onSubmit={handleSubmit}>
        <h2 className="text-[18px] mb-4 font-semibold">
          Overtime Tax Rate Configuration
        </h2>

        {/* Non-Resident Overtime Tax Rate */}
        <div className="mb-4">
          <label
            htmlFor="non_resident_overtime_tax_rate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Non-Resident Overtime Tax Rate
          </label>
          <input
            type="number"
            id="non_resident_overtime_tax_rate"
            name="non_resident_overtime_tax_rate"
            value={values.non_resident_overtime_tax_rate}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.non_resident_overtime_tax_rate &&
              errors.non_resident_overtime_tax_rate
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.non_resident_overtime_tax_rate &&
            errors.non_resident_overtime_tax_rate && (
              <div className="text-red-500 text-sm mt-2">
                {errors.non_resident_overtime_tax_rate as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("nonResident")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.nonResident ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.nonResident ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for non-resident overtime tax rate */}
          {showDescriptions.nonResident && (
            <p className="text-gray-600 text-sm mt-2">
              The non-resident overtime tax rate applies to workers who are not
              residents and is used to calculate the additional tax on their
              overtime earnings.
            </p>
          )}
        </div>

        {/* Resident Overtime Tax Rate (Low) */}
        <div className="mb-4">
          <label
            htmlFor="resident_overtime_tax_rate_low"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resident Overtime Tax Rate (Low)
          </label>
          <input
            type="number"
            id="resident_overtime_tax_rate_low"
            name="resident_overtime_tax_rate_low"
            value={values.resident_overtime_tax_rate_low}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.resident_overtime_tax_rate_low &&
              errors.resident_overtime_tax_rate_low
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.resident_overtime_tax_rate_low &&
            errors.resident_overtime_tax_rate_low && (
              <div className="text-red-500 text-sm mt-2">
                {errors.resident_overtime_tax_rate_low as string}
              </div>
            )}

          <button
            type="button"
            onClick={() => toggleDescription("residentLow")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.residentLow ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.residentLow ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for resident overtime tax rate (low) */}
          {showDescriptions.residentLow && (
            <p className="text-gray-600 text-sm mt-2">
              The resident overtime tax rate (low) applies to workers who are
              residents and is used to calculate the tax on overtime earnings
              that fall below a certain threshold.
            </p>
          )}
        </div>

        {/* Resident Overtime Tax Rate (High) */}
        <div className="mb-4">
          <label
            htmlFor="resident_overtime_tax_rate_high"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resident Overtime Tax Rate (High)
          </label>
          <input
            type="number"
            id="resident_overtime_tax_rate_high"
            name="resident_overtime_tax_rate_high"
            value={values.resident_overtime_tax_rate_high}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.resident_overtime_tax_rate_high &&
              errors.resident_overtime_tax_rate_high
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.resident_overtime_tax_rate_high &&
            errors.resident_overtime_tax_rate_high && (
              <div className="text-red-500 text-sm mt-2">
                {errors.resident_overtime_tax_rate_high as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("residentHigh")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.residentHigh ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.residentHigh ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for resident overtime tax rate (high) */}
          {showDescriptions.residentHigh && (
            <p className="text-gray-600 text-sm mt-2">
              The resident overtime tax rate (high) applies to workers who are
              residents and is used to calculate the tax on overtime earnings
              that exceed a certain threshold. If the total overtime exceeds the
              threshold, the excess portion (the amount over the threshold) is
              taxed at the higher rate (high), and the amount within the
              threshold is taxed at the lower rate (lower).
            </p>
          )}
        </div>

        {/* Overtime Basic Threshold Percentage */}
        <div className="mb-4">
          <label
            htmlFor="overtime_basic_threshold_percentage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Overtime Basic Threshold Percentage
          </label>
          <input
            type="number"
            id="overtime_basic_threshold_percentage"
            name="overtime_basic_threshold_percentage"
            value={values.overtime_basic_threshold_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.overtime_basic_threshold_percentage &&
              errors.overtime_basic_threshold_percentage
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.overtime_basic_threshold_percentage &&
            errors.overtime_basic_threshold_percentage && (
              <div className="text-red-500 text-sm mt-2">
                {errors.overtime_basic_threshold_percentage as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("overtimeThreshold")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.overtimeThreshold ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.overtimeThreshold
                ? "Hide details"
                : "Show details"}
            </span>
          </button>

          {/* Description for overtime basic threshold percentage */}
          {showDescriptions.overtimeThreshold && (
            <p className="text-gray-600 text-sm mt-2">
              The overtime basic threshold percentage defines the percentage of
              overtime pay that will be subject to taxation based on the
              worker's classification.
            </p>
          )}
        </div>

        {/* Submit Button */}
        {hasEditAccess && (
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

const BonusTaxRatesConfiguration = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEditAccess = privileges?.includes("PAYROLL_TAX_EDIT");
  const { data } = useBonusTaxRateListQuery({});
  const [updateBonusTaxRates] = useBonusTaxRateUpdateMutation();

  // State to toggle descriptions
  const [showDescriptions, setShowDescriptions] = useState({
    nonResident: false,
    residentLow: false,
    residentHigh: false,
    bonusThreshold: false,
  });

  const toggleDescription = (key) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      non_resident_bonus_tax_rate:
        data?.data?.non_resident_bonus_tax_rate || 0.2,
      resident_bonus_tax_rate_low:
        data?.data?.resident_bonus_tax_rate_low || 0.05,
      resident_bonus_tax_rate_high:
        data?.data?.resident_bonus_tax_rate_high || 0.1,
      bonus_tax_threshold_percentage:
        data?.data?.bonus_tax_threshold_percentage || 0.15,
    },
    validationSchema: Yup.object({
      non_resident_bonus_tax_rate: Yup.number().required(
        "Non-resident bonus tax rate is required"
      ),
      resident_bonus_tax_rate_low: Yup.number().required(
        "Resident bonus tax rate (low) is required"
      ),
      resident_bonus_tax_rate_high: Yup.number().required(
        "Resident bonus tax rate (high) is required"
      ),
      bonus_tax_threshold_percentage: Yup.number().required(
        "Bonus tax threshold percentage is required"
      ),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: "Confirm Update",
        text: `Do you want to update the bonus tax rates? This change will directly affect bonus tax calculations.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateBonusTaxRates({ bonus_tax_rates: values });
            Swal.fire(
              "Success!",
              "Bonus tax rates updated successfully.",
              "success"
            );
          } catch (error) {
            Swal.fire("Error!", "Failed to update bonus tax rates.", "error");
          }
        }
      });
    },
  });

  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    formik;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-[18px] mb-4 font-semibold">
          Bonus Tax Rate Configuration
        </h2>

        {/* Non-Resident Bonus Tax Rate */}
        <div className="mb-4">
          <label
            htmlFor="non_resident_bonus_tax_rate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Non-Resident Bonus Tax Rate
          </label>
          <input
            type="number"
            id="non_resident_bonus_tax_rate"
            name="non_resident_bonus_tax_rate"
            value={values.non_resident_bonus_tax_rate}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.non_resident_bonus_tax_rate &&
              errors.non_resident_bonus_tax_rate
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.non_resident_bonus_tax_rate &&
            errors.non_resident_bonus_tax_rate && (
              <div className="text-red-500 text-sm mt-2">
                {errors.non_resident_bonus_tax_rate as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("nonResident")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.nonResident ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.nonResident ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for non-resident bonus tax rate */}
          {showDescriptions.nonResident && (
            <p className="text-gray-600 text-sm mt-2">
              The non-resident bonus tax rate applies to workers who are not
              residents and is used to calculate the additional tax on their
              bonus earnings.
            </p>
          )}
        </div>

        {/* Resident Bonus Tax Rate (Low) */}
        <div className="mb-4">
          <label
            htmlFor="resident_bonus_tax_rate_low"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resident Bonus Tax Rate (Low)
          </label>
          <input
            type="number"
            id="resident_bonus_tax_rate_low"
            name="resident_bonus_tax_rate_low"
            value={values.resident_bonus_tax_rate_low}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.resident_bonus_tax_rate_low &&
              errors.resident_bonus_tax_rate_low
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />

          {touched.resident_bonus_tax_rate_low &&
            errors.resident_bonus_tax_rate_low && (
              <div className="text-red-500 text-sm mt-2">
                {errors.resident_bonus_tax_rate_low as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("residentLow")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.residentLow ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.residentLow ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for resident bonus tax rate (low) */}
          {showDescriptions.residentLow && (
            <p className="text-gray-600 text-sm mt-2">
              The resident bonus tax rate (low) applies to workers who are
              residents and is used to calculate the tax on bonus earnings that
              fall below a certain threshold.
            </p>
          )}
        </div>

        {/* Resident Bonus Tax Rate (High) */}
        <div className="mb-4">
          <label
            htmlFor="resident_bonus_tax_rate_high"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resident Bonus Tax Rate (High)
          </label>
          <input
            type="number"
            id="resident_bonus_tax_rate_high"
            name="resident_bonus_tax_rate_high"
            value={values.resident_bonus_tax_rate_high}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.resident_bonus_tax_rate_high &&
              errors.resident_bonus_tax_rate_high
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.resident_bonus_tax_rate_high &&
            errors.resident_bonus_tax_rate_high && (
              <div className="text-red-500 text-sm mt-2">
                {errors.resident_bonus_tax_rate_high as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("residentHigh")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.residentHigh ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.residentHigh ? "Hide details" : "Show details"}
            </span>
          </button>

          {/* Description for resident bonus tax rate (high) */}
          {showDescriptions.residentHigh && (
            <p className="text-gray-600 text-sm mt-2">
              The resident bonus tax rate (high) applies to workers who are
              residents and is used to calculate the tax on bonus earnings that
              exceed a certain threshold.
            </p>
          )}
        </div>

        {/* Bonus Tax Threshold Percentage */}
        <div className="mb-4">
          <label
            htmlFor="bonus_tax_threshold_percentage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bonus Tax Threshold Percentage
          </label>
          <input
            type="number"
            id="bonus_tax_threshold_percentage"
            name="bonus_tax_threshold_percentage"
            value={values.bonus_tax_threshold_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.bonus_tax_threshold_percentage &&
              errors.bonus_tax_threshold_percentage
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />

          {touched.bonus_tax_threshold_percentage &&
            errors.bonus_tax_threshold_percentage && (
              <div className="text-red-500 text-sm mt-2">
                {errors.bonus_tax_threshold_percentage as string}
              </div>
            )}

          {/* Toggle button for description */}
          <button
            type="button"
            onClick={() => toggleDescription("bonusThreshold")}
            className="text-blue-500 text-sm m-2 inline-flex items-center"
            aria-label="Toggle description"
          >
            {showDescriptions.bonusThreshold ? <FaEyeSlash /> : <FaEye />}
            <span className="ml-2">
              {showDescriptions.bonusThreshold
                ? "Hide details"
                : "Show details"}
            </span>
          </button>

          {/* Description for bonus tax threshold percentage */}
          {showDescriptions.bonusThreshold && (
            <p className="text-gray-600 text-sm mt-2">
              The bonus tax threshold percentage defines the percentage of bonus
              earnings that will be subject to taxation based on the worker's
              classification.
            </p>
          )}
        </div>

        {/* Submit Button */}
        {hasEditAccess && (
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

const CasualWorkerTaxConfiguration = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEditAccess = privileges?.includes("PAYROLL_TAX_EDIT");
  const { data: casualData } = useCasualWorkerTaxListQuery({});
  const [updateCasualWorkerTax] = useCasualWorkerUpdateMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      casual_worker_tax: (casualData?.data as number) || 0.05,
    },
    validationSchema: Yup.object({
      casual_worker_tax: Yup.number().required(
        "Casual worker tax multiplier is required"
      ),
    }),
    onSubmit: async ({ casual_worker_tax }) => {
      Swal.fire({
        title: "Confirm Update",
        text: `Do you want to update the casual worker tax rate? This change will directly affect tax calculations for all casual workers`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateCasualWorkerTax({ casual_worker_tax });
            Swal.fire(
              "Success!",
              "Casual worker tax rate updated successfully. Tax calculations for casual workers have been adjusted accordingly.",
              "success"
            );
          } catch (error) {
            Swal.fire(
              "Error!",
              "Failed to update casual worker rate.",
              "error"
            );
          }
        }
      });
    },
  });

  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    formik;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mx-2 w-1/2 max-md:w-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-[18px] mb-4 font-semibold">
          Casual Worker Tax Rate
        </h2>
        <div className="mb-4">
          <label
            htmlFor="casual_worker_tax"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Casual Worker Tax Rate
          </label>
          <input
            type="number"
            id="casual_worker_tax"
            name="casual_worker_tax"
            value={values.casual_worker_tax}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!hasEditAccess}
            className={`border p-2 w-[50%] rounded-md ${
              touched.casual_worker_tax && errors.casual_worker_tax
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-300`}
          />
          {touched.casual_worker_tax && errors.casual_worker_tax ? (
            <div className="text-red-500 text-sm mt-2">
              {errors.casual_worker_tax}
            </div>
          ) : null}
        </div>
        {hasEditAccess && (
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default TaxConfiguration;
