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

interface StorageReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const PesticideStorageReview: React.FC<StorageReviewProps> = ({
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

  const { storage } = answers?.categoryDetails;

  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    storageFacilities: { status: "pending", comment: "" },
    safetyFeatures: { status: "pending", comment: "" },
    complianceDocumentation: { status: "pending", comment: "" },
    attachments: { status: "pending", comment: "" },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: "" },
    licenseInformation: { status: "pending", comment: "" },
    storageFacilities: { status: "pending", comment: "" },
    safetyFeatures: { status: "pending", comment: "" },
    complianceDocumentation: { status: "pending", comment: "" },
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

  if (!storage) {
    return (
      <div className="text-sm text-gray-500">
        Storage details are missing. Please complete the Storage section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>Storage License Application Review</h2>
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

        {/* 7.1 Locations */}
        {Array.isArray(storage.locations) && storage.locations.length > 0 && (
          <Block
            title="Storage Facilities"
            className={styles.fullWidth}
            sectionKey="storageFacilities"
            reviewData={review.storageFacilities}
            evaluationData={evaluation.storageFacilities}
            onUpdate={handleUpdateSection}
          >
            {storage.locations.map((loc: any, i: number) => (
              <div key={loc.id || i} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Facility {i + 1}
                  </span>
                </Divider>
                <Detail label="Region" value={loc.region} />
                <Detail label="District" value={loc.district} />
                <Detail label="City/Town" value={loc.city} />
                <Detail label="Address" value={loc.address} />
                <Detail label="GPS/Link" value={loc.gps} />
                <Detail
                  label="Capacity"
                  value={`${loc.capacity || "—"} ${
                    loc.capacityUnit || ""
                  }`.trim()}
                />
                <Detail
                  label="Surrounding Land Use"
                  value={loc.surroundingLandUse}
                />

                <Detail
                  label="EPA Permitted:"
                  value={loc.isPermitted ? "Yes" : "No"}
                />
                {loc.isPermitted && loc.permit && (
                  <>
                    <Detail
                      label="Permit Number:"
                      value={loc.permit.permitNumber}
                    />
                    <Detail
                      label="Permit Issued Date:"
                      value={formatDate2(loc.permit.permitIssuedDate)}
                    />
                    <Detail
                      label="Permit Expiry Date:"
                      value={formatDate2(loc.permit.permitExpiryDate)}
                    />
                    {loc.permit.permitDocument ? (
                      <Detail
                        label="Permit Document"
                        value={
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{loc.permit.permitDocument.name}</span>
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

        {/* 7.2 Safety Features */}
        <Block
          title="Safety Features"
          sectionKey="safetyFeatures"
          reviewData={review.safetyFeatures}
          evaluationData={evaluation.safetyFeatures}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Selected"
            value={(storage.safetyFeatures || []).join(", ") || "—"}
          />
          {storage.safetyFeatures?.includes("Other") && (
            <Detail
              label="Other (specify)"
              value={storage.safetyFeaturesOther || "—"}
            />
          )}
        </Block>

        <Block
          title="Compliance & Documentation"
          sectionKey="complianceDocumentation"
          reviewData={review.complianceDocumentation}
          evaluationData={evaluation.complianceDocumentation}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Emergency Response Plan"
            value={storage.hasErp ? "Yes" : "No"}
          />
          {storage.hasErp && (
            <Detail
              label="ERP Document"
              value={
                storage.erpDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.erpDoc.name}</span>
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
            label="Waste Management Plan"
            value={storage.hasWasteManagementPlan ? "Yes" : "No"}
          />
          {storage.hasWasteManagementPlan && (
            <Detail
              label="Waste Management Plan"
              value={
                storage.wasteManagementPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.wasteManagementPlanDoc.name}</span>
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
            label="Inventory System"
            value={storage.hasInventorySystem ? "Yes" : "No"}
          />
          {storage.hasInventorySystem && (
            <Detail
              label="Inventory Template"
              value={
                storage.inventorySystemTemplateDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.inventorySystemTemplateDoc.name}</span>
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
            label="EPA Permit"
            value={storage.hasEpaPermit ? "Yes" : "No"}
          />
          {storage.hasEpaPermit && (
            <Detail
              label="EPA Permit"
              value={
                storage.epaPermitDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.epaPermitDoc.name}</span>
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
            label="GNFS Certificate"
            value={storage.hasGnfscertificate ? "Yes" : "No"}
          />
          {storage.hasGnfscertificate && (
            <Detail
              label="GNFS Certificate"
              value={
                storage.gnfsCertificateDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.gnfsCertificateDoc.name}</span>
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
            label="Maintenance & Inspection Plan"
            value={storage.hasMaintenancePlan ? "Yes" : "No"}
          />
          {storage.hasMaintenancePlan && (
            <Detail
              label="Maintenance Plan"
              value={
                storage.maintenancePlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{storage.maintenancePlanDoc.name}</span>
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

export default PesticideStorageReview;
