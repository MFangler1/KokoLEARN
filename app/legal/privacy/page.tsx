import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "Privacy Policy — KokoLearn.org",
  description: "Privacy Policy for KokoLearn.org — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Who We Are</h2>
              <p className="mt-2">
                KokoLearn.org is a product of <strong>AiConsultancy.org.uk (Grimsby)</strong>, founded by Mark Fenty.
                We are committed to protecting your privacy and ensuring a safe online learning environment for children.
              </p>
              <p className="mt-2">
                For any privacy-related questions, contact us at <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>

              <h3 className="mt-4 font-semibold text-gray-900">Parent/Guardian Account</h3>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Full name, email address</li>
                <li>Password (hashed, never stored in plain text)</li>
                <li>Payment information (processed securely via our payment partner — we never store card numbers)</li>
                <li>IP address at registration (for trial abuse prevention)</li>
              </ul>

              <h3 className="mt-4 font-semibold text-gray-900">Child Profiles</h3>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Child&apos;s name, grade, age, avatar (set by the parent)</li>
                <li>Learning preferences, interests, weak subjects (set by the parent)</li>
                <li>4-digit PIN (stored securely as a one-way hash)</li>
              </ul>
              <p className="mt-1">We do not knowingly collect personal data directly from children. All child data is provided and managed by the parent or guardian.</p>

              <h3 className="mt-4 font-semibold text-gray-900">Usage Data</h3>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Session duration, lessons completed, quiz scores, and progress metrics</li>
                <li>Log files for debugging, analytics, and performance improvement</li>
              </ul>

              <h3 className="mt-4 font-semibold text-gray-900">Uploaded Content</h3>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>PDF textbooks, worksheet images, and other educational materials uploaded by parents</li>
                <li>Voice recordings uploaded for voice cloning (stored securely in cloud storage)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>To create and manage your account and your child&apos;s learning profiles</li>
                <li>To generate personalised AI-powered lessons tailored to your child</li>
                <li>To process payments and manage subscriptions</li>
                <li>To provide analytics and progress reports on your parent dashboard</li>
                <li>To improve our AI models and educational content quality</li>
                <li>To prevent fraud and abuse of free trial periods</li>
                <li>To send essential service communications (password resets, payment confirmations)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. AI-Generated Content</h2>
              <p className="mt-2">
                KokoLearn.org uses AI technology to generate educational content. When generating lessons:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Only the uploaded material text, topic, and learning preferences are sent to the AI model</li>
                <li>Your child&apos;s personal identity information is never shared with AI providers</li>
                <li>Generated content is stored in your account and accessible only to you and your child</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Data Sharing</h2>
              <p className="mt-2">
                We do not sell, rent, or trade your personal information. We share data only with:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Payment processor</strong> — for securely processing your purchase</li>
                <li><strong>Cloud infrastructure providers</strong> — for secure data storage and delivery</li>
                <li><strong>AI model providers</strong> — for generating educational content (no personal data shared)</li>
                <li><strong>Law enforcement</strong> — if required by applicable UK law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Account data: Retained until you request deletion</li>
                <li>Payment records: Retained as required by UK financial regulations</li>
                <li>Usage logs: Retained up to 180 days</li>
                <li>Uploaded content: Retained until you delete it or your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Data Security</h2>
              <p className="mt-2">
                We implement industry-standard security measures including:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Passwords and PINs stored using industry-standard one-way hashing</li>
                <li>HTTPS encryption for all data in transit</li>
                <li>Secure, HttpOnly session cookies</li>
                <li>Server-side request validation and protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Children&apos;s Privacy</h2>
              <p className="mt-2">
                KokoLearn.org is designed for parent/guardian-managed child profiles. We comply with applicable children&apos;s privacy laws including UK GDPR and COPPA guidelines.
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Parents create and manage all child accounts</li>
                <li>Children access the platform only through parent-created PIN-protected profiles</li>
                <li>We do not collect data directly from children without parental consent</li>
                <li>Parents may request deletion of their child&apos;s data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">9. Your Rights</h2>
              <p className="mt-2">
                Under UK data protection law, you have the right to:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and all associated data</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, email <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">10. Changes to This Policy</h2>
              <p className="mt-2">
                We may update this Privacy Policy from time to time. Continued use of KokoLearn.org after changes constitutes acceptance of the updated policy. We will notify you of material changes via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">11. Contact Us</h2>
              <p className="mt-2">
                For privacy questions or concerns:
              </p>
              <div className="mt-3 rounded-xl bg-primary-50 p-4 text-sm">
                <p><strong>Email:</strong> <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a></p>
                <p className="mt-1"><strong>Company:</strong> AiConsultancy.org.uk (Grimsby)</p>
                <p className="mt-1"><strong>Founder:</strong> Mark Fenty</p>
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
