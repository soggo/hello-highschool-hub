
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Book, Calendar, GraduationCap, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <Link to="/" className="font-display text-2xl font-bold">
            Evergreen High
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/academics" className="font-medium hover:text-primary transition-colors">
            Academics
          </Link>
          <Link to="/athletics" className="font-medium hover:text-primary transition-colors">
            Athletics
          </Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button>Portal Login</Button>
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
              to="/academics"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GraduationCap className="h-5 w-5" />
              Academics
            </Link>
            <Link
              to="/athletics"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              Athletics
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="h-5 w-5" />
              Contact
            </Link>
            <Button className="w-full">Portal Login</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
