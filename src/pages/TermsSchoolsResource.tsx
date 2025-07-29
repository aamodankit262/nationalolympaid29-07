import Footer from "@/components/Footer";
import Header from "@/components/Header";

const TermsSchoolsResource = () => {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 mt-48">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Terms and Conditions for Schools and Resource Persons
        </h1>

        <p className="text-sm mb-6 text-center font-medium text-gray-600">
          Sodhani Academy of Fintech Enablers Ltd
        </p>

        <ul className="list-disc space-y-5 pl-6 text-sm">
          <li>
            <strong>Confidentiality of Data</strong><br />
            All student data, registration details, and any shared information shall remain strictly confidential and shall be managed in full compliance with applicable data protection laws and national regulations.
          </li>

          <li>
            <strong>Use of Official Materials</strong><br />
            Only official promotional materials—including posters, creatives, and communication assets—provided or approved by Sodhani Academy of Fintech Enablers Ltd are permitted for use in any publicity, outreach, or promotional activities.
          </li>

          <li>
            <strong>Intellectual Property Protection</strong><br />
            No unauthorized use, reproduction, distribution, modification, or sharing of Sodhani Academy of Fintech Enablers Ltd’s proprietary materials, content, or intellectual property is permitted under any circumstances.
          </li>

          <li>
            <strong>Honorarium and Compensation</strong><br />
            Any honorarium or remuneration offered shall be at the sole discretion of Sodhani Academy of Fintech Enablers Ltd and does not constitute a guaranteed entitlement.
          </li>

          <li>
            <strong>Authorized Communication Channels</strong><br />
            All official communication must be conducted exclusively via designated Sodhani Academy of Fintech Enablers Ltd email addresses and authorized contact numbers to ensure authenticity and accountability.
          </li>

          <li>
            <strong>Compliance with Guidelines</strong><br />
            Schools, educational institutions, and resource persons shall adhere strictly to all operational guidelines, protocols, and instructions issued by Sodhani Academy of Fintech Enablers Ltd.
          </li>

          <li>
            <strong>Prohibition of Commercial Exploitation</strong><br />
            The commercial use, reproduction, or exploitation of Sodhani Academy of Fintech Enablers Ltd’s name, brand, materials, programs, sponsors, or associated content is strictly prohibited without prior written consent.
          </li>
        </ul>

        <p className="text-sm mt-8 text-gray-600">
          By engaging with Sodhani Academy of Fintech Enablers Ltd, all parties acknowledge and agree to abide by the above terms and conditions.
        </p>
      </div>
      <Footer/>
    </>
  );
};

export default TermsSchoolsResource;
