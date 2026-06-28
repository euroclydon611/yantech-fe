import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Collapse } from "antd";
import {
  formatDate2,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { Block, Detail } from "../../review/helpers";
import { SupportingDocumentsGrid } from "../../review/supporting-documents-grid";

const { Text } = Typography;

interface NotificationReviewProps {
  application: any;
}

export const HazardousWastePreview: React.FC<NotificationReviewProps> = ({
  application,
}) => {
  const {
    hazardousWasteDetails,
    permitType,
    clientId,
    submittedByAgent,
    clientDetails,
    submittedByAgentDetails,
  } = application;

  const applicantDetails = clientDetails || clientId;
  const agentDetails = submittedByAgentDetails || submittedByAgent;

  permitType === "import" ? "IMPORT" : "EXPORT";

  const {
    exporterDetails,
    importerDetails,
    shipmentDetails,
    carriers,
    isExporterSoleGenerator,
    generators,
    facilityDetails,
    operationDetails,
    wasteDescription,
    physicalDetails,
    wasteCodes,
    routeDetails,
    transitCountries,
  } = hazardousWasteDetails || {};

  const notificationNumber = "PENDING GENERATION";

  if (!hazardousWasteDetails) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={`${styles.mainTitle} font-mono`}>
        Notification Document for Transboundary Movements/Shipments of Waste
      </h2>

      {/* Header */}
      {/* Header */}
      <div className="border border-gray-300 bg-white mb-4">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-800 m-0">
            Application Overview
          </h3>
        </div>
      </div>
      <div className={styles.gridContainer}>
        {/* --- BLOCK 1 & 3-6 --- */}
        <Block title="1. Exporter - notifier">
          {permitType == "export" ? (
            <>
              <Detail
                label="Client ID/Registration No:"
                value={applicantDetails?.clientId}
              />
              <Detail
                label="Name:"
                value={
                  applicantDetails?.userType === "individual"
                    ? `${applicantDetails?.firstName ?? ""} ${
                        applicantDetails?.lastName ?? ""
                      }`.trim()
                    : applicantDetails?.userType === "organization"
                    ? applicantDetails?.organizationName
                    : applicantDetails?.userType === "government"
                    ? applicantDetails?.agencyName
                    : ""
                }
              />
              <Detail
                label="Contact Person:"
                value={`${applicantDetails?.firstName || ""} ${
                  applicantDetails?.lastName || ""
                }`.trim()}
              />
              <Detail label="Email:" value={applicantDetails?.email} />
              <Detail label="Telephone:" value={applicantDetails?.phone} />
              <Detail label="Fax:" value={applicantDetails?.fax} />

              {applicantDetails?.address && (
                <div className="mt-4">
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Main Address Information",
                        children: (
                          <div>
                            <Detail
                              label="Region:"
                              value={
                                normalizeText(
                                  applicantDetails?.address?.region
                                ) || "N/A"
                              }
                            />
                            <Detail
                              label="District:"
                              value={
                                normalizeText(
                                  applicantDetails?.address?.district
                                ) || "N/A"
                              }
                            />
                            <Detail
                              label="City:"
                              value={applicantDetails?.address?.city || "N/A"}
                            />
                            <Detail
                              label="Address:"
                              value={
                                applicantDetails?.address?.address || "N/A"
                              }
                            />
                            <Detail
                              label="GPS:"
                              value={applicantDetails?.address?.gps || "N/A"}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              )}

              {agentDetails && (
                <div className="mt-10">
                  <h1 className="font-bold mb-2">Agent Information</h1>
                  <hr className="bg--600 mb-2" />
                  <Detail label="Agent ID:" value={agentDetails?.clientId} />
                  <Detail
                    label="Name:"
                    value={`${agentDetails?.firstName || ""} ${
                      agentDetails?.lastName || ""
                    }`.trim()}
                  />
                  <Detail label="Email:" value={agentDetails?.email} />
                  <Detail label="Telephone:" value={agentDetails?.phone} />

                  {agentDetails?.address && (
                    <div className="mt-4">
                      <Collapse
                        items={[
                          {
                            key: "1",
                            label: "Main Address Information",
                            children: (
                              <div>
                                <Detail
                                  label="Region:"
                                  value={
                                    normalizeText(
                                      agentDetails?.address?.region
                                    ) || "N/A"
                                  }
                                />
                                <Detail
                                  label="District:"
                                  value={
                                    normalizeText(
                                      agentDetails?.address?.district
                                    ) || "N/A"
                                  }
                                />
                                <Detail
                                  label="City:"
                                  value={agentDetails?.address?.city || "N/A"}
                                />
                                <Detail
                                  label="Address:"
                                  value={
                                    agentDetails?.address?.address || "N/A"
                                  }
                                />
                                <Detail
                                  label="GPS:"
                                  value={agentDetails?.address?.gps || "N/A"}
                                />
                              </div>
                            ),
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Detail
                label="Registration No:"
                value={exporterDetails?.registrationNo}
              />
              <Detail label="Name:" value={exporterDetails?.name} />
              <Detail label="Address:" value={exporterDetails?.address} />
              <Detail
                label="Contact Person:"
                value={exporterDetails?.contactPerson}
              />
              <Detail label="Email:" value={exporterDetails?.email} />
              <Detail label="Telephone:" value={exporterDetails?.telephone} />
              <Detail label="Fax:" value={exporterDetails?.fax} />
            </>
          )}
        </Block>

        <Block title="3. Notification">
          <Detail label="No:" value={notificationNumber} />
          <div className={styles.checkboxGroup}>
            <span>Notification concerning:</span>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails?.shipmentType === "individual"}
                readOnly
              />{" "}
              A.(i) Individual shipment
              <input
                type="checkbox"
                checked={shipmentDetails?.shipmentType === "multiple"}
                readOnly
              />{" "}
              (ii) Multiple shipments
            </div>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails.purpose === "disposal"}
                readOnly
              />{" "}
              B.(i) Disposal
              <input
                type="checkbox"
                checked={shipmentDetails.purpose === "recovery"}
                readOnly
              />{" "}
              (ii) Recovery
            </div>
            <div>
              <span>C. Pre-consented recovery facility:</span>
              <input
                type="checkbox"
                checked={shipmentDetails.isPreConsented}
                readOnly
              />{" "}
              Yes
              <input
                type="checkbox"
                checked={!shipmentDetails.isPreConsented}
                readOnly
              />{" "}
              No
            </div>
          </div>
          <Detail
            label="4. Total intended number of shipments:"
            value={shipmentDetails.totalShipments}
          />
          <Detail label="5. Total intended quantity:">
            {shipmentDetails.quantityUnit === "tonnes" &&
              `${shipmentDetails.totalQuantity} Tonnes (Mg)`}
            {shipmentDetails.quantityUnit === "cubic meters" &&
              `${shipmentDetails.totalQuantity} m³`}
          </Detail>

          <Detail label="6. Intended period of time for shipment(s):">
            <div className=" space-y-4">
              <p className="text-sm">
                First Departure:{" "}
                {formatDate2(shipmentDetails.firstDepartureDate)}
              </p>
              <p className="text-sm">
                Last Departure: {formatDate2(shipmentDetails.lastDepartureDate)}
              </p>
            </div>
          </Detail>
        </Block>

        {/* --- BLOCK 2 & 7 --- */}
        <Block title="2. Importer - consignee">
          {permitType == "import" ? (
            <>
              <Detail
                label="Client ID/Registration No:"
                value={applicantDetails?.clientId}
              />
              <Detail
                label="Name:"
                value={
                  applicantDetails?.userType === "individual"
                    ? `${applicantDetails?.firstName ?? ""} ${
                        applicantDetails?.lastName ?? ""
                      }`.trim()
                    : applicantDetails?.userType === "organization"
                    ? applicantDetails?.organizationName
                    : applicantDetails?.userType === "government"
                    ? applicantDetails?.agencyName
                    : ""
                }
              />
              <Detail
                label="Contact Person:"
                value={`${applicantDetails?.firstName || ""} ${
                  applicantDetails?.lastName || ""
                }`.trim()}
              />
              <Detail label="Email:" value={applicantDetails?.email} />
              <Detail label="Telephone:" value={applicantDetails?.phone} />
              <Detail label="Fax:" value={applicantDetails?.fax} />

              {applicantDetails?.address && (
                <div className="mt-4">
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Main Address Information",
                        children: (
                          <div>
                            <Detail
                              label="Region:"
                              value={
                                normalizeText(
                                  applicantDetails?.address?.region
                                ) || "N/A"
                              }
                            />
                            <Detail
                              label="District:"
                              value={
                                normalizeText(
                                  applicantDetails?.address?.district
                                ) || "N/A"
                              }
                            />
                            <Detail
                              label="City:"
                              value={applicantDetails?.address?.city || "N/A"}
                            />
                            <Detail
                              label="Address:"
                              value={
                                applicantDetails?.address?.address || "N/A"
                              }
                            />
                            <Detail
                              label="GPS:"
                              value={applicantDetails?.address?.gps || "N/A"}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              )}

              {agentDetails && (
                <div className="mt-10">
                  <h1 className="font-bold mb-2">Agent Information</h1>
                  <hr className="bg--600 mb-2" />
                  <Detail label="Agent ID:" value={agentDetails?.clientId} />
                  <Detail
                    label="Name:"
                    value={`${agentDetails?.firstName || ""} ${
                      agentDetails?.lastName || ""
                    }`.trim()}
                  />
                  <Detail label="Email:" value={agentDetails?.email} />
                  <Detail label="Telephone:" value={agentDetails?.phone} />

                  {agentDetails?.address && (
                    <div className="mt-4">
                      <Collapse
                        items={[
                          {
                            key: "1",
                            label: "Main Address Information",
                            children: (
                              <div>
                                <Detail
                                  label="Region:"
                                  value={
                                    normalizeText(
                                      agentDetails?.address?.region
                                    ) || "N/A"
                                  }
                                />
                                <Detail
                                  label="District:"
                                  value={
                                    normalizeText(
                                      agentDetails?.address?.district
                                    ) || "N/A"
                                  }
                                />
                                <Detail
                                  label="City:"
                                  value={agentDetails?.address?.city || "N/A"}
                                />
                                <Detail
                                  label="Address:"
                                  value={
                                    agentDetails?.address?.address || "N/A"
                                  }
                                />
                                <Detail
                                  label="GPS:"
                                  value={agentDetails?.address?.gps || "N/A"}
                                />
                              </div>
                            ),
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Detail
                label="Registration No:"
                value={importerDetails.registrationNo}
              />
              <Detail label="Name:" value={importerDetails?.name} />
              <Detail label="Country:" value={importerDetails?.country} />
              <Detail label="Address:" value={importerDetails?.address} />
              <Detail
                label="Contact Person:"
                value={importerDetails.contactPerson}
              />
              <Detail label="Email:" value={importerDetails.email} />
              <Detail label="Telephone:" value={importerDetails.telephone} />
              <Detail label="Fax:" value={importerDetails.fax} />
            </>
          )}
        </Block>

        <Block title="7. Packaging type(s)">
          <Detail
            label="Type:"
            value={
              physicalDetails?.packagingType === "Other"
                ? physicalDetails?.packagingTypeOther
                : physicalDetails?.packagingType
            }
          />
          <div className={`${styles.checkboxGroup}`}>
            <span>Special handling requirements:</span>

            <div className="flex gap-8">
              <div>
                <input
                  type="checkbox"
                  checked={physicalDetails.hasSpecialHandling}
                  readOnly
                />{" "}
                Yes
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={!physicalDetails.hasSpecialHandling}
                  readOnly
                />{" "}
                No
              </div>
            </div>
          </div>

          <Detail
            label="Characteristic:"
            value={
              physicalDetails?.characteristics === "Other"
                ? physicalDetails?.characteristicsOther
                : physicalDetails?.characteristics
            }
          />
        </Block>

        {/* --- BLOCK 8 --- */}
        <Block title="8. Intended carrier(s)" className={styles.fullWidths}>
          {carriers?.map((carrier: any, index: number) => (
            <div key={index} className={styles.carrierItem}>
              <p>
                <strong>Carrier {index + 1}</strong>
              </p>
              <Detail label="Name:" value={carrier?.name} />
              <Detail label="Address:" value={carrier.address} />
              <Detail label="Email:" value={carrier.email} />
              <Detail label="Telephone:" value={carrier.telephone} />
              <Detail label="Means of transport:" value={carrier.transport} />
            </div>
          ))}
        </Block>

        {/* --- BLOCK 9, 10, 11 --- */}
        <Block title="9. Waste generator(s) - producer(s)">
          {isExporterSoleGenerator === "yes" ? (
            <p>Same as block 1.</p>
          ) : (
            generators?.map((gen: any, index: number) => (
              <div key={index} className={styles.subItem}>
                <Detail label="Name:" value={gen?.name} />
                <Detail label="Address:" value={gen?.address} />
                <Detail
                  label="Site and process of generation:"
                  value={gen?.process}
                />
              </div>
            ))
          )}
        </Block>

        <Block title="10. Disposal facility or Recovery facility">
          <div className={styles?.checkboxGroup}>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails?.purpose === "disposal"}
                readOnly
              />{" "}
              Disposal facility
            </div>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails?.purpose === "recovery"}
                readOnly
              />{" "}
              Recovery facility
            </div>
          </div>
          {facilityDetails?.isImporterFinalFacility ? (
            <p>Same as block 2.</p>
          ) : (
            <>
              <Detail
                label="Registration No:"
                value={facilityDetails?.registrationNo}
              />
              <Detail label="Name:" value={facilityDetails?.name} />
              <Detail label="Address:" value={`${facilityDetails.address}`} />
              <Detail label="Name:" value={exporterDetails?.name} />
              <Detail label="Address:" value={exporterDetails?.address} />
              <Detail
                label="Contact Person:"
                value={facilityDetails?.contactPerson}
              />
              <Detail label="Email:" value={facilityDetails?.email} />
              <Detail label="Telephone:" value={facilityDetails?.telephone} />
              <Detail label="Fax:" value={facilityDetails?.fax} />
              <Detail
                label="Actual site of disposal/recovery:"
                value={facilityDetails?.actualSite}
              />
            </>
          )}
        </Block>

        <Block title="11. Disposal / recovery operation(s)">
          <Detail label="D-code / R-code:" value={operationDetails?.drCode} />
          <Detail
            label="Technology employed:"
            value={operationDetails?.technology}
          />
          <Detail
            label="Reason for export:"
            value={
              operationDetails?.legalJustification ||
              operationDetails?.additionalReason
            }
          />
        </Block>

        {/* --- BLOCK 12, 13, 14 --- */}
        <Block title="12. Designation and composition of the waste">
          <Detail label="Common Name:" value={wasteDescription?.commonName} />
          <Detail label="Composition:" value={wasteDescription?.composition} />
        </Block>

        <Block title="13. Physical characteristics">
          <Detail
            label="Characteristic:"
            value={
              physicalDetails?.characteristics === "Other"
                ? physicalDetails?.characteristicsOther
                : physicalDetails?.characteristics
            }
          />
        </Block>

        <Block title="14. Waste identification">
          <Detail
            label="(i) Basel Annex VIII (or IX):"
            value={wasteCodes?.baselCode}
          />
          <Detail label="(ii) OECD code:" value={wasteCodes?.oecdCode} />
          <Detail label="(iii) EC list of wastes:" value={wasteCodes?.ecCode} />
          <Detail
            label="(iv) National code in country of export:"
            value={wasteCodes?.nationalExportCode}
          />
          <Detail
            label="(v) National code in country of import:"
            value={wasteCodes?.nationalImportCode}
          />
          <Detail label="(vi) Other:" value={wasteCodes?.otherCode} />
          <Detail label="(vii) Y-code:" value={wasteCodes?.yCode} />
          <Detail label="(viii) H-code:" value={wasteCodes?.hCode} />
          <Detail label="(ix) UN class:" value={wasteCodes?.unClass} />
          <Detail label="(x) UN Number:" value={wasteCodes?.unNumber} />
          <Detail
            label="(xi) UN Shipping name:"
            value={wasteCodes?.unShippingName}
          />
          <Detail
            label="(xii) Customs code(s) (HS):"
            value={wasteCodes?.hsCode}
          />
        </Block>

        {/* --- BLOCK 15: Countries/States Table --- */}
        <Block
          title="15. (a) Countries/States concerned, (b) Code no. of competent authorities where applicable, (c) Specific points of exit or entry"
          className={styles.fullWidth}
        >
          <table className={styles.countriesTable}>
            <thead>
              <tr>
                <th>State of export - dispatch</th>
                <th>State(s) of transit (entry and exit)</th>
                <th>State of import - destination</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>(a) Country:</strong> {routeDetails?.exportCountry}
                  <br />
                  <strong>(c) Exit Point:</strong> {routeDetails?.exitPoint}
                </td>
                <td>
                  {transitCountries?.length > 0
                    ? transitCountries?.map((tc: any, i: number) => (
                        <div key={i} className={styles?.subItem}>
                          <strong>(a) Country:</strong> {tc?.country}
                          <br />
                          <strong>(c) Entry/Exit:</strong> {tc?.entryExitPoints}
                        </div>
                      ))
                    : "None"}
                </td>
                <td>
                  <strong>(a) Country:</strong> {routeDetails?.importCountry}
                  <br />
                  <strong>(c) Entry Point:</strong> {routeDetails?.entryPoint}
                </td>
              </tr>
            </tbody>
          </table>
        </Block>

        {/* --- BLOCK 17 Attachments --- */}
        <Block title="Attached Documents" className={styles?.fullWidth}>
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default HazardousWastePreview;
