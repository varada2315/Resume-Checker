import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock Data
const MOCK_DATA = {
  score: 68,
  similarity: 72,
  status: "Borderline", // >80 Highly Likely, 60-80 Borderline, <60 Low Match
  matchedKeywords: ["React", "TypeScript", "Node.js", "API Design", "Agile"],
  missingKeywords: ["GraphQL", "Docker", "AWS", "CI/CD", "System Architecture", "Performance Optimization"],
  formatIssues: [
    { type: "warning", message: "Resume length is under 300 words. Consider adding more details to your experience." },
    { type: "error", message: "Could not detect an email address. Ensure your contact info is clearly visible." },
    { type: "success", message: "Standard sections (Experience, Education, Skills) found." }
  ],
  aiSuggestions: [
    {
      original: "Developed new features for the company website.",
      improved: "Engineered and deployed 5+ scalable frontend features using React and TypeScript, increasing user engagement by 22%.",
      reason: "Adds quantifiable metrics and specific technologies used."
    },
    {
      original: "Helped with backend APIs.",
      improved: "Collaborated in designing RESTful Node.js APIs, reducing response times by 15% across key endpoints.",
      reason: "Specifies the architecture style and impact."
    },
    {
      original: "Worked in a team.",
      improved: "Led Agile sprint planning for a cross-functional team of 6 engineers, ensuring 100% on-time delivery for Q3 deliverables.",
      reason: "Demonstrates leadership and specific methodology."
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

  const getGradient = (val: number) => {
    if (val >= 80) return "from-emerald-400 to-emerald-600";
    if (val >= 60) return "from-amber-400 to-amber-600";
    return "from-destructive to-red-600";
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Background circle */}
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
        {/* Progress circle */}
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={88 * 2 * Math.PI}
          strokeDashoffset={88 * 2 * Math.PI - (progress / 100) * (88 * 2 * Math.PI)}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" className={getColor(value)} />
            <stop offset="100%" stopColor="currentColor" className={getColor(value)} />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10 flex flex-col items-center">
        <span className={`text-5xl font-black tracking-tighter ${getColor(value)}`}>
          {progress}%
        </span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Match</span>
      </div>
    </div>
  );
};

export default function Results() {
  const [, setLocation] = useLocation();

  const getStatusColor = (status: string) => {
    if (status === "Highly Likely to be Shortlisted") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "Borderline") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">SmartATS</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
            Analyze New Resume
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Top Section: Score & Summary */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Score Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="h-full glass-card border-none shadow-md relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Target className="w-32 h-32" />
              </div>
              
              <h2 className="text-lg font-semibold mb-6">Overall ATS Compatibility</h2>
              
              <CircularProgress value={MOCK_DATA.score} />
              
              <div className="mt-8 w-full">
                <div className={`px-4 py-3 rounded-xl border font-medium text-sm inline-flex items-center gap-2 ${getStatusColor(MOCK_DATA.status)}`}>
                  {MOCK_DATA.score >= 80 ? <Sparkles className="w-4 h-4" /> : MOCK_DATA.score >= 60 ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {MOCK_DATA.status}
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between w-full px-4 pt-6 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Semantic Similarity</span>
                <span className="text-sm font-bold">{MOCK_DATA.similarity}%</span>
              </div>
            </Card>
          </motion.div>

          {/* Keywords Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full glass-card border-none shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="w-5 h-5 text-primary" />
                  Keyword Analysis
                </CardTitle>
                <CardDescription>How well your skills match the job description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Matched Keywords
                    </h3>
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {MOCK_DATA.matchedKeywords.length} Found
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_DATA.matchedKeywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" /> Missing Keywords
                    </h3>
                    <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {MOCK_DATA.missingKeywords.length} Missing
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_DATA.missingKeywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="text-muted-foreground border-dashed">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 bg-muted/50 p-3 rounded-lg border">
                    💡 <span className="font-medium text-foreground">Tip:</span> Try to incorporate these missing keywords naturally into your experience bullet points if you have the relevant skills.
                  </p>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Format Checks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="h-full glass-card border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-primary" />
                  Format Checks
                </CardTitle>
                <CardDescription>Basic ATS readability rules</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {MOCK_DATA.formatIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border shadow-sm">
                      {issue.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : issue.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm leading-relaxed">{issue.message}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="h-full glass-card border-none shadow-md overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-primary/20 via-indigo-400/20 to-purple-400/20" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                  AI Improvement Suggestions
                </CardTitle>
                <CardDescription>Smart recommendations to increase your impact and ATS score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {MOCK_DATA.aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gradient-to-b from-white to-slate-50 border shadow-sm relative group hover:shadow-md transition-all">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Original</span>
                      <p className="text-sm text-foreground/80 line-through decoration-destructive/30 decoration-2">{suggestion.original}</p>
                    </div>
                    
                    <div className="mb-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Suggested Fix</span>
                      <p className="text-sm font-medium text-foreground">{suggestion.improved}</p>
                    </div>
                    
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="bg-muted p-1 rounded mt-0.5">
                        <Target className="w-3 h-3" />
                      </div>
                      <p className="leading-tight"><span className="font-semibold text-foreground/70">Why:</span> {suggestion.reason}</p>
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
