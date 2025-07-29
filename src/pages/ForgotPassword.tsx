
import { useState } from 'react';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password request:', formData);
    // Handle forgot password logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-teal-50 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <Link to="/login" className="flex items-center space-x-3">
              <ArrowLeft className="w-6 h-6 text-safe-blue" />
              <img 
                src="/assets/064e7ad4-4435-40dc-a788-9b0bdfadd03c.png" 
                alt="SAFE Academy Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <div className="text-center">
            <div className="w-80 h-80 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-safe-blue to-safe-teal rounded-full opacity-10"></div>
              <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="text-6xl">🔐</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/login" className="inline-flex items-center space-x-3 mb-4">
              <ArrowLeft className="w-6 h-6 text-safe-blue" />
              <img 
                src="/assets/064e7ad4-4435-40dc-a788-9b0bdfadd03c.png" 
                alt="SAFE Academy Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Forgot Password 🔒
              </h1>
              <p className="text-gray-600">
                Please enter your registered mobile number and email address.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter Mobile Number"
                    className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter Email Address"
                    className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-safe-blue mt-2">
                  A new password has been sent to your registered email address.
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full bg-safe-blue hover:bg-safe-blue/90 text-white py-3 rounded-lg font-semibold"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
