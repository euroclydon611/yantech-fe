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

interface TransportationReviewProps {
  application: any;
}

const PesticideTransportationPreview: React.FC<TransportationReviewProps> = ({
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
  const { transportation } = answers?.categoryDetails;

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
        Transportation License Application Preview
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

        {Array.isArray(transportation.serviceScopes) &&
          transportation.serviceScopes.length > 0 && (
            <Block
              title="Scope of Transport Services"
              className={styles.fullWidth}
            >
              {transportation.serviceScopes.map((s: any, i: number) => (
                <div key={s.id || i} className={styles.partnerItem}>
                  <h4
                    className={`${styles.subTitle} !font-extrabold text-base underline`}
                  >
                    Service Scope {i + 1}
                  </h4>
                  <Detail label="Pesticide Type" value={s.pesticideType} />
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
            <Block title="Vehicle Fleet" className={styles.fullWidth}>
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

        <Block title="Compliance & Safety" className={styles.fullWidth}>
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
        <Block title="Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideTransportationPreview;
