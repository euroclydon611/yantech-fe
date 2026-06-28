import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Typography } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { FileTextOutlined } from "@ant-design/icons";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title } = Typography;

interface EnvironmentalSmallScaleMiningPreviewProps {
  application: any;
}

export const EnvironmentalSmallScaleMiningReview: React.FC<
  EnvironmentalSmallScaleMiningPreviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};
  const miningData = answers?.environmentalPermitData?.mining || {};
  const smallScaleData = miningData?.smallScale || {};

  const {
    generalInformation,
    projectDescription,
    environmentalImpactAssessment,
    reclamationAndAbandonment,
  } = smallScaleData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to format power sources
  const formatPowerSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4"></div>
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
          <Detail
            label="Permit Category:"
            value="MINING SECTOR - SMALL SCALE OPERATIONS"
          />
        </Block>

        {/* --- BLOCK 3: General Information --- */}
        <Block title="3. General Information" className={styles.fullWidth}>
          <Detail
            label="Manager Name:"
            value={generalInformation?.managerName || "N/A"}
          />
          <Detail
            label="Type of Mineral:"
            value={generalInformation?.mineralType || "N/A"}
          />
          <Detail
            label="Nature of Operations:"
            value={
              generalInformation?.natureOfOperations
                ? generalInformation.natureOfOperations === "surface"
                  ? "Surface Mining"
                  : generalInformation.natureOfOperations === "underground"
                  ? "Underground Mining"
                  : generalInformation.natureOfOperations
                : "N/A"
            }
          />
          <Detail
            label="Size of Concession (acres):"
            value={
              generalInformation?.concessionSize
                ? `${generalInformation.concessionSize} acres`
                : "N/A"
            }
          />
          {/* Mining Locations */}
          <div className="mt-4">
            <label className="font-semibold text-gray-700 block mb-2">
              Mining Locations:
            </label>
            {generalInformation?.locations &&
            generalInformation.locations.length > 0 ? (
              <div className="space-y-4 ml-4">
                {generalInformation?.locations?.map((loc: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-l-2 border-gray-300 pl-4 py-2"
                  >
                    <p className="font-semibold text-gray-800 mb-2">
                      {idx + 1}. {normalizeText(loc.region)}
                    </p>
                    <div className="text-gray-700 space-y-1 text-sm">
                      {normalizeText(loc.district) && (
                        <p>
                          <span className="font-medium">District:</span>{" "}
                          {normalizeText(loc.district)}
                        </p>
                      )}
                      {loc.city && (
                        <p>
                          <span className="font-medium">City:</span> {loc.city}
                        </p>
                      )}
                      {loc.address && (
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {loc.address}
                        </p>
                      )}
                      {loc.latitude && (
                        <p>
                          <span className="font-medium">Latitude:</span>{" "}
                          {loc.latitude}
                        </p>
                      )}
                      {loc.longitude && (
                        <p>
                          <span className="font-medium">Longitude:</span>{" "}
                          {loc.longitude}
                        </p>
                      )}
                      {loc.majorLandmark && (
                        <p>
                          <span className="font-medium">Major Landmark:</span>{" "}
                          {loc.majorLandmark}
                        </p>
                      )}
                      {loc.closestCommunities && (
                        <p>
                          <span className="font-medium">
                            Closest Communities:
                          </span>{" "}
                          {loc.closestCommunities}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">N/A</p>
            )}
          </div>
        </Block>

        {/* --- BLOCK 4: Project Description --- */}
        <Block
          title="4. Description of Proposed Project"
          className={styles.fullWidth}
        >
          <Detail
            label="Operation Method (Mining & Processing):"
            value={projectDescription?.operationMethod || "N/A"}
          />

          {/* Equipment List Section */}
          {projectDescription?.equipment &&
            projectDescription.equipment.length > 0 && (
              <div className="mb-6 mt-6">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Equipment List
                </Title>
                <div
                  style={{
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <Table
                    dataSource={projectDescription.equipment}
                    columns={[
                      {
                        title: "Equipment Name",
                        dataIndex: "name",
                        key: "name",
                        width: "35%",
                      },
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                        width: "35%",
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: "30%",
                      },
                    ]}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey={(record, index) => index}
                    scroll={{ x: "max-content" }}
                  />
                </div>
              </div>
            )}

          <div className="mb-4 mt-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Availability & Utilization of Resources
            </Title>

            {/* Power Sources */}
            <div className="mb-4">
              <Detail
                label="Power Sources:"
                value={formatPowerSources(projectDescription?.power?.sources)}
              />
            </div>

            {/* Water Infrastructure */}
            <div className="mb-4">
              <Title
                level={5}
                className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
              >
                Water Sources
              </Title>

              {projectDescription?.processWater &&
                projectDescription.processWater.length > 0 && (
                  <div className="mb-4">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Process Water Sources
                    </Title>
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={projectDescription.processWater}
                        columns={[
                          {
                            title: "Source",
                            dataIndex: "source",
                            key: "source",
                            width: "35%",
                          },
                          {
                            title: "Volume Per Day",
                            dataIndex: "volumePerDay",
                            key: "volumePerDay",
                            width: "30%",
                          },
                          {
                            title: "Unit",
                            dataIndex: "unit",
                            key: "unit",
                            width: "35%",
                            render: (text) => text || "m³",
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey={(record, index) => index}
                        scroll={{ x: "max-content" }}
                      />
                    </div>
                  </div>
                )}

              {projectDescription?.portableWater &&
                projectDescription.portableWater.length > 0 && (
                  <div className="mb-4">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Potable Water Sources
                    </Title>
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={projectDescription.portableWater}
                        columns={[
                          {
                            title: "Source",
                            dataIndex: "source",
                            key: "source",
                            width: "35%",
                          },
                          {
                            title: "Volume Per Day",
                            dataIndex: "volumePerDay",
                            key: "volumePerDay",
                            width: "30%",
                          },
                          {
                            title: "Unit",
                            dataIndex: "unit",
                            key: "unit",
                            width: "35%",
                            render: (text) => text || "m³",
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey={(record, index) => index}
                        scroll={{ x: "max-content" }}
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Sanitation */}
            <Detail
              label="Type of Sanitation:"
              value={normalizeText(projectDescription?.sanitationType) || "N/A"}
            />

            {/* Labour Count */}
            <Detail
              label="Labour Count:"
              value={
                projectDescription?.labourCount
                  ? `${projectDescription.labourCount} persons`
                  : "N/A"
              }
            />
          </div>
        </Block>

        {/* --- BLOCK 5:  Impact Identification and Management --- */}
        <Block
          title="5.  Impact Identification and Management"
          className={styles.fullWidth}
        >
          {/* Phase-Based Impacts & Mitigation Measures */}
          <div className="mb-6">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Impacts & Mitigation Measures by Phase
            </Title>

            {(
              ["constructionPhase", "operationPhase", "closurePhase"] as const
            ).map((phase) => {
              const phaseLabels: Record<string, string> = {
                constructionPhase: "Construction Phase",
                operationPhase: "Operation Phase",
                closurePhase: "Closure/Decommissioning Phase",
              };

              const phaseData =
                environmentalImpactAssessment?.[phase as keyof any] || {};
              const pairs = phaseData.impactMeasurePairs || [];
              const hasData =
                pairs.length > 0 &&
                pairs.some(
                  (pair: any) => pair.impact?.trim() || pair.measures?.trim()
                );

              return (
                <div
                  key={phase}
                  className="mb-6 pb-6 border-b last:border-b-0 last:pb-0"
                >
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    {phaseLabels[phase]}
                  </Title>

                  {hasData ? (
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={pairs}
                        columns={[
                          {
                            title: "Environmental Impact",
                            dataIndex: "impact",
                            key: "impact",
                            width: "50%",
                            render: (text) => text || "—",
                          },
                          {
                            title: "Mitigation Measures",
                            dataIndex: "measures",
                            key: "measures",
                            width: "50%",
                            render: (text) => text || "—",
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey={(_, index) => index}
                        scroll={{ x: "max-content" }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No impacts and mitigation measures documented for this
                      phase
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Water Body Impact Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Impact on Water Bodies
            </Title>
            <Detail
              label="Will Mining Impact Water Bodies:"
              value={
                environmentalImpactAssessment?.waterBodyImpact === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {environmentalImpactAssessment?.waterBodyImpact === "yes" && (
              <>
                <Detail
                  label="Likely Water Impacts:"
                  value={
                    environmentalImpactAssessment?.likelyWaterImpacts || "N/A"
                  }
                />
                <Detail
                  label="Affected Communities:"
                  value={
                    environmentalImpactAssessment?.affectedCommunities || "N/A"
                  }
                />
              </>
            )}
          </div>

          {/* Community Consultation Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Community Consultation
            </Title>
            <Detail
              label="Communities Consulted:"
              value={
                environmentalImpactAssessment?.communityConsultation === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {environmentalImpactAssessment?.communityConsultation === "yes" && (
              <Detail
                label="Consulted Communities:"
                value={
                  environmentalImpactAssessment?.consultedCommunities || "N/A"
                }
              />
            )}

            {environmentalImpactAssessment?.communityConsultation === "no" &&
              environmentalImpactAssessment?.noConsultationReason && (
                <Detail
                  label="Reason for No Consultation:"
                  value={environmentalImpactAssessment.noConsultationReason}
                />
              )}
          </div>
        </Block>

        {/* --- BLOCK 6: Reclamation Plans --- */}
        <Block
          title="6. Reclamation & Abandonment Plans"
          className={styles.fullWidth}
        >
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Reclamation Measures
            </Title>
            {reclamationAndAbandonment?.reclamationDescription && (
              <Detail
                label="Reclamation Plan:"
                value={reclamationAndAbandonment.reclamationDescription}
              />
            )}
            {reclamationAndAbandonment?.reclamationFile && (
              <div className="flex items-center space-x-2 mt-1 text-red-600">
                <FileTextOutlined />
                <span>
                  Reclamation Document attached — refer to{" "}
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            )}
            {!reclamationAndAbandonment?.reclamationDescription &&
              !reclamationAndAbandonment?.reclamationFile && (
                <Detail label="Reclamation Plan:" value="N/A" />
              )}
            <Detail
              label="Estimated Reclamation Cost (GHS):"
              value={
                reclamationAndAbandonment?.reclamationCost
                  ? `₵${reclamationAndAbandonment.reclamationCost.toLocaleString()}`
                  : "N/A"
              }
            />
          </div>

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Abandonment Plans
            </Title>
            {reclamationAndAbandonment?.abandonmentDescription && (
              <Detail
                label="Abandonment Plan:"
                value={reclamationAndAbandonment.abandonmentDescription}
              />
            )}
            {reclamationAndAbandonment?.abandonmentFile && (
              <div className="flex items-center space-x-2 mt-1 text-red-600">
                <FileTextOutlined />
                <span>
                  Abandonment Document attached — refer to{" "}
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            )}
            {!reclamationAndAbandonment?.abandonmentDescription &&
              !reclamationAndAbandonment?.abandonmentFile && (
                <Detail label="Abandonment Plan:" value="N/A" />
              )}
            <Detail
              label="Abandonment Cost Estimate (GHS):"
              value={
                reclamationAndAbandonment?.abandonmentCostEstimate
                  ? `₵${reclamationAndAbandonment.abandonmentCostEstimate.toLocaleString()}`
                  : "N/A"
              }
            />
          </div>

          {/* Compensation Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Compensation
            </Title>
            <Detail
              label="Compensation Envisaged:"
              value={
                reclamationAndAbandonment?.compensationEnvisaged === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {reclamationAndAbandonment?.compensationEnvisaged === "yes" && (
              <>
                {reclamationAndAbandonment?.compensationDetails &&
                  reclamationAndAbandonment.compensationDetails.length > 0 && (
                    <div className="mt-4">
                      <Title
                        level={5}
                        className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                      >
                        Compensation Details
                      </Title>
                      <div
                        style={{
                          overflowX: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <Table
                          dataSource={
                            reclamationAndAbandonment.compensationDetails
                          }
                          columns={[
                            {
                              title: "Type",
                              dataIndex: "compensationType",
                              key: "compensationType",
                              width: "25%",
                            },
                            {
                              title: "Specification",
                              dataIndex: "cropType",
                              key: "cropType",
                              width: "25%",
                            },
                            {
                              title: "Status",
                              dataIndex: "maturity",
                              key: "maturity",
                              width: "25%",
                            },
                            {
                              title: "Cost per Unit (GHS)",
                              dataIndex: "costPerTreeOrAcre",
                              key: "costPerTreeOrAcre",
                              width: "25%",
                              render: (cost) =>
                                cost ? `₵${cost.toLocaleString()}` : "N/A",
                            },
                          ]}
                          pagination={false}
                          size="small"
                          bordered
                          rowKey={(record, index) => index}
                          scroll={{ x: "max-content" }}
                        />
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </Block>

        {/* --- BLOCK 7: Previous Permit Information --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block
            title="7. Previous Permit Information"
            className={styles.fullWidth}
          >
            {smallScaleData?.previousPermit ? (
              <div className="space-y-4">
                <Detail
                  label="Permit Number:"
                  value={smallScaleData.previousPermit.permitNumber || "N/A"}
                />
                <Detail
                  label="Issue Date:"
                  value={
                    smallScaleData.previousPermit.permitIssuedDate
                      ? formatDate(
                          smallScaleData.previousPermit.permitIssuedDate
                        )
                      : "N/A"
                  }
                />
                <Detail
                  label="Expiry Date:"
                  value={
                    smallScaleData.previousPermit.permitExpiryDate
                      ? formatDate(
                          smallScaleData.previousPermit.permitExpiryDate
                        )
                      : "N/A"
                  }
                />
                {smallScaleData.previousPermit.permitDocument && (
                  <div className="mt-4">
                    <label className="font-semibold text-gray-700 block mb-2">
                      Permit Document:
                    </label>
                    <span className="text-red-600">
                      Document attached — refer to{" "}
                      <strong>Block 8 (Supporting Documents)</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Detail label="Previous Permit Information:" value="N/A" />
            )}
          </Block>
        )}

        {/* --- BLOCK 9: Supporting Documents --- */}
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

export default EnvironmentalSmallScaleMiningReview;
