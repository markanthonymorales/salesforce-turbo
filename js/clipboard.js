import { getCurrentTab } from './utils.js';

export function initClipboardHandlers() {
  document.getElementById("copyRecordId").onclick = async () => {
    const tab = await getCurrentTab();

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const match = location.href.match(/([a-zA-Z0-9]{15,18})/);
        return match ? match[1] : '';
      }
    });

    if (!result) {
      alert("No record ID found.");
      return;
    }

    alert(`Record ID copied: ${result}`);
    navigator.clipboard.writeText(result);
  };

  document.getElementById("copyRecordUrl").onclick = async () => {
    const tab = await getCurrentTab();
    navigator.clipboard.writeText(tab.url);
    alert("URL copied!");
  };
}
