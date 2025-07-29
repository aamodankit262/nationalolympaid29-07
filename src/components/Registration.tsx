
import { Calendar, Users, Award, CheckCircle, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import RoleSelectionDialog from '@/components/RoleSelectionDialog';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

const Registration = () => {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const navigate = useNavigate();

  const benefits = [
    "Develop essential money management skills",
    "Compete with top students across India",
    "Win exciting prizes worth lakhs",
    "Get certificates and recognition",
    "Access to financial literacy resources"
  ];

  // const handleRegisterClick = () => {
  //   setShowRoleDialog(true);
  // };

  const handleRoleSelect = (role: string) => {
    // console.log('Role selected:', role);
    setShowRoleDialog(false);

    // Navigate to different registration forms based on role
    console.log('Navigating to register for role:', role);
    if (role === 'student') {
      navigate('/student-registration');
    } else if (role === 'institute') {
      navigate('/institute-registration');
    } else if (role === 'resource') {
      navigate('/resource-person-registration');
    }
  };

  return (
    <section id="register" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-xl animate-float"></div> */}

      {/* Floating Financial Icons */}
      {/* <div className="absolute top-20 left-20 animate-float opacity-30">
        <BookOpen className="w-8 h-8 text-cyan-300" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute top-32 right-32 animate-float opacity-30">
        <DollarSign className="w-6 h-6 text-green-300" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="absolute bottom-40 left-32 animate-float opacity-30">
        <Target className="w-7 h-7 text-blue-300" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute bottom-20 right-20 animate-float opacity-30">
        <Trophy className="w-6 h-6 text-yellow-300" style={{ animationDelay: '2.5s' }} />
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold font-poppins mb-6 text-white">
            Ready to <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Register?</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students in this exciting financial literacy competition.
            Registration opens on 15th July 2025 - be among the first to secure your spot!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Registration Form Preview */}
          <div className="animate-fade-in">
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <Calendar className="w-12 h-12 mx-auto mb-4 " />
                  <h3 className="text-2xl font-bold mb-2 font-poppins">Registration Opens</h3>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">15th July</div>
                  <p className="text-blue-100">2025</p>
                </div>
              </div>
              <CardContent className="p-8">
                <h4 className="text-xl font-semibold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Registration Benefits:</h4>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Updated "Why Financial Literacy Matters" box */}
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 rounded-xl border-2 border-gradient-to-r from-blue-200 to-indigo-200 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-lg"></div>
                  <div className="relative z-10">
                    <h5 className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Why Financial Literacy Matters:
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Master essential money management and budgeting skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Learn investment strategies and financial planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">•</span>
                        <span>Understand banking, insurance, and digital finance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-600 font-bold">•</span>
                        <span>Build confidence for future financial decisions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="space-y-8 animate-scale-in">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-white font-poppins">
                Don't Miss This <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Opportunity!</span>
              </h3>
              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                The National Financial Literacy Olympiad 2025 is your chance to showcase your financial knowledge,
                learn essential life skills, and win amazing prizes. Registration is completely online
                and will be available through our secure platform.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-scale-in">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-300">4</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-300">₹21 Lakhs</div>
                  <div className="text-sm text-blue-200">Prize Pool</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-300">60</div>
                  <div className="text-sm text-blue-200">Minutes</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <h4 className="text-xl font-semibold mb-4 text-white">Registration Process:</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 animate-fade-in">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                  <span className="text-blue-100">Visit our official website</span>
                </div>
                <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                  <span className="text-blue-100">Fill the registration form</span>
                </div>
                <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">3</div>
                  <span className="text-blue-100">Get confirmation & exam details</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                // onClick={handleRegisterClick}
                onClick={() => navigate('/role-selection')}

                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2 w-full sm:w-auto border-0"
              >
                <span>Register Now</span>
                <Trophy className="w-5 h-5 animate-bounce" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-cyan-400 bg-white/10 backdrop-blur-sm text-cyan-300 hover:bg-cyan-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Dialog */}
      <RoleSelectionDialog
        open={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        onRoleSelect={handleRoleSelect}
      />
    </section>
  );
};

export default Registration;
