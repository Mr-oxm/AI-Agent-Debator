import { Brain, Loader2, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebateAgentProps {
  name: string;
  position: "For" | "Against";
  color: "blue" | "purple";
  rounds: { 
    message: string; 
    isThinking: boolean; 
    freind?: string;
    roundNumber?: number; // Add optional roundNumber property
  }[];
  isAgentA: boolean;
  currentRound: number;
  hasHelp?: boolean;
}

export function DebateAgent({ name, position, color, rounds, isAgentA, currentRound, hasHelp=false }: DebateAgentProps) {
  
  return (
    <div className={`flex flex-col space-y-4`}>
      <div className="flex items-center space-x-2">
        <div className={`${isAgentA? "bg-blue-900/70": "bg-rose-900/70"} p-2 rounded-full`}>
          <Brain className={`h-6 w-6`} />
        </div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <Badge variant="secondary">{position}</Badge>
        {hasHelp && (
          <div className="flex items-center ml-2 bg-amber-500/20 px-2 py-1 rounded-full">
            <Users className="h-4 w-4 text-amber-400 mr-1" />
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="text-xs font-medium text-amber-300 ml-1">Friend Assist</span>
          </div>
        )}
      </div>

      <ScrollArea className={`h-[400px] rounded-md border p-4 bg-background/50 backdrop-blur-sm`}>
        {rounds.map((round, idx) => (
          <div key={`${name.toLowerCase()}-${idx}`} className="mb-4">
            <div className="flex items-start space-x-2 mb-2">
              {/* <Badge variant="outline" className="mt-1">
                Round {round.roundNumber || (idx + 1)}
              </Badge> */}
              <Card className={`border-primary/20 ${isAgentA? "bg-blue-900/70": "bg-rose-900/70"} w-full shadow-sm`}>
                <CardContent>
                  {round.isThinking ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    round.message
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Friend message bubble */}
            {(round.freind && hasHelp) && (
              <div className="flex items-start space-x-2 mb-2 pl-8 mt-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-amber-400" />
                  <Sparkles className="h-3 w-3 text-amber-300" />
                </div>
                <Card className={`border-primary/20 bg-amber-500/20 w-full shadow-sm`}>
                  <CardContent className="text-sm text-amber-100">
                    {round.freind}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}