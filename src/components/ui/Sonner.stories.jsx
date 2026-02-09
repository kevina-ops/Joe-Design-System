import React from 'react';
import { Toaster } from './sonner';
import { Button } from './button';
import { toast } from 'sonner';

export default {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast('Hello from Sonner')}>Show toast</Button>
    </>
  ),
};
