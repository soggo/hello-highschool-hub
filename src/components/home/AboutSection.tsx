
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary">About Our School</h2>
            <p className="text-lg text-gray-700 mb-6">
            At DIKOR Comprehensive College, our unwavering focus is on attaining Academic Excellence that is enshrined on Sound Morals that will make every beneficiary to live a purposeful life, worthy of emulation. 
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-red-800/95 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-gray-200 mb-1">100%</h4>
                <p className="text-gray-200">Graduation Rate</p>
              </div>
              <div className="bg-red-800/95 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-gray-200 mb-1">Balanced</h4>
                <p className="text-gray-200">Student-Teacher Ratio</p>
              </div>
              <div className="bg-red-800/95 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-gray-200 mb-1">10+</h4>
                <p className="text-gray-200">Subjects</p>
              </div>
              <div className="bg-red-800/95 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-gray-200 mb-1">5+</h4>
                <p className="text-white">Co-Curicular Activities</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="dikorceleb.jpeg" 
                alt="Dikor students in Lab" 
                className="rounded-lg shadow-lg z-10 relative w-fullobject-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-red-950/20 rounded-lg z-0"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 border-2 border-red-950/40 rounded-lg z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
