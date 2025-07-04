import { logToSalesforce } from './sf-api.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("logToSalesforce").onclick = async () => {
    const subject = document.getElementById("subject").value;
    const content = document.getElementById("content").value;

    await logToSalesforce(subject, content);
    alert(`Successfully logged ${subject}.`);
  };
});