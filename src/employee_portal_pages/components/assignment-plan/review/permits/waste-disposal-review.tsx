import React, { useMemo } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Alert, Button, Card, List, Typography } from "antd";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";
import {
  formatDate2,
  formatDate4,
  handleDocumentView,
} from "@/utils/helperFunction";
const { Text } = Typography;
import { formatLabel, normalizeText } from "@/utils/helpers";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";

// --- Props Interface ---
interface WasteDisposalReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

// Component for Yes/No checkboxes
const CheckboxDetail: React.FC<{
  label: string;
  value: boolean | undefined;
}> = ({ label, value }) => (
  <div className={styles.checkboxGroup}>
    <span>{label}:</span>
    <div className="flex gap-8">
      <div>
        <input type="checkbox" checked={value === true} readOnly /> Yes
      </div>
      <div>
        <input type="checkbox" checked={value === false} readOnly /> No
      </div>
    </div>
  </div>
);

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

// --- Main Review Component ---
export const WasteDisposalReview: React.FC<WasteDisposalReviewProps> = ({
  application,
  onApplicationUpdate,
}) => {
  const { wasteDispoaslDetails, clientId, submittedByAgent } = application;

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

  const defaultReviewStructure = {
    applicantInformation: { status: "pending", comment: null },
    wasteDescription: { status: "pending", comment: null },
    quantityAndHandling: { status: "pending", comment: null },
    preDisposalStorage: { status: "pending", comment: null },
    disposalFacility: { status: "pending", comment: null },
    wasteTransporter: { status: "pending", comment: null },
    manifestAndTiming: { status: "pending", comment: null },
    safetyMeasures: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
  };

  const defaultEvaluationStructure = {
    applicantInformation: { status: "pending", comment: null },
    wasteDescription: { status: "pending", comment: null },
    quantityAndHandling: { status: "pending", comment: null },
    preDisposalStorage: { status: "pending", comment: null },
    disposalFacility: { status: "pending", comment: null },
    wasteTransporter: { status: "pending", comment: null },
    manifestAndTiming: { status: "pending", comment: null },
    safetyMeasures: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
  };

  const review = useMemo(
    () => ({
      ...defaultReviewStructure,
      ...application?.review,
    }),
    [application?.review, defaultReviewStructure]
  );

  const evaluation = useMemo(
    () => ({
      ...defaultEvaluationStructure,
      ...application?.evaluation,
    }),
    [application?.evaluation, defaultEvaluationStructure]
  );

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    await onApplicationUpdate(sectionKey, type, status, comment);
  };

  return (
    <div className={styles.reviewPage}>
      <h2 className={`${styles.mainTitle} font-mono`}>
        Hazardous Waste Disposal Permit application Review
      </h2>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block
          title="1. Applicant Information"
          sectionKey="applicantInformation"
          reviewData={review.applicantInformation}
          evaluationData={evaluation.applicantInformation}
          onUpdate={handleUpdateSection}
        >
          <>
            <Detail
              label="Client ID/Registration No:"
              value={clientId?.clientId}
            />
            <Detail
              label="Name:"
              value={
                clientId?.userType === "individual"
                  ? `${clientId?.firstName ?? ""} ${
                      clientId?.lastName ?? ""
                    }`.trim()
                  : clientId?.userType === "organization"
                  ? clientId?.organizationName
                  : clientId?.userType === "government"
                  ? clientId?.agencyName
                  : ""
              }
            />
            <Detail
              label="Contact Person:"
              value={`${clientId?.firstName} ${clientId?.lastName}`}
            />
            <Detail label="Email:" value={clientId?.email} />
            <Detail label="Telephone:" value={clientId?.phone} />
            <Detail label="Fax:" value={clientId?.fax} />

            <Detail
              label="Type of Business:"
              value={formatArray(applicantInformation?.typeOfBusiness, true)}
            />

            {applicantInformation?.typeOfBusinessOther && (
              <Detail
                label="Other Business Type:"
                value={applicantInformation?.typeOfBusinessOther}
              />
            )}

            {submittedByAgent && (
              <div className="mt-10">
                <h1 className="font-bold mb-2">Agent Information</h1>
                <hr className="bg--600 mb-2" />
                <Detail
                  label="Name:"
                  value={`${submittedByAgent?.firstName} ${submittedByAgent?.lastName}`}
                />
                <Detail label="Email:" value={submittedByAgent?.email} />
                <Detail label="Telephone:" value={submittedByAgent?.phone} />
              </div>
            )}
          </>
        </Block>

        {/* --- BLOCK 2: Waste Description --- */}
        <Block
          title="2. Waste Description"
          sectionKey="wasteDescription"
          reviewData={review.wasteDescription}
          evaluationData={evaluation.wasteDescription}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="3. Quantity and Handling"
          sectionKey="quantityAndHandling"
          reviewData={review.quantityAndHandling}
          evaluationData={evaluation.quantityAndHandling}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="4. Pre-Disposal Storage"
          sectionKey="preDisposalStorage"
          reviewData={review.preDisposalStorage}
          evaluationData={evaluation.preDisposalStorage}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="5. Disposal Facility"
          sectionKey="disposalFacility"
          reviewData={review.disposalFacility}
          evaluationData={evaluation.disposalFacility}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="6. Waste Transporter"
          sectionKey="wasteTransporter"
          reviewData={review.wasteTransporter}
          evaluationData={evaluation.wasteTransporter}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="7. Manifest and Timing"
          sectionKey="manifestAndTiming"
          reviewData={review.manifestAndTiming}
          evaluationData={evaluation.manifestAndTiming}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="8. Environmental and Safety Measures"
          sectionKey="safetyMeasures"
          reviewData={review.safetyMeasures}
          evaluationData={evaluation.safetyMeasures}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="9. Supporting Documents"
          className={styles.fullWidth}
          sectionKey="attachments"
          reviewData={review.attachments}
          evaluationData={evaluation.attachments}
          onUpdate={handleUpdateSection}
        >
          <>
            {/* Supporting Documents */}
            {application?.attachments?.length > 0 ? (
              <div className="bg-slate-50 rounded-lg p-2">
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={application.attachments}
                  renderItem={(attachment: any) => (
                    <List.Item key={attachment._id}>
                      <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow bg-white border border-gray-200 !p-3"
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileOutlined className="text-red-600" />
                            <Text
                              strong
                              className="text-gray-800 text-[10px] uppercase"
                            >
                              {formatLabel(attachment.label).replace(/_/g, " ")}
                            </Text>
                          </div>
                          <Text
                            className="text-gray-600 text-xs"
                            ellipsis={{ tooltip: attachment.originalname }}
                          >
                            {attachment.originalname}
                          </Text>
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleDocumentView(attachment)}
                            className="text-red-600 hover:text-red-800 p-0 h-auto font-medium text-xs"
                          >
                            View Document
                          </Button>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Alert
                message="No Documents Attached"
                type="info"
                showIcon
                style={{ textAlign: "center", marginTop: 16 }}
              />
            )}
          </>
        </Block>
      </div>
    </div>
  );
};

export default WasteDisposalReview;
