import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "Refund Policy — KokoLearn.org",
  description: "Refund and cancellation policy for KokoLearn.org AI-powered tutoring platform.",
};

export default function RefundPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Refund &amp; Cancellation Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Free Trial</h2>
              <p className="mt-2">
                KokoLearn.org offers a free trial for new users. During the trial period, you have full access to all features. No payment is required to start the trial, and it ends automatically — you are never auto-charged.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
              <p className="mt-2">
                KokoLearn.org offers various monthly subscription plans. Once you purchase, subscriptions renew automatically unless cancelled before the renewal date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Refund Policy</h2>
              
              <h3 className="mt-4 font-semibold text-gray-900">Within 14 Days of Purchase</h3>
              <p className="mt-1">
                If you are unsatisfied with KokoLearn.org, you may request a full refund within <strong>14 days</strong> of your purchase date. No questions asked.
              </p>

              <h3 className="mt-4 font-semibold text-gray-900">After 14 Days</h3>
              <p className="mt-1">
                Refunds are evaluated on a case-by-case basis. We may offer a refund if there is a genuine technical issue preventing you from using the service.
              </p>

              <h3 className="mt-4 font-semibold text-gray-900">Exceptions</h3>
              <p className="mt-1">
                Refunds will not be issued for accounts terminated due to violation of our <Link href="/legal/terms" className="text-secondary hover:underline">Terms &amp; Conditions</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">How to Request a Refund</h2>
              <p className="mt-2">
                To request a refund, email us at <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a> with:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Your registered email address</li>
                <li>Date of purchase</li>
                <li>Reason for refund request</li>
              </ul>
              <p className="mt-2">
                Refunds are typically processed within 5–10 business days and will be returned to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Account Deletion</h2>
              <p className="mt-2">
                You may request deletion of your account and all associated data at any time by emailing <a href="mailto:Support@AiConsultancy.org.uk" className="text-secondary hover:underline">Support@AiConsultancy.org.uk</a>. See our <Link href="/legal/privacy" className="text-secondary hover:underline">Privacy Policy</Link> for details.
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
