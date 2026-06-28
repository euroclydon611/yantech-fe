import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Collapse } from "antd";
import { Block, Detail } from "../../../../review/helpers";
import {
  normalizeText,
  handleDocumentView,
  formatDate4,
  formatDate,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title } = Typography;

const { Text } = Typography;
interface EnergyStpEnvironmentalReviewProps {
  application: any;
}

// Undertaking type configurations
export const ENERGY_UNDERTAKING_TYPES = [
  {
    value: "omc",
    label: "Oil Marketing Company (OMC)",
    description:
      "Companies engaged in the marketing and distribution of petroleum products",
    icon: "🛢️",
  },
  {
    value: "lpgmc",
    label: "LPG Marketing Company (LPGMC)",
    description: "Companies specializing in LPG marketing and distribution",
    icon: "⛽",
  },
  {
    value: "otc",
    label: "Oil Trading Company (OTC)",
    description: "Companies engaged in oil trading and wholesale operations",
    icon: "📈",
  },
  {
    value: "bdc",
    label: "Bulk Distribution Company (BDC)",
    description:
      "Companies handling bulk storage and distribution of petroleum products",
    icon: "🚛",
  },
  {
    value: "tank_cleaning",
    label: "Tank Cleaning and Calibration Services",
    description:
      "Specialized services for tank cleaning, calibration, and maintenance",
    icon: "🧽",
  },
  {
    value: "other",
    label: "Other Energy Services",
    description: "Other energy sector service operations",
    icon: "⚡",
  },
];

const EnergyStpEnvironmentalPreview: React.FC<
  EnergyStpEnvironmentalReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const energyStpData = answers?.environmentalPermitData?.energy?.stp || {};
  const { undertakingType, projectSiteDetails, planDocuments, previousPermit } =
    energyStpData;

  const getUndertakingTypeLabel = (type: string) => {
    const undertaking = ENERGY_UNDERTAKING_TYPES.find((u) => u.value === type);
    return undertaking ? undertaking.label : type;
  };

  const getCorporateEnvironmentalTitle = () => {
    if (permitDetails?.applicationType === "new_application") {
      return "Corporate Environmental Policy (CEP)";
    }
    if (permitDetails?.applicationType === "renewal") {
      return "Corporate Environmental Management Plan (CEMP)";
    }
    return "Corporate Environmental Plan";
  };

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <div className="mb-8">
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4"></div>
      </div>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block title="1. Applicant Information">
          <ApplicantInformationBlock application={application} />
        </Block>

        {/* --- BLOCK 2: Permit Details --- */}
        <Block title="2. Permit Information">
          <Detail
            label="Submitted Date:"
            value={formatDate4(application.createdAt)}
          />
          <Detail
            label="Updated Date:"
            value={formatDate4(application.updatedAt)}
          />
          <Detail
            label="Application Type:"
            value={normalizeText(permitDetails?.applicationType?.toUpperCase())}
          />
          <Detail label="Permit Type:" value="ENVIRONMENTAL PERMIT" />

          <Detail
            label="Permit Category:"
            value="ENERGY SECTOR - DOWNSTREAM PETROLEUM OPERATIONS  CORPORATE PERMIT"
          />
          <Detail
            label="Type of Undertaking:"
            value={getUndertakingTypeLabel(undertakingType)}
          />
        </Block>
        {/* --- BLOCK 3: Corporate Environmental Plan --- */}
        <Block title={`3. ${getCorporateEnvironmentalTitle()}`}>
          {planDocuments?.corporateEnvironmentalPlanDoc ? (
            <div className="flex gap-2 items-start">
              <FileTextOutlined className="mt-1" />
              <Text className="!text-red-600 font-bold">
                <strong className="!text-red-600">
                  {planDocuments.corporateEnvironmentalPlanDoc.name ||
                    getCorporateEnvironmentalTitle()}
                </strong>{" "}
                attached — refer to{" "}
                <strong className="!font-bold">
                  Block{" "}
                  {permitDetails?.applicationType === "renewal" ? "6" : "5"}{" "}
                  (Supporting Documents)
                </strong>
              </Text>
            </div>
          ) : (
            <div className="flex gap-2 items-start">
              <FileTextOutlined className="mt-1" />
              <Text className="text-gray-700">Not uploaded</Text>
            </div>
          )}
        </Block>

        <Block title="4. Corporate Office Location">
          <Detail
            label="Region:"
            value={normalizeText(projectSiteDetails?.location?.region)}
          />
          <Detail
            label="District:"
            value={normalizeText(projectSiteDetails?.location?.district)}
          />
          <Detail
            label="City/Town:"
            value={projectSiteDetails?.location?.city}
          />
          <Detail
            label="Address:"
            value={projectSiteDetails?.location?.address}
          />
          <Detail
            label="Major Landmark:"
            value={projectSiteDetails?.location?.majorLandmark}
          />
          <Detail
            label="Google Maps Link/GPS:"
            value={projectSiteDetails?.location?.googleLocationLink}
          />
        </Block>

        {/* --- BLOCK 5: Previous Permit Details (Renewal only) --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="5. Previous Issued Permit Details">
            {previousPermit ? (
              <>
                <Detail
                  label="Permit Number:"
                  value={previousPermit?.permitNumber}
                />
                <Detail
                  label="Permit Issued Date:"
                  value={
                    previousPermit?.permitIssuedDate
                      ? formatDate(previousPermit.permitIssuedDate)
                      : "Not provided"
                  }
                />
                <Detail
                  label="Permit Expiry Date:"
                  value={
                    previousPermit?.permitExpiryDate
                      ? formatDate(previousPermit.permitExpiryDate)
                      : "Not provided"
                  }
                />

                {previousPermit.permitDocument && (
                  <>
                    <div className="mt-4 flex gap-4">
                      <label className="font-semibold text-gray-700 block mb-2">
                        Permit Document:
                      </label>
                      <Text className="text-red-600">
                        {previousPermit.permitDocument?.name || "Attachment"}{" "}
                        attached — refer to{" "}
                        <strong>Block 6 (Supporting Documents)</strong>
                      </Text>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Detail label="Previous Permit Details:" value="Not provided" />
            )}
          </Block>
        )}

        {/* --- Supporting Documents Block --- */}
        <Block
          title={
            permitDetails?.applicationType === "renewal"
              ? "6. Supporting Documents"
              : "5. Supporting Documents"
          }
          className={styles.fullWidth}
        >
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default EnergyStpEnvironmentalPreview;
