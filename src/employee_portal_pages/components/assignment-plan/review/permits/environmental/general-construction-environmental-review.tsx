import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Card, Typography } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import { FileTextOutlined } from "@ant-design/icons";
import {
  handleDocumentView,
  formatDate,
  normalizeText,
  formatDate4,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title, Text } = Typography;

interface GeneralConstructionEnvironmentalReviewProps {
  application: any;
}

export const GeneralConstructionEnvironmentalReview: React.FC<
  GeneralConstructionEnvironmentalReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const generalConstructionData =
    answers?.environmentalPermitData?.generalConstruction || {};
  const {
    projectOverview,
    siteDetails,
    infrastructure,
    projectSpecification,
    impactAssessment,
    wasteManagementPlan,
    compliance,
    attachments,
  } = generalConstructionData;

  // Helper function to render monitoring indicators
  const renderMonitoringIndicators = () => {
    if (!compliance?.monitoringPlan) return null;

    const plan = compliance?.monitoringPlan;
    const indicators = [];

    // Add predefined indicators
    const predefinedKeys = [
      { key: "airEmissions", label: "Air Emissions" },
      { key: "fireIncidence", label: "Fire Incidence" },
      { key: "liquidWaste", label: "Liquid Waste" },
      { key: "solidWasteManagement", label: "Solid Waste Management" },
      { key: "spillsLeaksWasteOil", label: "Spills and Leaks, Waste Oil" },
      { key: "vehicularAccidents", label: "Vehicular Accidents" },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key]) {
        indicators.push({
          id: key,
          indicator: label,
          recordKept: plan[key].recordKept,
          parametersMeasured: plan[key].parametersMeasured || "-",
          qtyMonitoredFrequency: plan[key].qtyMonitoredFrequency,
          disposalTreatmentMode: plan[key].disposalTreatmentMode,
        });
      }
    });

    // Add other indicators
    if (plan.otherIndicators && plan.otherIndicators.length > 0) {
      plan.otherIndicators.forEach((indicator: any) => {
        indicators.push(indicator);
      });
    }

    return indicators;
  };

  // Helper function to render training records
  const renderTrainingRecords = () => {
    if (!compliance?.trainingPlan) return null;

    const plan = compliance?.trainingPlan;
    const records = [];

    // Add predefined training records
    const predefinedKeys = [
      { key: "environmentalManagement", label: "Environmental Management" },
      { key: "fireManagement", label: "Fire Management" },
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health and Safety",
      },
      { key: "sops", label: "Standard Operating Procedures (SOPs)" },
      {
        key: "rawMaterialsAndProductHandling",
        label: "Raw Materials and Product Handling",
      },
      { key: "spillLeaksManagement", label: "Spill/Leaks Management" },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key] && plan[key].recordKept) {
        records.push({
          id: key,
          areaOfTraining: label,
          recordKept: plan[key].recordKept,
          dateOfTraining: plan[key].dateOfTraining,
          trainingDetails: plan[key].trainingDetails,
          supportingDocuments: plan[key].supportingDocuments || [],
        });
      }
    });

    // Add other trainings
    if (plan.otherTrainings && plan.otherTrainings.length > 0) {
      plan.otherTrainings.forEach((training: any) => {
        if (training.recordKept) {
          records.push(training);
        }
      });
    }

    return records;
  };

  const monitoringIndicators = renderMonitoringIndicators();
  const trainingRecords = renderTrainingRecords();

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
      <Title level={1} className="!text-2xl !font-bold !m-0">
        Permit Application Review
      </Title>
      <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4"></div>

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
          <Detail label="Permit Category:" value="GENERAL CONSTRUCTION" />
        </Block>

        {/* --- BLOCK 3: Project Overview --- */}
        <Block title="3. Project Overview" className={styles.fullWidth}>
          <Detail label="Project Title:" value={projectOverview?.title} />
          <Detail
            label="Project Description:"
            value={projectOverview?.description}
          />
          <Detail label="Project Scope:" value={projectOverview?.scope} />
        </Block>

        {/* --- BLOCK 4: Site Details --- */}
        <Block title="4. Site Details" className={styles.fullWidth}>
          <Detail
            label="Region:"
            value={normalizeText(siteDetails?.location?.region)}
          />
          <Detail
            label="District:"
            value={normalizeText(siteDetails?.location?.district)}
          />
          <Detail label="City:" value={siteDetails?.location?.city} />
          <Detail label="Address:" value={siteDetails?.location?.address} />
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
              label="Google Location Link:"
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
          {/* Adjacent Land Uses */}
          {siteDetails?.adjacentLandUses &&
            siteDetails.adjacentLandUses.length > 0 && (
              <div className="mb-4 mt-6 pt-6 border-t border-gray-200">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Adjacent Land Uses
                </Title>
                <Table
                  dataSource={siteDetails.adjacentLandUses}
                  columns={[
                    {
                      title: "Direction",
                      dataIndex: "direction",
                      key: "direction",
                      width: "15%",
                    },
                    {
                      title: "Description",
                      dataIndex: "description",
                      key: "description",
                      width: "60%",
                    },
                    {
                      title: "Distance (m)",
                      dataIndex: "distance",
                      key: "distance",
                      width: "25%",
                      render: (distance: number) => distance || "N/A",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                />
              </div>
            )}
          <Detail
            label="Predominant Land Use:"
            value={siteDetails?.predominantLandUse}
          />
          {/* Near Water Body */}
          <div className="mt-3">
            <Detail
              label="Near Water Body:"
              value={
                siteDetails?.nearWaterBody?.isNear ? (
                  <span>
                    <Tag color="blue">Yes</Tag>
                    {siteDetails.nearWaterBody.name && (
                      <span className="ml-2">
                        Name: {siteDetails.nearWaterBody.name} |
                      </span>
                    )}
                    {siteDetails.nearWaterBody.distance && (
                      <span className="ml-2">
                        Distance: {siteDetails.nearWaterBody.distance} metres
                      </span>
                    )}
                  </span>
                ) : (
                  <Tag color="default">No</Tag>
                )
              }
            />
          </div>
          {/* Near Sensitive Area */}
          <div className="mt-3">
            <Detail
              label="Near Environmental Sensitive Area:"
              value={
                siteDetails?.nearSensitiveArea?.isNear ? (
                  <span>
                    <Tag color="orange">Yes</Tag>
                    {siteDetails.nearSensitiveArea.name && (
                      <span className="ml-2">
                        Name: {siteDetails.nearSensitiveArea.name} |
                      </span>
                    )}
                    {siteDetails.nearSensitiveArea.distance && (
                      <span className="ml-2">
                        Distance: {siteDetails.nearSensitiveArea.distance}{" "}
                        metres
                      </span>
                    )}
                  </span>
                ) : (
                  <Tag color="default">No</Tag>
                )
              }
            />
          </div>
        </Block>

        {/* --- BLOCK 5: Project Specification or  Infrastructure & Utilities ---  */}
        {permitDetails?.applicationType === "renewal" ? (
          <Block title="5. Project Specification" className={styles.fullWidth}>
            <Detail
              label="Construction/Project Type:"
              value={projectSpecification?.projectType}
            />
            <Detail
              label="Description of the Activities undertaken:"
              value={projectSpecification?.activitiesDescription}
            />
            <Detail
              label="Capacity & Size:"
              value={projectSpecification?.capacityAndSize}
            />

            <Detail
              label="Specific equipment/facilities used in operations:"
              value={projectSpecification?.equipmentAndFacilities}
            />

            <Detail
              label="Land Take (acres)::"
              value={projectSpecification?.landTakeAcres}
            />

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Workforce
              </Title>
              <Detail
                label="Total Staff:"
                value={projectSpecification?.workforce?.total}
              />

              <Detail
                label="Total Staff:"
                value={projectSpecification?.workforce?.total}
              />
              <Detail
                label="Management:"
                value={projectSpecification?.workforce?.management}
              />
              <Detail
                label="Senior Staff:"
                value={projectSpecification?.workforce?.senior}
              />
              <Detail
                label="Junior Staff:"
                value={projectSpecification?.workforce?.junior}
              />
              <Detail
                label="Casual Workers:"
                value={projectSpecification?.workforce?.casuals}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Water Infrastructure
              </Title>
              <Detail
                label="Water Sources:"
                value={projectSpecification?.infrastructure?.water?.sources?.join(
                  ", "
                )}
              />
              <Detail
                label="Has Reservoir:"
                value={
                  projectSpecification?.infrastructure?.water?.storage
                    ?.hasReservoir
                    ? "Yes"
                    : "No"
                }
              />
              <Detail
                label="Reservoir Count:"
                value={
                  projectSpecification?.infrastructure?.water?.storage
                    ?.reservoirCount
                }
              />
              <Detail
                label="Reservoir Capacity (Litres):"
                value={
                  projectSpecification?.infrastructure?.water?.storage
                    ?.reservoirCapacityLitres
                }
              />
              <Detail
                label="Annual Water Consumption:"
                value={
                  projectSpecification?.infrastructure?.water?.annualConsumption
                }
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Power Infrastructure
              </Title>
              <Detail
                label="Power Sources:"
                value={projectSpecification?.infrastructure?.power?.sources?.join(
                  ", "
                )}
              />
              <Detail
                label="Generator Capacity (KVA):"
                value={
                  projectSpecification?.infrastructure?.power
                    ?.generatorCapacityKVA
                }
              />
              <Detail
                label="Solar Capacity (KW):"
                value={
                  projectSpecification?.infrastructure?.power?.solarCapacityKW
                }
              />
              <Detail
                label="Other Source Details:"
                value={
                  projectSpecification?.infrastructure?.power
                    ?.otherSourceDetails
                }
              />

              {/* Custom Source Capacities */}
              {projectSpecification?.infrastructure?.power
                ?.customSourceCapacities &&
                Object.keys(
                  projectSpecification?.infrastructure?.power
                    .customSourceCapacities
                ).length > 0 && (
                  <div className="mt-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Custom Power Source Capacities
                    </Title>
                    {Object.entries(
                      projectSpecification.infrastructure?.power
                        .customSourceCapacities
                    ).map(([sourceName, capacity]) => (
                      <Detail
                        key={sourceName}
                        label={`${sourceName} Capacity:`}
                        value={capacity}
                      />
                    ))}
                  </div>
                )}

              <Detail
                label="Annual Power Consumption (KWH):"
                value={
                  projectSpecification?.infrastructure?.power
                    ?.annualConsumptionKWH
                }
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Facilities
              </Title>
              <Detail
                label="Washrooms Available:"
                value={
                  projectSpecification?.infrastructure?.washrooms?.areAvailable
                    ? "Yes"
                    : "No"
                }
              />
              <Detail
                label="Separate Male/Female:"
                value={
                  projectSpecification?.infrastructure?.washrooms
                    ?.areSeparateForMaleFemale
                    ? "Yes"
                    : "No"
                }
              />
              <Detail
                label="Washroom Count:"
                value={projectSpecification?.infrastructure?.washrooms?.count}
              />
              <Detail
                label="Cleaning Frequency:"
                value={
                  projectSpecification?.infrastructure?.washrooms
                    ?.cleaningFrequency
                }
              />
              <Detail
                label="Access Road Type:"
                value={
                  projectSpecification?.infrastructure?.traffic?.accessRoadIs
                }
              />
              <Detail
                label="Parking Capacity:"
                value={
                  projectSpecification?.infrastructure?.traffic
                    ?.parkingLotCapacity
                }
              />
              <Detail
                label="Drainage System:"
                value={
                  projectSpecification?.infrastructure?.drainage?.hasSystem
                    ? "Yes"
                    : "No"
                }
              />
              <Detail
                label="Drainage Condition:"
                value={
                  projectSpecification?.infrastructure?.drainage?.condition
                }
              />
            </div>
          </Block>
        ) : (
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
                Object.keys(infrastructure.power.customSourceCapacities)
                  .length > 0 && (
                  <div className="mt-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Custom Power Source Capacities
                    </Title>
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
        )}

        {/* --- BLOCK 6: Impact Assessment (New Applications Only) --- */}
        {permitDetails?.applicationType !== "renewal" && (
          <Block
            title="6. Stakeholder Consultations"
            className={styles.fullWidth}
          >
            {impactAssessment ? (
              <div className="space-y-4">
                {/* Phase-Based Impacts & Mitigation Measures */}
                <div className="mb-6">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Impacts & Mitigation Measures by Phase
                  </Title>

                  {(
                    [
                      "constructionPhase",
                      "operationPhase",
                      "closurePhase",
                    ] as const
                  ).map((phase) => {
                    const phaseLabels: Record<string, string> = {
                      constructionPhase: "Construction Phase",
                      operationPhase: "Operation Phase",
                      closurePhase: "Closure/Decommissioning Phase",
                    };

                    const phaseData =
                      impactAssessment?.[phase as keyof any] || {};
                    const pairs = phaseData.impactMeasurePairs || [];
                    const hasData =
                      pairs.length > 0 &&
                      pairs.some(
                        (pair: any) =>
                          pair.impact?.trim() || pair.measures?.trim()
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
                            No impacts and mitigation measures documented for
                            this phase
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Stakeholder Consultations */}
                {impactAssessment?.stakeholders &&
                  impactAssessment?.stakeholders?.length > 0 && (
                    <div className="mt-4">
                      <Title
                        level={4}
                        className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                      >
                        Stakeholder Consultations
                      </Title>
                      <div
                        style={{
                          overflowX: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <Table
                          dataSource={impactAssessment?.stakeholders}
                          pagination={false}
                          size="small"
                          rowKey={(record: any, index) => record.id || index}
                          columns={[
                            {
                              title: "Name",
                              dataIndex: "name",
                              key: "name",
                              width: "20%",
                            },
                            {
                              title: "Contact",
                              dataIndex: "contact",
                              key: "contact",
                              width: "20%",
                            },
                            {
                              title: "Location In Relation To Project Site",
                              dataIndex: "relationToProject",
                              key: "relationToProject",
                              width: "25%",
                            },
                            {
                              title: "Concerns",
                              dataIndex: "concerns",
                              key: "concerns",
                              width: "35%",
                            },
                          ]}
                          scroll={{ x: "max-content" }}
                        />
                      </div>
                    </div>
                  )}

                {/* Evidence of Consultation Document */}
                {attachments?.evidenceOfConsultation && (
                  <div className="mt-4">
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
              </div>
            ) : (
              <Text type="secondary">No impact assessment data available</Text>
            )}
          </Block>
        )}

        {/* --- BLOCK 6: Impact Identification and Management (Renewal Applications Only) --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block
            title="6. Impact Identification and Management"
            className={styles.fullWidth}
          >
            {wasteManagementPlan ? (
              <div className="space-y-4">
                {/* Environmental Impacts Identification */}
                <div className="mb-6">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    6.1 Environmental Impacts Identification
                  </Title>
                  {wasteManagementPlan?.generalImpacts && (
                    <Table
                      dataSource={Object.entries(
                        wasteManagementPlan?.generalImpacts
                      )
                        .filter(
                          ([key, impact]: [string, any]) =>
                            impact && impact.ticked
                        )
                        .map(([key, impact]: [string, any]) => ({
                          key,
                          impactType:
                            key === "solidWaste"
                              ? "Solid Waste"
                              : key === "liquidWaste"
                              ? "Liquid Waste/Effluent Discharges"
                              : key === "airEmissions"
                              ? "Air Emissions"
                              : key === "soilContamination"
                              ? "Soil Contamination"
                              : key === "stormwaterRunoffs"
                              ? "Stormwater Runoffs"
                              : key === "other"
                              ? "Others"
                              : key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase()),
                          source: impact.source,
                          estimatedQty: impact.estimatedQty,
                          receivingMedium: impact.receivingMedium,
                        }))}
                      pagination={false}
                      size="small"
                      rowKey="key"
                      columns={[
                        {
                          title: "Impact Type",
                          dataIndex: "impactType",
                          key: "impactType",
                          width: "25%",
                        },
                        {
                          title: "Source",
                          dataIndex: "source",
                          key: "source",
                          width: "25%",
                        },
                        {
                          title: "Estimated Quantity",
                          dataIndex: "estimatedQty",
                          key: "estimatedQty",
                          width: "25%",
                        },
                        {
                          title: "Receiving Medium/Impact",
                          dataIndex: "receivingMedium",
                          key: "receivingMedium",
                          width: "25%",
                        },
                      ]}
                    />
                  )}
                </div>

                {/* Environmental Impacts Management */}
                <div className="mt-6">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    6.2 Environmental Impacts Management
                  </Title>

                  {wasteManagementPlan?.pollutionManagement && (
                    <div className="space-y-4">
                      {/* Pollution Category */}
                      {wasteManagementPlan?.pollutionManagement?.pollution && (
                        <div>
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            A. Pollution
                          </Title>
                          <Table
                            dataSource={Object.entries(
                              wasteManagementPlan?.pollutionManagement
                                ?.pollution
                            )
                              .filter(
                                ([key, item]: [string, any]) =>
                                  item && item.ticked
                              )
                              .map(([key, item]: [string, any]) => {
                                const displayName =
                                  key === "airEmissions"
                                    ? "Air Emissions (likely point sources)"
                                    : key === "soilContamination"
                                    ? "Soil Contamination"
                                    : key === "liquidWasteEffluent"
                                    ? "Liquid waste/Effluent Discharges"
                                    : key === "surfaceWaterQuality"
                                    ? "Surface water Quality"
                                    : key === "ambientNoiseVibration"
                                    ? "Ambient Noise/Vibration"
                                    : key === "other"
                                    ? "Others (e.g., Thermal, Visual and Light pollutions etc.)"
                                    : key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                return {
                                  key,
                                  impactType: displayName,
                                  managementPractices:
                                    item.managementPractices || "N/A",
                                };
                              })}
                            columns={[
                              {
                                title: "Impact Type",
                                dataIndex: "impactType",
                                key: "impactType",
                                width: "35%",
                              },
                              {
                                title: "Management Practices",
                                dataIndex: "managementPractices",
                                key: "managementPractices",
                                width: "65%",
                              },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                          />
                        </div>
                      )}

                      {/* Waste Category */}
                      {wasteManagementPlan?.pollutionManagement?.waste && (
                        <div>
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            B. Waste
                          </Title>
                          <Table
                            dataSource={Object.entries(
                              wasteManagementPlan?.pollutionManagement?.waste
                            )
                              .filter(
                                ([key, item]: [string, any]) =>
                                  item && item.ticked
                              )
                              .map(([key, item]: [string, any]) => {
                                const displayName =
                                  key === "liquidWaste"
                                    ? "Liquid Waste"
                                    : key === "solidWaste"
                                    ? "Solid waste"
                                    : key === "hazardousWaste"
                                    ? "Hazardous Waste e.g. Electrical bulbs, car batteries, dry cells, etc."
                                    : key === "plasticWaste"
                                    ? "Plastic Waste"
                                    : key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                return {
                                  key,
                                  impactType: displayName,
                                  managementPractices:
                                    item.managementPractices || "N/A",
                                };
                              })}
                            columns={[
                              {
                                title: "Waste Type",
                                dataIndex: "impactType",
                                key: "impactType",
                                width: "35%",
                              },
                              {
                                title: "Management Practices",
                                dataIndex: "managementPractices",
                                key: "managementPractices",
                                width: "65%",
                              },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                          />
                        </div>
                      )}

                      {/* Additional Categories */}
                      {wasteManagementPlan?.pollutionManagement?.additional && (
                        <div>
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            C. Additional
                          </Title>
                          <Table
                            dataSource={Object.entries(
                              wasteManagementPlan?.pollutionManagement
                                ?.additional
                            )
                              .filter(
                                ([key, item]: [string, any]) =>
                                  item && item.ticked
                              )
                              .map(([key, item]: [string, any]) => {
                                const displayName =
                                  key === "traffic"
                                    ? "Traffic (e.g., congestions, on-street parking, accidents, etc.)"
                                    : key === "occupationalHealthSafety"
                                    ? "Others: e.g. (occupational health and Safety (State):"
                                    : key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                return {
                                  key,
                                  impactType: displayName,
                                  managementPractices:
                                    item.managementPractices || "N/A",
                                };
                              })}
                            columns={[
                              {
                                title: "Impact Type",
                                dataIndex: "impactType",
                                key: "impactType",
                                width: "35%",
                              },
                              {
                                title: "Management Practices",
                                dataIndex: "managementPractices",
                                key: "managementPractices",
                                width: "65%",
                              },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Text type="secondary">
                No waste management plan data available
              </Text>
            )}
          </Block>
        )}

        {/* --- BLOCK 7: Policies & Compliance --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="7. Policies & Compliance" className={styles.fullWidth}>
            <div className="space-y-4">
              {/* Legislative Compliance */}
              {compliance?.legislativeCompliance && (
                <div className="mb-6 mt-6 pt-6 border-t border-gray-200">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    7.1 Legislative Compliance
                  </Title>

                  {compliance?.legislativeCompliance.nationalPolicies &&
                    compliance?.legislativeCompliance.nationalPolicies.length >
                      0 && (
                      <div className="mb-3">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          National Policies
                        </Title>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          {compliance?.legislativeCompliance.nationalPolicies.map(
                            (policy: any, index: number) => (
                              <li
                                key={policy.id || index}
                                className="text-gray-700"
                              >
                                {policy.name}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}

                  {compliance?.legislativeCompliance.nationalActs &&
                    compliance?.legislativeCompliance.nationalActs.length >
                      0 && (
                      <div className="mb-3">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          National Acts
                        </Title>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          {compliance?.legislativeCompliance.nationalActs.map(
                            (act: any, index: number) => (
                              <li
                                key={act.id || index}
                                className="text-gray-700"
                              >
                                {act.name}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}

                  {compliance?.legislativeCompliance.nationalRegulations &&
                    compliance?.legislativeCompliance.nationalRegulations
                      .length > 0 && (
                      <div className="mb-3">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          National Regulations
                        </Title>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          {compliance?.legislativeCompliance.nationalRegulations.map(
                            (regulation: any, index: number) => (
                              <li
                                key={regulation.id || index}
                                className="text-gray-700"
                              >
                                {regulation.name}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}

                  {compliance?.legislativeCompliance.standardsAndGuidelines &&
                    compliance?.legislativeCompliance.standardsAndGuidelines
                      .length > 0 && (
                      <div className="mb-3">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Standards and Guidelines
                        </Title>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          {compliance?.legislativeCompliance.standardsAndGuidelines.map(
                            (standard: any, index: number) => (
                              <li
                                key={standard.id || index}
                                className="text-gray-700"
                              >
                                {standard.name}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}
                </div>
              )}

              {/* Other Permits/Licenses/Certificates */}
              {compliance?.otherPermits && (
                <div className="mb-6">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    7.2 Permits / Licenses / Certificates
                  </Title>
                  <div className="space-y-2">
                    {Object.entries(compliance?.otherPermits).map(
                      ([key, permit]: [string, any]) => {
                        const displayName =
                          key === "environmentalPermit"
                            ? "Environmental Permit"
                            : key === "firePermit"
                            ? "GNFS Fire Permit/Certificate"
                            : key === "businessRegistration"
                            ? "Business/Company Registration Certificate"
                            : key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase());
                        return (
                          <Card
                            key={key}
                            size="small"
                            className="border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{displayName}</span>
                              <Tag color={permit.hasPermit ? "green" : "red"}>
                                {permit.hasPermit
                                  ? "Available"
                                  : "Not Available"}
                              </Tag>
                            </div>
                            {permit.hasPermit && (
                              <>
                                {permit.permitNumber && (
                                  <Detail
                                    label="Permit Number:"
                                    value={permit.permitNumber}
                                  />
                                )}
                                {permit.issueDate && (
                                  <Detail
                                    label="Issue Date:"
                                    value={formatDate(permit.issueDate)}
                                  />
                                )}
                                {permit.expiryDate && (
                                  <Detail
                                    label="Expiry Date:"
                                    value={formatDate(permit.expiryDate)}
                                  />
                                )}
                                {permit.supportingDocument && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <FileTextOutlined />
                                    <Text className="text-red-600">
                                      Permit document attached — refer to{" "}
                                      <strong>
                                        Block 7 (Supporting Documents)
                                      </strong>
                                    </Text>
                                  </div>
                                )}
                              </>
                            )}
                            {!permit.hasPermit &&
                              permit.reasonIfNotAvailable && (
                                <Detail
                                  label="Reason:"
                                  value={permit.reasonIfNotAvailable}
                                />
                              )}
                          </Card>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Company Policies */}
              {compliance?.companyPolicies && (
                <div className="mb-6">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800 mt-6 pt-6 border-t border-gray-200"
                  >
                    7.3 Company Policies
                  </Title>

                  {compliance?.companyPolicies.environmental && (
                    <div className="mb-3">
                      <Title
                        level={5}
                        className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                      >
                        Environmental Policy
                      </Title>
                      <Detail
                        label="Statement:"
                        value={
                          compliance?.companyPolicies.environmental.statement
                        }
                      />
                      <Detail
                        label="Objective:"
                        value={
                          compliance?.companyPolicies.environmental.objective
                        }
                      />
                      <Detail
                        label="Target Strategy:"
                        value={
                          compliance?.companyPolicies.environmental
                            .targetStrategy
                        }
                      />
                      {compliance?.companyPolicies.environmental.policyDoc && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Text className="text-red-600">
                            Environmental policy document attached — refer to{" "}
                            <strong>Block 8 (Supporting Documents)</strong>
                          </Text>
                        </div>
                      )}
                    </div>
                  )}

                  {compliance?.companyPolicies.ohs && (
                    <div className="mb-3">
                      <Title
                        level={5}
                        className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                      >
                        Occupational Health & Safety Policy
                      </Title>
                      <Detail
                        label="Statement:"
                        value={compliance?.companyPolicies.ohs.statement}
                      />
                      <Detail
                        label="Objective:"
                        value={compliance?.companyPolicies.ohs.objective}
                      />
                      <Detail
                        label="Target Strategy:"
                        value={compliance?.companyPolicies.ohs.targetStrategy}
                      />
                      {compliance?.companyPolicies.ohs.policyDoc && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Text className="text-red-600">
                            OHS policy document attached — refer to{" "}
                            <strong>Block 8 (Supporting Documents)</strong>
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Monitoring Plan - Only for renewal applications */}
              {permitDetails?.applicationType === "renewal" &&
                monitoringIndicators &&
                monitoringIndicators.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      8.4 Environmental Monitoring Plan
                    </Title>
                    <Table
                      dataSource={monitoringIndicators}
                      pagination={false}
                      size="small"
                      rowKey={(record: any, index) => record.id || index}
                      columns={[
                        {
                          title: "Indicator",
                          dataIndex: "indicator",
                          key: "indicator",
                          width: "20%",
                        },
                        {
                          title: "Record Kept",
                          dataIndex: "recordKept",
                          key: "recordKept",
                          width: "15%",
                          render: (value: boolean) =>
                            value === undefined ? "-" : value ? "Yes" : "No",
                        },
                        {
                          title: "Parameters Measured",
                          dataIndex: "parametersMeasured",
                          key: "parametersMeasured",
                          width: "25%",
                        },
                        {
                          title: "Monitoring Frequency",
                          dataIndex: "qtyMonitoredFrequency",
                          key: "qtyMonitoredFrequency",
                          width: "20%",
                        },
                        {
                          title: "Disposal/Treatment Mode",
                          dataIndex: "disposalTreatmentMode",
                          key: "disposalTreatmentMode",
                          width: "20%",
                        },
                      ]}
                    />
                  </div>
                )}

              {/* Training Plan - Only for renewal applications */}
              {permitDetails?.applicationType === "renewal" &&
                trainingRecords &&
                trainingRecords.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      8.5 Training Plan
                    </Title>
                    <Table
                      dataSource={trainingRecords}
                      pagination={false}
                      size="small"
                      rowKey={(record: any, index) => record.id || index}
                      columns={[
                        {
                          title: "Training Area",
                          dataIndex: "areaOfTraining",
                          key: "areaOfTraining",
                          width: "20%",
                        },
                        {
                          title: "Record Kept",
                          dataIndex: "recordKept",
                          key: "recordKept",
                          width: "15%",
                          render: (value: boolean) =>
                            value === undefined ? "-" : value ? "Yes" : "No",
                        },
                        {
                          title: "Date of Training",
                          dataIndex: "dateOfTraining",
                          key: "dateOfTraining",
                          width: "15%",
                          render: (date: string) =>
                            date ? formatDate(date) : "-",
                        },
                        {
                          title: "Training Details",
                          dataIndex: "trainingDetails",
                          key: "trainingDetails",
                          width: "35%",
                        },
                        // {
                        //   title: "Supporting Documents",
                        //   key: "supportingDocuments",
                        //   width: "15%",
                        //   render: (record: any) =>
                        //     record.supportingDocuments &&
                        //     record.supportingDocuments.length > 0
                        //       ? `${record.supportingDocuments.length} file(s)`
                        //       : "None",
                        // },
                      ]}
                    />
                  </div>
                )}

              {/* CSR Activities */}
              {compliance?.csrActivities && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Corporate Social Responsibility
                  </Title>
                  <Detail
                    label="CSR Activities:"
                    value={compliance?.csrActivities}
                  />
                </div>
              )}

              {/* CSR Activities */}
              {compliance?.csrActivities && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Corporate Social Responsibility
                  </Title>
                  <Detail
                    label="CSR Activities:"
                    value={compliance?.csrActivities}
                  />
                </div>
              )}

              {/* Complaint Management - Only for renewal applications */}
              {/* Complaint Management - Only for renewal applications */}
              {permitDetails?.applicationType === "renewal" &&
                compliance?.complaintManagement && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Complaints/Complaint Management
                    </Title>
                    <Detail
                      label="Has Complaint Register:"
                      value={
                        compliance?.complaintManagement.hasRegister
                          ? "Yes"
                          : "No"
                      }
                    />
                    {compliance?.complaintManagement.hasRegister &&
                      compliance?.complaintManagement.registerEvidence && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Text className="text-red-600">
                            Register evidence attached — refer to{" "}
                            <strong>Block 8 (Supporting Documents)</strong>
                          </Text>
                        </div>
                      )}
                    <Detail
                      label="Has Complaint Procedure:"
                      value={
                        compliance?.complaintManagement.hasProcedure
                          ? "Yes"
                          : "No"
                      }
                    />
                    {compliance?.complaintManagement.hasProcedure &&
                      compliance?.complaintManagement.procedureEvidence && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Text className="text-red-600">
                            Procedure evidence attached — refer to{" "}
                            <strong>Block 8 (Supporting Documents)</strong>
                          </Text>
                        </div>
                      )}
                    {compliance?.complaintManagement.receivedComplaints !==
                      undefined && (
                      <>
                        <Detail
                          label="Received Complaints in Last Year:"
                          value={
                            compliance?.complaintManagement.receivedComplaints
                              ? "Yes"
                              : "No"
                          }
                        />
                        {compliance?.complaintManagement.receivedComplaints && (
                          <>
                            <Detail
                              label="Number of Complaints:"
                              value={
                                compliance?.complaintManagement
                                  .numberOfComplaints
                              }
                            />
                            <Detail
                              label="Nature of Complaints:"
                              value={
                                compliance?.complaintManagement
                                  .natureOfComplaints
                              }
                            />
                            <Detail
                              label="How Dealt With Complaints:"
                              value={
                                compliance?.complaintManagement
                                  .howDealtWithComplaints
                              }
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

              {/* Challenges - Only for renewal applications */}
              {permitDetails?.applicationType === "renewal" &&
                compliance?.challenges && (
                  <div>
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Challenges/Concerns
                    </Title>
                    <Detail
                      label="Major Environmental Challenges:"
                      value={compliance?.challenges}
                    />
                  </div>
                )}

              {/* Enhancement Measures - Only for renewal applications */}
              {permitDetails.applicationType === "renewal" &&
                compliance?.enhancementMeasures &&
                compliance?.enhancementMeasures.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Enhancement Measures
                    </Title>
                    <Table
                      dataSource={compliance?.enhancementMeasures}
                      pagination={false}
                      size="small"
                      rowKey={(record: any, index) => record.id || index}
                      columns={[
                        {
                          title: "No.",
                          key: "index",
                          width: "10%",
                          render: (text: any, record: any, index: number) =>
                            index + 1,
                        },
                        {
                          title: "Improvement Measures",
                          dataIndex: "improvementMeasure",
                          key: "improvementMeasure",
                          width: "45%",
                        },
                        {
                          title: "Timelines for Implementation",
                          dataIndex: "timeline",
                          key: "timeline",
                          width: "25%",
                        },
                        {
                          title: "Budget (GHC)",
                          dataIndex: "budget",
                          key: "budget",
                          width: "20%",
                        },
                      ]}
                    />
                  </div>
                )}
            </div>
          </Block>
        )}

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

export default GeneralConstructionEnvironmentalReview;
