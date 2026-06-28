import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Card, Typography, Collapse } from "antd";
import { Block, Detail } from "../../../../review/helpers";
import {
  formatDate,
  normalizeText,
  handleDocumentView,
  formatDate4,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import { FileTextOutlined } from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title, Text } = Typography;

interface EnvironmentalEnergyReviewProps {
  application: any;
}

export const EnvironmentalEnergyPreview: React.FC<
  EnvironmentalEnergyReviewProps
> = ({ application }) => {
  const { answers } = application;

  const permitDetails = answers?.permitDetails || {};

  const energyData = answers?.environmentalPermitData?.energy || {};

  const {
    projectOverview,
    siteDetails,
    projectSpecification,
    infrastructure,
    wasteManagementPlan,
    impactAssessment,
    complianceAndManagement,
    attachments,
  } = energyData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper function to get undertaking type label
  const getUndertakingTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      fuel_filling_station: "Fuel Filling Station",
      fuel_service_station: "Fuel Service Station",
      fuel_dump: "Fuel Dump",
      lpg_refilling_station: "LPG Refilling Station",
      lpg_distribution_point: "LPG Distribution Point",
      lpg_exchange_point: "LPG Exchange Point",
      cylinder_bottling_plant: "Cylinder Bottling Plant",
      tank_farm: "Tank Farm",
    };
    return typeMap[type] || type;
  };

  // Helper function to render monitoring indicators
  const renderMonitoringIndicators = () => {
    if (!complianceAndManagement?.monitoringPlan) return null;

    const plan = complianceAndManagement.monitoringPlan;
    const indicators = [];

    // Add predefined indicators - matching source structure
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
          indicator: plan[key].indicator || label,
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

    // Add predefined training records - matching source structure
    const predefinedKeys = [
      {
        key: "environmentalManagement",
        label: "Environmental Management",
      },
      {
        key: "fireManagement",
        label: "Fire Management",
      },
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health & Safety",
      },
      {
        key: "productHandling",
        label: "Product Handling",
      },
      {
        key: "spillLeaksManagement",
        label: "Spill/Leaks Management",
      },
      {
        key: "sops",
        label: "Standard Operating Procedures (SOPs)",
      },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key]) {
        records.push({
          id: key,
          areaOfTraining: plan[key].areaOfTraining || label,
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
      <Title level={1} className="!text-2xl !font-bold !m-0">
        Permit Application Review
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4"></div>
      </Title>

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
          <Detail label="Permit Category:" value="ENERGY SECTOR" />
          <Detail
            label="Petroleum Sector:"
            value={normalizeText(energyData?.petroleumSector?.toUpperCase())}
          />
          <Detail
            label="Type of Undertaking:"
            value={getUndertakingTypeLabel(energyData?.subType)}
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

        {/* --- BLOCK 5: Project Specification --- */}
        <Block title="5. Project Specification" className={styles.fullWidth}>
          <Detail
            label="Type of Undertaking:"
            value={getUndertakingTypeLabel(energyData?.subType)}
          />
          <Detail
            label="Parent OMC Name:"
            value={projectSpecification?.parentOmcName}
          />
          {energyData.subType === "fuel_service_station" && (
            <Detail
              label="Services Provided:"
              value={projectSpecification?.servicesProvided?.join(", ")}
            />
          )}
          {projectSpecification?.servicesOther && (
            <Detail
              label="Other Services:"
              value={projectSpecification?.servicesOther}
            />
          )}
          <Detail
            label="Land Take (Acres):"
            value={projectSpecification?.landTakeAcres}
          />

          {/* Underground Storage Tanks */}
          {projectSpecification?.undergroundStorageTanks && (
            <div className="mt-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Storage Tanks
              </Title>
              <Detail
                label="Tank Type:"
                value={projectSpecification.undergroundStorageTanks.tankType?.join(
                  ", "
                )}
              />
              <Detail
                label="Placement of Storage Tanks:"
                value={projectSpecification.undergroundStorageTanks.placement?.join(
                  ", "
                )}
              />
              <Detail
                label="Is Tank Farm Restricted:"
                value={
                  projectSpecification.undergroundStorageTanks
                    .isTankFarmRestricted ? (
                    <Tag color="red">Yes</Tag>
                  ) : (
                    <Tag color="green">No</Tag>
                  )
                }
              />

              {projectSpecification.undergroundStorageTanks
                .isTankFarmRestricted === true && (
                <Detail
                  label="Restriction Measures:"
                  value={
                    projectSpecification.undergroundStorageTanks
                      .restrictionMeasures || "N/A"
                  }
                />
              )}

              {projectSpecification.undergroundStorageTanks
                .isTankFarmRestricted === false && (
                <Detail
                  label="Future Restriction Measures:"
                  value={
                    projectSpecification.undergroundStorageTanks
                      .futureRestrictionMeasures || "N/A"
                  }
                />
              )}

              {/* Installed Tanks Table */}
              {projectSpecification.undergroundStorageTanks.installedTanks &&
                projectSpecification.undergroundStorageTanks.installedTanks
                  .length > 0 && (
                  <div className="mt-3">
                    <Title
                      level={5}
                      className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                    >
                      Installed Tanks
                    </Title>
                    <Table
                      dataSource={
                        projectSpecification.undergroundStorageTanks
                          .installedTanks
                      }
                      columns={[
                        {
                          title: "Product Type",
                          dataIndex: "product",
                          key: "product",
                        },
                        {
                          title: "Capacity (Litres)",
                          dataIndex: "capacityLitres",
                          key: "capacityLitres",
                          render: (val: number) =>
                            val ? val.toLocaleString() : "N/A",
                        },
                        {
                          title: "Year of Installation",
                          dataIndex: "yearOfInstallation",
                          key: "yearOfInstallation",
                        },
                        {
                          title: "Date of Last Pressure Testing",
                          dataIndex: "lastPressureTestDate",
                          key: "lastPressureTestDate",
                          width: "25%",
                          render: (val: number) =>
                            val ? val.toLocaleString() : "N/A",
                        },
                        {
                          title: "Pressure Test Evidence",
                          dataIndex: "pressureTestEvidenceDoc",
                          key: "pressureTestEvidenceDoc",
                          width: "45%",
                          render: (pressureTestEvidenceDoc: any) => {
                            if (!pressureTestEvidenceDoc) {
                              return (
                                <Text type="secondary">
                                  No document attached
                                </Text>
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
            </div>
          )}

          {/* Safety Accessories */}
          {projectSpecification?.safetyAccessories &&
            projectSpecification.safetyAccessories.length > 0 && (
              <div className="mt-4">
                <Detail
                  label="Safety Accessories:"
                  value={projectSpecification?.safetyAccessories?.join(", ")}
                />
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

        {/* --- BLOCK 6: Infrastructure --- */}
        <Block title="6. Infrastructure" className={styles.fullWidth}>
          {/* Forecourt Facilities */}
          {infrastructure?.forecourt && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Forecourt Facilities
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
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Water Infrastructure
              </Title>
              <Detail
                label="Water Sources:"
                value={infrastructure?.water?.sources?.join(", ")}
              />
              {infrastructure?.water?.otherSource && (
                <Detail
                  label="Other Water Source:"
                  value={infrastructure?.water?.otherSource}
                />
              )}
              <Detail
                label="Has Reservoir:"
                value={
                  infrastructure?.water?.storage?.hasReservoir ? (
                    <Tag color="green">Yes</Tag>
                  ) : (
                    <Tag color="default">No</Tag>
                  )
                }
              />
              {infrastructure?.water?.storage?.hasReservoir && (
                <>
                  <Detail
                    label="Reservoir Count:"
                    value={infrastructure?.water?.storage.reservoirCount}
                  />
                  <Detail
                    label="Reservoir Capacity (Litres):"
                    value={infrastructure?.water?.storage.reservoirCapacityLitres?.toLocaleString()}
                  />
                </>
              )}
              {infrastructure?.water?.storage?.otherStorageMethod && (
                <Detail
                  label="Other Storage Method:"
                  value={infrastructure?.water?.storage.otherStorageMethod}
                />
              )}
              <Detail
                label="Annual Consumption:"
                value={infrastructure?.water?.annualConsumption}
              />
            </div>
          )}

          {/* Power Infrastructure */}
          {infrastructure?.power && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Power Infrastructure
              </Title>
              <Detail
                label="Power Sources:"
                value={infrastructure?.power?.sources?.join(", ")}
              />
              {infrastructure?.power?.generatorCapacityKVA && (
                <Detail
                  label="Generator Capacity (KVA):"
                  value={infrastructure?.power?.generatorCapacityKVA}
                />
              )}
              {infrastructure?.power?.solarCapacityKW && (
                <Detail
                  label="Solar Capacity (KW):"
                  value={infrastructure?.power?.solarCapacityKW}
                />
              )}
              {infrastructure?.power?.otherSourceDetails && (
                <Detail
                  label="Other Power Source Details:"
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
              <Detail
                label="Annual Consumption (KWH):"
                value={infrastructure?.power?.annualConsumptionKWH}
              />
            </div>
          )}

          {/* Washrooms */}
          {infrastructure?.washrooms && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Washroom Facilities
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
              {infrastructure.washrooms.areAvailable && (
                <>
                  <Detail
                    label="Separate for Male/Female:"
                    value={
                      infrastructure.washrooms.areSeparateForMaleFemale ? (
                        <Tag color="green">Yes</Tag>
                      ) : (
                        <Tag color="default">No</Tag>
                      )
                    }
                  />
                  <Detail
                    label="Number of Washrooms:"
                    value={infrastructure.washrooms.count}
                  />
                  <Detail
                    label="Cleaning Frequency:"
                    value={infrastructure.washrooms.cleaningFrequency}
                  />
                </>
              )}
            </div>
          )}

          {/* Traffic */}
          {infrastructure?.traffic && (
            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Traffic & Parking
              </Title>
              <Detail
                label="Access Road Type:"
                value={infrastructure.traffic.accessRoadIs}
              />
              <Detail
                label="Parking Lot Capacity:"
                value={infrastructure.traffic.parkingLotCapacity}
              />
            </div>
          )}

          {/* Drainage */}
          {infrastructure?.drainage && (
            <div className="mb-4">
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
        </Block>

        {/* --- BLOCK 7: Waste Management Plan --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="7. Waste Management Plan" className={styles.fullWidth}>
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
                      ...wasteManagementPlan.generalImpacts.solidWaste,
                    },
                    {
                      type: "Liquid Waste",
                      ...wasteManagementPlan.generalImpacts.liquidWaste,
                    },
                    {
                      type: "Air Emissions",
                      ...wasteManagementPlan.generalImpacts.airEmissions,
                    },
                    {
                      type: "Soil Contamination",
                      ...wasteManagementPlan.generalImpacts.soilContamination,
                    },
                    {
                      type: "Stormwater Runoffs",
                      ...wasteManagementPlan.generalImpacts.stormwaterRunoffs,
                    },
                    {
                      type: "Other",
                      ...wasteManagementPlan.generalImpacts.other,
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
            {wasteManagementPlan?.pollutionManagement?.waste && (
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
                        .liquidWaste,
                    },
                    {
                      type: "Solid Waste",
                      ...wasteManagementPlan?.pollutionManagement?.waste
                        .solidWaste,
                    },
                    {
                      type: "Hazardous Waste",
                      ...wasteManagementPlan?.pollutionManagement?.waste
                        .hazardousWaste,
                    },
                    {
                      type: "Plastic Waste",
                      ...wasteManagementPlan?.pollutionManagement?.waste
                        .plasticWaste,
                    },
                    {
                      type: "Traffic",
                      ...wasteManagementPlan.pollutionManagement.additional
                        ?.traffic,
                    },
                    {
                      type: "Others (Occupational Health and Safety)",
                      ...wasteManagementPlan.pollutionManagement.additional
                        ?.occupationalHealthSafety,
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
          </Block>
        )}

        {/* --- Block 9: Impact Assessment --- */}
        {permitDetails?.applicationType !== "renewal" && (
          <Block title="8. Impact Assessment" className={styles.fullWidth}>
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
                        {attachments?.evidenceOfConsultation.name || "document"}{" "}
                        attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
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

        {/* --- BLOCK 9: Compliance & Management --- */}
        <Block
          title="8. Policy, Compliance & Management"
          className={styles.fullWidth}
        >
          {/* Legislative Compliance */}
          {complianceAndManagement?.legislativeCompliance && (
            <div>
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
                      : key === "integrityTestResults"
                      ? "Tank Integrity Test Results"
                      : key === "npaLicense"
                      ? "National Petroleum Authority (NPA) License"
                      : key === "gsaCertificate"
                      ? "Ghana Standards Authority (GSA) Certificate"
                      : key === "gnfsFireCertificate"
                      ? "Ghana National Fire Service (GNFS) Fire Certificate"
                      : key === "insuranceCertificate"
                      ? "Insurance Certificate"
                      : key === "publicLiabilityInsurance"
                      ? "Public Liability Insurance"
                      : key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <Card key={key} size="small" className="border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{displayName}</span>
                        <Tag color={permit.hasPermit ? "green" : "red"}>
                          {permit.hasPermit ? "Available" : "Not Available"}
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
                                {permit.supportingDocument?.name ||
                                  "Attachment"}{" "}
                                attached — refer to{" "}
                                <strong>Block 9 (Supporting Documents)</strong>
                              </Text>
                            </div>
                          )}
                        </>
                      )}
                      {!permit.hasPermit && permit.reasonIfNotAvailable && (
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
                    <div className="flex items-center space-x-2 mt-1">
                      <Text className="text-red-600">
                        Policy Document{" "}
                        {complianceAndManagement.companyPolicies?.environmental
                          ?.policyDoc?.name || "Attachment"}{" "}
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
                    <div className="flex items-center space-x-2 mt-1">
                      <Text className="text-red-600">
                        Policy Document{" "}
                        {complianceAndManagement.companyPolicies.ohs?.policyDoc
                          ?.name || "Attachment"}{" "}
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
                Environmental Monitoring Plan
              </Title>
              <Table
                dataSource={monitoringIndicators}
                columns={[
                  {
                    title: "Indicator",
                    dataIndex: "indicator",
                    key: "indicator",
                    width: "20%",
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
                    width: "25%",
                    ellipsis: false,
                  },
                  {
                    title: "Monitoring Frequency",
                    dataIndex: "qtyMonitoredFrequency",
                    key: "qtyMonitoredFrequency",
                    width: "20%",
                    ellipsis: false,
                  },
                  {
                    title: "Disposal/Treatment Mode",
                    dataIndex: "disposalTreatmentMode",
                    key: "disposalTreatmentMode",
                    width: "20%",
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
                Staff Training Plan
              </Title>
              <Table
                dataSource={trainingRecords}
                columns={[
                  {
                    title: "Area of Training",
                    dataIndex: "areaOfTraining",
                    key: "areaOfTraining",
                    width: "25%",
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
                    title: "Date of Training",
                    dataIndex: "dateOfTraining",
                    key: "dateOfTraining",
                    width: "20%",
                    render: (date: string) => (date ? formatDate(date) : "N/A"),
                  },
                  {
                    title: "Training Details",
                    dataIndex: "trainingDetails",
                    key: "trainingDetails",
                    width: "40%",
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

          {/* CSR Activities */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.csrActivities && (
              <div>
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Corporate Social Responsibility
                </Title>
                <Detail
                  label="CSR Activities:"
                  value={complianceAndManagement.csrActivities}
                />
              </div>
            )}

          {/* Complaint Management - Only for Renewal Applications */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.complaintManagement && (
              <div>
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

          {/* Challenges - Only for renewal applications */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.challenges && (
              <div>
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Challenges/Concerns
                </Title>
                <Detail
                  label="Major Environmental Challenges:"
                  value={complianceAndManagement.challenges}
                />
              </div>
            )}

          {/* Enhancement Measures */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.enhancementMeasures &&
            complianceAndManagement.enhancementMeasures.length > 0 && (
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Enhancement Measures
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

export default EnvironmentalEnergyPreview;
