import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { loginApi, verifyOtpApi } from "@/store/auth/authServices";
import { useAuthStore } from "@/store/auth/authStore";
import LoaderWithBackground from "@/components/LoaderWithBackground";
import { useToast } from "@/hooks/use-toast";
// import { getProfileApi } from "./Profile";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { setLogin, setToken, setUserDetails } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || ""; // Get mobile from state or params
  const { id } = useParams();
  // const mobile = id;
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    // setLoading(true);
    try {
      const res = await verifyOtpApi({ mobile: mobile, otp: otp });
      const { status, message, user, token } = res;
      if (status) {
        setLogin(true);
        setToken(token);
        setUserDetails(user);
        // Fetch latest profile after OTP verification
        // try {
        //   const profileRes = await getProfileApi(token, logout);
        //   if (profileRes?.status && profileRes.user) {
        //     setUserDetails(profileRes.user);
        //   } else {
        //     setUserDetails(user); // fallback to user from OTP response
        //   }
        // } catch (e) {
        //   setUserDetails(user); // fallback in case of error
        // }
        if (user.type === "institute") {
          navigate("/school-dashboard");
        } else if (user.type === "resource") {
          navigate("/resource-person-dashboard");
        } else {
          // navigate('/dashboard');
          navigate("/plans");
        }
      } else {
        // Optionally show error message here
        toast({
          title: "OTP Verification Failed",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('OTP verification:', otp);

  //   // For demo purposes, we'll simulate different user types
  //   // In real app, this would be determined by the backend response
  //   const userType = localStorage.getItem('userType') || 'student';

  //   if (userType === 'school' || userType === 'institute') {
  //     navigate('/school-dashboard');
  //   } else if (userType === 'resource') {
  //     navigate('/resource-person-dashboard');
  //   } else {
  //     navigate('/dashboard');
  //   }
  // };
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await loginApi({ mobile });
      if (res?.status) {
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your mobile.",
        });
      } else {
        toast({
          title: "Failed",
          description: res?.message || "Could not resend OTP.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    {loading && <LoaderWithBackground visible={loading} />}
      {/* <LoaderWithBackground visible={loading} /> */}
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-44 pb-8 px-8">
          <div className="w-full max-w-md">
            <Link
              to="/login"
              className="flex items-center text-safe-blue hover:underline font-semibold mb-4"
            >
              <span aria-hidden="true" className="mr-2">
                ←
              </span>
              Back to Login
            </Link>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  OTP Verification
                </h1>
                <p className="text-gray-600">
                  Enter the OTP sent to your mobile number.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    OTP*
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="pl-4 pr-4 py-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-safe-blue hover:bg-safe-blue/90 text-white py-3 rounded-lg font-semibold"
                >
                  Verify OTP
                </Button>
              </form>

              <div className="mt-6 text-center">
                {/* <p className="text-gray-600">
                Didn't receive the OTP?{' '}
                <Link to="/login" className="text-safe-blue hover:underline font-semibold">
                  Resend OTP.
                </Link>
              </p> */}
                <p className="text-gray-600">
                  Didn't receive the OTP?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-safe-blue hover:underline font-semibold"
                  >
                    Resend OTP.
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
