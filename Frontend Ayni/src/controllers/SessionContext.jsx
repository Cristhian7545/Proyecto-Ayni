import { createContext, useContext, useEffect, useState } from 'react';
import { api, uploadPhoto, assetUrl } from '../models/api.js';
const SessionContext = createContext(null);
const normalize = (user) =>
  user ? { ...user, photo: assetUrl(user.photo) } : null;
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api('/auth/me')
      .then((result) => {
        if (active) setUser(normalize(result.user));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function authenticate(mode, input) {
    const result = await api(`/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    setUser(normalize(result.user));
    return result.user;
  }
  async function logout() {
    await api('/auth/logout', { method: 'POST' });
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
    setUser(normalize(result.user));
  }
  return (
    <SessionContext.Provider
      value={{ user, loading, authenticate, logout, updateProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
}
export function useSession() {
  return useContext(SessionContext);
}
