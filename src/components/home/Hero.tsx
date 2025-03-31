
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-gradient min-h-[600px] flex items-center relative">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Welcome to <span className="text-primary">Evergreen High</span> School
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-lg">
            Nurturing minds, inspiring futures. Join our community of excellence where every student can thrive and discover their potential.
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
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
            alt="Students at Evergreen High"
            className="rounded-lg shadow-lg object-cover w-full h-[400px] relative z-10 rotate-3"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
