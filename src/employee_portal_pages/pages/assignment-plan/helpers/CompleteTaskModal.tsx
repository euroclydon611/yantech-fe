import React from 'react';
import { Modal, Form, Input, Tag, Divider } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  FolderOpenOutlined,
  TagOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { TextArea } = Input;

// Types
export interface Task {
  _id: string;
  application: {
    title: string;
    code: string;
  };
  task: {
    stageName: string;
  };
}

export interface CompleteTaskModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  currentTask: Task | null;
  isCompleting?: boolean;
  form: FormInstance;
}

const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  currentTask,
  isCompleting = false,
  form,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full">
            <CheckCircleOutlined className="text-green-600 text-sm sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
              Complete Assigned Task
            </p>
            <Tag
              color="blue"
              icon={<ClockCircleOutlined />}
              className="text-xs"
            >
              Ready for Submission
            </Tag>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={isCompleting}
      okText="Submit for Review"
      cancelText="Cancel"
      width="90%"
      style={{ maxWidth: "600px", top: "20px" }}
      className="professional-modal"
      styles={{
        body: {
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          padding: "16px",
        },
      }}
      okButtonProps={{
        className:
          "bg-green-600 hover:!bg-green-700 border-green-600 h-9 sm:h-10 font-medium text-sm sm:text-base",
        icon: <SendOutlined />,
      }}
      cancelButtonProps={{
        className: "h-9 sm:h-10 text-sm sm:text-base",
      }}
      destroyOnClose
    >
      {currentTask && (
        <div className="space-y-4 sm:space-y-6">
          {/* Task Overview Card */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FolderOpenOutlined className="text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                Task Overview
              </span>
            </div>

            <div className="ml-6 space-y-2 sm:space-y-3">
              {/* Application Details */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Application:
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                  {currentTask.application.title || "Application Title"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  ID:{" "}
                  <span className="font-medium">
                    {currentTask.application.code}
                  </span>
                </p>
              </div>

              {/* Task Stage */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Stage to Complete:
                </p>
                <div className="flex items-center space-x-2">
                  <TagOutlined className="text-purple-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium text-gray-800 bg-purple-50 px-2 sm:px-3 py-1 rounded border border-purple-200 truncate">
                    {currentTask.task.stageName.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-3 sm:my-4" />

          {/* Completion Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{ completionNotes: "" }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Instructions */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <ExclamationCircleOutlined className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                    Submission Instructions
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Please provide detailed completion notes describing your
                    work, findings, and any important observations. This
                    information will help your supervisor review your work
                    effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Notes - Now Mandatory */}
            <Form.Item
              name="completionNotes"
              label={
                <div className="flex items-center space-x-2">
                  <FileTextOutlined className="text-gray-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Completion Notes & Findings
                  </span>
                  <span className="text-red-500">*</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message:
                    "Please provide completion notes describing your work and findings.",
                },
                {
                  min: 10,
                  message:
                    "Please provide more detailed notes (at least 10 characters).",
                },
              ]}
              help="Describe your work, findings, and any important observations for review."
            >
              <TextArea
                rows={4}
                placeholder="Please provide detailed notes about your work:
• What tasks were completed?
• Key findings or observations
• Any issues encountered and how they were resolved
• Recommendations for next steps
• Status of all required documents/checks"
                className="resize-none text-sm"
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default CompleteTaskModal

