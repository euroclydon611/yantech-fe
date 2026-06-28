import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Card, Typography, Collapse, Row, Col } from "antd";
import {
  formatDate2,
  formatDate4,
  handleDocumentView,
} from "@/utils/helperFunction";
import { normalizeText } from "@/utils/helpers";
import { Block, Detail, CheckboxDetail } from "../../review/helpers";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title, Text } = Typography;

interface WasteDisposalReviewProps {
  application: any;
}

// Utility function to format arrays - handles various data types
const formatArray = (
  arr: string[] | string | undefined | null,
  normalize = false
) => {
  // Handle null or undefined
  if (!arr) return "None specified";

  // Handle string (single value)
  if (typeof arr === "string") {
    return normalize ? normalizeText(arr) : arr;
  }

  // Handle array
  if (Array.isArray(arr)) {
    if (arr.length === 0) return "None specified";
    return arr
      .map((item) => (normalize ? normalizeText(item) : item))
      .join(", ");
  }

  // Handle other types (convert to string)
  const stringValue = String(arr);
  return normalize ? normalizeText(stringValue) : stringValue;
};

// Updated function to format location objects
const formatLocation = (location: any) => {
  if (!location) return "Not specified";

  if (typeof location === "string") return location;

  // Handle location object structure
  const parts = [];
  if (location.address) parts.push(location.address);
  if (location.city) parts.push(location.city);
  if (location.district) parts.push(location.district);
  if (location.region) parts.push(location.region);

  return parts.length > 0 ? parts.join(", ") : "Not specified";
};

// Updated function to format transporter information
const formatTransporters = (transporters: any[]) => {
  if (
    !transporters ||
    !Array.isArray(transporters) ||
    transporters.length === 0
  ) {
    return "No transporters specified";
  }

  return transporters
    .map((transporter, index) => (
      <div key={index} style={{ marginBottom: "8px" }}>
        <strong>{transporter.name || `Transporter ${index + 1}`}</strong>
        {transporter.contactEmail && (
          <div>Email: {transporter.contactEmail}</div>
        )}
        {transporter.contactPhone && (
          <div>Phone: {transporter.contactPhone}</div>
        )}
        {transporter.vehicleNumber && (
          <div>Vehicle: {transporter.vehicleNumber}</div>
        )}
        {transporter.isEPALicensed !== undefined && (
          <div>EPA Licensed: {transporter.isEPALicensed ? "Yes" : "No"}</div>
        )}
        {transporter.epaLicense?.licenseNumber && (
          <div>License Number: {transporter.epaLicense.licenseNumber}</div>
        )}
        {transporter.epaLicense?.licenseIssuedDate && (
          <div>
            Date of Issue:{" "}
            {formatDate2(transporter.epaLicense.licenseIssuedDate)}
          </div>
        )}
        {transporter.epaLicense?.licenseExpiryDate && (
          <div>
            Expiry Date: {formatDate2(transporter.epaLicense.licenseExpiryDate)}
          </div>
        )}
      </div>
    ))
    .slice(0, 3); // Limit to first 3 transporters for display
};

