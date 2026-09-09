import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag, Calendar, User, Share2 } from "lucide-react";
import { blogPosts } from "../data";
import NewsletterSignup from "../../components/NewsletterSignup";
import BackButton from "../../components/BackButton";
import HomeButton from "../../components/HomeButton";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} — KokoLearn.org`, description: post.excerpt };
}

// @ts-nocheck
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const today = new Date().getFullYear();

  // Parse simple markdown-like content into paragraphs
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      // Bold headers
      if (block.startsWith("**") && block.endsWith("**")) {
        return (
          <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
            {block.replace(/\*\*/g, "")}
          </h3>
        );
      }
      // Bullet lists
      if (block.startsWith("- ")) {
        return (
          <ul key={i} className="space-y-1.5 my-3">
            {block.split("\n").map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-gray-700">
                <span className="text-primary mt-1.5">•</span>
                <span>{item.replace(/^- /, "").replace(/\*\*/g, "")}</span>
              </li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className="text-gray-700 leading-relaxed my-3">
          {block}
        </p>
      );
    });
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">FREE TRIAL</Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* ── Post Header ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
              {post.emoji} {post.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
              {post.author.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">{post.authorRole}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured Image ── */}
        <div className="relative aspect-[2/1] overflow-hidden rounded-2xl mb-10 shadow-lg">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
        </div>

        {/* ── Post Content ── */}
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* ── Share ── */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Share2 className="h-4 w-4" />
            Share this article
          </div>
          <div className="flex gap-2">
            {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
              <button key={platform} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-primary/30 transition-all">
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="mt-10">
          <NewsletterSignup variant="card" />
        </div>

        {/* ── Back Links ── */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton className="text-sm font-medium text-primary hover:text-primary-600" />
            <HomeButton className="text-sm font-medium text-gray-500 hover:text-primary" />
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            All Articles
          </Link>
        </div>
      </article>

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-b from-primary-50 to-white border-t border-primary-100/30 pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={120} height={120} className="object-contain" />
              </Link>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                AI-powered tutoring aligned to the UK National Curriculum.
              </p>
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
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="https://AiConsultancy.org.uk" target="_blank" className="text-gray-600 hover:text-primary transition-colors">AiConsultancy.org.uk</Link></li>
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
