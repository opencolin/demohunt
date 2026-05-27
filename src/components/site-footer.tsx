export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl leading-none tracking-tight">
            Demo<span className="italic">Hunt</span>
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Est. MMXXVI · San Francisco
          </p>
        </div>
        <FootCol
          title="The Magazine"
          items={[
            ["Today's feed", "/"],
            ["Discover", "/discover"],
            ["Demo days", "/demo-days"],
          ]}
        />
        <FootCol
          title="For Builders"
          items={[
            ["Submit a demo", "/submit"],
            ["Book the studio", "/submit"],
            ["Press kit", "#"],
          ]}
        />
        <FootCol
          title="The Wire"
          items={[
            ["Daily digest", "/discover"],
            ["Weekly", "/discover"],
            ["Monthly", "/discover"],
          ]}
        />
      </div>
      <div className="border-t border-ink/30 bg-paper-shade">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:flex-row md:items-center">
          <span>© MMXXVI Demo Hunt Magazine</span>
          <span>Printed in pixels. Distributed by the algorithm.</span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {title}
      </p>
      <ul className="mt-3 space-y-1.5">
        {items.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[13px] underline decoration-ink/30 decoration-1 underline-offset-[5px] hover:decoration-ink"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
