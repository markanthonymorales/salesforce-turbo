const ENCRYPTION_SECRET = 's3cr3t_passphras3_for_extension'; // Make this long and hard to guess

async function getCryptoKey() {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_SECRET),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("sf_extension_salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(plainText) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey();
  const enc = new TextEncoder().encode(plainText);
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc);
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

export async function decryptText(encryptedObj) {
  const key = await getCryptoKey();
  const iv = new Uint8Array(encryptedObj.iv);
  const data = new Uint8Array(encryptedObj.data);
  const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}
