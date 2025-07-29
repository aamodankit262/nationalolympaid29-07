import { Link, useNavigate } from "react-router-dom";
// import { Checkbox } from "@radix-ui/react-checkbox";
// import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useEffect, useState } from "react";
import { postApi } from "@/services/services";
import { APIPATH } from "@/api/urls";
import LoaderWithBackground from "@/components/LoaderWithBackground";
import WebcamStream from "@/components/WebcamStream";
import WebcamCapture from "@/components/WebcamStream";

const ExamInstructions = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [examDetails, setExamDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userDetails, token, logout } = useAuthStore();
    useEffect(() => {
        const fetchExamDetails = async () => {
            setLoading(true);
            try {
                const response = await postApi(APIPATH.examDetails, { exam_id: 1 }, token, logout)
                console.log(response.data, 'response');
                setExamDetails(response?.data);
            } catch (error) {
                console.log(error, 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchExamDetails();
    }, []);
    // const handleStartExam = async () => {
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //       localStorage.setItem("webcam_granted", "true");

    //       // stop the stream immediately, we just wanted permission
    //       stream.getTracks().forEach((track) => track.stop());

    //       // allow exam to start
    //       navigate("/dashboard/exam-live");
    //     } catch (err) {
    //       alert("Webcam access is required to start the exam.");
    //     }
    //   };
    const handleStartExam = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isChecked) {
            e.preventDefault();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            localStorage.setItem("webcam_granted", "true");
            localStorage.setItem("exam_instructions_accepted", "true");
        } catch (err) {
            e.preventDefault();
            alert("Webcam access is required to start the exam.");
        }
    };
    if (loading) return <LoaderWithBackground visible={true} />
    return (
        <>
            <WebcamCapture />
            <section className="min-h-screen bg-gray-50">
                <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
                    <Link to="/dashboard">
                        <img src="/assets/safeLogo.webp" alt="logo-png" className="h-10" />
                    </Link>
                    <h4 className="text-lg font-semibold text-gray-800">
                        NFLO-2025 Examination Rules and Regulations
                    </h4>
                    <div className="flex items-center space-x-4">
                        {/* <Button
                        onClick={() => {
                            navigate('/dashboard');
                        }}
                        className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm xl:text-base"
                    >
                        Back To Dashboard
                    </Button> */}
                        {/* <Link to="/dashboard">
                        <img src="/assets/safeLogo.webp" alt="logo-png" className="h-10" />
                    </Link> */}
                    </div>


                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Sidebar Left */}
                    <div className="w-full lg:w-3/4 bg-white border-r border-gray-200 p-6">
                        {/* <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-6"
          >
            ← Back
          </button> */}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-4">{examDetails?.test_name} </h3>
                            <p className="text-sm">Duration: <strong>{examDetails?.duration || 60} Mins</strong></p>
                            <p className="text-sm">Total Questions: <strong>{examDetails?.no_of_questions || 100}</strong></p>
                            <p className="text-sm">Maximum Marks: <strong>{examDetails?.maximum_marks || 100}</strong></p>
                        </div>

                        <h3 className="text-lg font-semibold mb-3">
                            Read The Following Instructions Carefully:
                        </h3>
                        <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: examDetails?.instruction }} />
                        {/* <ul className="list-disc list-inside space-y-2 text-sm text-gray-700" dangerouslySetInnerHTML={{__html: examDetails?.instruction}}>
                        
                        <li>Read the following instructions carefully.</li>
                        <li>The online examination will be conducted under AI-based proctoring.</li>
                        <li>Webcam must remain switched on throughout the entire duration of the exam.</li>
                        <li>Each question has 4 options out of which only one is correct.</li>
                        <li>You have to finish the test in 60 minutes.</li>
                        <li>
                            You will be awarded <strong>1 mark</strong> for each correct answer.
                        </li>
                        <li>
                            There is no negative marking for wrong answers.
                        </li>
                        <li>
                            Make sure that you complete the test before you submit the test and/or close the browser.
                        </li>
                    </ul> */}

                        <div className="mt-8">
                            <label className="flex items-start gap-3 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mt-1 border-gray-300 focus:ring-blue-500"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                                I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else’s advantage will lead to my immediate disqualification.
                            </label>
                        </div>

                        <div className="mt-6 text-right">
                            <Link
                                to={isChecked ? "/dashboard/exam-live" : "#"}
                                onClick={handleStartExam}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded"
                                style={{
                                    opacity: !isChecked ? 0.5 : 1,
                                    cursor: !isChecked ? "not-allowed" : "pointer",
                                }}
                            >
                                I am ready to begin
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Right */}
                    <div className="w-full lg:w-1/4 bg-gradient-to-br from-yellow-100 to-blue-100 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src="/assets/profile-img.png"
                                alt="Profile"
                                className="w-16 h-16 rounded-full mb-2"
                            />
                            {/* <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                 
                        <User />
                        </div> */}
                            <h4 className="text-md font-medium text-gray-800 ">Hi, {userDetails?.name || 'User Name'}</h4>
                            <p className="text-sm text-gray-600">User ID: {userDetails?.user_code || '245678'}</p>
                            <p className="text-sm text-gray-600"> {userDetails?.mobile || '+91 12345 01201'}</p>
                            {/* <p className="text-sm text-gray-600">Class: 10</p> */}
                            {/* <p className="text-sm text-gray-600">Category: General</p> */}
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
};

export default ExamInstructions;
