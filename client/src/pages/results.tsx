import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Zap, FileText, ChevronDown, ChevronUp, Info, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";

// Mock Data reflecting the Diagnostic Improvement Guidance model
const MOCK_DATA = {
  score: 72,
  shortlistProbability: 64,
  confidenceScore: 84,
  confidenceLabel: "High Reliability",
  confidenceBreakdown: {
    jdParsing: 18,
    resumeParsing: 17,
    keywordMapping: 12,
    experienceCertainty: 13,
    structuralStrength: 8,
    validationIntegrity: 16
  },
  confidenceGaps: [
    { component: "JD Parsing", score: 18, max: 20, detail: "Core skills and responsibilities successfully extracted." },
    { component: "Resume Parsing", score: 17, max: 20, detail: "Clear bullet structure detected." },
    { component: "Keyword Mapping", score: 12, max: 15, detail: "80% of identified JD requirements mapped." }
  ],
  breakdown: {
    requiredSkillMatch: 65,
    responsibilityAlignment: 75,
    experienceAlignment: 80,
    keywordCoverage: 70,
    quantifiedImpact: 60,
    structureQuality: 85
  },
  status: "Moderate", 
  verdict: "Moderate Match – Improvements Needed",
  deductions: [
    { 
      value: "Structural Gap", 
      label: "Cloud Architecture", 
      detail: "This is a structural gap and cannot be resolved through wording changes alone.",
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
        sentence: "Minimum of 7 years of experience in software engineering.",
        category: "Experience Requirement",
        status: "Partially Matched",
        evidence: "Resume lists total tenure of 5.5 years across all roles."
      }
    }
  ],
  gaps: {
    structural: [
      { type: "Experience", message: "This is a structural gap and cannot be resolved through wording changes alone." },
      { type: "Skills", message: "Missing specific cloud infrastructure certifications mentioned in the JD. This is a structural gap." }
    ],
    tactical: [
      { 
        original: "Responsible for managing the team and project delivery.",
        explanation: "Weak alignment with 'Scalability' and 'High Availability' requirements. Missing specific method and measurable outcome.",
        requirement: "Directing cross-functional teams for architectural migrations.",
        template: "Action Verb + Specific Context + Method + Measurable Outcome + JD Alignment",
        placeholder: "Directed [Team/Project] to [Action] using [Method] resulting in [Add measurable outcome if applicable] aligning with [JD Requirement]."
      },
      { 
        original: "Worked on improving system performance.",
        explanation: "Lacks clarity on 'Performance Tuning' and 'Quantified Results' requested in JD.",
        requirement: "Optimizing distributed system latency.",
        template: "Action Verb + Specific Context + Method + Measurable Outcome + JD Alignment",
        placeholder: "Optimized [System/Component] performance by [Add measurable outcome if applicable] through [Method] to meet [JD Requirement]."
      }
    ]
  }
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

  const getProbColor = (val: number) => {
    if (val >= 75) return "text-emerald-500";
    if (val >= 60) return "text-amber-500";
    if (val >= 40) return "text-orange-500";
    return "text-destructive";
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-2xl mx-auto">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute">
          <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
          <circle
            cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={86 * 2 * Math.PI}
            strokeDashoffset={86 * 2 * Math.PI - (progress / 100) * (86 * 2 * Math.PI)}
            className={`transition-all duration-1000 ease-out ${getColor(value)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10 flex flex-col items-center">
          <span className={`text-5xl font-black tracking-tighter ${getColor(value)}`}>{progress}%</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Match Score</span>
        </div>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute">
          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/20" />
          <circle
            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
            strokeDasharray={70 * 2 * Math.PI}
            strokeDashoffset={70 * 2 * Math.PI - (MOCK_DATA.shortlistProbability / 100) * (70 * 2 * Math.PI)}
            className={`transition-all duration-1000 delay-300 ease-out ${getProbColor(MOCK_DATA.shortlistProbability)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10 flex flex-col items-center">
          <span className={`text-4xl font-black tracking-tighter ${getProbColor(MOCK_DATA.shortlistProbability)}`}>{MOCK_DATA.shortlistProbability}%</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Shortlist Prob.</span>
        </div>
      </div>
    </div>
  );
};

const DeductionItem = ({ d }: { d: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-100 overflow-hidden group hover:border-primary/20 transition-all">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-3 text-left w-full">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-slate-900">{d.label}</p>
            <Badge variant="outline" className="text-[8px] py-0 px-1 font-black uppercase tracking-tighter h-3.5 border-slate-200 text-slate-400">{d.requirement.category}</Badge>
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
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 bg-white p-3 space-y-3">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1"><FileText className="w-2.5 h-2.5" /> JD Requirement</span>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed italic">"{d.requirement.sentence}"</p>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Info className="w-2.5 h-2.5" /> Resume Match Status</span>
              <div className="flex items-center gap-2">
                <Badge className={`text-[9px] font-bold px-1.5 py-0 ${d.requirement.status === "Unmatched" ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>{d.requirement.status}</Badge>
                <p className="text-[11px] text-slate-600 font-medium">{d.requirement.evidence}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConfidenceBreakdownItem = ({ gap }: { gap: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-lg border border-slate-100 overflow-hidden bg-white/50">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-2 text-left w-full hover:bg-slate-50 transition-colors">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{gap.component}</span>
            <span className="text-[10px] font-black text-slate-900">{gap.score}/{gap.max}</span>
          </div>
          <Progress value={(gap.score / gap.max) * 100} className="h-1 bg-slate-100" />
        </div>
        <div className="ml-2">{isOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}</div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-2 pb-2">
            <p className="text-[9px] text-slate-500 leading-tight italic border-t border-slate-50 pt-1.5">{gap.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Results() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/10 bg-[radial-gradient(circle_at_top_right,_var(--secondary)_0%,_transparent_25%),radial-gradient(circle_at_bottom_left,_var(--secondary)_0%,_transparent_25%)]">
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="rounded-full hover:bg-orange-50 text-primary"><ArrowLeft className="w-5 h-5" /></Button>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-lg font-black tracking-tight text-primary">Optosaur</span>
            </div>
          </div>
          <Button variant="default" size="sm" onClick={() => setLocation("/")} className="rounded-full shadow-lg shadow-primary/20">Analyze New Resume</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary">Analysis Report</h1>
            <p className="text-slate-500 mt-1">Diagnostic-first evaluation for professional credibility.</p>
          </div>
          <Badge variant="outline" className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-primary/10 text-primary border-primary/20`}>{MOCK_DATA.verdict}</Badge>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-4">
            <Card className="h-full border-none shadow-xl shadow-orange-200/20 bg-white relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute top-6 left-6 opacity-20"><Logo className="w-20 h-20" /></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">V4 Prediction Engine</h2>
              <CircularProgress value={MOCK_DATA.score} />
              <div className="mt-6 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</span></div>
                  <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-primary transition-colors" /></TooltipTrigger><TooltipContent className="max-w-[200px] text-[10px] leading-relaxed p-3">Evaluation accuracy confidence.</TooltipContent></Tooltip></TooltipProvider>
                </div>
                <div className="flex items-end justify-between mb-2"><span className="text-2xl font-black text-slate-900 leading-none">{MOCK_DATA.confidenceScore}%</span><Badge variant="secondary" className="text-[9px] h-4 font-bold bg-white border-slate-200">{MOCK_DATA.confidenceLabel}</Badge></div>
                <Progress value={MOCK_DATA.confidenceScore} className="h-1 bg-slate-200" />
                <div className="mt-4 space-y-2">{MOCK_DATA.confidenceGaps.map((gap, i) => (<ConfidenceBreakdownItem key={i} gap={gap} />))}</div>
              </div>
              <div className="mt-10 w-full space-y-3">
                <div className="flex items-center justify-between mb-1"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortlist Logic & Penalties</p><Badge variant="secondary" className="text-[9px] h-4">Decision Mode</Badge></div>
                <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 text-[11px] text-red-700 leading-relaxed"><p className="font-bold flex items-center gap-1.5 mb-1"><AlertTriangle className="w-3 h-3" /> Shortlist Probability Capped</p>1 mandatory requirement missing → Capped at 65%.</div>
                {MOCK_DATA.deductions.map((d, i) => (<DeductionItem key={i} d={d} />))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-xl shadow-orange-200/20 bg-white overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-primary/20 to-secondary/40" />
              <CardHeader className="pb-2"><CardTitle className="text-xl font-bold flex items-center gap-2 text-primary"><FileText className="w-5 h-5" />Requirement Mapping Table</CardTitle><CardDescription className="text-slate-500">Atomic decomposition of JD requirements matched against resume evidence.</CardDescription></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-y border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr><th className="px-6 py-3">JD Requirement</th><th className="px-6 py-3">Resume Evidence</th><th className="px-6 py-3">Match</th><th className="px-6 py-3">Gap</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { req: "Design scalable cloud architecture using AWS/Azure", evidence: "Not explicitly found", strength: "No Match", gap: "Technical", color: "text-red-500" },
                        { req: "7+ years of Software Engineering experience", evidence: "5.5 years across 3 roles", strength: "Moderate", gap: "Seniority", color: "text-amber-500" },
                        { req: "High-concurrency systems & scalability", evidence: "Optimized distributed systems", strength: "Strong", gap: "None", color: "text-emerald-500" },
                        { req: "CI/CD and Automation proficiency", evidence: "Implemented Jenkins pipelines", strength: "Strong", gap: "None", color: "text-emerald-500" }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-700 max-w-xs">{item.req}</td>
                          <td className="px-6 py-4 text-slate-500 italic">"{item.evidence}"</td>
                          <td className={`px-6 py-4 font-bold ${item.color}`}>{item.strength}</td>
                          <td className="px-6 py-4"><Badge variant="outline" className="text-[10px]">{item.gap}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-orange-200/20 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary"><Sparkles className="w-5 h-5" />Improvement Guidance</CardTitle>
                <CardDescription className="text-slate-500">Diagnostic analysis and structured templates for resume strengthening.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 py-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-destructive" />Structural Gaps</h3>
                  <div className="grid gap-3">
                    {MOCK_DATA.gaps.structural.map((gap, i) => (
                      <div key={i} className="p-4 rounded-xl bg-red-50 border border-red-100">
                        <div className="flex items-center gap-2 mb-1"><Badge variant="destructive" className="text-[10px] uppercase">{gap.type}</Badge></div>
                        <p className="text-sm text-red-700 font-medium">{gap.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Tactical Improvements & Strengthening Templates</h3>
                  <div className="space-y-6">
                    {MOCK_DATA.gaps.tactical.map((item, i) => (
                      <div key={i} className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Bullet</span><p className="text-sm text-slate-600 italic">"{item.original}"</p></div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Analysis</span><p className="text-xs text-slate-700 leading-relaxed">{item.explanation}</p></div>
                          <div className="space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">JD Alignment Goal</span><p className="text-xs text-slate-700 leading-relaxed">{item.requirement}</p></div>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-black text-primary uppercase tracking-widest">Improvement Template</span><Badge variant="outline" className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Honest Guidance Mode</Badge></div>
                          <div className="p-3 bg-white border border-primary/20 rounded-lg"><code className="text-[11px] text-primary font-bold block mb-1">{item.template}</code><p className="text-xs text-slate-500 font-medium italic">{item.placeholder}</p></div>
                          <p className="mt-2 text-[10px] text-slate-400 italic">* Do not invent metrics or tools. Only include details that reflect your actual experience.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-orange-200/20 bg-white">
              <CardHeader className="pb-2"><CardTitle className="text-xl font-bold flex items-center gap-2 text-primary"><Target className="w-5 h-5" />JD-Centric Scoring Logic</CardTitle><CardDescription className="text-slate-500">Pure JD-to-Resume alignment (Domain Agnostic)</CardDescription></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-12 gap-y-6 py-6">
                <div className="space-y-5">
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Required Skill Match (30%)</span><span className={MOCK_DATA.breakdown.requiredSkillMatch < 70 ? "text-destructive" : ""}>{MOCK_DATA.breakdown.requiredSkillMatch}%</span></div><Progress value={MOCK_DATA.breakdown.requiredSkillMatch} className="h-2 bg-slate-100" /></div>
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Responsibility Alignment (20%)</span><span>{MOCK_DATA.breakdown.responsibilityAlignment}%</span></div><Progress value={MOCK_DATA.breakdown.responsibilityAlignment} className="h-2 bg-slate-100" /></div>
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Experience Alignment (20%)</span><span>{MOCK_DATA.breakdown.experienceAlignment}%</span></div><Progress value={MOCK_DATA.breakdown.experienceAlignment} className="h-2 bg-slate-100" /></div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Keyword Coverage (15%)</span><span>{MOCK_DATA.breakdown.keywordCoverage}%</span></div><Progress value={MOCK_DATA.breakdown.keywordCoverage} className="h-2 bg-slate-100" /></div>
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Quantified Impact (10%)</span><span className="text-amber-500">{MOCK_DATA.breakdown.quantifiedImpact}%</span></div><Progress value={MOCK_DATA.breakdown.quantifiedImpact} className="h-2 bg-slate-100" /></div>
                  <div className="space-y-2"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Structure Quality (5%)</span><span>{MOCK_DATA.breakdown.structureQuality}%</span></div><Progress value={MOCK_DATA.breakdown.structureQuality} className="h-2 bg-slate-100" /></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}