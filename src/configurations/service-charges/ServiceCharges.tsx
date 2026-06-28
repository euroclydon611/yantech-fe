import { useEffect, useState } from "react";
import CustomModal from "../../utils/CustomModal";
import EditModal from "../../utils/EditModal";
import AddServiceCharge from "./AddServiceCharge";
import EditServiceCharge from "./EditServiceCharge";
import { PageTitle } from "../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Pagination, Table, Tag } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../pages/settings/RecordHistoryDrawer";
import {
  useListServiceChargesQuery,
  useDeleteServiceChargeMutation,
} from "../../redux/features/configurations/service_charges";
import Swal from "sweetalert2";
import { styles } from "../../styles";
import { usePrivileges } from "../../hooks/usePrivileges";

const ServiceCharges = () => {
  PageTitle("Service Charges | Configuration");
  const { 
    hasServiceChargesAccess, 
    hasServiceChargesCreate, 
    hasServiceChargesEdit, 
    hasServiceChargesDelete 
  } = usePrivileges();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortField, setSortField] = useState("min_amount");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  const [
    deleteServiceCharge,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = useDeleteServiceChargeMutation();

  const {
    data: serviceChargeListData,
    isLoading: isServiceChargeListLoading,
    refetch,
  } = useListServiceChargesQuery({ page, limit, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (item: any) => {
    const result = await Swal.fire({
      title: "Delete Service Charge",
      text: "Do you want to delete this service charge range?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteServiceCharge(item._id);
    }
  };

  useEffect(() => {
    if (isDeletingSuccess) {
      const message = `${deletedData?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#14532D",
        showConfirmButton: true,
      });
      refetch();
    }
    if (deletionError) {
      if ("data" in deletionError) {
        const errorData = deletionError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#14532D",
          showConfirmButton: true,
        });
      }
    }
  }, [isDeletingSuccess, deletionError, deletedData, refetch]);

  const handleEditPopUp = (item: any) => {
    setSelectedItem(item);
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

  if (!hasServiceChargesAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view Service Charges.
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
          Component={AddServiceCharge}
          refetch={refetch}
        />
      )}
      {edit && (
        <EditModal
          open={edit}
          setOpen={setEdit}
          Component={EditServiceCharge}
          itemData={selectedItem}
          refetch={refetch}
        />
      )}
      <div className="pt-4 px-2">
        <h1 className="text-[18px] mb-3 font-bold">Service Charges (Tiered Digital Charges)</h1>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex justify-between mb-4">
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
            
            <div className="flex gap-5">
              {hasServiceChargesCreate && (
                <button
                  className={`${styles.primary_button}`}
                  onClick={() => setAdd(true)}
                >
                  <LiaPlusSquareSolid size={18} />
                  <span className="ml-2 max-md:hidden font-medium">New Service Charge</span>
                </button>
              )}
            </div>
          </div>

          <div className="table-wrapper max-h-[65vh] overflow-y-auto bg-white rounded-sm">
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
                  title: "Min Amount (GHS)",
                  dataIndex: "min_amount",
                  key: "min_amount",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("min_amount"),
                    style: { cursor: "pointer" },
                  }),
                  render: (val) => val?.toLocaleString()
                },
                {
                  title: "Max Amount (GHS)",
                  dataIndex: "max_amount",
                  key: "max_amount",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("max_amount"),
                    style: { cursor: "pointer" },
                  }),
                  render: (val) => val ? val.toLocaleString() : <Tag color="blue">Above</Tag>
                },
                {
                  title: "Charge Amount (GHS)",
                  dataIndex: "charge",
                  key: "charge",
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("charge"),
                    style: { cursor: "pointer" },
                  }),
                  render: (val) => <b>{val?.toLocaleString()}</b>
                },
                {
                    title: "Status",
                    dataIndex: "is_cap",
                    key: "is_cap",
                    render: (is_cap) => (
                        is_cap ? <Tag color="red">CAP</Tag> : <Tag color="green">RANGE</Tag>
                    )
                },
                {
                  title: "Actions",
                  key: "action",
                  width: 100,
                  align: "center" as const,
                  render: (_text, record) => (
                    <div className="flex items-center justify-center gap-1">
                      {hasServiceChargesEdit && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleEditPopUp(record)}
                          >
                            <FaEdit size={14} />
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

                      {hasServiceChargesDelete && (
                        <div className="relative group">
                          <span
                            className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                            onClick={() => handleDeleteButtonClick(record)}
                          >
                            <AiFillDelete size={14} />
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
              dataSource={serviceChargeListData?.data || []}
              rowKey="_id"
              loading={isServiceChargeListLoading}
              pagination={false}
              size="small"
              locale={{ emptyText: "No service charges found" }}
              scroll={{ x: 800 }}
            />
          </div>

          <div className="flex mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={serviceChargeListData?.totalCount || 0}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="ServiceCharge"
        recordId={selectedHistoryRecord?._id}
        recordName={selectedHistoryRecord ? `Range: ${selectedHistoryRecord.min_amount} - ${selectedHistoryRecord.max_amount || 'Above'}` : ''}
      />
    </>
  );
};

export default ServiceCharges;
