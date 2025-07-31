import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  Edit,
  FileText,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth/authStore";
import moment from "moment";
import { postApi } from "@/services/services";
import { APIPATH, MAIN_URL } from "@/api/urls";
import { Spinner } from "@/components/Spinner";
import { DocumentField } from "@/utils/DocumentField";
import { getProfileApi } from "@/store/auth/authServices";
import { toast } from "@/hooks/use-toast";
const documentFields = [
  { key: "aadharCard", label: "Aadhar Card", accept: ".pdf" },
  { key: "birthCertificate", label: "Birth Certificate", accept: ".pdf" },
  { key: "schoolIdCard", label: "School ID Card", accept: ".pdf" },
  { key: "photo", label: "Student Photo", accept: ".jpg,.jpeg,.png" },
];
const StudentProfile = () => {
  const [loading, setLoading] = useState(false);
  const { token, logout, userDetails, setUserDetails } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [baseUrl, setBaseUrl] = useState(MAIN_URL);
  const [profileData, setProfileData] = useState({
    name: userDetails?.name,
    email: userDetails?.email,
    mobile: userDetails?.mobile,
    gender: userDetails?.gender,
    dateOfBirth: moment(userDetails?.dob).format("YYYY-MM-DD"),
    address: userDetails?.address || "-",
    useAddress: userDetails?.user_address || "",
    school: "_",
    instituteCode: "_",
    class: "_",
    role: userDetails?.type,
    state: "",
    city: "",
  });

  const [documentData, setDocumentData] = useState<{
    aadharCard: string | File;
    birthCertificate: string | File;
    schoolIdCard: string | File;
    photo: string | File;
  }>({
    aadharCard: "",
    birthCertificate: "",
    schoolIdCard: "",
    photo: "",
  });

  const [guardianData, setGuardianData] = useState({
    guardianName: "",
    guardianMobile: "",
    guardianEmail: "",
  });
  useEffect(() => {
    fetchProfile();
  }, [token, logout]);
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfileApi(token, logout);
      console.log(res, "getprofile");
      if (res?.status && res.user) {
        const user = res.user;
        setUserDetails(user);
        setBaseUrl(res?.baseUrl);
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          gender: user.gender || "",
          dateOfBirth: user.dob ? moment(user.dob).format("YYYY-MM-DD") : "",
          address: user.school?.address || "",
          useAddress: user.user_address || "",
          school: user.school?.school_name || user.school?.institute_name || "",
          class: user.school?.standard || "",
          role: user.type || "",
          instituteCode: user.school?.institute_code || "",
          state: user.school?.state || "",
          city: user.school?.city || "",
        });
        setGuardianData({
          guardianName: user.school?.parent_name || "",
          guardianMobile: user.school?.parent_mobile || "",
          guardianEmail: user.school?.parent_email || "",
        });
        setDocumentData({
          aadharCard: user?.aadhar_card || "",
          birthCertificate: user?.birth_certificate || "",
          schoolIdCard: user.school?.school_id_card || "",
          photo: user?.image
            ? user?.image.startsWith("http")
              ? user?.image
              : (res?.baseUrl || "") + user?.image
            : "",
          // photo: user?.image ? (user?.image.startsWith('http') ? user?.image : baseUrl + user?.image) : ''
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", profileData.name || "");
      // formDataToSend.append(
      //   "category_id",
      //   userDetails?.category_id?.toString() || ""
      // );
      // formDataToSend.append(
      //   "dob",
      //   profileData.dateOfBirth
      //     ? moment(profileData.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD")
      //     : ""
      // );
      // formDataToSend.append("email", profileData.email || "");
      // formDataToSend.append("gender", profileData.gender || "");
      formDataToSend.append("type", profileData.role || "student");
      formDataToSend.append("parent_name", guardianData.guardianName || "");
      formDataToSend.append("parent_email", guardianData.guardianEmail || "");
      formDataToSend.append("parent_mobile", guardianData.guardianMobile || "");
      formDataToSend.append("address", profileData.address || "");
      formDataToSend.append("user_address", profileData.useAddress || "");

      // Only append school/institute/class if they are not empty
      if (profileData.school)
        formDataToSend.append("school_name", profileData.school);
      if (profileData.class)
        formDataToSend.append("standard", profileData.class);
      if (profileData.instituteCode)
        formDataToSend.append("institute_code", profileData.instituteCode);

      // Attach files if available
      if (documentData.aadharCard instanceof File) {
        formDataToSend.append("aadhar_card", documentData.aadharCard);
      }
      if (documentData.birthCertificate instanceof File) {
        formDataToSend.append(
          "birth_certificate",
          documentData.birthCertificate
        );
      }
      if (documentData.schoolIdCard instanceof File) {
        formDataToSend.append("school_id_card", documentData.schoolIdCard);
      }
      if (documentData.photo instanceof File) {
        formDataToSend.append("image", documentData.photo);
      }
      const res = await postApi(
        APIPATH.updateStudent,
        formDataToSend,
        token,
        logout,
        1
      );
      if (res.status) {
        await fetchProfile();
        toast({
          title: "Registration Successful!",
          description: res?.message || "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <Spinner />
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-lg">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profileData.name}</h3>
                  <p className="text-gray-500">
                    {profileData.role
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          name: e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()),
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.mobile}
                      disabled
                    // onChange can be omitted or left as is, but it won't be triggered
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.gender}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-safe-blue focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.gender}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.dateOfBirth}
                    </p>
                  )}
                </div>

                {userDetails?.category_id !== 4 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <School className="w-4 h-4 inline mr-2" />
                      Class
                    </label>
                    {isEditing ? (
                      <Input value={profileData.class} disabled />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {profileData.class}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {/* State and City Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    State
                  </label>
                  {isEditing ? (
                    <Input value={profileData.state} disabled />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    City
                  </label>
                  {isEditing ? (
                    <Input value={profileData.city} disabled />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {profileData.city}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Student Address
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.useAddress}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        useAddress: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profileData.useAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <School className="w-4 h-4 inline mr-2" />
                  School/Institution
                </label>
                {isEditing ? (
                  <Input value={profileData.school} disabled />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profileData.school}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  School Address
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profileData.address}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Document Details Section (Only for Students) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentFields.map((field) => (
                  <DocumentField
                    key={field.key}
                    label={field.label}
                    value={documentData[field.key]}
                    isEditing={isEditing}
                    accept={field.accept}
                    baseUrl={baseUrl}
                    onChange={(file) =>
                      setDocumentData({ ...documentData, [field.key]: file })
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Parent Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={guardianData.guardianName}
                      onChange={(e) => {
                        setGuardianData({
                          ...guardianData,
                          guardianName: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {guardianData.guardianName || "Not provided"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Parent Mobile
                  </label>
                  {isEditing ? (
                    <Input
                      value={guardianData.guardianMobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setGuardianData({
                            ...guardianData,
                            guardianMobile: value,
                          });
                        }
                      }}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {guardianData.guardianMobile || "Not provided"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Parent Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="guardianEmail"
                      value={guardianData.guardianEmail}
                      onChange={(e) =>
                        setGuardianData({
                          ...guardianData,
                          guardianEmail: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {guardianData.guardianEmail || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
              <div className="content-center">
                <Button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className=" bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default StudentProfile;
