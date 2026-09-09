"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/fields";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <img src="/images/new-logo.png" alt="FSP" className="mx-auto h-14 w-auto" />
          <CardTitle className="mt-3 flex items-center justify-center gap-2">
            <Lock size={17} /> Admin FSP
          </CardTitle>
          <CardDescription>Kelola konten website company profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setError(null);
              const res = await adminLogin(new FormData(e.currentTarget));
              if (res?.error) {
                setError(res.error);
                setPending(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="u" className="mb-1.5 block text-[13px] font-semibold text-navy-900">Username</label>
              <Input id="u" name="username" required autoComplete="username" placeholder="admin" />
            </div>
            <div>
              <label htmlFor="p" className="mb-1.5 block text-[13px] font-semibold text-navy-900">Password</label>
              <Input id="p" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Memeriksa…" : "Masuk"}
            </Button>
            <p className="text-center text-xs text-slate-500">
              Default: admin / admin123 — ganti via env FSP_ADMIN_USER & FSP_ADMIN_PASSWORD
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
