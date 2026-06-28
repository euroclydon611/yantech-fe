import { useState } from "react";
import { Table, Tag, Space, Avatar, Typography, Tooltip, Button } from "antd";
import { useApprovedLeavesQuery } from "../../redux/features/users/leaveApi";
import { 
  User, 
  Calendar, 
  MessageSquare,
  Eye
} from "lucide-react";
import LeaveDetailsDrawer from "@/components/leave/LeaveDetailsDrawer";
import { formatDate2 } from "@/utils/helperFunction";

const { Text, Title } = Typography;

const Approved_leaves = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: approvedList,
    isLoading: approvedLoading,
  } = useApprovedLeavesQuery({ limit, page });

  const handleViewDetails = (record: any) => {
    setSelectedLeave(record);
    setDrawerOpen(true);
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
            style={{ backgroundColor: '#52c41a' }} 
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
              {record.duration} {record.duration === 1 ? 'day' : 'days'}
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
          <Tag color="success" className="font-bold py-0.5 px-2 rounded-md m-0">
            Approved
          </Tag>
        </Space>
      ),
    },
  ];

  return (
    <>
      <LeaveDetailsDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedLeave}
      />
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Approved Applications
            {approvedList?.data?.totalCount > 0 && (
              <Tag color="success" className="rounded-full font-bold">
                {approvedList?.data?.totalCount}
              </Tag>
            )}
          </Title>
          <Text type="secondary">History of all approved leave requests.</Text>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={approvedList?.data?.approved_leaves || []}
        loading={approvedLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: approvedList?.data?.totalCount || 0,
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

export default Approved_leaves;
