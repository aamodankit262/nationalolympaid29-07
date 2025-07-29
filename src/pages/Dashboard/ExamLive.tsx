import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, TimerReset } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from '@/store/auth/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { APIPATH } from '@/api/urls';
import { postApi } from '@/services/services';
import LoaderWithBackground from '@/components/LoaderWithBackground';
import WebcamStream from '@/components/WebcamStream';
import WebcamCapture from '@/components/WebcamStream';
import ExamSecurity from '@/components/ExamSecurity';
import { toast } from '@/hooks/use-toast';
import { DialogDescription } from '@radix-ui/react-dialog';
import ExamWebcam from '@/components/ExamCamera';

interface Question {
    id: number;
    question_type: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
}

interface QuestionData {
    question_no: number;
    question: Question;
    next_question: Question | null;
    previous_question_id: number | null;
    next_question_id: number | null;
    first_question_id: number;
    last_question_id: number;
    is_first_question: boolean;
    is_last_question: boolean;
    total_questions: number;
}

interface SubmitResponse {
    success: boolean;
    message: string;
    question_no: number;
    question: Question;
    next_question: Question | null;
    previous_question_id: number | null;
    next_question_id: number | null;
    first_question_id: number;
    last_question_id: number;
    is_first_question: boolean;
    is_last_question: boolean;
    total_questions: number;
}

interface FinalSubmitResponse {
    status: boolean;
    message: string;
    total_correct: string;
    total_wrong: string;
    total_skipped: string;
    total_correct_score: number;
    total_wrong_score: number;
    total_marks: number;
    total_spend_time: string;
    obtain_marks: number;
    passing_marks: number | null;
    redirect_url: string;
}

