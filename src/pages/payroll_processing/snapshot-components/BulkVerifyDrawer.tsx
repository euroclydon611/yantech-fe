import { FC } from "react";
import { Drawer, Button, Select } from "antd";
import { styles } from "@/styles";

interface BulkVerifyDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  verificationStatus: string;
  onStatusChange: (status: string) => void;
  verificationNotes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const BulkVerifyDrawer: FC<BulkVerifyDrawerProps> = ({
  open,
  onClose,
  selectedCount,
  verificationStatus,
  onStatusChange,
  verificationNotes,
  onNotesChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <Drawer
      title="Bulk Verify Employees"
      placement="right"
      onClose={onClose}
      open={open}
      width={450}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Verification Status <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            placeholder="Select status"
            value={verificationStatus || undefined}
            onChange={onStatusChange}
            options={[
              { label: "Pending Review", value: "PENDING_REVIEW" },
              { label: "Approved for Pay", value: "APPROVED_FOR_PAY" },
              { label: "Excluded", value: "EXCLUDED" },
              { label: "Flagged for Review", value: "FLAGGED_FOR_REVIEW" },
              { label: "On Hold", value: "ON_HOLD" },
            ]}
            style={{ width: "100%" }}
          />
        </div>

        {verificationStatus !== "APPROVED_FOR_PAY" && (
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Notes <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              placeholder="Add verification notes..."
              value={verificationNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "8px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                fontFamily: "inherit",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Notes are required for non-approved statuses
            </p>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#f0f5ff",
            padding: "12px",
            borderRadius: "4px",
            borderLeft: "4px solid #1890ff",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontSize: "13px" }}>
            <strong>Summary:</strong>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>
            Employees: {selectedCount}
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>
            Status: {verificationStatus?.replace(/_/g, " ") || "Not selected"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={isLoading}
            disabled={!verificationStatus}
            style={{ flex: 1 }}
            className={styles.primary_button}
          >
            Verify All
          </Button>
          <Button
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default BulkVerifyDrawer;
