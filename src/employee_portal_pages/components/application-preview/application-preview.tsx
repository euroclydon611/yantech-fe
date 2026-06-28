import { Spin, Alert, Drawer, Typography, Button, Tooltip } from "antd";
import { FileTextOutlined, SwapRightOutlined } from "@ant-design/icons";
import { useFetchSingleApplicationQuery } from "@/redux/features/employee-portal-api/application/application";
import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";
import { formatDate4 } from "@/utils/helperFunction";
import DocumentManagementSection from "@/employee_portal_pages/components/review/document-management-section";
//permit applications preview components imports
import HazardousWastePreview from "./permits/hazardous-preview";
import PesticideChemicalPreview from "./permits/pesticide-preview";
import DomesticPurchasePreview from "./permits/domestic-purchase-preview";
import WasteDisposalPreview from "./permits/waste-disposal-preview";
import PesticideImportAuthorizationPreview from "./permits/pesticide-import-authorization-preview";
import EfficacyTrialPreview from "./permits/efficacy-trial-preview";

//environmental permit applications preview component
import HealthcareEnvironmentalPreview from "./permits/environmental/healthcare-environmental-preview";
import GeneralConstructionEnvironmentalPreview from "./permits/environmental/general-construction-environmental-preview";
import HospitalityTourismEnvironmentalPreview from "./permits/environmental/hospitality-tourism-environmental-preview";
import EnvironmentalUpstreamPreview from "./permits/environmental/energy/environmental-upstream-preview";
import EnvironmentalMidstreamPreview from "./permits/environmental/energy/environmental-midstream-preview";
import EnergyStpEnvironmentalPreview from "./permits/environmental/energy/energy-stp-environmental-preview";
import EnvironmentalOtherPetroleumPreview from "./permits/environmental/energy/environmental-other-petroleum-activity-preview";
import EnvironmentalEnergyPreview from "./permits/environmental/energy/environmental-energy-preview";
import EnvironmentalLPGPreview from "./permits/environmental/energy/environmental-lpg-preview";
import EnvironmentalRenewableAndNonRenewableEnergyPreview from "./permits/environmental/energy/energy-renewable-and-nonrenewable-preview";
import WasteManagementEnvironmentalPreview from "./permits/environmental/waste-management-environmental-preview";
import EnvironmentalManufacturingEA1Preview from "./permits/environmental/manufacturing/form-ea1-preview";
import EnvironmentalManufacturingEM1Preview from "./permits/environmental/manufacturing/form-em1-preview";
import EnvironmentalManufacturingEMRPreview from "./permits/environmental/manufacturing/form-mid-emr-preview";

//environmental mininng permits preview components
import EnvironmentalSmallScaleMiningPreview from "./permits/environmental/mining/small-scale-mining-preview";
import EnvironmentalMediumScaleMiningPreview from "./permits/environmental/mining/medium-scale-preview";
import EnvironmentalLargeScaleMiningPreview from "./permits/environmental/mining/large-scale-mining-preview";
import EnvironmentalGoldTradingMiningPreview from "./permits/environmental/mining/gold-trading-preview";
import EnvironmentalMineralExplorationPreview from "./permits/environmental/mining/mineral-exploration-preview";

import EnvironmentalNaturalResourcesEA1Preview from "./permits/environmental/natural-resources/nr-form-ea1-preview";
import EnvironmentalNaturalResourcesRenewalPreview from "./permits/environmental/natural-resources/nr-renewal-preview";
import UrbanTreeFellingPreview from "./permits/environmental/natural-resources/urban-tree-felling-peview";
import EnvironmentalAgriculturalProjectsEA1Preview from "./permits/environmental/natural-resources/agricultural-projects-ea1-preview";

//license applications imports
import {
  PesticideImportationPreview,
  PesticideAdvertisementPreview,
  PesticideCommercialPreview,
  PesticideDistributionPreview,
  PesticideExportPreview,
  PesticideFormulationPreview,
  PesticideManufacturePreview,
  PesticideRepackagingPreview,
  PesticideSalePreview,
  PesticideStoragePreview,
  PesticideTransportationPreview,
} from "./licenses/pesticide-previews";
import { HazardousChemicalsTransportationPreview } from "./licenses/industrial-chemical-previews";

import { normalizeText } from "@/utils/helpers";
import { getStatusBadge } from "@/employee_portal_pages/lib/helpers";
import UploadedReport from "../application/uploaded-reports";

const { Title, Text } = Typography;

