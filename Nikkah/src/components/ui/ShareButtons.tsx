"use client";
import { useState, useSyncExternalStore } from "react";
import { SITE } from "@/config/event";
import { invite } from "@/content/invite";

/** The live origin is authoritative (preview deploys, custom domains); SITE.url is the SSR fallback. */
function siteUrl() {
  return typeof window === "undefined" ? SITE.url : window.location.origin;
}

const subscribeOrigin = () => () => {};
const getOrigin = () => window.location.origin;
const getOriginServer = () => SITE.url;

export function ShareButtons({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  // The real origin after hydration (preview deploys, custom domains); SITE.url during SSR.
  const origin = useSyncExternalStore(subscribeOrigin, getOrigin, getOriginServer);
  const href = `https://wa.me/?text=${encodeURIComponent(`${invite.share.text}\n${origin}`)}`;

  const share = () => {
    // Must be called synchronously inside the click handler (transient activation).
    if (typeof navigator !== "undefined" && "share" in navigator) {
      // text without the URL: the share sheet appends `url` itself, and Android would show it twice
      navigator.share({ title: SITE.titleUrdu, text: invite.share.text, url: siteUrl() }).catch(() => {});
      return;
    }
    copy();
  };

  const copy = () => {
    navigator.clipboard?.writeText(siteUrl()).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className ?? ""}`}>
      <a className="btn-gold btn-primary" href={href} target="_blank" rel="noopener noreferrer" lang="ur">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" />
        </svg>
        {invite.share.whatsapp}
      </a>
      <button type="button" className="btn-gold" onClick={share} lang="ur">
        {invite.share.share}
      </button>
      <button type="button" className="btn-gold" onClick={copy} lang="ur" aria-live="polite">
        {copied ? invite.share.copied : invite.share.copy}
      </button>
    </div>
  );
}
