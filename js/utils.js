import { loadFromStorage } from './storage.js';

export const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

export const isConnected = async () => {
    const { sfToken, sfInstanceUrl } = await loadFromStorage(["sfToken", "sfInstanceUrl"]);
    if (sfToken && sfInstanceUrl) {
        const button = document.getElementById("loginSalesforce");
        button.disabled = true;
    }
};
