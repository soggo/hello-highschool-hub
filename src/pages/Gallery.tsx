
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { getGalleryImages, GalleryImage } from "@/utils/galleryUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: getGalleryImages,
  });

  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-4">
            School Gallery
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore images from our school events, facilities, and student activities.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No images found. Try a different search term.</p>
          </div>
        ) : (
          <>
            {/* Featured carousel */}
            <div className="mb-12">
              <h2 className="text-2xl font-display font-semibold text-slate-800 mb-6">
                Featured Images
              </h2>
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {images.slice(0, 4).map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-video items-center justify-center p-0 relative">
                            <img
                              src={image.imageUrl}
                              alt={image.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-white">
                              <h3 className="font-medium">{image.title}</h3>
                              <p className="text-sm text-gray-200">{image.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video relative">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-end">
                        <div className="p-4 text-white w-full bg-gradient-to-t from-black/80 to-transparent">
                          <h3 className="font-medium text-lg">{image.title}</h3>
                          <p className="text-sm text-gray-200">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Gallery;
