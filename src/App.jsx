import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import UseBootSequence from "./hooks/UseBootSequence";

export default function App() {
  const { phase, renderedLines } = UseBootSequence();

  if (phase === "done") {
    return <Desktop />;
  }

  return <BootScreen phase={phase} renderedLines={renderedLines} />;
}