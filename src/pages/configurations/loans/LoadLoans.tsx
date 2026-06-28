import { Drawer, Button, Table, Alert } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineDownload } from "react-icons/ai";
import { useBulkLoadLoansMutation } from "../../../redux/features/configurations/employeeLoanApi";
import { styles } from "../../../styles";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

interface LoadLoansProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const LoadLoans = ({ open, onClose, refetch }: LoadLoansProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [failedRows, setFailedRows] = useState<any[]>([]);
  const [bulkLoad, { isLoading, isSuccess, error, data }] = useBulkLoadLoansMutation();

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
      text: "Are you sure you want to process this bulk loan file?",
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
        setFile(null); // Reset file state
        const fileInput = document.getElementById("loan-upload-input") as HTMLInputElement;
        if (fileInput) fileInput.value = ""; // Clear file input
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
        text: data.message,
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
    XLSX.writeFile(wb, `failed_loans_${new Date().getTime()}.xlsx`);
  };

  return (
    <Drawer title="Bulk Load Loans" onClose={onClose} open={open} width={800} maskClosable={false}>
      <div className="space-y-4">
        <Alert
          message="Required Excel Columns"
          description={
            <div className="text-xs">
              Ensure your Excel file has these exact headers:
              <p className="font-mono mt-1 font-bold">LENDER NAME, STAFF ID, ORIGINAL AMOUNT, MONTHLY DEDUCTION, OUTSTANDING BALANCE, START MONTH, START YEAR, REMARKS</p>
            </div>
          }
          type="info"
          showIcon
        />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
          <input
            type="file"
            id="loan-upload-input"
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
                { title: "Staff ID", dataIndex: "STAFF ID", key: "staff_id" },
                { title: "Lender", dataIndex: "LENDER NAME", key: "lender" },
                { 
                  title: "Error Reason", 
                  dataIndex: "ERROR", 
                  key: "error",
                  render: (text) => <span className="text-red-500 font-medium">{text}</span>
                },
                { title: "Amount", dataIndex: "ORIGINAL AMOUNT", key: "amt" },
              ]}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default LoadLoans;
