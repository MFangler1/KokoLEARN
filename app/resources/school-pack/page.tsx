import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "KokoLearn for Schools & Organisations — Information Pack",
  description:
    "A printable information pack for schools, academy trusts, councils and SEND settings: how KokoLearn works, what it costs, and how to set up a pilot.",
};

const tiers = [
  { name: "Small Group", seats: "Up to 10 learners", price: "£7.99", per: "per learner / month", note: "20% off standard" },
  { name: "Medium Group", seats: "Up to 30 learners", price: "£6.49", per: "per learner / month", note: "35% off standard — most popular" },
  { name: "Large Group", seats: "Up to 100 learners", price: "£4.99", per: "per learner / month", note: "50% off standard" },
  { name: "Enterprise", seats: "100+ learners", price: "Custom", per: "talk to us", note: "Trust-wide and bespoke reporting" },
];

const benefits = [
  ["Aligned to the UK National Curriculum", "KS1 and KS2 objectives across maths, English, science, history and geography — mapped, not guessed."],
  ["Built for SEND and additional needs", "Patient, adaptive feedback with no timers or punitive scoring. Suitable for ADHD, autism, dyslexia, dyspraxia and processing differences."],
  ["Genuinely personalised", "Each lesson is generated around the learner's own interests, so reluctant learners stay engaged."],
  ["Progress you can evidence", "Per-learner progress records and professional reports for EHCP reviews, parents' evenings and interventions."],
  ["Safe by design", "No pupil-to-pupil contact, no advertising, no third-party tracking of children. UK GDPR and Children's Code aligned."],
  ["Simple to run", "No installation, no IT project. Staff and pupils sign in through a browser on existing devices."],
];

const steps = [
  ["1", "Send us an enquiry", "Use the QR code below or email support@kokolearn.org with your setting and rough learner numbers."],
  ["2", "A short walkthrough call", "Fifteen minutes, arranged around your timetable, so you can see it working before committing."],
  ["3", "Pilot group set up for you", "We create the group, hand out sign-in details and stay with you through the first week."],
  ["4", "Review and roll out", "We share what the pilot group achieved, then agree a simple quote and PO if you'd like to continue."],
];

export default function SchoolPackPage() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 print:px-0 print:py-0">
      <style>{`@media print { @page { margin: 14mm; } .no-print { display: none !important; } }`}</style>

      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/for-organisations" className="text-sm font-semibold text-primary hover:underline">
          ← Back to Institutions
        </Link>
        <span className="text-xs text-gray-400">Use your browser&apos;s Print → Save as PDF</span>
      </div>

      {/* ── Cover ── */}
      <header className="border-b-4 border-primary pb-6 text-center">
        <Image
          src="/images/kokolearn-brand-logo.png"
          alt="KokoLearn.org"
          width={130}
          height={130}
          className="mx-auto object-contain"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          KokoLearn for Schools &amp; Organisations
        </h1>
        <p className="mt-2 text-base text-gray-600">Information pack for settings and trusts</p>
        <p className="mt-1 text-xs text-gray-400">kokolearn.org &nbsp;·&nbsp; support@kokolearn.org &nbsp;·&nbsp; A PAD-CIC initiative</p>
      </header>

      {/* ── What it is ── */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">What KokoLearn is</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          KokoLearn is an AI tutoring platform for children aged 5–11. It generates
          curriculum-aligned lessons around each learner&apos;s own interests, adapts the
          difficulty as they go, and keeps a record of progress for the adults around them.
          It is used by families, schools, alternative provisions and care organisations.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          For settings, it works as a low-cost intervention or enrichment tool that runs on
          the devices you already have — no installation and no IT project.
        </p>
      </section>

      {/* ── Benefits ── */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Why settings choose it</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {benefits.map(([title, detail]) => (
            <div key={title} className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Volume pricing</h2>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2 font-semibold text-gray-700">Group</th>
              <th className="py-2 font-semibold text-gray-700">Size</th>
              <th className="py-2 font-semibold text-gray-700">Price</th>
              <th className="py-2 font-semibold text-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.name} className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-900">{t.name}</td>
                <td className="py-2 text-gray-600">{t.seats}</td>
                <td className="py-2 font-semibold text-primary">{t.price} <span className="text-xs font-normal text-gray-500">{t.per}</span></td>
                <td className="py-2 text-xs text-gray-500">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">
          All plans include the admin dashboard, per-learner progress reports and UK curriculum tracking.
          Purchase orders accepted; annual invoicing available.
        </p>
      </section>

      {/* ── Getting started ── */}
      <section className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-xl font-bold text-gray-900">How to get started</h2>
          <ol className="mt-4 space-y-3">
            {steps.map(([n, title, detail]) => (
              <li key={n} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{n}</span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{title}</span>
                  <span className="block text-xs leading-relaxed text-gray-600">{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="text-center">
          <Image
            src="/images/qr-school-enquiry.png"
            alt="QR code: KokoLearn organisation enquiry"
            width={150}
            height={150}
            className="mx-auto rounded-lg border border-gray-200 p-2"
          />
          <p className="mt-2 text-xs font-semibold text-gray-700">Scan to send an enquiry</p>
          <p className="text-[10px] text-gray-400">kokolearn.org/for-organisations</p>
        </div>
      </section>

      {/* ── Parent handout ── */}
      <section className="mt-10 rounded-2xl border-2 border-dashed border-primary/40 p-6">
        <h2 className="text-lg font-bold text-gray-900">For parents &amp; carers</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          Your child has been given access to KokoLearn. Lessons are personalised to your
          child&apos;s interests and aligned to the UK National Curriculum, and you can see
          their progress at any time from your own dashboard.
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-gray-900">Start your free 24-hour trial</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              Scan the code, create your account, and choose your child&apos;s interests.
              No payment details are needed for the trial. Questions? Email
              support@kokolearn.org — a real person replies.
            </p>
          </div>
          <div className="text-center">
            <Image
              src="/images/qr-parent-signup.png"
              alt="QR code: start a free KokoLearn trial"
              width={130}
              height={130}
              className="mx-auto rounded-lg border border-gray-200 p-2"
            />
            <p className="mt-2 text-xs font-semibold text-gray-700">Scan to begin</p>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-gray-200 pt-4 text-center text-[11px] text-gray-400">
        KokoLearn.org — personalised learning aligned to the UK National Curriculum. A PAD-CIC initiative.
        <br />
        support@kokolearn.org &nbsp;·&nbsp; kokolearn.org/for-organisations
      </footer>
    </div>
  );
}
