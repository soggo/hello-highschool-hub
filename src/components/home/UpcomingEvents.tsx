
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getLocalEvents, Event } from '@/lib/supabase';

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch events from localStorage
    const localEvents = getLocalEvents();
    setEvents(localEvents);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join us for these important dates in our school calendar.</p>
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
        
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center text-primary hover:underline font-medium">
            View full calendar
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
