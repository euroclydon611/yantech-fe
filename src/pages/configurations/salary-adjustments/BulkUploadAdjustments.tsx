import { Drawer, Button, Table, Alert } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineDownload, AiOutlineFilePdf } from "react-icons/ai";
import { useBulkStorePayrollAdjustmentsMutation } from "../../../redux/features/reports/payrollAdjustmentApi";
import { styles } from "../../../styles";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";


interface BulkUploadAdjustmentsProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const BulkUploadAdjustments = ({ open, onClose, refetch }: BulkUploadAdjustmentsProps) => {
  const guidePdfPath = "/Payroll_PEN_TAX_Business_Rules.pdf";
  const [file, setFile] = useState<File | null>(null);
  const [failedRows, setFailedRows] = useState<any[]>([]);
  const [bulkLoad, { isLoading, isSuccess, error, data }] = useBulkStorePayrollAdjustmentsMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Please select a file first", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Upload",
      text: "Are you sure you want to process this bulk adjustment file?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, start processing",
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("doc", file);

      try {
        await bulkLoad(formData).unwrap();
        setFile(null); // Reset file after successful trigger
        const fileInput = document.getElementById('bulk-upload-input') as HTMLInputElement;
        if (fileInput) fileInput.value = ""; // Clear input field
      } catch (err) {
        // Error handled by useEffect
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setFile(null);
      setFailedRows([]);
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        title: "Process Completed",
        text: data.message || `Processed ${data.totalRows} rows. ${data.inserted} successful, ${data.canceled} failed.`,
        icon: data.canceled > 0 ? "warning" : "success",
        confirmButtonColor: "#727cf5",
      });
      setFailedRows(data.data || []);
      if (data.inserted > 0) {
        refetch();
      }
      if (data.canceled === 0) {
        onClose();
        setFile(null);
      }
    }
    if (error) {
      const errorData = error as any;
      Swal.fire("Error", errorData?.data?.message || "Upload failed", "error");
    }
  }, [isSuccess, error, data]);

  const exportFailedRecords = () => {
    if (failedRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(failedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
    XLSX.writeFile(wb, `failed_adjustments_${new Date().getTime()}.xlsx`);
  };

  const handleDownloadSample = () => {
    const data = [
      {
        'STAFF ID': '1001',
        'ELEMENT NAME': 'Basic Salary',
        'TYPE': 'BASIC SALARY',
        'CATEGORY': 'ARREARS',
        'DESCRIPTION': 'Basic Salary Arrears - Jan 2026',
        'AMOUNT': 5000.00,
        'PERCENTAGE': '',
        'HAS EMPLOYER CONTRIBUTION': 'FALSE',
        'EMPLOYER PERCENTAGE': '',
        'PERIOD MONTH': 'JANUARY',
        'PERIOD YEAR': 2026,
        'EFFECTIVE MONTH': 'MARCH',
        'EFFECTIVE YEAR': 2026,
        'IS TAXABLE': 'TRUE',
        'IS PENSIONABLE': 'TRUE',
        'LENDER NAME': ''
      },
      {
        'STAFF ID': '1001',
        'ELEMENT NAME': 'Rent Allowance',
        'TYPE': 'ALLOWANCE',
        'CATEGORY': 'ARREARS',
        'DESCRIPTION': 'Rent Allowance Arrears - Jan 2026',
        'AMOUNT': 1500.00,
        'PERCENTAGE': '',
        'HAS EMPLOYER CONTRIBUTION': 'FALSE',
        'EMPLOYER PERCENTAGE': '',
        'PERIOD MONTH': 'JANUARY',
        'PERIOD YEAR': 2026,
        'EFFECTIVE MONTH': 'MARCH',
        'EFFECTIVE YEAR': 2026,
        'IS TAXABLE': 'TRUE',
        'IS PENSIONABLE': 'FALSE',
        'LENDER NAME': ''
      },
      {
        'STAFF ID': '1002',
        'ELEMENT NAME': 'Loan Repayment (GCB)',
        'TYPE': 'DEDUCTION',
        'CATEGORY': 'MANUAL ADJUSTMENT',
        'DESCRIPTION': 'Additional Loan Repayment',
        'AMOUNT': 500.00,
        'PERCENTAGE': '',
        'HAS EMPLOYER CONTRIBUTION': 'FALSE',
        'EMPLOYER PERCENTAGE': '',
        'PERIOD MONTH': 'DECEMBER',
        'PERIOD YEAR': 2025,
        'EFFECTIVE MONTH': 'MARCH',
        'EFFECTIVE YEAR': 2026,
        'IS TAXABLE': 'FALSE',
        'IS PENSIONABLE': 'FALSE',
        'LENDER NAME': 'GCB'
      },
      {
        'STAFF ID': '1003',
        'ELEMENT NAME': 'Provident Fund (Non Taxable)',
        'TYPE': 'TIER 3 NON TAXABLE',
        'CATEGORY': 'ARREARS',
        'DESCRIPTION': 'Tier 3 Arrears - Jan 2026',
        'AMOUNT': '',
        'PERCENTAGE': 5,
        'HAS EMPLOYER CONTRIBUTION': 'TRUE',
        'EMPLOYER PERCENTAGE': 10,
        'PERIOD MONTH': 'JANUARY',
        'PERIOD YEAR': 2026,
        'EFFECTIVE MONTH': 'MARCH',
        'EFFECTIVE YEAR': 2026,
        'IS TAXABLE': 'TRUE',
        'IS PENSIONABLE': 'FALSE',
        'LENDER NAME': ''
      }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "Payroll_Adjustment_Sample.xlsx");
  };

  return (
    <Drawer
      title="Bulk Upload Salary Adjustments"
      onClose={onClose}
      open={open}
      width={800}
      maskClosable={false}
      extra={
        <div className="flex gap-2">
          <Button 
            type="link" 
            icon={<AiOutlineFilePdf size={18} />} 
            href={guidePdfPath} 
            target="_blank"
            download="Payroll_Adjustment_Business_Rules.pdf"
            className="flex items-center gap-1 font-bold text-red-600"
            size="small"
          >
            Download Business Rules Guide
          </Button>
          <Button 
            icon={<AiOutlineDownload />} 
            onClick={handleDownloadSample}
            size="small"
          >
            Download Sample
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert
          message={
            <div className="flex justify-between items-center">
              <span>Required Excel Columns</span>
              <Button 
                type="link" 
                size="small" 
                icon={<AiOutlineDownload />} 
                onClick={handleDownloadSample}
                className="text-blue-600 font-bold"
              >
                Download Sample Template
              </Button>
            </div>
          }
          description={
            <div className="text-xs">
              Ensure your Excel file has these exact headers:
              <p className="font-mono mt-1 font-bold italic text-blue-700">
                STAFF ID, ELEMENT NAME, TYPE, CATEGORY, DESCRIPTION, AMOUNT, PERCENTAGE, HAS EMPLOYER CONTRIBUTION, EMPLOYER PERCENTAGE, PERIOD MONTH, PERIOD YEAR, EFFECTIVE MONTH, EFFECTIVE YEAR, IS TAXABLE, IS PENSIONABLE, LENDER NAME
              </p>
              <div className="mt-2 text-gray-500">
                <p>• <b>TYPE</b>: BASIC SALARY, ALLOWANCE, BONUS, DEDUCTION, TIER 3 NON TAXABLE, TIER 3 TAXABLE, TAX RELIEF</p>
                <p>• <b>CATEGORY</b>: ARREARS, OVERPAYMENT RECOVERY, MANUAL ADJUSTMENT, BONUS CORRECTION, TAX EXEMPTION ADJUSTMENT</p>
                <p>• <b>IS TAXABLE/PENSIONABLE</b>: TRUE or FALSE</p>
                <p>• <b>LENDER NAME</b>: (Optional) The name of the lender for loan deductions (e.g., GCB, STAFF UNION)</p>
                <p>• <b>PERCENTAGE-BASED</b>: For Tier 3, leave AMOUNT empty and fill PERCENTAGE. Set HAS EMPLOYER CONTRIBUTION to TRUE/FALSE.</p>
              </div>
            </div>
          }
          type="info"
          showIcon
        />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
          <input
            type="file"
            id="bulk-upload-input"
            accept=".xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <AiOutlineUpload size={48} className="text-gray-400 mb-2" />
          <p className="text-gray-600">
            {file ? `Selected: ${file.name}` : "Click or drag Excel file to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Supports .xlsx only</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            type="primary" 
            onClick={handleUpload} 
            loading={isLoading} 
            disabled={!file}
            className={styles.primary_button}
          >
            Start Processing
          </Button>
        </div>

        {failedRows.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-red-600 font-bold mb-0">Failed Rows ({failedRows.length})</h3>
              <Button 
                icon={<AiOutlineDownload />} 
                onClick={exportFailedRecords}
                size="small"
                type="dashed"
                danger
              >
                Export Failed Records
              </Button>
            </div>
            <Table
              dataSource={failedRows}
              rowKey={(record, idx) => `failed-${idx}`}
              size="small"
              scroll={{ x: 1000 }}
              columns={[
                { 
                  title: "Staff ID", 
                  dataIndex: "STAFF ID", 
                  key: "staff_id",
                  render: (_text, record) => record["STAFF ID"] || record["Staff ID"] || "N/A"
                },
                { 
                  title: "Type", 
                  dataIndex: "TYPE", 
                  key: "type",
                  render: (_text, record) => record["TYPE"] || record["Type"] || "N/A"
                },
                { 
                  title: "Category", 
                  dataIndex: "CATEGORY", 
                  key: "category",
                  render: (_text, record) => record["CATEGORY"] || record["Category"] || "N/A"
                },
                { 
                  title: "Error Reason", 
                  dataIndex: "ERROR", 
                  key: "error",
                  render: (text) => <span className="text-red-500 font-medium">{text}</span>
                },
                { 
                  title: "Amount", 
                  dataIndex: "AMOUNT", 
                  key: "amount",
                  render: (_text, record) => record["AMOUNT"] || record["Amount"] || "N/A"
                },
              ]}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default BulkUploadAdjustments;
