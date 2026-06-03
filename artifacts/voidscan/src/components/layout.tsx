import { Link, useLocation } from "wouter";
import { Shield, Activity, Search, FileCode2, KeyRound, Network } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Reconnaissance", href: "/recon", icon: Search },
  { name: "Threat Intel", href: "/threat", icon: Shield },
  { name: "File Analysis", href: "/file", icon: FileCode2 },
  { name: "Password Security", href: "/password", icon: KeyRound },
  { name: "Network Analysis", href: "/network", icon: Network },
];

const indiaTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [time, setTime] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const updateTime = () => {
      setTime(`${indiaTimeFormatter.format(new Date())} IST`);
    };

    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="scanline" />
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col z-10">
        <div className="h-20 p-4 border-b border-border flex items-center justify-center overflow-hidden">
          <img
            src="/logo.svg"
            alt="VOIDSCAN"
            className="h-full w-full object-contain"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(145%) contrast(250%)",
              transform: "scale(4)",
              transformOrigin: "center",
            }}
          />
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="text-xs font-mono text-muted-foreground">
            <div>STATUS: ONLINE</div>
            <div>UPTIME: 99.9%</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 overflow-hidden relative">
        <header className="h-14 border-b border-border bg-background/50 backdrop-blur-sm flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              VOIDSCAN SOC v1.0
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {time}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
