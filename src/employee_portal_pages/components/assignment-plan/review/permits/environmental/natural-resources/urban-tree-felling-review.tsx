import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Table, Typography, Divider } from "antd";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Title } = Typography;

interface UrbanTreeFellingReviewProps {
  application: any;
}

export const UrbanTreeFellingReview: React.FC<UrbanTreeFellingReviewProps> = ({
  application,
}) => {
  const { answers } = application;

  const { permitDetails } = answers || {};
  const urbanTreeFellingData =
    answers?.environmentalPermitData?.urbanTreeFelling || {};

  const { siteDetails, treeDetails, impactAssessment, compliance } =
    urbanTreeFellingData;

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <div>
        <Title level={1} className="!text-2xl !font-bold !m-0 text-gray-900">
          Permit Application Review
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
          <Detail label="Permit Category:" value="URBAN TREE FELLING/PRUNING" />
        </Block>

        {/* --- BLOCK 3: Activity Overview --- */}
        <Block title="3. Activity Overview" className={styles.fullWidth}>
          <Detail
            label="Justification/Reasons:"
            value={treeDetails?.justification || "N/A"}
          />
        </Block>

        {/* --- BLOCK 4: Project Site & Location --- */}
        <Block title="4. Project Site & Location" className={styles.fullWidth}>
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
              label="Latitude:"
              value={siteDetails?.location?.latitude || "N/A"}
            />
            <Detail
              label="Longitude:"
              value={siteDetails?.location?.longitude || "N/A"}
            />
            <Detail
              label="Location (Brief description of site):"
              value={siteDetails?.location?.majorLandmark || "N/A"}
            />
          </div>
        </Block>

        {/* --- BLOCK 5: Tree Details --- */}
        <Block title="5. Tree Details" className={styles.fullWidth}>
          <Detail
            label="Number of Trees Existing on Premises:"
            value={treeDetails?.numberOfExistingTrees || "N/A"}
          />

          {treeDetails?.treesToFell && treeDetails.treesToFell.length > 0 && (
            <div className="mt-6">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Trees to be Felled
              </Title>
              <div
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <Table
                  dataSource={treeDetails.treesToFell}
                  columns={[
                    {
                      title: "Type of Tree",
                      dataIndex: "species",
                      key: "species",
                      render: (text) => text || "—",
                    },
                    {
                      title: "Number of Trees",
                      dataIndex: "quantity",
                      key: "quantity",
                      render: (text) => text || "—",
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

          {treeDetails?.treesToPrune && treeDetails.treesToPrune.length > 0 && (
            <div className="mt-6">
              <Title
                level={4}
                className="!text-sm !font-semibold !m-0 !mb-4 text-gray-800"
              >
                Trees to be Pruned
              </Title>
              <div
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <Table
                  dataSource={treeDetails.treesToPrune}
                  columns={[
                    {
                      title: "Type of Tree",
                      dataIndex: "species",
                      key: "species",
                      render: (text) => text || "—",
                    },
                    {
                      title: "Number of Trees",
                      dataIndex: "quantity",
                      key: "quantity",
                      render: (text) => text || "—",
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
        </Block>

        {/* --- BLOCK 6: Agency/Organization & Contractor Information --- */}
        <Block
          title="6. Agency/Organization & Contractor Information"
          className={styles.fullWidth}
        >
          <Detail
            label="Agency/Organization Felling the Tree(s):"
            value={compliance?.contractorInfo || "N/A"}
          />
        </Block>

        {/* --- BLOCK 7: Replanting Pledge & Commitment --- */}
        <Block
          title="7. Replanting Pledge & Commitment"
          className={styles.fullWidth}
        >
          <Detail
            label="Pledges to Replant:"
            value={impactAssessment?.pledgeToReplant ? "Yes" : "No"}
          />

          {impactAssessment?.pledgeToReplant && (
            <Detail
              label="Number of Trees to Replant:"
              value={impactAssessment?.numberOfTreesReplant || "N/A"}
            />
          )}

          {/* GPS Location of Replanting Site */}

          <Divider orientation="left">GPS Location of Replanting Site</Divider>

          <Detail
            label="Latitude:"
            value={compliance?.replantingSiteLatitude || "N/A"}
          />
          <Detail
            label="Longitude:"
            value={compliance?.replantingSiteLongitude || "N/A"}
          />
        </Block>

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

export default UrbanTreeFellingReview;
