import { useCallback, useEffect, useRef, useState } from "react";
import AddDepartment from "./AddEntity";
import EditEntity from "./EditEntity";
import LoadEntities from "./LoadEntities";
import CustomModal from "../../../utils/CustomModal";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaFile } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi2";
import { HistoryOutlined } from "@ant-design/icons";
import { Pagination, Table } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import {
  useEntityListQuery,
  useEntityDeleteMutation,
} from "../../../redux/features/sections/entityApi";
import AppointDepartmentHead from "./AppointHead";
import EntityEmployeesDrawer from "./EntityEmployeesDrawer";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import Swal from "sweetalert2";
import {
  FaCrown,
  FaSitemap,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";
import { BsBuilding, BsDiagram3 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useSearchParams } from "react-router-dom";

interface EntityTabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  designation: string;
  defaultSortField: string;
}

const ENTITY_TABS: EntityTabConfig[] = [
  {
    id: "CEO Office",
    label: "Executive Office",
    icon: FaCrown,
    description: "Chief Executive and executive leadership structure",
    color: "purple",
    designation: "ceo office",
    defaultSortField: "name",
  },
  {
    id: "Divisions",
    label: "Divisions",
    icon: BsBuilding,
    description: "Major operational divisions and strategic units",
    color: "blue",
    designation: "division",
    defaultSortField: "name",
  },
  {
    id: "Departments",
    label: "Departments",
    icon: HiOutlineOfficeBuilding,
    description: "Functional departments and specialized units",
    color: "green",
    designation: "department",
    defaultSortField: "name",
  },
  {
    id: "Units",
    label: "Operational Units",
    icon: HiOutlineUserGroup,
    description: "Operational units and working groups",
    color: "orange",
    designation: "unit",
    defaultSortField: "name",
  },
];

