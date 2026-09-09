import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "FAQ — KokoLearn.org",
  description: "Frequently asked questions about KokoLearn.org personalised learning platform for KS1, KS2 and SEND learners.",
};

export default function FAQPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">

            {/* General */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">General</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">What is KokoLearn.org?</h3>
                  <p className="mt-1">
                    KokoLearn.org is an AI-powered tutoring platform that creates personalised lessons for children. We use artificial intelligence to adapt every lesson to your child&apos;s unique interests, pace, and learning style — all aligned to the UK National Curriculum.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Who is KokoLearn.org for?</h3>
                  <p className="mt-1">
                    KokoLearn.org is designed for children aged 5-11 (KS1 and KS2) and is also suitable for SEND learners who may benefit from personalised, adaptive learning pathways. Parents create and manage accounts, and children access their learning through parent-controlled profiles.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Is KokoLearn.org aligned to the UK National Curriculum?</h3>
                  <p className="mt-1">
                    Yes. All lessons are designed to align with the UK National Curriculum across core subjects including Maths, English, Science, and more. Our AI tailors the content to your child&apos;s year group and ability level.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">What makes KokoLearn different from other tutoring apps?</h3>
                  <p className="mt-1">
                    Unlike one-size-fits-all apps, KokoLearn turns your child&apos;s unique interests into their lessons. Love dinosaurs? We&apos;ll teach maths through dinosaur facts. Crazy about space? We&apos;ll explore English through stories about the solar system. Every lesson is truly personalised.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Is KokoLearn.org suitable for SEND learners?</h3>
                  <p className="mt-1">
                    Yes. KokoLearn.org is designed to support a wide range of learning needs through personalised learning pathways that adapt to individual learning styles, pace and interests. It may be suitable for learners with ADHD, autism, dyslexia, dyspraxia, processing difficulties, or anxiety-related learning challenges. Parents should assess suitability for their child&apos;s specific needs. KokoLearn.org is an educational support platform and is not a medical or diagnostic service.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">What age groups is KokoLearn.org designed for?</h3>
                  <p className="mt-1">
                    KokoLearn.org is designed for children aged 5-11, covering Key Stages 1 and 2 of the UK National Curriculum. We also support SEND learners who may benefit from personalised, adaptive learning within this age range.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Does my child need previous experience?</h3>
                  <p className="mt-1">
                    Not at all. KokoLearn.org adapts to your child&apos;s current level — whether they need to build foundational skills or are ready for more challenging content. Every lesson meets them where they are.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Can multiple children use the platform?</h3>
                  <p className="mt-1">
                    Yes. One parent account can manage multiple child profiles, each with their own personalised learning path, progress tracking, and interests. Our Family plan supports up to 4 children.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">How does personalised learning work?</h3>
                  <p className="mt-1">
                    When you sign up, you complete a short learning check to help identify your child&apos;s strengths and areas for improvement. Our system then generates a personalised learning pathway with adaptive lessons and activities that respond to your child&apos;s progress. You can track achievements and celebrate progress along the way.
                  </p>
                </div>
              </div>
            </section>

            {/* Account & Setup */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Account &amp; Setup</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">How do I create an account?</h3>
                  <p className="mt-1">
                    Visit <Link href="/sign-up" className="text-secondary hover:underline">our sign-up page</Link> and register with your email address. You can start with a free trial — no payment required.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">How do I create a child profile?</h3>
                  <p className="mt-1">
                    After signing in, go to your parent dashboard and click &ldquo;Add Child.&rdquo; You&apos;ll set their name, year group, interests, and a 4-digit PIN they&apos;ll use to access their lessons.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Can I add multiple children?</h3>
                  <p className="mt-1">
                    Yes. One parent account can manage multiple child profiles, each with their own learning path, progress tracking, and personalised content.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Can I delete my account?</h3>
                  <p className="mt-1">
                    Yes. You can request account deletion at any time by emailing <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a>. All associated data will be permanently removed.
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing & Payments */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Pricing &amp; Payments</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">How much does KokoLearn cost?</h3>
                  <p className="mt-1">
                    We offer three plans: a free 24-hour trial to get started, a monthly Premium plan for one child, and a Family plan for up to 4 children. See our <Link href="/#pricing" className="text-secondary hover:underline">pricing section</Link> for current prices.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Is there a free trial?</h3>
                  <p className="mt-1">
                    Yes. New users get a free trial with full access to the platform. No payment details are required to start.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Can I get a refund?</h3>
                  <p className="mt-1">
                    Yes. We offer a 14-day refund policy on purchases. See our <Link href="/legal/refund" className="text-secondary hover:underline">Refund Policy</Link> for full details.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Is my payment information secure?</h3>
                  <p className="mt-1">
                    Absolutely. All payments are processed securely through our trusted payment partner. We never store your card details on our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy & Safety */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Privacy &amp; Safety</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">How do you protect my child&apos;s privacy?</h3>
                  <p className="mt-1">
                    We take child privacy extremely seriously. Parents control all data, children access the platform through PIN-protected profiles, and we never collect data directly from children. See our <Link href="/legal/privacy" className="text-secondary hover:underline">Privacy Policy</Link> for full details.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Is KokoLearn.org safe for my child?</h3>
                  <p className="mt-1">
                    Yes. We have a strict <Link href="/legal/child-safety" className="text-secondary hover:underline">Child Safety Policy</Link>. There are no social features, no messaging, no advertising to children, and all AI-generated content is filtered for age-appropriateness.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Do you share my data with third parties?</h3>
                  <p className="mt-1">
                    We never sell your data. We only share data with essential service providers (payment processing, cloud storage, AI model providers) and never include personal identifying information in AI requests.
                  </p>
                </div>
              </div>
            </section>

            {/* Technical */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Technical</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">What devices does KokoLearn work on?</h3>
                  <p className="mt-1">
                    KokoLearn.org works on any modern web browser — desktop, tablet, or mobile. We recommend using Chrome, Safari, Firefox, or Edge for the best experience.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">Does KokoLearn have a mobile app?</h3>
                  <p className="mt-1">
                    Currently, KokoLearn.org is a web-based platform accessible from any device with a browser. A dedicated mobile app is planned for future release.
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100/30 p-4">
                  <h3 className="font-semibold text-gray-900">What if I have a technical problem?</h3>
                  <p className="mt-1">
                    Email us at <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a> and we&apos;ll help resolve any issues as quickly as possible.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Still Have Questions?</h2>
              <p className="mt-2">
                We&apos;re here to help. Reach out to us anytime:
              </p>
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
            <Link href="/legal/faq" className="text-primary hover:underline">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
