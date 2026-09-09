"use client";

import { useState, type ReactNode } from "react";
import { toast } from "@/components/ui/toast";

type ActionResult = { error?: string; ok?: boolean } | void;

/**
 * Pembungkus form admin: tampilkan toast hasil operasi,
 * dan reset seluruh field (termasuk upload foto) setelah sukses.
 */
export function CrudForm({
  action,
  children,
  className,
  success = "Berhasil disimpan.",
}: {
  action: (fd: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  success?: string;
}) {
  const [nonce, setNonce] = useState(0);

  return (
    <form
      key={nonce}
      className={className}
      action={async (fd: FormData) => {
        const res = await action(fd);
        if (res && "error" in res && res.error) {
          toast(res.error, "error");
        } else {
          toast(success, "success");
          setNonce((n) => n + 1);
        }
      }}
    >
      {children}
    </form>
  );
}
