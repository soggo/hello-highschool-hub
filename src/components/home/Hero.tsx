
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-gradient min-h-[600px] flex items-center relative">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Welcome to <span className="text-primary">Dikor Comprehensive College</span> 
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-lg">
            Nurturing , inspiring futures. Join our community of excellence where every student can thrive and discover their potential.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button size="lg" asChild>
              <Link to="/about">Discover More</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-primary/10 rounded-lg -rotate-3"></div>
          <img 
            src="dikorlab2.jpeg" 
            alt="Students Dikor"
            className="rounded-lg shadow-lg object-cover w-full h-[1100px] relative z-10 rotate-3"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
