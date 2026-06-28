import React, { useEffect, useState, useMemo } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import {
  Alert,
  Button,
  Card,
  List,
  Typography,
  Table,
  Form,
  Checkbox,
  message,
  Divider,
  Select,
  Slider,
  Collapse,
  Tag,
} from "antd";
import {
  EyeOutlined,
  FileOutlined,
  WarningOutlined,
  CalculatorOutlined,
  InfoCircleOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useUpdateChemicalRiskFlakMutation } from "@/redux/features/employee-portal-api/application/application";
import { useFetchBaseFeesQuery } from "@/redux/features/employee-portal-api/application/fees-config";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { formatLabel } from "@/utils/helpers";
import {
  formatDate4,
  formatDate,
  normalizeText,
  handleDocumentView,
  formatDate2,
} from "@/utils/helperFunction";
import SwalToast from "@/lib/swal-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ApplicantInformationBlock from "@/components/general/applicant-information";
const { Text } = Typography;
const { Option } = Select;

interface PesticideChemicalReviewProps {
  application: any;
  assignment?: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const InfoDetail: React.FC<{
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, icon, color = "blue" }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <div className={`text-sm font-bold text-slate-800`}>
      {value || <span className="text-slate-400 italic font-normal">N/A</span>}
    </div>
  </div>
);

export const PesticideChemicalReview: React.FC<
  PesticideChemicalReviewProps
