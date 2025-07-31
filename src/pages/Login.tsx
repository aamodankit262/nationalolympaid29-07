
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { loginApi } from '@/store/auth/authServices';
import { useToast } from '@/hooks/use-toast';
import LoaderWithBackground from '@/components/LoaderWithBackground';

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    mobile: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    setLoading(true)
    try {
      const res = await loginApi({ mobile: formData.mobile });
      if (res?.status) {
        toast({
          title: "Registration Successful!",
          description: res?.message || "Registration Successful!",
        });
        navigate("/otp-verification", {
          state: { mobile: formData.mobile },
        });


      } else {
        toast({
          title: "Failed to send OTP",
          description: res?.message || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoaderWithBackground visible={loading} />
      <Header />
      <div className="flex items-center justify-center pt-32 pb-8 px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Login to your Account 👋
              </h1>
              <p className="text-gray-600">
                We'll send an OTP to your registered mobile number for verification.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number*
                </label>
                <div className="relative">
                  <Input
                    id="mobile"
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) setFormData({ ...formData, mobile: value });
                    }}
                    placeholder="Enter Mobile Number"
                    className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-safe-blue hover:bg-safe-blue/90 text-white py-3 rounded-lg font-semibold"
              >
                Send OTP
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/role-selection" className="text-safe-blue hover:underline font-semibold">
                  Register now.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
