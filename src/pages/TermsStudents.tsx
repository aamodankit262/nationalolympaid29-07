// import { Header } from "@radix-ui/react-accordion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
const TermsStudents = () => {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 mt-48">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Terms and Conditions for Participating Students
        </h1>

        <p className="text-sm mb-6 text-center font-medium text-gray-600">
          National Financial Literacy Olympiad (NFLO) <br />
          By Sodhani Academy of Fintech Enablers Ltd
        </p>

        <ul className="list-decimal space-y-5 pl-6 text-sm">
          <li>
            <strong>Eligibility</strong><br />
            The NFLO is open to students from Classes 6 to 12, across all recognized schools in India. Participants must ensure all details submitted during registration are accurate and verifiable.
          </li>

          <li>
            <strong>Registration</strong><br />
            Participation is subject to successful registration on the official NFLO platform or through authorized school representatives. Registrations once submitted are non-refundable and non-transferable.
          </li>

          <li>
            <strong>Code of Conduct</strong><br />
            Students must maintain academic honesty and respectful behavior throughout the Olympiad. Any misconduct, including cheating or impersonation, will result in disqualification without refund.
          </li>

          <li>
            <strong>Examination Rules</strong><br />
            The Olympiad may be conducted online or offline as per the official announcement. Students are responsible for following all examination protocols, including device readiness, punctuality, and proctoring requirements.
          </li>

          <li>
            <strong>Study Material and Resources</strong><br />
            All preparatory content, mock tests, and Olympiad materials are the intellectual property of Sodhani Academy of Fintech Enablers Ltd and are to be used strictly for educational purposes only.
          </li>

          <li>
            <strong>Evaluation and Results</strong><br />
            All results, rankings, and eligibility for awards, scholarships, or certificates shall be determined solely by Sodhani Academy of Fintech Enablers Ltd, and such decisions shall be final and binding.
          </li>

          <li>
            <strong>Certification and Recognition</strong><br />
            Participants who meet qualifying criteria will be awarded digital or physical certificates. Top performers may be eligible for state- or national-level recognition, medals, or financial literacy scholarships as per the published reward structure.
          </li>

          <li>
            <strong>Data Privacy and Consent</strong><br />
            By registering, students (and their guardians, where applicable) consent to the collection and use of their personal data strictly for NFLO-related communication, administration, and publicity in accordance with applicable data protection laws.
          </li>

          <li>
            <strong>Media & Publicity Rights</strong><br />
            Participants authorize the use of their name, school name, photographs, testimonials, or Olympiad performance highlights by Sodhani Academy of Fintech Enablers Ltd for promotional and educational purposes, unless explicitly opted out in writing.
          </li>

          <li>
            <strong>Dispute Resolution</strong><br />
            All disputes related to NFLO shall be subject to the jurisdiction of the courts located in Jaipur, Rajasthan, and governed by the laws of India.
          </li>

          <li>
            <strong>Changes to Terms</strong><br />
            Sodhani Academy of Fintech Enablers Ltd reserves the right to modify the structure, timeline, rewards, or terms of the Olympiad at its sole discretion. Any updates will be communicated via the official platform.
          </li>
        </ul>
      </div>
      <Footer/>
    </>
  );
};

export default TermsStudents;


