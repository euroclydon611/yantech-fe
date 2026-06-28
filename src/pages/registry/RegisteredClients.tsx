import { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  Drawer,
  Pagination,
  Table,
  Tooltip,
  Select,
  Tag,
  Space,
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Divider,
  Tabs,
  Badge,
  Modal,
  Spin,
  Alert,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList } from "react-icons/md";
import { EditOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined, UserAddOutlined, FileTextOutlined, DownloadOutlined } from "@ant-design/icons";
import {
  useRegisteredClientsRegisterQuery,
  useRegistrationAttemptsQuery,
  useLazyGetAttemptInvoiceDetailsQuery,
  useLazyExportRegistrationAttemptsQuery,
  useAdminCompleteRegistrationMutation,
  useUpdateRegisteredClientMutation,
} from "../../redux/features/general/registry";
import {
  capitalizeFirstLetter,
  formatDate2,
  formatDate4,
  normalizeText,
} from "../../utils/helperFunction";
import type { IEpaClient } from "../../employee_portal_pages/types/client";

const { Option } = Select;

const USER_TYPES = [
  { value: "individual", label: "Individual Applicant" },
  { value: "organization", label: "Organization / Company" },
  { value: "government", label: "Government Agency" },
  { value: "agent", label: "Agent / Consultant" },
];

const COMPANY_TYPES = [
  "Limited Liability Company",
  "Public Limited Company",
  "Sole Proprietorship",
  "Partnership",
  "Non-Governmental Organization",
  "Trust",
  "Other",
];

const INSTITUTION_TYPES = [
  "Ministry",
  "Department",
  "Agency",
  "Authority",
  "Metropolitan Assembly",
  "Municipal Assembly",
  "District Assembly",
  "Regulatory Body",
  "Commission",
  "Public Corporation",
  "State-Owned Enterprise",
  "Other (Industry / Business Sector)",
  "Other",
];

const JURISDICTION_LEVELS = ["National", "Regional", "District", "Municipal", "Metropolitan", "Other"];

const GOV_SECTORS = [
  "Agriculture",
  "Chieftaincy & Religious Affairs",
  "Communications & Information",
  "Defense",
  "Education",
  "Energy",
  "Environment",
  "Finance",
  "Fisheries & Aquaculture",
  "Foreign Affairs",
  "Gender, Children & Social Protection",
  "Health",
  "Interior & Security",
  "Justice & Attorney General",
  "Lands & Natural Resources",
  "Local Government",
  "Planning & National Development",
  "Science & Technology",
  "Tourism & Culture",
  "Trade & Industry",
  "Transport",
  "Water & Sanitation",
  "Works & Housing",
  "Youth & Sports",
  "Employment & Labour",
  "Other",
];

const INDUSTRY_SECTORS = [
  "Agriculture & Agro-processing",
  "Chemical & Petrochemical",
  "Construction",
  "Education",
  "Energy & Utilities",
  "Financial Services",
  "Food & Beverage",
  "Healthcare & Pharmaceuticals",
  "Hospitality & Tourism",
  "ICT & Telecommunications",
  "Manufacturing",
  "Mining & Quarrying",
  "Oil & Gas",
  "Real Estate",
  "Retail & Trade",
  "Transport & Logistics",
  "Waste Management",
  "Other",
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3 mt-5">
    <div className="w-1 h-4 bg-green-700 rounded" />
    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {children}
    </span>
  </div>
);

