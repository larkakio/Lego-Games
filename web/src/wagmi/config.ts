import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount, injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  baseAccount({
    appName: "Neon Brick Grid",
  }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
        }),
      ]
    : []),
];

export const config = createConfig({
  chains: [base, mainnet],
  connectors,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
