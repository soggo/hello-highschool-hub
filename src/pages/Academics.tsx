
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Book, GraduationCap, Award } from "lucide-react";

const Academics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Academic Excellence</h1>
              <p className="text-lg text-gray-700 mb-8">
                Explore our comprehensive curriculum and programs designed to challenge and inspire students.
              </p>
              <NavigationMenu className="justify-center">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Quick Links</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] grid-cols-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a href="#course-offerings" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/10 p-6 no-underline outline-none focus:shadow-md">
                              <GraduationCap className="h-6 w-6 text-primary mb-2" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Course Catalog
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Browse our full range of academic courses and electives.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a href="#programs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">AP Programs</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Advanced Placement offerings
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a href="#departments" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Departments</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Academic department structure
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a href="#calendar" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Academic Calendar</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Important dates and schedules
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section id="departments" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold mb-10 text-center">Academic Departments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">English & Literature</h3>
                </div>
                <p className="text-gray-700 mb-4">Our English department focuses on developing critical thinking, analytical writing, and fostering a love of literature.</p>
                <Button variant="outline" asChild>
                  <a href="#english">Explore Courses</a>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">Mathematics</h3>
                </div>
                <p className="text-gray-700 mb-4">From algebra to calculus, our math curriculum provides a strong foundation with real-world applications.</p>
                <Button variant="outline" asChild>
                  <a href="#math">Explore Courses</a>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">Science</h3>
                </div>
                <p className="text-gray-700 mb-4">Our science programs offer hands-on experimentation and theoretical knowledge in biology, chemistry, and physics.</p>
                <Button variant="outline" asChild>
                  <a href="#science">Explore Courses</a>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">Social Studies</h3>
                </div>
                <p className="text-gray-700 mb-4">Students explore history, government, economics, and social sciences to understand our complex world.</p>
                <Button variant="outline" asChild>
                  <a href="#social-studies">Explore Courses</a>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">World Languages</h3>
                </div>
                <p className="text-gray-700 mb-4">Students can study Spanish, French, German, or Mandarin Chinese with our experienced language instructors.</p>
                <Button variant="outline" asChild>
                  <a href="#languages">Explore Courses</a>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-primary mr-3" />
                  <h3 className="font-display text-xl font-bold">Arts & Music</h3>
                </div>
                <p className="text-gray-700 mb-4">Our arts program encourages creative expression through visual arts, music, theater, and digital media.</p>
                <Button variant="outline" asChild>
                  <a href="#arts">Explore Courses</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold mb-10 text-center">Special Academic Programs</h2>
            
            <Tabs defaultValue="ap" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="ap">AP Courses</TabsTrigger>
                <TabsTrigger value="honors">Honors Program</TabsTrigger>
                <TabsTrigger value="stem">STEM Initiative</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ap" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-2xl font-bold">Advanced Placement</h3>
                    <Badge variant="secondary" className="text-sm px-3 py-1">25+ Courses</Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Our extensive AP program allows students to earn college credit and prepare for higher education. With dedicated instructors and comprehensive resources, students consistently score well above the national average on AP exams.
                  </p>
                  
                  <h4 className="font-display text-lg font-bold mb-3">Popular AP Courses Include:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 mb-6">
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP Calculus AB & BC</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP Biology</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP Chemistry</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP Physics</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP English Literature</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP U.S. History</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP World History</li>
                    <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> AP Computer Science</li>
                  </ul>
                  
                  <Button>View All AP Course Offerings</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="honors" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-2xl font-bold">Honors Program</h3>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Rigorous Curriculum</Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Our Honors Program provides academically talented students with an enriched, challenging curriculum that goes beyond standard coursework. Students engage in deeper analysis, advanced research projects, and collaborative problem-solving.
                  </p>
                  
                  <h4 className="font-display text-lg font-bold mb-3">Program Benefits:</h4>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 mt-0.5" /> 
                      <span>Smaller class sizes for more individualized attention</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 mt-0.5" /> 
                      <span>Regular guest speakers and field experiences</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 mt-0.5" /> 
                      <span>Dedicated college counseling and scholarship support</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 mt-0.5" /> 
                      <span>Optional mentorship program with local professionals</span>
                    </li>
                  </ul>
                  
                  <Button>Learn More About Honors</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="stem" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-2xl font-bold">STEM Initiative</h3>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Innovation Focus</Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Our STEM Initiative provides specialized pathways for students interested in Science, Technology, Engineering, and Mathematics. Through project-based learning and real-world applications, students develop the skills needed for future careers in STEM fields.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-display text-lg font-bold mb-2">Robotics Program</h4>
                      <p className="text-gray-700">Students design, build, and program robots while participating in regional competitions.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-display text-lg font-bold mb-2">Innovation Lab</h4>
                      <p className="text-gray-700">A makerspace equipped with 3D printers, laser cutters, and tools for hands-on creation.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-display text-lg font-bold mb-2">Coding Academy</h4>
                      <p className="text-gray-700">Students learn multiple programming languages and develop apps and software.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-display text-lg font-bold mb-2">Research Opportunities</h4>
                      <p className="text-gray-700">Partnerships with local universities for advanced research projects.</p>
                    </div>
                  </div>
                  
                  <Button>Explore STEM Opportunities</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Course Catalog CTA */}
        <section id="course-offerings" className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-6">Full Course Catalog</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Browse our comprehensive course offerings across all departments. From core subjects to specialized electives, find the right classes to match your interests and goals.
            </p>
            <Button size="lg">Download Course Catalog</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academics;
