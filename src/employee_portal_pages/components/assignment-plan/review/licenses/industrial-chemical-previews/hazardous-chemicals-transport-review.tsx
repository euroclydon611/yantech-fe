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

interface HazardousChemicalsTransportationReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const HazardousChemicalsTransportationReview: React.FC<
  HazardousChemicalsTransportationReviewProps
> = ({ application, onApplicationUpdate }) => {
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

  const { transportation } = answers?.categoryDetails;

  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    serviceScopes: { status: "pending", comment: "" },
    vehicleFleet: { status: "pending", comment: "" },
    complianceSafety: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    serviceScopes: { status: "pending", comment: "" },
    vehicleFleet: { status: "pending", comment: "" },
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

  if (!transportation) {
    return (
      <div className="text-sm text-gray-500">
        Transportation details are missing. Please complete the Transportation
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Hazardous Chemicals Transport License Application Preview
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
            value={
              normalizeText(licenseCategory).concat(
                " (Hazardous Chemicals Transport)"
              ) || "—"
            }
          />
          <Detail
            label="Processing Type"
            value={normalizeText(processingType) || "—"}
          />
          <Detail label="Submitted Date:" value={formatDate4(createdAt)} />
          <Detail label="Updated Date:" value={formatDate4(updatedAt)} />
        </Block>

        {Array.isArray(transportation.serviceScopes) &&
          transportation.serviceScopes.length > 0 && (
            <Block
              title="Scope of Transport Services"
              className={styles.fullWidth}
              sectionKey="serviceScopes"
              reviewData={review.serviceScopes}
              evaluationData={evaluation.serviceScopes}
              onUpdate={handleUpdateSection}
            >
              {transportation.serviceScopes.map((s: any, i: number) => (
                <div key={s.id || i} className={styles.partnerItem}>
                  <h4
                    className={`${styles.subTitle} !font-extrabold text-base underline`}
                  >
                    Service Scope {i + 1}
                  </h4>
                  <Detail label="Chemical Type" value={s.pesticideType} />
                  <Detail
                    label="Estimated Quantities"
                    value={s.estimatedQuantities}
                  />
                  <Detail
                    label="Regions"
                    value={(s.geographicalAreas || []).join(", ") || "—"}
                  />
                </div>
              ))}
            </Block>
          )}

        {/* 8.2 Vehicles */}
        {Array.isArray(transportation.vehicleFleet) &&
          transportation.vehicleFleet.length > 0 && (
            <Block
              title="Vehicle Fleet"
              className={styles.fullWidth}
              sectionKey="vehicleFleet"
              reviewData={review.vehicleFleet}
              evaluationData={evaluation.vehicleFleet}
              onUpdate={handleUpdateSection}
            >
              {transportation.vehicleFleet.map((v: any, i: number) => (
                <div key={v.id || i} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Vehicle {i + 1}
                    </span>
                  </Divider>
                  <Detail label="Type" value={v.vehicleType} />
                  <Detail label="Registration No." value={v.registrationNo} />
                  <Detail label="Capacity" value={v.capacity} />
                  <Detail label="Special Features" value={v.specialFeatures} />
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
                          label="License Document"
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
                        <Detail label="License Document" value="N/A" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </Block>
          )}

        <Block
          title="Compliance & Safety"
          className={styles.fullWidth}
          sectionKey="complianceSafety"
          reviewData={review.complianceSafety}
          evaluationData={evaluation.complianceSafety}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Qualified Drivers"
            value={transportation.hasQualifiedDrivers ? "Yes" : "No"}
          />
          {transportation.hasQualifiedDrivers && (
            <Detail
              label="Drivers' Training Evidence"
              value={
                transportation.driversTrainingDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{transportation.driversTrainingDoc.name}</span>
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
            label="Emergency Equipment"
            value={transportation.hasEmergencyEquipment ? "Yes" : "No"}
          />
          {transportation.hasEmergencyEquipment && (
            <Detail
              label="Equipment"
              value={
                (transportation.emergencyEquipment || []).join(", ") || "—"
              }
            />
          )}

          <Detail
            label="Contingency Plan"
            value={transportation.hasContingencyPlan ? "Yes" : "No"}
          />
          {transportation.hasContingencyPlan && (
            <Detail
              label="Contingency Plan Document"
              value={
                transportation.contingencyPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{transportation.contingencyPlanDoc.name}</span>
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
            label="Record Keeping System"
            value={transportation.hasRecordKeepingSystem ? "Yes" : "No"}
          />
          {transportation.hasRecordKeepingSystem && (
            <Detail
              label="Record Keeping Template"
              value={
                transportation.recordKeepingSampleDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{transportation.recordKeepingSampleDoc.name}</span>
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
            value={transportation.hasInsurance ? "Yes" : "No"}
          />
          {transportation.hasInsurance && (
            <Detail
              label="Insurance Certificate"
              value={
                transportation.insuranceDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{transportation.insuranceDoc.name}</span>
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
          title="Supporting Documents"
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

export default HazardousChemicalsTransportationReview;
