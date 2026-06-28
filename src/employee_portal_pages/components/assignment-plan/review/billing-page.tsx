import React, { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  Button,
  Select,
  Input,
  InputNumber,
  message,
  Divider,
  Empty,
  Tag,
} from "antd";
import {
  CalculatorOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  useServiceCodesFullListQuery,
  useServiceChargesFullListQuery,
} from "@/redux/features/employee-portal-api/general";

import { RiDeleteBin6Fill } from "react-icons/ri";

const SERVICE_CHARGE_CODE =
  import.meta.env.VITE_EPA_SERVICE_CHARGE_SERVICE_CODE || "EPA-REG-010";

// Using a simple number for the React key, as it's easier to manage internally.
export interface LineItem {
  id: number;
  service_code?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  isSystemGenerated?: boolean;
}

interface PredefinedItem {
  id: string;
  description: string;
  defaultPrice: number;
  category: string;
  feeCode: string;
}

// The props for our new self-contained Drawer component
interface InvoicePreparationPanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invoiceData: any) => Promise<void>; // Expects a promise for async handling
  applicationData: any;
  task?: any;
  predefinedFees?: PredefinedItem[];

  // Props for lifted state
  lineItems: LineItem[];
  onLineItemsChange: React.Dispatch<React.SetStateAction<LineItem[]>>;
}

// --- THE COMPONENT ---

