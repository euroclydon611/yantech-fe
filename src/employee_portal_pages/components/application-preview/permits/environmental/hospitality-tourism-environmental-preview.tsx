import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Typography, Table, Tag, Card } from "antd";
import { Block, Detail } from "../../../review/helpers";

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

interface HospitalityTourismEnvironmentalReviewProps {
  application: any;
}

export const HospitalityTourismEnvironmentalPreview: React.FC<
  HospitalityTourismEnvironmentalReviewProps
> = ({ application }) => {
  const { answers } = application;

  const permitDetails = answers?.permitDetails || {};

  const hospitalityTourismData =
    answers?.environmentalPermitData?.hospitality || {};
  const {
    projectOverview,
    siteDetails,
    entitySpecification,
    infrastructure,
    impactAssessment,
    wasteManagementPlan,
    complianceAndManagement,
    attachments,
  } = hospitalityTourismData;

  const applicationType = permitDetails?.applicationType;
  const isNewApplication = applicationType === "new_application";
  const isRenewal = applicationType === "renewal";

  // Helper function to render monitoring indicators
  const renderMonitoringIndicators = () => {
    if (!complianceAndManagement?.monitoringPlan) return null;

    const plan = complianceAndManagement.monitoringPlan;
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

  const renderTrainingRecords = () => {
    if (!complianceAndManagement?.trainingPlan) return null;

    const plan = complianceAndManagement.trainingPlan;
    const records = [];

    // Add predefined training records
    const predefinedKeys = [
      { key: "environmentalManagement", label: "Environmental Management" },
      {
        key: "occupationalHealthAndSafety",
        label: "Occupational Health & Safety",
      },
      { key: "fireManagement", label: "Fire Management" },
      { key: "wasteManagement", label: "Waste Management" },
      { key: "customerService", label: "Customer Service" },
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

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0">
          Hospitality & Tourism Environmental Permit Application Review
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
          <Detail label="Permit Category:" value="HOSPITALITY & TOURISM" />
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

        {/* --- BLOCK 5: Entity Specification --- */}
        <Block title="5. Entity Specification" className={styles.fullWidth}>
          {entitySpecification ? (
            <div className="space-y-4">
              {/* Type of Undertaking */}
              {entitySpecification?.typeOfUndertaking && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Type of Undertaking
                  </Title>
                  {entitySpecification.typeOfUndertaking.selectedType && (
                    <Detail
                      label="Selected Type:"
                      value={entitySpecification.typeOfUndertaking.selectedType
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    />
                  )}

                  {/* Accommodation Details */}
                  {entitySpecification.typeOfUndertaking.selectedType ===
                    "accommodation" &&
                    entitySpecification.typeOfUndertaking.accommodation && (
                      <div className="mt-3 ml-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Accommodation Details
                        </Title>
                        {entitySpecification.typeOfUndertaking.accommodation
                          .type && (
                          <Detail
                            label="Type:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .accommodation.type
                            }
                          />
                        )}
                        {entitySpecification.typeOfUndertaking.accommodation
                          .type === "Other" &&
                          entitySpecification.typeOfUndertaking.accommodation
                            .typeOther && (
                            <Detail
                              label="Other Type:"
                              value={
                                entitySpecification.typeOfUndertaking
                                  .accommodation.typeOther
                              }
                            />
                          )}
                        {entitySpecification.typeOfUndertaking.accommodation
                          .totalRooms !== undefined && (
                          <Detail
                            label="Total Rooms:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .accommodation.totalRooms
                            }
                          />
                        )}
                        {entitySpecification.typeOfUndertaking.accommodation
                          .totalBeds !== undefined && (
                          <Detail
                            label="Total Beds:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .accommodation.totalBeds
                            }
                          />
                        )}
                      </div>
                    )}

                  {/* Attractions Details */}
                  {entitySpecification.typeOfUndertaking.selectedType ===
                    "attractions" &&
                    entitySpecification.typeOfUndertaking.attractions && (
                      <div className="mt-3 ml-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Attractions Details
                        </Title>
                        {entitySpecification.typeOfUndertaking.attractions
                          .types &&
                          entitySpecification.typeOfUndertaking.attractions
                            .types.length > 0 && (
                            <Detail
                              label="Types:"
                              value={entitySpecification.typeOfUndertaking.attractions.types.join(
                                ", "
                              )}
                            />
                          )}
                        {entitySpecification.typeOfUndertaking.attractions
                          .typesOther && (
                          <Detail
                            label="Other Types:"
                            value={
                              entitySpecification.typeOfUndertaking.attractions
                                .typesOther
                            }
                          />
                        )}
                        {entitySpecification.typeOfUndertaking.attractions
                          .ownership && (
                          <Detail
                            label="Ownership:"
                            value={
                              entitySpecification.typeOfUndertaking.attractions
                                .ownership
                            }
                          />
                        )}
                      </div>
                    )}

                  {/* Entertainment Details */}
                  {entitySpecification.typeOfUndertaking.selectedType ===
                    "entertainment" &&
                    entitySpecification.typeOfUndertaking.entertainment && (
                      <div className="mt-3 ml-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Entertainment Details
                        </Title>
                        {entitySpecification.typeOfUndertaking.entertainment
                          .types &&
                          entitySpecification.typeOfUndertaking.entertainment
                            .types.length > 0 && (
                            <Detail
                              label="Types:"
                              value={entitySpecification.typeOfUndertaking.entertainment.types.join(
                                ", "
                              )}
                            />
                          )}
                        {entitySpecification.typeOfUndertaking.entertainment
                          .typesOther && (
                          <Detail
                            label="Other Types:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .entertainment.typesOther
                            }
                          />
                        )}
                        {entitySpecification.typeOfUndertaking.entertainment
                          .seatingCapacity !== undefined && (
                          <Detail
                            label="Seating Capacity:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .entertainment.seatingCapacity
                            }
                          />
                        )}
                      </div>
                    )}

                  {/* Food & Beverage Details */}
                  {entitySpecification.typeOfUndertaking.selectedType ===
                    "foodAndBeverage" &&
                    entitySpecification.typeOfUndertaking.foodAndBeverage && (
                      <div className="mt-3 ml-4">
                        <Title
                          level={5}
                          className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                        >
                          Food & Beverage Details
                        </Title>
                        {entitySpecification.typeOfUndertaking.foodAndBeverage
                          .types &&
                          entitySpecification.typeOfUndertaking.foodAndBeverage
                            .types.length > 0 && (
                            <Detail
                              label="Types:"
                              value={entitySpecification.typeOfUndertaking.foodAndBeverage.types.join(
                                ", "
                              )}
                            />
                          )}
                        {entitySpecification.typeOfUndertaking.foodAndBeverage
                          .typesOther && (
                          <Detail
                            label="Other Types:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .foodAndBeverage.typesOther
                            }
                          />
                        )}
                        {entitySpecification.typeOfUndertaking.foodAndBeverage
                          .seatingCapacity !== undefined && (
                          <Detail
                            label="Seating Capacity:"
                            value={
                              entitySpecification.typeOfUndertaking
                                .foodAndBeverage.seatingCapacity
                            }
                          />
                        )}
                      </div>
                    )}

                  {/* Other Undertaking */}
                  {entitySpecification.typeOfUndertaking.selectedType ===
                    "other" &&
                    entitySpecification.typeOfUndertaking.other && (
                      <div className="mt-3 ml-4">
                        <Detail
                          label="Other Undertaking Details:"
                          value={entitySpecification.typeOfUndertaking.other}
                        />
                      </div>
                    )}
                </div>
              )}

              {/* Classification */}
              {entitySpecification?.classification && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Classification
                  </Title>
                  {entitySpecification.classification.starRating &&
                    entitySpecification.classification.starRating.length >
                      0 && (
                      <Detail
                        label="Star Rating:"
                        value={entitySpecification.classification.starRating.join(
                          ", "
                        )}
                      />
                    )}
                  {entitySpecification.classification.other && (
                    <Detail
                      label="Other Classification:"
                      value={entitySpecification.classification.other}
                    />
                  )}
                </div>
              )}

              {/* Amenities & Facilities */}
              {entitySpecification?.amenities &&
                Object.keys(entitySpecification?.amenities || {}).length >
                  0 && (
                  <div>
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Amenities & Facilities
                    </Title>
                    <Table
                      dataSource={Object.entries(
                        entitySpecification?.amenities
                      ).filter(
                        ([key, amenity]: [string, any]) => amenity?.ticked
                      )}
                      columns={[
                        {
                          title: "Amenity",
                          dataIndex: "0",
                          key: "amenity",
                          width: "40%",
                          render: (key: string) =>
                            key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase()),
                        },
                        {
                          title: "Capacity/Details",
                          dataIndex: "1",
                          key: "capacity",
                          width: "60%",
                          render: (amenity: any) => amenity?.capacity || "-",
                        },
                      ]}
                      pagination={false}
                      size="small"
                      bordered
                      rowKey="0"
                    />
                  </div>
                )}

              {/* Workforce */}
              {entitySpecification?.workforce && (
                <div>
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Workforce
                  </Title>
                  {entitySpecification.workforce.total !== undefined && (
                    <Detail
                      label="Total Staff:"
                      value={entitySpecification.workforce.total}
                    />
                  )}
                  {entitySpecification.workforce.management !== undefined && (
                    <Detail
                      label="Management:"
                      value={entitySpecification.workforce.management}
                    />
                  )}
                  {entitySpecification.workforce.senior !== undefined && (
                    <Detail
                      label="Senior Staff:"
                      value={entitySpecification.workforce.senior}
                    />
                  )}
                  {entitySpecification.workforce.junior !== undefined && (
                    <Detail
                      label="Junior Staff:"
                      value={entitySpecification.workforce.junior}
                    />
                  )}
                  {entitySpecification.workforce.casuals !== undefined && (
                    <Detail
                      label="Casual Workers:"
                      value={entitySpecification.workforce.casuals}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No entity specification data available
            </p>
          )}
        </Block>

        {/* --- BLOCK 6: Infrastructure & Utilities --- */}
        <Block
          title="6. Infrastructure & Utilities"
          className={styles.fullWidth}
        >
          {infrastructure ? (
            <div className="space-y-4">
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
                  {infrastructure?.water?.otherSources && (
                    <Detail
                      label="Other Water Sources:"
                      value={infrastructure?.water?.otherSources}
                    />
                  )}
                  <Detail
                    label="Has Reservoir:"
                    value={
                      infrastructure?.water?.storage?.hasReservoir
                        ? "Yes"
                        : "No"
                    }
                  />
                  {infrastructure?.water?.storage?.hasReservoir && (
                    <>
                      <Detail
                        label="Reservoir Count:"
                        value={infrastructure?.water?.storage?.reservoirCount}
                      />
                      <Detail
                        label="Reservoir Capacity (Litres):"
                        value={
                          infrastructure?.water?.storage
                            ?.reservoirCapacityLitres
                        }
                      />
                    </>
                  )}
                  {infrastructure?.water?.storage?.otherStorageMethod && (
                    <Detail
                      label="Other Storage Method:"
                      value={infrastructure?.water?.storage?.otherStorageMethod}
                    />
                  )}
                  <Detail
                    label="Annual Water Consumption:"
                    value={infrastructure?.water?.annualConsumption}
                  />
                </div>
              )}

              {/* Fuel Usage */}
              {infrastructure.fuelUsage && (
                <div className="mb-4">
                  <Title
                    level={4}
                    className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                  >
                    Fuel Usage
                  </Title>

                  <Detail
                    label="Biomass (kg):"
                    value={
                      infrastructure?.fuelUsage?.biomassKg &&
                      `${infrastructure?.fuelUsage?.biomassKg} Kg`
                    }
                  />
                  <Detail
                    label="Diesel (L):"
                    value={
                      infrastructure?.fuelUsage?.dieselLitres &&
                      `${infrastructure?.fuelUsage?.dieselLitres} Litre(s)`
                    }
                  />
                  <Detail
                    label="Petrol (L):"
                    value={
                      infrastructure?.fuelUsage?.petrolLitres &&
                      `${infrastructure?.fuelUsage?.petrolLitres} Litre(s)`
                    }
                  />
                  <Detail
                    label="LPG (kg):"
                    value={
                      infrastructure?.fuelUsage?.lpgKg &&
                      `${infrastructure?.fuelUsage?.lpgKg} Kg`
                    }
                  />

                  <Detail
                    label="Other:"
                    value={infrastructure?.fuelUsage?.other}
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
                  {infrastructure?.power?.otherSources && (
                    <Detail
                      label="Other Power Sources:"
                      value={infrastructure?.power?.otherSources}
                    />
                  )}
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
                    label="Annual Power Consumption (KWH):"
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
                      infrastructure?.washrooms?.areAvailable ? "Yes" : "No"
                    }
                  />
                  <Detail
                    label="Separate Male/Female Washrooms:"
                    value={
                      infrastructure?.washrooms?.areSeparateForMaleFemale
                        ? "Yes"
                        : "No"
                    }
                  />
                  <Detail
                    label="Washroom Count:"
                    value={infrastructure?.washrooms?.count}
                  />
                  <Detail
                    label="Cleaning Frequency:"
                    value={infrastructure?.washrooms?.cleaningFrequency}
                  />
                </div>
              )}

              {/* Traffic & Parking */}
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
                    value={infrastructure?.traffic?.accessRoadIs}
                  />
                  <Detail
                    label="Parking Lot Capacity:"
                    value={infrastructure?.traffic?.parkingLotCapacity}
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
                    label="Drainage System:"
                    value={infrastructure?.drainage?.hasSystem ? "Yes" : "No"}
                  />
                  <Detail
                    label="Drainage Condition:"
                    value={infrastructure?.drainage?.condition}
                  />
                </div>
              )}
            </div>
          ) : (
            <Text type="secondary">
              No infrastructure information available
            </Text>
          )}
        </Block>

        {/* --- BLOCK 7: Impact Assessment (for New Applications) --- */}
        {isNewApplication && (
          <Block
            title="7. Stakeholder Consultations"
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

        {/* --- BLOCK 7/8: Waste Management Plan (for Renewals) --- */}
        {isRenewal && (
          <Block
            title={`${isNewApplication ? "8" : "7"}. Waste Management Plan`}
            className={styles.fullWidth}
          >
            {wasteManagementPlan ? (
              <div className="space-y-4">
                {/* General Impacts */}
                {wasteManagementPlan?.generalImpacts && (
                  <div>
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Environmental Impacts Identification
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

                {/* Pollution Management */}
                {(wasteManagementPlan?.pollutionManagement?.pollution ||
                  wasteManagementPlan?.pollutionManagement?.waste ||
                  wasteManagementPlan?.pollutionManagement?.additional) && (
                  <div className="mt-6 space-y-4">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Pollution Management Measures
                    </Title>

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
                            wasteManagementPlan?.pollutionManagement?.pollution
                          )
                            .filter(
                              ([key, item]: [string, any]) =>
                                item && item.ticked
                            )
                            .map(([key, item]: [string, any]) => {
                              const displayName =
                                key === "airEmissions"
                                  ? "Air Emissions"
                                  : key === "airTransmissionPollutants"
                                  ? "Air Transmission Pollutants"
                                  : key === "noiseLevel"
                                  ? "Noise Level"
                                  : key === "lightPollution"
                                  ? "Light Pollution"
                                  : key === "vibration"
                                  ? "Vibration"
                                  : key === "soilContamination"
                                  ? "Soil Contamination"
                                  : key === "stormwaterRunoffs"
                                  ? "Stormwater Runoffs"
                                  : key === "surfaceWaterQuality"
                                  ? "Surface Water Quality"
                                  : key === "ambientNoiseVibration"
                                  ? "Ambient Noise/Vibration"
                                  : key === "other"
                                  ? "Others"
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
                              title: "Pollution Type",
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
                                  : key === "liquidWasteEffluent"
                                  ? "Liquid Waste Effluent"
                                  : key === "solidWaste"
                                  ? "Solid Waste"
                                  : key === "hazardousWaste"
                                  ? "Hazardous Waste"
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

                    {/* Additional Category */}
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
                            wasteManagementPlan?.pollutionManagement?.additional
                          )
                            .filter(
                              ([key, item]: [string, any]) =>
                                item && item.ticked
                            )
                            .map(([key, item]: [string, any]) => {
                              const displayName =
                                key === "traffic"
                                  ? "Traffic"
                                  : key === "occupationalHealthSafety"
                                  ? "Occupational Health & Safety"
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
            ) : (
              <Text type="secondary">
                No waste management plan data available
              </Text>
            )}
          </Block>
        )}

        {/* --- Block 9/9: Compliance & Management --- */}
        {isRenewal && (
          <Block
            title={`${
              isNewApplication ? "8" : isRenewal ? "8" : "7"
            }. Compliance & Management`}
            className={styles.fullWidth}
          >
            {complianceAndManagement ? (
              <div className="space-y-4">
                {/* Legislative Compliance */}
                {complianceAndManagement?.legislativeCompliance && (
                  <div className="mb-4">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Legislative Compliance
                    </Title>

                    {complianceAndManagement.legislativeCompliance
                      .nationalPolicies &&
                      complianceAndManagement.legislativeCompliance
                        .nationalPolicies.length > 0 && (
                        <div className="mb-3">
                          <Detail
                            label="National Policies:"
                            value={complianceAndManagement.legislativeCompliance.nationalPolicies
                              .map((p: any) => p.name)
                              .join(", ")}
                          />
                        </div>
                      )}

                    {complianceAndManagement.legislativeCompliance
                      .nationalActs &&
                      complianceAndManagement.legislativeCompliance.nationalActs
                        .length > 0 && (
                        <div className="mb-3">
                          <Detail
                            label="National Acts:"
                            value={complianceAndManagement.legislativeCompliance.nationalActs
                              .map((a: any) => a.name)
                              .join(", ")}
                          />
                        </div>
                      )}

                    {complianceAndManagement.legislativeCompliance
                      .nationalRegulations &&
                      complianceAndManagement.legislativeCompliance
                        .nationalRegulations.length > 0 && (
                        <div className="mb-3">
                          <Detail
                            label="National Regulations:"
                            value={complianceAndManagement.legislativeCompliance.nationalRegulations
                              .map((r: any) => r.name)
                              .join(", ")}
                          />
                        </div>
                      )}

                    {complianceAndManagement.legislativeCompliance
                      .standardsAndGuidelines &&
                      complianceAndManagement.legislativeCompliance
                        .standardsAndGuidelines.length > 0 && (
                        <div className="mb-3">
                          <Detail
                            label="Standards & Guidelines:"
                            value={complianceAndManagement.legislativeCompliance.standardsAndGuidelines
                              .map((s: any) => s.name)
                              .join(", ")}
                          />
                        </div>
                      )}
                  </div>
                )}

                {/* Other Permits/Licenses */}
                {complianceAndManagement?.otherPermits && (
                  <div className="mb-4">
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
                        const displayName = key
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
                                        Block 9 (Supporting Documents)
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
                {complianceAndManagement?.companyPolicies && (
                  <div>
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
                            complianceAndManagement.companyPolicies
                              .environmental.statement
                          }
                        />
                        <Detail
                          label="Objective:"
                          value={
                            complianceAndManagement.companyPolicies
                              .environmental.objective
                          }
                        />
                        <Detail
                          label="Target Strategy:"
                          value={
                            complianceAndManagement.companyPolicies
                              .environmental.targetStrategy
                          }
                        />
                        {complianceAndManagement.companyPolicies.environmental
                          .policyDoc && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Text className="text-red-600">
                              Policy Document{" "}
                              {complianceAndManagement.companyPolicies
                                ?.environmental?.policyDoc?.name ||
                                "Attachment"}{" "}
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
                            complianceAndManagement.companyPolicies.ohs
                              .statement
                          }
                        />
                        <Detail
                          label="Objective:"
                          value={
                            complianceAndManagement.companyPolicies.ohs
                              .objective
                          }
                        />
                        <Detail
                          label="Target Strategy:"
                          value={
                            complianceAndManagement.companyPolicies.ohs
                              .targetStrategy
                          }
                        />
                        {complianceAndManagement.companyPolicies.ohs
                          .policyDoc && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Text className="text-red-600">
                              Policy Document{" "}
                              {complianceAndManagement.companyPolicies.ohs
                                ?.policyDoc?.name || "Attachment"}{" "}
                              attached — refer to{" "}
                              <strong>Block 9 (Supporting Documents)</strong>
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Environmental Monitoring Plan (for Renewals) */}
                {isRenewal &&
                  monitoringIndicators &&
                  monitoringIndicators.length > 0 && (
                    <div className="mb-4">
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

                {/* Training Plan (for Renewals) */}
                {isRenewal && trainingRecords && trainingRecords.length > 0 && (
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
                        {
                          title: "Supporting Documents",
                          key: "supportingDocuments",
                          width: "15%",
                          render: (record: any) =>
                            record.supportingDocuments &&
                            record.supportingDocuments.length > 0
                              ? `${record.supportingDocuments.length} file(s)`
                              : "None",
                        },
                      ]}
                    />
                  </div>
                )}

                {/* Corporate Social Responsibility */}
                {complianceAndManagement?.corporateSocialResponsibility && (
                  <div className="mb-4">
                    <Title
                      level={4}
                      className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                    >
                      Corporate Social Responsibility
                    </Title>
                    <Detail
                      label="CSR Activities:"
                      value={
                        complianceAndManagement.corporateSocialResponsibility
                      }
                    />
                  </div>
                )}

                {/* Complaint Management (for Renewals) */}
                {isRenewal && complianceAndManagement?.complaintManagement && (
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

                {/* Challenges & Concerns (for Renewals) */}
                {isRenewal &&
                  complianceAndManagement?.challengesAndConcerns && (
                    <div className="mb-4">
                      <Title
                        level={4}
                        className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                      >
                        Challenges/Concerns
                      </Title>
                      <Detail
                        label="Major Environmental Challenges:"
                        value={complianceAndManagement?.challengesAndConcerns}
                      />
                    </div>
                  )}

                {/* Enhancement/Improvement Measures (for Renewals) */}
                {isRenewal &&
                  complianceAndManagement?.improvementMeasures &&
                  complianceAndManagement.improvementMeasures.length > 0 && (
                    <div className="mb-4">
                      <Title
                        level={4}
                        className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                      >
                        Environmental Enhancement Measures for the Ensuing Year
                      </Title>
                      <Table
                        dataSource={complianceAndManagement.improvementMeasures}
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
                No compliance and management information available
              </Text>
            )}
          </Block>
        )}

        {/* --- BLOCK 9/10: Supporting Documents --- */}
        <Block
          title={`${
            isNewApplication ? "9" : isRenewal ? "9" : "8"
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

export default HospitalityTourismEnvironmentalPreview;
