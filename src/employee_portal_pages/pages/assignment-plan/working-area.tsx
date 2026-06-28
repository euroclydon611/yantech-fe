import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Button,
  Spin,
  Alert,
  Card,
  Form,
  Row,
  Col,
  Space,
  FloatButton,
  Drawer,
  Input,
  Avatar,
  Tooltip,
  Tag,
} from "antd";
import { TiArrowBack } from "react-icons/ti";
import {
  useFetchSingleApplicationQuery,
  useUpdateApplicationSectionMutation,
} from "@/redux/features/employee-portal-api/application/application";
import {
  useFetchAssignmentByApplicationQuery,
  useFetchAssignmentPlanForStaffByIdQuery,
  useOfficerCompleteStageMutation,
  useAddStepCommentMutation,
  useUpdateStepCommentMutation,
  useReturnAssignmentMutation,
} from "@/redux/features/employee-portal-api/application/assignment";
import Swal from "sweetalert2";
import {
  CalculatorOutlined,
  CheckCircleOutlined,
  FileOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MessageOutlined,
  SendOutlined,
  ReloadOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import CompleteTaskModal from "./helpers/CompleteTaskModal";
import DocumentManagementSection from "../../components/review/document-management-section";
import { handleCompleteTask } from "./helpers/taskCompletionHelpers";
import InvoicePreparationPanel, {
  LineItem,
} from "@/employee_portal_pages/components/assignment-plan/review/billing-page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import IssuancePreparationPanel from "@/employee_portal_pages/components/assignment-plan/review/issuance-page";
import { normalizeText } from "@/utils/helperFunction";
import { getDaysUntilDeadline } from "@/utils/helpers";
import DomesticPurchaseReview from "@/employee_portal_pages/components/assignment-plan/review/permits/domestic-purchase-review";
import WasteDisposalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/waste-disposal-review";
import PesticideImportAuthorizationReview from "@/employee_portal_pages/components/assignment-plan/review/permits/pesticide-import-authorization-review";
import HazardousWasteReview from "@/employee_portal_pages/components/assignment-plan/review/permits/hazardous-review";
import PesticideChemicalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/pesticide-review";
import { EfficacyTrialReview } from "@/employee_portal_pages/components/assignment-plan/review/permits/efficacy-trial-review";

//environmental permit applications Review component imports
import HealthcareEnvironmentalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/healthcare-environmental-review";
import GeneralConstructionEnvironmentalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/general-construction-environmental-review";
import HospitalityTourismEnvironmentalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/hospitality-tourism-environmental-review";
import EnvironmentalUpstreamReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/environmental-upstream-review";
import EnvironmentalMidstreamReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/environmental-midstream-review";
import EnergyStpEnvironmentalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/energy-stp-environmental-preview";
import EnvironmentalOtherPetroleumReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/environmental-other-petroleum-activity-review";
import EnvironmentalEnergyReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/environmental-energy-review";
import EnvironmentalLPGReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/environmental-lpg-review";
import EnvironmentalRenewableAndNonRenewableEnergyReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/energy/energy-renewable-and-nonrenewable-review";
import WasteManagementEnvironmentalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/waste-management-environmental-review";
import EnvironmentalManufacturingReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/manufacturing/form-ea1-review";
import EnvironmentalManufacturingEM1Review from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/manufacturing/form-em1-review";
import EnvironmentalManufacturingRenewalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/manufacturing/manufacturing-renewal-review";

//environmental mininng permits preview components
import EnvironmentalSmallScaleMiningReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/mining/small-scale-mining-review";
import EnvironmentalMediumScaleMiningReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/mining/medium-scale-review";
import EnvironmentalLargeScaleMiningReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/mining/large-scale-mining-review";
import EnvironmentalGoldTradingMiningReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/mining/gold-trading-review";
import EnvironmentalMineralExplorationReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/mining/mineral-exploration-review";

import EnvironmentalNaturalResourcesEA1Review from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/natural-resources/nr-form-ea1-review";
import EnvironmentalNaturalResourcesRenewalReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/natural-resources/nr-renewal-review";
import UrbanTreeFellingReview from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/natural-resources/urban-tree-felling-review";
import EnvironmentalAgriculturalProjectsEA1Review from "@/employee_portal_pages/components/assignment-plan/review/permits/environmental/natural-resources/agricultural-projects-ea1-review";

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
} from "@/employee_portal_pages/components/assignment-plan/review/licenses/pesticide-reviews";
import { HazardousChemicalsTransportationReview } from "@/employee_portal_pages/components/assignment-plan/review/licenses/industrial-chemical-previews";