const InvoicePreparationPanel: React.FC<InvoicePreparationPanelProps> = ({
  open,
  onClose,
  onSubmit,
  applicationData,
  task,
  predefinedFees = [],
  lineItems,
  onLineItemsChange,
}) => {
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPredefinedItem, setSelectedPredefinedItem] = useState<
    string | undefined
  >(undefined);

  // --- SERVICE CODES QUERY ---
  const { data: serviceCodes } = useServiceCodesFullListQuery({});
  const { data: serviceChargesData } = useServiceChargesFullListQuery({});

  const serviceCharges = serviceChargesData?.data || [];

  // --- DERIVED VALUES & MEMOIZATION ---
  const { subtotal, totalAmount, digitalCharge } = useMemo(() => {
    const currentSubtotal = lineItems?.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    const charge = serviceCharges.find((sc: any) => {
      if (sc.max_amount === null) {
        return currentSubtotal >= sc.min_amount;
      }
      return (
        currentSubtotal >= sc.min_amount && currentSubtotal <= sc.max_amount
      );
    });

    const scAmount = charge ? charge.charge : 0;

    return {
      subtotal: currentSubtotal,
      digitalCharge: scAmount,
      totalAmount: currentSubtotal + scAmount,
    };
  }, [lineItems, serviceCharges]);

  const groupedDropdownOptions = useMemo(() => {
    const grouped = predefinedFees.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, PredefinedItem[]>);

    return Object.entries(grouped).map(([category, items]) => ({
      label: <span className="font-semibold">{category}</span>,
      options: items.map((item) => ({
        label: `${item.description} - GH₵ ${item.defaultPrice.toFixed(2)}`,
        value: item.id,
      })),
    }));
  }, [predefinedFees]);

  // --- HANDLER FUNCTIONS ---
  // All handlers now use `onLineItemsChange` instead of a local `setLineItems`
  const updateLineItem = (id: number, field: keyof LineItem, value: any) => {
    onLineItemsChange((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        let safeValue = value;
        // If it's a numeric field and the value is falsy (like null or undefined), default to 0
        if (
          (field === "unitPrice" || field === "quantity") &&
          (value === null || value === undefined)
        ) {
          safeValue = 0;
        }

        return { ...item, [field]: safeValue };
      })
    );
  };

  const addPredefinedItem = (selectedId: string) => {
    const itemToAdd = predefinedFees.find((p) => p.id === selectedId);
    if (!itemToAdd) return;
    onLineItemsChange((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: itemToAdd.description,
        quantity: 1,
        unitPrice: itemToAdd.defaultPrice,
      },
    ]);
    setSelectedPredefinedItem(undefined); // Reset dropdown after selection
  };

  const addCustomItem = () => {
    onLineItemsChange((prev) => [
      ...prev,
      {
        id: Date.now(),
        service_code: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleServiceCodeChange = (itemId: number, serviceCode: string) => {
    const selectedService = serviceCodes?.data?.find(
      (service: any) => service.service_code === serviceCode
    );
    if (selectedService) {
      onLineItemsChange((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                service_code: selectedService.service_code,
                description: selectedService.name,
              }
            : item
        )
      );
    }
  };

  const removeLineItem = (id: number) => {
    onLineItemsChange((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit invoice
  const handleSubmit = () => {
    if (lineItems.length === 0) {
      message.error("Please add at least one line item.");
      return;
    }

    const hasEmptyServiceCodes = lineItems.some(
      (item) => !item.service_code || !item.service_code.trim()
    );
    if (hasEmptyServiceCodes) {
      message.error("Please select a service code for all line items.");
      return;
    }

    const hasEmptyDescriptions = lineItems.some(
      (item) => !item.description.trim()
    );
    if (hasEmptyDescriptions) {
      message.error("Please provide descriptions for all line items.");
      return;
    }

    if (subtotal <= 0) {
      message.error("Total amount must be greater than zero.");
      return;
    }

    const payload = {
      lineItems: lineItems.map((item) => ({
        id: item.id,
        service_code: item.service_code,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: (item.quantity * item.unitPrice).toFixed(2),
      })),
      subtotal,
      taxAmount: 0, // Can be added if needed
      totalAmount: subtotal,
      invoiceDate: new Date().toISOString(),
      applicationId: applicationData?.id,
    };

    onSubmit(payload);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <CalculatorOutlined className="text-xl text-slate-500" />
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">
              {task?.proposedInvoice ? "Edit Invoice" : "Prepare Invoice"}
            </h2>
            <p className="text-xs text-slate-600 m-0">
              For Application: {applicationData?.code || "N/A"}
            </p>
          </div>
        </div>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={960}
      footer={
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">
            Total Amount:{" "}
            <strong className="text-slate-800">
              GH₵{" "}
              {totalAmount?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </strong>
          </span>
          <div className="flex gap-2">
            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={lineItems?.length === 0}
              className="!bg-green-700 hover:!bg-green-800"
            >
              {task?.proposedInvoice ? "Update Invoice" : "Submit Invoice"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full flex flex-col bg-slate-50 -m-6 p-6">
        {/* Top Controls */}
        <div
          className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
          hidden
        >
          <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Add from Standard Fees
            </label>
            <Select
              placeholder="Select and add a fee..."
              value={selectedPredefinedItem}
              onChange={addPredefinedItem}
              options={groupedDropdownOptions}
              className="w-full"
              showSearch
              suffixIcon={<DownOutlined />}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 flex flex-col justify-center">
            <label className="text-sm font-semibold text-slate-700">
              Add a Custom Item
            </label>
            <Button
              type="primary"
              onClick={addCustomItem}
              icon={<PlusOutlined />}
              className="bg-teal-700 hover:!bg-teal-800"
            >
              Add Custom Line Item
            </Button>
          </div>
        </div>

        {/* Line Items List (Scrollable) */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">
              Invoice Line Items ({lineItems?.length})
            </h3>
            <Button
              type="primary"
              size="small"
              onClick={addCustomItem}
              icon={<PlusOutlined />}
              className="bg-teal-700 hover:!bg-teal-800"
            >
              Add Item
            </Button>
          </div>
          {lineItems?.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-12 gap-x-4 gap-y-2 px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-600 sticky top-0 z-10">
                <div className="col-span-12 md:col-span-4">Service Code</div>
                <div className="col-span-12 md:col-span-4">Description</div>
                {/* <div className="col-span-4 md:col-span-2 text-right">
                  Quantity
                </div> */}
                <div className="col-span-4 md:col-span-3">Amount</div>
                {/* <div className="col-span-4 md:col-span-2 text-right">Total</div> */}
              </div>
              <div className="p-3 space-y-3">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-x-4 gap-y-2 items-start border-b border-slate-100 pb-3"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <Select
                        placeholder="Select Service Code"
                        value={item.service_code || undefined}
                        onChange={(value) =>
                          handleServiceCodeChange(item.id, value)
                        }
                        disabled={item.isSystemGenerated}
                        optionLabelProp="label"
                        className="w-full"
                        popupMatchSelectWidth={false}
                        options={
                          serviceCodes?.data?.map((service: any) => ({
                            label: service.name,
                            value: service.service_code,
                            code: service.service_code,
                          })) || []
                        }
                        showSearch
                        filterOption={(input, option) =>
                          `${option?.code} ${option?.label}`
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <Input.TextArea
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        disabled={item.isSystemGenerated}
                        placeholder="Item description"
                        autoSize={{ minRows: 1, maxRows: 3 }}
                      />
                    </div>
                    {/* <div className="col-span-4 md:col-span-2">
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(val) =>
                          updateLineItem(item.id, "quantity", val)
                        }
                        className="w-full text-right"
                      />
                    </div> */}
                    <div className="col-span-4 md:col-span-3">
                      <InputNumber
                        min={0}
                        value={item.unitPrice}
                        onChange={(val) =>
                          updateLineItem(item.id, "unitPrice", val)
                        }
                        disabled={item.isSystemGenerated}
                        className="w-full"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(v: any) => v!.replace(/\$\s?|(,*)/g, "")}
                      />
                    </div>
                    {/* <div className="col-span-4 md:col-span-2 flex items-center justify-end h-full">
                      <span className="font-semibold text-slate-700">
                        {(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div> */}
                    <div className="col-span-12 md:col-span-1 flex justify-end items-center">
                      {!item.isSystemGenerated ? (
                        <Button
                          size="large"
                          type="text"
                          danger
                          icon={
                            <RiDeleteBin6Fill className="!text-red-600 !text-xl" />
                          }
                          onClick={() => removeLineItem(item.id)}
                        />
                      ) : (
                        <Tag color="blue" className="m-0">
                          Fixed
                        </Tag>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* --- NEW: FIXED SUMMARY SECTION --- */}
              <div className="flex-shrink-0">
                <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-sm ml-auto w-full">
                  <h3 className="font-bold text-slate-800 mb-3">
                    Financial Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-medium text-slate-800">
                        GH₵{" "}
                        {subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 italic">
                        Digital Charge (Auto):
                      </span>
                      <span className="font-medium text-blue-600">
                        GH₵{" "}
                        {digitalCharge.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    {/* You can add more rows here for Taxes, Discounts, etc. */}
                    <Divider className="my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-slate-900">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        GH₵{" "}
                        {totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <Empty
                description={
                  <>
                    <p className="text-slate-500">No line items yet.</p>
                    <p className="text-xs text-slate-400">
                      Use the controls above to add items to the invoice.
                    </p>
                  </>
                }
              />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default InvoicePreparationPanel;
