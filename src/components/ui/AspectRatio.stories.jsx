import React from 'react';
import { AspectRatio } from './aspect-ratio';

export default {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

/**
 * AspectRatio maintains a consistent aspect ratio for responsive content.
 * The component uses padding-based sizing, so content inside must fill the container.
 * Useful for images, videos, embeds, or any content that needs to maintain proportions.
 */
export const Default = {
  render: () => (
    <div className="flex flex-col items-center w-[500px]">
      <p className="text-sm text-muted-foreground mb-2 text-center w-full">16:9 (Widescreen)</p>
      <AspectRatio ratio={16 / 9} className="w-full rounded-md overflow-hidden border-2 border-border">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-foreground">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">16:9</div>
            <div className="text-sm text-muted-foreground">Widescreen Ratio</div>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const CommonRatios = {
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      <div className="flex flex-col items-center w-full">
        <p className="text-sm text-muted-foreground mb-2 text-center w-full">16:9 (Widescreen)</p>
        <AspectRatio ratio={16 / 9} className="w-full rounded-md overflow-hidden border-2 border-border">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-foreground">
            <span className="text-xl font-semibold">16:9</span>
          </div>
        </AspectRatio>
      </div>
      
      <div className="flex flex-col items-center w-full">
        <p className="text-sm text-muted-foreground mb-2 text-center w-full">4:3 (Standard)</p>
        <AspectRatio ratio={4 / 3} className="w-full rounded-md overflow-hidden border-2 border-border">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary/5 text-foreground">
            <span className="text-xl font-semibold">4:3</span>
          </div>
        </AspectRatio>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-[300px]">
        <p className="text-sm text-muted-foreground mb-2 text-center w-full">1:1 (Square)</p>
        <AspectRatio ratio={1} className="w-full rounded-md overflow-hidden border-2 border-border">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5 text-foreground">
            <span className="text-xl font-semibold">1:1</span>
          </div>
        </AspectRatio>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-[300px]">
        <p className="text-sm text-muted-foreground mb-2 text-center w-full">3:4 (Portrait)</p>
        <AspectRatio ratio={3 / 4} className="w-full rounded-md overflow-hidden border-2 border-border">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20 text-foreground">
            <span className="text-xl font-semibold">3:4</span>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const WithImage = {
  render: () => (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-sm text-muted-foreground text-center max-w-md">
        AspectRatio ensures images maintain their container's aspect ratio, preventing layout shift.
      </p>
      <AspectRatio ratio={16 / 9} className="w-[500px] rounded-md overflow-hidden border-2 border-border">
        <img
          src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&h=450&fit=crop"
          alt="Coffee example"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const VideoPlaceholder = {
  render: () => (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Perfect for video embeds that need to maintain aspect ratio across screen sizes.
      </p>
      <AspectRatio ratio={16 / 9} className="w-[500px] rounded-md overflow-hidden border-2 border-border bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-destructive/10 to-destructive/5">
          <div className="text-center">
            <div className="text-5xl mb-3">▶</div>
            <div className="text-sm font-medium text-foreground">Video Player</div>
            <div className="text-xs text-muted-foreground mt-1">16:9 Aspect Ratio</div>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};
