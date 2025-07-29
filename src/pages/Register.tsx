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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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
  const role = location.state?.role || "student"; // Default to 'student' if not provided

  const { isPending, isError, error, data, isLoading } = useQuery({
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
  const standardOptions: Record<string, { value: string; label: string }[]> = {
    "1": [
      { value: "6", label: "Class 6" },
      { value: "7", label: "Class 7" },
      { value: "8", label: "Class 8" },
    ],
    "2": [
      { value: "9", label: "Class 9" },
      { value: "10", label: "Class 10" },
    ],
    "3": [
      { value: "11", label: "Class 11" },
      { value: "12", label: "Class 12" },
    ],
    "4": [{ value: "college", label: "College Student" }],
  };
  useEffect(() => {
    const queryParams  = new URLSearchParams(location.search)
    const referral = queryParams.get('ref');
    if(referral) {
      // setReferralCode(referral);
      setFormData((prev) => ({...prev, referCode: referral}));
    }

  },[location.search])
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
    };

    // For student role
    if (role === "student") {
      payload = {
        ...payload,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        address: formData.schoolAddress,
        user_address: formData.userAddress,
        category_id: formData.category,
        parent_name: formData.parentName,
        parent_email: formData.parentEmail,
        parent_mobile: formData.parentMobile,
        school_name: formData.schoolName,
        standard: formData.standard,
        state: formData.state,
        city: formData.city,
        pincode: formData.pinCode,
      };
      // Only for college category (id '5')
      if (formData.category === "4") {
        // delete payload.school_name;
        delete payload.standard;
        // payload.institute_name = formData.instituteName;
        payload.institute_code = formData.instituteCode;
      }
    }

    // For institute role
    // if (role === "institute") {
    //   payload = {
    //     ...payload,

    //     // Add only institute-specific fields
    //     // dob: formData.dateOfBirth,
    //     // gender: formData.gender,
    //     address: formData.schoolAddress,
    //     alternate_mobile: formData.alternateMobile,
    //     instituteName: formData.instituteName,
    //     institute_code: formData.instituteCode,
    //     instituteState: formData.state,
    //     instituteCity: formData.city,
    //     // institutePinCode: formData.pinCode,
    //   };
    // }

    // For resource role
    if (role === "resource") {
      payload = {
        ...payload,
        gender: formData.gender,
        alternate_mobile: formData.alternateMobile,
        // dob: formData.dateOfBirth,
      };
    }

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
              {role !== "institute" && role !== "resource" && (
                <>
                  <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                    <h3 className="font-semibold">Select Category</h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.categories?.map(
                            (category: {
                              id: number;
                              category_name: string;
                            }) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category?.category_name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Personal Details */}
              <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">
                  {role == `institute`
                    ? `School Representative Details`
                    : `Personal Details`}
                </h3>
              </div>
              <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {/* {role == `institute` ? `School Representative Name / प्रतिनिधि का नाम *` : role == `resource` ? `Name of Person *` : `Name of Student *`} */}
                      {role === "institute" ? (
                        <>
                          School Representative Name{" "}
                          <span className="text-red-500">*</span>
                          <br />
                          {/* <span className="text-sm text-gray-700">प्रतिनिधि का नाम *</span> */}
                        </>
                      ) : role === "resource" ? (
                        <>
                          Name of Person <span className="text-red-500">*</span>
                        </>
                      ) : (
                        <>
                          Name of Student{" "}
                          <span className="text-red-500">*</span>
                        </>
                      )}
                      {/* Name of Student / छात्र का नाम * */}
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
                        role === "institute"
                          ? "Enter Representative's Name "
                          : role === "resource"
                            ? "Enter Person's Name "
                            : "Enter Student's Name "
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

                  {role !== "student" && (
                    <>
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
                    </>
                  )}
                </div>
                {role === "student" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth / जन्म तिथि{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={
                            formData.dateOfBirth
                              ? new Date(formData.dateOfBirth)
                              : null
                          }
                          onChange={(date: Date | null) =>
                            setFormData({
                              ...formData,
                              dateOfBirth: date
                                ? date.toISOString().split("T")[0]
                                : "",
                            })
                          }
                          dateFormat="yyyy-MM-dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          placeholderText="Select Date of Birth"
                          minDate={new Date("2000-01-01")}
                          maxDate={new Date("2016-12-31")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-safe-blue focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender / लिंग <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="male"
                              checked={formData.gender === "male"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gender: e.target.value,
                                })
                              }
                              className="mr-2"
                            />
                            Male
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="female"
                              checked={formData.gender === "female"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gender: e.target.value,
                                })
                              }
                              className="mr-2"
                            />
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
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
                              (state: { id: number; name: string }) => (
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address / पता <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.userAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              userAddress: e.target.value,
                            })
                          }
                          placeholder="Enter Address"
                        />
                        <p className="mt-1 text-xs text-gray-500 italic"><span className="text-red-500">* Please provide your complete postal address with pin code correctly during registration if you choose the Hard Copy Book Delivery option.</span></p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pin Code / पिन कोड
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <Input
                          type="text"
                          value={formData.pinCode}
                          onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                          placeholder="Enter Pin Code"
                        />
                      </div>
                    </div>
                    {/* <div className="gird grid-cols-2">
                      
                    </div> */}

                  </>
                )}
                {/* </div> */}


              </div>

              {/* Parents Information */}
              {role !== `institute` && role !== `resource` && (
                <>
                  <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                    <h3 className="font-semibold">Parents Information</h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name of Parent / Guardian / माता-पिता का नाम{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.parentName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parentName: e.target.value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase()),
                            })
                          }
                          placeholder="Enter Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent E-mail / माता पिता की ई-मेल{" "}
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <Input
                          type="email"
                          value={formData.parentEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parentEmail: e.target.value,
                            })
                          }
                          placeholder="Enter Email Address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile number of Parent / Guardian/माता-पिता/अभिभावक का
                        मोबाइल नंबर <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.parentMobile}
                        // onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric
                          if (value.length <= 10) {
                            setFormData({ ...formData, parentMobile: value });
                          }
                        }}
                        placeholder="Enter Mobile Number"
                        // placeholder="Enter Mobile number of Parent / Guardian"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* School Details */}
              {role !== "resource" &&
                role !== `institute` &&
                formData.category !== "4" && (
                  <>
                    <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                      <h3 className="font-semibold">School Details</h3>
                    </div>
                    <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name of School/संस्थान का नाम{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={formData.schoolName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                schoolName: e.target.value
                                  .toLowerCase()
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                  ),
                              })
                            }
                            placeholder="Enter Name of School"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Standard
                            <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.standard}
                            onValueChange={(value) =>
                              setFormData({ ...formData, standard: value })
                            }
                            disabled={!formData.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Standard" />
                            </SelectTrigger>
                            <SelectContent>
                              {(standardOptions[formData.category] || []).map(
                                (std) => (
                                  <SelectItem
                                    key={std?.value}
                                    value={std.value.toString()}
                                  >
                                    {std.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Address <span className="text-red-500">*</span>
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
                          placeholder="Enter School Address"
                          required
                        />
                      </div>
                      {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Pin Code / स्कूल पिन कोड <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        placeholder="Enter School Pin Code"
                      />
                    </div> */}
                    </div>
                  </>
                )}

              {/* Institute Information - Only show for college category */}
              {(role === "institute" || formData.category === "4") && (
                <>
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
                          value={formData.schoolName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              schoolName: e.target.value,
                            })
                          }
                          placeholder="Enter Institute Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institute Code
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
                          placeholder="Enter Institute Code"
                        // required
                        />
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    </div> */}
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
                </>
              )}

              {/* Refer Code */}
              {/* <div className="bg-[#7BA7BC] text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">If you have any Refer Code</h3>
              </div> */}
              {role === "student" && (
                <div className="border border-gray-200 rounded-b-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have any Refer Code
                    </label>
                    <Input
                      type="text"
                      value={formData.referCode}
                      onChange={(e) => setFormData({ ...formData, referCode: e.target.value })}
                      placeholder="Enter Refer Code"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Yes, All the information submitted is best to my knowledge
                      and is hereby verified and being submitted by myself or on
                      behalf of School / College / University /Institute, You are registering for NFLO 2025 conducted by SAFE Fintech.
                    </label>
                  </div>
                </div>
              )}


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
                {role === "student" ? (
                  <Link
                    to="/terms/students"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                ) : (
                  <Link
                    to="/terms/schools-resource"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                )}{" "}
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

export default Register;
