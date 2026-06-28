import { useState } from "react";
import {
  useGetEmployeeFinancialDetailsQuery,
  useEmployeeFullListQuery,
} from "../../redux/features/employee/employeeApi";
import { Select } from "antd";
import PageLayout from "../../components/PageLayout";
import { formatDate2 } from "../../utils/helperFunction";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
const { Option } = Select;

const FinancialDetails = () => {
  const [employeeId, setEmployeeId] = useState<string | null>("");

  const { data: details, refetch } = useGetEmployeeFinancialDetailsQuery({
    employeeId,
  });

  const handleNextButton = () => {
    setEmployeeId(details?.next);
  };

  const handlePrevButton = () => {
    setEmployeeId(details?.prev);
  };

  const { data: employeeList } = useEmployeeFullListQuery({});

  const handleEmployeeChange = (_: any, option: any) => {
    setEmployeeId(option.value);
  };

  return (
    <>
      <PageLayout
        title="Employee Financial Details"
        subtitle="View bank and salary details per staff member"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Employees", href: "/employees" }, { label: "Financial Details" }]}
      />
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 pt-6 pb-20">
          <div className="w-4/12 max-[800px]:w-5/12 max-sm:w-8/12 px-6">
            <Select
              showSearch
              placeholder="Select Employee"
              optionFilterProp="label"
              style={{
                width: "100%",
              }}
              value={employeeId}
              onChange={handleEmployeeChange}
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {employeeList &&
                employeeList.length > 0 &&
                employeeList.map((employee: any, i: number) => (
                  <Option
                    key={i}
                    value={employee.id}
                    label={`${employee.staff_id} - ${employee.firstname} ${employee.lastname}`}
                  >
                    {employee.staff_id} - {employee.firstname}{" "}
                    {employee.lastname}
                  </Option>
                ))}
            </Select>
          </div>

          <br />
          <hr />

          {details && (
            <div className="rounded-md py-2 px-6 mt-4 flex flex-wrap gap-4 justify-around">
              <section className="flex flex-wrap justify-around rounded-md border shadow-custom bg-[#F4F4F4] w-[45%] max-md:w-full">
                <div className="w-full">
                  <h3 className="font-bold text-base bg-blue-50 px-4 py-2 mb-3 rounded border-l-4 border-blue-500">
                    Personal Information
                  </h3>
                  <div className="space-y-2 px-4">
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Staff ID:</span>
                      <span>{details?.staff_id}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">First Name:</span>
                      <span>{details?.firstname}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Last Name:</span>
                      <span>{details?.lastname}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Other Names:</span>
                      <span>{details?.other_names}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Date of Birth:</span>
                      <span>
                        {details?.date_of_birth &&
                          formatDate2(details?.date_of_birth)}
                      </span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Gender:</span>
                      <span>{details?.gender}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Phone:</span>
                      <span>{details?.phone_number_1}</span>
                    </p>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-bold text-base bg-green-50 px-4 py-2 mb-3 rounded border-l-4 border-green-500">
                    Employment Information
                  </h3>
                  <div className="space-y-2 px-4">
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Rank:</span>
                      <span>{details?.grade_name}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Notch:</span>
                      <span>{details?.notch || "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Entity:</span>
                      <span>{details?.entity_name}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Designation:</span>
                      <span>{details?.entity_designation}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Last Promotion:</span>
                      <span>
                        {details?.effective_date_of_last_promotion &&
                          formatDate2(details?.effective_date_of_last_promotion)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-bold text-base bg-purple-50 px-4 py-2 mb-3 rounded border-l-4 border-purple-500">
                    Banking Information
                  </h3>
                  <div className="space-y-2 px-4 pb-4">
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Bank:</span>
                      <span>{details?.bank_name}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Branch:</span>
                      <span>{details?.bank_branch_name}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Account No:</span>
                      <span>{details?.bank_account_number}</span>
                    </p>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-bold text-base bg-orange-50 px-4 py-2 mb-3 rounded border-l-4 border-orange-500">
                    Tax & Social Security
                  </h3>
                  <div className="space-y-2 px-4 pb-4">
                    <p className="flex gap-2">
                      <span className="font-bold w-24">Tax Payer:</span>
                      <span className={details?.is_tax_payer ? "text-green-600 font-medium" : "text-gray-500"}>
                        {details?.is_tax_payer ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold w-24">SSNIT Payer:</span>
                      <span className={details?.is_ssnit_payer ? "text-green-600 font-medium" : "text-gray-500"}>
                        {details?.is_ssnit_payer ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              <section className="flex flex-wrap justify-around rounded-md border shadow-custom bg-[#F4F4F4] w-[45%] max-md:w-full">
                <div className="table-wrapper w-full overflow-x-auto overflow-y-auto">
                  <table className="w-full border-collapse border shadow-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-sm px-4 py-1 text-left">
                          Element Name
                        </th>
                        <th className="text-sm px-4 py-1 text-left">
                          Element Type
                        </th>
                        <th className="text-sm px-4 py-1 text-left">Level</th>
                        <th className="text-sm px-4 py-1 text-left">
                          Amount
                        </th>{" "}
                      </tr>
                    </thead>
                    <tbody>
                      {details?.pmes &&
                        details?.pmes?.map((item: any, i: any) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="text-sm px-4 py-1 text-left">
                              {item?.name}
                            </td>
                            <td className="text-sm px-4 py-1 text-left">
                              {item?.type}
                            </td>
                            <td className="text-sm px-4 py-1 text-left">
                              {item?.level}
                            </td>
                            <td className="text-sm px-4 py-1 text-left">
                              {item?.amount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {details && (
            <div className="mt-12 flex justify-between px-5 py-4 w-[95%] mx-auto shadow-custom">
              <div>
                <button
                  className="flex items-center gap-3 hover:text-blue-400"
                  onClick={handlePrevButton}
                >
                  <MdNavigateBefore size={25} className="animate-icon" />
                  Prev Employee
                </button>
              </div>
              <div>
                <button
                  className="flex items-center gap-3 hover:text-blue-400"
                  onClick={handleNextButton}
                >
                  Next Employee
                  <MdNavigateNext size={25} className="animate-icon" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FinancialDetails;
