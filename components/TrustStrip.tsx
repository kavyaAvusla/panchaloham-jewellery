import { LockIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

const BOXES = [
  {
    icon: ShieldIcon,
    title: "Premium Quality",
    line: "Carefully chosen panchaloham and imitation pieces.",
  },
  {
    icon: TruckIcon,
    title: "Delivery",
    line: "Delivery details: To be confirmed.",
  },
  {
    icon: LockIcon,
    title: "Secure Payment",
    line: "Payment details: To be confirmed.",
  },
  {
    icon: ReturnIcon,
    title: "Easy Returns",
    line: "Return details: To be confirmed.",
  },
];

export default function TrustStrip() {
  return (
    <section className="mx-auto -mt-2 max-w-6xl px-5">
      <div className="rounded-4xl border border-navy/10 bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOXES.map(({ icon: Icon, title, line }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lilac text-brand">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy/60">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
