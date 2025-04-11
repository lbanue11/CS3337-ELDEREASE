export async function fetchEldercareByZip(zip) {
    const soapEnvelope = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetAgenciesByZip xmlns="https://tempuri.org/">
          <zip>${zip}</zip>
        </GetAgenciesByZip>
      </soap:Body>
    </soap:Envelope>
  `;

    const response = await fetch("https://eldercare.acl.gov/WebServices/EldercareData/ec_search.asmx", {
        method: "POST",
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "https://tempuri.org/GetAgenciesByZip",
        },
        body: soapEnvelope,
    });

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const results = [...xml.getElementsByTagName("AgencyData")];

    return results.map((node) => ({
        name: node.getElementsByTagName("OrgName")[0]?.textContent,
        address: node.getElementsByTagName("Address1")[0]?.textContent,
        city: node.getElementsByTagName("City")[0]?.textContent,
        state: node.getElementsByTagName("State")[0]?.textContent,
        zip: node.getElementsByTagName("Zip")[0]?.textContent,
    }));
}
