"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { uploadImageFile } from "@/lib/upload";
import type { Category, Product } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StateMessage from "@/components/ui/StateMessage";
import PhotoUploader from "@/components/admin/PhotoUploader";

type SingleForm = {
  id?: string;
  name: string;
  code: string;
  categoryId: string;
  price: string;
  stock: string;
  details: string;
  photos: string[];
  isHidden: boolean;
  isBestSeller: boolean;
};

const EMPTY: SingleForm = {
  name: "",
  code: "",
  categoryId: "",
  price: "",
  stock: "",
  details: "",
  photos: [],
  isHidden: false,
  isBestSeller: false,
};

type BulkRow = {
  key: string;
  file: File;
  preview: string;
  name: string;
  code: string;
  price: string;
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  const [mode, setMode] = useState<"list" | "single" | "bulk">("list");
  const [form, setForm] = useState<SingleForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const [rows, setRows] = useState<BulkRow[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string>();
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (sb.state === "missing") {
      setMissing(sb.setting);
      setStatus("missing");
      return;
    }
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      setStatus("error");
      return;
    }

    const [cats, prods] = await Promise.all([
      sb.client.from("categories").select("*").order("sort_order", { ascending: true }),
      sb.client.from("products").select("*").order("created_at", { ascending: false }),
    ]);

    if (cats.error || prods.error) {
      setError((cats.error || prods.error)?.message);
      setStatus("error");
      return;
    }
    setCategories((cats.data as Category[]) ?? []);
    setProducts((prods.data as Product[]) ?? []);
    setStatus("ok");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---------------- single product ----------------
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setSaveError("Supabase is not configured.");
      return;
    }
    if (!form.name.trim() || !form.code.trim()) {
      setSaveError("Please add a name and a jewellery code.");
      return;
    }

    setSaving(true);
    setSaveError(undefined);
    setNotice(undefined);

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      category_id: form.categoryId || null,
      price: form.price.trim() === "" ? null : Number(form.price),
      stock: form.stock.trim() === "" ? 0 : Number(form.stock),
      description: form.details.trim() === "" ? null : form.details.trim(),
      photo_urls: form.photos,
      is_hidden: form.isHidden,
      is_best_seller: form.isBestSeller,
    };

    const res = form.id
      ? await sb.client.from("products").update(payload).eq("id", form.id)
      : await sb.client.from("products").insert(payload);

    if (res.error) {
      setSaving(false);
      setSaveError(res.error.message);
      return;
    }

    await load();
    setSaving(false);
    setMode("list");
    setForm(EMPTY);
    setNotice("Product saved");
  }

  function edit(p: Product) {
    setNotice(undefined);
    setSaveError(undefined);
    setForm({
      id: p.id,
      name: p.name,
      code: p.code,
      categoryId: p.category_id ?? "",
      price: p.price === null || p.price === undefined ? "" : String(p.price),
      stock: p.stock === null || p.stock === undefined ? "" : String(p.stock),
      details: p.description ?? "",
      photos: p.photo_urls ?? [],
      isHidden: p.is_hidden,
      isBestSeller: p.is_best_seller === true,
    });
    setMode("single");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleHidden(p: Product) {
    const sb = getSupabase();
    if (sb.state !== "ok") return;
    const res = await sb.client.from("products").update({ is_hidden: !p.is_hidden }).eq("id", p.id);
    if (res.error) {
      setNotice(undefined);
      setSaveError(res.error.message);
      return;
    }
    await load();
    setNotice(p.is_hidden ? "Product is now visible" : "Product hidden");
  }

  // ---------------- many products ----------------
  function addBulkFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    const next: BulkRow[] = list.map((f) => ({
      key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file: f,
      preview: URL.createObjectURL(f),
      name: "",
      code: "",
      price: "",
    }));
    setRows((prev) => [...prev, ...next]);
    if (bulkInputRef.current) bulkInputRef.current.value = "";
  }

  async function saveBulk() {
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setBulkMessage("Supabase is not configured.");
      return;
    }
    const valid = rows.filter((r) => r.name.trim() !== "" && r.code.trim() !== "");
    if (valid.length === 0) {
      setBulkMessage("Add a name and a code for at least one product.");
      return;
    }

    setBulkSaving(true);
    setBulkMessage(`Saving ${valid.length} product(s)...`);

    let ok = 0;
    const failures: string[] = [];
    for (const r of valid) {
      try {
        const url = await uploadImageFile(r.file);
        const res = await sb.client.from("products").insert({
          name: r.name.trim(),
          code: r.code.trim(),
          category_id: bulkCategory || null,
          price: r.price.trim() === "" ? null : Number(r.price),
          stock: 0,
          description: null,
          photo_urls: [url],
          is_hidden: false,
          is_best_seller: false,
        });
        if (res.error) throw new Error(res.error.message);
        ok++;
      } catch (e) {
        failures.push(`${r.code || r.name}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    rows.forEach((r) => URL.revokeObjectURL(r.preview));
    setRows([]);
    await load();
    setBulkSaving(false);
    setBulkMessage(
      `${ok} product(s) saved.${failures.length ? " Failed: " + failures.join("; ") : ""}`
    );
  }

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "No category";

  const inputClass =
    "mt-1 w-full rounded-xl border border-navy/15 px-3 py-3 text-base outline-none focus:border-brand";
  const labelClass = "text-sm font-medium text-navy/70";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-navy sm:text-3xl">Products</h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => {
              setNotice(undefined);
              setSaveError(undefined);
              setForm(EMPTY);
              setMode(mode === "single" ? "list" : "single");
            }}
            className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:flex-none"
          >
            Add product
          </button>
          <button
            onClick={() => {
              setNotice(undefined);
              setBulkMessage(undefined);
              setMode(mode === "bulk" ? "list" : "bulk");
            }}
            className="flex-1 rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-lilac sm:flex-none"
          >
            Add many products
          </button>
        </div>
      </div>

      {status === "missing" && <div className="mt-6"><StateMessage kind="missing" setting={missing} /></div>}
      {status === "error" && <div className="mt-6"><StateMessage kind="error" message={error} /></div>}

      {notice && (
        <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {notice}
        </div>
      )}

      {/* ---------------- single product form ---------------- */}
      {mode === "single" && (
        <form onSubmit={save} className="mt-6 rounded-3xl border border-navy/10 bg-white p-5 sm:p-6">
          <p className="font-serif text-lg text-navy">{form.id ? "Edit product" : "New product"}</p>

          <div className="mt-4">
            <PhotoUploader
              value={form.photos}
              onChange={(photos) => setForm((f) => ({ ...f, photos }))}
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pure Panchaloham Ear Tops"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Jewellery code
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. PET012"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Category
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={inputClass}
              >
                <option value="">— choose a category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Price in ₹ (leave blank if not decided)
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 400"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="e.g. 6"
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Details
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                rows={3}
                placeholder="Short description, size, material…"
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-navy/70">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={form.isHidden}
                onChange={(e) => setForm({ ...form, isHidden: e.target.checked })}
              />
              Hide from customers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
              />
              Show in Best Sellers
            </label>
          </div>

          {saveError && <p className="mt-4 text-sm text-rose-700">{saveError}</p>}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : "Save product"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("list");
                setSaveError(undefined);
              }}
              className="w-full rounded-full border border-navy/20 px-8 py-3.5 text-sm text-navy sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ---------------- many products ---------------- */}
      {mode === "bulk" && (
        <div className="mt-6 rounded-3xl border border-navy/10 bg-white p-5 sm:p-6">
          <p className="font-serif text-lg text-navy">Add many products</p>
          <p className="mt-1 text-sm text-navy/60">
            Choose many photos at once. Then type a name, code and price for each one.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Category for all of these
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className={inputClass}
              >
                <option value="">— choose a category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addBulkFiles(e.target.files);
              }}
            />
            <button
              type="button"
              onClick={() => bulkInputRef.current?.click()}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              Add photos
            </button>
          </div>

          {rows.length > 0 && (
            <div className="mt-5 space-y-3">
              {rows.map((r, idx) => (
                <div
                  key={r.key}
                  className="flex flex-wrap items-start gap-3 rounded-2xl border border-navy/10 p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.preview}
                    alt={`Photo ${idx + 1}`}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="grid min-w-[220px] flex-1 gap-2 sm:grid-cols-3">
                    <input
                      value={r.name}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) => (x.key === r.key ? { ...x, name: e.target.value } : x))
                        )
                      }
                      placeholder="Name"
                      className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                    <input
                      value={r.code}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) => (x.key === r.key ? { ...x, code: e.target.value } : x))
                        )
                      }
                      placeholder="Code"
                      className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={r.price}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) => (x.key === r.key ? { ...x, price: e.target.value } : x))
                        )
                      }
                      placeholder="Price ₹ (optional)"
                      className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(r.preview);
                      setRows((prev) => prev.filter((x) => x.key !== r.key));
                    }}
                    className="rounded-full border border-navy/20 px-4 py-2 text-xs text-navy"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {bulkMessage && <p className="mt-4 text-sm text-navy/70">{bulkMessage}</p>}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={saveBulk}
              disabled={bulkSaving || rows.length === 0}
              className="w-full rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              {bulkSaving ? "Saving..." : `Save ${rows.length} product(s)`}
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="w-full rounded-full border border-navy/20 px-8 py-3.5 text-sm text-navy sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------------- product list ---------------- */}
      {status === "ok" && products.length === 0 && (
        <div className="mt-6"><StateMessage kind="empty" title="No products yet" /></div>
      )}

      {status === "ok" && products.length > 0 && (
        <div className="mt-6 space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-navy/10 bg-white p-3"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-navy/10">
                <PlaceholderImage src={p.photo_urls?.[0] ?? null} alt={p.name} label={p.name} />
              </div>

              <div className="min-w-[160px] flex-1">
                <p className="font-medium text-navy">{p.name}</p>
                <p className="text-xs text-navy/50">
                  {p.code} · {catName(p.category_id)} · {formatPrice(p.price)} · Stock {p.stock ?? 0}
                </p>
                {p.is_hidden && (
                  <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-[11px] text-navy/60">
                    Hidden
                  </span>
                )}
                {p.is_best_seller && (
                  <span className="ml-2 mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[11px] text-brand">
                    Best seller
                  </span>
                )}
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  onClick={() => edit(p)}
                  className="flex-1 rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy hover:border-brand hover:text-brand sm:flex-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleHidden(p)}
                  className="flex-1 rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy hover:border-brand hover:text-brand sm:flex-none"
                >
                  {p.is_hidden ? "Show" : "Hide"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
