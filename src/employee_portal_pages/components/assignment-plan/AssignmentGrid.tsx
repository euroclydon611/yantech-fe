import React, { useState } from "react";
import { Card, Tooltip, Dropdown, Button, Drawer, Tag, type MenuProps } from "antd";

import { MoreOutlined, HistoryOutlined, RobotOutlined, ApartmentOutlined } from "@ant-design/icons";
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

interface AssignmentGridProps {
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

export const AssignmentGrid: React.FC<AssignmentGridProps> = ({
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {assignments.map((assignment: Assignment) => {
        const lastCompletedStep = assignment.history?.length
          ? assignment.history[assignment.history.length - 1]
          : null;

        return (
          <Card
            key={assignment._id}
            className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white"
            styles={{ body: { padding: 0 } }}
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110
                    ${assignment.applicationDetails?.authorizationType ? 'bg-indigo-100 text-indigo-700' : 
                      assignment.applicationDetails?.licenseType ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-amber-100 text-amber-700'}`}>
                    {assignment.applicationDetails?.authorizationType ? "AUTH" : 
                     assignment.applicationDetails?.licenseType ? "LIC" : 
                     assignment.applicationDetails.permitType?.substring(0, 3)?.toUpperCase() || "APP"}
                  </div>
                  <div>
                    <Tooltip title={assignment.applicationDetails.title}>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                        {assignment.applicationDetails.title}
                      </h3>
                    </Tooltip>
                    <div className="mb-2">
                      <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-tight line-clamp-1">
                        {resolveApplicantName(assignment.applicationDetails.clientDetails)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{assignment.applicationDetails.code}</span>
                      <ProcessingTypeTag processingType={assignment.applicationDetails?.processingType} compact={true} minimal={true} />
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatDate(assignment.applicationDetails.createdAt)}
                      </span>
                      {(assignment as any).assignmentMode === "group" && (assignment as any).groupHeadId && assignment.internalStatus.startsWith("pending_") && (
                        <Tag icon={<ApartmentOutlined />} color="purple" className="text-[9px] !py-0 !px-1 !m-0">
                          {(assignment as any).subDivisionDetails?.name ? `Group: ${(assignment as any).subDivisionDetails.name}` : "Delegated to Group"}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
                
                <Dropdown menu={getActionMenu(assignment)} trigger={["click"]}>
                  <Button
                    icon={<MoreOutlined className="text-gray-400 group-hover:text-gray-600" />}
                    size="small"
                    type="text"
                    className="rounded-full hover:!bg-gray-100"
                  />
                </Dropdown>
              </div>

              <div className="flex flex-col gap-2 py-3 border-t border-b border-gray-50 mb-4">
                <div className="flex items-center justify-between">
                  <StatusDisplay assignment={assignment} getStageInfo={getStageInfo} />
                  {assignment.internalStatus.endsWith("_in_progress") && 
                   assignment?.workflowSteps?.at(-1)?.deadline && (
                    <DeadlineDisplay 
                      deadline={assignment?.workflowSteps.at(-1)?.deadline || ""} 
                      deadlineTime={assignment.workflowSteps.at(-1)?.deadlineTime} 
                    />
                  )}
                </div>
                <ActiveBlockersBadge activeBlockers={assignment.activeBlockers} />
                <DelegationBadge delegations={(assignment as any).delegations} assignmentId={assignment._id} />
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
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
                    />
                  </div>
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
                </div>
              </div>

              {lastCompletedStep && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <HistoryOutlined className="text-[10px]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Timeline</span>
                    </div>
                    <HistoryButton assignment={assignment} />
                  </div>
                  <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/50">
                    <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                      {lastCompletedStep.action} <span className="text-gray-400 font-normal">by</span> {lastCompletedStep.user}
                    </p>
                    {lastCompletedStep.notes && (
                      <div className="mt-1 flex gap-1 items-start">
                        <span className="text-[10px] text-blue-500 font-bold mt-0.5">Note:</span>
                        <p className="text-[10px] text-gray-500 line-clamp-1 italic">
                          "{lastCompletedStep.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
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
