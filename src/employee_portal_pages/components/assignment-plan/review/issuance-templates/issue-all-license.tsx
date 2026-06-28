import React, { useEffect } from "react";
import {
  Button,
  Input,
  Divider,
  Form,
  DatePicker,
  Card,
  Typography,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useFetchIssuedLicenseSectionsQuery,
  useEditIssuedLicenseSectionsMutation,
  useIssueLicenseMutation,
  useFetchSingleIssuedLicenseQuery,
} from "@/redux/features/employee-portal-api/authoirzations/main";
import { showError, showSuccess } from "@/lib/alert";
import axios from "axios";
import ValidityDuration from "./ValidityDuration";

const { Title, Text } = Typography;

interface IssueLicenseProps {
  applicationData: any;
  task?: any;
  isSubmitting: boolean;
  onSubmit: (issuanceData: any) => Promise<void>;
  onSave: () => Promise<void>;
}

interface QuillWrapperProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  formats?: string[];
  modules?: any;
  className?: string;
  onContentChange?: () => void;
}

const QuillWrapper: React.FC<QuillWrapperProps> = ({
  value,
  onChange,
  readOnly,
  formats,
  modules,
  className,
  onContentChange
}) => {
  const handleChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
    if (onContentChange) {
      onContentChange();
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={handleChange}
      readOnly={readOnly}
      formats={formats}
      modules={modules}
      className={className}
    />
  );
};

