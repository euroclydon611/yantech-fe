import React, { useState, useEffect, useRef } from "react";
import styles from "../../../css/ReviewActionPanel.module.css"; // Ensure this path is correct
import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";
import { useParams } from "react-router-dom";

// --- Type Definitions ---
// It's good practice to have these types defined clearly.
type Status =
  | "pending"
  | "complete"
  | "incomplete"
  | "approved"
  | "rejected"
  | "correction_required";

interface SectionData {
  status: Status;
  comment: string | null;
}

interface ReviewActionPanelProps {
  sectionKey: string;
  reviewData: SectionData;
  evaluationData: SectionData;
  // onUpdate should be a promise to handle async API calls correctly
  onUpdate: (
    sectionKey: string,
    type: "review" | "evaluation",
    status: Status,
    comment: string
  ) => Promise<void>;
}

export const ReviewActionPanel: React.FC<ReviewActionPanelProps> = ({
  sectionKey,
  reviewData,
  evaluationData,
  onUpdate,
}) => {
  const { applicationId } = useParams<{ applicationId: string }>();

  // --- RTK Query Hooks ---

  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId }
  );

  const internalStatus = assignmentData?.data?.internalStatus;

  // console.log(internalStatus);

  const [reviewStatus, setReviewStatus] = useState<Status>(reviewData.status);
  const [reviewComment, setReviewComment] = useState<string>(
    reviewData.comment || ""
  );
  const [evaluationStatus, setEvaluationStatus] = useState<Status>(
    evaluationData.status
  );
  const [evaluationComment, setEvaluationComment] = useState<string>(
    evaluationData.comment || ""
  );

  type SaveState = "idle" | "saving" | "saved" | "error";
  const [reviewSaveState, setReviewSaveState] = useState<SaveState>("idle");
  const [evalSaveState, setEvalSaveState] = useState<SaveState>("idle");

  const isInitialMount = useRef(true);

  // Define the debounce delay for saving after user stops typing.
  const DEBOUNCE_DELAY_MS = 750;

  // --- Auto-Save Effect for the "Review (Completeness)" Section ---
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    const handler = setTimeout(async () => {
      setReviewSaveState("saving");
      try {
        // Await the API call from the parent component
        await onUpdate(sectionKey, "review", reviewStatus, reviewComment);
        setReviewSaveState("saved");
      } catch (err) {
        console.error(`Failed to save review for section: ${sectionKey}`, err);
        setReviewSaveState("error");
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(handler);
  }, [reviewStatus, reviewComment]);

  // --- Auto-Save Effect for the "Evaluation" Section ---
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    const handler = setTimeout(async () => {
      setEvalSaveState("saving");
      try {
        await onUpdate(
          sectionKey,
          "evaluation",
          evaluationStatus,
          evaluationComment
        );
        setEvalSaveState("saved");
      } catch (err) {
        console.error(
          `Failed to save evaluation for section: ${sectionKey}`,
          err
        );
        setEvalSaveState("error");
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(handler);
  }, [evaluationStatus, evaluationComment]);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // --- Helper Function to Render Visual Feedback ---
  const renderFeedback = (
    state: SaveState,
    setState: React.Dispatch<React.SetStateAction<SaveState>>
  ) => {
    useEffect(() => {
      if (state === "saved" || state === "error") {
        const timer = setTimeout(() => {
          setState("idle");
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [state, setState]);

    switch (state) {
      case "saving":
        return (
          <span className={`${styles.feedback} ${styles.saving}`}>
            Saving...
          </span>
        );
      case "saved":
        return (
          <span className={`${styles.feedback} ${styles.saved}`}>Saved ✓</span>
        );
      case "error":
        return (
          <span className={`${styles.feedback} ${styles.error}`}>
            Error! Retry.
          </span>
        );
      default:
        return null; // 'idle' state shows nothing.
    }
  };

  return (
    <div className={styles.actionPanel}>
      {/* Review Section */}
      <div
        className={styles.actionSection}
        // hidden={internalStatus !== "completeness_check_in_progress"}
      >
        <div className={styles.titleContainer}>
          <h4 className={styles.actionTitle}>Completeness check</h4>
          {renderFeedback(reviewSaveState, setReviewSaveState)}
        </div>
        <div className={styles.controls}>
          <select
            id={`${sectionKey}-review-status`}
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value as Status)}
            className={`${styles.select} ${
              reviewStatus == "complete"
                ? "!text-green-600 font-extrabold"
                : reviewStatus == "incomplete"
                ? "text-red-600 font-extrabold"
                : ""
            }`}
            disabled={internalStatus !== "completeness_check_in_progress"}
          >
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Add review comment..."
            className={`${styles.textarea} disabled:bg-white disabled:!text-gray-700`}
            disabled={internalStatus !== "completeness_check_in_progress"}
          />
        </div>
      </div>

      {/* Evaluation Section */}
      <div
        className={styles.actionSection}
        // hidden={internalStatus !== "evaluation_in_progress"}
      >
        <div className={styles.titleContainer}>
          <h4 className={styles.actionTitle}>Evaluation</h4>
          {renderFeedback(evalSaveState, setEvalSaveState)}
        </div>
        <div className={styles.controls}>
          <select
            id={`${sectionKey}-eval-status`}
            value={evaluationStatus}
            onChange={(e) => setEvaluationStatus(e.target.value as Status)}
            className={`${styles.select} ${
              evaluationStatus == "approved"
                ? "!text-green-600 font-extrabold"
                : evaluationStatus == "rejected"
                ? "text-red-600 font-extrabold"
                : ""
            }`}
            disabled={internalStatus !== "evaluation_in_progress"}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="correction_required">Correction Required</option>
          </select>
          <textarea
            value={evaluationComment}
            onChange={(e) => setEvaluationComment(e.target.value)}
            placeholder="Add evaluation comment..."
            className={`${styles.textarea} disabled:bg-white disabled:!text-gray-700`}
            disabled={internalStatus !== "evaluation_in_progress"}
          />
        </div>
      </div>
    </div>
  );
};
