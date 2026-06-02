import { useState } from "react";
import { Network as NetIcon, RadioReceiver, Activity, Route as RouteIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultPanel } from "@/components/result-panel";

import {
  useNetworkPortScan,
  useNetworkPing,
  useNetworkTraceroute,
  useNetworkMapper
} from "@workspace/api-client-react";

export default function Network() {
  const [scanTarget, setScanTarget] = useState("");
  const [scanPorts, setScanPorts] = useState("1-1024");
  const portScan = useNetworkPortScan();

  const [pingTarget, setPingTarget] = useState("");
  const ping = useNetworkPing();

  const [traceTarget, setTraceTarget] = useState("");
  const traceroute = useNetworkTraceroute();

  const [mapTarget, setMapTarget] = useState("");
  const networkMap = useNetworkMapper();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2 flex items-center gap-2">
          <NetIcon className="w-6 h-6 text-primary" /> Network Analysis
        </h1>
        <p className="text-muted-foreground text-sm">Scan ports, map infrastructure, and trace routes.</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Port Scanner */}
        <AccordionItem value="ports" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <RadioReceiver className="w-5 h-5 text-muted-foreground" />
              <span>Port Scanner</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="scan-target">Target IP or Domain</Label>
                <Input 
                  id="scan-target" 
                  placeholder="example.com" 
                  value={scanTarget}
                  onChange={(e) => setScanTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="w-32 space-y-2">
                <Label htmlFor="scan-ports">Port Range</Label>
                <Input 
                  id="scan-ports" 
                  placeholder="1-1024" 
                  value={scanPorts}
                  onChange={(e) => setScanPorts(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => portScan.mutate({ data: { target: scanTarget, portRange: scanPorts } })}
                disabled={!scanTarget || portScan.isPending}
              >
                Scan
              </Button>
            </div>
            <ResultPanel 
              isLoading={portScan.isPending} 
              error={portScan.data?.error || (portScan.error as Error)?.message}
              data={portScan.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Ping Sweeper */}
        <AccordionItem value="ping" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <span>Ping Sweeper</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="ping-target">Target IP or Domain</Label>
                <Input 
                  id="ping-target" 
                  placeholder="8.8.8.8" 
                  value={pingTarget}
                  onChange={(e) => setPingTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => ping.mutate({ data: { target: pingTarget } })}
                disabled={!pingTarget || ping.isPending}
              >
                Ping
              </Button>
            </div>
            <ResultPanel 
              isLoading={ping.isPending} 
              error={ping.data?.error || (ping.error as Error)?.message}
              data={ping.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Traceroute */}
        <AccordionItem value="trace" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <RouteIcon className="w-5 h-5 text-muted-foreground" />
              <span>Traceroute</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="trace-target">Target IP or Domain</Label>
                <Input 
                  id="trace-target" 
                  placeholder="example.com" 
                  value={traceTarget}
                  onChange={(e) => setTraceTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => traceroute.mutate({ data: { target: traceTarget } })}
                disabled={!traceTarget || traceroute.isPending}
              >
                Trace
              </Button>
            </div>
            <ResultPanel 
              isLoading={traceroute.isPending} 
              error={traceroute.data?.error || (traceroute.error as Error)?.message}
              data={traceroute.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Network Mapper */}
        <AccordionItem value="map" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <NetIcon className="w-5 h-5 text-muted-foreground" />
              <span>Network Mapper (Full Recon)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="map-target">Target Domain</Label>
                <Input 
                  id="map-target" 
                  placeholder="example.com" 
                  value={mapTarget}
                  onChange={(e) => setMapTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => networkMap.mutate({ data: { target: mapTarget } })}
                disabled={!mapTarget || networkMap.isPending}
                variant="secondary"
              >
                Full Map
              </Button>
            </div>
            <ResultPanel 
              isLoading={networkMap.isPending} 
              error={networkMap.data?.error || (networkMap.error as Error)?.message}
              data={networkMap.data}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
