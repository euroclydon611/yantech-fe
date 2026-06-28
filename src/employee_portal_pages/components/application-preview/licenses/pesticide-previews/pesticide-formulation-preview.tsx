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

interface FormulationReviewProps {
  application: any;
}

const PesticideFormulationPreview: React.FC<FormulationReviewProps> = ({
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
  const { formulation } = answers?.categoryDetails;

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
        Formulation License Application Preview
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
                      (refer to Block 7)
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </Block>
        )}

        {Array.isArray(formulation.products) &&
          formulation.products.length > 0 && (
            <Block title="3. Formulated Products" className={styles.fullWidth}>
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
        <Block title="4. Facility Location">
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

        <Block title="5. Process Description">
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

        <Block title="6. Compliance & Safety" className={styles.fullWidth}>
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
        <Block title="7. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideFormulationPreview;
