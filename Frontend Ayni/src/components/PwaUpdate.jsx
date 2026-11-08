import { useRegisterSW } from 'virtual:pwa-register/react';
export default function PwaUpdate() {
  const {
    offlineReady: [ready, setReady],
    needRefresh: [update],
    updateServiceWorker,
  } = useRegisterSW();
  return (
    <>
      {ready && (
        <div className="pwa-toast" role="status">
          Ayni está lista para abrirse sin conexión.
          <button onClick={() => setReady(false)} aria-label="Cerrar aviso">
            ×
          </button>
        </div>
      )}
      {update && (
        <div className="pwa-toast" role="status">
          Hay una nueva versión de Ayni.
          <button
            className="underline"
            onClick={() => updateServiceWorker(true)}
          >
            Actualizar ahora
          </button>
          <span className="text-xs">
            Guarda los formularios antes de actualizar.
          </span>
        </div>
      )}
    </>
  );
}
