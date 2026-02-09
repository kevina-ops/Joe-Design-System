import React from 'react';
import { Label } from './label';
import { Switch } from './switch';

export default {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Checked = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked">Enabled</Label>
    </div>
  ),
};
