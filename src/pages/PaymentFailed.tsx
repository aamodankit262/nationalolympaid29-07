
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Calendar, BookOpen, Trophy, Shield, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';
import { useAuthStore } from '@/store/auth/authStore';
import moment from "moment";
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
const PaymentFailed = () => {
  const [loading, setLoading] = useState(false)
  const { userDetails, logout, token } = useAuthStore()
  const [orderDetails, setOrderDetails] = useState<orderDetailsResponse['order'] | null>(null);
  const navigate = useNavigate();

  const getOrderDetails = async () => {
    setLoading(true)
    try {
      const res = await postApi(APIPATH.orderDetails, {}, token, logout);
      console.log(res, 'order')
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="mb-8 animate-scale-in">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <ShieldAlert className="w-12 h-12 text-white animate-bounce" />
                {/* <CheckCircle className="w-12 h-12 text-white animate-bounce" /> */}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Payment Failed! ❌
              </h1>
              <p className="text-lg text-gray-600">
                Welcome to the Financial Literacy Olympiad 2025
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate('/')}
                // onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
             
            </div>

            
          </div>
        </div>
      </div>
    </>

  );
};

export default PaymentFailed;
