import { useState } from "react";
import { Table, Tag, Button, Spin, Empty, Pagination } from "antd";
import { Eye } from "lucide-react";
import { useEntityReporteesQuery } from "../../../redux/features/employee-portal-api/entityApi";
import { Employee } from "../../types/employee";
import SubordinateEntityStaffDrawer from "./SubordinateEntityStaffDrawer";

interface SubordinateEntitiesProps {
  employee: Employee;
}

export default function SubordinateEntities({ employee }: SubordinateEntitiesProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm] = useState("");
  const [sortField] = useState("name");
  const [sortOrder] = useState("asc");

  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showStaff, setShowStaff] = useState(false);

  const { data, isLoading } = useEntityReporteesQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
    entity_id: (employee as any)?.entity_id || (typeof employee?.entity === 'object' ? (employee?.entity as any)?._id : employee?.entity),
  });

  const isHR = employee?.permissions?.includes('payroll_validation') || employee?.department?.toLowerCase()?.includes('human resource') || employee?.department?.toLowerCase()?.includes('hr');
  
  if (!employee.is_head && !isHR) {
    return null;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text: string) => <span className="text-gray-500 capitalize">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<Eye size={16} />}
          onClick={() => {
            setSelectedEntity(record);
            setShowStaff(true);
          }}
          className="flex items-center text-green-700 hover:text-green-800"
        >
          View Staff
        </Button>
      ),
    },
  ];

  const entities = (data as any)?.data || [];
  const totalCount = (data as any)?.totalCount ?? 0;

  return (
    <>
      <SubordinateEntityStaffDrawer
        open={showStaff}
        onClose={() => setShowStaff(false)}
        selectedEntity={selectedEntity}
      />

      <div className="flex-1 overflow-auto px-0 pt-0 pb-0 bg-white">
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={entities}
            rowKey={(record: any) => record.id || record._id}
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
            className="reporting-entities-table"
            onRow={(record) => ({
              onClick: () => { setSelectedEntity(record); setShowStaff(true); },
              style: { cursor: "pointer" },
            })}
            locale={{
              emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                  <p className="text-gray-500 text-sm py-4">No reporting entities found.</p>
                } />
              ),
            }}
          />
        </Spin>
      </div>

      {totalCount > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            Showing {Math.min((page - 1) * limit + 1, totalCount)}–{Math.min(page * limit, totalCount)} of {totalCount} {totalCount === 1 ? "entity" : "entities"}
          </span>
          {totalCount > limit && (
            <Pagination
              current={page}
              pageSize={limit}
              total={totalCount}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger
              size="small"
              className="reporting-entities-pagination"
            />
          )}
        </div>
      )}

      <style>{`
        .reporting-entities-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; }
        .reporting-entities-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .reporting-entities-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .reporting-entities-table .ant-table-body { overflow-y: auto !important; }
        .reporting-entities-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .reporting-entities-pagination .ant-pagination-item-active a { color: #fff; }
      `}</style>
    </>
  );
}
