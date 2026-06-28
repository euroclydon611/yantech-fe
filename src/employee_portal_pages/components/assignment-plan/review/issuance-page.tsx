import React, { useState } from "react";
import { Drawer, Button, Empty } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import IssueEnvironmentalPermit from "./issuance-templates/issue-environmental-permit";
import IssuePesticideImportAuthorizationPermit from "./issuance-templates/issue-pesticide-import-authorization-permit";
import IssuePesticideIndustrialChemicalPermit from "./issuance-templates/issue-pesticide-checmical-permit";
import IssueDomesticPurchasePermit from "./issuance-templates/issue-domestic-purchase-permit";
import IssueHazardousWasteDisposalPermit from "./issuance-templates/issue-hazardous-waste-disposal-permit";
import IssueEfficacyTrialPermit from "./issuance-templates/issue-efficacy-trial-permit";
import IssueAllLicense from "./issuance-templates/issue-all-license";

interface IssuancePreparationPanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (issuanceData: any) => Promise<void>;
  applicationData: any;
  task?: any;
}

const IssuancePreparationPanel: React.FC<IssuancePreparationPanelProps> = ({
  open,
  onClose,
  onSubmit,
  applicationData,
  task,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { permitDetails } = applicationData?.answers || {};
  const permitType = applicationData?.permitType;
  const authorizationType = applicationData?.authorizationType;
  const { licenseType, licenseCategory } = applicationData || {};


  const combinedPermitType = `${permitDetails?.permitType}_${permitDetails?.permitCategory}`;
  const isPesticideOrChemicalPermit = [
    "import_pesticide",
    "export_pesticide",
    "import_industrial_chemical",
    "export_industrial_chemical",
  ].includes(combinedPermitType);

  const getPesticideChemicalTitle = () => {
    switch (combinedPermitType) {
      case "import_pesticide":
        return "Pesticide Import";
      case "export_pesticide":
        return "Pesticide Export";
      case "import_industrial_chemical":
        return "Industrial & Consumer Chemical Import";
      case "export_industrial_chemical":
        return "Industrial & Consumer Chemical Export";
      default:
        return "Permit";
    }
  };

  const handleSubmit = async (issuanceData: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(issuanceData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <FileTextOutlined className="text-xl text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">
              {licenseType
                ? "Issue License"
                : permitType === "environmental_permit"
                ? "Issue Environmental Permit"
                : isPesticideOrChemicalPermit
                ? `Issue ${getPesticideChemicalTitle()} Permit`
                : authorizationType === "pesticide_import_authorization"
                ? "Issue Pesticide Import Authorization"
                : task?.applicationType === "EfficacyTrial"
                ? "Issue Efficacy Trial Permit"
                : permitType === "domestic_purchase"
                ? "Issue Domestic Purchase Permit"
                : permitType === "hazardous_waste_disposal"
                ? "Issue Hazardous Waste Disposal Permit"
                : "Issue Permit"}
            </h2>
            <p className="text-xs text-slate-600 m-0">
              For Application: {applicationData?.code || "N/A"}
            </p>
          </div>
        </div>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={permitType === "environmental_permit" ? 1300 : 960}
      maskClosable={false}
      closable={!isSubmitting}
      footer={
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      }
    >
      <div className="h-full flex flex-col bg-slate-50 -m-6 p-6">
        {licenseType ? (
          <IssueAllLicense
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : permitType === "environmental_permit" ? (
          <IssueEnvironmentalPermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : isPesticideOrChemicalPermit ? (
          <IssuePesticideIndustrialChemicalPermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : authorizationType === "pesticide_import_authorization" ? (
          <IssuePesticideImportAuthorizationPermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : task?.applicationType === "EfficacyTrial" ? (
          <IssueEfficacyTrialPermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : permitType === "domestic_purchase" ? (
          <IssueDomesticPurchasePermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : permitType === "hazardous_waste_disposal" ? (
          <IssueHazardousWasteDisposalPermit
            applicationData={applicationData}
            task={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSave={async () => {}}
          />
        ) : (
          <Empty
            description="Issuance type not supported"
            style={{ marginTop: "50px" }}
          />
        )}
      </div>
    </Drawer>
  );
};

export default IssuancePreparationPanel;
