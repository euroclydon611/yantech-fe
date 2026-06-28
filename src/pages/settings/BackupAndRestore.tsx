import { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PageTitle } from "../../utils/PageTitle";
import { MdDownload } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { exportGzData } from "../../utils/helperFunction";
import {
  useBackupFileNameQuery,
  useRestoreBackupMutation,
} from "../../redux/features/appApi";
import Swal from "sweetalert2";

const BackupAndRestore = () => {
  PageTitle("Backup & Restore");
  const { privileges } = useSelector((state: RootState) => state.auth);

  const hasBackupViewAccess = privileges?.includes("SETTINGS_BACKUP_VIEW");
  const hasBackupExportAccess = privileges?.includes("SETTINGS_BACKUP_EXPORT");
  const hasBackupRestoreAccess = privileges?.includes("SETTINGS_BACKUP_RESTORE");

  if (!hasBackupViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: file } = useBackupFileNameQuery({});

  const [
    restoreBackup,
    { data: restoredData, isSuccess: restored, error: restoringError },
  ] = useRestoreBackupMutation();

  // Handle file input change
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      console.log("Dropped file: ", files[0]);
    }
  };

  // Trigger file input on click
  const handleFileInputClick = () => {
    document.getElementById("file-input").click();
  };

  const handleRestoreBackup = async (selectedFile: any) => {
    const result = await Swal.fire({
      title: "Restore Backup",
      text: "Restoring the backup will overwrite your current data. Do you want to continue?",
      icon: "question", //warning
      showCancelButton: true,
      confirmButtonColor: "#065f46",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Restore",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("document", selectedFile);

      // Call the restoreBackup mutation with the FormData
      await restoreBackup(formData);
    }
  };

  useEffect(() => {
    if (restored) {
      const message = `${restoredData?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      });
      setSelectedFile(null);
    }
    if (restoringError) {
      if ("data" in restoringError) {
        const errorData = restoringError as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [restored, restoringError, restoredData]);

  return (
    <>
      <PageLayout
        title="Backup & Restore"
        breadcrumbs={[{ label: "Settings" }, { label: "Backup & Restore" }]}
        actions={
          hasBackupExportAccess ? (
            <button
              className="flex items-center gap-1.5 bg-green-800 text-white py-1.5 px-3 shadow-sm rounded text-xs font-medium hover:bg-green-700 transition-all"
              onClick={() => exportGzData(`admins/backup`, `${file?.fileName}`)}
            >
              <MdDownload size={14} />
              Export Backup
            </button>
          ) : undefined
        }
      />
      <div className="p-4">
        <div className="flex justify-center w-full">
          <div className="flex-col justify-center py-[100px]">
            <div className="mb-4 flex justify-center">
              <h1 className="text-[18px] font-semibold">Preview</h1>
            </div>

            <div
              className={`w-[1200px] sm:w-[1000px] h-[200px] gap-y-3 flex flex-col items-center border-dashed border border-separate border-green-700 py-[65px] ${
                dragActive ? "bg-green-100" : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleFileInputClick}
            >
              <IoCloudUploadOutline
                size={18}
                color="#006600"
                className="animate-bounce"
              />
              <p className="text-green-700">
                Click to choose a backup file or drag it here
              </p>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* File Preview Section */}
            {selectedFile && (
              <div className="mt-4 flex flex-col items-center border rounded-md p-4 bg-gray-50">
                <h2 className="text-lg font-medium">Selected File:</h2>
                <p className="text-sm mt-2">Name: {selectedFile.name}</p>
                <p className="text-sm">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <div className="flex justify-center mt-4 gap-x-8">
              {hasBackupRestoreAccess && (
                <button
                  className="flex items-center justify-center bg-green-800 text-white py-[7.2px] px-[14.4px] max-md:px-[10px] shadow-md rounded-sm focus:ring-2 focus:ring-[#39afd1] hover:bg-green-700 disabled:bg-gray-200 transition-all duration-300"
                  disabled={!selectedFile}
                  onClick={() => handleRestoreBackup(selectedFile)}
                >
                  <span className="max-md:hidden flex">Restore Backup</span>
                </button>
              )}
              <button
                className="flex items-center justify-center bg-green-800 text-white py-[7.2px] px-[14.4px] max-md:px-[10px] shadow-md rounded-sm focus:ring-2 focus:ring-[#39afd1] hover:bg-green-700 transition-all duration-300"
                onClick={() => setSelectedFile(null)} // Reset the form by clearing the selected file
              >
                <span className="max-md:hidden flex">Reset the Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackupAndRestore;
