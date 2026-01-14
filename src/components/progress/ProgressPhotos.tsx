import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Plus } from "lucide-react";
import { ProgressPhoto } from "@/types/progress";

interface ProgressPhotosProps {
  photos: ProgressPhoto[];
  onAddPhoto?: () => void;
}

export const ProgressPhotos = ({ photos, onAddPhoto }: ProgressPhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);

  return (
    <section className="mb-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📸 Progress Photos
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddPhoto}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium mb-2">No progress photos yet</p>
              <p className="text-sm">Add your first photo to track your transformation!</p>
              <Button
                variant="default"
                onClick={onAddPhoto}
                className="mt-4 flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photos.map((photo) => (
                <Dialog key={photo.id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer group">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={photo.before}
                            alt="Before photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 flex items-end p-2">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              Before
                            </span>
                          </div>
                        </div>
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                          <img
                            src={photo.after}
                            alt="After photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 flex items-end p-2">
                            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                              After
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        {new Date(photo.date).toLocaleDateString()}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Before</h3>
                        <img
                          src={photo.before}
                          alt="Before photo"
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">After</h3>
                        <img
                          src={photo.after}
                          alt="After photo"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};