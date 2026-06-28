import { Drawer, Row, Col } from "antd";
import { FC } from "react";

interface VerificationSummaryDrawerProps {
  open: boolean;
  onClose: () => void;
  verificationSummary?: any;
  payMonth?: string;
  year?: number;
}

const VerificationSummaryDrawer: FC<VerificationSummaryDrawerProps> = ({
  open,
  onClose,
  verificationSummary,
  payMonth,
  year,
}) => {
  return (
    <Drawer
      title="Verification Summary"
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
    >
      {verificationSummary && (
        <>
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
            >
              Payroll Period: {payMonth?.toUpperCase()} {year}
            </div>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Pending Review
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                >
                  {verificationSummary?.data?.verification_summary
                    ?.PENDING_REVIEW || 0}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Approved for Pay
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  {verificationSummary?.data?.verification_summary
                    ?.APPROVED_FOR_PAY || 0}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Excluded
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#faad14",
                  }}
                >
                  {verificationSummary?.data?.verification_summary
                    ?.EXCLUDED || 0}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Flagged for Review
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                  }}
                >
                  {verificationSummary?.data?.verification_summary
                    ?.FLAGGED_FOR_REVIEW || 0}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>On Hold</div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#13c2c2",
                  }}
                >
                  {verificationSummary?.data?.verification_summary?.ON_HOLD ||
                    0}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Auto Excluded
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#f57800",
                  }}
                >
                  {verificationSummary?.data?.verification_summary
                    ?.AUTO_EXCLUDED || 0}
                </div>
              </div>
            </Col>
          </Row>

          {verificationSummary && (
            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderRadius: "4px",
                  backgroundColor: verificationSummary?.data
                    ?.can_proceed_with_payroll
                    ? "#f6ffed"
                    : "#fff1f0",
                  border: `2px solid ${
                    verificationSummary?.data?.can_proceed_with_payroll
                      ? "#b7eb8f"
                      : "#ffccc7"
                  }`,
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: verificationSummary?.data?.can_proceed_with_payroll
                      ? "#52c41a"
                      : "#ff4d4f",
                    marginBottom: "8px",
                  }}
                >
                  {verificationSummary?.data?.can_proceed_with_payroll
                    ? "✓ Ready for Payroll"
                    : "✗ Not Ready for Payroll"}
                </div>

                {!verificationSummary?.data?.can_proceed_with_payroll &&
                  verificationSummary?.data?.blocking_reasons &&
                  verificationSummary.data.blocking_reasons.length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#d4380d",
                        marginTop: "8px",
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "6px" }}>
                        Blocking Reasons:
                      </div>
                      <ul
                        style={{
                          margin: "0",
                          paddingLeft: "20px",
                          lineHeight: "1.8",
                        }}
                      >
                        {verificationSummary.data.blocking_reasons.map(
                          (reason: string, index: number) => (
                            <li key={index}>{reason}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {verificationSummary?.data?.can_proceed_with_payroll && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#52c41a",
                      marginTop: "8px",
                    }}
                  >
                    All employees have been verified. Payroll is ready for
                    finalization.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Drawer>
  );
};

export default VerificationSummaryDrawer;
