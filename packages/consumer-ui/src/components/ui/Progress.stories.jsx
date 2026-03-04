import React from 'react';
import { Progress } from './progress';

export default {
  title: 'UI/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Progress value={33} className="w-[350px]" />,
};

export const Full = {
  render: () => <Progress value={100} className="w-[350px]" />,
};
