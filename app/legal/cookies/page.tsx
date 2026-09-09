import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "Cookies Policy — KokoLearn.org",
  description: "How KokoLearn.org uses cookies and similar tracking technologies.",
};

export default function CookiesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cookies Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. What Are Cookies?</h2>
              <p className="mt-2">
                Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, recognise you on return visits, and improve your overall experience.
              </p>
              <p className="mt-2">
                KokoLearn.org uses cookies and similar technologies to provide, secure, and improve our educational platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. How We Use Cookies</h2>
              <p className="mt-2">
                We use cookies for the following purposes:
              </p>

              <h3 className="mt-4 font-semibold text-gray-900">Essential / Strictly Necessary Cookies</h3>
              <p className="mt-1">
                These cookies are required for the platform to function. They enable core features such as secure login, session management, and account authentication. Without these cookies, the service cannot operate properly.
              </p>
              <ul className="mt-1 list-disc pl-6 space-y-1 text-xs text-gray-500">
                <li>Session cookies — keep you logged in during your visit</li>
                <li>Security cookies — help detect and prevent fraudulent activity</li>
                <li>CSRF tokens — protect against cross-site request forgery</li>
              </ul>

              <h3 className="mt-4 font-semibold text-gray-900">Functional / Preference Cookies</h3>
              <p className="mt-1">
                These cookies remember your choices, such as your preferred language or child profile settings, to provide a more personalised experience.
              </p>

              <h3 className="mt-4 font-semibold text-gray-900">Analytics Cookies</h3>
              <p className="mt-1">
                We use analytics cookies to understand how visitors interact with KokoLearn.org. This helps us improve our platform, content, and user experience. All analytics data is anonymised and aggregated.
              </p>

              <h3 className="mt-4 font-semibold text-gray-900">Marketing Cookies</h3>
              <p className="mt-1">
                We do <strong>not</strong> serve advertising to children. Limited marketing cookies may be used for our own promotional purposes (e.g., measuring the effectiveness of our marketing campaigns) — these apply only to the parent-facing sections of our site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Types of Cookies We Use</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-primary-200">
                      <th className="py-2 pr-4 font-semibold text-gray-900">Cookie Type</th>
                      <th className="py-2 pr-4 font-semibold text-gray-900">Purpose</th>
                      <th className="py-2 font-semibold text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    <tr>
                      <td className="py-2 pr-4">Session</td>
                      <td className="py-2 pr-4">Maintain login session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">CSRF Token</td>
                      <td className="py-2 pr-4">Security against request forgery</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Preferences</td>
                      <td className="py-2 pr-4">Remember language &amp; settings</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Analytics</td>
                      <td className="py-2 pr-4">Usage insights (anonymised)</td>
                      <td className="py-2">Up to 2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Cookies</h2>
              <p className="mt-2">
                We use a limited number of trusted third-party services that may set their own cookies:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Payment processor</strong> — for secure payment processing (set only during checkout)</li>
                <li><strong>Analytics provider</strong> — for anonymous usage statistics</li>
                <li><strong>Cloud infrastructure</strong> — for reliable content delivery</li>
              </ul>
              <p className="mt-2">
                These third parties have their own privacy and cookie policies. We do not allow third-party advertising cookies on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Your Choices</h2>
              <p className="mt-2">
                When you first visit KokoLearn.org, you will see a cookie consent banner that allows you to accept or decline non-essential cookies.
              </p>
              <p className="mt-2">
                You can also manage cookies through your browser settings:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Most browsers allow you to block or delete cookies</li>
                <li>You can set your browser to alert you before accepting cookies</li>
                <li>Blocking essential cookies may prevent KokoLearn.org from functioning properly</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                For more information on managing cookies, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">aboutcookies.org</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Children &amp; Cookies</h2>
              <p className="mt-2">
                KokoLearn.org is designed for children&apos;s education. We take extra care with cookies on child-facing parts of the platform:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Only strictly necessary cookies are used in the children&apos;s learning environment</li>
                <li>No tracking, advertising, or analytics cookies are placed on child profiles</li>
                <li>Parents have full control over their child&apos;s experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Updates to This Policy</h2>
              <p className="mt-2">
                We may update this Cookies Policy from time to time to reflect changes in technology, regulation, or our practices. We will notify you of any material changes via email or through a notice on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
              <p className="mt-2">
                If you have any questions about our use of cookies:
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
            <Link href="/legal/cookies" className="text-primary hover:underline">Cookies Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
