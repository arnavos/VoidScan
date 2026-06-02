import { useState } from "react";
import { Search, Globe, MapPin, Server, FileSearch, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultPanel } from "@/components/result-panel";

import {
  useReconWhois,
  useReconDns,
  useReconReverseDns,
  useReconSubdomains,
  useReconAsn,
  useReconGeoip,
  useReconSsl,
  useReconHeaders,
  useReconTechDetect,
  useReconScreenshot
} from "@workspace/api-client-react";

export default function Recon() {
  const [whoisTarget, setWhoisTarget] = useState("");
  const whois = useReconWhois();

  const [dnsTarget, setDnsTarget] = useState("");
  const dns = useReconDns();

  const [revDnsTarget, setRevDnsTarget] = useState("");
  const revDns = useReconReverseDns();

  const [subdomainTarget, setSubdomainTarget] = useState("");
  const subdomains = useReconSubdomains();

  const [asnTarget, setAsnTarget] = useState("");
  const asn = useReconAsn();

  const [geoipTarget, setGeoipTarget] = useState("");
  const geoip = useReconGeoip();

  const [sslTarget, setSslTarget] = useState("");
  const ssl = useReconSsl();

  const [headersTarget, setHeadersTarget] = useState("");
  const headers = useReconHeaders();

  const [techTarget, setTechTarget] = useState("");
  const tech = useReconTechDetect();

  const [screenshotTarget, setScreenshotTarget] = useState("");
  const screenshot = useReconScreenshot();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2 flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" /> Reconnaissance
        </h1>
        <p className="text-muted-foreground text-sm">Gather intelligence on domains, IPs, and infrastructure.</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* WHOIS */}
        <AccordionItem value="whois" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span>WHOIS Lookup</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="whois-target">Domain or IP Address</Label>
                <Input 
                  id="whois-target" 
                  placeholder="example.com" 
                  value={whoisTarget}
                  onChange={(e) => setWhoisTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => whois.mutate({ data: { target: whoisTarget } })}
                disabled={!whoisTarget || whois.isPending}
              >
                Execute
              </Button>
            </div>
            <ResultPanel 
              isLoading={whois.isPending} 
              error={whois.data?.error || (whois.error as Error)?.message}
              data={whois.data}
              title="WHOIS Record"
            />
          </AccordionContent>
        </AccordionItem>

        {/* DNS */}
        <AccordionItem value="dns" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-muted-foreground" />
              <span>DNS Enumeration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="dns-target">Domain</Label>
                <Input 
                  id="dns-target" 
                  placeholder="example.com" 
                  value={dnsTarget}
                  onChange={(e) => setDnsTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => dns.mutate({ data: { target: dnsTarget } })}
                disabled={!dnsTarget || dns.isPending}
              >
                Execute
              </Button>
            </div>
            <ResultPanel 
              isLoading={dns.isPending} 
              error={dns.data?.error || (dns.error as Error)?.message}
              data={dns.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Subdomains */}
        <AccordionItem value="subdomains" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <span>Subdomain Discovery</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="subdomain-target">Domain</Label>
                <Input 
                  id="subdomain-target" 
                  placeholder="example.com" 
                  value={subdomainTarget}
                  onChange={(e) => setSubdomainTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => subdomains.mutate({ data: { target: subdomainTarget } })}
                disabled={!subdomainTarget || subdomains.isPending}
              >
                Execute
              </Button>
            </div>
            <ResultPanel 
              isLoading={subdomains.isPending} 
              error={subdomains.data?.error || (subdomains.error as Error)?.message}
              data={subdomains.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* IP Geolocation */}
        <AccordionItem value="geoip" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>IP Geolocation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="geoip-target">IP Address</Label>
                <Input 
                  id="geoip-target" 
                  placeholder="8.8.8.8" 
                  value={geoipTarget}
                  onChange={(e) => setGeoipTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => geoip.mutate({ data: { target: geoipTarget } })}
                disabled={!geoipTarget || geoip.isPending}
              >
                Execute
              </Button>
            </div>
            <ResultPanel 
              isLoading={geoip.isPending} 
              error={geoip.data?.error || (geoip.error as Error)?.message}
              data={geoip.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tech Detect */}
        <AccordionItem value="tech" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <FileSearch className="w-5 h-5 text-muted-foreground" />
              <span>Technology Detection</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="tech-target">URL</Label>
                <Input 
                  id="tech-target" 
                  placeholder="https://example.com" 
                  value={techTarget}
                  onChange={(e) => setTechTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => tech.mutate({ data: { target: techTarget } })}
                disabled={!techTarget || tech.isPending}
              >
                Execute
              </Button>
            </div>
            <ResultPanel 
              isLoading={tech.isPending} 
              error={tech.data?.error || (tech.error as Error)?.message}
              data={tech.data}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
