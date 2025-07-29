import { AlertTriangle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  confirmSubmit: () => void;
  sendImageToServer: (image: string) => void;
  toast: (msg: { title: string; description: string; variant?: string }) => void;
  warningCount: number;
  securityViolations: string[];
}

const ExamWebcam: React.FC<Props> = ({ confirmSubmit, sendImageToServer, toast,warningCount,securityViolations }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 1 hour in seconds
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImages(prev => [...prev, imageData]);
        sendImageToServer(imageData);
        console.log("Image sent:", imageData.substring(0, 50) + "...");
      }
    }
  };

  useEffect(() => {
    const initCamera = async () => {
      if (streamRef.current) return; // Don't re-init if already running
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        // setCameraStream(stream);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        toast({
          title: "Camera Initialized",
          description: "Exam monitoring is now active",
        });
      } catch (error) {
        toast({
          title: "Camera Error",
          description: "Please allow camera access for exam monitoring",
          variant: "destructive",
        });
        navigate('/dashboard/exam-instructions');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave the exam?";
    };

    initCamera();
    window.addEventListener("beforeunload", handleBeforeUnload);

    const captureInterval = setInterval(() => {
      captureImage();
    }, 15 * 60 * 1000); // every 15 minutes

    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          confirmSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      //   if (cameraStream) {
      //     cameraStream.getTracks().forEach(track => track.stop());
      //   }
      //   window.removeEventListener("beforeunload", handleBeforeUnload);
      //   clearInterval(captureInterval);
      //   clearInterval(countdownTimer);
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        {/* <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Secure Monitor</h4>
          <Button onClick={captureSecureImage} size="sm" variant="outline">
            <Camera className="w-4 h-4 mr-1" />
            Capture
          </Button>
        </div> */}
        <div className="relative">
          <video
          ref={videoRef}
          autoPlay muted playsInline
          className="w-full h-32 bg-gray-100 rounded object-cover"
        //   style={{ width: "100%", maxWidth: 640 }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
            SECURE
          </div>
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {(warningCount > 0 || securityViolations.length > 0) && (
          <div className="mt-2 text-xs text-red-600 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Violations: {Math.max(warningCount, securityViolations.length)}/3
          </div>
        )}
      </div>

      {/* <div>
        <video
          ref={videoRef}
          autoPlay muted playsInline
          className="w-full h-32 bg-gray-100 rounded object-cover"
        //   style={{ width: "100%", maxWidth: 640 }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <p>⏳ Time left: {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}</p>
      </div> */}
    </>

  );
};

export default ExamWebcam;
