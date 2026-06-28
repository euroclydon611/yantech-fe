import Swal from "sweetalert2";

const SwalToast = (options: {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  timer?: number;
}) => {
  const { type = "info", message, timer = 3000 } = options;

  Swal.fire({
    toast: true,
    position: "top",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer,
    customClass: {
      title: "swal2-title-lg",
    },
  });
};

export default SwalToast;
