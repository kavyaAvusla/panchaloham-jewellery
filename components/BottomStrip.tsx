import NewsletterForm from "@/components/NewsletterForm";
import { InstagramIcon } from "@/components/ui/Icons";

export default function BottomStrip() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid gap-8 rounded-4xl bg-lilac p-7 sm:p-10 lg:grid-cols-3 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand/80">Our promise</p>
          <p className="mt-2 font-serif text-2xl text-navy sm:text-3xl">Made with Tradition</p>
          <p className="mt-2 text-sm text-navy/70">
            Panchaloham and imitation jewellery for every festival and every day.
          </p>
        </div>

        <div className="lg:justify-self-center">
          <p className="text-xs uppercase tracking-[0.25em] text-brand/80">Instagram</p>
          <span
            className="mt-2 inline-flex cursor-default items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy"
            title="Instagram link: To be confirmed"
          >
            <InstagramIcon className="h-4 w-4 text-brand" />
            Follow Us
          </span>
          <p className="mt-2 text-xs text-navy/60">Instagram link: To be confirmed</p>
        </div>

        <div className="lg:justify-self-end">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
