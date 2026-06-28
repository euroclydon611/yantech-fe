import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { Divider, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { Block, Detail } from "@/employee_portal_pages/components/review/helpers";
import {
  handleDocumentView,
  normalizeText,
  formatDate4,
  formatDate2,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";

const { Text } = Typography;

interface SaleReviewProps {
  application: any;
}

export const PesticideSalePreview: React.FC<SaleReviewProps> = ({ application }) => {
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
  const { sale } = answers?.categoryDetails;

  if (!sale) {
    return (
      <div className="text-sm text-gray-500">
        Sale details are missing. Please complete the Sale section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>Sale License Application Preview</h2>
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

        {Array.isArray(sale.outlets) && sale.outlets.length > 0 && (
          <Block title="Sales Outlets" className={styles.fullWidth}>
            {sale.outlets.map((o: any, index: number) => (
              <div key={o.id || index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Outlet {index + 1}
                  </span>
                </Divider>
                <Detail label="Region:" value={normalizeText(o.region)} />
                <Detail
                  label="District:"
                  value={normalizeText(o.district?.replace(/-/g, " "))}
                />
                <Detail label="City/Town:" value={o.city} />
                <Detail label="Address:" value={o.address} />
                <Detail
                  label="GPS/Google Location:"
                  value={o.gps}
                  className={`text-blue-600 font-bold`}
                />
                <Detail
                  label="Product Categories:"
                  value={o.productCategories}
                />
                <Detail label="Store Size:" value={o.storeSize} />
                <Detail label="Store Capacity:" value={o.storeCapacity} />
              </div>
            ))}
          </Block>
        )}

        {/* Safety Measures */}
        <Block title="Safety Measures">
          <Detail
            label="Description:"
            value={sale.safetyMeasuresDescription || "—"}
          />
        </Block>

        {/* Compliance and Facility Details */}
        <Block title="Compliance and Facility Details">
          <Detail
            label="Storage at Sales Points:"
            value={sale.hasStorageAtPoints ? "Yes" : "No"}
          />
          {sale.hasStorageAtPoints && (
            <Detail
              label="Storage Capacity:"
              value={`${sale.storageCapacity ?? "—"} ${
                sale.storageCapacityUnit ?? ""
              }`.trim()}
            />
          )}
          <Detail
            label="Qualified Staff:"
            value={sale.hasQualifiedStaff ? "Yes" : "No"}
          />
          {sale.hasQualifiedStaff && (
            <Detail
              label="Training Evidence"
              value={
                sale.qualifiedStaffEvidence ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{sale.qualifiedStaffEvidence.name}</span>
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
            label="Inventory System:"
            value={sale.hasInventorySystem ? "Yes" : "No"}
          />
          {sale.hasInventorySystem && (
            <Detail
              label="Inventory Evidence"
              value={
                sale.inventorySystemEvidence ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{sale.inventorySystemEvidence.name}</span>
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
            label="Waste Management Plan:"
            value={sale.hasWasteManagementPlan ? "Yes" : "No"}
          />
          {sale.hasWasteManagementPlan && (
            <Detail
              label="Waste Plan Document"
              value={
                sale.wasteManagementPlanDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{sale.wasteManagementPlanDoc.name}</span>
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

        {/* Personnel */}
        {Array.isArray(sale.personnel) && sale.personnel.length > 0 && (
          <Block title="Personnel" className={styles.fullWidth}>
            {sale.personnel.map((p: any, index: number) => (
              <div key={p.id || index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Personnel {index + 1}{" "}
                  </span>
                </Divider>
                <Detail label="Name:" value={p.employeeName} />
                <Detail label="Age:" value={p.age} />
                <Detail label="Qualification:" value={p.qualification} />
                <Detail
                  label="Certificate of Competence"
                  value={
                    p.competenceCertificate ? (
                      <span className="flex items-center gap-2">
                        <FileTextOutlined className="text-blue-500" />
                        <span>{p.competenceCertificate.name}</span>
                        <span className="text-red-500 text-[10px] font-bold">
                          (refer to Block 7)
                        </span>
                      </span>
                    ) : (
                      "N/A"
                    )
                  }
                />
              </div>
            ))}
          </Block>
        )}

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

export default PesticideSalePreview;
