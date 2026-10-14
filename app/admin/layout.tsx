"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import StateMessage from "@/components/ui/StateMessage";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const [state, setState] = useState<"checking" | "ok" | "denied" | "missing" | "error">("checking");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isLogin) return;
    const sb = getSupabase();
    if (sb.state === "missing") {
      setMissing(sb.setting);
      setState("missing");
      return;
    }
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      setState("error");
      return;
    }

    let active = true;
    (async () => {
      const {
        data: { user },
      } = await sb.client.auth.getUser();
      if (!active) return;
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      const { data, error: err } = await sb.client
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (err) {
        setError(err.message);
        setState("error");
        return;
      }
      setState(data?.role === "admin" ? "ok" : "denied");
    })();

    return () => {
      active = false;
    };
  }, [isLogin, pathname, router]);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb.state === "ok") await sb.client.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  if (isLogin) return <>{children}</>;

  if (state !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        {state === "checking" && <p className="text-sm text-navy/60">Checking access...</p>}
        {state === "missing" && <StateMessage kind="missing" setting={missing} />}
        {state === "error" && <StateMessage kind="error" message={error} />}
        {state === "denied" && (
          <div className="rounded-4xl border border-rose-300 bg-rose-50 p-6 text-sm">
            <p className="font-semibold text-rose-900">You are not an admin</p>
            <p className="mt-1 text-rose-800">This account does not have admin access.</p>
            <button
              onClick={signOut}
              className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  const link = (href: string, label: string) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={`rounded-full px-4 py-1.5 text-sm ${
          active ? "bg-brand text-white" : "text-navy/70 hover:bg-lilac hover:text-navy"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <span className="font-serif text-lg text-navy">Admin</span>
          <nav className="flex flex-wrap items-center gap-1">
            {link("/admin", "Dashboard")}
            {link("/admin/products", "Products")}
            {link("/admin/orders", "Orders")}
          </nav>
          <button
            onClick={signOut}
            className="ml-auto rounded-full border border-navy/20 px-4 py-1.5 text-sm text-navy transition hover:border-brand hover:text-brand"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}
