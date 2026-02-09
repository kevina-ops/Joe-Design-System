#!/usr/bin/env node

/**
 * Component Generator for shadcn/ui Components
 * 
 * Generates React components and Storybook stories for all shadcn/ui components
 * based on Obra shadcn/ui Figma kit structure.
 * 
 * Usage:
 *   node scripts/generate-components.mjs [--component <name>] [--all]
 * 
 * Components are generated in src/components/ui/ with matching .stories.jsx files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const COMPONENTS_DIR = path.join(rootDir, 'src', 'components', 'ui');

// List of shadcn/ui components to generate
const SHADCN_COMPONENTS = [
  'accordion',
  'alert',
  'alert-dialog',
  'aspect-ratio',
  'avatar',
  'badge',
  'breadcrumb',
  'button', // Already exists, but included for reference
  'calendar',
  'card',
  'carousel',
  'checkbox',
  'collapsible',
  'combobox',
  'command',
  'context-menu',
  'dialog',
  'drawer',
  'dropdown-menu',
  'form',
  'hover-card',
  'input',
  'input-otp',
  'label',
  'menubar',
  'navigation-menu',
  'popover',
  'progress',
  'radio-group',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'skeleton',
  'slider',
  'sonner',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toast',
  'toggle',
  'toggle-group',
  'tooltip',
];

/**
 * Component templates based on shadcn/ui patterns
 */
const COMPONENT_TEMPLATES = {
  'input': (name) => `'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
`,

  'card': (name) => `'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`,

  'badge': (name) => `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
`,

  'alert': (name) => `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
`,

  'label': (name) => `'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
`,

  'textarea': (name) => `'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
`,

  'separator': (name) => `'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/src/lib/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
`,

  'skeleton': (name) => `import { cn } from '@/src/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
`,
};

/**
 * Storybook story templates
 */
const STORY_TEMPLATES = {
  'input': (name) => `import React from 'react';
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
`,

  'card': (name) => `import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';

export default {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};
`,

  'badge': (name) => `import React from 'react';
import { Badge } from './badge';

export default {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export const Default = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Variants = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
`,

  'alert': (name) => `import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Info, AlertCircle } from '@phosphor-icons/react';

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
      <AlertCircle size={16} />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};
`,

  'label': (name) => `import React from 'react';
import { Label } from './label';
import { Input } from './input';

export default {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};
`,

  'textarea': (name) => `import React from 'react';
import { Textarea } from './textarea';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
    placeholder: 'Type your message here...',
  },
};

export const Disabled = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
};
`,

  'separator': (name) => `import React from 'react';
import { Separator } from './separator';

export default {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Horizontal = {
  render: () => (
    <div className="w-[350px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
`,

  'skeleton': (name) => `import React from 'react';
import { Skeleton } from './skeleton';

export default {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};
`,
};

/**
 * Generate a component file
 */
function generateComponent(name) {
  const template = COMPONENT_TEMPLATES[name];
  if (!template) {
    console.warn(`⚠️  No template for component: ${name}`);
    return false;
  }

  const componentPath = path.join(COMPONENTS_DIR, `${name}.tsx`);
  const content = template(name);
  
  fs.writeFileSync(componentPath, content, 'utf-8');
  console.log(`✅ Generated: ${componentPath}`);
  return true;
}

/**
 * Generate a Storybook story file
 */
function generateStory(name) {
  const template = STORY_TEMPLATES[name];
  if (!template) {
    console.warn(`⚠️  No story template for component: ${name}`);
    return false;
  }

  const storyPath = path.join(COMPONENTS_DIR, `${name.charAt(0).toUpperCase() + name.slice(1)}.stories.jsx`);
  const content = template(name);
  
  fs.writeFileSync(storyPath, content, 'utf-8');
  console.log(`✅ Generated: ${storyPath}`);
  return true;
}

/**
 * Main function
 */
function generateComponents(componentNames) {
  // Ensure components directory exists
  if (!fs.existsSync(COMPONENTS_DIR)) {
    fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
  }

  console.log('🔨 Generating components...\n');

  let successCount = 0;
  let skipCount = 0;

  for (const name of componentNames) {
    // Skip button as it already exists
    if (name === 'button') {
      console.log(`⏭️  Skipping ${name} (already exists)`);
      skipCount++;
      continue;
    }

    const componentGenerated = generateComponent(name);
    const storyGenerated = generateStory(name);

    if (componentGenerated || storyGenerated) {
      successCount++;
    }
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   Generated: ${successCount} components`);
  console.log(`   Skipped: ${skipCount} components`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review generated components`);
  console.log(`   2. Install missing dependencies (e.g., @radix-ui/*)`);
  console.log(`   3. Run: npm run storybook`);
}

// Parse command line arguments
const args = process.argv.slice(2);
let componentArg = args.find(arg => arg.startsWith('--component='))?.split('=')[1];
// Also check for --component followed by component name as next arg
if (!componentArg) {
  const componentIndex = args.findIndex(arg => arg === '--component');
  if (componentIndex !== -1 && args[componentIndex + 1]) {
    componentArg = args[componentIndex + 1];
  }
}
const allFlag = args.includes('--all');

if (componentArg) {
  generateComponents([componentArg]);
} else if (allFlag) {
  generateComponents(SHADCN_COMPONENTS);
} else {
  console.log('Usage:');
  console.log('  node scripts/generate-components.mjs --component <name>');
  console.log('  node scripts/generate-components.mjs --component=<name>');
  console.log('  node scripts/generate-components.mjs --all');
  console.log('\nAvailable components:');
  console.log(SHADCN_COMPONENTS.map(c => `  - ${c}`).join('\n'));
}
