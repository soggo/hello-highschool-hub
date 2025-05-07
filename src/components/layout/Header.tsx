
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Book, Calendar, GraduationCap, Phone, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-[#9e2727] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img src="DIKOR.png" alt="" className='object-center w-12'/>
          <Link to="/" className="font-display text-2xl font-bold text-gray-200">
              DIKOR Comprehensive College
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-200">
          <Link to="/" className="font-medium hover:text-black transition-colors">
            Home
          </Link>
          <Link to="/about" className="font-medium hover:text-black transition-colors">
            About
          </Link>
          <Link to="/elearning" className="font-medium hover:text-black transition-colors">
            E-Learning
          </Link>
          <Link to="/contact" className="font-medium hover:text-black transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Portal Login
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Book className="h-5 w-5" />
              About
            </Link>
            <Link
              to="/elearning"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GraduationCap className="h-5 w-5" />
              E-Learning
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="h-5 w-5" />
              Contact
            </Link>
            <Button asChild className="w-full">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Portal Login
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
