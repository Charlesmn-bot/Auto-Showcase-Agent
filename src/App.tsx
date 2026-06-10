import React, { useState } from "react";
import { Shield, Sparkles, Columns, Lock, Share2, BarChart3, ChevronRight, Activity, RotateCcw, Terminal, FileText, LogOut } from "lucide-react";
import { CarAnalysisResult, ActiveEnhancements, AuditLogEntry, SocialChannel, PostQueueItem, SoundtrackItem } from "./types";
import { CAR_PRESETS } from "./presets";
import IntakeSection from "./components/IntakeSection";
import EnhancementSection from "./components/EnhancementSection";
import CollageSection from "./components/CollageSection";
import FlyerTemplateSection from "./components/FlyerTemplateSection";
import SocialSection from "./components/SocialSection";
import AnalyticsSection from "./components/AnalyticsSection";
import ITDeptSection from "./components/ITDeptSection";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Global View Mode: Toggle between standard "operations" or "it_dept" administration
  const [viewMode, setViewMode] = useState<"operations" | "it_dept">("operations");

  // Global soundtracks library shared across IT, Collages, and Flyer Templates
  const [soundtracks, setSoundtracks] = useState<SoundtrackItem[]>([
    { id: "snd_001", title: "Synthwave Skyline", genre: "Electronic / Synthwave", duration: "2:45", type: "default", matchingModel: "Porsche" },
    { id: "snd_002", title: "Midnight Boulevard", genre: "Late Night Chill / Lo-Fi", duration: "3:12", type: "default", matchingModel: "Tesla" },
    { id: "snd_003", title: "Acoustic Sunsets", genre: "Warm Acoustic Guitar", duration: "2:10", type: "default", matchingModel: "Toyota" },
    { id: "snd_004", title: "Neon Grand Prix", genre: "High-Energy Tech Beat", duration: "2:30", type: "default", matchingModel: "Ford" },
    { id: "snd_005", title: "Lo-Fi Coffee Shop", genre: "Ambient Jazz Hop", duration: "3:40", type: "default", matchingModel: "Daihatsu" },
  ]);

  // Global Active Step: 1 to 5
  const [activeTab, setActiveTab] = useState<number>(1);

  // Simulated Media Folder Inode Counts matching user specifications:
  // "Car Media", "Showroom Layouts", "Showroom Videos", "Published"
  const [folderCounts, setFolderCounts] = useState({
    carMedia: 3,
    showroomLayouts: 1,
    showroomVideos: 1,
    communityMedia: 2,
    communityLayouts: 1,
    published: 0,
    soundmediaLayouts: 0,
  });

  // Default vehicle loaded on first render to make UI gorgeous instantly
  const [analysisResult, setAnalysisResult] = useState<CarAnalysisResult | null>({
    detectedMake: "Porsche",
    detectedModel: "911 Carrera",
    detectedYear: "2022",
    detectedColor: "Guards Red",
    detectedStyle: "Coupe",
    confidenceScore: 0.98,
    clarityScore: 94,
    marketingPitch: "Unleash high-octane performance and classic motorsport heritage with this breathtaking Guards Red Porsche 911 Carrera. Featuring precision rear-engine layout, adaptive handling chassis, and meticulously selected leather cabin appointments. Autonomic performance metrics validated and certified.",
    cta: "DM for trade-in assessments & bespoke financing pathways.",
    hashtags: ["Porsche911", "CarreraLife", "ShowroomPrism", "AutoShowcase", "MotorsportClassic"],
    safetyCheckPassed: true,
  });

  const [activeImages, setActiveImages] = useState({
    main: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    top: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600",
    bottom: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600",
    left: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600",
    right: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600"
  });

  const [isUploaded, setIsUploaded] = useState(false);

  // Image adjusters/filters (Step 2)
  const [enhancements, setEnhancements] = useState<ActiveEnhancements>({
    brightness: 100,
    contrast: 100,
    sharpness: 25,
    denoise: false,
    bgRemoved: false,
    videoStabilize: true,
    videoCleanAudio: true,
    videoWatermark: true,
    videoBrightness: 110,
    videoContrast: 105,
  });

  // Audit Logs database (Step 4)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: "SUCCESS",
      category: "SYSTEM",
      message: "System core online. Auto Showcase Agent operational checklist configured."
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      level: "SECURITY",
      category: "SECURITY",
      message: "Local car model directory security watchers engaged. Watching directories: '/CarPhotos'."
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      level: "INFO",
      category: "SYSTEM",
      message: "Pre-loaded database cached with high-fidelity showroom vehicle presets: Porsche 911, Tesla Model 3, Ford Mustang."
    }
  ]);

  // Social account profiles metrics (Step 5, 6)
  const [socialChannels, setSocialChannels] = useState<SocialChannel[]>([
    { id: "instagram", name: "Instagram", connected: true, engagementRate: 8.4, likes: 235, shares: 12, comments: 18, leads: 2 },
    { id: "facebook", name: "Facebook", connected: true, engagementRate: 4.2, likes: 114, shares: 24, comments: 8, leads: 1 },
    { id: "whatsapp", name: "WhatsApp Business", connected: false, engagementRate: 0.0, likes: 0, shares: 0, comments: 0, leads: 0 },
    { id: "linkedin", name: "LinkedIn Professional", connected: false, engagementRate: 0.0, likes: 0, shares: 0, comments: 0, leads: 0 }
  ]);

  // Scheduled / Posted Campaign Queue (Step 5)
  const [postQueue, setPostQueue] = useState<PostQueueItem[]>([]);

  // Function to easily record operational logs
  const addAuditLog = (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => {
    const freshLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message
    };
    setAuditLogs(prev => [freshLog, ...prev]);
  };

  // Called when Step 1 successfully analyzes a file via standard Vision API
  const handleIntakeSuccess = (result: CarAnalysisResult, images: typeof activeImages, uploaded: boolean) => {
    setAnalysisResult(result);
    setActiveImages(images);
    setIsUploaded(uploaded);
    
    // Auto increment watched files count in Car Media folder
    setFolderCounts(prev => ({
      ...prev,
      carMedia: prev.carMedia + 1
    }));
    
    // Auto reset filters when a new car is selected
    setEnhancements({
      brightness: 110,
      contrast: 105,
      sharpness: 35,
      denoise: true,
      bgRemoved: true,
      videoStabilize: true,
      videoCleanAudio: true,
      videoWatermark: true,
      videoBrightness: 110,
      videoContrast: 105,
    });

    // Automatically navigate to Step 2
    setActiveTab(2);
  };

  // Steps configuration list
  const WORKFLOW_STEPS = [
    { num: 1, label: "Secure Intake", icon: Shield, id: "tab-1" },
    { num: 2, label: "AI Enhancers", icon: Sparkles, id: "tab-2" },
    { num: 3, label: "Collage Canvas", icon: Columns, id: "tab-3" },
    { num: 4, label: "Flyer Templates", icon: FileText, id: "tab-4" },
    { num: 5, label: "Social Scheduler", icon: Share2, id: "tab-5" },
    { num: 6, label: "Conversion Analytics", icon: BarChart3, id: "tab-6" },
  ];

  const handleRefreshWatcher = () => {
    addAuditLog("SUCCESS", "SYSTEM", "Automated background loop watcher sweep processed. Directories & SQLite in sync.");
  };

  const resetPipeline = () => {
    if (confirm("Are you sure you want to reset the current pipeline? This will clear active enhancements and current post enqueues.")) {
      setEnhancements({
        brightness: 100,
        contrast: 100,
        sharpness: 25,
        denoise: false,
        bgRemoved: false,
        videoStabilize: true,
        videoCleanAudio: true,
        videoWatermark: true,
        videoBrightness: 110,
        videoContrast: 105,
      });
      setFolderCounts({
        carMedia: 3,
        showroomLayouts: 1,
        showroomVideos: 1,
        communityMedia: 2,
        communityLayouts: 1,
        published: 0,
      });
      setPostQueue([]);
      setActiveTab(1);
      addAuditLog("INFO", "SYSTEM", "Manual pipeline resets performed. Tuning adjustments and enqueued queues cleared.");
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#ddf6f4] to-[#f0fdfc] text-slate-800 font-sans transition-colors duration-200 animate-fade-in">
      
      {/* Sleek Design Theme Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-white/80 border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Shield className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden md:block">Auto Showcase <span className="text-indigo-600 font-semibold">Agent</span></h1>
          
          {/* Segmented Mode Toggle (Separating IT from Operations) */}
          <div className="flex bg-slate-200 p-1 rounded-xl border border-slate-300/45 ml-2">
            <button
              onClick={() => setViewMode("operations")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 hover:cursor-pointer ${
                viewMode === "operations" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Showroom Operations</span>
              <span className="sm:hidden">Operations</span>
            </button>
            <button
              onClick={() => setViewMode("it_dept")}
              id="it-dept-toggle"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 hover:cursor-pointer ${
                viewMode === "it_dept" ? "bg-slate-300 border border-slate-400/20 text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IT Department</span>
              <span className="sm:hidden">IT Dept</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-750">SECURE SHELL RUNTIME</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-650 animate-pulse" />
            <span className="text-slate-600 font-mono font-semibold">SB-90122-TX</span>
          </div>

          <button
            onClick={resetPipeline}
            className="p-2 sm:p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition hover:cursor-pointer flex items-center justify-center shrink-0"
            title="Reset Workspaces"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out and lock the session?")) {
                setIsAuthenticated(false);
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:p-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-600 hover:text-rose-800 rounded-lg shadow-sm shadow-rose-600/5 transition hover:cursor-pointer font-bold text-xs shrink-0 select-none"
            title="Lock Session / Logout"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span className="inline-block">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:py-8 space-y-6">
        
        {viewMode === "operations" ? (
          <>
            {/* Global Vehicle Indicator bar if selected */}
            {analysisResult && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between text-left gap-4 shadow-md animate-fade-in">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="relative">
                    <img
                      src={activeImages.main}
                      alt="Active Vehicle Overview"
                      className="w-20 h-12 object-cover rounded-xl border border-slate-200 shadow-md shrink-0"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-semibold block">Active Target Model</span>
                    <h3 className="text-base font-bold text-slate-900">
                      {analysisResult.detectedYear} {analysisResult.detectedMake} {analysisResult.detectedModel}
                    </h3>
                  </div>
                </div>

                {/* Quick stats on target */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto text-xs font-mono text-slate-500">
                  <div className="border-l border-slate-200 pl-4 py-0.5">
                    <span className="text-slate-400 block text-[9px] uppercase">Body Class</span>
                    <span className="text-slate-700 font-semibold">{analysisResult.detectedStyle}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4 py-0.5">
                    <span className="text-slate-400 block text-[9px] uppercase">Color Scheme</span>
                    <span className="text-slate-700 font-semibold">{analysisResult.detectedColor}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4 py-0.5">
                    <span className="text-slate-400 block text-[9px] uppercase">Vision Confidence</span>
                    <span className="text-emerald-600 font-extrabold">{Math.round(analysisResult.confidenceScore * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow steps tab controls */}
            <div className="overflow-x-auto pb-1">
              <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm min-w-[760px]">
                {WORKFLOW_STEPS.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = activeTab === step.num;
                  const isPassed = activeTab > step.num;
                  return (
                    <button
                      key={step.num}
                      id={step.id}
                      onClick={() => {
                        if (!analysisResult && step.num > 1) {
                          alert("Please run step 1 secure intake first to specify a vehicle model!");
                          return;
                        }
                        setActiveTab(step.num);
                      }}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                          : isPassed
                          ? "text-indigo-600 hover:bg-slate-50"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <StepIcon className={`w-4 h-4 ${isActive ? "text-white" : isPassed ? "text-indigo-600" : "text-slate-400"}`} />
                      <span>{step.num}. {step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Contents */}
            <div className="transition-all duration-300">
              {activeTab === 1 && (
                <IntakeSection
                  onAnalyzeSuccess={handleIntakeSuccess}
                  addAuditLog={addAuditLog}
                />
              )}

              {activeTab === 2 && analysisResult && (
                <EnhancementSection
                  analysis={analysisResult}
                  images={activeImages}
                  enhancements={enhancements}
                  setEnhancements={setEnhancements}
                  addAuditLog={addAuditLog}
                  onNext={() => setActiveTab(3)}
                />
              )}

              {activeTab === 3 && analysisResult && (
                <CollageSection
                  analysis={analysisResult}
                  images={activeImages}
                  enhancements={enhancements}
                  addAuditLog={addAuditLog}
                  soundtracks={soundtracks}
                  setSoundtracks={setSoundtracks}
                  onNext={() => {
                    // Increment compiled assets inside directory simulation state!
                    setFolderCounts(prev => ({
                      ...prev,
                      showroomLayouts: prev.showroomLayouts + 1,
                      showroomVideos: prev.showroomVideos + 1
                    }));
                    addAuditLog("SUCCESS", "COMPOSITE", "Moved newly compiled collage to '/ShowroomLayouts/' filesystem directory.");
                    addAuditLog("SUCCESS", "COMPOSITE", "Moved newly compiled video reels clip to '/ShowroomVideos/' filesystem directory.");
                    setActiveTab(4); // Moving directly to step 4 (Flyer Templates)
                  }}
                />
              )}

              {activeTab === 4 && (
                <FlyerTemplateSection
                  analysis={analysisResult}
                  activeImages={activeImages}
                  addAuditLog={addAuditLog}
                  soundtracks={soundtracks}
                  setSoundtracks={setSoundtracks}
                />
              )}

              {activeTab === 5 && analysisResult && (
                <SocialSection
                  analysis={analysisResult}
                  socialChannels={socialChannels}
                  setSocialChannels={setSocialChannels}
                  postQueue={postQueue}
                  setPostQueue={setPostQueue}
                  addAuditLog={addAuditLog}
                  onNext={() => setActiveTab(6)} // Moving directly to step 6 (Conversion Analytics)
                  onCampaignAction={(action) => {
                    if (action === "PUBLISH") {
                      // Decrement Showroom files, move to Published folder as requested!
                      setFolderCounts(prev => ({
                        ...prev,
                        showroomLayouts: Math.max(0, prev.showroomLayouts - 1),
                        showroomVideos: Math.max(0, prev.showroomVideos - 1),
                        published: prev.published + 2
                      }));
                      addAuditLog("SUCCESS", "SYSTEM", "Automatic background watcher moved posted_media to '/Published/' directory.");
                    } else {
                      addAuditLog("INFO", "SYSTEM", "Cron schedule triggers registered in local SQLite database.");
                    }
                  }}
                />
              )}

              {activeTab === 6 && (
                <AnalyticsSection
                  socialChannels={socialChannels}
                  postQueue={postQueue}
                />
              )}
            </div>
          </>
        ) : (
          /* Render full standalone IT Department panel */
          <ITDeptSection
            analysis={analysisResult}
            folderCounts={folderCounts}
            auditLogs={auditLogs}
            addAuditLog={addAuditLog}
            socialChannels={socialChannels}
            postQueue={postQueue}
            onRefreshWatcher={handleRefreshWatcher}
            setFolderCounts={setFolderCounts}
            setPostQueue={setPostQueue}
            soundtracks={soundtracks}
            setSoundtracks={setSoundtracks}
          />
        )}

      </main>

      {/* Footer copyright stamp */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-slate-500 font-mono text-[10.5px] shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Auto Showcase Agent System Shell v1.0 • Deployed container environment</span>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pre-flight audits active & validated compliant</span>
          </div>
        </div>
      </footer>



    </div>
  );
}
