import { useState } from "react";
import {
  Badge,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Swal from "sweetalert2";
import { useEntityStaffsQuery } from "@/redux/features/employee-portal-api/entityApi";
import {
  useGetIncomingDelegationsQuery,
  useAssignDelegatedTaskMutation,
  useCompleteDelegatedTaskMutation,
} from "@/redux/features/employee-portal-api/application/assignment";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ViewApplicationDetail from "@/employee_portal_pages/components/assignment-plan/application-review";

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Option } = Select;

const STATUS_COLORS: Record<string, string> = {
  pending: "orange",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
};

interface DelegatedTasksTabProps {
  statusFilter?: string;
}

const DelegatedTasksTab = ({ statusFilter = "all" }: DelegatedTasksTabProps) => {
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  const [status, setStatus] = useState(statusFilter);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAppId, setViewAppId] = useState<string>("");
  const [viewAppType, setViewAppType] = useState<string>("permit");

  const [assignForm] = Form.useForm();
  const [completeForm] = Form.useForm();

  const { data, isLoading, isFetching, refetch } = useGetIncomingDelegationsQuery({ status, page: 1, limit: 50 }, { refetchOnMountOrArgChange: true });
  const [assignDelegatedTask, { isLoading: isAssigning }] = useAssignDelegatedTaskMutation();
  const [completeDelegatedTask, { isLoading: isCompleting }] = useCompleteDelegatedTaskMutation();

  const { data: staffData } = useEntityStaffsQuery(
    {
      page: 1,
      limit: 500,
      searchTerm: "",
      sortField: "firstname",
      sortOrder: "asc",
      entity_id: (employee as any)?.entity?._id || (employee as any)?.entity_id,
    },
    { skip: !employee }
  );
  const staffMembers = (staffData?.data || []).filter(
    (m: any) => m?.status?.toLowerCase() === "active" || m?.is_active === true
  );

  const delegationItems: any[] = (data?.data || [])
    .flatMap((assignment: any) =>
      (assignment.delegations || []).map((d: any) => ({
        ...d,
        assignment,
      }))
    )
    .filter((d: any) => status === "all" || d.status === status)
    .sort((a: any, b: any) =>
      dayjs(b.requestedAt).valueOf() - dayjs(a.requestedAt).valueOf()
    );

  const openViewApp = (assignment: any) => {
    const app = assignment?.application;
    if (!app?._id) return;
    const type = assignment?.applicationType;
    const mapped =
      type === "AuthorizationApplication" ? "authorization"
      : type === "LicenseApplication" ? "license"
      : type === "EfficacyTrial" ? "efficacy-trial"
      : "permit";
    setViewAppId(app._id);
    setViewAppType(mapped);
    setViewModalOpen(true);
  };

  const handleOpenAssign = (delegation: any, assignment: any) => {
    setSelectedDelegation(delegation);
    setSelectedAssignment(assignment);
    assignForm.resetFields();
    setAssignModalOpen(true);
  };

  const handleOpenComplete = (delegation: any, assignment: any) => {
    setSelectedDelegation(delegation);
    setSelectedAssignment(assignment);
    completeForm.resetFields();
    setFileList([]);
    setCompleteModalOpen(true);
  };

  const handleAssign = async () => {
    try {
      const values = await assignForm.validateFields();
      await assignDelegatedTask({
        assignmentId: selectedAssignment._id,
        delegationId: selectedDelegation._id,
        assignedTo: values.assignedTo,
        notes: values.notes,
      }).unwrap();
      message.success("Task assigned successfully");
      setAssignModalOpen(false);
      refetch();
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err?.data?.error || "Failed to assign", icon: "error" });
    }
  };

  const handleComplete = async () => {
    try {
      const values = await completeForm.validateFields();
      const formData = new FormData();
      formData.append("result", values.result || "");
      fileList.forEach((f) => {
        if (f.originFileObj) formData.append("attachments", f.originFileObj);
      });

      await completeDelegatedTask({
        assignmentId: selectedAssignment._id,
        delegationId: selectedDelegation._id,
        formData,
      }).unwrap();

      message.success("Task completed. The requesting office has been notified.");
      setCompleteModalOpen(false);
      refetch();
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err?.data?.error || "Failed to complete", icon: "error" });
    }
  };

  const getApplicationLabel = (assignment: any) => {
    const app = assignment?.application;
    return app?.code || app?.title || assignment?.applicationType || "Application";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Filter:</span>
          {["all", "pending", "in_progress", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                status === s
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-500 border-gray-300 hover:border-green-500"
              }`}
            >
              {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()} loading={isFetching}>
          Refresh
        </Button>
      </div>

      {/* List */}
      <Spin spinning={isLoading}>
        {delegationItems.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-xs text-gray-400">
                No delegated tasks for your office
              </span>
            }
            className="py-10"
          />
        ) : (
          <div className="grid gap-3">
            {delegationItems.map((item: any) => (
              <div
                key={`${item.assignment._id}-${item._id}`}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[12px] text-gray-900">{item.taskType}</span>
                      <Tag color={STATUS_COLORS[item.status] || "default"} className="text-[10px]">
                        {item.status.replace("_", " ").toUpperCase()}
                      </Tag>

                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-blue-600 font-semibold">
                        {getApplicationLabel(item.assignment)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        From: <span className="text-gray-600 font-medium">{item.fromEntity?.name || "—"}</span>
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {dayjs(item.requestedAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Tooltip title="View application details">
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => openViewApp(item.assignment)}
                      >
                        View App
                      </Button>
                    </Tooltip>
                    {(item.status === "pending" || item.status === "in_progress") && employee?.is_head && (
                      <Tooltip title={item.assignedTo ? "Reassign to another staff member" : "Assign to a staff member"}>
                        <Button
                          size="small"
                          icon={<UserAddOutlined />}
                          className="!text-blue-600 !border-blue-400 hover:!bg-blue-50"
                          onClick={() => handleOpenAssign(item, item.assignment)}
                        >
                          {item.assignedTo ? "Reassign" : "Assign"}
                        </Button>
                      </Tooltip>
                    )}
                    {(item.status === "pending" || item.status === "in_progress") && employee?.is_head && (
                      <Tooltip title="Mark task as completed">
                        <Button
                          size="small"
                          icon={<CheckCircleOutlined />}
                          className="!text-green-700 !border-green-500 hover:!bg-green-50"
                          onClick={() => handleOpenComplete(item, item.assignment)}
                        >
                          Complete
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-2 mb-2">
                  {item.description}
                </p>

                {/* Footer info */}
                <div className="flex items-center gap-4 flex-wrap">
                  {item.assignedTo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-semibold text-blue-700">
                      <UserAddOutlined />
                      Assigned to: {item.assignedTo?.firstname} {item.assignedTo?.lastname}
                    </span>
                  )}
                  {item.result && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <InfoCircleOutlined className="text-green-500" />
                      Result: <span className="text-gray-700 font-medium">{item.result}</span>
                    </span>
                  )}
                  {item.attachments?.length > 0 && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <PaperClipOutlined />
                      {item.attachments.length} attachment(s)
                    </span>
                  )}
                  {item.completedAt && (
                    <span className="text-[10px] text-green-600">
                      Completed {dayjs(item.completedAt).fromNow()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Spin>

      {/* Assign Modal */}
      <Modal
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        title={selectedDelegation?.assignedTo ? "Reassign Delegated Task" : "Assign Delegated Task"}
        footer={[
          <Button key="cancel" onClick={() => setAssignModalOpen(false)}>Cancel</Button>,
          <Button
            key="ok"
            type="primary"
            loading={isAssigning}
            onClick={handleAssign}
            className="!bg-green-700 !border-green-700"
          >
            {selectedDelegation?.assignedTo ? "Reassign" : "Assign"}
          </Button>,
        ]}
      >
        <div className="mb-3 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
          Task: <strong>{selectedDelegation?.taskType}</strong>
          <br />
          {selectedDelegation?.description}
        </div>
        {selectedDelegation?.assignedTo && (
          <div className="mb-3 flex items-center gap-2 text-xs bg-orange-50 border border-orange-200 rounded p-2 text-orange-700">
            <UserAddOutlined />
            <span>
              Currently assigned to:{" "}
              <strong>
                {selectedDelegation.assignedTo?.firstname} {selectedDelegation.assignedTo?.lastname}
              </strong>
              . Selecting a new officer will reassign this task.
            </span>
          </div>
        )}
        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="assignedTo"
            label="Assign To"
            rules={[{ required: true, message: "Please select a staff member" }]}
          >
            <Select showSearch placeholder="Select staff member" optionFilterProp="children">
              {staffMembers.map((s: any) => (
                <Option key={s._id} value={s._id}>
                  {s.firstname} {s.lastname} — {s.designation || s.grade || ""}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Notes (optional)">
            <TextArea rows={3} placeholder="Any instructions for the assignee..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Application Modal */}
      {viewModalOpen && (
        <ViewApplicationDetail
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          applicationId={viewAppId}
          applicationType={viewAppType}
        />
      )}

      {/* Complete Modal */}
      <Modal
        open={completeModalOpen}
        onCancel={() => setCompleteModalOpen(false)}
        title="Complete Delegated Task"
        footer={[
          <Button key="cancel" onClick={() => setCompleteModalOpen(false)}>Cancel</Button>,
          <Button
            key="ok"
            type="primary"
            loading={isCompleting}
            onClick={handleComplete}
            className="!bg-green-700 !border-green-700"
          >
            Mark as Completed
          </Button>,
        ]}
      >
        <div className="mb-3 text-xs text-gray-500 bg-green-50 border border-green-200 rounded p-2">
          Completing: <strong>{selectedDelegation?.taskType}</strong>
          <br />
          The requesting office will be notified immediately.
        </div>
        <Form form={completeForm} layout="vertical">
          <Form.Item
            name="result"
            label="Result / Summary"
            rules={[{ required: true, message: "Please provide a result or summary" }]}
          >
            <TextArea rows={4} placeholder="Describe what was done, findings, conclusions..." showCount maxLength={800} />
          </Form.Item>
          <Form.Item name="attachments" label="Attach Files (optional)">
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            >
              <Button icon={<PaperClipOutlined />} size="small">Attach Files</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DelegatedTasksTab;
