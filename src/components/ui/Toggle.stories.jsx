import React from 'react';
import { Toggle } from './toggle';

export default {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Toggle aria-label="Toggle">Toggle</Toggle>,
};
