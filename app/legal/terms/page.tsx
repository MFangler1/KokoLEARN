import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "Terms & Conditions — KokoLearn.org",
  description: "Terms and Conditions for using KokoLearn.org AI-powered tutoring platform.",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms &amp; Conditions</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By creating an account or using KokoLearn.org, you agree to these Terms &amp; Conditions. If you do not agree, please do not use our service. KokoLearn.org is operated by <strong>AiConsultancy.org.uk (Grimsby)</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Eligibility</h2>
              <p className="mt-2">
                You must be a parent or legal guardian of legal age to create an account. By registering, you represent that you have the authority to agree to these terms on behalf of yourself and any children whose profiles you create.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Account Responsibilities</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You are responsible for all activity under your account, including your children&apos;s usage</li>
                <li>You must provide accurate and up-to-date information</li>
                <li>You must promptly notify us of any unauthorised access at <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Acceptable Use</h2>
              <p className="mt-2">
                You agree to use KokoLearn.org only for lawful educational purposes and in a way that does not harm others or the service. You shall not:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Attempt unauthorised access to any part of the platform</li>
                <li>Upload harmful, illegal, or inappropriate content</li>
                <li>Use the service to generate content that violates any applicable law</li>
                <li>Exploit the free trial system by creating multiple fraudulent accounts</li>
                <li>Reverse-engineer, decompile, or attempt to extract source code</li>
                <li>Resell, redistribute, or commercially exploit any part of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Content Ownership</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Your content:</strong> You retain ownership of materials you upload (PDFs, images, voice recordings). You grant us a limited licence to process, store, and use them to deliver the service.</li>
                <li><strong>AI-generated content:</strong> Lessons, quizzes, and other AI-generated educational materials are created for your personal, non-commercial educational use.</li>
                <li><strong>Our content:</strong> The KokoLearn.org platform, brand, design, and proprietary technology remain the property of AiConsultancy.org.uk (Grimsby).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Educational Disclaimer</h2>
              <p className="mt-2">
                KokoLearn.org is an AI-powered educational supplement. Content generated by our AI is designed to assist learning and is provided for educational and family use only. It is not intended as a substitute for professional academic instruction, tutoring, or educational assessment. Parents should exercise independent judgment regarding their child&apos;s educational needs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Payments &amp; Lifetime Access</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>KokoLearn.org offers various subscription plans and a one-time lifetime access option at the stated price</li>
                <li>Payment is processed securely through our payment partner</li>
                <li>A free trial is available for new users (limited per IP address)</li>
                <li>Refunds are subject to our <Link href="/legal/refund" className="text-secondary hover:underline">Refund Policy</Link></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Service Availability</h2>
              <p className="mt-2">
                We strive to keep KokoLearn.org available at all times but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or unforeseen technical issues. We will notify users of planned downtime when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">9. Termination</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>You may delete your account at any time by contacting <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a></li>
                <li>We may suspend or terminate accounts that violate these terms or engage in abusive behaviour</li>
                <li>Upon termination, your data will be deleted in accordance with our Privacy Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">10. Limitation of Liability</h2>
              <p className="mt-2">
                To the maximum extent permitted by UK law, our total liability is limited to the amount you paid us for the service. We are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of KokoLearn.org.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">11. Governing Law</h2>
              <p className="mt-2">
                These terms are governed by the laws of the <strong>United Kingdom</strong>. Any disputes shall be subject to the exclusive jurisdiction of the <strong>courts of England and Wales</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">12. Changes to Terms</h2>
              <p className="mt-2">
                We may update these terms from time to time. Continued use of KokoLearn.org after changes constitutes acceptance. We will notify you of material changes via email or in-app notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">13. Contact</h2>
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
