import { useFetchEmployeeIndustriesQuery } from "@/redux/features/employee-portal-api/general";
import PageLayout from "../components/layout/PageLayout";
import { useState } from "react";
import { Modal, Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa6";
import AllForms from "@/all-eforms/AllForms";

function formatAssessmentTypes(assessmentClasses) {
  if (!Array.isArray(assessmentClasses) || assessmentClasses.length === 0) {
    return "";
  }

  return assessmentClasses
    .map((item) => {
      const { name } = item;
      return `${name}`;
    })
    .join(" || ");
}

function extractAssessmentNames(assessmentTypes): string[] {
  return assessmentTypes?.map((type) => type.name);
}

const IndustryAndForms = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("code");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewForm, setViewForm] = useState(false);
  const [charge, setCharge] = useState<any>({});

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const { data: myIndustries } = useFetchEmployeeIndustriesQuery(
    {
      page,
      limit,
      searchTerm,
      sortField,
      sortOrder,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const handleViewForms = (charge: any) => {
    setCharge(charge);
    setViewForm(true);
  };

  console.log("myIndustries", myIndustries);
  console.log(
    "charge?.assessmentTypes",
    extractAssessmentNames(charge?.assessmentTypes)
  );
  return (
    <>
      <Modal
        // title={charge?.name}
        open={viewForm}
        onCancel={() => setViewForm(false)}
        footer={null}
        width={"95%"}
      >
        <AllForms formTypes={extractAssessmentNames(charge?.assessmentTypes)} />
      </Modal>

      <PageLayout
        title="My Industries and Assessment Forms"
        //   description="Apply for leave and track your leave history"
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Main Content */}
          <div className="px-2 py-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Controls Section */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Display
                      </label>
                      <select
                        name="limit"
                        id="limit"
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value={25}>25 entries</option>
                        <option value={50}>50 entries</option>
                        <option value={100}>100 entries</option>
                      </select>
                    </div>
                  </div>

                  {/* Center - Search */}
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      />
                      <AiOutlineSearch
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Bar */}
              <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <span className="text-gray-600">
                      Total Records:{" "}
                      <span className="font-semibold text-gray-900">
                        {myIndustries?.pagination?.total || 0}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Showing:{" "}
                      <span className="font-semibold text-gray-900">
                        {myIndustries?.data?.length
                          ? (page - 1) * limit + 1
                          : 0}{" "}
                        -{" "}
                        {Math.min(
                          page * limit,
                          myIndustries?.pagination?.total || 0
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="text-gray-500">
                    Page {page} of{" "}
                    {Math.ceil(
                      (myIndustries?.pagination?.total || 0) / limit
                    ) || 1}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-hidden">
                <div className="max-h-[60vh] overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-16">
                          #
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Industry
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Responsible Entity
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Assessment Types
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-28">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myIndustries && myIndustries.data?.length > 0 ? (
                        myIndustries.data.map((industry, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-2 text-sm text-gray-500 font-medium">
                              {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {industry?.name}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {industry?.entityId?.name}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm text-gray-900">
                                {formatAssessmentTypes(
                                  industry?.assessmentTypes
                                ) || (
                                  <span className="text-gray-400 italic">
                                    No assessments
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-green-300 text-green-600 hover:bg-amber-50 hover:border-green-400 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                  title="Edit HS Code"
                                  onClick={() => handleViewForms(industry)}
                                >
                                  <FaWpforms size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-lg font-medium text-gray-900">
                                  No Industry Found
                                </p>
                                <p className="text-gray-500 mt-1">
                                  {searchTerm
                                    ? "Try adjusting your search criteria"
                                    : "Get started by adding your first HS code"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Footer */}
              {myIndustries?.data?.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(page - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(page * limit, myIndustries.pagination.total)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {myIndustries.pagination.total}
                      </span>{" "}
                      results
                    </div>
                    <Pagination
                      current={page}
                      pageSize={limit}
                      total={myIndustries.pagination.total}
                      onChange={handleChangePage}
                      showSizeChanger={false}
                      className="professional-pagination"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
              .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              
              .professional-pagination .ant-pagination-item {
                border-radius: 0.5rem;
                border: 1px solid #d1d5db;
              }
              
              .professional-pagination .ant-pagination-item-active {
                background-color: #059669;
                border-color: #059669;
              }
              
              .professional-pagination .ant-pagination-item-active a {
                color: white;
              }
              
              .professional-pagination .ant-pagination-prev,
              .professional-pagination .ant-pagination-next {
                border-radius: 0.5rem;
                border: 1px solid #d1d5db;
              }
            `}</style>
      </PageLayout>
    </>
  );
};

export default IndustryAndForms;
