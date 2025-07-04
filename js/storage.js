import { encryptText, decryptText } from './crypto.js';

export async function saveToStorage(data) {
  const encryptedData = {};
  for (const key in data) {
    if (key === "sfToken" || key === "sfInstanceUrl" || key === "apiKey" || key === "clientId") {
      encryptedData[key] = await encryptText(data[key]);
    } else {
      encryptedData[key] = data[key];
    }
  }
  return new Promise(resolve => chrome.storage.sync.set(encryptedData, resolve));
}

export async function loadFromStorage(keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, async result => {
      const decryptedResult = {};

      for (const key of keys) {
        const value = result[key];
        // If value is in encrypted object format, decrypt it
        if (
          value &&
          typeof value === "object" &&
          value.iv && Array.isArray(value.iv) &&
          value.data && Array.isArray(value.data)
        ) {
          try {
            decryptedResult[key] = await decryptText(value);
          } catch (e) {
            console.error(`Failed to decrypt ${key}:`, e);
            decryptedResult[key] = null;
          }
        } else {
          decryptedResult[key] = value;
        }
      }

      resolve(decryptedResult);
    });
  });
}
