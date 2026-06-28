import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import {
  formatDate,
  formatDate2,
  formatLabel,
  handleDocumentView,
} from "@/utils/helperFunction";
import { Alert, Button, Card, List, Typography } from "antd";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";
const { Text } = Typography;
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";

// --- Props Interface ---
interface NotificationReviewProps {
  application: any;
  // This function would be provided by a parent component to persist changes
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
  status?: string;
}

// --- Main Review Component ---
export const HazardousWasteReview: React.FC<NotificationReviewProps> = ({
  application,
  status,
  onApplicationUpdate,
}) => {
  const {
    hazardousWasteDetails,
    permitType,
    review,
    evaluation,
    clientId,
    submittedByAgent,
  } = application;

  const {
    notificationNo,
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

  const notificationNumber = notificationNo || "PENDING GENERATION";

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    // Now this function correctly returns a Promise<void>
    // The `await` inside ReviewActionPanel will now work correctly.
    await onApplicationUpdate(sectionKey, type, status, comment);
  };

  if (!hazardousWasteDetails) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Notification Document for Transboundary Movements/Shipments of Waste
      </h2>
      <div className={styles.gridContainer}>
        {/* --- BLOCK 1 & 3-6 --- */}
        <Block
          title="1. Exporter - notifier"
          sectionKey="exporterDetails"
          reviewData={review.exporterDetails}
          evaluationData={evaluation.exporterDetails}
          onUpdate={handleUpdateSection}
        >
          {permitType == "export" ? (
            <>
              <Detail
                label="Client ID/Registration No:"
                value={clientId?.clientId}
              />
              <Detail
                label="Name:"
                value={
                  clientId?.userType === "individual"
                    ? `${clientId?.firstName ?? ""} ${
                        clientId?.lastName ?? ""
                      }`.trim()
                    : clientId?.userType === "organization"
                    ? clientId?.organizationName
                    : clientId?.userType === "government"
                    ? clientId?.agencyName
                    : ""
                }
              />
              <Detail
                label="Contact Person:"
                value={clientId?.firstName + " " + clientId?.lastName}
              />
              <Detail label="Email:" value={clientId?.email} />
              <Detail label="Telephone:" value={clientId?.phone} />
              <Detail label="Fax:" value={clientId?.fax} />

              {submittedByAgent && (
                <div className="mt-10">
                  <h1 className="font-bold mb-2">Agent Information</h1>
                  <hr className="bg--600 mb-2" />
                  <Detail
                    label="Name:"
                    value={`${submittedByAgent?.firstName} ${submittedByAgent?.lastName}`}
                  />
                  <Detail label="Email:" value={submittedByAgent?.email} />
                  <Detail label="Telephone:" value={submittedByAgent?.phone} />
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
              <Detail label="Country:" value={exporterDetails?.country} />
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

        <Block
          title="3. Notification"
          sectionKey="shipmentDetails"
          reviewData={review.shipmentDetails}
          evaluationData={evaluation.shipmentDetails}
          onUpdate={handleUpdateSection}
        >
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
        <Block
          title="2. Importer - consignee"
          sectionKey="importerDetails"
          reviewData={review.importerDetails}
          evaluationData={evaluation.importerDetails}
          onUpdate={handleUpdateSection}
        >
          {permitType == "import" ? (
            <>
              <Detail
                label="Client ID/Registration No:"
                value={clientId?.clientId}
              />
              <Detail
                label="Name:"
                value={
                  clientId?.userType === "individual"
                    ? `${clientId?.firstName ?? ""} ${
                        clientId?.lastName ?? ""
                      }`.trim()
                    : clientId?.userType === "organization"
                    ? clientId?.organizationName
                    : clientId?.userType === "government"
                    ? clientId?.agencyName
                    : ""
                }
              />
              <Detail
                label="Contact Person:"
                value={clientId?.firstName + " " + clientId?.lastName}
              />
              <Detail label="Email:" value={clientId?.email} />
              <Detail label="Telephone:" value={clientId?.phone} />
              <Detail label="Fax:" value={clientId?.fax} />

              {submittedByAgent && (
                <div className="mt-10">
                  <h1 className="font-bold mb-2">Agent Information</h1>
                  <hr className="bg--600 mb-2" />
                  <Detail
                    label="Name:"
                    value={`${submittedByAgent?.firstName} ${submittedByAgent?.lastName}`}
                  />
                  <Detail label="Email:" value={submittedByAgent?.email} />
                  <Detail label="Telephone:" value={submittedByAgent?.phone} />
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

        <Block
          title="7. Packaging type(s) and 13. Physical characteristics"
          sectionKey="physicalDetails"
          reviewData={review.physicalDetails}
          evaluationData={evaluation.physicalDetails}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Type:"
            value={
              physicalDetails.packagingType === "Other"
                ? physicalDetails.packagingTypeOther
                : physicalDetails.packagingType
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
              physicalDetails.characteristics === "Other"
                ? physicalDetails.characteristicsOther
                : physicalDetails.characteristics
            }
          />
        </Block>

        {/* --- BLOCK 8 --- */}
        <Block
          title="8. Intended carrier(s)"
          // className={styles.fullWidth}
          sectionKey="carriers"
          reviewData={review.carriers}
          evaluationData={evaluation.carriers}
          onUpdate={handleUpdateSection}
        >
          {carriers?.map((carrier, index) => (
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
        <Block
          title="9. Waste generator(s) - producer(s)"
          sectionKey="generators"
          reviewData={review.generators}
          evaluationData={evaluation.generators}
          onUpdate={handleUpdateSection}
        >
          {isExporterSoleGenerator === "yes" ? (
            <p>Same as block 1.</p>
          ) : (
            generators?.map((gen, index) => (
              <div key={index} className={styles.subItem}>
                <Detail label="Name:" value={gen?.name} />
                <Detail label="Address:" value={gen.address} />
                <Detail
                  label="Site and process of generation:"
                  value={gen.process}
                />
              </div>
            ))
          )}
        </Block>

        <Block
          title="10. Disposal facility or Recovery facility"
          sectionKey="facilityDetails"
          reviewData={review.facilityDetails}
          evaluationData={evaluation.facilityDetails}
          onUpdate={handleUpdateSection}
        >
          <div className={styles.checkboxGroup}>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails.purpose === "disposal"}
                readOnly
              />{" "}
              Disposal facility
            </div>
            <div>
              <input
                type="checkbox"
                checked={shipmentDetails.purpose === "recovery"}
                readOnly
              />{" "}
              Recovery facility
            </div>
          </div>
          {facilityDetails.isImporterFinalFacility ? (
            <p>Same as block 2.</p>
          ) : (
            <>
              <Detail
                label="Registration No:"
                value={facilityDetails.registrationNo}
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
                value={facilityDetails.actualSite}
              />
            </>
          )}
        </Block>

        <Block
          title="11. Disposal / recovery operation(s)"
          sectionKey="operationDetails"
          reviewData={review.operationDetails}
          evaluationData={evaluation.operationDetails}
          onUpdate={handleUpdateSection}
        >
          <Detail label="D-code / R-code:" value={operationDetails.drCode} />
          <Detail
            label="Technology employed:"
            value={operationDetails.technology}
          />
          <Detail
            label="Reason for export:"
            value={
              operationDetails.legalJustification ||
              operationDetails.additionalReason
            }
          />
        </Block>

        {/* --- BLOCK 12, 13, 14 --- */}
        <Block
          title="12. Designation and composition of the waste"
          sectionKey="wasteDescription"
          reviewData={review.wasteDescription}
          evaluationData={evaluation.wasteDescription}
          onUpdate={handleUpdateSection}
        >
          <Detail label="Common Name:" value={wasteDescription.commonName} />
          <Detail label="Composition:" value={wasteDescription.composition} />
        </Block>
        {/* 
        <Block
          title="13. Physical characteristics"
          sectionKey="physicalDetails"
          reviewData={review.physicalDetails}
          evaluationData={evaluation.physicalDetails}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Characteristic:"
            value={
              physicalDetails.characteristics === "Other"
                ? physicalDetails.characteristicsOther
                : physicalDetails.characteristics
            }
          />
        </Block> */}

        <Block
          title="14. Waste identification"
          sectionKey="wasteCodes"
          reviewData={review.wasteCodes}
          evaluationData={evaluation.wasteCodes}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="(i) Basel Annex VIII (or IX):"
            value={wasteCodes.baselCode}
          />
          <Detail label="(ii) OECD code:" value={wasteCodes.oecdCode} />
          <Detail label="(iii) EC list of wastes:" value={wasteCodes.ecCode} />
          <Detail
            label="(iv) National code in country of export:"
            value={wasteCodes.nationalExportCode}
          />
          <Detail
            label="(v) National code in country of import:"
            value={wasteCodes.nationalImportCode}
          />
          <Detail label="(vi) Other:" value={wasteCodes.otherCode} />
          <Detail label="(vii) Y-code:" value={wasteCodes.yCode} />
          <Detail label="(viii) H-code:" value={wasteCodes.hCode} />
          <Detail label="(ix) UN class:" value={wasteCodes.unClass} />
          <Detail label="(x) UN Number:" value={wasteCodes.unNumber} />
          <Detail
            label="(xi) UN Shipping name:"
            value={wasteCodes.unShippingName}
          />
          <Detail
            label="(xii) Customs code(s) (HS):"
            value={wasteCodes.hsCode}
          />
        </Block>

        {/* --- BLOCK 15: Countries/States Table --- */}
        <Block
          title="15. (a) Countries/States concerned, (b) Code no. of competent authorities where applicable, (c) Specific points of exit or entry"
          className={styles.fullWidth}
          sectionKey="routeDetails"
          reviewData={review.routeDetails}
          evaluationData={evaluation.routeDetails}
          onUpdate={handleUpdateSection}
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
                  <strong>(a) Country:</strong> {routeDetails.exportCountry}
                  <br />
                  <strong>(c) Exit Point:</strong> {routeDetails.exitPoint}
                </td>
                <td>
                  {transitCountries?.length > 0
                    ? transitCountries?.map((tc, i) => (
                        <div key={i} className={styles.subItem}>
                          <strong>(a) Country:</strong> {tc.country}
                          <br />
                          <strong>(c) Entry/Exit:</strong> {tc.entryExitPoints}
                        </div>
                      ))
                    : "None"}
                </td>
                <td>
                  <strong>(a) Country:</strong> {routeDetails.importCountry}
                  <br />
                  <strong>(c) Entry Point:</strong> {routeDetails.entryPoint}
                </td>
              </tr>
            </tbody>
          </table>
        </Block>

        {/* --- BLOCK 17: Declaration --- */}
        <Block
          title="17. Exporter's - notifier's / generator's - producer's (1) declaration"
          className={styles.fullWidth}
          sectionKey="exporterDetails"
          reviewData={review.exporterDetails}
          evaluationData={evaluation.exporterDetails}
          onUpdate={handleUpdateSection}
        >
          <p className={styles.declarationText}>
            I certify that the information is complete and correct to my best
            knowledge. I also certify that legally enforceable written
            contractual obligations have been entered into and that any
            applicable insurance or other financial guarantee is or shall be in
            force covering the transboundary movement.
          </p>
          <div className={styles.signatureArea}>
            <div>
              <Detail
                label="Exporter's - notifier's name:"
                value={exporterDetails?.name}
              />
              <Detail
                label="Date:"
                value={formatDate(new Date().toISOString())}
              />
              <Detail label="Signature:">
                <em>(To be signed upon submission)</em>
              </Detail>
            </div>
            <div>
              <Detail
                label="Generator's - producer's name:"
                value={
                  isExporterSoleGenerator === "yes"
                    ? exporterDetails?.name
                    : generators?.map((g) => g?.name).join(", ")
                }
              />
              <Detail
                label="Date:"
                value={formatDate(new Date().toISOString())}
              />
              <Detail label="Signature:">
                <em>(To be signed upon submission)</em>
              </Detail>
            </div>
          </div>
        </Block>

        {/* --- BLOCK 17 Attachments --- */}
        <Block
          title="Attached Documents"
          className={styles.fullWidth}
          sectionKey="attachments"
          reviewData={review.attachments}
          evaluationData={evaluation.attachments}
          onUpdate={handleUpdateSection}
        >
          <>
            {/* Supporting Documents */}
            {application?.attachments?.length > 0 ? (
              <div className="bg-slate-50 rounded-lg p-2">
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={application.attachments}
                  renderItem={(attachment: any) => (
                    <List.Item key={attachment._id}>
                      <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow bg-white border border-gray-200 !p-3"
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileOutlined className="text-red-600" />
                            <Text
                              strong
                              className="text-gray-800 text-[10px] uppercase"
                            >
                              {formatLabel(attachment.label).replace(/_/g, " ")}
                            </Text>
                          </div>
                          <Text
                            className="text-gray-600 text-xs"
                            ellipsis={{ tooltip: attachment.originalname }}
                          >
                            {attachment.originalname}
                          </Text>
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleDocumentView(attachment)}
                            className="text-red-600 hover:text-red-800 p-0 h-auto font-medium text-xs"
                          >
                            View Document
                          </Button>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Alert
                message="No Documents Attached"
                type="info"
                showIcon
                style={{ textAlign: "center", marginTop: 16 }}
              />
            )}
          </>
        </Block>
      </div>
    </div>
  );
};

// Default export
export default HazardousWasteReview;
