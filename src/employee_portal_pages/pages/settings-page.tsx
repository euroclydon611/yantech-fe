import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Alert,
  message,
  Modal,
  Breadcrumb,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  useEmployeeChangePasswordMutation,
  useEmployeeLogoutMutation,
} from "../../redux/features/employee-portal-api/authApi";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const [logout] = useEmployeeLogoutMutation();
  const navigate = useNavigate();

  const [changePassword, { isLoading, isSuccess, error }] =
    useEmployeeChangePasswordMutation();

  const onSubmit = async (values: any) => {
    try {
      await changePassword({
        old_password: values.currentPassword,
        new_password: values.newPassword,
      }).unwrap();
    } catch (_) {}
  };

  const handlePasswordChangeSuccess = () => {
    confirm({
      title: "Password Changed Successfully",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      content: (
        <div className="space-y-3 mt-4">
          <p>Your password has been updated successfully!</p>
          <Alert
            message="Security Notice"
            description="For your security, you will be logged out and need to sign in again with your new password."
            type="info"
            showIcon
            className="mt-3"
          />
        </div>
      ),
      okText: "Sign Out Now",
      okButtonProps: {
        className: "bg-green-600 hover:!bg-green-700 text-white border-none",
      },
      onOk: async () => {
        await logout({});
        form.resetFields();
        navigate("/employee");
        message.success("You have been logged out successfully");
      },
    });
  };

  useEffect(() => {
    if (isSuccess) handlePasswordChangeSuccess();
    if (error) {
      const errorMessage = (error as any)?.data?.error || "Failed to update password";
      message.error(errorMessage);
    }
  }, [isSuccess, error]);

  return (
    <div className="settings-page-root flex flex-col">

      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: "Personal" },
            { title: <span className="text-green-700 font-medium">Settings</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
          <SettingOutlined className="text-white text-sm" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-800 leading-tight">Settings</h1>
          <p className="text-[11px] text-gray-500 leading-tight">Manage your account security and preferences</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        <div className="max-w-xl">
          <Card
            className="shadow-sm border border-gray-200"
            title={
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LockOutlined className="text-green-700" />
                Change Password
              </div>
            }
            styles={{ body: { padding: "24px" } }}
          >
            <Alert
              message="Password Security Tips"
              description={
                <ul className="text-xs mt-1 space-y-1 text-gray-600">
                  <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                  <li>• Avoid using personal information or common words</li>
                  <li>• Don't reuse passwords from other accounts</li>
                </ul>
              }
              type="info"
              showIcon
              className="mb-5"
            />

            <Form form={form} onFinish={onSubmit} layout="vertical" autoComplete="off">
              <Form.Item
                name="currentPassword"
                label={
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <LockOutlined className="text-gray-400" />
                    Current Password
                  </div>
                }
                rules={[{ required: true, message: "Please enter your current password" }]}
              >
                <Input.Password
                  placeholder="Enter your current password"
                  iconRender={(v) => v ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <KeyOutlined className="text-gray-400" />
                    New Password
                  </div>
                }
                rules={[
                  { required: true, message: "Please enter a new password" },
                  { min: 6, message: "Password must be at least 6 characters long" },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Enter your new password"
                  iconRender={(v) => v ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <SafetyCertificateOutlined className="text-gray-400" />
                    Confirm New Password
                  </div>
                }
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your new password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Confirm your new password"
                  iconRender={(v) => v ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
              </Form.Item>

              <Form.Item className="mb-0 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<CheckCircleOutlined />}
                  className="!bg-green-700 hover:!bg-green-800 !border-green-700 font-medium"
                  block
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      <style>{`
        .settings-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
      `}</style>
    </div>
  );
}
