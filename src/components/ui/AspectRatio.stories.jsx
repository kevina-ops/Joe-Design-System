import React from 'react';
import { AspectRatio } from './aspect-ratio';

export default {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="w-[350px] bg-muted rounded-md overflow-hidden">
      <div className="flex items-center justify-center h-full text-muted-foreground">16:9</div>
    </AspectRatio>
  ),
};
