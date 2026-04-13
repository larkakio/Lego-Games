import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <p className="font-mono text-sm text-slate-500">Sector not found</p>
      <Link href="/" className="text-cyan-400 underline-offset-4 hover:underline">
        Home
      </Link>
    </main>
  );
}
