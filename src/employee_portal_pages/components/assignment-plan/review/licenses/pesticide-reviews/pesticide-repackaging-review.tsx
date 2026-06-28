import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { Divider, Typography } from "antd";
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
import ScaleLocationBlock from "../scale-location-block";
import ProposedFeeBlock from "../proposed-fee-block";

interface RepackagingReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideRepackagingReview: React.FC<RepackagingReviewProps> = ({
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

  const { repackaging } = answers?.categoryDetails;

  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processContamination: { status: "pending", comment: "" },
    qualityControl: { status: "pending", comment: "" },
    staffTraining: { status: "pending", comment: "" },
    eiaPermit: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processContamination: { status: "pending", comment: "" },
    qualityControl: { status: "pending", comment: "" },
    staffTraining: { status: "pending", comment: "" },
    eiaPermit: { status: "pending", comment: "" },
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

  if (!repackaging) {
    return (
      <div className="text-sm text-gray-500">
        Repackaging details are missing. Please complete the Repackaging
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Repackaging License Application Peview
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

        {Array.isArray(repackaging.products) &&
          repackaging.products.length > 0 && (
            <Block
              title="3. Repackaged Products"
              className={styles.fullWidth}
              sectionKey="products"
              reviewData={review.products}
              evaluationData={evaluation.products}
              onUpdate={handleUpdateSection}
            >
              {repackaging.products.map((p: any, i: number) => (
                <div key={p.id || i} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Product {i + 1}: {p.name}
                    </span>
                  </Divider>
                  <Detail label="Name" value={p.name} />
                  <Detail label="Type" value={p.productType} />
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
                  <Detail label="Supplier" value={p.supplierName} />
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

        {/* 10.2 Location */}
        <Block
          title="4. Facility Location"
          sectionKey="facilityLocation"
          reviewData={review.facilityLocation}
          evaluationData={evaluation.facilityLocation}
          onUpdate={handleUpdateSection}
        >
          <Detail label="Region" value={repackaging.facilityLocation?.region} />
          <Detail
            label="District"
            value={repackaging.facilityLocation?.district}
          />
          <Detail
            label="City/Town"
            value={repackaging.facilityLocation?.city}
          />
          <Detail
            label="Address"
            value={repackaging.facilityLocation?.address}
          />
          <Detail label="GPS/Link" value={repackaging.facilityLocation?.gps} />
        </Block>

        {/* 10.3 - 10.4 Process */}
        <Block
          title="5. Process & Contamination Prevention"
          sectionKey="processContamination"
          reviewData={review.processContamination}
          evaluationData={evaluation.processContamination}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Repackaging Process"
            value={repackaging.repackagingProcessDescription || "—"}
          />
          <Detail
            label="Contamination Prevention Procedures"
            value={repackaging.contaminationPreventionProcedures || "—"}
          />
        </Block>

        {/* 10.5 Quality Control */}
        <Block
          title="6. Quality Control"
          sectionKey="qualityControl"
          reviewData={review.qualityControl}
          evaluationData={evaluation.qualityControl}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Quality Control System"
            value={repackaging.hasQualityControlSystem ? "Yes" : "No"}
          />
          {repackaging.hasQualityControlSystem && (
            <Detail
              label="Description"
              value={repackaging.qualityControlDescription || "—"}
            />
          )}
        </Block>

        <Block
          title="7. Staff Training"
          sectionKey="staffTraining"
          reviewData={review.staffTraining}
          evaluationData={evaluation.staffTraining}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Provision for Regular Staff Training"
            value={repackaging.hasStaffTraining ? "Yes" : "No"}
          />
          {repackaging.hasStaffTraining && (
            <Detail
              label="Training Plan"
              value={
                repackaging.staffTrainingPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{repackaging.staffTrainingPlanDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 9)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}
        </Block>

        {/* 10.7 EIA/EMP Permit */}
        <Block
          title="8. EIA/EMP Permit"
          sectionKey="eiaPermit"
          reviewData={review.eiaPermit}
          evaluationData={evaluation.eiaPermit}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Permit Available"
            value={repackaging.hasEiaEmpPermit ? "Yes" : "No"}
          />
          {repackaging.hasEiaEmpPermit && (
            <Detail
              label="Permit Document"
              value={
                repackaging.eiaEmpPermitDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{repackaging.eiaEmpPermitDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 9)
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
          title="9. Supporting Documents"
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

export default PesticideRepackagingReview;
