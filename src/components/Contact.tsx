
import { Phone, Mail, MapPin, Globe, Clock, Building, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold font-poppins mb-6">
            Get in <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about the National Financial Literacy Olympiad? We're here to help! 
            Contact us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-poppins">
                Contact Information
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Reach out to Sodhani Academy of Fintech Enablers Limited for any queries 
                related to registration, examination, or general information.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Phone Numbers</h4>
                    <p className="text-gray-600">+91 90570 90999</p>
                    <p className="text-gray-600">+91 92516 67818</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Email</h4>
                    <p className="text-gray-600">info@safefintech.in</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">Website</h4>
                    <a 
                      href="https://www.safefintech.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors underline"
                    >
                      www.safefintech.in
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Corporate Office */}
          <div className="animate-scale-in">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="flex items-center space-x-3 mb-4 relative z-10">
                  <Building className="w-8 h-8" />
                  <h3 className="text-2xl font-bold font-poppins">Corporate Office</h3>
                </div>
                <p className="text-white/90">Sodhani Academy of Fintech Enablers Limited</p>
                <p className="text-sm text-white/80">(A Bombay Stock Exchange Listed Company)</p>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Sodhani House, C 373, C Block,<br />
                        Behind Amar Jain Hospital, Amrapali Circle,<br />
                        Vaishali Nagar, Jaipur 302021
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Office Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                {/* <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-gradient-to-r from-indigo-200 to-pink-200">
                  <h5 className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">QR Code for Quick Access</h5>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan the QR code on our poster to quickly access the Google Form link for registration and more information.
                  </p>
                  <img src="/assets/SCANNER.png" style={{width: '150px'}} alt="scanner" />
                  <div className="text-xs text-gray-500">
                    * QR code available on the official competition poster
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 -translate-x-10"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 translate-x-8"></div>
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4 font-poppins relative z-10">
              Need Support?
            </h3>
            <p className="mb-6 leading-relaxed relative z-10">
              Our dedicated support team is ready to assist you with registration, 
              technical issues, or any questions about the competition format and syllabus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a 
                href="tel:9057090999"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              <a 
                href="mailto:info@safefintech.in"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
