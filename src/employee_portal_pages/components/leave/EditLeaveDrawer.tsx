import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Checkbox, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Alert
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLeaveDecisionMutation } from "../../../redux/features/employee-portal-api/leaveApi";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { 
  Calendar, 
  CheckCircle, 
  Info,
  User,
  Clock
} from "lucide-react";

const { TextArea } = Input;
const { Text, Title } = Typography;

const schema = Yup.object().shape({
  start_date: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .required("Start date is required"),
  end_date: Yup.date()
    .nullable()
    .min(Yup.ref("start_date"), "End date cannot be earlier than the start date")
    .typeError("Invalid date format")
    .required("End date is required"),
  status: Yup.string().required("Status is required"),
});

const EditLeaveDrawer = ({ open, setOpen, itemData, refetch }: any) => {
  const [leaveDecision, { data, isSuccess, isLoading, error }] =
    useLeaveDecisionMutation();

  const formik = useFormik({
    initialValues: {
      leave_name: (itemData?.leave_name || itemData?.leave_type) as string,
      start_date: itemData?.start_date ? dayjs(itemData.start_date) : null,
      end_date: itemData?.end_date ? dayjs(itemData.end_date) : null,
      notes: itemData?.reason as string,
      type: (itemData?.type || "paid") as string,
      status: (itemData?.status || "pending") as string,
      reduction: true,
      decision_note: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Confirm Decision",
        text: `Are you sure you want to ${values.status} this leave request?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: values.status === "approve" ? "#15803d" : values.status === "reject" ? "#dc2626" : "#15803d",
        cancelButtonColor: "#64748b",
        confirmButtonText: `Yes, ${values.status}`,
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        const leavePayload: any = {
          leave_id: itemData?._id,
          type: values.type,
          decision_note: values.decision_note,
          start: values.start_date?.format("YYYY-MM-DD"),
          end: values.end_date?.format("YYYY-MM-DD"),
          status: values.status,
        };

        if (values.status === "approve") {
          leavePayload.reduction = values.reduction;
        }

        await leaveDecision(leavePayload);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Action completed successfully";
      Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
        timer: 3000,
        confirmButtonColor: "#10b981",
      }).then(() => {
        refetch();
        setOpen(false);
      });
    }
    if (error) {
      const errorData = error as any;
      Swal.fire({
        title: "Error",
        text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  }, [isSuccess, error, data, refetch, setOpen]);

  const { errors, touched, values, setFieldValue, handleSubmit } = formik;

  return (
    <Drawer
      title={
        <Space>
          <Clock size={18} className="text-blue-500" />
          <Title level={4} style={{ margin: 0 }}>Review Leave Request</Title>
        </Space>
      }
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
      width={500}
      footer={
        <div className="flex justify-end gap-2 p-2">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            type="primary" 
            onClick={() => handleSubmit()} 
            loading={isLoading}
            className="bg-green-700 hover:!bg-green-800"
          >
            Submit Decision
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <section>
          <Title level={5} className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-400" />
            Employee Information
          </Title>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <Text type="secondary" className="block text-xs uppercase font-semibold">Staff ID</Text>
              <Text strong>{itemData?.staff_id}</Text>
            </div>
            <div>
              <Text type="secondary" className="block text-xs uppercase font-semibold">Employee</Text>
              <Text strong className="text-blue-600">{itemData?.firstname} {itemData?.lastname}</Text>
            </div>
            <div className="mt-2">
              <Text type="secondary" className="block text-xs uppercase font-semibold">Remaining Days</Text>
              <Text strong className="text-green-600">{itemData?.remaining_leave_days || 0} Days</Text>
            </div>
          </div>
        </section>

        <Divider style={{ margin: '12px 0' }} />

        <section>
          <Title level={5} className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-gray-400" />
            Leave Details
          </Title>
          
          <Form layout="vertical">
            <Form.Item label="Leave Category">
              <Select
                value={values.leave_name}
                disabled
                className="w-full"
                options={[
                  { value: "Annual Leave", label: "Annual Leave" },
                  { value: "Sick Leave", label: "Sick Leave" },
                  { value: "Casual Leave", label: "Casual Leave" },
                  { value: "Compensation Off", label: "Compensation Off" },
                  { value: "Earned Leave", label: "Earned Leave" },
                  { value: "Offsite", label: "Offsite" },
                ]}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item 
                label="From" 
                required 
                validateStatus={errors.start_date && touched.start_date ? "error" : ""}
                help={touched.start_date && (errors.start_date as string)}
              >
                <DatePicker 
                  className="w-full" 
                  value={values.start_date}
                  onChange={(date) => setFieldValue("start_date", date)}
                  format="MMM D, YYYY"
                />
              </Form.Item>
              <Form.Item 
                label="To" 
                required 
                validateStatus={errors.end_date && touched.end_date ? "error" : ""}
                help={touched.end_date && (errors.end_date as string)}
              >
                <DatePicker 
                  className="w-full" 
                  value={values.end_date}
                  onChange={(date) => setFieldValue("end_date", date)}
                  format="MMM D, YYYY"
                />
              </Form.Item>
            </div>

            <Form.Item label="Employee Reason">
              <Alert
                message={values.notes || "No reason provided"}
                type="info"
                icon={<Info size={16} />}
                showIcon
                className="bg-blue-50 border-blue-100"
              />
            </Form.Item>

            <Form.Item label="Payment Type">
              <Select
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                options={[
                  { value: "paid", label: "Paid Leave" },
                  { value: "unpaid", label: "Unpaid Leave" },
                ]}
              />
            </Form.Item>
          </Form>
        </section>

        <Divider style={{ margin: '12px 0' }} />

        <section className="bg-orange-50/30 p-4 rounded-lg border border-orange-100">
          <Title level={5} className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-orange-500" />
            Decision
          </Title>

          <Form layout="vertical">
            <Form.Item 
              label="Action" 
              required
              validateStatus={errors.status && touched.status ? "error" : ""}
              help={touched.status && (errors.status as string)}
            >
              <Select
                value={values.status}
                onChange={(value) => setFieldValue("status", value)}
                options={[
                  { value: "pending", label: "Keep Pending" },
                  { value: "approve", label: "Approve" },
                  { value: "reject", label: "Reject" },
                ]}
              />
            </Form.Item>

            {values.status === "approve" && (
              <Form.Item>
                <Checkbox
                  checked={values.reduction}
                  onChange={(e) => setFieldValue("reduction", e.target.checked)}
                >
                  Deduct from remaining leave balance
                </Checkbox>
              </Form.Item>
            )}

            <Form.Item label="Decision Note">
              <TextArea
                rows={4}
                value={values.decision_note}
                onChange={(e) => setFieldValue("decision_note", e.target.value)}
                placeholder="Add comments regarding your decision..."
              />
            </Form.Item>
          </Form>
        </section>
      </div>
    </Drawer>
  );
};

export default EditLeaveDrawer;
