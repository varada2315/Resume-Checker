import { useState } from "react";
import { useLocation } from "wouter";
import { UploadCloud, FileText, CheckCircle2, ChevronRight, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile);
      }
    }
  };

  const handleAnalyze = () => {
    if (!file || !jobDescription) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setLocation("/results");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartATS</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
            Optimize Your Resume for <span className="text-gradient">ATS</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Check your ATS score, identify missing keywords, and get AI-powered suggestions to increase your chances of getting shortlisted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Resume Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-none shadow-md overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-primary/20 to-indigo-400/20" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">1. Upload Resume</h2>
                </div>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/50"
                  } ${file ? "bg-primary/5 border-primary/30" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border">
                        <File className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="mt-2 text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Drag and drop your resume</p>
                        <p className="text-sm text-muted-foreground mb-4">Supports PDF or DOCX (Max 5MB)</p>
                      </div>
                      <label htmlFor="file-upload">
                        <Button variant="secondary" className="cursor-pointer pointer-events-none">
                          Browse Files
                        </Button>
                      </label>
                      <input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-none shadow-md overflow-hidden h-full flex flex-col">
              <div className="p-1 bg-gradient-to-r from-indigo-400/20 to-purple-400/20" />
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/10 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h2 className="text-xl font-semibold">2. Job Description</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Paste the job description you want to optimize your resume against.
                </p>
                
                <Textarea 
                  placeholder="Paste the full job description here..."
                  className="flex-1 min-h-[200px] resize-none bg-white/50 focus:bg-white transition-colors text-base p-4"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="rounded-full px-8 h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            disabled={!file || !jobDescription || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Match...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Analyze Resume Match
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </Button>
          
          {(!file || !jobDescription) && (
            <p className="text-sm text-muted-foreground mt-4">
              Please upload a resume and paste a job description to continue.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
