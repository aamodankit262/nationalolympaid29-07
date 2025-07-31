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
  LogOut,
  FileText,
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

const Dashboard = () => {
  const navigate = useNavigate();
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
      }
    } catch (error) {
      setStudyMaterials([]);
      setExams([]);
      console.log(error, "catcherror");
    } finally {
      setLoading(false);
    }
  };
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
 
  const onDateSelect = async (fullDateTime: string) => {
    try {
      const [datePart, ...timeParts] = fullDateTime.split(" ");
      const timePart = timeParts.join(" ");
      const [day, month, year] = datePart.split("-");
      const formattedDate = `${year}-${month}-${day}`;
      const payload = {
        exam_name: "National Finance Literacy Olympiad",
        exam_date: datePart, 
        exam_time: timePart,
      };

      const resp = await postApi(
        APIPATH.setExamDate,
        payload,
        token,
        logout
      );
      if (resp.success) {
        toast({
          title: "Date Confirmed",
          description: `You have selected ${fullDateTime}`,
        });

        setSelectedDate(formattedDate); 
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
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogContent className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow"> */}
        <DialogContent className="w-full max-w-[95vw] lg:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <ExamDateModal
            title="Pick a Date"
            description="Dates are available between 5th Sept–15th Oct"
            onDateSelect={onDateSelect}
          />
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
              {/* Recent Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Materials</CardTitle>
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
                           
                            </Button>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
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
                      const examDate = exam.start_time.split(" ")[0]; 
                      const isLocked = today < examDate;

                      return (
                        <Card
                          key={exam.id}
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
                            </div>
                            <Button
                              className="animate-scale-in w-full bg-safe-blue hover:bg-safe-blue/90 text-white"
                              onClick={() => {
                                if (exam.no_of_questions > 0) {
                                  setOpen(true);
                                }
                              }}
                              disabled={exam?.no_of_questions === 0 || !!selectedDate}
                            >
                              <Calendar1Icon className="mr-2" />
                              {selectedDate && selectedTime
                                ? `Start Exam on ${selectedDate} at ${selectedTime}`
                                : "Choose Exam Date"}
                            </Button>
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
