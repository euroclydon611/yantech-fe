import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Table, Tag, Card, Alert, List, Button } from "antd";
import { EyeOutlined, FileOutlined, FileTextOutlined } from "@ant-design/icons";
import { Block, Detail } from "@/employee_portal_pages/components/review/helpers";

import {
  formatDate,
  formatDate4,
  formatLabel,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";

const { Text } = Typography;

interface EnvironmentalLPGReviewProps {
  application: any;
}

const EnvironmentalLPGReview: React.FC<EnvironmentalLPGReviewProps> = ({
  application,
}) => {
  const { clientId, submittedByAgent, answers } = application;

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

  console.log("lpgData:", lpgData?.subType);

  const preselectedUndertakingType = getUndertakingTypeFromSubType(
    lpgData?.subType
  );

  console.log(projectSpecification?.exchangePointCages);

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

        {/* --- BLOCK 5: Facility Specification --- */}
        <Block title="5. Facility Specification" className={styles.fullWidth}>
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
                <h4 className="font-semibold mb-2">LPG Storage Tanks</h4>
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
                          <div className="flex items-center space-x-2 mt-1">
                            <FileTextOutlined />
                            <span>
                              Supporting document attached — refer to{" "}
                              <strong>Block 9 (Supporting Documents)</strong>
                            </span>
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
          )}

          {/* Cylinder Storage Cages - Only for LPG Exchange Point */}
          {preselectedUndertakingType === "LPG Exchange Point" && (
            <>
              {projectSpecification?.exchangePointCages?.cages &&
                projectSpecification.exchangePointCages.cages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">
                      Cylinder Storage Cages
                    </h4>
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
              {projectSpecification?.servicesProvided &&
                projectSpecification.servicesProvided.length > 0 && (
                  <Detail
                    label="Services Provided:"
                    value={projectSpecification.servicesProvided
                      .map((s: string) => normalizeText(s))
                      .join(", ")}
                  />
                )}

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
                <h4 className="font-semibold mb-2">Safety Accessories</h4>
                <ul className="list-disc pl-5">
                  {projectSpecification.safetyAccessories.map(
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

        {/* --- BLOCK 6: Infrastructure & Utilities --- */}
        <Block
          title="6. Infrastructure & Utilities"
          className={styles.fullWidth}
        >
          {/* Forecourt Details */}
          {infrastructure?.forecourt && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Forecourt Details</h4>
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
                    value={infrastructure.water.storage.reservoirCapacityLitres}
                  />
                </>
              )}
              {infrastructure.water.storage?.otherStorageMethod && (
                <Detail
                  label="Other Storage Method:"
                  value={infrastructure.water.storage.otherStorageMethod}
                />
              )}
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
              <h4 className="font-semibold mb-2">Washrooms</h4>
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
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Traffic & Access</h4>
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
                <>
                  {infrastructure.drainage.type && (
                    <Detail
                      label="Drainage Type:"
                      value={normalizeText(infrastructure.drainage.type)}
                    />
                  )}
                  {infrastructure.drainage.dischargePoint && (
                    <Detail
                      label="Discharge Point:"
                      value={infrastructure.drainage.dischargePoint}
                    />
                  )}
                  {infrastructure.drainage.hasSeparator !== undefined && (
                    <Detail
                      label="Has Oil/Water Separator:"
                      value={
                        infrastructure.drainage.hasSeparator ? (
                          <Tag color="green">Yes</Tag>
                        ) : (
                          <Tag color="default">No</Tag>
                        )
                      }
                    />
                  )}
                </>
              )}
            </div>
          )}
        </Block>

        {/* --- BLOCK 7: Impact Assessment (for new applications) --- */}
        {permitDetails?.applicationType === "new_application" &&
          impactAssessment && (
            <Block title="7. Impact Assessment" className={styles.fullWidth}>
              {impactAssessment ? (
                <div className="space-y-4">
                  <Detail
                    label="Construction Phase Impacts:"
                    value={impactAssessment.constructionPhaseImpacts}
                  />
                  <Detail
                    label="Operation Phase Impacts:"
                    value={impactAssessment.operationPhaseImpacts}
                  />
                  <Detail
                    label="Construction Phase Mitigation:"
                    value={impactAssessment.constructionPhaseMitigation}
                  />
                  <Detail
                    label="Operation Phase Mitigation:"
                    value={impactAssessment.operationPhaseMitigation}
                  />

                  {impactAssessment.stakeholders &&
                    impactAssessment.stakeholders.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">
                          Stakeholder Consultations
                        </h4>
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
                              title: "Relation to Project",
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
                        />
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

        {/* --- BLOCK 8: Waste Management Plan (for renewals) --- */}
        {permitDetails?.applicationType === "renewal" &&
          wasteManagementPlan && (
            <Block
              title="7. Waste Management Plan"
              className={styles.fullWidth}
            >
              {/* General Impacts */}
              {wasteManagementPlan?.generalImpacts && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">
                    Environmental Impacts Identification
                  </h4>
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
                        ...wasteManagementPlan.pollutionManagement.pollution
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
                        ...wasteManagementPlan.pollutionManagement.waste
                          .solidWaste,
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
                        {!permit.isAvailable && permit.reasonIfNotAvailable && (
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
              <h4 className="font-semibold mb-2">Monitoring Plan</h4>
              <Table
                dataSource={monitoringIndicators}
                columns={[
                  {
                    title: "Indicator",
                    dataIndex: "indicator",
                    key: "indicator",
                  },
                  {
                    title: "Parameters Measured",
                    dataIndex: "parametersMeasured",
                    key: "parametersMeasured",
                  },
                  {
                    title: "Frequency",
                    dataIndex: "qtyMonitoredFrequency",
                    key: "qtyMonitoredFrequency",
                  },
                  {
                    title: "Treatment/Disposal Mode",
                    dataIndex: "disposalTreatmentMode",
                    key: "disposalTreatmentMode",
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
              <h4 className="font-semibold mb-2">Training Plan</h4>
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
                      <div className="flex items-center space-x-2 mt-1">
                        <FileTextOutlined />
                        <span>
                          Supporting document attached — refer to{" "}
                          <strong>Block 9 (Supporting Documents)</strong>
                        </span>
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
                  },
                  {
                    title: "Record Kept",
                    dataIndex: "recordKept",
                    key: "recordKept",
                    width: "12%",
                    render: (value: boolean) =>
                      value === undefined ? "-" : value ? "Yes" : "No",
                  },
                  {
                    title: "Date of Training",
                    dataIndex: "dateOfTraining",
                    key: "dateOfTraining",
                    width: "15%",
                    render: (date: string) => (date ? formatDate(date) : "-"),
                  },
                  {
                    title: "Training Details",
                    dataIndex: "trainingDetails",
                    key: "trainingDetails",
                    width: "38%",
                  },
                  // {
                  //   title: "Supporting Documents",
                  //   key: "supportingDocuments",
                  //   width: "15%",
                  //   render: (record: any) =>
                  //     record.supportingDocuments &&
                  //     record.supportingDocuments.length > 0 ? (
                  //       <span className="text-blue-600">
                  //         {record.supportingDocuments.length} file(s)
                  //       </span>
                  //     ) : (
                  //       <span className="text-gray-400">None</span>
                  //     ),
                  // },
                ]}
              />
            </div>
          )}

          {/* CSR Activities - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.csrActivities && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">
                  Corporate Social Responsibility (CSR) Activities
                </h4>
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
                <h4 className="font-semibold mb-2">Complaint Management</h4>
                <Detail
                  label="Complaint Register Available:"
                  value={
                    complianceAndManagement.complaintManagement.hasRegister ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="red">No</Tag>
                    )
                  }
                />
                <Detail
                  label="Complaint Handling Procedure Available:"
                  value={
                    complianceAndManagement.complaintManagement.hasProcedure ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="red">No</Tag>
                    )
                  }
                />
                <Detail
                  label="Received Complaints in Last Year:"
                  value={
                    complianceAndManagement.complaintManagement
                      .receivedComplaints ? (
                      <Tag color="orange">Yes</Tag>
                    ) : (
                      <Tag color="green">No</Tag>
                    )
                  }
                />

                {complianceAndManagement.complaintManagement
                  .receivedComplaints && (
                  <>
                    <Detail
                      label="Number of Complaints:"
                      value={
                        complianceAndManagement.complaintManagement
                          .numberOfComplaints || "—"
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
                      label="How Were Complaints Dealt With:"
                      value={
                        complianceAndManagement.complaintManagement
                          .howDealtWithComplaints
                      }
                    />
                  </>
                )}
              </div>
            )}

          {/* Challenges/Concerns - Renewal only */}
          {permitDetails?.applicationType === "renewal" &&
            complianceAndManagement?.challenges && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">
                  Major Environmental Challenges/Concerns
                </h4>
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
                <h4 className="font-semibold mb-2">
                  Enhancement/Improvement Measures
                </h4>
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

        {/* --- BLOCK 10: Attachments --- */}
        <Block
          title={`${
            permitDetails?.applicationType === "new_application" ? "9" : "9"
          }. Supporting Documents`}
          className={styles.fullWidth}
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

export default EnvironmentalLPGReview;
