import Link from "next/link";

type Props = { title: string; note?: string };

export default function ComingSoon({ title, note }: Props) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-brand">Coming soon</p>
      <h1 className="mt-4 font-serif text-4xl text-navy sm:text-5xl">{title}</h1>
      <div className="mt-5 flex items-center gap-3" aria-hidden>
        <span className="h-px w-12 bg-brand/40" />
        <span className="diamond" />
        <span className="h-px w-12 bg-brand/40" />
      </div>
      <p className="mt-6 max-w-md text-base text-navy/70">
        {note ?? "This page is being built. Please check back soon."}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Back to Home
      </Link>
    </section>
  );
}
