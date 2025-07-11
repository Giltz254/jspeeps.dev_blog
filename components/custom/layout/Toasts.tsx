import { toast } from "sonner";
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    className: "custom-single-message-toast",
  });
};
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    className: "custom-error-toast",
  });
};
export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    className: "custom-info-toast",
  });
};
