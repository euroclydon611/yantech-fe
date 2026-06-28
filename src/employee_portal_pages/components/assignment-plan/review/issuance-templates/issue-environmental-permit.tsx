import React, { useState, useEffect } from "react";
import { Button, Input, Divider, Form, DatePicker, Upload, InputNumber } from "antd";
import { CalendarOutlined, UploadOutlined, LockOutlined, CloseCircleFilled, FilePdfOutlined, InfoCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa";
import dayjs from "dayjs";
import {
  useFetchSingleIssuedPermitQuery,
  useIssuePermitCertificateMutation,
} from "@/redux/features/employee-portal-api/authoirzations/main";
import { showError, showSuccess } from "@/lib/alert";
import axios from "axios";
import ValidityDuration from "./ValidityDuration";

interface IssueEnvironmentalPermitProps {
  applicationData: any;
  task?: any;
  isSubmitting: boolean;
  onSubmit: (issuanceData: any) => Promise<void>;
  onSave: () => Promise<void>;
}

const IssueEnvironmentalPermit: React.FC<IssueEnvironmentalPermitProps> = ({
  applicationData,
  task,
  isSubmitting,
  onSubmit,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    data: issuedPermit,
    isLoading: isLoadingPermit,
    refetch,
  } = useFetchSingleIssuedPermitQuery({
    applicationId: applicationData?._id || "",
    id: "",
  });

  const [issuePermitCertificate, { isLoading: isIssuingPermitMutation }] =
    useIssuePermitCertificateMutation();

  const getCompanyName = () => {
    if (task?.proposedIssuance?.companyName) {
      return task.proposedIssuance.companyName;
    }

    const client = applicationData?.clientId;
    const userType = client?.userType;


    switch (userType) {
      case "organization":
        return client.preferredName || client.organizationName || "";
      case "government":
        return client.preferredName || client.agencyName || "";
      default:
        return (
          client?.preferredName ||
          [client?.firstName, client?.otherNames, client?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
          ""
        );
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      certificateType: issuedPermit?.data?.certificateType || "",
      permitNumber: issuedPermit?.data?.permitNumber || "",
      companyName: getCompanyName(),
      projectDescription: issuedPermit?.data?.projectDescription || "",
      validityStartDate: issuedPermit?.data?.validityStartDate
        ? dayjs(issuedPermit.data.validityStartDate)
        : null,
      validityEndDate: issuedPermit?.data?.validityEndDate
        ? dayjs(issuedPermit.data.validityEndDate)
        : null,
      issueDate: (() => {
        const raw = issuedPermit?.data?.issueDate;
        if (!raw) return dayjs();
        const d = dayjs(raw);
        return d.isValid() && d.year() > 1970 ? d : dayjs();
      })(),
      signatoryName:
        issuedPermit?.data?.signatoryName || "PROF. NANA AMA BROWNE KLUTSE",
      signatoryTitle:
        issuedPermit?.data?.signatoryTitle || "CHIEF EXECUTIVE OFFICER",
      actYear: issuedPermit?.data?.actYear || "2025",
      actNumber: issuedPermit?.data?.actNumber || "1124",
      regulationName:
        issuedPermit?.data?.regulationName ||
        "ENVIRONMENTAL PROTECTION (ENVIRONMENTAL ASSESSMENT) REGULATIONS",
      regulationYear: issuedPermit?.data?.regulationYear || "2025",
      regulationNumber: issuedPermit?.data?.regulationNumber || "2504",
      certificationText:
        issuedPermit?.data?.certificationText || "This is to Certify that",
      authorizationText:
        issuedPermit?.data?.authorizationText ||
        "Authorisation has been given to",
      latitude: issuedPermit?.data?.latitude ?? null,
      longitude: issuedPermit?.data?.longitude ?? null,
    });
  }, [issuedPermit, form, applicationData]);

  const buildPayload = async () => {
    const values = await form.validateFields();

    if (!values.permitNumber?.trim()) {
      showError("Please enter a permit number.");
      return null;
    }

    if (!values.validityStartDate) {
      showError("Please select a validity start date.");
      return null;
    }

    if (!values.validityEndDate) {
      showError("Please select a validity end date.");
      return null;
    }

    if (values.validityEndDate.isBefore(values.validityStartDate)) {
      showError("Validity end date must be after start date.");
      return null;
    }

    const data = {
      applicationId: applicationData?._id,
      clientId: applicationData?.clientId?._id,
      certificateType: values.certificateType || "environmental_permit",
      permitNumber: values.permitNumber,
      companyName: values.companyName || "",
      projectDescription: values.projectDescription || "",
      validityStartDate: values.validityStartDate.toISOString(),
      validityEndDate: values.validityEndDate.toISOString(),
      signatoryName: values.signatoryName || "",
      signatoryTitle: values.signatoryTitle || "",
      actYear: values.actYear || "",
      actNumber: values.actNumber || "",
      regulationName: values.regulationName || "",
      regulationYear: values.regulationYear || "",
      regulationNumber: values.regulationNumber || "",
      certificationText: values.certificationText || "",
      authorizationText: values.authorizationText || "",
      issueDate: (() => {
        const d = values.issueDate || dayjs();
        return d.isValid?.() && d.year() > 1970 ? d.toISOString() : dayjs().toISOString();
      })(),
      ...(values.latitude != null ? { latitude: values.latitude } : {}),
      ...(values.longitude != null ? { longitude: values.longitude } : {}),
    };

    const file = values.file?.fileList?.[0]?.originFileObj;
    return { data, file };
  };

  const buildFormData = (data: any, file: File | null) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("file", file);
    }

    return formData;
  };

  const handleSavePermit = async () => {
    try {
      const result = await buildPayload();
      if (!result) return;

      const { data, file } = result;
      const payload = buildFormData(data, file);

      await issuePermitCertificate({ payload }).unwrap();
      showSuccess("Data saved successfully");
      
      try {
        await refetch();
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }
    } catch (error) {
      showError(error?.data?.error || error?.data?.message || error?.message || "Failed to save permit");
    }
  };

  const handleCompleteTask = async () => {
    try {
      const result = await buildPayload();
      if (!result) return;

      const { data, file } = result;
      const payload = buildFormData(data, file);

      // Save permit data first
      await issuePermitCertificate({ payload }).unwrap();

      // Refetch to ensure we have the latest state
      try {
        await refetch();
      } catch (refetchError) {
        console.warn("Refetch ignored:", refetchError);
      }

      // Submit with plain data object for preview
      await onSubmit(data);
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

  const handleFileChange = (info: any) => {
    const file = info.fileList?.[0]?.originFileObj;
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        showError("Only PDF files are allowed");
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const watched = Form.useWatch([], form);
  const pNum = watched?.permitNumber || "";
  const company = watched?.companyName || "";
  const actYear = watched?.actYear || "";
  const actNumber = watched?.actNumber || "";
  const regulationName = watched?.regulationName || "";
  const regulationYear = watched?.regulationYear || "";
  const regulationNumber = watched?.regulationNumber || "";
  const certText = watched?.certificationText || "";
  const authText = watched?.authorizationText || "";
  const projDesc = watched?.projectDescription || "";
  const sigName = watched?.signatoryName || "";
  const sigTitle = watched?.signatoryTitle || "";
  const startDate = watched?.validityStartDate ? watched.validityStartDate.format("DD MMM YYYY") : "";
  const endDate = watched?.validityEndDate ? watched.validityEndDate.format("DD MMM YYYY") : "";
  const issueDateDisplay = (() => {
    const d = watched?.issueDate;
    if (!d || !d.isValid?.() || d.year() <= 1970) return dayjs().format("DD MMM YYYY");
    return d.format("DD MMM YYYY");
  })();

  const placeholder = (text: string, fallback: string) =>
    text ? <span>{text}</span> : <span className="text-slate-300 italic">{fallback}</span>;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 flex gap-4 overflow-hidden">

        {/* ── LEFT: live certificate wireframe ── */}
        <div className="w-[42%] flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border border-slate-200 rounded-t-lg flex-shrink-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Certificate Preview</span>
            <span className="text-[10px] text-slate-400 italic">Updates as you type</span>
          </div>
          <div className="flex-1 overflow-y-auto border border-t-0 border-slate-200 rounded-b-lg bg-white">
            {/* Certificate card — mimics the issued permit layout */}
            <div
              className="mx-auto my-4 relative text-center"
              style={{
                width: "95%",
                border: "6px solid #4a7c59",
                borderRadius: 8,
                padding: "20px 18px 16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                background: "#fff",
                outline: "2px solid #c8a84b",
                outlineOffset: -10,
              }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <img src="/images/epa-logo-no-bg.png" alt="EPA" style={{ height: 52 }} />
              </div>

              {/* Authority heading */}
              <p className="text-[8px] font-bold tracking-widest text-slate-700 mb-0.5">
                ENVIRONMENTAL PROTECTION AUTHORITY
              </p>

              {/* Cursive title */}
              <p style={{ fontFamily: "cursive", fontSize: 18, color: "#1a1a1a", margin: "4px 0" }}>
                Environmental Permit
              </p>

              {/* Permit number */}
              <p className="text-[10px] font-extrabold text-slate-800 mb-2 tracking-wide">
                {placeholder(pNum, "EPA/MISC/XX/XX/XX-XXX")}
              </p>

              {/* Act line */}
              <p className="text-[7.5px] text-slate-600 mb-0.5">
                ENVIRONMENTAL PROTECTION ACT,&nbsp;
                <span className="font-bold">{placeholder(actYear, "YEAR")} (ACT {placeholder(actNumber, "NO.")})</span>
              </p>

              {/* Regulation line */}
              <p className="text-[7.5px] font-bold text-red-700 leading-tight">
                {placeholder(regulationName, "ENVIRONMENTAL PROTECTION (ENVIRONMENTAL ASSESSMENT) REGULATIONS")},&nbsp;
                {placeholder(regulationYear, "YEAR")}
              </p>
              <p className="text-[7.5px] font-bold text-red-700 mb-2">
                (LI {placeholder(regulationNumber, "NO.")})
              </p>

              {/* Certification text */}
              <p style={{ fontFamily: "cursive", fontSize: 13, color: "#1a1a1a", margin: "6px 0 2px" }}>
                {placeholder(certText, "This is to Certify that")}
              </p>

              {/* Authorization text */}
              <p className="text-[8px] text-slate-600 mb-1">
                {placeholder(authText, "Authorisation has been given to")}
              </p>

              {/* Company name */}
              <p className="text-[11px] font-extrabold text-slate-900 uppercase mb-1">
                {placeholder(company, "COMPANY / HOLDER NAME")}
              </p>

              {/* Project description */}
              <p className="text-[7.5px] text-slate-600 mb-2 leading-relaxed">
                {placeholder(projDesc, "project description will appear here...")}
              </p>

              {/* Validity period */}
              {(startDate || endDate) ? (
                <p className="text-[8.5px] font-semibold text-slate-800 mb-3">
                  From {startDate || "…"} to {endDate || "…"}
                </p>
              ) : (
                <p className="text-[8.5px] text-slate-300 italic mb-3">From [start date] to [end date]</p>
              )}

              {/* Signatory */}
              <div className="flex justify-between items-end mt-3 px-2">
                <div className="text-left">
                  <div className="border-b border-slate-400 w-32 mb-0.5" />
                  <p className="text-[7.5px] font-semibold text-slate-800">
                    {placeholder(sigName, "Signatory Name")}
                  </p>
                  <p className="text-[7px] text-slate-600 uppercase">
                    {placeholder(sigTitle, "SIGNATORY TITLE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-800">
                    {issueDateDisplay}
                  </p>
                  <p className="text-[7px] text-slate-500">Date of Issue</p>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-4 flex justify-between items-end">
                <p className="text-[6.5px] text-slate-400 text-left max-w-[55%] italic leading-tight">
                  NB: This permit is only valid when verified using the authorised EPA QR code and accompanied by the schedule to the permit.
                </p>
                <div className="w-10 h-10 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                  <span className="text-[6px] text-slate-400">QR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <h3 className="font-bold text-slate-800">
              Environmental Permit Details
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

            <Form.Item
              name="issueDate"
              label={
                <span className="font-semibold text-slate-700">
                  Date of Issue <span className="text-red-500">*</span>
                  <span className="ml-2 text-[10px] font-normal text-slate-400">
                    (appears on the permit)
                  </span>
                </span>
              }
              rules={[{ required: true, message: "Please select the date of issue" }]}
            >
              <DatePicker
                className="w-full"
                placeholder="Select issue date"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="validityStartDate"
                label={
                  <span className="font-semibold text-slate-700">
                    Validity Start Date <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select validity start date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select start date"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="validityEndDate"
                label={
                  <span className="font-semibold text-slate-700">
                    Validity End Date <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select validity end date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select end date"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </div>

            <ValidityDuration
              form={form}
              issueDateName="validityStartDate"
              expiryDateName="validityEndDate"
            />

            <Divider className="my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="signatoryName"
                label={
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Signatory Name <LockOutlined className="text-slate-400 text-[11px]" />
                  </span>
                }
              >
                <Input
                  placeholder="e.g., PROF. NANA AMA BROWNE KLUTSE"
                  className="border-slate-300 !bg-slate-50 !cursor-default"
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="signatoryTitle"
                label={
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Signatory Title <LockOutlined className="text-slate-400 text-[11px]" />
                  </span>
                }
              >
                <Input
                  placeholder="e.g., AG. CHIEF EXECUTIVE OFFICER"
                  className="border-slate-300 !bg-slate-50 !cursor-default"
                  readOnly
                />
              </Form.Item>
            </div>

            {/* <Divider className="my-2" /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" hidden>
              <Form.Item
                name="actYear"
                label={
                  <span className="font-semibold text-slate-700">Act Year</span>
                }
              >
                <Input placeholder="e.g., 2025" className="border-slate-300" />
              </Form.Item>

              <Form.Item
                name="actNumber"
                label={
                  <span className="font-semibold text-slate-700">
                    Act Number
                  </span>
                }
              >
                <Input placeholder="e.g., 1124" className="border-slate-300" />
              </Form.Item>
            </div>

            {/* <Divider className="my-2" /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" hidden>
              <Form.Item
                name="regulationName"
                label={
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Regulation Name <LockOutlined className="text-slate-400 text-[11px]" />
                  </span>
                }
              >
                <Input.TextArea
                  placeholder="e.g., ENVIRONMENTAL ASSESSMENT REGULATIONS"
                  className="border-slate-300 !bg-slate-50 !cursor-default"
                  rows={3}
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="regulationYear"
                label={
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    Regulation Year <LockOutlined className="text-slate-400 text-[11px]" />
                  </span>
                }
              >
                <Input placeholder="e.g., 1999" className="border-slate-300 !bg-slate-50 !cursor-default" readOnly />
              </Form.Item>
            </div>

            <Form.Item
              name="regulationNumber"
              label={
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Regulation Number <LockOutlined className="text-slate-400 text-[11px]" />
                </span>
              }
              hidden
            >
              <Input placeholder="e.g., 1652" className="border-slate-300 !bg-slate-50 !cursor-default" readOnly />
            </Form.Item>

            {/* <Divider className="my-2" /> */}

            <Form.Item
              name="certificationText"
              label={
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Certification Text <LockOutlined className="text-slate-400 text-[11px]" />
                </span>
              }
              hidden
            >
              <Input.TextArea
                placeholder="e.g., This is to Certify that..."
                rows={3}
                className="border-slate-300 !bg-slate-50 !cursor-default"
                readOnly
              />
            </Form.Item>

            <Form.Item
              name="authorizationText"
              label={
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Authorization Text <LockOutlined className="text-slate-400 text-[11px]" />
                </span>
              }
              hidden
            >
              <Input.TextArea
                placeholder="e.g., Authorisation has been given to..."
                rows={3}
                className="border-slate-300 !bg-slate-50 !cursor-default"
                readOnly
              />
            </Form.Item>

            <Divider className="my-2" />

            {/* Location coordinates — optional */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <EnvironmentOutlined /> Project Location <span className="font-normal text-slate-400 normal-case tracking-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="latitude"
                  label={<span className="font-semibold text-slate-700">Latitude</span>}
                  className="!mb-0"
                >
                  <InputNumber
                    className="w-full"
                    placeholder="e.g. 5.6037"
                    step={0.000001}
                    min={-90}
                    max={90}
                    stringMode={false}
                  />
                </Form.Item>
                <Form.Item
                  name="longitude"
                  label={<span className="font-semibold text-slate-700">Longitude</span>}
                  className="!mb-0"
                >
                  <InputNumber
                    className="w-full"
                    placeholder="e.g. -0.1870"
                    step={0.000001}
                    min={-180}
                    max={180}
                    stringMode={false}
                  />
                </Form.Item>
              </div>
            </div>

            <Divider className="my-2" />

            <Form.Item
              name="projectDescription"
              label={
                <span className="font-semibold text-slate-700">
                  Project Description
                </span>
              }
            >
              <Input.TextArea
                placeholder="e.g., located at Dompem in the Tarkwa Nsuaem Municipality of the Western Region to commence with its Surface Exploration for Gold Project"
                rows={3}
                className="border-slate-300"
              />
            </Form.Item>

            <Divider className="my-2" />

            <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800 flex gap-2 items-start">
              <InfoCircleOutlined className="mt-0.5 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Important:</strong> The details entered above (Permit Number, Validity Dates, Signatory, Certification Text, etc.) must exactly match the information on the permit schedule you upload below. Any discrepancy between the certificate and the schedule may render the permit invalid.
              </span>
            </div>

            {issuedPermit?.data?.schedulePdfUrl && !selectedFile && (
              <div className="mb-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-xs text-blue-800 flex gap-2 items-start">
                <InfoCircleOutlined className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>
                  A permit schedule has already been uploaded for this permit. If you upload a new file below, it will <strong>replace the existing schedule</strong>.
                </span>
              </div>
            )}

            {issuedPermit?.data?.schedulePdfUrl && selectedFile && (
              <div className="mb-3 rounded-lg border border-orange-300 bg-orange-50 px-4 py-3 text-xs text-orange-800 flex gap-2 items-start">
                <InfoCircleOutlined className="mt-0.5 flex-shrink-0 text-orange-500" />
                <span>
                  <strong>Heads up:</strong> You have selected a new file. Saving will <strong>replace the previously uploaded schedule</strong> with this new document.
                </span>
              </div>
            )}

            <Form.Item
              name="file"
              label={
                <span className="font-semibold text-slate-700">
                  Upload Final Permit Schedule{" "}
                  <span className="font-normal text-slate-500">(PDF only)</span>
                </span>
              }
            >
              <Upload.Dragger
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                showUploadList={false}
              >
                {selectedFile ? (
                  <div className="relative flex flex-col items-center justify-center py-4 px-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        form.setFieldValue("file", null);
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full leading-none border-0 cursor-pointer p-0"
                      title="Remove file"
                    >
                      <CloseCircleFilled style={{ fontSize: 20 }} />
                    </button>
                    <FilePdfOutlined className="text-red-500 text-4xl mb-2" />
                    <p className="font-semibold text-slate-700 text-sm text-center truncate max-w-[90%]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : issuedPermit?.data?.schedulePdfUrl ? (
                  <div className="flex flex-col items-center justify-center py-4 px-6 gap-1">
                    <FilePdfOutlined className="text-green-600 text-4xl" />
                    <p className="font-semibold text-green-700 text-sm mt-1">
                      Schedule already uploaded
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                      Click or drag a new PDF here to replace the existing schedule
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag the final Permit Schedule (PDF) here to upload
                    </p>
                    <p className="ant-upload-hint">
                      This is the official schedule document that accompanies the issued permit. PDF format only. Ensure all details on the schedule match the information provided in the form above.
                    </p>
                  </>
                )}
              </Upload.Dragger>
            </Form.Item>
          </Form>
          </div>
        </div>

      </div>{/* end flex row */}

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
            Save
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

export default IssueEnvironmentalPermit;
