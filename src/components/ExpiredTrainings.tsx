import { useEmployeeExpiredTrainingsQuery } from "../redux/features/employee/employeeApi";



const ExpiredTrainings = () => {
  const { data: expiredTrainings } = useEmployeeExpiredTrainingsQuery({});

  // Combine expired and expiring data
  const combinedTrainings = [
    ...(expiredTrainings?.data?.expired || []).map((employee) => ({
      ...employee,
      status: "expired",
    })),
    ...(expiredTrainings?.data?.expiring || []).map((employee) => ({
      ...employee,
      status: "expiring",
    })),
  ];

  // const largeDataset = combinedTrainings.flatMap((employee) =>
  //   Array(50).fill(employee)
  // );

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Employee Trainings</h2>
      {combinedTrainings.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="table-wrapper max-h-[400px] overflow-y-auto">
            {/* Set a fixed height here */}
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Staff ID</th>
                  <th className="py-2 px-4 text-left">Full Name</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {combinedTrainings.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="py-2 px-4">{employee.staff_id}</td>
                    <td className="py-2 px-4">
                      {employee.firstname} {employee.lastname}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={
                          employee.status === "expired"
                            ? "text-red-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {employee.status === "expired"
                          ? "Expired"
                          : "Expiring Soon"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">
          No employees with expired or expiring trainings.
        </p>
      )}
    </div>
  );
};

export default ExpiredTrainings;
