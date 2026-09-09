import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "Child Safety Policy — KokoLearn.org",
  description: "KokoLearn.org is committed to providing a safe, secure online learning environment for children.",
};

export default function ChildSafetyPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-primary-50 via-white to-primary-50/30">
      {/* Simple header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-3">
              <BackButton className="font-semibold text-white hover:text-white/80" />
              <HomeButton className="font-semibold text-white hover:text-white/80" />
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary-100/30 bg-white p-8 shadow-sm sm:p-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Child Safety Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Our Commitment</h2>
              <p className="mt-2">
                At KokoLearn.org, the safety and well-being of children is our highest priority. We are committed to providing a secure, age-appropriate, and nurturing learning environment for every child who uses our platform.
              </p>
            </section>

            <section className="rounded-xl bg-primary-50 p-5 border border-primary-100">
              <h2 className="text-lg font-semibold text-primary">Zero Tolerance</h2>
              <p className="mt-2">
                We have <strong>zero tolerance</strong> for content that is harmful, exploitative, or inappropriate for children. This includes any material that endangers, sexualises, or causes harm to minors in any way. Any such content is immediately removed, and the responsible account is terminated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Parent-Controlled Access</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Only parents or legal guardians can create accounts and child profiles</li>
                <li>Children access the platform exclusively through parent-managed, PIN-protected profiles</li>
                <li>Parents control what subjects their child learns and can review all generated content</li>
                <li>Parents have full visibility into their child&apos;s learning activity via the parent dashboard</li>
                <li>No social features, messaging, or child-to-child communication exists on the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Content Moderation</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>All AI-generated educational content is filtered for age-appropriateness</li>
                <li>Our AI models are instructed to produce only educational, positive, and encouraging content</li>
                <li>Content safety filters block inappropriate, violent, or harmful material</li>
                <li>We continuously review and improve our content moderation systems</li>
                <li>Uploaded materials are scanned for inappropriate content before processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Data Protection for Children</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>We collect minimal data about children — only what parents provide (name, grade, avatar, interests)</li>
                <li>We never collect data directly from children without parental consent</li>
                <li>Child data is stored securely with encryption at rest and in transit</li>
                <li>We do not serve advertising to children</li>
                <li>We do not sell or share children&apos;s data with third parties for marketing</li>
                <li>Parents may request complete deletion of their child&apos;s data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">AI Safety Measures</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Our AI is designed to be warm, encouraging, and educationally focused</li>
                <li>AI responses are bounded to educational content related to the lesson topic</li>
                <li>The AI never asks children for personal information</li>
                <li>All AI interactions are logged and available for parent review</li>
                <li>Content safety guardrails prevent generation of inappropriate material</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Reporting Concerns</h2>
              <p className="mt-2">
                If you encounter any content or behaviour on KokoLearn.org that you believe is harmful or inappropriate for children, please report it immediately:
              </p>
              <div className="mt-3 rounded-xl bg-secondary-50 p-4 text-sm">
                <p><strong>Email:</strong> <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a></p>
              </div>
              <p className="mt-2">
                We investigate all reports promptly and take corrective action, including content removal and account termination where appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Compliance</h2>
              <p className="mt-2">
                KokoLearn.org is designed in compliance with applicable UK children&apos;s privacy and safety regulations, including UK GDPR and COPPA guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
              <div className="mt-3 rounded-xl bg-primary-50 p-4 text-sm">
                <p><strong>Email:</strong> <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a></p>
                <p className="mt-1"><strong>Company:</strong> AiConsultancy.org.uk (Grimsby)</p>
                <p className="mt-1"><strong>Founder &amp; CEO:</strong> Mark Fenty</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-primary-100/30 bg-primary-50/30 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} KokoLearn.org — Built by AiConsultancy.org.uk (Grimsby)</p>
<div className="mt-4 text-center"><Link href="/admin" className="text-xs text-gray-400 hover:text-primary transition-colors">Admin</Link></div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-600 transition-all">Home</Link>
            <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <Link href="/legal/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
