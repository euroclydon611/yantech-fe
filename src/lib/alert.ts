import Swal from "sweetalert2";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions {
  type?: AlertType;
  title?: string;
  message: string;
  timer?: number;
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

/**
 * Toast notification - appears at top and auto-dismisses
 */
export const showToast = (options: {
  type?: AlertType;
  message: string;
  timer?: number;
}) => {
  const { type = "info", message, timer = 3000 } = options;

  return Swal.fire({
    toast: true,
    position: "top",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    customClass: {
      title: "text-sm font-medium",
    },
  });
};

/**
 * Modal alert - requires user interaction
 */
export const showAlert = async (options: AlertOptions) => {
  const {
    type = "info",
    title,
    message,
    showConfirmButton = true,
    confirmText = "OK",
    cancelText,
  } = options;

  const result = await Swal.fire({
    icon: type,
    title: title || (type === "success" ? "Success" : type === "error" ? "Error" : "Alert"),
    html: message,
    showConfirmButton,
    confirmButtonText: confirmText,
    showCancelButton: !!cancelText,
    cancelButtonText: cancelText,
    confirmButtonColor: type === "error" ? "#ef4444" : "#3b82f6",
    cancelButtonColor: "#6b7280",
    customClass: {
      title: "text-lg font-semibold",
      htmlContainer: "text-sm text-gray-700",
    },
  });

  if (result.isConfirmed && options.onConfirm) {
    await options.onConfirm();
  } else if (result.isDismissed && options.onCancel) {
    await options.onCancel();
  }

  return result;
};

/**
 * Success notification
 */
export const showSuccess = (message: string, timer = 3000) => {
  return showToast({ type: "success", message, timer });
};

/**
 * Error notification
 */
export const showError = (message: string, timer = 3000) => {
  return showToast({ type: "error", message, timer });
};

/**
 * Warning notification
 */
export const showWarning = (message: string, timer = 3000) => {
  return showToast({ type: "warning", message, timer });
};

/**
 * Info notification
 */
export const showInfo = (message: string, timer = 3000) => {
  return showToast({ type: "info", message, timer });
};

/**
 * Confirmation dialog - returns promise with user's choice
 */
export const showConfirm = async (options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "info";
}): Promise<boolean> => {
  const {
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
  } = options;

  const result = await Swal.fire({
    icon: type,
    title,
    html: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#2E7D32",
    cancelButtonColor: "#6b7280",
    customClass: {
      title: "text-lg font-semibold",
      htmlContainer: "text-sm text-gray-700",
    },
  });

  return result.isConfirmed;
};