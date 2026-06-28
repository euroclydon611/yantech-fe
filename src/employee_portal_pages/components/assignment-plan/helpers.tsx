import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Row,
  Col,
  Alert,
  Divider,
  Typography,
  InputNumber,
  Statistic,
  Timeline,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  DeleteOutlined,
  CalculatorOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  FolderOpenOutlined,
  UserOutlined,
  ClockCircleOutlined,
  IssuesCloseOutlined,
  FastForwardOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  TableOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { formatDate2 } from "@/utils/helperFunction";
const { TextArea } = Input;

export const InvoicePreparationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  task,
}) => {
  const [form] = Form.useForm();
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  const calculateTotals = () => {
    const lineItems = form.getFieldValue("lineItems") || [];
    const newSubtotal = lineItems.reduce(
      (acc: number, item: any) =>
        acc + (item?.quantity || 0) * (item?.unitPrice || 0),
      0
    );
    setSubtotal(newSubtotal);
  };

  // Pre-fill form if editing an existing invoice
  useEffect(() => {
    if (task?.proposedInvoice) {
      const invoice = task.proposedInvoice;

      const lineItemsWithTotal = (invoice.lineItems || []).map((item: any) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));

      form.setFieldsValue({
        lineItems: lineItemsWithTotal,
      });

      if (invoice.subtotal && invoice.taxAmount !== undefined) {
        const computedTaxRate = Number(
          ((invoice.taxAmount / invoice.subtotal) * 100).toFixed(2)
        );

        setTaxRate(computedTaxRate);
        setSubtotal(invoice.subtotal);
      } else {
        setTaxRate(0);
        setSubtotal(0);
      }

      calculateTotals();
    } else {
      form.resetFields();
      setTaxRate(0);
      setSubtotal(0);
    }
  }, [task, form]);

  const onFinish = (values: any) => {
    const lineItemsWithTotal = values.lineItems.map((item: any) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const computedSubtotal = lineItemsWithTotal.reduce(
      (acc: number, item: any) => acc + item.total,
      0
    );

    const taxAmount = (computedSubtotal * taxRate) / 100;
    const totalAmount = computedSubtotal + taxAmount;

    if (totalAmount <= 0) {
      message.error("Total amount must be greater than zero.");
      return;
    }

    const payload = {
      lineItems: lineItemsWithTotal,
      subtotal: computedSubtotal,
      taxAmount,
      totalAmount,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full">
            <CalculatorOutlined className="text-green-600 text-sm sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
              Prepare Invoice
            </p>
            <Tag color="green" icon={<DollarOutlined />} className="text-xs">
              Fee Calculation
            </Tag>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: "900px", top: "20px" }}
      className="professional-modal"
      bodyStyle={{
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        padding: "16px",
      }}
      closable={false}
      maskClosable={false}
      destroyOnClose
      footer={[
        <Button
          key="back"
          onClick={onClose}
          className="h-9 sm:h-10 font-medium"
          size="large"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={() => {
            form.submit();
          }}
          className="bg-green-600 hover:!bg-green-700 h-9 sm:h-10 font-medium"
          icon={<CheckCircleOutlined />}
          size="large"
        >
          Complete Stage
        </Button>,
      ]}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Application Info Card */}
        <Card size="small" className="bg-gray-50 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <FolderOpenOutlined className="text-blue-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">
              Application Details
            </span>
          </div>
          <div className="ml-6">
            <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
              {task?.application?.title || "Application Title"}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Application ID:{" "}
              <span className="font-medium">
                {task?.application?.code || "N/A"}
              </span>
            </p>
          </div>
        </Card>

        {/* Instructions */}
        <Alert
          message="Invoice Preparation Guidelines"
          description={
            <div className="space-y-2 mt-2">
              <p className="text-sm">
                Create a detailed invoice for the application fees and charges.
                Ensure all line items are accurate and properly categorized.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 mt-2">
                <li>• Add all applicable fees and charges</li>
                <li>• Use clear, descriptive names for each item</li>
                <li>• Verify quantities and unit prices</li>
                <li>• Tax rate can be adjusted as needed</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="border border-blue-200"
        />

        {/* Invoice Form */}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          onValuesChange={calculateTotals}
          className="space-y-4"
        >
          {/* Line Items Section */}
          <Card
            size="small"
            title={
              <div className="flex items-center space-x-2">
                <FileTextOutlined className="text-purple-600" />
                <span className="text-sm sm:text-base">Invoice Line Items</span>
              </div>
            }
            className="border border-gray-200"
          >
            <Form.List
              name="lineItems"
              initialValue={[{ description: "", quantity: 1, unitPrice: 0 }]}
            >
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="hidden sm:block">
                    <Row gutter={16} className="pb-2 border-b border-gray-200">
                      <Col flex="auto">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Description
                        </span>
                      </Col>
                      <Col span={4}>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Qty
                        </span>
                      </Col>
                      <Col span={5}>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Unit Price
                        </span>
                      </Col>
                      <Col span={2}>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Action
                        </span>
                      </Col>
                    </Row>
                  </div>

                  {/* Scrollable Line Items */}
                  <div
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                    className="space-y-2"
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        className="sm:shadow-none sm:border-none border border-gray-200 shadow-sm"
                      >
                        <Row gutter={[16, 8]} align="middle">
                          <Col xs={24} sm={14}>
                            <Form.Item
                              {...restField}
                              name={[name, "description"]}
                              label={
                                <span className="text-xs sm:hidden font-medium text-gray-600">
                                  Description
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Description is required",
                                },
                              ]}
                              className="mb-2 sm:mb-0"
                            >
                              <Input
                                placeholder="e.g., Application Processing Fee, Site Inspection Fee"
                                className="text-sm"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={12} sm={4}>
                            <Form.Item
                              {...restField}
                              name={[name, "quantity"]}
                              label={
                                <span className="text-xs sm:hidden font-medium text-gray-600">
                                  Quantity
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Quantity required",
                                },
                              ]}
                              className="mb-2 sm:mb-0"
                            >
                              <InputNumber
                                min={1}
                                placeholder="1"
                                style={{ width: "100%" }}
                                className="text-sm"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={12} sm={5}>
                            <Form.Item
                              {...restField}
                              name={[name, "unitPrice"]}
                              label={
                                <span className="text-xs sm:hidden font-medium text-gray-600">
                                  Unit Price
                                </span>
                              }
                              rules={[
                                { required: true, message: "Price required" },
                              ]}
                              className="mb-2 sm:mb-0"
                            >
                              <InputNumber
                                min={0}
                                placeholder="0.00"
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                  `GH₵ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value: any) =>
                                  value.replace(/GH₵\s?|(,*)/g, "")
                                }
                                className="text-sm"
                              />
                            </Form.Item>
                          </Col>
                          <Col
                            xs={24}
                            sm={1}
                            className="text-center sm:text-left"
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              size="small"
                              className="w-full sm:w-auto"
                            >
                              <span className="sm:hidden">Remove Item</span>
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>

                  {/* Add Button */}
                  <Form.Item className="mb-0">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="h-10 font-medium border-2 border-dashed hover:border-green-400 hover:text-green-600"
                    >
                      Add Line Item
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </Card>

          <Divider className="my-4 sm:my-6" />

          {/* Totals Section */}
          <Card
            size="small"
            title={
              <div className="flex items-center space-x-2">
                <CalculatorOutlined className="text-green-600" />
                <span className="text-sm sm:text-base">Invoice Summary</span>
              </div>
            }
            className="border border-gray-200"
          >
            <Row gutter={[16, 16]} justify="end">
              <Col xs={24} lg={12}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-lg border border-gray-200">
                  {/* Subtotal */}
                  <Row
                    justify="space-between"
                    className="mb-3 pb-2 border-b border-gray-200"
                  >
                    <Typography.Text className="text-sm sm:text-base text-gray-600">
                      Subtotal:
                    </Typography.Text>
                    <Typography.Text strong className="text-sm sm:text-base">
                      GH₵{" "}
                      {subtotal.toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography.Text>
                  </Row>

                  {/* Tax Rate Input */}
                  <Row
                    justify="space-between"
                    align="middle"
                    className="mb-3 pb-2 border-b border-gray-200"
                  >
                    <Typography.Text className="text-sm sm:text-base text-gray-600">
                      Tax Rate (%):
                    </Typography.Text>
                    <InputNumber
                      value={taxRate}
                      onChange={(value) => setTaxRate(value || 0)}
                      style={{ width: "80px" }}
                      min={0}
                      max={100}
                      step={0.5}
                      placeholder="0"
                      className="text-sm"
                    />
                  </Row>

                  {/* Tax Amount */}
                  <Row
                    justify="space-between"
                    className="mb-4 pb-2 border-b border-gray-200"
                  >
                    <Typography.Text className="text-sm sm:text-base text-gray-600">
                      Tax Amount:
                    </Typography.Text>
                    <Typography.Text
                      strong
                      className="text-sm sm:text-base text-green-700"
                    >
                      GH₵{" "}
                      {((subtotal * taxRate) / 100).toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography.Text>
                  </Row>

                  {/* Total */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <Statistic
                      title={
                        <span className="text-sm font-semibold text-green-800">
                          Total Amount Due
                        </span>
                      }
                      value={`GH₵ ${(
                        subtotal +
                        (subtotal * taxRate) / 100
                      ).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
                      valueStyle={{
                        color: "#059669",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                      prefix={<DollarOutlined className="text-green-600" />}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Final Warning */}
          <Alert
            message="Ready to Submit for Review"
            description="Please review all line items and amounts carefully. Once submitted, this application will be reviewed for approval. Upon approval, it will become the official invoice issued to the applicant."
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="border border-orange-200"
          />
        </Form>
      </div>
    </Modal>
  );
};

