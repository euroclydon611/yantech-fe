import React from "react";
import { useMemo } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { Divider } from "antd";
import {
  formatDate,
  formatDate2,
  formatDate4,
  handleDocumentView,
  normalizeText,
} from "@/utils/helperFunction";
import {
  Block,
  Detail,
} from "@/employee_portal_pages/components/review/helpers";
import { SupportingDocumentsGrid } from "@/employee_portal_pages/components/review/supporting-documents-grid";
import ApplicantInformationBlock from "@/components/general/applicant-information";

interface PesticideChemicalReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

export const PesticideImportAuthorizationReview: React.FC<
  PesticideChemicalReviewProps
> = ({ application, onApplicationUpdate }) => {
  const { authorizationDetails, products, authorizee, reasonForAuthorization } =
    application?.answers || {};

  const defaultReviewStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      authorizationDetails: { status: "pending", comment: null },
      products: { status: "pending", comment: null },
      attachments: { status: "pending", comment: null },
    }),
    []
  );

  const defaultEvaluationStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      authorizationDetails: { status: "pending", comment: null },
      products: { status: "pending", comment: null },
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

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    await onApplicationUpdate(sectionKey, type, status, comment);
  };

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        Authorization Request To Import Pesticide Application Review ASFASDF
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
          sectionKey="authorizationDetails"
          reviewData={review.authorizationDetails}
          evaluationData={evaluation.authorizationDetails}
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
            label="Application Type:"
            value={normalizeText(
              authorizationDetails?.applicationType
            )?.toUpperCase()}
          />
          <Detail
            label="Authorization Type:"
            value={normalizeText(
              authorizationDetails?.authorizationType
            )?.toUpperCase()}
          />
          <Detail label="Authorizee ID:" value={authorizee} />
          <Detail
            label="Reason For Authorization:"
            value={reasonForAuthorization}
          />
        </Block>

        {/* --- BLOCK 3: Products Information --- */}
        <Block
          title="3. Product(s) Information"
          className={`${styles.fullWidth}`}
          sectionKey="products"
          reviewData={review.products}
          evaluationData={evaluation.products}
          onUpdate={handleUpdateSection}
        >
          {products?.map((product: any, index: number) => (
            <div key={index} className={`${styles.productItem} mb-4`}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-extrabold text-base">
                  Product {index + 1}: {product.name}
                </span>
              </Divider>
              <div className={styles.productDetails}>
                <Detail label="Product Name:" value={product.name} />
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
                <Detail label="HS Code:" value={product.hsCode} />
                <Detail
                  label="Formulation Type:"
                  value={product.formulationType}
                />
                <Detail label="Product Type:" value={product.productType} />
                <Detail label="Manufacturer:" value={product.manufacturer} />
                <Detail
                  label="Manufacturer Address:"
                  value={product.manufacturerAddress}
                />
                <Detail label="End Use:" value={product.endUse} />
                {/* <Detail
                      label="Supplier Name:"
                      value={product.supplierName}
                    />
                    <Detail
                      label="Supplier Address:"
                      value={product.supplierAddress}
                    /> */}

                <Detail
                  label="Estimated Authorized Quantity:"
                  value={`${product.quantity} ${product.unit}`}
                />

                <Detail
                  label="Authorization Valid Until:"
                  value={formatDate(product.validUntil)}
                />

                <Divider />

                {/* Active ingredients (listed, not in a table) */}
                {Array.isArray(product.activeIngredients) &&
                  product.activeIngredients.length > 0 && (
                    <div className={styles.subItem}>
                      <h5 className={styles.subTitle}>
                        Active Ingredients (
                        {product.activeIngredients?.length || 0})
                      </h5>
                      {product.activeIngredients.map(
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
                              {ai.casNumber ? ` — CAS: ${ai.casNumber}` : ""}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </Block>

        {/* --- BLOCK 12: Attachments --- */}
        <Block
          title="4. Supporting Documents"
          className={styles.fullWidth}
          sectionKey="attachments"
          reviewData={review.attachments}
          evaluationData={evaluation.attachments}
          onUpdate={handleUpdateSection}
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

export default PesticideImportAuthorizationReview;
