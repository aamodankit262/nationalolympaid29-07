
import { Trophy, Star, Users, Calendar, Sparkles, ArrowRight, BookOpen, Download} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate()
  return (
    <section id="home" className="pt-20 sm:pt-32 pb-16 sm:pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden relative min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-100 px-6 py-3 rounded-full text-sm border-2 border-gradient-to-r from-blue-300 to-indigo-300 animate-scale-in shadow-lg">
                <Star className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-slate-800 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">National Financial Literacy Olympiad 2025</span>
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold font-poppins leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>NATIONAL</span><br />
                <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent animate-fade-in">FINANCIAL</span><br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>LITERACY</span><br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.4s' }}>OLYMPIAD</span>
              </h1>
              
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-slate-700 text-white px-8 py-4 rounded-3xl inline-block transform -rotate-2 shadow-2xl hover:rotate-0 transition-transform duration-300 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                  <span className="font-bold text-xl flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    2025
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-poppins flex items-center justify-center lg:justify-start gap-3">
                <span className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Empower. Educate. Excel.
                </span>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0">
                Join thousands of students across India in the most comprehensive financial literacy competition. 
                Master essential money management skills and compete for prizes more than <span className="font-bold text-green-600">₹21+ Lakhs!</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto lg:max-w-none" style={{ animationDelay: '1s' }}>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-700 rounded-2xl mb-3 mx-auto transition-transform duration-300 shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">4</div>
                <div className="text-sm text-gray-600 font-semibold">Categories</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-2xl mb-3 mx-auto  transition-transform duration-300 shadow-xl">
                  <Trophy className="w-8 h-8 text-white " style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-700 bg-clip-text text-transparent">₹21 <span className='text-3xl'>Lakhs</span></div>
                <div className="text-sm text-gray-600 font-semibold">Prizes</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 rounded-2xl mb-3 mx-auto transition-transform duration-300 shadow-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-700 bg-clip-text text-transparent">60</div>
                <div className="text-sm text-gray-600 font-semibold">Minutes</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-sm sm:max-w-none mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <Button 
                onClick={() => navigate('/role-selection')}
                size="lg"
                className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 hover:from-slate-800 hover:via-blue-800 hover:to-indigo-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl border-0 group w-full sm:w-auto"
              >
                <span className="flex items-center gap-3">
                  Register Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <a href="/assets/Brochure2.pdf" download>
              <Button 
                variant="outline"
                size="lg"
                className="border-3 border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto group border-blue-600"
              >
                <span className="flex items-center gap-3">
                  <Download className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Download Brochure
                </span>
              </Button>
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative  order-first lg:order-last" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 group">
              <img 
                src="/assets/Banner6.png" 
                alt="Financial Literacy Olympiad 2025 Poster" 
                className="w-full max-w-sm sm:max-w-md lg:max-w-[38rem] mx-auto rounded-3xl shadow-3xl border-4 border-gradient-to-r from-blue-400 to-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
