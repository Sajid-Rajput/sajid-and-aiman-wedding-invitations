"use client";
import { useState } from "react";
import { MAP_LINKS } from "@/config/event";
import { invite } from "@/content/invite";

/** Click-to-load Google Maps iframe: costs nothing until a guest asks for it. */
export function MapEmbed({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`map-embed ${className ?? ""}`}>
      {open ? (
        <iframe
          title="Masjid-e-Quba map"
          src={MAP_LINKS.embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="map-frame"
        />
      ) : (
        <button type="button" className="map-placeholder" onClick={() => setOpen(true)} lang="ur">
          <span className="map-pin" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
          </span>
          <span className="ur-body">{invite.where.showMap}</span>
        </button>
      )}
    </div>
  );
}
