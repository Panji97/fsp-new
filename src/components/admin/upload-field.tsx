"use client";

import { useRef, useState } from "react";
import { FileText, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function UploadField({
  name,
  defaultValue = "",
  required,
  accept = "image/jpeg,image/png,image/webp,image/avif,image/gif",
  emptyLabel = "Ketuk untuk unggah foto",
  hint = "JPG, PNG, WebP — maks 5MB",
  className,
}: {
  name: string;
  defaultValue?: string;
  required?: boolean;
  accept?: string;
  emptyLabel?: string;
  hint?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isPdf = url.toLowerCase().endsWith(".pdf");

  async function onFile(f: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error || "Gagal mengunggah.");
        toast(json.error || "Gagal mengunggah.", "error");
        return;
      }
      setUrl(json.url);
      toast("File terunggah.", "success");
    } catch {
      setErr("Gagal mengunggah. Periksa koneksi.");
    } finally {
      setBusy(false);
    }
  }

  const pick = () => fileRef.current?.click();

  return (
    <div className={className}>
      <input type="hidden" name={name} value={url} />
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
      {url ? (
        <div className="flex items-start gap-3">
          {isPdf ? (
            <span className="inline-flex max-w-[50%] items-center gap-2 rounded-lg border border-slate-200 bg-sand px-3 py-2 text-[13px] font-semibold text-navy-900">
              <FileText size={16} className="shrink-0 text-red-500" />
              <span className="line-clamp-1 break-all">
                {decodeURIComponent(url.split("/").pop() || "dokumen.pdf")}
              </span>
            </span>
          ) : (
            <img
              src={url}
              alt="Pratinjau"
              className="h-20 w-auto max-w-[50%] rounded-lg border border-slate-200 bg-sand object-contain p-1"
            />
          )}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={pick}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[13px] font-bold text-navy-900 transition hover:bg-sand disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {busy ? "Mengunggah…" : "Ganti"}
            </button>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={pick}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-sand/50 px-4 py-6 text-sm font-semibold text-slate-600 transition hover:border-brand-600 hover:text-brand-700 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <ImagePlus size={22} />
          )}
          {busy ? "Mengunggah…" : emptyLabel}
          <span className="text-xs font-normal text-slate-400">{hint}</span>
        </button>
      )}
      {required && !url && !busy && (
        <p className="mt-1.5 text-xs font-medium text-amber-600">
          Wajib: unggah dulu sebelum simpan.
        </p>
      )}
      {err && <p className="mt-1.5 text-xs font-medium text-red-600">{err}</p>}
    </div>
  );
}
