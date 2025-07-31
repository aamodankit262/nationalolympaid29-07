
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
      if (status) {
        setUserDetails(user)
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
              
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>

  );
};

export default PaymentSuccess;