> = ({ application, onApplicationUpdate, assignment }) => {
  const [updateRiskFlag, { isLoading }] = useUpdateChemicalRiskFlakMutation();
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  const { data: permitFeesConfigResponse } = useFetchBaseFeesQuery({
    type: "permit",
  });
  const permitFeesConfig = permitFeesConfigResponse?.data;

  // State for managing hazard score inputs
  const [hazardScores, setHazardScores] = useState<
    Record<
      string,
      {
        baseScore: number;
        healthMultiplier: number;
        environmentMultiplier: number;
        physicalMultiplier: number;
      }
    >
  >({});

  // State for managing chemical type factor inputs
  const [chemicalTypeFactors, setChemicalTypeFactors] = useState<
    Record<string, number>
  >({});

  // State for managing volume-based multiplier inputs
  const [volumeBasedMultipliers, setVolumeBasedMultipliers] = useState<
    Record<string, number>
  >({});

  const [form] = Form.useForm();

  const { pesticideChemicalDetails } = application;

  const defaultReviewStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      permitDetails: { status: "pending", comment: null },
      products: { status: "pending", comment: null },
      warehouse: { status: "pending", comment: null },
      factory: { status: "pending", comment: null },
      transporters: { status: "pending", comment: null },
      distributors: { status: "pending", comment: null },
      repackagers: { status: "pending", comment: null },
      handlers: { status: "pending", comment: null },
      proponentLicense: { status: "pending", comment: null },
      proponentPermit: { status: "pending", comment: null },
      traceabilityLocation: { status: "pending", comment: null },
      attachments: { status: "pending", comment: null },
    }),
    []
  );

  const defaultEvaluationStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      permitDetails: { status: "pending", comment: null },
      products: { status: "pending", comment: null },
      warehouse: { status: "pending", comment: null },
      factory: { status: "pending", comment: null },
      transporters: { status: "pending", comment: null },
      distributors: { status: "pending", comment: null },
      repackagers: { status: "pending", comment: null },
      handlers: { status: "pending", comment: null },
      proponentLicense: { status: "pending", comment: null },
      proponentPermit: { status: "pending", comment: null },
      traceabilityLocation: { status: "pending", comment: null },
      attachments: { status: "pending", comment: null },
    }),
    []
  );

  const review = useMemo(
    () => ({
      ...defaultReviewStructure,
      ...application?.review,
    }),
    [application?.review, defaultReviewStructure]
  );

  const evaluation = useMemo(
    () => ({
      ...defaultEvaluationStructure,
      ...application?.evaluation,
    }),
    [application?.evaluation, defaultEvaluationStructure]
  );

  const {
    permitDetails,
    purpose,
    products,
    authOption,
    authNumber,
    authorizationDocument,
    warehouse,
    factory,
    transporters,
    distributors,
    repackagers,
    handlers,
    researchTrialFacility,
    proponentLicense,
    proponentPermit,
    traceabilityLocation,
  } = pesticideChemicalDetails || {};

  const permitNumber = "PENDING GENERATION";

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    // Include hazard scores, CTF, and VBM when updating products section
    if (
      sectionKey === "products" &&
      (Object.keys(hazardScores).length > 0 ||
        Object.keys(chemicalTypeFactors).length > 0 ||
        Object.keys(volumeBasedMultipliers).length > 0)
    ) {
      // Prepare hazard score, CTF, and VBM data for backend submission
      const hazardScoreData = Object.entries(hazardScores).map(
        ([productId, scores]) => ({
          productId,
          hazardScore: scores,
          chemicalTypeFactor: chemicalTypeFactors[productId] || 1.0,
          volumeBasedMultiplier: volumeBasedMultipliers[productId] || 1.0,
        })
      );

      console.log(
        "Including hazard scores, CTF, and VBM in products section update:",
        hazardScoreData
      );

      // Add hazard score, CTF, and VBM summary to comment
      const hazardScoreSummary = Object.entries(hazardScores)
        .map(([productId, scores]) => {
          const product = products?.find((p) => p._id === productId);
          const calculatedScore = (
            scores.baseScore *
            scores.healthMultiplier *
            scores.environmentMultiplier *
            scores.physicalMultiplier
          ).toFixed(2);
          const ctf = chemicalTypeFactors[productId] || 1.0;
          const vbm = volumeBasedMultipliers[productId] || 1.0;
          return `${
            product?.name || productId
          }: Hazard Score ${calculatedScore} (Base: ${
            scores.baseScore
          }, Health: ${scores.healthMultiplier}, Env: ${
            scores.environmentMultiplier
          }, Physical: ${scores.physicalMultiplier}), CTF: ${ctf}, VBM: ${vbm}`;
        })
        .join("\n");

      const updatedComment =
        comment +
        (comment ? "\n\n" : "") +
        "--- Hazard Scores, Chemical Type Factors & Volume-Based Multipliers ---\n" +
        hazardScoreSummary;

      // TODO: Include hazardScoreData in the API call payload when backend is ready
      await onApplicationUpdate(sectionKey, type, status, updatedComment);
    } else {
      await onApplicationUpdate(sectionKey, type, status, comment);
    }
  };

  const handleRiskChange = async (product: any, newValue: boolean) => {
    const status = newValue ? "High Risk" : "Low Risk";

    const payload = {
      id: application._id,
      productId: product._id,
      isHighRisk: newValue,
    };

    try {
      await updateRiskFlag({ payload }).unwrap();
      message.success(`Product risk status updated successfully.`);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `The risk status for chemical "${product.name}" has been updated to "${status}".`,
        confirmButtonColor: "#2E7D32",
      });
    } catch (err) {
      message.error("Failed to update risk status. Please try again.");
      console.error("Update failed:", err);
    }
  };

  // Initialize hazard scores, CTF, and VBM from product data
  useEffect(() => {
    if (products && products.length > 0) {
      const initialScores: Record<string, any> = {};
      const initialCTF: Record<string, number> = {};
      const initialVBM: Record<string, number> = {};

      products.forEach((product) => {
        if (product.hazardScore) {
          initialScores[product._id] = {
            baseScore: product.hazardScore.baseScore || 0,
            healthMultiplier: product.hazardScore.healthMultiplier || 1,
            environmentMultiplier:
              product.hazardScore.environmentMultiplier || 1,
            physicalMultiplier: product.hazardScore.physicalMultiplier || 1,
          };
        }

        // Initialize CTF
        initialCTF[product._id] = product.chemicalTypeFactor || 1.0;

        // Initialize VBM
        initialVBM[product._id] = product.volumeBasedMultiplier || 1.0;
      });

      setHazardScores(initialScores);
      setChemicalTypeFactors(initialCTF);
      setVolumeBasedMultipliers(initialVBM);
    }
  }, [products]);

  // Handle hazard score input changes
  const handleHazardScoreChange = (
    productId: string,
    field: string,
    value: number | null
  ) => {
    setHazardScores((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value || 0,
      },
    }));
  };

  // Get hazard score for a product (from state or original data)
  const getHazardScore = (productId: string, field: string) => {
    return hazardScores[productId]?.[field] || 0;
  };

  // Handle chemical type factor input changes
  const handleCTFChange = (productId: string, value: number | null) => {
    setChemicalTypeFactors((prev) => ({
      ...prev,
      [productId]: value || 1.0,
    }));
  };

  // Get chemical type factor for a product (from state or original data)
  const getCTF = (productId: string) => {
    return chemicalTypeFactors[productId] || 1.0;
  };

  // Handle volume-based multiplier input changes
  const handleVBMChange = (productId: string, value: number | null) => {
    setVolumeBasedMultipliers((prev) => ({
      ...prev,
      [productId]: value || 1.0,
    }));
  };

  // Get volume-based multiplier for a product (from state or original data)
  const getVBM = (productId: string) => {
    return volumeBasedMultipliers[productId] || 1.0;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalCalculations = useMemo(() => {
    const totalProcessingFee =
      application?.answers?.processingFee?.totalAmount || 0;
    let totalRaf = 0;
    let totalPermitFee = 0;

    products?.forEach((product: any) => {
      const hs =
        getHazardScore(product._id, "baseScore") *
        getHazardScore(product._id, "healthMultiplier") *
        getHazardScore(product._id, "environmentMultiplier") *
        getHazardScore(product._id, "physicalMultiplier");
      const ctf = getCTF(product._id);
      const raf = hs * ctf * 200;
      const vbm = getVBM(product._id);
      const baseFeePerProduct = totalProcessingFee / (products?.length || 1);
      const permitFee = (baseFeePerProduct + raf) * vbm;

      totalRaf += raf;
      totalPermitFee += permitFee;
    });

    const totalRemainingFee = totalPermitFee - totalProcessingFee;

    return { totalRaf, totalPermitFee, totalRemainingFee, totalProcessingFee };
  }, [
    products,
    application?.answers?.processingFee?.totalAmount,
    hazardScores,
    chemicalTypeFactors,
    volumeBasedMultipliers,
  ]);

  // Auto-save hazard scores, CTF, and VBM for a specific product
  const autoSaveProductData = async (
    productId: string,
    updatedScores?: any,
    updatedCTF?: number,
    updatedVBM?: number
  ) => {
    try {
      setUpdatingProductId(productId); // Set loading state for specific product

      // Use the provided updated values or fall back to state
      const productHazardScore = updatedScores || hazardScores[productId];
      const productCTF =
        updatedCTF !== undefined ? updatedCTF : chemicalTypeFactors[productId];
      const productVBM =
        updatedVBM !== undefined
          ? updatedVBM
          : volumeBasedMultipliers[productId];

      if (!productHazardScore && !productCTF && !productVBM) {
        return; // Nothing to save
      }

      const hazardScoreData = [
        {
          productId,
          hazardScore: productHazardScore || {
            baseScore: 0,
            healthMultiplier: 1,
            environmentMultiplier: 1,
            physicalMultiplier: 1,
          },
          chemicalTypeFactor: productCTF || 1.0,
          volumeBasedMultiplier: productVBM || 1.0,
        },
      ];

      // Use the existing mutation with extended payload for hazard scores, CTF, and VBM
      const payload = {
        id: application._id,
        hazardScoreData: hazardScoreData,
        updateType: "hazard_scores_ctf_vbm",
      };

      await updateRiskFlag({ payload }).unwrap();

      SwalToast({
        type: "success",
        message: "Data updated successfully",
      });
    } catch (error) {
      message.error("Failed to update data. Please try again.");
      console.error("Auto-save failed:", error);
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Table columns for manufactured products (formulation and manufacturing purpose only)
  const manufacturedProducts = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Holder",
      dataIndex: "registrationHolderName",
      key: "registrationHolderName",
    },
    {
      title: "FRE/PA No.",
      dataIndex: "frepaNumber",
      key: "frepaNumber",
    },
  ];

  if (!pesticideChemicalDetails) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        {permitDetails?.permitCategory === "pesticide"
          ? "Pesticide"
          : "Industrial Chemical"}{" "}
        {permitDetails?.permitType?.toUpperCase()} Permit Application Review
      </h2>

      <div className={styles.gridContainer}>
        {/* --- BLOCK 1: Applicant Information --- */}
        <Block
          title="1. Applicant Information"
          sectionKey="applicantDetails"
          reviewData={review.applicantDetails}
          evaluationData={evaluation.applicantDetails}
          onUpdate={handleUpdateSection}
        >
          <ApplicantInformationBlock application={application} />
        </Block>

        {/* --- BLOCK 2: Permit Details --- */}
        <Block
          title="2. Permit Information"
          sectionKey="permitDetails"
          reviewData={review.permitDetails}
          evaluationData={evaluation.permitDetails}
          onUpdate={handleUpdateSection}
        >
          <Detail
            label="Submitted Date:"
            value={formatDate4(application.createdAt)}
          />
          <Detail
            label="Updated Date:"
            value={formatDate4(application.updatedAt)}
          />
          <Detail
            label="Permit Type:"
            value={normalizeText(permitDetails?.permitType?.toUpperCase())}
          />
          <Detail
            label="Permit Category:"
            value={permitDetails?.permitCategory
              ?.replace("_", " ")
              .toUpperCase()}
          />
          <Detail
            label="Processing Type:"
            value={application?.processingType?.replace("_", " ").toUpperCase()}
          />
          <Detail
            label="Purpose:"
            value={purpose?.replace(/_/g, " ")?.toUpperCase()}
          />

          {permitDetails.permitType == "import" && (
            <>
              <Detail
                label="Import Authorization Status:"
                value={
                  authOption == "no"
                    ? "No, I am the Product Registration Holder"
                    : "Yes, I have a Valid Import Authorization Permit Number"
                }
              />

              {authOption == "yes" && (
                <>
                  <Detail
                    label="Import Authorization Permit Number:"
                    value={authNumber}
                  />

                  {authorizationDocument && (
                    <Detail
                      label="Import Authorization Permit Document:"
                      value={
                        authorizationDocument?.name ? (
                          <span className="flex items-center gap-2">
                            <FileTextOutlined className="text-blue-500" />
                            <span>{authorizationDocument.name}</span>
                            <span className="text-red-500 text-[10px] font-bold">
                              (refer to Block )
                            </span>
                          </span>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </Block>

        {/* --- BLOCK 3: Products Information --- */}
        <Block
          title="3. Product(s) Information"
          className={styles.fullWidth}
          sectionKey="products"
          reviewData={review.products}
          evaluationData={evaluation.products}
          onUpdate={handleUpdateSection}
        >
          <Collapse
            className="space-y-6"
            items={products?.map((product, index) => {
              const baseFeePerProduct =
                (application?.answers?.processingFee?.totalAmount || 0) /
                (products?.length || 1);
              const hs =
                getHazardScore(product._id, "baseScore") *
                getHazardScore(product._id, "healthMultiplier") *
                getHazardScore(product._id, "environmentMultiplier") *
                getHazardScore(product._id, "physicalMultiplier");
              const ctf = getCTF(product._id);
              const rcu = 200;
              const raf = hs * ctf * rcu;
              const vbm = getVBM(product._id);
              const proposedFee = (baseFeePerProduct + raf) * vbm;
              const remainingFee = proposedFee - baseFeePerProduct;

              return {
                key: product._id || index,
                label: (
                  <div className="flex items-center gap-3 w-full bg-green-50 px-4 py-3 rounded-lg border-l-4 border-l-green-600">
                    <span className="font-semibold text-gray-800">
                      {permitDetails.permitCategory == "industrial_chemical"
                        ? "Chemical"
                        : "Product"}{" "}
                      {index + 1}: {product.name} - Click to expand
                    </span>
                    {product.isHighRisk && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <WarningOutlined className="mr-1" />
                        High Risk
                      </span>
                    )}
                  </div>
                ),
                children: (
                  <div
                    key={index}
                    className={`${styles.productItem} p-4 text-sm bg-slate-50 rounded-lg`}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{ isHighRisk: product.isHighRisk }}
                      className="space-y-4 mb-4"
                    >
                      <Form.Item
                        name="isHighRisk"
                        valuePropName="checked"
                        hidden={
                          permitDetails.permitCategory !==
                            "industrial_chemical" || !product.isHighRisk
                        }
                      >
                        <Checkbox
                          className="p-3 border border-red-300 rounded-lg bg-red-50 hover:border-red-400 w-full"
                          onChange={(e) =>
                            handleRiskChange(product, e.target.checked)
                          }
                          disabled
                        >
                          <span className="text-sm text-red-700 font-bold flex items-center gap-2">
                            <WarningOutlined className="text-red-600 text-base" />
                            Flag this chemical as a high-risk product
                          </span>

                          <div className="mt-3 p-3 border border-red-300 bg-red-50 rounded-md">
                            <span className="text-sm text-red-700 font-bold flex items-center gap-2">
                              <WarningOutlined className="text-red-600 text-base" />
                              ⚠️ High-Risk Chemical Detected
                            </span>
                            <p className="text-sm text-red-600 mt-1">
                              This chemical is classified as a{" "}
                              <strong>High-Risk Chemical</strong>. Please ensure
                              the{" "}
                              <strong>
                                EPA high-risk chemical handling process{" "}
                              </strong>
                              is strictly followed. This includes additional
                              verification, supporting documents (such as End
                              User Certificate), and internal high-risk
                              approvals before proceeding.
                            </p>
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </Form>

                    <div className={styles.productDetails}>
                      <Detail
                        label={
                          ["manufacturing", "formulation"].includes(
                            purpose?.toLowerCase()
                          )
                            ? "Technical Concentrate/Material:"
                            : "Product Name:"
                        }
                        value={product.name}
                      />
                      {permitDetails?.permitCategory !== "pesticide" && (
                        <>
                          <Detail
                            label="Trade Name:"
                            value={product.tradeName}
                          />
                          <Detail
                            label="Common Name:"
                            value={product.commonName}
                          />
                          <Detail
                            label="High Risk:"
                            value={product.isHighRisk ? "Yes" : "No"}
                          />
                        </>
                      )}
                      <Detail label="HS Code:" value={product.hsCode} />
                      {permitDetails?.permitCategory === "pesticide" && (
                        <>
                          <Detail
                            label="Formulation Type:"
                            value={product.formulationType}
                          />
                          <Detail
                            label="Product Type:"
                            value={product.productType}
                          />

                          <Detail
                            label="Product Registration Number:"
                            value={product.frePaNumber}
                          />
                          <Detail
                            label="Product Registration Holder:"
                            value={product.productHolderName}
                          />
                          <Detail
                            label="Product Registration Issued Date:"
                            value={formatDate2(product.pclIssuedDate)}
                          />
                          <Detail
                            label="Product Registration Expiry Date:"
                            value={formatDate2(product.pclExpiryDate)}
                          />
                        </>
                      )}
                      {permitDetails?.permitCategory !== "pesticide" && (
                        <>
                          <Detail
                            label="Chemical Class:"
                            value={product.chemicalClass}
                          />
                          <Detail label="CAS Number:" value={product.casNo} />
                          <Detail
                            label="Hazard Classes:"
                            value={
                              product.hazardClass &&
                              product.hazardClass.length > 0 &&
                              product.hazardClass.join(" , ")
                            }
                          />{" "}
                        </>
                      )}
                      <Detail
                        label="Estimated Quantity:"
                        value={`${product.quantity} ${product.unit}`}
                      />
                      {permitDetails?.permitCategory == "pesticide" && (
                        <Detail
                          label="Package Size:"
                          value={`${product.packageSizeValue ?? "N/A"} ${
                            product.packageSizeUnit ?? ""
                          }`}
                        />
                      )}
                      {permitDetails?.permitCategory === "pesticide" && (
                        <Detail
                          label="Packaging Type:"
                          value={product.packagingType}
                        />
                      )}

                      <Detail
                        label={`Expected ${
                          permitDetails?.permitType == "import"
                            ? "Arrival"
                            : "Departure"
                        } Date:`}
                        value={formatDate2(product.arrivalDate)}
                      />
                      {purpose === "national_emergency" && (
                        <Detail
                          label="Type of Emergency:"
                          value={product.emergencyType}
                        />
                      )}
                      {permitDetails?.permitCategory === "pesticide" &&
                        purpose === "national_emergency" && (
                          <Detail
                            label="Target Pest/Disease:"
                            value={product.targetPestOrDisease}
                          />
                        )}
                      <Detail label="End Use:" value={product.endUse} />
                      <Divider />
                      <Detail
                        label="Manufacturer:"
                        value={product.manufacturer}
                      />
                      <Detail
                        label="Manufacturer Address:"
                        value={product.manufacturerAddress}
                      />
                      <Detail
                        label="Supplier Name:"
                        value={product.supplierName}
                      />
                      <Detail
                        label="Supplier Address:"
                        value={product.supplierAddress}
                      />
                      {permitDetails.permitType === "import" && (
                        <>
                          <Detail
                            label="Country of Origin:"
                            value={product?.routeDetails?.importCountry}
                          />
                          <Detail
                            label="Entry Point (Port/Border):"
                            value={product?.routeDetails?.entryPoint}
                          />
                        </>
                      )}
                      {permitDetails.permitType !== "import" && (
                        <>
                          <Detail
                            label="Country of Destination:"
                            value={product?.routeDetails?.exportCountry}
                          />
                          <Detail
                            label="Exit Point (Port/Border):"
                            value={product?.routeDetails?.exitPoint}
                          />
                        </>
                      )}
                      <Divider />
                      {Array.isArray(product.activeIngredients) &&
                        product.activeIngredients.length > 0 && (
                          <div className={styles.subItem}>
                            <h5 className={styles.subTitle}>
                              Active Ingredients (
                              {product.activeIngredients?.length || 0})
                            </h5>
                            {product.activeIngredients?.map(
                              (ai: any, aiIdx: number) => (
                                <div key={aiIdx} className={styles.detail}>
                                  <span className={styles.label}>
                                    Ingredient {aiIdx + 1}:
                                  </span>
                                  <span className={styles.value}>
                                    {ai.activeIngredient}
                                    {ai.concentrationValue
                                      ? ` — ${ai.concentrationValue}`
                                      : ""}
                                    {ai.concentrationUnit
                                      ? ` ${ai.concentrationUnit}`
                                      : ""}
                                    {ai.casNumber
                                      ? ` — CAS: ${ai.casNumber}`
                                      : ""}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      {product?.manufacturedProducts?.length > 0 && (
                        <>
                          <div className={`${styles.activeIngredients} mt-4`}>
                            <h5 className="text-red-500">
                              {purpose == "formulation"
                                ? "Formulated"
                                : "Manufactured"}{" "}
                              Products ({product?.manufacturedProducts?.length})
                            </h5>

                            <Table
                              dataSource={product?.manufacturedProducts}
                              columns={manufacturedProducts}
                              pagination={false}
                              size="small"
                              rowKey={(record: any, index) =>
                                `${index}-${record.activeIngredient}`
                              }
                            />
                          </div>
                        </>
                      )}
                      <Divider />
                    </div>
                    {/* Volume-Based Multiplier Section */}
                    {![
                      "completeness_check_in_progress",
                      "pending_completeness_check_assignment",
                      "review_completeness_check",
                    ].includes(assignment?.internalStatus) && (
                      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold">
                            VBM
                          </span>
                          <label className="text-sm font-bold text-purple-700">
                            Volume-Based Multiplier (VBM)
                          </label>
                        </div>
                        <Select
                          value={getVBM(product._id)}
                          onChange={(value) => {
                            // Update state (for UI)
                            handleVBMChange(product._id, value);

                            // Auto-save with the updated VBM value (for backend)
                            setTimeout(
                              () =>
                                autoSaveProductData(
                                  product._id,
                                  undefined,
                                  undefined,
                                  value
                                ),
                              100
                            );
                          }}
                          className="w-full"
                          placeholder="Select Volume-Based Multiplier"
                          size="large"
                        >
                          {permitFeesConfig?.volume_multipliers?.map(
                            (vbm: any) => (
                              <Option key={vbm._id} value={vbm.multiplier}>
                                {vbm.multiplier}x — {vbm.description}
                              </Option>
                            )
                          )}
                        </Select>
                      </div>
                    )}
                    {/* Chemical Type Factor Section */}
                    {![
                      "completeness_check_in_progress",
                      "pending_completeness_check_assignment",
                      "review_completeness_check",
                    ].includes(assignment?.internalStatus) && (
                      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">
                            CTF
                          </span>
                          <label className="text-sm font-bold text-orange-700">
                            Chemical Type Factor (CTF)
                          </label>
                        </div>
                        <Select
                          value={getCTF(product._id)}
                          onChange={(value) => {
                            // Update state (for UI)
                            handleCTFChange(product._id, value);

                            // Auto-save with the updated CTF value (for backend)
                            setTimeout(
                              () =>
                                autoSaveProductData(
                                  product._id,
                                  undefined,
                                  value
                                ),
                              100
                            );
                          }}
                          className="w-full"
                          placeholder="Select Chemical Type Factor"
                          size="large"
                        >
                          {permitFeesConfig?.chemical_type_factors?.map(
                            (ctf: any) => (
                              <Option key={ctf._id} value={ctf.factor}>
                                {ctf.factor.toFixed(1)} - {ctf.name}
                              </Option>
                            )
                          )}
                        </Select>
                      </div>
                    )}
                    {/* Hazard Score Section */}
                    {![
                      "completeness_check_in_progress",
                      "pending_completeness_check_assignment",
                      "review_completeness_check",
                    ].includes(assignment?.internalStatus) && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                            HS
                          </span>
                          <h5 className="text-sm font-bold text-blue-700 m-0">
                            Hazard Score (HS) Components
                          </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Base Score:
                            </label>
                            <Slider
                              min={3}
                              max={10}
                              step={1}
                              value={getHazardScore(product._id, "baseScore")}
                              onChange={(value) => {
                                // Snap to nearest allowed value: 3, 6, or 10
                                const allowedValues = [3, 6, 10];
                                const snappedValue = allowedValues.reduce(
                                  (prev, curr) =>
                                    Math.abs(curr - value) <
                                    Math.abs(prev - value)
                                      ? curr
                                      : prev
                                );
                                handleHazardScoreChange(
                                  product._id,
                                  "baseScore",
                                  snappedValue
                                );
                              }}
                              onAfterChange={() =>
                                autoSaveProductData(product._id)
                              }
                              marks={{
                                3: "3",
                                6: "6",
                                10: "10",
                              }}
                              tooltip={{ open: true }}
                              className="w-full hazard-slider"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Health Multiplier:
                            </label>
                            <Select
                              value={getHazardScore(
                                product._id,
                                "healthMultiplier"
                              )}
                              onChange={(value) => {
                                // Create updated scores object with the new value
                                const updatedScores = {
                                  ...hazardScores[product._id],
                                  healthMultiplier: value,
                                };

                                // Update state
                                handleHazardScoreChange(
                                  product._id,
                                  "healthMultiplier",
                                  value
                                );

                                // Auto-save with the updated scores
                                setTimeout(
                                  () =>
                                    autoSaveProductData(
                                      product._id,
                                      updatedScores
                                    ),
                                  100
                                );
                              }}
                              className="w-full"
                              placeholder="Select health multiplier"
                              size="large"
                            >
                              {permitFeesConfig?.health_multipliers?.map(
                                (hm: any) => (
                                  <Option key={hm._id} value={hm.multiplier}>
                                    {hm.multiplier.toFixed(1)} - {hm.name}
                                  </Option>
                                )
                              )}
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Environmental Multiplier:
                            </label>
                            <Select
                              value={getHazardScore(
                                product._id,
                                "environmentMultiplier"
                              )}
                              onChange={(value) => {
                                // Create updated scores object with the new value
                                const updatedScores = {
                                  ...hazardScores[product._id],
                                  environmentMultiplier: value,
                                };

                                // Update state
                                handleHazardScoreChange(
                                  product._id,
                                  "environmentMultiplier",
                                  value
                                );

                                // Auto-save with the updated scores
                                setTimeout(
                                  () =>
                                    autoSaveProductData(
                                      product._id,
                                      updatedScores
                                    ),
                                  100
                                );
                              }}
                              className="w-full"
                              placeholder="Select environmental multiplier"
                              size="large"
                            >
                              {permitFeesConfig?.environmental_multipliers?.map(
                                (em: any) => (
                                  <Option key={em._id} value={em.multiplier}>
                                    {em.multiplier.toFixed(1)} - {em.name}
                                  </Option>
                                )
                              )}
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Physical Multiplier:
                            </label>
                            <Select
                              value={getHazardScore(
                                product._id,
                                "physicalMultiplier"
                              )}
                              onChange={(value) => {
                                // Create updated scores object with the new value
                                const updatedScores = {
                                  ...hazardScores[product._id],
                                  physicalMultiplier: value,
                                };

                                // Update state
                                handleHazardScoreChange(
                                  product._id,
                                  "physicalMultiplier",
                                  value
                                );

                                // Auto-save with the updated scores
                                setTimeout(
                                  () =>
                                    autoSaveProductData(
                                      product._id,
                                      updatedScores
                                    ),
                                  100
                                );
                              }}
                              className="w-full"
                              placeholder="Select physical multiplier"
                              size="large"
                            >
                              {permitFeesConfig?.physical_multipliers?.map(
                                (pm: any) => (
                                  <Option key={pm._id} value={pm.multiplier}>
                                    {pm.multiplier.toFixed(1)} - {pm.name}
                                  </Option>
                                )
                              )}
                            </Select>
                          </div>
                        </div>

                        {/* Display calculated total hazard score */}
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700">
                              Calculated Total Hazard Score:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {(
                                getHazardScore(product._id, "baseScore") *
                                getHazardScore(
                                  product._id,
                                  "healthMultiplier"
                                ) *
                                getHazardScore(
                                  product._id,
                                  "environmentMultiplier"
                                ) *
                                getHazardScore(
                                  product._id,
                                  "physicalMultiplier"
                                )
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Formula: Base × Health × Environmental × Physical
                          </div>
                        </div>
                      </div>
                    )}
                    {/* the proposed fee for the product */}
                    {![
                      "completeness_check_in_progress",
                      "pending_completeness_check_assignment",
                      "review_completeness_check",
                    ].includes(assignment?.internalStatus) && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8 transition-all hover:shadow-md">
                        {/* Header section with professional styling */}
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <DollarCircleOutlined className="text-blue-600 text-lg" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">
                                Fee Determination Matrix
                              </h3>
                              <p className="text-[10px] text-slate-500 m-0 mt-0.5 font-bold uppercase tracking-wider">
                                Permit Cost Calculation
                              </p>
                            </div>
                          </div>
                          <Tag
                            color="blue"
                            icon={<CheckCircleOutlined />}
                            className="m-0 border-none font-bold text-[10px] uppercase px-3 py-0.5 rounded-full"
                          >
                            Live Calculation
                          </Tag>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            <InfoDetail
                              label="Regulatory Cost Unit (RCU)"
                              icon={
                                <CalculatorOutlined className="text-blue-400" />
                              }
                              value={`GH₵ ${formatCurrency(rcu)}`}
                            />
                            <InfoDetail
                              label="Hazard Score (HS)"
                              icon={
                                <WarningOutlined className="text-amber-400" />
                              }
                              value={hs.toFixed(2)}
                            />
                            <InfoDetail
                              label="Chemical Type Factor (CTF)"
                              icon={
                                <InfoCircleOutlined className="text-indigo-400" />
                              }
                              value={ctf.toFixed(1)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            <InfoDetail
                              label="Base Fee (Processing)"
                              icon={
                                <CalculatorOutlined className="text-slate-400" />
                              }
                              value={`GH₵ ${formatCurrency(baseFeePerProduct)}`}
                            />
                            <InfoDetail
                              label="Volume Multiplier (VBM)"
                              icon={
                                <DollarCircleOutlined className="text-emerald-400" />
                              }
                              value={`${vbm}x`}
                            />
                            <InfoDetail
                              label="Risk-Adjusted Fee (RAF)"
                              icon={
                                <DollarCircleOutlined className="text-blue-400" />
                              }
                              value={`GH₵ ${formatCurrency(raf)}`}
                            />
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                  Standard Permit Fee
                                </span>
                                <span className="text-xs font-medium text-slate-500 italic">
                                  (BF + RAF) × VBM
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xs font-bold text-slate-400">
                                  GH₵
                                </span>
                                <span className="text-2xl font-bold text-slate-800">
                                  {formatCurrency(proposedFee)}
                                </span>
                              </div>
                            </div>

                            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col justify-between shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">
                                  Net Balance Due
                                </span>
                                <span className="text-xs font-medium text-blue-400 italic">
                                  (Proposed - Paid)
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xs font-bold text-blue-400">
                                  GH₵
                                </span>
                                <span className="text-2xl font-bold text-blue-900">
                                  {formatCurrency(remainingFee)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Highlight Card for Remaining Fee */}
                          <div className="mt-8 relative overflow-hidden bg-slate-900 rounded-2xl p-8 shadow-lg group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-125 duration-700" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-blue-400 font-extrabold text-[10px] uppercase tracking-[0.2em]">
                                  <CalculatorOutlined />
                                  Remaining Issuance Liability
                                </div>
                                <h4 className="text-white text-lg font-bold m-0 leading-tight">
                                  Final Permit Issuance Balance
                                </h4>
                                <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed">
                                  Final outstanding balance after processing fee
                                  deductions.
                                </p>
                              </div>

                              <div className="flex flex-col items-center md:items-end">
                                <div className="flex items-baseline gap-3">
                                  <span className="text-blue-400 text-lg font-bold">
                                    GH₵
                                  </span>
                                  <span className="text-5xl font-extrabold text-white tracking-tight">
                                    {formatCurrency(remainingFee)}
                                  </span>
                                </div>
                                <Tag className="mt-4 bg-white/10 border-white/20 text-white font-bold rounded-full px-4 py-1 border-none shadow-sm">
                                  Balance Outstanding
                                </Tag>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              };
            })}
          />
        </Block>

        {/* --- BLOCK 4: Warehouse Information --- */}

        {warehouse && warehouse?.length > 0 && (
          <Block
            title="4. Warehouse/Storage Facility"
            sectionKey="warehouse"
            reviewData={review.warehouse}
            evaluationData={evaluation.warehouse}
            onUpdate={handleUpdateSection}
            className={styles.fullWidth}
          >
            {warehouse.map((wh: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Warehouse/Storage Facility {index + 1}
                  </span>
                </Divider>
                <Detail
                  label="Region:"
                  value={normalizeText(wh?.location?.region)}
                />
                <Detail
                  label="District:"
                  value={normalizeText(wh?.location?.district)}
                />
                <Detail label="City:" value={wh?.location?.city} />
                <Detail label="Address:" value={wh?.location?.address} />

                {wh?.location?.googleLocationLink && (
                  <div className={`${styles.detail}`}>
                    <span className={`${styles.label}`}>
                      Google Location Link:
                    </span>{" "}
                    <Link
                      to={wh?.location?.googleLocationLink}
                      className={`${styles.value} text-blue-600 font-bold`}
                    >
                      {wh?.location?.googleLocationLink}
                    </Link>
                  </div>
                )}
                <Detail
                  label="Is EPA-licensed:"
                  value={wh?.isEPALicensed ? "Yes" : "No"}
                />
                {wh?.isEPALicensed && wh?.epaLicense && (
                  <>
                    <Detail
                      label="License Number:"
                      value={wh.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(wh.epaLicense.licenseIssuedDate)}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(wh.epaLicense.licenseExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 5: Factory Information (if applicable) --- */}
        {factory && factory?.length > 0 && (
          <Block
            title="5. Manufacturing/Processing Facility"
            sectionKey="factory"
            reviewData={review.factory}
            evaluationData={evaluation.factory}
            onUpdate={handleUpdateSection}
          >
            {factory.map((f: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Factory {index + 1}
                  </span>
                </Divider>{" "}
                <Detail
                  label="Region:"
                  value={normalizeText(f?.location?.region)}
                />
                <Detail
                  label="District:"
                  value={normalizeText(f?.location?.district)}
                />
                <Detail label="City:" value={f?.location?.city} />
                <Detail label="Address:" value={f?.location?.address} />
                <div className={`${styles.detail}`}>
                  <span className={`${styles.label}`}>
                    Google Location Link:
                  </span>{" "}
                  <Link
                    to={f?.location?.googleLocationLink}
                    className={`${styles.value} text-blue-600 font-bold`}
                  >
                    {f?.location?.googleLocationLink}
                  </Link>
                </div>
                <Detail
                  label="Is Permitted:"
                  value={f?.isPermitted ? "Yes" : "No"}
                />
                {f?.isPermitted && f?.permit && (
                  <>
                    <Detail
                      label="Permit Number:"
                      value={f.permit.permitNumber}
                    />
                    <Detail
                      label="Permit Issued Date:"
                      value={formatDate(f.permit.permitIssuedDate)}
                    />
                    <Detail
                      label="Permit Expiry Date:"
                      value={formatDate(f.permit.permitExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 6: Transporters --- */}
        {transporters?.length > 0 && (
          <Block
            title="6. Transportation Partners"
            className={styles.fullWidth}
            sectionKey="transporters"
            reviewData={review.transporters}
            evaluationData={evaluation.transporters}
            onUpdate={handleUpdateSection}
          >
            {transporters?.map((transporter: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Transporter {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={transporter.name} />
                <Detail
                  label="Contact Email:"
                  value={transporter.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={transporter.contactPhone}
                />
                <Detail
                  label="Vehicle Number:"
                  value={transporter.vehicleNumber}
                />
                <Detail
                  label="EPA Licensed:"
                  value={transporter.isEPALicensed ? "Yes" : "No"}
                />
                {transporter.isEPALicensed && transporter.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={transporter.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        transporter.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        transporter.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 7: Distributors (if any) --- */}
        {distributors?.length > 0 && (
          <Block
            title="7. Distribution Partners"
            className={styles.fullWidth}
            sectionKey="distributors"
            reviewData={review.distributors}
            evaluationData={evaluation.distributors}
            onUpdate={handleUpdateSection}
          >
            {distributors?.map((distributor: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Distributor {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={distributor.name} />
                <Detail
                  label="Contact Email:"
                  value={distributor.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={distributor.contactPhone}
                />
                <Detail
                  label="EPA Licensed:"
                  value={distributor.isEPALicensed ? "Yes" : "No"}
                />
                {distributor.isEPALicensed && distributor.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={distributor.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        distributor.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        distributor.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 8: Repackagers (if any) --- */}
        {repackagers?.length > 0 && (
          <Block
            title="8. Repackaging Partners"
            className={styles.fullWidth}
            sectionKey="repackagers"
            reviewData={review.repackagers}
            evaluationData={evaluation.repackagers}
            onUpdate={handleUpdateSection}
          >
            {repackagers?.map((repackager: any, index: number) => (
              <div key={index} className={styles.partnerItem}>
                <Divider orientation="left" orientationMargin="0">
                  <span className="font-extrabold text-base">
                    Repackager {index + 1}
                  </span>
                </Divider>{" "}
                <Detail label="Name:" value={repackager.name} />
                <Detail
                  label="Contact Email:"
                  value={repackager.contactEmail}
                />
                <Detail
                  label="Contact Phone:"
                  value={repackager.contactPhone}
                />
                <Detail
                  label="EPA Licensed:"
                  value={repackager.isEPALicensed ? "Yes" : "No"}
                />
                {repackager.isEPALicensed && repackager.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={repackager.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(
                        repackager.epaLicense.licenseIssuedDate
                      )}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(
                        repackager.epaLicense.licenseExpiryDate
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 9: Handlers (if any) --- */}
        {handlers?.length > 0 && (
          <Block
            title="9. Handling Partners"
            className={styles.fullWidth}
            sectionKey="handlers"
            reviewData={review.handlers}
            evaluationData={evaluation.handlers}
            onUpdate={handleUpdateSection}
          >
            {handlers?.map((handler: any, index: any) => (
              <div key={index} className={`${styles.partnerItem} mb-5`}>
                <h4
                  className={`${styles.subTitle} font-bold text-base underline`}
                >
                  Handler {index + 1}
                </h4>
                <Detail label="Name:" value={handler.name} />
                <Detail label="Contact Email:" value={handler.contactEmail} />
                <Detail label="Contact Phone:" value={handler.contactPhone} />
                <Detail
                  label="EPA Licensed:"
                  value={handler.isEPALicensed ? "Yes" : "No"}
                />
                {handler.isEPALicensed && handler.epaLicense && (
                  <>
                    <Detail
                      label="EPA License Number:"
                      value={handler.epaLicense.licenseNumber}
                    />
                    <Detail
                      label="License Issued Date:"
                      value={formatDate(handler.epaLicense.licenseIssuedDate)}
                    />
                    <Detail
                      label="License Expiry Date:"
                      value={formatDate(handler.epaLicense.licenseExpiryDate)}
                    />
                  </>
                )}
              </div>
            ))}
          </Block>
        )}

        {/* --- BLOCK 10: Proponent License --- */}
        {proponentLicense && (
          <Block
            title="10. Proponent License"
            sectionKey="proponentLicense"
            reviewData={review.proponentLicense}
            evaluationData={evaluation.proponentLicense}
            onUpdate={handleUpdateSection}
          >
            <Detail
              label="License Number:"
              value={proponentLicense.licenseNumber}
            />
            <Detail
              label="License Issued Date:"
              value={formatDate(proponentLicense.licenseIssuedDate)}
            />
            <Detail
              label="License Expiry Date:"
              value={formatDate(proponentLicense.licenseExpiryDate)}
            />
          </Block>
        )}

        {/* --- BLOCK 11: Proponent Permit --- */}
        {proponentPermit && (
          <Block
            title="11. Proponent Permit"
            sectionKey="proponentPermit"
            reviewData={review.proponentPermit}
            evaluationData={evaluation.proponentPermit}
            onUpdate={handleUpdateSection}
          >
            <Detail
              label="Permit Number:"
              value={proponentPermit?.permitNumber}
            />
            <Detail
              label="Permit Issued Date:"
              value={formatDate(proponentPermit?.permitIssuedDate)}
            />
            <Detail
              label="Permit Expiry Date:"
              value={formatDate(proponentPermit?.permitExpiryDate)}
            />
          </Block>
        )}

        {/* --- BLOCK 12: Traceability Location --- */}
        {(traceabilityLocation?.region ||
          traceabilityLocation?.address ||
          researchTrialFacility) && (
          <Block
            title="12. Traceability Location"
            sectionKey="traceabilityLocation"
            reviewData={review.traceabilityLocation}
            evaluationData={evaluation.traceabilityLocation}
            onUpdate={handleUpdateSection}
          >
            <Detail
              label="Research/Trial Facility:"
              value={researchTrialFacility}
            />
            <Detail label="Country:" value={traceabilityLocation.country} />
            <Detail label="Region:" value={traceabilityLocation.region} />
            <Detail label="District:" value={traceabilityLocation.district} />
            <Detail label="City:" value={traceabilityLocation.city} />
            <Detail label="Address:" value={traceabilityLocation.address} />

            {traceabilityLocation.googleLocationLink && (
              <div className={styles.detail}>
                <span className={styles.label}>Google Location Link:</span>{" "}
                <Link
                  to={traceabilityLocation.googleLocationLink}
                  className={`${styles.value} text-blue-600 font-bold`}
                >
                  {traceabilityLocation.googleLocationLink}
                </Link>
              </div>
            )}
          </Block>
        )}

        {/* --- BLOCK 13: Attachments --- */}
        <Block
          title="13. Supporting Documents"
          className={styles.fullWidth}
          sectionKey="attachments"
          reviewData={review.attachments}
          evaluationData={evaluation.attachments}
          onUpdate={handleUpdateSection}
        >
          {application?.attachments?.length > 0 ? (
            <div className="bg-slate-50 rounded-lg p-2">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
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
                            {formatLabel(attachment.label).replace(/_/g, " ")}
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
              message="No Documents Attached"
              type="info"
              showIcon
              style={{ textAlign: "center", marginTop: 16 }}
            />
          )}
        </Block>

        {/* --- BLOCK 15: Total Fee Summary --- */}
        {![
          "completeness_check_in_progress",
          "pending_completeness_check_assignment",
          "review_completeness_check",
        ].includes(assignment?.internalStatus) && (
          <Block
            title="15. Total Permit Fee Summary"
            className={styles.fullWidth}
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CalculatorOutlined className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">
                      Cumulative Fee Assessment
                    </h3>
                    <p className="text-[10px] text-slate-500 m-0 mt-0.5 font-bold uppercase tracking-wider">
                      Application Aggregate
                    </p>
                  </div>
                </div>
                <Tag
                  color="blue"
                  icon={<CheckCircleOutlined />}
                  className="m-0 border-none font-bold text-[10px] uppercase px-3 py-0.5 rounded-full"
                >
                  Aggregated Calculation
                </Tag>
              </div>

              <div className="p-6">
                {/* Individual Product Fees Table */}
                <div className="mb-8 overflow-hidden border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          HS
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          CTF
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          VBM
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Permit Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {products?.map((product, index) => {
                        const hs =
                          getHazardScore(product._id, "baseScore") *
                          getHazardScore(product._id, "healthMultiplier") *
                          getHazardScore(product._id, "environmentMultiplier") *
                          getHazardScore(product._id, "physicalMultiplier");
                        const ctf = getCTF(product._id);
                        const vbm = getVBM(product._id);
                        const raf = hs * ctf * 200;
                        const baseFeePerProduct =
                          totalCalculations.totalProcessingFee /
                          (products?.length || 1);
                        const permitFee = (baseFeePerProduct + raf) * vbm;

                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-xs font-medium text-slate-500">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-xs font-bold text-slate-800">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-xs text-center text-slate-600 font-medium">
                              {hs.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-xs text-center text-slate-600 font-medium">
                              {ctf.toFixed(1)}
                            </td>
                            <td className="px-4 py-3 text-xs text-center text-slate-600 font-medium">
                              {vbm}x
                            </td>
                            <td className="px-4 py-3 text-xs text-right font-bold text-slate-900">
                              GH₵ {formatCurrency(permitFee)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <InfoDetail
                    label="Total Products"
                    icon={<InfoCircleOutlined className="text-slate-400" />}
                    value={products?.length || 0}
                  />
                  <InfoDetail
                    label="Aggregate RAF"
                    icon={<DollarCircleOutlined className="text-blue-400" />}
                    value={`GH₵ ${formatCurrency(totalCalculations.totalRaf)}`}
                  />
                  <InfoDetail
                    label="Total Paid (Processing)"
                    icon={<CheckCircleOutlined className="text-emerald-400" />}
                    value={`GH₵ ${formatCurrency(
                      totalCalculations.totalProcessingFee
                    )}`}
                  />
                  <InfoDetail
                    label="Ancillary Fees"
                    icon={<DollarCircleOutlined className="text-slate-400" />}
                    value="GH₵ 0.00"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Total Combined Permit Fee
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        GH₵
                      </span>
                      <span className="text-2xl font-bold text-slate-800">
                        {formatCurrency(totalCalculations.totalPermitFee)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col justify-between shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">
                        Aggregate Net Balance
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-blue-400">
                        GH₵
                      </span>
                      <span className="text-2xl font-bold text-blue-900">
                        {formatCurrency(totalCalculations.totalRemainingFee)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Highlight Card */}
                <div className="mt-8 relative overflow-hidden bg-slate-900 rounded-2xl p-8 shadow-lg group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-125 duration-700" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-blue-400 font-extrabold text-[10px] uppercase tracking-[0.2em]">
                        <CalculatorOutlined />
                        Total Issuance Liability
                      </div>
                      <h4 className="text-white text-lg font-bold m-0 leading-tight">
                        Aggregate Application Balance
                      </h4>
                      <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed">
                        Total outstanding balance for all products in this
                        application after processing fee deductions.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                      <div className="flex items-baseline gap-3">
                        <span className="text-blue-400 text-lg font-bold">
                          GH₵
                        </span>
                        <span className="text-5xl font-extrabold text-white tracking-tight">
                          {formatCurrency(totalCalculations.totalRemainingFee)}
                        </span>
                      </div>
                      <Tag className="mt-4 bg-white/10 border-white/20 text-white font-bold rounded-full px-4 py-1 border-none shadow-sm">
                        Total Balance Due
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Formula Explanation */}
                <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 transition-all hover:bg-blue-50">
                  <div className="flex items-center gap-2 mb-4">
                    <InfoCircleOutlined className="text-blue-500" />
                    <h5 className="text-sm font-bold text-blue-800 m-0 uppercase tracking-tight">
                      Fee Determination Formula
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">
                          Risk-Adjusted Fee (RAF)
                        </span>
                        <span className="text-blue-700 font-bold">
                          HS × CTF × RCU
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">
                          Standard Permit Fee
                        </span>
                        <span className="text-blue-700 font-bold">
                          (BF + RAF) × VBM
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-relaxed italic border-l border-slate-200 pl-6">
                      <span className="font-bold not-italic">Key:</span> HS:
                      Hazard Score, CTF: Chemical Type Factor, RCU: Regulatory
                      Cost Unit (GH₵ 200), BF: Base Processing Fee, VBM:
                      Volume-Based Multiplier.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        )}
      </div>
    </div>
  );
};

// Default export
export default PesticideChemicalReview;
