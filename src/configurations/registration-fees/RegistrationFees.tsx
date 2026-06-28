import React, { useEffect, useState } from "react";
import { Form, InputNumber, Button, Card, message, Spin, Row, Col, Typography, Tooltip, Switch } from "antd";
import { SaveOutlined, HistoryOutlined } from "@ant-design/icons";
import { useFetchRegistrationFeesQuery, useUpdateRegistrationFeesMutation } from "../../redux/features/configurations/registrationFeeApi";
import { PageTitle } from "../../utils/PageTitle";
import { styles } from "../../styles";
import { usePrivileges } from "../../hooks/usePrivileges";
import RecordHistoryDrawer from "../../pages/settings/RecordHistoryDrawer";
import { formatDate4 } from "@/utils/helperFunction";

const { Text } = Typography;

const RegistrationFees: React.FC = () => {
  PageTitle("Registration Fees | Configuration");
  const { hasRegistrationFeesAccess, hasRegistrationFeesUpdate } = usePrivileges();
  const [form] = Form.useForm();
  const { data, isLoading, isError } = useFetchRegistrationFeesQuery({});
  const [updateRegistrationFees, { isLoading: isUpdating }] = useUpdateRegistrationFeesMutation();
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (data?.success && data.data) {
      form.setFieldsValue(data.data);
    }
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      const response = await updateRegistrationFees(values).unwrap();
      if (response.success) {
        message.success(response.message || "Registration fees updated successfully");
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update registration fees");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!hasRegistrationFeesAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view Registration Fees.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 m-0">Registration Fees</h1>
          <p className="text-slate-500 m-0">Manage one-time registration fees for different client types.</p>
        </div>
        <Tooltip title={data?.data?._id ? "View Change History" : "No history available"}>
          <Button 
            icon={<HistoryOutlined />} 
            onClick={() => setHistoryOpen(true)}
            size="large"
            disabled={!data?.data?._id}
            className="flex items-center gap-2 text-orange-600 border-orange-200 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-50"
          >
            History
          </Button>
        </Tooltip>
      </div>

      <Card className="shadow-sm border-slate-200">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="individual"
                label="Individual Client Fee (GHS)"
                rules={[{ required: true, message: "Please enter the fee for individual clients" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="GH¢"
                  size="large"
                  disabled={!hasRegistrationFeesUpdate}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="organization"
                label="Organization Client Fee (GHS)"
                rules={[{ required: true, message: "Please enter the fee for organization clients" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="GH¢"
                  size="large"
                  disabled={!hasRegistrationFeesUpdate}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="government"
                label="Government Institution Fee (GHS)"
                rules={[{ required: true, message: "Please enter the fee for government institutions" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="GH¢"
                  size="large"
                  disabled={!hasRegistrationFeesUpdate}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="agent"
                label="Agent / Consultant Fee (GHS)"
                rules={[{ required: true, message: "Please enter the fee for agents" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="GH¢"
                  size="large"
                  disabled={!hasRegistrationFeesUpdate}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-2 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 mb-0.5">NIA Verification Required</p>
                <p className="text-xs text-slate-500 m-0">
                  When enabled, clients must verify their identity via the National Identification Authority (Ghana Card + selfie) before paying the registration fee. When disabled, clients proceed directly to payment after OTP verification.
                </p>
              </div>
              <Form.Item name="niaVerificationRequired" valuePropName="checked" className="mb-0 mt-1 shrink-0">
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={!hasRegistrationFeesUpdate}
                  className="!bg-slate-300 data-[checked]:!bg-green-600"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <div>
              {data?.data?.updatedAt && (
                <Text type="secondary" className="text-sm">
                  Last updated: {formatDate4(data.data.updatedAt)}
                </Text>
              )}
            </div>
            <button
              type="submit"
              disabled={isUpdating || !hasRegistrationFeesUpdate}
              className={`${styles.primary_button} !text-sm py-2 px-10`}
            >
              {isUpdating ? <Spin size="small" className="mr-2" /> : <SaveOutlined className="mr-2" />}
              Save Changes
            </button>
          </div>
        </Form>
      </Card>

      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="RegistrationFeeConfig"
        recordId={data?.data?._id || ""}
        recordName="Registration Fees"
      />
    </div>
  );
};

export default RegistrationFees;
