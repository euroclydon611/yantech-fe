import React, { useState } from "react";
import styles from "@/employee_portal_pages/css/NotificationReview.module.css";
import { ReviewActionPanel } from "../assignment-plan/review/review-action-panel";
import { MessageSquareMore, ChevronRight, ChevronDown } from "lucide-react";

type Status =
  | "pending"
  | "complete"
  | "incomplete"
  | "approved"
  | "rejected"
  | "correction_required";
interface SectionStatus {
  status: Status;
  comment: string;
}

// --- Helper Components ---
export const Block: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  sectionKey?: string;
  reviewData?: SectionStatus;
  evaluationData?: SectionStatus;
  onUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: Status,
    comment: string
  ) => Promise<void>;
}> = ({
  title,
  children,
  className,
  sectionKey,
  reviewData,
  evaluationData,
  onUpdate,
}) => {
  const [showReview, setShowReview] = useState(false);
  const hasReviewPanel = sectionKey && reviewData && evaluationData && onUpdate;

  return (
    <div className={`${styles.block} ${className || ""}`}>
      <div className={styles.dataSection}>
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#f0f0f0] pb-2">
          <h3
            className={styles.blockTitle}
            style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}
          >
            {title}
          </h3>
          {hasReviewPanel && (
            <button
              onClick={() => setShowReview(!showReview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold shadow-sm border border-blue-100"
              title={showReview ? "Hide Review Panel" : "Show Review Panel"}
            >
              <MessageSquareMore size={14} />
              <span>{showReview ? "Hide Review" : "Show Review"}</span>
              {showReview ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}
        </div>
        <div className={styles.blockContent}>{children}</div>
      </div>
      {hasReviewPanel && showReview && (
        <ReviewActionPanel
          sectionKey={sectionKey}
          reviewData={reviewData}
          evaluationData={evaluationData}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export const Detail: React.FC<{
  label: string;
  value?: string | number | null | any;
  children?: React.ReactNode;
  className?: string;
}> = ({ label, value, children, className }) => {
  return (
    <div className={styles.detail}>
      <span className={styles.label}>{label}</span>
      <div
        className={`${styles.value}  ${styles.preserveWhitespace} ${
          className || ""
        }`}
      >
        {value || children || "N/A"}
      </div>
    </div>
  );
};

export const CheckboxDetail: React.FC<{
  label: string;
  value: boolean | undefined;
}> = ({ label, value }) => (
  <div className={styles.checkboxGroup}>
    <span>{label}:</span>
    <div className="flex gap-8">
      <div>
        e
        <input type="checkbox" checked={value === true} readOnly /> Yes
      </div>
      <div>
        <input type="checkbox" checked={value === false} readOnly /> No
      </div>
    </div>
  </div>
);




export const BlockOld: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  sectionKey?: string;
  reviewData?: SectionStatus;
  evaluationData?: SectionStatus;
  onUpdate?: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: Status,
    comment: string
  ) => Promise<void>;
}> = ({
  title,
  children,
  className,
  sectionKey,
  reviewData,
  evaluationData,
  onUpdate,
}) => (
  <div className={`${styles.block} ${className || ""}`}>
    <div className={styles.dataSection}>
      <h3 className={styles.blockTitle}>{title}</h3>
      <div className={styles.blockContent}>{children}</div>
    </div>
    {sectionKey && reviewData && evaluationData && onUpdate && (
      <ReviewActionPanel
        sectionKey={sectionKey}
        reviewData={reviewData}
        evaluationData={evaluationData}
        onUpdate={onUpdate}
      />
    )}
  </div>
);