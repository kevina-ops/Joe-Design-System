import React from 'react';
import { Toaster } from './toaster';
import { Button } from './button';
import { useToast } from '@/src/hooks/use-toast';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast({ title: 'Toast title', description: 'Description here.' })}>
          Default toast
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
          }
        >
          Destructive toast
        </Button>
      </div>
    </>
  );
}

export default {
  title: 'UI/Toast',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <ToastDemo />,
};
