import { Drawer, Table, Input } from "antd";
import { useEmployeeListByEntityQuery } from "../../../redux/features/sections/entityApi";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Staff {
  _id: string;
  staff_id: string;
  lastname: string;
  firstname: string;
  other_names: string;
  grade_name?: string;
}

interface EntityEmployeesDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedEntity: {
    _id: string;
    name: string;
  } | null;
}

const EntityEmployeesDrawer = ({
  open,
  onClose,
  selectedEntity,
}: EntityEmployeesDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employeeList, isLoading } = useEmployeeListByEntityQuery(
    {
      entityId: selectedEntity?._id,
      searchQuery: searchTerm,
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
      render: (_: unknown, __: unknown, index: number) => index + 1,
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
        <span className="capitalize">
          {record.lastname} {record.firstname} {record.other_names}
        </span>
      ),
    },
    {
      title: "Rank",
      dataIndex: "grade_name",
      key: "grade_name",
      render: (text: string) => text || "—",
    },
  ];

  return (
    <Drawer
      title={`Staff - ${selectedEntity?.name || ""}`}
      onClose={onClose}
      open={open}
      width={700}
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<AiOutlineSearch className="text-gray-400" />}
            className="w-full"
            allowClear
          />
        </div>

        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={employeeList?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={false}
            size="small"
            locale={{ emptyText: "No staff found for this entity" }}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default EntityEmployeesDrawer;
