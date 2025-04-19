
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";

const About = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const tabsRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current && heroSectionRef.current) {
        const heroBottom = heroSectionRef.current.getBoundingClientRect().bottom;
        setIsSticky(heroBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section ref={heroSectionRef} className="bg-[#c20e31]/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6  text-primary">ABOUT <br /> DIKOR COMPREHENSIVE COLLEGE</h1>
              <p className="text-lg text-gray-700 mb-8">
                Discover our values 
                {/* and the exceptional team that makes our school community thrive. */}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 relative">
          <div 
            ref={tabsRef} 
            className={`${isSticky ? 'fixed top-20 left-0 right-0 bg-white shadow-sm py-4 z-20' : ''} transition-all duration-100`}
          >
            <div className="container mx-auto px-4">
              <Tabs 
                value={activeTab} 
                onValueChange={handleTabChange} 
                className="max-w-4xl mx-auto"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8 text-black">
                  <TabsTrigger value="history">Our Story</TabsTrigger>
                  <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
                  <TabsTrigger value="staff">Leadership 
                    {/* & Staff */}
                    </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
            
          <div className={`container mx-auto px-4 ${isSticky ? 'pt-20' : ''}`}>
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="max-w-4xl mx-auto"
            >
             
              
              <TabsContent value="history" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="font-display text-3xl font-bold mb-4 text-primary">Our Story</h2>
                    <p className="text-gray-700 mb-4">
                    At DIKOR Comprehensive College, our unwavering focus is on attaining Academic Excellence that is enshrined on Sound Morals that will make every beneficiary to live a purposeful life, worthy of emulation. This aligns with the well-established principle in psychology that we become what we consistently practice excellence and self-control are habits cultivated through proper training. In essence, our goal is to produce disciplined, morally upright, and academically sound graduates.
                    </p>
                    <p className="text-gray-700 mb-4">
                    Inspired by the structured and disciplined approach of great educators and reformers, No responsible parent would entrust their child to an environment that fosters indiscipline, knowing that lack of structure today breeds failure tomorrow.
                    </p>
                    <p className="text-gray-700">
                     
                    "Train a child in the way he should go, and when he is old, he will not depart from it." At Dikor, we provide that training—with discipline at its core.
                      <br />
                    At DIKOR COMPREHENSIVE COLLEGE, we recognize that choosing a school is a defining decision, one that must consider key elements essential to a child's future. A solid academic foundation, coupled with firm disciplinary standards, prepares students not just for exams, but for life. We blend the best of traditional education with modern strategies, ensuring that every student emerges as a leader, thinker, and disciplined achiever.
                    </p>
                  </div>
                  <div className="relative">
                    <img 
                      src="dikorab.jpeg" 
                      alt="Dikor Students at work" 
                      className="rounded-lg shadow-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-lg -z-10"></div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mission" className="space-y-6">
                <div>

                <h2 className="font-display text-3xl font-bold mb-4 text-primary">Our Vision</h2>
                <p className="text-gray-700 mb-8">
                  To build First Class Citizens that will be Internationally recognized.
                </p>

                  
                  <h2 className="font-display text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                  <p className="text-gray-700 mb-8">
                  To provide learning experiences that are predicated on the fear of God and discipline, for every learner, in a serene and rich educational institution, for a fruitful life
                  </p>

                  
                  <h2 className="font-display text-3xl font-bold mb-4 text-primary">Our Core Values</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Discipline</h3>
                      <p className="text-gray-700">Discipline, which is habit of obedience, is the First Law in Heaven! A disciplined person is destined to rule the world. We do not compromise on Discipline!</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Punctuality</h3>
                      <p className="text-gray-700"> Punctuality to us, is not only the "beginning of success," but an indication of being dutiful and reliable. Life is timed; one must always work with time, for a purposeful life. We have zero tolerance for lateness</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Selfless Service</h3>
                      <p className="text-gray-700">This is deemed necessary to upgrade our Souls Spiritually! We believe that, an individual is judged in life, not by his/her possessions but positive contributions, to human existence.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Doing it right!</h3>
                      <p className="text-gray-700">This tells us to always do the right thing, at the right time, in the right way, and with the right mind. This value is aimed at making every individual that belongs to us to be conscientious and righteous at all times</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Civility</h3>
                      <p className="text-gray-700">We encourage every individual to be humble, respectful, affectionate, and compassionate. Civility, simply expressed, is personality fully enhanced!</p>
                    </div>

                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="staff" className="space-y-6">
                <h2 className="font-display text-3xl font-bold mb-6 text-center text-primary">Our Leadership</h2>
                <div className="grid md:grid-cols gap-6">
                  <div className="text-center">
                    <img 
                      src="props.jpeg" 
                      alt="Proprietor" 
                      className="w-48 h-48 rounded-full object-cover  object-top mx-auto mb-4"
                    />
                    <h3 className="font-display text-xl font-bold">Mr Adebisi Adenaya</h3>
                    <p className="text-primary font-medium">Founder - Royor Of DIKOR</p>
                  </div>
                  {/* <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                      alt="Vice Principal" 
                      className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="font-display text-xl font-bold">Michael Roberts</h3>
                    <p className="text-primary font-medium">Vice Principal</p>
                  </div> */}
                  {/* <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80" 
                      alt="Dean of Students" 
                      className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="font-display text-xl font-bold">Dr. Emily Rodriguez</h3>
                    <p className="text-primary font-medium">Dean of Students</p>
                  </div> */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
