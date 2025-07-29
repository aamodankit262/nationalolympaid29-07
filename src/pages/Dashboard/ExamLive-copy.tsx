import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { TimerReset } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from '@/store/auth/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { APIPATH } from '@/api/urls';
import { postApi } from '@/services/services';
import LoaderWithBackground from '@/components/LoaderWithBackground';

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

interface AttemptHistoryItem {
    id: number;
    question_id: number;
    student_answer: string | null;
    is_correct: boolean;
    is_wrong: boolean;
    is_skipped: boolean;
    is_attempted: boolean;
    is_pending: boolean;
    spend_time: string;
}

interface AttemptHistory {
    success: boolean;
    history: AttemptHistoryItem[];
    total_questions: number;
    total_correct_answers: number;
    total_wrong_answers: number;
    total_skipped_answers: number;
    attempted: number;
    pending: number;
    last_attempt: number | null;
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
    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
    const [attemptHistory, setAttemptHistory] = useState<AttemptHistory | null>(null);
    const [examId, setExamId] = useState("1");

    // Enhanced state for better tracking
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set());
    const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set());

    const { userDetails, token, logout } = useAuthStore();
    const navigate = useNavigate();

    // Initialize timer with improved state management
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const savedTime = localStorage.getItem("exam_timer_left");
        return savedTime ? parseInt(savedTime, 10) : 60 * 60;
    });

    useEffect(() => {
        const storedExamId = localStorage.getItem("exam_id");
        if (storedExamId) setExamId(storedExamId);
    }, []);

    useEffect(() => {
        const accepted = localStorage.getItem('exam_instructions_accepted');
        if (accepted !== 'true') {
            navigate('/dashboard/exam-instructions', { replace: true });
        }
    }, [navigate]);

    // Memoized function to get exam history
    const getExamHistory = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postApi(APIPATH.attemptHistory, { test_id: examId }, token, logout);
            console.log('Attempt History Response:', response);

            if (response?.success && response?.history) {
                setAttemptHistory(response);

                // Restore answers and question states from history
                const restoredAnswers: Record<number, string> = {};
                const answeredSet = new Set<number>();
                const skippedSet = new Set<number>();
                const visitedSet = new Set<number>();

                response.history.forEach((item: AttemptHistoryItem) => {
                    visitedSet.add(item.question_id);
                    
                    if (item.student_answer) {
                        restoredAnswers[item.question_id] = item.student_answer;
                        answeredSet.add(item.question_id);
                    }
                    
                    if (item.is_skipped) {
                        skippedSet.add(item.question_id);
                    }
                });

                setAnswers(restoredAnswers);
                setAnsweredQuestions(answeredSet);
                setSkippedQuestions(skippedSet);
                setVisitedQuestions(visitedSet);

                // Jump to the last attempted question or the first one
                if (response.last_attempt) {
                    await getQuestion(response.last_attempt);
                } else {
                    await getQuestion();
                }
            } else {
                await getQuestion(); // Fallback if no history
            }
        } catch (error) {
            console.error("Error fetching exam history:", error);
            await getQuestion(); // Fallback on error
        } finally {
            setLoading(false);
        }
    }, [examId, token, logout]);

    // Single entry point for loading the exam state
    useEffect(() => {
        getExamHistory();
    }, [getExamHistory]);

    // Enhanced timer and navigation protection
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

    // Update selected answer and track current question when question changes
    useEffect(() => {
        if (questionData) {
            setQuestionStartTime(Date.now());
            setCurrentQuestionId(questionData.question.id);
            setSelectedAnswer(answers[questionData.question.id] || '');
            
            // Mark question as visited
            setVisitedQuestions(prev => new Set(prev).add(questionData.question.id));
        }
    }, [questionData?.question?.id, answers]);

    const getQuestion = useCallback(async (questionId?: number) => {
        setLoading(true);
        try {
            const payload: any = { exam_id: examId };
            if (questionId) payload['question_id'] = questionId;

            const response = await postApi(APIPATH.getQuestions, payload, token, logout);
            console.log('Get Question Response:', response);

            if (response?.success && response?.data) {
                setQuestionData(response.data);
                setTotalQuestions(response.data.total_questions);
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    }, [examId, token, logout]);

    const handleFinalSubmit = () => {
        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
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
        const answer = selectedAnswer || answers[questionData.question.id];
        setLoading(true);
        const spendTime = Math.round((Date.now() - questionStartTime) / 1000);

        const payload = {
            test_id: examId,
            question_id: questionData.question.id,
            student_answer: answer || '',
            spend_time: spendTime.toString(),
        };

        try {
            const response: SubmitResponse = await postApi(APIPATH.submitExam, payload, token, logout);
            console.log('Submit Answer Response:', response);

            if (response?.success) {
                // Update local state based on answer
                if (answer) {
                    setAnsweredQuestions(prev => new Set(prev).add(questionData.question.id));
                    setSkippedQuestions(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(questionData.question.id);
                        return newSet;
                    });
                } else {
                    setSkippedQuestions(prev => new Set(prev).add(questionData.question.id));
                }

                // Navigate to next question or stay on last question
                if (response.next_question_id) {
                    await getQuestion(response.next_question_id);
                } else {
                    // Update to reflect this is the last question
                    setQuestionData(prev => prev ? {
                        ...prev,
                        is_last_question: true,
                        next_question_id: null
                    } : null);
                }

                // Refresh attempt history to get updated stats
                await getExamHistory();
            }
        } catch (error) {
            console.error("Failed to save answer:", error);
        } finally {
            setLoading(false);
        }
    };

    const goToPrevious = useCallback(async () => {
        if (questionData?.previous_question_id) {
            await getQuestion(questionData.previous_question_id);
        }
    }, [questionData?.previous_question_id, getQuestion]);

    // Enhanced question statistics calculation
    const questionStats = useMemo(() => {
        if (!attemptHistory || !Array.isArray(attemptHistory.history)) {
            return [
                { label: 'Answered', count: '00', color: 'bg-green-500' },
                { label: 'Skipped', count: '00', color: 'bg-gray-400' },
                { label: 'Pending', count: '00', color: 'bg-gray-200' },
            ];
        }

        const answered = attemptHistory.attempted || 0;
        const skipped = attemptHistory.total_skipped_answers || 0;
        const pending = attemptHistory.pending || 0;

        return [
            { label: 'Answered', count: answered.toString().padStart(2, '0'), color: 'bg-green-500' },
            { label: 'Skipped', count: skipped.toString().padStart(2, '0'), color: 'bg-gray-400' },
            { label: 'Pending', count: pending.toString().padStart(2, '0'), color: 'bg-gray-200' },
        ];
    }, [attemptHistory]);

    // Enhanced question grid generation
    const questionGrid = useMemo(() => {
        const grid: Array<{
            number: string;
            className: string;
            questionId: number;
            isClickable: boolean;
        }> = [];

        if (!attemptHistory || !Array.isArray(attemptHistory.history)) {
            // Fallback grid based on total questions
            for (let i = 1; i <= totalQuestions; i++) {
                grid.push({
                    number: i.toString().padStart(2, '0'),
                    className: 'bg-gray-200 hover:bg-gray-300 cursor-pointer',
                    questionId: i,
                    isClickable: true
                });
            }
            return grid;
        }

        attemptHistory.history.forEach((q, index) => {
            let bgColor = 'bg-gray-200'; // Default pending
            let textColor = '';
            let hoverColor = 'hover:bg-gray-300';

            // Determine question status and color
            if (q.is_attempted && q.student_answer) {
                bgColor = 'bg-green-500';
                textColor = 'text-white';
                hoverColor = 'hover:bg-green-600';
            } else if (q.is_skipped) {
                bgColor = 'bg-gray-400';
                textColor = 'text-white';
                hoverColor = 'hover:bg-gray-500';
            } else if (visitedQuestions.has(q.question_id)) {
                bgColor = 'bg-yellow-400';
                textColor = 'text-white';
                hoverColor = 'hover:bg-yellow-500';
            }

            // Highlight current question
            if (q.question_id === currentQuestionId) {
                bgColor = 'bg-blue-700';
                textColor = 'text-white';
                hoverColor = 'hover:bg-blue-800';
            }

            grid.push({
                number: (index + 1).toString().padStart(2, '0'),
                className: `${bgColor} ${textColor} ${hoverColor} cursor-pointer transition-colors`,
                questionId: q.question_id,
                isClickable: true
            });
        });

        return grid;
    }, [attemptHistory, currentQuestionId, visitedQuestions]);

    // Handle answer selection with improved state management
    const handleAnswerSelect = useCallback((optionKey: string) => {
        if (!questionData) return;
        
        setSelectedAnswer(optionKey);
        setAnswers(prev => ({ ...prev, [questionData.question.id]: optionKey }));
        
        // Mark as answered (locally, will be confirmed on submit)
        setAnsweredQuestions(prev => new Set(prev).add(questionData.question.id));
        setSkippedQuestions(prev => {
            const newSet = new Set(prev);
            newSet.delete(questionData.question.id);
            return newSet;
        });
    }, [questionData]);

    // Navigate to specific question
    const navigateToQuestion = useCallback(async (questionId: number) => {
        if (questionId !== currentQuestionId) {
            await getQuestion(questionId);
        }
    }, [currentQuestionId, getQuestion]);

    // Prepare options from API response
    const options = useMemo(() => {
        if (!questionData) return [];
        
        return [
            { key: 'A', value: questionData.question?.optionA },
            { key: 'B', value: questionData.question?.optionB },
            { key: 'C', value: questionData.question?.optionC },
            { key: 'D', value: questionData.question?.optionD },
        ].filter(opt => opt.value); // Filter out empty options
    }, [questionData]);

    if (examSubmitted && resultData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {resultData.message || 'Exam Submitted Successfully!'}
                    </h2>
                    <p className="text-gray-600 mb-4">Your answers have been recorded.</p>
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Total Correct: {resultData.total_correct}</p>
                        <p>Total Wrong: {resultData.total_wrong}</p>
                        <p>Total Skipped: {resultData.total_skipped}</p>
                        <p>Total Marks: {resultData.total_marks}</p>
                        <p>Time Spent: {Math.floor(parseInt(resultData.total_spend_time) / 60)} minutes</p>
                    </div>
                    {resultData.redirect_url && (
                        <Button
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => navigate(`/dashboard`)}
                        >
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to submit?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Once submitted, you will not be able to rejoin the exam.
                        <br />
                        Answered: {answeredQuestions.size} / {totalQuestions} questions
                        <br />
                        Skipped: {skippedQuestions.size} questions
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
                                Question {questionData.question_no} of {totalQuestions}
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
                                        onClick={() => handleAnswerSelect(opt.key)}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedAnswer === opt.key
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium ${
                                                selectedAnswer === opt.key ? 'bg-green-500' : 'bg-gray-400'
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
                                    Question {questionData.question_no} of {totalQuestions}
                                </span>
                                {selectedAnswer && (
                                    <span className="ml-2 text-green-600">
                                        (Answer selected: {selectedAnswer})
                                    </span>
                                )}
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
                                    disabled={loading}
                                >
                                    {questionData?.is_last_question ? 'Save Answer' : 'Save And Next'}
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

                    {/* Question Grid */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Question Navigation</h4>
                        <div className="grid grid-cols-6 gap-2 border-t pt-4">
                            {questionGrid.map((question, index) => (
                                <button
                                    key={index}
                                    className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center ${question.className}`}
                                    onClick={() => question.isClickable && navigateToQuestion(question.questionId)}
                                    type="button"
                                    disabled={!question.isClickable || loading}
                                    aria-label={`Go to question ${question.number}`}
                                    title={`Question ${question.number}${question.questionId === currentQuestionId ? ' (Current)' : ''}`}
                                >
                                    {question.number}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mb-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Answered</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                            <span>Visited</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-gray-400 rounded"></div>
                            <span>Skipped</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-blue-700 rounded"></div>
                            <span>Current</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleFinalSubmit}
                            disabled={loading}
                        >
                            Final Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exam;