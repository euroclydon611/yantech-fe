import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { FileText, BadgeCheck, Download, Calendar, ExternalLink, ShieldCheck, CheckCircle2, Clock, AlertCircle, UploadCloud } from "lucide-react";


export const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase() || "default";

  const styles: { [key: string]: { color: string; background: string } } = {
    draft: { color: "#096dd9", background: "#e6f7ff" },
    submitted: { color: "#d48806", background: "#fffbe6" },
    "under-review": { color: "#d46b08", background: "#fff7e6" },
    corrections_required: { color: "#fa8c16", background: "#fff7e6" },
    reports_required: { color: "#13c2c2", background: "#e6fffb" },
    payment_pending: { color: "#722ed1", background: "#f9f0ff" },
    permit_fee_pending_payment: { color: "#722ed1", background: "#f9f0ff" },
    awaiting_issuance: { color: "#08979c", background: "#e6fffb" },
    completed: { color: "#52c41a", background: "#f6ffed" },
    rejected: { color: "#cf1322", background: "#fff1f0" },
    default: { color: "#595959", background: "#fafafa" },
  };

  const style = styles[s] || styles["default"];

  return (
    <span
      style={{
        ...style,
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: 600,
        textTransform: "capitalize",
        border: `1px solid ${style.color}`,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {s.replace(/[-_]/g, " ")}
    </span>
  );
};

export const getEfficacyStatusBadge = (status?: string) => {
  const s = status?.toLowerCase().replace(/\s+/g, "_") || "not_applied";

  const styles: {
    [key: string]: {
      color: string;
      background: string;
      icon: JSX.Element;
      label: string;
    };
  } = {
    submitted: {
      color: "#1890ff",
      background: "#e6f7ff",
      icon: <FileTextOutlined style={{ marginRight: 4 }} />,
      label: "Submitted",
    },
    pending_payment: {
      color: "#d48806",
      background: "#fffbe6",
      icon: <DollarCircleOutlined style={{ marginRight: 4 }} />,
      label: "Pending Payment",
    },
    corrections_required: {
      color: "#fa8c16",
      background: "#fff7e6",
      icon: <EditOutlined style={{ marginRight: 4 }} />,
      label: "Corrections Required",
    },
    reports_required: {
      color: "#13c2c2",
      background: "#e6fffb",
      icon: <FileSearchOutlined style={{ marginRight: 4 }} />,
      label: "Reports Required",
    },
    completed: {
      color: "#52c41a",
      background: "#f6ffed",
      icon: <CheckCircleOutlined style={{ marginRight: 4 }} />,
      label: "Completed",
    },
    rejected: {
      color: "#cf1322",
      background: "#fff1f0",
      icon: <CloseCircleOutlined style={{ marginRight: 4 }} />,
      label: "Rejected",
    },
    not_applied: {
      color: "#595959",
      background: "#fafafa",
      icon: <MinusCircleOutlined style={{ marginRight: 4 }} />,
      label: "Not Applied",
    },
  };

  const style = styles[s] || styles["not_applied"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        ...style,
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "9px",
        fontWeight: 600,
        border: `1px solid ${style.color}`,
      }}
    >
      {style.icon}
      {style.label}
    </span>
  );
};

export const getPaymentTransactionStatusBadge = (status: string) => {
  const s = status?.toLowerCase() || "default";

  const styles: {
    [key: string]: { color: string; background: string; icon: JSX.Element };
  } = {
    successful: {
      color: "#52c41a",
      background: "#f6ffed",
      icon: <CheckCircleOutlined style={{ marginRight: 4 }} />,
    },
    failed: {
      color: "#cf1322",
      background: "#fff1f0",
      icon: <CloseCircleOutlined style={{ marginRight: 4 }} />,
    },
    abandoned: {
      color: "#d48806",
      background: "#fffbe6",
      icon: <StopOutlined style={{ marginRight: 4 }} />,
    },
    default: {
      color: "#595959",
      background: "#fafafa",
      icon: <StopOutlined style={{ marginRight: 4 }} />,
    },
  };

  const style = styles[s] || styles["default"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        ...style,
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "9px",
        fontWeight: 600,
        textTransform: "capitalize",
        border: `1px solid ${style.color}`,
      }}
    >
      {style.icon}
      {s}
    </span>
  );
};