export const HistoryTimeline = ({ history }) => (
  <div className="min-w-[360px] max-w-[480px] max-h-[520px] overflow-y-auto pr-1">
    {(!history || history.length === 0) && (
      <div className="py-6 text-center text-gray-400 text-xs">No history recorded yet.</div>
    )}
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-200" />

      {history?.map((h: any, i: number) => {
        const action = (h.action || "").toLowerCase();
        const isAssign = action.includes("assigned stage");
        const isApprove = action.includes("approved") || action.includes("submitted for ceo");
        const isReject = action.includes("rejected");
        const isSkip = action.includes("skipped");
        const isRevert = action.includes("reverted");
        const isRecall = action.includes("recalled");
        const isRework = action.includes("rework");
        const isReport = action.includes("report");
        const isCorrection = action.includes("correction") || action.includes("rework applicant");
        const isMigration = action.includes("migration") || action.includes("migrated");
        const isSystem = (h.user || "").toLowerCase() === "system";

        let dotBg = "bg-gray-400";
        let dotIcon = <ClockCircleOutlined />;
        let accentColor = "border-l-gray-300";
        let labelBg = "bg-gray-100 text-gray-600";

        if (isAssign) { dotBg = "bg-[#0D4A2A]"; dotIcon = <UserOutlined />; accentColor = "border-l-[#0D4A2A]"; labelBg = "bg-[#0D4A2A]/10 text-[#0D4A2A]"; }
        else if (isApprove) { dotBg = "bg-emerald-500"; dotIcon = <CheckCircleOutlined />; accentColor = "border-l-emerald-400"; labelBg = "bg-emerald-50 text-emerald-700"; }
        else if (isReject) { dotBg = "bg-red-500"; dotIcon = <CloseCircleOutlined />; accentColor = "border-l-red-400"; labelBg = "bg-red-50 text-red-700"; }
        else if (isSkip) { dotBg = "bg-amber-500"; dotIcon = <FastForwardOutlined />; accentColor = "border-l-amber-400"; labelBg = "bg-amber-50 text-amber-700"; }
        else if (isRevert) { dotBg = "bg-orange-500"; dotIcon = <UndoOutlined />; accentColor = "border-l-orange-400"; labelBg = "bg-orange-50 text-orange-700"; }
        else if (isRecall) { dotBg = "bg-purple-500"; dotIcon = <IssuesCloseOutlined />; accentColor = "border-l-purple-400"; labelBg = "bg-purple-50 text-purple-700"; }
        else if (isRework || isCorrection) { dotBg = "bg-yellow-500"; dotIcon = <ExclamationCircleOutlined />; accentColor = "border-l-yellow-400"; labelBg = "bg-yellow-50 text-yellow-700"; }
        else if (isReport) { dotBg = "bg-blue-500"; dotIcon = <FileTextOutlined />; accentColor = "border-l-blue-400"; labelBg = "bg-blue-50 text-blue-700"; }
        else if (isMigration || isSystem) { dotBg = "bg-gray-500"; dotIcon = <IssuesCloseOutlined />; accentColor = "border-l-gray-300"; labelBg = "bg-gray-100 text-gray-500"; }

        const actionLabel = h.action
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
          .replace(/_/g, " ");

        return (
          <div key={i} className="relative mb-4 last:mb-0">
            {/* Dot */}
            <div className={`absolute -left-6 top-3 w-5 h-5 rounded-full ${dotBg} flex items-center justify-center shadow-sm z-10`}>
              <span className="text-white text-[9px]">{dotIcon}</span>
            </div>

            {/* Card */}
            <div className={`bg-white rounded-lg border border-gray-100 border-l-4 ${accentColor} shadow-sm px-3 py-2.5`}>
              {/* Action label + timestamp */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight ${labelBg}`}>
                  {actionLabel}
                </span>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-500 font-medium leading-tight">
                    {formatDate2(h.timestamp)}
                  </p>
                  <p className="text-[9px] text-gray-400 leading-tight">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* By + assigned to */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1">
                <span className="text-[11px] text-gray-600">
                  <span className="text-gray-400">by </span>
                  <span className="font-semibold text-gray-800">{h.user}</span>
                </span>
                {h.assignedToName && (
                  <span className="text-[10px] text-[#0D4A2A] font-medium flex items-center gap-1">
                    <UserOutlined className="text-[9px]" />
                    Assigned to: <span className="font-semibold">{h.assignedToName}</span>
                    {h.copiedCount > 0 && (
                      <span className="ml-1 text-gray-400 font-normal">
                        · {h.copiedCount} staff copied
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Notes */}
              {h.notes && (
                <div className="mt-1.5 bg-gray-50 rounded-md px-2.5 py-1.5 border border-gray-100">
                  <Typography.Paragraph
                    ellipsis={{
                      rows: 2,
                      expandable: true,
                      symbol: (expanded: boolean) => (
                        <span className="text-[#0D4A2A] text-[10px] cursor-pointer ml-1 font-medium">
                          {expanded ? "Show less" : "Read more"}
                        </span>
                      ),
                    }}
                    className="text-[11px] text-gray-600 italic mb-0 leading-relaxed"
                    style={{ marginBottom: 0 }}
                  >
                    {h.notes}
                  </Typography.Paragraph>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);


export const getStageInfo = (status: string = "unknown") => {
  const normalizedStatus = status.toLowerCase();

  // Pending stages
  if (normalizedStatus.startsWith("pending_")) {
    const stage = normalizedStatus
      .replace("pending_", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      text: `Pending ${stage}`,
      color: "processing",
      icon: <ClockCircleOutlined />,
    };
  }

  // Review stages
  if (normalizedStatus.startsWith("review_")) {
    const stage = normalizedStatus
      .replace("review_", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      text: `Reviewing ${stage}`,
      color: "warning",
      icon: <IssuesCloseOutlined />,
    };
  }

  // Fallback
  return {
    text: normalizedStatus
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    color: "default",
    icon: <ClockCircleOutlined />,
  };
};

export const showReasonModals = (action, assignment, onConfirm) => {
  let reasonForm;

  Modal.confirm({
    title: action === "skip" ? "Skip Current Step" : "Reject Application",
    icon:
      action === "skip" ? (
        <FastForwardOutlined style={{ color: "#faad14" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      ),
    width: 520,
    content: (
      <div className="space-y-4 mt-4">
        <div className={`bg-gray-50 p-3 rounded border`}>
          <p className="text-sm font-medium">
            Application: {assignment.applicationDetails.code}
          </p>
          <p className="text-sm">
            Title: {assignment.applicationDetails.title}
          </p>
          <p className="text-sm">Current Status: {assignment.internalStatus}</p>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
          initialValues={{ reason: "" }}
        >
          <Form.Item
            name="reason"
            label={
              <div className="flex items-center space-x-2">
                <FileTextOutlined />
                <span>
                  Reason for {action === "skip" ? "Skipping" : "Rejection"}
                </span>
                <span className="text-red-500">*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: `Please provide a reason for ${
                  action === "skip"
                    ? "skipping this step"
                    : "rejecting this application"
                }.`,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={
                action === "skip"
                  ? "e.g., Administrative decision to expedite processing due to urgent nature..."
                  : "e.g., Application does not meet required criteria. Missing environmental impact assessment..."
              }
              className="resize-none"
            />
          </Form.Item>
        </Form>

        <div
          className={`${
            action === "skip"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          } p-3 rounded border`}
        >
          <p
            className={`text-xs font-medium ${
              action === "skip" ? "text-yellow-800" : "text-red-800"
            }`}
          >
            {action === "skip"
              ? "⚠️ This action will move the application to the next stage without completing current requirements."
              : "⚠️ WARNING: This action will permanently reject the application and end the entire workflow. This cannot be undone."}
          </p>
        </div>
      </div>
    ),
    okText: action === "skip" ? "Yes, Skip Step" : "Yes, Reject Application",
    okType: action === "skip" ? "primary" : "danger",
    okButtonProps: {
      className: action === "skip" ? "bg-orange-500 hover:!bg-orange-600" : "",
    },
    cancelText: "Cancel",
    onOk: async () => {
      try {
        const values = await reasonForm.validateFields();
        onConfirm(values.reason);
      } catch (err) {
        throw new Error("Please provide a reason");
      }
    },
  });
};



export const showReasonModal = (action, assignment, onConfirm) => {
  let reasonForm;

  /* ---------- helper text & labels ---------- */
  const actionText =
    action === "skip"
      ? "Skipping"
      : action === "recall"
      ? "Recalling"
      : "Rejecting";

  const okText =
    action === "skip"
      ? "Yes, Skip Step"
      : action === "recall"
      ? "Yes, Recall Assignment"
      : "Yes, Reject Application";

  const warningMessage =
    action === "skip"
      ? "⚠️ This action will move the application to the next stage without completing current requirements."
      : action === "recall"
      ? "⚠️ This action will revert the assignment to the previous stage and re-open it for editing."
      : "⚠️ WARNING: This action will permanently reject the application and end the entire workflow. This cannot be undone.";

  const bgColor =
    action === "skip"
      ? "bg-yellow-50 border-yellow-200"
      : action === "recall"
      ? "bg-blue-50 border-blue-200"
      : "bg-red-50 border-red-200";

  const textColor =
    action === "skip"
      ? "text-yellow-800"
      : action === "recall"
      ? "text-blue-800"
      : "text-red-800";

  /* ---------- modal ---------- */
  Modal.confirm({
    title:
      action === "skip"
        ? "Skip Current Step"
        : action === "recall"
        ? "Recall Assignment"
        : "Reject Application",
    icon:
      action === "skip" ? (
        <FastForwardOutlined style={{ color: "#faad14" }} />
      ) : action === "recall" ? (
        <UndoOutlined style={{ color: "#1890ff" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      ),
    width: 520,
    content: (
      <div className="space-y-4 mt-4">
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-sm font-medium">
            Application: {assignment.applicationDetails.code}
          </p>
          <p className="text-sm">
            Title: {assignment.applicationDetails.title}
          </p>
          <p className="text-sm">Current Status: {assignment.internalStatus}</p>
        </div>

        <Form
          ref={(form) => {
            reasonForm = form;
          }}
          layout="vertical"
          initialValues={{ reason: "" }}
        >
          <Form.Item
            name="reason"
            label={
              <div className="flex items-center space-x-2">
                <FileTextOutlined />
                <span>Reason for {actionText}</span>
                <span className="text-red-500">*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: `Please provide a reason for ${actionText}.`,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={
                action === "skip"
                  ? "e.g., Administrative decision to expedite processing due to urgent nature..."
                  : action === "recall"
                  ? "e.g., Additional documentation required from applicant..."
                  : "e.g., Application does not meet required criteria. Missing environmental impact assessment..."
              }
              className="resize-none"
            />
          </Form.Item>
        </Form>

        <div className={`${bgColor} p-3 rounded border`}>
          <p className={`text-xs font-medium ${textColor}`}>
            {warningMessage}
          </p>
        </div>
      </div>
    ),
    okText,
    okType: action === "recall" ? "primary" : action === "skip" ? "primary" : "danger",
    okButtonProps: {
      className:
        action === "skip"
          ? "bg-orange-500 hover:!bg-orange-600"
          : action === "recall"
          ? "bg-blue-500 hover:!bg-blue-600"
          : "",
    },
    cancelText: "Cancel",
    onOk: async () => {
      try {
        const values = await reasonForm.validateFields();
        onConfirm(values.reason);
      } catch (err) {
        throw new Error("Please provide a reason");
      }
    },
  });
};

export const ViewSelector = ({ viewType, setViewType, showTable=true }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
      <Tooltip title="Card View">
        <Button
          type={viewType === "cards" ? "primary" : "text"}
          icon={<AppstoreOutlined />}
          size="small"
          onClick={() => setViewType("cards")}
          className={viewType === "cards" ? "bg-blue-600" : ""}
        />
      </Tooltip>
      <Tooltip title="List View">
        <Button
          type={viewType === "list" ? "primary" : "text"}
          icon={<UnorderedListOutlined />}
          size="small"
          onClick={() => setViewType("list")}
          className={viewType === "list" ? "bg-blue-600" : ""}
        />
      </Tooltip>
      <Tooltip title="Table View">
        <Button
          type={viewType === "table" ? "primary" : "text"}
          icon={<TableOutlined />}
          size="small"
          onClick={() => setViewType("table")}
          className={viewType === "table" ? "bg-blue-600" : ""}
          hidden={!showTable}
        />
      </Tooltip>
    </div>
  </div>
);
