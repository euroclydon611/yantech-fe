import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Typography, Tag, Space } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate2,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import {
  FileTextOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import ApplicantInformationBlock from "@/components/general/applicant-information";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";

const { Title, Text } = Typography;

interface EnvironmentalManufacturingReviewProps {
  application: any;
}

export const EnvironmentalManufacturingEMRReview: React.FC<
  EnvironmentalManufacturingReviewProps
> = ({ application }) => {
  const { answers } = application;

  const { permitDetails } = answers || {};
  const manufacturingData =
    answers?.environmentalPermitData?.manufacturing || {};

  const {
    generalInformation,
    backgroundInformation,
    environmentalPolicy,
    impactIdentification,
    resourceUse,
    pollutantReleases,
    managementData,
    attachments,
  } = manufacturingData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  // --- Render Helpers ---

  const renderBoolean = (val?: boolean) => {
    if (val === true)
      return (
        <Tag
          color="success"
          icon={<CheckCircleFilled />}
          style={{
            borderRadius: "4px",
            padding: "0 8px",
            fontWeight: "600",
            backgroundColor: "#f6ffed",
            borderColor: "#b7eb8f",
            color: "#389e0d",
          }}
        >
          YES
        </Tag>
      );
    if (val === false)
      return (
        <Tag
          color="error"
          icon={<CloseCircleFilled />}
          style={{
            borderRadius: "4px",
            padding: "0 8px",
            fontWeight: "600",
            backgroundColor: "#fff1f0",
            borderColor: "#ffa39e",
            color: "#cf1322",
          }}
        >
          NO
        </Tag>
      );
    return (
      <Text type="secondary" className="italic text-sm">
        N/A
      </Text>
    );
  };

  const renderDocumentRefer = (file: any, label: string) => {
    if (!file) {
      return (
        <Text type="secondary" className="italic text-xs">
          N/A
        </Text>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
        <FileTextOutlined className="text-blue-500" />
        <Text className="text-sm text-red-600">
          {file.name || label} (See{" "}
          <Text
            className="text-blue-600 cursor-pointer hover:underline font-medium"
            onClick={() => {
              const element = document.getElementById("supporting-documents");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Block 11: Supporting Documents
          </Text>
          )
        </Text>
      </div>
    );
  };

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review (EMR)
        </Title>
        <div className="h-1 w-24 bg-green-500 rounded-full mt-3 mb-4"></div>
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
          <Detail label="Permit Category:" value="MANUFACTURING SECTOR" />
          <Detail
            label="Manufacturing Category:"
            value={normalizeText(manufacturingData.manufacturingCategory)}
          />
          {manufacturingData.manufacturingCategory == "general_industry" && (
            <Detail
              label="General Industry Type:"
              value={normalizeText(manufacturingData.generalIndustryType)}
            />
          )}

          {permitDetails?.applicationType == "new_application" && (
            <Detail
              label="New/Existing Facility Undertaking:"
              value={
                manufacturingData.isExistingUndertaking
                  ? "Existing Undertaking (Existing facility applying for first permit (did not undergo initial EA))"
                  : "New Facility (Facility undergoing Environmental Assessment for the first time)"
              }
            />
          )}
        </Block>

        {/* --- BLOCK 3: Step 1 - General Information --- */}
        <Block
          title="3. Step 1: General Information"
          className={styles.fullWidth}
        >
          <div className="space-y-4">
            <Detail
              label="1.1 Registered Name of Undertaking:"
              value={generalInformation?.registeredName || "N/A"}
            />
            <Detail
              label="Date of Commencement of Operation:"
              value={formatDate2(generalInformation?.commencementDate) || "N/A"}
            />
            <Detail
              label="1.2 Type of Undertaking:"
              value={generalInformation?.typeOfUndertaking || "N/A"}
            />

            <div className="mb-4">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                1.3 Location of Undertaking
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail
                  label="Region:"
                  value={
                    normalizeText(
                      generalInformation?.locationDetails?.region
                    ) || "N/A"
                  }
                />
                <Detail
                  label="District:"
                  value={
                    normalizeText(
                      generalInformation?.locationDetails?.district
                    ) || "N/A"
                  }
                />
                <Detail
                  label="City/Town:"
                  value={generalInformation?.locationDetails?.city || "N/A"}
                />
                <Detail
                  label="Address:"
                  value={generalInformation?.locationDetails?.address || "N/A"}
                />
                <Detail
                  label="Major Landmark:"
                  value={
                    generalInformation?.locationDetails?.majorLandmark || "N/A"
                  }
                />
                <Detail
                  label="Google Location/GPS:"
                  value={
                    generalInformation?.locationDetails?.latitude &&
                    generalInformation?.locationDetails?.longitude
                      ? `${generalInformation.locationDetails.latitude}, ${generalInformation.locationDetails.longitude}`
                      : "N/A"
                  }
                />
                {generalInformation?.locationDetails?.googleLocationLink && (
                  <Detail
                    label="Google Maps Link:"
                    value={
                      <a
                        href={
                          generalInformation.locationDetails.googleLocationLink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {generalInformation.locationDetails.googleLocationLink}
                      </a>
                    }
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail
                label="1.4 Head of Company:"
                value={generalInformation?.nameOfHeadOfCompany || "N/A"}
              />
              <Detail
                label="1.5 Environmental Officer:"
                value={generalInformation?.nameOfEnvironmentalOfficer || "N/A"}
              />
              <Detail
                label="Env. Officer Telephone:"
                value={generalInformation?.environmentalOfficerPhone || "N/A"}
              />
              <Detail
                label="Env. Officer Email:"
                value={generalInformation?.environmentalOfficerEmail || "N/A"}
              />
            </div>

            {/* Previous Permit Info */}
            {generalInformation?.previousPermit && (
              <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <Title
                  level={4}
                  className="!text-sm !font-semibold !mb-3 text-blue-800"
                >
                  📋 Previous Issued Permit Details
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail
                    label="Permit Number:"
                    value={
                      generalInformation.previousPermit.permitNumber || "N/A"
                    }
                  />
                  <Detail
                    label="Date of Issue:"
                    value={
                      generalInformation.previousPermit.permitIssuedDate
                        ? formatDate2(
                            generalInformation.previousPermit.permitIssuedDate
                          )
                        : "N/A"
                    }
                  />
                  <Detail
                    label="Expiry Date:"
                    value={
                      generalInformation.previousPermit.permitExpiryDate
                        ? formatDate2(
                            generalInformation.previousPermit.permitExpiryDate
                          )
                        : "N/A"
                    }
                  />
                </div>
                <div className="mt-3">
                  <Text strong className="text-sm block mb-1">
                    Permit Document:
                  </Text>
                  {renderDocumentRefer(
                    generalInformation.previousPermit.permitDocument,
                    "Previous Permit"
                  )}
                </div>
              </div>
            )}

            {/* Environmental Reports */}
            <div className="mt-4">
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                1.6 Environmental Reports Submitted (Last 2 Years)
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Title level={5} className="!text-xs !font-bold !mb-2">
                    Annual Reports
                  </Title>
                  <div className="space-y-2">
                    <Detail
                      label={`Year ${
                        generalInformation?.environmentalReports?.annual?.year1
                          ?.year || "1"
                      }:`}
                      value={renderBoolean(
                        generalInformation?.environmentalReports?.annual?.year1
                          ?.submitted
                      )}
                    />
                    <Detail
                      label={`Year ${
                        generalInformation?.environmentalReports?.annual?.year2
                          ?.year || "2"
                      }:`}
                      value={renderBoolean(
                        generalInformation?.environmentalReports?.annual?.year2
                          ?.submitted
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Title level={5} className="!text-xs !font-bold !mb-2">
                    Quarterly Reports
                  </Title>
                  <div className="space-y-4">
                    {["year1", "year2"].map((yrKey) => {
                      const yrData =
                        generalInformation?.environmentalReports?.quarterly?.[
                          yrKey
                        ];
                      if (!yrData) return null;
                      return (
                        <div key={yrKey}>
                          <Text strong className="text-xs">
                            {yrData.year}:{" "}
                          </Text>
                          <Space size="small" wrap>
                            {["q1", "q2", "q3", "q4"].map((q) => (
                              <Tag
                                key={q}
                                color={yrData[q] ? "success" : "error"}
                                icon={
                                  yrData[q] ? (
                                    <CheckCircleFilled />
                                  ) : (
                                    <CloseCircleFilled />
                                  )
                                }
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  borderRadius: "4px",
                                  backgroundColor: yrData[q]
                                    ? "#f6ffed"
                                    : "#fff1f0",
                                  borderColor: yrData[q]
                                    ? "#b7eb8f"
                                    : "#ffa39e",
                                  color: yrData[q] ? "#389e0d" : "#cf1322",
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              >
                                {q.toUpperCase()}: {yrData[q] ? "YES" : "NO"}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Approved By Section (1.7) */}
            {permitDetails?.applicationType === "renewal" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <Title level={4} className="!text-sm !font-semibold !mb-4">
                  1.7 Checked & Approved By
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail
                    label="Authorized Officer Name:"
                    value={generalInformation?.approvedBy?.name || "N/A"}
                  />
                  <Detail
                    label="Designation:"
                    value={generalInformation?.approvedBy?.designation || "N/A"}
                  />
                </div>
                <div className="mt-3">
                  <Text strong className="text-sm block mb-1">
                    Signature:
                  </Text>
                  {renderDocumentRefer(
                    generalInformation?.approvedBy?.signature,
                    "Authorized Officer Signature"
                  )}
                </div>
              </div>
            )}
          </div>
        </Block>

        {/* --- BLOCK 4: Step 2 - Background Information --- */}
        <Block
          title="4. Step 2: Background Information"
          className={styles.fullWidth}
        >
          <div className="space-y-6">
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.1 Phase Development and Capacity Utilisation
              </Title>
              <Detail
                label="2.1.1 Has there been any expansion?"
                value={renderBoolean(
                  backgroundInformation?.expansion?.hasExpansion
                )}
              />
              {backgroundInformation?.expansion?.hasExpansion && (
                <div className="mt-2 pl-4 border-l-2 border-gray-100 space-y-2">
                  <Detail
                    label="2.1.2 Nature of Expansion:"
                    value={backgroundInformation.expansion.natureOfExpansion}
                  />
                  <Detail
                    label="2.1.3 Pollution Control Measures Expanded?"
                    value={renderBoolean(
                      backgroundInformation.expansion.pollutionControlExpanded
                        ?.expanded
                    )}
                  />
                  {backgroundInformation.expansion.pollutionControlExpanded
                    ?.expanded && (
                    <Detail
                      label="Explanation:"
                      value={
                        backgroundInformation.expansion.pollutionControlExpanded
                          .explanation
                      }
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.1.4 Installed and operating capacities
              </Title>
              <Table
                dataSource={backgroundInformation?.expansion?.capacities || []}
                columns={[
                  { title: "Year", dataIndex: "year", key: "year" },
                  {
                    title: "Product/Operation",
                    dataIndex: "productOrOperation",
                    key: "productOrOperation",
                  },
                  {
                    title: "Installed Capacity",
                    dataIndex: "installedCapacity",
                    key: "installedCapacity",
                  },
                  {
                    title: "Operating Capacity",
                    dataIndex: "operatingCapacity",
                    key: "operatingCapacity",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No capacity data provided" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail
                label="2.2 Finished Products:"
                value={
                  backgroundInformation?.products?.finishedProducts || "N/A"
                }
              />
              <Detail
                label="2.2.1 By-products:"
                value={backgroundInformation?.products?.byProducts || "N/A"}
              />
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.3 Staffing/Employee Levels
              </Title>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Detail
                  label="Permanent:"
                  value={backgroundInformation?.staffing?.permanent}
                />
                <Detail
                  label="Non-Permanent:"
                  value={backgroundInformation?.staffing?.nonPermanent}
                />
                <Detail
                  label="Management:"
                  value={backgroundInformation?.staffing?.management}
                />
                <Detail
                  label="Senior Staff:"
                  value={backgroundInformation?.staffing?.seniorStaff}
                />
                <Detail
                  label="Junior Staff:"
                  value={backgroundInformation?.staffing?.juniorStaff}
                />
                <Detail
                  label="Others:"
                  value={backgroundInformation?.staffing?.others}
                />
                <Detail
                  label="Total:"
                  value={backgroundInformation?.staffing?.total}
                  className="font-bold"
                />
              </div>
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.4 Site and External/ Neighbourhood Environment
              </Title>
              <div className="mb-4">
                <Text strong className="block mb-2 text-xs">
                  2.4.1 Adjacent land uses (existing and proposed)
                </Text>
                <Table
                  dataSource={
                    backgroundInformation?.neighborhood?.adjacentLandUses || []
                  }
                  columns={[
                    {
                      title: "Direction",
                      dataIndex: "direction",
                      key: "direction",
                    },
                    {
                      title: "Description of Land Use",
                      dataIndex: "description",
                      key: "description",
                    },
                    {
                      title: "Distance (m)",
                      dataIndex: "distance",
                      key: "distance",
                    },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey="id"
                  locale={{ emptyText: "No adjacent land use data provided" }}
                />
              </div>
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.4.2 Major pollution sources / generators in the neighborhood
              </Title>
              <Table
                dataSource={
                  backgroundInformation?.neighborhood?.pollutionSources || []
                }
                columns={[
                  { title: "Source", dataIndex: "source", key: "source" },
                  { title: "Type", dataIndex: "type", key: "type" },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No major pollution sources reported" }}
              />
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                2.5 Public Complaints (environmental complaints received during
                the year)
              </Title>
              <Table
                dataSource={backgroundInformation?.publicComplaints || []}
                columns={[
                  {
                    title: "Complaint",
                    dataIndex: "complaint",
                    key: "complaint",
                  },
                  {
                    title: "Date Received",
                    dataIndex: "dateReceived",
                    key: "dateReceived",
                    render: (val) => (val ? formatDate2(val) : "—"),
                  },
                  {
                    title: "Status/Resolution",
                    dataIndex: "status",
                    key: "status",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No public complaints reported" }}
              />
            </div>
          </div>
        </Block>

        {/* --- BLOCK 5: Step 3 - Environmental Policy --- */}
        <Block
          title="5. Step 3: Environmental Policy"
          className={styles.fullWidth}
        >
          <div className="space-y-6">
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                3.1 Environmental Policy Document
              </Title>
              {renderDocumentRefer(
                attachments?.environmentalPolicyDocument,
                "Environmental Policy"
              )}
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-2">
                3.2 Specific Environmental Objectives
              </Title>
              <Text className="block p-3 bg-gray-50 rounded italic">
                {environmentalPolicy?.specificObjectives ||
                  "No objectives specified"}
              </Text>
            </div>

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                3.3 Specific Targets for permit implementation period
              </Title>
              <Table
                dataSource={environmentalPolicy?.targets || []}
                columns={[
                  {
                    title: "Performance Indicator",
                    dataIndex: "indicator",
                    key: "indicator",
                    width: "30%",
                  },
                  {
                    title: "Current Level",
                    dataIndex: "currentLevel",
                    key: "currentLevel",
                  },
                  {
                    title: "Proposed Target",
                    dataIndex: "proposedTarget",
                    key: "proposedTarget",
                  },
                  {
                    title: "Measures to achieve target",
                    dataIndex: "measures",
                    key: "measures",
                    width: "30%",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No performance indicators reported" }}
              />
            </div>
          </div>
        </Block>

        {/* --- BLOCK 6: Step 4 - Impact Identification --- */}
        <Block
          title="6. Step 4: Impact Identification"
          className={styles.fullWidth}
        >
          <div className="space-y-8">
            {/* Raw Materials */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                4.1 Raw Materials Used & Handling
              </Title>
              <Table
                dataSource={impactIdentification?.rawMaterials || []}
                columns={[
                  { title: "Material", dataIndex: "material", key: "material" },
                  { title: "Source(s)", dataIndex: "source", key: "source" },
                  {
                    title: "Packaging",
                    dataIndex: "packaging",
                    key: "packaging",
                  },
                  {
                    title: "Characterization",
                    dataIndex: "characterization",
                    key: "characterization",
                  },
                  {
                    title: "Consumption",
                    dataIndex: "consumption",
                    key: "consumption",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Utilities */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                4.2 Utilities Consumption
              </Title>
              <Table
                dataSource={impactIdentification?.utilities || []}
                columns={[
                  { title: "Utility Type", dataIndex: "type", key: "type" },
                  { title: "Source", dataIndex: "source", key: "source" },
                  {
                    title: "Packaging/Storage",
                    dataIndex: "storage",
                    key: "storage",
                    render: (_, record: any) =>
                      record.packaging || record.storage || "—",
                  },
                  {
                    title: "Consumption",
                    dataIndex: "consumption",
                    key: "consumption",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Machinery */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                4.3 List of Machinery & Equipment
              </Title>
              <Table
                dataSource={impactIdentification?.machinery || []}
                columns={[
                  { title: "Type/Model", dataIndex: "type", key: "type" },
                  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                  { title: "Capacity", dataIndex: "capacity", key: "capacity" },
                  {
                    title: "Specification/Doc",
                    dataIndex: "attachment",
                    key: "attachment",
                    render: (file) =>
                      renderDocumentRefer(file, "Machinery Report"),
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Production Processes */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                4.4 Description of Production Activities/Process Operation and
                other auxiliary activities
              </Title>
              <Table
                dataSource={impactIdentification?.productionProcesses || []}
                columns={[
                  { title: "Stage/Activity", dataIndex: "stage", key: "stage" },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    width: "30%",
                  },
                  {
                    title: "Waste Types",
                    dataIndex: "wasteTypes",
                    key: "wasteTypes",
                  },
                  {
                    title: "Mitigation Measures",
                    dataIndex: "mitigationMeasures",
                    key: "mitigationMeasures",
                    width: "30%",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Attachments for Step 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Title level={4} className="!text-sm !font-semibold !mb-3">
                  Process Flow Chart
                </Title>
                {renderDocumentRefer(
                  attachments?.processFlowChart,
                  "Process Flow Chart"
                )}
              </div>
            </div>
          </div>
        </Block>

        {/* --- BLOCK 7: Step 5 - Resource Usage --- */}
        <Block title="7. Step 5: Resource Usage" className={styles.fullWidth}>
          <div className="space-y-8">
            <div className="bg-blue-50 p-4 rounded-md">
              <Space size="large">
                <Detail
                  label="Reported Year 1:"
                  value={resourceUse?.year1 || "N/A"}
                />
                <Detail
                  label="Reported Year 2:"
                  value={resourceUse?.year2 || "N/A"}
                />
              </Space>
            </div>

            {/* Water Use */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                5.1 Water Usage (
                {resourceUse?.waterUnit === "cubic_meter" ? "m³" : "Litres"})
              </Title>
              <Table
                dataSource={(resourceUse?.waterUse || []).filter(
                  (r: any) => r.year1 || r.year2
                )}
                columns={[
                  { title: "Source", dataIndex: "label", key: "label" },
                  {
                    title: `${resourceUse?.year1 || "Year 1"}`,
                    dataIndex: "year1",
                    key: "year1",
                  },
                  {
                    title: `${resourceUse?.year2 || "Year 2"}`,
                    dataIndex: "year2",
                    key: "year2",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Electricity Use */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                5.2 Electricity Consumption (kWh)
              </Title>
              <Table
                dataSource={(resourceUse?.electricityUse || []).filter(
                  (r: any) => r.year1 || r.year2
                )}
                columns={[
                  { title: "Source", dataIndex: "label", key: "label" },
                  {
                    title: `${resourceUse?.year1 || "Year 1"}`,
                    dataIndex: "year1",
                    key: "year1",
                  },
                  {
                    title: `${resourceUse?.year2 || "Year 2"}`,
                    dataIndex: "year2",
                    key: "year2",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail
                  label="Renewable Energy Mix (%):"
                  value={resourceUse?.renewableEnergyMix}
                />
                <Detail
                  label="Type of Renewable Energy:"
                  value={resourceUse?.renewableEnergyType}
                />
              </div>
            </div>

            {/* Fuel Use */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                5.3 Fuel Consumption
              </Title>
              <Table
                dataSource={(resourceUse?.fuelUse || []).filter(
                  (r: any) => r.year1 || r.year2
                )}
                columns={[
                  { title: "Fuel Type", dataIndex: "label", key: "label" },
                  {
                    title: "Process Stage",
                    dataIndex: "processStage",
                    key: "processStage",
                  },
                  {
                    title: `${resourceUse?.year1 || "Year 1"}`,
                    dataIndex: "year1",
                    key: "year1",
                  },
                  {
                    title: `${resourceUse?.year2 || "Year 2"}`,
                    dataIndex: "year2",
                    key: "year2",
                  },
                  { title: "Units", dataIndex: "units", key: "units" },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>
          </div>
        </Block>

        {/* --- BLOCK 8: Step 6 - Pollutant Releases --- */}
        <Block
          title="8. Step 6: Pollutant Releases"
          className={styles.fullWidth}
        >
          <div className="space-y-8">
            {/* Environmental Releases */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                6.1 Environmental Releases (Air, Fenceline, Noise)
              </Title>
              <Table
                dataSource={pollutantReleases?.environmentalReleases || []}
                columns={[
                  {
                    title: "Parameter/Source",
                    dataIndex: "source",
                    key: "source",
                    render: (text, record: any) =>
                      record.isHeader ? (
                        <Text strong className="text-blue-600">
                          {text}
                        </Text>
                      ) : (
                        text
                      ),
                  },
                  { title: "Loc 1", dataIndex: "loc1", key: "loc1" },
                  { title: "Loc 2", dataIndex: "loc2", key: "loc2" },
                  { title: "Loc 3", dataIndex: "loc3", key: "loc3" },
                  { title: "Loc 4", dataIndex: "loc4", key: "loc4" },
                  { title: "Comment", dataIndex: "comment", key: "comment" },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                rowClassName={(record: any) =>
                  record.isHeader ? "bg-blue-50" : ""
                }
              />
            </div>

            {/* Solid Waste */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                6.2 Solid Waste Generation
              </Title>
              <Table
                dataSource={pollutantReleases?.solidWaste || []}
                columns={[
                  { title: "Type of Waste", dataIndex: "type", key: "type" },
                  {
                    title: "Quantity/Annum",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Management Method",
                    dataIndex: "method",
                    key: "method",
                  },
                  { title: "Disposal Site", dataIndex: "site", key: "site" },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
              />
            </div>

            {/* Chemical Waste */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                6.3 Obsolete/Expired Chemicals & Waste oil Generation
              </Title>
              <Table
                dataSource={pollutantReleases?.chemicalWaste || []}
                columns={[
                  {
                    title: "Waste Source/Type",
                    dataIndex: "source",
                    key: "source",
                    render: (text, record: any) =>
                      record.isHeader ? (
                        <Text strong className="text-blue-600">
                          {text}
                        </Text>
                      ) : (
                        text
                      ),
                  },
                  {
                    title: "Quantity/Annum",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                rowClassName={(record: any) =>
                  record.isHeader ? "bg-blue-50" : ""
                }
              />
            </div>

            {pollutantReleases?.otherPollution && (
              <div>
                <Title level={4} className="!text-sm !font-semibold !mb-2">
                  6.4 Other Pollution Issues
                </Title>
                <Text className="block p-3 bg-gray-50 rounded italic">
                  {pollutantReleases.otherPollution}
                </Text>
              </div>
            )}

            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                Effluent Quality Monitoring Results
              </Title>
              {renderDocumentRefer(
                attachments?.effluentQualityMonitoringResults,
                "Effluent Quality Monitoring Results"
              )}
            </div>
          </div>
        </Block>

        {/* --- BLOCK 9: Step 7 - Management Practices & Permit Conditions --- */}
        <Block
          title="9. Step 7: Management Practices & Permit Conditions"
          className={styles.fullWidth}
        >
          <div className="space-y-8">
            {/* Management Practices */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                7.1 Environmental Management Practices (Impact minimisation,
                prevention, abatement practices and improvement opportunities to
                be incorporated into the action plan) and LIMITATIONS
              </Title>
              <Table
                dataSource={managementData?.managementPractices || []}
                columns={[
                  {
                    title: "Issue/Area",
                    dataIndex: "issue",
                    key: "issue",
                    width: "35%",
                  },
                  {
                    title: "Management Practice Implemented",
                    dataIndex: "practice",
                    key: "practice",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No management practices reported" }}
              />
            </div>

            {/* Permit Conditions */}
            <div>
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                7.2 Current Permit Conditions Compliance
              </Title>
              <Table
                dataSource={managementData?.permitConditions || []}
                columns={[
                  {
                    title: "Permit Condition",
                    dataIndex: "condition",
                    key: "condition",
                    width: "30%",
                  },
                  {
                    title: "Actions Implemented",
                    dataIndex: "actionsImplemented",
                    key: "actionsImplemented",
                  },
                  {
                    title: "Additional/Proposed Actions",
                    dataIndex: "additionalActions",
                    key: "additionalActions",
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                rowKey="id"
                locale={{ emptyText: "No permit conditions reported" }}
              />
            </div>
          </div>
        </Block>

        {/* --- BLOCK 10: Step 8 - Supporting Documents --- */}
        <Block
          title="10. Step 8: Supporting Documents"
          className={styles.fullWidth}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text strong className="block mb-2">
                8.1 Certificate of Incorporation
              </Text>
              {renderDocumentRefer(
                attachments?.certificateOfIncorporation,
                "Certificate of Incorporation"
              )}
            </div>
            <div>
              <Text strong className="block mb-2">
                8.2 Environmental Permit & Schedule
              </Text>
              {renderDocumentRefer(
                attachments?.environmentalPermitAndSchedule,
                "Environmental Permit & Schedule"
              )}
            </div>
            <div>
              <Text strong className="block mb-2">
                8.3 Environmental Quality Monitoring Reports
              </Text>
              {renderDocumentRefer(
                attachments?.environmentalMonitoringReports,
                "Environmental Quality Monitoring Reports"
              )}
            </div>
            <div>
              <Text strong className="block mb-2">
                8.4 Incident/Accident Report
              </Text>
              {renderDocumentRefer(
                attachments?.incidentAccidentReport,
                "Incident/Accident Report"
              )}
            </div>
          </div>

          {attachments?.otherDocuments?.length > 0 && (
            <div className="mt-8">
              <Title level={4} className="!text-sm !font-semibold !mb-3">
                Other Supporting Documents
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.otherDocuments.map((doc: any, index: number) => (
                  <div key={doc.id || index}>
                    {renderDocumentRefer(doc, `Other Document ${index + 1}`)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Block>

        {/* --- Supporting Documents Viewer --- */}
        <Block
          title="11. All Supporting Documents"
          className={styles.fullWidth}
        >
          <div id="supporting-documents" className="w-full bg-red-500">
            <SupportingDocumentsGrid
              attachments={application?.attachments}
              onDocumentView={handleDocumentView}
            />
          </div>
        </Block>
      </div>
    </div>
  );
};

export default EnvironmentalManufacturingEMRReview;
