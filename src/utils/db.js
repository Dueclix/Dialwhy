import { openDB } from "idb";

const dbInstance = openDB("dialwhy", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("blobs")) {
      db.createObjectStore("blobs");
    }
  },
});

export async function saveBlob(key, blob) {
  const db = await dbInstance;
  await db.put("blobs", blob, key);
}

export async function getBlob(key) {
  const db = await dbInstance;
  return db.get("blobs", key);
}

export async function deleteBlob(key) {
  const db = await dbInstance;
  await db.delete("blobs", key);
}
