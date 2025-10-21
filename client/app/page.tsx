"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Scale, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { DebateAgent } from "@/components/debate/DebateAgent"
import { DebateVerdict } from "@/components/debate/DebateVerdict"
import { AgentState } from "@/types/debate"
import { startDebate, getDebateRound, getTotalRounds, resetDebateState } from "@/services/debateService"
import { Label } from "@/components/ui/label"

export default function DebatePage() {
  const [proposition, setProposition] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRoundLoading, setIsRoundLoading] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [conMessage, setConMessage] = useState("")
  const [proMessage, setProMessage] = useState("")
  const [judgeMessage, setJudgeMessage] = useState("")
  const [verdict, setVerdict] = useState<string | null>(null)
  
  // Create arrays to store all rounds for each agent
  const [conRounds, setConRounds] = useState<{ message: string; isThinking: boolean }[]>([])
  const [proRounds, setProRounds] = useState<{ message: string; isThinking: boolean }[]>([])

  const handleStartDebate = async () => {
    if (!proposition.trim()) return

    setIsLoading(true)
    try {
      const result = await startDebate(proposition)
      setTotalRounds(result.total_rounds)
      setCurrentRound(1)
      
      // Reset rounds arrays
      setConRounds([])
      setProRounds([])
      
      // Load the first round
      await loadRound(1)
    } catch (error) {
      console.error("Error starting debate:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Modify the loadRound function to only keep the current round
  const loadRound = async (roundNum: number) => {
    setIsRoundLoading(true)
    try {
      const roundData = await getDebateRound(roundNum)
      setConMessage(roundData.con)
      setProMessage(roundData.pro)
      setJudgeMessage(roundData.judge)
      
      // Create single-item arrays with just the current round
      // Add the round number as a property to display correctly
      const currentConRound = [{ 
        message: roundData.con, 
        isThinking: false,
        roundNumber: roundNum // Add round number
      }]
      const currentProRound = [{ 
        message: roundData.pro, 
        isThinking: false,
        roundNumber: roundNum // Add round number
      }]
      
      setConRounds(currentConRound)
      setProRounds(currentProRound)
      
      if (roundData.verdict) {
        setVerdict(roundData.verdict)
      }
    } catch (error) {
      console.error("Error loading round:", error)
    } finally {
      setIsRoundLoading(false)
    }
  }

  const handleNextRound = async () => {
    if (currentRound < totalRounds) {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      await loadRound(nextRound)
    }
  }

  const handlePreviousRound = async () => {
    if (currentRound > 1) {
      const prevRound = currentRound - 1
      setCurrentRound(prevRound)
      await loadRound(prevRound)
    }
  }

  const resetDebate = () => {
    setProposition("")
    setCurrentRound(0)
    setTotalRounds(0)
    setConMessage("")
    setProMessage("")
    setJudgeMessage("")
    setVerdict(null)
    setConRounds([])
    setProRounds([])
    resetDebateState()
  }

  const isDebating = totalRounds > 0

  return (
    <div className="min-h-screen bg-[url('https://asset.gecdesigns.com/img/background-templates/abstract-navy-red-background-design-sr17012401-1705501852665-cover.webp')] bg-cover">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex flex-col space-y-8">
          {/* Header with Judge */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="bg-indigo-800 p-4 rounded-full shadow-lg">
                <Scale className="h-12 w-12 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-foreground">AI Debate Judge</h1>
            {isDebating && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Round {currentRound} of {totalRounds}
              </Badge>
            )}
          </div>

          {/* Proposition Input */}
          <div className="flex space-x-4">
            <Input
              placeholder="Enter debate proposition (e.g., 'Should doping be allowed in sports?')"
              value={proposition}
              onChange={(e) => setProposition(e.target.value)}
              disabled={isLoading || isDebating}
              className="flex-1 backdrop-blur-sm"
            />
            {!isDebating ? (
              <Button onClick={handleStartDebate} disabled={!proposition.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Debate...
                  </>
                ) : (
                  "Start Debate"
                )}
              </Button>
            ) : (
              <Button onClick={resetDebate}>
                Reset
              </Button>
            )}
          </div>

          {/* Debate Arena */}
          {isDebating && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent A (CON) */}
                <DebateAgent
                  name="Agent A"
                  position="Against"
                  color="blue"
                  rounds={conRounds}
                  isAgentA={true}
                  currentRound={currentRound}
                />

                {/* Agent B (PRO) */}
                <DebateAgent
                  name="Agent B"
                  position="For"
                  color="purple"
                  rounds={proRounds}
                  isAgentA={false}
                  currentRound={currentRound}
                />
              </div>

              {/* Judge's Commentary using DebateVerdict with markdown support */}
              {judgeMessage && (
                <div className="mt-6">
                  {verdict && currentRound === totalRounds && (
                    <Label className="text-4xl p-4">Final Verdict</Label>
                  )}
                  <DebateVerdict 
                    verdict={<div dangerouslySetInnerHTML={{ __html: markdownToHtml(judgeMessage) }} />} 
                    isLoading={isRoundLoading} 
                  />
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handlePreviousRound} 
                  disabled={currentRound <= 1 || isRoundLoading}
                  className="px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Round
                </Button>
                <Button 
                  onClick={handleNextRound} 
                  disabled={currentRound >= totalRounds || isRoundLoading}
                  className="px-6"
                >
                  Next Round
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {/* Final Verdict with markdown support */}
              {/* {verdict && currentRound === totalRounds && (
                <div className="mt-6">
                  <DebateVerdict 
                    verdict={<div dangerouslySetInnerHTML={{ __html: markdownToHtml(verdict) }} />} 
                    isLoading={false} 
                  />
                </div>
              )} */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Add a function to convert markdown to HTML
function markdownToHtml(markdown: string): string {
  // Basic markdown conversion for bold text
  let html = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br>');
  
  return html;
}