const Exam = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showExitModal, setShowExitModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [resultData, setResultData] = useState<FinalSubmitResponse | null>(null);
    const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [currentQuestion, setCurrentQuestion] = useState<number>();
    const [attemptHistory, setAttemptHistory] = useState<any>(null);
    const [totalSkipped, setTotalSkipped] = useState(0);
    const [securityViolations, setSecurityViolations] = useState<any[]>([]);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [warningCount, setWarningCount] = useState(0);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [sessionValid, setSessionValid] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [questionIdMapping, setQuestionIdMapping] = useState(new Map()); // Maps sequence number to question ID
    const [currentSequenceNumber, setCurrentSequenceNumber] = useState(1);
    // Track answered questions // Initialize timer
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const savedTime = localStorage.getItem("exam_timer_left");
        return savedTime ? parseInt(savedTime, 10) : 60 * 60;
    });
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

    const { userDetails, token, logout } = useAuthStore();
    const navigate = useNavigate();
    const [examId, setExamId] = useState("1");


    useEffect(() => {
        // Validate session token
        const sessionToken = localStorage.getItem('examSessionToken');
        console
        if (!sessionToken) {
            toast({
                title: "Invalid Session",
                description: "Please start from the instruction page",
                variant: "destructive",
            });
            navigate('/exam-instructions');
            return;
        }
    }, [])

    useEffect(() => {
        const storedExamId = localStorage.getItem("exam_id");
        if (storedExamId) setExamId(storedExamId);
    }, []);
    useEffect(() => {
        // const initCamera = async () => {
        //     try {
        //         const stream = await navigator.mediaDevices.getUserMedia({
        //             video: { width: 640, height: 480 },
        //             audio: false
        //         });
        //         setCameraStream(stream);
        //         if (videoRef.current) {
        //             videoRef.current.srcObject = stream;
        //         }
        //         toast({
        //             title: "Camera Initialized",
        //             description: "Exam monitoring is now active",
        //         });
        //     } catch (error) {
        //         toast({
        //             title: "Camera Error",
        //             description: "Please allow camera access for exam monitoring",
        //             variant: "destructive",
        //         });
        //     }
        // };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarningCount(prev => prev + 1);
                setIsWarningOpen(true);
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave the exam? This action will be recorded.';
        };

        // Auto-capture images every 15 minutes
        const captureInterval = setInterval(() => {
            captureImage();
        }, 15 * 60 * 1000);

        // Timer countdown
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-submit when timer reaches 0
                    confirmSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // initCamera();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearInterval(captureInterval);
            clearInterval(timer);
        };
    }, []);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                setCapturedImages(prev => [...prev, imageData]);

                // Send image to admin server
                sendImageToServer(imageData);
                console.log('Image captured and sent to admin:', imageData.substring(0, 50) + '...');
            }
        }
    };

    const sendImageToServer = async (imageData: string) => {
        try {
            // In a real implementation, send to your admin server
            const sessionToken = localStorage.getItem('examSessionToken');
            const response = await fetch('/api/admin/exam-images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData,
                    studentId: userDetails?.user_code, // Replace with actual student ID
                    timestamp: new Date().toISOString(),
                    examId: examId // Replace with actual exam ID
                }),
            });

            if (!response.ok) {
                console.error('Failed to send image to server');
            }
        } catch (error) {
            console.error('Error sending image to server:', error);
        }
    };


    const handleWarningClose = () => {
        setIsWarningOpen(false);
        if (warningCount >= 3) {
            toast({
                title: "Exam Terminated",
                description: "Too many violations detected. Exam will be submitted automatically.",
                variant: "destructive",
            });
            // Auto-submit exam after 3 warnings
            setTimeout(() => {
                confirmSubmit();
            }, 2000);
        }
    };
    const getExamHistory = async () => {
        setLoading(true);
        try {
            const response = await postApi(APIPATH.attemptHistory, { test_id: examId }, token, logout);
            console.log('Attempt History Response:', response);

            if (response?.success && response?.history) {
                setAttemptHistory(response);

                // Restore answers from history and build question ID mapping
                const restoredAnswers: Record<number, string> = {};
                const answeredSet = new Set<number>();
                const tempMapping = new Map<number, number>(); // sequence -> questionId

                // Sort history by attempt order to maintain sequence
                const sortedHistory = response.history.sort((a: any, b: any) => a.attempt_order - b.attempt_order);

                sortedHistory.forEach((item: any, index: number) => {
                    const sequenceNumber = index + 1; // 1-based sequence
                    tempMapping.set(sequenceNumber, item.id);

                    if (item.student_answer) {
                        restoredAnswers[item.id] = item.student_answer;
                        answeredSet.add(item.id);
                    }
                });

                setQuestionIdMapping(tempMapping);
                setAnswers(restoredAnswers);
                setAnsweredQuestions(answeredSet);
                setTotalSkipped(response?.total_skipped_answers);

                // Jump to the last attempted question or the first one
                if (response.last_attempt) {
                    // Find the sequence number for the last attempted question
                    let lastAttemptSequence = 1;
                    for (const [seqNum, questionId] of tempMapping.entries()) {
                        if (questionId === response.last_attempt) {
                            lastAttemptSequence = seqNum;
                            break;
                        }
                    }
                    await getQuestion(lastAttemptSequence);
                } else {
                    await getQuestion(1); // Start from sequence 1
                }
            } else {
                await getQuestion(1); // Fallback to first question
            }
        } catch (error) {
            console.error("Error fetching exam history:", error);
            await getQuestion(1); // Fallback on error
        } finally {
            setLoading(false);
        }
    };
    // const getExamHistory = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await postApi(APIPATH.attemptHistory, { test_id: examId }, token, logout);
    //         console.log('Attempt History Response:', response);

    //         if (response?.success && response?.history) {
    //             setAttemptHistory(response);

    //             // Restore answers from history
    //             const restoredAnswers: Record<number, string> = {};
    //             const answeredSet = new Set<number>();
    //             response.history.forEach((item: any) => {
    //                 if (item.student_answer) {
    //                     restoredAnswers[item.id] = item.student_answer;
    //                     answeredSet.add(item.id);
    //                 }
    //             });
    //             setAnswers(restoredAnswers);
    //             setAnsweredQuestions(answeredSet);
    //             setTotalSkipped(response?.total_skipped_answers)

    //             // Jump to the last attempted question or the first one
    //             if (response.last_attempt) {
    //                 await getQuestion(response.last_attempt);
    //             } else {
    //                 await getQuestion();
    //             }
    //         } else {
    //             await getQuestion(); // Fallback if no history
    //         }
    //     } catch (error) {
    //         console.error("Error fetching exam history:", error);
    //         await getQuestion(); // Fallback on error
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // This is the single entry point for loading the exam state
    useEffect(() => {
        getExamHistory();
    }, []);

    // Timer and navigation-away protection effect
    useEffect(() => {
        if (examSubmitted) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    confirmSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                const newTime = prev - 1;
                localStorage.setItem("exam_timer_left", newTime.toString());
                return newTime;
            });
        }, 1000);

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Are you sure you want to leave the exam? Your progress may be lost.";
        };

        const handlePopState = () => {
            setShowExitModal(true);
            window.history.pushState(null, "", window.location.pathname);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);
        window.history.pushState(null, "", window.location.pathname);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [examSubmitted]);

    // Update selected answer when question changes
    useEffect(() => {
        if (questionData) {
            setQuestionStartTime(Date.now());
            setSelectedAnswer(answers[questionData.question.id] || '');
        }
    }, [questionData?.question?.id, answers]);

    const getQuestion = async (sequenceNumber?: number) => {
        setLoading(true);

        try {
            const payload: any = { exam_id: examId };

            // If sequenceNumber is provided, try to get the mapped questionId
            if (sequenceNumber) {
                const questionId = questionIdMapping.get(sequenceNumber);
                if (questionId) {
                    payload['question_id'] = questionId;
                }
                // If no mapping exists, API will return the next available question
            }

            const response = await postApi(APIPATH.getQuestions, payload, token, logout);
            console.log('Get Question Response:', response);

            if (response?.success && response?.data) {
                setQuestionData(response.data);
                setTotalQuestions(response.data.total_questions);

                // Update mapping when we get a question
                if (sequenceNumber && response.data.question?.id) {
                    setQuestionIdMapping(prev => new Map(prev).set(sequenceNumber, response.data.question.id));
                    setCurrentSequenceNumber(sequenceNumber);
                } else if (response.data.question?.id) {
                    // If no sequence number provided, we need to determine current sequence
                    // This happens on initial load or when navigating without sequence
                    updateCurrentSequenceFromQuestionId(response.data.question.id);
                }

                setQuestionStartTime(Date.now());
                setSelectedAnswer(answers[response.data.question?.id] || '');
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    };
    const updateCurrentSequenceFromQuestionId = (questionId: number) => {
        // Find if this question ID is already mapped to a sequence number
        for (const [seqNum, qId] of questionIdMapping.entries()) {
            if (qId === questionId) {
                setCurrentSequenceNumber(seqNum);
                return;
            }
        }

        // If not found, this might be a new question - assign next available sequence
        const nextSequence = questionIdMapping.size + 1;
        if (nextSequence <= totalQuestions) {
            setQuestionIdMapping(prev => new Map(prev).set(nextSequence, questionId));
            setCurrentSequenceNumber(nextSequence);
        }
    };
    // const getQuestion = async (questionId?: number) => {
    //     setLoading(true);
    //     try {
    //         const payload: any = { exam_id: examId };
    //         if (questionId) payload['question_id'] = questionId;

    //         const response = await postApi(APIPATH.getQuestions, payload, token, logout);
    //         console.log('Get Question Response:', response);

    //         if (response?.success && response?.data) {
    //             setQuestionData(response.data);
    //             setTotalQuestions(response.data.total_questions);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching question:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        getQuestion(); // fetch first question on mount
    }, []);

    const handleFinalSubmit = () => {
        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        localStorage.removeItem("exam_id");

        // You can also clear other related session data if needed
        localStorage.removeItem("exam_timer_left");

        console.log("Final Submitted");
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        setLoading(true);
        try {
            const payload = { test_id: examId };
            const response = await postApi(APIPATH.finalSubmitExam, payload, token, logout);
            console.log('Final Submit Response:', response);

            if (response?.status) {
                setResultData(response);
                setExamSubmitted(true);

                // Clear any stored data
                localStorage.removeItem("exam_timer_left");
                localStorage.removeItem('exam_instructions_accepted');
                navigate('/exam-thank-you')
            }
        } catch (error) {
            console.error("Final submission failed:", error);
        } finally {
            setShowConfirmModal(false);
            setLoading(false);
        }
    };

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };
    const goToNext = async () => {
        if (!questionData) return;
        const answer = answers[questionData.question.id] || selectedAnswer;
        setLoading(true);
        const spendTime = Math.round((Date.now() - questionStartTime) / 1000);

        const payload = {
            test_id: examId,
            question_id: questionData.question.id,
            student_answer: answer,
            spend_time: spendTime.toString(),
        };

        try {
            const response: SubmitResponse = await postApi(APIPATH.submitExam, payload, token, logout);

            if (response?.success) {
                // Mark question as answered using the actual question ID
                setAnsweredQuestions(prev => new Set(prev).add(questionData.question.id));

                // Ensure current question is mapped to its sequence number
                if (!Array.from(questionIdMapping.values()).includes(questionData.question.id)) {
                    setQuestionIdMapping(prev => new Map(prev).set(currentSequenceNumber, questionData.question.id));
                }

                if (response.next_question_id) {
                    // Move to next sequence number
                    const nextSequenceNumber = currentSequenceNumber + 1;

                    // Update mapping for next question if we know the ID
                    setQuestionIdMapping(prev => new Map(prev).set(nextSequenceNumber, response.next_question_id));

                    // Load next question by sequence number
                    await getQuestion(nextSequenceNumber);
                } else {
                    // This was the last question
                    setQuestionData(prev => prev ? {
                        ...prev,
                        is_last_question: true,
                        next_question_id: null
                    } : null);
                }
            }
        } catch (error) {
            console.error("Failed to save answer:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (questionData?.question?.id) {
            // On initial load, map the first question to sequence number 1
            if (questionIdMapping.size === 0) {
                setQuestionIdMapping(prev => new Map(prev).set(1, questionData.question.id));
                setCurrentSequenceNumber(1);
            }
        }
    }, [questionData?.question?.id]);
    const handleQuestionGridClick = async (sequenceNum: number) => {
        // Check if we already have this question mapped
        const questionId = questionIdMapping.get(sequenceNum);

        if (questionId) {
            // We have the mapping, load this specific question
            await getQuestion(sequenceNum);
        } else {
            // We don't have mapping yet - this might not be accessible
            // You could either:
            // 1. Not allow jumping to unmapped questions
            // 2. Or try to load it and let the backend handle it

            // Option 1: Prevent jumping to unmapped questions
            if (sequenceNum > currentSequenceNumber + 1) {
                // Don't allow jumping too far ahead
                return;
            }

            // Option 2: Try to load it anyway
            await getQuestion(sequenceNum);
        }
    };
    const goToPrevious = async () => {
        if (currentSequenceNumber > 1) {
            const previousSequenceNumber = currentSequenceNumber - 1;
            await getQuestion(previousSequenceNumber);
        }
    };
    // const goToNext = async () => {
    //     if (!questionData) return;
    //     const answer = answers[questionData.question.id] || selectedAnswer;
    //     setLoading(true);
    //     const spendTime = Math.round((Date.now() - questionStartTime) / 1000);

    //     const payload = {
    //         test_id: examId,
    //         question_id: questionData.question.id,
    //         student_answer: answer,
    //         spend_time: spendTime.toString(),
    //     };
    //     console.log(payload.spend_time, 'spend time')

    //     try {
    //         const response: SubmitResponse = await postApi(APIPATH.submitExam, payload, token, logout);
    //         console.log('Submit Answer Response:', response);

    //         if (response?.success) {
    //             // Mark question as answered
    //             setAnsweredQuestions(prev => new Set(prev).add(questionData.question.id));

    //             if (response.next_question_id) {
    //                 // Load next question
    //                 await getQuestion(response.next_question_id);
    //                 // setQuestionNo(prev => prev + 1);
    //             } else {
    //                 // This was the last question - update the current question data to reflect this
    //                 setQuestionData(prev => prev ? {
    //                     ...prev,
    //                     is_last_question: true,
    //                     next_question_id: null
    //                 } : null);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Failed to save answer:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const goToPrevious = async () => {
    //     if (questionData?.previous_question_id) {
    //         await getQuestion(questionData.previous_question_id);

    //     }
    // };

    // Calculate question statistics
    const answeredCount = answeredQuestions.size;
    const notAnsweredCount = totalQuestions - answeredCount;

    const questionStats = [
        {
            label: 'Answered',
            count: answeredCount.toString().padStart(2, '0'),
            color: 'bg-green-500'
        },
        {
            label: 'Not Answered',
            count: notAnsweredCount.toString().padStart(2, '0'),
            color: 'bg-red-500'
        }
    ];

    // Generate question grid - simplified since we can't navigate directly to questions
    const questionGrid: any[] = [];
    for (let i = 1; i <= totalQuestions; i++) {
        let bgColor = 'bg-gray-200';

        // Check if this sequence number has been answered
        const questionId = questionIdMapping.get(i);
        if (questionId && answeredQuestions.has(questionId)) {
            bgColor = 'bg-green-500 text-white';
        } else if (i === currentSequenceNumber) {
            // Current question based on sequence number
            bgColor = 'bg-blue-500 text-white';
        }

        questionGrid.push({
            number: i.toString().padStart(2, '0'),
            className: bgColor,
            sequenceNum: i,
            questionId: questionIdMapping.get(i) || null
        });
    }

    // for (let i = 1; i <= totalQuestions; i++) {
    //     let bgColor = 'bg-gray-200';

    //     // Check if this sequence number has been answered
    //     const questionId = questionIdMapping.get(i);
    //     if (questionId && answeredQuestions.has(questionId)) {
    //         bgColor = 'bg-green-500 text-white';
    //     } else if (i === currentSequenceNumber) {
    //         // Current question based on sequence number
    //         bgColor = 'bg-blue-500 text-white';
    //     }

    //     questionGrid.push({
    //         number: i.toString().padStart(2, '0'),
    //         className: bgColor,
    //         sequenceNum: i,
    //         questionId: questionIdMapping.get(i) || null
    //     });
    // }
    // for (let i = 1; i <= totalQuestions; i++) {
    //     let bgColor = 'bg-gray-200';

    //     // Check if this sequence number has been answered
    //     const questionId = questionIdMapping.get(i);
    //     if (questionId && answeredQuestions.has(questionId)) {
    //         bgColor = 'bg-green-500 text-white';
    //     } else if (i === currentSequenceNumber) {
    //         // Current question based on sequence number
    //         bgColor = 'bg-blue-500 text-white';
    //     }

    //     questionGrid.push({
    //         number: i.toString().padStart(2, '0'),
    //         className: bgColor,
    //         sequenceNum: i,
    //         questionId: questionIdMapping.get(i) || null
    //     });
    // }
    // for (let i = 1; i <= totalQuestions; i++) {
    //     let bgColor = 'bg-gray-200';

    //     if (answeredQuestions.has(i)) {
    //         bgColor = 'bg-green-500 text-white';
    //     } else if (i === questionData?.question_no) {
    //         bgColor = 'bg-blue-500 text-white';
    //     }

    //     questionGrid.push({
    //         number: i.toString().padStart(2, '0'),
    //         className: bgColor,
    //         questionNum: i
    //     });
    // }
    // for (let i = 1; i <= totalQuestions; i++) {
    //     let bgColor = 'bg-gray-200';

    //     if (answeredQuestions.has(i)) {
    //         bgColor = 'bg-green-500 text-white';
    //     } else if (i === questionData?.question_no) {
    //         bgColor = 'bg-blue-500 text-white';
    //     }

    //     questionGrid.push({
    //         number: i.toString().padStart(2, '0'),
    //         className: bgColor,
    //         questionNum: i
    //     });
    // }

    // Prepare options from API response
    const options = questionData ? [
        { key: 'A', value: questionData.question?.optionA },
        { key: 'B', value: questionData.question?.optionB },
        { key: 'C', value: questionData.question?.optionC },
        { key: 'D', value: questionData.question?.optionD },
    ] : [];

    if (examSubmitted && resultData) {
        // navigate('/exam-thank-you')
        return (
            <div className="min-h-screen bg-gray-50 flex items-center shadow-sm justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {resultData.message || 'Exam Submitted Successfully!'}
                    </h2>
                    {/* <p className="text-gray-600 mb-4">Your answers have been recorded.</p> */}
                    <p className="text-gray-600 mb-4">Your result will be declared soon.</p>
                    {/* <div className="text-sm text-gray-500 space-y-1">
                        <p>Total Correct: {resultData.total_correct}</p>
                        <p>Total Wrong: {resultData.total_wrong}</p>
                        <p>Total Skipped: {resultData.total_skipped}</p>
                        <p>Total Marks: {resultData.total_marks}</p>
                        <p>Time Spent: {Math.floor(parseInt(resultData.total_spend_time) / 60)} minutes</p>
                    </div> */}
                    {resultData.redirect_url && (
                        <Button
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => navigate(`/dashboard`)}
                        // onClick={() => navigate(`/dashboard/${resultData.redirect_url}`)}
                        >
                            {/* View Detailed Results */}
                            Go To Dashboard
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (loading || !questionData) {
        return <LoaderWithBackground visible={true} />
    }

    const handleSecurityViolation = (violation: any) => {
        setSecurityViolations(prev => [...prev, violation]);
        setWarningCount(prev => prev + 1);

        if (securityViolations.length >= 2) { // Auto-submit after 3 violations
            toast({
                title: "Security Breach Detected",
                description: "Multiple violations detected. Exam will be terminated.",
                variant: "destructive",
            });
            setTimeout(() => handleFinalSubmit(), 2000);
        }
    };
    // Session validation check
    if (!sessionValid) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-800 mb-4">Session Invalid</h1>
                    <p className="text-red-600 mb-4">Please restart from the instruction page</p>
                    <Button onClick={() => navigate('/exam-instructions')}>
                        Return to Instructions
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <>
            {/* Warning Dialog */}
            <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Exam Violation Warning
                        </DialogTitle>
                        <DialogDescription>
                            You have switched tabs or left the exam window. This action has been recorded.
                            <br /><br />
                            <strong>Warning {warningCount} of 3</strong>
                            <br />
                            {warningCount >= 3 ?
                                "Maximum warnings reached. Your exam will be auto-submitted." :
                                "Please stay on the exam tab to continue."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button onClick={handleWarningClose} className="bg-red-600 hover:bg-red-700 text-white">
                            I Understand
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* <WebcamCapture
                onCapture={(img) => {
                    console.log("Captured image", img);
                }}
                onAutoSubmit={() => {
                    alert("Auto-submitting exam due to camera denial");

                    confirmSubmit(); // your exam submit function
                    // setShowExitModal(true)

                }}
            /> */}
            <ExamSecurity
                onViolation={handleSecurityViolation}
                maxViolations={3}
            />
            <div className="min-h-screen bg-gray-50">
                <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to submit?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                            Once submitted, you will not be able to rejoin the exam.
                            <br />
                            Answered: {answeredCount} / {totalQuestions} questions
                        </p>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={confirmSubmit}>
                                Yes, Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Exit Exam?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                            Navigating back will end your exam session. Are you sure?
                        </p>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setShowExitModal(false)}>
                                Stay
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmSubmit}>
                                Exit & Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="flex">
                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">
                                    {/* Question {questionNo} of {totalQuestions} */}
                                    {/* Question {questionData.question_no} of {totalQuestions} */}
                                    Question {currentSequenceNumber} of {totalQuestions}
                                </h2>
                                <div className="flex items-center justify-center gap-2 bg-white border rounded px-4 py-2 shadow-sm text-lg font-semibold text-red-600">
                                    <TimerReset className="w-5 h-5 text-red-500" />
                                    <span>Time Left: {formatTime(timeLeft)}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-6">
                                    {questionData.question?.question || "Question not available"}
                                </h3>

                                <div className="space-y-4">
                                    {options.map((opt) => (
                                        <div
                                            key={opt.key}
                                            // onClick={() => setSelectedAnswer(opt.key)}
                                            onClick={() => {
                                                setSelectedAnswer(opt.key);
                                                setAnswers(prev => ({ ...prev, [questionData.question.id]: opt.key }));
                                            }}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAnswer === opt.key
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium ${selectedAnswer === opt.key ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}>
                                                    {opt.key}
                                                </div>
                                                <span className="text-gray-700">{opt.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Controls */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        {/* Question {questionData.question_no} of {totalQuestions} */}
                                        Question {currentSequenceNumber} of {totalQuestions}
                                    </span>
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        variant="outline"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                        onClick={goToPrevious}
                                        disabled={loading || questionData?.is_first_question}
                                    >
                                        Previous Question
                                    </Button>
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={goToNext}
                                    // disabled={loading || !selectedAnswer}
                                    >
                                        Save And Next
                                        {/* {questionData?.is_last_question ? 'Save Answer' : 'Save And Next'} */}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 bg-white shadow-sm p-6">
                        {/* User Info */}
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                                {userDetails?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="font-medium">{userDetails?.name || 'User Name'}</span>
                        </div>

                        {/* Question Status */}
                        <div className="space-y-3 mb-6">
                            {questionStats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-5 h-5 rounded ${stat.color}`}></div>
                                        <span className="text-sm">{stat.label}</span>
                                    </div>
                                    <span className={`w-6 h-6 rounded text-white text-xs flex items-center justify-center ${stat.color}`}>
                                        {stat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Camera Monitor */}
                        {/* <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">Exam Monitor</h4>
                                <Button onClick={captureImage} size="sm" variant="outline">
                                    <Camera className="w-4 h-4 mr-1" />
                                    Capture
                                </Button>
                            </div>
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-32 bg-gray-100 rounded object-cover"
                                />
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    LIVE
                                </div>
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                            {warningCount > 0 && (
                                <div className="mt-2 text-xs text-red-600 flex items-center">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Warnings: {warningCount}/3
                                </div>
                            )}
                        </div> */}
                        <ExamWebcam
                            confirmSubmit={() => console.log("Auto-submitting exam")}
                            sendImageToServer={(img) => {
                                // API call or Firebase upload
                                console.log("Uploading:", img.length);
                            }}
                            toast={({ title, description, variant }) => {
                                console.log(`${variant || "info"}: ${title} - ${description}`);
                            }}
                            warningCount={warningCount}
                            securityViolations={securityViolations}
                        />
                        {/* Question Grid */}
                        <div className="mb-6">
                            <div className="grid grid-cols-6 gap-2 border-t pt-4">
                                {/* {questionGrid.map((question, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center ${question.className}`}

                                >
                                    {question.number}
                                </div>
                            ))} */}
                                {/* {questionGrid.map((question, index) => (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center ${question.className}`}
                                        onClick={() => getQuestion(question.questionNum)}
                                        type="button"
                                        aria-label={`Go to question ${question.number}`}
                                    >
                                        {question.number}
                                    </button>
                                ))} */}
                                {/* {questionGrid.map((question) => (
                                    <button
                                        key={question.questionNum}
                                        className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center ${question.className}`}
                                        onClick={() => getQuestion(question.questionNum)}
                                        type="button"
                                        aria-label={`Go to question ${question.number}`}
                                    >
                                        {question.number}
                                       
                                    </button>
                                ))} */}

                                {questionGrid.map((question, index) => (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center ${question.className}`}
                                        onClick={() => handleQuestionGridClick(question.sequenceNum)}
                                        type="button"
                                        aria-label={`Go to question ${question.number}`}
                                        disabled={question.sequenceNum > currentSequenceNumber + 1 && !questionIdMapping.has(question.sequenceNum)}
                                    >
                                        {question.number}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleFinalSubmit}
                            >
                                Final Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Exam;