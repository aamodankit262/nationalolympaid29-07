import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

const WebcamCapture = ({
  onCapture,
  onAutoSubmit,
}: {
  onCapture?: (img: string) => void;
  onAutoSubmit?: () => void;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [alert, setAlert] = useState('');

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: 'user',
  };

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  };

  useEffect(() => {
    loadModels();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setPermission('granted'))
      .catch(() => setPermission('denied'));
  }, []);

  // Auto-submit logic on camera denial
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (permission === 'denied') {
      timeout = setTimeout(() => {
        if (onAutoSubmit) onAutoSubmit();
      }, 1000); // 1 minute
    }
    return () => clearTimeout(timeout);
  }, [permission, onAutoSubmit]);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    if (onCapture) onCapture(imageSrc);

    const detections = await faceapi.detectAllFaces(
      webcamRef.current.video as HTMLVideoElement,
      new faceapi.TinyFaceDetectorOptions()
    );

    setAlert(detections.length === 0 ? '⚠️ Face not visible. Please look at the camera.' : '');
  }, [onCapture]);

  useEffect(() => {
    if (permission === 'granted') {
      const interval = setInterval(capture, 30000);
      return () => clearInterval(interval);
    }
  }, [capture, permission]);

  if (permission === 'pending') return <p>Requesting webcam access...</p>;
  if (permission === 'denied') return <p className="text-red-600 font-semibold">Camera access denied. Exam will be submitted shortly.</p>;

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        height={80}
        width={80}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <p className="text-red-500 font-semibold mt-2">{alert}</p>
    </div>
  );
};

export default WebcamCapture;
