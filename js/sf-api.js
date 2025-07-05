import { loadFromStorage } from './storage.js';

export async function fetchWithToken(path, method = "GET", body) {
  const { sfToken, sfInstanceUrl } = await loadFromStorage(["sfToken", "sfInstanceUrl"]);
  if (!sfToken || !sfInstanceUrl) throw new Error("Not connected to Salesforce");

  const url = `${sfInstanceUrl}/services/data/v58.0/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${sfToken}`,
      "Content-Type": "application/json"
    },
    ...(body && { body: JSON.stringify(body) })
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    alert("Unexpected response from Salesforce.");
    throw e;
  }

  if (!res.ok) {
    const message = Array.isArray(data) && data[0]?.message
      ? data[0].message
      : data.message || "Unknown error";

    alert(`Salesforce error: ${message}`);
    throw new Error(message);
  }

  return data;
}

export async function fetchSOAPAction(soapXml, method = "POST") {
  const { sfToken, sfInstanceUrl } = await loadFromStorage(["sfToken", "sfInstanceUrl"]);
  if (!sfToken || !sfInstanceUrl) throw new Error("Not connected to Salesforce");

  const res = await fetch(`${sfInstanceUrl}/services/Soap/m/58.0`, {
      method,
      headers: {
          'Content-Type': 'text/xml',
          'SOAPAction': 'deploy'
      },
      body: soapXml
  });

  let data;
  try {
    data = await res.text();
  } catch (e) {
    alert("Unexpected response from Salesforce.");
    throw e;
  }

  if (!res.ok) {
    const message = Array.isArray(data) && data[0]?.message
      ? data[0].message
      : data.message || "Unknown error";

    alert(`Salesforce error: ${message}`);
    throw new Error(message);
  }

  return data;
}

export async function logToSalesforce(subject, content) {
  return await fetchWithToken("sobjects/Task", "POST", {
    Subject: subject,
    Description: content,
    Status: "Completed"
  });
}

export async function loadObject() {
  return (
      await fetchWithToken(`sobjects`)
  )?.sobjects.map((f) => f.name);
}
