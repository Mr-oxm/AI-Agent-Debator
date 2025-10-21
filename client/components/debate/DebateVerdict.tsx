import { Trophy, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface DebateVerdictProps {
  verdict: string | ReactNode | null;
  isLoading: boolean;
}

export function DebateVerdict({ verdict, isLoading }: DebateVerdictProps) {
  if (!verdict && !isLoading) return null;
  
  return (
    <Card className="border-primary/20 bg-background/50 backdrop-blur-sm shadow-md">
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-800 p-2 rounded-full mt-1">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Judge's Verdict</h3>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deliberating...</span>
              </div>
            ) : (
              <div className="text-muted-foreground">
                {typeof verdict === 'string' ? verdict : verdict}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}