
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">About Our School</h2>
            <p className="text-lg text-gray-700 mb-6">
            At DIKOR COMPREHENSIVE COLLEGE, our unwavering focus is on providing all students with a rigorous academic foundation combined with an unyielding commitment to discipline. 
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#c20e31]/5 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-[#c20e31] mb-1">100%</h4>
                <p className="text-gray-600">Graduation Rate</p>
              </div>
              <div className="bg-[#c20e31]/5 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-[#c20e31] mb-1">Balanced</h4>
                <p className="text-gray-600">Student-Teacher Ratio</p>
              </div>
              <div className="bg-[#c20e31]/5 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-[#c20e31] mb-1">10+</h4>
                <p className="text-gray-600">Subjects</p>
              </div>
              <div className="bg-[#c20e31]/5 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-[#c20e31] mb-1">5+</h4>
                <p className="text-gray-600">Extra Curicular Activities</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="broad.jpeg" 
                alt="Dikor students in Lab" 
                className="rounded-lg shadow-lg z-10 relative w-fullobject-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-[#c20e31]/20 rounded-lg z-0"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 border-2 border-[#c20e31]/40 rounded-lg z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
