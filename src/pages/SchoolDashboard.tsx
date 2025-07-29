
import { useEffect, useState } from 'react';
import { Users, BookOpen, BarChart3, Calendar, Plus, LogOut, Clock, DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/authStore';
// import StudentProfile from './StudentProfile';
import InstituteProfile from './InstituteProfile';
import { postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';
// import ImportantDates from '@/components/ImportantDates';
import Footer from '@/components/Footer';

const SchoolDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDeshboardData] = useState(null)
  const [exams, setExams] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { logout, userDetails, token } = useAuthStore()
  useEffect(() => {
    if (userDetails?.type !== "institute") {
      navigate('/home', { replace: true });
    } else {
      getDeshboard()
    }
  }, [userDetails, navigate]);
  const handleLogout = () => {
    logout()
    navigate('/login');
  };
  const getDeshboard = async () => {
    setLoading(true);
    try {
      const res = await postApi(
        APIPATH.schoolDash,
        {},
        token,
        logout
      );
      const { success, message, data } = res
      console.log(res, 'dashboard');
      if (success && data) {
        setDeshboardData(res || []);
        setExams(data?.exams || []);
      } else {
        setDeshboardData([]);
      }
    } catch (error) {
      setDeshboardData([]);
      console.error(error, 'catcherror')
      // setStats({ examTaken: 0, averageScore: 0, bestScore: 0, timeSpent: 0 });
    } finally {
      setLoading(false);
    }
  };
  const schoolStats = [
    { label: 'Total Students', value: dashboardData?.total_students||0, subtext: 'Enrolled students', color: 'text-blue-600' },
    { label: 'Active Exams', value: '1', subtext: 'Currently running', color: 'text-green-600' },
    // { label: 'Completed Exams', value: '0', subtext: 'This semester', color: 'text-purple-600' },
    // { label: 'Average Score', value: '0%', subtext: 'School performance', color: 'text-orange-600' }
  ];

  const recentExams = [
    { id: 1, title: 'Financial Literacy - Level 1', students: 45, date: '2024-06-20', status: 'active', duration: '60 min' },
    { id: 2, title: 'Financial Literacy - Level 2', students: 32, date: '2024-06-18', status: 'completed', duration: '90 min' },
    { id: 3, title: 'Mock Test - Practice Round', students: 67, date: '2024-06-15', status: 'scheduled', duration: '45 min' },
    { id: 4, title: 'Final Assessment 2024', students: 89, date: '2024-06-25', status: 'scheduled', duration: '120 min' }
  ];

  const topStudents = [
    { name: 'Aarav Sharma', score: '95%', exam: 'Level 2', date: '2024-06-18' },
    { name: 'Diya Patel', score: '92%', exam: 'Level 1', date: '2024-06-15' },
    { name: 'Arjun Kumar', score: '88%', exam: 'Level 2', date: '2024-06-12' },
    { name: 'Ananya Singh', score: '86%', exam: 'Level 1', date: '2024-06-10' }
  ];

  return (
    <>
<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link to='/'>
              <img
                src="/assets/safeLogo.webp"
                alt="SAFE Academy Logo"
                className="h-10 w-auto"
              />
            </Link>
            <div>
              <h1 className="font-bold text-safe-blue text-lg">School Dashboard</h1>
              <p className="text-sm text-gray-600">ABC High School - Academic Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900  text-white px-6 py-2 rounded-full font-semibold  shadow-lg">
              {/* <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"> */}
              Hi, {userDetails?.name}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'overview'
                ? 'border-safe-blue text-safe-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'students'
                ? 'border-safe-blue text-safe-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Student Management
            </button>
            {/* <button
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'exams'
                ? 'border-safe-blue text-safe-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Exam Management
            </button> */}
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'results'
                ? 'border-safe-blue text-safe-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Results & Analytics
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'profile'
                ? 'border-safe-blue text-safe-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Profile
            </button>

          </nav>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {schoolStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.subtext}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your school's academic activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-safe-blue hover:bg-safe-blue/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Exam
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Exam
                  </Button>
                </div>
              </CardContent>
            </Card> */}

            {/* Recent Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
                {/* <CardDescription>Latest exam status and performance</CardDescription> */}
              </CardHeader>
              {/* <CardContent>
                <div className="space-y-4">
                  {recentExams.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${exam.status === 'completed' ? 'bg-green-100' :
                          exam.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                          <BookOpen className={`w-5 h-5 ${exam.status === 'completed' ? 'text-green-600' :
                            exam.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-gray-500">
                            {exam.students} students • {exam.duration} • {exam.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant={exam.status === 'completed' ? 'default' : exam.status === 'active' ? 'secondary' : 'outline'}>
                        {exam.status}
                      </Badge>
                    </div>
                  ))}
                  No Activity
                </div>
              </CardContent> */}
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
                      <div className="text-4xl font-bold mb-2 ">15th July</div>
                      <p className="text-white/90 mb-6">Registration starts for all categories</p>
                      {/* <Button
                        onClick={() => scrollToSection('register')}
                        className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Register Now
                      </Button> */}
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
                      <div className="text-3xl font-bold mb-2" style={{ animationDelay: '0.5s' }}>5th September to 20th September</div>
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
                      <div className="text-4xl font-bold mb-2 " style={{ animationDelay: '1s' }}>60</div>
                      <div className="text-xl font-semibold mb-4">Minutes</div>
                      <p className="text-white/90 mb-4">MCQ based online examination</p>
                      {/* <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm">Multiple Choice Questions format</p>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Manage enrolled students and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Students List</h4>
                  {/* <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All Students
                  </Button> */}
                </div>
                {dashboardData?.data?.students?.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {student?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        {/* <p className="text-sm text-gray-500">{student.id} • {student.date}</p> */}
                        {/* <p className="text-sm text-gray-500">{student.exam} • {student.date}</p> */}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{student.institute_code}</p>
                      <Badge variant="outline" className="text-green-600">
                        {student?.category_name}
                      </Badge>
                    </div>
                  </div>
                ))}
                {/* No students available */}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <Card>
            <CardHeader>
              <CardTitle>Exam Management</CardTitle>
              <CardDescription>Create, schedule, and manage Financial Literacy exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">All Exams</h4>
                  <Button className="bg-safe-blue hover:bg-safe-blue/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Exam
                  </Button>
                </div>
                {/* {recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${exam.status === 'completed' ? 'bg-green-100' :
                        exam.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                        <BookOpen className={`w-6 h-6 ${exam.status === 'completed' ? 'text-green-600' :
                          exam.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                      </div>
                      <div>
                        <p className="font-medium">{exam.title}</p>
                        <p className="text-sm text-gray-500">
                          {exam.students} students • {exam.duration} • {exam.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={exam.status === 'completed' ? 'default' : exam.status === 'active' ? 'secondary' : 'outline'}>
                        {exam.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))} */}
                No exam created
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <Card>
            <CardHeader>
              <CardTitle>Results & Analytics</CardTitle>
              <CardDescription>Detailed performance analytics and exam results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-safe-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Analytics</h3>
                <p className="text-gray-600 mb-6">View detailed performance metrics, trends, and comparative analysis of your students' exam results.</p>
                <Button className="bg-safe-blue hover:bg-safe-blue/90">
                  {/* View Detailed Analytics */}
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'profile' && (
          // <Profile/>
          <InstituteProfile />
        )}
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default SchoolDashboard;
