import { Spin, Alert, Drawer, Typography, Tag } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import {
  useGetAdminSinglePermitApplicationQuery,
  useGetAdminSingleAuthorizationRequestQuery,
  useGetAdminSingleEfficacyTrialQuery,
  useGetAdminSingleLicenseApplicationQuery,
} from "@/redux/features/general/client-applications";
import { formatDate2, formatDate4 } from "@/utils/helperFunction";
import { getStatusBadge } from "@/employee_portal_pages/lib/helpers";
import { normalizeText } from "@/utils/helpers";

// permit preview components
import HazardousWastePreview from "@/employee_portal_pages/components/application-preview/permits/hazardous-preview";
import PesticideChemicalPreview from "@/employee_portal_pages/components/application-preview/permits/pesticide-preview";
import DomesticPurchasePreview from "@/employee_portal_pages/components/application-preview/permits/domestic-purchase-preview";
import WasteDisposalPreview from "@/employee_portal_pages/components/application-preview/permits/waste-disposal-preview";
import PesticideImportAuthorizationPreview from "@/employee_portal_pages/components/application-preview/permits/pesticide-import-authorization-preview";
import EfficacyTrialPreview from "@/employee_portal_pages/components/application-preview/permits/efficacy-trial-preview";

// environmental permit preview components
import HealthcareEnvironmentalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/healthcare-environmental-preview";
import GeneralConstructionEnvironmentalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/general-construction-environmental-preview";
import HospitalityTourismEnvironmentalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/hospitality-tourism-environmental-preview";
import EnvironmentalUpstreamPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/environmental-upstream-preview";
import EnvironmentalMidstreamPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/environmental-midstream-preview";
import EnergyStpEnvironmentalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/energy-stp-environmental-preview";
import EnvironmentalOtherPetroleumPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/environmental-other-petroleum-activity-preview";
import EnvironmentalEnergyPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/environmental-energy-preview";
import EnvironmentalLPGPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/environmental-lpg-preview";
import EnvironmentalRenewableAndNonRenewableEnergyPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/energy/energy-renewable-and-nonrenewable-preview";
import WasteManagementEnvironmentalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/waste-management-environmental-preview";
import EnvironmentalManufacturingEA1Preview from "@/employee_portal_pages/components/application-preview/permits/environmental/manufacturing/form-ea1-preview";
import EnvironmentalManufacturingEM1Preview from "@/employee_portal_pages/components/application-preview/permits/environmental/manufacturing/form-em1-preview";
import EnvironmentalManufacturingEMRPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/manufacturing/form-mid-emr-preview";
import EnvironmentalSmallScaleMiningPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/mining/small-scale-mining-preview";
import EnvironmentalMediumScaleMiningPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/mining/medium-scale-preview";
import EnvironmentalLargeScaleMiningPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/mining/large-scale-mining-preview";
import EnvironmentalGoldTradingMiningPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/mining/gold-trading-preview";
import EnvironmentalMineralExplorationPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/mining/mineral-exploration-preview";
import EnvironmentalNaturalResourcesEA1Preview from "@/employee_portal_pages/components/application-preview/permits/environmental/natural-resources/nr-form-ea1-preview";
import EnvironmentalNaturalResourcesRenewalPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/natural-resources/nr-renewal-preview";
import UrbanTreeFellingPreview from "@/employee_portal_pages/components/application-preview/permits/environmental/natural-resources/urban-tree-felling-peview";
import EnvironmentalAgriculturalProjectsEA1Preview from "@/employee_portal_pages/components/application-preview/permits/environmental/natural-resources/agricultural-projects-ea1-preview";

// license preview components
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
} from "@/employee_portal_pages/components/application-preview/licenses/pesticide-previews";
import { HazardousChemicalsTransportationPreview } from "@/employee_portal_pages/components/application-preview/licenses/industrial-chemical-previews";

const { Title, Text } = Typography;

export type AdminPreviewType = "permit" | "authorization" | "efficacy-trial" | "license";

interface AdminApplicationPreviewProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  type: AdminPreviewType;
}

