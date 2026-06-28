import React, { useMemo } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import {
  Spin,
  Typography,
  Collapse,
} from "antd";
import { formatDate4 } from "@/utils/helperFunction";
import { Microscope } from "lucide-react";
import { getEfficacyStatusBadge } from "@/employee_portal_pages/lib/helpers";
import { Block, Detail } from "@/employee_portal_pages/components/review/helpers";
import { normalizeText } from "@/utils/helpers";

const { Panel } = Collapse;
const { Text } = Typography;

interface EfficacyTrialReviewProps {
  application: any;
  onApplicationUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => Promise<void>;
}

const GAPEntryCard = ({ entry, index }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-gray-900">Use Entry {index + 1}</h4>
      <span className="text-sm text-gray-500">Use No: {entry.useNo}</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      <Detail label="Crop:" value={entry.crop} />
      <Detail label="Product Type:" value={entry.productType} />
      <Detail label="Pest Controlled:" value={entry.pestControlled} />
      <Detail label="Application Method:" value={entry.applicationMethod} />
      <Detail label="Application Timing:" value={entry.applicationTiming} />
      <Detail label="Water Volume:" value={entry.waterVolume} />
    </div>

    <div className="bg-white rounded p-3 mb-4">
      <h5 className="font-medium text-gray-800 mb-2">Application Rates</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Detail label="Max Applications/Use:" value={entry.maxApplicationsPerUse} />
        <Detail label="Max Applications/Season:" value={entry.maxApplicationsPerSeason} />
        <Detail label="Max Rate/Application:" value={entry.maxRatePerApplication} />
        <Detail label="Max Total Rate/Season:" value={entry.maxTotalRatePerSeason} />
      </div>
    </div>

    <div className="bg-white rounded p-3 mb-4">
      <h5 className="font-medium text-gray-800 mb-2">Active Substance Rates</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Detail label="Rate/Application:" value={entry.activeSubstanceRatePerApplication} />
        <Detail label="Rate/Season:" value={entry.activeSubstanceRatePerSeason} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Detail label="PHI (Days):" value={entry.phi} />
      <Detail label="Remarks:" value={entry.remarks} />
    </div>
  </div>
);

