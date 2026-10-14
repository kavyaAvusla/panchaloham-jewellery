"use client";

import { useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { compressImage, uploadPath } from "@/lib/image";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  label?: string;
  hint?: string;
};

export default function PhotoUploader({
  value,
  onChange,
  bucket = "product-photos",
  label = "Photos",
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    const sb = getSupabase();
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      return;
    }

    setBusy(true);
    setError(undefined);
    setProgress({ done: 0, total: list.length });

    const added: string[] = [];
    for (let i = 0; i < list.length; i++) {
      try {
        const blob = await compressImage(list[i]);
        const path = uploadPath("jpg");
        const { error: upErr } = await sb.client.storage
          .from(bucket)
          .upload(path, blob, { contentType: "image/jpeg" });
        if (upErr) throw new Error(upErr.message);
        const { data } = sb.client.storage.from(bucket).getPublicUrl(path);
        added.push(data.publicUrl);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      }
      setProgress({ done: i + 1, total: list.length });
    }

    if (added.length) onChange([...value, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="text-sm font-medium text-navy">{label}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-2 rounded-2xl border-2 border-dashed p-4 text-center transition ${
          dragOver ? "border-brand bg-lilac/60" : "border-navy/20 bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
          {busy ? `Uploading ${progress.done}/${progress.total}...` : "Add photos"}
        </button>
        <p className="mt-2 text-xs text-navy/60">
          {hint ??
            "On a phone this opens your gallery or camera. On a laptop pick files or drag them here. You can choose many at once."}
        </p>
      </div>

      {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-xl border border-navy/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((u) => u !== url))}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-navy shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
