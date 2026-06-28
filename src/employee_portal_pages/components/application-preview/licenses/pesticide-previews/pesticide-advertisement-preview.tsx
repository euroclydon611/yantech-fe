import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { FileTextOutlined } from "@ant-design/icons";
import { Block, Detail } from "@/employee_portal_pages/components/review/helpers";
import {
  handleDocumentView,
  formatDate4,
  normalizeText,
  formatDate2,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { Divider } from "antd";



interface AdvertisementReviewProps {
  application: any;
}

const PesticideAdvertisementPreview: React.FC<AdvertisementReviewProps> = ({
  application,
}) => {
  const {
    applicationType,
    licenseCategory,
    licenseType,
    processingType,
    createdAt,
    updatedAt,
    answers,
  } = application;

  const previousLicense = answers?.previousLicense;
  const { advertisement } = answers?.categoryDetails;

  if (!advertisement) {
    return (
      <div className="text-sm text-gray-500">
        Advertisement details are missing. Please complete the Advertisement
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Advertisement License Application Preview
      </h2>
      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block title="1. Applicant Information">
          <ApplicantInformationBlock application={application} />
        </Block>

        {/* --- BLOCK 2: Application Summary --- */}
        <Block title="2. Application Summary">
          <Detail
            label="Application Type"
            value={normalizeText(applicationType)}
          />
          <Detail
            label="License Type"
            value={normalizeText(licenseType) || "—"}
          />
          <Detail
            label="Category"
            value={normalizeText(licenseCategory) || "—"}
          />
          <Detail
            label="Processing Type"
            value={normalizeText(processingType) || "—"}
          />
          <Detail label="Submitted Date:" value={formatDate4(createdAt)} />
          <Detail label="Updated Date:" value={formatDate4(updatedAt)} />
        </Block>

        {/* --- BLOCK 2.1: Previous License Details (for Renewals) --- */}
        {applicationType === "renewal" && previousLicense && (
          <Block title="2.1. Previous License Details" className={styles.fullWidth}>
            <Detail
              label="License Number:"
              value={previousLicense.licenseNumber || "—"}
            />
            <Detail
              label="Date of Issue:"
              value={formatDate2(previousLicense.licenseIssuedDate) || "—"}
            />
            <Detail
              label="Expiry Date:"
              value={formatDate2(previousLicense.licenseExpiryDate) || "—"}
            />
            <Detail
              label="License Document:"
              value={
                previousLicense.licenseDocument?.name ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleDocumentView(previousLicense.licenseDocument)}
                    >
                      <FileTextOutlined className="text-blue-500" />
                      <span>{previousLicense.licenseDocument.name}</span>
                    </span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 10)
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </Block>
        )}

        {/* 13.1 Own-license */}
        <Block title="3. Own-license (13.1)">
          <Detail
            label="Advertising for Own License"
            value={
              advertisement.isAdvertisingForOwnLicense === true
                ? "Yes"
                : advertisement.isAdvertisingForOwnLicense === false
                ? "No"
                : "N/A (e.g., advertising agency)"
            }
          />
        </Block>

        {/* 13.2 Products */}
        {Array.isArray(advertisement.advertisedPesticides) &&
          advertisement.advertisedPesticides.length > 0 && (
            <Block
              title="4. Products to be Advertised"
              className={styles.fullWidth}
            >
              {advertisement.advertisedPesticides.map((p: any, i: number) => (
                <div key={p.id || i} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Product {i + 1}: {p.name}
                    </span>
                  </Divider>
                  <Detail label="Name" value={p.name} />
                  <Detail label="Product Type" value={p.productType} />
                  {/* Product Registration Details */}
                  <Detail
                    label="Registered Product Name"
                    value={p.productRegistration?.productName}
                  />
                  <Detail
                    label="Registration Holder"
                    value={p.productRegistration?.company}
                  />
                  <Detail
                    label="Product Registration Number"
                    value={p.productRegistration?.regNo}
                  />
                  <Detail
                    label="Registration Issue Date"
                    value={formatDate2(p.productRegistration?.issuanceDate)}
                  />
                  <Detail
                    label="Registration Expiry Date"
                    value={formatDate2(p.productRegistration?.expiryDate)}
                  />
                  <Detail
                    label="Target Pest/Use"
                    value={p.targetPestOrUseCategory}
                  />
                  {Array.isArray(p.activeIngredient) &&
                    p.activeIngredient.length > 0 && (
                      <div className={styles.detail}>
                        <span className={styles.label}>
                          Active Ingredients:
                        </span>
                        <span className={styles.value}>
                          {p.activeIngredient.map((ai: any, j: number) => (
                            <div key={j} className="text-sm">
                              {ai.activeIngredient} — {ai.concentrationValue}{" "}
                              {ai.concentrationUnit}
                              {ai.casNumber ? ` (CAS: ${ai.casNumber})` : ""}
                            </div>
                          ))}
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </Block>
          )}

        {/* 13.3 Types */}
        <Block title="5. Advertisement Types (13.3)">
          <Detail
            label="Types"
            value={(advertisement.advertisementTypes || []).join(", ") || "—"}
          />
          {advertisement.advertisementTypes?.includes("Other") && (
            <Detail
              label="Other Type"
              value={advertisement.advertisementTypesOther || "—"}
            />
          )}
        </Block>

        {/* 13.4 Campaign Duration */}
        <Block title="6. Campaign Duration (13.4)">
          <Detail
            label="Ongoing"
            value={advertisement.campaignDuration?.isOngoing ? "Yes" : "No"}
          />
          {!advertisement.campaignDuration?.isOngoing && (
            <>
              <Detail
                label="Start Date"
                value={advertisement.campaignDuration?.startDate || "—"}
              />
              <Detail
                label="End Date"
                value={advertisement.campaignDuration?.endDate || "—"}
              />
            </>
          )}
        </Block>

        {/* 13.5 Target Audience */}
        <Block title="7. Target Audience (13.5)">
          <Detail
            label="Audience"
            value={(advertisement.targetAudience || []).join(", ") || "—"}
          />
          {advertisement.targetAudience?.includes("Other") && (
            <Detail
              label="Other Audience"
              value={advertisement.targetAudienceOther || "—"}
            />
          )}
        </Block>

        {/* 13.6 Content */}
        <Block title="8. Content (13.6)">
          <Detail
            label="Summary"
            value={advertisement.contentDescription || "—"}
          />
        </Block>

        {/* Attachments */}
        {(advertisement.scriptsDoc ||
          advertisement.storyboardsDoc ||
          advertisement.digitalMediaDraftsDoc) && (
          <Block title="9. Attachments">
            {advertisement.scriptsDoc && (
              <Detail
                label="Scripts"
                value={
                  advertisement.scriptsDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{advertisement.scriptsDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 10)
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )
                }
              />
            )}

            {advertisement.storyboardsDoc && (
              <Detail
                label="Storyboards"
                value={
                  advertisement.storyboardsDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{advertisement.storyboardsDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 10)
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )
                }
              />
            )}

            {advertisement.digitalMediaDraftsDoc && (
              <Detail
                label="Digital Media Drafts"
                value={
                  advertisement.digitalMediaDraftsDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{advertisement.digitalMediaDraftsDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 10)
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )
                }
              />
            )}
          </Block>
        )}

        {/* --- Supporting Documents --- */}
        <Block title="10. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideAdvertisementPreview;
