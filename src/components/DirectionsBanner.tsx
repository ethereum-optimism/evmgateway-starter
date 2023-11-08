import { Banner, Typography } from "@ensdomains/thorin";

const StepItem = ({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: 4 }}>
      <div>{step}.</div>
      <div>{children}</div>
    </div>
  );
};

export const DirectionsBanner = () => {
  return (
    <Banner
      style={{
        width: 640,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Typography weight="bold" fontVariant="large">
          Steps
        </Typography>
        <StepItem step={1}>
          Mint an <b>L1PassportNFT</b> on Goerli
        </StepItem>

        <StepItem step={2}>
          Mint some <b>L2TestNFT</b> and <b>L2TestCoin</b> on OP Goerli
        </StepItem>
        <StepItem step={3}>
          Wait for the OP Goerli blocks with your transactions to be available
          on Goerli
        </StepItem>
        <StepItem step={4}>
          Watch your <b>L1PassportNFT</b> dynamically update with your latest L2
          balances
        </StepItem>
      </div>
    </Banner>
  );
};
