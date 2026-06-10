import React, { useState } from "react";
import { Shield, Sparkles, Columns, Lock, Share2, BarChart3, ChevronRight, Activity, RotateCcw, Terminal, FileText, LogOut, Home, UploadCloud, Bell, Settings } from "lucide-react";
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans transition-colors duration-200 flex flex-col md:flex-row animate-fade-in relative pb-16 md:pb-0">
      
      {/* 1. SIDE NAVIGATION PANEL FOR DESKTOP/TABLET */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a071a] text-slate-300 border-r border-[#1a1535] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Branding header */}
        <div className="p-5 border-b border-[#1a1535] flex items-center space-x-3 bg-gradient-to-r from-[#171038] to-[#0a071a]">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
            <Shield className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase leading-none">SMedia Auto Post</h1>
            <span className="text-[9px] font-mono text-[#8c74ff] font-bold tracking-widest block mt-1">ONLINE AGENT</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 flex-1 space-y-7">
          {/* Section: Workspaces */}
          <div>
            <h3 className="px-2 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest mb-2.5">Workspace Modes</h3>
            <div className="space-y-1">
              <button
                onClick={() => setViewMode("operations")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  viewMode === "operations"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Operations</span>
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
              </button>
              
              <button
                onClick={() => setViewMode("it_dept")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  viewMode === "it_dept"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>IT Dept Console</span>
                </span>
                <span className="text-[9px] font-mono bg-amber-950 text-amber-300 px-1.5 rounded-full font-bold">{auditLogs.length}</span>
              </button>
            </div>
          </div>

          {/* Section: Operations Steps (shown only in operations or clickable to switch) */}
          <div>
            <h3 className="px-2 text-[9px] font-mono text-slate-550 font-bold uppercase tracking-widest mb-2.5">Posting Steps</h3>
            <div className="space-y-1.5">
              {WORKFLOW_STEPS.map((step) => {
                const StepIcon = step.icon;
                const isActive = viewMode === "operations" && activeTab === step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      setViewMode("operations");
                      if (!analysisResult && step.num > 1) {
                        alert("Please configure Step 1 Secure Intake first!");
                        return;
                      }
                      setActiveTab(step.num);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/25 border border-indigo-505/30 text-white font-extrabold"
                        : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <StepIcon className="w-4 h-4 shrink-0 text-slate-400" />
                    <span className="truncate">{step.num}. {step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Stats Monitor */}
          <div>
            <h3 className="px-2 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest mb-2">PWA Sync Stats</h3>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[10.5px] font-mono space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Media cache:</span>
                <span className="text-white font-bold">{folderCounts.carMedia} files</span>
              </div>
              <div className="flex justify-between">
                <span>Sync Queue:</span>
                <span className="text-emerald-400 font-bold">{postQueue.filter(p => !p.posted).length} pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* User footer profile & Actions */}
        <div className="p-4 border-t border-[#1a1535] space-y-2 bg-[#080516]">
          <div className="flex items-center space-x-2 px-1 py-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
              AD
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-none">Admin Profile</p>
              <span className="text-[9px] font-mono text-slate-500">Admin2026</span>
            </div>
          </div>

          <button
            onClick={resetPipeline}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-slate-400 hover:text-white hover:bg-white/5 transition font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workspace</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out of Admin Console?")) {
                setIsAuthenticated(false);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-rose-450 hover:text-rose-200 hover:bg-rose-950/20 transition font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Sleek Design Theme Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 border-b border-slate-200 backdrop-blur-md sticky top-0 z-40 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 md:hidden">
              <Shield className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden md:block">
              Auto Showcase <span className="text-indigo-600 font-semibold">Agent Workspace</span>
            </h1>
            <h1 className="text-base font-black tracking-tight text-slate-900 md:hidden">SMedia Auto Post</h1>
            
            {/* Segmented Mode Toggle on mobile */}
            <div className="flex sm:hidden bg-slate-200 p-1 rounded-xl border border-slate-300/45 ml-1">
              <button
                onClick={() => setViewMode("operations")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition duration-150 ${
                  viewMode === "operations" ? "bg-indigo-600 text-white" : "text-slate-500"
                }`}
              >
                Ops
              </button>
              <button
                onClick={() => setViewMode("it_dept")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition duration-150 ${
                  viewMode === "it_dept" ? "bg-indigo-600 text-white" : "text-slate-500"
                }`}
              >
                IT
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={resetPipeline}
              className="p-2 sm:p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition hover:cursor-pointer flex items-center justify-center shrink-0 cursor-pointer"
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
              className="flex md:hidden items-center justify-center gap-1.5 px-3 py-2 sm:p-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-600 hover:text-rose-800 rounded-lg shadow-sm shadow-rose-600/5 transition hover:cursor-pointer font-bold text-xs shrink-0 select-none cursor-pointer"
              title="Lock Session / Logout"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline-block">Log Out</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Frame */}
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
                      <span className="text-slate-440 block text-[9px] uppercase">Body Class</span>
                      <span className="text-slate-700 font-semibold">{analysisResult.detectedStyle}</span>
                    </div>
                    <div className="border-l border-slate-200 pl-4 py-0.5">
                      <span className="text-slate-450 block text-[9px] uppercase">Color Scheme</span>
                      <span className="text-slate-700 font-semibold">{analysisResult.detectedColor}</span>
                    </div>
                    <div className="border-l border-slate-200 pl-4 py-0.5">
                      <span className="text-slate-450 block text-[9px] uppercase">Vision Confidence</span>
                      <span className="text-emerald-600 font-extrabold">{Math.round(analysisResult.confidenceScore * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Workflow steps tab controls (Visible only on mobile screen for easier scrolling taps) */}
              <div className="overflow-x-auto pb-1 md:hidden">
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
              <div className="transition-all duration-350 bg-transparent">
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
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-slate-500 font-mono text-[10.5px] shadow-inner mb-14 md:mb-0">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>Auto Showcase Agent System Shell v1.0 • PWA Mode</span>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Pre-flight audits active & validated compliant</span>
            </div>
          </div>
        </footer>

      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (FIXED SCREEN BOTTOM) */}
      <nav className="md:hidden fixed bottom-1 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(9,5,29,0.05)] z-50 flex items-center justify-around px-2 pb-safe">
        <button
          type="button"
          onClick={() => {
            setViewMode("operations");
            setActiveTab(1);
            setIsNotificationsOpen(false);
            setIsSettingsOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full select-none transition cursor-pointer ${
            viewMode === "operations" && activeTab === 1 && !isNotificationsOpen && !isSettingsOpen
              ? "text-indigo-650 font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight mt-1">Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewMode("operations");
            setActiveTab(1);
            setIsNotificationsOpen(false);
            setIsSettingsOpen(false);
            // Quick scrolling to file inputs
            setTimeout(() => {
              const fileInput = document.getElementById("file-picker-trigger");
              if (fileInput) fileInput.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full select-none transition cursor-pointer ${
            viewMode === "operations" && activeTab === 1 && !isNotificationsOpen && !isSettingsOpen
              ? "text-indigo-600 font-extrabold"
              : "text-slate-400 hover:text-slate-650"
          }`}
        >
          <UploadCloud className="w-5 h-5 text-indigo-650" />
          <span className="text-[10px] font-bold tracking-tight mt-1 text-slate-700">Upload</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewMode("operations");
            if (!analysisResult) {
              alert("Please perform Secure Intake (Step 1) on home first!");
              return;
            }
            setActiveTab(5); // Social Scheduler
            setIsNotificationsOpen(false);
            setIsSettingsOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full relative select-none transition cursor-pointer ${
            viewMode === "operations" && activeTab === 5 && !isNotificationsOpen && !isSettingsOpen
              ? "text-indigo-655 font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Share2 className="w-5 h-5" />
            {postQueue.filter(p => !p.posted).length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {postQueue.filter(p => !p.posted).length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1">Post</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
            setIsSettingsOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full relative select-none transition cursor-pointer ${
            isNotificationsOpen ? "text-indigo-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 w-2 h-2 rounded-full animate-ping"></span>
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1">Logs</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSettingsOpen(!isSettingsOpen);
            setIsNotificationsOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full select-none transition cursor-pointer ${
            isSettingsOpen ? "text-[#5a24f5] font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1 font-sans">Controls</span>
        </button>
      </nav>

      {/* 4. MOBILE INTERACTIVE NOTIFICATIONS/LOGS DRAWER */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 bg-neutral-950/75 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in animate-duration-150">
          <div className="bg-white rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border-t border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="w-6.5 h-6.5 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight">Active Operations Notifications</h3>
                  <p className="text-[9px] font-mono text-slate-500">Live Agent Pipeline Records</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 px-2.5 bg-slate-200/80 active:bg-slate-300 rounded-lg text-slate-700 text-xs font-bold shrink-0 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Dynamic notifications contents */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1 select-none">
              {/* Dynamic Storage counts */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase">Cached Vehicles:</span>
                  <span className="text-slate-700 font-bold">{folderCounts.carMedia} / 10 assets</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase">Active Sync Channels:</span>
                  <span className="text-emerald-600 font-extrabold">{socialChannels.filter(c => c.connected).length} active</span>
                </div>
              </div>

              {/* Dynamic logs checklist */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider shrink-0 ${
                      log.level === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      log.level === "SECURITY" ? "bg-violet-50 text-violet-700 border border-violet-200" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {log.level}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-700 leading-tight">{log.message}</p>
                      <span className="text-[8.5px] text-slate-400 block font-mono mt-1">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MOBILE DIAGNOSTICS & SYSTEM CONTROLS DRAWER */}
      {isSettingsOpen && (
        <div className="md:hidden fixed inset-0 bg-neutral-950/75 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in animate-duration-150">
          <div className="bg-[#090714] text-slate-300 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border-t border-slate-900/60">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-900 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center space-x-2">
                <div className="w-6.5 h-6.5 bg-[#1f1cf2]/20 rounded-lg flex items-center justify-center border border-indigo-500/10">
                  <Settings className="w-4 h-4 text-[#8869ff]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-tight uppercase">Agent Controls</h3>
                  <p className="text-[9px] font-mono text-[#8869ff] font-bold">SYSTEM CONTROL PANEL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 px-2.5 bg-slate-900 active:bg-slate-850 rounded-lg text-slate-400 text-xs font-bold border border-slate-800 shrink-0 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Content items */}
            <div className="p-4 space-y-5 overflow-y-auto pb-8">
              {/* Workspace mode row toggler custom slider */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#8869ff] font-mono">Select Workspace Mode</span>
                <div className="grid grid-cols-2 gap-2 bg-[#100d22] p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("operations");
                      setIsSettingsOpen(false);
                    }}
                    className={`py-2 px-3 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                      viewMode === "operations" ? "bg-[#5a24f5] text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Operations
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("it_dept");
                      setIsSettingsOpen(false);
                    }}
                    className={`py-2 px-3 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                      viewMode === "it_dept" ? "bg-[#5a24f5] text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    IT Department
                  </button>
                </div>
              </div>

              {/* Cache action elements and offline queue */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Diagnostic Tools</span>
                
                <button
                  type="button"
                  onClick={() => {
                    handleRefreshWatcher();
                    setIsSettingsOpen(false);
                    alert("Progressive Web App SQLite offline queue synchronized successfully with Netlify backend!");
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 p-3 rounded-2xl font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-550 shrink-0 animate-pulse" />
                    <span>Trigger Manual Sync Queue</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">OFFLINE OK</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetPipeline();
                    setIsSettingsOpen(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-rose-400 p-3 rounded-2xl font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Clear Cache & Reset Workspaces</span>
                  </span>
                  <span className="text-[9px] font-mono text-rose-400 bg-rose-950/20 px-1 rounded">ALL DATA</span>
                </button>
              </div>

              {/* Red logout button */}
              <div className="pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to log out of Admin Session?")) {
                      setIsAuthenticated(false);
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="w-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 text-rose-400 text-xs font-black tracking-widest uppercase p-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOCK SECURE SESSION</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