export const WasteDisposalPreview: React.FC<WasteDisposalReviewProps> = ({
  application,
}) => {
  const {
    wasteDispoaslDetails,
    permitType,
    permitCategory,
    processingType,
  } = application;

 
  const {
    applicantInformation,
    wasteDescription,
    quantityAndHandling,
    preDisposalStorage,
    disposalFacility,
    wasteTransporter,
    manifestAndTiming,
    safetyMeasures,
    mandatoryAttachments,
  } = wasteDispoaslDetails || {};

  if (!wasteDispoaslDetails) {
    return <div>Loading application details...</div>;
  }

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={`${styles.mainTitle} font-mono`}>
        Waste Disposal Notification Document
      </h2>

      {/* Header */}
      <Card style={{ marginBottom: "clamp(16px, 2.5vw, 20px)" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title
              level={2}
              style={{ margin: 0, fontSize: "clamp(18px, 3vw, 24px)" }}
            >
              Waste Disposal Application Review
            </Title>
            <Text style={{ fontSize: "clamp(12px, 2vw, 14px)", color: "#666" }}>
              Hazardous Waste Disposal Notification
            </Text>
          </Col>
        </Row>

        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={8}>
            <Text strong style={{ fontSize: "clamp(11px, 1.8vw, 13px)" }}>
              Permit Type: {normalizeText(permitType)}
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text strong style={{ fontSize: "clamp(11px, 1.8vw, 13px)" }}>
              Processing Type: {normalizeText(processingType)}
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text strong style={{ fontSize: "clamp(11px, 1.8vw, 13px)" }}>
              Notification Type: {normalizeText(permitCategory)}
            </Text>
          </Col>
        </Row>
      </Card>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block title="1. Applicant Information">
          <ApplicantInformationBlock application={application} />
        </Block>


        {/* --- BLOCK 2: Waste Description --- */}
        <Block title="2. Waste Description">
          <Detail
            label="Submitted Date:"
            value={formatDate4(application.createdAt)}
          />
          <Detail
            label="Updated Date:"
            value={formatDate4(application.updatedAt)}
          />
          <Detail
            label="Source of Waste:"
            value={wasteDescription?.sourceOfWaste}
          />
          <Detail
            label="Type of Waste:"
            value={wasteDescription?.typeOfWaste}
          />
          <Detail
            label="EPA Hazardous Waste Code:"
            value={wasteDescription?.epaHazardousWasteCode}
          />
          <Detail
            label="Waste Characteristics:"
            value={formatArray(wasteDescription?.wasteCharacteristics, true)}
          />
          <Detail
            label="Physical State:"
            value={formatArray(wasteDescription?.physicalState, true)}
          />
        </Block>

        {/* --- BLOCK 3: Quantity and Handling --- */}
        <Block title="3. Quantity and Handling">
          <Detail
            label="Estimated Quantity:"
            value={
              quantityAndHandling?.estimatedQuantity &&
              quantityAndHandling?.unit
                ? `${quantityAndHandling.estimatedQuantity} ${quantityAndHandling.unit}`
                : "Not specified"
            }
          />
          <Detail
            label="Frequency of Disposal:"
            value={normalizeText(quantityAndHandling?.frequencyOfDisposal)}
          />
          <Detail
            label="Chemical Composition:"
            value={quantityAndHandling?.chemicalComposition}
          />
          <Detail
            label="Special Handling Instructions:"
            value={
              quantityAndHandling?.specialHandlingInstructions ||
              "None specified"
            }
          />
        </Block>

        {/* --- BLOCK 4: Pre-Disposal Storage --- */}
        <Block title="4. Pre-Disposal Storage">
          <Detail
            label="Storage Method:"
            value={preDisposalStorage?.storageMethod}
          />
          <Detail
            label="Duration of Storage:"
            value={preDisposalStorage?.durationOfStorage}
          />
          <Detail
            label="Packaging Type:"
            value={formatArray(preDisposalStorage?.packagingType, true)}
          />
          {preDisposalStorage?.packagingTypeOther && (
            <Detail
              label="Other Packaging Type:"
              value={preDisposalStorage?.packagingTypeOther}
            />
          )}
        </Block>

        {/* --- BLOCK 5: Disposal Facility --- */}
        <Block title="5. Disposal Facility">
          <Detail
            label="Proposed Disposal Method:"
            value={formatArray(disposalFacility?.proposedDisposalMethod, true)}
          />
          <Detail
            label="Justification for Method:"
            value={disposalFacility?.justificationForMethod}
          />
          <Detail
            label="Facility Name:"
            value={
              disposalFacility?.facilityName === "other"
                ? disposalFacility?.customFacilityName || "Other facility"
                : normalizeText(disposalFacility?.facilityName)
            }
          />
          <Detail
            label="Facility Location:"
            value={formatLocation(disposalFacility?.facilityLocation)}
          />
        </Block>

        {/* --- BLOCK 6: Waste Transporter --- */}
        <Block title="6. Waste Transporter">
          <Detail
            label="Proposed Transportation Method:"
            value={formatArray(
              wasteTransporter?.proposedTransportationMethod,
              true
            )}
          />

          <div style={{ marginTop: "16px" }}>
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Transporters:
            </strong>
            {wasteTransporter?.transporters &&
            wasteTransporter.transporters.length > 0 ? (
              <div>
                {formatTransporters(wasteTransporter.transporters)}
                {wasteTransporter.transporters.length > 3 && (
                  <div style={{ fontStyle: "italic", color: "#666" }}>
                    ... and {wasteTransporter.transporters.length - 3} more
                    transporter(s)
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: "#666", fontStyle: "italic" }}>
                No transporters specified
              </div>
            )}
          </div>
        </Block>

        {/* --- BLOCK 7: Manifest and Timing --- */}
        <Block title="7. Manifest and Timing">
          <CheckboxDetail
            label="Manifest Required"
            value={manifestAndTiming?.isManifestRequired}
          />
          <Detail
            label="Waste Tracking Manifest Number:"
            value={
              manifestAndTiming?.wasteTrackingManifestNumber || "Not provided"
            }
          />
          <Detail
            label="Estimated Transport Date:"
            value={
              manifestAndTiming?.estimatedTransportDate
                ? formatDate2(manifestAndTiming.estimatedTransportDate)
                : "Not specified"
            }
          />

          {manifestAndTiming?.isManifestRequired &&
            manifestAndTiming?.manifestDocument && (
              <div
                className={styles.documentItem}
                style={{ marginTop: "12px" }}
              >
                <strong>Manifest Document:</strong>
                <span className={styles.documentAttached}>✓ Attached</span>
              </div>
            )}
        </Block>

        {/* --- BLOCK 8: Safety & Compliance Measures --- */}
        <Block title="8. Environmental and Safety Measures">
          <CheckboxDetail
            label="Emergency Preparedness and Prevention Plan"
            value={safetyMeasures?.hasEmergencyPreparednessplan}
          />

          <CheckboxDetail
            label="Personnel Training in accordance with regulatory requirements"
            value={safetyMeasures?.hasPersonnelTraining}
          />

          {safetyMeasures?.hasPersonnelTraining && (
            <div className={styles.documentItem}>
              <strong>Personnel Training Evidence:</strong>
              <span
                className={
                  safetyMeasures?.personnelTrainingEvidence
                    ? styles.documentAttached
                    : styles.documentMissing
                }
              >
                {safetyMeasures?.personnelTrainingEvidence
                  ? "✓ Attached"
                  : "✗ Not Attached"}
              </span>
            </div>
          )}

          <CheckboxDetail
            label="Insurance policies covering waste management activities"
            value={safetyMeasures?.hasInsurancePolicies}
          />

          {safetyMeasures?.hasInsurancePolicies && (
            <div className={styles.documentItem}>
              <strong>Insurance Policy Documents:</strong>
              <span
                className={
                  safetyMeasures?.insurancePolicyDocuments
                    ? styles.documentAttached
                    : styles.documentMissing
                }
              >
                {safetyMeasures?.insurancePolicyDocuments
                  ? "✓ Attached"
                  : "✗ Not Attached"}
              </span>
            </div>
          )}

          <CheckboxDetail
            label="Contingency/spill plan specific to the waste"
            value={safetyMeasures?.hasContingencySpillPlan}
          />
        </Block>

        {/* --- BLOCK 9: Supporting Documents --- */}
        <Block title="9. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default WasteDisposalPreview;
