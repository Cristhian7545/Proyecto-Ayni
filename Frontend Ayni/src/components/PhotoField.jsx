import { useEffect, useId, useState } from 'react';
export default function PhotoField({ label = 'Fotografía de la publicación' }) {
  const id = useId();
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!file) {
      setUrl('');
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-semibold">
        {label} <span className="font-normal text-sm">(opcional)</span>
      </label>
      <input
        id={id}
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (
            selected &&
            (!['image/jpeg', 'image/png', 'image/webp'].includes(
              selected.type,
            ) ||
              selected.size > 5 * 1024 * 1024)
          ) {
            setError('Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.');
            event.target.value = '';
            setFile(null);
          } else {
            setError('');
            setFile(selected || null);
          }
        }}
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className="text-sm text-on-surface-variant">
        JPG, PNG o WebP · Hasta 5 MB. Vista previa local.
      </p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {url && (
        <div className="flex items-center gap-4">
          <img
            src={url}
            alt="Vista previa de la fotografía seleccionada"
            className="w-24 h-24 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={() => {
              setFile(null);
              document.getElementById(id).value = '';
            }}
          >
            Quitar foto
          </button>
        </div>
      )}
    </div>
  );
}