export const statusOptions = [
  "all",
  "submitted",
  "under_review",
  "corrections_required",
  "reports_required",
  "permit_fee_pending_pending",
  "processing_fee_pending_payment",
  "completed",
  "rejected",
];

export const movementStatusOptions = [
  "all",
  "Pending Payment",
  "Pending Inspection",
  // --- Active States ---
  "Preparing",
  "In Transit",
  "Received at Facility",
  "Rejected at Facility",
  "On Hold - Inspection Failed",
  "Completed",
];

export const efficacyTrialStatusOptions = [
  "all",
  "Completed",
  "Submitted",
  "Pending Payment",
  "Corrections Required",
  "Rejected",
];

export const paymentTransactionsStatusOptions = [
  "all",
  "failed",
  "successful",
  "abandoned",
];


export const issuedStatuses: {
  [key: string]: {
    color: string;
    bg: string;
    icon: JSX.Element;
    label: string;
  };
} = {
  ACTIVE: {
    color: "#16a34a",
    bg: "#f0fdf4",
    icon: <CheckCircle2 size={12} className="mr-1" />,
    label: "Active",
  },
  EXPIRED: {
    color: "#dc2626",
    bg: "#fef2f2",
    icon: <AlertCircle size={12} className="mr-1" />,
    label: "Expired",
  },
  REVOKED: {
    color: "#991b1b",
    bg: "#fef2f2",
    icon: <AlertCircle size={12} className="mr-1" />,
    label: "Revoked",
  },
  SUSPENDED: {
    color: "#9a3412",
    bg: "#fff7ed",
    icon: <Clock size={12} className="mr-1" />,
    label: "Suspended",
  },
  DRAFT: {
    color: "#6b7280",
    bg: "#f9fafb",
    icon: <Clock size={12} className="mr-1" />,
    label: "Draft",
  },
  PENDING: {
    color: "#6b7280",
    bg: "#f9fafb",
    icon: <Clock size={12} className="mr-1" />,
    label: "Pending",
  },
  DEFAULT: {
    color: "#6b7280",
    bg: "#f9fafb",
    icon: <Clock size={12} className="mr-1" />,
    label: 'DEFAULT',
  },
};

export const permitTypes = [
  "environmental_permit",
  "import",
  "export",
  "domestic_purchase",
  "hazardous_waste_disposal",
];

export const issuedPermitTypes = [
  "import_pesticide",
  "export_pesticide",
  "import_industrial_chemical",
  "export_industrial_chemical",
  "domestic_purchase",
  "efficacy_trial",
  "pesticide_import_authorization",
  "hazardous_waste_disposal",
  "environmental_permit",
];

export const authorizationRequestTypes = ["pesticide_import_authorization"];

export const licenseTypes = ["pesticide"];

export const VALID_LICENSE_TYPES = [
  "pesticide_importation",
  "pesticide_exportation",
  "pesticide_distribution",
  "pesticide_commercial_application",
  "pesticide_transportation",
  "pesticide_formulation",
  "pesticide_manufacture",
  "pesticide_storage",
  "pesticide_sale",
  "pesticide_advertisement",
  "pesticide_repackaging",
  "industrial_chemical_transportation",
] as const;

export const paymentForOptions = [
  "PermitApplication",
  "LicenseApplication",
  "MovementDocument",
  "EfficacyTrial",
  "RegistrationFee",
];

export const pa_freStatusOptions = ["all", "active", "expired", "draft"];

export const issuedPermitsStatusOptions = [
  "all",
  "active",
  "expired",
  "pending",
  "draft",
];

export const invoicesStatusOptions = ["all", "paid", "unpaid", "overdue", "void"];
