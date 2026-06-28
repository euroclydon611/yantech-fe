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

interface ManufactureReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideManufactureReview: React.FC<ManufactureReviewProps> = ({
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

  const { manufacture } = answers?.categoryDetails;

  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    environmentalPermit: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processDescription: { status: "pending", comment: "" },
    wasteManagement: { status: "pending", comment: "" },
    emergencyResponse: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    environmentalPermit: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processDescription: { status: "pending", comment: "" },
    wasteManagement: { status: "pending", comment: "" },
    emergencyResponse: { status: "pending", comment: "" },
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

  if (!manufacture) {
    return (
      <div className="text-sm text-gray-500">
        Manufacture details are missing. Please complete the Manufacture
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Manufacture License Application Review
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

        {/* 12.1 Environmental Permit */}
        <Block
          title="3. Environmental Permit"
          className={styles.fullWidth}
          sectionKey="environmentalPermit"
          reviewData={review.environmentalPermit}
          evaluationData={evaluation.environmentalPermit}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Has Environmental Permit"
            value={
              manufacture.hasEnvironmentalPermit === true
                ? "Yes"
                : manufacture.hasEnvironmentalPermit === false
                ? "No"
                : "—"
            }
          />
          {manufacture.hasEnvironmentalPermit && (
            <>
              <Detail
                label="Permit Number"
                value={manufacture.environmentalPermit?.permitNumber}
              />
              <Detail
                label="Issued Date"
                value={manufacture.environmentalPermit?.permitIssuedDate}
              />
              <Detail
                label="Expiry Date"
                value={manufacture.environmentalPermit?.permitExpiryDate}
              />
              {manufacture.environmentalPermit?.permitDocument ? (
                <Detail
                  label="Permit Document"
                  value={
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>
                        {manufacture.environmentalPermit.permitDocument.name}
                      </span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 9)
                      </span>
                    </span>
                  }
                />
              ) : (
                <Detail label="Permit Document" value="N/A" />
              )}
            </>
          )}
        </Block>

        {/* 12.2 Products */}
        {Array.isArray(manufacture.products) &&
          manufacture.products.length > 0 && (
            <Block
              title="4. Manufactured Products"
              className={styles.fullWidth}
              sectionKey="products"
              reviewData={review.products}
              evaluationData={evaluation.products}
              onUpdate={handleUpdateSection}
            >
              {manufacture.products.map((p: any, i: number) => (
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
                    label="Production Volume"
                    value={p.productionVolume}
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

        {/* 5. Facility Location */}
        <Block
          title="5. Facility Location"
          className={styles.fullWidth}
          sectionKey="facilityLocation"
          reviewData={review.facilityLocation}
          evaluationData={evaluation.facilityLocation}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Region"
            value={manufacture.facilityLocation?.region || "—"}
          />
          <Detail
            label="District"
            value={manufacture.facilityLocation?.district || "—"}
          />
          <Detail
            label="City/Town"
            value={manufacture.facilityLocation?.city || "—"}
          />
          <Detail
            label="Address"
            value={manufacture.facilityLocation?.address || "—"}
          />
          <Detail
            label="Google Location/GPS"
            value={manufacture.facilityLocation?.gps || "—"}
          />
        </Block>

        <Block
          title="6. Process Description"
          sectionKey="processDescription"
          reviewData={review.processDescription}
          evaluationData={evaluation.processDescription}
          onUpdate={handleUpdateSection}
        >
          {manufacture.processDescriptionDoc ? (
            <Detail
              label="Process Document"
              value={
                <span className="flex items-center gap-2">
                  <FileTextOutlined className="text-blue-500" />
                  <span>{manufacture.processDescriptionDoc.name}</span>
                  <span className="text-red-500 text-[10px] font-bold">
                    (refer to Block 9)
                  </span>
                </span>
              }
            />
          ) : (
            <Detail label="Process Document" value="N/A" />
          )}
        </Block>

        <Block
          title="7. Waste Management Plan"
          sectionKey="wasteManagement"
          reviewData={review.wasteManagement}
          evaluationData={evaluation.wasteManagement}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Has Waste Management Plan"
            value={manufacture.hasWasteManagementPlan ? "Yes" : "No"}
          />
          {manufacture.hasWasteManagementPlan && (
            <Detail
              label="Waste Management Plan"
              value={
                manufacture.wasteManagementPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{manufacture.wasteManagementPlanDoc.name}</span>
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

        {/* 12.5 Emergency Response Plan */}
        <Block
          title="8. Emergency Response Plan"
          sectionKey="emergencyResponse"
          reviewData={review.emergencyResponse}
          evaluationData={evaluation.emergencyResponse}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Has Emergency Response Plan"
            value={manufacture.hasEmergencyResponsePlan ? "Yes" : "No"}
          />
          {manufacture.hasEmergencyResponsePlan && (
            <Detail
              label="Emergency Response Plan"
              value={
                manufacture.emergencyResponsePlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{manufacture.emergencyResponsePlanDoc.name}</span>
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

export default PesticideManufactureReview;
