import { invite } from "@/content/invite";
import { Reveal } from "@/components/ui/Reveal";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { SectionDivider } from "@/components/ui/SectionDivider";

export function Closing() {
  return (
    <Reveal as="section" className="section sec-tint" id="closing">
      <div className="container narrow text-center">
        <p className="eyebrow" lang="ur" data-reveal>{invite.eyebrows.dua}</p>
        <p className="ar-verse text-gold-200 mt-6" lang="ar" data-reveal>
          {invite.dua.arabic}
        </p>
        <p className="ur-body-lg text-ivory-muted mt-3" lang="ur" data-reveal>
          {invite.dua.urdu}
        </p>

        <SectionDivider className="is-inner my-12" />

        <div className="sher" lang="ur" data-reveal>
          {invite.sher.lines.map((l, i) => (
            <p key={i} className={`ur-title ${i % 2 ? "text-ivory-muted" : "text-ivory"}`}>
              {l}
            </p>
          ))}
        </div>

        <SectionDivider className="is-inner my-12" />

        <p className="ur-title text-ivory" lang="ur" data-reveal>
          {invite.closing.line1}
        </p>
        <p className="ur-body-lg text-ivory-muted" lang="ur" data-reveal>
          {invite.closing.line2}
        </p>
        <p className="ur-title text-gold-300 mt-6" lang="ur" data-reveal>
          {invite.closing.from}
        </p>
        <p className="ur-caption" lang="ur" data-reveal>
          {invite.closing.fromDetail}
        </p>
        <p className="ur-caption text-gold-400" lang="ur" data-reveal>
          {invite.closing.signoff}
        </p>

        <div className="mt-14" data-reveal>
          <h3 className="ur-title text-ivory" lang="ur">
            {invite.share.heading}
          </h3>
          <ShareButtons className="mt-4" />
        </div>
      </div>
    </Reveal>
  );
}
