import React, { useState } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Card, Typography } from "antd";
import { CheckCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Block, Detail } from "../../../review/helpers";
import {
  formatDate,
  normalizeText,
  handleDocumentView,
  formatDate4,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title, Text } = Typography;

interface HealthcareEnvironmentalReviewProps {
  application: any;
}

export const HealthcareEnvironmentalPreview: React.FC<
  HealthcareEnvironmentalReviewProps
> = ({ application }) => {
  const [currentApp, setCurrentApp] = useState<any>(application);

  const { answers } = application;

  const { permitDetails } = answers || {};

  const healthcareData = answers?.environmentalPermitData?.healthCare || {};
  const {
    projectOverview,
    siteDetails,
    operationsDetails,
    impactAssessment,
    wasteManagementPlan,
    policyAndCompliance,
    attachments,
  } = healthcareData;

  if (!currentApp) {
    return <div>Loading application details...</div>;
  }

  // Helper function to render monitoring indicators
  const renderMonitoringIndicators = () => {
    if (!policyAndCompliance?.monitoringPlan) return null;

    const plan = policyAndCompliance.monitoringPlan;
    const indicators = [];

    // Add predefined indicators
    const predefinedKeys = [
      { key: "patientsPerAnnum", label: "Patients per annum" },
      { key: "biomedicalWasteVolume", label: "Biomedical waste volume" },
      { key: "solidWasteManagement", label: "Solid waste management" },
      { key: "liquidWasteVolume", label: "Liquid waste volume" },
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
      indicators.push(...plan.otherIndicators);
    }

    return indicators;
  };

  // Helper function to render training records
  const renderTrainingRecords = () => {
    if (!policyAndCompliance?.trainingPlan) return null;

    const plan = policyAndCompliance.trainingPlan;
    const records = [];

    // Add predefined training records
    const predefinedKeys = [
      { key: "environmentalManagement", label: "Environmental Management" },
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health & Safety",
      },
      { key: "fireManagement", label: "Fire Management" },
      { key: "sops", label: "Standard Operating Procedures (SOPs)" },
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
      records.push(...plan.otherTrainings);
    }

    return records;
  };

  const monitoringIndicators = renderMonitoringIndicators();
  const trainingRecords = renderTrainingRecords();

  return (
    <div className={styles.reviewPage}>
      <div className="mb-8">
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Healthcare Environmental Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-8"></div>
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
          <Detail label="Permit Category:" value="HEALTH SECTOR" />
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
          <div className="mb-6">
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
          </div>

          {/* Adjacent Land Uses */}
          {siteDetails?.adjacentLandUses &&
            siteDetails.adjacentLandUses.length > 0 && (
              <div className="mb-6 pt-6 border-t border-gray-200">
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

        {/* --- BLOCK 5: Operations Details --- */}
        <Block title="5. Operations Details" className={styles.fullWidth}>
          <Detail
            label="Facility Types (General):"
            value={operationsDetails?.facilityTypes?.general?.join(", ")}
          />
          <Detail
            label="Facility Types (Standalone):"
            value={operationsDetails?.facilityTypes?.standalone?.join(", ")}
          />
          <Detail
            label="Other Facility Types:"
            value={operationsDetails?.facilityTypes?.other}
          />
          <Detail
            label="Services Provided:"
            value={operationsDetails?.servicesProvided?.main?.join(", ")}
          />
          <Detail
            label="Other Services:"
            value={operationsDetails?.servicesProvided?.other}
          />
          <Detail
            label="Land Take (acres):"
            value={operationsDetails?.landTakeAcres}
          />
          <Detail label="Number of Beds:" value={operationsDetails?.numBeds} />
          <Detail
            label="Mortuary Capacity:"
            value={operationsDetails?.mortuaryCapacity}
          />
          <Detail
            label="Car Park Capacity:"
            value={operationsDetails?.carParkCapacity}
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
              value={operationsDetails?.workforce?.total}
            />
            <Detail
              label="Management:"
              value={operationsDetails?.workforce?.management}
            />
            <Detail
              label="Senior Staff:"
              value={operationsDetails?.workforce?.senior}
            />
            <Detail
              label="Junior Staff:"
              value={operationsDetails?.workforce?.junior}
            />
            <Detail
              label="Casual Workers:"
              value={operationsDetails?.workforce?.casuals}
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
              value={operationsDetails?.water?.sources?.join(", ")}
            />
            {operationsDetails?.water?.otherSources && (
              <Detail
                label="Other Water Sources:"
                value={operationsDetails?.water?.otherSources}
              />
            )}
            <Detail
              label="Has Reservoir:"
              value={
                operationsDetails?.water?.storage?.hasReservoir ? "Yes" : "No"
              }
            />
            {operationsDetails?.water?.storage?.hasReservoir && (
              <>
                <Detail
                  label="Reservoir Count:"
                  value={operationsDetails?.water?.storage?.reservoirCount}
                />
                <Detail
                  label="Reservoir Capacity (Litres):"
                  value={
                    operationsDetails?.water?.storage?.reservoirCapacityLitres
                  }
                />
              </>
            )}
            {operationsDetails?.water?.storage?.otherStorageMethod && (
              <Detail
                label="Other Storage Method:"
                value={operationsDetails?.water?.storage?.otherStorageMethod}
              />
            )}
            <Detail
              label="Annual Water Consumption:"
              value={operationsDetails?.water?.annualConsumption}
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
              value={operationsDetails?.power?.sources?.join(", ")}
            />
            {operationsDetails?.power?.otherSources && (
              <Detail
                label="Other Power Sources:"
                value={operationsDetails?.power?.otherSources}
              />
            )}
            {operationsDetails?.power?.generatorCapacityKVA && (
              <Detail
                label="Generator Capacity (KVA):"
                value={operationsDetails?.power?.generatorCapacityKVA}
              />
            )}
            {operationsDetails?.power?.solarCapacityKW && (
              <Detail
                label="Solar Capacity (KW):"
                value={operationsDetails?.power?.solarCapacityKW}
              />
            )}
            {operationsDetails?.power?.otherSourceDetails && (
              <Detail
                label="Other Source Details:"
                value={operationsDetails?.power?.otherSourceDetails}
              />
            )}
            {/* Custom Source Capacities */}
            {operationsDetails?.power?.customSourceCapacities &&
              Object.keys(operationsDetails.power?.customSourceCapacities)
                .length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Title
                    level={5}
                    className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                  >
                    Custom Power Source Capacities
                  </Title>
                  {Object.entries(
                    operationsDetails.power?.customSourceCapacities
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
              value={operationsDetails?.power?.annualConsumptionKWH}
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
              value={operationsDetails?.washrooms?.areAvailable ? "Yes" : "No"}
            />
            <Detail
              label="Separate Male/Female Washrooms:"
              value={
                operationsDetails?.washrooms?.areSeparateForMaleFemale
                  ? "Yes"
                  : "No"
              }
            />
            <Detail
              label="Washroom Count:"
              value={operationsDetails?.washrooms?.count}
            />
            <Detail
              label="Cleaning Frequency:"
              value={operationsDetails?.washrooms?.cleaningFrequency}
            />
            <Detail
              label="Access Road Type:"
              value={operationsDetails?.traffic?.accessRoadIs}
            />
            <Detail
              label="Parking Lot Capacity:"
              value={operationsDetails?.traffic?.parkingLotCapacity}
            />
            <Detail
              label="Drainage System:"
              value={operationsDetails?.drainage?.hasSystem ? "Yes" : "No"}
            />
            <Detail
              label="Drainage Condition:"
              value={operationsDetails?.drainage?.condition}
            />
          </div>
        </Block>

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
                        className="mb-6 pb-6 border-b last:border-b-0 last:pb-0 pt-4 first:pt-0"
                      >
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-4 text-gray-700"
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
                    <div className="mt-6 pt-6 border-t border-gray-200">
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
              </div>
            ) : (
              <Text type="secondary">No impact assessment data available</Text>
            )}
          </Block>
        )}

        {/* --- BLOCK 6: Waste Management Plan (Renewal Applications Only) --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="6. Waste Management Plan" className={styles.fullWidth}>
            {wasteManagementPlan ? (
              <div className="space-y-4">
                {/* General Impacts */}
                {wasteManagementPlan?.generalImpacts && (
                  <div>
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      General Environmental Impacts
                    </Title>
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
                          impactType: key
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
                          title: "Receiving Medium",
                          dataIndex: "receivingMedium",
                          key: "receivingMedium",
                          width: "25%",
                        },
                      ]}
                    />
                  </div>
                )}

                {/* Hazardous Waste Generation */}
                {wasteManagementPlan?.hazardousWasteGeneration && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Hazardous/Biomedical Waste Generation
                    </Title>
                    <Table
                      dataSource={Object.entries(
                        wasteManagementPlan.hazardousWasteGeneration
                      )
                        .filter(
                          ([key, waste]: [string, any]) => waste && waste.ticked
                        )
                        .map(([key, waste]: [string, any]) => ({
                          key,
                          wasteType:
                            key === "other" && waste.typeName
                              ? waste.typeName
                              : key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase()),
                          estimatedQty: waste.estimatedQty,
                          sourceImpact: waste.sourceImpact,
                        }))}
                      pagination={false}
                      size="small"
                      rowKey="key"
                      columns={[
                        {
                          title: "Waste Type",
                          dataIndex: "wasteType",
                          key: "wasteType",
                          width: "35%",
                        },
                        {
                          title: "Estimated Quantity",
                          dataIndex: "estimatedQty",
                          key: "estimatedQty",
                          width: "30%",
                        },
                        {
                          title: "Source/Impact",
                          dataIndex: "sourceImpact",
                          key: "sourceImpact",
                          width: "35%",
                        },
                      ]}
                    />
                  </div>
                )}

                {/* General Impact Management */}
                {wasteManagementPlan?.generalImpactManagement && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      General Impact Management
                    </Title>
                    <Detail
                      label="Solid Waste Management:"
                      value={
                        wasteManagementPlan.generalImpactManagement.solidWaste
                      }
                    />
                    <Detail
                      label="Liquid Waste Management:"
                      value={
                        wasteManagementPlan.generalImpactManagement.liquidWaste
                      }
                    />
                    <Detail
                      label="Air Emissions Management:"
                      value={
                        wasteManagementPlan.generalImpactManagement.airEmissions
                      }
                    />
                    <Detail
                      label="Noise Management:"
                      value={wasteManagementPlan.generalImpactManagement.noise}
                    />
                    {wasteManagementPlan.generalImpactManagement.other && (
                      <Detail
                        label="Other Management:"
                        value={
                          wasteManagementPlan.generalImpactManagement.other
                        }
                      />
                    )}
                  </div>
                )}

                {/* Hazardous Waste Management */}
                {wasteManagementPlan?.hazardousWasteManagement && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Hazardous Waste Management
                    </Title>

                    {wasteManagementPlan.hazardousWasteManagement.equipment && (
                      <div className="mb-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Equipment/Control Measures
                        </Title>
                        <div className="space-y-1">
                          {Object.entries(
                            wasteManagementPlan.hazardousWasteManagement
                              .equipment
                          ).map(([key, equipment]: [string, any]) => {
                            if (!equipment || !equipment.ticked) return null;
                            const displayName = key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());
                            return (
                              <div
                                key={key}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircleOutlined className="text-green-500" />
                                <span>{displayName}</span>
                                {equipment.controlMeasureDescription && (
                                  <span className="text-gray-600">
                                    - {equipment.controlMeasureDescription}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {wasteManagementPlan.hazardousWasteManagement
                      .wasteTypes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Waste Type Specific Measures
                        </Title>
                        <div className="space-y-1">
                          {Object.entries(
                            wasteManagementPlan.hazardousWasteManagement
                              .wasteTypes
                          ).map(([key, wasteType]: [string, any]) => {
                            if (!wasteType || !wasteType.ticked) return null;
                            const displayName =
                              key === "other" && wasteType.typeName
                                ? wasteType.typeName
                                : key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase());
                            return (
                              <div
                                key={key}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircleOutlined className="text-green-500" />
                                <span>{displayName}</span>
                                {wasteType.controlMeasureDescription && (
                                  <span className="text-gray-600">
                                    - {wasteType.controlMeasureDescription}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Text type="secondary">No waste management plan available</Text>
            )}
          </Block>
        )}

        {/* --- BLOCK 7: Policy and Compliance --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block title="7. Policy and Compliance" className={styles.fullWidth}>
            {policyAndCompliance ? (
              <div className="space-y-4">
                {/* Legislative Compliance */}
                {policyAndCompliance?.legislativeCompliance && (
                  <div>
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Legislative Compliance
                    </Title>

                    {policyAndCompliance.legislativeCompliance
                      .nationalPolicies &&
                      policyAndCompliance.legislativeCompliance.nationalPolicies
                        .length > 0 && (
                        <div className="mb-4">
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            National Policies
                          </Title>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            {policyAndCompliance.legislativeCompliance.nationalPolicies.map(
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

                    {policyAndCompliance.legislativeCompliance.nationalActs &&
                      policyAndCompliance.legislativeCompliance.nationalActs
                        .length > 0 && (
                        <div className="mb-4 pt-4 border-t border-gray-200">
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            National Acts
                          </Title>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            {policyAndCompliance.legislativeCompliance.nationalActs.map(
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

                    {policyAndCompliance.legislativeCompliance
                      .nationalRegulations &&
                      policyAndCompliance.legislativeCompliance
                        .nationalRegulations.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-gray-200">
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            National Regulations
                          </Title>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            {policyAndCompliance.legislativeCompliance.nationalRegulations.map(
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

                    {policyAndCompliance.legislativeCompliance
                      .standardsAndGuidelines &&
                      policyAndCompliance.legislativeCompliance
                        .standardsAndGuidelines.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-gray-200">
                          <Title
                            level={5}
                            className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                          >
                            Standards and Guidelines
                          </Title>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            {policyAndCompliance.legislativeCompliance.standardsAndGuidelines.map(
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
                {policyAndCompliance?.otherPermits && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Permits/Licenses/Certificates
                    </Title>
                    <div className="space-y-2">
                      {Object.entries(
                        policyAndCompliance?.otherPermits || {}
                      ).map(([key, permit]: [string, any]) => {
                        const displayName =
                          key === "environmentalPermit"
                            ? "Environmental Permit"
                            : key === "firePermit"
                            ? "Fire Permit/Certificate"
                            : key === "hefraLicense"
                            ? "Health Facilities Regulatory Agency (HeFRA) License"
                            : key === "businessRegistration"
                            ? "Business/Company Registration Certificate from Registrar General"
                            : key === "mortuaryLicense"
                            ? "Mortuary and Funeral Facility Agency License"
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
                                      {permit.supportingDocument?.name ||
                                        "Attachment"}{" "}
                                      attached — refer to{" "}
                                      <strong>
                                        Block 8 (Supporting Documents)
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
                      })}
                    </div>
                  </div>
                )}

                {/* Company Policies */}
                {policyAndCompliance?.companyPolicies && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Company Policies
                    </Title>

                    {policyAndCompliance.companyPolicies.environmental && (
                      <div className="mb-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Environmental Policy
                        </Title>
                        <Detail
                          label="Statement:"
                          value={
                            policyAndCompliance.companyPolicies.environmental
                              .statement
                          }
                        />
                        <Detail
                          label="Objective:"
                          value={
                            policyAndCompliance.companyPolicies.environmental
                              .objective
                          }
                        />
                        <Detail
                          label="Target Strategy:"
                          value={
                            policyAndCompliance.companyPolicies.environmental
                              .targetStrategy
                          }
                        />
                        {policyAndCompliance.companyPolicies.environmental
                          .policyDoc && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Text className="text-red-600">
                              Policy Document{" "}
                              {policyAndCompliance.companyPolicies.environmental
                                ?.policyDoc?.name || "Attachment"}{" "}
                              attached — refer to{" "}
                              <strong>Block 8 (Supporting Documents)</strong>
                            </Text>
                          </div>
                        )}
                      </div>
                    )}

                    {policyAndCompliance.companyPolicies.ohs && (
                      <div className="mb-4 pt-4 border-t border-gray-200">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Occupational Health & Safety Policy
                        </Title>
                        <Detail
                          label="Statement:"
                          value={
                            policyAndCompliance.companyPolicies.ohs.statement
                          }
                        />
                        <Detail
                          label="Objective:"
                          value={
                            policyAndCompliance.companyPolicies.ohs.objective
                          }
                        />
                        <Detail
                          label="Target Strategy:"
                          value={
                            policyAndCompliance.companyPolicies.ohs
                              .targetStrategy
                          }
                        />
                        {policyAndCompliance.companyPolicies.ohs.policyDoc && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Text className="text-red-600">
                              Policy Document{" "}
                              {policyAndCompliance.companyPolicies.ohs
                                ?.policyDoc?.name || "Attachment"}{" "}
                              attached — refer to{" "}
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
                        Monitoring Plan
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
                        Training Plan
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
                {policyAndCompliance?.csrActivities && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Corporate Social Responsibility
                    </Title>
                    <Detail
                      label="CSR Activities:"
                      value={policyAndCompliance.csrActivities}
                    />
                  </div>
                )}

                {/* Complaint Management - Only for renewal applications */}
                {permitDetails?.applicationType === "renewal" &&
                  policyAndCompliance?.complaintManagement && (
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
                          policyAndCompliance.complaintManagement.hasRegister
                            ? "Yes"
                            : "No"
                        }
                      />
                      {policyAndCompliance.complaintManagement.hasRegister &&
                        policyAndCompliance.complaintManagement
                          .registerEvidence && (
                          <div className="flex items-center space-x-2 mt-1">
                            <FileTextOutlined />
                            <Text className="text-red-600">
                              Register Evidence{" "}
                              {policyAndCompliance.complaintManagement
                                ?.registerEvidence?.name || "Attachment"}{" "}
                              attached — refer to{" "}
                              <strong>Block 8 (Supporting Documents)</strong>
                            </Text>
                          </div>
                        )}
                      <Detail
                        label="Has Complaint Procedure:"
                        value={
                          policyAndCompliance.complaintManagement.hasProcedure
                            ? "Yes"
                            : "No"
                        }
                      />
                      {policyAndCompliance.complaintManagement.hasProcedure &&
                        policyAndCompliance.complaintManagement
                          .procedureEvidence && (
                          <div className="flex items-center space-x-2 mt-1">
                            <FileTextOutlined />
                            <Text className="text-red-600">
                              Procedure Evidence{" "}
                              {policyAndCompliance.complaintManagement
                                ?.procedureEvidence?.name || "Attachment"}{" "}
                              attached — refer to{" "}
                              <strong>Block 8 (Supporting Documents)</strong>
                            </Text>
                          </div>
                        )}
                      {policyAndCompliance.complaintManagement
                        .receivedComplaints !== undefined && (
                        <>
                          <Detail
                            label="Received Complaints in Last Year:"
                            value={
                              policyAndCompliance.complaintManagement
                                .receivedComplaints
                                ? "Yes"
                                : "No"
                            }
                          />
                          {policyAndCompliance.complaintManagement
                            .receivedComplaints && (
                            <>
                              <Detail
                                label="Number of Complaints:"
                                value={
                                  policyAndCompliance.complaintManagement
                                    .numberOfComplaints
                                }
                              />
                              <Detail
                                label="Nature of Complaints:"
                                value={
                                  policyAndCompliance.complaintManagement
                                    .natureOfComplaints
                                }
                              />
                              <Detail
                                label="How Dealt With Complaints:"
                                value={
                                  policyAndCompliance.complaintManagement
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
                  policyAndCompliance?.challenges && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Title
                        level={4}
                        className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                      >
                        Challenges/Concerns
                      </Title>
                      <Detail
                        label="Major Environmental Challenges:"
                        value={policyAndCompliance.challenges}
                      />
                    </div>
                  )}

                {/* Enhancement Measures - Only for renewal applications */}
                {permitDetails?.applicationType === "renewal" &&
                  policyAndCompliance?.enhancementMeasures &&
                  policyAndCompliance.enhancementMeasures.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Title
                        level={4}
                        className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                      >
                        Environmental Enhancement Measures for the Ensuing Year
                      </Title>
                      <Table
                        dataSource={policyAndCompliance.enhancementMeasures}
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
            ) : (
              <Text type="secondary">
                No policy and compliance information available
              </Text>
            )}
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

export default HealthcareEnvironmentalPreview;
