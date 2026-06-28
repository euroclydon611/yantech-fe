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

interface ManufactureReviewProps {
  application: any;
}

const PesticideManufacturePreview: React.FC<ManufactureReviewProps> = ({
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
  const { manufacture } = answers?.categoryDetails;

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
      Manufacture License Application Preview
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
                    (refer to Block 9)
                  </span>
                </span>
              ) : (
                "—"
              )
            }
          />
        </Block>
      )}

      {/* 12.1 Environmental Permit */}
      <Block title="3. Environmental Permit"  className={styles.fullWidth}>
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
      <Block title="5. Facility Location" className={styles.fullWidth}>
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

      <Block title="6. Process Description">
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

      <Block title="7. Waste Management Plan">
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
      <Block title="8. Emergency Response Plan">
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

export default PesticideManufacturePreview;
