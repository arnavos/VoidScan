import { useState, useEffect } from "react";
import { KeyRound, ShieldAlert, Zap, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultPanel } from "@/components/result-panel";

import {
  usePasswordStrength,
  usePasswordBreach,
  usePasswordGenerate,
} from "@workspace/api-client-react";

export default function Password() {
  const [passwordTarget, setPasswordTarget] = useState("");
  const strength = usePasswordStrength();
  const breach = usePasswordBreach();

  const [genLen, setGenLen] = useState([16]);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNum, setGenNum] = useState(true);
  const [genSym, setGenSym] = useState(true);
  
  const generate = usePasswordGenerate();

  // Debounced real-time strength check
  useEffect(() => {
    if (!passwordTarget) return;
    const timer = setTimeout(() => {
      strength.mutate({ data: { password: passwordTarget } });
    }, 500);
    return () => clearTimeout(timer);
  }, [passwordTarget]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground mb-2 flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-primary" /> Password Security
        </h1>
        <p className="text-muted-foreground text-sm">Analyze password strength, check for breaches, and generate secure keys.</p>
      </div>

      <Accordion type="single" collapsible defaultValue="strength" className="space-y-4">
        {/* Strength & Breach */}
        <AccordionItem value="strength" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-muted-foreground" />
              <span>Password Analyzer & Breach Check</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password-target">Password to Check</Label>
                <Input 
                  id="password-target" 
                  type="text"
                  placeholder="Enter password..." 
                  value={passwordTarget}
                  onChange={(e) => setPasswordTarget(e.target.value)}
                  className="font-mono text-lg tracking-widest"
                />
              </div>

              {strength.data && !strength.isPending && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>STRENGTH: <span className="text-primary font-bold">{strength.data.strength}</span></span>
                    <span>SCORE: {strength.data.score}/4</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        (strength.data.score || 0) < 2 ? 'bg-destructive' : 
                        (strength.data.score || 0) < 4 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${((strength.data.score || 0) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={() => breach.mutate({ data: { password: passwordTarget } })}
                  disabled={!passwordTarget || breach.isPending}
                  variant="secondary"
                  className="w-full font-mono"
                >
                  Check HaveIBeenPwned Database
                </Button>
                <ResultPanel 
                  isLoading={breach.isPending} 
                  error={breach.data?.error || (breach.error as Error)?.message}
                  data={breach.data}
                  title="Breach Results"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Generator */}
        <AccordionItem value="generator" className="bg-card border border-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-mono">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <span>Secure Password Generator</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Length: {genLen[0]}</Label>
                </div>
                <Slider 
                  value={genLen} 
                  onValueChange={setGenLen} 
                  max={64} 
                  min={8} 
                  step={1} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="upper" checked={genUpper} onCheckedChange={setGenUpper} />
                  <Label htmlFor="upper">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="lower" checked={genLower} onCheckedChange={setGenLower} />
                  <Label htmlFor="lower">Lowercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="num" checked={genNum} onCheckedChange={setGenNum} />
                  <Label htmlFor="num">Numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sym" checked={genSym} onCheckedChange={setGenSym} />
                  <Label htmlFor="sym">Symbols</Label>
                </div>
              </div>

              <Button 
                onClick={() => generate.mutate({ data: { 
                  length: genLen[0], 
                  includeUppercase: genUpper, 
                  includeLowercase: genLower, 
                  includeNumbers: genNum, 
                  includeSymbols: genSym 
                }})}
                disabled={generate.isPending}
                className="w-full font-mono"
              >
                Generate Password
              </Button>

              {generate.data?.password && (
                <div className="p-4 bg-background border border-border rounded flex items-center justify-between group">
                  <span className="font-mono text-lg text-primary tracking-wider break-all">
                    {generate.data.password}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigator.clipboard.writeText(generate.data.password!)}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </div>
              )}

            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
