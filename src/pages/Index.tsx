
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Announcements from "@/components/home/Announcements";
// import QuickLinks from "@/components/home/QuickLinks";
import AboutSection from "@/components/home/AboutSection";
// import UpcomingEvents from "@/components/home/UpcomingEvents";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* <QuickLinks /> */}
        <AboutSection />
        <Announcements />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
