import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Table, Tag, Card } from "antd";
import { Block, Detail } from "../../../../review/helpers";
import {
  formatDate,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title, Text } = Typography;

interface EnvironmentalLPGReviewProps {
  application: any;
}

const EnvironmentalLPGPreview: React.FC<EnvironmentalLPGReviewProps> = ({
  application,
}) => {
  const { answers } = application;

  const permitDetails = answers?.permitDetails || {};

  const lpgData = answers?.environmentalPermitData?.energy || {};

  const {
    projectOverview,
    siteDetails,
    projectSpecification,
    infrastructure,
    impactAssessment,
    wasteManagementPlan,
    complianceAndManagement,
    attachments,
  } = lpgData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to get LPG facility type label
  const getLPGFacilityTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      lpg_refilling_station: "LPG Refilling Station",
      lpg_exchange_point: "LPG Exchange Point",
      lpg_distribution_point: "LPG Distribution Point",
      cylinder_bottling_plant: "Cylinder Bottling Plant",
    };
    return typeMap[type] || type;
  };

  // Helper function to get undertaking type from subType
  const getUndertakingTypeFromSubType = (subType: string) => {
    const typeMap: Record<string, string> = {
      lpg_refilling_station: "LPG Refilling Station",
      lpg_exchange_point: "LPG Exchange Point",
      lpg_distribution_point: "LPG Distribution Point",
    };
    return typeMap[subType] || "";
  };

  const preselectedUndertakingType = getUndertakingTypeFromSubType(
    lpgData?.subType
  );

  // Helper function to render monitoring indicators
  const renderMonitoringIndicators = () => {
    if (!complianceAndManagement?.monitoringPlan) return null;

    const plan = complianceAndManagement.monitoringPlan;
    const indicators = [];

    // Add predefined indicators
    const predefinedKeys = [
      { key: "airEmissions", label: "Air Emissions" },
      { key: "vehicularAccidents", label: "Vehicular Accidents" },
      { key: "solidWasteDisposal", label: "Disposal of Solid Waste" },
      { key: "leaksAndSpills", label: "Leaks and Spills" },
      { key: "fireIncidence", label: "Fire Incidence" },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key]) {
        indicators.push({
          id: key,
          indicator: label,
          recordKept: plan[key].recordKept,
          parametersMeasured: plan[key].parametersMeasured,
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
    if (!complianceAndManagement?.trainingPlan) return null;

    const plan = complianceAndManagement.trainingPlan;
    const records = [];

    // Add predefined training records
    const predefinedKeys = [
      { key: "environmentalManagement", label: "Environmental Management" },
      { key: "fireManagement", label: "Fire Management" },
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health and Safety",
      },
      { key: "productHandling", label: "Product Handling" },
      { key: "spillLeaksManagement", label: "Spill/Leaks Management" },
      { key: "sops", label: "Standard Operating Procedures (SOPs)" },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key]) {
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
        records.push(training);
      });
    }

    return records;
  };

  const monitoringIndicators = renderMonitoringIndicators();
  const trainingRecords = renderTrainingRecords();

  return (
    <div className={styles.reviewPage}>
      <div className="mb-8">
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
          <Detail label="Permit Category:" value="ENERGY SECTOR - LPG" />
          <Detail
            label="Facility Type:"
            value={getLPGFacilityTypeLabel(lpgData?.subType)}
          />
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
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Location Information
            </Title>
            <Detail
              label="Region:"
              value={normalizeText(siteDetails?.location?.region)}
            />
            <Detail
              label="District:"
              value={normalizeText(siteDetails?.location?.district)}
            />
            <Detail label="City/Town:" value={siteDetails?.location?.city} />
            <Detail label="Address:" value={siteDetails?.location?.address} />
            <Detail
              label="Major Landmark:"
              value={siteDetails?.location?.majorLandmark}
            />
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
            label="Predominant Land Use of the Area:"
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

        {/* --- BLOCK 5: Facility Specification --- */}
        <Block title="5. Facility Specification" className={styles.fullWidth}>
          <Detail
            label="Facility Type:"
            value={getLPGFacilityTypeLabel(lpgData?.subType)}
          />
          <Detail
            label="Parent LPG Marketing Company:"
            value={projectSpecification?.parentLpgMcName}
          />
          <Detail
            label="Land Take (Acres):"
            value={projectSpecification?.landTakeAcres}
          />

          {/* LPG Storage Tanks - Only for Refilling Station and Distribution Point */}
          {(preselectedUndertakingType === "LPG Refilling Station" ||
            preselectedUndertakingType === "LPG Distribution Point") &&
            projectSpecification?.storageTanks?.installedTanks &&
            projectSpecification.storageTanks.installedTanks.length > 0 && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  LPG Storage Tanks
                </Title>
                <Table
                  dataSource={projectSpecification.storageTanks.installedTanks}
                  columns={[
                    {
                      title: "Tank No.",
                      dataIndex: "tankNo",
                      key: "tankNo",
                      width: "10%",
                    },
                    {
                      title: "Capacity (Tons)",
                      dataIndex: "capacityTons",
                      key: "capacityTons",
                      width: "15%",
                    },
                    {
                      title: "Year of Installation",
                      dataIndex: "yearOfInstallation",
                      key: "yearOfInstallation",
                      width: "15%",
                    },
                    {
                      title: "Year of Replacement",
                      dataIndex: "yearOfReplacement",
                      key: "yearOfReplacement",
                      width: "15%",
                      render: (year: number) => year || "N/A",
                    },
                    {
                      title: "Pressure Test Evidence",
                      dataIndex: "pressureTestEvidenceDoc",
                      key: "pressureTestEvidenceDoc",
                      width: "45%",
                      render: (pressureTestEvidenceDoc: any) => {
                        if (!pressureTestEvidenceDoc) {
                          return (
                            <Text type="secondary">No document attached</Text>
                          );
                        }
                        return (
                          <div className="flex flex-col gap-2">
                            <Text className="text-red-600">
                              {pressureTestEvidenceDoc?.name ||
                                "Pressure Test Evidence"}{" "}
                              attached — refer to <strong>Block 9</strong>
                            </Text>
                          </div>
                        );
                      },
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                />
              </div>
            )}

          {/* Tank Placement - Only for Refilling Station and Distribution Point */}
          {(preselectedUndertakingType === "LPG Refilling Station" ||
            preselectedUndertakingType === "LPG Distribution Point") &&
            projectSpecification?.storageTanks?.placement &&
            projectSpecification.storageTanks.placement.length > 0 && (
              <Detail
                label="Tank Placement:"
                value={projectSpecification.storageTanks.placement
                  .map((p: string) => normalizeText(p))
                  .join(", ")}
              />
            )}

          {/* Tank Farm Restriction - Only for Refilling Station and Distribution Point */}
          {(preselectedUndertakingType === "LPG Refilling Station" ||
            preselectedUndertakingType === "LPG Distribution Point") && (
            <>
              <Detail
                label="Tank Farm Restricted:"
                value={
                  projectSpecification?.storageTanks?.isTankFarmRestricted ? (
                    <Tag color="orange">Yes</Tag>
                  ) : (
                    <Tag color="default">No</Tag>
                  )
                }
              />
              {projectSpecification?.storageTanks?.isTankFarmRestricted ===
                true && (
                <Detail
                  label="Restriction Measures:"
                  value={
                    projectSpecification.storageTanks.restrictionMeasures || "—"
                  }
                />
              )}
              {projectSpecification?.storageTanks?.isTankFarmRestricted ===
                false && (
                <Detail
                  label="Future Restriction Measures:"
                  value={
                    projectSpecification.storageTanks
                      .futureRestrictionMeasures || "—"
                  }
                />
              )}
            </>
          )}

          {/* Cylinder Storage Cages - Only for LPG Exchange Point */}
          {preselectedUndertakingType === "LPG Exchange Point" && (
            <>
              {projectSpecification?.exchangePointCages?.cages &&
                projectSpecification.exchangePointCages.cages.length > 0 && (
                  <div className="mb-4">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Cylinder Storage Cages
                    </Title>
                    <Table
                      dataSource={projectSpecification.exchangePointCages.cages}
                      columns={[
                        {
                          title: "Cage Number",
                          dataIndex: "cageNumber",
                          key: "cageNumber",
                          width: "20%",
                        },
                        {
                          title: "Cage Size",
                          dataIndex: "cageSize",
                          key: "cageSize",
                          width: "15%",
                          render: (size: string) => normalizeText(size),
                        },
                        {
                          title: "Cylinders per Cage",
                          dataIndex: "numberOfCylindersPerCage",
                          key: "numberOfCylindersPerCage",
                          width: "20%",
                          render: (count: number) => count || "N/A",
                        },
                        {
                          title: "Safety Measures",
                          dataIndex: "safetyMeasures",
                          key: "safetyMeasures",
                          width: "45%",
                          render: (measures: string) => measures || "N/A",
                        },
                      ]}
                      pagination={false}
                      size="small"
                      bordered
                      rowKey="id"
                    />
                  </div>
                )}
            </>
          )}

          {preselectedUndertakingType === "LPG Refilling Station" && (
            <>
              <Detail
                label="Services Provided:"
                value={projectSpecification.servicesProvided
                  .map((s: string) => normalizeText(s))
                  .join(", ")}
              />

              {/* Other Services */}
              {projectSpecification?.servicesOther && (
                <Detail
                  label="Other Services:"
                  value={projectSpecification.servicesOther}
                />
              )}
            </>
          )}

          {/* Safety Accessories */}
          {projectSpecification?.safetyAccessories &&
            projectSpecification.safetyAccessories.length > 0 && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Safety Accessories
                </Title>
                <ul className="list-disc pl-5">
                  {projectSpecification?.safetyAccessories?.map(
                    (accessory: string, index: number) => (
                      <li key={index}>{normalizeText(accessory)}</li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Workforce */}
          {projectSpecification?.workforce && (
            <div className="mt-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Workforce
              </Title>
              <Detail
                label="Total Staff:"
                value={projectSpecification.workforce.total}
              />
              <Detail
                label="Management:"
                value={projectSpecification.workforce.management}
              />
              <Detail
                label="Senior Staff:"
                value={projectSpecification.workforce.senior}
              />
              <Detail
                label="Junior Staff:"
                value={projectSpecification.workforce.junior}
              />
              <Detail
                label="Casual Workers:"
                value={projectSpecification.workforce.casuals}
              />
            </div>
          )}
        </Block>

        {/* --- BLOCK 6: Infrastructure & Utilities --- */}
        <Block
          title="6. Infrastructure & Utilities"
          className={styles.fullWidth}
        >
          {infrastructure ? (
            <div className="space-y-4">
              {/* Forecourt Details */}
              {infrastructure?.forecourt && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Forecourt Details
                  </Title>
                  <Detail
                    label="Ground Level:"
                    value={normalizeText(infrastructure.forecourt.groundLevel)}
                  />
                  <Detail
                    label="Condition:"
                    value={normalizeText(infrastructure.forecourt.condition)}
                  />
                  <Detail
                    label="Pump Island Condition:"
                    value={normalizeText(
                      infrastructure.forecourt.pumpIslandCondition
                    )}
                  />
                  <Detail
                    label="Has Canopy:"
                    value={
                      infrastructure.forecourt.hasCanopy ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                </div>
              )}

              {/* Water Infrastructure */}
              {infrastructure?.water && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Water Infrastructure
                  </Title>
                  <Detail
                    label="Water Sources:"
                    value={infrastructure.water.sources?.join(", ")}
                  />
                  {infrastructure.water.otherSources && (
                    <Detail
                      label="Other Water Sources:"
                      value={infrastructure.water.otherSources}
                    />
                  )}
                  <Detail
                    label="Has Reservoir:"
                    value={
                      infrastructure.water.storage?.hasReservoir ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                  {infrastructure.water.storage?.hasReservoir && (
                    <>
                      <Detail
                        label="Reservoir Count:"
                        value={infrastructure.water.storage.reservoirCount}
                      />
                      <Detail
                        label="Reservoir Capacity (Litres):"
                        value={
                          infrastructure.water.storage.reservoirCapacityLitres
                        }
                      />
                    </>
                  )}
                  {infrastructure.water.storage?.otherStorageMethod && (
                    <Detail
                      label="Other Storage Method:"
                      value={infrastructure.water.storage.otherStorageMethod}
                    />
                  )}

                  <Detail
                    label="Annual Consumption:"
                    value={infrastructure.water.annualConsumption}
                  />
                </div>
              )}

              {/* Power Infrastructure */}
              {infrastructure?.power && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Power Infrastructure
                  </Title>
                  <Detail
                    label="Power Sources:"
                    value={infrastructure.power.sources?.join(", ")}
                  />
                  {infrastructure.power.otherSources && (
                    <Detail
                      label="Other Power Sources:"
                      value={infrastructure.power.otherSources}
                    />
                  )}
                  {infrastructure.power.generatorCapacityKVA && (
                    <Detail
                      label="Generator Capacity (KVA):"
                      value={infrastructure.power.generatorCapacityKVA}
                    />
                  )}
                  {infrastructure.power.solarCapacityKW && (
                    <Detail
                      label="Solar Capacity (KW):"
                      value={infrastructure.power.solarCapacityKW}
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

                  <Detail
                    label="Annual Consumption (KWH):"
                    value={infrastructure.power.annualConsumptionKWH}
                  />
                </div>
              )}

              {/* Washrooms */}
              {infrastructure?.washrooms && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Washrooms
                  </Title>
                  <Detail
                    label="Washrooms Available:"
                    value={
                      infrastructure.washrooms.areAvailable ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                  <Detail
                    label="Separate Male/Female Washrooms:"
                    value={
                      infrastructure.washrooms.areSeparateForMaleFemale ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                  {infrastructure.washrooms.count && (
                    <Detail
                      label="Washroom Count:"
                      value={infrastructure.washrooms.count}
                    />
                  )}
                  {infrastructure.washrooms.cleaningFrequency && (
                    <Detail
                      label="Cleaning Frequency:"
                      value={infrastructure.washrooms.cleaningFrequency}
                    />
                  )}
                </div>
              )}

              {/* Traffic & Access */}
              {infrastructure?.traffic && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Traffic & Access
                  </Title>
                  <Detail
                    label="Access Road Type:"
                    value={normalizeText(infrastructure.traffic.accessRoadIs)}
                  />
                  {infrastructure.traffic.parkingLotCapacity && (
                    <Detail
                      label="Parking Lot Capacity:"
                      value={infrastructure.traffic.parkingLotCapacity}
                    />
                  )}
                </div>
              )}

              {/* Drainage */}
              {infrastructure?.drainage && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Drainage System
                  </Title>
                  <Detail
                    label="Has Drainage System:"
                    value={
                      infrastructure.drainage.hasSystem ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                  {infrastructure.drainage.hasSystem && (
                    <Detail
                      label="Condition:"
                      value={infrastructure.drainage.condition}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <Typography.Text type="secondary">
              No infrastructure data available
            </Typography.Text>
          )}
        </Block>

        {/* --- BLOCK 7: Impact Assessment (for new applications) --- */}
        {permitDetails?.applicationType === "new_application" &&
          impactAssessment && (
            <Block title="7. Impact Assessment" className={styles.fullWidth}>
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
                        closurePhase: "Closure Phase",
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
                          {attachments?.evidenceOfConsultation.name ||
                            "document"}{" "}
                          attached — refer to{" "}
                          <strong>Block 9 (Supporting Documents)</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Typography.Text type="secondary">
                  No impact assessment data available
                </Typography.Text>
              )}
            </Block>
          )}

        {/* --- Block 9: Waste Management Plan (for renewals) --- */}
        {permitDetails?.applicationType === "renewal" &&
          wasteManagementPlan && (
            <Block
              title="7. Waste Management Plan"
              className={styles.fullWidth}
            >
              {/* General Impacts */}
              {wasteManagementPlan?.generalImpacts && (
                <div className="mb-4">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Environmental Impacts Identification
                  </Title>
                  <Table
                    dataSource={[
                      {
                        type: "Solid Waste",
                        ...wasteManagementPlan?.generalImpacts.solidWaste,
                      },
                      {
                        type: "Liquid Waste",
                        ...wasteManagementPlan?.generalImpacts.liquidWaste,
                      },
                      {
                        type: "Air Emissions",
                        ...wasteManagementPlan?.generalImpacts.airEmissions,
                      },
                      {
                        type: "Soil Contamination",
                        ...wasteManagementPlan?.generalImpacts
                          .soilContamination,
                      },
                      {
                        type: "Stormwater Runoffs",
                        ...wasteManagementPlan?.generalImpacts
                          .stormwaterRunoffs,
                      },
                      {
                        type: "Other",
                        ...wasteManagementPlan?.generalImpacts.other,
                      },
                    ].filter((item) => item.ticked)}
                    columns={[
                      {
                        title: "Impact Type",
                        dataIndex: "type",
                        key: "type",
                      },
                      {
                        title: "Source",
                        dataIndex: "source",
                        key: "source",
                      },
                      {
                        title: "Estimated Quantity",
                        dataIndex: "estimatedQty",
                        key: "estimatedQty",
                      },
                      {
                        title: "Receiving Medium/Impact",
                        dataIndex: "receivingMedium",
                        key: "receivingMedium",
                      },
                    ]}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey="type"
                  />
                </div>
              )}

              {/* Pollution Management */}
              {wasteManagementPlan?.pollutionManagement?.pollution && (
                <div className="mb-4">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Pollution Management
                  </Title>
                  <Table
                    dataSource={[
                      {
                        type: "Air Emissions",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .airEmissions,
                      },
                      {
                        type: "Soil Contamination",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .soilContamination,
                      },
                      {
                        type: "Liquid Waste/Effluent",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .liquidWasteEffluent,
                      },
                      {
                        type: "Surface Water Quality",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .surfaceWaterQuality,
                      },
                      {
                        type: "Ambient Noise/Vibration",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .ambientNoiseVibration,
                      },
                      {
                        type: "Other",
                        ...wasteManagementPlan?.pollutionManagement?.pollution
                          .other,
                      },
                    ].filter((item) => item.ticked)}
                    columns={[
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                      },
                      {
                        title: "Management Practices",
                        dataIndex: "managementPractices",
                        key: "managementPractices",
                      },
                    ]}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey="type"
                  />
                </div>
              )}

              {/* Waste Management */}
              {(wasteManagementPlan?.pollutionManagement?.waste ||
                wasteManagementPlan?.pollutionManagement?.additional) && (
                <div className="mb-4">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Waste Management
                  </Title>
                  <Table
                    dataSource={[
                      {
                        type: "Liquid Waste",
                        ...wasteManagementPlan?.pollutionManagement?.waste
                          ?.liquidWaste,
                      },
                      {
                        type: "Solid Waste",
                        ...wasteManagementPlan?.pollutionManagement?.waste
                          ?.solidWaste,
                      },
                      {
                        type: "Hazardous Waste",
                        ...wasteManagementPlan?.pollutionManagement?.waste
                          ?.hazardousWaste,
                      },
                      {
                        type: "Plastic Waste",
                        ...wasteManagementPlan?.pollutionManagement?.waste
                          ?.plasticWaste,
                      },
                      {
                        type: "Traffic",
                        ...wasteManagementPlan?.pollutionManagement?.additional
                          ?.traffic,
                      },
                      {
                        type: "Others (Occupational Health and Safety)",
                        ...wasteManagementPlan?.pollutionManagement?.additional
                          ?.occupationalHealthSafety,
                      },
                    ].filter((item) => item.ticked)}
                    columns={[
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                        ellipsis: false,
                      },
                      {
                        title: "Management Practices",
                        dataIndex: "managementPractices",
                        key: "managementPractices",
                        ellipsis: false,
                      },
                    ]}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey="type"
                  />
                </div>
              )}
            </Block>
          )}

        {/* --- BLOCK 9: Policies & Compliance --- */}
        <Block
          title={`${
            permitDetails?.applicationType === "new_application" ? "8" : "8"
          }. Policies & Compliance`}
          className={styles.fullWidth}
        >
          {/* Legislative Compliance */}
          {complianceAndManagement?.legislativeCompliance && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Legislative Compliance
              </Title>

              {complianceAndManagement.legislativeCompliance.nationalPolicies &&
                complianceAndManagement.legislativeCompliance.nationalPolicies
                  .length > 0 && (
                  <div className="mb-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      National Policies
                    </Title>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      {complianceAndManagement.legislativeCompliance.nationalPolicies.map(
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

              {complianceAndManagement.legislativeCompliance.nationalActs &&
                complianceAndManagement.legislativeCompliance.nationalActs
                  .length > 0 && (
                  <div className="mb-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      National Acts
                    </Title>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      {complianceAndManagement.legislativeCompliance.nationalActs.map(
                        (act: any, index: number) => (
                          <li key={act.id || index} className="text-gray-700">
                            {act.name}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}

              {complianceAndManagement.legislativeCompliance
                .nationalRegulations &&
                complianceAndManagement.legislativeCompliance
                  .nationalRegulations.length > 0 && (
                  <div className="mb-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      National Regulations
                    </Title>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      {complianceAndManagement.legislativeCompliance.nationalRegulations.map(
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

              {complianceAndManagement.legislativeCompliance
                .standardsAndGuidelines &&
                complianceAndManagement.legislativeCompliance
                  .standardsAndGuidelines.length > 0 && (
                  <div className="mb-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Standards and Guidelines
                    </Title>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      {complianceAndManagement.legislativeCompliance.standardsAndGuidelines.map(
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

          {/* Other Permits */}
          {complianceAndManagement?.otherPermits && (
            <div>
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Permits/Licenses/Certificates
              </Title>
              <div className="space-y-2">
                {Object.entries(
                  complianceAndManagement?.otherPermits || {}
                ).map(([key, permit]: [string, any]) => {
                  const displayName =
                    key === "environmentalPermit"
                      ? "EPA Environmental Permit"
                      : key === "ndtCertificate"
                      ? "Non-Destructive Test Certificate"
                      : key === "npaLicense"
                      ? "NPA Operating License"
                      : key === "gsaCertificate"
                      ? "GSA Certificate"
                      : key === "fidCertificate"
                      ? "Fire Installation Detector Certificate"
                      : key === "gnfsFireCertificate"
                      ? "GNFS Fire Certificate"
                      : key === "insuranceCertificate"
                      ? "Insurance Certificate"
                      : key === "publicLiabilityInsurance"
                      ? "Public Liability Insurance"
                      : permit.permitName || key;

                  return (
                    <Card key={key} size="small" className="border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{displayName}</span>
                        <Tag color={permit.isAvailable ? "green" : "red"}>
                          {permit.isAvailable ? "Available" : "Not Available"}
                        </Tag>
                      </div>
                      {permit.isAvailable && (
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
                          {permit.issuingAuthority && (
                            <Detail
                              label="Issuing Authority:"
                              value={permit.issuingAuthority}
                            />
                          )}
                          {permit.supportingDocument && (
                            <div className="flex items-center space-x-2 mt-1">
                              <FileTextOutlined />
                              <Text className="text-red-600">
                                {permit.supportingDocument?.name ||
                                  "Attachment"}{" "}
                                attached — refer to{" "}
                                <strong>Block 9 (Supporting Documents)</strong>
                              </Text>
                            </div>
                          )}
                        </>
                      )}
                      {!permit.isAvailable && permit.reasonIfNotAvailable && (
                        <Detail
                          label="Reason:"
                          value={permit.reasonIfNotAvailable}
                        />
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Company Policies */}
          {complianceAndManagement?.companyPolicies && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Company Policies
              </Title>

              {complianceAndManagement.companyPolicies.environmental && (
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
                      complianceAndManagement.companyPolicies.environmental
                        .statement
                    }
                  />
                  <Detail
                    label="Objective:"
                    value={
                      complianceAndManagement.companyPolicies.environmental
                        .objective
                    }
                  />
                  <Detail
                    label="Target Strategy:"
                    value={
                      complianceAndManagement.companyPolicies.environmental
                        .targetStrategy
                    }
                  />
                  {complianceAndManagement.companyPolicies.environmental
                    .policyDoc && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Text className="text-red-600">
                        Policy Document{" "}
                        {complianceAndManagement.companyPolicies?.environmental
                          ?.policyDoc?.name ||
                          "Environmental Policy Document"}{" "}
                        attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </Text>
                    </div>
                  )}
                </div>
              )}

              {complianceAndManagement.companyPolicies.ohs && (
                <div className="mb-3">
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    Occupational Health & Safety Policy
                  </Title>
                  <Detail
                    label="Statement:"
                    value={
                      complianceAndManagement.companyPolicies.ohs.statement
                    }
                  />
                  <Detail
                    label="Objective:"
                    value={
                      complianceAndManagement.companyPolicies.ohs.objective
                    }
                  />
                  <Detail
                    label="Target Strategy:"
                    value={
                      complianceAndManagement.companyPolicies.ohs.targetStrategy
                    }
                  />
                  {complianceAndManagement.companyPolicies.ohs.policyDoc && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Text className="text-red-600">
                        Policy Document{" "}
                        {complianceAndManagement.companyPolicies.ohs?.policyDoc
                          ?.name || "OHS Policy Document"}{" "}
                        attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Monitoring Plan */}
          {monitoringIndicators && monitoringIndicators.length > 0 && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Monitoring Plan
              </Title>
              <Table
                dataSource={monitoringIndicators}
                columns={[
                  {
                    title: "Indicator",
                    dataIndex: "indicator",
                    key: "indicator",
                    ellipsis: false,
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
                    ellipsis: false,
                  },
                  {
                    title: "Frequency",
                    dataIndex: "qtyMonitoredFrequency",
                    key: "qtyMonitoredFrequency",
                    ellipsis: false,
                  },
                  {
                    title: "Treatment/Disposal Mode",
                    dataIndex: "disposalTreatmentMode",
                    key: "disposalTreatmentMode",
                    ellipsis: false,
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>
          )}

          {/* Training Plan */}
          {trainingRecords && trainingRecords.length > 0 && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Training Plan
              </Title>
              <Table
                dataSource={trainingRecords}
                pagination={false}
                size="small"
                bordered
                rowKey={(record: any, index) => record.id || index}
                expandable={{
                  expandedRowRender: (record: any) => {
                    if (
                      !record.supportingDocuments ||
                      record.supportingDocuments.length === 0
                    ) {
                      return (
                        <div className="p-4 text-gray-500">
                          No supporting documents attached
                        </div>
                      );
                    }
                    return (
                      <div className="p-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Supporting Documents:
                        </Title>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {record?.supportingDocuments?.map(
                            (doc: any, idx: number) => (
                              <Text key={idx} className="text-red-600">
                                {doc.name || `Document ${idx + 1}`} attached —
                                refer to{" "}
                                <strong>Block 9 (Supporting Documents)</strong>
                              </Text>
                            )
                          )}
                        </div>
                      </div>
                    );
                  },
                  rowExpandable: (record: any) =>
                    record.supportingDocuments &&
                    record.supportingDocuments.length > 0,
                }}
                columns={[
                  {
                    title: "Training Area",
                    dataIndex: "areaOfTraining",
                    key: "areaOfTraining",
                    width: "20%",
                    ellipsis: false,
                  },
                  {
                    title: "Record Kept",
                    dataIndex: "recordKept",
                    key: "recordKept",
                    width: "12%",
                    ellipsis: false,
                    render: (value: boolean) =>
                      value === undefined ? "-" : value ? "Yes" : "No",
                  },
                  {
                    title: "Date of Training",
                    dataIndex: "dateOfTraining",
                    key: "dateOfTraining",
                    width: "15%",
                    ellipsis: false,
                    render: (date: string) => (date ? formatDate(date) : "-"),
                  },
                  {
                    title: "Training Details",
                    dataIndex: "trainingDetails",
                    key: "trainingDetails",
                    width: "53%",
                    ellipsis: false,
                  },
                ]}
              />
            </div>
          )}

          {/* CSR Activities - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.csrActivities && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Corporate Social Responsibility (CSR) Activities
                </Title>
                <Detail
                  label="CSR Activities:"
                  value={complianceAndManagement.csrActivities}
                />
              </div>
            )}

          {/* Complaint Management - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.complaintManagement && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Complaints/Complaint Management
                </Title>
                <Detail
                  label="Has Complaint Register:"
                  value={
                    complianceAndManagement.complaintManagement.hasRegister
                      ? "Yes"
                      : "No"
                  }
                />

                {complianceAndManagement.complaintManagement.hasRegister &&
                  complianceAndManagement.complaintManagement
                    .registerEvidence && (
                    <div className="flex items-center space-x-2 mt-1">
                      <FileTextOutlined />
                      <Text className="text-red-600">
                        Register Evidence{" "}
                        {complianceAndManagement.complaintManagement
                          ?.registerEvidence?.name || "Attachment"}{" "}
                        attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </Text>
                    </div>
                  )}

                <Detail
                  label="Has Complaint Procedure:"
                  value={
                    complianceAndManagement.complaintManagement.hasProcedure
                      ? "Yes"
                      : "No"
                  }
                />

                {complianceAndManagement.complaintManagement.hasProcedure &&
                  complianceAndManagement.complaintManagement
                    .procedureEvidence && (
                    <div className="flex items-center space-x-2 mt-1">
                      <FileTextOutlined />
                      <Text className="text-red-600">
                        Procedure Evidence{" "}
                        {complianceAndManagement.complaintManagement
                          ?.procedureEvidence?.name || "Attachment"}{" "}
                        attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </Text>
                    </div>
                  )}
                {complianceAndManagement.complaintManagement
                  .receivedComplaints !== undefined && (
                  <>
                    <Detail
                      label="Received Complaints in Last Year:"
                      value={
                        complianceAndManagement.complaintManagement
                          .receivedComplaints
                          ? "Yes"
                          : "No"
                      }
                    />
                    {complianceAndManagement.complaintManagement
                      .receivedComplaints && (
                      <>
                        <Detail
                          label="Number of Complaints:"
                          value={
                            complianceAndManagement.complaintManagement
                              .numberOfComplaints
                          }
                        />
                        <Detail
                          label="Nature of Complaints:"
                          value={
                            complianceAndManagement.complaintManagement
                              .natureOfComplaints
                          }
                        />
                        <Detail
                          label="How Dealt With Complaints:"
                          value={
                            complianceAndManagement.complaintManagement
                              .howDealtWithComplaints
                          }
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            )}

          {/* Challenges/Concerns - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.challenges && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Major Environmental Challenges/Concerns
                </Title>
                <Detail
                  label="Challenges Faced:"
                  value={complianceAndManagement.challenges}
                />
              </div>
            )}

          {/* Enhancement Measures - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.enhancementMeasures &&
            complianceAndManagement.enhancementMeasures.length > 0 && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Enhancement/Improvement Measures
                </Title>
                <Table
                  dataSource={complianceAndManagement.enhancementMeasures}
                  columns={[
                    {
                      title: "Improvement Measure",
                      dataIndex: "improvementMeasure",
                      key: "improvementMeasure",
                      width: "50%",
                    },
                    {
                      title: "Timeline",
                      dataIndex: "timeline",
                      key: "timeline",
                      width: "25%",
                    },
                    {
                      title: "Budget (GHC)",
                      dataIndex: "budget",
                      key: "budget",
                      width: "25%",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                />
              </div>
            )}
        </Block>

        {/* --- BLOCK 10: Attachments --- */}
        <Block
          title={`${
            permitDetails?.applicationType === "new_application" ? "9" : "9"
          }. Supporting Documents`}
          className={styles.fullWidth}
        >
          <SupportingDocumentsGrid
            attachments={application?.attachments}
            onDocumentView={handleDocumentView}
          />
        </Block>
      </div>
    </div>
  );
};

export default EnvironmentalLPGPreview;