const Entities = () => {
  PageTitle("Organizational Entities | EPA Ghana");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEntitiesCreateAccess = privileges?.includes("HR_ENTITIES_CREATE");
  const hasAuditLogsAccess = privileges?.includes("SETTINGS_AUDIT_LOGS_VIEW");

  const [add, setAdd] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableRefetch, setTableRefetch] = useState<(() => void) | null>(null);
  const defaultTab = "CEO Office";
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || defaultTab
  );
  const tabContainerRef = useRef(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const scrollTabs = (direction: string) => {
    if (tabContainerRef.current) {
      const scrollAmount = direction === "next" ? 200 : -200;
      tabContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getActiveTabData = useCallback(() => {
    return ENTITY_TABS.find((tab) => tab.id === activeTab) || ENTITY_TABS[0];
  }, [activeTab]);

  const activeTabData = getActiveTabData();



  return (
    <>
      <AddDepartment open={add} onClose={() => setAdd(false)} refetch={tableRefetch || (() => {})} />

      {loadOpen && (
        <CustomModal
          open={loadOpen}
          setOpen={setLoadOpen}
          Component={LoadEntities}
          refetch={tableRefetch || (() => {})}
        />
      )}

      <PageLayout
        title="Departments"
        subtitle="Ghana Sports Fund — organizational structure"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Departments" }]}
        actions={
          hasEntitiesCreateAccess ? (
            <>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-medium rounded-md transition-colors duration-200"
                onClick={() => setAdd(true)}
              >
                <LiaPlusSquareSolid size={16} />
                <span>New Department</span>
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-medium rounded-md transition-colors duration-200"
                onClick={() => setLoadOpen(true)}
              >
                <FaFile size={13} />
                <span>Load</span>
              </button>
            </>
          ) : undefined
        }
      >
        <div>
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollTabs("prev")}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors duration-200"
                aria-label="Scroll tabs left"
              >
                <MdOutlineSkipPrevious size={18} />
              </button>
            </div>

            <div
              ref={tabContainerRef}
              className="flex-1 flex gap-1 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              {ENTITY_TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => scrollTabs("next")}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors duration-200"
                aria-label="Scroll tabs right"
              >
                <MdOutlineSkipNext size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-2.5 bg-gray-50 flex items-center gap-2">
              <BsDiagram3 className="w-3.5 h-3.5 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-700">{activeTabData.label}</h3>
            </div>
            <div className="p-4">
              <EntityTable 
                tabConfig={activeTabData} 
                setTableRefetch={setTableRefetch} 
                hasAuditLogsAccess={hasAuditLogsAccess}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

interface EntityTableProps {
  tabConfig: EntityTabConfig;
  setTableRefetch: (refetch: () => void) => void;
  hasAuditLogsAccess: boolean;
}

const EntityTable: React.FC<EntityTableProps> = ({ tabConfig, setTableRefetch, hasAuditLogsAccess }) => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasEntitiesEditAccess = privileges?.includes("HR_ENTITIES_EDIT");
  const hasEntitiesDeleteAccess = privileges?.includes("HR_ENTITIES_DELETE");

  const [selectHead, setSelectHead] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(tabConfig.defaultSortField);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryEntity, setSelectedHistoryEntity] = useState<any>(null);

  const [deleteEntity, { data: deletedData, isSuccess: isDeletingSuccess, error: deletionError }] =
    useEntityDeleteMutation();

  const { data: entityListData, isLoading, refetch } = useEntityListQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    designation: tabConfig.designation,
  });

  useEffect(() => {
    setTableRefetch(() => refetch);
  }, [refetch, setTableRefetch]);

  useEffect(() => {
    if (isDeletingSuccess) {
      Swal.fire({
        title: deletedData?.message || "Entity deleted successfully",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
      refetch();
    }
    if (deletionError) {
      const errorMessage =
        "data" in deletionError ? (deletionError.data as any)?.error : "Failed to delete entity";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  }, [isDeletingSuccess, deletionError, deletedData, refetch]);

  const handleDelete = useCallback(
    async (entity: any) => {
      const result = await Swal.fire({
        title: "Delete Entity",
        text: `Are you sure you want to delete "${entity.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteEntity(entity._id);
      }
    },
    [deleteEntity]
  );

  const handleSort = (field: string) => {
    setSortOrder(field === sortField ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
    setSortField(field);
  };

  const entities = entityListData?.data?.data || [];
  const totalCount = entityListData?.data?.totalCount || 0;

  return (
    <>
      {selectedEntity && (
        <>
          <EditEntity
            open={edit}
            onClose={() => setEdit(false)}
            itemData={selectedEntity}
            refetch={refetch}
          />
          <AppointDepartmentHead
            open={selectHead}
            onClose={() => setSelectHead(false)}
            itemData={selectedEntity}
            refetch={refetch}
          />
          <EntityEmployeesDrawer
            open={showEmployees}
            onClose={() => setShowEmployees(false)}
            selectedEntity={selectedEntity}
          />
        </>
      )}

      {selectedHistoryEntity && (
        <RecordHistoryDrawer
          open={showHistory}
          onClose={() => setShowHistory(false)}
          modelName="Entity"
          recordId={selectedHistoryEntity._id}
          recordName={selectedHistoryEntity.name}
        />
      )}

      <div className="space-y-3">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-gray-700 font-medium">Show</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-gray-400 transition"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <label className="text-xs sm:text-sm text-gray-700 font-medium hidden sm:inline">entries</label>
          </div>

          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-gray-400 transition"
            />
            <AiOutlineSearch className="absolute right-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper bg-white rounded-sm">
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
              ...(tabConfig.id !== "CEO Office" ? [{
                title: "Reporting Entity",
                dataIndex: "reporting_entity_name",
                key: "reporting_entity_name",
                sorter: true,
                render: (text: string) => text || "—",
                onHeaderCell: () => ({
                  onClick: () => handleSort("reporting_entity_name"),
                  style: { cursor: "pointer" },
                }),
              }] : []),
              {
                title: "Branch Code",
                dataIndex: "branch_code",
                key: "branch_code",
                sorter: true,
                render: (text: string) => text || "—",
                onHeaderCell: () => ({
                  onClick: () => handleSort("branch_code"),
                  style: { cursor: "pointer" },
                }),
              },
              {
                title: "Location Type",
                dataIndex: "officeLocation",
                key: "officeLocation",
                render: (text: string) => {
                  if (!text) return <span className="text-gray-300">—</span>;
                  const colorMap: Record<string, string> = {
                    headquarters: "bg-purple-100 text-purple-700",
                    region: "bg-blue-100 text-blue-700",
                    district: "bg-orange-100 text-orange-700",
                    area: "bg-green-100 text-green-700",
                  };
                  const labelMap: Record<string, string> = {
                    headquarters: "Head Quarters",
                    region: "Region",
                    district: "District",
                    area: "Area",
                  };
                  return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${colorMap[text] || "bg-gray-100 text-gray-600"}`}>
                      {labelMap[text] || text}
                    </span>
                  );
                },
              },
              {
                title: "Head",
                dataIndex: "current_head_name",
                key: "current_head_name",
                sorter: true,
                render: (text: string) => text || "—",
                onHeaderCell: () => ({
                  onClick: () => handleSort("current_head_name"),
                  style: { cursor: "pointer" },
                }),
              },
              {
                title: "Staff",
                key: "staff",
                width: 100,
                align: "center" as const,
                render: (_text, record: any) => (
                  <button
                    onClick={() => {
                      setSelectedEntity(record);
                      setShowEmployees(true);
                    }}
                    className="inline-flex items-center justify-center px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors duration-200"
                  >
                    View
                  </button>
                ),
              },
              {
                title: "Actions",
                key: "action",
                width: 150,
                align: "center" as const,
                render: (_text, record) => (
                  <div className="flex items-center justify-center gap-1">
                    {hasEntitiesEditAccess && (
                      <>
                        <div className="relative group">
                          <button
                            onClick={() => {
                              setSelectedEntity(record);
                              setEdit(true);
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                            aria-label="Edit entity"
                          >
                            <FaEdit size={14} />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Edit
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => {
                              setSelectedEntity(record);
                              setSelectHead(true);
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors duration-200"
                            aria-label="Assign head"
                          >
                            <HiUserGroup size={14} />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Assign Head
                          </span>
                        </div>
                      </>
                    )}
                    {hasAuditLogsAccess && (
                      <div className="relative group">
                        <button
                          onClick={() => {
                            setSelectedHistoryEntity(record);
                            setShowHistory(true);
                          }}
                          className="inline-flex items-center justify-center p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors duration-200"
                          aria-label="View history"
                        >
                          <HistoryOutlined size={14} />
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          History
                        </span>
                      </div>
                    )}
                    {hasEntitiesDeleteAccess && (
                      <div className="relative group">
                        <button
                          onClick={() => handleDelete(record)}
                          className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                          aria-label="Delete entity"
                        >
                          <AiFillDelete size={14} />
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Delete
                        </span>
                      </div>
                    )}
                  </div>
                ),
              },
            ].filter((col: any) => {
              if (col.key === "action") {
                return hasEntitiesEditAccess || hasEntitiesDeleteAccess;
              }
              return true;
            }) as any[]}
            dataSource={entities}
            rowKey="_id"
            loading={isLoading}
            pagination={false}
            size="small"
            locale={{ emptyText: "No entities found" }}
            scroll={{ x: 900, y: "60vh" }}
          />
        </div>

        {/* Pagination */}
        {entities.length > 0 && (
          <div className="flex justify-end pt-1">
            <Pagination
              current={page}
              pageSize={limit}
              total={totalCount}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </>
  );
};


export default Entities;
