import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock Data reflecting the new deterministic scoring logic
const MOCK_DATA = {
  score: 74,
  breakdown: {
    skillMatch: 82,
    experienceMatch: 65,
    keywordDensity: 70,
    quantifiedImpact: 40,
    structureCompliance: 90,
    semanticSimilarity: 72
  },
  status: "Borderline", 
  matchedKeywords: ["React", "TypeScript", "Node.js", "REST APIs", "Agile", "Frontend Architecture"],
  missingKeywords: ["GraphQL", "Docker", "AWS", "CI/CD", "Unit Testing"],
  missingHardSkills: ["Cloud Infrastructure (AWS/Azure)", "Containerization (Docker)", "Automated Testing"],
  quantifiedBullets: 1,
  formatIssues: [
    { type: "warning", message: "Low quantified impact: Only 1 bullet point contains measurable metrics (%, $, numbers)." },
    { type: "warning", message: "Experience Gap: Required 5+ years, detected ~3.5 years." },
    { type: "success", message: "ATS-friendly structure detected (Standard sections found)." }
  ],
  aiSuggestions: [
    {
      original: "Developed new features for the company website.",
      improved: "Engineered 5+ high-traffic frontend modules using React/TypeScript, improving Lighthouse performance scores by 30%.",
      reason: "Adds quantified impact and specific performance metrics as required by the new scoring engine."
    },
    {
      original: "Helped with backend APIs.",
      improved: "Architected RESTful Node.js endpoints serving 10k+ daily active users with 99.9% uptime.",
      reason: "Specifies scale and reliability metrics."
    }
  ]
};

const CircularProgress = ({ value }: { value: number }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (val: number) => {
    if (val >= 80) return "text-emerald-500";
    if (val >= 60) return "text-amber-500";
    return "text-destructive";
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 absolute">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={88 * 2 * Math.PI}
          strokeDashoffset={88 * 2 * Math.PI - (progress / 100) * (88 * 2 * Math.PI)}
          className={`transition-all duration-1000 ease-out ${getColor(value)}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center z-10 flex flex-col items-center">
        <span className={`text-5xl font-black tracking-tighter ${getColor(value)}`}>
          {progress}%
        </span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Final Score</span>
      </div>
    </div>
  );
};

import { Logo } from "@/components/Logo";

export default function Results() {
  const [, setLocation] = useLocation();

  const getStatusColor = (status: string) => {
    if (MOCK_DATA.score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (MOCK_DATA.score >= 60) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getVerdict = () => {
    if (MOCK_DATA.score >= 80) return "Highly Likely to be Shortlisted";
    if (MOCK_DATA.score >= 60) return "Borderline Match";
    return "Low Match – Improve Resume";
  };

  const getMood = () => {
    if (MOCK_DATA.score >= 80) return "confident";
    if (MOCK_DATA.score >= 60) return "neutral";
    return "concerned";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-lg font-bold tracking-tight">Optosaur</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
            Analyze New Resume
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <Card className="h-full glass-card border-none shadow-md relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute top-4 left-4">
                <Logo className="w-12 h-12 text-primary/20" mood={getMood()} />
              </div>
              <h2 className="text-lg font-semibold mb-6">Deterministic ATS Score</h2>
              <CircularProgress value={MOCK_DATA.score} />
              <div className="mt-8 w-full">
                <div className={`px-4 py-3 rounded-xl border font-bold text-sm inline-flex items-center gap-2 ${getStatusColor(MOCK_DATA.status)}`}>
                  {getVerdict()}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full glass-card border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Weighted Scoring Breakdown
                </CardTitle>
                <CardDescription>Based on deterministic analysis of skills, experience, and structure</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Skill Match (30%)</span>
                      <span className="font-bold">{MOCK_DATA.breakdown.skillMatch}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.skillMatch} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Experience Alignment (20%)</span>
                      <span className="font-bold">{MOCK_DATA.breakdown.experienceMatch}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.experienceMatch} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Keyword Density (15%)</span>
                      <span className="font-bold">{MOCK_DATA.breakdown.keywordDensity}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.keywordDensity} className="h-1.5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Quantified Impact (15%)</span>
                      <span className="font-bold text-destructive">{MOCK_DATA.breakdown.quantifiedImpact}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.quantifiedImpact} className="h-1.5 bg-destructive/10" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Structure Compliance (10%)</span>
                      <span className="font-bold">{MOCK_DATA.breakdown.structureCompliance}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.structureCompliance} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Semantic Similarity (10%)</span>
                      <span className="font-bold">{MOCK_DATA.breakdown.semanticSimilarity}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.semanticSimilarity} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Critical Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Missing Hard Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_DATA.missingHardSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-destructive border-destructive/30 bg-destructive/5 font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quantified Bullets</span>
                    <span className="font-bold text-destructive">{MOCK_DATA.quantifiedBullets} found</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Min. 2 recommended for high score</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Validation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_DATA.formatIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-white/50 border">
                      {issue.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                      <span>{issue.message}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full glass-card border-none shadow-md overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-primary/30 via-indigo-400/30 to-purple-400/30" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                  Evidence-Based AI Suggestions
                </CardTitle>
                <CardDescription>Generated based on structured skill gaps and missing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {MOCK_DATA.aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border shadow-sm group hover:shadow-md transition-all">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Context: {suggestion.reason}</span>
                      <p className="text-sm text-foreground/60 line-through decoration-destructive/20">{suggestion.original}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1 block">Optimized Bullet</span>
                      <p className="text-sm font-medium text-foreground">{suggestion.improved}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
