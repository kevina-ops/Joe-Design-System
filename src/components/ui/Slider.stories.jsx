import React from 'react';
import { Slider } from './slider';

export default {
  title: 'UI/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Slider defaultValue={[50]} max={100} className="w-[350px]" />,
};
