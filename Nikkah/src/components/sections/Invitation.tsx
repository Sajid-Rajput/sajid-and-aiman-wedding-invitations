import { invite } from "@/content/invite";
import { Reveal } from "@/components/ui/Reveal";
import { NastaliqWords } from "@/components/ui/NastaliqWords";

/** The formal invitation sentence from both families, as printed on a Lahori card. */
export function Invitation() {
  return (
    <Reveal as="section" className="section">
      <div className="container narrow text-center">
        <p className="ur-title text-gold-300" lang="ur" data-reveal>
          {invite.salam}
        </p>
        <p className="ur-caption text-gold-400 mt-3" lang="ur" data-reveal>
          {invite.body.tagline}
        </p>
        <div className="card mt-8" data-reveal>
          <p className="ur-body-lg text-ivory" lang="ur">
            {invite.body.intro}
          </p>
          <NastaliqWords as="p" text={`${invite.groom.name} ${invite.groom.honorific}`} className="ur-display-2 foil-text my-1" />
          <p className="ur-caption" lang="ur">
            {invite.groom.parent}
          </p>
          <p className="ur-body-lg text-ivory mt-3" lang="ur">
            {invite.body.and}
          </p>
          <NastaliqWords as="p" text={`${invite.bride.name} ${invite.bride.honorific}`} className="ur-display-2 foil-text my-1" />
          <p className="ur-caption" lang="ur">
            {invite.bride.parent}
          </p>
          <p className="ur-body-lg text-ivory mt-3" lang="ur">
            {invite.body.outro}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
