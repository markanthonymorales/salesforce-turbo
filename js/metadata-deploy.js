export async function buildDeployRequest(zipBase64, sessionId) {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:met="http://soap.sforce.com/2006/04/metadata">
      <soapenv:Header>
        <met:SessionHeader>
          <met:sessionId>${sessionId}</met:sessionId>
        </met:SessionHeader>
      </soapenv:Header>
      <soapenv:Body>
        <met:deploy>
          <met:ZipFile>${zipBase64}</met:ZipFile>
          <met:DeployOptions>
            <met:performRetrieve>false</met:performRetrieve>
            <met:rollbackOnError>true</met:rollbackOnError>
            <met:checkOnly>false</met:checkOnly>
            <met:singlePackage>true</met:singlePackage>
            <met:testLevel>NoTestRun</met:testLevel>
          </met:DeployOptions>
        </met:deploy>
      </soapenv:Body>
    </soapenv:Envelope>
  `.trim();
};

export async function checkDeployStatus(sessionId, asyncId) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:met="http://soap.sforce.com/2006/04/metadata">
      <soapenv:Header>
        <met:SessionHeader><met:sessionId>${sessionId}</met:sessionId></met:SessionHeader>
      </soapenv:Header>
      <soapenv:Body>
        <met:checkDeployStatus>
          <met:asyncProcessId>${asyncId}</met:asyncProcessId>
          <met:includeDetails>true</met:includeDetails>
        </met:checkDeployStatus>
      </soapenv:Body>
    </soapenv:Envelope>`.trim();
};