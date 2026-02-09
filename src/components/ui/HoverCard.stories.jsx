import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './hover-card';
import { Button } from './button';

export default {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@hover</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Hover Card</h4>
          <p className="text-sm text-muted-foreground">Content shown on hover.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
