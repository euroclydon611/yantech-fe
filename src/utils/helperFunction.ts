import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

//function to export excel data
export const exportData = async (route: string, file_name: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PUBLIC_SERVER_URI}${route}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${file_name.toUpperCase()}.xlsx`;
    link.click();
  } catch (error) {
    console.error("Error during export:", error);
    toast.error("Error during export");
  }
};

//function to export zip data
export const exportZipData = async (route: string, file_name: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PUBLIC_SERVER_URI}${route}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    console.log("Blob size:", blob.size); // Check size of blob

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${file_name}.zip`;
    link.click();
  } catch (error) {
    console.error("Error during export:", error);
    toast.error("Error during export");
  }
};

export const exportGzData = async (route: string, file_name: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PUBLIC_SERVER_URI}${route}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    // Check if the response is JSON (e.g., indicating a message instead of a file)
    const contentType = response.headers["content-type"];

    // If response is JSON, don't attempt download, show message instead
    if (contentType.includes("application/json")) {
      const reader = new FileReader();
      reader.onload = function () {
        const jsonResponse = JSON.parse(reader.result as string);
        Swal.fire({
          title: jsonResponse.message,
          icon: "success",
          // timer: 5000,
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      };
      reader.readAsText(response.data);
    } else if (contentType === "application/gzip") {
      // Otherwise, handle the download of the .gz file
      const blob = new Blob([response.data], { type: "application/gzip" });
      console.log("Blob size:", blob.size); // Log size of blob

      // Create a download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${file_name}.gz`; // Use .gz extension
      link.click();

      // Clean up by revoking the object URL
      window.URL.revokeObjectURL(link.href);
    }
  } catch (error) {
    console.error("Error during export:", error);
    toast.error("Error during export");
  }
};

export const handleDocumentView = (attachment) => {
  if (attachment instanceof File) {
    const url = URL.createObjectURL(attachment);
    window.open(url, "_blank");
    // Note: We don't revoke here because the window needs it to load
    return;
  }

  if (attachment?.filename) {
    window.open(
      `${import.meta.env.VITE_MAIN_SERVER}/api/uploads/${attachment.filename}`,
      "_blank"
    );
  } else if (attachment?.s3Url) {
    window.open(attachment.s3Url, "_blank");
  }
};

// Helper to make strings like "permitType" → "Permit Type"
export const formatLabel = (text: string): string =>
  text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

export const normalizeText = (category: string) => {
  return category
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export function formatDate(dateString: any) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDate2(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatDate3(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatDate4(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // AM/PM time format
  };
  return date.toLocaleString("en-US", options);
}

export function formatDateMonthYear(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function capitalizeFirstLetter(word: any): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const formatNumber = (numberString: any): string => {
  if (numberString !== null && numberString !== undefined && numberString !== "") {
    const num = parseFloat(numberString).toFixed(2);

    if (isNaN(parseFloat(numberString))) return "0.00";

    const parts = num.split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  }
  return "0.00";
};

export const monthMap = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

export function calculateDaysLeft(submitBy: string): string {
  const submissionDate = new Date(submitBy).getTime();
  const today = new Date().getTime();

  const timeDifference = submissionDate - today;
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    return `${daysLeft} day(s) left until submission.`;
  } else if (daysLeft === 0) {
    return "Submission is due today!";
  } else {
    return `Submission was due ${Math.abs(daysLeft)} day(s) ago.`;
  }
}

export function isSubmissionOverdue(submitBy: string): boolean {
  const submissionDate = new Date(submitBy);
  const today = new Date();

  // Reset time to midnight to compare only the date part
  submissionDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return submissionDate < today;
}

export function transformData(data) {
  // Check if the data is valid and not empty
  if (!data || data.length === 0) {
    return {
      items_to_assign: [], // Return an empty array if data is not provided or empty
    };
  }

  // Transform the data if valid
  return {
    items_to_assign: data.map((item) => {
      // Split the item_description to extract the description, natural code, and ID
      const [description, naturalCode, accountId] =
        item.item_description?.split(">") || [];

      return {
        item_description: description?.trim() || item.item_description, // Maintain existing value if extracted is empty
        item_natural_code: naturalCode?.trim() || item.item_natural_code, // Maintain existing value if extracted is empty
        item_quantity:
          item?.item_quantity !== undefined && item?.item_quantity !== null
            ? parseInt(item?.item_quantity, 10)
            : item.item_quantity, // Maintain existing value if new value is invalid
        item_unit_cost:
          item?.item_unit_cost !== undefined && item?.item_unit_cost !== null
            ? parseFloat(item?.item_unit_cost)
            : item.item_unit_cost, // Maintain existing value if new value is invalid
        account_sub_sub_item_id:
          accountId?.trim() || item.account_sub_sub_item_id, // Maintain existing value if extracted is empty
      };
    }),
  };
}

export const exportProjectsData = async (route: string, file_name: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PUBLIC_SERVER_URI_FINANCE}${route}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${file_name}.xlsx`;
    link.click();
  } catch (error) {
    console.error("Error during export:", error);
    toast.error("Error during export");
  }
};

export function getSupplierNames(suppliers) {
  if (!suppliers || !Array.isArray(suppliers)) {
    return "";
  }

  return suppliers
    .map((supplier) => supplier.supplier_id?.name)
    .filter((name) => name)
    .join(", ");
}
