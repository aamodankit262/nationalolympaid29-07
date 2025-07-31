
import { BookOpen, Target, Users, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate()
  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins mb-4 sm:mb-6">
            About the <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">Olympiad</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            The National Financial Literacy Olympiad 2025 is India's premier competition designed to enhance 
            financial awareness and money management skills among students and young professionals, to fight against  
            financial cyber crime, fraud and scam.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-poppins">Our Mission</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                To empower the next generation with essential financial literacy skills through 
                engaging competition format. We aim to make financial education accessible, 
                interesting, and practical for students across India.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-gradient-to-b  p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Why Financial Literacy Matters</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  In today's complex financial world, understanding money management, investments, 
                  and financial planning is crucial for personal and professional success.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">For Everyone</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Students, Graduates, and Young Professionals</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Competitive</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Exciting prizes and recognition</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 p-4 sm:p-6 rounded-xl border border-gradient-to-r from-yellow-200 to-orange-200">
              <h4 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Ready to Test Your Financial Knowledge?</h4>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Join thousands of participants in this exciting competition!</p>
              <Button 
                onClick={() => navigate('/role-selection')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto shadow-lg"
              >
                Register Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Content - Key Features */}
          <div className="space-y-4 sm:space-y-6 animate-scale-in">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Comprehensive Curriculum</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Covers essential topics including budgeting, investing, banking, insurance, 
                      and financial planning strategies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className=" border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Skill-Based Assessment</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      MCQ format designed to test practical financial knowledge and decision-making abilities 
                      rather than just theoretical concepts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Recognition & Rewards</h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Winners will receive certificates, cash prizes, scholarships, and recognition 
                      that enhances their academic and professional profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center animate-fade-in shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-poppins">Why Choose National Financial Literacy Olympiad?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">₹21L+</div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Total Prize Pool</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">4</div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Categories</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">60</div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Minutes Duration</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">50%</div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Course Scholarship</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
