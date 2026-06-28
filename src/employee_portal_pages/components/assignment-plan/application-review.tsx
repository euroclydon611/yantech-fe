import { Spin, Alert, Drawer, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useFetchSingleApplicationQuery, useUpdateApplicationSectionMutation } from "@/redux/features/employee-portal-api/application/application";
import { formatDate4 } from "@/utils/helperFunction";
import HazardousWasteReview from "./review/permits/hazardous-review";
import PesticideChemicalReview from "./review/permits/pesticide-review";
import DomesticPurchaseReview from "./review/permits/domestic-purchase-review";
import WasteDisposalReview from "./review/permits/waste-disposal-review";
import { normalizeText } from "@/utils/helpers";
import PesticideImportAuthorizationReview from "./review/permits/pesticide-import-authorization-review";
import { EfficacyTrialReview } from "./review/permits/efficacy-trial-review";
import DocumentManagementSection from "@/employee_portal_pages/components/review/document-management-section";

//environmental permit applications Review component imports
import HealthcareEnvironmentalReview from "./review/permits/environmental/healthcare-environmental-review";
import GeneralConstructionEnvironmentalReview from "./review/permits/environmental/general-construction-environmental-review";
import HospitalityTourismEnvironmentalReview from "./review/permits/environmental/hospitality-tourism-environmental-review";
import EnvironmentalUpstreamReview from "./review/permits/environmental/energy/environmental-upstream-review";
import EnvironmentalMidstreamReview from "./review/permits/environmental/energy/environmental-midstream-review";
import EnergyStpEnvironmentalReview from "./review/permits/environmental/energy/energy-stp-environmental-preview";
import EnvironmentalOtherPetroleumReview from "./review/permits/environmental/energy/environmental-other-petroleum-activity-review";
import EnvironmentalEnergyReview from "./review/permits/environmental/energy/environmental-energy-review";
import EnvironmentalLPGReview from "./review/permits/environmental/energy/environmental-lpg-review";
import EnvironmentalRenewableAndNonRenewableEnergyReview from "./review/permits/environmental/energy/energy-renewable-and-nonrenewable-review";
import WasteManagementEnvironmentalReview from "./review/permits/environmental/waste-management-environmental-review";
import EnvironmentalManufacturingEA1Review from "./review/permits/environmental/manufacturing/form-ea1-review";
import EnvironmentalManufacturingEM1Review from "./review/permits/environmental/manufacturing/form-em1-review";
import EnvironmentalManufacturingEMRReview from "./review/permits/environmental/manufacturing/form-mid-emr-review";
//environmental mininng permits preview components
import EnvironmentalSmallScaleMiningReview from "./review/permits/environmental/mining/small-scale-mining-review";
import EnvironmentalMediumScaleMiningReview from "./review/permits/environmental/mining/medium-scale-review";
import EnvironmentalLargeScaleMiningReview from "./review/permits/environmental/mining/large-scale-mining-review";
import EnvironmentalGoldTradingMiningReview from "./review/permits/environmental/mining/gold-trading-review";
import EnvironmentalMineralExplorationReview from "./review/permits/environmental/mining/mineral-exploration-review";

import UrbanTreeFellingReview from "./review/permits/environmental/natural-resources/urban-tree-felling-review";
import EnvironmentalNaturalResourcesEA1Review from "./review/permits/environmental/natural-resources/nr-form-ea1-review";
import EnvironmentalAgriculturalProjectsEA1Review from "./review/permits/environmental/natural-resources/agricultural-projects-ea1-review";
import EnvironmentalNaturalResourcesRenewalReview from "./review/permits/environmental/natural-resources/nr-renewal-review";

//license applications imports
import {
  PesticideImportationReview,
  PesticideAdvertisementReview,
  PesticideCommercialReview,
  PesticideDistributionReview,
  PesticideExportReview,
  PesticideFormulationReview,
  PesticideManufactureReview,
  PesticideRepackagingReview,
  PesticideSaleReview,
  PesticideStorageReview,
  PesticideTransportationReview,
} from "./review/licenses/pesticide-reviews";
import { HazardousChemicalsTransportationReview } from "./review/licenses/industrial-chemical-previews";

