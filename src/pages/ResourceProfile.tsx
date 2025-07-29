
import { useState, useEffect } from 'react';
import { User, Mail, Phone,  Edit,  CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
// import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/authStore';
// import moment from 'moment';
import { postApi } from '@/services/services';
import { APIPATH, MAIN_URL } from '@/api/urls';
import { getProfileApi } from '@/store/auth/authServices';
import { Spinner } from '@/components/Spinner';
import { DocumentField } from '@/utils/DocumentField';
import { toast } from '@/hooks/use-toast';
const documentFields = [
  // { key: 'aadharCard', label: 'Aadhar Card', accept: '.pdf' },
  { key: 'cancelledCheque', label: 'Cancelled Cheque', accept: '.pdf' },
  { key: 'panCard', label: 'Pan Card', accept: '.pdf' },
  // { key: 'photo', label: 'Passbook Image', accept: '.jpg,.jpeg,.png' },
];
const ResourceProfile = () => {
  const { token, logout, userDetails, setUserDetails } = useAuthStore();
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [baseUrl, setBaseUrl] = useState(MAIN_URL)
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: userDetails?.name,
    email: userDetails?.email,
    mobile: userDetails?.mobile,
    // alternate_mobile: userDetails?.alternate_mobile,
    // gender: userDetails?.gender,
    // dateOfBirth: moment(userDetails?.dob).format("YYYY-MM-DD"),
    role: userDetails?.type // Can be 'Student' or 'Resource Person'
  });

  // const [documentData, setDocumentData] = useState({
  //   aadharCard: '',
  //   birthCertificate: '',
  //   schoolIdCard: '',
  //   photo: ''
  // });

  // Guardian details for students


  // Bank details for resource persons
  const [bankData, setBankData] = useState<any>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    panCard: '',
    cancelledCheque: ''
  });
  useEffect(() => {
    fetchProfile();
  }, [token, logout]);
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfileApi(token, logout);
      // console.log(res, 'getprofile')
      if (res?.status && res.user) {
        const user = res.user;
        setUserDetails(user)
        setBaseUrl(res?.baseUrl);
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          // alternate_mobile: user?.alternate_mobile || '',
          // gender: user.gender || '',
          // dateOfBirth: user.dob ? moment(user.dob).format("YYYY-MM-DD") : '',
          role: user.type || '',
        });
        setBankData({
          accountHolderName: user.school?.accountHolderName || '',
          bankName: user.school?.bankName || '',
          accountNumber: user.school?.accountNumber || '',
          ifscCode: user.school?.ifscCode || '',
          branchName: user.school?.branchName || '',
          panCard: user.pancard || '',
          cancelledCheque: user.school?.cancelled_check || ''
        });
        // setDocumentData({
        //   aadharCard: user?.aadhar_card || '',
        //   birthCertificate: user?.birth_certificate || '',
        //   schoolIdCard: user.school?.school_id_card || '',
        //   photo: user?.image
        //     ? user?.image.startsWith('http')
        //       ? user?.image
        //       : (res?.baseUrl || '') + user?.image
        //     : ''
        // });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', profileData.name || '');
      // formDataToSend.append('dob', profileData.dateOfBirth || '');
      formDataToSend.append('email', profileData.email || '');
      // formDataToSend.append('gender', profileData.gender || '');
      formDataToSend.append('type', 'resource');
      formDataToSend.append('bankName', bankData.bankName || '');
      formDataToSend.append('accountNumber', bankData.accountNumber || '');
      formDataToSend.append('ifscCode', bankData.ifscCode || '');
      formDataToSend.append('accountHolderName', bankData.accountHolderName || '');
      formDataToSend.append('branchName', bankData.branchName || '');
      // formDataToSend.append('alternate_mobile', profileData.alternate_mobile || '');

      // Attach files if available (handle both File and string)
      if (bankData.panCard instanceof File) {
        formDataToSend.append('pancard', bankData.panCard);
      } else if (typeof bankData.panCard === 'string' && bankData.panCard) {
        formDataToSend.append('pancard', bankData.panCard);
      }
      if (bankData.cancelledCheque instanceof File) {
        formDataToSend.append('cancelled_check', bankData.cancelledCheque);
      } else if (typeof bankData.cancelledCheque === 'string' && bankData.cancelledCheque) {
        formDataToSend.append('cancelled_check', bankData.cancelledCheque);
      }

      // Debug: log payload
      // for (let pair of formDataToSend.entries()) {
      //   console.log(pair[0] + ':', pair[1]);
      // }

      // Call the updateResource API
      const res = await postApi(APIPATH.updateResource, formDataToSend, token, logout, 1);
      console.log(res, 'updateResource');
      if (res.status) {
        await fetchProfile();
        toast({
          title: "Registration Successful!",
          description: res?.message || "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        console.log(res?.message)
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setProfileImage(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <Spinner />
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {/* <AvatarImage src={profileImage || undefined} alt="Profile" /> */}
                    <AvatarFallback className="text-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {/* {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )} */}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profileData.name}</h3>
                  <p className="text-gray-500">{profileData.role}</p>
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
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.name}</p>
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
                      // onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.email}</p>
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
                      // onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.mobile}</p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Alternate Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.alternate_mobile}
                       onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setProfileData({
                            ...profileData,
                            alternate_mobile: value,
                          });
                        }
                      }}
                     
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.alternate_mobile}</p>
                  )}
                </div> */}

                {/* <div>
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
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.gender}</p>
                  )}
                </div> */}

                {/* <div>
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
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.dateOfBirth}</p>
                  )}
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Document Details Section (Only for Students) */}

          {/* <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumentData({ ...documentData, aadharCard: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {documentData.aadharCard || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Certificate
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumentData({ ...documentData, birthCertificate: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {documentData.birthCertificate || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School ID Card
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumentData({ ...documentData, schoolIdCard: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {documentData.schoolIdCard || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Photo
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setDocumentData({ ...documentData, photo: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {documentData.photo || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
             
            </CardContent>
          </Card> */}

          {/* Guardian Details Section (Only for Students) */}
          {/* Bank Details Section (Only for Resource Persons) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={bankData.accountHolderName}
                      onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {bankData.accountHolderName || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {bankData.accountNumber ? bankData.accountNumber : 'Not provided'}
                      {/* {bankData.accountNumber ? '****' + bankData.accountNumber.slice(-4) : 'Not provided'} */}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  {isEditing ? (
                    <Input
                      value={bankData.ifscCode}
                      onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {bankData.ifscCode || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={bankData.bankName}
                      onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {bankData.bankName || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={bankData.branchName}
                      onChange={(e) => setBankData({ ...bankData, branchName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {bankData.branchName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setBankData({ ...bankData, panCard: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {bankData.panCard || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancelled Cheque
                  </label>
                  {isEditing ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setBankData({ ...bankData, cancelledCheque: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {bankData.cancelledCheque || 'Not uploaded'}
                      </span>
                    </div>
                  )}
                </div> */}
                {documentFields.map(field => (
                  <DocumentField
                    key={field.key}
                    label={field.label}
                    value={bankData[field.key]}
                    isEditing={isEditing}
                    accept={field.accept}
                    baseUrl={baseUrl}
                    onChange={file => setBankData({ ...bankData, [field.key]: file })}
                  />
                ))}
              </div>
              <div className='content-center'>
                <Button
                  // variant="outline"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className=" bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </Button>
              </div>

            </CardContent>

          </Card>
        </main>
      </div>
    </>

  );
};

export default ResourceProfile;
