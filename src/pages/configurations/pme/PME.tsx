import { useEffect, useState } from "react";
import PageLayout from "../../../components/PageLayout";
import AddPME from "./AddPME";
import EditPME from "./EditPME";
import LoadDeductions from "./LoadDeductions";
import LoadAllowances from "./LoadAllowances";
import LoadTier3 from "./LoadTier3";
import { PageTitle } from "../../../utils/PageTitle";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Pagination, Table, Tag, Tooltip, Dropdown, MenuProps, Space, Button } from "antd";
import { AiOutlineSearch, AiOutlineCloudUpload, AiOutlineDown } from "react-icons/ai";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import {
  usePmeListQuery,
  usePmeDeleteMutation,
  usePmeBulkDeleteMutation,
} from "../../../redux/features/configurations/pmeApi";
import { styles } from "../../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Swal from "sweetalert2";
import { capitalizeFirstLetter } from "../../../utils/helperFunction";

function formatNumberToLocaleString(number: any) {
  if (typeof number !== "number" || isNaN(number)) {
    return null;
  }
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const PME = () => {
  PageTitle("Payroll Monetary Element | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_PM_ELEMENTS_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_PM_ELEMENTS_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_PM_ELEMENTS_DELETE");

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadAllowances, setLoadAllowances] = useState(false);
  const [loadTier3, setLoadTier3] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pme, setPme] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState<string>("");
  const [historyRecordName, setHistoryRecordName] = useState<string>("");

  const [
    deletePme,
    { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError },
  ] = usePmeDeleteMutation();

  const [
    bulkDeletePme,
    {
      data: bulkDeletedData,
      isSuccess: isBulkDeletingSuccess,
      error: bulkDeletionError,
    },
  ] = usePmeBulkDeleteMutation();

  const {
    data: pmeListData,
    isLoading: isPmeListLoading,
    refetch,
  } = usePmeListQuery({ page, limit, searchTerm, sortField, sortOrder });

  const handleChangePage = (page: any) => {
    setPage(page);
  };

  const handleDeleteButtonClick = async (pme: any) => {
    const result = await Swal.fire({
      title: "Delete PME",
      text: "Do you want to delete this PME ?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deletePme(pme._id);
      refetch();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    const result = await Swal.fire({
      title: "Bulk Delete PMEs",
      text: `Do you want to delete the ${selectedRowKeys.length} selected PMEs?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await bulkDeletePme(selectedRowKeys);
      refetch();
    }
  };

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    if (isDeletingSuccess || isBulkDeletingSuccess) {
      const message =
        (isDeletingSuccess ? deletedData?.message : bulkDeletedData?.message) ||
        "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
      if (isBulkDeletingSuccess) setSelectedRowKeys([]);
    }

    const error = deletionError || bulkDeletionError;
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [
    isDeletingSuccess,
    deletionError,
    deletedData,
    isBulkDeletingSuccess,
    bulkDeletionError,
    bulkDeletedData,
  ]);

  const handleEditPopUp = (pme: any) => {
    setPme(pme);
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

  const bulkLoadItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Bulk Load Allowances',
      icon: <LiaPlusSquareSolid />,
      onClick: () => setLoadAllowances(true),
    },
    {
      key: '2',
      label: 'Bulk Load Deductions',
      icon: <LiaPlusSquareSolid />,
      onClick: () => setLoad(true),
    },
    {
      key: '3',
      label: 'Bulk Load Tier 3',
      icon: <LiaPlusSquareSolid />,
      onClick: () => setLoadTier3(true),
    },
  ];

  // if (isPmeListLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <AddPME open={add} onClose={() => setAdd(false)} refetch={refetch} />
      <EditPME
        open={edit}
        onClose={() => setEdit(false)}
        itemData={pme}
        refetch={refetch}
      />
      <LoadDeductions
        open={load}
        onClose={() => setLoad(false)}
        refetch={refetch}
      />
      <LoadAllowances
        open={loadAllowances}
        onClose={() => setLoadAllowances(false)}
        refetch={refetch}
      />
      <LoadTier3
        open={loadTier3}
        onClose={() => setLoadTier3(false)}
        refetch={refetch}
      />
      <PageLayout
        title="Payroll Monetary Elements"
        subtitle="Allowances, deductions and tier 3 contributions"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "PM Elements" }]}
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          {selectedRowKeys.length > 0 && hasDeleteAccess && (
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
              onClick={handleBulkDelete}
            >
              <AiFillDelete size={14} />
              <span>Delete Selected ({selectedRowKeys.length})</span>
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex justify-between mb-4 gap-4 flex-wrap">
            <div className="flex gap-2 items-center">
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
              <span className="text-gray-500 text-sm font-medium">entries</span>
            </div>

            <div className="flex relative w-full max-w-md">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                autoFocus
                placeholder="Search by name, type, staff ID or employee name..."
                className="w-full text-[14px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <AiOutlineSearch
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {hasCreateAccess && (
                <>
                  <Dropdown menu={{ items: bulkLoadItems }} trigger={['click']}>
                    <Button 
                      className={`${styles.primary_button} !bg-teal-600 hover:!bg-teal-700 !border-none !h-[38px]`}
                      icon={<AiOutlineCloudUpload size={18} />}
                    >
                      <Space>
                        Bulk Operations
                        <AiOutlineDown size={12} />
                      </Space>
                    </Button>
                  </Dropdown>

                  <button
                    className={`${styles.primary_button} !h-[38px]`}
                    onClick={() => setAdd(true)}
                  >
                    <LiaPlusSquareSolid size={18} />
                    <span className="ml-2 font-medium">
                      New Monetary Element
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="table-wrapper bg-white rounded-sm shadow-sm">
            <Table
              rowSelection={rowSelection}
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
                  width: 150,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("name"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Level",
                  dataIndex: "level",
                  key: "level",
                  width: 100,
                  sorter: true,
                  render: (text) => (
                    <Tag color={text?.toLowerCase() === 'personal' ? 'blue' : 'orange'}>
                      {capitalizeFirstLetter(text) || ""}
                    </Tag>
                  ),
                  onHeaderCell: () => ({
                    onClick: () => handleSort("level"),
                    style: { cursor: "pointer" },
                  }),
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  key: "type",
                  width: 110,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("type"),
                    style: { cursor: "pointer" },
                  }),
                  render: (text) => (
                    <Tag color={text?.toLowerCase() === 'allowance' ? 'green' : text?.toLowerCase() === 'deduction' ? 'red' : 'purple'}>
                      {(text || "").toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: "Category",
                  key: "category",
                  width: 130,
                  render: (_text, record: any) => {
                    const category = record.allowance_category || record.deduction_category || record.bonus_category || "standard";
                    return (
                      <Tag color="cyan">
                        {category.toUpperCase().replace("_", " ")}
                      </Tag>
                    );
                  }
                },
                {
                  title: "Target Members",
                  key: "users_count",
                  width: 120,
                  render: (_text, record: any) => record.level?.toLowerCase() === 'personal' ? (
                    <Tag color="geekblue" className="m-0">{record.users_count || 0} Members</Tag>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">GLOBAL/RANK</span>
                  ),
                },
                {
                  title: "Amount/Rule",
                  key: "amount",
                  width: 180,
                  align: "right" as const,
                  sorter: true,
                  onHeaderCell: () => ({
                    onClick: () => handleSort("amount"),
                    style: { cursor: "pointer" },
                  }),
                  render: (_text, record: any) => {
                    if (record?.bonus_amount) {
                      return formatNumberToLocaleString(record?.bonus_amount);
                    } else if (record?.deduction_amount) {
                      return formatNumberToLocaleString(
                        record?.deduction_amount
                      );
                    } else if (record?.allowance_amount) {
                      return formatNumberToLocaleString(
                        record?.allowance_amount
                      );
                    } else if (
                      record?.allowance_percentage &&
                      record?.allowance_percentage_to === "salary"
                    ) {
                      return (
                        <span>
                          {record?.allowance_percentage}% of{" "}
                          <span className="border border-[#39afd1] text-[#39afd1] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold">
                            Basic Salary
                          </span>
                        </span>
                      );
                    } else if (
                      record?.allowance_percentage &&
                      record?.allowance_percentage_to === "gross"
                    ) {
                      return (
                        <span>
                          {record?.allowance_percentage}% of{" "}
                          <span className="border border-[#39afd1] text-[#39afd1] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold">
                            Gross Salary
                          </span>
                        </span>
                      );
                    } else if (
                      record?.deduction_percentage &&
                      record?.deduction_percentage_to === "salary"
                    ) {
                      return (
                        <span>
                          {record?.deduction_percentage}% of{" "}
                          <span className="border border-[#39afd1] text-[#39afd1] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold">
                            Basic Salary
                          </span>
                        </span>
                      );
                    } else if (
                      record?.deduction_percentage &&
                      record?.deduction_percentage_to === "gross"
                    ) {
                      return (
                        <span>
                          {record?.deduction_percentage}% of{" "}
                          <span className="border border-[#39afd1] text-[#39afd1] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold">
                            Gross Salary
                          </span>
                        </span>
                      );
                    } else if (
                      record?.allowance_percentage &&
                      record?.allowance_perc_allowances_names &&
                      record.allowance_perc_allowances_names.length > 0
                    ) {
                      return (
                        <span>
                          {record.allowance_percentage}% of{" "}
                          {record?.allowance_perc_allowances_names?.map(
                            (item: any, idx: any) => (
                              <span
                                key={idx}
                                className="border border-[#313a46] text-[#313a46] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold mr-1"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </span>
                      );
                    } else if (
                      record?.deduction_percentage &&
                      record?.deduction_perc_allowances_names &&
                      record.deduction_perc_allowances_names.length > 0
                    ) {
                      return (
                        <span>
                          {record.deduction_percentage}% of{" "}
                          {record?.deduction_perc_allowances_names?.map(
                            (item: any, idx: any) => (
                              <span
                                key={idx}
                                className="border border-[#313a46] text-[#313a46] text-[10px] py-[2.62px] px-[4.2px] rounded-md font-bold mr-1"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </span>
                      );
                    }
                    return null;
                  },
                },
                {
                  title: "Action",
                  key: "action",
                  width: 120,
                  align: "center" as const,
                  hidden: !hasEditAccess && !hasDeleteAccess,
                  render: (_text, record) => (
                    <span className="flex items-center justify-center gap-2">
                      {hasEditAccess && (
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
                      {hasDeleteAccess && (
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
                      <div className="relative group">
                        <span
                          className="inline-flex items-center justify-center p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setHistoryRecordId(record._id);
                            setHistoryRecordName(record.name);
                            setHistoryDrawerVisible(true);
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: 14 }} />
                        </span>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          History
                        </span>
                      </div>
                    </span>
                  ),
                },
              ]}
              dataSource={pmeListData?.data || []}
              rowKey="_id"
              loading={isPmeListLoading}
              pagination={false}
              size="small"
              expandable={{
                rowExpandable: (record: any) => record.level?.toLowerCase() === 'personal' && record.users_data?.length > 0,
                expandedRowRender: (record: any) => (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h4 className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                       Linked Employees ({record.users_count})
                    </h4>
                    <div className="max-h-[300px] overflow-y-auto bg-white p-3 rounded border border-gray-100 shadow-inner">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {record.users_data?.map((user: any, idx: number) => (
                          <div key={idx} className="text-[11px] p-2 bg-white rounded flex justify-between border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                            <span className="font-bold text-gray-700">{user.firstname} {user.lastname}</span>
                            <span className="text-blue-600 font-mono font-bold">#{user.staff_id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              }}
              locale={{ emptyText: "No data" }}
              scroll={{ x: 1200, y: "65vh" }}
            />
          </div>
          <div className="flex  mt-4 justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={(pmeListData && pmeListData.totalCount) || 1}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <RecordHistoryDrawer
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
        recordId={historyRecordId}
        modelName="PME"
        recordName={historyRecordName}
      />
    </>
  );
};

export default PME;
