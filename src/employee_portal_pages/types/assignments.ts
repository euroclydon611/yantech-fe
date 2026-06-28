export interface ApplicationDetails {
  processingType: string;
  _id: string;
  title: string;
  code: string;
  authorizationType?: string;
  licenseType?: string;
  permitType?: string;
  createdAt: string;
  clientDetails?: any;
}

export interface HistoryItem {
  action: string;
  user: string;
  notes?: string;
  date?: string;
}

export interface WorkflowStep {
  stepName: string;
  status: string;
  assignedTo?: string;
  deadline?: string;
  deadlineTime?: string;
}

export type BlockerType =
  | "awaiting_processing_fee_payment"
  | "awaiting_permit_fee_payment"
  | "corrections_required"
  | "reports_required";

export interface ActiveBlocker {
  _id: string;
  type: BlockerType;
  stage: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
  notes?: string;
  invoiceId?: string;
  dueDate?: string;
  reportTypes?: string[];
}

export interface AssignmentDelegation {
  _id: string;
  taskType: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  toEntityName?: string;
  requestedAt: string;
  completedAt?: string;
  result?: string;
}

export interface Assignment {
  _id: string;
  application: string;
  applicationType: string;
  applicationDetails: ApplicationDetails;
  internalStatus: string;
  history: HistoryItem[];
  workflowSteps: WorkflowStep[];
  updatedAt: string;
  activeBlockers?: ActiveBlocker[];
  delegations?: AssignmentDelegation[];
}

export interface Officer {
  _id: string;
  staff_id: string;
  firstname: string;
  lastname: string;
  other_names?: string;
  status?: string;
  is_active?: boolean;
}
