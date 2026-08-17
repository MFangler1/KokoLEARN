// ── Refer-a-Friend Widget ──
// Invite friends to KokoLearn and unlock rewards

"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Check, Share2, Mail, Loader2 } from "lucide-react";

export default function ReferAFriend() {
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/referrals/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(r => r.json())
      .then(data => {
        if (data.code) {
          setCode(data.code);
          setUrl(data.url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "KokoLearn - AI-Powered Learning for Kids",
        text: `I'm using KokoLearn for my child's learning — it's brilliant! Try it free: ${url}`,
        url,
      });
    } else {
      copyLink();
    }
  };

  const sendInvite = async () => {
    if (!email || !email.includes("@")) return;
    setSending(true);
    try {
      const res = await fetch("/api/referrals/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
        setEmail("");
        setTimeout(() => setSent(false), 3000);
      }
    } catch {}
    setSending(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading referral code...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Refer a Friend</h3>
          <p className="text-sm text-gray-500">
            Invite friends and unlock <strong>Extended Questions</strong> for free when they complete their first lesson!
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1 rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-mono text-gray-600 truncate">
          {url || `kokolearn.org?ref=${code}`}
        </div>
        <button
          onClick={copyLink}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
          title="Copy link"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          onClick={shareNative}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-600 transition-all shadow-sm"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {!sent ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="friend@email.com"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button
            onClick={sendInvite}
            disabled={!email || sending}
            className="shrink-0 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700 text-center">
          <Check className="inline h-4 w-4 mr-1" />
          Invitation ready to share!
        </div>
      )}

      <p className="mt-3 text-[10px] text-gray-400">
        Your friend gets a free trial. You get <strong>Extended Questions (10 per lesson)</strong> free when they complete their first lesson! 🎉
      </p>
    </div>
  );
}
