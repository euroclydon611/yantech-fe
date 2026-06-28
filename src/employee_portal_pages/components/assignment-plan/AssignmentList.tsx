import React, { useState } from "react";

import { Dropdown, Button, Drawer, Tooltip, Tag, type MenuProps } from "antd";
import { MoreOutlined, RobotOutlined, ApartmentOutlined } from "@ant-design/icons";
import { Assignment, HistoryItem } from "@/employee_portal_pages/types/assignments";
import { formatDate } from "@/utils/helpers";
import {
  StatusDisplay,
  DeadlineDisplay,
  ActionButtons,
  HistoryButton,
  ProcessingTypeTag,
  ActiveBlockersBadge,
  DelegationBadge,
} from "./assignment-items";
import AssignmentAIGuide from "./AssignmentAIGuide";

interface AssignmentListProps {
  assignments: Assignment[];
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  statusFilter: string;
  openAssignModal: (assignment: Assignment) => void;
  openReviewModal: (assignment: Assignment) => void;
  setSelectedApplication: (assignment: Assignment) => void;
  setViewModalOpen: (open: boolean) => void;
  getActionMenu: (assignment: Assignment) => MenuProps;
  getStageInfo: (status: string) => {
    text: string;
    color: string;
    icon: React.ReactNode;
  };
  resolveApplicantName: (clientDetails: any) => string;
  onHodFinalApproval?: (assignment: Assignment) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  selectedIds,
  setSelectedIds,
  statusFilter,
  openAssignModal,
  openReviewModal,
  setSelectedApplication,
  setViewModalOpen,
  getActionMenu,
  getStageInfo,
  resolveApplicantName,
  onHodFinalApproval,
}) => {
  const [aiDrawerAssignment, setAiDrawerAssignment] = useState<Assignment | null>(null);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-left border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Application Details</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline/Deadline</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {assignments.map((assignment: Assignment, index: number) => {
            const lastCompletedStep = assignment.history?.length
              ? assignment.history[assignment.history.length - 1]
              : null;

            return (
              <tr
                key={assignment._id}
                className="hover:!bg-blue-50/30 transition-colors group"
              >
                <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-xs
                      ${assignment.applicationDetails?.authorizationType ? 'bg-indigo-50 text-indigo-600' : 
                        assignment.applicationDetails?.licenseType ? 'bg-emerald-50 text-emerald-600' : 
                        'bg-amber-50 text-amber-600'}`}>
                      {assignment.applicationDetails?.authorizationType ? "A" : 
                       assignment.applicationDetails?.licenseType ? "L" : "P"}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">{assignment.applicationDetails.title}</h4>
                      <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">
                        {resolveApplicantName(assignment.applicationDetails.clientDetails)}
                      </p>
                      <div className="flex gap-2 items-center flex-wrap mt-1">
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1 rounded uppercase tracking-tighter">{assignment.applicationDetails.code}</span>
                        <ProcessingTypeTag processingType={assignment.applicationDetails?.processingType} minimal={true} />
                        <span className="text-[10px] text-gray-400">{formatDate(assignment.applicationDetails.createdAt)}</span>
                        {(assignment as any).assignmentMode === "group" && (assignment as any).groupHeadId && assignment.internalStatus.startsWith("pending_") && (
                          <Tag icon={<ApartmentOutlined />} color="purple" className="text-[9px] !py-0 !px-1 !m-0">
                            {(assignment as any).subDivisionDetails?.name ? `Group: ${(assignment as any).subDivisionDetails.name}` : "Delegated to Group"}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <StatusDisplay assignment={assignment} getStageInfo={getStageInfo} minimal />
                    <ActiveBlockersBadge activeBlockers={assignment.activeBlockers} compact />
                    <DelegationBadge delegations={(assignment as any).delegations} assignmentId={assignment._id} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    {assignment.internalStatus.endsWith("_in_progress") && 
                     assignment?.workflowSteps?.at(-1)?.deadline ? (
                      <DeadlineDisplay 
                        deadline={assignment?.workflowSteps.at(-1)?.deadline || ""} 
                        deadlineTime={assignment.workflowSteps.at(-1)?.deadlineTime} 
                      />
                    ) : (
                      <span className="text-xs text-gray-400 italic">No active deadline</span>
                    )}

                    {lastCompletedStep && (
                      <div className="mt-1 pt-1 border-t border-gray-100/50">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Timeline</span>
                          <HistoryButton assignment={assignment} />
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1 italic">
                          {lastCompletedStep.action} <span className="text-gray-400 not-italic">by</span> {lastCompletedStep.user}
                        </p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <ActionButtons
                      assignment={assignment}
                      selectedIds={selectedIds}
                      setSelectedIds={setSelectedIds}
                      statusFilter={statusFilter}
                      openAssignModal={openAssignModal}
                      openReviewModal={openReviewModal}
                      setSelectedApplication={setSelectedApplication}
                      setViewModalOpen={setViewModalOpen}
                      getActionMenu={getActionMenu}
                      onHodFinalApproval={onHodFinalApproval}
                      minimal={true}
                    />
                    <Tooltip title="Ask ARIA — your AI processing assistant">
                      <div className="relative flex-shrink-0">
                        <Button
                          size="small"
                          icon={<RobotOutlined />}
                          onClick={() => setAiDrawerAssignment(assignment)}
                          className="relative border-[#0D4A2A] text-[#0D4A2A] hover:!bg-[#0D4A2A] hover:!text-white transition-colors"
                        />
                      </div>
                    </Tooltip>
                    <Dropdown menu={getActionMenu(assignment)} trigger={["click"]}>
                      <Button icon={<MoreOutlined />} size="small" type="text" className="rounded-lg hover:bg-gray-100" />
                    </Dropdown>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <Drawer
      open={!!aiDrawerAssignment}
      onClose={() => setAiDrawerAssignment(null)}
      width={420}
      title={null}
      maskClosable={false}
      styles={{
        header: { display: "none" },
        body: { padding: 0, background: "#f9fafb" },
      }}
      destroyOnClose
    >
      {aiDrawerAssignment && (
        <div className="h-full flex flex-col">
          <div className="bg-[#0D4A2A] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <RobotOutlined className="text-white text-base" />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">ARIA</p>
                <p className="text-green-300/70 text-[9px] leading-tight font-normal">Application Review &amp; Insight Assistant</p>
                <p className="text-green-300 text-[10px] leading-tight mt-0.5">
                  {aiDrawerAssignment.applicationDetails?.code}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiDrawerAssignment(null)}
              className="text-white/60 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <AssignmentAIGuide
              assignmentId={aiDrawerAssignment._id}
              applicationCode={aiDrawerAssignment.applicationDetails?.code}
              hideHeader
            />
          </div>
        </div>
      )}
    </Drawer>
    </>
  );
};
