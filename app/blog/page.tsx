import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Tag, Rss, MessageSquare, Star, ExternalLink } from "lucide-react";
import { blogPosts, industryRssFeeds, testimonials } from "./data";
import NewsletterSignup from "../components/NewsletterSignup";
import BackButton from "../components/BackButton";
import HomeButton from "../components/HomeButton";

export const metadata = {
  title: "Blog — KokoLearn.org",
  description: "Tips, guidance, and insights for parents supporting their child's learning journey. Plus the latest from the education industry.",
};

export default function BlogPage() {
  const today = new Date().getFullYear();

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">User Dashboard</Link>
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">FREE TRIAL</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-8 lg:pt-24 lg:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <BackButton />
              <HomeButton />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Blog & News</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tips, guidance & education news</h1>
            <p className="mt-4 text-lg text-gray-600">Practical advice for parents, insights from educators, and the latest from the world of education technology.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* ── Main Content (2 columns) ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Posts */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {blogPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-2xl border border-primary-100/20 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm">
                          {post.emoji} {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                        <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Testimonials ── */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  What Parents & Teachers Say
                </h2>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Moderated
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-xl border border-primary-100/20 bg-white p-5 shadow-sm">
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role} · {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave feedback CTA */}
              <div className="mt-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary-50/20 p-5 text-center">
                <p className="text-sm font-semibold text-gray-700">Have a KokoLearn experience to share?</p>
                <p className="text-xs text-gray-500 mt-0.5">We&apos;d love to hear it. All feedback is reviewed before publishing.</p>
                <Link href="mailto:Support@AiConsultancy.org.uk?subject=KokoLearn%20Feedback" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white border border-primary/30 px-4 py-2 text-sm font-medium text-primary hover:bg-primary-50 transition-all">
                  <MessageSquare className="h-4 w-4" />
                  Share Your Feedback
                </Link>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-8">
            {/* Newsletter */}
            <NewsletterSignup variant="card" />

            {/* From the Industry */}
            <div className="rounded-2xl border border-primary-100/20 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Rss className="h-5 w-5 text-primary" />
                From the Industry
              </h3>
              <p className="text-xs text-gray-500 mb-4">Curated education news from trusted sources</p>
              <div className="space-y-3">
                {industryRssFeeds.map((feed) => (
                  <a
                    key={feed.name}
                    href={feed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg p-3 hover:bg-primary-50/50 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{feed.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{feed.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
              <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                RSS feeds coming soon — articles from these sources will appear here automatically.
              </p>
            </div>

            {/* Quick CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg">Try KokoLearn FREE</h3>
              <p className="mt-1 text-sm text-white/80">24 hours of full access. No credit card required.</p>
              <Link href="/sign-up" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-md hover:bg-gray-100 transition-all">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-b from-primary-50 to-white border-t border-primary-100/30 pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={120} height={120} className="object-contain" />
              </Link>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                AI-powered tutoring aligned to the UK National Curriculum. For families, schools, and care organisations.
              </p>
              {/* Footer Newsletter */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Get tips & updates</p>
                <NewsletterSignup variant="inline" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Product</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {["How it works", "Features", "Pricing", "Institutions", "Blog"].map((l) => {
                    const href = l === "How it works" ? "/#how-it-works" :
                                 l === "Features" ? "/#features" :
                                 l === "Pricing" ? "/#pricing" :
                                 l === "Institutions" ? "/for-organisations" :
                                 l === "Blog" ? "/blog" : "/";
                    return (
                      <li key={l}><Link href={href} className="text-gray-600 hover:text-primary transition-colors">{l}</Link></li>
                    );
                  })}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/legal/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-gray-600 hover:text-primary transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link href="/legal/child-safety" className="text-gray-600 hover:text-primary transition-colors">Child Safety Policy</Link></li>
                <li><Link href="/legal/refund" className="text-gray-600 hover:text-primary transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/cookies" className="text-gray-600 hover:text-primary transition-colors">Cookies Policy</Link></li>
                <li><Link href="/legal/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="https://AiConsultancy.org.uk" target="_blank" className="text-gray-600 hover:text-primary transition-colors">AiConsultancy.org.uk</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-primary-100/30 pt-6 text-center">
            <p className="text-xs text-gray-400">&copy; {today} KokoLearn.org. A PAD-CIC initiative.</p>
<div className="mt-4 text-center"><Link href="/admin" className="text-xs text-gray-400 hover:text-primary transition-colors">Admin</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
