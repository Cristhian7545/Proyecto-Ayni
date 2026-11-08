import { openDB } from 'idb';
let connection;
let tabOwner = null;
export const getTabOwner = () => tabOwner;
export function localDB() {
  if (!globalThis.indexedDB)
    return Promise.reject(
      new Error(
        'Este navegador no permite guardar datos offline. Habilita el almacenamiento local.',
      ),
    );
  return (connection ??= openDB('ayni-offline-v1', 1, {
    upgrade(db) {
      db.createObjectStore('meta');
      const queue = db.createObjectStore('queue', { keyPath: 'clientId' });
      queue.createIndex('owner', 'ownerId');
      const cache = db.createObjectStore('snapshots', { keyPath: 'key' });
      cache.createIndex('owner', 'ownerId');
    },
  }).catch((e) => {
    connection = undefined;
    throw e;
  }));
}
export async function meta(key, value) {
  const db = await localDB();
  if (arguments.length === 1) return db.get('meta', key);
  if (value === undefined) return db.delete('meta', key);
  return db.put('meta', value, key);
}
export const currentOwner = async () => (await meta('active-owner')) || 'guest';
export async function rememberUser(user) {
  const previous = await meta('profile:' + user.id);
  if (previous && previous.district !== user.district)
    await clearSnapshots(user.id);
  await meta('profile:' + user.id, {
    id: user.id,
    name: user.name,
    district: user.district,
    neighborhood: user.neighborhood,
    bio: user.bio,
    photo: user.photo,
  });
  await meta('active-owner', user.id);
  tabOwner = user.id;
  await meta('logout-pending', undefined);
}
export async function offlineUser() {
  if (await meta('logout-pending')) return null;
  const owner = await currentOwner(),
    user = await meta('profile:' + owner);
  tabOwner = user ? owner : null;
  return user ? { ...user, role: 'neighbor', offline: true } : null;
}
export async function clearSnapshots(owner) {
  const db = await localDB(),
    tx = db.transaction('snapshots', 'readwrite'),
    keys = await tx.store.index('owner').getAllKeys(owner);
  for (const key of keys) await tx.store.delete(key);
  await tx.done;
}
export async function forgetUser() {
  const owner = await currentOwner();
  await clearSnapshots(owner);
  await meta('profile:' + owner, undefined);
  await meta('active-owner', undefined);
  tabOwner = null;
}
export async function saveSnapshot(owner, path, data) {
  const db = await localDB();
  await db.put('snapshots', {
    key: owner + '|' + path,
    ownerId: owner,
    data,
    at: Date.now(),
  });
  const entries = await db.getAllFromIndex('snapshots', 'owner', owner);
  if (entries.length > 100) {
    entries.sort((a, b) => a.at - b.at);
    for (const e of entries.slice(0, entries.length - 100))
      await db.delete('snapshots', e.key);
  }
}
export async function readSnapshot(owner, path) {
  const row = await (await localDB()).get('snapshots', owner + '|' + path);
  if (!row || Date.now() - row.at > 7 * 86400000) return null;
  return { ...row.data, __offline: true, __cachedAt: row.at };
}
export async function pendingFor(owner) {
  return (
    await (await localDB()).getAllFromIndex('queue', 'owner', owner)
  ).sort((a, b) => a.createdAt - b.createdAt);
}
export async function storePending(item) {
  return (await localDB()).put('queue', item);
}
export async function removePending(clientId, owner) {
  const db = await localDB(),
    tx = db.transaction('queue', 'readwrite'),
    item = await tx.store.get(clientId);
  if (item?.ownerId === owner) await tx.store.delete(clientId);
  await tx.done;
}
export function changed() {
  globalThis.window?.dispatchEvent(new Event('ayni:offline-updated'));
}
export async function closeLocalDB() {
  if (connection) (await connection).close();
  connection = undefined;
}
