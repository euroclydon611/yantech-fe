import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Typography, Collapse } from "antd";
import { Block, Detail } from "../../../../review/helpers";

import {
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title } = Typography;

interface EnvironmentalManufacturingReviewProps {
  application: any;
}

export const EnvironmentalManufacturingEM1Preview: React.FC<
  EnvironmentalManufacturingReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const manufacturingData =
    answers?.environmentalPermitData?.manufacturing || {};

  const {
    generalInformation,
    scopeAndMaterials,
    operationsAndImpacts,
    risksAndCompliance,
    attachments,
  } = manufacturingData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  const renderImpactDetails = (impacts: any) => {
    const impactTypes = [
      { key: "solidWaste", label: "Solid Waste" },
      { key: "liquidWaste", label: "Liquid Waste" },
      { key: "airEmissions", label: "Air Emissions" },
      { key: "noise", label: "Noise" },
      { key: "odour", label: "Odour" },
      { key: "visual", label: "Visual" },
      { key: "socioCultural", label: "Socio-Cultural" },
      { key: "others", label: "Others" },
    ];

    const activeImpacts = impactTypes
      .filter((type) => impacts?.[type.key as keyof any]?.checked)
      .map((type) => ({
        key: type.key,
        impactType: type.label,
        description: impacts[type.key as keyof any]?.description || "—",
        measures: impacts[type.key as keyof any]?.measures || "—",
        perceivedRisks: impacts[type.key as keyof any]?.perceivedRisks || "—",
      }));

    if (activeImpacts.length === 0) {
      return <p className="text-gray-500 italic">No impacts reported</p>;
    }

    return (
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <Table
          dataSource={activeImpacts}
          columns={[
            {
              title: "Impact Type",
              dataIndex: "impactType",
              key: "impactType",
              width: "18%",
            },
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
              width: "27%",
            },
            {
              title: "Mitigation Measures",
              dataIndex: "measures",
              key: "measures",
              width: "27%",
            },
            {
              title: "Perceived Risks",
              dataIndex: "perceivedRisks",
              key: "perceivedRisks",
              width: "28%",
            },
          ]}
          pagination={false}
          size="small"
          bordered
          rowKey="key"
          scroll={{ x: "max-content" }}
        />
      </div>
    );
  };

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-500 rounded-full mt-3 mb-4"></div>
      </div>
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
            label="Application Type:"
            value={normalizeText(permitDetails?.applicationType?.toUpperCase())}
          />
          <Detail label="Permit Type:" value="ENVIRONMENTAL PERMIT" />
          <Detail label="Permit Category:" value="MANUFACTURING SECTOR" />
          <Detail
            label="Type of Undertaking:"
            value="Existing Undertaking (Existing facility applying for first permit (did not undergo initial EA))"
          />
        </Block>

        {/* --- BLOCK 3: Step 1 - General Information --- */}
        <Block
          title="3. Step 1: General Information"
          className={styles.fullWidth}
        >
          <div className="space-y-4">
            <Detail
              label="1. Registered Name of Undertaking:"
              value={generalInformation?.registeredName || "N/A"}
            />
            <Detail
              label="2. Type of Undertaking:"
              value={generalInformation?.typeOfUndertaking || "N/A"}
            />

            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                3. Location of Undertaking
              </Title>
              <div className="space-y-2">
                <Detail
                  label="Region:"
                  value={
                    normalizeText(
                      generalInformation?.locationDetails?.region
                    ) || "N/A"
                  }
                />
                <Detail
                  label="District:"
                  value={
                    normalizeText(
                      generalInformation?.locationDetails?.district
                    ) || "N/A"
                  }
                />
                <Detail
                  label="City/Town:"
                  value={generalInformation?.locationDetails?.city || "N/A"}
                />
                <Detail
                  label="Address:"
                  value={generalInformation?.locationDetails?.address || "N/A"}
                />
                <Detail
                  label="Major Landmark:"
                  value={
                    generalInformation?.locationDetails?.majorLandmark || "N/A"
                  }
                />
                <Detail
                  label="Latitude:"
                  value={generalInformation?.locationDetails?.latitude}
                />
                <Detail
                  label="Longitude:"
                  value={generalInformation?.locationDetails?.longitude}
                />{" "}
                {generalInformation?.locationDetails?.googleLocationLink && (
                  <Detail
                    label="Google Maps Link/GPS:"
                    value={
                      <a
                        href={
                          generalInformation.locationDetails.googleLocationLink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {generalInformation.locationDetails.googleLocationLink}
                      </a>
                    }
                  />
                )}
              </div>
            </div>

            <Detail
              label="4. Name of Head of Company/Organisation:"
              value={generalInformation?.nameOfHeadOfCompany || "N/A"}
            />
            <Detail
              label="5. Name of Environmental Officer:"
              value={generalInformation?.nameOfEnvironmentalOfficer || "N/A"}
            />

            {/* Environmental Reports */}
            {generalInformation?.environmentalReports && (
              <div className="mt-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  6. Environmental Reports Submitted
                </Title>
                <div className="space-y-2">
                  {generalInformation.environmentalReports.eis?.checked && (
                    <Detail
                      label="Environmental Impact Statement (EIS):"
                      value={
                        generalInformation.environmentalReports.eis
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.eis.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}
                  {generalInformation.environmentalReports.per?.checked && (
                    <Detail
                      label="Preliminary Environmental Report (PER):"
                      value={
                        generalInformation.environmentalReports.per
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.per.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}
                  {generalInformation.environmentalReports.emp?.checked && (
                    <Detail
                      label="Environmental Management Plan (EMP):"
                      value={
                        generalInformation.environmentalReports.emp
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.emp.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}
                  {generalInformation.environmentalReports.aer?.checked && (
                    <Detail
                      label="Annual Environmental Report (AER):"
                      value={
                        generalInformation.environmentalReports.aer
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.aer.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}
                  {generalInformation.environmentalReports.monthlyQuarterly
                    ?.checked && (
                    <Detail
                      label="Monthly/Quarterly Reports:"
                      value={
                        generalInformation.environmentalReports.monthlyQuarterly
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.monthlyQuarterly.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}

                  {generalInformation.environmentalReports.others?.checked && (
                    <Detail
                      label={`Other Reports (${generalInformation.environmentalReports.others.description}):`}
                      value={
                        generalInformation.environmentalReports.others
                          .dateSubmitted
                          ? `Submitted on ${generalInformation.environmentalReports.others.dateSubmitted}`
                          : "Checked"
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Block>

        {/* --- BLOCK 4: Step 2 - Scope & Raw Materials --- */}
        <Block
          title="4. Step 2: Scope & Raw Materials"
          className={styles.fullWidth}
        >
          <div className="space-y-6">
            <div>
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                9. Scope of Undertaking
              </Title>
              <div className="space-y-2">
                <Detail
                  label="Size of Labour Force:"
                  value={scopeAndMaterials?.laborForce || "N/A"}
                />
                <Detail
                  label="Capacity (installed/operating/occupancy/etc):"
                  value={scopeAndMaterials?.capacity || "N/A"}
                />
                <Detail
                  label="Landtake (acres):"
                  value={scopeAndMaterials?.landtake || "N/A"}
                />
                <Detail
                  label="Annual Turnover:"
                  value={
                    scopeAndMaterials?.annualTurnover
                      ? `${scopeAndMaterials.annualTurnover} ${
                          scopeAndMaterials.turnoverCurrency || "GHS"
                        }`
                      : "N/A"
                  }
                />
              </div>
            </div>

            {/* Raw Materials Table */}
            {scopeAndMaterials?.rawMaterials &&
              scopeAndMaterials.rawMaterials.length > 0 && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    10. Type of Raw Materials Used and their handling
                  </Title>
                  <div className="mb-4">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      a) List Raw Materials (including chemicals)
                    </Title>
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={scopeAndMaterials.rawMaterials}
                        columns={[
                          {
                            title: "Material/Chemical Name",
                            dataIndex: "materialName",
                            key: "materialName",
                          },
                          {
                            title: "Source/Supplier",
                            dataIndex: "source",
                            key: "source",
                          },
                          {
                            title: "Type",
                            dataIndex: "type",
                            key: "type",
                          },
                          {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                      />
                    </div>
                  </div>

                  {scopeAndMaterials?.handlingAndStorage && (
                    <Detail
                      label="b) Handling and Storage:"
                      value={scopeAndMaterials.handlingAndStorage}
                    />
                  )}
                </div>
              )}
          </div>
        </Block>

        {/* --- BLOCK 5: Step 3 - Operations & Impacts --- */}
        <Block
          title="5. Step 3: Operations & Impacts"
          className={styles.fullWidth}
        >
          <div className="space-y-6">
            <Detail
              label="11. Describe nature/processes/activities etc involved in the undertaking:"
              value={operationsAndImpacts?.natureOfProcesses || "N/A"}
            />

            <Detail
              label="12. Indicate type of Products/Outputs/Services/etc:"
              value={operationsAndImpacts?.productsOutputServices || "N/A"}
              className={styles.preserveWhitespace}
            />

            <div>
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                13. Indicate type of impacts (including wastes) generated by
                your operation and the receiving environment, and current
                measures taken to reduce/minimize/prevent specified impacts
              </Title>
              {operationsAndImpacts?.impacts ? (
                renderImpactDetails(operationsAndImpacts.impacts)
              ) : (
                <p className="text-gray-500 italic">No impacts reported</p>
              )}
            </div>
          </div>
        </Block>

        {/* --- BLOCK 5: Step 4 - Risks & Compliance --- */}
        <Block
          title="6. Step 4: Risks & Compliance"
          className={styles.fullWidth}
        >
          <div className="space-y-6">
            <div>
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                16. Do you have a Contingency/Emergency Response Plan?
              </Title>
              <div className="space-y-2">
                <Detail
                  label="Has Contingency/Emergency Response Plan:"
                  value={
                    risksAndCompliance?.hasContingencyPlan === true
                      ? "Yes"
                      : risksAndCompliance?.hasContingencyPlan === false
                      ? "No"
                      : "Not specified"
                  }
                />
                {risksAndCompliance?.hasContingencyPlan &&
                  attachments?.contingencyPlan && (
                    <>
                      <div className="mt-4 flex items-center gap-4">
                        <Title
                          level={4}
                          className="!text-sm !font-semibold !m-0 text-gray-800"
                        >
                          Plan File
                        </Title>
                        <div className="flex items-center space-x-2 mt-1 text-red-600">
                          <FileTextOutlined />
                          <span>
                            Supporting document attached — refer to{" "}
                            <strong className="!text-red-600">
                              Block 7 (Supporting Documents)
                            </strong>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>

            <div>
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                17. Complaints about your undertaking
              </Title>
              <div className="space-y-4">
                <div>
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    a) Have there been any complaints about your undertaking?
                  </Title>
                  <Detail
                    label="Complaints Received:"
                    value={
                      risksAndCompliance?.complaintsReceived === true
                        ? "Yes"
                        : risksAndCompliance?.complaintsReceived === false
                        ? "No"
                        : "Not specified"
                    }
                  />
                </div>

                {risksAndCompliance?.complaintsReceived && (
                  <div>
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      b) If yes, indicate the type of complaint
                    </Title>
                    <Detail
                      label="Complaint Types:"
                      value={risksAndCompliance?.complaintTypes || "N/A"}
                      className={styles.preserveWhitespace}
                    />
                  </div>
                )}

                <div>
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    c) Is any aspect of the Undertaking a subject of litigation?
                  </Title>
                  <Detail
                    label="Under Litigation:"
                    value={
                      risksAndCompliance?.isUnderLitigation === true
                        ? "Yes"
                        : risksAndCompliance?.isUnderLitigation === false
                        ? "No"
                        : "Not specified"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Block>

        {/* --- BLOCK 6: Supporting Documents --- */}
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

export default EnvironmentalManufacturingEM1Preview;
