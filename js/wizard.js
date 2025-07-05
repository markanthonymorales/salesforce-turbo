import { fetchWithToken, loadObject } from "./sf-api.js";
import { saveToStorage, loadFromStorage } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const sourceSelect = document.getElementById("sourceObject");
  const targetSelect = document.getElementById("targetObject");
  const tableBody = document.querySelector("#mappingTable tbody");
  const previewTable = document.getElementById("previewTable");
  const notAllowed = ['Id', 'LastModifiedDate', 'Name', 'CreatedById', 'PhotoUrl', 'MailingAddress', 'SystemModstamp', 'CreatedDate', 'LastModifiedById'];

  const objects = await loadObject();
  objects.forEach((obj) => {
      const opt1 = document.createElement("option");
      opt1.value = opt1.textContent = obj;
      const opt2 = opt1.cloneNode(true);
      sourceSelect.appendChild(opt1);
      targetSelect.appendChild(opt2);
  });

  document.getElementById("clearFields").onclick = async () => {
    tableBody.innerHTML = "";
  };

  document.getElementById("loadFields").onclick = async () => {
    const sourceObject = sourceSelect.value;
    const targetObject = targetSelect.value;

    const sourceFields = (
      await fetchWithToken(`sobjects/${sourceObject}/describe`)
    )?.fields.map((f) => f.name);
    const targetFields = (
      await fetchWithToken(`sobjects/${targetObject}/describe`)
    )?.fields.map((f) => f.name);

    tableBody.innerHTML = "";
    sourceFields.forEach((f) => {
      if (notAllowed.includes(f)) return;

      const row = document.createElement("tr");
      row.innerHTML = `<td>${f}</td><td><select class="form-control">${targetFields
        .map(
          (tf) => {
            if (notAllowed.includes(tf)) return;

            return `<option ${
              (tf == f || tf.includes(f)) ? "selected" : ""
            }>${tf}</option>`;
        })
        .join(
          ""
        )}</select></td><td><button class="btn button btn-danger removeRow">Remove</button></td>`;
      tableBody.appendChild(row);
    });

    tableBody.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("removeRow")) {
        e.target.closest("tr").remove();
      }
    });
  };

  document.getElementById("saveMapping").onclick = async () => {
    const project = document.getElementById("mappingProject").value;
    const mappings = [...tableBody.querySelectorAll("tr")].map((row) => ({
      source: row.children[0].textContent,
      target: row.children[1].querySelector("select").value,
    }));

    await saveToStorage({ ["map_" + project]: mappings });
    alert("Mapping saved as " + project);
  };

  document.getElementById("exportMapping").onclick = async () => {
    const project = document.getElementById("mappingProject").value;
    const items = await loadFromStorage(["map_" + project]);
    const blob = new Blob([JSON.stringify(items["map_" + project], null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = project + ".json";
    link.click();
  };

  document.getElementById("importJson").addEventListener("change", (event) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const mappings = JSON.parse(reader.result);
      await saveToStorage({ importedMap: mappings });
      alert("Mapping imported to temp key.");
    };
    reader.readAsText(file);
  });

  document.getElementById("previewData").onclick = async () => {
    const source = sourceSelect.value;
    const project = document.getElementById("mappingProject").value;
    const mappings = await loadFromStorage(["map_" + project]);
    const fieldList = mappings["map_" + project].map((m) => m.source).join(",");
    
    const data = await fetchWithToken(
      `query?q=SELECT ${fieldList} FROM ${source} LIMIT 10`
    );

    const mapPairs = mappings["map_" + project];

    previewTable.querySelector("thead tr").innerHTML = mapPairs
      .map((m) => `<th>${m.target}</th>`)
      .join("");
    previewTable.querySelector("tbody").innerHTML = data.records
      .map((r) => {
        return `<tr>${mapPairs
          .map((m) => `<td>${r[m.source] ?? ""}</td>`)
          .join("")}</tr>`;
      })
      .join("");
  };

  document.getElementById("migrateRecords").onclick = async () => {
    const source = sourceSelect.value;
    const target = targetSelect.value;
    const project = document.getElementById("mappingProject").value;
    const mappings = await loadFromStorage(["map_" + project]);
    const fieldList = mappings["map_" + project].map((m) => m.source).join(",");

    const data = await fetchWithToken(
      `query?q=SELECT ${fieldList} FROM ${source} LIMIT 10`
    );

    let success = 0;
    for (const rec of data.records) {
      const payload = {};
      for (const m of mappings["map_" + project]) {
        if (rec[m.source]) payload[m.target] = rec[m.source] ?? (m.target.startsWith('is') ? false : '');
      }

      const result = await fetchWithToken(`sobjects/${target}`, "POST", payload);
      if (result.id) success++;
    }

    document.getElementById(
      "migrateStatus"
    ).textContent = `${success} of ${data.records.length} records migrated.`;
  };
});
