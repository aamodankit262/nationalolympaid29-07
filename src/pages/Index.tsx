
import { lazy, Suspense } from 'react';
import { useAuthStore } from '@/store/auth/authStore';
import LoaderWithBackground from '@/components/LoaderWithBackground';

const Header = lazy(() => import('../components/Header'));
const Hero = lazy(() => import('../components/Hero'));
const About = lazy(() => import('../components/About'));
const Participation = lazy(() => import('../components/Participation'));
const ImportantDates = lazy(() => import('../components/ImportantDates'));
const CompetitionStructure = lazy(() => import('../components/CompetitionStructure'));
const Awards = lazy(() => import('../components/Awards'));
const Registration = lazy(() => import('../components/Registration'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));
const Index = () => {
 
  return (
    <div className="min-h-screen bg-white mt-14">
      <Suspense fallback={<LoaderWithBackground visible={true} />}>
        <Header />
        <Hero />
        <About />
        <Participation />
        <ImportantDates />
        <CompetitionStructure />
        <Awards />
        <Registration />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
