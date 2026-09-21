import { invite } from "@/content/invite";
import { Reveal } from "@/components/ui/Reveal";

export function Note() {
  return (
    <Reveal as="section" className="band-asr">
      <div className="container narrow">
        <div className="card text-center" data-reveal>
          <h2 className="ur-display-2 text-gold-300" lang="ur">
            {invite.note.heading}
          </h2>
          <p className="ur-body-lg text-ivory mt-4" lang="ur">
            {invite.note.text}
          </p>
          <p className="mt-4">
            <span className="pill" lang="ur">
              {invite.note.short}
            </span>
          </p>
          <p className="ur-caption mt-3" lang="ur">
            {invite.note.punctual}
          </p>
          <ol className="timeline" dir="rtl" aria-label="ترتیب">
            {invite.timeline.map((t) => (
              <li key={t.label} className="timeline-item">
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-label" lang="ur">
                  {t.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Reveal>
  );
}
