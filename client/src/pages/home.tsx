import { useState } from "react";
import { useLocation } from "wouter";
import { UploadCloud, FileText, CheckCircle2, ChevronRight, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

import { Logo } from "@/components/Logo";

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file || !jobDescription) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setLocation("/results");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 bg-[radial-gradient(circle_at_top_right,_var(--secondary)_0%,_transparent_25%),radial-gradient(circle_at_bottom_left,_var(--secondary)_0%,_transparent_25%)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight text-[#111827]">Optosaur</span>
          </div>
          <Button variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#111827] hover:bg-gray-50" onClick={() => document.getElementById('analyze-btn')?.scrollIntoView({ behavior: 'smooth' })}>
            Analyze Resume
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
            Optosaur
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            AI-Powered Resume Optimization Engine
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Precision matching. Recruiter-level insights. Smarter applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Resume Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#3E8E41]/10 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-[#3E8E41]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">1. Upload Resume</h2>
                </div>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
                    dragActive ? "border-[#3E8E41] bg-[#3E8E41]/5 scale-[1.01]" : "border-gray-200 hover:border-[#3E8E41]/50 hover:bg-gray-50"
                  } ${file ? "bg-[#3E8E41]/5 border-[#3E8E41]/30" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                        <File className="w-8 h-8 text-[#3E8E41]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Drag and drop your resume</p>
                        <p className="text-sm text-gray-500 mb-6">Supports PDF or DOCX (Max 5MB)</p>
                      </div>
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer pointer-events-none border-gray-200 text-gray-600">
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
            <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2 overflow-hidden h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#3E8E41]/10 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-[#3E8E41]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">2. Job Description</h2>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Paste the job description you want to optimize your resume against.
                </p>
                
                <Textarea 
                  placeholder="Paste the full job description here..."
                  className="flex-1 min-h-[250px] resize-none border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#3E8E41] transition-all text-base p-4 rounded-xl"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="bg-[#3E8E41] hover:bg-[#347A39] text-white px-8 h-14 text-lg font-semibold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
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
            <p className="text-sm text-gray-400 mt-6">
              Please upload a resume and paste a job description to continue.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
