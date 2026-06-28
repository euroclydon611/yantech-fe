import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Typography } from "antd";
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
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";

const { Title } = Typography;

const UNDERTAKING_LABELS: Record<string, string> = {
  agric_related_plantations: "Agric related plantations",
  community_pastures: "Community pastures",
  fruit_vegetable_farms: "Fruit and other vegetable farms",
  crop_farming: "Crop farming",
  irrigation_schemes: "Irrigation schemes",
  poultry_undertakings: "Poultry undertakings",
  livestock_undertakings: "Livestock undertakings",
};
interface EnvironmentalAgriculturalProjectsEA1ReviewProps {
  application: any;
}

export const EnvironmentalAgriculturalProjectsEA1Review: React.FC<
  EnvironmentalAgriculturalProjectsEA1ReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const agriculturalProjectsData =
    answers?.environmentalPermitData?.agriculturalProjects || {};

  const {
    proposalDetails,
    siteDetails,
    infrastructure,
    impactsMitigation,
    attachments,
  } = agriculturalProjectsData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to format power sources
  const formatPowerSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  // Helper function to format water sources
  const formatWaterSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  const undertaking = agriculturalProjectsData?.undertaking || null;

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
          <Detail
            label="Permit Category:"
            value={
              permitDetails.permitCategory === "natural_resources"
                ? "NATURAL RESOURCES"
                : "AGRICULTURAL PROJECTS"
            }
          />
          <Detail
            label="Type of Undertaking:"
            value={UNDERTAKING_LABELS[undertaking] || undertaking || "N/A"}
          />
        </Block>

        {/* --- BLOCK 3: Proposal Details --- */}
        <Block title="3. Proposal Details" className={styles.fullWidth}>
          <Detail
            label="Project Title:"
            value={proposalDetails?.title || "N/A"}
          />
          <Detail
            label="Project Description:"
            value={proposalDetails?.description || "N/A"}
          />
          <Detail
            label="Project Scope:"
            value={proposalDetails?.scope || "N/A"}
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
                label="Google Location Link/GPS:"
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

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Land Use Information
            </Title>
            <Detail
              label="Predominant Land Use:"
              value={siteDetails?.predominantLandUse || "N/A"}
            />
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

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Proximity to Water Body
            </Title>
            <Detail
              label="Near Water Body:"
              value={siteDetails?.nearWaterBody?.isNear ? "Yes" : "No"}
            />
            {siteDetails?.nearWaterBody?.isNear && (
              <>
                <Detail
                  label="Water Body Name:"
                  value={siteDetails?.nearWaterBody?.name || "N/A"}
                />
                <Detail
                  label="Distance to Water Body:"
                  value={
                    siteDetails?.nearWaterBody?.distance
                      ? `${siteDetails.nearWaterBody.distance} meters`
                      : "N/A"
                  }
                />
              </>
            )}
          </div>

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Proximity to Sensitive Areas
            </Title>
            <Detail
              label="Near Sensitive Area:"
              value={siteDetails?.nearSensitiveArea?.isNear ? "Yes" : "No"}
            />
            {siteDetails?.nearSensitiveArea?.isNear && (
              <>
                <Detail
                  label="Sensitive Area Type:"
                  value={siteDetails?.nearSensitiveArea?.name || "N/A"}
                />
                <Detail
                  label="Distance to Sensitive Area:"
                  value={
                    siteDetails?.nearSensitiveArea?.distance
                      ? `${siteDetails.nearSensitiveArea.distance} meters`
                      : "N/A"
                  }
                />
              </>
            )}
          </div>
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

            <Detail
              label="Water Sources:"
              value={formatWaterSources(infrastructure?.water?.sources)}
            />

            {/* <Detail
              label="Total Annual Consumption:"
              value={`${infrastructure?.water?.annualConsumption || "N/A"} `}
            /> */}
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
            {/* Custom Source Capacities */}
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
                    infrastructure?.power?.customSourceCapacities || {}
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
            label="Draining Provision:"
            value={infrastructure?.drainingProvision || "N/A"}
          />
          <Detail
            label="Access Road:"
            value={infrastructure?.accessRoad || "N/A"}
          />
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

              const phaseData = impactsMitigation?.[phase as keyof any] || {};
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
        </Block>

        {/* --- BLOCK 7: Stakeholder Consultation --- */}
        <Block title="7. Stakeholder Consultation" className={styles.fullWidth}>
          {impactsMitigation?.stakeholderConsultation?.consultationConducted !==
            undefined && (
            <Detail
              label="Consultation Conducted:"
              value={
                impactsMitigation?.stakeholderConsultation
                  ?.consultationConducted
                  ? "Yes"
                  : "No"
              }
            />
          )}
          {impactsMitigation?.stakeholderConsultation?.publicNoticeDate && (
            <Detail
              label="Public Notice Date:"
              value={formatDate(
                impactsMitigation?.stakeholderConsultation?.publicNoticeDate
              )}
            />
          )}

          {/* Stakeholders Table */}
          {impactsMitigation?.stakeholderConsultation?.stakeholders &&
            impactsMitigation?.stakeholderConsultation?.stakeholders.length >
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
                      impactsMitigation?.stakeholderConsultation
                        ?.stakeholders || []
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

          {/* Evidence of Consultation */}
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
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            </div>
          )}
        </Block>

        {/* --- BLOCK 8: Supporting Documents --- */}
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

export default EnvironmentalAgriculturalProjectsEA1Review;
