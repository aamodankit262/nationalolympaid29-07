
import { Trophy, Medal, Gift, Star, Sparkles, BookOpen, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Awards = () => {
  const prizes = [
    {
      category: "UG/PG Students",
      first: "E-Scooter ",
      second: "Laptop ",
      third: "Tablet",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      category: "Class 11-12",
      first: "E-Scooter",
      second: "Laptop",
      third: "Tablet",
      icon: Medal,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      category: "Class 9-10",
      first: "Laptop",
      second: "Tablet",
      third: "Mobile",
      icon: Gift,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      category: "Class 6-8",
      first: "Laptop",
      second: "Tablet",
      third: "Mobile",
      icon: Star,
      gradient: "from-slate-600 to-blue-700",
      bgGradient: "from-slate-50 to-blue-50"
    }
  ];

  return (
    <section id="awards" className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins mb-4 sm:mb-6">
            Exciting <span className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Awards & Prizes</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Win amazing prizes worth over ₹21 Lakhs! Each category has attractive rewards for top performers, 
            plus special recognition for district, state & all india toppers.
          </p>
        </div>

        {/* Prize Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {prizes.map((prize, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg bg-gradient-to-br ${prize.bgGradient} relative overflow-hidden`}
            >
              {/* Small static icons in each card */}
              <div className="absolute top-2 right-2 opacity-30">
                {index % 2 === 0 ? (
                  <BookOpen className="w-3 h-3 text-blue-400" />
                ) : (
                  <DollarSign className="w-3 h-3 text-green-400" />
                )}
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${prize.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <prize.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className={`text-base sm:text-lg font-bold bg-gradient-to-r ${prize.gradient} bg-clip-text text-transparent font-poppins`}>
                  {prize.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="text-xs sm:text-sm font-semibold text-yellow-800 mb-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    1st Prize
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-700">{prize.first}</div>
                </div>
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 sm:p-4 rounded-lg border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1">
                    <Medal className="w-3 h-3" />
                    2nd Prize
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700">{prize.second}</div>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-3 sm:p-4 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="text-xs sm:text-sm font-semibold text-orange-800 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    3rd Prize
                  </div>
                  <div className="text-xs sm:text-sm text-orange-700">{prize.third}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Prize Pool */}
        <div className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white mb-8 sm:mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          {/* Static prize icons */}
          <div className="absolute top-8 left-12 opacity-30">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="absolute bottom-8 right-12 opacity-30">
            <Gift className="w-5 h-5 text-pink-300" />
          </div>
          
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-poppins">Prizes more than Rs 21 Lakhs </h3>
            <p className="text-xl sm:text-2xl mb-6 sm:mb-8">Total Prize Pool</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                <div className="text-2xl sm:text-3xl mb-2">🏆</div>
                <div className="text-base sm:text-lg font-semibold mb-2">Multiple Categories</div>
                <p className="text-white/90 text-sm sm:text-base">Equal opportunities for all age groups</p>
              </div>
              <div className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                <div className="text-2xl sm:text-3xl mb-2">🎁</div>
                <div className="text-base sm:text-lg font-semibold mb-2">Valuable Prizes</div>
                <p className="text-white/90 text-sm sm:text-base">Laptops, tablets, e-scooters & more</p>
              </div>
              <div className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                <div className="text-2xl sm:text-3xl mb-2">🏅</div>
                <div className="text-base sm:text-lg font-semibold mb-2">Recognition</div>
                <p className="text-white/90 text-sm sm:text-base">Certificates and medals for achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Recognition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-100 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-30">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-poppins">
                Grand Felicitation Ceremony
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Special recognition ceremony for District & State Toppers with grand celebration and media coverage.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-100 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-2 left-2 opacity-30">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">📜</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent font-poppins">
                Participation Benefits
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                • Each participant will receive an E-certificate <br/>
                • Medals for top 3 students of each category<br/>
                • 50% scholarship on SAFE's online courses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Awards;
