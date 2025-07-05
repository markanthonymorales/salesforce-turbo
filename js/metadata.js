import { fetchWithToken, fetchSOAPAction } from './sf-api.js';
import { loadFromStorage } from './storage.js';
import { buildDeployRequest, checkDeployStatus } from './metadata-deploy.js';
import JSZip from '../lib/jszip/jszip.js';

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('deployZipBtn').onclick = async () => {
    const fileInput = document.getElementById('zipFileInput');
    const file = fileInput.files[0];
    if (!file) return alert('Select a .zip file first.');

    const reader = new FileReader();
    reader.onload = async () => {
      const zipBinary = new Uint8Array(reader.result);
      const zipBase64 = btoa(String.fromCharCode(...zipBinary));
      const { sfToken } = await loadFromStorage(['sfToken']);
      if (!sfToken) return alert('Connect to Salesforce first.');

      const soupXml = await buildDeployRequest(zipBase64, sfToken);
      const res = await fetchSOAPAction(soupXml);
      const asyncId = res.match(/<id>(.*?)<\/id>/)?.[1];
      if (!asyncId) {
        document.getElementById('deployStatus').textContent = 'Something went wrong...';
        return;
      }

      const soupXmlChecker = await checkDeployStatus(sfToken, asyncId);
      document.getElementById('deployStatus').textContent = '[Check Status]\n' + await fetchSOAPAction(soupXmlChecker);

      // log deployment as task
      await fetchWithToken(`sobjects/Task`, "POST", {
        Subject: 'Deploy Status',
        Description: soupXml.slice(0, 1000),
        Status: 'Completed'
      });
    };
    reader.readAsArrayBuffer(file);
  };

  document.getElementById('addClass').onclick = () => {
    const clone = document.getElementById('classInputs').children[0].cloneNode(true);
    
    document.getElementById('classInputs').appendChild(clone);
  };

  document.getElementById('removedClass').onclick = (e) => {
    if (document.getElementById('classInputs').children.length == 1) return;
    e.target.parentNode.remove();
  };

  document.getElementById('generateZip').onclick = async () => {
    const zip = new JSZip();
    const classBlocks = document.querySelectorAll('.class-block');
    let members = [];
    let hasError = false;
    classBlocks.forEach((block) => {
      const nameInput = block.querySelector('.className');
      const name = nameInput.value.trim();
      const content = block.querySelector('.classContent').value;

      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        nameInput.classList.add('error');
        hasError = true;
      } else {
        nameInput.classList.remove('error');
      }

      if (!name || !content) return;
      zip.file(`classes/${name}.cls`, content);
      zip.file(`classes/${name}.cls-meta.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">\n<apiVersion>58.0</apiVersion>\n<status>Active</status>\n</ApexClass>`);
      members.push(name);
    });
    if (hasError) return alert('Please fix invalid class names.');
    zip.file('package.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n<types>\n${members.map(m => `<members>${m}</members>`).join('')}\n<name>ApexClass</name>\n</types>\n<version>58.0</version>\n</Package>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('downloadLink');
    link.href = url;
    link.style.display = 'block';
  };

  document.getElementById('runTest').onclick = async () => {
      const classCode = document.getElementById('testClassCode').value;
      const json = await fetchWithToken(`tooling/sobjects/ApexClass`, "POST", { Name: 'TestRunner', Body: classCode });
      const result = JSON.stringify(json, null, 2);
      document.getElementById('testResult').textContent = result;
    };

    document.getElementById('lintBtn').onclick = () => {
      const code = document.getElementById('lintCode').value;
      const warnings = [];
      if (!code.includes('public class')) warnings.push('Missing "public class" declaration.');
      if (!code.includes('{') || !code.includes('}')) warnings.push('Check for open/close braces.');
      if (!/\bSystem\.debug\b/.test(code)) warnings.push('No debug logs present.');
      document.getElementById('lintResult').textContent = warnings.length ? warnings.join('\n') : 'No issues detected.';
    };
});