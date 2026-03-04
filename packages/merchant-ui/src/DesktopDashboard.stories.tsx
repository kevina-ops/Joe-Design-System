import type { Meta, StoryObj } from "@storybook/react";

type KpiCardProps = {
  title: string;
  value: string;
  delta?: string;
};

function KpiCard({ title, value, delta }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-4xl font-semibold text-foreground">{value}</p>
      {delta ? (
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--joe-semantic-color-status-info)" }}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}

function SidebarNav() {
  const items = [
    "Home",
    "Reports",
    "Menu",
    "Marketing",
    "Brand",
    "Teams & Roles",
    "Customers",
  ];

  return (
    <aside className="w-[260px] border-r border-border bg-background p-4">
      <div className="mb-5 rounded-lg border border-border p-3">
        <p className="text-sm font-semibold text-foreground">Kevin A. Hanna</p>
        <p className="text-xs text-muted-foreground">Company Dashboard</p>
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => {
          const active = index === 0;
          return (
            <button
              key={item}
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm"
              style={{
                background: active
                  ? "var(--joe-semantic-color-action-ghostHover)"
                  : "transparent",
                color: active
                  ? "var(--joe-semantic-color-action-primary)"
                  : "var(--foreground)",
                fontWeight: active ? 600 : 500,
              }}
            >
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function WeeklySalesChart() {
  const values = [14, 45, 4, 24, 32];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <h3 className="mb-4 text-xl font-semibold text-foreground">
        Weekly Net Sales Trend
      </h3>
      <div className="flex h-72 items-end gap-4 rounded-md border border-border/60 p-4">
        {values.map((value, i) => (
          <div
            key={labels[i]}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--joe-semantic-color-action-primary)" }}
            >
              ${value}
            </div>
            <div
              className="w-full rounded-t"
              style={{
                height: `${value * 5}px`,
                background: "var(--joe-semantic-color-action-primary)",
              }}
            />
            <div className="text-xs text-muted-foreground">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterStrip() {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Store</span>
      <button className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground">
        is any value
      </button>
    </div>
  );
}

function MerchantDesktopDashboard() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <SidebarNav />

        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-foreground">
              Home - PGC
            </h1>
            <span className="text-sm text-muted-foreground">1m ago</span>
          </div>

          <FilterStrip />

          <section className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <WeeklySalesChart />
            </div>

            <div className="col-span-5 space-y-3">
              <KpiCard
                title="Gross Sales Today"
                value="$0.00"
                delta="No results"
              />
              <KpiCard
                title="Net Sales Today"
                value="$0.00"
                delta="No results"
              />
              <KpiCard title="Orders Today" value="0" delta="No results" />
              <KpiCard
                title="Card Tips Today"
                value="$0.00"
                delta="No results"
              />
              <KpiCard title="Average Order Net Sales Today" value="∅" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const meta = {
  title: "Merchant/Desktop Dashboard",
  component: MerchantDesktopDashboard,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "responsive",
    },
  },
} satisfies Meta<typeof MerchantDesktopDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const NavigationOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="w-[300px]">
        <SidebarNav />
      </div>
    </div>
  ),
};

export const KpiCardsOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="grid max-w-xl gap-3">
        <KpiCard title="Gross Sales Today" value="$0.00" delta="No results" />
        <KpiCard title="Net Sales Today" value="$0.00" delta="No results" />
        <KpiCard title="Orders Today" value="0" delta="No results" />
      </div>
    </div>
  ),
};
