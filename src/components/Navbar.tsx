import { Activity } from "lucide-react";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold text-foreground">
          Hemo<span className="text-gradient-primary">Scan</span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          v1.0 • AI Engine
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;
