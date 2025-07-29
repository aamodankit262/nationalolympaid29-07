import { useState, useEffect } from "react";
// import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import RegistrationSuccessDialog from "@/components/RegistrationSuccessDialog";
import { useQuery } from "@tanstack/react-query";
import { getApi, postApi } from "@/services/services";
import { APIPATH } from "@/api/urls";
import { useAuthStore } from "@/store/auth/authStore";
import LoaderWithBackground from "@/components/LoaderWithBackground";
// import DatePicker from "react-datepicker";
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

const SchoolRegister = () => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    // dateOfBirth: "",
    email: "",
    mobile: "",
    // gender: "male",
    userAddress: "",
    // Available Program for students
    // selectedProgram: '',

    // Category selection
    // category: "",
    // Parents Information
    // parentName: "",
    // parentEmail: "",
    // parentMobile: "",

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
  const { toast } = useToast();
  const { token, logout } = useAuthStore();
  const location = useLocation();
  const role = location.state?.role || "student"; // Default to 'student' if not provided
  const { isError, error, data} = useQuery({
    queryKey: ["classCatAndStates"],
    queryFn: async () => {
      const [categoryRes, stateRes] = await Promise.all([
        getApi(APIPATH.category, token, logout),
        getApi(APIPATH.states, token, logout),
      ]);

      // console.log(categoryRes.data, stateRes.data, "both responses");

      return {
        categories: categoryRes.data,
        states: stateRes.data,
      };
    },
  });
  // console.log(data.categories, 'cate')
  // if (isLoading) return <p>loadding...</p>
  // if (error) return 'An error has occurred: ' + error.message
  // Add this above your component or inside the component before return

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
      // gender: formData.gender,
      type: role, // student, institute, resource, etc.
      refer_code: formData.referCode,
      address: formData.schoolAddress,
      alternate_mobile: formData.alternateMobile,
      instituteName: formData.instituteName,
      institute_code: formData.instituteCode,
      instituteState: formData.state,
      instituteCity: formData.city,
    };
    try {
      const res = await postApi(APIPATH.signUp, payload, token, logout);
      // console.log(payload, "submitform");
      // console.log(res, "signup");
      if (res.status) {
        toast({
          title: "Registration Successful!",
          description:
            res.message || "Please verify your mobile number with OTP.",
        });
        navigate(`/otp-verification/${formData.mobile}`);

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
  if (isError) return "An error has occurred: " + error.message;
  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoaderWithBackground visible={loading} />}
      <Header />

      {/* Registration Success Dialog */}
      <RegistrationSuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />

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
                  School Representative Details
                </h3>
              </div>
              <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Representative Name{" "}
                      <span className="text-red-500">*</span>
                      <br />
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
                      placeholder={
                        "Enter Representative's Name "
                      }
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
                {/* </div> */}
              </div>
              {/* School Details */}
              {/* Institute Information - Only show for college category */}

              <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">Institute Information</h3>
              </div>
              <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institute Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.instituteName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instituteName: e.target.value,
                        })
                      }
                      placeholder="Enter Institute Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliation Code <span className="text-red-500">*</span>
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <Input
                      type="text"
                      value={formData.instituteCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instituteCode: e.target.value,
                        })
                      }
                      placeholder="Enter Affiliation Code"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / राज्य <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData({ ...formData, state: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.states?.map(
                          (state: { id: string; name: string }) => (
                            <SelectItem
                              key={state.id}
                              value={state.id.toString()}
                            >
                              {state?.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City / शहर <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        setFormData({ ...formData, city: value })
                      }
                      disabled={!formData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map(
                          (city: { id: string; name: string }) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city?.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.schoolAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schoolAddress: e.target.value,
                      })
                    }
                    placeholder="Enter Institute Address"
                  />
                </div>
              </div>
              {/* Refer Code */}
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

export default SchoolRegister;
