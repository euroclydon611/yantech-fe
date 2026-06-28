import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Table, Tag, List, Card, Button, Alert } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate4,
  formatLabel,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface EnvironmentalOtherPetroleumReviewProps {
  application: any;
}

export const EnvironmentalOtherPetroleumReview: React.FC<
  EnvironmentalOtherPetroleumReviewProps
> = ({ application }) => {
  const { clientId, submittedByAgent, answers } = application;

  const { permitDetails } = answers || {};

  const energyData = answers?.environmentalPermitData?.energy || {};
  const activityData = energyData?.other_petroleum_activity || {};

  const {
    proposalDetails,
    siteDetails,
    infrastructure,
    impactsMitigation,
    attachments,
  } = activityData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to format water sources
  const formatWaterSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  // Helper function to format power sources
  const formatPowerSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return "N/A";
    return sources.join(", ");
  };

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>Permit Application Review</h2>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block title="1. Applicant Information">
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
            value={`${clientId?.firstName} ${clientId?.lastName}`}
          />
          <Detail label="Email:" value={clientId?.email} />
          <Detail label="Telephone:" value={clientId?.phone} />
          <Detail label="Fax:" value={clientId?.fax} />

          {submittedByAgent && (
            <div className="mt-10">
              <h1 className="font-bold mb-2">Agent Information</h1>
              <hr className="bg--600 mb-2" />
              <Detail label="Agent ID:" value={submittedByAgent?.clientId} />
              <Detail
                label="Name:"
                value={`${submittedByAgent?.firstName} ${submittedByAgent?.lastName}`}
              />
              <Detail label="Email:" value={submittedByAgent?.email} />
              <Detail label="Telephone:" value={submittedByAgent?.phone} />
            </div>
          )}
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
            value="ENERGY SECTOR - OTHER PETROLEUM ACTIVITIES"
          />
          <Detail
            label="Operation Type:"
            value={normalizeText(energyData?.operationType?.toUpperCase())}
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
            <h4 className="font-semibold mb-2">Location Information</h4>
            <Detail
              label="Region:"
              value={siteDetails?.location?.region || "N/A"}
            />
            <Detail
              label="District:"
              value={siteDetails?.location?.district || "N/A"}
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
            <Detail
              label="Google Location Link:"
              value={
                siteDetails?.location?.googleLocationLink ? (
                  <a
                    href={siteDetails?.location?.googleLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                ) : (
                  "N/A"
                )
              }
            />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Land Use Information</h4>
            <Detail
              label="Predominant Land Use:"
              value={siteDetails?.predominantLandUse || "N/A"}
            />
          </div>

          {/* Adjacent Land Uses */}
          {siteDetails?.adjacentLandUses &&
            siteDetails?.adjacentLandUses?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Adjacent Land Uses</h4>
                <Table
                  dataSource={siteDetails?.adjacentLandUses}
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
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                />
              </div>
            )}

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Proximity to Sensitive Areas</h4>
            <Detail
              label="Near Sensitive Area:"
              value={siteDetails?.nearSensitiveArea?.isNear ? "Yes" : "No"}
            />
            {siteDetails?.nearSensitiveArea?.isNear && (
              <>
                <Detail
                  label="Sensitive Area Type:"
                  value={siteDetails?.nearSensitiveArea?.type || "N/A"}
                />
                <Detail
                  label="Distance to Sensitive Area:"
                  value={
                    siteDetails?.nearSensitiveArea?.distance
                      ? `${siteDetails?.nearSensitiveArea?.distance} meters`
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
            <h4 className="font-semibold mb-2">Water Infrastructure</h4>
            <Detail
              label="Water Sources:"
              value={formatWaterSources(infrastructure?.water?.sources)}
            />
            <Detail
              label="Annual Water Consumption:"
              value={infrastructure?.water?.annualConsumption || "N/A"}
            />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Power Infrastructure</h4>
            <Detail
              label="Power Sources:"
              value={formatPowerSources(infrastructure?.power?.sources)}
            />
            {infrastructure?.power?.generatorCapacityKVA && (
              <Detail
                label="Generator Capacity:"
                value={`${infrastructure.power.generatorCapacityKVA} KVA`}
              />
            )}
            {infrastructure?.power?.solarCapacityKW && (
              <Detail
                label="Solar Capacity:"
                value={`${infrastructure.power.solarCapacityKW} KW`}
              />
            )}

            {/* Custom Source Capacities */}
            {infrastructure?.power?.customSourceCapacities &&
              Object.keys(infrastructure.power.customSourceCapacities).length >
                0 && (
                <div className="mt-3">
                  <h5 className="font-semibold text-gray-700 mb-2">
                    Custom Power Source Capacities
                  </h5>
                  {Object.entries(
                    infrastructure.power.customSourceCapacities
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
            <h4 className="font-semibold mb-4">
              Impacts & Mitigation Measures by Phase
            </h4>

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
                  <h5 className="font-semibold text-gray-700 mb-3">
                    {phaseLabels[phase]}
                  </h5>

                  {hasData ? (
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
                    />
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
          {/* Stakeholders Table */}
          {impactsMitigation?.stakeholderConsultation?.stakeholders &&
            impactsMitigation.stakeholderConsultation.stakeholders.length >
              0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Stakeholders Consulted</h4>
                <Table
                  dataSource={
                    impactsMitigation.stakeholderConsultation.stakeholders
                  }
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Contact",
                      dataIndex: "contact",
                      key: "contact",
                    },
                    {
                      title: "Relation to Project",
                      dataIndex: "relationToProject",
                      key: "relationToProject",
                    },
                    {
                      title: "Concerns",
                      dataIndex: "concerns",
                      key: "concerns",
                    },
                    {
                      title: "Response Action",
                      dataIndex: "responseAction",
                      key: "responseAction",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                  scroll={{ x: 1000 }}
                />
              </div>
            )}
        </Block>

        {/* --- BLOCK 8: Supporting Documents --- */}
        <Block title="8. Supporting Documents" className={styles.fullWidth}>
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

export default EnvironmentalOtherPetroleumReview;
