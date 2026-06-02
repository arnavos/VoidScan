import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Search, FileCode2, KeyRound, Network, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useHealthCheck } from "@workspace/api-client-react";

export default function Dashboard() {
  const { data: health } = useHealthCheck();

  const stats = [
    { label: "Active Threats", value: "0", icon: AlertTriangle, color: "text-green-500" },
    { label: "Network Nodes", value: "24", icon: Network, color: "text-primary" },
    { label: "Files Analyzed", value: "1,024", icon: FileCode2, color: "text-primary" },
    { label: "System Status", value: health?.status || "Checking...", icon: Activity, color: "text-primary" },
  ];

  const modules = [
    { title: "Reconnaissance", desc: "Gather intelligence on domains and IPs", icon: Search, href: "/recon" },
    { title: "Threat Intel", desc: "Analyze URLs, domains, and IPs for malicious activity", icon: Shield, href: "/threat" },
    { title: "File Analysis", desc: "Extract metadata and scan files with YARA rules", icon: FileCode2, href: "/file" },
    { title: "Password Security", desc: "Generate and analyze passwords", icon: KeyRound, href: "/password" },
    { title: "Network Analysis", desc: "Scan ports and map network infrastructure", icon: Network, href: "/network" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2">SOC Dashboard</h1>
        <p className="text-muted-foreground text-sm">System overview and active operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold font-mono">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full bg-background border border-border ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold font-mono text-foreground mt-8 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" /> Active Modules
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, i) => (
          <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-foreground group-hover:text-primary transition-colors">
                  {mod.title}
                </CardTitle>
                <mod.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{mod.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 border border-border rounded-lg bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-muted-foreground font-bold">SYSTEM LOG</h3>
          <span className="text-xs text-primary animate-pulse">● LIVE</span>
        </div>
        <div className="terminal-panel h-48 overflow-y-auto space-y-1">
          <div className="flex gap-4"><span className="text-muted-foreground">10:42:01</span><span className="text-green-500">[INFO]</span><span>System initialized successfully</span></div>
          <div className="flex gap-4"><span className="text-muted-foreground">10:42:05</span><span className="text-green-500">[INFO]</span><span>Database connection established</span></div>
          <div className="flex gap-4"><span className="text-muted-foreground">10:42:15</span><span className="text-cyan-500">[SCAN]</span><span>Scheduled threat intelligence update running...</span></div>
          <div className="flex gap-4"><span className="text-muted-foreground">10:43:00</span><span className="text-green-500">[INFO]</span><span>API Gateway responsive</span></div>
          <div className="flex gap-4"><span className="text-muted-foreground">10:45:22</span><span className="text-cyan-500">[SCAN]</span><span>Background passive reconnaissance active</span></div>
        </div>
      </div>
    </div>
  );
}
