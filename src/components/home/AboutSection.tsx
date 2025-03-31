
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
              Founded in 1985, Evergreen High School has maintained a tradition of academic excellence and community engagement. Our dedicated faculty, comprehensive curriculum, and diverse extracurricular programs create an environment where students can discover their passions and prepare for future success.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-primary mb-1">96%</h4>
                <p className="text-gray-600">Graduation Rate</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-primary mb-1">18:1</h4>
                <p className="text-gray-600">Student-Teacher Ratio</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-primary mb-1">25+</h4>
                <p className="text-gray-600">AP Courses</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-display text-2xl font-bold text-primary mb-1">40+</h4>
                <p className="text-gray-600">Student Clubs</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Evergreen High School Campus" 
                className="rounded-lg shadow-lg z-10 relative w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-primary/20 rounded-lg z-0"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 border-2 border-primary/40 rounded-lg z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
