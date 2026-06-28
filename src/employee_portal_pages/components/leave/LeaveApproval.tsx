import { useState } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Typography, 
  Tooltip, 
  Empty
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Employee, EmployeeLeaveApproval } from "../../types/employee";
import dayjs from "dayjs";
import { 
  CheckCircle, 
  User, 
  Calendar, 
  MessageSquare,
  Eye
} from "lucide-react";

import {
  usePendingLeavesQuery,
} from "../../../redux/features/employee-portal-api/leaveApi";
import LeaveDetailsDrawer from "@/components/leave/LeaveDetailsDrawer";
import EditLeaveDrawer from "./EditLeaveDrawer";

const { Text, Title } = Typography;

interface LeaveApprovalProps {
  employee: Employee;
}

export default function LeaveApproval({ employee }: LeaveApprovalProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [selectedLeave, setSelectedLeave] = useState<EmployeeLeaveApproval | null>(null);
  const [edit, setEdit] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);

  const handleViewDetails = (record: EmployeeLeaveApproval) => {
    setSelectedLeave(record);
    setViewDrawerOpen(true);
  };

  const handleEditPopUp = (leave: EmployeeLeaveApproval) => {
    setSelectedLeave(leave);
    setEdit(true);
  };

  const {
    data: pendingList,
    isLoading: pendingLoading,
    refetch,
  } = usePendingLeavesQuery({ page, limit }, {
    refetchOnReconnect: true,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const pendingLeaves = pendingList?.data?.pending_leaves || [];

  if (!employee.is_head) {
    return null;
  }

  const columns: ColumnsType<EmployeeLeaveApproval> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: '#1890ff' }} 
            icon={!(record.firstname && record.lastname) && <User size={14} />}
          >
            {record.firstname?.[0]}{record.lastname?.[0]}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.firstname} {record.lastname}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.staff_id}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Leave Details',
      key: 'details',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.leave_name || record.leave_type}</Text>
          <Space size={4}>
            <Calendar size={12} className="text-gray-400" />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.duration} {record.duration === 1 ? 'day' : 'days'}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Period',
      key: 'period',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(record.start_date).format("MMM D, YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            to {dayjs(record.end_date).format("MMM D, YYYY")}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Applied On',
      key: 'applied_on',
      render: (_, record) => (
        <Text style={{ fontSize: '13px' }}>
          {dayjs(record.created_at || (record as any).createdAt).format("MMM D, YYYY")}
        </Text>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => (
        <div className="flex items-start gap-2 max-w-[250px]">
          <MessageSquare size={14} className="text-gray-300 mt-1 shrink-0" />
          {reason ? (
            <Tooltip title={reason}>
              <Text ellipsis style={{ maxWidth: '200px' }}>{reason}</Text>
            </Tooltip>
          ) : (
            <Text type="secondary" italic>No reason provided</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="default" 
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewDetails(record)}
            className="flex items-center gap-1"
          >
            View
          </Button>
          <Button 
            type="primary" 
            size="small"
            icon={<CheckCircle size={14} />}
            onClick={() => handleEditPopUp(record)}
            className="bg-green-500 border-green-700 hover:!bg-green-800 flex items-center gap-1"
          >
            Action
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <LeaveDetailsDrawer 
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        data={selectedLeave}
      />
      <EditLeaveDrawer
        open={edit}
        setOpen={setEdit}
        itemData={selectedLeave}
        refetch={refetch}
      />
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Pending Approvals
            {pendingList?.data?.totalCount > 0 && (
              <Tag color="warning" className="rounded-full font-bold animate-pulse">
                {pendingList?.data?.totalCount}
              </Tag>
            )}
          </Title>
          <Text type="secondary">Review and take action on leave requests from your team members.</Text>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={pendingLeaves} 
        rowKey="_id"
        loading={pendingLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: pendingList?.data?.totalCount || 0,
          onChange: (page, pageSize) => {
            setPage(page);
          },
        }}
        locale={{
          emptyText: <Empty description="All caught up! No pending requests." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
