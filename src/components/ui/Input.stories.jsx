import React from 'react';
import { Input } from './input';

export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
};

export const WithPlaceholder = {
  args: {
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const Disabled = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Password = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
  },
};
