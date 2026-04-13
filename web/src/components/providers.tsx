"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { config } from "@/wagmi/config";

type ProvidersProps = {
  children: ReactNode;
  cookies: string | null;
};

export function Providers({ children, cookies }: ProvidersProps) {
  const initialState = cookieToInitialState(config, cookies ?? undefined);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000 },
        },
      }),
  );

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
