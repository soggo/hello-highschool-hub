
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const events = [
  // {
  //   id: 1,
  //   title: "Back to School Night",
  //   date: "September 2, 2023",
  //   time: "6:00 PM - 8:00 PM",
  //   location: "Main Auditorium",
  //   category: "School Event",
  // },
  // {
  //   id: 2,
  //   title: "Varsity Football vs. Westside High",
  //   date: "September 9, 2023",
  //   time: "7:00 PM",
  //   location: "Home Field",
  //   category: "Athletics",
  // },
  // {
  //   id: 3,
  //   title: "Fall Arts Festival",
  //   date: "October 15, 2023",
  //   time: "10:00 AM - 4:00 PM",
  //   location: "Student Center",
  //   category: "Arts",
  // },
  // {
  //   id: 4,
  //   title: "College Fair",
  //   date: "October 21, 2023",
  //   time: "1:00 PM - 5:00 PM",
  //   location: "Gymnasium",
  //   category: "College Prep",
  // },
];

const UpcomingEvents = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2> */}
          {/* <p className="text-gray-600 max-w-2xl mx-auto">Join us for these important dates in our school calendar.</p> */}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-display">{event.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">{event.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mt-2">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{event.date}</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center text-primary hover:underline font-medium">
            View full calendar
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default UpcomingEvents;