import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";
import UploadedReport from "../application/uploaded-reports";
import Loader from "@/components/Loader";

const { Title, Text } = Typography;

const ApplicationReview = ({
  applicationId,
  isOpen = false,
  onClose,
  applicationType,
}) => {
  const { data, isLoading, error, refetch } = useFetchSingleApplicationQuery({
    id: applicationId,
    type: applicationType,
  });

  const [updateApplicationSection] = useUpdateApplicationSectionMutation();

  const handleSectionUpdate = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    if (!applicationId) return;

    try {
      const payload = {
        id: applicationId,
        sectionKey,
        type,
        status,
        comment,
        applicationType: applicationType || "permit",
      };
      await updateApplicationSection({
        payload,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update section:", err);
    }
  };

  //fetch associated assignment plan
  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId, refetchOnMountOrArgChange: true }
  );

  const application = data?.data || {};

  const { requiresInspection, requiresAnalysis, requiresPublicHearing } = application;

  // pesticide license mapping
  const categoryReviewMap: Record<string, React.ReactNode> = {
    importation: <PesticideImportationReview application={application} />,
    sale: <PesticideSaleReview application={application} />,
    distribution: <PesticideDistributionReview application={application} />,
    commercial_application: (
      <PesticideCommercialReview application={application} />
    ),
    storage: <PesticideStorageReview application={application} />,
    transportation:
      application.licenseType === "industrial_chemical" ? (
        <HazardousChemicalsTransportationReview application={application} />
      ) : (
        <PesticideTransportationReview application={application} />
      ),
    formulation: <PesticideFormulationReview application={application} />,
    repackaging: <PesticideRepackagingReview application={application} />,
    manufacture: <PesticideManufactureReview application={application} />,
    exportation: <PesticideExportReview application={application} />,
    advertisement: <PesticideAdvertisementReview application={application} />,
  };

  const renderPermitDetails = () => (
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
              Permit Type:
            </span>
            <span className="block text-sm font-medium">
              {normalizeText(application?.permitType)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Processing Type
            </span>
            <span className="block text-smfont-medium">
              {normalizeText(application?.processingType || "N/A")}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Permit Category:
            </span>
            <span className="block text-sm text-gray-800 font-medium">
              {normalizeText(application?.permitCategory)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Application Status
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
              {normalizeText(application?.status)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Date Submitted
            </span>
            <span className="block text-sm text-gray-800 font-medium">
              {formatDate4(application?.createdAt) || "N/A"}
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
  );

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
      className="application-review-drawer"
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

            <DocumentManagementSection
              applicationId={applicationId}
              applicationType={applicationType}
              uploadedDocuments={application?.uploadedDocuments}
              refetch={refetch}
            />

            {["import", "export"].includes(application?.permitType) &&
              ["pesticide", "industrial_chemical"].includes(
                application?.permitCategory
              ) && (
                <PesticideChemicalReview
                  application={application}
                  assignment={assignmentData?.data}
                  onApplicationUpdate={handleSectionUpdate}
                />
              )}
            {application?.permitType === "domestic_purchase" &&
              application?.permitCategory === "industrial_chemical" && (
                <DomesticPurchaseReview 
                  application={application} 
                  onApplicationUpdate={handleSectionUpdate}
                />
              )}
            {["import", "export"].includes(application?.permitType) &&
              application.permitCategory == "hazardous_waste" && (
                <HazardousWasteReview 
                  application={application} 
                  onApplicationUpdate={handleSectionUpdate}
                />
              )}
            {application?.permitType === "hazardous_waste_disposal" &&
              application?.permitCategory === "hazardous_waste" && (
                <WasteDisposalReview 
                  application={application} 
                  // onApplicationUpdate={handleSectionUpdate}
                />
              )}
            {application?.authorizationType ===
              "pesticide_import_authorization" && (
              <PesticideImportAuthorizationReview 
                application={application} 
                onApplicationUpdate={handleSectionUpdate}
              />
            )}
            {applicationType === "efficacy-trial" && (
              <EfficacyTrialReview 
                application={application} 
                onApplicationUpdate={handleSectionUpdate}
              />
            )}
            {/* {application.permitCategory == "hazardous_waste" && (
              <HazardousWastePreview
                permitType={application.permitType}
                hazardousWasteInfo={application.hazardousWasteDetails}
              />
            )} */}
            {/* environmental permit section */}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "health_sector" && (
                <HealthcareEnvironmentalReview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "general_construction" && (
                <GeneralConstructionEnvironmentalReview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "hospitality_tourism" && (
                <HospitalityTourismEnvironmentalReview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              ["non_renewable", "renewable"].includes(
                application?.answers?.permitDetails.energyCategory
              ) && (
                <EnvironmentalRenewableAndNonRenewableEnergyReview
                  application={application}
                />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "upstream" && (
                <EnvironmentalUpstreamReview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "midstream" && (
                <EnvironmentalMidstreamReview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.petroleumSector === "other_petroleum_activity" && (
                <EnvironmentalOtherPetroleumReview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "service_type" && (
                <EnergyStpEnvironmentalReview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "retail_outlet" &&
              [
                "fuel_filling_station",
                "fuel_service_station",
                "fuel_dump",
              ].includes(
                application?.answers?.environmentalPermitData?.energy?.subType
              ) && <EnvironmentalEnergyReview application={application} />}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy
                ?.operationType === "retail_outlet" &&
              [
                "lpg_refilling_station",
                "lpg_exchange_point",
                "lpg_distribution_point",
              ].includes(
                application?.answers?.environmentalPermitData?.energy?.subType
              ) && <EnvironmentalLPGReview application={application} />}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "waste_management" && (
                <WasteManagementEnvironmentalReview application={application} />
              )}
            {/* environmental - mining */}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "small_scale_mining" && (
                <EnvironmentalSmallScaleMiningReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "medium_scale_mining" && (
                <EnvironmentalMediumScaleMiningReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "large_scale_mining" && (
                <EnvironmentalLargeScaleMiningReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "gold_trading" && (
                <EnvironmentalGoldTradingMiningReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType ===
                "mineral_exploration" && (
                <EnvironmentalMineralExplorationReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.applicationType ===
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "manufacturing_sector" &&
              !application?.answers?.environmentalPermitData?.manufacturing
                ?.isExistingUndertaking && (
                <EnvironmentalManufacturingEA1Review
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.applicationType ===
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "manufacturing_sector" &&
              application?.answers?.environmentalPermitData?.manufacturing
                ?.isExistingUndertaking && (
                <EnvironmentalManufacturingEM1Review
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.applicationType ===
              "renewal" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory ===
                "manufacturing_sector" && (
                <EnvironmentalManufacturingEMRReview
                  application={application}
                />
              )}

            {application?.answers?.permitDetails?.applicationType ===
              "new_application" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesEA1Review
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.applicationType ===
              "renewal" &&
              application?.answers?.permitDetails?.permitType ===
                "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesRenewalReview
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              ["agricultural_projects"].includes(
                application?.permitCategory
              ) && (
                <EnvironmentalAgriculturalProjectsEA1Review
                  application={application}
                />
              )}
            {application?.answers?.permitDetails?.permitType ===
              "environmental_permit" &&
              application?.permitCategory === "urban_tree_felling" &&
              application?.answers?.environmentalPermitData
                ?.urbanTreeFelling && (
                <UrbanTreeFellingReview application={application} />
              )}

            {/* License-specific sections */}
            {/* Render license category-specific preview */}
            {(application?.licenseType === "pesticide" ||
              application?.licenseType === "industrial_chemical" ||
              application?.licenseType === "hazardous_waste") &&
              application?.licenseCategory &&
              categoryReviewMap[application?.licenseCategory] && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {categoryReviewMap[application?.licenseCategory]}
                </div>
              )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ApplicationReview;
