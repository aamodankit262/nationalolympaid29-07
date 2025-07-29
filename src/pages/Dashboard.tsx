import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  User,
  LogOut,
  Play,
  Eye,
  FileText,
  Award,
  Calendar1Icon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { postApi } from "@/services/services";
import { APIPATH } from "@/api/urls";
import StudentProfile from "./StudentProfile";
import { Spinner } from "@/components/Spinner";
import ExamDateModal from "@/components/ExamModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import Footer from "@/components/Footer";
import { getProfileApi } from "@/store/auth/authServices";
// import { time } from "console";

const Dashboard = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState<any>([]);
  const [deshData, setDeshData] = useState<any>("");
  const { userDetails, logout, token, setUserDetails } = useAuthStore();
  const [exams, setExams] = useState([]);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    examTaken: 0,
    averageScore: 0,
    bestScore: 0,
    timeSpent: 0,
  });
  const today = new Date().toISOString().split("T")[0];
  // useEffect(() => {
  //   if (!userDetails) return null;

  //   if (userDetails.isPayment === 1) {
  //     navigate("/dashboard", { replace: true });

  //   } else {
  //     navigate("/plans", { replace: true });

  //   }
  // }, [userDetails, navigate]);

  useEffect(() => {
    getProfile();
  }, []);
  useEffect(() => {
    if (userDetails.isPayment === 1) {
      getDeshboard();
    };
  }, []);
  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfileApi(token, logout);
      const { status, user } = res;

      if (status) {
        setUserDetails(user);

        if (user.isPayment === 1) {
          navigate("/dashboard");
        } else {
          navigate("/plans");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDeshboard = async () => {
    setLoading(true);
    try {
      const res = await postApi(
        APIPATH.studentDashboard,
        { category_id: userDetails?.category_id },
        token,
        logout
      );
      // console.log(res, "dashboard");
      if (res?.success && res.data) {
        setDeshData(res);
        setSelectedDate(res.studentExamDate);
        setSelectedTime(res.examTime);
        setStudyMaterials(res.data.study_materials || []);
        setExams(res.data.exams || []);
        setStats(res.data.exam_stats);
        // Open modal if no date is selected
        if (!res.studentExamDate) {
          setTimeout(() => {
            setOpen(true);
          }, 1000);
        }
      } else {
        setStudyMaterials([]);
        setExams([]);
        setStats({ examTaken: 0, averageScore: 0, bestScore: 0, timeSpent: 0 });
        // Open modal if no date is selected
        // setTimeout(() => {
        //   setOpen(true);
        // }, 1000);
      }
    } catch (error) {
      setStudyMaterials([]);
      setExams([]);
      console.log(error, "catcherror");
      // setStats({ examTaken: 0, averageScore: 0, bestScore: 0, timeSpent: 0 });
      // Open modal if no date is selected
      // setTimeout(() => {
      //   setOpen(true);
      // }, 1000);
    } finally {
      setLoading(false);
    }
  };
  // Add this helper function inside your component
  // const isExamLocked = (exam: any) => {
  //   const now = new Date();
  //   const start = new Date(exam.start_time.replace(/-/g, '/'));
  //   const end = new Date(exam.end_time.replace(/-/g, '/'));
  //   return now < start || now > end;
  // };
  // const getExamList = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await postApi(APIPATH.examList, { category_id: userDetails?.category_id }, token, logout);
  //     console.log(res, 'exam');
  //     if (res?.success && Array.isArray(res.data)) {
  //       setExams(res.data);
  //     } else {
  //       setExams([]);
  //     }
  //   } catch (error) {
  //     setExams([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const statsConfig = [
    {
      title: "Exams Taken",
      value: stats.examTaken,
      description: "Total exams completed",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Score",
      value: stats.averageScore + "%",
      description: "Overall performance",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Best Score",
      value: stats.bestScore + "%",
      description: "Highest achievement",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Time Spent",
      value: stats.timeSpent + "h",
      description: "Total study time",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];
  // const availableExams = [
  //   { id: 4, title: "Advanced Financial Planning", duration: "90 min", questions: 50, difficulty: "Hard", status: "locked" }
  // ];

  // const examHistory = [
  //   { title: "Financial Literacy - Basic", score: "92%", date: "2024-06-20", duration: "42 min", rank: "3rd", status: "completed" },
  //   { title: "Investment Basics", score: "88%", date: "2024-06-18", duration: "28 min", rank: "5th", status: "completed" },
  //   { title: "Banking Fundamentals", score: "96%", date: "2024-06-15", duration: "35 min", rank: "1st", status: "completed" },
  //   { title: "Money Management", score: "84%", date: "2024-06-12", duration: "40 min", rank: "7th", status: "completed" }
  // ];

  // const studyMaterials = [
  //   { title: "Financial Literacy Handbook", type: "PDF", pages: 45, downloadCount: 1250, category: "Basic" },

  // ];

  // const achievements = [
  //   { title: "First Exam Completed", description: "Successfully completed your first exam", date: "2024-06-01", icon: "🎉" },
  //   { title: "High Scorer", description: "Scored above 90% in an exam", date: "2024-06-15", icon: "🏆" },
  //   { title: "Consistent Performer", description: "Maintained 80%+ average for 5 exams", date: "2024-06-18", icon: "⭐" },
  //   { title: "Speed Champion", description: "Completed exam 20% faster than average", date: "2024-06-20", icon: "⚡" }
  // ];
  // useEffect(() => {
  //   if (!selectedDate)
  //     setOpen(true)
  // })
  const onDateSelect = async (fullDateTime: string) => {
    // console.log(fullDateTime, "fullDateTime");
    try {
      const [datePart, ...timeParts] = fullDateTime.split(" ");
      const timePart = timeParts.join(" ");
      const [day, month, year] = datePart.split("-");
      const formattedDate = `${year}-${month}-${day}`;
      // console.log(timePart, "timePart");
      const payload = {
        exam_name: "National Finance Literacy Olympiad",
        exam_date: datePart, // DD-MM-YYYY
        exam_time: timePart, // HH:mmAM/PM
      };

      const resp = await postApi(
        APIPATH.setExamDate,
        payload,
        token,
        logout
      );
      // console.log(resp, payload, "setExamDate");
      if (resp.success) {
        toast({
          title: "Date Confirmed",
          description: `You have selected ${fullDateTime}`,
        });

        setSelectedDate(formattedDate); // YYYY-MM-DD
        setOpen(false);
        await getDeshboard();
      } else {
        toast({
          title: "Error",
          description: resp.message || "Failed to set exam date. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* <LoaderWithBackground visible={loading} /> */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogContent className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow"> */}
        <DialogContent className="w-full max-w-[95vw] lg:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <ExamDateModal
            title="Pick a Date"
            description="Dates are available between 5th Sept–15th Oct"
            onDateSelect={onDateSelect}
          />
          {/* <DialogClose>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogClose> */}
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <Spinner />
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="lg:flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img
                  src="/assets/safeLogo.webp"
                  alt="SAFE Academy Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <div>
                <h1 className="font-bold text-safe-blue text-lg">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Financial Literacy Learning Hub
                </p>
              </div>
            </div>
            <div className="lg:flex items-center space-x-4">
              {/* <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button> */}
              {/* <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"> */}
              {/* <Link
                to="/plans/payment-success"
                className="flex items-center space-x-2"
              > */}
              <Button variant="outline" size="lg">
                User Id : {userDetails?.user_code || "N/A"}
              </Button>
              {/* </Link> */}

              <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900  text-white px-6  rounded-full font-semibold">
                Hi, {userDetails?.name}
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b w-full">
          <div className="px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Navigation Tabs */}
            <nav className="flex overflow-x-auto scrollbar-hide space-x-4 max-w-full">
              {[
                { key: "dashboard", label: "Dashboard" },
                { key: "exams", label: "Take Exam" },
                { key: "achievements", label: "Achievements" },
                { key: "profile", label: "My Profile" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap py-2 px-2 border-b-2 font-medium text-sm ${activeTab === key
                    ? "border-safe-blue text-safe-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {label}
                </button>
              ))}
            </nav>


            {/* Choose Exam Date Button */}
            <div className="flex justify-start lg:justify-end">
              <Button
                className="animate-scale-in w-full sm:w-auto"
                onClick={() => setOpen(true)}
                disabled={!!selectedDate}
                //  disabled={exams[0].no_of_questions === 0 || !!selectedDate}
                variant="outline"
              >
                <Calendar1Icon className="mr-2" />
                {selectedDate && selectedTime
                  ? `Start Exam on ${selectedDate} at ${selectedTime}`
                  : "Choose Exam Date"}
              </Button>
            </div>
          </div>
        </div>


        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full overflow-x-auto">
                {statsConfig?.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                            <p className="text-xs text-gray-500">
                              {stat.description}
                            </p>
                          </div>
                          <div
                            className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${stat.color}`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Continue your financial literacy journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-safe-blue hover:bg-safe-blue/90" onClick={() => setActiveTab('exams')}>
                    <Play className="w-4 h-4 mr-2" />
                    Take New Exam
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('results')}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('study')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Study Materials
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('achievements')}>
                    <Award className="w-4 h-4 mr-2" />
                    My Achievements
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('achievements')}>
                    <Award className="w-4 h-4 mr-2" />
                    My Achievements
                  </Button>
                </div>
              </CardContent>
            </Card> */}

              {/* Recent Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Materials</CardTitle>
                  {/* <CardDescription>Your latest exam results and progress</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-x-auto">
                    {studyMaterials.map((material, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold">{material.title}</h3>
                            <Badge variant="outline">
                              {deshData?.planTitle}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-600">
                              📄 {material.original_name} •{" "}
                              {material.total_pages} pages
                            </p>
                            <p className="text-sm text-gray-600">
                              ⬇️ {material.no_of_downloads} downloads
                            </p>
                          </div>
                          <Button variant="outline" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full"
                              asChild
                            >
                              <a
                                href={material.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Download PDF
                              </a>
                              {/* <a
                                href={`/api/download/${material.file_name}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  fetch(`/api/download/${material.file_name}`, {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }).then((res) => res.blob())
                                    .then((blob) => {
                                      const link = document.createElement('a');
                                      link.href = window.URL.createObjectURL(blob);
                                      link.download = material.file_name;
                                      link.click();
                                    });
                                }}
                              >
                                Download PDF
                              </a> */}
                            </Button>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {/* <Card>
                      <CardHeader>
                        <CardTitle>Admit Card</CardTitle>
                        <CardDescription>
                          Download your admit card for the exam.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Your admit card is required for exam entry.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="opacity-50 pointer-events-none w-auto"
                            asChild
                          >
                            <a
                              href={deshData?.studentAdminCard || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Download Admit Card
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card> */}

                  </div>
                </CardContent>
                {/* <CardContent>
                <div className="space-y-4">
                  {examHistory.slice(0, 3).map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-gray-500">{exam.date} • {exam.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{exam.score}</p>
                        <Badge variant="outline" className="text-blue-600">
                          Rank: {exam.rank}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent> */}
              </Card>

              {/* Rules and Regulations */}
              <div className="animate-scale-in mb-16">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 font-poppins text-center">
                    NFLO-2025 Examination – Rules and Regulations
                  </h3>

                  <div className="space-y-6">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-red-400">
                      <ul className="list-disc list-inside text-white/90 text-sm space-y-3">
                        <li>
                          The online examination will be conducted under
                          AI-based proctoring.
                        </li>
                        <li>
                          Webcam must remain switched on throughout the entire
                          duration of the exam.
                        </li>
                        <li>
                          Any form of unfair practice or misconduct will result
                          in immediate disqualification and debarring of the
                          candidate.
                        </li>
                        <li>
                          The decision of the Screening Committee shall be final
                          and binding with respect to rankings, results, and
                          prize allocations.
                        </li>
                        <li>
                          Merely registering for or appearing in the examination
                          does not guarantee eligibility for prizes or awards.
                          No claims in this regard shall be entertained under
                          any circumstances.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exams Tab */}
          {activeTab === "exams" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Available Exams</CardTitle>
                  <CardDescription>
                    Choose an exam date to test your financial literacy
                    knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-x-auto">
                    {exams?.length === 0 && (
                      <div className="col-span-2 text-center text-gray-500">
                        No exams available
                        {selectedDate ? " for selected date." : "."}
                      </div>
                    )}
                    {exams?.map((exam) => {
                      const examDate = exam.start_time.split(" ")[0]; // YYYY-MM-DD
                      const isLocked = today < examDate;

                      return (
                        <Card
                          key={exam.id}
                        // className={isLocked ? "opacity-50 pointer-events-none" : "hover:shadow-lg transition-shadow"}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold text-lg">
                                {exam.test_name}
                              </h3>
                            </div>

                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-gray-600">
                                ⏱️ Duration: {exam.duration}
                              </p>
                              <p className="text-sm text-gray-600">
                                Questions: {exam.no_of_questions}
                              </p>
                              {/* <p className="text-sm text-gray-600">
                                🗓️ {examDate}
                              </p> */}
                            </div>

                            {/* <Button
                              className="animate-scale-in w-full bg-safe-blue hover:bg-safe-blue/90 text-white"
                              onClick={() => {
                                const examId = exam?.id; // or dynamically set
                                localStorage.setItem("exam_id", examId);
                                navigate("/dashboard/exam-instructions");
                              }}
                            // disabled={!!selectedDate}
                            >
                              <Calendar1Icon className="mr-2" />
                              Start Exam
                            </Button> */}

                            <Button
                              className="animate-scale-in w-full bg-safe-blue hover:bg-safe-blue/90 text-white"
                              onClick={() => {
                                if (exam.no_of_questions > 0) {
                                  setOpen(true);
                                }
                              }}
                              // disabled={!!selectedDate}
                              disabled={exam.no_of_questions === 0 || !!selectedDate}
                            >
                              <Calendar1Icon className="mr-2" />
                              {selectedDate && selectedTime
                                ? `Start Exam on ${selectedDate} at ${selectedTime}`
                                : "Choose Exam Date"}
                            </Button>

                            {/* Optional: Show Start Exam button if unlocked and date selected */}
                            {/* {!isLocked && selectedDate && (
          <Button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white">
            Start Exam
          </Button>
        )} */}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {/* Rules and Regulations */}
              <div className="animate-scale-in mb-16">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 font-poppins text-center">
                    NFLO-2025 Examination – Rules and Regulations
                  </h3>

                  <div className="space-y-6">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border-l-4 border-red-400">
                      <ul className="list-disc list-inside text-white/90 text-sm space-y-3">
                        <li>
                          The online examination will be conducted under
                          AI-based proctoring.
                        </li>
                        <li>
                          Webcam must remain switched on throughout the entire
                          duration of the exam.
                        </li>
                        <li>
                          Any form of unfair practice or misconduct will result
                          in immediate disqualification and debarring of the
                          candidate.
                        </li>
                        <li>
                          The decision of the Screening Committee shall be final
                          and binding with respect to rankings, results, and
                          prize allocations.
                        </li>
                        <li>
                          Merely registering for or appearing in the examination
                          does not guarantee eligibility for prizes or awards.
                          No claims in this regard shall be entertained under
                          any circumstances.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Results Tab */}
          {/* {activeTab === "results" && (
            <Card>
              <CardHeader>
                <CardTitle>Exam History</CardTitle>
                <CardDescription>
                  Your complete exam performance record
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examHistory.map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-gray-500">
                            {exam.date} • {exam.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          {exam.score}
                        </p>
                        <Badge variant="outline" className="text-blue-600">
                          Rank: {exam.rank}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Study Materials Tab */}
          {/* {activeTab === "study" && (
            <Card>
              <CardHeader>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>
                  Download and access study resources for exam preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-x-auto">
                  {studyMaterials.map((material, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold">{material.title}</h3>
                          <Badge variant="outline">{deshData?.planTitle}</Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            📄 {material.original_name} • {material.total_pages}{" "}
                            pages
                          </p>
                          <p className="text-sm text-gray-600">
                            ⬇️ {material.no_of_downloads} downloads
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Celebrate your learning milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-400">Earned on {achievement.date}</p>
                      </div>
                      <Badge variant="secondary">Earned</Badge>
                    </div>
                  ))} */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Certificate</CardTitle>
                      <CardDescription>
                        Download your certificate for the exam.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Your certificate is awarded after exam completion and can be downloaded here.
                          </p>
                          {/* Optionally show exam date or other info here */}
                        </div>
                        <Button
                          variant="outline"
                          className=" bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900  text-white opacity-50 pointer-events-none w-auto"
                          asChild
                        >
                          <a
                            href={deshData?.studentCertificate || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Download Certificate
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  {/* No Achievements */}
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === "profile" && (
            // <Profile/>
            <StudentProfile />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
