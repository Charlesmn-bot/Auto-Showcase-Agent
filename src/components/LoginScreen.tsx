import React, { useState, useRef } from "react";
import { Shield, FolderOpen, UploadCloud, CheckCircle, ArrowRight, Info, Library, Laptop } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse folder name and count files from local directory picker
  const handleFolderSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      
      // Determine folder name from the relative webkit path
      let folderName = "Local Media Folder";
      const firstFilePath = files[0].webkitRelativePath;
      if (firstFilePath) {
        const parts = firstFilePath.split("/");
        if (parts.length > 0) {
          folderName = parts[0];
        }
      }

      setTimeout(() => {
        setSelectedFolder(folderName);
        setFileCount(files.length);
        setIsLoading(false);
        
        // Save states to local storage to persist the link
        try {
          localStorage.setItem("linkedFolderName", folderName);
          localStorage.setItem("isLinkedToCommonFolder", "true");
        } catch (err) {
          console.warn("Storage write failed", err);
        }
      }, 700);
    }
  };

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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      // Fallback for drag-and-drop (relative path might not contain folder details in custom files drop)
      let folderName = "Dropped Media Source";
      if (files[0].name) {
        folderName = "Local Media Folder";
      }

      setTimeout(() => {
        setSelectedFolder(folderName);
        setFileCount(files.length);
        setIsLoading(false);
        try {
          localStorage.setItem("linkedFolderName", folderName);
          localStorage.setItem("isLinkedToCommonFolder", "true");
        } catch (err) {}
      }, 750);
    }
  };

  const triggerPicker = () => {
    fileInputRef.current?.click();
  };

  const handleConnectWithDefault = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        localStorage.setItem("linkedFolderName", "CarMedia/Intake");
        localStorage.setItem("isLinkedToCommonFolder", "true");
      } catch (err) {}
      onLoginSuccess();
    }, 400);
  };

  const handleProceed = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#05040a] flex items-center justify-center p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      {/* Background radial glow styling */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container mimicking pixel-perfect dashboard style */}
      <div className="w-full max-w-5xl bg-[#090714] rounded-3xl border border-slate-900/45 shadow-2xl shadow-black/80 flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[580px]">
        
        {/* LEFT BRAND PANEL */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#0c1824] via-[#050912] to-[#010205] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-900/30">
          {/* Subtle dot pattern */}
          <div 
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1.5px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-emerald-600/90 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 border border-emerald-400/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-base font-bold tracking-tight">SMedia Auto Post</h2>
              <span className="text-[9.5px] uppercase tracking-widest text-emerald-400 font-extrabold block mt-0.5">
                LOCAL SOURCE GATEWAY
              </span>
            </div>
          </div>

          <div className="relative z-10 my-10 md:my-auto text-left">
            <h1 className="text-white text-3xl sm:text-[38px] font-black tracking-tight leading-[1.1]">
              Link Your <br />
              Local Media <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 filter drop-shadow-[0_2px_15px_rgba(52,211,153,0.2)]">
                Directory.
              </span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-[12.5px] leading-relaxed mt-5 font-medium max-w-xs">
              Connect a photos and videos directory on your local computer to synchronize and analyze your automotive assets instantly.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-slate-500 font-mono tracking-wide flex items-center gap-2">
            <Laptop className="w-3.5 h-3.5 text-slate-500" />
            <span>STANDALONE LOCAL ENVIRONMENT</span>
          </div>
        </div>

        {/* RIGHT INTERACTIVE ZONE */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-[#07050e] relative">
          
          <div className="max-w-md w-full mx-auto space-y-7">
            <div>
              <h2 className="text-white text-2.5xl font-black tracking-tight font-sans text-left">
                Select Common Folder
              </h2>
              <p className="text-emerald-400 text-[10px] font-mono font-black tracking-widest uppercase mt-2 flex items-center gap-1.5 justify-start">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                DIRECTORY CONFIGURATION STAGE
              </p>
            </div>

            {/* Hidden native input with directory picker capability */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFolderSelection}
              className="hidden"
              {...({
                webkitdirectory: "",
                directory: "",
                multiple: true
              } as any)}
            />

            {/* Folder selection drop & select target area */}
            {!selectedFolder ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerPicker}
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer select-none group min-h-[220px] ${
                  dragActive 
                    ? "border-emerald-500 bg-emerald-950/10 shadow-lg shadow-emerald-500/5" 
                    : "border-[#1e1a3b] bg-[#0c0a1a] hover:bg-[#120f28] hover:border-[#382f70]"
                }`}
              >
                <div className="p-4 bg-emerald-950/20 text-emerald-400 rounded-2.5xl border border-emerald-900/30 group-hover:scale-105 transition-transform duration-300">
                  {isLoading ? (
                    <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-emerald-400 animate-bounce" />
                  )}
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-white text-xs font-bold font-sans">
                    {isLoading ? "Reading local media..." : "Click to select local media folder"}
                  </p>
                  <p className="text-slate-500 text-[10.5px] max-w-[280px] leading-relaxed mx-auto">
                    Directs the application to your computer's pictures or dealership subfolders.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/15 border border-emerald-800/40 rounded-3xl p-6 space-y-5 animate-fade-in text-left">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shrink-0">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-white text-xs font-black tracking-wide uppercase">FOLDER CONNECTED</h4>
                    <p className="text-emerald-300 text-sm font-mono font-extrabold truncate">
                      {selectedFolder}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {fileCount} high-resolution vehicle photos enqueued in local memory.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-950/30 px-3.5 py-2.5 rounded-xl border border-emerald-800/25 text-[10.5px] text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configured to automatically update layout sectors via dynamic local auto-scan.</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3.5 pt-1">
              {selectedFolder ? (
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <span className="text-[11px] uppercase tracking-widest font-black">
                    ENTER DEALERSHIP WORKSPACE
                  </span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={triggerPicker}
                  className="w-full relative group overflow-hidden bg-[#5a24f5] hover:bg-[#6c39ff] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer shadow-lg shadow-[#5a24f5]/20"
                >
                  <span className="text-[11px] uppercase tracking-widest font-black">
                    SELECT LOCAL DIRECTORY
                  </span>
                  <FolderOpen className="w-4 h-4 text-indigo-200" />
                </button>
              )}

              {/* Default setup preset option */}
              <button
                type="button"
                onClick={handleConnectWithDefault}
                disabled={isLoading}
                className="w-full bg-transparent hover:bg-[#121021] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 transition duration-200 cursor-pointer text-[10.5px] uppercase tracking-wider"
              >
                <Library className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Use default local preset (CarMedia/Intake)</span>
              </button>
            </div>

            {/* Bottom info tip */}
            <div className="bg-[#120f28]/40 border border-slate-900 px-4 py-3 rounded-2xl flex items-start space-x-2.5 text-left text-[10px] leading-relaxed text-slate-500">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Policy:</strong> Local directory indexing executes entirely within your browser sandboxed sandbox. No personal files are transmitted to external servers.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
