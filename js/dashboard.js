import { cleanQuery } from './clean.js';
import { fetchWithToken } from './sf-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch lead count by month
  const leads = await fetchWithToken(`query?q=${cleanQuery(`
    SELECT CALENDAR_MONTH(CreatedDate) month, COUNT(Id) total FROM Lead
    WHERE CreatedDate = LAST_N_MONTHS:6 GROUP BY CALENDAR_MONTH(CreatedDate)
  `)}`);

  const months = leads.records.map(r => `Month ${r.month}`);
  const counts = leads.records.map(r => r.total);

  new Chart(document.getElementById("leadChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [{ label: "Leads", data: counts, backgroundColor: "#0070d2" }]
    }
  });

  
  // Fetch top 5 opportunities
  const opps = await fetchWithToken(`query?q=${cleanQuery(`
    SELECT Name, Amount FROM Opportunity ORDER BY Amount DESC LIMIT 5
  `)}`);
  
  const oppLabels = opps.records.map(o => o.Name);
  const oppData = opps.records.map(o => o.Amount);

  new Chart(document.getElementById("opportunityChart"), {
    type: "pie",
    data: {
      labels: oppLabels,
      datasets: [{ data: oppData, backgroundColor: ["#0070d2", "#00a1e0", "#17c4ff", "#38d9a9", "#90ee90"] }]
    }
  });
});
