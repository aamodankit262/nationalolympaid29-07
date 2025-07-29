
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Calendar, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';
import { useAuthStore } from '@/store/auth/authStore';
import moment from "moment";
import LoaderWithBackground from '@/components/LoaderWithBackground';
import Footer from '@/components/Footer';
import { getProfileApi } from '@/store/auth/authServices';
export interface orderDetailsResponse {
  success: boolean;
  message: string;
  order: {
    id: number;
    order_id: string;
    user_id: number;
    category_id: number;
    plan_title: string;
    amount: string;
    payment_status: string;
    payment_type: string;
    transaction_id: string;
    payment_time: string;
    created_at: string;
    updated_at: string;
  };
}
const PaymentSuccess = () => {
  const [loading, setLoading] = useState(false)
  const { userDetails, logout, token,setUserDetails } = useAuthStore()
  const [orderDetails, setOrderDetails] = useState<orderDetailsResponse['order'] | null>(null);
  const navigate = useNavigate();
useEffect(() => {
  getProfile()
}, [])

const getProfile = async () => {
    setLoading(true)
    try {
      const res = await getProfileApi(token, logout);
      const { status, user } = res
      // console.log(user, 'user')
      if (status) {
        setUserDetails(user)
        // if (user.isPayment === 1) {
        //   navigate("/dashboard", { replace: true });
        // } else {
        //   navigate("/plans", { replace: true });
        // }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const getOrderDetails = async () => {
    setLoading(true)
    try {
      const res = await postApi(APIPATH.orderDetails, {}, token, logout);
      // console.log(res, 'order')
      const { message, order, success } = res
      if (success) {
        setOrderDetails(order);
      } else {
        console.log(message, 'error')
        setOrderDetails(null);
      }
    } catch (error) {
      console.log(error, 'catcherr')
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getOrderDetails()
  }, [])
  return (
    <>
    <LoaderWithBackground visible = {loading}/>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="mb-8 animate-scale-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="w-12 h-12 text-white animate-bounce" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Payment Successful! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Welcome {userDetails?.name} in the National Financial Literacy Olympiad 2025
              </p>
            </div>

            {/* Payment Details Card */}
            <Card className="mb-8 shadow-xl animate-fade-in">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-semibold">{orderDetails?.transaction_id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">₹{orderDetails?.amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{orderDetails?.plan_title}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Registration Date:</span>
                    <span className="font-semibold">
                      {orderDetails?.payment_time ? moment(orderDetails.payment_time).format("DD MMM YYYY, h:mm A") : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {/* <Card className="mb-8 animate-fade-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Next?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Download Materials</h3>
                  <p className="text-sm text-gray-600">Access your e-study materials and resources</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Start Learning</h3>
                  <p className="text-sm text-gray-600">Begin your financial literacy journey</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Exam Date</h3>
                  <p className="text-sm text-gray-600">Mark your calendar for the exam</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              {/* <Button
              variant="outline"
              size="lg"
              onClick={() => window.print()}
              className="border-2 border-gray-300 px-8 py-3 rounded-full font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </Button> */}
            </div>

            {/* Support Info */}
            {/* <div className="mt-12 p-6 bg-white/50 rounded-xl border animate-fade-in">
            <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you have any questions about your registration or the exam, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
              <span>📧 support@financialliteracyolympiad.com</span>
              <span className="hidden sm:inline">|</span>
              <span>📞 +91-XXXX-XXXX-XX</span>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <Footer/>
    </>

  );
};

export default PaymentSuccess;
