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
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { Divider } from "antd";
import ScaleLocationBlock from "../scale-location-block";
import ProposedFeeBlock from "../proposed-fee-block";

interface DistributionReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

export const PesticideDistributionReview: React.FC<DistributionReviewProps> = ({
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

  const { distribution } = answers?.categoryDetails;

  // Initialize review and evaluation properties if they don't exist
  // Merge existing data with defaults to ensure all keys are present
  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    distributionScope: { status: "pending", comment: null },
    vehicles: { status: "pending", comment: null },
    complianceSafety: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    distributionScope: { status: "pending", comment: null },
    vehicles: { status: "pending", comment: null },
    complianceSafety: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
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
    if (onApplicationUpdate) {
      await onApplicationUpdate(sectionKey, type, status, comment);
    }
  };

  if (!distribution) {
    return (
      <div className="text-sm text-gray-500">
        Distribution details are missing. Please complete the Distribution
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Distribution License Application Review
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

        <Block
          title="3. Distribution Scope"
          className={styles.fullWidth}
          sectionKey="distributionScope"
          reviewData={review.distributionScope}
          evaluationData={evaluation.distributionScope}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Nationwide"
            value={distribution.distributesNationwide ? "Yes" : "No"}
          />
          {!distribution.distributesNationwide && (
            <Detail
              label="Selected Regions"
              value={(distribution.selectedRegions || []).join(", ") || "—"}
            />
          )}
        </Block>

        {/* Vehicles */}
        {Array.isArray(distribution.vehicles) &&
          distribution.vehicles.length > 0 && (
            <Block
              title="4. Vehicles"
              className={styles.fullWidth}
              sectionKey="vehicles"
              reviewData={review.vehicles}
              evaluationData={evaluation.vehicles}
              onUpdate={handleUpdateSection}
            >
              {distribution.vehicles.map((v: any, index: number) => (
                <div key={v.id || index} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Vehicle {index + 1}{" "}
                    </span>
                  </Divider>
                  <Detail label="Type" value={v.vehicleType} />
                  <Detail label="Registration No." value={v.registrationNo} />
                  <Detail label="Capacity" value={v.capacity} />
                  <Detail label="Usage" value={v.usageType} />

                  <Detail
                    label="EPA-licensed"
                    value={v.isEPALicense ? "Yes" : "No"}
                  />
                  {v.isEPALicense && (
                    <>
                      <Detail
                        label="License Number"
                        value={v.epaLicense?.licenseNumber}
                      />
                      <Detail
                        label="Issued Date"
                        value={v.epaLicense?.licenseIssuedDate}
                      />
                      <Detail
                        label="Expiry Date"
                        value={v.epaLicense?.licenseExpiryDate}
                      />
                      {v.epaLicense?.licenseDocument ? (
                        <Detail
                          label="EPA License Document"
                          value={
                            <span className="flex items-center gap-2">
                              <FileTextOutlined className="text-blue-500" />
                              <span>{v.epaLicense.licenseDocument.name}</span>
                              <span className="text-red-500 text-[10px] font-bold">
                                (refer to Block 6)
                              </span>
                            </span>
                          }
                        />
                      ) : (
                        <Detail label="EPA License Document" value="N/A" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </Block>
          )}

        <Block
          title="5. Compliance & Safety"
          className={styles.fullWidth}
          sectionKey="complianceSafety"
          reviewData={review.complianceSafety}
          evaluationData={evaluation.complianceSafety}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Qualified Drivers"
            value={distribution.hasQualifiedDrivers ? "Yes" : "No"}
          />
          {distribution.hasQualifiedDrivers && (
            <Detail
              label="Drivers' Training Evidence"
              value={
                distribution.driversQualificationEvidence ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>
                      {distribution.driversQualificationEvidence.name}
                    </span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 6)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Emergency Kits"
            value={distribution.hasEmergencyKits ? "Yes" : "No"}
          />

          <Detail
            label="Record Keeping System"
            value={distribution.hasRecordKeepingSystem ? "Yes" : "No"}
          />
          {distribution.hasRecordKeepingSystem && (
            <Detail
              label="Record Keeping Evidence"
              value={
                distribution.recordKeepingEvidence ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{distribution.recordKeepingEvidence.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 6)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Contingency Plan"
            value={distribution.hasContingencyPlan ? "Yes" : "No"}
          />
          {distribution.hasContingencyPlan && (
            <Detail
              label="Contingency Plan Document"
              value={
                distribution.contingencyPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{distribution.contingencyPlanDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 6)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Insurance Cover"
            value={distribution.hasInsurance ? "Yes" : "No"}
          />
          {distribution.hasInsurance && (
            <Detail
              label="Insurance Certificate"
              value={
                distribution.insuranceCertificate ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{distribution.insuranceCertificate.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 6)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}
        </Block>

        {/* --- Supporting Documents --- */}
        <Block
          title="6. Supporting Documents"
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

export default PesticideDistributionReview;
