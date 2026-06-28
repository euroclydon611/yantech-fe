import React, { useState, useEffect } from "react";
import { Modal, Select, Upload, Button, message, Typography } from "antd";
import { FileOutlined, InboxOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { showError, showSuccess } from "@/lib/alert";
import { useUploadApplicationDocumentMutation } from "@/redux/features/employee-portal-api/application/application";

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  applicationType: string;
  onSuccess?: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onClose,
  applicationId,
  applicationType,
  onSuccess,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<any>(null);

  const [uploadDocument, { isLoading, isSuccess, data: uploadedData }] =
    useUploadApplicationDocumentMutation();

  useEffect(() => {
    if (isSuccess) {
      const messageText =
        uploadedData?.message || "Document uploaded successfully";
      Swal.fire({
        title: "Success",
        text: messageText,
        icon: "success",
        confirmButtonColor: "#2E7D32",
      });
      handleClose();
      if (onSuccess) onSuccess();
    }
  }, [isSuccess, uploadedData]);

  const handleClose = () => {
    setSelectedDocType(null);
    setFileToUpload(null);
    onClose();
  };

  const handleFileUpload = async () => {
    if (!fileToUpload || !selectedDocType || !applicationId) {
      showError("Please select a document type and a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("documentType", selectedDocType);
    formData.append("applicationId", applicationId);

    try {
      await uploadDocument({ formData, applicationType }).unwrap();
    } catch (err: any) {
      console.error("File upload failed:", err);
      showError(err?.data?.error || "Failed to upload document");
    }
  };

  return (
    <Modal
      title="Upload Review/Evaluation Document"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleFileUpload}
          loading={isLoading}
          disabled={!fileToUpload || !selectedDocType}
          className="bg-blue-600 hover:!bg-blue-700 border-none"
        >
          Upload Document
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <div className="mb-6">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileOutlined className="text-blue-600" />
            Document Type
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            Select or type a custom name for this document.
          </p>
          <Select
            className="w-full"
            placeholder="Select or type document type"
            value={selectedDocType}
            onChange={(value) => {
              const finalValue = Array.isArray(value)
                ? value[value.length - 1]
                : value;
              setSelectedDocType(finalValue);
            }}
            size="large"
            mode="tags"
            maxCount={1}
          >
            <Select.Option value="Technical Review Committee (TRC)">
              Technical Review Committee (TRC)
            </Select.Option>
            <Select.Option value="Screening Report">
              Screening Report
            </Select.Option>
            <Select.Option value="Analysis Document">
              Analysis Document
            </Select.Option>
          </Select>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <InboxOutlined className="text-blue-600" />
            Select File
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            Please select the file from your computer to upload.
          </p>
        </div>

        <Upload.Dragger
          name="file"
          multiple={false}
          accept=".pdf,.doc,.docx,image/*,video/*"
          beforeUpload={(file) => {
            const isAllowed =
              file.type === "application/pdf" ||
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              file.type.startsWith("image/") ||
              file.type.startsWith("video/");

            if (!isAllowed) {
              showError(
                "Invalid file type! Please upload PDF, Word, Image, or Video files."
              );
              return Upload.LIST_IGNORE;
            }
            const isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
              showError("File must be smaller than 20MB!");
              return Upload.LIST_IGNORE;
            }

            if (file.type.startsWith("video/")) {
              return new Promise((resolve) => {
                const video = document.createElement("video");
                video.preload = "metadata";
                video.onloadedmetadata = () => {
                  URL.revokeObjectURL(video.src);
                  if (video.duration > 60) {
                    showError("Video upload shouldn't exceed 1 minute");
                    resolve(Upload.LIST_IGNORE);
                  } else {
                    setFileToUpload(file);
                    resolve(false);
                  }
                };
                video.onerror = () => {
                  URL.revokeObjectURL(video.src);
                  message.error("Failed to load video metadata.");
                  resolve(Upload.LIST_IGNORE);
                };
                video.src = URL.createObjectURL(file);
              });
            }

            setFileToUpload(file);
            return false;
          }}
          onRemove={() => {
            setFileToUpload(null);
          }}
          fileList={fileToUpload ? [fileToUpload] : []}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. (.pdf, .doc, images, videos)
          </p>
        </Upload.Dragger>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
