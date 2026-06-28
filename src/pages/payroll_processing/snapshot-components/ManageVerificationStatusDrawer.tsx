import {
  Drawer,
  Button,
  Divider,
  InputNumber,
  Select,
  Checkbox,
  Space,
} from "antd";
import { FC } from "react";
import { styles } from "@/styles";

interface MonthOption {
  label: string;
  value: string;
}

interface ManageVerificationStatusDrawerProps {
  open: boolean;
  onClose: () => void;
  payMonth?: string;
  year?: number;
  onPayMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
  deadlineDays: number;
  onDeadlineDaysChange: (days: number) => void;
  additionalDays: number;
  onAdditionalDaysChange: (days: number) => void;
  notifyManagementHead: boolean;
  onNotifyManagementHeadChange: (val: boolean) => void;
  autoClose: boolean;
  onAutoCloseChange: (val: boolean) => void;
  onOpenVerification: () => void;
  onCloseVerification: () => void;
  onExtendDeadline: () => void;
  onReopenVerification: () => void;
  isOpeningVerification: boolean;
  isClosingVerification: boolean;
  isExtendingDeadline: boolean;
  isReopeningVerification: boolean;
  monthOptions: MonthOption[];
  hasOpenVerificationAccess: boolean;
  hasCloseVerificationAccess: boolean;
  hasExtendDeadlineAccess: boolean;
  hasReopenVerificationAccess: boolean;
}

