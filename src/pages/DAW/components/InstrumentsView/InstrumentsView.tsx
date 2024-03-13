import { ControlPanel, KeyboardView } from "./components";

export const InstrumentsView = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%",
        gap: 10,
      }}
    >
      <KeyboardView />
      <ControlPanel />
    </div>
  );
};
