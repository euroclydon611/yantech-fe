import { useState } from "react";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { AiFillDelete, AiOutlineSearch, AiOutlineCloudDownload, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Table, Tooltip, Typography, Tag, Button } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import { 
  useGetPayrollAdjustmentsQuery, 
  useDeletePayrollAdjustmentMutation,
  useBulkDeletePayrollAdjustmentsMutation
} from "../../../redux/features/reports/payrollAdjustmentApi";
import { styles } from "../../../styles";
import { capitalizeFirstLetter, exportData } from "../../../utils/helperFunction";
import Swal from "sweetalert2";
import AddPayrollAdjustment from "./AddPayrollAdjustment";
import { FaFile, FaCog } from "react-icons/fa";
import BulkUploadAdjustments from "./BulkUploadAdjustments";
import GroupRetroAdjustment from "./GroupRetroAdjustment";

const { Text } = Typography;

const PayrollAdjustments = () => {
  PageTitle("Payroll Adjustments | Payroll");
  
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [historyRecordId, setHistoryRecordId] = useState<string>("");
  const [historyRecordName, setHistoryRecordName] = useState<string>("");

  const { data, isLoading, refetch } = useGetPayrollAdjustmentsQuery({
    page,
    limit,
    searchTerm,
  });

  const [deleteAdjustment] = useDeletePayrollAdjustmentMutation();
  const [bulkDeleteAdjustments, { isLoading: isBulkDeleting }] = useBulkDeletePayrollAdjustmentsMutation();

  const handleExport = async () => {
    const route = `/payroll-adjustments/export?searchQuery=${searchTerm}`;
    await exportData(route, "Payroll_Adjustments");
  };

  const handleEdit = (record: any) => {
    if (record.status !== "pending") {
      Swal.fire("Access Denied", "Only pending adjustments can be edited", "error");
      return;
    }
    setEditData(record);
    setAddOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Adjustment",
      text: "Are you sure you want to delete this adjustment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAdjustment(id).unwrap();
        Swal.fire("Deleted!", "Adjustment has been deleted.", "success");
        refetch();
      } catch (err: any) {
        Swal.fire("Error", err?.data?.error  || err?.data?.message || "Failed to delete", "error");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    const result = await Swal.fire({
      title: "Bulk Delete",
      text: `Are you sure you want to delete ${selectedRowKeys.length} selected adjustments?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await bulkDeleteAdjustments({ ids: selectedRowKeys as string[] }).unwrap();
        Swal.fire("Deleted!", "Selected adjustments have been deleted.", "success");
        setSelectedRowKeys([]);
        refetch();
      } catch (err: any) {
        Swal.fire("Error", err?.data?.error || err?.data?.message || "Failed to delete", "error");
      }
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Staff ID",
      key: "staff_id",
      width: 100,
      fixed: 'left' as const,
      render: (_: any, record: any) => record.is_group ? <Tag color="blue" className="font-bold">GROUP</Tag> : <Text strong>{record.staff_id}</Text>,
    },
    {
      title: "Employee",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 200,
      fixed: 'left' as const,
    },
    {
      title: "Total Earning",
      dataIndex: "total_earning",
      key: "total_earning",
      width: 130,
      align: "right" as const,
      render: (amt: number, record: any) => record.mode === "automated_retro" ? <Text className="text-[10px] text-gray-400 italic">AUTO-CALC</Text> : <Text className="font-bold text-green-600">{amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: "Total Deduction",
      dataIndex: "total_deduction",
      key: "total_deduction",
      width: 140,
      align: "right" as const,
      render: (amt: number, record: any) => record.mode === "automated_retro" ? <Text className="text-[10px] text-gray-400 italic">AUTO-CALC</Text> : <Text className="font-bold text-red-600">{amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: "Net Adjust",
      dataIndex: "net_adjustment",
      key: "net_adjustment",
      width: 130,
      align: "right" as const,
      render: (amt: number, record: any) => record.mode === "automated_retro" ? (
        <Tag color="purple" className="font-bold text-[10px]">DYNAMIC</Tag>
      ) : (
        <Tag color={amt >= 0 ? "green" : "red"} className="font-bold">
          {amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Tag>
      ),
    },
    {
      title: "Items",
      key: "items_count",
      width: 100,
      render: (_: any, record: any) => record.mode === "automated_retro" ? (
        <Tag color="indigo">ENGINE RUN</Tag>
      ) : (
        <Tag color="blue">{record.items?.length || 0} Elements</Tag>
      ),
    },
    {
      title: "Period (Origin)",
      key: "period",
      width: 150,
      render: (_: any, record: any) => record.period_month && record.period_year ? `${capitalizeFirstLetter(record.period_month)} ${record.period_year}` : '-',
    },
    {
      title: "Effective (Payout)",
      key: "effective",
      width: 150,
      render: (_: any, record: any) => `${capitalizeFirstLetter(record.effective_month)} ${record.effective_year}`,
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      width: 120,
      render: (mode: string) => (
        <Tag color={mode === "automated_retro" ? "purple" : "default"}>
          {(mode || "manual").toUpperCase().replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "pending" ? "orange" : "green"}>
          {(status || "pending").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <div className="flex gap-2 items-center">
          {record.status === "pending" && (
            <Tooltip title="Edit">
              <button onClick={() => handleEdit(record)} className="text-blue-500 hover:text-blue-700">
                <AiOutlineEdit size={18} />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700">
              <AiFillDelete size={18} />
            </button>
          </Tooltip>
          <Tooltip title="History">
            <button 
              onClick={() => {
                setHistoryRecordId(record.id);
                setHistoryRecordName(record.is_group ? "Group Adjustment" : `${record.employee_name} (${record.staff_id})`);
                setHistoryDrawerVisible(true);
              }} 
              className="text-gray-500 hover:text-gray-700"
            >
              <HistoryOutlined style={{ fontSize: 18 }} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageLayout
        title="Payroll Adjustments & Arrears"
        subtitle="Manage salary adjustments and retroactive changes"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Salary Adjustments" }]}
      />
      <div className="p-4">
      <RecordHistoryDrawer
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
        recordId={historyRecordId}
        modelName="PayrollAdjustment"
        recordName={historyRecordName}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between mb-4 gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className={styles.limit_select}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-500 text-sm">entries</span>
          </div>

          <div className="flex relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Staff ID or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[14px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <AiOutlineSearch size={18} className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="flex gap-2">
            {selectedRowKeys.length > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className={`${styles.primary_button} !bg-red-600 hover:!bg-red-600`}
                disabled={isBulkDeleting}
              >
                <AiOutlineDelete size={16} />
                <span>Delete Selected ({selectedRowKeys.length})</span>
              </button>
            )}
            {/* <button onClick={handleExport} className={`${styles.primary_button} !bg-green-600`}>
              <AiOutlineCloudDownload size={16} />
              <span>Export</span>
            </button> */}
            <button onClick={() => setAddOpen(true)} className={styles.primary_button}>
              <LiaPlusSquareSolid size={16} />
              <span>Add Manual Adjustment</span>
            </button>
            {/* <button onClick={() => setBulkOpen(true)} className={styles.primary_button}>
              <FaFile size={14} />
              <span>Bulk Upload</span>
            </button> */}
            <button 
              onClick={() => setRetroOpen(true)} 
              className={`${styles.primary_button} !bg-indigo-600 hover:!bg-indigo-700`}
            >
              <FaCog size={14} />
              <span>Run Automated Retro (Bulk / Single)</span>
            </button>
          </div>
        </div>

        <Table
          sticky
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1500, y: "65vh" }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                {record.mode === "automated_retro" ? (
                  <div className="space-y-4">
                     <div>
                        <h4 className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">Group Retro Configuration</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="bg-white p-2 rounded border border-indigo-100">
                              <p className="text-[9px] text-gray-400 uppercase">Target Count</p>
                              <p className="text-sm font-bold">{record.employee_ids?.length || 0} Employees</p>
                           </div>
                           <div className="bg-white p-2 rounded border border-indigo-100">
                              <p className="text-[9px] text-gray-400 uppercase">Origin Period</p>
                              <p className="text-sm font-bold">{capitalizeFirstLetter(record.period_month)} {record.period_year}</p>
                           </div>
                           <div className="bg-white p-2 rounded border border-indigo-100">
                              <p className="text-[9px] text-gray-400 uppercase">Payout Period</p>
                              <p className="text-sm font-bold text-indigo-600">{capitalizeFirstLetter(record.effective_month)} {record.effective_year}</p>
                           </div>
                           <div className="bg-white p-2 rounded border border-indigo-100">
                              <p className="text-[9px] text-gray-400 uppercase">Engine Status</p>
                              <Tag color="orange" className="m-0 uppercase font-bold text-[10px]">Active Engine</Tag>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Target Members ({record.employee_ids?.length || 0})</h4>
                        <div className="max-h-[200px] overflow-y-auto bg-white p-2 rounded border border-gray-100">
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                              {record.employee_ids?.map((emp: any, idx: number) => (
                                 <div key={idx} className="text-[11px] p-1 bg-gray-50 rounded flex justify-between">
                                    <span className="font-medium text-gray-700">{emp.firstname} {emp.lastname}</span>
                                    <span className="text-gray-400 font-mono">#{emp.staff_id}</span>
                                 </div>
                              ))}
                              {(!record.employee_ids || record.employee_ids.length === 0) && (
                                 <p className="text-xs text-gray-400 italic">No members listed</p>
                              )}
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Elements Selected for Auto-Retro</h4>
                        <div className="flex gap-2 flex-wrap">
                           <Tag color={record.include_basic !== false ? "green" : "default"}>Basic Salary</Tag>
                           <Tag color={record.include_pmes !== false ? "green" : "default"}>PMEs (Allowances/Deds)</Tag>
                           <Tag color={record.include_loans !== false ? "green" : "default"}>Active Loans</Tag>
                           <Tag color={record.include_reliefs !== false ? "green" : "default"}>Tax Reliefs</Tag>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 italic">
                           * The Retro Engine will calculate adjustments for all {record.employee_ids?.length || 0} employees by comparing the payroll elements of the Origin Period vs current state.
                        </p>
                     </div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Adjustment Elements Breakdown</h4>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left border-b border-gray-300 pb-2">
                          <th className="pb-2">Element Name</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Category</th>
                          <th className="pb-2 text-right">Amount</th>
                          <th className="pb-2 text-center">Tax</th>
                          <th className="pb-2 text-center">PEN</th>
                          <th className="pb-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 font-medium">{item.name}</td>
                            <td className="py-2">
                               <span className={`px-1 rounded text-[9px] font-bold uppercase ${
                                 item.type === 'earning' ? 'text-green-600 bg-green-50' : 
                                 item.type === 'deduction' ? 'text-red-600 bg-red-50' : 
                                 ['tier_3', 'tier_3_taxable'].includes(item.type) ? 'text-purple-600 bg-purple-50' :
                                 'text-blue-600 bg-blue-50'
                               }`}>
                                 {item.type?.replace("_", " ")}
                               </span>
                            </td>
                            <td className="py-2 text-gray-600 uppercase text-[10px]">{item.category?.replace("_", " ")}</td>
                            <td className="py-2 text-right font-bold">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-2 text-center">{item.is_taxable ? "✅" : "❌"}</td>
                            <td className="py-2 text-center">{item.is_pensionable ? "✅" : "❌"}</td>
                            <td className="py-2 text-gray-500 italic">{item.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ),
          }}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.totalCount || 0,
            onChange: (p, s) => {
              setPage(p);
              setLimit(s);
            },
          }}
          className="custom-table"
        />
      </div>

      <AddPayrollAdjustment
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditData(null);
        }}
        refetch={refetch}
        editData={editData}
      />

      <BulkUploadAdjustments
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        refetch={refetch}
      />

      <GroupRetroAdjustment
        open={retroOpen}
        onClose={() => setRetroOpen(false)}
        refetch={refetch}
      />
      </div>
    </>
  );
};

export default PayrollAdjustments;
