import { useEffect, useState } from "react";
import CustomModal from "../../utils/CustomModal.tsx";
import EditModal from "../../utils/EditModal.tsx";
import AddReportTemplate from "./AddReportTemplate.tsx";
import EditReportTemplate from "./EditReportTemplate.tsx";
import { PageTitle } from "../../utils/PageTitle.ts";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import { Pagination, Table } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../pages/settings/RecordHistoryDrawer";
import {
  useListReportTemplatesQuery,
  useDeleteReportTemplateMutation,
} from "../../redux/features/configurations/reports_templates.ts";
import Swal from "sweetalert2";
import { styles } from "../../styles.ts";
import { handleDocumentView } from "@/utils/helperFunction.ts";
import { usePrivileges } from "../../hooks/usePrivileges.ts";


const ReportTemplates = () => {
  PageTitle("Reports Templates | Configuration");
  const { 
    hasReportTemplatesAccess, 
    hasReportTemplatesCreate, 
    hasReportTemplatesEdit, 
    hasReportTemplatesDelete 
  } = usePrivileges();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [reportTemplate, setReportTemplate] = useState<any>("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  const [
    deleteReportTemplate,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useDeleteReportTemplateMutation();

  const {
    data: reportTemplateListData,
    isLoading: isReportTemplateListLoading,
    refetch,
  } = useListReportTemplatesQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (template: any) => {
    const result = await Swal.fire({
      title: "Delete Report Template",
      text: "Do you want to delete this report template?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteReportTemplate(template._id);
      refetch();
    }
  };

  useEffect(() => {
    if (isDeletingSuccess) {
      const message = `${deletedData?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
    }
    if (deletionError) {
      if ("data" in deletionError) {
        const errorData = deletionError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData]);

  const handleEditPopUp = (template: any) => {
    setReportTemplate(template);
    setEdit(true);
  };

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (!hasReportTemplatesAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view Report Templates.
        </h1>
      </div>
    );
  }

  return (
    <>
      {add && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          Component={AddReportTemplate}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditReportTemplate}
          itemData={reportTemplate}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Reports Templates</h1>

        <div className="bg-white p-4">
          <div className="flex justify-between mb-2">
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
            <div className="flex relative w-[25%] max-md:w-[55%]">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                placeholder="Search..."
                className={`w-full text-[14px] px-[1rem] py-[0.5rem] border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#39afd1] focus:border-transparent transition duration-200`}
              />
              <AiOutlineSearch
                size={18}
                className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
              />
            </div>
            <div className="flex gap-5">
              {hasReportTemplatesCreate && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">New Report Template</span>
                </button>
              )}
            </div>
          </div>
          <div className="table-wrapper max-h-[65vh] overflow-y-auto bg-white rounded-sm shadow-sm">
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 60,
                  render: (_text, _record, index) =>
                    (page - 1) * limit + index + 1,
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("name"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("description"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Template",
                  key: "template",
                  width: 100,
                  align: "center" as const,
                  render: (_text, record:any) => (
                    <div className="flex items-center justify-center">
                      <div className="relative group">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => handleDocumentView(record.templateFile || record.template)}
                        >
                          <IoEyeSharp size={18} />
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          View Template
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Actions",
                  key: "action",
                  width: 100,
                  align: "center" as const,
                  render: (_text, record) => (
                    <div className="flex items-center justify-center gap-1">
                      {hasReportTemplatesEdit && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleEditPopUp(record)}
                          >
                            <FaEdit size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Edit
                          </span>
                        </div>
                      )}

                      <div className="relative group">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setSelectedHistoryRecord(record);
                            setHistoryOpen(true);
                          }}
                        >
                          <HistoryOutlined size={16} />
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          History
                        </span>
                      </div>

                      {hasReportTemplatesDelete && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleDeleteButtonClick(record)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
              dataSource={reportTemplateListData?.data || []}
              rowKey="_id"
              loading={isReportTemplateListLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No report templates found" }}
              scroll={{ x: 900 }}
            />
          </div>

          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={reportTemplateListData?.totalCount || 0}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="RequestedReportTemplate"
        recordId={selectedHistoryRecord?._id}
        recordName={selectedHistoryRecord?.name}
      />
    </>
  );
};

export default ReportTemplates;
