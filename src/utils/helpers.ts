import { capitalize } from "lodash";

export const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper to make strings like "permitType" → "Permit Type"
export const formatLabel = (text: string): string =>
  text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

export const normalizeText = (text: string) => {
  return text
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const capitalizeWords = (text: any): string =>
  String(text || "")
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");

export const getDaysUntilDeadline = (deadline?: string | Date, deadlineTime?: string) => {
  if (!deadline) return { text: null, color: "default" };
  const today = new Date();
  const deadlineDate = new Date(deadline);

  if (deadlineTime) {
    const [hours, minutes] = deadlineTime.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      deadlineDate.setHours(hours, minutes, 0, 0);
    }
  }

  const diffTime = deadlineDate.getTime() - today.getTime();
  const isToday = deadlineDate.toDateString() === today.toDateString();

  if (diffTime < 0) {
    const diffDays = Math.floor(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return { text: "Overdue", color: "error" };
    return { text: `${diffDays} ${diffDays === 1 ? "day" : "days"} overdue`, color: "error" };
  }

  if (isToday) {
    return { text: "Due today", color: "warning" };
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    return { text: `${diffDays} ${diffDays === 1 ? "day" : "days"} left`, color: "warning" };
  }
  
  return { text: `${diffDays} ${diffDays === 1 ? "day" : "days"} left`, color: "success" };
};


