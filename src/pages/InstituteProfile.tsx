
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, School, Edit, FileText, CreditCard, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth/authStore';
import { postApi } from '@/services/services';
import { APIPATH, MAIN_URL } from '@/api/urls';
import { getProfileApi } from '@/store/auth/authServices';
import { DocumentField } from '@/utils/DocumentField';
import { Spinner } from '@/components/Spinner';
import { toast } from '@/hooks/use-toast';
const documentFields = [
  { key: 'aadharCard', label: 'Aadhar Card', accept: '.pdf' },
  { key: 'schoolIdCard', label: 'Institute ID', accept: '.pdf' },
  { key: 'photo', label: 'School Representative Photo', accept: '.jpg,.jpeg,.png' },
];
const bankFields = [
  { key: 'cancelledCheque', label: 'Cancelled Cheque', accept: '.pdf' },
  { key: 'panCard', label: 'Pan Card', accept: '.pdf' },
];
const InstituteProfile = () => {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const { token, logout, userDetails, setUserDetails } = useAuthStore();
  const [baseUrl, setBaseUrl] = useState(MAIN_URL)
  const [profileData, setProfileData] = useState({
    InstituteName: userDetails?.name,
    email: userDetails?.email,
    mobile: userDetails?.mobile,
    pinCode: '-',
    state: '-',
    city: '-',
    instituteCode: '_',
    role: userDetails?.type

  });


  const [documentData, setDocumentData] = useState({
    aadharCard: '',
    schoolIdCard: '',
    photo: ''
  });
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
      if (res?.status && res.user) {
        const user = res.user;
        setUserDetails(user)
        setBaseUrl(res?.baseUrl);
        setProfileData({
          InstituteName: user.name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          state: user.school?.state || '',
          city: user.school?.city || '',
          role: user.type || 'role',
          instituteCode: user.school?.InstituteCode || '',
          pinCode: user.school?.InstitutePinCode || '',
        });
        setDocumentData({
          aadharCard: user?.aadhar_card || '',
          // birthCertificate: user?.birth_certificate || '',
          schoolIdCard: user.school?.id_card || '',
          photo: user?.image
            ? user?.image.startsWith('http')
              ? user?.image
              : (res?.baseUrl || '') + user?.image
            : ''
          // photo: user?.image ? (user?.image.startsWith('http') ? user?.image : baseUrl + user?.image) : ''
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

      // Append institute profile fields
      formDataToSend.append('name', profileData.InstituteName || '');
      // formDataToSend.append('email', profileData.email || '');
      // formDataToSend.append('mobile', profileData.mobile || '');
      formDataToSend.append('instituteCode', profileData.instituteCode || '');
      formDataToSend.append('type', profileData.role || '');
      formDataToSend.append('bankName', bankData.bankName || '');
      formDataToSend.append('accountNumber', bankData.accountNumber || '');
      formDataToSend.append('ifscCode', bankData.ifscCode || '');
      formDataToSend.append('accountHolderName', bankData.accountHolderName || '');

      // Attach files if available (handle both File and string)
      if (documentData.aadharCard) {
        formDataToSend.append('aadhar_card', documentData.aadharCard);
      } else if (typeof documentData.aadharCard === 'string' && documentData.aadharCard) {
        formDataToSend.append('aadhar_card', documentData.aadharCard);
      }
      if (documentData.schoolIdCard) {
        formDataToSend.append('id_card', documentData.schoolIdCard);
      } else if (typeof documentData.schoolIdCard === 'string' && documentData.schoolIdCard) {
        formDataToSend.append('id_card', documentData.schoolIdCard);
      }
      if (documentData.photo) {
        formDataToSend.append('image', documentData.photo);
      } else if (typeof documentData.photo === 'string' && documentData.photo) {
        formDataToSend.append('image', documentData.photo);
      }
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

      // Call the updateInstitute API
      const res = await postApi(APIPATH.updateInstitute, formDataToSend, token, logout, 1);
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
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {/* <AvatarImage src={profileImage || undefined} alt="Profile" /> */}
                    <AvatarFallback className="text-lg">
                      {profileData.InstituteName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profileData.InstituteName}</h3>
                  <p className="text-gray-500">{profileData.role}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    School Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.InstituteName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        InstituteName: e.target.value
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase()),
                      })}

                    // disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.InstituteName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    School E-mail / ई-मेल
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
                    School Mobile Number / मोबाइल नंबर
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    Affiliation Code
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.instituteCode}
                      onChange={(e) => setProfileData({ ...profileData, instituteCode: e.target.value })}
                    // disabled

                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.instituteCode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    State / राज्य
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData?.state}
                      // onChange={(e) => setProfileData({ ...profileData, instituteCode: e.target.value })}
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    City / शहर
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.city}
                      // onChange={(e) => setProfileData({ ...profileData, instituteCode: e.target.value })}
                      disabled

                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    School PinCode
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.pinCode}
                      // onChange={(e) => setProfileData({ ...profileData, pinCode: e.target.value })}
                    disabled

                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.pinCode}</p>
                  )}
                </div>
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
                {documentFields.map(field => (
                  <DocumentField
                    key={field.key}
                    label={field.label}
                    value={documentData[field.key]}
                    isEditing={isEditing}
                    accept={field.accept}
                    baseUrl={baseUrl}
                    onChange={file => setDocumentData({ ...documentData, [field.key]: file })}
                  />
                ))}
              </div>
            </CardContent>
          </Card> */}
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
                {bankFields.map(field => (
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

export default InstituteProfile;
