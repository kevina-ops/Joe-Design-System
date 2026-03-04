import type { Meta, StoryObj } from "@storybook/react";

function PosPlaceholder() {
  return (
    <div className="rounded-md border border-border bg-background p-4 text-foreground">
      POS Storybook scaffold is ready. Add POS components and stories under
      <code className="ml-1">packages/pos-ui/src</code>.
    </div>
  );
}

const meta = {
  title: "POS/Setup",
  component: PosPlaceholder,
} satisfies Meta<typeof PosPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
