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

interface FormulationReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideFormulationReview: React.FC<FormulationReviewProps> = ({
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

  const { formulation } = answers?.categoryDetails;

  // Initialize review and evaluation data
  // Merge existing data with defaults to ensure all keys are present
  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processDescription: { status: "pending", comment: "" },
    complianceSafety: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    products: { status: "pending", comment: "" },
    facilityLocation: { status: "pending", comment: "" },
    processDescription: { status: "pending", comment: "" },
    complianceSafety: { status: "pending", comment: "" },
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

  if (!formulation) {
    return (
      <div className="text-sm text-gray-500">
        Formulation details are missing. Please complete the Formulation
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Formulation License Application Review
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

        {Array.isArray(formulation.products) &&
          formulation.products.length > 0 && (
            <Block
              title="3. Formulated Products"
              className={styles.fullWidth}
              sectionKey="products"
              reviewData={review.products}
              evaluationData={evaluation.products}
              onUpdate={handleUpdateSection}
            >
              {formulation.products.map((p: any, i: number) => (
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
                  <Detail label="Supplier" value={p.supplierName} />
                  <Detail
                    label="Estimated Production"
                    value={p.estimatedProduction}
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

        {/* 9.2 Location */}
        <Block
          title="4. Facility Location"
          sectionKey="facilityLocation"
          reviewData={review.facilityLocation}
          evaluationData={evaluation.facilityLocation}
          onUpdate={handleUpdateSection}
        >
          <Detail label="Region" value={formulation.facilityLocation?.region} />
          <Detail
            label="District"
            value={formulation.facilityLocation?.district}
          />
          <Detail
            label="City/Town"
            value={formulation.facilityLocation?.city}
          />
          <Detail
            label="Address"
            value={formulation.facilityLocation?.address}
          />
          <Detail label="GPS/Link" value={formulation.facilityLocation?.gps} />
        </Block>

        <Block
          title="5. Process Description"
          sectionKey="processDescription"
          reviewData={review.processDescription}
          evaluationData={evaluation.processDescription}
          onUpdate={handleUpdateSection}
        >
          {formulation.processDescriptionDoc ? (
            <Detail
              label="Process Document"
              value={
                <span className="flex items-center gap-2">
                  <FileTextOutlined className="text-blue-500" />
                  <span>{formulation.processDescriptionDoc.name}</span>
                  <span className="text-red-500 text-[10px] font-bold">
                    (refer to Block 7)
                  </span>
                </span>
              }
            />
          ) : (
            <Detail label="Process Document" value="N/A" />
          )}
        </Block>

        <Block
          title="6. Compliance & Safety"
          className={styles.fullWidth}
          sectionKey="complianceSafety"
          reviewData={review.complianceSafety}
          evaluationData={evaluation.complianceSafety}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Quality Control System"
            value={formulation.hasQualityControl ? "Yes" : "No"}
          />
          {formulation.hasQualityControl && (
            <Detail
              label="Description"
              value={formulation.qualityControlDescription || "—"}
            />
          )}

          <Detail
            label="Waste Management Plan"
            value={formulation.hasWasteManagementPlan ? "Yes" : "No"}
          />
          {formulation.hasWasteManagementPlan && (
            <Detail
              label="Waste Management Plan"
              value={
                formulation.wasteManagementPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{formulation.wasteManagementPlanDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 7)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Effluent/Emission Treatment"
            value={formulation.hasEffluentTreatment ? "Yes" : "No"}
          />

          <Detail
            label="OHS Plan"
            value={formulation.hasOhsPlan ? "Yes" : "No"}
          />
          {formulation.hasOhsPlan && (
            <Detail
              label="OHS Plan"
              value={
                formulation.ohsPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{formulation.ohsPlanDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 7)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Emergency Response Plan"
            value={formulation.hasEmergencyResponsePlan ? "Yes" : "No"}
          />
          {formulation.hasEmergencyResponsePlan && (
            <Detail
              label="Emergency Response Plan"
              value={
                formulation.emergencyResponsePlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{formulation.emergencyResponsePlanDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 7)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="EIA/EMP Permit"
            value={formulation.hasEiaEmpPermit ? "Yes" : "No"}
          />
          {formulation.hasEiaEmpPermit && (
            <Detail
              label="EIA/EMP Permit"
              value={
                formulation.eiaEmpPermitDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{formulation.eiaEmpPermitDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 7)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Incident Reporting System"
            value={formulation.hasIncidentReporting ? "Yes" : "No"}
          />
          {formulation.hasIncidentReporting && (
            <Detail
              label="Incident Reporting Template"
              value={
                formulation.incidentReportingTemplateDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{formulation.incidentReportingTemplateDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 7)
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
          title="7. Supporting Documents"
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

export default PesticideFormulationReview;
