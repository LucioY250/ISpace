'use client';
import type {FC} from 'react';
import Image from 'next/image';
import type {Design} from '@/app/page';
import {Card, CardContent} from '@/components/ui/card';
import {ImageIcon, ChevronLeft, ChevronRight} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesignViewProps {
  design: Design | null;
  isLoading: boolean;
}

const DesignView: FC<DesignViewProps> = ({design, isLoading}) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
       {design && (
        <>
          <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background rounded-full">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background rounded-full">
            <ChevronRight />
          </Button>
        </>
      )}
      <Card className="w-full h-full max-w-4xl aspect-video rounded-lg shadow-lg overflow-hidden flex items-center justify-center bg-card border-none">
        <CardContent className="p-0 w-full h-full flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
              <p className="text-lg font-medium">Generating your vision...</p>
            </div>
          ) : design ? (
            <Image
              src={design.imageUrl}
              alt={design.prompt}
              width={1920}
              height={1080}
              className="object-cover w-full h-full transition-opacity duration-500 opacity-100"
              data-ai-hint="interior design"
            />
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <ImageIcon className="mx-auto h-16 w-16 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to ISpace</h2>
              <p>Describe your ideal room in the chat to begin designing.</p>
              <p className="text-sm mt-4">You can be as descriptive as you like, and even upload an image for inspiration!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignView;
