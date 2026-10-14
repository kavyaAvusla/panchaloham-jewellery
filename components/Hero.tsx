import Link from "next/link";
import { ArrowRight, PlayIcon } from "@/components/ui/Icons";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:pb-14 sm:pt-12">
      <div className="relative overflow-hidden rounded-4xl shadow-soft">
        {/* First picture on the website: the banner image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-banner.jpg"
          alt="Model wearing Panchaloham jewellery"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
        />

        <div className="relative grid lg:grid-cols-2">
          <div className="bg-white/85 p-8 backdrop-blur-sm sm:p-12 lg:bg-white/70">
            <p className="font-serif text-lg italic text-brand">Tradition You Can Wear,</p>

            <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Panchaloham,
              <br />
              Made For You
            </h1>

            <div className="mt-6 flex items-center gap-3" aria-hidden>
              <span className="h-px w-16 bg-brand/40" />
              <span className="diamond" />
              <span className="h-px w-16 bg-brand/40" />
            </div>

            <p className="mt-5 max-w-md text-base leading-relaxed text-navy/80">
              Beautiful panchaloham and imitation jewellery for every festival and every day.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                title="Shop video: To be confirmed"
                className="inline-flex items-center gap-3 rounded-full border border-navy/20 bg-white/60 py-2 pl-2 pr-5 text-sm text-navy transition hover:border-brand hover:text-brand"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/40 text-brand">
                  <PlayIcon className="h-4 w-4" />
                </span>
                Watch Our Story
              </button>
            </div>
          </div>

          {/* On desktop this empty column lets the model photo show through */}
          <div aria-hidden className="min-h-[150px] sm:min-h-[320px]" />
        </div>
      </div>
    </section>
  );
}