const IssueAllLicense: React.FC<IssueLicenseProps> = ({
  applicationData,
  task,
  isSubmitting,
  onSubmit,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [sectionsModified, setSectionsModified] = React.useState(false);

  const { licenseType, licenseCategory } = applicationData;

  const {
    data: issuedLicense,
    isLoading: isLoadingLicense,
    refetch,
  } = useFetchSingleIssuedLicenseQuery({
    applicationId: applicationData?._id || "",
    id: "",
  });


  const { data: licenseSections, refetch: refetchSections } =
    useFetchIssuedLicenseSectionsQuery(
      {
        id: issuedLicense?.data?._id,
      },
      {
        skip: !issuedLicense?.data?._id,
      }
    );


  const [issueLicense, { isLoading: isIssuingLicenseMutation }] =
    useIssueLicenseMutation();

  const [editIssuedLicenseSections, { isLoading: isUpdatingSections }] =
    useEditIssuedLicenseSectionsMutation();

  const getCompanyName = () => {
    // Check various locations for client data
    const client =
      applicationData?.clientId ||
      applicationData?.clientDetails ||
      applicationData?.client;

    if (!client) return "";

    const userType = client?.userType;

    console.log("clientclient",)

    switch (userType) {
      case "individual":
      case "agent": {
        const firstName = client.firstName || "";
        const otherNames = client.otherNames || "";
        const lastName = client.lastName || "";
        return (
          client.preferredName ||
          `${firstName} ${otherNames} ${lastName}`.replace(/\s+/g, " ").trim()
        );
      }
      case "organization":
        return client.preferredName || client.organizationName || client.companyName || "";
      case "government":
        return client.preferredName || client.agencyName || "";
      default:
        if (client.preferredName) return client.preferredName;
        if (client.organizationName || client.companyName) {
          return client.organizationName || client.companyName;
        }
        if (client.firstName || client.lastName) {
          return `${client.firstName || ""} ${client.lastName || ""}`.trim();
        }
        return "";
    }
  };

  useEffect(() => {
    const licenseData = issuedLicense?.data;

    form.setFieldsValue({
      licenseType: licenseData?.licenseType || "",
      licenseNumber: licenseData?.licenseNumber || "",
      companyName: licenseData?.companyName || getCompanyName(),
      issueDate: licenseData?.issueDate ? dayjs(licenseData.issueDate) : null,
      expiryDate: licenseData?.expiryDate
        ? dayjs(licenseData.expiryDate)
        : null,
    });

    if (licenseSections?.data?.sections) {
      console.log("Loading sections into form:", licenseSections.data.sections);
      form.setFieldsValue({
        sections: licenseSections.data.sections,
      });
      // Reset section modification flag when fresh sections load
      setSectionsModified(false);
    }
  }, [issuedLicense, licenseSections, form]);

  const cleanSections = (sections: any[]) => {
    if (!sections) return [];
    return sections.map((sec: any) => {
      let content = sec.renderedContent || "";

      // 1. Strip the variable pill spans but keep their content
      content = content.replace(
        /<span class="variable-pill"[^>]*>(.*?)<\/span>/g,
        "$1"
      );

      // 2. Convert common HTML back to Markdown for the backend
      // Headers
      content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gim, "# $1\n");
      content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gim, "## $1\n");
      content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gim, "### $1\n");

      // Bold
      content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gim, "**$1**");
      content = content.replace(/<b[^>]*>(.*?)<\/b>/gim, "**$1**");

      // Italics
      content = content.replace(/<em[^>]*>(.*?)<\/em>/gim, "*$1*");
      content = content.replace(/<i[^>]*>(.*?)<\/i>/gim, "*$1*");

      // Paragraphs - preserve line breaks
      // Convert <p> tags but keep their content
      content = content.replace(/<p[^>]*>(.*?)<\/p>/gims, "$1\n");

      // Preserve <br> tags as-is (backend expects them)
      content = content.replace(/<br\s*\/?>/gim, "<br>");

      // 3. Final cleanup: strip any remaining HTML tags
      content = content.replace(/<[^>]+>/g, "");

      // 4. Decode common HTML entities
      content = content.replace(/&nbsp;/g, " ");
      content = content.replace(/&amp;/g, "&");
      content = content.replace(/&lt;/g, "<");
      content = content.replace(/&gt;/g, ">");

      return {
        sectionId: sec.sectionId,
        content: content.trim(),
      };
    });
  };

  const buildPayload = async () => {
    const values = await form.validateFields();

    if (!values.licenseNumber?.trim()) {
      showError("Please enter a license number.");
      return null;
    }

    if (!values.issueDate) {
      showError("Please select an issue date.");
      return null;
    }

    if (!values.expiryDate) {
      showError("Please select an expiry date.");
      return null;
    }

    if (values.expiryDate.isBefore(values.issueDate)) {
      showError("Expiry date must be after issue date.");
      return null;
    }

    const data = {
      licenseApplicationId: applicationData?._id,
      licenseId: issuedLicense?.data?._id,
      applicationId: applicationData?._id,
      clientId: applicationData?.clientId?._id,
      licenseType: values.licenseType || `${licenseType}_${licenseCategory}`,
      licenseNumber: values.licenseNumber,
      companyName: values.companyName || getCompanyName() || "",
      issueDate: values.issueDate.toISOString(),
      expiryDate: values.expiryDate.toISOString(),
      validityStartDate: values.issueDate.toISOString(),
      validityEndDate: values.issueDate.toISOString(),
      issuanceDate: new Date().toISOString(),
      sections: values.sections,
    };

    return data;
  };

  const handleSaveLicense = async () => {
    try {
      const payload = await buildPayload();
      if (!payload) return;

      const { sections, ...licensePayload } = payload;

      // Save/issue the license (backend clears renderedContent if dates/companyName changed)
      const result = await issueLicense({ payload: licensePayload }).unwrap();

      // Refetch to get updated license and regenerated sections
      // Use try-catch for refetch to avoid "query not started" errors on first save
      try {
        await refetch();
        if (result?.data?._id || issuedLicense?.data?._id) {
          await refetchSections();
        }
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }

      showSuccess("License data saved successfully");
    } catch (error) {
      console.log("erroroccured", error)
      showError(error?.data?.error || error?.data?.message || error?.message || "Failed to save license");
    }
  };

  const handleSaveSections = async () => {
    try {
      const sections = form.getFieldValue("sections");
      console.log("Raw sections from form:", sections);
      
      if (!sections || sections.length === 0) {
        showError("No sections to save");
        return;
      }

      const readOnlySections = ['licensee_info', 'header', 'validity', 'ghana_seal'];
      const editableSections = sections.filter((sec: any) => !readOnlySections.includes(sec.sectionId));
      
      if (editableSections.length === 0) {
        showError("No editable sections to save");
        return;
      }

      const cleanedSections = cleanSections(editableSections);
      console.log("Cleaned sections to send:", cleanedSections);
      
      await editIssuedLicenseSections({
        id: issuedLicense?.data?._id,
        payload: { sections: cleanedSections },
      }).unwrap();

      setSectionsModified(false);
      showSuccess("Section edits saved successfully");
    } catch (error) {
      showError(error?.data?.error || error?.data?.message || error?.message || "Failed to save sections");
    }
  };

  const handleCompleteTask = async () => {
    try {
      const payload = await buildPayload();
      if (!payload) return;

      const { sections, ...licensePayload } = payload;

      // Save license data (backend will clear renderedContent if dates/companyName changed)
      await issueLicense({ payload: licensePayload }).unwrap();

      // Refetch to ensure we have the latest state
      try {
        await refetch();
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }

      // Submit (sections will be regenerated automatically if needed)
      await onSubmit(licensePayload);
    } catch (error) {
      showError("Failed to complete task");
    }
  };

  const handleViewLicense = async (licenseId: string, productId?: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/licenses/pdf?licenseId=${licenseId}&productId=${productId}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error) {
      showError(
        error?.response?.data?.error ||
          "Something went wrong while fetching the license."
      );
      console.error("Failed to fetch license document:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <style>{`
        .variable-pill {
          background-color: #f0f7ff !important;
          color: #0050b3 !important;
          border: 1px solid #91d5ff !important;
          padding: 0 4px !important;
          border-radius: 4px !important;
          font-weight: 500 !important;
          display: inline-block !important;
          margin: 0 2px !important;
        }
        .ql-container {
          font-size: 14px !important;
          font-family: inherit !important;
        }
        .ql-editor {
          min-height: 150px !important;
        }
      `}</style>
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-bold text-slate-800">License Details</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item
              name="licenseNumber"
              label={
                <span className="font-semibold text-slate-700">
                  License Number <span className="text-red-500">*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a license number",
                },
              ]}
            >
              <Input
                placeholder="e.g., EPA/HQ/ME1/0057846/25/SE"
                className="border-slate-300"
              />
            </Form.Item>

            <Form.Item
              name="companyName"
              label={
                <span className="font-semibold text-slate-700">
                  Company Name / Holder
                </span>
              }
            >
              <Input
                placeholder="e.g., DPEPS COMPANY LIMITED"
                className="border-slate-300"
              />
            </Form.Item>

            <Divider className="my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="issueDate"
                label={
                  <span className="font-semibold text-slate-700">
                    Issue Date <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select issue date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select issue date"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="expiryDate"
                label={
                  <span className="font-semibold text-slate-700">
                    Expiry Date <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select expiry date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select expiry date"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </div>

            <ValidityDuration form={form} />

            <Divider className="my-2" />

            <div className="mt-6">
              <Title level={5} className="mb-4">
                Document Sections
              </Title>
              <Form.List name="sections">
                {(fields) => (
                  <div className="space-y-6">
                    {fields.map(({ key, name, ...restField }) => {
                      const section = form.getFieldValue(["sections", name]);
                      const isLocked = ['licensee_info', 'header', 'validity', 'ghana_seal'].includes(section?.sectionId);
                      return (
                        <Card
                          key={key}
                          size="small"
                          title={
                            <div className="flex items-center gap-2">
                              <Text strong>
                                {section?.title || `Section ${name + 1}`}
                              </Text>
                              {isLocked && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-300">
                                  🔒 Read-only
                                </span>
                              )}
                            </div>
                          }
                          className="border-slate-200 shadow-sm"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "sectionId"]}
                            hidden
                          >
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            hidden
                          >
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "order"]}
                            hidden
                          >
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "isEditable"]}
                            hidden
                          >
                            <Input type="hidden" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "renderedContent"]}
                          >
                            <QuillWrapper
                              className="bg-white"
                              readOnly={!section?.isEditable || ['licensee_info', 'header', 'validity', 'ghana_seal'].includes(section?.sectionId)}
                              onContentChange={() => setSectionsModified(true)}
                              formats={[
                                "header",
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                                "list",
                                "bullet",
                                "link",
                                "color",
                                "background",
                                "align",
                                "script",
                                "sub",
                                "super",
                                "code-block",
                                "direction",
                                "font",
                                "size",
                              ]}
                              modules={{
                                toolbar: section?.isEditable
                                  ? [
                                      [{ header: [1, 2, 3, false] }],
                                      [
                                        "bold",
                                        "italic",
                                        "underline",
                                        "strike",
                                        "blockquote",
                                      ],
                                      [{ list: "ordered" }, { list: "bullet" }],
                                      ["link"],
                                      ["clean"],
                                    ]
                                  : false,
                              }}
                            />
                          </Form.Item>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Form.List>
            </div>
          </Form>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 p-4">
        <div className="flex gap-2">
          <Button
            icon={<FaFilePdf />}
            onClick={() => handleViewLicense(issuedLicense?.data?._id)}
            disabled={
              !issuedLicense?.data || isIssuingLicenseMutation || isSubmitting
            }
            className="text-red-600 border-red-600 hover:!text-red-700 hover:!border-red-700"
          >
            View License
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={isIssuingLicenseMutation || isSubmitting}
            onClick={handleSaveLicense}
            loading={isIssuingLicenseMutation}
            className="!bg-green-600 hover:!bg-green-700 !text-white"
          >
            Save License Data
          </Button>
          <Button
            disabled={isUpdatingSections || !sectionsModified || isSubmitting}
            onClick={handleSaveSections}
            loading={isUpdatingSections}
            className="!bg-purple-600 hover:!bg-purple-700 !text-white disabled:!bg-gray-300"
          >
            Save Section Edits
          </Button>
          <Button
            type="primary"
            onClick={handleCompleteTask}
            loading={isSubmitting}
            disabled={
              isSubmitting || isIssuingLicenseMutation || !issuedLicense?.data
            }
            className="!bg-blue-600 hover:!bg-blue-700 disabled:!bg-gray-100"
          >
            Complete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueAllLicense;
