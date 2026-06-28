import { useState, useRef, useEffect } from "react";
import { FormInstance } from "antd";
import {
  Card,
  Button,
  Collapse,
  Tag,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Divider,
  Alert,
  Timeline,
  Upload,
} from "antd";
import {
  CheckCircleOutlined,
  FileOutlined,
  EyeOutlined,
  CheckOutlined,
  EditOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  FileDoneOutlined,
  HistoryOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { formatDate4, handleDocumentView } from "@/utils/helperFunction";
import { showError, showSuccess } from "@/lib/alert";
import { useAcknowledgeReportFromClientMutation } from "@/redux/features/employee-portal-api/application/assignment";
import dayjs from "dayjs";

interface ReportRequirement {
  _id: string;
  requestedBy: string;
  requestedAt: string;
  dueDate?: string;
  notes: string;
  attachment?: {
    filename: string;
    mimetype: string;
    s3Url?: string;
    originalname?: string;
  };
  reportTypes: {
    name: string;
    description?: string;
    template?: {
      filename?: string;
      mimetype?: string;
      s3Url?: string;
      originalname?: string;
      uploadedAt?: Date | string;
    };
  }[];
  status: "pending" | "submitted" | "approved" | "rejected" | "revision_requested";
  uploadedDocumentIds?: string[];
  submittedAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  revisionNotes?: string;
  revisionRequestedAt?: string;
  revisionRequestedBy?: string;
  revisionAttachment?: {
    filename: string;
    mimetype: string;
    s3Url?: string;
    originalname?: string;
  };
  revisions?: {
    _id: string;
    notes: string;
    dueDate: string;
    requestedAt: string;
    requestedBy: string;
    attachment?: {
      filename: string;
      mimetype: string;
      s3Url?: string;
      originalname?: string;
    };
  }[];
}

interface ReportDocument {
  _id: string;
  reportRequirementId: string;
  documenttype: string;
  filename: string;
  mimetype: string;
  originalname: string;
  uploadedAt: string;
}

interface ReportRequirementsUploadProps {
  assignmentId: string;
  reportRequirements: ReportRequirement[];
  reportDocuments?: ReportDocument[];
  refetch?: () => void;
}

const ExpandableText = ({ 
  text, 
  label, 
  lineClamp = "line-clamp-6",
  className = "text-blue-900"
}: { 
  text: string; 
  label?: string;
  lineClamp?: string;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [text]);

  return (
    <div className="flex flex-col gap-1">
      <p
        ref={textRef}
        className={`text-sm m-0 leading-relaxed ${className} ${
          !isExpanded ? lineClamp : ""
        }`}
      >
        {label && <strong>{label}:</strong>} {text}
      </p>
      {(isTruncated || isExpanded) && (
        <Button
          type="link"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 h-auto text-blue-700 hover:text-blue-800 font-bold mt-1 text-xs text-left w-fit"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};

const RevisionForm = ({
  form,
  action,
  onDateChange,
}: {
  form: FormInstance;
  action: string;
  onDateChange: (date: dayjs.Dayjs | null) => void;
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ notes: "", attachment: null }}
      onValuesChange={(changedValues) => {
        if ("dueDate" in changedValues) {
          onDateChange(changedValues.dueDate);
        }
      }}
    >
      <Form.Item
        name="notes"
        label={
          action === "approve"
            ? "Notes (Optional)"
            : "Notes / Reason (Required)"
        }
        rules={
          action === "approve"
            ? []
            : [
                {
                  required: true,
                  message: `Please provide ${
                    action === "reject" ? "a reason" : "revision details"
                  }`,
                },
                {
                  min: 10,
                  message: "Please provide at least 10 characters",
                },
              ]
        }
      >
        <Input.TextArea
          rows={4}
          placeholder={
            action === "approve"
              ? "Add any notes about this approval..."
              : action === "reject"
              ? "Explain why the report is being rejected..."
              : "Specify what revisions are needed..."
          }
          className="resize-none"
        />
      </Form.Item>
      {action === "request_revision" && (
        <>
          <Form.Item
            name="dueDate"
            label="Due Date for Revision"
            rules={[
              {
                required: true,
                message: "Please select a due date for the revision",
              },
            ]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(current) => current && current < dayjs().startOf("day")}
            />
          </Form.Item>

          <Form.Item
            name="attachment"
            label="Attachment (Optional)"
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e[0];
              return e?.file;
            }}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onRemove={() => form.setFieldsValue({ attachment: null })}
            >
              <div className="flex items-center gap-2">
                <Button icon={<UploadOutlined />}>Click to upload attachment</Button>
                {form.getFieldValue("attachment") && (
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentView(form.getFieldValue("attachment"));
                    }}
                  >
                    View
                  </Button>
                )}
              </div>
            </Upload>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

const RevisionHistory = ({ revisions }: { revisions: ReportRequirement["revisions"] }) => {
  if (!revisions || revisions.length === 0) return null;

  return (
    <div className="mt-4">
      <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <HistoryOutlined className="text-orange-600" />
        Revision History ({revisions.length})
      </h5>
      <div className="space-y-3">
        {revisions.map((rev, idx) => (
          <div key={rev._id || idx} className="bg-orange-50 border border-orange-100 rounded-lg p-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">
                Revision Request {revisions.length - idx}
              </span>
              <span className="text-[10px] text-gray-500">
                {formatDate4(rev.requestedAt)}
              </span>
            </div>
            <div className="mb-2 italic">
              <ExpandableText 
                text={rev.notes} 
                className="text-gray-700" 
                lineClamp="line-clamp-3" 
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarOutlined className="text-orange-500" />
                <span className="font-medium text-gray-700">New Due Date:</span>
                {formatDate4(rev.dueDate)}
              </div>
              {rev.attachment && (
                <div 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                  onClick={() => handleDocumentView(rev.attachment)}
                >
                  <FileOutlined />
                  <span className="font-medium">View Attachment</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadedReport = ({
  assignmentId,
  reportRequirements,
  reportDocuments = [],
  refetch,
}: ReportRequirementsUploadProps) => {
  const [acknowledgeReport, { isLoading: isAcknowledging }] =
    useAcknowledgeReportFromClientMutation();
  const [currentRequirementId, setCurrentRequirementId] = useState<
    string | null
  >(null);
  const [timelineModalOpen, setTimelineModalOpen] = useState<string | null>(null);
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [acknowledgeAction, setAcknowledgeAction] = useState<
    "approve" | "reject" | "request_revision"
  >("approve");
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [acknowledgeForm] = Form.useForm();

  const allRequirements = reportRequirements;


  const getDocumentsForRequirement = (
    requirementId: string
  ): ReportDocument[] => {
    return reportDocuments.filter(
      (doc) => doc.reportRequirementId === requirementId
    );
  };

  if (allRequirements.length === 0) {
    return null;
  }

  const handleAcknowledgeReport = (
    reportRequirementId: string,
    action: "approve" | "reject" | "request_revision"
  ) => {
    setCurrentRequirementId(reportRequirementId);
    setAcknowledgeAction(action);
    setIsAcknowledgeModalOpen(true);
    setIsDateSelected(false);
    acknowledgeForm.resetFields();
  };

  const handleSubmitAcknowledgement = async () => {
    const actionConfig = {
      approve: {
        buttonText: "Approve",
        title: "Confirm Approval",
        message: "Are you sure you want to approve this report? This action cannot be undone.",
        icon: <CheckCircleOutlined className="text-green-500" />
      },
      reject: {
        buttonText: "Reject",
        title: "Confirm Rejection",
        message: "Are you sure you want to reject this report? This action cannot be undone.",
        icon: <ExclamationCircleOutlined className="text-red-500" />
      },
      request_revision: {
        buttonText: "Request Revision",
        title: "Confirm Revision Request",
        message: "Are you sure you want to request a revision for this report? The client will be notified to resubmit. This action cannot be undone.",
        icon: <WarningOutlined className="text-orange-500" />
      },
    };

    const config = actionConfig[acknowledgeAction];

    try {
      const values = await acknowledgeForm.validateFields();
      if (!values || !currentRequirementId) return;

      Modal.confirm({
        title: config.title,
        icon: config.icon,
        content: (
          <div className="py-2">
            <p className="text-sm text-gray-600 mb-3">{config.message}</p>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes / Instructions:</p>
              <p className="text-sm text-gray-700 m-0 italic">"{values.notes || "No notes provided"}"</p>
              {acknowledgeAction === "request_revision" && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Revision Due Date:</span> {values.dueDate?.format("MMMM DD, YYYY")}
                  </p>
                  {values.attachment && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-600 m-0">
                        <span className="font-semibold">Attachment:</span> {values.attachment.name}
                      </p>
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<EyeOutlined />} 
                        className="p-0 h-auto text-[10px]"
                        onClick={() => handleDocumentView(values.attachment)}
                      >
                        Preview
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ),
        okText: config.buttonText,
        cancelText: "Cancel",
        centered: true,
        okButtonProps: {
          className: acknowledgeAction === "reject" ? "bg-red-600 hover:!bg-red-700" : 
                     acknowledgeAction === "approve" ? "bg-green-600 hover:!bg-green-700" : 
                     "bg-blue-600 hover:!bg-blue-700"
        },
        onOk: async () => {
          let hideLoading: (() => void) | null = null;
          try {
            hideLoading = message.loading(
              `Processing ${config.buttonText.toLowerCase()}...`,
              0
            );

            const formData = new FormData();
            formData.append("reportRequirementId", currentRequirementId);
            formData.append("action", acknowledgeAction);
            formData.append("notes", values.notes);

            if (acknowledgeAction === "request_revision" && values.dueDate) {
              formData.append("dueDate", values.dueDate.toISOString());
              if (values.attachment) {
                formData.append("attachment", values.attachment);
              }
            }

            await acknowledgeReport({
              payload: formData,
              assignmentId,
            }).unwrap();

            showSuccess(
              `The report has been ${
                acknowledgeAction === "approve"
                  ? "approved"
                  : acknowledgeAction === "reject"
                  ? "rejected"
                  : "sent for revision"
              }.`
            );

            setIsAcknowledgeModalOpen(false);
            refetch?.();
          } catch (err: unknown) {
            const error = err as any;
            showError(error?.data?.error || error?.message);
          } finally {
            if (hideLoading) hideLoading();
          }
        }
      });
    } catch (err: unknown) {
      // Form validation error - Ant Design handles showing errors in the form
    }
  };

  const items = allRequirements.map((requirement) => {
    const uploadedDocs = [...getDocumentsForRequirement(requirement._id)].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const hasUploadedDocs = uploadedDocs.length > 0;

    const sortedRevisions = requirement.revisions
      ? [...requirement.revisions].sort(
          (a, b) =>
            new Date(b.requestedAt).getTime() -
            new Date(a.requestedAt).getTime()
        )
      : [];

    const reportTypeNames = requirement.reportTypes
      .map((r) => r.name)
      .join(", ");

    return {
      key: requirement._id,
      label: (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-4 pr-2 sm:pr-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-semibold text-gray-700 text-sm sm:text-base">
              {reportTypeNames || "Report Requirement"}
            </span>
            {/* Status Badge */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                requirement.status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : requirement.status === "revision_requested"
                  ? "bg-orange-100 text-orange-800"
                  : requirement.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : requirement.status === "submitted"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {requirement.status === "revision_requested"
                ? "REVISION NEEDED"
                : requirement.status.toUpperCase()}
            </span>
            {hasUploadedDocs && (
              <div className="flex items-center gap-1">
                <CheckCircleOutlined className="text-green-600 text-sm" />
                <Tag color="success" className="text-xs m-0">
                  {uploadedDocs.length} submitted
                </Tag>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Requested: {formatDate4(requirement.requestedAt)}
          </span>
        </div>
      ),
      children: (
        <div className="space-y-4">
          {/* Timeline History Button */}
          <div className="flex gap-2">
            <Button
              type="default"
              icon={<HistoryOutlined />}
              onClick={() => setTimelineModalOpen(requirement._id)}
              className="border-blue-300 text-blue-600 hover:!text-blue-700 hover:!border-blue-400"
            >
              View Timeline History
            </Button>
          </div>

          {/* Request Notes */}
          {requirement.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ExpandableText text={requirement.notes} label="Request Notes" />
              {requirement.attachment && (
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-md text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors shadow-sm mt-3"
                  onClick={() => handleDocumentView(requirement.attachment)}
                >
                  <FileOutlined />
                  <span className="font-medium truncate max-w-[200px]">
                    {requirement.attachment.originalname || "View Attachment"}
                  </span>
                </div>
              )}
            </div>
          )}

          <Divider className="my-2" />

          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileOutlined className="text-blue-600" />
              Required Report Types
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requirement.reportTypes.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-gray-700 font-semibold truncate">{report.name}</span>
                    </div>
                    {report.template && (
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined style={{ fontSize: '10px' }} />}
                        onClick={() => handleDocumentView(report.template)}
                        className="text-blue-600 p-0 h-auto text-[10px]"
                      >
                        Template
                      </Button>
                    )}
                  </div>
                  {report.description && (
                    <p className="text-[10px] text-gray-500 italic ml-3 mb-0 line-clamp-1">
                      {report.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <RevisionHistory revisions={sortedRevisions} />

          {requirement.status === "submitted" && (
            <div>
              <Divider className="my-3" />
              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CheckOutlined className="text-blue-600" />
                Acknowledge Report
              </h5>

              <Alert
                message="Action Required"
                description="Review the submitted report and take an action: Approve or Request Revision."
                type="info"
                showIcon
                className="mb-4"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={
                    isAcknowledging && currentRequirementId === requirement._id
                  }
                  onClick={() =>
                    handleAcknowledgeReport(requirement._id, "approve")
                  }
                  className="bg-green-600 hover:!bg-green-700 border-0 !text-white w-full sm:w-auto"
                >
                  Approve
                </Button>

                <Button
                  icon={<EditOutlined />}
                  loading={
                    isAcknowledging && currentRequirementId === requirement._id
                  }
                  onClick={() =>
                    handleAcknowledgeReport(requirement._id, "request_revision")
                  }
                  className="bg-blue-600 hover:!bg-blue-700 border-0 !text-white w-full sm:w-auto"
                >
                  Request Revision
                </Button>
              </div>
            </div>
          )}

          {hasUploadedDocs && (
            <div>
              <Divider className="my-3" />
              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CheckSquareOutlined className="text-green-600" />
                Uploaded Documents ({uploadedDocs.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {uploadedDocs.map((doc: ReportDocument) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileOutlined className="text-blue-500 text-base flex-shrink-0" />
                      <div className="min-w-0 cursor-pointer group/name" onClick={() => handleDocumentView(doc)}>
                        <p className="text-xs font-medium text-gray-800 truncate mb-0 group-hover/name:text-blue-600 transition-colors" title={doc.originalname}>
                          {doc.originalname}
                        </p>
                        <p className="text-[10px] text-gray-500 mb-0">
                          {formatDate4(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleDocumentView(doc)}
                      className="text-blue-600 hover:bg-blue-50 flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    };
  });

  // Get current requirement for timeline modal
  const currentTimelineRequirement = allRequirements.find(
    (r) => r._id === timelineModalOpen
  );

  return (
    <>
      <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileOutlined className="text-blue-600 text-lg" />
            <h4 className="text-base sm:text-lg font-bold text-gray-800 m-0">
              Report Requirements
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 ml-6">
            {allRequirements.length} report requirement
            {allRequirements.length !== 1 ? "s" : ""} to review
          </p>
        </div>

        <Collapse items={items} accordion />
      </Card>

      {/* Timeline History Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-blue-600" />
            <span>Request Timeline History</span>
          </div>
        }
        open={timelineModalOpen !== null}
        onCancel={() => setTimelineModalOpen(null)}
        footer={null}
        width={600}
        centered
        maskClosable={false}
      >
        {currentTimelineRequirement && (
          <div className="space-y-4">
            <Timeline
              items={[
                {
                  dot: <CalendarOutlined className="text-lg text-blue-600" />,
                  color: "blue",
                  children: (
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        Report Requested
                      </p>
                      {currentTimelineRequirement.attachment && (
                        <div 
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 cursor-pointer mt-1 font-medium transition-colors"
                          onClick={() => handleDocumentView(currentTimelineRequirement.attachment)}
                        >
                          <FileOutlined />
                          <span>View Request Attachment</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate4(currentTimelineRequirement.requestedAt)}
                      </p>
                    </div>
                  ),
                },
                ...(currentTimelineRequirement.dueDate
                  ? [
                      {
                        dot: <CalendarOutlined className="text-lg text-orange-600" />,
                        color: "orange",
                        children: (
                          <div className="pb-2">
                            <p className="text-sm font-semibold text-gray-800">
                              Due Date
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate4(currentTimelineRequirement.dueDate)}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(currentTimelineRequirement.submittedAt
                  ? [
                      {
                        dot: <FileDoneOutlined className="text-lg text-green-600" />,
                        color: "green",
                        children: (
                          <div className="pb-2">
                            <p className="text-sm font-semibold text-gray-800">
                              Documents Submitted
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate4(currentTimelineRequirement.submittedAt)}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(currentTimelineRequirement.revisionRequestedAt && currentTimelineRequirement.status === "revision_requested"
                  ? [
                      {
                        dot: <ExclamationCircleOutlined className="text-lg text-orange-600" />,
                        color: "orange",
                        children: (
                          <div className="pb-2">
                            <p className="text-sm font-semibold text-gray-800">
                              Revision Requested
                            </p>
                            {currentTimelineRequirement.revisionNotes && (
                              <div className="bg-orange-50 border border-orange-100 rounded p-2 mt-2">
                                <ExpandableText 
                                  text={currentTimelineRequirement.revisionNotes} 
                                  className="text-gray-700" 
                                  lineClamp="line-clamp-3" 
                                />
                              </div>
                            )}
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate4(currentTimelineRequirement.revisionRequestedAt)}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(currentTimelineRequirement.acknowledgedAt && currentTimelineRequirement.status === "approved"
                  ? [
                      {
                        dot: <CheckCircleFilled className="text-lg text-emerald-600" />,
                        color: "green",
                        children: (
                          <div className="pb-2">
                            <p className="text-sm font-semibold text-gray-800">
                              Report Approved
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate4(currentTimelineRequirement.acknowledgedAt)}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Acknowledge Report Modal */}
      <Modal
        title={
          acknowledgeAction === "approve"
            ? "Approve Report"
            : acknowledgeAction === "reject"
            ? "Reject Report"
            : "Request Revision"
        }
        open={isAcknowledgeModalOpen}
        onCancel={() => setIsAcknowledgeModalOpen(false)}
        onOk={handleSubmitAcknowledgement}
        okText={
          acknowledgeAction === "approve"
            ? "Approve"
            : acknowledgeAction === "reject"
            ? "Reject"
            : "Request Revision"
        }
        okButtonProps={{
          loading: isAcknowledging,
          disabled: acknowledgeAction === "request_revision" && !isDateSelected,
          className:
            acknowledgeAction === "reject"
              ? "bg-red-600 hover:!bg-red-700 border-red-600 !text-white"
              : acknowledgeAction === "approve"
              ? "bg-green-600 hover:!bg-green-700 border-green-600 !text-white"
              : "bg-blue-600 hover:!bg-blue-700 border-blue-600 !text-white",
        }}
        cancelText="Cancel"
        width={600}
        centered
        maskClosable={false}
      >
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-4">
            {acknowledgeAction === "approve"
              ? "This will approve the submitted report. You can optionally add notes."
              : acknowledgeAction === "reject"
              ? "This will reject the submitted report. Please provide a reason in the notes field."
              : "This will request the client to revise the report. Please specify required changes in the notes field."}
          </p>
          <RevisionForm
            form={acknowledgeForm}
            action={acknowledgeAction}
            onDateChange={(date) => setIsDateSelected(!!date)}
          />
        </div>
      </Modal>
    </>
  );
};

export default UploadedReport;
