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

interface EnvironmentalManufacturingReviewProps {
  application: any;
}

export const EnvironmentalManufacturingRenewalPreview: React.FC<
  EnvironmentalManufacturingReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const manufacturingData =
    answers?.environmentalPermitData?.manufacturing || {};

  const { siteDetails, attachments, previousPermit } = manufacturingData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

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
          <Detail label="Permit Category:" value="MANUFACTURING SECTOR" />
          <Detail
            label="Manufacturing Category:"
            value={normalizeText(manufacturingData.manufacturingCategory)}
          />
          {manufacturingData.manufacturingCategory == "general_industry" && (
            <Detail
              label="General Industry Type:"
              value={normalizeText(manufacturingData.generalIndustryType)}
            />
          )}

          <Detail
            label="Type of Undertaking:"
            value="New Facility (Facility undergoing Environmental Assessment for the first time)"
          />
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

        {/* --- BLOCK 5: Project Site & Location --- */}
        <Block title="4. Project Site & Location">
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Location Information
            </Title>
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
              label="Major Landmark:"
              value={siteDetails?.location?.majorLandmark}
            />
            <Detail label="Latitude:" value={siteDetails?.location?.latitude} />
            <Detail
              label="Longitude:"
              value={siteDetails?.location?.longitude}
            />{" "}
            {siteDetails?.location?.googleLocationLink && (
              <Detail
                label="Google Location Link/GPS:"
                value={
                  <a
                    href={siteDetails.location.googleLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteDetails.location.googleLocationLink}
                  </a>
                }
              />
            )}
          </div>
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
        <Block title="6. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default EnvironmentalManufacturingRenewalPreview;
