import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup any remaining camera streams
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(() => {
        // Camera was not active, ignore error
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Exam Submitted Successfully!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="text-lg mb-2">Thank you for giving the exam</p>
              <p className="text-sm">Your responses have been recorded and submitted successfully.</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Result Status</span>
              </div>
              <p className="text-blue-700 text-sm">
                Results will be declared soon. You will be notified via email once they are available.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-600 mt-1" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 mb-1">What's Next?</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your email for result updates</li>
                    <li>• Visit your dashboard for exam history</li>
                    <li>• Contact support if you have any concerns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamThankYou;