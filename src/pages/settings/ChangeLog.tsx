import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";

const ChangeLog = () => {
  PageTitle("Change Log");

  return (
    <>
      <PageLayout
        title="Change Log"
        breadcrumbs={[{ label: "Settings" }, { label: "Change Log" }]}
      />
      <div className="p-4 flex flex-wrap">
        <div className="w-1/2 max-md:w-full mx-8">
          <div className=" bg-gray-100 p-4 overflow-y-auto">
            <div className="mb-8">
              <div>
                <span className="text-sm text-green-600">Version 1.0.0</span>{" "}
                <span>- 27th March 2024</span>
                <div className="text-sm mt-2">
                  <ul className="list-disc ml-6">
                    <li>
                      <strong>Initial Release:</strong> Introduced core
                      functionalities, including:
                      <ul className="list-disc ml-6 space-y-1.5">
                        <li>
                          HR Model: Manage employee records and track HR
                          metrics.
                          <ul className="list-disc ml-6 space-y-1.5">
                            <li>Leave application management</li>
                            <li>Employee Portal</li>
                          </ul>
                        </li>
                        <li>
                          Payroll Model:
                          <ul className="list-disc ml-6 space-y-1.5">
                            <li>
                              Hourly rate calculations for accurate payroll
                              runs.
                            </li>
                            <li>
                              Upload attendance Excel files to calculate working
                              hours automatically.
                            </li>
                            <li>Overtime application management</li>
                            <li>
                              Generate payroll reports for analysis and
                              compliance.
                            </li>
                          </ul>
                        </li>
                        <li>
                          User Management: Control access and manage user roles
                          effectively.
                        </li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>
                          Added backup and restore functionality:
                          <ul className="list-disc ml-6 space-y-1.5">
                            <li>Backup database to ensure data integrity.</li>
                            <li>
                              Download backup files in .gz format for secure
                              storage.
                            </li>
                            <li>
                              Restore system state from previous backups for
                              business continuity.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img src="/images/epa-logo.png" alt="LOGO" />
        </div>
      </div>
    </>
  );
};

export default ChangeLog;
