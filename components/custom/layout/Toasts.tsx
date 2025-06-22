import { toast } from "sonner";
const CheckmarkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-teal-400"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ErrorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-rose-300"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const InfoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-blue-300"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: (
      <div className="flex items-center justify-center rounded-full bg-teal-600 p-1">
        {CheckmarkIcon}
      </div>
    ),
    duration: 3000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
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
    icon: (
      <div className="flex items-center justify-center rounded-full bg-rose-700 p-1">
        {ErrorIcon}
      </div>
    ),
    duration: 5000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
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
    icon: (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700">
        {InfoIcon}
      </div>
    ),
    duration: 4000,
    closeButton: true,
    style: {
      backgroundColor: "#27272a",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    className: "custom-info-toast",
  });
};
