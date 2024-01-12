import { ControlPanel, KeyboardView } from "./components";

export const InstrumentsView = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "fit-content",
        alignItems: "center",
        gap: 48,
        // justifyContent: "space-evenly", TODO: Put this in media query for large screens when refactoring inline styles here
      }}
    >
      <KeyboardView />
      <ControlPanel />
    </div>
  );
};
