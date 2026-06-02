import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResultPanelProps {
  isLoading?: boolean;
  error?: string | null;
  data?: any;
  title?: string;
  render?: (data: any) => React.ReactNode;
}

export function ResultPanel({ isLoading, error, data, title = "Results", render }: ResultPanelProps) {
  if (!isLoading && !error && !data) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{title}</h4>
      
      {isLoading && (
        <div className="flex items-center justify-center p-8 border border-border rounded bg-card">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-3 font-mono text-sm text-muted-foreground">PROCESSING...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && data && (
        <div className="terminal-panel">
          {render ? render(data) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-primary/80">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
