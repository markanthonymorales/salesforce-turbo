import { saveToStorage, loadFromStorage } from './storage.js';

document.getElementById("saveOpenAPI").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  const template = document.getElementById("template").value;

  await saveToStorage({ apiKey, template });
  alert("Successfully save changes on Open API.");
});

document.getElementById("saveSalesforceAPI").addEventListener("click", async () => {
  const clientId = document.getElementById("clientId").value;

  await saveToStorage({ clientId });
  alert("Successfully save changes on Client API.");
});

window.onload = async () => {
  const { apiKey, template, clientId } = await loadFromStorage(["apiKey", "template", "clientId"]);
  document.getElementById("apiKey").value = apiKey || "";
  document.getElementById("template").value = template || "";
  document.getElementById("clientId").value = clientId || "";
};
