
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-red-800/20 min-h-[600px] flex items-center border relative">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-9">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Welcome to <span className="text-primary">DIKOR Comprehensive College</span> 
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-lg">
          Discipline Keeping Organization (DIKOR) welcomes you to her Power House: <br />
          <span className='text-primary'>DIKOR Comprehensive College</span>. 
          </p>
          <p className="text-lg md:text-xl text-gray-700 max-w-lg">This Voluntary Organization's College is built to provide an all-round Functional Education that will bring out the Best in every product of her institution. 
            Founder: Adebisi Adenaya (Royor Of DIKOR)</p>
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
          <div className="absolute inset-0 bg-red-600/10 rounded-lg -rotate-3"></div>
          <img 
            src="/DIKORsal.jpeg" 
            alt="Students DIKOR"
            className="rounded-lg shadow-lg object-cover object-top w-full h-1/8 relative z-10 rotate-3"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
