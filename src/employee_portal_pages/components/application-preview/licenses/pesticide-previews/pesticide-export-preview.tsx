import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { Divider, Typography } from "antd";
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

const { Text } = Typography;

interface ExportReviewProps {
  application: any;
}

const PesticideExportPreview: React.FC<ExportReviewProps> = ({ application }) => {
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
  const { exportation } = answers?.categoryDetails;

  if (!exportation) {
    return (
      <div className="text-sm text-gray-500">
        Export details are missing. Please complete the Export section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>Export License Application Preview</h2>
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
                      (refer to Block 8)
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </Block>
        )}

        {/* 11.1 Products */}
        {Array.isArray(exportation.products) &&
          exportation.products.length > 0 && (
            <Block
              title="3. Products to be Exported"
              className={styles.fullWidth}
            >
              {exportation.products.map((p: any, i: number) => (
                <div key={p.id || i} className={styles.partnerItem}>
                  <h4
                    className={`${styles.subTitle} !font-extrabold text-base underline`}
                  >
                    Product {i + 1}
                  </h4>
                  <Detail label="Name" value={p.name} />
                  <Detail label="Product Type" value={p.productType} />
                  <Detail label="Formulation Type" value={p.formulationType} />
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
                    label="Quantity"
                    value={
                      p.quantityAmount != null && p.quantityUnit
                        ? `${p.quantityAmount} ${p.quantityUnit}`
                        : "—"
                    }
                  />
                  <Detail
                    label="Destination Country"
                    value={p.destinationCountry}
                  />
                  <Detail label="Purpose of Export" value={p.purposeOfExport} />
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

        <Block title="4. Importing Country Permit">
          <Detail
            label="Entry Permitted by Importer"
            value={
              exportation.isEntryPermittedByImporter === true
                ? "Yes"
                : exportation.isEntryPermittedByImporter === false
                ? "No"
                : "—"
            }
          />
          {exportation.isEntryPermittedByImporter && (
            <Detail
              label="Evidence Document"
              value={
                exportation.importerRegulationsDoc ? (
                  <span className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>{exportation.importerRegulationsDoc.name}</span>
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

        {/* 11.3 Shipment Modes */}
        <Block title="5. Shipment Modes">
          <Detail
            label="Modes"
            value={(exportation.modeOfShipment || []).join(", ") || "—"}
          />
        </Block>

        {/* 11.4 Transporter Details */}
        {Array.isArray(exportation.modeOfShipment) &&
          exportation.modeOfShipment.includes("Road") && (
            <Block title="6. Transporter Details" className={styles.fullWidth}>
              {Array.isArray(exportation.transporters) &&
              exportation.transporters.length > 0 ? (
                exportation.transporters.map((transporter: any, i: number) => (
                  <div key={i} className={styles.partnerItem}>
                    <Divider orientation="left" orientationMargin="0">
                      <span className="font-extrabold text-base">
                        Transporter {i + 1}{" "}
                      </span>
                    </Divider>
                    <Detail label="Name" value={transporter.name || "—"} />
                    <Detail
                      label="Contact Phone"
                      value={transporter.contactPhone || "—"}
                    />
                    <Detail
                      label="Contact Email"
                      value={transporter.contactEmail || "—"}
                    />
                    <Detail
                      label="Vehicle Number"
                      value={transporter.vehicleNumber || "—"}
                    />
                    <Detail
                      label="Means of Transport"
                      value={transporter.meansOfTransport || "—"}
                    />
                    <Detail
                      label="EPA Licensed"
                      value={transporter.isEPALicensed ? "Yes" : "No"}
                    />
                    {transporter.isEPALicensed && transporter.epaLicense && (
                      <>
                        <Detail
                          label="EPA License Number"
                          value={transporter.epaLicense.licenseNumber || "—"}
                        />
                        <Detail
                          label="License Issued Date"
                          value={
                            transporter.epaLicense.licenseIssuedDate
                              ? new Date(
                                  transporter.epaLicense.licenseIssuedDate
                                ).toLocaleDateString()
                              : "—"
                          }
                        />
                        <Detail
                          label="License Expiry Date"
                          value={
                            transporter.epaLicense.licenseExpiryDate
                              ? new Date(
                                  transporter.epaLicense.licenseExpiryDate
                                ).toLocaleDateString()
                              : "—"
                          }
                        />
                        {transporter.epaLicense.licenseDocument ? (
                          <Detail
                            label="EPA License Document"
                            value={
                              <span className="flex items-center gap-2">
                                <FileTextOutlined className="text-blue-500" />
                                <span>
                                  {transporter.epaLicense.licenseDocument.name}
                                </span>
                                <span className="text-red-500 text-[10px] font-bold">
                                  (refer to Block 8)
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
                ))
              ) : (
                <Detail
                  label="Transporter Information"
                  value="No transporter details provided"
                />
              )}
            </Block>
          )}

        {/* 11.5 Rejection/Disposal Plan */}
        <Block title="7. Rejection/Disposal Plan">
          <Detail
            label="Plan Details"
            value={exportation.rejectionDisposalPlan || "—"}
          />
        </Block>

        {/* --- Supporting Documents --- */}
        <Block title="8. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideExportPreview;
