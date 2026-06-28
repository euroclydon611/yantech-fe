import React, { useMemo } from "react";
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
import ScaleLocationBlock from "../scale-location-block";
import ProposedFeeBlock from "../proposed-fee-block";

interface ImportationReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

export const PesticideImportationReview: React.FC<ImportationReviewProps> = ({
  application,
  onApplicationUpdate,
}) => {
  const {
    licenseCategory,
    licenseType,
    processingType,
    createdAt,
    updatedAt,
    applicationType,
    answers,
    scale,
    location,
  } = application;

  const { importation } = answers?.categoryDetails;

  // Initialize review and evaluation properties if they don't exist
  // Merge existing data with defaults to ensure all keys are present
  const defaultReviewStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    products: { status: "pending", comment: null },
    storageFacilities: { status: "pending", comment: null },
    transportVehicles: { status: "pending", comment: null },
    purposes: { status: "pending", comment: null },
    attachments: { status: "pending", comment: null },
  };

  const defaultEvaluationStructure = {
    applicantDetails: { status: "pending", comment: null },
    licenseInformation: { status: "pending", comment: null },
    products: { status: "pending", comment: null },
    storageFacilities: { status: "pending", comment: null },
    transportVehicles: { status: "pending", comment: null },
    purposes: { status: "pending", comment: null },
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
    if (onApplicationUpdate) {
      await onApplicationUpdate(sectionKey, type, status, comment);
    }
  };

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
        Importation License Application Review
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

        <Block
          title="3. Products"
          className={styles.fullWidth}
          sectionKey="products"
          reviewData={review.products}
          evaluationData={evaluation.products}
          onUpdate={handleUpdateSection}
        >
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
          <Block
            title="4. Storage Facilities"
            sectionKey="storageFacilities"
            reviewData={review.storageFacilities}
            evaluationData={evaluation.storageFacilities}
            onUpdate={handleUpdateSection}
          >
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
          <Block
            title="5. Transport Vehicles"
            sectionKey="transportVehicles"
            reviewData={review.transportVehicles}
            evaluationData={evaluation.transportVehicles}
            onUpdate={handleUpdateSection}
          >
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
        <Block
          title="6. Purposes"
          sectionKey="purposes"
          reviewData={review.purposes}
          evaluationData={evaluation.purposes}
          onUpdate={handleUpdateSection}
        >
          <Detail label="Purpose:" value={importation.purpose.join(", ")} />
          <Detail label="Other Purpose:" value={importation.purposeOther} />
        </Block>

        {/* --- Supporting Documents --- */}
        <Block
          title="7. Supporting Documents"
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

export default PesticideImportationReview;
