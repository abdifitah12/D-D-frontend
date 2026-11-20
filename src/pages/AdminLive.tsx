import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { getAdminToken } from "@/api/auth";
import LiveChat from "./LiveChat";

export default function AdminLive() {
  const [, setLocation] = useLocation();
  const token = getAdminToken();
  useEffect(() => { if (!token) setLocation("/admin/login"); }, [token, setLocation]);
  if (!token) return null;
  return <>
    <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pt-7 md:px-8">
      <h1 className="text-xl font-semibold text-primary">Admin live studio</h1>
      <Link href="/admin/events" className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm text-primary">Back to admin</Link>
    </div>
    <LiveChat admin />
  </>;
}
