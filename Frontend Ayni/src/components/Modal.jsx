import { useEffect, useId, useRef } from 'react';
export default function Modal({ open, onClose, title, children }) {
  const titleId = useId();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector('button')?.focus();
    const key = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const fields = [
          ...ref.current.querySelectorAll(
            'button,input,select,textarea,a[href]',
          ),
        ].filter((el) => !el.disabled && el.getClientRects().length);
        const first = fields[0],
          last = fields.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      previous?.focus();
    };
  }, [open, onClose]);
  return (
    <div
      hidden={!open}
      className="ayni-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="ayni-dialog"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 id={titleId} className="text-headline-md text-primary">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Cerrar formulario"
            onClick={onClose}
            className="ayni-icon"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
