import { getCurrentTab } from './utils.js';
import { fetchWithToken } from './sf-api.js';
import { cleanQuery } from './clean.js';

export function initUIHandlers() {
  document.getElementById("toggleFieldApiNames").onclick = async () => {
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const labels = document.querySelectorAll('[data-api-name]');
        labels.forEach(el => {
          if (el.dataset.shown) {
            el.textContent = el.dataset.originalText;
            el.dataset.shown = "";
          } else {
            el.dataset.originalText = el.textContent;
            el.textContent += ` [${el.dataset.apiName}]`;
            el.dataset.shown = "true";
          }
        });
      }
    });
  };

  document.getElementById("goToSearch").onclick = async () => {
    const tab = await getCurrentTab();
    chrome.tabs.create({ url: `https://${new URL(tab.url).host}/lightning/setup/ObjectManager/home` });
  };

  document.getElementById("autoFillForm").onclick = async () => {
    const tab = await getCurrentTab();
    chrome.storage.sync.get("template", ({ template }) => {
      const data = JSON.parse(template || "{}");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => {
          Object.entries(data).forEach(([name, value]) => {
            const input = document.querySelector(`[name="${name}"]`);
            if (input) input.value = value;
          });
        },
        args: [data]
      });
    });
  };

  document.getElementById("remindFollowUp").onclick = () => {
    const mins = prompt("Remind me in how many minutes?", "5");
    const ms = parseInt(mins) * 60000;
    setTimeout(() => {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "Salesforce Reminder",
        message: "Time to follow up on your Salesforce task!",
        priority: 2
      });
    }, ms);
  };

  document.getElementById("createRecordBtn").onclick = async () => {
    const type = document.getElementById("createType").value;
    const name = document.getElementById("createName").value;
    if (!name) return alert("Name is required.");

    const payload = type === "Lead"
      ? { LastName: name, Company: "TestCo" }
      : { Subject: name, Status: "Not Started" };

    const data = await fetchWithToken(`sobjects/${type}`, "POST", payload);
    alert(data.id ? `Created ${type} with ID: ${data.id}` : "Failed to create record.");
  };

  document.getElementById("fetchRecords").onclick = async () => {
    const object = document.getElementById("objectType").value;
    const data = await fetchWithToken(`query?q=${cleanQuery(`SELECT Name FROM ${object} LIMIT 5`)}`);
    const list = document.getElementById("recordList");
    list.innerHTML = "";

    data.records?.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r.Name;
      list.appendChild(li);
    });
  };

  document.getElementById("fetchCustomObject").onclick = async () => {
    const apiName = document.getElementById("customObjectApi").value;
    if (!apiName) return alert("Enter API name.");
    const data = await fetchWithToken(`query?q=${cleanQuery(`SELECT Name FROM ${apiName} LIMIT 5`)}`);
    const list = document.getElementById("customObjectList");
    list.innerHTML = "";

    data.records?.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r.Name || "(no name)";
      list.appendChild(li);
    });
  };

  document.getElementById("lookupLinkedIn").onclick = () => {
    const name = prompt("Enter full name:");
    if (name) chrome.tabs.create({ url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}` });
  };

  document.getElementById("openDashboard").onclick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("./templates/dashboard.html") });
  };

  document.getElementById("openLogger").onclick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("./templates/logger.html") });
  };

  document.getElementById("generateCallLog").onclick = async () => {
    const name = prompt("Lead/Contact Name:");
    const topic = prompt("Call topic:");
    chrome.storage.sync.get("apiKey", async ({ apiKey }) => {
      if (!apiKey) return alert("Set API key in Settings first.");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Summarize meetings professionally." },
            { role: "user", content: `Summarize a call with ${name} about ${topic}.` }
          ]
        })
      });

      const data = await response.json();
      if (data.error) return alert(data.error.message);
      navigator.clipboard.writeText(data.choices[0].message.content);
      alert("Call log copied.");
    });
  };

  document.getElementById("validateFields").onclick = async () => {
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const rules = {
          email: /^[^@]+@[^@]+\.[^@]+$/,
          phone: /^\d{10,15}$/
        };

        const divsWithDataName = document.querySelectorAll('div[data-name]');
        Object.entries(divsWithDataName).forEach(([key, div]) => {
            const input = document.querySelector(`[name="${div.dataset.name}"]`);
            if (input && input.value.length == 0) {
                input.style.border = "2px solid red";
            }
        });

        Object.entries(rules).forEach(([field, regex]) => {
          const input = document.querySelector(`[name="${field}"]`);
          if (input && !regex.test(input.value)) {
            input.style.border = "2px solid red";
          }
        });
      }
    });
  };
}
