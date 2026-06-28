import React, { useState } from "react";
import { List, Card, Button, Typography } from "antd";
import {
  FileOutlined,
  EyeOutlined,
  DeleteOutlined,
  InboxOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useRemoveApplicationDocumentMutation } from "@/redux/features/employee-portal-api/application/application";
import {
  handleDocumentView,
  normalizeText,
  formatDate4,
} from "@/utils/helperFunction";
import DocumentUploadModal from "./document-upload-modal";

const { Text } = Typography;

const getFileIcon = (mimetype: string) => {
  if (mimetype?.includes("pdf"))
    return <FilePdfOutlined className="text-red-600" />;
  if (
    mimetype?.includes("word") ||
    mimetype?.includes("officedocument.wordprocessingml.document")
  )
    return <FileWordOutlined className="text-blue-600" />;
  if (mimetype?.includes("image"))
    return <FileImageOutlined className="text-green-600" />;
  if (mimetype?.includes("video"))
    return <PlayCircleOutlined className="text-purple-600" />;
  return <FileOutlined className="text-blue-600" />;
};

interface DocumentManagementSectionProps {
  applicationId: string;
  applicationType: string;
  uploadedDocuments: any[];
  refetch: () => void;
  showUploadButton?: boolean;
}

const DocumentManagementSection: React.FC<DocumentManagementSectionProps> = ({
  applicationId,
  applicationType,
  uploadedDocuments,
  refetch,
  showUploadButton = true,
}) => {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [removeDocument] = useRemoveApplicationDocumentMutation();

  const handleRemoveDocument = async (documentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await removeDocument({
            applicationId,
            documentId,
            applicationType,
          }).unwrap();
          return true;
        } catch (err: any) {
          Swal.showValidationMessage(
            `Request failed: ${err.data?.error || err.message}`
          );
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your document has been deleted.",
          icon: "success",
          confirmButtonColor: "#2E7D32",
        });
        refetch();
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mt-0 border-b border-gray-200 pb-4 mb-4">
        Administrative Documents{" "}
      </h2>

      {uploadedDocuments?.length > 0 && (
        <div className="rounded-lg p-4">
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={uploadedDocuments}
            renderItem={(attachment: any, index: number) => (
              <List.Item key={index}>
                <Card
                  size="small"
                  className="h-full hover:shadow-md transition-shadow bg-white border border-gray-200 !p-3"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(attachment.mimetype)}
                        <Text
                          strong
                          className="text-gray-800 text-[10px] uppercase"
                        >
                          {normalizeText(attachment.documenttype)}
                        </Text>
                      </div>
                    </div>

                    <Text
                      className="text-gray-600 text-xs"
                      ellipsis={{
                        tooltip: attachment.originalname || attachment.filename,
                      }}
                    >
                      {attachment.originalname || attachment.filename}
                    </Text>

                    {(attachment.uploadedBy || attachment.uploadedAt) && (
                      <div className="flex flex-col gap-0.5 mt-1 border-t border-gray-50 pt-1">
                        {attachment.uploadedBy && (
                          <Text className="text-[10px] text-gray-400">
                            By:{" "}
                            <span className="text-gray-600 font-medium">
                              {attachment.uploadedBy}
                            </span>
                          </Text>
                        )}
                        {attachment.uploadedAt && (
                          <Text className="text-[10px] text-gray-400">
                            Date:{" "}
                            <span className="text-gray-600 font-medium">
                              {formatDate4(attachment.uploadedAt)}
                            </span>
                          </Text>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleDocumentView(attachment)}
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium text-xs"
                      >
                        View Document
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleRemoveDocument(attachment._id)}
                        className="p-0 h-auto font-medium text-xs flex items-center gap-1"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {showUploadButton && (
        <>
          <p className="text-black font-extrabold text-sm mb-4">
            Use this section to upload any administrative documents supporting
            the review or evaluation of this application. Ensure all files meet
            the required format before submission.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              type="primary"
              onClick={() => setIsUploadModalVisible(true)}
              className="bg-green-900 hover:!bg-green-700 text-white border-none"
              icon={<InboxOutlined />}
            >
              Upload Review Document
            </Button>
          </div>
        </>
      )}

      <DocumentUploadModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        applicationId={applicationId}
        applicationType={applicationType}
        onSuccess={refetch}
      />
    </div>
  );
};

export default DocumentManagementSection;
