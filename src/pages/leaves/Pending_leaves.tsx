import { useState } from "react";
import { Table, Tag, Tooltip, Button, Space, Avatar, Typography } from "antd";
import { usePendingLeavesQuery } from "../../redux/features/users/leaveApi";
import { 
  CheckCircle, 
  User, 
  Calendar, 
  MessageSquare,
  Eye
} from "lucide-react";
import EditLeave from "./EditLeave";
import LeaveDetailsDrawer from "@/components/leave/LeaveDetailsDrawer";
import { formatDate2 } from "@/utils/helperFunction";

const { Text, Title } = Typography;

const Pending_leaves = () => {
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [leave, setLeave] = useState<any>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);

  const {
    data: pendingList,
    isLoading: pendingLoading,
    refetch,
  } = usePendingLeavesQuery({ page, limit });

  const handleEditPopUp = (leave: any) => {
    setLeave(leave);
    setEdit(true);
  };

  const handleViewDetails = (record: any) => {
    setLeave(record);
    setViewDrawerOpen(true);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: any) => (
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
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.leave_name}</Text>
          <Space size={4}>
            <Calendar size={12} className="text-gray-400" />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.duration} {record.duration === 1 ? 'day' : 'days'} ({record.type === "paid" ? "Paid" : "Unpaid"})
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Period',
      key: 'period',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text>{formatDate2(record.start_date)}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            to {formatDate2(record.end_date)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Applied On',
      key: 'applied_on',
      render: (_: any, record: any) => (
        <Text style={{ fontSize: '13px' }}>
          {formatDate2(record.createdAt)}
        </Text>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
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
      align: 'right' as const,
      render: (_: any, record: any) => (
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
    <>
      <LeaveDetailsDrawer 
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        data={leave}
      />
      <EditLeave
        open={edit}
        setOpen={setEdit}
        itemData={leave}
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
        dataSource={pendingList?.data?.pending_leaves || []}
        loading={pendingLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: pendingList?.data?.totalCount || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize || 25);
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50", "100"],
        }}
        rowKey={(record) => record._id || record.id}
        scroll={{ x: 800 }}
      />
    </>
  );
};

export default Pending_leaves;
