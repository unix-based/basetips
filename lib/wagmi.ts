import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_HTTP || process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(rpcUrl),
  },
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  multiInjectedProviderDiscovery: true,
});


