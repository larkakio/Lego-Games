"use client";

import { useState } from "react";
import { base } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { getBuilderDataSuffix } from "@/lib/builder-suffix";
import { checkInAbi } from "@/lib/check-in-abi";

const ZERO = "0x0000000000000000000000000000000000000000";

function contractAddress(): `0x${string}` | null {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw?.startsWith("0x") || raw.length !== 42) {
    return null;
  }
  if (raw.toLowerCase() === ZERO.toLowerCase()) {
    return null;
  }
  return raw as `0x${string}`;
}

export function WalletSection() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const { connect, isPending: connecting } = useConnect();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const { writeContractAsync, isPending: writing } = useWriteContract();

  const addr = contractAddress();
  const onBase = chainId === base.id;
  const wrongNetwork = isConnected && !onBase;

  async function ensureBase() {
    if (chainId !== base.id) {
      await switchChainAsync({ chainId: base.id });
    }
  }

  async function handleCheckIn() {
    if (!addr) {
      return;
    }
    await ensureBase();
    const suffix = getBuilderDataSuffix();
    await writeContractAsync({
      address: addr,
      abi: checkInAbi,
      functionName: "checkIn",
      chainId: base.id,
      ...(suffix ? { dataSuffix: suffix } : {}),
    });
  }

  const busy = connecting || switching || writing;

  return (
    <section className="mt-10 w-full max-w-md rounded-lg border border-cyan-500/20 bg-[#070a12]/90 p-4 shadow-[0_0_30px_rgba(0,240,255,0.06)]">
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm tracking-[0.25em] text-cyan-200/90">
        ON-CHAIN
      </h2>

      {wrongNetwork && (
        <div className="mb-3 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          <span className="block">Wrong network — switch to Base for check-in.</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => switchChainAsync({ chainId: base.id })}
            className="mt-2 rounded border border-amber-400/50 px-2 py-1 text-[11px] font-mono uppercase text-amber-100"
          >
            Switch to Base
          </button>
        </div>
      )}

      {!isConnected ? (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="w-full rounded border border-fuchsia-500/50 bg-fuchsia-500/10 py-3 text-sm font-semibold tracking-wide text-fuchsia-100"
        >
          Connect wallet
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="break-all font-mono text-[11px] text-slate-400">
            {address}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!addr || busy}
              onClick={() => void handleCheckIn()}
              className="rounded border border-lime-400/50 bg-lime-500/10 px-3 py-2 text-xs font-semibold text-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Processing…" : "Daily check-in"}
            </button>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded border border-slate-600 px-3 py-2 text-xs text-slate-400"
            >
              Disconnect
            </button>
          </div>
          {!addr && (
            <p className="text-[10px] text-slate-500">
              Set NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS after deploy.
            </p>
          )}
        </div>
      )}

      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Wallet connectors"
        >
          <div className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-cyan-500/30 bg-[#0a0d14] p-4 md:rounded-2xl">
            <div className="mb-3 flex justify-between">
              <span className="text-sm font-semibold text-cyan-200">
                Choose wallet
              </span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="text-slate-500"
              >
                Close
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {connectors.map((c) => (
                <li key={c.uid}>
                  <button
                    type="button"
                    disabled={connecting}
                    onClick={() => {
                      connect({ connector: c });
                      setSheetOpen(false);
                    }}
                    className="w-full rounded border border-slate-700 py-3 text-left text-sm text-slate-200 hover:border-cyan-500/40"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
