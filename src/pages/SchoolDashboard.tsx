
import { useEffect, useState } from 'react';
import { Users, LogOut, CodeSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/authStore';
import InstituteProfile from './InstituteProfile';
import { getApi, postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterBar } from '@/components/FilterBar';
interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}
const initialFilters = {
  status: "all",
  state: "all",
  city: "all",
  category: "all",
};
const SchoolDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDeshboardData] = useState(null)
  const [exams, setExams] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { logout, userDetails, token } = useAuthStore()
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  useEffect(() => {
    if (userDetails?.type !== "institute") {
      navigate('/home', { replace: true });
    } else {
      getDeshboard()
    }
  }, [userDetails, navigate]);
  useEffect(() => {
    const fetchFilters = async () => {
      const [states, categories] = await Promise.all([
        fetchStates(),
        fetchCategories(),
      ]);

      const newFilters: FilterOption[] = [
        {
          key: "status",
          label: "Status",
          options: [
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
          ],
        },
        {
          key: "state",
          label: "State",
          options: states.map((s) => ({ value: s.id.toString(), label: s.name })),
        },

        {
          key: "city",
          label: "City",
          options: [], // set from another useEffect when a state is selected
        },
        {
          key: "category",
          label: "Category",
          options: categories.map((c) => ({ value: c.id, label: c.category_name })),
        },
      ];

      setFilterOptions(newFilters);
    };

    fetchFilters();
  }, []);
  const fetchStates = async () => {
    try {
      const res = await getApi(APIPATH.states, {}, token,);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  };
  useEffect(() => {
    if (filters.state !== "all") {
      getApi(`${APIPATH.cities}/${filters.state}`, token, logout)
        .then((res) => {
          const cities = res.data || [];
          setFilterOptions((prev) =>
            prev.map((f) =>
              f.key === "city"
                ? {
                  ...f,
                  options: cities.map((c) => ({
                    value: c?.id,
                    label: c.name,
                  })),
                }
                : f
            )
          );
        })
        .catch(() => {
          setFilterOptions((prev) =>
            prev.map((f) =>
              f.key === "city" ? { ...f, options: [] } : f
            )
          );
        });
    }
  }, [filters.state]);

  const fetchCategories = async () => {
    try {
      const res = await getApi(APIPATH.category, {}, token,);
      console.log(res.data, 'categories');
      return res.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };
  const handleLogout = () => {
    logout()
    navigate('/login');
  };
  const getDeshboard = async () => {
    setLoading(true);
    try {
      const res = await postApi(
        APIPATH.schoolDash,
        {},
        token,
        logout
      );
      const { success, message, data } = res
      console.log(res, 'dashboard');
      if (success && data) {
        setDeshboardData(res || []);
        setExams(data?.exams || []);
      } else {
        setDeshboardData([]);
      }
    } catch (error) {
      setDeshboardData([]);
      console.error(error, 'catcherror')
    } finally {
      setLoading(false);
    }
  };
  const filteredReferrals = dashboardData?.data?.students?.filter((referral: any) => {
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "paid" && referral.is_paid) ||
      (filters.status === "unpaid" && !referral.is_paid);

    const matchesState =
      filters.state === "all" || referral.state_id === filters.state;

    // const matchesCity = filters.city === "all" || referral.city_id === filters.city;
    const matchesCity =
      filters.city === "all" || Number(referral.city_id) === Number(filters.city);


    const matchesCategory =
      filters.category === "all" || referral.category_id === filters.category;
    
    return matchesStatus && matchesState && matchesCity && matchesCategory;
  });

  const handleFilterChange = (key: string, value: string) => {
    if (key === "state") {
      setFilters((prev) => ({ ...prev, city: "all", state: value }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };
  const schoolStats = [
    {
      title: 'Total Students',
      label: 'Total Students',
      value: dashboardData?.total_students || 0,
      subtext: 'Enrolled students',
      color: 'text-blue-600',
      icon: Users,
      bgColor: "bg-blue-50"


    },
    {
      title: "Referral Code",
      value: dashboardData?.referral_code,
      link: `${window.location.origin}/register?ref=${dashboardData?.referral_code}`,
      icon: CodeSquare,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Paid Referrals",
      value: dashboardData?.total_paid_students,
      description: "Students referred",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <Link to='/'>
                <img
                  src="/assets/safeLogo.webp"
                  alt="SAFE Academy Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <div>
                <h1 className="font-bold text-safe-blue text-lg">School Dashboard</h1>
                <p className="text-sm text-gray-600">ABC High School - Academic Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900  text-white px-6 py-2 rounded-full font-semibold  shadow-lg">
                Hi, {userDetails?.name}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'overview'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'students'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Student Management
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Profile
              </button>

            </nav>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {schoolStats?.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat?.title}</p>
                            <p className="text-xl font-bold text-gray-900">{stat?.value}</p>
                            {stat?.link && (
                              <div className="mt-2 flex items-center gap-2">
                                <Button
                                  variant='outline'
                                  onClick={() => {
                                    navigator.clipboard.writeText(stat.link);
                                    toast({
                                      title: "Registration link Copied",
                                      description: "Registration link with referral code copied. Ready to share!",
                                      variant: "default",
                                    });
                                  }}
                                  className="text-xs text-gray-600 border px-2 py-1 rounded hover:bg-gray-100"
                                >
                                  Copy Link
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-gray-500">{stat?.description}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {/* Recent Exams */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                  <CardDescription>Your latest student referrals and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.data?.students.length > 0 ? (
                      dashboardData?.data?.students?.slice(0, 3).map((referral: any, index: any) => (
                        <>
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
                                {referral?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{referral?.name}</p>
                                <p className="text-sm text-gray-500">{referral?.mobile}</p>
                                <p className="text-xs text-gray-400">
                                  Registered: {referral?.created_at}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  referral.is_paid === true
                                    ? "default" : "secondary"
                                }
                              >
                                {referral.is_paid === true ? "Paid" : "Unpaid"}
                              </Badge>
                            </div>

                          </div>
                          <div className='flex justify-center items-center mt-5'>
                            <Button
                              onClick={() => setActiveTab('students')}
                            >
                              View All
                            </Button>
                          </div>
                        </>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No Referrals found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <>
              <FilterBar
                searchTerm={` `}
                onSearchChange={() => { }}
                filters={filterOptions}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onExportCSV={() => console.log("Export CSV")}
                onExportPDF={() => console.log("Export PDF")}
                placeholder="Search students..."
              />

              {/* Referrals Table */}
              <Card>
                <CardHeader>

                  <CardTitle>All Students ({filteredReferrals?.length})</CardTitle>
                  <CardDescription>Complete list of students you've referred</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead className="hidden sm:table-cell">Mobile</TableHead>
                          <TableHead className="hidden sm:table-cell">Category</TableHead>
                          <TableHead className="hidden sm:table-cell">School Name</TableHead>
                          <TableHead className="hidden sm:table-cell">City</TableHead>
                          <TableHead className="hidden sm:table-cell">State</TableHead>
                          {/* <TableHead className="hidden sm:table-cell">Registered On</TableHead> */}
                          <TableHead>Status</TableHead>
                          {/* {filteredReferrals.is_paid && ( */}
                          <TableHead className="hidden sm:table-cell">Plan</TableHead>
                          {/* )} */}
                          {/* <TableHead>Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReferrals.length > 0 ? (
                          filteredReferrals?.map((referral: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{referral.name}</TableCell>
                              <TableCell className="font-medium">{referral.student_code || 'N/A'}</TableCell>
                              <TableCell className="hidden sm:table-cell">{referral.mobile}</TableCell>
                              <TableCell className="hidden sm:table-cell">{referral.category_name}</TableCell>
                              <TableCell className="hidden sm:table-cell">{referral.school_name || '-'}</TableCell>
                              <TableCell className="hidden sm:table-cell">{referral.city_name || '-'}</TableCell>
                              <TableCell className="hidden sm:table-cell">{referral.state_name || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={referral.is_paid ? 'default' : 'secondary'}>
                                  {referral.is_paid ? 'Paid' : 'Unpaid'}
                                </Badge>
                              </TableCell>
                              {/* {referral.is_paid && ( */}
                              <TableCell className="hidden sm:table-cell">{referral.plan_title}</TableCell>
                              {/* )} */}

                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                              No Referrals found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {activeTab === 'profile' && (
            <InstituteProfile />
          )}
        </div>
      </div>
      <Footer />
    </>

  );
};

export default SchoolDashboard;
