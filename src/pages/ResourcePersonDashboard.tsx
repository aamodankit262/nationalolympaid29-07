
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Users, LogOut, CodeSquare, Copy, CopyIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/authStore';
import ResourceProfile from './ResourceProfile';
import { getApi, postApi } from '@/services/services';
import { APIPATH } from '@/api/urls';
import Footer from '@/components/Footer';
import LoaderWithBackground from '@/components/LoaderWithBackground';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { stat } from 'fs';
import { FilterBar } from '@/components/FilterBar';
import { toast } from '@/hooks/use-toast';
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
const ResourcePersonDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, userDetails, token } = useAuthStore()
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
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
                    value: c.name,
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

  const filteredReferrals = dashboardData?.data?.students?.filter((referral: any) => {
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "paid" && referral.is_paid) ||
      (filters.status === "unpaid" && !referral.is_paid);

    const matchesState =
      filters.state === "all" || referral.state_id === filters.state;

    const matchesCity =
      filters.city === "all" || Number(referral.city_id) === Number(filters.city);

    const matchesCategory =
      filters.category === "all" || referral.category_id === filters.category;

    return matchesStatus && matchesState && matchesCity && matchesCategory;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key === "state") {
      setFilters((prev) => ({ ...prev, city: "all", state: value }));
    }
  };
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };
 
  const handleLogout = () => {
    logout()
    navigate('/login');
  };
  useEffect(() => {
    getResourceDashboard();
  }, []);
  const getResourceDashboard = async () => {
    setLoading(true);
    try {
      const res = await postApi(APIPATH.resourceDashboard, {}, token, logout);
      console.log(res, 'resource dashboard');
      if (res.success) {
        setDashboardData(res);
      } else {
        setDashboardData(null);
      }
    } catch (error) {
      setDashboardData(null);
      console.error(error, 'resource dashboard error');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Referrals",
      value: dashboardData?.total_students,
      description: "Students referred",
      icon: Users,
      color: "text-blue-600",
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
      <LoaderWithBackground visible={loading} />
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
                <h1 className="font-bold text-safe-blue text-lg">Resource Person Dashboard</h1>
                <p className="text-sm text-gray-600">Refer Students & Earn Rewards</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900  text-white px-6  rounded-full font-semibold">
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
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'referrals'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                My Referrals
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

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat?.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
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
              {/* Recent Activity */}
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
                      onClick={() => setActiveTab('referrals')}
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

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
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

                  <CardTitle>All Referrals ({filteredReferrals?.length})</CardTitle>
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

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track your earnings and payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  No Payment History
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Referral Analytics</CardTitle>
                <CardDescription>Monthly performance and earning trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                
                  No Analytics
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'profile' && (
            <ResourceProfile />
          )}
        </div>
      </div>
      <Footer />
    </>

  );
};

export default ResourcePersonDashboard;
