import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Collapse, Table, Tag, Typography } from "antd";
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

interface EnvironmentalGoldTradingMiningReviewProps {
  application: any;
}

export const EnvironmentalGoldTradingMiningReview: React.FC<
  EnvironmentalGoldTradingMiningReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};
  const miningData = answers?.environmentalPermitData?.mining || {};
  const goldTradingData = miningData?.goldTrading || {};

  const {
    proposalDetails,
    siteDetails,
    infrastructure,
    impactsMitigation,
    attachments,
  } = goldTradingData;

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
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4" />
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
            value="MINING SECTOR - GOLD TRADING OPERATIONS"
          />
        </Block>

        {/* --- BLOCK 3: Proposal Details --- */}
        <Block title="3. Proposal Details" className={styles.fullWidth}>
          <Detail
            label="Category of Application:"
            value={proposalDetails?.category || "N/A"}
          />
          <Detail
            label="Project Description:"
            value={proposalDetails?.description || "N/A"}
          />
        </Block>

        {/* --- BLOCK 4: Project Site & Location --- */}
        <Block title="4. Project Site & Location" className={styles.fullWidth}>
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Location Information
            </Title>
            <Detail
              label="Region:"
              value={normalizeText(siteDetails?.location?.region) || "N/A"}
            />
            <Detail
              label="District:"
              value={normalizeText(siteDetails?.location?.district) || "N/A"}
            />
            <Detail
              label="City/Town:"
              value={siteDetails?.location?.city || "N/A"}
            />
            <Detail
              label="Address:"
              value={siteDetails?.location?.address || "N/A"}
            />
            <Detail
              label="Major Landmark:"
              value={siteDetails?.location?.majorLandmark}
            />
            <Detail label="Latitude:" value={siteDetails?.location?.latitude} />
            <Detail
              label="Longitude:"
              value={siteDetails?.location?.longitude}
            />{" "}
            {siteDetails?.location?.googleLocationLink && (
              <Detail
                label="GPS/Google Location Link:"
                value={
                  <a
                    href={siteDetails.location.googleLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteDetails.location.googleLocationLink}
                  </a>
                }
              />
            )}
          </div>

          {/* Adjacent Land Uses */}
          {siteDetails?.adjacentLandUses &&
            siteDetails.adjacentLandUses.length > 0 && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Adjacent Land Uses
                </Title>
                <div
                  style={{
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <Table
                    dataSource={siteDetails.adjacentLandUses}
                    columns={[
                      {
                        title: "Direction",
                        dataIndex: "direction",
                        key: "direction",
                        render: (direction: string) => (
                          <Tag color="blue">{direction}</Tag>
                        ),
                      },
                      {
                        title: "Description",
                        dataIndex: "description",
                        key: "description",
                      },
                      {
                        title: "Distance (m)",
                        dataIndex: "distance",
                        key: "distance",
                        render: (distance: number) => distance || "N/A",
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
            )}
        </Block>

        {/* --- BLOCK 5: Infrastructure & Utilities --- */}
        <Block
          title="5. Infrastructure & Utilities"
          className={styles.fullWidth}
        >
          <Detail
            label="Structures and Facilities:"
            value={infrastructure?.structures || "N/A"}
          />

          <div className="mb-4 mt-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Water Infrastructure
            </Title>

            {infrastructure?.processWater &&
              infrastructure.processWater.length > 0 && (
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
                      dataSource={infrastructure.processWater}
                      columns={[
                        {
                          title: "Source",
                          dataIndex: "source",
                          key: "source",
                          width: "30%",
                        },
                        {
                          title: "Volume Per Day",
                          dataIndex: "volumePerDay",
                          key: "volumePerDay",
                          width: "25%",
                        },
                        {
                          title: "Unit",
                          dataIndex: "unit",
                          key: "unit",
                          width: "15%",
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

            {infrastructure?.portableWater &&
              infrastructure.portableWater.length > 0 && (
                <div className="mb-4">
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    Portable Water Sources
                  </Title>
                  <div
                    style={{
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <Table
                      dataSource={infrastructure.portableWater}
                      columns={[
                        {
                          title: "Source",
                          dataIndex: "source",
                          key: "source",
                          width: "30%",
                        },
                        {
                          title: "Volume Per Day",
                          dataIndex: "volumePerDay",
                          key: "volumePerDay",
                          width: "25%",
                        },
                        {
                          title: "Unit",
                          dataIndex: "unit",
                          key: "unit",
                          width: "15%",
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

            {(!infrastructure?.processWater ||
              infrastructure.processWater.length === 0) &&
              (!infrastructure?.portableWater ||
                infrastructure.portableWater.length === 0) && (
                <Detail label="Water Sources:" value="N/A" />
              )}
          </div>

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Power Infrastructure
            </Title>
            <Detail
              label="Power Sources:"
              value={formatPowerSources(infrastructure?.power?.sources)}
            />
            {infrastructure?.power?.generatorCapacityKVA && (
              <Detail
                label="Generator Capacity:"
                value={`${infrastructure?.power?.generatorCapacityKVA} KVA`}
              />
            )}
            {infrastructure?.power?.solarCapacityKW && (
              <Detail
                label="Solar Capacity:"
                value={`${infrastructure?.power?.solarCapacityKW} KW`}
              />
            )}
            {infrastructure?.power?.dieselCapacityKW && (
              <Detail
                label="Diesel Capacity:"
                value={`${infrastructure?.power?.dieselCapacityKW} KW`}
              />
            )}
            {infrastructure?.power?.otherSourceDetails && (
              <Detail
                label="Other Source Details:"
                value={infrastructure?.power?.otherSourceDetails}
              />
            )}
            {infrastructure?.power?.customSourceCapacities &&
              Object.keys(infrastructure?.power?.customSourceCapacities)
                .length > 0 && (
                <div className="mt-3">
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    Custom Power Source Capacities
                  </Title>
                  {Object.entries(
                    infrastructure?.power?.customSourceCapacities
                  ).map(([sourceName, capacity]) => (
                    <Detail
                      key={sourceName}
                      label={`${sourceName} Capacity:`}
                      value={capacity}
                    />
                  ))}
                </div>
              )}
          </div>

          <Detail
            label="Other Utilities:"
            value={infrastructure?.otherUtilities || "N/A"}
          />
        </Block>

        {/* --- BLOCK 6: Environmental Impacts & Mitigation --- */}
        <Block
          title="6. Environmental Impacts & Mitigation"
          className={styles.fullWidth}
        >
          <div className="mb-6">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Impacts & Mitigation Measures
            </Title>

            {(() => {
              const pairs = impactsMitigation?.impactMeasurePairs || [];
              const hasData =
                pairs.length > 0 &&
                pairs.some(
                  (pair: any) => pair.impact?.trim() || pair.measures?.trim()
                );

              return hasData ? (
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
                  No impacts and mitigation measures documented
                </p>
              );
            })()}
          </div>
        </Block>

        {/* --- BLOCK 7: Stakeholder Consultation --- */}
        <Block title="7. Stakeholder Consultation" className={styles.fullWidth}>
          {impactsMitigation?.stakeholderConsultation?.consultationConducted !==
            undefined && (
            <Detail
              label="Consultation Conducted:"
              value={
                impactsMitigation.stakeholderConsultation.consultationConducted
                  ? "Yes"
                  : "No"
              }
            />
          )}
          {impactsMitigation?.stakeholderConsultation?.publicNoticeDate && (
            <Detail
              label="Public Notice Date:"
              value={formatDate(
                impactsMitigation.stakeholderConsultation.publicNoticeDate
              )}
            />
          )}

          {/* Stakeholders Table */}
          {impactsMitigation?.stakeholderConsultation?.stakeholders &&
            impactsMitigation.stakeholderConsultation.stakeholders.length >
              0 && (
              <div className="mt-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Stakeholders Consulted
                </Title>
                <div
                  style={{
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <Table
                    dataSource={
                      impactsMitigation.stakeholderConsultation.stakeholders
                    }
                    columns={[
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        width: "15%",
                      },
                      {
                        title: "Contact",
                        dataIndex: "contact",
                        key: "contact",
                        width: "12%",
                      },
                      {
                        title: "Location In Relation To Project Site",
                        dataIndex: "relationToProject",
                        key: "relationToProject",
                        width: "12%",
                      },
                      {
                        title: "Concerns",
                        dataIndex: "concerns",
                        key: "concerns",
                        width: "20%",
                      },
                      {
                        title: "Response Action",
                        dataIndex: "responseAction",
                        key: "responseAction",
                        width: "15%",
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
            )}

          {/* Evidence of Consultation Document */}
          {attachments?.evidenceOfConsultation && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Evidence of Stakeholder Consultation
              </Title>
              <div className="flex items-center space-x-2 mt-1 text-red-600">
                <FileTextOutlined />
                <span>
                  {attachments?.evidenceOfConsultation.name || "document"}{" "}
                  attached — refer to{" "}
                  <strong>Block 9 (Supporting Documents)</strong>
                </span>
              </div>
            </div>
          )}
        </Block>

        {/* --- BLOCK 7: Previous Permit Information --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block
            title="8. Previous Permit Information"
            className={styles.fullWidth}
          >
            {goldTradingData?.previousPermit ? (
              <div className="space-y-4">
                <Detail
                  label="Permit Number:"
                  value={goldTradingData.previousPermit.permitNumber || "N/A"}
                />
                <Detail
                  label="Issue Date:"
                  value={
                    goldTradingData.previousPermit.permitIssuedDate
                      ? formatDate(
                          goldTradingData.previousPermit.permitIssuedDate
                        )
                      : "N/A"
                  }
                />
                <Detail
                  label="Expiry Date:"
                  value={
                    goldTradingData.previousPermit.permitExpiryDate
                      ? formatDate(
                          goldTradingData.previousPermit.permitExpiryDate
                        )
                      : "N/A"
                  }
                />
                {goldTradingData.previousPermit.permitDocument && (
                  <div className="mt-4">
                    <label className="font-semibold text-gray-700 block mb-2">
                      Permit Document:
                    </label>
                    <span className="text-red-600">
                      Document attached — refer to{" "}
                      <strong>Block 9 (Supporting Documents)</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Detail label="Previous Permit Information:" value="N/A" />
            )}
          </Block>
        )}

        {/* --- BLOCK 10: Supporting Documents --- */}
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

export default EnvironmentalGoldTradingMiningReview;
