import { useState, useEffect } from "react";
// import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import RegistrationSuccessDialog from "@/components/RegistrationSuccessDialog";
import { useQuery } from "@tanstack/react-query";
import { getApi, postApi } from "@/services/services";
import { APIPATH } from "@/api/urls";
import { useAuthStore } from "@/store/auth/authStore";
import LoaderWithBackground from "@/components/LoaderWithBackground";
import DatePicker from "react-datepicker";
// Add these imports at the top of your file
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import "react-datepicker/dist/react-datepicker.css";
// import { Label } from '@/components/ui/label';

const ResourceRegister = () => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    gender: "male",
    userAddress: "",
    // Category selection
    category: "",
    // Parents Information
    parentName: "",
    parentEmail: "",
    parentMobile: "",
    // School Details
    schoolName: "",
    standard: "",
    schoolAddress: "",
    state: "",
    city: "",
    pinCode: "",
    // Student Documents
    aadharFront: null,
    aadharBack: null,
    // Institute Information (only for college category)
    alternateMobile: "",
    instituteName: "",
    instituteCode: "",

    // Refer Code
    referCode: "",
  });
  const navigate = useNavigate();
  const [cities, setCities] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const { toast } = useToast();
  const { token, logout } = useAuthStore();
  const location = useLocation();
  const role = location.state?.role || "resource";

  // const { isPending, isError, error, data, isLoading } = useQuery({
  //   queryKey: ["classCatAndStates"],
  //   queryFn: async () => {
  //     const [categoryRes, stateRes] = await Promise.all([
  //       getApi(APIPATH.category, token, logout),
  //       getApi(APIPATH.states, token, logout),
  //     ]);

  //     // console.log(categoryRes.data, stateRes.data, "both responses");

  //     return {
  //       categories: categoryRes.data,
  //       states: stateRes.data,
  //     };
  //   },
  // });


  useEffect(() => {
    if (formData.state) {
      // Replace with your actual city API call
      getApi(`${APIPATH.cities}/${formData.state}`, token, logout)
        .then((res) => {
          // console.log(res.data, "cities");
          setCities(res.data || []);
        })
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [formData.state, token, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    let payload: any = {
      name: formData.studentName,
      // dob: formData.dateOfBirth,
      email: formData.email,
      mobile: formData.mobile,
      gender: formData.gender,
      type: role, // student, institute, resource, etc.
      // refer_code: formData.referCode,
      alternate_mobile: formData.alternateMobile,
    };



    // For resource role
    // if (role === "resource") {
    //   payload = {
    //     ...payload,
    //     gender: formData.gender,
    //     alternate_mobile: formData.alternateMobile,
    //   };
    // }

    try {
      const res = await postApi(APIPATH.signUp, payload, token, logout);
      console.log(payload, "submitformpayload");
      console.log(res, "signupResponse");
      if (res.status) {
        toast({
          title: "Registration Successful!",
          description:
            res.message || "Please verify your mobile number with OTP.",
        });
        navigate("/otp-verification", {
          state: { mobile: formData.mobile },
        });
        // navigate(`/otp-verification/${formData.mobile}`);

        // setShowSuccessDialog(true);
      } else {
        toast({
          title: "Registration Failed",
          description: res.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  // if (isError) return "An error has occurred: " + error.message;
  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoaderWithBackground visible={loading} />}
      <Header />

      {/* Registration Success Dialog */}


      <div className="flex items-center justify-center pt-32 pb-8 px-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Sign up to your Account 👋
              </h1>
              <p className="text-gray-600">
                Welcome! Start your journey by creating an account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}


              {/* Personal Details */}
              <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">
                  Personal Details
                </h3>
              </div>
              <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {/* {role == `institute` ? `School Representative Name / प्रतिनिधि का नाम *` : role == `resource` ? `Name of Person *` : `Name of Student *`} */}
                      Name of Person <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentName: e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()),
                        })
                      }
                      placeholder="Enter Person's Name "
                    // required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail / ई-मेल <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter Email Address"
                    // required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number / मोबाइल नंबर{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        +91
                      </span>
                      <Input
                        type="tel"
                        max={10}
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric
                          if (value.length <= 10) {
                            setFormData({ ...formData, mobile: value });
                          }
                        }}
                        placeholder="Enter Mobile Number"
                        className="rounded-l-none"
                      // required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Mobile Number / मोबाइल नंबर
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        +91
                      </span>
                      <Input
                        type="tel"
                        max={10}
                        value={formData.alternateMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric
                          if (value.length <= 10) {
                            setFormData({
                              ...formData,
                              alternateMobile: value,
                            });
                          }
                        }}
                        placeholder="Enter Mobile Number"
                        className="rounded-l-none"
                      // required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1B4A5C] hover:bg-[#1B4A5C]/90 text-white py-3 rounded-lg font-semibold"
              // disabled={!isFormValid()}
              >
                Send OTP
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                I have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Login now.
                </Link>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                By signing in, I accept the{" "}

                <Link
                  to="/terms/schools-resource"
                  className="text-blue-600 hover:underline"
                >
                  Terms and Conditions
                </Link>
                {/* <a href="#" className="text-blue-600 hover:underline">
                  Terms and conditions
                </a> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceRegister;
