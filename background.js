chrome.runtime.onInstalled.addListener(() => {
  console.log("Salesforce Turbo installed.");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) return;
  console.log(tab.url);
  if (tab.url.includes("salesforce.com") || tab.url.includes("force.com")) {
    chrome.action.setPopup({ tabId, popup: "popup.html" });
    chrome.action.enable(tabId);
  } else {
    chrome.action.setPopup({ tabId, popup: "" });
    chrome.action.disable(tabId);
  }
});
