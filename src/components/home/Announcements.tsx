
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalAnnouncements, Announcement } from '@/lib/supabase';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to simulate fetching
    const timer = setTimeout(() => {
      const localAnnouncements = getLocalAnnouncements();
      setAnnouncements(localAnnouncements);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Announcements & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay informed about the latest news, events, and important dates at Dikor Comprehensive College.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            announcements.map((announcement) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
