import axios from "axios";

const ELDERCARE_API_URL = "https://eldercare.acl.gov/WebServices/EldercareData/ec_search.asmx";
const USERNAME = "Mmoc39439";
const PASSWORD = "Hosdm3920!11";

export const getEldercareByZip = async (zip) => {
    const xmlBody = `
    <soap:Envelope xmlns:soap="https://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetAgenciesByZip xmlns="https://eldercare.acl.gov/WebServices/EldercareData">
          <zip>${zip}</zip>
          <UserID>${USERNAME}</UserID>
          <Password>${PASSWORD}</Password>
        </GetAgenciesByZip>
      </soap:Body>
    </soap:Envelope>
  `;

    try {
        const response = await axios.post(ELDERCARE_API_URL, xmlBody, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                SOAPAction: "https://eldercare.acl.gov/WebServices/EldercareData/GetAgenciesByZip",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Eldercare API error:", error);
        throw error;
    }
};