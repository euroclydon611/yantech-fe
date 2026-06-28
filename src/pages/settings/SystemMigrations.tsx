import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import { Button, Card, Tag, Alert, Divider } from "antd";
import {
  DatabaseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { PageTitle } from "../../utils/PageTitle";
import {
  useMigrateSubmissionFeeBlockersMutation,
  useMigrateQueuedAssignmentsToV2Mutation,
  useMigrateRegistrationAttemptExpiryMutation,
} from "../../redux/features/general/client-applications";

interface MigrationResult {
  success: boolean;
  message: string;
  updated: number;
  skipped?: number;
  details?: Record<string, number>;
}

interface Migration {
  id: string;
  title: string;
  description: string;
  details: string[];
  warning?: string;
  action: () => void;
  isLoading: boolean;
  result: MigrationResult | null;
  error: string | null;
}

const SystemMigrations = () => {
  PageTitle("System Migrations");

  const [runMigrate, { isLoading: migratingFeeBlockers }] =
    useMigrateSubmissionFeeBlockersMutation();
  const [runV2Migration, { isLoading: migratingToV2 }] =
    useMigrateQueuedAssignmentsToV2Mutation();
  const [runAttemptExpiryMigration, { isLoading: migratingAttemptExpiry }] =
    useMigrateRegistrationAttemptExpiryMutation();

  const [feeBlockerResult, setFeeBlockerResult] =
    useState<MigrationResult | null>(null);
  const [feeBlockerError, setFeeBlockerError] = useState<string | null>(null);

  const [v2MigrationResult, setV2MigrationResult] =
    useState<MigrationResult | null>(null);
  const [v2MigrationError, setV2MigrationError] = useState<string | null>(null);

  const [attemptExpiryResult, setAttemptExpiryResult] =
    useState<MigrationResult | null>(null);
  const [attemptExpiryError, setAttemptExpiryError] = useState<string | null>(null);

  const handleFeeBlockerMigration = async () => {
    setFeeBlockerResult(null);
    setFeeBlockerError(null);
    try {
      const res = await runMigrate({}).unwrap();
      setFeeBlockerResult(res);
    } catch (err: any) {
      setFeeBlockerError(
        err?.data?.message || "Migration failed. Check server logs."
      );
    }
  };

  const handleV2Migration = async () => {
    setV2MigrationResult(null);
    setV2MigrationError(null);
    try {
      const res = await runV2Migration({}).unwrap();
      setV2MigrationResult(res);
    } catch (err: any) {
      setV2MigrationError(
        err?.data?.message || "Migration failed. Check server logs."
      );
    }
  };

  const handleAttemptExpiryMigration = async () => {
    setAttemptExpiryResult(null);
    setAttemptExpiryError(null);
    try {
      const res = await runAttemptExpiryMigration({}).unwrap();
      setAttemptExpiryResult(res);
    } catch (err: any) {
      setAttemptExpiryError(
        err?.data?.message || "Migration failed. Check server logs."
      );
    }
  };

  const migrations: Migration[] = [
    {
      id: "submission-fee-blockers",
      title: "Backfill Submission Processing Fee Blockers",
      description:
        "For applications that required processing fee payment before submission, this migration stamps a pre-resolved \"Processing Fee Paid ✓\" badge on their assignments. This prevents HODs from accidentally issuing a second invoice for the same fee.",
      details: [
        "Finds all paid processing-fee invoices in the system",
        "Locates the linked assignment for each",
        "Skips any assignment that already has a processing-fee blocker",
        "Adds a pre-resolved awaiting_processing_fee_payment blocker (green badge)",
        "Safe to run multiple times — idempotent",
      ],
      warning:
        "Run once after deploying the concurrent-processing workflow update. Re-running is safe but has no additional effect.",
      action: handleFeeBlockerMigration,
      isLoading: migratingFeeBlockers,
      result: feeBlockerResult,
      error: feeBlockerError,
    },
    {
      id: "queued-assignments-to-v2",
      title: "Upgrade Queued Assignments to v2 Workflow (Processing Fee First)",
      description:
        "For submitted applications whose assignment has not yet started any stage work (still waiting at Pending Completeness Check), this migration upgrades them to the new v2 workflow order — processing fee is collected first, then completeness check. Assignments that already have work in progress are safely skipped.",
      details: [
        "Finds all assignments at 'pending_completeness_check_assignment' that are not already v2",
        "Skips any assignment where a stage has already been started (in_progress, completed, recalled)",
        "Sets workflowVersion to v2 and internalStatus to pending_processing_fee_assignment",
        "Records a history entry on each migrated assignment",
        "Safe to run multiple times — already-migrated records are ignored",
      ],
      warning:
        "Only run this AFTER confirming with EPA that all new applications should follow the new order. Applications already under active review are NOT affected.",
      action: handleV2Migration,
      isLoading: migratingToV2,
      result: v2MigrationResult,
      error: v2MigrationError,
    },
    {
      id: "registration-attempt-expiry",
      title: "Protect Registration Attempts Linked to Ghana.gov Invoices",
      description:
        "Existing registration attempts that have a Ghana.gov invoice number were at risk of being auto-deleted by MongoDB's TTL index after 7 days. This migration sets expiresAt = null on those records so they are never deleted, and backfills the expiresAt field for those without an invoice so the TTL index works correctly going forward.",
      details: [
        "Finds all attempts WITH a gatewayInvoiceNumber and sets expiresAt = null (permanently protected)",
        "Finds all attempts WITHOUT a gatewayInvoiceNumber that are missing expiresAt and sets it to createdAt + 7 days",
        "Documents with expiresAt = null are completely ignored by MongoDB's TTL auto-delete",
        "Safe to run multiple times — already-protected records are skipped",
        "After running: also drop the old 'createdAt_1' TTL index from MongoDB if it still exists",
      ],
      warning:
        "Run this immediately after deploying. Any payment-linked attempt not yet protected could be deleted by the old TTL index if the 7-day window has passed.",
      action: handleAttemptExpiryMigration,
      isLoading: migratingAttemptExpiry,
      result: attemptExpiryResult,
      error: attemptExpiryError,
    },
  ];

  return (
    <>
      <PageLayout
        title="System Migrations"
        subtitle="One-time data migrations — idempotent, safe to run more than once. Always run during low-traffic periods."
        breadcrumbs={[{ label: "Settings" }, { label: "System Migrations" }]}
      />
      <div className="p-4 max-w-4xl">
      <Divider />

      <div className="flex flex-col gap-6">
        {migrations.map((m) => (
          <Card
            key={m.id}
            className="border border-gray-200 rounded-xl shadow-sm"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ThunderboltOutlined className="text-green-700" />
                    <h2 className="font-semibold text-gray-800 text-base">
                      {m.title}
                    </h2>
                    <Tag color="blue" className="text-[11px]">
                      One-time
                    </Tag>
                  </div>
                  <p className="text-sm text-gray-600">{m.description}</p>
                </div>
                <Button
                  type="primary"
                  loading={m.isLoading}
                  onClick={m.action}
                  className="!bg-green-700 hover:!bg-green-800 shrink-0"
                  icon={<ThunderboltOutlined />}
                >
                  Run Migration
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  What this does
                </p>
                <ul className="flex flex-col gap-1">
                  {m.details.map((d, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <CheckCircleOutlined className="text-green-600 mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {m.warning && (
                <Alert
                  type="warning"
                  icon={<WarningOutlined />}
                  showIcon
                  message={m.warning}
                  className="text-sm"
                />
              )}

              {m.result && (
                <Alert
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                  message={
                    <span>
                      {m.result.message}{" "}
                      <Tag color="green" className="ml-1">
                        {m.result.updated} updated
                      </Tag>
                      {m.result.skipped !== undefined && (
                        <Tag color="orange" className="ml-1">
                          {m.result.skipped} skipped
                        </Tag>
                      )}
                      {m.result.details && Object.entries(m.result.details).map(([k, v]) => (
                        <Tag key={k} color="blue" className="ml-1">
                          {k.replace(/_/g, " ")}: {v}
                        </Tag>
                      ))}
                    </span>
                  }
                />
              )}

              {m.error && (
                <Alert
                  type="error"
                  showIcon
                  message={m.error}
                />
              )}
            </div>
          </Card>
        ))}
      </div>
      </div>
    </>
  );
};

export default SystemMigrations;
