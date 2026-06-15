const DB_NAME = 'LearningTrackerDB';
const DB_VERSION = 1;
const STORES = ['progress', 'daily_progress', 'topics', 'notes', 'quiz_history'];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function cacheData(storeName, data) {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    if (Array.isArray(data)) {
      for (const item of data) {
        store.put(item);
      }
    } else {
      store.put(data);
    }

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB cache error:', err);
  }
}

export async function getCachedData(storeName) {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const all = store.getAll();

    return new Promise((resolve, reject) => {
      all.onsuccess = () => resolve(all.result);
      all.onerror = () => reject(all.error);
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return [];
  }
}

export async function clearCache() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES, 'readwrite');
    for (const storeName of STORES) {
      tx.objectStore(storeName).clear();
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear error:', err);
  }
}

export function isOnline() {
  return navigator.onLine;
}
