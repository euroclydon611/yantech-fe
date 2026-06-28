import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Tag, Typography } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { FileTextOutlined } from "@ant-design/icons";
const { Title } = Typography;

interface EnvironmentalLargScaleMiningReviewProps {
  application: any;
}

export const EnvironmentalLargeScaleMiningReview: React.FC<
  EnvironmentalLargScaleMiningReviewProps
> = ({ application }) => {
  const { answers } = application;
  const { permitDetails } = answers || {};
  const miningData = answers?.environmentalPermitData?.mining || {};
  const largeScaleData = miningData?.largeScale || {};

  const { proposalDetails, siteDetails, attachments } = largeScaleData;

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
            value="MINING SECTOR - LARGE SCALE OPERATIONS"
          />
        </Block>

        {/* --- BLOCK 3: Proposal Details - Hide for Renewals --- */}
        {permitDetails?.applicationType !== "renewal" && (
          <Block title="3. Project Details" className={styles.fullWidth}>
            <Detail
              label="Proposed Undertaking / Development:"
              value={proposalDetails?.description || "N/A"}
            />

            <div className="mb-4 mt-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Shareholders
              </Title>

              {proposalDetails?.shareholders &&
                proposalDetails.shareholders.length > 0 && (
                  <div className="mb-4">
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={proposalDetails.shareholders}
                        columns={[
                          {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                            width: "30%",
                          },
                          {
                            title: "Percentage (%)",
                            dataIndex: "percentage",
                            key: "percentage",
                            width: "15%",
                            render: (text) => text || "",
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
            </div>
          </Block>
        )}

        {/* --- BLOCK 4: Project Site & Location --- */}
        <Block
          title={
            permitDetails?.applicationType === "renewal"
              ? "3. Project Site & Location"
              : "4. Project Site & Location"
          }
          className={styles.fullWidth}
        >
          <div className="mb-4">
            <Title
              level={4}
              className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
            >
              Location Information
            </Title>
            <Detail
              label="Region:"
              value={normalizeText(siteDetails?.location?.region) || "N/A"}
            />
            <Detail
              label="District:"
              value={normalizeText(siteDetails?.location?.district) || "N/A"}
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

          {permitDetails?.applicationType !== "renewal" && (
            <>
              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Land Use Information
                </Title>
                <Detail
                  label="Predominant Land Use:"
                  value={siteDetails?.predominantLandUse || "N/A"}
                />
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
                    <div
                      style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        dataSource={siteDetails.adjacentLandUses}
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
                            render: (distance: number) => distance || "N/A",
                          },
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                      />
                    </div>
                  </div>
                )}

              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Proximity to Water Body
                </Title>
                <Detail
                  label="Near Water Body:"
                  value={siteDetails?.nearWaterBody?.isNear ? "Yes" : "No"}
                />
                {siteDetails?.nearWaterBody?.isNear && (
                  <>
                    <Detail
                      label="Water Body Name:"
                      value={siteDetails?.nearWaterBody?.name || "N/A"}
                    />
                    <Detail
                      label="Distance to Water Body:"
                      value={
                        siteDetails?.nearWaterBody?.distance
                          ? `${siteDetails.nearWaterBody.distance} meters`
                          : "N/A"
                      }
                    />
                  </>
                )}
              </div>

              <div className="mb-4">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
                >
                  Proximity to Sensitive Areas
                </Title>
                <Detail
                  label="Near Sensitive Area:"
                  value={siteDetails?.nearSensitiveArea?.isNear ? "Yes" : "No"}
                />
                {siteDetails?.nearSensitiveArea?.isNear && (
                  <>
                    <Detail
                      label="Sensitive Area Type:"
                      value={siteDetails?.nearSensitiveArea?.name || "N/A"}
                    />
                    <Detail
                      label="Distance to Sensitive Area:"
                      value={
                        siteDetails?.nearSensitiveArea?.distance
                          ? `${siteDetails.nearSensitiveArea.distance} meters`
                          : "N/A"
                      }
                    />
                  </>
                )}
              </div>
            </>
          )}
        </Block>

        {/* --- BLOCK 5: Previous Permit Information --- */}
        {permitDetails?.applicationType === "renewal" && (
          <>
            <Block
              title="4. Previous Permit Information"
              className={styles.fullWidth}
            >
              {largeScaleData?.previousPermit ? (
                <div className="space-y-4">
                  <Detail
                    label="Permit Number:"
                    value={largeScaleData.previousPermit.permitNumber || "N/A"}
                  />
                  <Detail
                    label="Issue Date:"
                    value={
                      largeScaleData.previousPermit.permitIssuedDate
                        ? formatDate(
                            largeScaleData.previousPermit.permitIssuedDate
                          )
                        : "N/A"
                    }
                  />
                  <Detail
                    label="Expiry Date:"
                    value={
                      largeScaleData.previousPermit.permitExpiryDate
                        ? formatDate(
                            largeScaleData.previousPermit.permitExpiryDate
                          )
                        : "N/A"
                    }
                  />
                  {largeScaleData.previousPermit.permitDocument && (
                    <div className="mt-4">
                      <label className="font-semibold text-gray-700 block mb-2">
                        Permit Document:
                      </label>
                      <span className="text-red-600">
                        Document attached — refer to{" "}
                        <strong>Block 6 (Supporting Documents)</strong>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Detail label="Previous Permit Information:" value="N/A" />
              )}
            </Block>

            <Block
              title="5. Environmental Management Plan (EMP)"
              className={styles.fullWidth}
            >
              <div className="flex items-center space-x-2 mt-1 text-red-600">
                <FileTextOutlined />
                <span>
                  {attachments?.corporateEnvironmentalPlanDoc?.name ||
                    "Environmental Management Plan"}{" "}
                  attached — refer to{" "}
                  <strong>Block 6 (Supporting Documents)</strong>
                </span>
              </div>
            </Block>
          </>
        )}

        {/* --- BLOCK 6: Supporting Documents --- */}
        <Block
          title={
            permitDetails?.applicationType === "renewal"
              ? "6. Supporting Documents"
              : "5. Supporting Documents"
          }
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

export default EnvironmentalLargeScaleMiningReview;
