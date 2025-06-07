
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-950 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">DIKOR Comprehensive College</h3>
            <p className="text-white mb-4">
             Discipline is our watchword!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-white transition-colors">About Us</Link>
              </li>
              {/* <li>
                <Link to="/academics" className="text-gray-300 hover:text-white transition-colors">Academics</Link>
              </li>
              <li>
                <Link to="/athletics" className="text-gray-300 hover:text-white transition-colors">Athletics</Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-300 hover:text-white transition-colors">Calendar</Link>
              </li> */}
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/elearning" className="text-white hover:text-white transition-colors">E-Learning</Link>
              </li>
            </ul>
            
            <h3 className="font-display text-lg font-semibold mt-6 mb-4">Contact Us</h3>
            <address className="not-italic text-white space-y-2">
              <p>Apa, Badagry</p>
              <p>Lagos</p>

               <p className="flex items-center gap-2 mt-4">
                <Phone size={16} />
                Telephone: (+234) 0805 227 9421
                <p>(Principal)</p>
              </p>
              
              <p className="flex items-center gap-2 mt-4">
                <Phone size={16} />
                Telephone: (+234) 0815 343 1521
              </p>
              <p className="flex items-center gap-2 mt-4">
                <Phone size={16} />
                Whatsapp: (+234) 0807 994 7272
              </p>

               
              <p className="flex items-center gap-2">
                <Mail size={16} />
                DikorCollege@gmail.com
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-8 text-center text-white text-sm">
          <p>&copy; {currentYear} DIKOR Comprehensive College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
