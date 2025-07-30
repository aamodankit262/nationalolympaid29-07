
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);

  const [cities, setCities] = useState([]);

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
      filters.city === "all" || referral.city_id === filters.city;

    const matchesCategory =
      filters.category === "all" || referral.category_id === filters.category;

    return matchesStatus && matchesState && matchesCity && matchesCategory;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Reset city if state changes
    if (key === "state") {
      setFilters((prev) => ({ ...prev, city: "all", state: value }));
    }
  };
  const handleResetFilters = () => {
    setFilters(initialFilters);
    // clear dependent data if needed
  };
  // useEffect(() => {
  //   if (userDetails?.type !== 'resource') {
  //     navigate('/home', { replace: true });
  //   }
  // }, [userDetails, navigate]);
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
    // {
    //   title: "Referral Code",
    //   value: `${dashboardData?.referral_code}`,
    //   // description: "Lifetime earnings",
    //   icon: CodeSquare,
    //   color: "text-green-600",
    //   bgColor: "bg-green-50"
    // },
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
    // {
    //   title: "Total Earnings",
    //   value: `₹ ${dashboardData?.total_earning}`,
    //   description: "Lifetime earnings",
    //   icon: DollarSign,
    //   color: "text-green-600",
    //   bgColor: "bg-green-50"
    // },
    // {
    //   title: "This Month",
    //   value: `₹ ${dashboardData?.current_month_earning}`,
    //   description: "Current month earnings",
    //   icon: TrendingUp,
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50"
    // },
    // {
    //   title: "Pending Payment",
    //   value: `₹ ${dashboardData?.pending_payment}`,
    //   description: "Awaiting payment",
    //   icon: Wallet,
    //   color: "text-orange-600",
    //   bgColor: "bg-orange-50"
    // }
  ];

  // const recentReferrals = [
  //   { name: "Rahul Sharma", mobile: "9876543210", date: "2024-06-20", status: "Active", earnings: "₹200", registrationDate: "2024-06-18" },
  //   { name: "Priya Patel", mobile: "9876543211", date: "2024-06-18", status: "Active", earnings: "₹200", registrationDate: "2024-06-16" },
  //   { name: "Amit Kumar", mobile: "9876543212", date: "2024-06-15", status: "Pending", earnings: "₹150", registrationDate: "2024-06-13" },
  //   { name: "Sneha Gupta", mobile: "9876543213", date: "2024-06-12", status: "Active", earnings: "₹200", registrationDate: "2024-06-10" },
  //   { name: "Rohan Singh", mobile: "9876543214", date: "2024-06-10", status: "Active", earnings: "₹200", registrationDate: "2024-06-08" },
  //   { name: "Kavya Reddy", mobile: "9876543215", date: "2024-06-08", status: "Verified", earnings: "₹180", registrationDate: "2024-06-06" }
  // ];

  // const paymentHistory = [
  //   { date: "2024-06-01", amount: "₹4,200", status: "Paid", method: "Bank Transfer", referrals: 21, transactionId: "TXN001234" },
  //   { date: "2024-05-01", amount: "₹3,800", status: "Paid", method: "UPI", referrals: 19, transactionId: "TXN001235" },
  //   { date: "2024-04-01", amount: "₹5,200", status: "Paid", method: "Bank Transfer", referrals: 26, transactionId: "TXN001236" },
  //   { date: "2024-03-01", amount: "₹2,900", status: "Paid", method: "UPI", referrals: 15, transactionId: "TXN001237" }
  // ];

  // const referralStats = [
  //   { month: "June 2024", referrals: 23, earnings: "₹3,200", status: "Current" },
  //   { month: "May 2024", referrals: 19, earnings: "₹3,800", status: "Paid" },
  //   { month: "April 2024", referrals: 26, earnings: "₹5,200", status: "Paid" },
  //   { month: "March 2024", referrals: 15, earnings: "₹2,900", status: "Paid" }
  // ];

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
              {/* <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button> */}
              {/* <Button className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"> */}
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
              {/* <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'payments'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Payments
              </button> */}
              {/* <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                  ? 'border-safe-blue text-safe-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Analytics
              </button> */}
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
                                {/* <a
                                  href={stat.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {stat.link}
                                </a> */}

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
                            {/* <button onClick={() => {
                              navigator.clipboard.writeText(stat.value);
                              toast({
                                      title: "Code Copied",
                                      // description: message,
                                      variant: "default",
                                    });
                            }}> */}
                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                            {/* </button> */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Start referring students and boost your earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-safe-blue hover:bg-safe-blue/90">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Referral Link
                    </Button>
                    <Button variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add New Referral
                    </Button>
                    <Button variant="outline">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Request Payment
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

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
                                {/* {referral.status} */}
                              </Badge>

                              {/* <p className="text-sm font-medium text-green-600 mt-1">
                              {referral.earnings}
                            </p> */}
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

            // <Card>
            //   <CardHeader>
            //     <CardTitle>All Referrals ({dashboardData?.data?.students?.length})</CardTitle>
            //     <CardDescription>Complete list of students you've referred</CardDescription>
            //   </CardHeader>
            //   <CardContent>
            //     <div className="space-y-4">
            //       {/* {recentReferrals.map((referral, index) => (
            //         <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            //           <div className="flex items-center space-x-4">
            //             <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
            //               {referral.name.charAt(0)}
            //             </div>
            //             <div>
            //               <p className="font-medium">{referral.name}</p>
            //               <p className="text-sm text-gray-500">{referral.mobile}</p>
            //               <p className="text-xs text-gray-400">Registered: {referral.registrationDate}</p>
            //             </div>
            //           </div>
            //           <div className="text-right">
            //             <Badge variant={referral.status === 'Active' ? 'default' : referral.status === 'Verified' ? 'secondary' : 'outline'}>
            //               {referral.status}
            //             </Badge>
            //             <p className="text-sm font-medium text-green-600 mt-1">{referral.earnings}</p>
            //           </div>
            //         </div>
            //       ))} */}
            //       {dashboardData?.data?.students.length > 0 ? (
            //         dashboardData?.data?.students?.map((referral: any, index: any) => (
            //           <div
            //             key={index}
            //             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            //           >
            //             <div className="flex items-center space-x-4">
            //               <div className="w-12 h-12 bg-safe-blue rounded-full flex items-center justify-center text-white font-semibold">
            //                 {referral?.name.charAt(0)}
            //               </div>
            //               <div>
            //                 <p className="font-medium">{referral?.name}</p>
            //                 <p className="text-sm text-gray-500">{referral?.mobile}</p>
            //                 <p className="text-xs text-gray-400">
            //                   Registered: {referral?.created_at}
            //                 </p>
            //               </div>
            //             </div>
            //             <div className="text-right">
            //               <Badge
            //                 variant={
            //                   referral.is_paid === true
            //                     ? "default" : "secondary"

            //                 }
            //               >
            //                 {referral.is_paid === true ? "Paid" : "Unpaid"}
            //                 {/* {referral.status} */}
            //               </Badge>
            //               {/* <p className="text-sm font-medium text-green-600 mt-1">
            //                   {referral.earnings}
            //                 </p> */}
            //             </div>
            //           </div>
            //         ))
            //       ) : (
            //         <p className="text-gray-500 text-sm">No Referrals found.</p>
            //       )}
            //     </div>
            //   </CardContent>
            // </Card>
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
                  {/* {paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.date}</p>
                      <p className="text-sm text-gray-500">{payment.method} • {payment.referrals} referrals</p>
                      <p className="text-xs text-gray-400">ID: {payment.transactionId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{payment.amount}</p>
                      <Badge variant="outline" className="text-green-600">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))} */}
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
                  {/* {referralStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{stat.month}</p>
                      <p className="text-sm text-gray-500">{stat.referrals} students referred</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{stat.earnings}</p>
                      <Badge variant={stat.status === 'Current' ? 'secondary' : 'outline'}>
                        {stat.status}
                      </Badge>
                    </div>
                  </div>
                ))} */}
                  No Analytics
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'profile' && (
            // <Profile/>
            <ResourceProfile />
          )}
        </div>
      </div>
      <Footer />
    </>

  );
};

export default ResourcePersonDashboard;
