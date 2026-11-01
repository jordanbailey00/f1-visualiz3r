import Link from "next/link";
import { AsciiLogo } from "@/components/site/AsciiLogo";
import { SupernovaBackground } from "@/components/site/SupernovaBackground";
import { CATALOG } from "@/lib/cars/catalog";

/** The logo, then one car per regulation era: a picture and a name each. */
export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col items-center px-5 pb-16 pt-[clamp(40px,9vh,110px)]">
      <SupernovaBackground />
      <h1 className="sr-only">f1 visualiz3r</h1>
      <AsciiLogo className="w-[min(860px,92vw)] text-hud-text" />

      <nav aria-label="Eras" className="mt-[clamp(40px,8vh,96px)] flex max-w-[1100px] flex-wrap justify-center gap-x-4 gap-y-7">
        {CATALOG.map((c) =>
          c.built ? (
            <Link key={c.id} href={`/${c.id}`} className="group w-[min(250px,calc(50vw-28px))]">
              <div className="aspect-[16/10] overflow-hidden border border-white/[0.14] bg-black transition-colors group-hover:border-white/50 group-focus-visible:border-hud-accent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/previews/${c.id}.webp`} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
              <p className="hud-label mt-3 text-center text-[10.5px] text-hud-dim transition-colors group-hover:text-hud-text">
                <span className="text-hud-faint">{c.years}</span> · {c.name}
              </p>
            </Link>
          ) : (
            <div key={c.id} className="w-[min(250px,calc(50vw-28px))]" aria-disabled title={c.tagline}>
              <div className="grid aspect-[16/10] place-items-center border border-dashed border-white/[0.1] bg-black/60">
                <div className="text-center">
                  <p className="font-mono text-[22px] tracking-[0.12em] text-hud-faint">{c.shortName}</p>
                  <p className="hud-label mt-2 text-[9px] text-hud-faint/80">In build</p>
                </div>
              </div>
              <p className="hud-label mt-3 text-center text-[10.5px] text-hud-faint">
                {c.years} · {c.name}
              </p>
            </div>
          ),
        )}
      </nav>

      <Link href="/lineup" className="hud-btn mt-10">
        All cars side by side, to scale
      </Link>
    </main>
  );
}
