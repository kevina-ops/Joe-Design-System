import React from 'react';
import { ScrollArea } from './scroll-area';

export default {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <p key={i} className="py-2">Line {i + 1}</p>
      ))}
    </ScrollArea>
  ),
};
