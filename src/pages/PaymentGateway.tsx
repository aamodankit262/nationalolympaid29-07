
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, BookOpen, Sparkles, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { postApi } from '@/services/services';
import { APIPATH, RAZOR_API_KEY } from '@/api/urls';
import { useAuthStore } from '@/store/auth/authStore';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import LoaderWithBackground from '@/components/LoaderWithBackground';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const PaymentGateway = () => {
  const [loading, setLoading] = useState(false);
  const { token, logout, userDetails, isLogin } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [category, setCategory] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectMedium, setSelectMedium] = useState<string | null>(null);
  const navigate = useNavigate();
  const { error, Razorpay } = useRazorpay();
  const { toast } = useToast();
  //  console.log(userDetails, 'user')
  useEffect(() => {
    if (!userDetails) return null;

    if (userDetails.isPayment === 1) {
      navigate("/dashboard", { replace: true });

    } else {
      navigate("/plans", { replace: true });

    }
  }, [userDetails, navigate]);
  // useEffect(() => {
  //   if (!userDetails) return null;

  //   if (userDetails.isPayment === 1) {
  //     navigate("/dashboard", { replace: true });

  //   } if (userDetails.type !== "student") {
  //     navigate("/home", { replace: true });

  //   }
  // }, [userDetails, navigate]);


  const getCategory = async () => {
    // console.log(userDetails?.category_id, 'userDetails in payment gateway')
    setLoading(true);
    try {
      const response = await postApi(APIPATH.categoryPrice, { category_id: userDetails?.category_id }, token, logout);
      console.log(response, 'plansss.....')
      const { success, data } = response;
      if (success && data) {
        setCategory({ id: data.category_id, name: data.category_name });
        setPlans(data.prices || []);
      } else {
        setCategory(null);
        setPlans([]);
      }
    } catch (error) {
      setCategory(null);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    // getProfile();
  }, []);
  // useEffect(() => {
  //   getProfile()

  // }, [])

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    // console.log('Selected plan:', plan);
  };

  const buyCourse = (transaction_id: string) => {
    if (!isLogin) {
      navigate("/");
      return false;
    }
    setLoading(true);
    const body = {
      category_id: category?.id,
      plan_title: selectedPlan?.title,
      amount: selectedPlan?.value,
      transaction_id: transaction_id,
      payment_type: "online",
      payment_status: "complete",
      language_medium: 'English',
    };

    postApi(APIPATH.saveOrder, body, token, logout)
      .then((resp) => {
        // console.log(resp, 'saveorder...........')
        const { success, message } = resp;
        if (success) {
          // setSaveOrderdata(resp)
          toast({
            title: "Payment Successful",
            description: message || "Payment Successful",
            variant: "default",
          });
          // getProfile()
          navigate("/plans/payment-success");
          // window.location.href = payment_url;
        } else {
          toast({
            title: "Failed to save order",
            description: message || "Failed to save order",
            variant: "destructive",
          });
          navigate("/plans/payment-failed");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const handlePayment = (order_id: any) => {
    if (!selectedPlan) return;

    const options: RazorpayOrderOptions = {
      key: RAZOR_API_KEY,
      // amount: 1,
      amount: selectedPlan?.value,
      currency: "INR",
      name: "Plan",
      description: selectedPlan?.title,
      order_id: order_id, // Generate order_id on server
      handler: (response) => {
        // console.log(response, 'handlePayment');
        // alert("Payment Successful!");
        buyCourse(response?.razorpay_payment_id);
      },
      prefill: {
        name: userDetails?.name,
        email: userDetails?.email,
        contact: userDetails?.mobile,
      },
      theme: {
        color: "#312e81",
      },
      modal: {
        ondismiss: () => {
          setLoading(false); // <-- This ensures loader closes if modal is closed
        }
      }
    };
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };
  const createOrder = () => {
    if (!isLogin) {
      navigate('/login')
      return false;
    }
    setLoading(true);
    postApi(
      APIPATH.createOrder,
      // { amount: 1 },
      { amount: selectedPlan?.value },
      token,
      logout
    )
      .then((resp) => {
        const { success, message, order } = resp;
        if (success) {
          handlePayment(order?.id);
        } else {
          toast({
            title: "Failed to create order",
            description: message || "Failed to create order",
            variant: "destructive",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <LoaderWithBackground visible={loading} />
      {/* {isLoading &&
        <LoaderWithBackground visible={isLoading} />
      } */}
      {error && <p>Error loading Razorpay: {error}</p>}
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-32 w-20 h-20 bg-gradient-to-r from-green-200/30 to-teal-200/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating Icons */}
        <div className="absolute top-32 left-20 animate-float opacity-20">
          <Target className="w-6 h-6 text-blue-400" />
        </div>
        <div className="absolute top-48 right-32 animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute bottom-60 right-20 animate-float opacity-20" style={{ animationDelay: '2s' }}>
          <BookOpen className="w-6 h-6 text-green-400" />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-16">
          {/* Header Section */}
          <div className="text-center mb-16 mt-24 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl pb-2 font-bold font-poppins mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Choose Your Learning Path
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {/* Select the perfect package for your Financial Literacy Olympiad journey.
            All plans include exam access and digital certification. */}
              <span className="text-blue-600 font-semibold">
                {/* {userDetails && userDetails.name ? userDetails.name.toUpperCase() : "User"} */}
                {userDetails?.name ? userDetails.name.split(" ")[0].toUpperCase() : "User"}
              </span>
              {userDetails && userDetails.mobile ? (
                <>
                  , <span className="text-blue-600 font-semibold">{userDetails.mobile}</span>
                </>
              ) : null}
              (Complete your registration process to access study material)
            </p>
          </div>


          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {plans?.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${selectedPlan === plan.title
                  ? 'ring-4 ring-blue-500 shadow-2xl'
                  : 'hover:shadow-xl shadow-lg'
                  }`}
                onClick={() => handlePlanSelect(plan)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center relative z-10 pt-8">
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 rounded-full bg-white shadow-lg ring-4 ring-opacity-20  ring-purple-200
                  `}>
                      {/* <Trophy className="w-8 h-8 text-blue-600" /> */}
                      <BookOpen className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-md font-bold text-gray-800 mb-2">
                    {plan.title}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      ₹{plan.value}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button
                    className={`w-full py-3 font-semibold text-lg transition-all duration-300 ${selectedPlan === plan
                      ? `bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white shadow-lg`
                      : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    {selectedPlan === plan ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Terms and Conditions */}
          {/* {selectedPlan && (
            <div className="text-center mb-8 animate-fade-in">
              <div className="max-w-2xl mx-auto p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  By proceeding with the payment, you agree to our{' '}
                  <span className="text-blue-600 hover:underline cursor-pointer font-semibold">
                    Terms and Conditions
                  </span>
                  {' '}and{' '}
                  <span className="text-blue-600 hover:underline cursor-pointer font-semibold">
                    Privacy Policy
                  </span>
                  . Please review all plan details before making your selection.
                </p>
                <p className="text-xs text-gray-500">
                  ✓ Secure payment processing | ✓ No hidden charges | ✓ Instant access upon payment
                </p>
              </div>
            </div>
          )} */}
          {/* {selectedPlan === plans[0] && (
            <div className="flex flex-col gap-1 max-w-xs mb-5 items-center">
              <label className="text-sm font-medium text-gray-700">
                Select Medium <span className="text-red-500">*</span>
              </label>

              <Select
                value={selectMedium || ""}
                onValueChange={(value) => setSelectMedium(value)}
              >
                <SelectTrigger className="h-9 text-sm px-3 py-1 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select Medium" />
                </SelectTrigger>

                <SelectContent className="text-sm">
                  {["Hindi", "English"].map((medium) => (
                    <SelectItem key={medium} value={medium}>
                      {medium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )} */}

          {/* Payment Button */}
          <div className="text-center animate-fade-in">
            <Button
              size="lg"
              disabled={!selectedPlan}
              // disabled={!selectedPlan || (selectedPlan === plans[0] && !selectMedium)}
              onClick={createOrder}
              className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 ${selectedPlan
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              // className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 ${selectedPlan && (selectedPlan !== plans[0] || selectMedium)
              //   ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
              //   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              //   }`}
            >
              {selectedPlan ? 'Proceed to Payment' : 'Select a Plan to Continue'}
            </Button>

            {selectedPlan && (
              <div className="mt-4 text-sm text-gray-600 animate-fade-in">
                <p>🔒 Secure payment powered by industry-standard encryption</p>
                <p className="mt-1">💳 We accept all major credit/debit cards and digital wallets</p>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center animate-fade-in">
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Secure Payment</h4>
                <p className="text-sm text-gray-600">256-bit SSL encryption</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Instant Access</h4>
                <p className="text-sm text-gray-600">Immediate exam registration</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Quality Materials</h4>
                <p className="text-sm text-gray-600">Expert-curated content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>

  );
};

export default PaymentGateway;
