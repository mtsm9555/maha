import { useState } from "react";
import MahaBootSequence from "./MahaBootSequence";
import MahaDashboard from "./MahaDashboard";

export default function MahaApp() {
  const [booted, setBooted] = useState(false);
  if (!booted) return <MahaBootSequence onComplete={() => setBooted(true)} />;
  return <MahaDashboard />;
}

