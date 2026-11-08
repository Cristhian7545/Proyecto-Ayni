import { createContext, useContext, useEffect, useState } from 'react';
import { api, uploadPhoto, assetUrl } from '../models/api.js';
import { networkApi } from '../models/http.js';
import {
  rememberUser,
  offlineUser,
  forgetUser,
  meta,
} from '../models/offline-db.js';
import { synchronize } from '../models/sync-queue.js';
const SessionContext = createContext(null),
  normalize = (user) =>
    user ? { ...user, photo: assetUrl(user.photo) } : null;
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        if (await meta('logout-pending').catch(() => false)) {
          if (navigator.onLine === false) {
            if (active) setUser(null);
            return;
          }
          await networkApi('/auth/logout', { method: 'POST' });
          await meta('logout-pending', undefined);
        }
        const result = await networkApi('/auth/me');
        await rememberUser(result.user).catch(() => {});
        if (active) setUser(normalize(result.user));
      } catch (e) {
        if (e.network || navigator.onLine === false) {
          if (active) setUser(normalize(await offlineUser().catch(() => null)));
        } else if (e.status === 401) {
          await forgetUser().catch(() => {});
          if (active) setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    window.addEventListener('online', restore);
    window.addEventListener('focus', restore);
    return () => {
      active = false;
      window.removeEventListener('online', restore);
      window.removeEventListener('focus', restore);
    };
  }, []);
  async function authenticate(mode, input) {
    if (await meta('logout-pending').catch(() => false)) {
      await networkApi('/auth/logout', { method: 'POST' });
      await meta('logout-pending', undefined);
    }
    const result = await networkApi('/auth/' + mode, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    await rememberUser(result.user).catch(() => {});
    setUser(normalize(result.user));
    synchronize().catch(() => {});
    return result.user;
  }
  async function refreshSession() {
    const result = await networkApi('/auth/me');
    await rememberUser(result.user).catch(() => {});
    setUser(normalize(result.user));
    return result.user;
  }
  async function logout() {
    try {
      await networkApi('/auth/logout', { method: 'POST' });
      await meta('logout-pending', undefined);
    } catch (e) {
      if (!e.network) throw e;
      await meta('logout-pending', true);
    }
    await forgetUser();
    setUser(null);
  }
  async function updateProfile(data) {
    const media = await uploadPhoto(data.get('photo'));
    const input = {
      name: data.get('name'),
      neighborhood: data.get('neighborhood'),
      bio: data.get('bio'),
      phone: data.get('phone') || undefined,
      smsOptIn: data.get('smsOptIn') === 'on',
      district: data.get('district'),
    };
    if (media) input.avatarMediaId = media.id;
    const result = await api('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    await rememberUser(result.user).catch(() => {});
    setUser(normalize(result.user));
  }
  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        authenticate,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
export const useSession = () => useContext(SessionContext);
