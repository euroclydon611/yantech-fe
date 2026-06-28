import { Drawer, Button, Table, Alert, Input, Select, Space } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineDownload } from "react-icons/ai";
import { useBulkStoreTier3Mutation } from "../../../redux/features/configurations/pmeApi";
import { styles } from "../../../styles";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

interface LoadTier3Props {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const LoadTier3 = ({ open, onClose, refetch }: LoadTier3Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [failedRows, setFailedRows] = useState<any[]>([]);
  const [bulkLoad, { isLoading, isSuccess, error, data }] = useBulkStoreTier3Mutation();

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

    if (!name) {
      Swal.fire("Error", "Please provide a name for this PME", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Upload",
      text: "Are you sure you want to process this bulk Tier 3 file?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#727cf5",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Yes, start processing",
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("doc", file);
      formData.append("name", name);
      formData.append("deduction_category", category || "");
      if (percentage !== null) {
        formData.append("percentage", percentage.toString());
      }

      try {
        await bulkLoad(formData).unwrap();
        setFile(null); // Reset file state
        const fileInput = document.getElementById("tier3-upload-input") as HTMLInputElement;
        if (fileInput) fileInput.value = ""; // Clear file input
      } catch (err) {
        // Error handled by useEffect
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setFile(null);
      setName("");
      setCategory(null);
      setPercentage(null);
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
        setName("");
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
    XLSX.writeFile(wb, `failed_tier3_${new Date().getTime()}.xlsx`);
  };

  const handleDownloadSample = () => {
    const data = [
      {
        'STAFF ID': '0001',
        'PERCENTAGE': 6.5
      },
      {
        'STAFF ID': '0002',
        'PERCENTAGE': 3.5
      },
      {
        'STAFF ID': '0003'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "Tier3_Provident_Fund_Sample.xlsx");
  };

  return (
    <Drawer
      title="Bulk Load Provident Fund (Tier 3)"
      onClose={onClose}
      open={open}
      width={800}
      maskClosable={false}
      extra={
        <Button 
          icon={<AiOutlineDownload />} 
          onClick={handleDownloadSample}
          size="small"
        >
          Download Sample
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">PME Name</label>
            <Input 
              placeholder="e.g. Provident Fund" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select 
              className="w-full"
              value={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select Category"
              allowClear
              options={[
                { value: "tier_3", label: "Tier 3 (Non Taxable)" },
                { value: "tier_3_taxable", label: "Tier 3 (Taxable)" },
              ]}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Percentage (%)</label>
            <Input 
              type="number"
              placeholder="e.g. 6.5" 
              min={0.01}
              step="0.01"
              value={percentage || ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val > 0) {
                  setPercentage(val);
                } else {
                  setPercentage(null);
                }
              }}
            />
          </div>
        </div>

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
              Ensure your Excel file has at least this header:
              <p className="font-mono mt-1 font-bold italic text-blue-700">STAFF ID</p>
              Optional headers:
              <p className="font-mono mt-1 font-bold italic text-gray-700">PERCENTAGE (Defaults: Non Taxable=6.5%, Taxable=3.5%)</p>
            </div>
          }
          type="info"
          showIcon
        />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
          <input
            type="file"
            id="tier3-upload-input"
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
                { 
                  title: "Error Reason", 
                  dataIndex: "ERROR", 
                  key: "error",
                  render: (text) => <span className="text-red-500 font-medium">{text}</span>
                },
                { title: "Percentage", dataIndex: "PERCENTAGE", key: "pct" },
              ]}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default LoadTier3;
