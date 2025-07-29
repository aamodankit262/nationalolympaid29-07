// import { Header } from "@radix-ui/react-accordion";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const PrivacyPolicy = () => {
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-10 text-sm leading-relaxed text-gray-800 mt-48">
                <h1 className="text-2xl font-bold mb-6 text-center">Privacy Policy for National Finance Olympiad – SafeFintech</h1>
                <p className="text-gray-500 text-center mb-10">Effective Date: July 9, 2025</p>

                <div className="space-y-6">
                    <div>
                        <h2 className="font-semibold text-lg mb-2">1. Introduction</h2>
                        <p>
                            Welcome to SafeFintech’s National Finance Olympiad platform: <a href="https://nationalfinanceolympiad.safefintech.in/" className="text-blue-600 underline">https://nationalfinanceolympiad.safefintech.in/</a> (“we”, “us”, or “our”). Your privacy is extremely important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you access or use our platform and services.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">2. Information We Collect</h2>
                        <p className="font-semibold">a. Personal Information You Provide</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Contact Details: name, email address, phone number</li>
                            <li>Academic Information: school, grade, and other contest details</li>
                            <li>Payment Information: collected via secure third-party gateway</li>
                        </ul>
                        <p className="font-semibold mt-2">b. Automatically Collected Data</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Technical Data: IP, browser, device, cookies, etc.</li>
                            <li>Usage Data: page views, time spent, errors, clicks</li>
                        </ul>
                        <p className="font-semibold mt-2">c. Third-Party Data</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Integration partners (e.g., payment or analytics services)</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">3. How We Use Information</h2>
                        <ul className="list-disc list-inside ml-4">
                            <li>Account management and registration</li>
                            <li>Contest entries and payments</li>
                            <li>Service notifications and updates</li>
                            <li>Platform improvement and analytics</li>
                            <li>Fraud detection and legal compliance</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">4. Data Sharing & Disclosure</h2>
                        <ul className="list-disc list-inside ml-4">
                            <li>With service providers (payment, email, analytics)</li>
                            <li>With legal authorities if required</li>
                            <li>With our affiliates for legitimate business purposes</li>
                            <li>We do <strong>not</strong> sell or rent your personal data</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">5. Cookies & Tracking Technologies</h2>
                        <p>We use cookies and analytics tools (e.g., Google Analytics). You can manage cookies in your browser. Disabling them may limit functionality.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">6. Data Retention</h2>
                        <p>We retain personal data as needed for contest or legal purposes. Technical data may be kept up to 24 months unless longer required by law.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">7. Security</h2>
                        <p>We use encryption, access control, and secure servers to protect your data. While no system is foolproof, we work hard to protect it.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">8. Children’s Privacy</h2>
                        <p>Services are intended for users 13+. Parental consent may be required under 18. We do not collect data from children under 13 knowingly.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">9. Your Rights</h2>
                        <ul className="list-disc list-inside ml-4">
                            <li>Access, correct, or update your data</li>
                            <li>Request deletion or restriction</li>
                            <li>Object to processing</li>
                            <li>Request data portability</li>
                            <li>Contact authority for complaints</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">10. International Data Transfers</h2>
                        <p>We may store/process your data outside your country. We ensure safeguards like GDPR compliance are in place.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">11. Third-Party Links</h2>
                        <p>We’re not responsible for privacy on third-party websites. Always review their privacy policies.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">12. Policy Changes</h2>
                        <p>We may update this policy. For major changes, we’ll notify via email or platform. Effective date is always shown at the top.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">13. Contact Us</h2>
                        <p>Email: <a href="mailto:privacy@safefintech.in" className="text-blue-600 underline">privacy@safefintech.in</a></p>
                        <p>Postal Address: SafeFintech Privacy Officer, Sodhani House, C 373, C Block, Behind Amar Jain Hospital, Amrapali Circle, Vaishali Nagar, Jaipur 302021, India</p>
                        <p>Website: <a href="https://nationalfinanceolympiad.safefintech.in" className="text-blue-600 underline">nationalfinanceolympiad.safefintech.in</a></p>
                        <p className="mt-2 text-gray-600 text-sm">Financial Literacy Olympiad 2025 by Sodhani Academy of Fintech Enablers Limited. Empower. Educate. Excel.</p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>

    );
};

export default PrivacyPolicy;
