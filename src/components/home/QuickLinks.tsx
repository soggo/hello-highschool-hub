
// import { Book, Calendar, Users, Mail, GraduationCap, School } from 'lucide-react';

// const quickLinks = [
//   {
//     title: "Academic Programs",
//     description: "Explore our diverse academic offerings",
//     icon: <Book className="h-8 w-8" />,
//     link: "/academics",
//   },
//   {
//     title: "School Calendar",
//     description: "View upcoming events and important dates",
//     icon: <Calendar className="h-8 w-8" />,
//     link: "/calendar",
//   },
//   {
//     title: "Student Life",
//     description: "Clubs, activities, and student resources",
//     icon: <Users className="h-8 w-8" />,
//     link: "/students",
//   },
//   {
//     title: "College & Career",
//     description: "Prepare for your future beyond high school",
//     icon: <GraduationCap className="h-8 w-8" />,
//     link: "/college-career",
//   },
//   {
//     title: "Athletics",
//     description: "Sports programs, schedules, and achievements",
//     icon: <School className="h-8 w-8" />,
//     link: "/athletics",
//   },
//   {
//     title: "Contact Us",
//     description: "Reach out to faculty and administration",
//     icon: <Mail className="h-8 w-8" />,
//     link: "/contact",
//   },
// ];

// const QuickLinks = () => {
//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Quick Links</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Find what you're looking for with these helpful resources and information.
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {quickLinks.map((link, index) => (
//             <a 
//               key={index} 
//               href={link.link} 
//               className="group p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center text-center"
//             >
//               <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
//                 {link.icon}
//               </div>
//               <h3 className="font-display text-xl font-semibold mb-2">
//                 {link.title}
//               </h3>
//               <p className="text-gray-600 mb-3">
//                 {link.description}
//               </p>
//               <span className="text-primary text-sm font-medium group-hover:underline mt-auto">
//                 Learn more
//               </span>
//             </a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default QuickLinks;
