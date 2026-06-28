import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Card, List, Button, Alert, Typography } from "antd";
import { EyeOutlined, FileOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";

import {
  formatDate,
  normalizeText,
  handleDocumentView,
  formatLabel,
  formatDate4,
} from "@/utils/helperFunction";

const { Text } = Typography;

interface EnvironmentalEnergyReviewProps {
  application: any;
}

export const EnvironmentalEnergyReview: React.FC<
  EnvironmentalEnergyReviewProps
> = ({ application }) => {
  const { clientId, submittedByAgent, answers } = application;

  const permitDetails = answers?.permitDetails || {};

  const energyData = answers?.environmentalPermitData?.energy || {};
  const fuelStationData = answers?.environmentalPermitData?.fuelStation || {};

  const {
    projectOverview,
    siteDetails,
    projectSpecification,
    infrastructure,
    wasteManagementPlan,
    impactAssessment,
    complianceAndManagement,
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

    // Add predefined indicators
    const predefinedKeys = [
      { key: "airEmissions", label: "Air Emissions" },
      { key: "noiseLevels", label: "Noise Levels" },
      { key: "wastewaterDischarge", label: "Wastewater Discharge" },
      { key: "solidWasteManagement", label: "Solid Waste Management" },
      { key: "soilContamination", label: "Soil Contamination" },
    ];

    predefinedKeys.forEach(({ key, label }) => {
      if (plan[key] && plan[key].recordKept) {
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
        if (indicator.recordKept) {
          indicators.push(indicator);
        }
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
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health and Safety",
      },
      { key: "fireFighting", label: "Fire Management" },
      { key: "sops", label: "Standard Operating Procedures (SOPs)" },
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
            <h4 className="font-semibold mb-2">Location Information</h4>
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
                    href={siteDetails?.location?.googleLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {siteDetails?.location?.googleLocationLink}
                  </a>
                }
              />
            )}
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
                    {siteDetails?.nearWaterBody?.distance && (
                      <span className="ml-2">
                        Distance: {siteDetails?.nearWaterBody?.distance} metres
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
                    {siteDetails?.nearSensitiveArea?.distance && (
                      <span className="ml-2">
                        Distance: {siteDetails?.nearSensitiveArea?.distance}{" "}
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
            label="Undertaking Type:"
            value={projectSpecification?.undertakingType}
          />
          <Detail
            label="Parent OMC Name:"
            value={projectSpecification?.parentOmcName}
          />
          <Detail
            label="Services Provided:"
            value={projectSpecification?.servicesProvided?.join(", ")}
          />
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
              <h4 className="font-semibold mb-2">Storage Tanks</h4>
              <Detail
                label="Tank Type:"
                value={projectSpecification.undergroundStorageTanks.tankType?.join(
                  ", "
                )}
              />
              <Detail
                label="Placement:"
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

              {/* Installed Tanks Table */}
              {projectSpecification.undergroundStorageTanks.installedTanks &&
                projectSpecification.undergroundStorageTanks.installedTanks
                  .length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-semibold mb-2">Installed Tanks</h5>
                    <Table
                      dataSource={
                        projectSpecification.undergroundStorageTanks
                          .installedTanks
                      }
                      columns={[
                        {
                          title: "Product Type",
                          dataIndex: "productType",
                          key: "productType",
                        },
                        {
                          title: "Capacity (Litres)",
                          dataIndex: "capacityLitres",
                          key: "capacityLitres",
                          render: (val: number) =>
                            val ? val.toLocaleString() : "N/A",
                        },
                        {
                          title: "Number of Tanks",
                          dataIndex: "numberOfTanks",
                          key: "numberOfTanks",
                        },
                        {
                          title: "Manufacturer",
                          dataIndex: "manufacturer",
                          key: "manufacturer",
                        },
                        {
                          title: "Year of Manufacture",
                          dataIndex: "yearOfManufacture",
                          key: "yearOfManufacture",
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
                  value={projectSpecification.safetyAccessories.join(", ")}
                />
              </div>
            )}

          {/* Workforce */}
          {projectSpecification?.workforce && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Workforce</h4>
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
              <h4 className="font-semibold mb-2">Forecourt Facilities</h4>
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
              <h4 className="font-semibold mb-2">Water Infrastructure</h4>
              <Detail
                label="Water Sources:"
                value={infrastructure.water.sources?.join(", ")}
              />
              {infrastructure.water.otherSource && (
                <Detail
                  label="Other Water Source:"
                  value={infrastructure.water.otherSource}
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
                    value={infrastructure.water.storage.reservoirCapacityLitres?.toLocaleString()}
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
                label="Annual Consumption (m³):"
                value={infrastructure.water.annualConsumption}
              />
            </div>
          )}

          {/* Power Infrastructure */}
          {infrastructure?.power && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Power Infrastructure</h4>
              <Detail
                label="Power Sources:"
                value={infrastructure.power.sources?.join(", ")}
              />
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
              {infrastructure.power.otherSourceDetails && (
                <Detail
                  label="Other Power Source Details:"
                  value={infrastructure.power.otherSourceDetails}
                />
              )}

              {/* Custom Source Capacities */}
              {infrastructure?.power?.customSourceCapacities &&
                Object.keys(infrastructure.power.customSourceCapacities)
                  .length > 0 && (
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
              <Detail
                label="Annual Consumption (KWH):"
                value={infrastructure.power.annualConsumptionKWH}
              />
            </div>
          )}

          {/* Washrooms */}
          {infrastructure?.washrooms && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Washroom Facilities</h4>
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
              <h4 className="font-semibold mb-2">Traffic & Parking</h4>
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
              <h4 className="font-semibold mb-2">Drainage System</h4>
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
        <Block title="7. Waste Management Plan" className={styles.fullWidth}>
          {/* General Impacts */}
          {wasteManagementPlan?.generalImpacts && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                General Environmental Impacts
              </h4>

              {/* Solid Waste Impact */}
              {wasteManagementPlan.generalImpacts.solidWaste?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">Solid Waste</h5>
                  <Detail
                    label="Source:"
                    value={wasteManagementPlan.generalImpacts.solidWaste.source}
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.solidWaste.estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.solidWaste
                        .receivingMedium
                    }
                  />
                </div>
              )}

              {/* Liquid Waste Impact */}
              {wasteManagementPlan.generalImpacts.liquidWaste?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">Liquid Waste</h5>
                  <Detail
                    label="Source:"
                    value={
                      wasteManagementPlan.generalImpacts.liquidWaste.source
                    }
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.liquidWaste
                        .estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.liquidWaste
                        .receivingMedium
                    }
                  />
                </div>
              )}

              {/* Air Emissions Impact */}
              {wasteManagementPlan.generalImpacts.airEmissions?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">Air Emissions</h5>
                  <Detail
                    label="Source:"
                    value={
                      wasteManagementPlan.generalImpacts.airEmissions.source
                    }
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.airEmissions
                        .estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.airEmissions
                        .receivingMedium
                    }
                  />
                </div>
              )}

              {/* Soil Contamination Impact */}
              {wasteManagementPlan.generalImpacts.soilContamination?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">
                    Soil Contamination
                  </h5>
                  <Detail
                    label="Source:"
                    value={
                      wasteManagementPlan.generalImpacts.soilContamination
                        .source
                    }
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.soilContamination
                        .estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.soilContamination
                        .receivingMedium
                    }
                  />
                </div>
              )}

              {/* Stormwater Runoffs Impact */}
              {wasteManagementPlan.generalImpacts.stormwaterRunoffs?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">
                    Stormwater Runoffs
                  </h5>
                  <Detail
                    label="Source:"
                    value={
                      wasteManagementPlan.generalImpacts.stormwaterRunoffs
                        .source
                    }
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.stormwaterRunoffs
                        .estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.stormwaterRunoffs
                        .receivingMedium
                    }
                  />
                </div>
              )}

              {/* Other Impact */}
              {wasteManagementPlan.generalImpacts.other?.ticked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-sm mb-2">Other Impacts</h5>
                  <Detail
                    label="Source:"
                    value={wasteManagementPlan.generalImpacts.other.source}
                  />
                  <Detail
                    label="Estimated Quantity:"
                    value={
                      wasteManagementPlan.generalImpacts.other.estimatedQty
                    }
                  />
                  <Detail
                    label="Receiving Medium:"
                    value={
                      wasteManagementPlan.generalImpacts.other.receivingMedium
                    }
                  />
                </div>
              )}
            </div>
          )}
          {/* Pollution Management */}
          {wasteManagementPlan?.pollutionManagement?.pollution && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Pollution Management</h4>
              <Table
                dataSource={[
                  {
                    type: "Air Emissions",
                    ...wasteManagementPlan.pollutionManagement.pollution
                      .airEmissions,
                  },
                  {
                    type: "Soil Contamination",
                    ...wasteManagementPlan.pollutionManagement.pollution
                      .soilContamination,
                  },
                  {
                    type: "Liquid Waste/Effluent",
                    ...wasteManagementPlan.pollutionManagement.pollution
                      .liquidWasteEffluent,
                  },
                  {
                    type: "Surface Water Quality",
                    ...wasteManagementPlan.pollutionManagement.pollution
                      .surfaceWaterQuality,
                  },
                  {
                    type: "Ambient Noise/Vibration",
                    ...wasteManagementPlan.pollutionManagement.pollution
                      .ambientNoiseVibration,
                  },
                  {
                    type: "Other",
                    ...wasteManagementPlan.pollutionManagement.pollution.other,
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
              <h4 className="font-semibold mb-2">Waste Management</h4>
              <Table
                dataSource={[
                  {
                    type: "Liquid Waste",
                    ...wasteManagementPlan.pollutionManagement.waste
                      .liquidWaste,
                  },
                  {
                    type: "Solid Waste",
                    ...wasteManagementPlan.pollutionManagement.waste.solidWaste,
                  },
                  {
                    type: "Hazardous Waste",
                    ...wasteManagementPlan.pollutionManagement.waste
                      .hazardousWaste,
                  },
                  {
                    type: "Plastic Waste",
                    ...wasteManagementPlan.pollutionManagement.waste
                      .plasticWaste,
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

        {/* --- BLOCK 8: Impact Assessment --- */}
        <Block title="8. Impact Assessment" className={styles.fullWidth}>
          {impactAssessment ? (
            <div className="space-y-4">
              {/* Phase-Based Impacts & Mitigation Measures */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-sm sm:text-base">
                  Impacts & Mitigation Measures by Phase
                </h4>

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
                      <h5 className="font-semibold text-gray-700 mb-3 text-xs sm:text-sm">
                        {phaseLabels[phase]}
                      </h5>

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

              {/* Stakeholder Consultations */}
              {impactAssessment.stakeholders &&
                impactAssessment.stakeholders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">
                      Stakeholder Consultations
                    </h4>
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={impactAssessment.stakeholders}
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
              {fuelStationData?.attachments?.evidenceOfConsultation && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Evidence of Stakeholder Consultation
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <FileTextOutlined />
                    <span>
                      Supporting document attached — refer to{" "}
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

        {/* --- BLOCK 9: Compliance & Management --- */}
        <Block
          title="9. Policy, Compliance & Management"
          className={styles.fullWidth}
        >
          {/* Legislative Compliance */}
          {complianceAndManagement?.legislativeCompliance && (
            <div>
              <h4 className="font-semibold mb-2">Legislative Compliance</h4>

              {complianceAndManagement.legislativeCompliance.nationalPolicies &&
                complianceAndManagement.legislativeCompliance.nationalPolicies
                  .length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium mb-1">National Policies</h5>
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
                    <h5 className="font-medium mb-1">National Acts</h5>
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
                    <h5 className="font-medium mb-1">National Regulations</h5>
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
                    <h5 className="font-medium mb-1">
                      Standards and Guidelines
                    </h5>
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
              <h4 className="font-semibold mb-2">
                Permits/Licenses/Certificates
              </h4>
              <div className="space-y-2">
                {Object.entries(complianceAndManagement.otherPermits).map(
                  ([key, permit]: [string, any]) => {
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
                                <span>
                                  Supporting document attached — refer to{" "}
                                  <strong>
                                    Block 9 (Supporting Documents)
                                  </strong>
                                </span>
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
                  }
                )}
              </div>
            </div>
          )}

          {/* Company Policies */}
          {complianceAndManagement?.companyPolicies && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Company Policies</h4>

              {complianceAndManagement.companyPolicies.environmental && (
                <div className="mb-3">
                  <h5 className="font-medium mb-1">Environmental Policy</h5>
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
                      <FileTextOutlined />
                      <span>
                        Supporting document attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {complianceAndManagement.companyPolicies.ohs && (
                <div className="mb-3">
                  <h5 className="font-medium mb-1">
                    Occupational Health & Safety Policy
                  </h5>
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
                      <FileTextOutlined />
                      <span>
                        Supporting document attached — refer to{" "}
                        <strong>Block 9 (Supporting Documents)</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Monitoring Plan */}
          {monitoringIndicators && monitoringIndicators.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Environmental Monitoring Plan
              </h4>
              <Table
                dataSource={monitoringIndicators}
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
                    render: (val: string) => (
                      <Tag color={val === "Yes" ? "green" : "default"}>
                        {val}
                      </Tag>
                    ),
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
              <h4 className="font-semibold mb-2">Staff Training Plan</h4>
              <Table
                dataSource={trainingRecords}
                columns={[
                  {
                    title: "Area of Training",
                    dataIndex: "areaOfTraining",
                    key: "areaOfTraining",
                    width: "25%",
                  },
                  {
                    title: "Record Kept",
                    dataIndex: "recordKept",
                    key: "recordKept",
                    width: "15%",
                    render: (val: string) => (
                      <Tag color={val === "Yes" ? "green" : "default"}>
                        {val}
                      </Tag>
                    ),
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
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>
          )}

          {/* Complaint Management */}
          {complianceAndManagement?.complaintManagement && (
            <div>
              <h4 className="font-semibold mb-2">
                Complaints/Complaint Management
              </h4>
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
                  <div className="flex items-center space-x-2 mt-1 mb-2">
                    <FileTextOutlined />
                    <span>
                      Register Evidence:{" "}
                      {
                        complianceAndManagement.complaintManagement
                          .registerEvidence.name
                      }
                    </span>
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
                  <div className="flex items-center space-x-2 mt-1 mb-2">
                    <FileTextOutlined />
                    <span>
                      Procedure Evidence:{" "}
                      {
                        complianceAndManagement.complaintManagement
                          .procedureEvidence.name
                      }
                    </span>
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

          {/* Enhancement Measures */}
          {complianceAndManagement?.enhancementMeasures &&
            complianceAndManagement.enhancementMeasures.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Enhancement Measures</h4>
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
                      title: "Budget",
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
        <Block title="10. Supporting Documents" className={styles.fullWidth}>
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

export default EnvironmentalEnergyReview;
