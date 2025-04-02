
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  created_at: string;
};

// Fallback data in case Supabase is not available
const fallbackAnnouncements = [
  {
    "id": "1",
    "title": "Easter Break",
    "description": "School will close for Easter break on March 28th and resume on April 8th. Students are advised to complete their assignments before resumption.",
    "date": "March 28, 2025",
    "category": "Holiday",
    "created_at": new Date().toISOString()
  },
  {
    "id": "2",
    "title": "Second Term Interhouse Sports",
    "description": "The second term Interhouse Sports competition will take place on May 20th. All students should participate in their respective houses' training sessions.",
    "date": "May 20, 2025",
    "category": "Sports",
    "created_at": new Date().toISOString()
  },
  {
    "id": "3",
    "title": "Entrance Examination",
    "description": "The entrance examination for new students will be held on September 14th. Registration closes on September 10th at the school office.",
    "date": "September 14, 2025",
    "category": "Admissions",
    "created_at": new Date().toISOString()
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setAnnouncements(data);
          console.log('Announcements loaded from Supabase:', data);
        } else {
          // If no data in Supabase, initialize it with fallback data
          console.log('No announcements found in Supabase, using fallback data');
          setAnnouncements(fallbackAnnouncements);
          
          // Optionally, insert the fallback data into Supabase
          try {
            await supabase.from('announcements').insert(fallbackAnnouncements);
            console.log('Initialized Supabase with fallback announcements');
          } catch (insertError) {
            console.error('Failed to initialize announcements:', insertError);
          }
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements');
        setAnnouncements(fallbackAnnouncements);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
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
          ) : error ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-red-500">{error}</p>
              <p>Showing fallback announcements instead</p>
            </div>
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
