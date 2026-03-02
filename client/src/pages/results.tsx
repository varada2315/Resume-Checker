import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Zap, FileText, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data reflecting the new strict but improvement-oriented scoring model
const MOCK_DATA = {
  score: 72,
  breakdown: {
    requiredSkillMatch: 65,      // 30%
    responsibilityAlignment: 75,  // 20%
    experienceAlignment: 80,     // 20%
    keywordCoverage: 70,         // 15%
    quantifiedImpact: 60,        // 10%
    structureQuality: 85         // 5%
  },
  status: "Moderate", 
  verdict: "Moderate Match – Improvements Needed",
  deductions: [
    { 
      value: "-10%", 
      label: "Skill Gap", 
      detail: "Missing 'Cloud Architecture' knowledge.",
      requirement: {
        id: "REQ-001",
        sentence: "Design and implement scalable cloud architecture solutions using AWS or Azure.",
        category: "Skill Requirement",
        status: "Unmatched",
        evidence: "No mention of Cloud Architecture or specific CSPs (AWS/Azure) found in resume."
      }
    },
    { 
      value: "-8%", 
      label: "Experience Alignment", 
      detail: "Detected ~5.5 years, JD requires 7+.",
      requirement: {
        id: "REQ-002",
        sentence: "Minimum of 7 years of experience in software engineering with a focus on distributed systems.",
        category: "Experience Requirement",
        status: "Partially Matched",
        evidence: "Resume lists total tenure of 5.5 years across all roles."
      }
    },
    { 
      value: "-5%", 
      label: "Keyword Coverage", 
      detail: "Low density of 'Scalability'.",
      requirement: {
        id: "REQ-003",
        sentence: "Proven track record of building high-concurrency systems with a focus on scalability.",
        category: "Tool/Technology Requirement",
        status: "Partially Matched",
        evidence: "Keyword 'Scalability' appears once, but lacks context of 'high-concurrency' systems."
      }
    }
  ],
  gaps: {
    structural: [
      { type: "Experience", message: "Senior level requires more demonstrated ownership of architectural decisions." },
      { type: "Skills", message: "Missing specific cloud infrastructure certifications mentioned in the JD." }
    ],
    tactical: [
      { type: "Keywords", message: "Increase frequency of role-specific verbs found in the JD requirements." },
      { type: "Impact", message: "Several bullet points lack quantified results (%, $, or time savings)." }
    ]
  },
  roadmap: {
    immediate: [
      "Explicitly mention 'Cloud Architecture' in the skills summary if relevant experience exists.",
      "Rephrase bullets to include high-frequency JD keywords: 'Scalability', 'Automation', 'CI/CD'."
    ],
    mediumTerm: [
      "Obtain the specific cloud certifications highlighted in the JD preferred skills.",
      "Document a case study of an end-to-end architectural project to prove seniority."
    ],
    longTerm: [
      "Transition into lead roles to bridge the 2-year seniority gap identified by the JD.",
      "Focus on cross-functional leadership as emphasized in the JD core responsibilities."
    ]
  },
  aiSuggestions: [
    {
      original: "Responsible for managing the team and project delivery.",
      improved: "Directed a cross-functional team of 8 to deliver architectural migrations, aligning with JD requirements for 'Scalability' and 'High Availability'.",
      reason: "Aligns with JD core responsibilities and uses specific high-impact keywords."
    },
    {
      original: "Worked on improving system performance.",
      improved: "Optimized distributed system latency by 25%, directly addressing the JD requirement for 'Performance Tuning' and 'Quantified Results'.",
      reason: "Adds quantified impact as requested by the scoring engine."
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
    if (val >= 65) return "text-amber-500";
    if (val >= 50) return "text-orange-500";
    return "text-destructive";
  };

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 absolute">
        <circle
          cx="112"
          cy="112"
          r="100"
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="112"
          cy="112"
          r="100"
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={100 * 2 * Math.PI}
          strokeDashoffset={100 * 2 * Math.PI - (progress / 100) * (100 * 2 * Math.PI)}
          className={`transition-all duration-1000 ease-out ${getColor(value)}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center z-10 flex flex-col items-center">
        <span className={`text-6xl font-black tracking-tighter ${getColor(value)}`}>
          {progress}
        </span>
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Match Score</span>
      </div>
    </div>
  );
};

const DeductionItem = ({ d }: { d: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-100 overflow-hidden group hover:border-primary/20 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 text-left w-full"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-slate-900">{d.label}</p>
            <Badge variant="outline" className="text-[8px] py-0 px-1 font-black uppercase tracking-tighter h-3.5 border-slate-200 text-slate-400">
              {d.requirement.category}
            </Badge>
          </div>
          <p className="text-[10px] text-slate-500 line-clamp-1">{d.detail}</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className="text-sm font-black text-destructive">{d.value}</span>
          {isOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white p-3 space-y-3"
          >
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                <FileText className="w-2.5 h-2.5" /> JD Requirement
              </span>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                "{d.requirement.sentence}"
              </p>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Info className="w-2.5 h-2.5" /> Resume Match Status
              </span>
              <div className="flex items-center gap-2">
                <Badge 
                  className={`text-[9px] font-bold px-1.5 py-0 ${
                    d.requirement.status === "Unmatched" ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"
                  }`}
                >
                  {d.requirement.status}
                </Badge>
                <p className="text-[11px] text-slate-600 font-medium">{d.requirement.evidence}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { Logo } from "@/components/Logo";

export default function Results() {
  const [, setLocation] = useLocation();

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 65) return "bg-amber-100 text-amber-800 border-amber-200";
    if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getMood = () => {
    if (MOCK_DATA.score >= 80) return "confident";
    if (MOCK_DATA.score >= 65) return "neutral";
    return "concerned";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary/10">
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-lg font-black tracking-tight text-slate-900">Optosaur</span>
            </div>
          </div>
          <Button variant="default" size="sm" onClick={() => setLocation("/")} className="rounded-full shadow-lg shadow-primary/20">
            Analyze New Resume
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Analysis Report</h1>
            <p className="text-slate-500 mt-1">Strict, improvement-oriented evaluation for high-stakes roles.</p>
          </div>
          <Badge variant="outline" className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusColor(MOCK_DATA.score)}`}>
            {MOCK_DATA.verdict}
          </Badge>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4"
          >
            <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute top-6 left-6 opacity-10">
                <Logo className="w-20 h-20 text-primary" mood={getMood()} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Strict Evaluation</h2>
              <CircularProgress value={MOCK_DATA.score} />
              <div className="mt-10 w-full space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">JD Evidence & Deductions</p>
                  <Badge variant="secondary" className="text-[9px] h-4">Transparency Mode</Badge>
                </div>
                {MOCK_DATA.deductions.map((d, i) => (
                  <DeductionItem key={i} d={d} />
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-6"
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <Target className="w-5 h-5 text-primary" />
                  JD-Centric Scoring Logic
                </CardTitle>
                <CardDescription className="text-slate-500">Pure JD-to-Resume alignment (Domain Agnostic)</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-12 gap-y-6 py-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Required Skill Match (30%)</span>
                      <span className={MOCK_DATA.breakdown.requiredSkillMatch < 70 ? "text-destructive" : ""}>{MOCK_DATA.breakdown.requiredSkillMatch}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.requiredSkillMatch} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Responsibility Alignment (20%)</span>
                      <span>{MOCK_DATA.breakdown.responsibilityAlignment}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.responsibilityAlignment} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Experience Alignment (20%)</span>
                      <span>{MOCK_DATA.breakdown.experienceAlignment}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.experienceAlignment} className="h-2 bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Keyword Coverage (15%)</span>
                      <span>{MOCK_DATA.breakdown.keywordCoverage}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.keywordCoverage} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Quantified Impact (10%)</span>
                      <span className={MOCK_DATA.breakdown.quantifiedImpact < 70 ? "text-destructive" : "text-emerald-600"}>{MOCK_DATA.breakdown.quantifiedImpact}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.quantifiedImpact} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>Structure Quality (5%)</span>
                      <span className="text-emerald-600">{MOCK_DATA.breakdown.structureQuality}%</span>
                    </div>
                    <Progress value={MOCK_DATA.breakdown.structureQuality} className="h-2 bg-slate-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Structural Gaps
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Requires significant effort/tenure</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {MOCK_DATA.gaps.structural.map((gap, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-destructive uppercase tracking-tighter block">{gap.type}</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{gap.message}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Tactical Gaps
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Fixable via resume refinement</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {MOCK_DATA.gaps.tactical.map((gap, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter block">{gap.type}</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{gap.message}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Improvement Roadmap
                </CardTitle>
                <CardDescription className="text-slate-500">Actionable steps to bridge the identified gaps honestly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-slate-200" /> Immediate Fixes (Resume Edits)
                  </h4>
                  <ul className="space-y-3">
                    {MOCK_DATA.roadmap.immediate.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-primary/20 transition-all">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-slate-200" /> Medium-Term Skill Additions
                  </h4>
                  <ul className="space-y-3">
                    {MOCK_DATA.roadmap.mediumTerm.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/50">
                        <Target className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-slate-200" /> Long-Term Positioning
                  </h4>
                  <ul className="space-y-3">
                    {MOCK_DATA.roadmap.longTerm.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start bg-purple-50/30 p-3 rounded-xl border border-purple-100/50">
                        <Zap className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary-foreground/50" />
                  Bullet Optimization
                </CardTitle>
                <CardDescription className="text-slate-400">Strictly JD-aligned refinements</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {MOCK_DATA.aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="space-y-4 group">
                    <div className="relative">
                      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Found Weakness</span>
                      <p className="text-sm text-slate-500 italic leading-relaxed">"{suggestion.original}"</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm relative group-hover:shadow-md transition-all">
                      <div className="absolute -right-1 -top-1">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 block">Optimized (JD Context)</span>
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">{suggestion.improved}</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Rationale: {suggestion.reason}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest leading-loose">
                    Evaluation completed by Optosaur Engine v2.0<br/>
                    Strict Alignment Model: Improvement Oriented
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
