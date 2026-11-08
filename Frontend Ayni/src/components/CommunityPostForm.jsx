import { submitPost } from '../models/sync-queue.js';
import { useEffect, useState } from 'react';
import { api, uploadPhoto } from '../models/api.js';
export default function CommunityPostForm({ community, onSaved }) {
  const [files, setFiles] = useState([]),
    [previews, setPreviews] = useState([]),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return (
    <form
      className="ayni-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        const d = new FormData(e.currentTarget);
        setBusy(true);
        setError('');
        try {
          const result = await submitPost(
            {
              module: 'aviso',
              category: 'Comunidad',
              communityId: String(community.id),
              title: d.get('title'),
              description: d.get('description'),
              district: community.district,
            },
            files,
          );
          window.dispatchEvent(new Event('ayni:posts-updated'));
          onSaved(result);
        } catch (e) {
          setError(e.details?.map((d) => d.message).join(' ') || e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="text-sm">
        Publicarás en <strong>{community.name}</strong>. Solo sus miembros
        podrán acceder al contenido.
      </p>
      <label>
        Título *
        <input
          name="title"
          minLength={3}
          maxLength={120}
          disabled={busy}
          required
        />
      </label>
      <label>
        Descripción *
        <textarea
          name="description"
          rows={5}
          minLength={5}
          maxLength={5000}
          disabled={busy}
          required
        />
      </label>
      <label className="photo-drop">
        Fotos de la publicación
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={busy}
          onChange={(e) => {
            const next = [...files, ...e.target.files];
            e.target.value = '';
            if (next.length > 6) {
              setError('Puedes adjuntar hasta seis fotos.');
              return;
            }
            if (
              next.some(
                (f) =>
                  f.size > 5 * 1024 * 1024 ||
                  !['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
              )
            ) {
              setError('Usa fotos JPG, PNG o WebP de hasta 5 MB cada una.');
              return;
            }
            setFiles(next);
            setError('');
          }}
        />
        <span className="text-xs text-on-surface-variant">
          Hasta 6 fotos · JPG, PNG o WebP · 5 MB por foto
        </span>
      </label>
      <div className="photo-previews">
        {files.map((f, n) => (
          <div key={n}>
            <img src={previews[n]} alt={f.name} />
            <button
              type="button"
              disabled={busy}
              aria-label={`Quitar foto ${n + 1}`}
              onClick={() => setFiles((all) => all.filter((_, i) => i !== n))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <button type="submit" className="ayni-primary" disabled={busy}>
        {busy ? 'Publicando…' : 'Publicar en la comunidad'}
      </button>
    </form>
  );
}
