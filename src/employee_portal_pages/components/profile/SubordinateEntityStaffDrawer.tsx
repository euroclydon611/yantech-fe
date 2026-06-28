import { Drawer, Table, Input, Tag } from "antd";
import { useEntitySubordinateStaffsQuery } from "../../../redux/features/employee-portal-api/entityApi";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Staff {
  _id: string;
  staff_id: string;
  lastname: string;
  firstname: string;
  other_names: string;
  email?: string;
  is_head?: boolean;
  grade?: string;
  entity_name?: string;
}

interface SubordinateEntityStaffDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedEntity: {
    _id: string;
    name: string;
  } | null;
}

const SubordinateEntityStaffDrawer = ({
  open,
  onClose,
  selectedEntity,
}: SubordinateEntityStaffDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data: employeeListData, isLoading } = useEntitySubordinateStaffsQuery(
    {
      entity_id: selectedEntity?._id,
      searchTerm: searchTerm,
      page,
      limit,
    },
    {
      skip: !selectedEntity?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  const columns = [
    {
      title: "No",
      key: "no",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (page - 1) * limit + index + 1,
    },
    {
      title: "Staff ID",
      dataIndex: "staff_id",
      key: "staff_id",
      width: 100,
    },
    {
      title: "Name",
      key: "name",
      render: (record: Staff) => (
        <div className="flex flex-col">
          <span className="capitalize font-medium">
            {record.lastname} {record.firstname} {record.other_names}
            {record.is_head && (
              <Tag color="gold" className="ml-2 text-[10px] leading-tight py-0">
                HEAD
              </Tag>
            )}
          </span>
          <span className="text-xs text-gray-400">{record.email || "—"}</span>
        </div>
      ),
    },
    {
      title: "Rank",
      dataIndex: "grade",
      key: "grade",
      render: (text: string) => text || "—",
    },
    {
      title: "Entity/Unit",
      dataIndex: "entity_name",
      key: "entity_name",
      render: (text: string) => text || "—",
    },
  ];

  const totalCount = employeeListData?.pagination?.total || 0;

  return (
    <Drawer
      title={`Staff - ${selectedEntity?.name || ""}`}
      onClose={onClose}
      open={open}
      width={900}
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
            }}
            prefix={<AiOutlineSearch className="text-gray-400" />}
            className="w-full"
            allowClear
          />
        </div>

        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={employeeListData?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={totalCount > limit ? {
                current: page,
                pageSize: limit,
                total: totalCount,
                onChange: (page, pageSize) => {
                    setPage(page);
                    setLimit(pageSize);
                }
            } : false}
            size="small"
            locale={{ emptyText: "No staff found for this entity" }}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default SubordinateEntityStaffDrawer;
