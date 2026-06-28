import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Divider } from "antd";
import { Link } from "react-router-dom";
import {
  formatDate,
  formatDate2,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { Block, Detail } from "../../review/helpers";
import { SupportingDocumentsGrid } from "../../review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { FileTextOutlined } from "@ant-design/icons";

interface PesticideChemicalReviewProps {
  application: any;
}

export const PesticideChemicalPreview: React.FC<
  PesticideChemicalReviewProps
> = ({ application }) => {
  const {
    permitDetails,
    purpose,
    products,
    authOption,
    authNumber,
    authorizationDocument,
    warehouse,
    // warehouses,
    factory,
    transporters,
    distributors,
    repackagers,
    handlers,
    proponentLicense,
    proponentPermit,
    traceabilityLocation,
    researchTrialFacility,
  } = application?.pesticideChemicalDetails || {};

  const manufacturedProducts = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Holder",
      dataIndex: "registrationHolderName",
      key: "registrationHolderName",
    },
    {
      title: "FRE/PA No.",
      dataIndex: "frepaNumber",
      key: "frepaNumber",
    },
    {
      title: "label",
      dataIndex: "productLabelAttachment",
      key: "productLabelAttachment",
      render: (productLabelAttachment: any) => (
        <span>
          {productLabelAttachment ? (
            <strong className="text-xs">refer to Block 13</strong>
          ) : (
            "N/A"
          )}
        </span>
      ),
    },
  ];

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        {permitDetails?.permitCategory === "pesticide"
          ? "Pesticide"
          : "Industrial Chemical"}{" "}
        {permitDetails?.permitType?.toUpperCase()} Permit Application Review
      </h2>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block title="1. Applicant Information">
          <ApplicantInformationBlock application={application} />
        </Block>
        {/* --- BLOCK 2: Permit Details --- */}
        <Block title="2. Permit Information">
          <Detail
            label="Submitted Date:"
            value={formatDate4(application.createdAt)}
          />
          <Detail
            label="Updated Date:"
            value={formatDate4(application.updatedAt)}
          />
          <Detail
            label="Permit Type:"
            value={normalizeText(permitDetails?.permitType?.toUpperCase())}
          />
          <Detail
            label="Permit Category:"
            value={permitDetails?.permitCategory
              ?.replace("_", " ")
              .toUpperCase()}
          />
          <Detail
            label="Processing Type:"
            value={application?.processingType?.replace("_", " ").toUpperCase()}
          />
          <Detail
            label="Purpose:"
            value={purpose?.replace(/_/g, " ")?.toUpperCase()}
          />
          {permitDetails.permitType == "import" && (
            <>
              <Detail
                label="Import Authorization Status:"
                value={
                  authOption == "no"
                    ? "No, I am the Product Registration Holder"
                    : "Yes, I have a Valid Import Authorization Permit Number"
                }
              />

              {authOption == "yes" && (
                <>
                  <Detail
                    label="Import Authorization Permit Number:"
                    value={authNumber}
                  />

                  {authorizationDocument && (
                    <Detail
                      label="Import Authorization Permit Document:"
                      value={
                        authorizationDocument?.name ? (
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{authorizationDocument.name}</span>
                            <span className="text-red-500 text-[10px] font-bold">
                              (refer to Block )
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
            </>
          )}
        </Block>

        {/* --- BLOCK 3: Products Information --- */}
        <Block
          title="3. Product(s) Information"
          className={`${styles.fullWidth}`}
        >
          {products?.map((product: any, index: number) => (
            <div key={index} className={`${styles.productItem} mb-4`}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-extrabold text-base">
                  Product {index + 1}: {product.name}
                </span>
              </Divider>
              <div className={styles.productDetails}>
                <Detail
                  label={
                    ["manufacturing", "formulation"].includes(
                      purpose?.toLowerCase()
                    )
                      ? "Technical Concentrate/Material:"
                      : "Product Name:"
                  }
                  value={product.name}
                />
                {permitDetails?.permitCategory !== "pesticide" && (
                  <>
                    <Detail label="Trade Name:" value={product.tradeName} />
                    <Detail label="Common Name:" value={product.commonName} />
                    <Detail
                      label="High Risk:"
                      value={product.isHighRisk ? "Yes" : "No"}
                    />
                  </>
                )}
                <Detail label="HS Code:" value={product.hsCode} />
                {permitDetails?.permitCategory === "pesticide" && (
                  <>
                    <Detail
                      label="Formulation Type:"
                      value={product.formulationType}
                    />
                    <Detail label="Product Type:" value={product.productType} />

                    <Detail
                      label="Product Registration Number:"
                      value={product.frePaNumber}
                    />
                    <Detail
                      label="Product Registration Holder:"
                      value={product.productHolderName}
                    />
                    <Detail
                      label="Product Registration Issued Date:"
                      value={formatDate2(product.pclIssuedDate)}
                    />
                    <Detail
                      label="Product Registration Expiry Date:"
                      value={formatDate2(product.pclExpiryDate)}
                    />
                  </>
                )}
                {permitDetails?.permitCategory !== "pesticide" && (
                  <>
                    <Detail
                      label="Chemical Class:"
                      value={product.chemicalClass}
                    />
                    <Detail label="CAS Number:" value={product.casNo} />
                    <Detail
                      label="Hazard Classes:"
                      value={
                        product.hazardClass &&
                        product.hazardClass.length > 0 &&
                        product.hazardClass.join(" , ")
                      }
                    />{" "}
                  </>
                )}
                <Detail
                  label="Estimated Quantity:"
                  value={`${product.quantity} ${product.unit}`}
                />
                {permitDetails?.permitCategory == "pesticide" && (
                  <Detail
                    label="Package Size:"
                    value={`${product.packageSizeValue ?? "N/A"} ${
                      product.packageSizeUnit ?? ""
                    }`}
                  />
                )}
                {permitDetails?.permitCategory === "pesticide" && (
                  <Detail
                    label="Packaging Type:"
                    value={product.packagingType}
                  />
                )}

                <Detail
                  label={`Expected ${
                    permitDetails?.permitType == "import"
                      ? "Arrival"
                      : "Departure"
                  } Date:`}
                  value={formatDate2(product.arrivalDate)}
                />
                {purpose === "national_emergency" && (
                  <Detail
                    label="Type of Emergency:"
                    value={product.emergencyType}
                  />
                )}
                {permitDetails?.permitCategory === "pesticide" &&
                  purpose === "national_emergency" && (
                    <Detail
                      label="Target Pest/Disease:"
                      value={product.targetPestOrDisease}
                    />
                  )}
                <Detail label="End Use:" value={product.endUse} />
                <Divider />
                <Detail label="Manufacturer:" value={product.manufacturer} />
                <Detail
                  label="Manufacturer Address:"
                  value={product.manufacturerAddress}
                />
                <Detail label="Supplier Name:" value={product.supplierName} />
                <Detail
                  label="Supplier Address:"
                  value={product.supplierAddress}
                />
                {permitDetails.permitType === "import" && (
                  <>
                    <Detail
                      label="Country of Origin:"
                      value={product?.routeDetails?.importCountry}
                    />
                    <Detail
                      label="Entry Point (Port/Border):"
                      value={product?.routeDetails?.entryPoint}
                    />
                  </>
                )}
                {permitDetails.permitType !== "import" && (
                  <>
                    <Detail
                      label="Country of Destination:"
                      value={product?.routeDetails?.exportCountry}
                    />
                    <Detail
                      label="Exit Point (Port/Border):"
                      value={product?.routeDetails?.exitPoint}
                    />
                  </>
                )}
                <Divider />
                {Array.isArray(product.activeIngredients) &&
                  product.activeIngredients.length > 0 && (
                    <div className={styles.subItem}>
                      <h5 className={styles.subTitle}>
                        Active Ingredients (
                        {product.activeIngredients?.length || 0})
                      </h5>
                      {product.activeIngredients?.map(
                        (ai: any, aiIdx: number) => (
                          <div key={aiIdx} className={styles.detail}>
                            <span className={styles.label}>
                              Ingredient {aiIdx + 1}:
                            </span>
                            <span className={styles.value}>
                              {ai.activeIngredient}
                              {ai.concentrationValue
                                ? ` — ${ai.concentrationValue}`
                                : ""}
                              {ai.concentrationUnit
                                ? ` ${ai.concentrationUnit}`
                                : ""}
                              {ai.casNumber ? ` — CAS: ${ai.casNumber}` : ""}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                {product?.manufacturedProducts?.length > 0 && (
                  <>
                    <div className={`${styles.activeIngredients} mt-4`}>
                      <h5 className="text-red-500">
                        {purpose == "formulation"
                          ? "Formulated"
                          : "Manufactured"}{" "}
                        Products ({product?.manufacturedProducts?.length})
                      </h5>

                      <Table
                        dataSource={product?.manufacturedProducts}
                        columns={manufacturedProducts}
                        pagination={false}
                        size="small"
                        rowKey={(record: any, index) =>
                          `${index}-${record.activeIngredient}`
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </Block>

        {/* --- BLOCK 4: Storage Facility Information --- */}
        {warehouse && warehouse.length > 0 && (
          <Block
            title="4. Storage Facility Details"
            className={styles.fullWidth}
          >
            {warehouse.map((wh: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Warehouse/Storage Facility {index + 1}{" "}
                  </span>
                </Divider>
                <Detail
                  label="Region:"
                  value={normalizeText(wh?.location?.region)}
                />
                <Detail
                  label="District:"
                  value={normalizeText(wh?.location?.district)}
                />
                <Detail label="City:" value={wh?.location?.city} />
                <Detail label="Address:" value={wh?.location?.address} />

                {wh?.location?.googleLocationLink && (
                  <div className={`${styles.detail}`}>
                    <span className={`${styles.label}`}>
                      Google Location Link:
                    </span>{" "}
                    <Link
                      to={wh?.location?.googleLocationLink}
                      className={`${styles.value} text-blue-600 font-bold`}
                    >
                      {wh?.location?.googleLocationLink}
                    </Link>
                  </div>
                )}
                <Detail
                  label="Is EPA-licensed:"
                  value={wh?.isEPALicensed ? "Yes" : "No"}
                />
                {wh?.isEPALicensed && wh?.epaLicense && (
                  <>
                    <Detail
                      label="License Number:"
                      value={wh.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(wh.epaLicense.licenseIssuedDate)}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(wh.epaLicense.licenseExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}
        {/* --- BLOCK 5: Factory Information (if applicable) --- */}
        {factory && factory.length > 0 && (
          <Block
            title="5. Manufacturing/Processing Facility"
            className={styles.fullWidth}
          >
            {factory.map((f: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Factory {index + 1}
                  </span>
                </Divider>{" "}
                <Detail
                  label="Region:"
                  value={normalizeText(f?.location?.region)}
                />
                <Detail
                  label="District:"
                  value={normalizeText(f?.location?.district)}
                />
                <Detail label="City:" value={f?.location?.city} />
                <Detail label="Address:" value={f?.location?.address} />
                <div className={`${styles.detail}`}>
                  <span className={`${styles.label}`}>
                    Google Location Link:
                  </span>{" "}
                  <Link
                    to={f?.location?.googleLocationLink}
                    className={`${styles.value} text-blue-600 font-bold`}
                  >
                    {f?.location?.googleLocationLink}
                  </Link>
                </div>
                <Detail
                  label="Is Permitted:"
                  value={f?.isPermitted ? "Yes" : "No"}
                />
                {f?.isPermitted && f?.permit && (
                  <>
                    <Detail
                      label="Permit Number:"
                      value={f.permit.permitNumber}
                    />
                    <Detail
                      label="Permit Issued Date:"
                      value={formatDate(f.permit.permitIssuedDate)}
                    />
                    <Detail
                      label="Permit Expiry Date:"
                      value={formatDate(f.permit.permitExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 6: Transporters --- */}
        {transporters?.length > 0 && (
          <Block
            title="6. Transportation Partners"
            className={styles.fullWidth}
          >
            {transporters?.map((transporter: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Transporter {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={transporter.name} />
                <Detail
                  label="Contact Email:"
                  value={transporter.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={transporter.contactPhone}
                />
                <Detail
                  label="Vehicle Number:"
                  value={transporter.vehicleNumber}
                />
                <Detail
                  label="EPA Licensed:"
                  value={transporter.isEPALicensed ? "Yes" : "No"}
                />
                {transporter.isEPALicensed && transporter.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={transporter.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        transporter.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        transporter.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 7: Distributors (if any) --- */}
        {distributors?.length > 0 && (
          <Block title="7. Distribution Partners" className={styles.fullWidth}>
            {distributors?.map((distributor: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Distributor {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={distributor.name} />
                <Detail
                  label="Contact Email:"
                  value={distributor.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={distributor.contactPhone}
                />
                <Detail
                  label="EPA Licensed:"
                  value={distributor.isEPALicensed ? "Yes" : "No"}
                />
                {distributor.isEPALicensed && distributor.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={distributor.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        distributor.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        distributor.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 8: Repackagers (if any) --- */}
        {repackagers?.length > 0 && (
          <Block title="8. Repackaging Partners" className={styles.fullWidth}>
            {repackagers?.map((repackager: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Repackager {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={repackager.name} />
                <Detail
                  label="Contact Email:"
                  value={repackager.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={repackager.contactPhone}
                />
                <Detail
                  label="EPA Licensed:"
                  value={repackager.isEPALicensed ? "Yes" : "No"}
                />
                {repackager.isEPALicensed && repackager.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={repackager.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        repackager.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        repackager.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 9: Handlers (if any) --- */}
        {handlers?.length > 0 && (
          <Block title="9. Handling Partners" className={styles.fullWidth}>
            {handlers?.map((handler: any, index: any) => (
              <div key={index} className={`${styles.partnerItem} mb-5`}>
                <h4
                  className={`${styles.subTitle} font-bold text-base underline`}
                >
                  Handler {index + 1}
                </h4>
                <Detail label="Name:" value={handler.name} />
                <Detail label="Contact Email:" value={handler.contactEmail} />
                <Detail label="Contact Phone:" value={handler.contactPhone} />
                <Detail
                  label="EPA Licensed:"
                  value={handler.isEPALicensed ? "Yes" : "No"}
                />
                {handler.isEPALicensed && handler.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={handler.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(handler.epaLicense.licenseIssuedDate)}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(handler.epaLicense.licenseExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}
        {/* --- BLOCK 10: Proponent License --- */}
        {proponentLicense && (
          <Block title="10. Proponent License">
            <Detail
              label="License Number:"
              value={proponentLicense.licenseNumber}
            />
            <Detail
              label="License Issued Date:"
              value={formatDate(proponentLicense.licenseIssuedDate)}
            />
            <Detail
              label="License Expiry Date:"
              value={formatDate(proponentLicense.licenseExpiryDate)}
            />
          </Block>
        )}

        {/* --- BLOCK 11: Proponent Permit --- */}
        {proponentPermit && (
          <Block title="11. Proponent Permit">
            <Detail
              label="Permit Number:"
              value={proponentPermit?.permitNumber}
            />
            <Detail
              label="Permit Issued Date:"
              value={formatDate(proponentPermit?.permitIssuedDate)}
            />
            <Detail
              label="Permit Expiry Date:"
              value={formatDate(proponentPermit?.permitExpiryDate)}
            />
          </Block>
        )}

        {/* --- BLOCK 12: Traceability Location --- */}
        {(traceabilityLocation?.region ||
          traceabilityLocation?.address ||
          researchTrialFacility) && (
          <Block title="12. Traceability Location">
            <Detail
              label="Research/Trial Facility:"
              value={researchTrialFacility}
            />
            <Detail label="Country:" value={traceabilityLocation?.country} />
            <Detail label="Region:" value={traceabilityLocation?.region} />
            <Detail label="District:" value={traceabilityLocation?.district} />
            <Detail label="City:" value={traceabilityLocation?.city} />
            <Detail label="Address:" value={traceabilityLocation?.address} />

            {traceabilityLocation?.googleLocationLink && (
              <div className={styles.detail}>
                <span className={styles.label}>Google Location Link:</span>{" "}
                <Link
                  to={traceabilityLocation?.googleLocationLink}
                  className={`${styles.value} text-blue-600 font-bold`}
                >
                  {traceabilityLocation?.googleLocationLink}
                </Link>
              </div>
            )}
          </Block>
        )}

        {/* --- BLOCK 12: Attachments --- */}
        <Block title="13. Supporting Documents" className={styles.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default PesticideChemicalPreview;
