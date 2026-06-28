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

interface DistributionReviewProps {
  application: any;
}

export const PesticideDistributionPreview: React.FC<DistributionReviewProps> = ({
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
  const { distribution } = answers?.categoryDetails;

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
        Distribution License Application Preview
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
                      (refer to Block 6)
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </Block>
        )}

        <Block title="3. Distribution Scope" className={styles.fullWidth}>
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
            <Block title="4. Vehicles" className={styles.fullWidth}>
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

        <Block title="5. Compliance & Safety" className={styles.fullWidth}>
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
        <Block title="6. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideDistributionPreview;
