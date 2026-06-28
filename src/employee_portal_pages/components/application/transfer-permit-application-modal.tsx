import React, { useState } from "react";
import { Modal, Button, Select, Input } from "antd";
import { SwapRightOutlined, WarningOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { normalizeText } from "@/utils/helperFunction";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useTransferApplicationMutation } from "@/redux/features/employee-portal-api/application/application";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const { Option } = Select;

const ACTIVE_STATUSES = [
  "under_review",
  "corrections_required",
  "reports_required",
  "permit_fee_pending_payment",
  "awaiting_issuance",
];

interface TransferPermitApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  refreshData?: () => void;
}

const TransferPermitApplicationModal: React.FC<
  TransferPermitApplicationModalProps
> = ({ isOpen, onClose, application, refreshData }) => {
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const isCEOOffice =
    employee?.entity?.designation?.toLowerCase() === "ceo office" ||
    employee?.entity?.name?.toLowerCase() === "ceo office";

  const isActiveAssignment = ACTIVE_STATUSES.includes(application?.status);
  const showRecallWarning = isCEOOffice && isActiveAssignment;

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [transferReason, setTransferReason] = useState("");
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);

  const { data: entityFullList, isLoading: isLoadingEntities } =
    useEntityFullListQuery({});

  const [transferApplication, { isLoading: isTransferring }] =
    useTransferApplicationMutation();

  const executeTransfer = async (targetEntity: any) => {
    const result = await Swal.fire({
      title: "Confirm Transfer",
      html: `
        <div style="text-align: left;">
          <p><strong>Application ID:</strong> ${application?.code || "N/A"}</p>
          <p><strong>Current Entity:</strong> ${application?.assigningEntity?.name || "Not Assigned"}</p>
          <p><strong>Transfer To:</strong> <span style="color: #ff6b35;">${targetEntity?.name || "N/A"}</span></p>
          <p><strong>Reason:</strong> ${transferReason}</p>
          <p style="margin-top: 15px; color: #ff8c42; font-weight: bold;">
            Are you sure you want to proceed with this transfer?
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Transfer",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          id: application._id,
          targetEntityId: selectedEntity,
          reason: transferReason,
          applicationType: "permit",
        };

        const response = await transferApplication({ payload }).unwrap();

        await Swal.fire({
          title: "Transfer Successful",
          text: response.message || "The permit application has been transferred successfully.",
          icon: "success",
          confirmButtonColor: "#2E7D32",
        });

        refreshData();
        handleClose();
      } catch (error) {
        await Swal.fire({
          title: "Transfer Failed",
          text: error?.data?.message || error?.data?.error || "An error occurred while transferring the application.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleTransfer = async () => {
    const targetEntity = entityFullList?.data?.find((item) => item.id === selectedEntity);

    if (showRecallWarning && !warningAcknowledged) {
      const warnResult = await Swal.fire({
        title: "Active Assignment Will Be Recalled",
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6;">
            <p style="margin-bottom: 12px;">
              This application is currently <strong>being actively processed</strong> by an officer
              at <strong>${application?.assigningEntity?.name || "the current entity"}</strong>.
            </p>
            <p style="margin-bottom: 12px; color: #b45309; font-weight: 600;">
              Transferring it now will:
            </p>
            <ul style="margin-left: 16px; margin-bottom: 12px; color: #92400e;">
              <li>Recall the officer's active in-progress assignment step</li>
              <li>Move the application to <strong>${targetEntity?.name || "the target entity"}</strong></li>
              <li>Queue it for fresh assignment by the new entity's head</li>
              <li>Any unsaved work by the current officer will be lost</li>
            </ul>
            <p style="color: #6b7280; font-size: 13px;">
              This action is logged and attributed to the CEO Office.
            </p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b45309",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "I understand, proceed",
        cancelButtonText: "Go back",
      });

      if (!warnResult.isConfirmed) return;
    }

    await executeTransfer(targetEntity);
  };

  const handleClose = () => {
    setSelectedEntity(null);
    setTransferReason("");
    setWarningAcknowledged(false);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <SwapRightOutlined className="text-orange-600" />
          <span>Transfer Permit Application</span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      width={700}
      centered
      footer={null}
      className="transfer-modal"
    >
      <div className="space-y-6">
        {/* Application Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Application ID</p>
                <p className="font-semibold text-gray-800">
                  {application?.code || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Permit Type</p>
                <p className="font-semibold text-gray-800">
                  {normalizeText(application?.permitType) || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Application Title</p>
              <p className="font-semibold text-gray-800 truncate">
                {application?.title || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Current Status Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Current Assignment</h3>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Current Entity</p>
            <p className="font-medium text-gray-800">
              {application?.assigningEntity?.name || "Not Assigned"}
            </p>
          </div>
        </div>

        {/* Transfer To Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Transfer To</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Select Entity <span className="text-red-500">*</span>
            </label>
            <Select
              showSearch
              placeholder="Choose entity (Unit, Division, Department, etc.)..."
              className="w-full"
              value={selectedEntity}
              onChange={setSelectedEntity}
              loading={isLoadingEntities}
              filterOption={(input, option: any) =>
                (option?.children?.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              allowClear
            >
              {entityFullList?.data?.map((item) => (
                <Option key={item.id} value={item.id} className="!font-medium">
                  {`${item?.name}`}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Reason Section */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Reason for Transfer <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            placeholder="Provide a reason for transferring this permit application..."
            rows={4}
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            className="resize-none"
          />
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note:</span> This transfer will move
            the permit application, invoice, assignment plan, and all associated
            workflows to the selected entity.
          </p>
        </div>

        {/* CEO recall warning banner — shown only when relevant */}
        {showRecallWarning && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <WarningOutlined className="text-red-600 mt-0.5 flex-shrink-0 text-base" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Active Assignment Will Be Recalled
                </p>
                <p className="text-xs text-red-700 mb-3">
                  This application is currently <strong>being actively processed</strong> at{" "}
                  <strong>{application?.assigningEntity?.name || "the current entity"}</strong>.
                  Transferring it will recall the officer's in-progress step and queue it for
                  fresh assignment at the new entity. Any unsaved work by the current officer
                  will be lost. This action is logged and attributed to the CEO Office.
                </p>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={warningAcknowledged}
                    onChange={(e) => setWarningAcknowledged(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-red-800">
                    I understand and accept the consequences of this transfer
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <Button onClick={handleClose} disabled={isTransferring}>Cancel</Button>
          <Button
            type="primary"
            disabled={
              !selectedEntity ||
              !transferReason ||
              isTransferring ||
              (showRecallWarning && !warningAcknowledged)
            }
            loading={isTransferring}
            onClick={handleTransfer}
            className="bg-green-600 hover:!bg-green-700"
          >
            Transfer Permit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferPermitApplicationModal;
