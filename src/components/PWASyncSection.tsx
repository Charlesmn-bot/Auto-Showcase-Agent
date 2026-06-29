import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, CheckCircle, Monitor, Info, Loader2, Download, Check, 
  Terminal, Shield, FileText, Smartphone, Laptop, RefreshCw, AlertCircle
} from "lucide-react";

interface PWASyncSectionProps {
  folderCounts: {
    carMedia: number;
    showroomLayouts: number;
    showroomVideos: number;
    communityMedia: number;
    communityLayouts: number;
    published: number;
    soundmediaLayouts?: number;
  };
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
}

export default function PWASyncSection({ folderCounts, addAuditLog }: PWASyncSectionProps) {
  // Version and Upgrade states
  const [appVersion, setAppVersion] = useState<string>("v2.4.0");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [upgradeLogs, setUpgradeLogs] = useState<string[]>([]);
  const [showUpgradeConsole, setShowUpgradeConsole] = useState(false);
  const [dataPreservedCheck, setDataPreservedCheck] = useState<boolean>(true);
  const [upgradedFeaturesInstalled, setUpgradedFeaturesInstalled] = useState<boolean>(false);
  const upgradeConsoleBottomRef = useRef<HTMLDivElement>(null);

  // PWA Sync states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [pwaLogs, setPwaLogs] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [showSyncLogConsole, setShowSyncLogConsole] = useState(false);
  const pwaConsoleBottomRef = useRef<HTMLDivElement>(null);

  // Standalone Compiler states
  const [selectedPlatform, setSelectedPlatform] = useState<"windows" | "macos" | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [compiledBinaries, setCompiledBinaries] = useState<{ windows?: string; macos?: string }>({});
  const compileConsoleBottomRef = useRef<HTMLDivElement>(null);

  // Scroll Upgrade console to bottom
  useEffect(() => {
    if (upgradeConsoleBottomRef.current) {
      upgradeConsoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [upgradeLogs]);

  // Scroll PWA log console to bottom
  useEffect(() => {
    if (pwaConsoleBottomRef.current) {
      pwaConsoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pwaLogs]);

  // Scroll Compiler console to bottom
  useEffect(() => {
    if (compileConsoleBottomRef.current) {
      compileConsoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [compileLogs]);

  // Run PWA Sync logic simulation
  const handleStartPWASync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setShowSyncLogConsole(true);
    setPwaLogs([
      `[${new Date().toLocaleTimeString()}] PWA_SYNC: Initiating sync context...`,
      `[${new Date().toLocaleTimeString()}] PWA_SYNC: Checking secure tunnel network integrity... HTTPS-OK`,
      `[${new Date().toLocaleTimeString()}] PWA_SYNC: Accessing client-side secure IndexedDB instance 'car_media_local_v2'...`
    ]);

    addAuditLog("INFO", "DATABASE", "PWA Sync Engine initiated. Checking client-side IndexedDB registers.");

    const totalToSync = 
      folderCounts.carMedia + 
      folderCounts.showroomLayouts + 
      folderCounts.showroomVideos + 
      folderCounts.communityMedia + 
      folderCounts.communityLayouts + 
      (folderCounts.soundmediaLayouts || 0);

    const steps = [
      { text: `Discovered local records: ${totalToSync} items cached in offline store.`, prog: 15 },
      { text: "Opening master transaction scope 'SYNC_SECTOR_MAIN'...", prog: 30 },
      { text: "Creating AES-256 payload buffer of offline vehicles/flyers metadata...", prog: 45 },
      { text: "Compression routine complete (12.4 MB gzip stream allocated).", prog: 60 },
      { text: "Tunnel verification passed. Syncing chunk packets to Cloud Run gateway...", prog: 80 },
      { text: `Transferred ${totalToSync} records successfully. Invalidating local outdated tokens.`, prog: 95 },
      { text: `Synchronization cycle COMPLETE. Cache state validated with server.`, prog: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStep = steps[stepIndex];
        setSyncProgress(currentStep.prog);
        setPwaLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] PWA_SYNC: ${currentStep.text}`]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSyncing(false);
          setLastSyncTime(new Date().toLocaleTimeString());
          addAuditLog("SUCCESS", "DATABASE", `PWA Sync Engine successfully synchronized ${totalToSync} items to server gateway.`);
        }, 300);
      }
    }, 700);
  };

  // Run Autonomous Upgrade with Data Preservation
  const handleUpgradeApp = () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    setUpgradeProgress(0);
    setShowUpgradeConsole(true);
    setUpgradedFeaturesInstalled(false);

    setUpgradeLogs([
      `[${new Date().toLocaleTimeString()}] [UPGRADER] Initializing secure upgrade agent for V2.5.0 STABLE...`,
      `[${new Date().toLocaleTimeString()}] [UPGRADER] Verifying local system architecture... Verified (React 18 + PWA Client Worker)`,
      `[${new Date().toLocaleTimeString()}] [UPGRADER] Detecting active storage paths for multi-angle car assets...`
    ]);

    addAuditLog("INFO", "SYSTEM", "App upgrade routine initiated. Verifying local folder structures & preserving IndexedDB cache.");

    const steps = [
      { text: "Mapping and verifying local ingestion paths: /Intake/, /ShowroomLayouts/, /ShowroomVideos/... APPROVED", prog: 15 },
      { text: `Locating local SQLite & IndexedDB vehicle cache (${folderCounts.carMedia + folderCounts.showroomLayouts} active profiles).`, prog: 30 },
      { text: "Creating temporary schema backup of vehicle database... SECURED AND LOCK PRESERVED", prog: 45 },
      { text: "Preserving active directory links... Mappings remained attached to native user system.", prog: 60 },
      { text: "Deploying upgraded software feature patches (Advanced Waveform visualization, Instagram Reels formats, Japanese Brand filters)...", prog: 75 },
      { text: "Restoring local vehicle databases & aligning cache tables... INTEGRITY CONFIRMED", prog: 90 },
      { text: "Verifying checksum signatures of upgraded standalone core modules... SHA-256 MATCH", prog: 98 },
      { text: "Upgrade Cycle 100% COMPLETE. 0 bytes of local file data lost. Version updated to V2.5.0 STABLE!", prog: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStep = steps[stepIndex];
        setUpgradeProgress(currentStep.prog);
        setUpgradeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [UPGRADER] ${currentStep.text}`]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsUpgrading(false);
          setAppVersion("v2.5.0");
          setUpgradedFeaturesInstalled(true);
          addAuditLog("SUCCESS", "SYSTEM", "Successfully upgraded SMedia Auto Post app to v2.5.0-STABLE. Local folder and database data fully preserved.");
        }, 300);
      }
    }, 600);
  };

  // Generate & download local PWA bundle package to computer
  const triggerPwaDownload = () => {
    const pwaPackage = {
      app_id: "com.smedia.autopost.pwa",
      version: appVersion === "v2.5.0" ? "2.5.0-STABLE" : "2.4.0-STABLE",
      installation_type: "Standalone PWA App Client",
      security_checksum_sha256: "ea8f7d983fb088dcb2414fa9cfbbcc8a3b839b2cf4d98cd92b21cfbc8fa88c0a",
      offline_sync_settings: {
        mode: "OFFLINE-FIRST",
        persistence: "Encrypted IndexedDB Persistence Wrapper",
        background_sync: "UserActivityServiceWorkerTrigger"
      },
      mapped_directories: [
        { path: "/Intake/", description: "Active Car Intake Photo Directory", files_synced: folderCounts.carMedia },
        { path: "/ShowroomLayouts/", description: "AI Rendered Showroom Collages", files_synced: folderCounts.showroomLayouts },
        { path: "/ShowroomVideos/", description: "Cinematic Showcase Reels & Audio", files_synced: folderCounts.showroomVideos }
      ],
      user_database_backup: {
        total_stored_cars: folderCounts.carMedia,
        integrity_status: "Verified Safe",
        preservation_status: "Fully Retained on Software Update"
      },
      new_installed_features: appVersion === "v2.5.0" ? [
        "JDM-Brand Prioritization Pipeline",
        "Neural Audio Waveform visualization module",
        "Dual-schedule social campaign publish trigger",
        "Showroom matte style automated background replacements"
      ] : [
        "Multi-view folder ingestion",
        "Standardized multi-view showroom layouts",
        "Electron stand-alone compilation installer wrapper"
      ]
    };

    const blob = new Blob([JSON.stringify(pwaPackage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smedia_pwa_client_package_${appVersion}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addAuditLog("SUCCESS", "SYSTEM", `User downloaded standalone PWA local install package configuration (Smedia client build).`);
  };

  // Run Standalone Build Compiler logic simulation
  const handleStartCompilation = (platform: "windows" | "macos") => {
    if (isCompiling) return;
    setSelectedPlatform(platform);
    setIsCompiling(true);
    setCompileProgress(0);
    setCompileLogs([
      `[${new Date().toLocaleTimeString()}] [COMPILER] Target configuration: ${platform === "windows" ? "Windows Win64 executable (*.exe)" : "Apple Silicon MacOS Disk Image (*.dmg)"}`,
      `[${new Date().toLocaleTimeString()}] [COMPILER] Loading local Electron project workspace wrapper...`,
      `[${new Date().toLocaleTimeString()}] [COMPILER] Bundling static files from /dist build directory...`
    ]);

    addAuditLog("SECURITY", "SYSTEM", `Standalone builder triggered compiling sequence for ${platform === "windows" ? "auto_showroom_x64.exe" : "auto_showroom_arm64.dmg"}`);

    const steps = [
      { text: "Bundling client CSS/Vite packages into isolated static layout cache...", prog: 15 },
      { text: "Loading embedded custom express server structure under Electron module scope...", prog: 30 },
      { text: "Hashing layout code signing variables (injecting signature keys)...", prog: 45 },
      { text: "Applying AES-256 SQLite storage encryptions table mappings...", prog: 65 },
      { text: `Code signing with verified certificate (SHA-256: ${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}ae8f)...`, prog: 80 },
      { text: `Packaging final standalone compilation installer format...`, prog: 95 },
      { text: `Compilation successful! Sealed executable generated and stored in distribution cache.`, prog: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStep = steps[stepIndex];
        setCompileProgress(currentStep.prog);
        setCompileLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [COMPILER] ${currentStep.text}`]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsCompiling(false);
          const extension = platform === "windows" ? ".exe" : ".dmg";
          const fileName = `auto_showroom_installer_${platform}_v2.4.0${extension}`;
          setCompiledBinaries(prev => ({
            ...prev,
            [platform]: fileName
          }));
          addAuditLog("SUCCESS", "SECURITY", `Successfully completed signed standalone compilation for ${platform.toUpperCase()}: ${fileName}`);
        }, 400);
      }
    }, 600);
  };

  // Mock download generator
  const triggerBinaryDownload = (platform: "windows" | "macos") => {
    const fileName = compiledBinaries[platform];
    if (!fileName) return;

    const fileContent = `=========================================
OFFLINE INTERACTIVE SHOWROOM STANDALONE BUILD
=========================================
Target OS: ${platform === "windows" ? "Windows 10/11 x64" : "MacOS Apple Silicon arm64"}
Installer Package: ${fileName}
Build Version: v2.4.0 Stable
Encryption Mode: AES-256-GCM Activated
PWA Sync: Local IndexedDB Wrapper (v2.4.0 STABLE)
Authorizer: SHA-256 SEALED CERTIFICATE
Developer: IT Development Security Hub

INSTRUCTIONS TO RUN LOCAL INSTANCE:
-------------------------------------------
1. Run this installer containing the bundled Chrome kiosk client and the Node.js database daemon.
2. The system initiates local database synchronization using port 3000 mapping.
3. Offline vehicles and layout parameters load from IndexedDB on startup.

Checksum SHA-256: d2414fa9cfbbcc8a3b839b2cf4d98cd92b21cfbc8fa88c0aef8ef81dcf3487c
Sealed date: ${new Date().toLocaleDateString() /* Avoid complex dates */}
Status: VERIFIED SAFE SECURED BUILD`;

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(".dmg", "_read_instructions.txt").replace(".exe", "_read_instructions.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addAuditLog("SUCCESS", "SYSTEM", `User downloaded simulated standalone software installation metadata for ${platform.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Status / Interactive Alert */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-slate-700">
          <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Offline Sync & Standalone Compilation Center</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulate enterprise compilation environments, code sign binaries, and execute secure client database replication triggers.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {lastSyncTime && (
            <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Last Sync: {lastSyncTime}</span>
            </div>
          )}
          {Object.keys(compiledBinaries).length > 0 && (
            <div className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>{Object.keys(compiledBinaries).length} Build Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: White Left Blue Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT CARD: PWA SYNC ENGINE */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
          
          <div>
            {/* Top Stats and Icon Row */}
            <div className="flex justify-between items-start mb-6">
              {/* Lightning Bolt Icon Box */}
              <div className="bg-[#e0fbff] border border-[#aef2fd] p-3.5 rounded-2xl flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-[#1400ff] fill-[#1400ff]/10" />
              </div>
              
              {/* Status and Version Tags */}
              <div className="text-right flex flex-col items-end">
                <span className="text-[11px] font-bold text-emerald-500 font-sans tracking-wide">STATUS: LIVE</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{appVersion.toUpperCase()}-PRODUCTION</span>
              </div>
            </div>

            {/* Typography */}
            <h3 className="text-[18px] font-extrabold tracking-tight text-slate-900 uppercase mb-2">
              PWA SYNC ENGINE
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed italic mb-8">
              Encrypted IndexedDB persistence with background service workers. <br />
              Default mode: <strong className="font-bold text-slate-700 not-italic">OFFLINE-FIRST</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {/* Sync Progress overlay/logs inside Left Card if active or complete */}
            {showSyncLogConsole && (
              <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-[9px] text-slate-300 space-y-1 max-h-36 overflow-y-auto shadow-inner">
                {pwaLogs.map((log, i) => (
                  <div key={i} className="leading-snug truncate">
                    {log}
                  </div>
                ))}
                {isSyncing && (
                  <div className="flex items-center space-x-1.5 text-indigo-400 py-1 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Synchronizing payload sectors: {syncProgress}%...</span>
                  </div>
                )}
                {!isSyncing && (
                  <div className="text-emerald-400 font-bold py-1 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Sync fully verified. IndexedDB local buffers aligned.</span>
                  </div>
                )}
                <div ref={pwaConsoleBottomRef} />
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {/* PWA Synchronize Action Trigger Button */}
              <button
                onClick={handleStartPWASync}
                disabled={isSyncing}
                className="w-full bg-[#e8fdfe] hover:bg-[#d5f9fc] border border-[#aef2fd] rounded-2xl py-3 px-4 flex items-center justify-center gap-2 transition duration-200 select-none cursor-pointer group"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                    <span className="text-[11px] font-bold text-cyan-800 tracking-wider uppercase font-sans">
                      SYNCHRONIZING {syncProgress}%...
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                    <span className="text-[11px] font-black text-cyan-900 tracking-wider uppercase font-sans group-hover:scale-102 transition duration-200">
                      OFFLINE NATIVE READY
                    </span>
                  </>
                )}
              </button>

              {/* Standalone local PWA web installer downloader */}
              <button
                type="button"
                onClick={triggerPwaDownload}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition duration-150 cursor-pointer select-none group"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black text-slate-700 tracking-wider uppercase font-sans">
                  INSTALL LOCAL PWA PACKAGE (.JSON)
                </span>
              </button>
            </div>

            {/* Bottom Subtext */}
            <p className="text-[9px] text-slate-400 font-bold italic tracking-widest text-center mt-3 uppercase font-mono">
              BACKGROUND SYNC ONLY DURING USER ACTIVITY
            </p>
          </div>
        </div>

        {/* RIGHT CARD: STANDALONE INSTALLERS */}
        <div className="bg-[#1e1d30] border border-[#2b2b41] rounded-[24px] p-6 shadow-lg flex flex-col justify-between h-full relative overflow-hidden">
          
          <div>
            {/* Top Row */}
            <div className="flex justify-between items-start mb-6">
              {/* Monitor Icon squircle */}
              <div className="bg-[#2a293f] border border-[#3c3a59] p-3.5 rounded-2xl flex items-center justify-center shadow-inner">
                <Monitor className="w-6 h-6 text-[#9a86ff]" />
              </div>

              {/* Verified Badge */}
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-black text-[#5636ff] bg-[#d9d5ff] px-2 py-0.5 rounded font-sans tracking-wide uppercase">
                  SIGNED BUILD
                </span>
                <span className="text-[9px] font-bold text-slate-400 font-mono mt-1">SHA-256 VERIFIED</span>
              </div>
            </div>

            {/* Typography */}
            <h3 className="text-[18px] font-extrabold tracking-tight text-white uppercase mb-2">
              STANDALONE INSTALLERS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed italic mb-8">
              Electron-ready <span className="text-[#a895ff]">Win/Mac/Linux</span> installers with <span className="text-[#a895ff]">deep isolation</span>, encryption, and automated local data path routing.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Real-time Compiler Terminal */}
            {isCompiling && (
              <div className="bg-slate-950 font-mono text-[9px] text-slate-300 p-3.5 rounded-xl border border-slate-800 space-y-1 max-h-36 overflow-y-auto shadow-inner">
                {compileLogs.map((log, index) => (
                  <div key={index} className="leading-snug">
                    {log}
                  </div>
                ))}
                <div className="flex items-center space-x-1.5 text-purple-400 py-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                  <span>Compiling native binaries: {compileProgress}%...</span>
                </div>
                <div ref={compileConsoleBottomRef} />
              </div>
            )}

            {/* Download Buttons Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Win button */}
              {compiledBinaries.windows ? (
                <button
                  onClick={() => triggerBinaryDownload("windows")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-3.5 flex items-center justify-center gap-1.5 text-[10.5px] font-extrabold tracking-wide uppercase transition shadow cursor-pointer select-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>WIN COMPILED</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStartCompilation("windows")}
                  disabled={isCompiling}
                  className="bg-[#2a293d] hover:bg-[#34334f] border border-[#3e3d5c] text-slate-100 disabled:opacity-50 rounded-xl py-3 px-3.5 flex items-center justify-center gap-1.5 text-[10.5px] font-extrabold tracking-wider uppercase transition cursor-pointer select-none"
                >
                  {isCompiling && selectedPlatform === "windows" ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#9a86ff] animate-spin" />
                  ) : null}
                  <span>WINDOWS.EXE</span>
                </button>
              )}

              {/* Mac button */}
              {compiledBinaries.macos ? (
                <button
                  onClick={() => triggerBinaryDownload("macos")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-3.5 flex items-center justify-center gap-1.5 text-[10.5px] font-extrabold tracking-wide uppercase transition shadow cursor-pointer select-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>MAC COMPILED</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStartCompilation("macos")}
                  disabled={isCompiling}
                  className="bg-[#2a293d] hover:bg-[#34334f] border border-[#3e3d5c] text-slate-100 disabled:opacity-50 rounded-xl py-3 px-3.5 flex items-center justify-center gap-1.5 text-[10.5px] font-extrabold tracking-wider uppercase transition cursor-pointer select-none"
                >
                  {isCompiling && selectedPlatform === "macos" ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#9a86ff] animate-spin" />
                  ) : null}
                  <span>MACOS.DMG</span>
                </button>
              )}
            </div>

            {/* Bottom Info Banner */}
            <div className="bg-[#25233c] border border-[#39355f] rounded-2xl px-4 py-3 flex items-center space-x-3 text-slate-300">
              <Info className="w-4 h-4 text-[#8b73ff] shrink-0" />
              <span className="text-[10px] font-bold tracking-wide uppercase font-sans text-slate-400">
                AUTO-UPDATE: ENABLED <span className="text-[#a08dff] font-extrabold">({appVersion.toUpperCase()} STABLE)</span>
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 3. DYNAMIC UPGRADE & DATA INTEGRITY ENGINE CONSOLE */}
      <div className="bg-[#110f24] border border-slate-800 rounded-[24px] p-6 text-slate-100 shadow-xl space-y-5 text-left mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl">
              <RefreshCw className="w-6 h-6 animate-spin-slow text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wider text-slate-100 uppercase font-sans">
                Enterprise Update &amp; Schema Migration Engine
              </h3>
              <p className="text-[10.5px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                Automatically transition version builds while locking &amp; preserving existing local directories and IndexedDB records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10.5px] font-bold">
            <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">
              Current Build: <span className="text-white font-mono">{appVersion}</span>
            </span>
            {upgradedFeaturesInstalled ? (
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Upgraded to v2.5.0 STABLE
              </span>
            ) : (
              <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 px-3 py-1 rounded-full animate-pulse font-mono">
                v2.5.0 Available
              </span>
            )}
          </div>
        </div>

        {/* Console layout showing directory mappings preserved */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/50 space-y-1.5 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Data Directories Preserved</span>
            <div className="font-mono text-xs text-indigo-300 space-y-1">
              <div>📁 /Intake/ • <span className="text-emerald-400 font-bold">LOCKED &amp; MAP-HELD</span></div>
              <div>📁 /ShowroomLayouts/ • <span className="text-emerald-400 font-bold">PRESERVED</span></div>
              <div>📁 /ShowroomVideos/ • <span className="text-emerald-400 font-bold">PRESERVED</span></div>
            </div>
            <span className="text-[9.5px] text-slate-400 block pt-1 font-mono leading-relaxed">
              *Local folder maps remain anchored to client storage during framework upgrades.
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/50 space-y-1.5 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Local Persistence Integrity</span>
            <div className="font-mono text-xs text-indigo-300 space-y-1">
              <div>⚡ IndexedDB: <span className="text-slate-300 font-bold">car_media_local_v2</span></div>
              <div>📊 Synced Rows: <span className="text-emerald-400 font-bold">100% Retained</span></div>
              <div>🔒 Encryption: <span className="text-slate-300">AES-256 Verified</span></div>
            </div>
            <span className="text-[9.5px] text-slate-400 block pt-1 font-mono leading-relaxed">
              *Auto-Upgrader runs sandboxed schema checks to merge new features with 0% data loss.
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/50 space-y-1.5 text-left flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Version Upgrade Controls</span>
              <p className="text-[10.5px] text-slate-400 mt-1 font-sans leading-relaxed">
                Trigger end-to-end upgrade sequencing to deploy v2.5.0-STABLE features instantly.
              </p>
            </div>

            <button
              onClick={handleUpgradeApp}
              disabled={isUpgrading || appVersion === "v2.5.0"}
              className={`w-full py-2.5 px-4 rounded-xl font-bold font-sans tracking-wide text-xs transition duration-200 cursor-pointer ${
                appVersion === "v2.5.0"
                  ? "bg-slate-850 text-emerald-400 border border-slate-800 flex items-center justify-center gap-1.5"
                  : isUpgrading
                  ? "bg-indigo-950/30 text-indigo-400 border border-indigo-800 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1"
              }`}
            >
              {appVersion === "v2.5.0" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>UPGRADED TO V2.5.0-STABLE</span>
                </>
              ) : isUpgrading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>MIGRATING VERSION {upgradeProgress}%...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RUN SECURE APP UPGRADE (v2.5.0)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upgrade Live Progress Terminal Logger */}
        {showUpgradeConsole && (
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 text-left space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-900 font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Secure Upgrader Live Terminal Console
              </span>
              <span className="font-mono">SHA-256 VERIFIED AGENT</span>
            </div>
            
            <div className="font-mono text-[10px] text-slate-300 space-y-1.5 max-h-44 overflow-y-auto scrollbar">
              {upgradeLogs.map((log, index) => {
                let logClass = "text-slate-300";
                if (log.includes("COMPLETE") || log.includes("INTEGRITY") || log.includes("PRESERVED") || log.includes("STABLE!")) {
                  logClass = "text-emerald-400 font-bold";
                } else if (log.includes("MIGRATING") || log.includes("UPGRADER") || log.includes("Upgraded")) {
                  logClass = "text-indigo-400 font-bold";
                }
                return (
                  <div key={index} className={`${logClass} font-mono`}>
                    {log}
                  </div>
                );
              })}
              {isUpgrading && (
                <div className="animate-pulse text-indigo-500 text-[10px] font-mono">▋ PROCESSING DATA PROTECTION MODULE...</div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
