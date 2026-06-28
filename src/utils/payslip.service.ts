import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const exportErrorDataToExcel = (emailFailures: any[], smsFailures: any[]) => {
  const emailSheet = XLSX.utils.json_to_sheet(emailFailures);
  const smsSheet = XLSX.utils.json_to_sheet(smsFailures);

  const wb = XLSX.utils.book_new();
  if (emailFailures.length) XLSX.utils.book_append_sheet(wb, emailSheet, "Email Failures");
  if (smsFailures.length) XLSX.utils.book_append_sheet(wb, smsSheet, "SMS Failures");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "FailureReport.xlsx");
};




export const exportErrorDataToPDF = (emailFailures: any[], smsFailures: any[]) => {
  const doc: any = new jsPDF();

  if (emailFailures.length) {
    autoTable(doc, {
      startY: 10,
      head: [["Full Name", "Employee No", "Email", "Personal Email", "Error Message"]],
      body: emailFailures.map((item: any) => [
        item.full_name,
        item.employee_number,
        item.email,
        item.personal_email,
        item.error_message,
      ]),
      theme: "striped",
      headStyles: { fillColor: [114, 124, 245] },
    });
  }

  if (smsFailures.length) {
    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY! + 10,
      head: [["Full Name", "Employee No", "Phone No", "Error Message"]],
      body: smsFailures.map((item: any) => [
        item.full_name,
        item.employee_number,
        item.phone_number,
        item.error_message,
      ]),
      theme: "striped",
      headStyles: { fillColor: [245, 87, 87] },
    });
  }

  doc.save("FailureReport.pdf");
};


import Swal from 'sweetalert2';
import axios from 'axios';

// A single, robust function to handle PDF viewing
export const openPdfFromApi = async (url: string, params: object, context: string) => {
  try {
    const response = await axios.get(url, { params, withCredentials: true });

    // First, try to use document_url if available
    const documentUrl = response?.data?.document_url;
    if (documentUrl) {
      window.open(documentUrl, "PaySlipPopup", "width=800,height=900,scrollbars=yes,resizable=yes");
      return;
    }

    // Fallback to file base64 conversion
    const fileBase64 = response?.data?.file;

    if (!fileBase64 || typeof fileBase64 !== 'string') {
      // The server responded but didn't provide a valid file string.
      Swal.fire({
        title: "Pay Slip Not Available",
        text: `The server did not return a valid file for the ${context}. Please contact support.`,
        icon: "warning",
        confirmButtonColor: "#727cf5",
      });
      return;
    }

    // Robustly handle base64 string, with or without the data URL prefix
    const base64Data = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "PaySlipPopup", "width=800,height=900,scrollbars=yes,resizable=yes");

  } catch (error: any) {
    // Log the detailed error for better debugging
    console.error(`Failed to fetch ${context}:`, error.response || error);

    Swal.fire({
      title: "Oops...",
      text: error?.response?.data?.error || "Something went wrong while fetching the pay slip!",
      icon: "error",
      confirmButtonColor: "#727cf5",
    });
  }
};
