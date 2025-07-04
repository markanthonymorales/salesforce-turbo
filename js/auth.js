import { saveToStorage, loadFromStorage } from './storage.js';
import { cleanUrl } from './clean.js';

export async function initAuth() {
  const { clientId } = await loadFromStorage(["clientId"]);
  const REDIRECT_URI = chrome.identity.getRedirectURL();

  document.getElementById("loginSalesforce").addEventListener("click", () => {
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async redirectUrl => {
      const tokenMatch = redirectUrl?.match(/access_token=([^&]+)/);
      const instanceMatch = redirectUrl?.match(/instance_url=([^&]+)/);
      if (tokenMatch && instanceMatch) {
        const accessToken = cleanUrl(tokenMatch[1]);
        const instanceUrl = cleanUrl(instanceMatch[1]);

        await saveToStorage({ sfToken: accessToken, sfInstanceUrl: instanceUrl });
        alert("Salesforce connected!");
      } else {
        alert("Failed to authenticate.");
      }
    });
  });
}

