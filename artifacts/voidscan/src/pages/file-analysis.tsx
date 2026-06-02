import { useState, useRef } from "react";
import { FileCode2, Hash, Upload, FileText, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultPanel } from "@/components/result-panel";
import { fileToBase64 } from "@/lib/file-utils";

import {
  useFileHash,
  useFileMetadata,
  useFileEntropy,
  useFileMalwareHash,
  useFileYara,
} from "@workspace/api-client-react";

export default function FileAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hash = useFileHash();
  const metadata = useFileMetadata();
  const entropy = useFileEntropy();
  
  const [malwareHashTarget, setMalwareHashTarget] = useState("");
  const malwareHash = useFileMalwareHash();

  const [yaraRule, setYaraRule] = useState("");
  const yara = useFileYara();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      try {
        const b64 = await fileToBase64(selectedFile);
        setBase64Data(b64);
      } catch (err) {
        console.error("Failed to convert file to base64:", err);
      }
    }
  };

  const handleAction = (mutation: any, extraData: any = {}) => {
    if (!file || !base64Data) return;
    mutation.mutate({
      data: {
        filename: file.name,
        data: base64Data,
        ...extraData
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2 flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-primary" /> File Analysis
        </h1>
        <p className="text-muted-foreground text-sm">Analyze files, extract metadata, calculate entropy, and scan for malware.</p>
      </div>

      <Card className="bg-card border-border mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="global-file">Target File</Label>
              <Input 
                id="global-file" 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="font-mono text-xs mt-2"
              />
            </div>
            {file && (
              <div className="px-4 py-2 mt-6 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
                LOADED: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Hashes */}
        <AccordionItem value="hash" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <span>Generate Hashes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="mb-4">
              <Button 
                onClick={() => handleAction(hash)}
                disabled={!file || !base64Data || hash.isPending}
              >
                Generate SHA256 / MD5
              </Button>
            </div>
            <ResultPanel 
              isLoading={hash.isPending} 
              error={hash.data?.error || (hash.error as Error)?.message}
              data={hash.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Metadata */}
        <AccordionItem value="metadata" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span>Extract Metadata</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="mb-4">
              <Button 
                onClick={() => handleAction(metadata)}
                disabled={!file || !base64Data || metadata.isPending}
              >
                Extract EXIF / Properties
              </Button>
            </div>
            <ResultPanel 
              isLoading={metadata.isPending} 
              error={metadata.data?.error || (metadata.error as Error)?.message}
              data={metadata.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* YARA */}
        <AccordionItem value="yara" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <span>YARA Rule Scanner</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yara-rule">YARA Rule Text</Label>
                <Textarea 
                  id="yara-rule" 
                  placeholder="rule ExampleRule { ... }" 
                  value={yaraRule}
                  onChange={(e) => setYaraRule(e.target.value)}
                  className="font-mono min-h-[150px]"
                />
              </div>
              <Button 
                onClick={() => handleAction(yara, { rule: yaraRule })}
                disabled={!file || !base64Data || !yaraRule || yara.isPending}
              >
                Scan File
              </Button>
            </div>
            <ResultPanel 
              isLoading={yara.isPending} 
              error={yara.data?.error || (yara.error as Error)?.message}
              data={yara.data}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Malware Hash Lookup */}
        <AccordionItem value="malware-hash" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <span>Malware Hash Lookup</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="malware-hash-target">SHA256 / MD5 Hash</Label>
                <Input 
                  id="malware-hash-target" 
                  placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" 
                  value={malwareHashTarget}
                  onChange={(e) => setMalwareHashTarget(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={() => malwareHash.mutate({ data: { target: malwareHashTarget } })}
                disabled={!malwareHashTarget || malwareHash.isPending}
              >
                Check Hash
              </Button>
            </div>
            <ResultPanel 
              isLoading={malwareHash.isPending} 
              error={malwareHash.data?.error || (malwareHash.error as Error)?.message}
              data={malwareHash.data}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
