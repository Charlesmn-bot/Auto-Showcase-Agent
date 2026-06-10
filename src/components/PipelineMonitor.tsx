import React, { useState } from "react";
import { FolderOpen, Database, RefreshCw, Layers, ArrowRight, Clock, ToggleLeft, ToggleRight, CheckCircle, Smartphone } from "lucide-react";
import { AuditLogEntry } from "../types";

interface PipelineMonitorProps {
  folderCounts: {
    carMedia: number;
    showroomLayouts: number;
    showroomVideos: number;
    communityMedia: number;
    communityLayouts: number;
    published: number;
  };
  auditLogsCount: number;
  activeTab: number;
  onRefreshWatcher: () => void;
}

export default function PipelineMonitor({ folderCounts, auditLogsCount, activeTab, onRefreshWatcher }: PipelineMonitorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>("In sync with Local Filesystem");

  const runWatcherCycle = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString());
      onRefreshWatcher();
    }, 1100);
  };

  if (!isOpen) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm" id="pipeline-monitor-minimized">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-xs font-bold font-sans text-slate-800 uppercase tracking-wider">
              CarShowcaseApp Core Watcher System
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              DB Name: <span className="text-slate-700 font-semibold">local_database.db (SQLite)</span> | Threads: 2 active
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-indigo-700 hover:text-indigo-850 font-bold cursor-pointer py-1 px-3 bg-indigo-50 rounded-lg border border-indigo-100 transition whitespace-nowrap"
        >
          Expand Watcher Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 transition-all text-left shadow-md space-y-4" id="pipeline-monitor">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-slate-850 uppercase tracking-wide flex items-center gap-2">
              <span>CarShowcaseApp Core Monitoring Pipeline</span>
              <span className="text-[9px] bg-indigo-50 text-indigo-650 font-mono px-2 py-0.5 rounded-full font-bold border border-indigo-100">SQLite-Engaged</span>
            </h3>
            <p className="text-[10.5px] text-slate-500 font-mono">
              Active Loop Watcher mapping file movements to respective listing channels.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={runWatcherCycle}
            disabled={isScanning}
            className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white hover:cursor-pointer disabled:text-slate-400 transition rounded-lg text-[10px] font-bold font-mono uppercase flex items-center space-x-1 shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning folders..." : "Force Loop Watcher"}</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[10px] text-slate-500 hover:text-slate-800 font-bold py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg transition hover:cursor-pointer shadow-sm"
          >
            Minimize
          </button>
        </div>
      </div>

      {/* Grid of database & folders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* SQL DB Status */}
        <div className="md:col-span-4 bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold pb-1.5 border-b border-slate-150">
            <span className="text-slate-705 flex items-center gap-1.5 font-sans uppercase text-[10.5px] tracking-wider">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>local_database (SQLite)</span>
            </span>
            <span className="text-[9px] text-emerald-600 font-bold font-mono">ONLINE</span>
          </div>

          <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
            <div className="flex justify-between">
              <span>Connection URI:</span>
              <span className="text-indigo-700 font-semibold">sqlite:local.db</span>
            </div>
            <div className="flex justify-between">
              <span>Database state:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> Initialized
              </span>
            </div>
            <div className="flex justify-between">
              <span>Operational logs in DB:</span>
              <span className="text-slate-700 font-bold">{auditLogsCount} entries</span>
            </div>
          </div>

          {/* SQLite table indicator matrix */}
          <div className="border border-slate-200 rounded p-2 bg-slate-100/50 font-mono text-[9px] text-slate-605 space-y-1 block">
            <div className="text-[8px] text-indigo-705 uppercase tracking-widest block font-extrabold mb-1">SQLite Table Schema Matrix</div>
            <div className="flex justify-between"><span>tbl_vehicles:</span> <span className="text-indigo-650 font-bold">3 records</span></div>
            <div className="flex justify-between"><span>tbl_enhancements:</span> <span className="text-indigo-650 font-bold">1 template</span></div>
            <div className="flex justify-between"><span>tbl_social_posts:</span> <span className="text-indigo-650 font-bold">{auditLogsCount > 3 ? "2 entries" : "0 entries"}</span></div>
          </div>
        </div>

        {/* Directory Folder counts and indicators */}
        <div className="md:col-span-8 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <FolderOpen className="w-4 h-4 text-indigo-600" />
            <span>Monitored Workspace Directory Trees</span>
          </span>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { path: "Car Media/", desc: "Raw input clips/images", qty: folderCounts.carMedia, color: "#a855f7" },
              { path: "Community Media/", desc: "User uploads feedback", qty: folderCounts.communityMedia, color: "#f59e0b" },
              { path: "Showroom Layouts/", desc: "1200x800 collage PNGs", qty: folderCounts.showroomLayouts, color: "#6366f1" },
              { path: "Showroom Videos/", desc: "15s Reel/Revue MP4s", qty: folderCounts.showroomVideos, color: "#0284c7" },
              { path: "Community Layouts/", desc: "Responsibility collages", qty: folderCounts.communityLayouts, color: "#ec4899" },
              { path: "Published/", desc: "Successfully synced archives", qty: folderCounts.published, color: "#10b981" }
            ].map((dir, i) => (
              <div 
                key={i} 
                className={`bg-white p-3 rounded-lg border border-slate-200 relative overflow-hidden transition-all duration-300 ${isScanning ? "ring-1 ring-indigo-505 animate-pulse" : ""}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold font-mono tracking-tight text-slate-800 block truncate w-4/5 leading-none">
                    {dir.path}
                  </span>
                  {/* Subtle color highlight dot */}
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dir.color }}></span>
                </div>
                <span className="text-[9px] text-slate-500 block font-mono mt-1 leading-tight line-clamp-1">{dir.desc}</span>
                <div className="flex items-end justify-between mt-3 font-mono">
                  <span className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">Inodes</span>
                  <span className="text-base font-bold tracking-tight" style={{ color: dir.qty > 0 ? dir.color : "#94a3b8" }}>
                    {dir.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Loop process timeline flow illustration */}
          <div className="pt-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cron Loop Cycles scheduled inside system timing thread</span>
              </span>
              <span className="text-indigo-600 pl-1.5 font-bold">Watch Time Sync: {lastScanTime}</span>
            </div>
            
            {/* Visual step pipeline flow badges */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 mt-2.5">
              {[
                { label: "Check Folder", num: 1 },
                { label: "Malware Clean", num: 2 },
                { label: "Vision Detect", num: 3 },
                { label: "Studio Collage", num: 4 },
                { label: "Bespoke Video", num: 5 },
                { label: "09:00/12:00 Schedules", num: 6 }
              ].map((step, idx) => {
                const isStepActive = activeTab >= step.num;
                return (
                  <React.Fragment key={idx}>
                    <div className={`py-1 px-2.5 rounded-full text-[9px] font-bold font-mono tracking-wide flex items-center transition duration-300 ${
                      isStepActive 
                        ? "bg-indigo-600 text-white shadow shadow-indigo-600/10 border border-indigo-500" 
                        : "bg-slate-100 text-slate-500 border border-slate-205"
                    }`}>
                      <span>{step.label}</span>
                    </div>
                    {idx < 5 && <ArrowRight className="w-2.5 h-2.5 text-slate-300 hidden sm:block" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