const ClientEditDrawer = ({
  client,
  open,
  onClose,
  onSaved,
}: {
  client: IEpaClient | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: any) => void;
}) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<string>("");
  const [updateClient, { isLoading }] = useUpdateRegisteredClientMutation();

  const handleOpen = () => {
    if (!client) return;
    setSelectedType(client.userType || "");
    form.setFieldsValue({
      userType: client.userType,
      firstName: client.firstName,
      lastName: client.lastName,
      otherNames: client.otherNames,
      email: client.email,
      phone: client.phone,
      nationality: client.nationality,
      nationalIdNumber: client.nationalIdNumber,
      contactPersonPosition: client.contactPersonPosition,
      organizationName: client.organizationName,
      registrationNumber: client.registrationNumber,
      companyType: client.companyType,
      companyTIN: client.companyTIN,
      industrySector: client.industrySector,
      orgEmail: client.orgEmail,
      orgPhone: client.orgPhone,
      agencyName: client.agencyName,
      agencyAcronym: client.agencyAcronym,
      institutionType: client.institutionType,
      jurisdictionLevel: client.jurisdictionLevel,
      sector: client.sector,
      accreditingBody: client.accreditingBody,
      accreditationNumber: client.accreditationNumber,
      consultingCompanyName: client.consultingCompanyName,
      agentAddress: client.agentAddress,
      companyEmail: client.companyEmail,
      companyPhone: client.companyPhone,
      region: client.address?.region,
      district: client.address?.district,
      city: client.address?.city,
      address: client.address?.address,
      gps: client.address?.gps,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { region, district, city, address: streetAddress, gps, ...rest } = values;
      const payload = {
        ...rest,
        address: { region, district, city, address: streetAddress, gps },
      };
      const res = await updateClient({ id: client!._id, body: payload }).unwrap();
      message.success("Client profile updated successfully.");
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.data?.message || "Failed to update client.");
    }
  };

  const isOrgOrGov = selectedType === "organization" || selectedType === "government";

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-green-700" />
          <span className="font-semibold text-gray-800">Edit Client Profile</span>
          {client && (
            <Tag color="blue" className="ml-2 font-mono text-[10px]">
              {client.clientId}
            </Tag>
          )}
        </div>
      }
      open={open}
      onClose={onClose}
      afterOpenChange={(vis) => { if (vis) handleOpen(); }}
      width={window.innerWidth > 768 ? 680 : "100%"}
      destroyOnClose
      footer={
        <div className="flex justify-end gap-3 py-2">
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={handleSave}
            className="bg-green-700 hover:!bg-green-800"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" size="middle">

        <SectionLabel>Account Type</SectionLabel>
        <Form.Item name="userType" label="Account Type" rules={[{ required: true }]}>
          <Select
            onChange={(v) => { setSelectedType(v); }}
            placeholder="Select type"
          >
            {USER_TYPES.map((t) => (
              <Option key={t.value} value={t.value}>{t.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <SectionLabel>
          {isOrgOrGov ? "Contact Person Details" : "Personal Details"}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item name="otherNames" label="Other Name(s)">
            <Input placeholder="Other names" />
          </Form.Item>
          {isOrgOrGov && (
            <Form.Item name="contactPersonPosition" label="Position / Title" rules={[{ required: true }]}>
              <Input placeholder="e.g. CEO, Director, Manager" />
            </Form.Item>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="e.g. 233503390628" />
          </Form.Item>
        </div>

        {(selectedType === "individual" || selectedType === "agent") && (
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="nationality" label="Nationality">
              <Input placeholder="e.g. Ghanaian" />
            </Form.Item>
            <Form.Item name="nationalIdNumber" label="Ghana Card No.">
              <Input placeholder="GHA-XXXXXXXXX-X" />
            </Form.Item>
          </div>
        )}

        {selectedType === "organization" && (
          <>
            <SectionLabel>Organisation Details</SectionLabel>
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item name="organizationName" label="Registered Company Name" rules={[{ required: true }]} className="col-span-2">
                <Input placeholder="Company name as registered" />
              </Form.Item>
              <Form.Item name="registrationNumber" label="Business Reg. Number" rules={[{ required: true }]}>
                <Input placeholder="e.g. CS-12345" />
              </Form.Item>
              <Form.Item name="companyTIN" label="Company TIN" rules={[{ required: true }]}>
                <Input placeholder="e.g. C006137041X" />
              </Form.Item>
              <Form.Item name="companyType" label="Company Type" rules={[{ required: true }]}>
                <Select placeholder="Select company type">
                  {COMPANY_TYPES.map((t) => <Option key={t} value={t}>{t}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="industrySector" label="Industry / Business Sector" rules={[{ required: true }]}>
                <Select placeholder="Select sector" showSearch>
                  {INDUSTRY_SECTORS.map((s) => <Option key={s} value={s}>{s}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="orgEmail" label="Organization Email (optional)">
                <Input type="email" placeholder="e.g. info@company.com" />
              </Form.Item>
              <Form.Item name="orgPhone" label="Organization Phone (optional)">
                <Input placeholder="e.g. 233XXXXXXXXX" />
              </Form.Item>
            </div>
          </>
        )}

        {selectedType === "government" && (
          <>
            <SectionLabel>Government Agency Details</SectionLabel>
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item name="agencyName" label="Agency / Department Name" rules={[{ required: true }]} className="col-span-2">
                <Input placeholder="Full official name" />
              </Form.Item>
              <Form.Item name="agencyAcronym" label="Acronym">
                <Input placeholder="e.g. EPA, KNUST" />
              </Form.Item>
              <Form.Item name="institutionType" label="Institution Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  {INSTITUTION_TYPES.map((t) => <Option key={t} value={t}>{t}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="jurisdictionLevel" label="Jurisdiction Level" rules={[{ required: true }]}>
                <Select placeholder="Select level">
                  {JURISDICTION_LEVELS.map((l) => <Option key={l} value={l}>{l}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="sector" label="Sector" rules={[{ required: true }]}>
                <Select placeholder="Select sector" showSearch>
                  {GOV_SECTORS.map((s) => <Option key={s} value={s}>{s}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="orgEmail" label="Agency Email (optional)">
                <Input type="email" placeholder="e.g. info@agency.gov.gh" />
              </Form.Item>
              <Form.Item name="orgPhone" label="Agency Phone (optional)">
                <Input placeholder="e.g. 233XXXXXXXXX" />
              </Form.Item>
            </div>
          </>
        )}

        {selectedType === "agent" && (
          <>
            <SectionLabel>Accreditation Details</SectionLabel>
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item name="accreditingBody" label="Accrediting Body (optional)">
                <Input placeholder="e.g. EPA Ghana" />
              </Form.Item>
              <Form.Item name="accreditationNumber" label="Accreditation Number (optional)">
                <Input placeholder="e.g. EPA-AGT-001" />
              </Form.Item>
            </div>
            <SectionLabel>Consultancy / Company Details</SectionLabel>
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item name="consultingCompanyName" label="Company Name" className="col-span-2">
                <Input placeholder="If applicable" />
              </Form.Item>
              <Form.Item name="registrationNumber" label="Business Reg. Number">
                <Input placeholder="e.g. CS-12345" />
              </Form.Item>
              <Form.Item name="companyTIN" label="Company TIN">
                <Input placeholder="e.g. C006137041X" />
              </Form.Item>
              <Form.Item name="agentAddress" label="Company Address" className="col-span-2">
                <Input placeholder="Company physical address" />
              </Form.Item>
              <Form.Item name="companyEmail" label="Company Email (optional)">
                <Input type="email" placeholder="e.g. info@company.com" />
              </Form.Item>
              <Form.Item name="companyPhone" label="Company Phone (optional)">
                <Input placeholder="e.g. 233XXXXXXXXX" />
              </Form.Item>
            </div>
          </>
        )}

        <SectionLabel>Location &amp; Address</SectionLabel>
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="region" label="Region" rules={[{ required: true }]}>
            <Input placeholder="e.g. Greater Accra" />
          </Form.Item>
          <Form.Item name="district" label="District" rules={[{ required: true }]}>
            <Input placeholder="e.g. Accra Metropolitan" />
          </Form.Item>
          <Form.Item name="city" label="City / Town" rules={[{ required: true }]}>
            <Input placeholder="e.g. Accra" />
          </Form.Item>
          <Form.Item name="gps" label="Digital Address (GPS)" rules={[{ required: true }]}>
            <Input placeholder="e.g. GA-XXX-XXXX" />
          </Form.Item>
          <Form.Item name="address" label="Street Address" rules={[{ required: true }]} className="col-span-2">
            <Input.TextArea rows={2} placeholder="Street / house number" />
          </Form.Item>
        </div>

        <Divider className="my-4" />
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-700 font-medium">
            ⚠️ Admin edit — credentials (password) are not modified here. Changes take effect immediately.
          </p>
        </div>
      </Form>
    </Drawer>
  );
};

const RegisteredClients = () => {
  PageTitle("Registered Clients Registry | EPA Ghana");

  const [activeTab, setActiveTab] = useState("clients");

  // ── Registered Clients tab state ──────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IEpaClient | null>(null);

  const {
    data: clientsResponse,
    isLoading: isLoadingClients,
    isFetching: isFetchingClients,
    refetch,
  } = useRegisteredClientsRegisterQuery(
    { page, limit, searchTerm, sortField, sortOrder, startDate, endDate },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true }
  );

  const clients = clientsResponse?.data || [];
  const paginationInfo = clientsResponse?.pagination;

  // ── Registration Attempts tab state ───────────────────────────────────────
  const [attPage, setAttPage] = useState(1);
  const [attLimit, setAttLimit] = useState(25);
  const [attSearch, setAttSearch] = useState("");
  const [attStatus, setAttStatus] = useState("");
  const [attStartDate, setAttStartDate] = useState("");
  const [attEndDate, setAttEndDate] = useState("");
  const [showAttFilters, setShowAttFilters] = useState(false);
  const [viewAttemptOpen, setViewAttemptOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<any>(null);
  const [completeResult, setCompleteResult] = useState<any>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [fetchExport] = useLazyExportRegistrationAttemptsQuery();

  const handleExportAttempts = async () => {
    setIsExporting(true);
    try {
      const blob = await fetchExport({ searchTerm: attSearch, status: attStatus, startDate: attStartDate, endDate: attEndDate }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Registration_Attempts_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("Failed to export registration attempts.");
    } finally {
      setIsExporting(false);
    }
  };

  const [adminCompleteRegistration, { isLoading: isCompleting }] = useAdminCompleteRegistrationMutation();

  const [fetchInvoiceDetails, { isFetching: isFetchingInvoice }] = useLazyGetAttemptInvoiceDetailsQuery();
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
  const [invoiceDrawerData, setInvoiceDrawerData] = useState<any>(null);

  const {
    data: attemptsResponse,
    isLoading: isLoadingAttempts,
    isFetching: isFetchingAttempts,
  } = useRegistrationAttemptsQuery(
    { page: attPage, limit: attLimit, searchTerm: attSearch, status: attStatus, startDate: attStartDate, endDate: attEndDate },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true, skip: activeTab !== "attempts" }
  );

  const attempts = attemptsResponse?.data || [];
  const attPaginationInfo = attemptsResponse?.pagination;

  const getAttemptName = (attempt: any): string => {
    const m = attempt.metadata || {};
    if (m.userType === "organization") return m.organizationName || "N/A";
    if (m.userType === "government") return m.agencyName || "N/A";
    const name = `${m.firstName || ""} ${m.lastName || ""}`.trim();
    return name || "N/A";
  };

  const attStatusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending:   { color: "orange",  icon: <ClockCircleOutlined />,  label: "Pending" },
    completed: { color: "green",   icon: <CheckCircleOutlined />,  label: "Completed" },
    failed:    { color: "red",     icon: <CloseCircleOutlined />,  label: "Failed" },
  };

  const attemptColumns = [
    {
      title: "#",
      key: "index",
      width: 55,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono text-xs">{(attPage - 1) * attLimit + index + 1}</span>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 180,
      fixed: "left" as const,
      render: (id: string) => (
        <span className="text-xs font-mono text-gray-700">{id || "N/A"}</span>
      ),
    },
    {
      title: "Invoice No.",
      dataIndex: "gatewayInvoiceNumber",
      key: "gatewayInvoiceNumber",
      width: 180,
      render: (invoiceNo: string) =>
        invoiceNo ? (
          <Tooltip title="Click to view full invoice details">
            <button
              onClick={async () => {
                setInvoiceDrawerData(null);
                setInvoiceDrawerOpen(true);
                try {
                  const res = await fetchInvoiceDetails({ invoiceNumber: invoiceNo }).unwrap();
                  setInvoiceDrawerData(res?.data ?? null);
                } catch {
                  setInvoiceDrawerData({ _error: true });
                }
              }}
              className="flex items-center gap-1.5 text-xs font-mono text-blue-700 hover:text-blue-900 hover:underline transition-colors"
            >
              <FileTextOutlined className="text-blue-500" />
              {invoiceNo}
            </button>
          </Tooltip>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      title: "Payment Status",
      key: "paymentStatus",
      width: 160,
      render: (_: any, record: any) => {
        const ps = record._paymentStatus;
        if (!ps || !ps.payment_status_text) {
          return <span className="text-xs text-gray-400">—</span>;
        }
        const code = ps.payment_status_code;
        const isPaid = ps.invoice_status === "PAID" || code === 1;
        const isFailed = code === 2;
        const color = isPaid ? "green" : isFailed ? "red" : "orange";
        const tooltipText = [
          ps.invoice_status,
          ps.amount ? `${ps.currency || "GHS"} ${ps.amount}` : null,
          ps.date_processed,
        ].filter(Boolean).join(" · ");
        return (
          <Tooltip title={tooltipText || undefined}>
            <Tag color={color} className="text-[10px] font-semibold uppercase">
              {ps.payment_status_text}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Name",
      key: "name",
      width: 220,
      render: (_: any, record: any) => {
        const name = getAttemptName(record);
        return (
          <Tooltip title={name}>
            <span className="text-xs font-semibold text-gray-800 uppercase truncate block">{name}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Type",
      key: "userType",
      width: 120,
      render: (_: any, record: any) => {
        const ut = record.metadata?.userType || "";
        return ut ? (
          <Tag color={getUserTypeColor(ut)} className="text-[10px] font-bold uppercase">
            {normalizeText(ut)}
          </Tag>
        ) : <span className="text-xs text-gray-400">—</span>;
      },
    },
    {
      title: "Email",
      key: "email",
      width: 190,
      render: (_: any, record: any) => (
        <span className="text-xs text-blue-600 lowercase truncate block w-44">
          {record.metadata?.email || "—"}
        </span>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      width: 140,
      render: (_: any, record: any) => (
        <span className="text-xs text-gray-600">{record.metadata?.phone || "—"}</span>
      ),
    },
    {
      title: "NIA Verified",
      dataIndex: "niaVerified",
      key: "niaVerified",
      width: 110,
      align: "center" as const,
      render: (v: boolean) =>
        v ? (
          <Tag color="green" icon={<CheckCircleOutlined />} className="text-[10px]">Verified</Tag>
        ) : (
          <Tag color="default" icon={<CloseCircleOutlined />} className="text-[10px]">Not Verified</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => {
        const cfg = attStatusConfig[status] || { color: "default", icon: null, label: status };
        return (
          <Tag color={cfg.color} icon={cfg.icon} className="text-[10px] font-bold uppercase">
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: "Date Initiated",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date: any) => (
        <span className="text-xs text-gray-600">{formatDate2(date)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Details">
            <button
              onClick={() => { setSelectedAttempt(record); setViewAttemptOpen(true); }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          {record.status === "pending" && record.gatewayInvoiceNumber && (
            <Tooltip title="Verify Payment & Complete Registration">
              <button
                onClick={() => { setCompleteTarget(record); setCompleteResult(null); setCompleteModalOpen(true); }}
                className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
              >
                <UserAddOutlined />
              </button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleViewDetails = (record: IEpaClient) => {
    setSelectedClient(record);
    setViewDrawerOpen(true);
  };

  const handleEditClient = (record: IEpaClient) => {
    setSelectedClient(record);
    setEditDrawerOpen(true);
  };

  const getClientName = (client: IEpaClient): string => {
    if (client.userType === "organization") return client.organizationName || "N/A";
    if (client.userType === "government") return client.agencyName || "N/A";
    return `${client.firstName} ${client.lastName}`.trim() || "N/A";
  };

  const getUserTypeColor = (userType: string) => {
    const colorMap: Record<string, string> = {
      individual: "blue",
      organization: "green",
      government: "orange",
      agent: "purple",
    };
    return colorMap[userType] || "default";
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono text-xs">
          {(page - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: "Name",
      key: "name",
      width: 250,
      render: (_: any, record: IEpaClient) => {
        const name = getClientName(record);
        return (
          <Tooltip title={name}>
            <span className="text-xs font-semibold text-gray-800 truncate block uppercase">
              {name}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Client ID",
      dataIndex: "clientId",
      key: "clientId",
      width: 150,
      render: (clientId: string) => (
        <span className="text-xs font-mono text-gray-600 uppercase">{clientId || "N/A"}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "userType",
      key: "userType",
      width: 120,
      render: (userType: string) => (
        <Tag color={getUserTypeColor(userType)} className="text-[10px] font-bold uppercase">
          {normalizeText(userType)}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email: string) => (
        <span className="text-xs text-blue-600 lowercase block truncate w-44">{email || "N/A"}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (phone: string) => (
        <span className="text-xs text-gray-600">{phone || "N/A"}</span>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: any) => (
        <span className="text-[10px] text-gray-600">{formatDate4(date)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: IEpaClient) => (
        <Space size="small">
          <Tooltip title="View Details">
            <button
              onClick={() => handleViewDetails(record)}
              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Edit Profile">
            <button
              onClick={() => handleEditClient(record)}
              className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
            >
              <EditOutlined />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      {/* ── Registered Clients filter drawer ───────────────────────────── */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="flex items-center gap-2">
              <MdFilterList className="text-[#39afd1]" /> Advanced Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors uppercase"
            >
              Reset All
            </button>
          </div>
        }
        onClose={() => setShowFilters(false)}
        open={showFilters}
        width={window.innerWidth > 768 ? 450 : "100%"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Start Date</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">End Date</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </Drawer>

      {/* ── Registration Attempts filter drawer ────────────────────────── */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="flex items-center gap-2">
              <MdFilterList className="text-[#39afd1]" /> Filter Registration Attempts
            </span>
            <button
              onClick={() => { setAttSearch(""); setAttStatus(""); setAttStartDate(""); setAttEndDate(""); setAttPage(1); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors uppercase"
            >
              Reset All
            </button>
          </div>
        }
        onClose={() => setShowAttFilters(false)}
        open={showAttFilters}
        width={window.innerWidth > 768 ? 450 : "100%"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Status</label>
            <Select value={attStatus || "all"} onChange={(v) => { setAttStatus(v === "all" ? "" : v); setAttPage(1); }} className="w-full">
              <Option value="all">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">Start Date</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={attStartDate} onChange={(e) => setAttStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-500 uppercase">End Date</label>
            <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={attEndDate} onChange={(e) => setAttEndDate(e.target.value)} />
          </div>
        </div>
      </Drawer>

      {/* ── View Client Details Drawer ──────────────────────────────────── */}
      <Drawer
        title="Client Detailed Information"
        onClose={() => setViewDrawerOpen(false)}
        open={viewDrawerOpen}
        width={window.innerWidth > 768 ? 600 : "100%"}
        destroyOnClose
      >
        {selectedClient && (() => {
          const sc = selectedClient;
          const isOrgOrGov = sc.userType === "organization" || sc.userType === "government";
          const descProps = {
            column: 1 as const,
            bordered: true,
            size: "small" as const,
            labelStyle: { width: "160px", fontWeight: "bold" as const, fontSize: "11px", textTransform: "uppercase" as const, background: "#f9fafb" },
            contentStyle: { fontSize: "12px" },
          };
          const val = (v?: string | null) => v || "N/A";
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                <div>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Client ID</p>
                  <p className="text-lg font-mono font-bold text-blue-900">{sc.clientId}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Tag color={getUserTypeColor(sc.userType)} className="uppercase font-bold m-0 px-3 py-1">{sc.userType}</Tag>
                  {sc.isVerified ? <Tag color="green" className="text-[10px] m-0">Verified</Tag> : <Tag color="orange" className="text-[10px] m-0">Unverified</Tag>}
                </div>
              </div>

              {/* Primary / Contact Person */}
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">
                  {isOrgOrGov ? "Contact Person Details" : "Primary Details"}
                </h4>
                <Descriptions {...descProps}>
                  <Descriptions.Item label="Account Type">{capitalizeFirstLetter(sc.userType)}</Descriptions.Item>
                  {isOrgOrGov && <Descriptions.Item label="Contact Person">{`${sc.firstName || ""} ${sc.lastName || ""}`.trim() || "N/A"}</Descriptions.Item>}
                  {!isOrgOrGov && <Descriptions.Item label="Full Name">{`${sc.firstName || ""} ${sc.otherNames ? sc.otherNames + " " : ""}${sc.lastName || ""}`.trim() || "N/A"}</Descriptions.Item>}
                  {isOrgOrGov && sc.contactPersonPosition && <Descriptions.Item label="Position">{sc.contactPersonPosition}</Descriptions.Item>}
                  {sc.preferredName && <Descriptions.Item label="Preferred Name">{sc.preferredName}</Descriptions.Item>}
                  <Descriptions.Item label="Email (Login)">{val(sc.email)}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{val(sc.phone)}</Descriptions.Item>
                  <Descriptions.Item label="Registration Date">{formatDate2(sc.createdAt)}</Descriptions.Item>
                </Descriptions>
              </section>

              {/* Individual-specific */}
              {sc.userType === "individual" && (sc.nationality || sc.nationalIdNumber || sc.tin || sc.residentialAddress || sc.digitalAddress) && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Personal Information</h4>
                  <Descriptions {...descProps}>
                    {sc.nationality && <Descriptions.Item label="Nationality">{sc.nationality}</Descriptions.Item>}
                    {sc.nationalIdNumber && <Descriptions.Item label="Ghana Card No.">{sc.nationalIdNumber}</Descriptions.Item>}
                    {sc.tin && <Descriptions.Item label="TIN">{sc.tin}</Descriptions.Item>}
                    {sc.residentialAddress && <Descriptions.Item label="Residential Addr">{sc.residentialAddress}</Descriptions.Item>}
                    {sc.digitalAddress && <Descriptions.Item label="Digital Address">{sc.digitalAddress}</Descriptions.Item>}
                  </Descriptions>
                </section>
              )}

              {/* Organization-specific */}
              {sc.userType === "organization" && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Organization Details</h4>
                  <Descriptions {...descProps}>
                    <Descriptions.Item label="Organization Name">{val(sc.organizationName)}</Descriptions.Item>
                    <Descriptions.Item label="Reg. Number">{val(sc.registrationNumber)}</Descriptions.Item>
                    <Descriptions.Item label="Company TIN">{val(sc.companyTIN)}</Descriptions.Item>
                    <Descriptions.Item label="Company Type">{val(sc.companyType)}</Descriptions.Item>
                    <Descriptions.Item label="Industry Sector">{val(sc.industrySector)}</Descriptions.Item>
                    {sc.dateOfIncorporation && <Descriptions.Item label="Date of Incorporation">{formatDate2(sc.dateOfIncorporation)}</Descriptions.Item>}
                    {sc.orgEmail && <Descriptions.Item label="Org. Email">{sc.orgEmail}</Descriptions.Item>}
                    {sc.orgPhone && <Descriptions.Item label="Org. Phone">{sc.orgPhone}</Descriptions.Item>}
                  </Descriptions>
                </section>
              )}

              {/* Government-specific */}
              {sc.userType === "government" && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Government Agency Details</h4>
                  <Descriptions {...descProps}>
                    <Descriptions.Item label="Agency Name">{val(sc.agencyName)}</Descriptions.Item>
                    {sc.agencyAcronym && <Descriptions.Item label="Acronym">{sc.agencyAcronym}</Descriptions.Item>}
                    <Descriptions.Item label="Institution Type">{val(sc.institutionType)}</Descriptions.Item>
                    <Descriptions.Item label="Jurisdiction Level">{val(sc.jurisdictionLevel)}</Descriptions.Item>
                    <Descriptions.Item label="Sector">{val(sc.sector)}</Descriptions.Item>
                    {sc.orgEmail && <Descriptions.Item label="Agency Email">{sc.orgEmail}</Descriptions.Item>}
                    {sc.orgPhone && <Descriptions.Item label="Agency Phone">{sc.orgPhone}</Descriptions.Item>}
                  </Descriptions>
                </section>
              )}

              {/* Agent-specific */}
              {sc.userType === "agent" && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Agent / Accreditation Details</h4>
                  <Descriptions {...descProps}>
                    {sc.nationality && <Descriptions.Item label="Nationality">{sc.nationality}</Descriptions.Item>}
                    {sc.nationalIdNumber && <Descriptions.Item label="Ghana Card No.">{sc.nationalIdNumber}</Descriptions.Item>}
                    {sc.tin && <Descriptions.Item label="TIN">{sc.tin}</Descriptions.Item>}
                    <Descriptions.Item label="Accrediting Body">{val(sc.accreditingBody)}</Descriptions.Item>
                    <Descriptions.Item label="Accreditation No.">{val(sc.accreditationNumber)}</Descriptions.Item>
                  </Descriptions>
                </section>
              )}

              {sc.userType === "agent" && (sc.consultingCompanyName || sc.agentAddress || sc.companyEmail || sc.companyPhone) && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Consultancy / Company Details</h4>
                  <Descriptions {...descProps}>
                    {sc.consultingCompanyName && <Descriptions.Item label="Company Name">{sc.consultingCompanyName}</Descriptions.Item>}
                    {sc.registrationNumber && <Descriptions.Item label="Reg. Number">{sc.registrationNumber}</Descriptions.Item>}
                    {sc.companyTIN && <Descriptions.Item label="Company TIN">{sc.companyTIN}</Descriptions.Item>}
                    {sc.agentAddress && <Descriptions.Item label="Company Address">{sc.agentAddress}</Descriptions.Item>}
                    {sc.companyEmail && <Descriptions.Item label="Company Email">{sc.companyEmail}</Descriptions.Item>}
                    {sc.companyPhone && <Descriptions.Item label="Company Phone">{sc.companyPhone}</Descriptions.Item>}
                  </Descriptions>
                </section>
              )}

              {/* Address */}
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b pb-1">Address Information</h4>
                <Descriptions {...descProps}>
                  <Descriptions.Item label="Region">{val(sc.address?.region)}</Descriptions.Item>
                  <Descriptions.Item label="District">{val(sc.address?.district)}</Descriptions.Item>
                  <Descriptions.Item label="City">{val(sc.address?.city)}</Descriptions.Item>
                  <Descriptions.Item label="Street Address">{val(sc.address?.address)}</Descriptions.Item>
                  <Descriptions.Item label="GPS / Digital Addr">{val(sc.address?.gps || sc.digitalAddress)}</Descriptions.Item>
                </Descriptions>
              </section>
            </div>
          );
        })()}
      </Drawer>

      {/* ── View Registration Attempt Drawer ───────────────────────────── */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-blue-600" />
            <span className="font-semibold text-gray-800">Registration Attempt Details</span>
            {selectedAttempt && (
              <span className="ml-2 font-mono text-xs text-gray-500">{selectedAttempt.transactionId}</span>
            )}
          </div>
        }
        onClose={() => setViewAttemptOpen(false)}
        open={viewAttemptOpen}
        width={window.innerWidth > 768 ? 580 : "100%"}
        destroyOnClose
      >
        {selectedAttempt && (() => {
          const m = selectedAttempt.metadata || {};
          const statusCfg = attStatusConfig[selectedAttempt.status] || { color: "default", label: selectedAttempt.status };
          return (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Transaction ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800">{selectedAttempt.transactionId}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Tag color={statusCfg.color} className="uppercase font-bold m-0">{statusCfg.label}</Tag>
                  {selectedAttempt.niaVerified ? (
                    <Tag color="green" icon={<CheckCircleOutlined />} className="text-[10px] m-0">NIA Verified</Tag>
                  ) : (
                    <Tag color="default" icon={<CloseCircleOutlined />} className="text-[10px] m-0">Not NIA Verified</Tag>
                  )}
                </div>
              </div>

              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Identity</h4>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: "140px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Account Type">{m.userType ? capitalizeFirstLetter(m.userType) : "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="First Name">{m.firstName || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Last Name">{m.lastName || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Other Names">{m.otherNames || "N/A"}</Descriptions.Item>
                  {(m.userType === "organization" || m.userType === "government") && (
                    <Descriptions.Item label="Org / Agency">{m.organizationName || m.agencyName || "N/A"}</Descriptions.Item>
                  )}
                </Descriptions>
              </section>

              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Contact</h4>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: "140px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Email">{m.email || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{m.phone || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Nationality">{m.nationality || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Ghana Card No.">{m.nationalIdNumber || "N/A"}</Descriptions.Item>
                </Descriptions>
              </section>

              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Attempt Info</h4>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: "140px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Date Initiated">{formatDate2(selectedAttempt.createdAt)}</Descriptions.Item>
                  {selectedAttempt.niaVerifiedAt && (
                    <Descriptions.Item label="NIA Verified At">{formatDate2(selectedAttempt.niaVerifiedAt)}</Descriptions.Item>
                  )}
                  {selectedAttempt.gatewayInvoiceNumber && (
                    <Descriptions.Item label="Gateway Invoice No.">{selectedAttempt.gatewayInvoiceNumber}</Descriptions.Item>
                  )}
                </Descriptions>
              </section>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">
                This record auto-expires 7 days after creation if the registration is not completed.
              </div>
            </div>
          );
        })()}
      </Drawer>

      {/* ── Invoice Details Drawer ──────────────────────────────────────── */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            <span className="font-semibold text-gray-800">Ghana.gov Invoice Details</span>
            {invoiceDrawerData && !invoiceDrawerData._error && (
              <span className="font-mono text-xs text-gray-500 ml-1">{invoiceDrawerData.invoice_number}</span>
            )}
          </div>
        }
        open={invoiceDrawerOpen}
        onClose={() => { setInvoiceDrawerOpen(false); setInvoiceDrawerData(null); }}
        width={window.innerWidth > 768 ? 580 : "100%"}
        destroyOnClose
      >
        {isFetchingInvoice && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spin size="large" />
            <p className="text-sm text-gray-500">Fetching invoice details from Ghana.gov…</p>
          </div>
        )}

        {!isFetchingInvoice && invoiceDrawerData?._error && (
          <Alert type="error" showIcon message="Failed to load invoice details" description="Could not retrieve details from Ghana.gov. Please try again." />
        )}

        {!isFetchingInvoice && invoiceDrawerData && !invoiceDrawerData._error && (() => {
          const d = invoiceDrawerData;
          const payment = d.payment || {};
          const amounts = d.invoice_total_amounts || [];
          const items = d.invoice_items || [];
          const mda = d.mda || {};
          const isPaid = d.invoice_status === "PAID";

          return (
            <div className="space-y-5">
              {/* Status Banner */}
              <div className={`rounded-lg px-4 py-3 flex items-center justify-between border ${isPaid ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Invoice Status</p>
                  <p className={`text-lg font-bold ${isPaid ? "text-green-700" : "text-amber-700"}`}>{d.invoice_status ?? "—"}</p>
                </div>
                <Tag color={isPaid ? "green" : "orange"} className="uppercase font-bold m-0 text-sm px-3 py-1">
                  {payment.status_text || "—"}
                </Tag>
              </div>

              {/* Invoice Overview */}
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Invoice Overview</h4>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: "150px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Invoice No.">{d.invoice_number || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Description">{d.description || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Client Name">{`${d.first_name || ""} ${d.last_name || ""}`.trim() || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Created At">{d.created_at || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Expiry">{d.expiration_date?.human ? `${d.expiration_date.human} (${d.expiration_date.date})` : "—"}</Descriptions.Item>
                  {amounts.map((a: any, i: number) => (
                    <Descriptions.Item key={i} label={`Amount${amounts.length > 1 ? ` (${a.total_amount_ccy})` : ""}`}>
                      <span className="font-semibold">{a.total_amount_ccy} {a.total_amount}</span>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </section>

              {/* Payment Info */}
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Payment Details</h4>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: "150px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Status Code">{payment.status_code ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Status Text">{payment.status_text || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Reference">{payment.reference || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Payment Option">{payment.payment_option || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Date Processed">{payment.date_processed || "—"}</Descriptions.Item>
                </Descriptions>
              </section>

              {/* Invoice Items */}
              {items.length > 0 && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">Invoice Items</h4>
                  {items.map((item: any, i: number) => (
                    <div key={i} className="mb-2 border rounded p-3 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                      <p className="text-[11px] text-gray-500">Service Code: {item.service_code}</p>
                      {(item.payment_amounts || []).map((pa: any, j: number) => (
                        <p key={j} className="text-xs text-gray-700 mt-1">{pa.currency} {pa.amount} (FX: {pa.fx_rate})</p>
                      ))}
                    </div>
                  ))}
                </section>
              )}

              {/* MDA */}
              {mda.name && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-1">MDA</h4>
                  <Descriptions column={1} bordered size="small" labelStyle={{ width: "150px", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase" }} contentStyle={{ fontSize: "12px" }}>
                    <Descriptions.Item label="Agency">{mda.name}</Descriptions.Item>
                    <Descriptions.Item label="Branch">{mda.branch?.name || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Address">{mda.address || "—"}</Descriptions.Item>
                  </Descriptions>
                </section>
              )}

              {/* Receipt PDF */}
              {d.receipt_pdf_url && (
                <a href={d.receipt_pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline font-medium">
                  <FileTextOutlined /> View Receipt PDF on Ghana.gov
                </a>
              )}
            </div>
          );
        })()}
      </Drawer>

      {/* ── Admin Complete Registration Modal ───────────────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserAddOutlined className="text-green-600" />
            <span className="font-semibold text-gray-800">Complete Registration</span>
          </div>
        }
        open={completeModalOpen}
        onCancel={() => { if (!isCompleting) { setCompleteModalOpen(false); setCompleteResult(null); } }}
        footer={
          completeResult ? (
            <div className="flex justify-end gap-2">
              <Button onClick={() => { setCompleteModalOpen(false); setCompleteResult(null); }}>Close</Button>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <Button onClick={() => setCompleteModalOpen(false)} disabled={isCompleting}>Cancel</Button>
              <Button
                type="primary"
                icon={<SyncOutlined spin={isCompleting} />}
                loading={isCompleting}
                className="!bg-green-700"
                onClick={async () => {
                  if (!completeTarget) return;
                  try {
                    const result = await adminCompleteRegistration({ id: completeTarget._id }).unwrap();
                    setCompleteResult(result);
                    if (result.success && result.paid) {
                      message.success("Registration completed successfully!");
                    }
                  } catch (err: any) {
                    setCompleteResult({ error: true, message: err?.data?.error || "An error occurred." });
                  }
                }}
              >
                Verify & Complete
              </Button>
            </div>
          )
        }
        width={520}
        destroyOnClose
      >
        {completeTarget && !completeResult && (
          <div className="space-y-4">
            <Alert
              type="info"
              showIcon
              message="Gateway Invoice Verification"
              description={`This will query Ghana.gov in real-time to verify payment for invoice ${completeTarget.gatewayInvoiceNumber}. If confirmed paid, the client account will be created and activation notifications sent.`}
            />
            <Descriptions column={1} bordered size="small" labelStyle={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", width: "140px" }} contentStyle={{ fontSize: "12px" }}>
              <Descriptions.Item label="Transaction ID">{completeTarget.transactionId}</Descriptions.Item>
              <Descriptions.Item label="Name">{getAttemptName(completeTarget)}</Descriptions.Item>
              <Descriptions.Item label="Gateway Invoice">{completeTarget.gatewayInvoiceNumber}</Descriptions.Item>
              <Descriptions.Item label="Date Initiated">{formatDate2(completeTarget.createdAt)}</Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {isCompleting && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Spin size="large" />
            <p className="text-sm text-gray-500">Contacting Ghana.gov gateway…</p>
          </div>
        )}

        {completeResult && !isCompleting && (() => {
          if (completeResult.error) {
            return (
              <Alert type="error" showIcon message="Error" description={completeResult.message} />
            );
          }
          if (completeResult.success && completeResult.paid) {
            return (
              <div className="space-y-3">
                <Alert type="success" showIcon message="Registration Completed" description={completeResult.message} />
                <Descriptions column={1} bordered size="small" labelStyle={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", width: "140px" }} contentStyle={{ fontSize: "12px" }}>
                  <Descriptions.Item label="Client ID">{completeResult.clientId || "—"}</Descriptions.Item>
                  <Descriptions.Item label="Payment Status">{completeResult.gatewayStatus?.payment_status_text}</Descriptions.Item>
                  <Descriptions.Item label="Amount Paid">{completeResult.gatewayStatus?.currency} {completeResult.gatewayStatus?.amount}</Descriptions.Item>
                  <Descriptions.Item label="Date Processed">{completeResult.gatewayStatus?.date_processed}</Descriptions.Item>
                  <Descriptions.Item label="Payment Reference">{completeResult.gatewayStatus?.payment_reference}</Descriptions.Item>
                </Descriptions>
              </div>
            );
          }
          return (
            <div className="space-y-3">
              <Alert type="warning" showIcon message="Payment Not Confirmed" description={completeResult.message || "Ghana.gov has not confirmed this payment yet."} />
              <p className="text-xs text-gray-600 font-semibold uppercase">Raw Gateway Response:</p>
              <Descriptions column={1} bordered size="small" labelStyle={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", width: "160px" }} contentStyle={{ fontSize: "12px" }}>
                <Descriptions.Item label="Invoice Status">{completeResult.gatewayStatus?.invoice_status ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Payment Status">{completeResult.gatewayStatus?.payment_status_text ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Status Code">{completeResult.gatewayStatus?.payment_status_code ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Amount">{completeResult.gatewayStatus?.currency} {completeResult.gatewayStatus?.amount}</Descriptions.Item>
                <Descriptions.Item label="Invoice No.">{completeResult.gatewayStatus?.invoice_number ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Date Processed">{completeResult.gatewayStatus?.date_processed ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Payment Reference">{completeResult.gatewayStatus?.payment_reference ?? "—"}</Descriptions.Item>
              </Descriptions>
            </div>
          );
        })()}
      </Modal>

      {/* ── Edit Drawer ─────────────────────────────────────────────────── */}
      <ClientEditDrawer
        client={selectedClient}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSaved={() => refetch()}
      />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Registered Clients Registry</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Centralized view of all EPA Ghana registered clients
          </p>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="registered-clients-tabs"
        tabBarExtraContent={
          activeTab === "clients" ? (
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded shadow-sm hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <MdFilterList /> Filters
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAttempts}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-3 py-1.5 rounded shadow-sm transition-all text-sm font-medium"
              >
                <DownloadOutlined /> {isExporting ? "Exporting..." : "Export"}
              </button>
              <button
                onClick={() => setShowAttFilters(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded shadow-sm hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <MdFilterList /> Filters
              </button>
            </div>
          )
        }
        items={[
          {
            key: "clients",
            label: (
              <span className="flex items-center gap-2 font-medium">
                Registered Clients
                <Badge count={paginationInfo?.total || 0} showZero overflowCount={9999} style={{ backgroundColor: "#16a34a", fontSize: "10px" }} />
              </span>
            ),
            children: (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Show</span>
                    <Select value={limit} onChange={(val) => { setLimit(val); setPage(1); }} className="w-20" size="small">
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                      <Option value={50}>50</Option>
                      <Option value={100}>100</Option>
                    </Select>
                    <span className="text-sm font-medium text-gray-600">entries</span>
                  </div>
                  <div className="relative w-full md:w-80">
                    <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <input
                      type="text"
                      placeholder="Search by ID, Name or Email..."
                      className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                  </div>
                </div>

                <Table
                  columns={columns}
                  dataSource={clients}
                  loading={isLoadingClients || isFetchingClients}
                  pagination={false}
                  rowKey="_id"
                  scroll={{ x: 1200, y: "60vh" }}
                  size="small"
                  rowClassName={(_, index) => (index % 2 === 0 ? "bg-white" : "bg-gray-50/30")}
                />

                <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500 font-medium">
                    Showing {Math.min((page - 1) * limit + 1, paginationInfo?.total ?? 0)} to{" "}
                    {Math.min(page * limit, paginationInfo?.total ?? 0)} of {paginationInfo?.total ?? 0} entries
                  </div>
                  <Pagination current={page} total={paginationInfo?.total || 0} pageSize={limit} onChange={(p) => setPage(p)} showSizeChanger={false} size="small" />
                </div>
              </div>
            ),
          },
          {
            key: "attempts",
            label: (
              <span className="flex items-center gap-2 font-medium">
                Registration Attempts
                <Badge count={attPaginationInfo?.total || 0} showZero overflowCount={9999} style={{ backgroundColor: "#d97706", fontSize: "10px" }} />
              </span>
            ),
            children: (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-amber-100 bg-amber-50 flex items-start gap-2">
                  <ClockCircleOutlined className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    These are registration sessions that were initiated but not yet completed. Attempts <strong>without a payment invoice</strong> auto-expire after <strong>7 days</strong>. Attempts linked to a Ghana.gov invoice are <strong>retained indefinitely</strong> for payment reconciliation.
                  </p>
                </div>

                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Show</span>
                    <Select value={attLimit} onChange={(val) => { setAttLimit(val); setAttPage(1); }} className="w-20" size="small">
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                      <Option value={50}>50</Option>
                      <Option value={100}>100</Option>
                    </Select>
                    <span className="text-sm font-medium text-gray-600">entries</span>
                    <Select
                      value={attStatus || "all"}
                      onChange={(v) => { setAttStatus(v === "all" ? "" : v); setAttPage(1); }}
                      className="w-32"
                      size="small"
                    >
                      <Option value="all">All Statuses</Option>
                      <Option value="pending">Pending</Option>
                      <Option value="completed">Completed</Option>
                      <Option value="failed">Failed</Option>
                    </Select>
                  </div>
                  <div className="relative w-full md:w-80">
                    <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <input
                      type="text"
                      placeholder="Search by Txn ID, Name, Email..."
                      className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      value={attSearch}
                      onChange={(e) => { setAttSearch(e.target.value); setAttPage(1); }}
                    />
                  </div>
                </div>

                <Table
                  columns={attemptColumns}
                  dataSource={attempts}
                  loading={isLoadingAttempts || isFetchingAttempts}
                  pagination={false}
                  rowKey="_id"
                  scroll={{ x: 1300, y: "60vh" }}
                  size="small"
                  rowClassName={(record: any, index: number) => {
                    const base = index % 2 === 0 ? "bg-white" : "bg-gray-50/30";
                    return record.status === "pending" ? `${base} border-l-2 border-amber-400` : base;
                  }}
                />

                <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500 font-medium">
                    Showing {Math.min((attPage - 1) * attLimit + 1, attPaginationInfo?.total ?? 0)} to{" "}
                    {Math.min(attPage * attLimit, attPaginationInfo?.total ?? 0)} of {attPaginationInfo?.total ?? 0} entries
                  </div>
                  <Pagination current={attPage} total={attPaginationInfo?.total || 0} pageSize={attLimit} onChange={(p) => setAttPage(p)} showSizeChanger={false} size="small" />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default RegisteredClients;
