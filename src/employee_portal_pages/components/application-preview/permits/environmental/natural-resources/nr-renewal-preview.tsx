import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography } from "antd";
import { Block, Detail } from "../../../../review/helpers";
import {
  formatDate,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";

const { Title, Text } = Typography;

const UNDERTAKING_LABELS: Record<string, string> = {
  aquaculture_project: "Aquaculture Project",
  forestry_plantation_project: "Forestry/Plantation Project",
  exotic_species_introduction:
    "Introduction of exotic species of animals, plants or microbial agents",
  agricultural_project: "Agricultural Project",
};

const AQUACULTURE_PROJECT_TYPES_LABELS: Record<string, string> = {
  on_water_cages: "On water (Cages)",
  land_base_ponds: "Land base (Ponds)",
};

const AGRICULTURAL_PROJECT_TYPES_LABELS: Record<string, string> = {
  agric_related_plantations: "Agric related plantations",
  community_pastures: "Community pastures",
  fruit_vegetable_farms: "Fruit and vegetable farms",
  crop_farming: "Crop farming",
  irrigation_schemes: "Irrigation schemes",
  poultry_undertakings: "Poultry undertakings",
  livestock_undertakings: "Livestock undertakings",
};

interface EnvironmentalNaturalResourcesReviewProps {
  application: any;
}

export const EnvironmentalNaturalResourcesRenewalPreview: React.FC<
  EnvironmentalNaturalResourcesReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const naturalResourcesData =
    answers?.environmentalPermitData?.naturalResources || {};

  const {
    proposalDetails,
    siteDetails,
    infrastructure,
    impactsMitigation,
    attachments,
    previousPermit,
  } = naturalResourcesData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to format power sources
  const formatPowerSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  // Helper function to format water sources
  const formatWaterSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  const undertaking = naturalResourcesData?.undertaking || null;
  const aquacultureType = naturalResourcesData?.aquacultureType || [];
  const agriculturalProjectType =
    naturalResourcesData?.agriculturalProjectType || [];

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-500 rounded-full mt-3 mb-4"></div>
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
          <Detail label="Permit Category:" value="NATURAL RESOURCES" />
          <Detail
            label="Type of Undertaking:"
            value={UNDERTAKING_LABELS[undertaking] || undertaking || "N/A"}
          />

          {undertaking === "aquaculture_project" && (
            <Detail
              label="Aquaculture Project Type:"
              value={
                aquacultureType && aquacultureType.length > 0
                  ? aquacultureType
                      ?.map(
                        (type: string) =>
                          AQUACULTURE_PROJECT_TYPES_LABELS[type] || type
                      )
                      ?.join(", ")
                  : "N/A"
              }
            />
          )}

          {undertaking === "agricultural_project" && (
            <Detail
              label="Agricultural Project Type:"
              value={
                agriculturalProjectType && agriculturalProjectType.length > 0
                  ? agriculturalProjectType
                      ?.map(
                        (type: string) =>
                          AGRICULTURAL_PROJECT_TYPES_LABELS[type] || type
                      )
                      ?.join(", ")
                  : "N/A"
              }
            />
          )}
        </Block>

        {/* --- BLOCK 3: Environmental Management Plan (EMP) --- */}
        <Block title="3. Environmental Management Plan (EMP)">
          {attachments?.corporateEnvironmentalPlanDoc ? (
            <div className="flex gap-2 items-start">
              <FileTextOutlined className="mt-1" />
              <Text className="!text-red-600 font-bold">
                <strong className="!text-red-600">
                  {attachments.corporateEnvironmentalPlanDoc.name ||
                    "Environmental Management Plan"}
                </strong>{" "}
                attached — refer to{" "}
                <strong className="!font-bold">
                  Block 6 (Supporting Documents)
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

        {/* --- BLOCK 4: Project Site & Location --- */}
        <Block title="4. Project Site & Location">
          <Detail
            label="Region:"
            value={normalizeText(siteDetails?.location?.region) || "N/A"}
          />
          <Detail
            label="District:"
            value={normalizeText(siteDetails?.location?.district) || "N/A"}
          />
          <Detail
            label="City/Town:"
            value={siteDetails?.location?.city || "N/A"}
          />
          <Detail
            label="Address:"
            value={siteDetails?.location?.address || "N/A"}
          />
          <Detail
            label="Google Maps Link/GPS:"
            value={siteDetails?.location?.googleLocationLink || "N/A"}
          />
          <Detail
            label="Predominant Land Use:"
            value={siteDetails?.predominantLandUse || "N/A"}
          />
          <Detail
            label="Adjacent Land Uses:"
            value={
              siteDetails?.adjacentLandUses &&
              siteDetails.adjacentLandUses.length > 0
                ? siteDetails.adjacentLandUses.join(", ")
                : "N/A"
            }
          />
          {siteDetails?.nearWaterBody?.isNear && (
            <>
              <Detail
                label="Water Body Name:"
                value={siteDetails.nearWaterBody.name || "N/A"}
              />
              <Detail
                label="Distance to Water Body:"
                value={
                  siteDetails.nearWaterBody.distance
                    ? `${siteDetails.nearWaterBody.distance} m`
                    : "N/A"
                }
              />
            </>
          )}
          {siteDetails?.nearSensitiveArea?.isNear && (
            <>
              <Detail
                label="Sensitive Area Name:"
                value={siteDetails.nearSensitiveArea.name || "N/A"}
              />
              <Detail
                label="Distance to Sensitive Area:"
                value={
                  siteDetails.nearSensitiveArea.distance
                    ? `${siteDetails.nearSensitiveArea.distance} m`
                    : "N/A"
                }
              />
            </>
          )}
        </Block>

        {/* --- BLOCK 5: Previous Issued Permit Details (Renewal only) --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="5. Previous Issued Permit Details">
            {previousPermit ? (
              <>
                <Detail
                  label="Permit Number:"
                  value={previousPermit?.permitNumber || "N/A"}
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

export default EnvironmentalNaturalResourcesRenewalPreview;
