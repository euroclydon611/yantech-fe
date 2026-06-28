import React from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import {
  Typography,
  Table,
  Divider,
  List,
  Button,
  Card,
  Alert,
  Collapse,
} from "antd";
import { EyeOutlined, FileOutlined } from "@ant-design/icons";
import { formatLabel, normalizeText } from "@/utils/helpers";
import { formatDate4, handleDocumentView } from "@/utils/helperFunction";
const { Text } = Typography;
import { Block, Detail } from "../../review/helpers";
import ApplicantInformationBlock from "@/components/general/applicant-information";

interface DomesticPurchaseReviewProps {
  application: any;
}

const DomesticPurchasePreview: React.FC<DomesticPurchaseReviewProps> = ({
  application,
}) => {

  const { permitDetails, products } = application?.answers || {};

  // Table columns for suppliers
  const supplierColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "N/A",
    },
  ];

  // Table columns for recipients
  const recipientColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: string) => text || "N/A",
    },
  ];

  if (!application) {
    return <div>Loading application details...</div>;
  }

  //   console.log(products.manufacturedProducts?.length);

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.mainTitle}>
        {normalizeText(permitDetails?.permitType)} Permit Application Review
      </h2>

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
            label="Permit Type:"
            value={normalizeText(permitDetails?.permitType)}
          />
          <Detail
            label="Permit Category:"
            value={normalizeText(permitDetails?.permitCategory)}
          />
          <Detail
            label="Processing Type:"
            value={normalizeText(application?.processingType)?.toUpperCase()}
          />
        </Block>

        {/* --- BLOCK 3: Products Information --- */}
        <Block
          title="3. Product(s) Information"
          className={`${styles.fullWidth}`}
        >
          {products?.map((product: any, index: number) => (
            <div key={index} className={`${styles.productItem} mb-4`}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-extrabold text-base">
                  Product {index + 1}: {product.name}
                </span>
              </Divider>
              <div className={styles.productDetails}>
                <Detail label={"Product Name:"} value={product.name} />
                <Detail label="Product Type:" value={product.productType} />
                <Detail label="CAS Number:" value={product.casNo} />
                <Detail
                  label="Quantity to be purchased:"
                  value={`${product.quantity} ${product.unit}`}
                />
                <Detail label="Purpose:" value={product.purpose} />
                <Detail
                  label="Supplier Name:"
                  value={product?.suppliers?.[0]?.name}
                />
                <Detail
                  label="Supplier Address:"
                  value={product?.suppliers?.[0]?.address}
                />
                <Detail
                  label="Supplier Phone:"
                  value={product?.suppliers?.[0]?.phone}
                />

                <Divider />

                {/* Active Ingredients Section */}
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

                {/* Suppliers Section */}
                {/* {product.suppliers && product.suppliers.length > 1 && (
                  <Collapse className="mt-2 mb-2" size="small">
                    <Collapse.Panel
                      header={`All Suppliers (${product.suppliers.length})`}
                      key="suppliers"
                    >
                      <Table
                        dataSource={product.suppliers}
                        columns={supplierColumns}
                        pagination={false}
                        size="small"
                        rowKey={(record: any, index) =>
                          `supplier-${index}-${record.name}`
                        }
                      />
                    </Collapse.Panel>
                  </Collapse>
                )} */}

                {/* Recipients Section */}
                <Collapse className="mt-2" size="small">
                  <Collapse.Panel
                    header={`Recipients (${product.recipients?.length || 0})`}
                    key="recipients"
                  >
                    {product.recipients?.length > 0 && (
                      <Table
                        dataSource={product.recipients}
                        columns={recipientColumns}
                        pagination={false}
                        size="small"
                        rowKey={(record: any, index) =>
                          `recipient-${index}-${record.name}`
                        }
                      />
                    )}
                    {(!product.recipients ||
                      product.recipients.length === 0) && (
                      <div className="text-gray-500 italic">
                        No recipients specified
                      </div>
                    )}
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>
          ))}
        </Block>

        <Block title="Supporting Documents" className={styles.fullWidth}>
          <>
            {application?.attachments?.length > 0 ? (
              <div className="space-y-6">
                {(() => {
                  const productDocs: any = {};
                  const recipientDocs: any = {};

                  application.attachments.forEach((attachment: any) => {
                    const label = attachment.label || "";
                    const recipientMatch = label.match(
                      /recipientDocument_(\d+)_(\d+)_(.+)/
                    );

                    if (recipientMatch) {
                      const [, productIdx, recipientIdx, docType] =
                        recipientMatch;
                      const productIndex = parseInt(productIdx);
                      const recipientIndex = parseInt(recipientIdx);
                      const recipient =
                        products?.[productIndex - 1]?.recipients?.[
                          recipientIndex - 1
                        ];

                      if (!recipientDocs[productIndex]) {
                        recipientDocs[productIndex] = {};
                      }
                      if (!recipientDocs[productIndex][recipient?.name]) {
                        recipientDocs[productIndex][recipient?.name] = [];
                      }
                      recipientDocs[productIndex][recipient?.name].push({
                        ...attachment,
                        docType,
                      });
                    } else {
                      const productMatch = label.match(
                        /productDocument_(\d+)_(.+)/
                      );
                      if (productMatch) {
                        const [, productIdx, docType] = productMatch;
                        const productIndex = parseInt(productIdx);
                        if (!productDocs[productIndex]) {
                          productDocs[productIndex] = [];
                        }
                        productDocs[productIndex].push({
                          ...attachment,
                          docType,
                        });
                      }
                    }
                  });

                  const renderDocumentCard = (attachment: any) => (
                    <Card
                      size="small"
                      className="h-full hover:shadow-md transition-shadow bg-white border border-gray-200 !p-3"
                      key={attachment._id}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileOutlined className="text-red-600" />
                          <Text
                            strong
                            className="text-gray-800 text-[10px] uppercase"
                          >
                            {formatLabel(
                              attachment.docType ||
                                formatLabel(attachment.label)
                            ).replace(/_/g, " ")}
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
                  );

                  return (
                    <>
                      {Object.entries(productDocs).map(
                        ([productIdx, docs]: [string, any]) => (
                          <div key={`product-${productIdx}`}>
                            <h4 className="font-bold text-base mb-3">
                              Product {productIdx} Documents
                              <span className="text-gray-500 font-normal text-sm ml-2">
                                {docs.length} file{docs.length > 1 ? "s" : ""}
                              </span>
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-2 mb-4">
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
                                dataSource={docs}
                                renderItem={(doc) => (
                                  <List.Item>
                                    {renderDocumentCard(doc)}
                                  </List.Item>
                                )}
                              />
                            </div>
                          </div>
                        )
                      )}

                      {Object.entries(recipientDocs).map(
                        ([productIdx, recipientGroups]: [string, any]) => (
                          <div key={`recipient-${productIdx}`}>
                            <h4 className="font-bold text-base mb-3">
                              Product {productIdx} - Recipient Documents
                              <span className="text-gray-500 font-normal text-sm ml-2">
                                {Object.values(recipientGroups).flat().length}{" "}
                                file
                                {Object.values(recipientGroups).flat().length >
                                1
                                  ? "s"
                                  : ""}
                              </span>
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-2 mb-4">
                              {Object.entries(recipientGroups).map(
                                ([recipientName, docs]: [string, any]) => (
                                  <div key={recipientName} className="mb-4">
                                    <h5 className="font-semibold text-sm text-gray-700 mb-2">
                                      {recipientName}
                                    </h5>
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
                                      dataSource={docs}
                                      renderItem={(doc) => (
                                        <List.Item>
                                          {renderDocumentCard(doc)}
                                        </List.Item>
                                      )}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <Alert
                message="No Documents Attached"
                type="info"
                showIcon
                style={{ textAlign: "center", marginTop: 16 }}
              />
            )}
          </>
        </Block>
      </div>
    </div>
  );
};

export default DomesticPurchasePreview;
