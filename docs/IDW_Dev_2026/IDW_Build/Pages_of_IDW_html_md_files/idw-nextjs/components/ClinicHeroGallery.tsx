/**
 * components/ClinicHeroGallery.tsx
 * 5-slot photo masonry — mirrors the artifact's hero-gallery-strip layout.
 * Server component.
 */
import Image from 'next/image';

interface Props {
  photos: string[]; // expects exactly 5
  altBase: string;
}

export default function ClinicHeroGallery({ photos, altBase }: Props) {
  const [main, tr, br, bl1, bl2] = photos;

  return (
    <div className="hero-gallery" aria-label={`${altBase} photos`} aria-hidden="true">
      <div className="hero-gallery__main">
        <Image src={main} alt={`${altBase} — main`} fill sizes="(max-width:1024px) 100vw, 55vw" priority />
      </div>
      <div className="hero-gallery__side">
        <div className="hero-gallery__tr">
          <Image src={tr} alt={`${altBase} — interior`} fill sizes="25vw" />
        </div>
        <div className="hero-gallery__br">
          <Image src={br} alt={`${altBase} — equipment`} fill sizes="25vw" />
        </div>
        <div className="hero-gallery__bl1">
          <Image src={bl1} alt={`${altBase} — team`} fill sizes="12vw" />
        </div>
        <div className="hero-gallery__bl2">
          <Image src={bl2} alt={`${altBase} — smile result`} fill sizes="12vw" />
        </div>
      </div>
    </div>
  );
}