const useAdminApplication = (applicationId: string | null, type: AdminPreviewType) => {
  const id = applicationId ?? "";
  const skip = !applicationId;

  const permitResult = useGetAdminSinglePermitApplicationQuery(
    { id },
    { skip: skip || type !== "permit", refetchOnMountOrArgChange: true }
  );
  const authResult = useGetAdminSingleAuthorizationRequestQuery(
    { id },
    { skip: skip || type !== "authorization", refetchOnMountOrArgChange: true }
  );
  const efficacyResult = useGetAdminSingleEfficacyTrialQuery(
    { id },
    { skip: skip || type !== "efficacy-trial", refetchOnMountOrArgChange: true }
  );
  const licenseResult = useGetAdminSingleLicenseApplicationQuery(
    { id },
    { skip: skip || type !== "license", refetchOnMountOrArgChange: true }
  );

  if (type === "permit") return permitResult;
  if (type === "authorization") return authResult;
  if (type === "efficacy-trial") return efficacyResult;
  return licenseResult;
};

const AdminApplicationPreview = ({
  applicationId,
  isOpen,
  onClose,
  type,
}: AdminApplicationPreviewProps) => {
  const { data, isLoading, error } = useAdminApplication(applicationId, type);
  const application = data?.data || {};

  const { requiresInspection, requiresAnalysis, requiresPublicHearing } = application;

  const categoryPreviewMap: Record<string, React.ReactNode> = {
    importation: <PesticideImportationPreview application={application} />,
    sale: <PesticideSalePreview application={application} />,
    distribution: <PesticideDistributionPreview application={application} />,
    commercial_application: <PesticideCommercialPreview application={application} />,
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

  const renderOverview = () => (
    <div className="border border-gray-200 bg-white mb-6 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
          <FileTextOutlined className="text-gray-600 text-sm" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 m-0">Application Overview</h4>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Application Code</span>
            <span className="block text-sm font-mono font-medium">{application?.code || "N/A"}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Application Type</span>
            <span className="block text-sm font-medium">{normalizeText(application?.applicationType || "N/A")}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Processing Type</span>
            <span className="block text-sm font-medium">{normalizeText(application?.processingType || "N/A")}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Status</span>
            <span className="inline-flex items-center py-1 rounded text-xs font-medium">
              {getStatusBadge(application?.status)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Submitted</span>
            <span className="block text-sm text-gray-700">{formatDate2(application?.createdAt)}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Last Updated</span>
            <span className="block text-sm text-gray-700">{formatDate2(application?.updatedAt)}</span>
          </div>
          {requiresInspection && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Requires Inspection</span>
              <span className="block text-sm font-medium">{requiresInspection ? "Yes" : "No"}</span>
            </div>
          )}
          {requiresAnalysis && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Requires Analysis</span>
              <span className="block text-sm font-medium">{requiresAnalysis ? "Yes" : "No"}</span>
            </div>
          )}
          {requiresPublicHearing && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Requires Public Hearing</span>
              <span className="block text-sm font-medium">{requiresPublicHearing ? "Yes" : "No"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClientInfo = () => {
    const client = application?.clientDetails?.[0] || application?.client || {};
    if (!client?._id && !client?.name && !client?.firstName) return null;
    const name = client.organizationName || client.agencyName || `${client.firstName || ""} ${client.lastName || ""}`.trim() || "N/A";
    return (
      <div className="border border-gray-200 bg-white mb-4 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider m-0">Client Information</h4>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-600 uppercase">Name</span>
            <span className="block text-sm font-medium text-gray-800">{name}</span>
          </div>
          {client.clientId && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Client ID</span>
              <span className="block text-sm font-mono text-blue-700">{client.clientId}</span>
            </div>
          )}
          {client.email && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Email</span>
              <span className="block text-sm text-gray-700">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Phone</span>
              <span className="block text-sm text-gray-700">{client.phone}</span>
            </div>
          )}
          {client.userType && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Client Type</span>
              <Tag className="text-[10px] uppercase font-bold">{normalizeText(client.userType)}</Tag>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEntityInfo = () => {
    const entity = application?.assigningEntity;
    if (!entity) return null;
    return (
      <div className="border border-gray-200 bg-white mb-4 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider m-0">Assigned Entity</h4>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="block text-xs font-bold text-gray-600 uppercase">Entity</span>
            <span className="block text-sm font-medium text-gray-800">{entity.name || "N/A"}</span>
          </div>
          {entity.designation && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Designation</span>
              <span className="block text-sm text-gray-700">{entity.designation}</span>
            </div>
          )}
          {entity.current_head_name && (
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-600 uppercase">Head</span>
              <span className="block text-sm text-gray-700">{entity.current_head_name}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransferHistory = () => {
    const history = application?.transferHistory;
    if (!history?.length) return null;
    return (
      <div className="border border-gray-200 bg-white mb-4 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider m-0">
            Transfer History ({history.length})
          </h4>
        </div>
        <div className="p-4 space-y-2">
          {history.map((t: any, i: number) => (
            <div key={i} className="bg-gray-50 rounded border border-gray-200 p-3 text-xs text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-gray-700">{t.fromEntity?.name || "N/A"}</span>
              <span className="text-gray-400">→</span>
              <span className="font-semibold text-gray-700">{t.toEntity?.name || "N/A"}</span>
              {t.transferredAt && (
                <span className="ml-auto text-gray-400">{formatDate2(t.transferredAt)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotes = () => {
    const rejection = application?.rejectionNotes?.reason;
    const corrections = application?.correctionsNotes;
    if (!rejection && !corrections?.length) return null;
    return (
      <div className="space-y-3 mb-4">
        {rejection && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="block text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Rejection Note</span>
            <span className="block text-sm text-red-800">{rejection}</span>
          </div>
        )}
        {corrections?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
            <span className="block text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">Correction Notes</span>
            {corrections.map((noteItem: any, index: number) => (
              <div key={index} className="border-b border-orange-200 last:border-b-0 pb-2 last:pb-0">
                <span className="block text-sm text-orange-800 font-medium mb-1">{noteItem.note || "N/A"}</span>
                <span className="text-xs text-orange-600">— {noteItem.createdBy} on {formatDate4(noteItem.createdAt)}</span>
                {noteItem.attachments?.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Attachments ({noteItem.attachments.length}):</span>
                    {noteItem.attachments.map((att: any, attIdx: number) => (
                      <a key={attIdx} href={att.s3Url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline">
                        <span>📎</span>
                        <span>{att.label || att.originalname || `Attachment ${attIdx + 1}`}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const modalTitle = (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-[#2d6a27] rounded-full flex items-center justify-center">
        <FileTextOutlined className="text-white text-sm" />
      </div>
      <div>
        <Title level={5} className="text-gray-800 mb-0">
          {application?.title || "Application Details"}
        </Title>
        {application?.code && (
          <Text className="text-xs text-gray-500 font-mono">{application.code}</Text>
        )}
      </div>
    </div>
  );

  return (
    <Drawer
      title={modalTitle}
      open={isOpen}
      onClose={onClose}
      placement="right"
      width={window.innerWidth < 640 ? "100%" : "95%"}
      destroyOnClose
    >
      <div className="max-h-full overflow-y-auto pr-1">
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" />
            <Text className="ml-3 text-gray-500">Loading application details...</Text>
          </div>
        )}

        {!isLoading && error && (
          <Alert
            message="Failed to load application"
            description="Could not retrieve application details. Please try again."
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {!isLoading && !error && !application?.code && (
          <Alert
            message="No Application Found"
            description="The requested application could not be found."
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        {!isLoading && application?.code && (
          <div className="space-y-2">
            {renderNotes()}
            {renderOverview()}
            {renderClientInfo()}
            {renderEntityInfo()}
            {renderTransferHistory()}

            {/* ── Permit-specific detail sections ── */}
            {["import", "export"].includes(application?.permitType) &&
              ["pesticide", "industrial_chemical"].includes(application?.permitCategory) && (
                <PesticideChemicalPreview application={application} />
              )}
            {application?.permitType === "domestic_purchase" &&
              application?.permitCategory === "industrial_chemical" && (
                <DomesticPurchasePreview application={application} />
              )}
            {["import", "export"].includes(application?.permitType) &&
              application?.permitCategory === "hazardous_waste" && (
                <HazardousWastePreview application={application} />
              )}
            {application?.permitType === "hazardous_waste_disposal" &&
              application?.permitCategory === "hazardous_waste" && (
                <WasteDisposalPreview application={application} />
              )}
            {application?.authorizationType === "pesticide_import_authorization" && (
              <PesticideImportAuthorizationPreview application={application} />
            )}
            {type === "efficacy-trial" && <EfficacyTrialPreview application={application} />}

            {/* Environmental permits */}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "health_sector" && (
                <HealthcareEnvironmentalPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "general_construction" && (
                <GeneralConstructionEnvironmentalPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "hospitality_tourism" && (
                <HospitalityTourismEnvironmentalPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              ["non_renewable", "renewable"].includes(
                application?.answers?.permitDetails?.energyCategory
              ) && (
                <EnvironmentalRenewableAndNonRenewableEnergyPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.petroleumSector === "upstream" && (
                <EnvironmentalUpstreamPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.petroleumSector === "midstream" && (
                <EnvironmentalMidstreamPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.petroleumSector === "stp" && (
                <EnergyStpEnvironmentalPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.petroleumSector === "other" && (
                <EnvironmentalOtherPetroleumPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.energyType === "electricity" && (
                <EnvironmentalEnergyPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "energy_sector" &&
              application?.answers?.environmentalPermitData?.energy?.energyType === "lpg" && (
                <EnvironmentalLPGPreview application={application} />
              )}
            {application?.permitType === "environmental_permit" &&
              application?.permitCategory === "waste_management" && (
                <WasteManagementEnvironmentalPreview application={application} />
              )}

            {/* Environmental — Manufacturing */}
            {application?.answers?.permitDetails?.applicationType === "new_application" &&
              application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "manufacturing_sector" &&
              !application?.answers?.environmentalPermitData?.manufacturing?.isExistingUndertaking && (
                <EnvironmentalManufacturingEA1Preview application={application} />
              )}
            {application?.answers?.permitDetails?.applicationType === "new_application" &&
              application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "manufacturing_sector" &&
              application?.answers?.environmentalPermitData?.manufacturing?.isExistingUndertaking && (
                <EnvironmentalManufacturingEM1Preview application={application} />
              )}
            {application?.answers?.permitDetails?.applicationType === "renewal" &&
              application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.answers?.permitDetails?.permitCategory === "manufacturing_sector" && (
                <EnvironmentalManufacturingEMRPreview application={application} />
              )}

            {/* Environmental — Mining */}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType === "small_scale_mining" && (
                <EnvironmentalSmallScaleMiningPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType === "medium_scale_mining" && (
                <EnvironmentalMediumScaleMiningPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType === "large_scale_mining" && (
                <EnvironmentalLargeScaleMiningPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType === "gold_trading" && (
                <EnvironmentalGoldTradingMiningPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "mining_sector" &&
              application?.answers?.permitDetails?.miningOperationType === "mineral_exploration" && (
                <EnvironmentalMineralExplorationPreview application={application} />
              )}

            {/* Environmental — Natural Resources */}
            {application?.answers?.permitDetails?.applicationType === "new_application" &&
              application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesEA1Preview application={application} />
              )}
            {application?.answers?.permitDetails?.applicationType === "renewal" &&
              application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              ["natural_resources"].includes(application?.permitCategory) && (
                <EnvironmentalNaturalResourcesRenewalPreview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              ["agricultural_projects"].includes(application?.permitCategory) && (
                <EnvironmentalAgriculturalProjectsEA1Preview application={application} />
              )}
            {application?.answers?.permitDetails?.permitType === "environmental_permit" &&
              application?.permitCategory === "urban_tree_felling" &&
              application?.answers?.environmentalPermitData?.urbanTreeFelling && (
                <UrbanTreeFellingPreview application={application} />
              )}

            {/* ── License-specific sections ── */}
            {(application?.licenseType === "pesticide" ||
              application?.licenseType === "industrial_chemical" ||
              application?.licenseType === "hazardous_waste") &&
              application?.licenseCategory &&
              categoryPreviewMap[application?.licenseCategory] && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {categoryPreviewMap[application?.licenseCategory]}
                </div>
              )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AdminApplicationPreview;
