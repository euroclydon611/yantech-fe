import { FC } from "react";
import { Drawer, Select, Input, Card } from "antd";
import { formatDate4 } from "@/utils/helperFunction";

interface VerificationRecord {
  employee_data?: {
    staff_id: string;
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

interface VerifyEmployeeSnapshotDrawerProps {
  open: boolean;
  onClose: () => void;
  record: VerificationRecord | null;
  status: string;
  notes: string;
  onStatusChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  showHistoryOnly?: boolean;
}

const VerifyEmployeeSnapshotDrawer: FC<VerifyEmployeeSnapshotDrawerProps> = ({
  open,
  onClose,
  record,
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onSubmit,
  isLoading = false,
  showHistoryOnly = false,
}) => {
  return (
    <Drawer
      title={showHistoryOnly ? "Verification History" : "Verify Employee Snapshot"}
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
    >
      {record && (
        <div>
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <strong>Staff ID:</strong> {record.employee_data?.staff_id}
            </div>
            <div>
              <strong>Employee:</strong> {record.employee_data?.full_name}
            </div>
          </div>

          {!showHistoryOnly && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status:
                </label>
                <Select
                  style={{ width: "100%" }}
                  value={status}
                  onChange={onStatusChange}
                  options={[
                    { label: "Pending Review", value: "PENDING_REVIEW" },
                    { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
                    {
                      label: "Excluded",
                      value: "EXCLUDED",
                    },
                    { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
                    { label: "On Hold", value: "ON_HOLD" },
                    { label: "Auto Excluded", value: "AUTO_EXCLUDED" },
                  ]}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                  {status !== "APPROVED_FOR_PAY" && (
                    <span style={{ color: "#d9534f" }}>*</span>
                  )}
                  :
                </label>
                <Input.TextArea
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="Add verification notes..."
                  rows={4}
                />
                {status !== "APPROVED_FOR_PAY" && !notes && (
                  <div style={{ color: "#d9534f", fontSize: "12px", marginTop: "4px" }}>
                    Notes are required for non-approved statuses
                  </div>
                )}
              </div>
            </>
          )}

          {record.verification_history && record.verification_history.length > 0 && (
            <Card
              title="Verification History"
              size="small"
              style={{ marginTop: "20px" }}
            >
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {record.verification_history.map((historyRecord: any, idx: number) => {
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

          <div style={{ marginTop: "24px", display: "flex", gap: "8px" }}>
            {!showHistoryOnly && (
              <button
                onClick={onSubmit}
                disabled={isLoading || (status !== "APPROVED_FOR_PAY" && !notes)}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  backgroundColor:
                    !isLoading && (status === "APPROVED_FOR_PAY" || notes)
                      ? "#15803d"
                      : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    !isLoading && (status === "APPROVED_FOR_PAY" || notes)
                      ? "pointer"
                      : "not-allowed",
                  fontWeight: "bold",
                }}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                flex: showHistoryOnly ? 1 : 1,
                padding: "8px 16px",
                backgroundColor: "#666",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showHistoryOnly ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default VerifyEmployeeSnapshotDrawer;
