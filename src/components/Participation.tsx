
import { GraduationCap, Users, Award, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Participation = () => {
  const navigate = useNavigate()
  // const scrollToSection = (sectionId: string) => {
  //   const element = document.getElementById(sectionId);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  const categories = [
    {
      title: "Class 6th & 8th",
      icon: Star,
      description: "For students in grades 6th to 8th",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      features: ["Age-appropriate questions", "Foundation level concepts", "Basic financial literacy"]
    },
    {
      title: "Class 9th & 10th",
      icon: GraduationCap,
      description: "For students in grades 9th & 10th",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      features: ["Intermediate level questions", "Intermediate level concepts", "Moderate financial literacy"]
    },
    {
      title: "Class 11th & 12th",
      icon: Users,
      description: "For senior secondary students",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      features: ["Intermediate level questions", "Real-world scenarios", "Proficient financial literacy"]
    },
    {
      title: "Graduates",
      icon: Award,
      description: "For college graduates",
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-50",
      features: ["Advanced concepts", "Career-focused content", "Financial planning"]
    },

  ];

  return (
    <section id="participation" className="py-20 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold font-poppins mb-6">
            Who Can <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">Participate?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The National Financial Literacy Olympiad 2025 is open to students and young professionals across India.
            Choose your category and start your journey to financial excellence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {categories.map((category, index) => (
            <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-br ${category.bgGradient}`}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent font-poppins`}>{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Eligibility Criteria */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="animate-fade-in">
            {/* <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-poppins">Eligibility Criteria</h3> */}
            <div className="space-y-6">
              {/* <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Age Requirements</h4>
                  <p className="text-gray-600">Must be between 14-30 years of age at the time of registration</p>
                </div>
              </div> */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Educational Status</h4>
                  <p className="text-gray-600">Currently enrolled in school/college/university or graduated within last 5 years</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Registration</h4>
                  <p className="text-gray-600">Complete online registration with valid details</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-green-50 via-teal-50 to-blue-50 p-6 rounded-xl border border-gradient-to-r from-green-200 to-blue-200">
              <h4 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Find Your Category!</h4>
              <p className="text-gray-600 mb-4">Join the competition that matches your educational level and start your financial literacy journey.</p>
              <Button
                // onClick={() => scrollToSection('register')}
                onClick={() => navigate('/role-selection')}

                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Register Today <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="animate-scale-in">
            <div className="bg-gradient-to-br from-teal-500 via-blue-500 to-purple-500 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 font-poppins">What You'll Gain</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Comprehensive financial literacy assessment</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Certificates for all participants</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Mega prizes for top performers at various level</span>
                    {/* <span>Cash prizes for top performers</span> */}
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>
                      50% scholarship on courses offered by{" "}
                      <a
                        href="https://www.safefintech.in/"
                        className = "text-black font-bold underline transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SAFE Ltd – Click here
                      </a>  
                    </span>

                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>Recognition and career boost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Process */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 text-center animate-fade-in shadow-lg">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-poppins">Simple Registration Process</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">1</div>
              <h4 className="font-semibold text-gray-800 mb-2">Choose Category</h4>
              <p className="text-gray-600 text-sm">Select your appropriate category based on education level</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">2</div>
              <h4 className="font-semibold text-gray-800 mb-2">Fill Details</h4>
              <p className="text-gray-600 text-sm">Complete the online registration form with required information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">3</div>
              <h4 className="font-semibold text-gray-800 mb-2">Confirmation</h4>
              <p className="text-gray-600 text-sm">Receive confirmation email with exam details and schedule</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">4</div>
              <h4 className="font-semibold text-gray-800 mb-2">Take Exam</h4>
              <p className="text-gray-600 text-sm">Participate in the 60-minute online examination</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Participation;
