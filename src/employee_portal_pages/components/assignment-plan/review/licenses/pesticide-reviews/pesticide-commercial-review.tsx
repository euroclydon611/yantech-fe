import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { Divider, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import ScaleLocationBlock from "../scale-location-block";
import ProposedFeeBlock from "../proposed-fee-block";

interface CommercialReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideCommercialReview: React.FC<CommercialReviewProps> = ({
  application,
  onApplicationUpdate,
}) => {
  const {
    applicationType,
    licenseCategory,
    licenseType,
    processingType,
    answers,
    createdAt,
    updatedAt,
    scale,
    location,
  } = application;

  const { commercial } = answers?.categoryDetails;

  // Initialize review and evaluation properties if they don't exist
  // Merge existing data with defaults to ensure all keys are present
  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    operationTypes: { status: "pending", comment: null },
    pesticideStatus: { status: "pending", comment: null },
    applicators: { status: "pending", comment: null },
    equipment: { status: "pending", comment: null },
    safetyCompliance: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    operationTypes: { status: "pending", comment: null },
    pesticideStatus: { status: "pending", comment: null },
    applicators: { status: "pending", comment: null },
    equipment: { status: "pending", comment: null },
    safetyCompliance: { status: "pending", comment: null },
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
    await onApplicationUpdate(sectionKey, type, status, comment);
  };

  if (!commercial) {
    return (
      <div className="text-sm text-gray-500">
        Commercial application details are missing. Please complete the
        Commercial section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Commercial Pesticide Applicator License Application Review
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
        {/* --- BLOCK 3: Operation Types --- */}
        <Block
          title="3. Operation Types"
          sectionKey="operationTypes"
          reviewData={review.operationTypes}
          evaluationData={evaluation.operationTypes}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Selected"
            value={(commercial.operationTypes || []).join(", ") || "—"}
          />
          {Array.isArray(commercial.operationTypes) &&
            commercial.operationTypes.includes("Other") && (
              <Detail
                label="Other (specify)"
                value={commercial.operationTypesOther || "—"}
              />
            )}
        </Block>

        {/* --- BLOCK 4: Pesticide Status --- */}
        <Block
          title="4. Pesticide Status"
          sectionKey="pesticideStatus"
          reviewData={review.pesticideStatus}
          evaluationData={evaluation.pesticideStatus}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Status of pesticides to be used"
            value={commercial.pesticideStatusToBeUsed || "—"}
          />

          {(commercial.pesticideStatusToBeUsed === "Restricted use" ||
            commercial.pesticideStatusToBeUsed === "Both") && (
            <>
              <Detail
                label="Includes Methyl Bromide"
                value={commercial.hasRestrictedMethylBromide ? "Yes" : "No"}
              />
              {commercial.restrictedUseEvidenceDoc && (
                <Detail
                  label="Restricted Use Evidence"
                  value={
                    commercial.restrictedUseEvidenceDoc?.name ? (
                      <span className="flex items-center gap-2">
                        <FileTextOutlined className="text-blue-500" />
                        <span>{commercial.restrictedUseEvidenceDoc.name}</span>
                        <span className="text-red-500 text-[10px] font-bold">
                          (refer to Block 8)
                        </span>
                      </span>
                    ) : (
                      "N/A"
                    )
                  }
                />
              )}
            </>
          )}
        </Block>

        {/* --- BLOCK 5: Applicators --- */}
        {Array.isArray(commercial.applicators) &&
          commercial.applicators.length > 0 && (
            <Block
              title="5. Applicators / Supervisors"
              className={styles.fullWidth}
              sectionKey="applicators"
              reviewData={review.applicators}
              evaluationData={evaluation.applicators}
              onUpdate={handleUpdateSection}
            >
              {commercial.applicators.map((a: any, i: number) => (
                <div key={a.id || i} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Applicator {i + 1}
                    </span>
                  </Divider>
                  <Detail label="Name" value={a.name} />
                  <Detail label="Certification" value={a.certification} />
                  {a.trainingRecordsDoc && (
                    <Detail
                      label="Training/Certification Records"
                      value={
                        a.trainingRecordsDoc?.name ? (
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{a.trainingRecordsDoc.name}</span>
                            <span className="text-red-500 text-[10px] font-bold">
                              (refer to Block 8)
                            </span>
                          </span>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </Block>
          )}

        {/* --- BLOCK 6: Equipment --- */}
        {Array.isArray(commercial.equipment) &&
          commercial.equipment.length > 0 && (
            <Block
              title="6. Equipment"
              className={styles.fullWidth}
              sectionKey="equipment"
              reviewData={review.equipment}
              evaluationData={evaluation.equipment}
              onUpdate={handleUpdateSection}
            >
              {commercial.equipment.map((e: any, i: number) => (
                <div key={e.id || i} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Equipment {i + 1}
                    </span>
                  </Divider>
                  <Detail label="Type" value={e.equipmentType} />
                  <Detail
                    label="Maintenance Schedule"
                    value={e.maintenanceSchedule}
                  />
                  <Detail
                    label="Calibrated"
                    value={e.isCalibrated ? "Yes" : "No"}
                  />
                  {e.isCalibrated && (
                    <>
                      <Detail
                        label="Last Calibration Date"
                        value={e.lastCalibrationDate}
                      />
                      <Detail
                        label="Equipment Calibrated"
                        value={e.lastCalibrationEquipment}
                      />
                      {e.calibrationLogDoc && (
                        <Detail
                          label="Calibration Log"
                          value={
                            e.calibrationLogDoc?.name ? (
                              <span className="flex items-center gap-2">
                                <FileTextOutlined className="text-blue-500" />
                                <span>{e.calibrationLogDoc.name}</span>
                                <span className="text-red-500 text-[10px] font-bold">
                                  (refer to Block 8)
                                </span>
                              </span>
                            ) : (
                              "N/A"
                            )
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </Block>
          )}

        {/* --- BLOCK 7: Safety, Planning, and Compliance --- */}
        <Block
          title="7. Safety, Planning, and Compliance"
          className={styles.fullWidth}
          sectionKey="safetyCompliance"
          reviewData={review.safetyCompliance}
          evaluationData={evaluation.safetyCompliance}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="PPE Policy & Health Surveillance"
            value={commercial.hasPpePolicy ? "Yes" : "No"}
          />
          {commercial.hasPpePolicy && commercial.ppePolicyDoc && (
            <Detail
              label="PPE Policy & Health Surveillance"
              value={
                commercial.ppePolicyDoc?.name ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{commercial.ppePolicyDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 8)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Storage Facility"
            value={commercial.hasStorageFacility ? "Yes" : "No"}
          />

          <Detail
            label="Emergency Response Plan"
            value={commercial.hasEmergencyResponsePlan ? "Yes" : "No"}
          />
          {commercial.hasEmergencyResponsePlan &&
            commercial.emergencyResponsePlanDoc && (
              <Detail
                label="Emergency Response Plan Document"
                value={
                  commercial.emergencyResponsePlanDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{commercial.emergencyResponsePlanDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 8)
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )
                }
              />
            )}

          <Detail
            label="Waste Disposal Plan"
            value={commercial.hasWasteDisposalPlan ? "Yes" : "No"}
          />
          {commercial.hasWasteDisposalPlan &&
            commercial.wasteDisposalPlanDoc && (
              <Detail
                label="Waste Disposal Plan Document"
                value={
                  commercial.wasteDisposalPlanDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{commercial.wasteDisposalPlanDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 8)
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
            value={commercial.hasRecordKeepingSystem ? "Yes" : "No"}
          />
          {commercial.hasRecordKeepingSystem &&
            commercial.recordKeepingTemplateDoc && (
              <Detail
                label="Record Keeping System Document"
                value={
                  commercial.recordKeepingTemplateDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{commercial.recordKeepingTemplateDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 8)
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
            value={commercial.hasInsurance ? "Yes" : "No"}
          />
          {commercial.hasInsurance && commercial.insuranceDoc && (
            <Detail
              label="Insurance Cover Document"
              value={
                commercial.insuranceDoc?.name ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{commercial.insuranceDoc.name}</span>
                    <span className="text-red-500 text-[10px] font-bold">
                      (refer to Block 8)
                    </span>
                  </span>
                ) : (
                  "N/A"
                )
              }
            />
          )}

          <Detail
            label="Public Health Risk Plan"
            value={commercial.hasPublicHealthRiskPlan ? "Yes" : "No"}
          />
          {commercial.hasPublicHealthRiskPlan &&
            commercial.publicHealthRiskPlanDoc && (
              <Detail
                label="Public Health Risk Plan Document"
                value={
                  commercial.publicHealthRiskPlanDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{commercial.publicHealthRiskPlanDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 8)
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
            value={commercial.hasIncidentReportingSystem ? "Yes" : "No"}
          />
          {commercial.hasIncidentReportingSystem &&
            commercial.incidentReportingSystemDoc && (
              <Detail
                label="Incident Reporting System Document"
                value={
                  commercial.incidentReportingSystemDoc?.name ? (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      <span>{commercial.incidentReportingSystemDoc.name}</span>
                      <span className="text-red-500 text-[10px] font-bold">
                        (refer to Block 8)
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )
                }
              />
            )}
        </Block>

        {/* --- BLOCK 8: Supporting Documents --- */}
        <Block
          title="8. Supporting Documents"
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

export default PesticideCommercialReview;
