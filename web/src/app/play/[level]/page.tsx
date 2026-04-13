import { GameBoard } from "@/components/GameBoard";
import { LevelGate } from "@/components/LevelGate";
import { getLevel } from "@/game/levels";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ level: string }>;
};

export default async function PlayLevelPage({ params }: PageProps) {
  const { level: levelParam } = await params;
  const id = parseInt(levelParam, 10);
  if (!Number.isFinite(id)) {
    notFound();
  }
  const level = getLevel(id);
  if (!level) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center px-4 pb-16 pt-8">
      <nav className="mb-6 flex w-full items-center justify-between text-xs font-mono">
        <Link href="/" className="text-cyan-500/80 hover:text-cyan-300">
          Home
        </Link>
        <Link href="/levels" className="text-fuchsia-500/80 hover:text-fuchsia-300">
          Levels
        </Link>
      </nav>
      <LevelGate levelId={id}>
        <GameBoard level={level} />
      </LevelGate>
    </main>
  );
}