export const EfficacyTrialReview: React.FC<EfficacyTrialReviewProps> = ({
  application,
  onApplicationUpdate,
}) => {
  const defaultReviewStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      applicationOverview: { status: "pending", comment: null },
      bf1Data: { status: "pending", comment: null },
      gapTable: { status: "pending", comment: null },
    }),
    []
  );

  const defaultEvaluationStructure = useMemo(
    () => ({
      applicantDetails: { status: "pending", comment: null },
      applicationOverview: { status: "pending", comment: null },
      bf1Data: { status: "pending", comment: null },
      gapTable: { status: "pending", comment: null },
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

  const { clientId, submittedByAgent, bf1Data, gapTable } = application;

  const handleUpdateSection = async (
    sectionKey: string,
    type: "review" | "evaluation",
    status: string,
    comment: string
  ) => {
    if (onApplicationUpdate) {
      await onApplicationUpdate(sectionKey, type, status, comment);
    }
  };

  if (!application) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
        <Text className="ml-3">Loading application details...</Text>
      </div>
    );
  }

  return (
    <div className={styles.reviewPage}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <Microscope className="text-white text-sm" />
        </div>
        <div>
          <Text className="text-sm text-gray-500 font-bold">
            {application.title || "Efficacy Trial Consent Application"} (Trial No: {application.code}):
          </Text>
        </div>
      </div>

      <div className="space-y-6">
        {application?.actionHistory?.length > 0 && (
          <div className="space-y-1 mt-4">
            <span className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
              Application History
            </span>
            <Collapse bordered={false} className="bg-slate-100 border border-gray-200 rounded">
              <Panel header="History Timeline" key="0">
                {application.actionHistory.map((noteItem: any, index: number) => (
                  <div key={index} className="rounded-md p-3 mb-2 bg-gray-50 border border-gray-200">
                    <span className="block text-sm text-gray-800 font-medium mb-1">
                      {noteItem.notes || "N/A"}
                    </span>
                    <span className="text-xs text-gray-600">
                      — {noteItem.user} on {formatDate4(noteItem.timestamp)}
                    </span>
                  </div>
                ))}
              </Panel>
            </Collapse>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Block 
            title="1. Applicant Information"
            sectionKey="applicantDetails"
            reviewData={review.applicantDetails}
            evaluationData={evaluation.applicantDetails}
            onUpdate={handleUpdateSection}
          >
            <div className="space-y-2">
              <Detail label="Client ID/Registration No:" value={clientId?.clientId} />
              <Detail label="Name:" value={
                clientId?.userType === "individual"
                  ? `${clientId?.firstName ?? ""} ${clientId?.lastName ?? ""}`.trim()
                  : clientId?.userType === "organization"
                  ? clientId?.organizationName
                  : clientId?.userType === "government"
                  ? clientId?.agencyName
                  : ""
              } />
              <Detail label="Contact Person:" value={`${clientId?.firstName} ${clientId?.lastName}`} />
              <Detail label="Email:" value={clientId?.email} />
              <Detail label="Telephone:" value={clientId?.phone} />
              <Detail label="Fax:" value={clientId?.fax} />
            </div>

            {submittedByAgent && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Agent Information</h4>
                <div className="space-y-2">
                  <Detail label="Name:" value={`${submittedByAgent?.firstName} ${submittedByAgent?.lastName}`} />
                  <Detail label="Email:" value={submittedByAgent?.email} />
                  <Detail label="Telephone:" value={submittedByAgent?.phone} />
                </div>
              </div>
            )}
          </Block>

          <Block 
            title="2. Application Overview"
            sectionKey="applicationOverview"
            reviewData={review.applicationOverview}
            evaluationData={evaluation.applicationOverview}
            onUpdate={handleUpdateSection}
          >
            <div className="space-y-2">
              <Detail label="Application Code:" value={application?.code || "N/A"} />
              <Detail label="Actual Permit No:" value={application?.permitNo} />
              <Detail label="Associated Permit Application No:" value={normalizeText(application?.applicationId?.code)} />
              <Detail label="Status">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium">
                  {getEfficacyStatusBadge(application?.status)}
                </span>
              </Detail>
              <Detail label="Date Submitted:" value={formatDate4(application?.createdAt) || "N/A"} />
            </div>
          </Block>

          {bf1Data && (
            <Block 
              title="3. Efficacy Trial (BF1) Information"
              sectionKey="bf1Data"
              reviewData={review.bf1Data}
              evaluationData={evaluation.bf1Data}
              onUpdate={handleUpdateSection}
            >
              <div className="space-y-2">
                <Detail label="Scientist/Institution Name:" value={bf1Data.scientistInstitutionName} />
                <Detail label="Address:" value={bf1Data.scientistAddress} />
                <Detail label="Tel/Email:" value={bf1Data.scientistTelEmail} />
                <Detail label="Trial Location:" value={bf1Data.trialLocation} />
                <Detail label="Trial Category:" value={bf1Data.trialCategory} />
                <Detail label="Crops:" value={bf1Data.crops?.join(", ")} />
                <Detail label="Pests:" value={bf1Data.pests?.join(", ")} />
              </div>
            </Block>
          )}
        </div>

        {gapTable && (
          <Block 
            title="4. GAP (Good Agricultural Practice) Table" 
            className="col-span-full"
            sectionKey="gapTable"
            reviewData={review.gapTable}
            evaluationData={evaluation.gapTable}
            onUpdate={handleUpdateSection}
          >
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Detail label="Product Name:" value={gapTable.productName} />
                  <Detail label="Formulation Type:" value={gapTable.formulationType} />
                  <Detail label="Product Type:" value={gapTable.productType} />
                </div>

                {gapTable.activeSubstances?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">Active Substances</h5>
                    <div className="space-y-3">
                      {gapTable.activeSubstances.map((sub: any, subIndex: number) => (
                        <div key={subIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50 rounded p-3">
                          <Detail label="Active Ingredient:" value={sub.activeIngredient} />
                          <Detail label="Concentration:" value={`${sub.concentrationValue} ${sub.concentrationUnit}`} />
                          <Detail label="CAS No:" value={sub.casNumber} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {gapTable.entries?.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">GAP Entries ({gapTable.entries.length})</h4>
                  <div className="space-y-4">
                    {gapTable.entries.map((entry: any, entryIndex: number) => (
                      <GAPEntryCard key={entryIndex} entry={entry} index={entryIndex} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Block>
        )}
      </div>
    </div>
  );
};
