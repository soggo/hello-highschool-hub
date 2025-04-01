
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">Evergreen High School</h3>
            <p className="text-gray-300 mb-4">
              Empowering students to become lifelong learners and responsible citizens since 1985.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/academics" className="text-gray-300 hover:text-white transition-colors">Academics</Link>
              </li>
              <li>
                <Link to="/athletics" className="text-gray-300 hover:text-white transition-colors">Athletics</Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-300 hover:text-white transition-colors">Calendar</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/elearning" className="text-gray-300 hover:text-white transition-colors">E-Learning</Link>
              </li>
            </ul>
            
            <h3 className="font-display text-lg font-semibold mt-6 mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Education Ave.</p>
              <p>Evergreen, WA 98123</p>
              <p className="flex items-center gap-2 mt-4">
                <Phone size={16} />
                (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                info@evergreenhigh.edu
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Evergreen High School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
