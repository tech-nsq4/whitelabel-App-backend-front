import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import "./Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "default" });
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  // showToast(message) or showToast(message, type)
  // type: 'default' | 'success' | 'error'
  const showToast = useCallback((msg, type = "default") => {
    setToast({ message: msg, type });
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast toast--${toast.type}${visible ? " on" : ""}`}>
        {toast.type === "success" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        )}
        {toast.type === "error" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        )}
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
