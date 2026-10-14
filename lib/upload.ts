import { getSupabase } from "@/lib/supabase/client";
import { compressImage, uploadPath } from "@/lib/image";

/** Compress a photo and upload it to Supabase Storage, returning its public URL. */
export async function uploadImageFile(file: File, bucket = "product-photos"): Promise<string> {
  const sb = getSupabase();
  if (sb.state !== "ok") throw new Error("Supabase is not configured.");

  const blob = await compressImage(file);
  const path = uploadPath("jpg");
  const { error } = await sb.client.storage.from(bucket).upload(path, blob, {
    contentType: "image/jpeg",
  });
  if (error) throw new Error(error.message);

  const { data } = sb.client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
