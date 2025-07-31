
import { Clock, FileText, Award, Users, Target, ArrowRight, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CompetitionStructure = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const examDetails = [
    {
      icon: Clock,
      title: "Duration",
      description: "60 Minutes",
      details: "Carefully timed to assess knowledge efficiently",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: FileText,
      title: "Format",
      description: "Multiple Choice Questions",
      details: "MCQ format for comprehensive assessment",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: Target,
      title: "Questions",
      description: "50-75 Questions",
      details: "Varies by category and complexity level",
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: Award,
      title: "Scoring",
      description: "Merit-based Ranking",
      details: "District and state-wide ranking system",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ];

  const syllabusTopics = [
    {
      category: "Basic Financial Concepts",
      topics: ["Money & Its Functions", "Banking Basics", "Savings & Current Accounts", "Interest Calculations"],
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-100",
      icon: "💰"
    },
    {
      category: "Personal Finance",
      topics: ["Budgeting", "Emergency Fund", "Financial Goals", "Expense Management"],
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-100",
      icon: "📊"
    },
    {
      category: "Investment Fundamentals",
      topics: ["Risk vs Return", "Mutual Funds", "Stock Market Basics", "Fixed Deposits"],
      gradient: "from-yellow-600 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-100",
      icon: "📈"
    },
    {
      category: "Insurance & Protection",
      topics: ["Life Insurance", "Health Insurance", "General Insurance", "Claims Process"],
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-100",
      icon: "🛡️"
    },
    {
      category: "Digital Finance",
      topics: ["UPI & Digital Payments", "Online Banking", "Digital Wallets", "Cyber Security"],
      gradient: "from-red-600 to-rose-600",
      bgGradient: "from-red-50 to-rose-100",
      icon: "💳"
    },
    {
      category: "Financial Planning",
      topics: ["Retirement Planning", "Tax Planning", "Loan Management", "Credit Score"],
      gradient: "from-indigo-600 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-100",
      icon: "🎯"
    }
  ];

  return (
    <section id="structure" className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold font-poppins mb-6">
            Competition <span className="bg-gradient-to-r from-orange-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">Structure</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Understand the complete structure of the National Financial Literacy Olympiad 2025,
            including exam format, syllabus, and evaluation criteria.
          </p>
        </div>

        {/* Exam Format */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {examDetails.map((detail, index) => (
            <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg text-center bg-gradient-to-br ${detail.bgGradient}`}>
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${detail.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <detail.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${detail.gradient} bg-clip-text text-transparent font-poppins`}>{detail.title}</h3>
                <div className="text-2xl font-bold text-gray-800 mb-2">{detail.description}</div>
                <p className="text-gray-600 text-sm">{detail.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Rules and Regulations */}
        <div className="animate-scale-in mb-16">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 font-poppins text-center">NFLO-2025 Examination – Rules and Regulations</h3>

            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-red-400">
                <ul className="list-disc list-inside text-white/90 text-sm space-y-3">
                  <li>The online examination will be conducted under AI-based proctoring.</li>
                  <li>Webcam must remain switched on throughout the entire duration of the exam.</li>
                  <li>Any form of unfair practice or misconduct will result in immediate disqualification and debarring of the candidate.</li>
                  <li>The decision of the Screening Committee shall be final and binding with respect to rankings, results, and prize allocations.</li>
                  <li>Merely registering for or appearing in the examination does not guarantee eligibility for prizes or awards. No claims in this regard shall be entertained under any circumstances.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Improved Comprehensive Syllabus */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-poppins">
              Comprehensive Syllabus
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Master these essential financial literacy topics to excel in the competition.
              Our syllabus covers everything from basic concepts to advanced financial planning.
            </p>
          </div>


          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {syllabusTopics.map((section, index) => (
              <Card key={index} className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${section.bgGradient} overflow-hidden relative group`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="text-3xl mr-4">{section.icon}</div>
                    <h4 className={`text-xl font-bold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent flex-1`}>
                      {section.category}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-colors duration-200">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.gradient} flex-shrink-0`}></div>
                        <span className="text-gray-700 font-medium text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/30">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{section.topics.length} Topics</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Essential</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 translate-x-12"></div>
              <div className="relative z-10">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h4 className="text-2xl font-bold mb-4 font-poppins">Ready to Test Your Knowledge?</h4>
                <p className="text-white/90 mb-6 leading-relaxed max-w-2xl mx-auto">
                  The comprehensive syllabus covers all essential financial literacy topics.
                  Start preparing today and join thousands of students in this exciting competition!
                </p>
                <Button
                  onClick={() => scrollToSection('register')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg border-0"
                >
                  Join the Competition <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="animate-scale-in">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 font-poppins text-center">Evaluation Criteria</h3>

            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-yellow-300">
                <h4 className="font-semibold mb-2">Scoring System</h4>
                <p className="text-white/90 text-sm">Each correct answer carries equal weightage. No negative marking to encourage participation.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-green-300">
                <h4 className="font-semibold mb-2">Ranking Method</h4>
                <p className="text-white/90 text-sm">State-wise and District-wise rankings based on total score and time taken.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-blue-300">
                <h4 className="font-semibold mb-2">Result Declaration</h4>
                <p className="text-white/90 text-sm">Results announced within 15 days of exam completion with detailed scorecards.</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 p-6 rounded-2xl text-center backdrop-blur-sm">
              <Users className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-xl font-bold mb-2">Fair & Transparent</h4>
              <p className="text-white/90 text-sm">Our evaluation process ensures fair assessment for all participants across different categories.</p>
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-8 md:p-12 animate-fade-in shadow-lg mt-16">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-poppins">Preparation Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Study Resources</h4>
              <p className="text-gray-600">Access comprehensive study materials and practice questions on our platform.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Time Management</h4>
              <p className="text-gray-600">Practice with timed mock tests to improve speed and accuracy in the actual exam.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Focus Areas</h4>
              <p className="text-gray-600">Concentrate on practical applications and real-world financial scenarios.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionStructure;
