import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";

import { Divider, Descriptions } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  handleDocumentView,
  normalizeText,
  formatDate4,
  formatDate2,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";

interface ImportationReviewProps {
  application: any;
}

export const PesticideImportationPreview: React.FC<ImportationReviewProps> = ({
  application,
}) => {
  const {
    licenseCategory,
    licenseType,
    processingType,
    createdAt,
    updatedAt,
    applicationType,
    answers,
  } = application;

  const previousLicense = answers?.previousLicense;
  const { importation } = answers?.categoryDetails;

  if (!importation) {
    return (
      <div className="text-sm text-gray-500">
        Importation details are missing. Please complete the Formulation
        section.
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Importation License Application Preview
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

        <Block title="3. Products" className={styles.fullWidth}>
          {importation.products?.map((p: any, index: number) => (
            <div key={p.id || index} className={`${styles.productItem} mb-4`}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-extrabold text-base">
                  Product {index + 1}: {p.name}
                </span>
              </Divider>
              <div className={styles.productDetails}>
                <Detail label="Name:" value={p.name} />
                <Detail
                  label="Product Type:"
                  value={normalizeText(p.productType?.replace(/-/g, " "))}
                />
                <Detail label="Formulation Type:" value={p.formulationType} />

                {/* Registration details */}
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
                {/* Manufacturer */}
                <Detail label="Manufacturer:" value={p.manufacturer?.name} />
                <Detail
                  label="Manufacturer Address:"
                  value={p.manufacturer?.address}
                />

                <Detail label="Country of Origin:" value={p.countryOfOrigin} />
                {/* Active ingredients (listed, not in a table) */}

                {Array.isArray(p.activeIngredient) &&
                  p.activeIngredient.length > 0 && (
                    <div className={styles.subItem}>
                      <h5 className={styles.subTitle}>Active Ingredients</h5>

                      {p.activeIngredient.map((ai: any, aiIdx: number) => (
                        <Descriptions
                          key={aiIdx}
                          size="small"
                          column={1}
                          bordered
                          className="mb-3"
                          title={`Ingredient ${aiIdx + 1}`}
                        >
                          <Descriptions.Item label="Ingredient Name">
                            {ai.activeIngredient || "—"}
                          </Descriptions.Item>

                          <Descriptions.Item label="Concentration">
                            {ai.concentrationValue
                              ? `${ai.concentrationValue} ${
                                  ai.concentrationUnit || ""
                                }`
                              : "—"}
                          </Descriptions.Item>

                          <Descriptions.Item label="CAS Number">
                            {ai.casNumber || "—"}
                          </Descriptions.Item>
                        </Descriptions>
                      ))}
                    </div>
                  )}

                {/* SDS presence */}
                <Detail
                  label="SDS"
                  value={
                    p.sds?.name ? (
                      <span className="flex items-center gap-2">
                        <FileTextOutlined className="text-blue-500" />
                        <span>{p.sds.name}</span>
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
            </div>
          ))}
        </Block>
        {/* --- BLOCK: Storage Facilities --- */}
        {importation.storageFacilities?.length > 0 && (
          <Block title="4. Storage Facilities">
            {importation.storageFacilities?.map(
              (storage: any, index: number) => (
                <div key={index} className={styles.partnerItem}>
                  <Divider orientation="left" orientationMargin="0">
                    <span className="font-extrabold text-base">
                      Storage Facility {index + 1}{" "}
                    </span>
                  </Divider>
                  <Detail
                    label="Region:"
                    value={normalizeText(storage.region)}
                  />
                  <Detail
                    label="District:"
                    value={normalizeText(storage.district?.replace(/-/g, " "))}
                  />
                  <Detail label="City/Town:" value={storage.city} />
                  <Detail label="Address:" value={storage.address} />
                  <Detail
                    label="Google Location/GPS:"
                    value={storage.gps}
                    className={`text-blue-600 font-bold`}
                  />
                  <Detail
                    label="Capacity:"
                    value={`${storage.capacity ?? "—"} ${
                      storage.capacityUnit ?? ""
                    }`.trim()}
                  />
                  {/* Emergency Response Plan */}
                  <Detail
                    label="Emergency Response Plan:"
                    value={storage.hasErp ? "Yes" : "No"}
                  />
                  {storage.hasErp && (
                    <Detail
                      label="Emergency Response Plan Document"
                      value={
                        storage.erpDocument?.name ? (
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{storage.erpDocument.name}</span>
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
                    label="EPA Licensed:"
                    value={storage.isEPALicense ? "Yes" : "No"}
                  />
                  {storage.isEPALicense && storage.epaLicense && (
                    <>
                      <Detail
                        label="EPA License Number:"
                        value={storage.epaLicense.licenseNumber}
                      />
                      <Detail
                        label="License Issued Date:"
                        value={formatDate2(
                          storage.epaLicense.licenseIssuedDate
                        )}
                      />
                      <Detail
                        label="License Expiry Date:"
                        value={formatDate2(
                          storage.epaLicense.licenseExpiryDate
                        )}
                      />
                      <Detail
                        label="License Document:"
                        value={
                          storage.epaLicense.licenseDocument ? (
                            <span className="flex items-center gap-2">
                              <FileTextOutlined className="text-blue-500" />
                              <span>
                                {storage.epaLicense.licenseDocument.name}
                              </span>
                              <span className="text-red-500 text-[10px] font-bold">
                                (refer to Block 7)
                              </span>
                            </span>
                          ) : (
                            "N/A"
                          )
                        }
                      />
                    </>
                  )}
                </div>
              )
            )}
          </Block>
        )}
        {importation.transportArrangements?.length > 0 && (
          <Block title="5. Transport Vehicles">
            {importation.transportArrangements?.map((v: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Transport Vehicle {index + 1}
                  </span>
                </Divider>
                <Detail label="Vehicle Type:" value={v.vehicleType} />
                <Detail
                  label="Registration No:"
                  value={normalizeText(v.registrationNo?.replace(/-/g, " "))}
                />
                {/* Emergency Response Plan */}
                <Detail
                  label="Emergency Response Plan:"
                  value={v.hasErp ? "Yes" : "No"}
                />
                {v.hasErp && (
                  <Detail
                    label="Emergency Response Plan Document"
                    value={
                      v.erpDocument?.name ? (
                        <span className="flex items-center gap-2">
                          <FileTextOutlined className="text-blue-500" />
                          <span>{v.erpDocument.name}</span>
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
                  label="EPA Licensed:"
                  value={v.isEPALicense ? "Yes" : "No"}
                />

                {v.isEPALicense && v.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={v.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate2(v.epaLicense.licenseIssuedDate)}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate2(v.epaLicense.licenseExpiryDate)}
                    />

                    <Detail
                      label="License Document"
                      value={
                        v.epaLicense.licenseDocument?.name ? (
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{v.epaLicense.licenseDocument.name}</span>
                            <span className="text-red-500 text-[10px] font-bold">
                              (refer to Block 7)
                            </span>
                          </span>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}
        <Block title="6. Purposes">
          <Detail label="Purpose:" value={importation.purpose.join(", ")} />
          <Detail label="Other Purpose:" value={importation.purposeOther} />
        </Block>

        {/* --- Supporting Documents --- */}
        <Block title="7. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideImportationPreview;