const ApplicationPreview = ({
  applicationId,
  isOpen = false,
  onClose,
  type,
  canTransfer = false,
  onTransfer = undefined,
}) => {
  const { data, isLoading, error, refetch } = useFetchSingleApplicationQuery({
    id: applicationId,
    type,
  });

  //fetch associated assignment plan
  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId, refetchOnMountOrArgChange: true }
  );

  const application = data?.data || {};

  const { requiresInspection, requiresAnalysis, requiresPublicHearing } =
    application;

  const categoryPreviewMap: Record<string, React.ReactNode> = {
    importation: <PesticideImportationPreview application={application} />,
    sale: <PesticideSalePreview application={application} />,
    distribution: <PesticideDistributionPreview application={application} />,
    commercial_application: (
      <PesticideCommercialPreview application={application} />
    ),
    storage: <PesticideStoragePreview application={application} />,
    transportation:
      application.licenseType === "industrial_chemical" ? (
        <HazardousChemicalsTransportationPreview application={application} />
      ) : (
        <PesticideTransportationPreview application={application} />
      ),
    formulation: <PesticideFormulationPreview application={application} />,
    repackaging: <PesticideRepackagingPreview application={application} />,
    manufacture: <PesticideManufacturePreview application={application} />,
    exportation: <PesticideExportPreview application={application} />,
    advertisement: <PesticideAdvertisementPreview application={application} />,
  };

  const renderPermitDetails = () => {
    return (
      <div className="space-y-6">
        <div className="border border-gray-300 bg-white mb-6">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                <FileTextOutlined className="text-gray-600 text-sm" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 m-0">
                Application Overview
              </h4>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Application Code:
                </span>
                <span className="block text-sm font-medium font-mono">
                  {application?.code || "N/A"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Application Type
                </span>
                <span className="block text-sm font-medium">
                  {normalizeText(application?.applicationType || "N/A")}
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Processing Type
                </span>
                <span className="block text-sm font-medium">
                  {normalizeText(application?.processingType || "N/A")}
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Application Status
                </span>
                <span className="inline-flex items-center  py-1 rounded text-xs font-medium ">
                  {getStatusBadge(application?.status)}
                </span>
              </div>

              <div className="space-y-1" hidden={!requiresInspection}>
                <span className="block text-xs font-extrabold text-black uppercase tracking-wide">
                  Requires Inspection:
                </span>
                <span className="block text-sm text-gray-800 font-medium">
                  {application.requiresInspection ? "Yes" : "No"}{" "}
                </span>
              </div>

              <div className="space-y-1" hidden={!requiresAnalysis}>
                <span className="block text-xs font-extrabold text-black uppercase tracking-wide">
                  Requires Analysis:
                </span>
                <span className="block text-sm text-gray-800 font-medium">
                  {requiresAnalysis ? "Yes" : "No"}{" "}
                </span>
              </div>

              <div className="space-y-1" hidden={!requiresPublicHearing}>
                <span className="block text-xs font-extrabold text-black uppercase tracking-wide">
                  Requires Public Hearing:
                </span>
                <span className="block text-sm text-gray-800 font-medium">
                  {requiresPublicHearing ? "Yes" : "No"}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const modalTitle = (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
        <FileTextOutlined className="text-white text-sm" />
      </div>
      <div>
        <Title level={4} className="text-gray-800 mb-0">
          {application ? application.title : "Application Details"}
        </Title>
        {application && (
          <Text className="text-sm text-gray-500">
            Application Code: {application.code}
          </Text>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <Spin />;
  }
  return (
    <Drawer
      title={modalTitle}
      open={isOpen}
      onClose={onClose}
      placement="right"
      width={window.innerWidth < 640 ? "100%" : "95%"}
      className="application-preview-drawer"
      extra={
        canTransfer && onTransfer ? (
          <Tooltip title="Transfer Application">
            <Button
              icon={<SwapRightOutlined />}
              onClick={onTransfer}
              className="hover:bg-orange-50 hover:border-orange-300 !text-orange-600 !border-orange-400"
            >
              Transfer
            </Button>
          </Tooltip>
        ) : null
      }
    >
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
            <Text className="ml-3">Loading application details...</Text>
          </div>
        )}

        {!isLoading && !error && !application && (
          <Alert
            message="No Application Found"
            description="The requested application could not be found."
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        {application && (
          <div className="space-y-6">
            {application?.rejectionNotes?.reason && (
              <div className="space-y-1">
                <span className="block text-xs font-bold text-red-700 uppercase tracking-wide">
                  Rejection Note
                </span>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <span className="block text-sm text-red-800 font-medium">
                    {application?.rejectionNotes?.reason || "N/A"}
                  </span>
                </div>
              </div>
            )}
            {application?.correctionsNotes?.length > 0 && (
              <div className="space-y-1">
                <span className="block text-xs font-bold text-orange-700 uppercase tracking-wide">
                  Correction Notes
                </span>
                <div className="bg-orange-50 border border-orange-200 rounded p-3 space-y-2">
                  {application.correctionsNotes.map(
                    (noteItem: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-orange-200 last:border-b-0 pb-2 last:pb-0"
                      >
                        <span className="block text-sm text-orange-800 font-medium mb-1">
                          {noteItem.note || "N/A"}
                        </span>
                        <span className="text-xs text-orange-600">
                          — {noteItem.createdBy} on{" "}
                          {formatDate4(noteItem.createdAt)}{" "}
                        </span>
                        {noteItem.attachments?.length > 0 && (
                          <div className="mt-1.5 space-y-1">
                            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                              Attachments ({noteItem.attachments.length}):
                            </span>
                            {noteItem.attachments.map((att: any, attIdx: number) => (
                              <a
                                key={attIdx}
                                href={att.s3Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                <span>📎</span>
                                <span>{att.label || att.originalname || `Attachment ${attIdx + 1}`}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {renderPermitDetails()}
            {application?.reportRequirements &&
              application.reportRequirements.length > 0 && (
                <UploadedReport
                  assignmentId={assignmentData?.data?._id || ""}
                  reportRequirements={application.reportRequirements}
                  reportDocuments={application.reportDocuments}
                  refetch={refetch}
                />
              )}
            {/* Pesticide, Industrial Chemical, and hazardouse-waste specific sections */}
            {["import", "export"].includes(application?.permitType) &&
              ["pesticide", "industrial_chemical"].includes(
                application?.permitCategory
              ) && <PesticideChemicalPreview application={application} />}
            {application?.permitType === "domestic_purchase" &&
              application?.permitCategory === "industrial_chemical" && (
                <DomesticPurchasePreview application={application} />
              )}
            {["import", "export"].includes(application?.permitType) &&
              application.permitCategory == "hazardous_waste" && (
                <HazardousWastePreview application={application} />
              )}
            {application?.permitType === "hazardous_waste_disposal" &&
              application?.permitCategory === "hazardous_waste" && (
                <WasteDisposalPreview application={application} />
              )}
            {application?.authorizationType ===
              "pesticide_import_authorization" && (
              <PesticideImportAuthorizationPreview application={application} />
            )}
            {type === "efficacy-trial" && (
              <EfficacyTrialPreview application={application} />
            )}
            {/* environmental permit section */}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "health_sector" && (
                <HealthcareEnvironmentalPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "general_construction" && (
                <GeneralConstructionEnvironmentalPreview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "hospitality_tourism" && (
                <HospitalityTourismEnvironmentalPreview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              ["non_renewable", "renewable"].includes(
                application?.answers?.permitDetails.energyCategory
              ) && (
                <EnvironmentalRenewableAndNonRenewableEnergyPreview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "upstream" && (
                <EnvironmentalUpstreamPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "midstream" && (
                <EnvironmentalMidstreamPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "other_petroleum_activity" && (
                <EnvironmentalOtherPetroleumPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "service_type" && (
                <EnergyStpEnvironmentalPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "retail_outlet" &&
              [
                "fuel_filling_station",
                "fuel_service_station",
                "fuel_dump",
              ].includes(
                application?.answers?.environmentalPermitData?.energy?.subType
              ) && <EnvironmentalEnergyPreview application={application} />}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "retail_outlet" &&
              [
                "lpg_refilling_station",
                "lpg_exchange_point",
                "lpg_distribution_point",
              ].includes(
                application?.answers?.environmentalPermitData?.energy?.subType
              ) && <EnvironmentalLPGPreview application={application} />}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "waste_management" && (
                <WasteManagementEnvironmentalPreview
                  application={application}
                />
              )}
            {/* environmental - mining */}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "small_scale_mining" && (
                <EnvironmentalSmallScaleMiningPreview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "medium_scale_mining" && (
                <EnvironmentalMediumScaleMiningPreview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "large_scale_mining" && (
                <EnvironmentalLargeScaleMiningPreview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "gold_trading" && (
                <EnvironmentalGoldTradingMiningPreview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "mineral_exploration" && (
                <EnvironmentalMineralExplorationPreview
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.applicationType ==
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.permitCategory === "manufacturing_sector" &&
              !application?.answers?.environmentalPermitData?.manufacturing
                ?.isExistingUndertaking && (
                <EnvironmentalManufacturingEA1Preview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.applicationType ==
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.permitCategory === "manufacturing_sector" &&
              application?.answers?.environmentalPermitData?.manufacturing
                ?.isExistingUndertaking && (
                <EnvironmentalManufacturingEM1Preview
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.applicationType ===
              "renewal" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "manufacturing_sector" && (
                <EnvironmentalManufacturingEMRPreview
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.applicationType ==
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesEA1Preview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.applicationType ==
              "renewal" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesRenewalPreview
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              ["agricultural_projects"].includes(
                application?.permitCategory
              ) && (
                <EnvironmentalAgriculturalProjectsEA1Preview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "urban_tree_felling" &&
              application?.answers?.environmentalPermitData
                ?.urbanTreeFelling && (
                <UrbanTreeFellingPreview application={application} />
              )}

            {/* ================ License-specific sections =============== */}

            {/* Render license category-specific preview */}
            {(application?.licenseType === "pesticide" ||
              application?.licenseType === "industrial_chemical" ||
              application?.licenseType === "hazardous_waste") &&
              application?.licenseCategory &&
              categoryPreviewMap[application?.licenseCategory] && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {categoryPreviewMap[application?.licenseCategory]}
                </div>
              )}

            <DocumentManagementSection
              applicationId={applicationId}
              applicationType={type}
              uploadedDocuments={application?.uploadedDocuments}
              refetch={refetch}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ApplicationPreview;
