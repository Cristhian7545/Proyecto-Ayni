import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, assetUrl } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
const date = (s) => new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
const clock = (s) =>
  new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima',
  }).format(date(s));
const day = (s) =>
  new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeZone: 'America/Lima',
  }).format(date(s));
export default function Mensajes() {
  const { user, loading } = useSession(),
    [params, setParams] = useSearchParams(),
    selected = params.get('conversacion');
  const [conversations, setConversations] = useState([]),
    [messages, setMessages] = useState([]),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [version, setVersion] = useState(0),
    [search, setSearch] = useState(''),
    [body, setBody] = useState('');
  const scroller = useRef(null),
    nearBottom = useRef(true);
  useEffect(() => {
    let active = true;
    if (!user) return;
    async function load() {
      try {
        const d = await api('/conversations');
        if (active) setConversations(d.conversations);
      } catch (e) {
        if (active) setError(e.message);
      }
    }
    load();
    const timer = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user?.id, version]);
  useEffect(() => {
    setMessages([]);
    setBody('');
    setError('');
    nearBottom.current = true;
  }, [selected, user?.id]);
  useEffect(() => {
    let active = true;
    if (!selected || !user) return;
    async function load() {
      try {
        const result = await api(`/conversations/${selected}/messages`);
        if (active) {
          setMessages(result.messages);
          if (document.visibilityState === 'visible')
            await api(`/conversations/${selected}/read`, { method: 'PATCH' });
        }
      } catch (e) {
        if (active) setError(e.message);
      }
    }
    load();
    const timer = setInterval(load, 8000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [selected, user?.id, version]);
  useEffect(() => {
    if (nearBottom.current && scroller.current)
      scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.at(-1)?.id, selected]);
  const neighbor = conversations.find((c) => c.id === selected);
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-8">
      <h1 className="text-headline-lg text-primary mt-4">Mensajería vecinal</h1>
      {loading ? (
        <p>Cargando sesión…</p>
      ) : !user ? (
        <Link to="/acceso" className="ayni-primary my-5">
          Acceder a mis conversaciones
        </Link>
      ) : (
        <div className={`chat-layout ${selected ? 'chat-is-open' : ''}`}>
          <aside className="chat-sidebar">
            <h2 className="font-semibold text-primary mb-3">Conversaciones</h2>
            <input
              type="search"
              aria-label="Buscar conversación"
              className="chat-search"
              placeholder="Buscar un vecino…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!conversations.length && (
              <p className="text-sm p-3">
                Pulsa Contactar en una publicación para empezar.
              </p>
            )}
            {conversations
              .filter((c) =>
                c.neighbor_name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`chat-conversation ${selected === c.id ? 'is-current' : ''}`}
                  onClick={() => setParams({ conversacion: c.id })}
                >
                  <img
                    className="avatar-thumb"
                    alt=""
                    src={
                      assetUrl(c.neighbor_photo) || '/assets/avatar-default.svg'
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold truncate">
                      {c.neighbor_name}
                    </span>
                    <span className="block text-xs truncate text-on-surface-variant">
                      {c.last_message || 'Empieza la conversación'}
                    </span>
                  </span>
                  {c.unread > 0 && (
                    <span
                      className="chat-unread"
                      aria-label={`${c.unread} mensajes sin leer`}
                    >
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
          </aside>
          <section className="chat-panel">
            {!selected ? (
              <div className="chat-empty">
                <span
                  className="material-symbols-outlined text-primary text-5xl"
                  aria-hidden="true"
                >
                  forum
                </span>
                <h2 className="text-headline-md">Tu comunidad, más cerca</h2>
                <p>Selecciona una conversación para coordinar con un vecino.</p>
              </div>
            ) : (
              <>
                <header className="chat-heading">
                  <button
                    type="button"
                    className="ayni-icon chat-back"
                    aria-label="Volver a conversaciones"
                    onClick={() => setParams({})}
                  >
                    ←
                  </button>
                  <img
                    className="avatar-thumb"
                    src={
                      assetUrl(neighbor?.neighbor_photo) ||
                      '/assets/avatar-default.svg'
                    }
                    alt=""
                  />
                  <div>
                    <h2 className="font-semibold text-primary">
                      {neighbor?.neighbor_name || 'Conversación'}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Conversación privada entre vecinos
                    </p>
                  </div>
                </header>
                <div
                  className="chat-messages"
                  ref={scroller}
                  onScroll={() => {
                    const el = scroller.current;
                    nearBottom.current =
                      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
                  }}
                  aria-live="polite"
                >
                  {!messages.length && !error && (
                    <p className="text-center text-sm text-on-surface-variant p-4">
                      Saluda y coordina los detalles de la publicación.
                    </p>
                  )}
                  {messages.map((m, index) => (
                    <div key={m.id}>
                      {(!index ||
                        day(m.created_at) !==
                          day(messages[index - 1].created_at)) && (
                        <div className="chat-date">{day(m.created_at)}</div>
                      )}
                      <div
                        className={`chat-bubble ${m.sender_id === user.id ? 'chat-own' : 'chat-other'}`}
                      >
                        <p className="whitespace-pre-wrap">{m.body}</p>
                        <span className="chat-stamp">
                          {clock(m.created_at)}{' '}
                          {m.sender_id === user.id &&
                            (m.read_at ? '✓✓ Visto' : '✓ Enviado')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {error && (
                  <p role="alert" className="text-error text-sm px-4 py-2">
                    {error}
                  </p>
                )}
                <form
                  className="chat-composer"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (busy || !body.trim()) return;
                    setBusy(true);
                    setError('');
                    try {
                      await api(`/conversations/${selected}/messages`, {
                        method: 'POST',
                        body: JSON.stringify({ body }),
                      });
                      setBody('');
                      nearBottom.current = true;
                      setVersion((v) => v + 1);
                    } catch (error) {
                      setError(error.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <textarea
                    name="body"
                    rows={1}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    aria-label="Escribe un mensaje"
                    placeholder="Escribe un mensaje respetuoso…"
                    maxLength={4000}
                    required
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey &&
                        !e.nativeEvent.isComposing
                      ) {
                        e.preventDefault();
                        e.currentTarget.form.requestSubmit();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="ayni-primary"
                    disabled={busy || !body.trim()}
                    aria-label="Enviar mensaje"
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      send
                    </span>
                  </button>
                </form>
                <p className="chat-help">
                  Enter para enviar · Shift + Enter para otra línea · Sin
                  insultos
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