import UploadedReport from "@/employee_portal_pages/components/application/uploaded-reports";

const CommentItem = ({
  comment: c,
  assignmentId,
  refetchTask,
  employeeId,
}: {
  comment: any;
  assignmentId: string;
  refetchTask: () => void;
  employeeId: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(c.comment || "");
  const textRef = useRef<HTMLParagraphElement>(null);
  const commentText = c.comment || "";

  const isOwner = employeeId === c.user;

  const [updateComment, { isLoading: isUpdating }] =
    useUpdateStepCommentMutation();

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [commentText, isEditing]);

  const handleUpdate = async () => {
    if (!editedComment.trim() || editedComment === commentText) {
      setIsEditing(false);
      return;
    }
    try {
      await updateComment({
        assignmentId,
        commentId: c._id,
        comment: editedComment,
      }).unwrap();
      setIsEditing(false);
      refetchTask();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.data.error || "Failed to update comment. Please try again.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            style={{ backgroundColor: "#727cf5" }}
            icon={<UserOutlined />}
          />
          <span className="text-sm font-bold text-slate-800">
            {c.userName || "Officer"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && isOwner && (
            <Tooltip title="Edit Comment">
              <Button
                type="text"
                size="small"
                icon={
                  <EditOutlined className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors" />
                }
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center p-0 h-auto"
              />
            </Tooltip>
          )}
          <span className="text-[10px] font-medium text-slate-400">
            {c.timestamp
              ? `${formatDistanceToNow(new Date(c.timestamp))} ago`
              : "Recently"}
          </span>
        </div>
      </div>
      <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-slate-200 transition-colors">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input.TextArea
              rows={3}
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="text-sm rounded-lg border-slate-200"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setEditedComment(commentText);
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={handleUpdate}
                loading={isUpdating}
                className="bg-green-700 hover:!bg-green-800 border-none"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p
              ref={textRef}
              className={`text-sm text-slate-700 m-0 leading-relaxed ${
                !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              {commentText}
            </p>
            {(isTruncated || isExpanded) && (
              <Button
                type="link"
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-blue-600 hover:text-blue-800 font-bold mt-1 text-xs"
              >
                {isExpanded ? "Show less" : "See more"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const WorkingArea = () => {
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isIssuanceModalOpen, setIsIssuanceModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [form] = Form.useForm();

  //fetch associated assignment plan
  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId, refetchOnMountOrArgChange: true }
  );

  const [addComment, { isLoading: isCommenting }] = useAddStepCommentMutation();

  const applicationType =
    assignmentData?.data?.applicationType == "AuthorizationApplication"
      ? "authorization"
      : assignmentData?.data?.applicationType == "LicenseApplication"
      ? "license"
      : assignmentData?.data?.applicationType == "EfficacyTrial"
      ? "efficacy-trial"
      : "permit";

  //fetch associated application
  const {
    data,
    isLoading: isAppLoading,
    refetch,
    error: appError,
  } = useFetchSingleApplicationQuery(
    { id: applicationId, type: applicationType },
    {
      skip: !applicationId || !applicationType,
      refetchOnMountOrArgChange: true,
    }
  );

  // current assignment task
  const {
    data: currentTask,
    refetch: refetchTask,
    isFetching: isRefetching,
  } = useFetchAssignmentPlanForStaffByIdQuery(
    { id: assignmentData?.data?._id ?? "" },
    { skip: !assignmentData?.data?._id, refetchOnMountOrArgChange: true }
  );

  // 2. This effect initializes the form ONLY when the drawer opens.
  useEffect(() => {
    if (isInvoiceModalOpen) {
      const invoiceData =
        currentTask?.data?.task.stageName === "processing_fee"
          ? currentTask?.data?.proposedProcessingFeeInvoice
          : currentTask?.data?.proposedInvoice;

      if (invoiceData) {
        const existingItems = invoiceData.lineItems.map(
          (item: any, index: number): LineItem => ({
            id: Date.now() + index,
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            service_code: item.service_code,
          })
        );
        setLineItems(existingItems);
      }
    }
  }, [isInvoiceModalOpen, currentTask]);

  //officer complete stage mutation
  const [officerCompleteStage, { isLoading: isCompleting }] =
    useOfficerCompleteStageMutation();
  const [returnAssignment] = useReturnAssignmentMutation();

  const [updateApplicationSection] = useUpdateApplicationSectionMutation();

  // --- Local State ---
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const application = data?.data || {};

  const taskComments = currentTask?.data?.task?.comments || [];

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment({
        assignmentId: assignmentData?.data?._id,
        comment: newComment,
      }).unwrap();
      setNewComment("");
      refetchTask();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.data.error || "Failed to add comment. Please try again.",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  };

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
      // Here you can show an error toast to the user
    }
  };

  const handleTaskSubmit = () => {
    handleCompleteTask({
      form,
      currentTask: currentTask?.data,
      invoicePayload: undefined,
      officerCompleteStage,
      closeCompleteModal: () => {
        setIsCompleteModalOpen(false);
        form.resetFields();
      },
      closeInvoiceModal: () => setIsInvoiceModalOpen(false),
      refetch,
      navigate,
    });
  };

  const handleTaskSubmitInvoice = async (invoicePayload: any) => {
    await handleCompleteTask({
      form,
      currentTask: currentTask?.data,
      invoicePayload,
      officerCompleteStage,
      closeCompleteModal: () => {
        setIsCompleteModalOpen(false);
        form.resetFields();
      },
      closeInvoiceModal: () => setIsInvoiceModalOpen(false),
      refetch,
      navigate,
    });
  };

  // pesticide license mapping
  const categoryReviewMap: Record<string, React.ReactNode> = {
    importation: (
      <PesticideImportationReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    sale: (
      <PesticideSaleReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    distribution: (
      <PesticideDistributionReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    commercial_application: (
      <PesticideCommercialReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    storage: (
      <PesticideStorageReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),

    transportation:
      application.licenseType === "industrial_chemical" ? (
        <HazardousChemicalsTransportationReview
          application={application}
          onApplicationUpdate={handleSectionUpdate}
        />
      ) : (
        <PesticideTransportationReview
          application={application}
          onApplicationUpdate={handleSectionUpdate}
        />
      ),
    formulation: (
      <PesticideFormulationReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    repackaging: (
      <PesticideRepackagingReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    manufacture: (
      <PesticideManufactureReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    exportation: (
      <PesticideExportReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
    advertisement: (
      <PesticideAdvertisementReview
        application={application}
        onApplicationUpdate={handleSectionUpdate}
      />
    ),
  };

  // --- Render Logic ---
  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin tip="Loading Application..." size="large" />
      </div>
    );
  }

  if (appError) {
    return (
      <div className="p-8">
        <Alert
          message="Error"
          description="Could not load application data."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="mt-2 mx-auto w-full">
      <ApplicationInfoHeader
        application={application}
        currentTask={currentTask?.data?.task}
      />

      {application?.reportRequirements &&
        application.reportRequirements.length > 0 && (
          <UploadedReport
            assignmentId={assignmentData?.data?._id || ""}
            reportRequirements={application.reportRequirements}
            reportDocuments={application.reportDocuments}
            refetch={refetch}
          />
        )}

      {/* <PermitPreparationPage/> */}

      <div className="">
        {["import", "export"].includes(application?.permitType) &&
          application.permitCategory === "hazardous_waste" && (
            <HazardousWasteReview
              application={application}
              status={assignmentData?.data?.internalStatus}
              onApplicationUpdate={handleSectionUpdate}
            />
          )}

        {application?.permitType === "domestic_purchase" &&
          application?.permitCategory === "industrial_chemical" && (
            <DomesticPurchaseReview
              application={application}
              // status={assignmentData?.data?.internalStatus}
              onApplicationUpdate={handleSectionUpdate}
            />
          )}

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

        {application?.permitType === "hazardous_waste_disposal" &&
          application?.permitCategory === "hazardous_waste" && (
            <WasteDisposalReview application={application} />
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

        {/* environmental permit section */}
        {application?.permitType === "environmental_permit" &&
          application?.permitCategory === "health_sector" && (
            <HealthcareEnvironmentalReview application={application} />
          )}

        {application?.permitType === "environmental_permit" &&
          application?.permitCategory === "general_construction" && (
            <GeneralConstructionEnvironmentalReview application={application} />
          )}

        {application?.permitType === "environmental_permit" &&
          application?.permitCategory === "hospitality_tourism" && (
            <HospitalityTourismEnvironmentalReview application={application} />
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
            <EnvironmentalSmallScaleMiningReview application={application} />
          )}
        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "mining_sector" &&
          application?.answers?.permitDetails?.miningOperationType ===
            "medium_scale_mining" && (
            <EnvironmentalMediumScaleMiningReview application={application} />
          )}
        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "mining_sector" &&
          application?.answers?.permitDetails?.miningOperationType ===
            "large_scale_mining" && (
            <EnvironmentalLargeScaleMiningReview application={application} />
          )}
        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "mining_sector" &&
          application?.answers?.permitDetails?.miningOperationType ===
            "gold_trading" && (
            <EnvironmentalGoldTradingMiningReview application={application} />
          )}
        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "mining_sector" &&
          application?.answers?.permitDetails?.miningOperationType ===
            "mineral_exploration" && (
            <EnvironmentalMineralExplorationReview application={application} />
          )}

        {application?.answers?.permitDetails?.applicationType ===
          "new_application" &&
          application?.answers?.permitDetails?.permitType ===
            "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "manufacturing_sector" &&
          !application?.answers?.environmentalPermitData?.manufacturing
            ?.isExistingUndertaking && (
            <EnvironmentalManufacturingReview application={application} />
          )}

        {application?.answers?.permitDetails?.applicationType ===
          "new_application" &&
          application?.answers?.permitDetails?.permitType ===
            "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "manufacturing_sector" &&
          application?.answers?.environmentalPermitData?.manufacturing
            ?.isExistingUndertaking && (
            <EnvironmentalManufacturingEM1Review application={application} />
          )}

        {application?.answers?.permitDetails?.applicationType === "renewal" &&
          application?.answers?.permitDetails?.permitType ===
            "environmental_permit" &&
          application?.answers?.permitDetails?.permitCategory ===
            "manufacturing_sector" && (
            <EnvironmentalManufacturingRenewalReview
              application={application}
            />
          )}

        {application?.answers?.permitDetails?.applicationType ===
          "new_application" &&
          application?.answers?.permitDetails?.permitType ===
            "environmental_permit" &&
          ["natural_resources"].includes(application?.permitCategory) && (
            <EnvironmentalNaturalResourcesEA1Review application={application} />
          )}

        {application?.answers?.permitDetails?.applicationType === "renewal" &&
          application?.answers?.permitDetails?.permitType ===
            "environmental_permit" &&
          ["natural_resources"].includes(application?.permitCategory) && (
            <EnvironmentalNaturalResourcesRenewalReview
              application={application}
            />
          )}

        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          ["agricultural_projects"].includes(application?.permitCategory) && (
            <EnvironmentalAgriculturalProjectsEA1Review
              application={application}
            />
          )}

        {application?.answers?.permitDetails?.permitType ===
          "environmental_permit" &&
          application?.permitCategory === "urban_tree_felling" &&
          application?.answers?.environmentalPermitData?.urbanTreeFelling && (
            <UrbanTreeFellingReview application={application} />
          )}

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

      <DocumentManagementSection
        applicationId={applicationId!}
        applicationType={applicationType}
        uploadedDocuments={application?.uploadedDocuments}
        refetch={refetch}
      />

      <Card className="mx-3">
        <Row justify="center">
          <Col>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={() => window.history.back()}
                style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                icon={<TiArrowBack />}
                className="bg-red-700 hover:!bg-red-800"
              >
                Back to List{" "}
              </Button>

              {employee?._id === currentTask?.data?.task?.assignedTo && (
                <>
                  <Button
                    size="large"
                    icon={<RollbackOutlined />}
                    onClick={() => setIsReturnModalOpen(true)}
                    className="w-full sm:w-auto"
                    danger
                    style={{
                      fontSize: "clamp(12px, 2vw, 14px)",
                      minWidth: "140px",
                    }}
                  >
                    Return to HOD
                  </Button>
                  {currentTask?.data?.task?.stageName === "permit_fee" ||
                  currentTask?.data?.task?.stageName === "processing_fee" ? (
                    <Button
                      type="primary"
                      size="large"
                      icon={<CalculatorOutlined />}
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="bg-green-600 hover:!bg-green-700 w-full sm:w-auto"
                      style={{
                        fontSize: "clamp(12px, 2vw, 14px)",
                        minWidth: "140px",
                      }}
                    >
                      Prepare Invoice
                    </Button>
                  ) : currentTask?.data?.task?.stageName === "issuance" ? (
                    <Button
                      type="primary"
                      size="large"
                      icon={<FileTextOutlined />}
                      onClick={() => setIsIssuanceModalOpen(true)}
                      className="bg-green-600 hover:!bg-green-700 w-full sm:w-auto"
                      style={{
                        fontSize: "clamp(12px, 2vw, 14px)",
                        minWidth: "140px",
                      }}
                    >
                      Prepare Final Permit
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      icon={<CheckCircleOutlined />}
                      onClick={() => setIsCompleteModalOpen(true)}
                      className="bg-green-600 hover:!bg-green-700 w-full sm:w-auto"
                      style={{
                        fontSize: "clamp(12px, 2vw, 14px)",
                        minWidth: "140px",
                      }}
                    >
                      Complete Task
                    </Button>
                  )}
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Return to HOD Modal */}
      {isReturnModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: 12, maxWidth: 480, width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
            }}
          >
            <div style={{ background: "#dc2626", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <RollbackOutlined style={{ color: "#fff", fontSize: 20 }} />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Return Assignment to HOD</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
                You are about to return this assignment stage back to your HOD for reassignment.
                This action will notify the HOD immediately. Please provide a clear reason.
              </p>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Reason <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <Input.TextArea
                rows={4}
                placeholder="e.g. This application falls outside my area of expertise. Please reassign to the relevant officer."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                maxLength={500}
                showCount
              />
              <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => { setIsReturnModalOpen(false); setReturnReason(""); }}
                  disabled={isReturning}
                >
                  Cancel
                </Button>
                <Button
                  danger
                  type="primary"
                  icon={<RollbackOutlined />}
                  loading={isReturning}
                  disabled={!returnReason.trim()}
                  onClick={async () => {
                    try {
                      setIsReturning(true);
                      await returnAssignment({
                        assignmentId: currentTask?.data?._id,
                        reason: returnReason.trim(),
                      }).unwrap();
                      setIsReturnModalOpen(false);
                      setReturnReason("");
                      await Swal.fire({
                        icon: "success",
                        title: "Assignment Returned",
                        text: "Your HOD has been notified and will reassign this task.",
                        confirmButtonColor: "#1A4731",
                        timer: 3000,
                        timerProgressBar: true,
                      });
                      navigate(-1);
                    } catch (err: any) {
                      Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text: err?.data?.message || "Could not return the assignment. Please try again.",
                        confirmButtonColor: "#dc2626",
                      });
                    } finally {
                      setIsReturning(false);
                    }
                  }}
                >
                  Confirm Return
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCompleteModalOpen && (
        <CompleteTaskModal
          isOpen={isCompleteModalOpen}
          onCancel={() => setIsCompleteModalOpen(false)}
          onSubmit={handleTaskSubmit}
          currentTask={currentTask?.data}
          isCompleting={isCompleting}
          form={form}
        />
      )}

      {/*  Invoice Drawer component */}
      <InvoicePreparationPanel
        open={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        task={currentTask?.data}
        onSubmit={handleTaskSubmitInvoice}
        predefinedFees={[]}
        applicationData={application}
        lineItems={lineItems}
        onLineItemsChange={setLineItems}
      />

      {/* Issuance Drawer component */}
      <IssuancePreparationPanel
        open={isIssuanceModalOpen}
        onClose={() => setIsIssuanceModalOpen(false)}
        task={currentTask?.data}
        onSubmit={async (issuanceData) => {
          try {
            await handleCompleteTask({
              form,
              currentTask: currentTask?.data,
              invoicePayload: undefined,
              issuancePayload: issuanceData,
              officerCompleteStage,
              closeCompleteModal: () => {
                setIsCompleteModalOpen(false);
                form.resetFields();
              },
              closeInvoiceModal: () => setIsInvoiceModalOpen(false),
              refetch,
              navigate,
            });
          } catch (error) {
            console.error("Issuance submission failed:", error);
          }
        }}
        applicationData={application}
      />

      {/* Floating Comment Button */}
      <Tooltip title="Task Comments" placement="left">
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          style={{ right: 24, bottom: 80, width: 56, height: 56 }}
          onClick={() => setIsCommentDrawerOpen(true)}
          badge={{ count: taskComments.length, color: "#10b981" }}
        />
      </Tooltip>

      {/* Comment Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-green-600" />
            <span className="text-lg font-bold">Task Discussions</span>
          </div>
        }
        placement="right"
        onClose={() => setIsCommentDrawerOpen(false)}
        open={isCommentDrawerOpen}
        width={400}
        extra={
          <div className="flex items-center gap-2">
            <Tooltip title="Refresh Discussions">
              <Button
                type="text"
                size="small"
                icon={
                  <ReloadOutlined
                    spin={isRefetching}
                    className={
                      isRefetching ? "text-green-600" : "text-slate-600"
                    }
                  />
                }
                onClick={() => refetchTask()}
                disabled={isRefetching}
                className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg h-8 w-8 transition-all"
              />
            </Tooltip>
            <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm">
              {taskComments?.length} Comments
            </span>
          </div>
        }
        footer={
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col gap-3">
              <Input.TextArea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a professional comment..."
                className="rounded-lg border-slate-200 focus:shadow-sm"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={isCommenting}
                onClick={handleAddComment}
                className="bg-green-700 hover:!bg-green-800 w-full font-semibold h-10"
              >
                Send Comment
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-6 h-full">
          {taskComments.length > 0 ? (
            <div className="space-y-6">
              {taskComments.map((c: any, index: number) => (
                <CommentItem
                  key={index}
                  comment={c}
                  assignmentId={assignmentData?.data?._id || ""}
                  refetchTask={refetchTask}
                  employeeId={employee?._id || ""}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MessageOutlined className="text-2xl text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                No discussions yet
              </h3>
              <p className="text-sm text-slate-500">
                Be the first to start the conversation about this task.
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

// A simple display component for key-value pairs
const InfoDetail: React.FC<{
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <div className="text-sm text-slate-800 font-medium">
      {value || <span className="text-slate-400 italic text-xs">N/A</span>}
    </div>
  </div>
);

const ApplicationInfoHeader: React.FC<{
  application: any;
  currentTask: any;
}> = ({ application, currentTask }) => {
  if (!application) return null;

  const formatDate = (date: string, showTime: boolean = true) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(showTime && { hour: "2-digit", minute: "2-digit" }),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Top Header Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            size="middle"
            onClick={() => window.history.back()}
            icon={<TiArrowBack className="text-lg" />}
            className="bg-red-700 hover:!bg-red-800 border-none flex items-center shadow-sm"
          >
            Back to List
          </Button>
          <div className="h-8 w-[1px] bg-slate-200" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 m-0 leading-tight">
              Task Workspace
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5 font-medium">
              Application Management & Review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase m-0 leading-none mb-1">
              Task Status
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-700 capitalize">
                {currentTask?.status?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Primary Details */}
          <div className="space-y-6">
            <InfoDetail
              label="Application ID"
              icon={<FileOutlined className="text-blue-500" />}
              value={
                <span className="font-mono font-bold text-blue-600">
                  {application.code}
                </span>
              }
            />
            <InfoDetail
              label="Assigned Officer"
              icon={<UserOutlined className="text-indigo-500" />}
              value={currentTask?.assignedToName}
            />
          </div>

          {/* Progress Details */}
          <div className="space-y-6">
            <InfoDetail
              label="Current Stage"
              icon={<ClockCircleOutlined className="text-purple-500" />}
              value={
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold border border-purple-100 uppercase">
                  {normalizeText(currentTask?.stageName)}
                </span>
              }
            />
            <InfoDetail
              label="Started At"
              icon={<CalendarOutlined className="text-slate-500" />}
              value={formatDate(currentTask?.startedAt)}
            />
          </div>

          {/* Timeline Details */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <InfoDetail
                  label="Deadline"
                  icon={<CalendarOutlined className="text-red-500" />}
                  value={
                    <span className="text-red-600 font-bold">
                      {formatDate(currentTask?.deadline, false) || "N/A"}
                    </span>
                  }
                />
                {currentTask?.deadlineTime && (
                  <InfoDetail
                    label="Time"
                    icon={<ClockCircleOutlined className="text-red-400" />}
                    value={
                      <span className="text-red-600 font-bold">
                        {currentTask.deadlineTime}
                      </span>
                    }
                  />
                )}
              </div>
              {currentTask?.deadline && (
                <div>
                  {(() => {
                    const info = getDaysUntilDeadline(
                      currentTask.deadline,
                      currentTask.deadlineTime
                    );
                    return (
                      <Tag
                        color={info.color}
                        icon={<ClockCircleOutlined />}
                        className="font-bold uppercase text-[10px] m-0"
                      >
                        {info.text}
                      </Tag>
                    );
                  })()}
                </div>
              )}
            </div>
            <InfoDetail
              label="Copied (CC)"
              icon={<TeamOutlined className="text-emerald-500" />}
              value={
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentTask?.copiedEmployeesNames?.length > 0 ? (
                    currentTask.copiedEmployeesNames.map((name: string) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-xs">None</span>
                  )}
                </div>
              }
            />
          </div>

          {/* Requirements */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0">
              Requirements
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <CheckCircleOutlined
                  className={
                    application.requiresInspection
                      ? "text-green-500"
                      : "text-slate-300"
                  }
                />
                Physical Inspection
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  application.requiresInspection
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {application.requiresInspection ? "YES" : "NO"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <CheckCircleOutlined
                  className={
                    application.requiresAnalysis
                      ? "text-green-500"
                      : "text-slate-300"
                  }
                />
                Lab Analysis
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  application.requiresAnalysis
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {application.requiresAnalysis ? "YES" : "NO"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <CheckCircleOutlined
                  className={
                    application.requiresPublicHearing
                      ? "text-green-500"
                      : "text-slate-300"
                  }
                />
                Public Hearing
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  application.requiresPublicHearing
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {application.requiresPublicHearing ? "YES" : "NO"}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {currentTask?.notes && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <InfoCircleOutlined className="text-blue-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest m-0 mb-1">
                  Assigner's Instructions
                </p>
                <p className="text-sm text-slate-700 m-0 leading-relaxed font-medium">
                  {currentTask.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default WorkingArea;