const ManageVerificationStatusDrawer: FC<ManageVerificationStatusDrawerProps> = ({
  open,
  onClose,
  payMonth,
  year,
  onPayMonthChange,
  onYearChange,
  deadlineDays,
  onDeadlineDaysChange,
  additionalDays,
  onAdditionalDaysChange,
  notifyManagementHead,
  onNotifyManagementHeadChange,
  autoClose,
  onAutoCloseChange,
  onOpenVerification,
  onCloseVerification,
  onExtendDeadline,
  onReopenVerification,
  isOpeningVerification,
  isClosingVerification,
  isExtendingDeadline,
  isReopeningVerification,
  monthOptions,
  hasOpenVerificationAccess,
  hasCloseVerificationAccess,
  hasExtendDeadlineAccess,
  hasReopenVerificationAccess,
}) => {
  return (
    <Drawer
      title="Manage Verification Status"
      placement="right"
      onClose={onClose}
      open={open}
      width={450}
    >
      <div style={{ marginBottom: "24px" }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pay Month:
        </label>
        <Select
          style={{ width: "100%" }}
          placeholder="Select month"
          value={payMonth || undefined}
          onChange={onPayMonthChange}
          options={monthOptions}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year:
        </label>
        <InputNumber
          style={{ width: "100%" }}
          value={year}
          onChange={(val) => onYearChange(val || new Date().getFullYear())}
          min={2020}
          max={2100}
        />
      </div>

      <Divider style={{ margin: "24px 0" }} />

      {hasOpenVerificationAccess && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              padding: "14px",
              backgroundColor: "#f0f5ff",
              borderRadius: "6px",
              border: "1px solid #b6e3ff",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#0050b3",
              }}
            >
              Open Verification for Review
            </div>
            <p
              style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}
            >
              Opens the verification period for department heads to review and
              approve employees.
            </p>
            <div style={{ marginBottom: "12px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Deadline (days from now):
              </label>
              <InputNumber
                style={{ width: "100%" }}
                value={deadlineDays}
                onChange={(val) => onDeadlineDaysChange(val || 7)}
                min={1}
                max={30}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Space direction="vertical">
                <Checkbox
                  checked={notifyManagementHead}
                  onChange={(e) =>
                    onNotifyManagementHeadChange(e.target.checked)
                  }
                >
                  <span className="text-sm">Notify Heads of Management Units</span>
                </Checkbox>
                <Checkbox
                  checked={autoClose}
                  onChange={(e) => onAutoCloseChange(e.target.checked)}
                >
                  <span className="text-sm">Auto-close when deadline is reached</span>
                </Checkbox>
              </Space>
            </div>
            <Button
              block
              type="primary"
              size="large"
              loading={isOpeningVerification}
              onClick={onOpenVerification}
              className={`${styles.primary_button} font-bold`}
            >
              Open Verification
            </Button>
          </div>
        </div>
      )}

      {hasExtendDeadlineAccess && (
        <>
          <Divider style={{ margin: "24px 0" }} />

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                padding: "14px",
                backgroundColor: "#fff7e6",
                borderRadius: "6px",
                border: "1px solid #ffd591",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#ad6800",
                }}
              >
                Extend Verification Deadline
              </div>
              <p
                style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}
              >
                Extend the current verification deadline by additional days.
              </p>
              <div style={{ marginBottom: "12px" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Days:
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  value={additionalDays}
                  onChange={(val) => onAdditionalDaysChange(val || 3)}
                  min={1}
                  max={30}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <Space direction="vertical">
                  <Checkbox
                    checked={notifyManagementHead}
                    onChange={(e) =>
                      onNotifyManagementHeadChange(e.target.checked)
                    }
                  >
                    <span className="text-sm">Notify Heads of Management Units</span>
                  </Checkbox>
                  <Checkbox
                    checked={autoClose}
                    onChange={(e) => onAutoCloseChange(e.target.checked)}
                  >
                    <span className="text-sm">Auto-close when new deadline is reached</span>
                  </Checkbox>
                </Space>
              </div>
              <Button
                block
                size="large"
                loading={isExtendingDeadline}
                onClick={onExtendDeadline}
                className={`${styles.primary_button} !font-bold !bg-[#faad14] hover:!bg-[#faad14] hover:!text-white`}
              >
                Extend Deadline
              </Button>
            </div>
          </div>
        </>
      )}

      {hasCloseVerificationAccess && (
        <>
          <Divider style={{ margin: "24px 0" }} />

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                padding: "14px",
                backgroundColor: "#fff1f0",
                borderRadius: "6px",
                border: "1px solid #ffccc7",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#c5222b",
                }}
              >
                Close Verification
              </div>
              <p
                style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}
              >
                Closes the verification period. No further changes allowed.
              </p>
              <Button
                block
                danger
                size="large"
                loading={isClosingVerification}
                onClick={onCloseVerification}
                className={`${styles.primary_button} !font-bold !bg-red-700 hover:!bg-red-800 hover:!text-white`}
              >
                Close Verification
              </Button>
            </div>
          </div>
        </>
      )}

      {hasReopenVerificationAccess && (
        <>
          <Divider style={{ margin: "24px 0" }} />

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                padding: "14px",
                backgroundColor: "#f9f0ff",
                borderRadius: "6px",
                border: "1px solid #d3adf7",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#531dab",
                }}
              >
                Reopen Verification
              </div>
              <p
                style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}
              >
                Reopens a previously closed verification period, allowing
                department heads to make further changes.
              </p>
              <div style={{ marginBottom: "12px" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Deadline (days from now):
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  value={deadlineDays}
                  onChange={(val) => onDeadlineDaysChange(val || 7)}
                  min={1}
                  max={30}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <Space direction="vertical">
                  <Checkbox
                    checked={notifyManagementHead}
                    onChange={(e) =>
                      onNotifyManagementHeadChange(e.target.checked)
                    }
                  >
                    <span className="text-sm">Notify Heads of Management Units</span>
                  </Checkbox>
                  <Checkbox
                    checked={autoClose}
                    onChange={(e) => onAutoCloseChange(e.target.checked)}
                  >
                    <span className="text-sm">Auto-close when new deadline is reached</span>
                  </Checkbox>
                </Space>
              </div>
              <Button
                block
                size="large"
                loading={isReopeningVerification}
                onClick={onReopenVerification}
                className={`${styles.primary_button} !font-bold !bg-[#722ed1] hover:!bg-[#531dab] hover:!text-white`}
              >
                Reopen Verification
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default ManageVerificationStatusDrawer;
