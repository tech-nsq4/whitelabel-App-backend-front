import { useEffect } from "react";
import "./Modal.css";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size,
  children,
}) {
  useEffect(() => {
    function handle(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  if (open === false) return null;

  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        style={
          size === "lg"
            ? { maxWidth: 780 }
            : size === "sm"
              ? { maxWidth: 420 }
              : undefined
        }
      >
        <div className="modal-head">
          <div>
            <div className="modal-title">{title}</div>
            {subtitle && <div className="modal-sub">{subtitle}</div>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="إغلاق">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
