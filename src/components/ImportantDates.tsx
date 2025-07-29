
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Star, Trophy, BookOpen, DollarSign, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ImportantDates = () => {
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="dates" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Floating Financial Elements */}
      {/* <div className="absolute top-20 right-16 animate-float opacity-30">
        <BookOpen className="w-8 h-8 text-blue-500" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute top-32 left-20 animate-float opacity-30">
        <Trophy className="w-6 h-6 text-yellow-500" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-32 right-24 animate-float opacity-30">
        <DollarSign className="w-7 h-7 text-green-500" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="absolute bottom-20 left-16 animate-float opacity-30">
        <Target className="w-6 h-6 text-indigo-500" style={{ animationDelay: '2s' }} />
      </div> */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold font-poppins mb-6">
            Important <span className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Dates</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mark your calendar! Here are the key dates you need to remember for the National Financial Literacy Olympiad 2025.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Registration Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative animate-scale-in">
            <div className="absolute top-2 right-2 animate-float opacity-40">
              <BookOpen className="w-4 h-4 text-white" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <Users className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center font-poppins">Registration Open</h3>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15th July</div>
                <p className="text-white/90 mb-6">Registration starts for all categories</p>
                <Button
                  // onClick={() => scrollToSection('register')}
                  onClick={() => navigate('/role-selection')}

                  className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Register Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exam Dates Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-slate-600 to-blue-700 text-white overflow-hidden relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-2 left-2 animate-float opacity-40">
              <Target className="w-4 h-4 text-white" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <Calendar className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center font-poppins">Exam Dates</h3>
              <div className="text-center">
                {/* <div className="text-lg font-semibold mb-2">5th September to</div> */}
                {/* <div className="text-lg font-bold mb-2 animate-bounce" style={{ animationDelay: '0.5s' }}>20th September</div> */}
                <div className="text-3xl font-bold mb-2 " style={{ animationDelay: '0.5s' }}>5th September to 15th October</div>
                <div className="text-lg font-semibold mb-4">2025</div>
                {/* <p className="text-white/90">Online examination period</p> */}
              </div>
            </CardContent>
          </Card>

          {/* Duration Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-slate-700 text-white overflow-hidden relative animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute bottom-2 right-2 animate-float opacity-40">
              <DollarSign className="w-4 h-4 text-white" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="absolute top-0 left-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 -translate-x-6"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center font-poppins">Exam Duration</h3>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ animationDelay: '1s' }}>60</div>
                <div className="text-xl font-semibold mb-4">Minutes</div>
                <p className="text-white/90 mb-4">MCQ based online examination</p>
                {/* <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm">Multiple Choice Questions format</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 animate-fade-in shadow-lg relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
          <div className="absolute top-4 right-8 animate-float opacity-20">
            <Trophy className="w-6 h-6 text-yellow-500" style={{ animationDelay: '2s' }} />
          </div>

          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-poppins">
            Competition Timeline
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Timeline Item 1 */}
              <div className="flex items-start space-x-6 animate-scale-in">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Registration Phase</h4>
                  <p className="text-gray-600 mb-1">Opens: 15th July 2025</p>
                  <p className="text-gray-500 text-sm">Register online through our platform with all required details</p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start space-x-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Examination Period</h4>
                  <p className="text-gray-600 mb-1">5th September - 15th October  2025</p>
                  <p className="text-gray-500 text-sm">60-minute online MCQ examination for all categories</p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex items-start space-x-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 to-slate-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1 bg-gradient-to-r from-indigo-50 to-slate-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Results & Awards</h4>
                  <p className="text-gray-600 mb-1">Grand Facilitation Ceremony for District, State & All India Toppers</p>
                  <p className="text-gray-500 text-sm">Recognition ceremony with prizes and certificates</p>
                  <p className="text-gray-500 text-sm">100's of consolation prizes in all categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl text-white animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-2xl font-bold mb-4 font-poppins">Don't Miss Out!</h4>
              <p className="mb-6">Registration opens on 15th July 2025. Be among the first to secure your spot in India's premier financial literacy competition.</p>
              <Button
                // onClick={() => scrollToSection('register')}
                onClick={() => navigate('/role-selection')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get Registration Details <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;
