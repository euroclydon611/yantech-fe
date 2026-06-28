import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Typography, Divider } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { Block, Detail } from "../../../../review/helpers";
import {
  formatDate,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title } = Typography;

interface EnvironmentalMineralExplorationPreviewProps {
  application: any;
}

export const EnvironmentalMineralExplorationPreview: React.FC<
  EnvironmentalMineralExplorationPreviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};

  const miningData = answers?.environmentalPermitData?.mining || {};
  const mineralExplorationData = miningData?.mineralExploration || {};

  const {
    generalInformation,
    projectDescription,
    environmentalImpactAssessment,
    reclamationAndAbandonment,
    attachments,
    previousPermit,
  } = mineralExplorationData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
        </Title>
        <div className="h-1 w-24 bg-green-600 rounded-full mt-3 mb-4" />
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
            value="MINING SECTOR - MINERAL EXPLORATION"
          />
        </Block>

        {/* --- BLOCK 3: General Information --- */}
        <Block title="3. General Information" className={styles.fullWidth}>
          <Detail
            label="CEO Name:"
            value={generalInformation?.ceoName || "N/A"}
          />
          <Detail
            label="Exploration Manager Name:"
            value={generalInformation?.explorationManagerName || "N/A"}
          />
          <Detail
            label="Exploration License Type:"
            value={
              normalizeText(generalInformation?.explorationLicenseType) || "N/A"
            }
          />
          <Detail
            label="Exploration Area Size (acres):"
            value={
              generalInformation?.explorationAreaSize
                ? `${generalInformation.explorationAreaSize} acres`
                : "N/A"
            }
          />
          <Detail
            label="Minerals to Prospect:"
            value={
              normalizeText(generalInformation?.mineralsToPerspect) || "N/A"
            }
          />
          {generalInformation?.otherMineralSpecification && (
            <Detail
              label="Other Mineral Specification:"
              value={normalizeText(
                generalInformation.otherMineralSpecification
              )}
            />
          )}

          <div>
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              <Divider orientation="left">Location Information</Divider>
            </Title>
            <Detail
              label="Region:"
              value={
                normalizeText(generalInformation?.location?.region) || "N/A"
              }
            />
            <Detail
              label="District:"
              value={
                normalizeText(generalInformation?.location?.district) || "N/A"
              }
            />
            <Detail
              label="City/Town:"
              value={generalInformation?.location?.city || "N/A"}
            />
            <Detail
              label="Address:"
              value={generalInformation?.location?.address || "N/A"}
            />
            <Detail
              label="Major Landmark:"
              value={generalInformation?.location?.majorLandmark}
            />
            <Detail
              label="Latitude:"
              value={generalInformation?.location?.latitude}
            />
            <Detail
              label="Longitude:"
              value={generalInformation?.location?.longitude}
            />{" "}
            {generalInformation?.location?.googleLocationLink && (
              <Detail
                label="GPS/Google Location Link:"
                value={
                  <a
                    href={generalInformation.location.googleLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {generalInformation.location.googleLocationLink}
                  </a>
                }
              />
            )}
          </div>
        </Block>

        {/* --- BLOCK 4: Project Description --- */}
        <Block
          title="4. Description of Proposed Project"
          className={styles.fullWidth}
        >
          <div className="mb-4">
            <label className="font-semibold text-gray-700 block mb-2">
              Work Program Document:
            </label>
            {projectDescription?.proposedWorkProgramFile ? (
              <div className="flex items-center space-x-2 mt-1 text-red-600">
                <FileTextOutlined />
                <span>
                  Work Program Document attached — refer to{" "}
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            ) : (
              <p className="text-gray-500 italic">Not uploaded</p>
            )}
          </div>

          <Detail
            label="Access Roads Required:"
            value={normalizeText(projectDescription?.accessRoadsRequired)}
          />
        </Block>

        {/* --- BLOCK 5:  Impact Identification and Management --- */}
        <Block
          title="5.  Impact Identification and Management"
          className={styles.fullWidth}
        >
          {/* Protected Areas Section */}
          <div className="mb-6">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Protected Areas
            </Title>
            <Detail
              label="Protected Areas Present:"
              value={normalizeText(
                environmentalImpactAssessment?.protectedAreasPresent
              )}
            />
            {environmentalImpactAssessment?.protectedAreasPresent && (
              <Detail
                label="Protected Areas Names:"
                value={
                  environmentalImpactAssessment?.protectedAreasNames || "N/A"
                }
              />
            )}
          </div>

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

              const phaseData =
                environmentalImpactAssessment?.[phase as keyof any] || {};
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

          {/* Water Body Impact Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Impact on Water Bodies
            </Title>
            <Detail
              label="Will Exploration Impact Water Bodies:"
              value={
                environmentalImpactAssessment?.waterBodyImpact === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {environmentalImpactAssessment?.waterBodyImpact === "yes" && (
              <>
                <Detail
                  label="Likely Water Impacts:"
                  value={
                    environmentalImpactAssessment?.likelyWaterImpacts || "N/A"
                  }
                />
                <Detail
                  label="Affected Communities:"
                  value={
                    environmentalImpactAssessment?.affectedCommunities || "N/A"
                  }
                />
              </>
            )}
          </div>

          {/* Community Consultation Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Community Consultation
            </Title>
            <Detail
              label="Communities Consulted:"
              value={
                environmentalImpactAssessment?.communityConsultation === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {environmentalImpactAssessment?.communityConsultation === "yes" && (
              <Detail
                label="Consulted Communities:"
                value={
                  environmentalImpactAssessment?.consultedCommunities || "N/A"
                }
              />
            )}

            {environmentalImpactAssessment?.communityConsultation === "no" &&
              environmentalImpactAssessment?.noConsultationReason && (
                <Detail
                  label="Reason for No Consultation:"
                  value={environmentalImpactAssessment.noConsultationReason}
                />
              )}
          </div>
        </Block>

        {/* --- BLOCK 6: Reclamation & Abandonment Plans --- */}
        <Block
          title="6. Reclamation & Abandonment Plans"
          className={styles.fullWidth}
        >
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Reclamation Measures
            </Title>
            {reclamationAndAbandonment?.reclamationDescription && (
              <Detail
                label="Reclamation Plan:"
                value={reclamationAndAbandonment.reclamationDescription}
              />
            )}
            {reclamationAndAbandonment?.reclamationFile && (
              <div className="flex items-center space-x-2 mt-1  text-red-600">
                <FileTextOutlined />
                <span>
                  Reclamation Document attached — refer to{" "}
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            )}
            {!reclamationAndAbandonment?.reclamationDescription &&
              !reclamationAndAbandonment?.reclamationFile && (
                <Detail label="Reclamation Plan:" value="N/A" />
              )}
            <Detail
              label="Estimated Reclamation Cost (GHS):"
              value={
                reclamationAndAbandonment?.reclamationCost
                  ? `₵${reclamationAndAbandonment.reclamationCost.toLocaleString()}`
                  : "N/A"
              }
            />
          </div>

          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Abandonment Plans
            </Title>
            {reclamationAndAbandonment?.abandonmentDescription && (
              <Detail
                label="Abandonment Plan:"
                value={reclamationAndAbandonment.abandonmentDescription}
              />
            )}
            {reclamationAndAbandonment?.abandonmentFile && (
              <div className="flex items-center space-x-2 mt-1  text-red-600">
                <FileTextOutlined />
                <span>
                  Abandonment Document attached — refer to{" "}
                  <strong>Block 8 (Supporting Documents)</strong>
                </span>
              </div>
            )}
            {!reclamationAndAbandonment?.abandonmentDescription &&
              !reclamationAndAbandonment?.abandonmentFile && (
                <Detail label="Abandonment Plan:" value="N/A" />
              )}
            <Detail
              label="Abandonment Cost Estimate (GHS):"
              value={
                reclamationAndAbandonment?.abandonmentCostEstimate
                  ? `₵${reclamationAndAbandonment.abandonmentCostEstimate.toLocaleString()}`
                  : "N/A"
              }
            />
          </div>

          {/* Compensation Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Compensation
            </Title>
            <Detail
              label="Compensation Envisaged:"
              value={
                reclamationAndAbandonment?.compensationEnvisaged === "yes"
                  ? "Yes"
                  : "No"
              }
            />

            {reclamationAndAbandonment?.compensationEnvisaged === "yes" && (
              <>
                {reclamationAndAbandonment?.compensationDetails &&
                  reclamationAndAbandonment.compensationDetails.length > 0 && (
                    <div className="mt-4">
                      <Title
                        level={5}
                        className="!text-xs !font-semibold !m-0 !mb-3 text-gray-700"
                      >
                        Compensation Details
                      </Title>
                      <div
                        style={{
                          overflowX: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <Table
                          dataSource={
                            reclamationAndAbandonment.compensationDetails
                          }
                          columns={[
                            {
                              title: "Type",
                              dataIndex: "compensationType",
                              key: "compensationType",
                              width: "25%",
                            },
                            {
                              title: "Specification",
                              dataIndex: "cropType",
                              key: "cropType",
                              width: "25%",
                            },
                            {
                              title: "Status",
                              dataIndex: "maturity",
                              key: "maturity",
                              width: "25%",
                            },
                            {
                              title: "Cost per Unit (GHS)",
                              dataIndex: "costPerTreeOrAcre",
                              key: "costPerTreeOrAcre",
                              width: "25%",
                              render: (cost) =>
                                cost ? `₵${cost.toLocaleString()}` : "N/A",
                            },
                          ]}
                          pagination={false}
                          size="small"
                          bordered
                          rowKey={(record, index) => index}
                          scroll={{ x: "max-content" }}
                        />
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>

          {/* Small-Scale Miners Section */}
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Small-Scale Miners
            </Title>
            <Detail
              label="Small-Scale Miners Present:"
              value={
                reclamationAndAbandonment?.smallScaleMinersPresent === "yes"
                  ? "Yes"
                  : "No"
              }
            />
            {reclamationAndAbandonment?.smallScaleMinersPresent === "yes" && (
              <Detail
                label="Small-Scale Miners Names:"
                value={
                  reclamationAndAbandonment?.smallScaleMinersNames || "N/A"
                }
              />
            )}
          </div>
        </Block>

        {/* --- BLOCK 8: Previous Permit Information --- */}
        {permitDetails?.applicationType === "renewal" && (
          <Block
            title="7. Previous Permit Information"
            className={styles.fullWidth}
          >
            {previousPermit ? (
              <div className="space-y-4">
                <Detail
                  label="Permit Number:"
                  value={previousPermit.permitNumber || "N/A"}
                />
                <Detail
                  label="Issue Date:"
                  value={
                    previousPermit.permitIssuedDate
                      ? formatDate(previousPermit.permitIssuedDate)
                      : "N/A"
                  }
                />
                <Detail
                  label="Expiry Date:"
                  value={
                    previousPermit.permitExpiryDate
                      ? formatDate(previousPermit.permitExpiryDate)
                      : "N/A"
                  }
                />
                {previousPermit.permitDocument && (
                  <div className="mt-4">
                    <label className="font-semibold text-gray-700 block mb-2">
                      Permit Document:
                    </label>
                    <span className="text-red-600">
                      Document attached — refer to{" "}
                      <strong>Block 8 (Supporting Documents)</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Detail label="Previous Permit Information:" value="N/A" />
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

export default EnvironmentalMineralExplorationPreview;
