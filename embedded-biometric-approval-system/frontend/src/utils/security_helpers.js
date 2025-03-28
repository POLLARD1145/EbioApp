import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || "default-secret-key";

export const getSecureHeaders = () => {
  const timestamp = Date.now();
  const nonce = generateNonce();

  const signature = generateSignature(timestamp, nonce);

  return {
    "X-Timestamp": timestamp,
    "X-Nonce": nonce,
    "X-Signature": signature,
    "Content-Type": "application/json",
  };
};

const generateNonce = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const generateSignature = (timestamp, nonce) => {
  const payload = `${timestamp}:${nonce}`;
  return CryptoJS.HmacSHA256(payload, ENCRYPTION_KEY).toString();
};

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
