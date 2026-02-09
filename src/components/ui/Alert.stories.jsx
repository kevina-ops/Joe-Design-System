import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Info, WarningCircle } from '@phosphor-icons/react';

export default {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export const Default = {
  render: () => (
    <Alert className="w-[350px]">
      <Info size={16} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive = {
  render: () => (
    <Alert variant="destructive" className="w-[350px]">
      <WarningCircle size={16} />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};
