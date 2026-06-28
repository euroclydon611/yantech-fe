import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const EmailConfirmationDialog = ({ title, message, onConfirm }: any) => {
  const options = {
    title: title,
    message: message,
    buttons: [
      {
        label: "Send",
        onClick: () => onConfirm(),
      },
      {
        label: "Cancel",
        onClick: () => {},
      },
    ],
    closeOnClickOutside: true,
    closeOnEscape: true,
  };

  confirmAlert(options);
};

export default EmailConfirmationDialog;
