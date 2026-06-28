import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Employee } from "../../types/employee";
import {
  PlusCircle,
  Edit,
  Calendar,
  Clock,
  CheckSquare,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  useLeaveListQuery,
  useLeaveRequestMutation,
  useUpdateRequestMutation,
} from "../../../redux/features/employee-portal-api/leaveApi";
import { LeaveApplication } from "../../types/employee";
import Swal from "sweetalert2";
import { formatDate2 } from "@/utils/helperFunction";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface LeaveSectionProps {
  employee: Employee;
}

const leaveTypes = [
  { value: "Annual Leave", label: "Annual Leave" },
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Maternity Leave", label: "Maternity Leave" },
  { value: "Paternity Leave", label: "Paternity Leave" },
  { value: "Study Leave", label: "Study Leave" },
  { value: "Compassionate Leave", label: "Compassionate Leave" },
];

export default function LeaveSection({ employee }: LeaveSectionProps) {
  const [page] = useState(1);
  const [limit] = useState(25);
  const [open, setOpen] = useState(false);
  const [leave, setLeave] = useState<LeaveApplication | null>(null);
  const [form] = Form.useForm();

  const {
    data: leaveData,
    isLoading: isLoadingLeaves,
    refetch,
  } = useLeaveListQuery(
    { page, limit },
    {
      refetchOnReconnect: true,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const leaves = leaveData?.data.leaves || [];

  const leaveUsedThisYear = leaves
    .filter(
      (leave: LeaveApplication) =>
        leave.status === "approved" &&
        dayjs(leave.start_date).year() === dayjs().year()
    )
    .reduce(
      (total: number, leave: LeaveApplication) => total + leave.duration,
      0
    );

  const [leaveApplicationMutation, { isSuccess, isLoading, error }] =
    useLeaveRequestMutation();

  const [
    updateLeaveRequest,
    { isSuccess: updated, isLoading: updating, error: updateError },
  ] = useUpdateRequestMutation();

  useEffect(() => {
    if (leave) {
      form.setFieldsValue({
        leave_type: leave?.leave_name || "",
        date_range: [
          leave?.start_date ? dayjs(leave.start_date) : dayjs(),
          leave?.end_date ? dayjs(leave.end_date) : dayjs(),
        ],
        duration: leave?.duration || 1,
        reason: leave?.reason || "",
      });
      setOpen(true);
    } else {
      form.resetFields();
      form.setFieldsValue({
        date_range: [dayjs(), dayjs()],
        duration: 1,
      });
    }
  }, [leave, form]);

  const calculateDuration = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) return 0;
    const start = dates[0];
    const end = dates[1];
    return end.diff(start, "day") + 1;
  };

  const handleDateChange = (dates: any) => {
    if (dates) {
      form.setFieldsValue({
        duration: calculateDuration(dates),
      });
    }
  };

  const onSubmit = (values: any) => {
    const [start, end] = values.date_range;
    const payload = {
      reason: values.reason,
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
      name: values.leave_type,
    };

    Swal.fire({
      title: leave ? "Update Leave Application?" : "Submit Leave Application?",
      text: "Please confirm that the details provided are correct before proceeding.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: leave ? "Yes, update it!" : "Yes, submit it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        if (leave) {
          updateLeaveRequest({
            ...payload,
            leave_id: leave?.id,
          });
        } else {
          leaveApplicationMutation(payload);
        }
      }
    });
  };

  useEffect(() => {
    if (isSuccess || updated) {
      Swal.fire({
        title: "Success",
        text: "Your leave application has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#15803d",
      });
      setOpen(false);
      setLeave(null);
      refetch();
    }
    if (error || updateError) {
      const err: any = error || updateError;
      Swal.fire({
        title: "Failed to Submit",
        text:
          err?.data?.error || "An unexpected error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  }, [isSuccess, updated, error, updateError, refetch]);

  const columns: ColumnsType<any> = [
    {
      title: "Leave Type",
      dataIndex: "leave_name",
      key: "leave_name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (days) => (
        <Text>
          {days} {days === 1 ? "day" : "days"}
        </Text>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{formatDate2(record.start_date)}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            to {formatDate2(record.end_date)}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gold";
        let icon = <Clock className="h-3 w-3" />;

        if (status === "approved") {
          color = "success";
          icon = <CheckCircle className="h-3 w-3" />;
        }
        if (status === "rejected") {
          color = "error";
          icon = <XCircle className="h-3 w-3" />;
        }

        return (
          <Tag color={color} className="font-bold py-1 px-3 rounded-md">
            <div className="flex items-center gap-1.5 capitalize">
              {icon}
              <span>{status}</span>
            </div>
          </Tag>
        );
      },
    },
    {
      title: "Notes",
      key: "notes",
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ maxWidth: "200px" }}>
          {record.reason ? (
            <Tooltip title={record.reason}>
              <Text ellipsis>{record.reason}</Text>
            </Tooltip>
          ) : (
            <Text type="secondary" italic style={{ fontSize: "12px" }}>
              No reason provided
            </Text>
          )}
          {record.decision_note && (
            <Text
              style={{ fontSize: "12px", color: "#1677ff" }}
              ellipsis
              title={record.decision_note}
            >
              Note: {record.decision_note}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) =>
        record.status === "pending" && (
          <Button
            type="text"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => setLeave(record)}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
          >
            Edit
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="borderless" className="shadow-sm rounded-xl">
          <Space size="large">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <Text
                type="secondary"
                className="uppercase tracking-wider text-xs font-medium"
              >
                Annual Entitlement
              </Text>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {employee.allowable_leave_days}{" "}
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", fontWeight: "normal" }}
                  >
                    days
                  </Text>
                </Title>
              </div>
            </div>
          </Space>
        </Card>

        <Card variant="borderless" className="shadow-sm rounded-xl">
          <Space size="large">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <Text
                type="secondary"
                className="uppercase tracking-wider text-xs font-medium"
              >
                Remaining Balance
              </Text>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {employee.remaining_leave_days}{" "}
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", fontWeight: "normal" }}
                  >
                    days
                  </Text>
                </Title>
              </div>
            </div>
          </Space>
        </Card>

        <Card variant="borderless" className="shadow-sm rounded-xl">
          <Space size="large">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <Text
                type="secondary"
                className="uppercase tracking-wider text-xs font-medium"
              >
                Used This Year
              </Text>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {leaveUsedThisYear}{" "}
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", fontWeight: "normal" }}
                  >
                    days
                  </Text>
                </Title>
              </div>
            </div>
          </Space>
        </Card>
      </div>

      <Card
        variant="borderless"
        className="shadow-sm rounded-xl overflow-hidden"
        title={
          <div className="flex items-center gap-2">
            <Title level={4} style={{ margin: 0 }}>
              Leave History
            </Title>
            <Tag color="default">
              {leaves.length}{" "}
              {leaves.length === 1 ? "Application" : "Applications"}
            </Tag>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusCircle className="mr-1 h-4 w-4" />}
            onClick={() => {
              setLeave(null);
              setOpen(true);
            }}
            className="flex items-center bg-green-700 hover:!bg-green-800"
          >
            Apply for Leave
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={leaves}
          rowKey="id"
          loading={isLoadingLeaves}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          className="custom-table"
        />
      </Card>

      <Drawer
        title={
          <Title level={4} style={{ margin: 0 }}>
            {leave ? "Edit Leave Application" : "Apply for Leave"}
          </Title>
        }
        placement="right"
        onClose={() => {
          setOpen(false);
          setLeave(null);
        }}
        open={open}
        width={window.innerWidth > 768 ? 450 : "100%"}
        footer={
          <Space className="w-full justify-end p-2">
            <Button
              onClick={() => {
                setOpen(false);
                setLeave(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={isLoading || updating}
              onClick={() => form.submit()}
              className="bg-green-700 hover:!bg-green-800"
            >
              {leave ? "Update Application" : "Submit Application"}
            </Button>
          </Space>
        }
      >
        <div className="mb-6">
          <Text type="secondary">
            Fill in the details below to submit your leave application.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="leave_type"
            label="Leave Type"
            rules={[{ required: true, message: "Please select leave type" }]}
          >
            <Select
              placeholder="Select leave type"
              options={leaveTypes}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="date_range"
            label="Leave Period"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <DatePicker.RangePicker
              className="w-full"
              size="large"
              onChange={handleDateChange}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item name="duration" label="Duration (days)">
            <Input size="large" readOnly suffix="Days" />
          </Form.Item>

          <Form.Item name="reason" label="Reason (optional)">
            <TextArea
              placeholder="Enter reason for leave"
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
