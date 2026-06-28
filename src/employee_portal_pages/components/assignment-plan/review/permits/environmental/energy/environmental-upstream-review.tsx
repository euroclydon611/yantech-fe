import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Empty, Table, Tag, Typography } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import { formatDate, formatDate4, normalizeText } from "@/utils/helperFunction";
const { Text } = Typography;

interface EnvironmentalUpstreamReviewProps {
  application: any;
}

export const EnvironmentalUpstreamReview: React.FC<
  EnvironmentalUpstreamReviewProps
> = ({ application }) => {
  const { clientId, submittedByAgent, answers } = application;

  const { permitDetails } = answers || {};

  const energyData = answers?.environmentalPermitData?.energy || {};
  const upstreamData = energyData?.upstream || {};

  const {
    undertakingInfo,
    undertakingLocation,
    relationshipToPermits,
    impactScheduleDeclaration,
  } = upstreamData;

  // Get upstream operation from energy data
  const upstreamOperation = energyData?.upstreamOperation;
  const upstreamOperationOther = energyData?.upstreamOperationOther;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // Helper functions for labels
  const getUpstreamOperationLabel = (
    operation: string,
    otherValue?: string
  ) => {
    const operations: Record<string, string> = {
      exploration: "Exploration",
      production: "Production",
      others: "Others",
    };

    const baseLabel = operations[operation] || operation;

    if (operation === "others" && otherValue) {
      return `${baseLabel} (${otherValue})`;
    }

    return baseLabel;
  };

  const getNatureOfApplicationLabel = (nature: string) => {
    const natures: Record<string, string> = {
      surveys: "Surveys",
      drilling_of_wells: "Drilling of Wells",
      production_of_petroleum: "Production of Petroleum",
      construction_of_pipeline: "Construction of a Pipeline",
      other: "Other (Please Specify)",
    };
    return natures[nature] || nature;
  };

  const getSurveyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "2d_survey": "2D Seismic Survey",
      "3d_survey": "3D Seismic Survey",
      "4d_survey": "4D Seismic Survey",
      regional_survey: "Regional Survey",
    };
    return types[type] || type;
  };

  const getMainElementLabel = (element: string) => {
    const elements: Record<string, string> = {
      acquisition_of_geophysical_data: "Acquisition of Geophysical Data",
      acquisition_of_seafloor_data: "Acquisition of Seafloor Data",
      acquisition_of_bathymetry_data: "Acquisition of Bathymetry Data",
      field_development_installations_wells:
        "Field Development with Installations, Wells",
      field_development_full:
        "Field Development with Installations and Wells and Export Pipelines",
      field_development_incremental:
        "Field Development — Incremental Undertaking",
      field_redevelopment: "Field Re-development",
      pipeline_construction: "Construction of Pipeline(s)",
      pipeline_repair: "Repair of Pipeline(s)",
      pipeline_replacement: "Replacement of Pipeline(s)",
      exploration_wells: "Exploration Well(s)",
      appraisal_wells: "Appraisal Well(s)",
      other: "Other (Please Specify)",
    };
    return elements[element] || element;
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
            value="ENERGY SECTOR - UPSTREAM PETROLEUM OPERATIONS"
          />
        </Block>

        {/* --- BLOCK 3: Undertaking Information --- */}
        <Block title="3. Undertaking Information" className={styles.fullWidth}>
          <Detail
            label="Upstream Operation:"
            value={getUpstreamOperationLabel(
              upstreamOperation,
              upstreamOperationOther
            )}
          />
          <Detail
            label="Nature of Application:"
            value={getNatureOfApplicationLabel(
              undertakingInfo?.natureOfApplication
            )}
          />

          {undertakingInfo?.natureOfApplication === "other" &&
            undertakingInfo?.natureOfApplicationOther && (
              <Detail
                label="Other Nature Description:"
                value={undertakingInfo.natureOfApplicationOther}
              />
            )}

          {undertakingInfo?.natureOfApplication === "surveys" &&
            undertakingInfo?.surveyType && (
              <Detail
                label="Survey Type:"
                value={getSurveyTypeLabel(undertakingInfo.surveyType)}
              />
            )}

          {undertakingInfo?.natureOfApplication === "drilling_of_wells" &&
            undertakingInfo?.numberOfWells && (
              <Detail
                label="Number of Wells:"
                value={undertakingInfo.numberOfWells}
              />
            )}

          {undertakingInfo?.mainElements &&
            undertakingInfo.mainElements.length > 0 && (
              <div className="mt-3">
                <Detail
                  label="Main Elements of Activities:"
                  value={
                    <ul className="list-disc list-inside">
                      {undertakingInfo.mainElements.map(
                        (element: string, index: number) => (
                          <li key={index}>{getMainElementLabel(element)}</li>
                        )
                      )}
                    </ul>
                  }
                />
              </div>
            )}

          {undertakingInfo?.mainElementsOther && (
            <Detail
              label="Other Main Elements Description:"
              value={undertakingInfo.mainElementsOther}
            />
          )}

          <Detail
            label="Short Description:"
            value={undertakingInfo?.shortDescription}
          />
        </Block>

        {/* --- BLOCK 4: Undertaking Location --- */}
        <Block title="4. Undertaking Location" className={styles.fullWidth}>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Main Location Information</h4>
            <Detail
              label="Main Undertaking Location:"
              value={undertakingLocation?.mainUndertakingLocation}
            />
            <Detail label="Quadrant:" value={undertakingLocation?.quadrant} />
            <Detail
              label="Block Number:"
              value={undertakingLocation?.blockNumber}
            />
            {undertakingLocation?.blockSuffix && (
              <Detail
                label="Block Suffix:"
                value={undertakingLocation.blockSuffix}
              />
            )}
            <Detail
              label="Undertaking Location:"
              value={undertakingLocation?.undertakingLocation}
            />
            <Detail label="Latitude:" value={undertakingLocation?.latitude} />
            <Detail label="Longitude:" value={undertakingLocation?.longitude} />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Proximity Information</h4>
            <Detail
              label="Distance to Coastline:"
              value={`${undertakingLocation?.distanceToCoastline} km`}
            />
            <Detail
              label="Which Coast:"
              value={normalizeText(undertakingLocation?.whichCoast)}
            />
            <Detail
              label="Distance to Transboundary:"
              value={`${undertakingLocation?.distanceToTransboundary} km`}
            />
            <Detail
              label="Which Line:"
              value={undertakingLocation?.whichLine}
            />
          </div>

          {/* Survey Coordinates */}
          {undertakingLocation?.surveyCoordinates &&
            undertakingLocation.surveyCoordinates.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Survey Coordinates</h4>
                <Table
                  dataSource={undertakingLocation.surveyCoordinates}
                  columns={[
                    {
                      title: "Line",
                      dataIndex: "line",
                      key: "line",
                    },
                    {
                      title: "Length",
                      dataIndex: "length",
                      key: "length",
                    },
                    {
                      title: "Width",
                      dataIndex: "width",
                      key: "width",
                    },
                    {
                      title: "Block No",
                      dataIndex: "blockNo",
                      key: "blockNo",
                    },
                    {
                      title: "Country",
                      dataIndex: "country",
                      key: "country",
                    },
                    {
                      title: "Latitude",
                      dataIndex: "latitude",
                      key: "latitude",
                    },
                    {
                      title: "Longitude",
                      dataIndex: "longitude",
                      key: "longitude",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                  scroll={{ x: 800 }}
                />
              </div>
            )}

          {/* Well Coordinates */}
          {undertakingLocation?.wellCoordinates &&
            undertakingLocation.wellCoordinates.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Well Coordinates</h4>
                <Table
                  dataSource={undertakingLocation.wellCoordinates}
                  columns={[
                    {
                      title: "Well Name",
                      dataIndex: "wellName",
                      key: "wellName",
                    },
                    {
                      title: "Length",
                      dataIndex: "length",
                      key: "length",
                    },
                    {
                      title: "Block No",
                      dataIndex: "blockNo",
                      key: "blockNo",
                    },
                    {
                      title: "Country",
                      dataIndex: "country",
                      key: "country",
                    },
                    {
                      title: "Facility",
                      dataIndex: "facility",
                      key: "facility",
                    },
                    {
                      title: "Latitude",
                      dataIndex: "latitude",
                      key: "latitude",
                    },
                    {
                      title: "Longitude",
                      dataIndex: "longitude",
                      key: "longitude",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                  scroll={{ x: 800 }}
                />
              </div>
            )}

          {/* Pipeline Coordinates */}
          {undertakingLocation?.pipelineCoordinates &&
            undertakingLocation.pipelineCoordinates.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Pipeline Coordinates</h4>
                <Table
                  dataSource={undertakingLocation.pipelineCoordinates}
                  columns={[
                    {
                      title: "Type",
                      dataIndex: "pipelineType",
                      key: "pipelineType",
                      render: (type: string) => (
                        <Tag color={type === "start" ? "green" : "red"}>
                          {type?.toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Length",
                      dataIndex: "length",
                      key: "length",
                    },
                    {
                      title: "Block No",
                      dataIndex: "blockNo",
                      key: "blockNo",
                    },
                    {
                      title: "Country",
                      dataIndex: "country",
                      key: "country",
                    },
                    {
                      title: "Facility",
                      dataIndex: "facility",
                      key: "facility",
                    },
                    {
                      title: "Latitude",
                      dataIndex: "latitude",
                      key: "latitude",
                    },
                    {
                      title: "Longitude",
                      dataIndex: "longitude",
                      key: "longitude",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                  scroll={{ x: 800 }}
                />
              </div>
            )}
        </Block>

        {/* --- BLOCK 5: Relationship to Existing Permits --- */}
        {undertakingInfo?.natureOfApplication !== "surveys" && (
          <Block
            title="5. Relationship to Existing Permits"
            className={styles.fullWidth}
          >
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Section B3: Incremental Undertakings
              </h4>
              <Detail
                label="Is this an Incremental Undertaking?"
                value={
                  relationshipToPermits?.isIncrementalUndertaking === "yes"
                    ? "Yes"
                    : relationshipToPermits?.isIncrementalUndertaking === "no"
                    ? "No"
                    : "N/A"
                }
              />

              {relationshipToPermits?.isIncrementalUndertaking === "yes" && (
                <>
                  <Detail
                    label="Name of the Original Undertaking:"
                    value={relationshipToPermits?.originalUndertakingName}
                  />
                  <Detail
                    label="Has this Undertaking been the subject of a previous Environmental Assessment and Permitted?"
                    value={
                      relationshipToPermits?.hasPreviousAssessment === "yes"
                        ? "Yes"
                        : relationshipToPermits?.hasPreviousAssessment === "no"
                        ? "No"
                        : "N/A"
                    }
                  />

                  {relationshipToPermits?.hasPreviousAssessment === "yes" && (
                    <>
                      <Detail
                        label="Date of Submission to EPA of Any Earlier Environmental Assessment Report:"
                        value={
                          relationshipToPermits?.previousAssessmentDate
                            ? formatDate(
                                relationshipToPermits.previousAssessmentDate
                              )
                            : "N/A"
                        }
                      />
                      <Detail
                        label="Date and Reference Number of Earlier Permit:"
                        value={relationshipToPermits?.earlierPermitReference}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Section B4: Host Installation
              </h4>
              {relationshipToPermits?.hostInstallationName ? (
                <>
                  <Detail
                    label="Host Installation Name:"
                    value={relationshipToPermits?.hostInstallationName}
                  />
                  <Detail
                    label="Associated Field Name(s):"
                    value={relationshipToPermits?.associatedFieldNames}
                  />
                  <Detail
                    label="Has this Undertaking been the Subject of an Environmental Assessment (EA)?"
                    value={
                      relationshipToPermits?.hasHostAssessment === "yes"
                        ? "Yes"
                        : relationshipToPermits?.hasHostAssessment === "no"
                        ? "No"
                        : "N/A"
                    }
                  />

                  {relationshipToPermits?.hasHostAssessment === "yes" && (
                    <>
                      <Detail
                        label="Date of Submission to EPA of Any Earlier EA Related to the Host Installation:"
                        value={
                          relationshipToPermits?.hostAssessmentDate
                            ? formatDate(
                                relationshipToPermits.hostAssessmentDate
                              )
                            : "N/A"
                        }
                      />
                      <Detail
                        label="Date and Reference Number of Permit Related to the Host Installation:"
                        value={relationshipToPermits?.hostPermitReference}
                      />
                    </>
                  )}
                </>
              ) : (
                <Detail
                  label=""
                  value="No host installation information provided"
                />
              )}
            </div>
          </Block>
        )}

        {/* --- BLOCK 6: Impact & Schedule Assessment --- */}
        <Block
          title="6. Impact & Schedule Assessment (Section C)"
          className={styles.fullWidth}
        >
          <div className="mb-4">
            <h4 className="font-semibold mb-2">
              Anticipated Duration of Works
            </h4>
            <Detail
              label="From:"
              value={
                impactScheduleDeclaration?.anticipatedDurationFrom
                  ? formatDate(
                      impactScheduleDeclaration.anticipatedDurationFrom
                    )
                  : "N/A"
              }
            />
            <Detail
              label="To:"
              value={
                impactScheduleDeclaration?.anticipatedDurationTo
                  ? formatDate(impactScheduleDeclaration.anticipatedDurationTo)
                  : "N/A"
              }
            />
          </div>

          {/* Impact-Measure Pairs Section */}
          {impactScheduleDeclaration?.impactMeasurePairs &&
          impactScheduleDeclaration.impactMeasurePairs.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Significant Environmental Impacts & Mitigation Measures
              </h4>
              {/* Mobile/Tablet View - Card Layout */}
              <div className="block md:hidden">
                {impactScheduleDeclaration.impactMeasurePairs.map(
                  (pair: any, index: number) => (
                    <div
                      key={pair.id || index}
                      className="bg-gray-50 border border-gray-300 rounded-md p-4 mb-3"
                    >
                      <div className="font-semibold text-sm mb-2">
                        Pair {index + 1}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-xs text-gray-600">
                          Impact:
                        </span>
                        <p className="text-sm mt-1">{pair.impact}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-gray-600">
                          Measures:
                        </span>
                        <p className="text-sm mt-1">{pair.measures}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Desktop View - Table Layout */}
              <div className="hidden md:block">
                <Table
                  dataSource={impactScheduleDeclaration.impactMeasurePairs}
                  columns={[
                    {
                      title: "Impact",
                      dataIndex: "impact",
                      key: "impact",
                      render: (text: string) => <Text>{text}</Text>,
                    },
                    {
                      title: "Proposed Measures",
                      dataIndex: "measures",
                      key: "measures",
                      render: (text: string) => <Text>{text}</Text>,
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Significant Environmental Impacts & Mitigation Measures
              </h4>
              <Empty description="No impact-measure pairs provided" />
            </div>
          )}

          <Detail
            label="Monitoring:"
            value={impactScheduleDeclaration?.monitoring}
          />
        </Block>
      </div>
    </div>
  );
};

export default EnvironmentalUpstreamReview;
