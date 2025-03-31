
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const announcements = [
  {
    id: 1,
    title: "Fall Sports Tryouts",
    description: "Tryouts for fall sports will begin August 15th. Sign up in the athletics office by August 10th.",
    date: "August 15, 2023",
    category: "Athletics",
  },
  {
    id: 2,
    title: "Back to School Night",
    description: "Join us for Back to School Night on September 2nd from 6:00pm to 8:00pm. Meet your teachers and learn about the curriculum.",
    date: "September 2, 2023",
    category: "Events",
  },
  {
    id: 3,
    title: "College Application Workshop",
    description: "Seniors, attend the college application workshop every Tuesday in September in the library after school.",
    date: "September 5, 2023",
    category: "College",
  },
];

const Announcements = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Announcements & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay informed about the latest news, events, and important dates at Evergreen High School.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="h-full transition-transform hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-display text-xl">{announcement.title}</CardTitle>
                  <Badge variant="secondary">{announcement.category}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <Calendar className="h-4 w-4" />
                  {announcement.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{announcement.description}</p>
              </CardContent>
              <CardFooter>
                <a href="#" className="text-primary hover:underline text-sm">Read more</a>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center text-primary hover:underline font-medium">
            View all announcements
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
