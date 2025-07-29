import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Camera, CheckCircle, AlertTriangle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth/authStore';
import { postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';

const ExamInstructions = () => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [examDetails, setExamDetails] = useState<any>(null);
  const { userDetails, token, logout } = useAuthStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [examId, setExamId] = useState("1");
  useEffect(() => {
    const storedExamId = localStorage.getItem("exam_id");
    if (storedExamId) setExamId(storedExamId);
  }, []);
  const instructions = [
    {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      title: "Time Management",
      text: "You have 35 minutes to complete the exam. The timer will be visible throughout."
    },
    {
      icon: <Eye className="w-5 h-5 text-orange-500" />,
      title: "Monitoring",
      text: "Your camera will be active during the exam for monitoring purposes. Images will be captured every 15 minutes."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Tab Switching",
      text: "Do not switch tabs or leave the exam window. You will receive warnings, and after 3 warnings, the exam will auto-submit."
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: "Submission",
      text: "The exam will auto-submit when time expires or you click submit. Ensure all answers are saved."
    }
  ];
  useEffect(() => {
    const examId = localStorage.getItem("exam_id");
    if (!examId) {
      navigate("/dashboard"); // fallback
    }
  }, []);
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        toast({
          title: "Camera Ready",
          description: "Camera access granted for exam monitoring",
        });
      } catch (error) {
        toast({
          title: "Camera Access Required",
          description: "Please allow camera access to proceed with the exam",
          variant: "destructive",
        });
      }
    };

    initCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      try {
        const response = await postApi(APIPATH.examDetails, { exam_id: examId }, token, logout)
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

  const handleStartExam = () => {
    if (!cameraStream) {
      toast({
        title: "Camera Required",
        description: "Camera access is required to start the exam",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Accept Terms",
        description: "Please accept the terms and conditions to proceed",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmStartExam = () => {
    // Generate session token for security
    const sessionToken = btoa(Date.now() + Math.random().toString(36));
    localStorage.setItem('examSessionToken', sessionToken);
    // Clean up camera stream from instructions page
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    navigate('/dashboard/exam-live');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Instructions</h1>
          <p className="text-gray-600">Please read carefully before starting your exam</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Important Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {instruction.icon}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{instruction.title}</h4>
                    <p className="text-sm text-gray-600">{instruction.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Camera Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Camera Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-48 bg-gray-100 rounded object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  LIVE
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your camera is active and will monitor you during the exam. Make sure you're in a well-lit area and clearly visible.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms and Conditions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>1. Exam Integrity:</strong> You agree to maintain academic integrity throughout the examination.</p>
                <p><strong>2. Monitoring:</strong> You consent to video monitoring and image capture during the exam.</p>
                <p><strong>3. Technical Requirements:</strong> You are responsible for ensuring stable internet and proper camera functionality.</p>
                <p><strong>4. Violation Policy:</strong> Any violation of exam rules will result in automatic submission and potential disqualification.</p>
                <p><strong>5. Data Usage:</strong> Captured images and exam data will be used solely for monitoring and evaluation purposes.</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read and accept the terms and conditions
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Start Exam Button */}
        <div className="text-center">
          <Button
            onClick={handleStartExam}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            disabled={!cameraStream || !termsAccepted}
          >
            Start Exam
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Exam Start </DialogTitle>
            <DialogDescription>
              Are you ready to begin the exam? Once started, you cannot return to these instructions.
              <br /><br />
              {/* <br /><br />
              <strong>Exam Duration:</strong> 35 minutes
              <br />
              <strong>Total Questions:</strong> 30
              <br />
              <strong>Monitoring:</strong> Active */}
              {/* <h3 className="text-xl font-semibold mb-4">{examDetails?.test_name} </h3> */}
              <p className="text-sm">Duration: <strong>{examDetails?.duration || 60} Minutes</strong></p>
              <p className="text-sm">Total Questions: <strong>{examDetails?.no_of_questions || 0}</strong></p>
              <p className="text-sm">Maximum Marks: <strong>{examDetails?.maximum_marks || 0}</strong></p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStartExam} className="bg-green-600 hover:bg-green-700 text-white">
              Yes, Start Exam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamInstructions;