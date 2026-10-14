export default function Proprietor() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[300px]">
          <div className="aspect-[9/16] w-full overflow-hidden rounded-4xl shadow-soft">
            {/* Second picture on the website: Meet the maker */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sravanthi.jpg"
              alt="Sravanthi, proprietor of Panchaloham Jewellery"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand">Meet the maker</p>
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Sravanthi</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-navy/70">
            Welcome to Panchaloham Jewellery. Every piece in our collection is chosen to bring
            tradition into your everyday moments and your festivals.
          </p>
          <p className="mt-3 text-sm text-navy/50">
            Sravanthi&apos;s full welcome note: To be confirmed.
          </p>
        </div>
      </div>
    </section>
  );
}
