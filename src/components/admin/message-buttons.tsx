"use client";

import { useTransition } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { markMessage, deleteMessage } from "@/lib/actions";

export function MessageButtons({ id, read }: { id: string; read: boolean }) {
  const [pending, start] = useTransition();
  return (
    <span className="flex shrink-0 gap-1.5">
      <button
        disabled={pending}
        onClick={() => start(async () => {
          await markMessage(id, !read);
          toast(read ? "Ditandai belum dibaca." : "Ditandai sudah dibaca.", "success");
        })}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:bg-sand"
      >
        <CheckCheck size={13} /> {read ? "Belum dibaca" : "Tandai dibaca"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Hapus pesan ini?")) start(async () => {
            await deleteMessage(id);
            toast("Pesan dihapus.", "success");
          });
        }}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
      >
        <Trash2 size={13} />
      </button>
    </span>
  );
}
