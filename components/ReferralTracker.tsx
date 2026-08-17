// ── Referral Tracker ──
// Captures referral codes from URL params and processes on sign-up
"use client";

import { useEffect } from "react";

export function ReferralTracker({ userId }: { userId?: string }) {
  useEffect(() => {
    // Capture referral code from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && typeof window !== "undefined") {
      localStorage.setItem("kokolearn_referral", ref);
    }

    // Process referral when user is signed in
    if (userId) {
      const storedRef = localStorage.getItem("kokolearn_referral");
      if (storedRef) {
        fetch("/api/referrals/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: storedRef, newUserId: userId }),
        }).catch(() => {});
        localStorage.removeItem("kokolearn_referral");
      }
    }
  }, [userId]);

  return null;
}
