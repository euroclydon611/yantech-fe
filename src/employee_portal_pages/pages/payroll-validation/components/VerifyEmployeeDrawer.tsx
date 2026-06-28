import { FC } from "react";
import { Drawer, Button, Select, Input, Card } from "antd";
import { formatDate4 } from "@/utils/helperFunction";
import { styles } from "@/styles";

interface VerificationRecord {
  _id?: string;
  employee_data?: {
    full_name: string;
  };
  verification_history?: Array<{
    status: string;
    verified_at: string;
    notes?: string;
    verified_by_user?: {
      firstname: string;
      lastname: string;
      email?: string;
    };
    verified_by_employee?: {
      staff_id: string;
      firstname: string;
      lastname: string;
    };
  }>;
}

interface VerifyEmployeeDrawerProps {
  open: boolean;
  onClose: () => void;
  snapshot: VerificationRecord | null;
  verificationStatus: string;
  verificationNotes: string;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  showHistoryOnly?: boolean;
}

const VerifyEmployeeDrawer: FC<VerifyEmployeeDrawerProps> = ({
  open,
  onClose,
  snapshot,
  verificationStatus,
  verificationNotes,
  onStatusChange,
  onNotesChange,
  onSubmit,
  isLoading,
  showHistoryOnly = false,
}) => {
  return (
    <Drawer
      title={showHistoryOnly ? "Verification History" : `Verify Employee: ${snapshot?.employee_data?.full_name || ""}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
    >
      {snapshot && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!showHistoryOnly && (
            <>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Verification Status <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  value={verificationStatus || undefined}
                  onChange={onStatusChange}
                  placeholder="Select status"
                  options={[
                    { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
                    { label: "Excluded", value: "EXCLUDED" },
                    { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
                    { label: "On Hold", value: "ON_HOLD" },
                  ]}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label
                  style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                >
                  Notes{" "}
                  {verificationStatus !== "APPROVED_FOR_PAY" && verificationStatus
                    ? " *"
                    : " (Optional)"}
                </label>
                <Input.TextArea
                  value={verificationNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder={
                    verificationStatus !== "APPROVED_FOR_PAY" && verificationStatus
                      ? "Notes are required for this status..."
                      : "Add verification notes..."
                  }
                  rows={4}
                  status={
                    verificationStatus !== "APPROVED_FOR_PAY" &&
                    verificationStatus &&
                    !verificationNotes.trim()
                      ? "error"
                      : undefined
                  }
                />
                {verificationStatus !== "APPROVED_FOR_PAY" &&
                  verificationStatus &&
                  !verificationNotes.trim() && (
                    <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                      Notes are required for this status
                    </p>
                  )}
              </div>
            </>
          )}

          {snapshot.verification_history && snapshot.verification_history.length > 0 && (
            <Card
              title="Verification History"
              size="small"
              style={{ marginTop: "16px" }}
            >
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {snapshot.verification_history.map((historyRecord: any, idx: number) => {
                  const verifiedByUser = historyRecord.verified_by_user;
                  const verifiedByEmployee = historyRecord.verified_by_employee;
                  const verifierName = verifiedByUser
                    ? `${verifiedByUser.firstname} ${verifiedByUser.lastname}`
                    : verifiedByEmployee
                    ? `${verifiedByEmployee.firstname} ${verifiedByEmployee.lastname} (${verifiedByEmployee.staff_id})`
                    : "System";

                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "12px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {historyRecord.status?.replace(/_/g, " ") || "N/A"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#0066cc", marginTop: "4px" }}>
                        <strong>Verified by:</strong> {verifierName}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        {historyRecord.verified_at
                          ? formatDate4(historyRecord.verified_at)
                          : "N/A"}
                      </div>
                      {historyRecord.notes && (
                        <div
                          style={{
                            fontSize: "11px",
                            marginTop: "4px",
                            fontStyle: "italic",
                            color: "#555",
                            backgroundColor: "#f9f9f9",
                            padding: "6px",
                            borderRadius: "3px",
                            borderLeft: "3px solid #0066cc",
                          }}
                        >
                          <strong>Notes:</strong> {historyRecord.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {!showHistoryOnly && (
              <Button
                type="primary"
                onClick={onSubmit}
                loading={isLoading}
                disabled={
                  !verificationStatus ||
                  (verificationStatus !== "APPROVED_FOR_PAY" && !verificationNotes.trim())
                }
                style={{ flex: 1 }}
                className={styles.primary_button}
              >
                {isLoading ? "Updating..." : "Submit Verification"}
              </Button>
            )}
            <Button onClick={onClose} style={{ flex: showHistoryOnly ? 1 : 0.5 }}>
              {showHistoryOnly ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default VerifyEmployeeDrawer;
