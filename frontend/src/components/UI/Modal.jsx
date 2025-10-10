import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, className = "", onClose }) {
  const dialogRef = useRef();

  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      onClose={onClose}
      aria-modal="true"
      role="dialog"
    >
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}
