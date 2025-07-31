import ExamInstruction from "@/pages/Dashboard/examInstructions";
import Exam from "@/pages/Dashboard/ExamLive";
import ExamThankYou from "@/pages/ExamThankYou";
import ResourceRegister from "@/pages/ResourceRegister";
import { lazy } from "react";
import { ComponentType } from "react";

// Lazy load components
const PaymentFailed = lazy(() => import("@/pages/PaymentFailed"));
const SchoolRegister = lazy(() => import("@/pages/SchoolRegister"));
const TermsSchoolsResource = lazy(() => import("@/pages/TermsSchoolsResource"));
const TermsStudents = lazy(() => import("@/pages/TermsStudents"));
const SchoolDashboard = lazy(() => import("@/pages/SchoolDashboard"));
const ResourcePersonDashboard = lazy(() => import("@/pages/ResourcePersonDashboard"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentGateway = lazy(() => import("@/pages/PaymentGateway"));
// const Exam = lazy(() => import("@/pages/Exam"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Index = lazy(() => import("@/pages/Index"));
const OTPVerification = lazy(() => import("@/pages/OTPVerification"));
const Register = lazy(() => import("@/pages/Register"));
const RoleSelection = lazy(() => import("@/pages/RoleSelection"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Route interface
export interface RouteConfig {
  path: string;
  element: ComponentType;
  isProtected?: boolean;
  requiredRoles?: string[];
  requirePayment?: boolean;
  isRestricted?: boolean; 
}

export const publicRoutes: RouteConfig[] = [
  { 
    path: `/`, 
    element: Index, 
    isProtected: false, 
    isRestricted: false 
  },
  { 
    path: `/home`, 
    element: Index, 
    isProtected: false, 
    isRestricted: false 
  },
  { 
    path: `/login`, 
    element: Login, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/role-selection`, 
    element: RoleSelection, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/register`, 
    element: Register, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/resource-register`, 
    element: ResourceRegister, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/school-register`, 
    element: SchoolRegister, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/forgot-password`, 
    element: ForgotPassword, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/otp-verification`, 
    element: OTPVerification, 
    isProtected: false, 
    isRestricted: true 
  },
  { 
    path: `/privacy-policy`, 
    element: PrivacyPolicy, 
    isProtected: false, 
    isRestricted: false 
  },
  { 
    path: `/terms/students`, 
    element: TermsStudents, 
    isProtected: false, 
    isRestricted: false 
  },
  { 
    path: `/terms/schools-resource`, 
    element: TermsSchoolsResource, 
    isProtected: false, 
    isRestricted: false 
  },
];

// Private routes - require authentication
export const privateRoutes: RouteConfig[] = [
  { 
    path: `/dashboard`, 
    element: Dashboard, 
    isProtected: true, 
    requiredRoles: ['student'], 
    requirePayment: true 
  },
  { 
    path: `/school-dashboard`, 
    element: SchoolDashboard, 
    isProtected: true, 
    requiredRoles: ['institute'] 
  },
  { 
    path: `/resource-person-dashboard`, 
    element: ResourcePersonDashboard, 
    isProtected: true, 
    requiredRoles: ['resource'] 
  },
  { 
    path: `/plans`, 
    element: PaymentGateway, 
    isProtected: true, 
    requiredRoles: ['student'] 
  },
  { 
    path: `/plans/payment-success`, 
    element: PaymentSuccess, 
    isProtected: true, 
    // requirePayment: true ,
    requiredRoles: ['student'] 
  },
  { 
    path: `/plans/payment-failed`, 
    element: PaymentFailed, 
    isProtected: true, 
    requiredRoles: ['student'] 
  },
  
];

// Combine all routes
export const allRoutes: RouteConfig[] = [...publicRoutes, ...privateRoutes];

// 404 route
export const notFoundRoute: RouteConfig = {
  path: "*",
  element: NotFound,
  isProtected: false
};
