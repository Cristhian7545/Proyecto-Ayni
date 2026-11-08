import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import LocationFields from './LocationFields.jsx';
import PasswordField from './PasswordField.jsx';
import Modal from './Modal.jsx';
const roles = {
  neighbor: 'Vecino',
  moderator: 'Moderador',
  admin: 'Administrador',
};
export default function AdminUsers() {
  const { user, logout, refreshSession } = useSession(),
    notify = useFeedback(),
    navigate = useNavigate();
  const [data, setData] = useState({ users: [], total: 0 }),
    [search, setSearch] = useState(''),
    [query, setQuery] = useState(''),
    [offset, setOffset] = useState(0),
    [version, setVersion] = useState(0),
    [editing, setEditing] = useState(null),
    [removing, setRemoving] = useState(null),
    [error, setError] = useState(''),
    [formError, setFormError] = useState(''),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  const closeEdit = useCallback(() => {
      if (!busy) setEditing(null);
    }, [busy]),
    closeRemove = useCallback(() => {
      if (!busy) setRemoving(null);
    }, [busy]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api(
      '/admin/users?' +
        new URLSearchParams({
          limit: '10',
          offset: String(offset),
          ...(query ? { search: query } : {}),
        }),
    )
      .then((result) => {
        if (active) {
          setData(result);
          setError('');
          if (offset && offset >= result.total) setOffset(0);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, offset, version]);
  return (
    <section className="admin-section" aria-labelledby="admin-users-title">
      <div className="admin-users-heading">
        <div>
          <span className="section-eyebrow">PERSONAS DE LA COMUNIDAD</span>
          <h2 id="admin-users-title" className="text-headline-md text-primary">
            Cuentas registradas ({data.total})
          </h2>
        </div>
        <button
          className="ayni-primary"
          onClick={() => {
            setFormError('');
            setEditing({});
          }}
        >
          Crear cuenta
        </button>
      </div>
      <form
        className="admin-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
          setOffset(0);
        }}
      >
        <label className="sr-only" htmlFor="admin-user-search">
          Buscar por nombre o correo
        </label>
        <input
          id="admin-user-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={120}
          placeholder="Buscar por nombre o correo…"
        />
        <button className="ayni-secondary" type="submit">
          Buscar
        </button>
      </form>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Cargando cuentas…</p>
      ) : !data.users.length ? (
        <p>No hay cuentas que coincidan.</p>
      ) : (
        <div className="admin-users-list">
          {data.users.map((account) => (
            <article key={account.id} className="admin-user-row">
              <span className="avatar-thumb" aria-hidden="true">
                {account.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  {account.name}
                  {user.id === account.id ? ' · Tú' : ''}
                </h3>
                <p className="text-sm break-all">{account.email}</p>
                <p className="text-xs text-on-surface-variant">
                  {account.neighborhood} · {account.district}
                </p>
              </div>
              <span
                className={
                  'role-badge ' + (account.role === 'admin' ? 'role-admin' : '')
                }
              >
                {roles[account.role]}
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={busy}
                  className="ayni-secondary"
                  onClick={() => {
                    setFormError('');
                    setEditing(account);
                  }}
                >
                  Editar / Permisos
                </button>
                <button
                  className="ayni-secondary text-error"
                  disabled={busy || user.id === account.id}
                  onClick={() => {
                    setFormError('');
                    setRemoving(account);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {data.total > 10 && (
        <div className="flex items-center justify-between gap-3">
          <button
            className="ayni-secondary"
            disabled={!offset || loading}
            onClick={() => setOffset((o) => Math.max(0, o - 10))}
          >
            ← Anterior
          </button>
          <span className="text-sm">Página {Math.floor(offset / 10) + 1}</span>
          <button
            className="ayni-secondary"
            disabled={loading || offset + 10 >= data.total}
            onClick={() => setOffset((o) => o + 10)}
          >
            Siguiente →
          </button>
        </div>
      )}
      <Modal
        open={!!editing}
        onClose={closeEdit}
        title={editing?.id ? 'Editar cuenta y permisos' : 'Crear cuenta'}
      >
        {editing && (
          <form
            key={editing.id || 'new'}
            className="ayni-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy) return;
              const d = new FormData(e.currentTarget),
                body = {
                  name: d.get('name'),
                  email: d.get('email'),
                  district: d.get('district'),
                  neighborhood: d.get('neighborhood'),
                  role: d.get('role'),
                };
              if (d.get('phone')) body.phone = d.get('phone');
              if (!editing.id) body.password = d.get('password');
              setBusy(true);
              setFormError('');
              try {
                await api(
                  '/admin/users' + (editing.id ? '/' + editing.id : ''),
                  {
                    method: editing.id ? 'PATCH' : 'POST',
                    body: JSON.stringify(body),
                  },
                );
                const ownEmailChanged =
                  editing.id === user.id && editing.email !== body.email;
                setEditing(null);
                setVersion((v) => v + 1);
                if (ownEmailChanged) {
                  await logout();
                  navigate('/acceso');
                } else if (editing.id === user.id) {
                  await refreshSession();
                }
                notify({
                  title: 'Cuenta actualizada',
                  message: ownEmailChanged
                    ? 'Vuelve a ingresar con tu correo actualizado.'
                    : 'Los datos y permisos se guardaron correctamente.',
                });
              } catch (e) {
                setFormError(
                  e.details?.map((d) => d.message).join(' ') || e.message,
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Nombre completo *
              <input
                name="name"
                defaultValue={editing.name || ''}
                minLength={2}
                maxLength={120}
                required
                disabled={busy}
              />
            </label>
            <label>
              Correo electrónico *
              <input
                name="email"
                type="email"
                defaultValue={editing.email || ''}
                maxLength={254}
                required
                disabled={busy}
              />
            </label>
            <label>
              Celular {!editing.id ? '*' : ''}
              <input
                name="phone"
                type="tel"
                defaultValue={editing.phone || ''}
                placeholder="912 345 678"
                maxLength={18}
                required={!editing.id}
                disabled={busy}
              />
            </label>
            <LocationFields
              district={editing.district || ''}
              neighborhood={editing.neighborhood || ''}
            />
            <label>
              Permisos *
              <select
                name="role"
                defaultValue={editing.role || 'neighbor'}
                disabled={busy || editing.id === user.id}
              >
                {Object.entries(roles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {editing.id === user.id && (
                <input name="role" type="hidden" value="admin" />
              )}
            </label>
            <p className="text-sm text-on-surface-variant">
              Un administrador puede gestionar cuentas, comunidades,
              publicaciones y alertas.
            </p>
            {!editing.id && (
              <PasswordField
                strong
                autoComplete="new-password"
                label="Contraseña inicial"
              />
            )}
            {formError && (
              <p role="alert" className="text-error">
                {formError}
              </p>
            )}
            <button type="submit" disabled={busy} className="ayni-primary">
              {busy ? 'Guardando…' : 'Guardar cuenta'}
            </button>
          </form>
        )}
      </Modal>
      <Modal open={!!removing} onClose={closeRemove} title="Eliminar cuenta">
        <form
          className="ayni-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            setBusy(true);
            setFormError('');
            try {
              await api('/admin/users/' + removing.id, { method: 'DELETE' });
              setRemoving(null);
              setVersion((v) => v + 1);
              notify({
                title: 'Cuenta eliminada',
                message:
                  'El acceso fue desactivado y sus datos personales retirados. Se conserva el contenido publicado para no eliminar conversaciones de otros vecinos.',
              });
            } catch (e) {
              setFormError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <p>
            Se eliminará la cuenta de <strong>{removing?.name}</strong> y se
            cerrarán sus sesiones. Sus publicaciones se conservarán como “Cuenta
            eliminada”.
          </p>
          <label className="consent-option">
            <input type="checkbox" required disabled={busy} />
            Confirmo la eliminación de esta cuenta.
          </label>
          {formError && (
            <p role="alert" className="text-error">
              {formError}
            </p>
          )}
          <button className="ayni-primary" type="submit" disabled={busy}>
            {busy ? 'Eliminando…' : 'Confirmar eliminación'}
          </button>
        </form>
      </Modal>
    </section>
  );
}
