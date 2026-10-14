type Props = {
  kind: "missing" | "error" | "empty";
  setting?: string;
  message?: string;
  title?: string;
  description?: string;
  className?: string;
};

/**
 * Three distinct screen states so they never look like the same blank page:
 *  - missing: an environment setting is not set (we name it)
 *  - error:   the Supabase call failed (we show the message)
 *  - empty:   the table has no rows yet
 */
export default function StateMessage({ kind, setting, message, title, description, className = "" }: Props) {
  if (kind === "missing") {
    return (
      <div className={`rounded-4xl border border-amber-300 bg-amber-50 p-6 text-sm ${className}`}>
        <p className="font-semibold text-amber-900">Setting missing</p>
        <p className="mt-1 text-amber-800">
          The setting <code className="rounded bg-amber-100 px-1 py-0.5">{setting}</code> is not
          set. Add it to <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code> and
          restart the app.
        </p>
      </div>
    );
  }

  if (kind === "error") {
    return (
      <div className={`rounded-4xl border border-rose-300 bg-rose-50 p-6 text-sm ${className}`}>
        <p className="font-semibold text-rose-900">Could not reach Supabase</p>
        <p className="mt-1 text-rose-800">
          {message ?? "The call failed. Check your network and the Supabase settings."}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-4xl border border-navy/10 bg-white p-6 text-sm ${className}`}>
      <p className="font-semibold text-navy">{title ?? "Nothing here yet"}</p>
      <p className="mt-1 text-navy/60">
        {description ?? "The table is empty. Add rows in Supabase and refresh this page."}
      </p>
    </div>
  );
}
