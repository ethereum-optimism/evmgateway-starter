import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ThemeProvider } from "styled-components";
import { Heading, ThorinGlobalStyles, lightTheme } from "@ensdomains/thorin";
import { L1Panel } from "./components/L1Panel";
import { L2Panel } from "./components/L2Panel";

import "./App.css";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <ThemeProvider theme={lightTheme}>
      <ThorinGlobalStyles />
      <div
        style={{
          padding: 20,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Heading>OP Goerli Passport using EVMGateway</Heading>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ConnectButton />
        </div>
        {isConnected && (
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: 20,
            }}
          >
            <L1Panel />
            <L2Panel />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
