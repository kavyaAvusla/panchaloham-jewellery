import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl text-navy">Panchaloham</p>
          <p className="mt-2 text-sm text-navy/60">
            Beautiful panchaloham and imitation jewellery for every festival and every day.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-navy/70">
            <li><Link href="/" className="hover:text-brand">Home</Link></li>
            <li><Link href="/shop" className="hover:text-brand">Shop</Link></li>
            <li><Link href="/collections" className="hover:text-brand">Collections</Link></li>
            <li><Link href="/about" className="hover:text-brand">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-brand">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-navy/70">
            <li>Address: To be confirmed</li>
            <li>Phone: To be confirmed</li>
            <li>WhatsApp: To be confirmed</li>
            <li>Shop timings: To be confirmed</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">Follow us</p>
          <div className="mt-3 flex gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy/60"
              title="Instagram link: To be confirmed"
            >
              <InstagramIcon />
            </span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy/60"
              title="WhatsApp number: To be confirmed"
            >
              <WhatsAppIcon />
            </span>
          </div>
          <p className="mt-3 text-xs text-navy/50">Social links: To be confirmed</p>
        </div>
      </div>

      <div className="temple-line" aria-hidden />
      <p className="py-4 text-center text-xs text-navy/50">
        &copy; Panchaloham Jewellery. Made with Tradition.
      </p>
    </footer>
  );
}
