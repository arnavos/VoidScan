import { useState } from "react";
import { Shield, AlertTriangle, Link as LinkIcon, Database, CheckCircle, XCircle, AlertOctagon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultPanel } from "@/components/result-panel";

import {
  useThreatUrlReputation,
  useThreatIpReputation,
  useThreatDomainReputation,
  useThreatPhishing,
  useThreatSuspiciousUrl,
  useThreatVirusTotal,
  useThreatAbuseIpdb,
  useThreatOpenPhish,
  useThreatBreach
} from "@workspace/api-client-react";

export default function Threat() {
  const [urlTarget, setUrlTarget] = useState("");
  const urlReputation = useThreatUrlReputation();

  const [ipTarget, setIpTarget] = useState("");
  const ipReputation = useThreatIpReputation();

  const [vtTarget, setVtTarget] = useState("");
  const virusTotal = useThreatVirusTotal();

  const [abuseTarget, setAbuseTarget] = useState("");
  const abuseIpdb = useThreatAbuseIpdb();

  const [breachTarget, setBreachTarget] = useState("");
  const breach = useThreatBreach();

  const renderReputationVerdict = (data: any) => {
    if (!data) return null;
    const isDangerous = data.score && data.score > 50 || data.verdict === 'malicious';
    const isSafe = data.score && data.score < 20 || data.verdict === 'clean';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 border border-border p-4 rounded bg-background/50">
          {isDangerous ? (
            <AlertOctagon className="w-10 h-10 text-destructive" />
          ) : isSafe ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          )}
          <div>
            <div className="font-mono text-xl uppercase font-bold tracking-widest text-foreground">
              {data.verdict || (isDangerous ? "High Risk" : isSafe ? "Low Risk" : "Suspicious")}
            </div>
            {data.score !== undefined && (
              <div className="text-muted-foreground font-mono text-sm">Risk Score: {data.score}/100</div>
            )}
          </div>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-xs text-primary/80 bg-background/50 p-4 rounded border border-border">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Threat Intelligence
        </h1>
        <p className="text-muted-foreground text-sm">Analyze URLs, IPs, and check for known breaches.</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* URL Reputation */}
        <AccordionItem value="url" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-muted-foreground" />
              <span>URL Reputation Checker</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="url-target">URL to Analyze</Label>
                <Input 
                  id="url-target" 
                  placeholder="https://suspicious-site.com" 
                  value={urlTarget}
                  onChange={(e) => setUrlTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => urlReputation.mutate({ data: { target: urlTarget } })}
                disabled={!urlTarget || urlReputation.isPending}
              >
                Analyze
              </Button>
            </div>
            <ResultPanel 
              isLoading={urlReputation.isPending} 
              error={urlReputation.data?.error || (urlReputation.error as Error)?.message}
              data={urlReputation.data}
              render={renderReputationVerdict}
            />
          </AccordionContent>
        </AccordionItem>

        {/* IP Reputation */}
        <AccordionItem value="ip" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              <span>IP Reputation & Abuse Checker</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="ip-target">IP Address</Label>
                <Input 
                  id="ip-target" 
                  placeholder="1.2.3.4" 
                  value={ipTarget}
                  onChange={(e) => setIpTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => abuseIpdb.mutate({ data: { target: ipTarget } })}
                disabled={!ipTarget || abuseIpdb.isPending}
              >
                Analyze
              </Button>
            </div>
            <ResultPanel 
              isLoading={abuseIpdb.isPending} 
              error={abuseIpdb.data?.error || (abuseIpdb.error as Error)?.message}
              data={abuseIpdb.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* VirusTotal */}
        <AccordionItem value="vt" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span>VirusTotal Integration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="vt-target">Domain, IP, or Hash</Label>
                <Input 
                  id="vt-target" 
                  placeholder="example.com" 
                  value={vtTarget}
                  onChange={(e) => setVtTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => virusTotal.mutate({ data: { target: vtTarget } })}
                disabled={!vtTarget || virusTotal.isPending}
              >
                Lookup
              </Button>
            </div>
            <ResultPanel 
              isLoading={virusTotal.isPending} 
              error={virusTotal.data?.error || (virusTotal.error as Error)?.message}
              data={virusTotal.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Data Breach */}
        <AccordionItem value="breach" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-muted-foreground" />
              <span>Known Data Breach Checker</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="breach-target">Email Address</Label>
                <Input 
                  id="breach-target" 
                  type="email"
                  placeholder="user@example.com" 
                  value={breachTarget}
                  onChange={(e) => setBreachTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => breach.mutate({ data: { target: breachTarget } })}
                disabled={!breachTarget || breach.isPending}
              >
                Check
              </Button>
            </div>
            <ResultPanel 
              isLoading={breach.isPending} 
              error={breach.data?.error || (breach.error as Error)?.message}
              data={breach.data}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
