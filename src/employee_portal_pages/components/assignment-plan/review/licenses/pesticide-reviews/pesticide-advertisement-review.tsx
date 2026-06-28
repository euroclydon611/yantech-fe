import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { FileTextOutlined } from "@ant-design/icons";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  handleDocumentView,
  formatDate4,
  normalizeText,
  formatDate2,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { Divider } from "antd";
import ScaleLocationBlock from "../scale-location-block";
import ProposedFeeBlock from "../proposed-fee-block";

interface AdvertisementReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideAdvertisementReview: React.FC<AdvertisementReviewProps> = ({
  application,
  onApplicationUpdate,
}) => {
  const {
    applicationType,
    licenseCategory,
    licenseType,
    processingType,
    createdAt,
    updatedAt,
    answers,
    scale,
    location,
  } = application;

  const { advertisement } = answers?.categoryDetails;

  // Initialize review and evaluation data
  // Merge existing data with defaults to ensure all keys are present
  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    ownLicense: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    advertisementTypes: { status: "pending", comment: "" },
    campaignDuration: { status: "pending", comment: "" },
    targetAudience: { status: "pending", comment: "" },
    content: { status: "pending", comment: "" },
    adAttachments: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    ownLicense: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    advertisementTypes: { status: "pending", comment: "" },
    campaignDuration: { status: "pending", comment: "" },
    targetAudience: { status: "pending", comment: "" },
    content: { status: "pending", comment: "" },
    adAttachments: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const review = {
    ...defaultReviewStructure,
    ...application.review,
  };

  const evaluation = {
    ...defaultEvaluationStructure,
    ...application.evaluation,
  };

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    await onApplicationUpdate?.(sectionKey, type, status, comment);
  };

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
        Advertisement License Application Review
      </h2>
      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block
          title="1. Applicant Information"
          sectionKey="applicantDetails"
          reviewData={review.applicantDetails}
          evaluationData={evaluation.applicantDetails}
          onUpdate={handleUpdateSection}
        >
          <ApplicantInformationBlock application={application} />
        </Block>

        {/* --- BLOCK 2: Application Summary --- */}
        <Block
          title="2. Application Summary"
          sectionKey="licenseInformation"
          reviewData={review.licenseInformation}
          evaluationData={evaluation.licenseInformation}
          onUpdate={handleUpdateSection}
        >
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

        {/* 13.1 Own-license */}
        <Block
          title="3. Own-license (13.1)"
          sectionKey="ownLicense"
          reviewData={review.ownLicense}
          evaluationData={evaluation.ownLicense}
          onUpdate={handleUpdateSection}
        >
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
              sectionKey="products"
              reviewData={review.products}
              evaluationData={evaluation.products}
              onUpdate={handleUpdateSection}
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
        <Block
          title="5. Advertisement Types (13.3)"
          sectionKey="advertisementTypes"
          reviewData={review.advertisementTypes}
          evaluationData={evaluation.advertisementTypes}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="6. Campaign Duration (13.4)"
          sectionKey="campaignDuration"
          reviewData={review.campaignDuration}
          evaluationData={evaluation.campaignDuration}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="7. Target Audience (13.5)"
          sectionKey="targetAudience"
          reviewData={review.targetAudience}
          evaluationData={evaluation.targetAudience}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="8. Content (13.6)"
          sectionKey="content"
          reviewData={review.content}
          evaluationData={evaluation.content}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Summary"
            value={advertisement.contentDescription || "—"}
          />
        </Block>

        {/* Attachments */}
        {(advertisement.scriptsDoc ||
          advertisement.storyboardsDoc ||
          advertisement.digitalMediaDraftsDoc) && (
          <Block
            title="9. Attachments"
            sectionKey="adAttachments"
            reviewData={review.adAttachments}
            evaluationData={evaluation.adAttachments}
            onUpdate={handleUpdateSection}
          >
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
        <Block
          title="10. Supporting Documents"
          className={styles.fullWidth}
          sectionKey="attachments"
          reviewData={review.attachments}
          evaluationData={evaluation.attachments}
          onUpdate={handleUpdateSection}
        >
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>

        {/* --- Scale and Location --- */}
        <ScaleLocationBlock
          applicationId={application._id}
          initialScale={scale}
          initialLocation={location}
        />

        {/* --- Proposed Fee --- */}
        {/* <ProposedFeeBlock application={application} /> */}
      </div>
    </div>
  );
};

export default PesticideAdvertisementReview;
