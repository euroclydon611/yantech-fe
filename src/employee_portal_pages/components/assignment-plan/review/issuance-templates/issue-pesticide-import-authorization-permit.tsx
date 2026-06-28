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
  useFetchSingleIssuedPermitQuery,
  useIssuePermitMutation,
  useFetchIssuedPermitSectionsQuery,
  useEditIssuedPermitSectionsMutation,
} from "@/redux/features/employee-portal-api/authoirzations/main";
import { showError, showSuccess } from "@/lib/alert";
import axios from "axios";
import ValidityDuration from "./ValidityDuration";

const { Title, Text } = Typography;

interface IssuePesticideImportAuthorizationPermitProps {
  applicationData: any;
  task?: any;
  isSubmitting: boolean;
  onSubmit: (issuanceData: any) => Promise<void>;
  onSave: () => Promise<void>;
}

const IssuePesticideImportAuthorizationPermit: React.FC<
  IssuePesticideImportAuthorizationPermitProps
> = ({ applicationData, task, isSubmitting, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const [sectionsModified, setSectionsModified] = React.useState(false);

  const {
    data: issuedPermit,
    isLoading: isLoadingPermit,
    refetch,
  } = useFetchSingleIssuedPermitQuery({
    applicationId: applicationData?._id || "",
    id: "",
  });

  const { data: permitSections, refetch: refetchSections } =
    useFetchIssuedPermitSectionsQuery(
      {
        id: issuedPermit?.data?._id,
      },
      {
        skip: !issuedPermit?.data?._id,
      }
    );

  // console.log("permitSections", permitSections);
  // console.log("issuedPermit", issuedPermit?.data?._id);

  const [issuePermit, { isLoading: isIssuingPermitMutation }] =
    useIssuePermitMutation();

  const [editIssuedPermitSections, { isLoading: isUpdatingSections }] =
    useEditIssuedPermitSectionsMutation();

  const getCompanyName = () => {
    // Check various locations for client data
    const client =
      applicationData?.clientDetails ||
      applicationData?.clientId ||
      applicationData?.client;

    if (!client) return "";

    const userType = client?.userType;

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
    const permitData = issuedPermit?.data;

    form.setFieldsValue({
      permitType: permitData?.permitType || "",
      permitNumber: permitData?.permitNumber || "",
      companyName: permitData?.companyName || getCompanyName(),
      issueDate: permitData?.issueDate ? dayjs(permitData.issueDate) : null,
      expiryDate: permitData?.expiryDate ? dayjs(permitData.expiryDate) : null,
    });

    if (permitSections?.data?.sections) {
      form.setFieldsValue({
        sections: permitSections.data.sections,
      });
      // Reset section modification flag when fresh sections load
      setSectionsModified(false);
    }
  }, [issuedPermit, permitSections, form]);

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

    if (!values.permitNumber?.trim()) {
      showError("Please enter a permit number.");
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
      permitApplicationId: applicationData?._id,
      permitId: issuedPermit?.data?._id,
      applicationId: applicationData?._id,
      clientId: applicationData?.clientId?._id,
      permitType: values.permitType || "pesticide_import_authorization",
      permitNumber: values.permitNumber,
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

  const handleSavePermit = async () => {
    try {
      const payload = await buildPayload();
      if (!payload) return;

      const { sections, ...permitPayload } = payload;

      // Save/issue the permit (backend clears renderedContent if dates/companyName changed)
      const result = await issuePermit({ payload: permitPayload }).unwrap();

      // Refetch to get updated permit and regenerated sections
      try {
        await refetch();
        if (issuedPermit?.data?._id) {
          await refetchSections();
        }
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }

      showSuccess("Permit data saved successfully");
    } catch (error) {
      showError(error?.data?.error || error?.data?.message || error?.message || "Failed to save permit");
    }
  };

  const handleSaveSections = async () => {
    try {
      const sections = form.getFieldValue("sections");
      if (!sections || sections.length === 0) {
        showError("No sections to save");
        return;
      }

      const cleanedSections = cleanSections(sections);
      await editIssuedPermitSections({
        id: issuedPermit?.data?._id,
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

      const { sections, ...permitPayload } = payload;

      // Save permit data (backend will clear renderedContent if dates/companyName changed)
      await issuePermit({ payload: permitPayload }).unwrap();

      // Refetch to ensure we have the latest state
      try {
        await refetch();
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }

      // Submit (sections will be regenerated automatically if needed)
      await onSubmit(permitPayload);
    } catch (error) {
      showError("Failed to complete task");
    }
  };

  const handleViewCertificate = async (
    permitId: string,
    productId?: string
  ) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }authorization/permits/pdf?permitId=${permitId}&productId=${productId}`,
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
          "Something went wrong while fetching the permit."
      );
      console.error("Failed to fetch permit document:", error);
    }
  };

  const handleViewPermitSchedule = async (permitId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_SERVER_URI_HR
        }revenue/certificate/schedule-pdf?certificateId=${permitId}&fileType=schedule`,
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
          "Something went wrong while fetching the schedule."
      );
      console.error("Failed to fetch schedule document:", error);
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
          <h3 className="font-bold text-slate-800">
            Pesticide Import Authorization Details
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item
              name="permitNumber"
              label={
                <span className="font-semibold text-slate-700">
                  Permit Number <span className="text-red-500">*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a permit number",
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
                      return (
                        <Card
                          key={key}
                          size="small"
                          title={
                            <Text strong>
                              {section?.title || `Section ${name + 1}`}
                            </Text>
                          }
                          className="border-slate-200 shadow-sm"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "renderedContent"]}
                          >
                            <ReactQuill
                              theme="snow"
                              className="bg-white"
                              readOnly={!section?.isEditable || ['header', 'granted_to', 'signature'].includes(section?.sectionId)}
                              onChange={() => setSectionsModified(true)}
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
                                toolbar: section?.isEditable && !['header', 'granted_to', 'signature'].includes(section?.sectionId)
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
            onClick={() => handleViewCertificate(issuedPermit?.data?._id)}
            disabled={
              !issuedPermit?.data || isIssuingPermitMutation || isSubmitting
            }
            className="text-red-600 border-red-600 hover:!text-red-700 hover:!border-red-700"
          >
            View Permit
          </Button>
          <Button
            icon={<FaFilePdf />}
            onClick={() => handleViewPermitSchedule(issuedPermit?.data?._id)}
            disabled={
              !issuedPermit?.data?.schedulePdfUrl ||
              isIssuingPermitMutation ||
              isSubmitting
            }
            className="!text-white !bg-yellow-600 hover:!bg-yellow-700 hover:!text-white"
            hidden={!issuedPermit?.data?.schedulePdfUrl}
          >
            View Permit Schedule
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={isIssuingPermitMutation || isSubmitting}
            onClick={handleSavePermit}
            loading={isIssuingPermitMutation}
            className="!bg-green-600 hover:!bg-green-700 !text-white"
          >
            Save Permit Data
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
              isSubmitting || isIssuingPermitMutation || !issuedPermit?.data
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

export default IssuePesticideImportAuthorizationPermit;
