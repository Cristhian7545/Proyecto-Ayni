import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Modal from '../components/Modal.jsx';
const Context = createContext(null);
export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(null);
  const notify = useCallback((value) => setFeedback(value), []),
    close = useCallback(() => setFeedback(null), []);
  useEffect(() => {
    const listener = (e) => notify(e.detail);
    window.addEventListener('ayni:feedback', listener);
    return () => window.removeEventListener('ayni:feedback', listener);
  }, [notify]);
  return (
    <Context.Provider value={notify}>
      {children}
      <Modal
        open={!!feedback}
        onClose={close}
        title={feedback?.title || 'Ayni'}
      >
        <div className="text-center space-y-4">
          <div
            className={`response-icon ${feedback?.error ? 'response-error' : ''}`}
            aria-hidden="true"
          >
            {feedback?.error ? '!' : '✓'}
          </div>
          <p role={feedback?.error ? 'alert' : 'status'}>{feedback?.message}</p>
          <button type="button" className="ayni-primary" onClick={close}>
            Entendido
          </button>
        </div>
      </Modal>
    </Context.Provider>
  );
}
export function useFeedback() {
  return useContext(Context);
}
