
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const announcements = [
  {
    "id": 1,
    "title": "Easter Break",
    "description": "School will close for Easter break on March 28th and resume on April 8th. Students are advised to complete their assignments before resumption.",
    "date": "March 28, 2025",
    "category": "Holiday"
  },

  {
    "id": 2,
    "title": "Second Term Interhouse Sports",
    "description": "The second term Interhouse Sports competition will take place on May 20th. All students should participate in their respective houses' training sessions.",
    "date": "May 20, 2025",
    "category": "Sports"
  },
  {
    "id": 3,
    "title": "Entrance Examination",
    "description": "The entrance examination for new students will be held on September 14th. Registration closes on September 10th at the school office.",
    "date": "September 14, 2025",
    "category": "Admissions"
  },

]


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
            
            </Card>
          ))}
        </div>
        
        {/* <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center text-primary hover:underline font-medium">
            View all announcements
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Announcements;
