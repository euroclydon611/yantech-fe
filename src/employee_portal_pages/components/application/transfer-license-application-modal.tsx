import React, { useState } from "react";
import { Modal, Button, Select, Input } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { normalizeText } from "@/utils/helperFunction";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import { useTransferApplicationMutation } from "@/redux/features/employee-portal-api/application/application";

const { Option } = Select;

interface TransferLicenseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  refreshData?: () => void;
}

const TransferLicenseApplicationModal: React.FC<
  TransferLicenseApplicationModalProps
> = ({ isOpen, onClose, application, refreshData }) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [transferReason, setTransferReason] = useState("");

  const { data: entityFullList, isLoading: isLoadingEntities } =
    useEntityFullListQuery({});

  const [transferApplication, { isLoading: isTransferring }] =
    useTransferApplicationMutation();

  const handleTransfer = async () => {
    // Get the target entity name for confirmation message
    const targetEntity = entityFullList?.data?.find(
      (item) => item.id === selectedEntity
    );

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Transfer",
      html: `
        <div style="text-align: left;">
          <p><strong>Application ID:</strong> ${application?.code || "N/A"}</p>
          <p><strong>Current Entity:</strong> ${
            application?.assigningEntity?.name || "Not Assigned"
          }</p>
          <p><strong>Transfer To:</strong> <span style="color: #ff6b35;">${
            targetEntity?.name || "N/A"
          }</span></p>
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

    // If user confirmed, proceed with transfer
    if (result.isConfirmed) {
      try {
        const payload = {
          id: application._id,
          targetEntityId: selectedEntity,
          reason: transferReason,
          applicationType: "license",
        };

        const response = await transferApplication({ payload }).unwrap();

        // Show success message
        await Swal.fire({
          title: "Transfer Successful",
          text:
            response.message ||
            "The license application has been transferred successfully.",
          icon: "success",
          confirmButtonColor: "#2E7D32",
        });

        // Close modal on success
        refreshData();
        handleClose();
      } catch (error) {
        // Show error message
        await Swal.fire({
          title: "Transfer Failed",
          text:
            error?.data?.message ||
            error?.data?.error ||
            "An error occurred while transferring the application.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleClose = () => {
    // Reset form
    setSelectedEntity(null);
    setTransferReason("");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <SwapRightOutlined className="text-orange-600" />
          <span>Transfer License Application</span>
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
                <p className="text-sm text-gray-600">License Type</p>
                <p className="font-semibold text-gray-800">
                  {normalizeText(application?.licenseType) || "N/A"}
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
            placeholder="Provide a reason for transferring this license application..."
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
            the license application, invoice, assignment plan, and all associated
            workflows to the selected entity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <Button onClick={handleClose} disabled={isTransferring}>Cancel</Button>
          <Button
            type="primary"
            disabled={!selectedEntity || !transferReason || isTransferring}
            loading={isTransferring}
            onClick={handleTransfer}
            className="bg-green-600 hover:!bg-green-700"
          >
            Transfer License Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferLicenseApplicationModal;