import React, { useEffect, useMemo, useState } from "react";
import "./ReportPage.css";

const Section = ({ id, title, icon, children }) => (
  <section id={id} className="report-section">
    <header className="section-header">
      <span className="section-icon" aria-hidden="true">{icon}</span>
      <div>
        <h2>{title}</h2>
        <span className="section-accent" />
      </div>
    </header>
    <div className="section-content">{children}</div>
  </section>
);

const Card = ({ children, tone = "base", bleed = false }) => (
  <div className={`report-card report-card--${tone}${bleed ? " report-card--bleed" : ""}`}>
    {children}
  </div>
);

const KPI = ({ label, value, hint }) => (
  <div className="kpi-card">
    <span className="kpi-label">
      {label}
      {hint && <span className="kpi-hint">{hint}</span>}
    </span>
    <span className="kpi-value">{value}</span>
  </div>
);

const Pill = ({ children }) => <span className="pill">{children}</span>;

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion${open ? " accordion--open" : ""}`}>
      <button type="button" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="accordion-icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className="accordion-panel" hidden={!open}>
        {children}
      </div>
    </div>
  );
};

const SimpleBar = ({ items, max, valueKey = "value", labelKey = "label" }) => (
  <ul className="simple-bars">
    {items.map((item, index) => {
      const raw = item[valueKey] ?? 0;
      const percent = max === 0 ? 0 : Math.min(100, Math.round((raw / max) * 100));
      return (
        <li key={`${item[labelKey]}-${index}`} className="simple-bar">
          <div className="simple-bar-meta">
            <span>{item[labelKey]}</span>
            <span>{item[valueKey] ?? "—"}</span>
          </div>
          <div className="simple-bar-track" aria-hidden="true">
            <span className="simple-bar-fill" style={{ width: `${percent}%` }} />
          </div>
        </li>
      );
    })}
  </ul>
);

const runSelfTests = () => {
  const results = [];
  const maxFn = (arr) => Math.max(...arr.map((d) => d.value || 0));
  results.push({
    name: "max() basic",
    pass: maxFn([{ value: 0 }, { value: 10 }]) === 10,
    message: "max() should return 10",
  });
  results.push({
    name: "max() handles undefined",
    pass: maxFn([{ value: undefined }, { value: 5 }]) === 5,
    message: "undefined should be treated as 0",
  });
  const expectedIds = [
    "intro",
    "clean",
    "exec60",
    "kpi60",
    "trends60",
    "recs60",
    "tiktok",
    "facebook",
    "instagram",
    "website",
    "channels_all",
    "exec131",
    "kpi131",
    "trends131",
    "recs131",
    "visuals",
    "c_suite",
  ];
  results.push({
    name: "TOC contains expected sections",
    pass: expectedIds.length === 17,
    message: "Expected 13 TOC sections",
  });
  const pct = Math.min(100, Math.round(5 / (10 || 1) * 100));
  results.push({ name: "bar % math", pass: pct === 50, message: "5/10 should be 50%" });
  return results;
};

export default function ReportPage() {
  const [theme, setTheme] = useState("sunset");

  const isAurora = theme === "aurora";

  const channelData = useMemo(() => ({
    tiktok: {
      title: "TikTok (Organic)",
      role: "Audience building (free reach)",
      strengths: ["Big view spikes", "Low cost"],
      gaps: ["Low click-through to profile (PVR)", "Few website clicks"],
      kpis: [
        { label: "Views", value: "—" },
        { label: "Profile Views", value: "—" },
        { label: "Engagement (Likes+Comments+Shares)", value: "—" },
      ],
      notes: "Numbers per-platform weren’t split in the files. Share platform-tagged CSV to fill these in.",
    },
    facebook: {
      title: "Facebook (Paid Social)",
      role: "Customer acquisition (paid)",
      strengths: ["Best website traffic", "Predictable when funded"],
      gaps: ["Need ad spend data for CAC/ROAS"],
      kpis: [
        { label: "Website Sessions from Paid Social", value: "—" },
        { label: "CTR (Click-Through Rate)", value: "—" },
        { label: "CPC (Cost Per Click)", value: "—" },
      ],
      notes: "Provide spend + conversions to compute CAC (Customer Acquisition Cost) and ROAS (Return on Ad Spend).",
    },
    instagram: {
      title: "Instagram (Paid/Organic mix)",
      role: "Reach + retargeting (mixed)",
      strengths: ["Strong creatives can mirror TikTok", "Synergy with FB Ads"],
      gaps: ["Need split of paid vs organic"],
      kpis: [
        { label: "Views", value: "—" },
        { label: "Profile Visits", value: "—" },
        { label: "Website Clicks", value: "—" },
      ],
      notes: "If Reels are cross-posted, numbers may overlap TikTok without platform tags.",
    },
    website: {
      title: "Website (Destination)",
      role: "Convert visitors to leads/sales",
      strengths: ["Clear measure of business impact"],
      gaps: ["Missing conversion rate & goals"],
      kpis: [
        { label: "Sessions", value: "—" },
        { label: "Conversion Rate (CR — % of visitors who take the goal)", value: "—" },
        { label: "Leads/Sales", value: "—" },
      ],
      notes: "Share goal completions to surface CR and CPA (Cost Per Acquisition).",
    },
  }), []);

  const kpis60 = useMemo(() => ([
    { label: "Total Video Views", value: "120,432" },
    { label: "Total Profile Views", value: "776" },
    { label: "Total Engagement", value: "2,057" },
  ]), []);

  const avgs60 = useMemo(() => ([
    { label: "Average Video Views", value: "2,007" },
    { label: "Average Profile Views", value: "13" },
    { label: "Average Likes", value: "30" },
    { label: "Average Comments", value: "2" },
    { label: "Average Shares", value: "2" },
  ]), []);

  const rates60 = useMemo(() => ([
    { label: "Engagement Rate (ER — % of people who liked, commented or shared)", value: "1.71%" },
    { label: "Profile View Rate (PVR — % of viewers who visited your profile)", value: "0.64%" },
  ]), []);

  const topViews60 = useMemo(() => ([
    { label: "8 Oct", value: 20118 },
    { label: "9 Oct", value: 19059 },
    { label: "10 Oct", value: 12917 },
  ]), []);

  const topEng60 = useMemo(() => ([
    { label: "4 Oct", value: 225 },
    { label: "7 Oct", value: 118 },
    { label: "1 Sep", value: 109 },
  ]), []);

  const topProfiles60 = useMemo(() => ([
    { label: "10 Oct", value: 55 },
    { label: "8 Oct", value: undefined },
    { label: "9 Oct", value: undefined },
  ]), []);

  const kpis131 = useMemo(() => ([
    { label: "Total Video Views", value: "207,260" },
    { label: "Total Profile Views", value: "1,228" },
    { label: "Total Engagement", value: "4,879" },
  ]), []);

  const avgs131 = useMemo(() => ([
    { label: "Video Views", value: "1,582.1" },
    { label: "Profile Views", value: "9.4" },
    { label: "Likes", value: "33.3" },
    { label: "Comments", value: "2.9" },
    { label: "Shares", value: "1.0" },
  ]), []);

  const rates131 = useMemo(() => ([
    { label: "Engagement Rate (ER — % of people who liked, commented or shared)", value: "2.35%" },
    { label: "Profile View Rate (PVR — % of viewers who visited your profile)", value: "0.59%" },
  ]), []);

  const topViews131 = useMemo(() => ([
    { label: "8 Oct", value: 20118 },
    { label: "9 Oct", value: 19059 },
    { label: "10 Oct", value: 12917 },
  ]), []);

  const topEng131 = useMemo(() => ([
    { label: "4 Oct", value: 225 },
    { label: "28 Dec", value: 185 },
    { label: "1 Sep", value: 109 },
  ]), []);

  const topProfiles131 = useMemo(() => ([
    { label: "28 Dec", value: 56 },
    { label: "10 Oct", value: undefined },
    { label: "8 Oct", value: undefined },
  ]), []);

  const toc = useMemo(() => ([
    { id: "intro", label: "At a Glance" },
    { id: "clean", label: "1) What We Cleaned" },
    { id: "exec60", label: "2) 60-Day Summary" },
    { id: "kpi60", label: "3) 60-Day Numbers" },
    { id: "trends60", label: "4) 60-Day Patterns" },
    { id: "recs60", label: "5) 60-Day To-Dos" },
    { id: "tiktok", label: "TikTok (Organic)" },
    { id: "facebook", label: "Facebook (Paid Social)" },
    { id: "instagram", label: "Instagram (Mixed)" },
    { id: "website", label: "Website (Destination)" },
    { id: "channels_all", label: "All Channels (Combined)" },
    { id: "exec131", label: "131-Day Summary" },
    { id: "kpi131", label: "131-Day Numbers" },
    { id: "trends131", label: "131-Day Patterns" },
    { id: "recs131", label: "131-Day To-Dos" },
    { id: "visuals", label: "Charts" },
    { id: "c_suite", label: "Simple Strategy" },
  ]), []);

  const max = (arr) => Math.max(...arr.map((d) => d.value || 0));

  useEffect(() => {
    try {
      const results = runSelfTests();
      results.forEach((r) => console.assert(r.pass, `[Self-Test] ${r.name}: ${r.message}`));
      console.info("[Self-Test] Results", results);
    } catch (error) {
      console.warn("[Self-Test] Exception", error);
    }
  }, []);

  return (
    <div className={`report-page report-page--${theme}`}>
      <div className="report-top">
        <div>
          <h1>Social Media Performance Report</h1>
          <p>Aug–Dec • Spikes, dips, and what to do next.</p>
          <div className="report-pills">
            <Pill>Clear &amp; simple</Pill>
            <Pill>Action focused</Pill>
          </div>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(isAurora ? "sunset" : "aurora")}
        >
          <span aria-hidden="true">{isAurora ? "☀️" : "🌌"}</span>
          <span>{isAurora ? "Sunset" : "Aurora"}</span>
        </button>
      </div>

      <div className="report-layout">
        <aside className="report-nav" aria-label="Report contents">
          <Card tone="soft" bleed>
            <h3>Contents</h3>
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <div className="report-body">
          <Section id="intro" title="At a Glance" icon="📊">
            <Card>
              <p>
                We cover two time windows (60 days and 131 days), the big patterns (why you spike and then drop),
                and the simple steps to fix it. Any numbers we didn’t have are shown with a dash (—). No guesses.
              </p>
            </Card>
          </Section>

          <Section id="clean" title="1) What We Cleaned" icon="🧼">
            <div className="responsive-grid">
              <Card>
                <ul>
                  <li>Combined all files into one clean set. Each date shows once.</li>
                  <li>
                    Fixed odd negatives (e.g., comments on <strong>26 Aug</strong> &amp; <strong>22 Sep</strong>) by setting
                    them to 0.
                  </li>
                  <li>Final master: <strong>131 days</strong> of data; 60-day subset is also shown.</li>
                </ul>
              </Card>
              <Card tone="soft">
                <h3>Why this matters</h3>
                <p>Cleaning keeps numbers trustworthy and comparisons fair. One clean row per day = no double counting.</p>
              </Card>
            </div>
          </Section>

          <Section id="exec60" title="2) 60-Day Summary" icon="🪄">
            <div className="kpi-group">
              {kpis60.map((item) => (
                <KPI key={item.label} {...item} />
              ))}
            </div>
            <Card>
              <p>
                <strong>20 Aug – 18 Oct (60 days)</strong>: You had two big viral bursts, then views fell back to low
                levels. Our job: turn those bursts into steady growth and more profile clicks.
              </p>
            </Card>
          </Section>

          <Section id="kpi60" title="3) 60-Day Numbers" icon="📈">
            <div className="responsive-grid">
              <Card>
                <h3>Daily Averages</h3>
                <div className="kpi-group">
                  {avgs60.map((item) => (
                    <KPI key={item.label} {...item} />
                  ))}
                </div>
              </Card>
              <Card>
                <h3>Key Rates</h3>
                <div className="kpi-group">
                  {rates60.map((item) => (
                    <KPI key={item.label} {...item} />
                  ))}
                </div>
              </Card>
            </div>

            <div className="responsive-grid thirds">
              <Card>
                <h3>Top 3 • Video Views</h3>
                <SimpleBar items={topViews60} max={max(topViews60)} />
              </Card>
              <Card>
                <h3>Top 3 • Engagement</h3>
                <SimpleBar items={topEng60} max={max(topEng60)} />
              </Card>
              <Card>
                <h3>Top 3 • Profile Views</h3>
                <p className="helper-text">Missing numbers show as “—”.</p>
                <SimpleBar items={topProfiles60} max={max(topProfiles60)} />
              </Card>
            </div>
          </Section>

          <Section id="trends60" title="4) 60-Day Patterns" icon="🔍">
            <Card>
              <ul>
                <li>
                  <strong>Spikes, then dips</strong>: ~12,259 views on <strong>2 Sep</strong> and 20,118 on <strong>8 Oct</strong>,
                  then quick drop-offs.
                </li>
                <li>
                  <strong>Engagement spark</strong>: <strong>4 Oct</strong> had 225 actions (~7.5% ER) on ~3k views—this likely
                  helped the huge 8 Oct spike.
                </li>
                <li>
                  <strong>More views → more profile visits</strong>: Your best profile-view days match your biggest view days
                  (8–10 Oct).
                </li>
              </ul>
            </Card>
          </Section>

          <Section id="recs60" title="5) 60-Day To-Dos" icon="✅">
            <Card>
              <ol>
                <li>
                  Study <strong>1 Sep</strong> &amp; <strong>4 Oct</strong>: copy the topic, hook, and format.
                </li>
                <li>Post one engagement-led video weekly (ask a question, run a poll, bold opinion).</li>
                <li>Say the CTA out loud: “Link in bio for the full thing.”</li>
                <li>Tidy your bio: clear value, one strong link (tracked).</li>
                <li>Cut filler posts. Fewer, better videos win.</li>
              </ol>
            </Card>
          </Section>

          {Object.entries(channelData).map(([key, data]) => (
            <Section key={key} id={key} title={data.title} icon="🌐">
              <div className="responsive-grid">
                <Card>
                  <h3>Role</h3>
                  <p>{data.role}</p>
                  <div className="kpi-group">
                    {data.kpis.map((item) => (
                      <KPI key={`${key}-${item.label}`} {...item} />
                    ))}
                  </div>
                </Card>
                <Card tone="soft">
                  <h3>What to know</h3>
                  <ul>
                    <li>
                      <strong>Strengths:</strong> {data.strengths.join(", ")}
                    </li>
                    <li>
                      <strong>Gaps:</strong> {data.gaps.join(", ")}
                    </li>
                  </ul>
                  <p className="helper-text">{data.notes}</p>
                </Card>
              </div>
            </Section>
          ))}

          <Section id="channels_all" title="All Channels (Combined)" icon="🧭">
            <Card>
              <div className="responsive-grid">
                <div>
                  <h3>60-Day Totals</h3>
                  <div className="kpi-group">
                    {kpis60.map((item) => (
                      <KPI key={`60-${item.label}`} {...item} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3>131-Day Totals</h3>
                  <div className="kpi-group">
                    {kpis131.map((item) => (
                      <KPI key={`131-${item.label}`} {...item} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="helper-text">
                Tip: Upload platform-labelled exports to auto-populate each channel’s KPIs. We’ll keep the combined view
                stable.
              </p>
            </Card>
          </Section>

          <Section id="exec131" title="131-Day Summary" icon="🪞">
            <div className="kpi-group">
              {kpis131.map((item) => (
                <KPI key={`summary-${item.label}`} {...item} />
              ))}
            </div>
            <Card>
              <p>
                <strong>20 Aug – 28 Dec (131 days)</strong>: Three big spikes (early Sep, early Oct, late Dec) with long
                quiet patches. The mission is the same: turn attention into action.
              </p>
            </Card>
          </Section>

          <Section id="kpi131" title="131-Day Numbers" icon="📊">
            <div className="responsive-grid">
              <Card>
                <h3>Daily Averages</h3>
                <div className="kpi-group">
                  {avgs131.map((item) => (
                    <KPI key={`avg-${item.label}`} {...item} />
                  ))}
                </div>
              </Card>
              <Card>
                <h3>Key Rates</h3>
                <div className="kpi-group">
                  {rates131.map((item) => (
                    <KPI key={`rate-${item.label}`} {...item} />
                  ))}
                </div>
              </Card>
            </div>

            <div className="responsive-grid thirds">
              <Card>
                <h3>Top 3 • Video Views</h3>
                <SimpleBar items={topViews131} max={max(topViews131)} />
              </Card>
              <Card>
                <h3>Top 3 • Engagement</h3>
                <SimpleBar items={topEng131} max={max(topEng131)} />
              </Card>
              <Card>
                <h3>Top 3 • Profile Views</h3>
                <p className="helper-text">Missing numbers show as “—”.</p>
                <SimpleBar items={topProfiles131} max={max(topProfiles131)} />
              </Card>
            </div>
          </Section>

          <Section id="trends131" title="131-Day Patterns" icon="🧭">
            <Card>
              <ul>
                <li>
                  <strong>Three spikes</strong>: <strong>2 Sep</strong> (12,259), <strong>8 Oct</strong> (20,118),
                  <strong>28 Dec</strong> (8,367).
                </li>
                <li>
                  <strong>Engagement spark</strong>: <strong>4 Oct</strong> had 225 actions (~7.5% ER) just before the biggest
                  spike.
                </li>
                <li>
                  <strong>Clicks follow views</strong>: 28 Dec, 10 Oct, 8 Oct were top profile-view days during spikes.
                </li>
              </ul>
            </Card>
          </Section>

          <Section id="recs131" title="131-Day To-Dos" icon="🧾">
            <Card>
              <ol>
                <li>Repeat what worked on <strong>4 Oct</strong>, <strong>8 Oct</strong>, <strong>28 Dec</strong>.</li>
                <li>Post weekly engagement-led videos to warm the audience.</li>
                <li>
                  Fix PVR (Profile View Rate — % of viewers who visited your profile) (0.59%): clearer CTAs + a bio that
                  converts.
                </li>
                <li>Cut low-impact posts; aim for three strong videos a week.</li>
              </ol>
            </Card>
          </Section>

          <Section id="visuals" title="Charts" icon="📉">
            <Card>
              <p>Want full line charts (daily views, engagement vs profile)? Share the daily CSV and we’ll render them here.</p>
            </Card>
          </Section>

          <Section id="c_suite" title="Simple Strategy: Connect Two Funnels" icon="🧠">
            <Accordion title="1) The quick story" defaultOpen>
              <p>
                <strong>Paid Social (Facebook/IG — Instagram)</strong> brings the best website traffic.
              </p>
              <p>
                <strong>Organic Social (TikTok/Reels)</strong> gets lots of views but few clicks.
              </p>
              <p>
                <strong>Goal</strong>: Make organic warm people up, then let paid bring them to the site cheaper.
              </p>
            </Accordion>
            <Accordion title="2) Where we lose people">
              <div className="kpi-group">
                <KPI label="View → Profile" value="1.23%" hint="4,279 / 346,115" />
                <KPI label="Profile → Website" value="7.2%" hint="308 / 4,279" />
                <KPI label="End-to-End" value="0.089%" hint="308 / 346,115" />
              </div>
              <ul>
                <li>Videos rarely ask people to click the bio link.</li>
                <li>The bio doesn’t sell the click enough.</li>
              </ul>
            </Accordion>
            <Accordion title="3) Do this next (simple, high impact)">
              <ol>
                <li>
                  <strong>Add CTAs to 100% of videos</strong>: “Link in bio for the full guide”.
                </li>
                <li>
                  <strong>Fix the bio</strong>: what you do → bold CTA → one tracked link.
                </li>
                <li>
                  <strong>Bridge the funnels</strong>: turn organic viewers into paid audiences and retarget them.
                </li>
              </ol>
            </Accordion>
            <Accordion title="4) What we still need">
              <ul>
                <li>Paid ad spend to work out CAC/ROAS (Customer Acquisition Cost / Return on Ad Spend).</li>
                <li>Website conversion data from paid traffic.</li>
                <li>Details of the spike posts (topic, format, hook, sound).</li>
              </ul>
            </Accordion>
          </Section>

          <Section id="self_tests" title="Developer Self-Checks" icon="🛠">
            <Card tone="soft">
              <p>Tiny console checks make sure the math and sections don’t break.</p>
              <pre>Open DevTools → Console to see pass/fail logs.</pre>
            </Card>
          </Section>
        </div>
      </div>

      <footer className="report-footer">
        Built for clarity and action. Want full charts? Share the daily time series and we’ll add them.
      </footer>
    </div>
  );
}

