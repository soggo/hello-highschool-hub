
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">ABOUT <br /> DIKOR COMPREHENSIVE COLLEGE</h1>
              <p className="text-lg text-gray-700 mb-8">
                Discover our values, and the exceptional team that makes our school community thrive.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="history" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="history">Our History</TabsTrigger>
                <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
                <TabsTrigger value="staff">Leadership & Staff</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="font-display text-3xl font-bold mb-4">Our Story</h2>
                    <p className="text-gray-700 mb-4">
                    At DIKOR COMPREHENSIVE COLLEGE, our unwavering focus is on providing all students with a rigorous academic foundation combined with an unyielding commitment to discipline. We believe that discipline is the bedrock of success, shaping individuals into responsible and outstanding members of society. This aligns with the well-established principle in psychology that we become what we consistently practice—excellence and self-control are habits cultivated through proper training. In essence, our goal is to produce disciplined, morally upright, and academically sound graduates.

                    </p>
                    <p className="text-gray-700 mb-4">
                    Inspired by the structured and disciplined approach of great educators and reformers, the proprietor of DIKOR COMPREHENSIVE COLLEGE, an esteemed educationist and former inspector of education, has dedicated himself to instilling values that shape character and intellect. No responsible parent would entrust their child to an environment that fosters indiscipline, knowing that lack of structure today breeds failure tomorrow.

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
                  <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-700 mb-8">
                    To cultivate a diverse learning community where students develop the knowledge, skills, and character needed to succeed in an ever-changing world. We are committed to academic excellence, personal growth, and civic responsibility.
                  </p>

                  <h2 className="font-display text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-gray-700 mb-8">
                  To build First Class Citizens that will be Internationally recognized.
                  </p>
                  
                  <h2 className="font-display text-3xl font-bold mb-4">Our Core Values</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Discipline</h3>
                      <p className="text-gray-700">We instill respect, self-control, and diligence, ensuring students uphold strong moral values, obey rules, and stay focused on their goals for a brighter future.</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Excellence</h3>
                      <p className="text-gray-700">We pursue excellence in all aspects of education, challenging students to reach their highest potential.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Integrity</h3>
                      <p className="text-gray-700">We foster honesty, ethics, and responsibility in all aspects of school life.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Inclusion</h3>
                      <p className="text-gray-700">We embrace diversity and create an environment where all students feel welcomed and valued.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-display text-xl font-bold text-primary mb-3">Innovation</h3>
                      <p className="text-gray-700">We encourage creative thinking, problem-solving, and adaptability in our rapidly changing world.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="staff" className="space-y-6">
                <h2 className="font-display text-3xl font-bold mb-6 text-center">Our Leadership Team</h2>
                <div className="grid md:grid-cols gap-6">
                  <div className="text-center">
                    <img 
                      src="public/props.jpeg" 
                      alt="Proprietor" 
                      className="w-48 h-48 rounded-full object-cover  object-top mx-auto mb-4"
                    />
                    <h3 className="font-display text-xl font-bold">Dr xxx</h3>
                    <p className="text-primary font-medium">Proprietor</p>
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
{/*                 
                <div className="mt-12 text-center">
                  <Button className="px-8">View Full Staff Directory</Button>
                </div> */}
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
