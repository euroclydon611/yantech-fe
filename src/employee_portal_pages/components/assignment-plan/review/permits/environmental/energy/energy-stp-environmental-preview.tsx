import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Alert, Button, Card, List, Typography } from "antd";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import {
  normalizeText,
  handleDocumentView,
  formatDate4,
} from "@/utils/helperFunction";

const { Text } = Typography;
interface EnergyStpEnvironmentalReviewProps {
  application: any;
}

// Undertaking type configurations
export const ENERGY_UNDERTAKING_TYPES = [
  {
    value: "omc",
    label: "Oil Marketing Company (OMC)",
    description:
      "Companies engaged in the marketing and distribution of petroleum products",
    icon: "🛢️",
  },
  {
    value: "lpgmc",
    label: "LPG Marketing Company (LPGMC)",
    description: "Companies specializing in LPG marketing and distribution",
    icon: "⛽",
  },
  {
    value: "otc",
    label: "Oil Trading Company (OTC)",
    description: "Companies engaged in oil trading and wholesale operations",
    icon: "📈",
  },
  {
    value: "bdc",
    label: "Bulk Distribution Company (BDC)",
    description:
      "Companies handling bulk storage and distribution of petroleum products",
    icon: "🚛",
  },
  {
    value: "tank_cleaning",
    label: "Tank Cleaning and Calibration Services",
    description:
      "Specialized services for tank cleaning, calibration, and maintenance",
    icon: "🧽",
  },
  {
    value: "other",
    label: "Other Energy Services",
    description: "Other energy sector service operations",
    icon: "⚡",
  },
];

const EnergyStpEnvironmentalReview: React.FC<
  EnergyStpEnvironmentalReviewProps
> = ({ application }) => {
  const { clientId, submittedByAgent, answers } = application;

  const { permitDetails } = answers || {};

  const energyStpData = answers?.environmentalPermitData?.energy?.stp || {};
  const { undertakingType, projectSiteDetails } = energyStpData;

  // Get undertaking type label
  const getUndertakingTypeLabel = (type: string) => {
    const undertaking = ENERGY_UNDERTAKING_TYPES.find((u) => u.value === type);
    return undertaking ? undertaking.label : type;
  };

  const getCorporateEnvironmentalTitle = () => {
    if (permitDetails?.applicationType === "new_application") {
      return "Corporate Environmental Policy (CEP)";
    }
    if (permitDetails?.applicationType === "renewal") {
      return "Corporate Environmental Management Plan (CEMP)";
    }
    return "Corporate Environmental Plan";
  };

  if (!application) {
    return <div>Loading application details...</div>;
  }

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
            value="ENERGY SECTOR - DOWNSTREAM PETROLEUM OPERATIONS  CORPORATE PERMIT"
          />
          <Detail
            label="Type of Undertaking:"
            value={getUndertakingTypeLabel(undertakingType)}
          />
        </Block>

        {/* --- BLOCK 3: Corporate Environmental Plan --- */}
        <Block title={`3. ${getCorporateEnvironmentalTitle()}`}>
          <>
            {/* Supporting Documents */}
            {application?.attachments?.length > 0 ? (
              <div className="bg-slate-50 rounded-lg p-2">
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
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
                              {getCorporateEnvironmentalTitle()}
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
                message="Corporate Environmental Plan Document"
                type="info"
                showIcon
                style={{ textAlign: "center", marginTop: 16 }}
              />
            )}
          </>
        </Block>

        {/* --- BLOCK 4: Project Site Details --- */}
        <Block title="4. Corporate Office Location">
          <Detail
            label="Region:"
            value={normalizeText(projectSiteDetails?.location?.region)}
          />
          <Detail
            label="District:"
            value={normalizeText(projectSiteDetails?.location?.district)}
          />
          <Detail label="City:" value={projectSiteDetails?.location?.city} />
          <Detail
            label="Address:"
            value={projectSiteDetails?.location?.address}
          />
          <Detail
            label="Google Maps Link:"
            value={projectSiteDetails?.location?.googleLocationLink}
          />
        </Block>
      </div>
    </div>
  );
};

export default EnergyStpEnvironmentalReview;
