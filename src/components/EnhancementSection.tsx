import React, { useState, useEffect } from "react";
import { Sparkles, Sliders, Image, Video, ShieldCheck, Play, Pause, Volume2, Sparkle, AlertTriangle } from "lucide-react";
import { ActiveEnhancements, CarAnalysisResult } from "../types";

interface EnhancementProps {
  analysis: CarAnalysisResult;
  images: { main: string; top: string; bottom: string; left: string; right: string };
  enhancements: ActiveEnhancements;
  setEnhancements: React.Dispatch<React.SetStateAction<ActiveEnhancements>>;
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  onNext: () => void;
}

export default function EnhancementSection({ analysis, images, enhancements, setEnhancements, addAuditLog, onNext }: EnhancementProps) {
  const [tuningMode, setTuningMode] = useState<"photo" | "video">("photo");
  const [showOriginal, setShowOriginal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Video Simulation States
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [videoTime, setVideoTime] = useState(3.4);

  // Rotate video frames every 3 seconds for dynamic short montage simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveClipIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle continuous video timeline simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoTime((prev) => {
        if (prev >= 15) return 0;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSliderChange = (key: keyof ActiveEnhancements, val: number | boolean) => {
    setEnhancements(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const applyEnhancements = () => {
    setIsApplying(true);
    addAuditLog("INFO", "ENHANCE", `Applying digital enhancement filters: photo sharpening, smart background clipping, noise reduction.`);
    addAuditLog("INFO", "ENHANCE", `Compiling video quality improvements: stabilization grid, audio-noise isolators, watermark embedding.`);
    
    setTimeout(() => {
      setIsApplying(false);
      addAuditLog("SUCCESS", "ENHANCE", `Quality parameters validated. Media files synchronized.`);
      onNext();
    }, 1200);
  };

  // Generate CSS filter based on slider states for photo calibration
  const getFilterStyle = (isOriginalOverride = false) => {
    if (isOriginalOverride) return {};
    return {
      filter: `brightness(${enhancements.brightness}%) contrast(${enhancements.contrast}%) saturate(${enhancements.brightness > 100 ? 105 : 100}%) blur(${enhancements.denoise ? "0.3px" : "0px"})`,
      transition: "filter 0.2s ease-all"
    };
  };

  // Generate CSS style for video player based on video contrast/brightness
  const getVideoFilterStyle = () => {
    return {
      filter: `brightness(${enhancements.videoBrightness}%) contrast(${enhancements.videoContrast}%)`,
      transition: "filter 0.2s ease-all"
    };
  };

  const videoClips = [
    { title: "Dynamic Pan Intro", url: images.main, duration: "3s" },
    { title: "Sleek Side Rotation", url: images.left, duration: "4s" },
    { title: "Premium Wheel Detail", url: images.bottom, duration: "4s" },
    { title: "Rear Exhaust Rumble", url: images.right, duration: "4s" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md" id="enhancement-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-wide">Step 2: Media Quality Enhancers</h2>
            <p className="text-slate-500 text-xs text-left">
              Calibrate and upscale both photo profiles & vertical TikTok/Reels video footage automatically.
            </p>
          </div>
        </div>
        
        {/* Toggle switches between Photo and Video Workspace */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setTuningMode("photo")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition duration-250 cursor-pointer ${
              tuningMode === "photo"
                ? "bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>📸 Photo Tuning</span>
          </button>
          <button
            onClick={() => setTuningMode("video")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition duration-250 cursor-pointer ${
              tuningMode === "video"
                ? "bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎥 Video Tuning</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: COMPARISON OR SIMULATION VIEWER */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {tuningMode === "photo" ? (
            // PHOTO PREVIEW WORKSPACE
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 text-left block">
                  {showOriginal ? "Showing: Original Intake Photo" : "Showing: AI-Tuned Studio Photo"}
                </span>
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-755 border border-slate-300 px-3 py-1.5 rounded-lg font-semibold transition active:scale-95 select-none hover:cursor-pointer"
                >
                  Hold to Compare Original
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center group shadow-inner">
                {/* Showroom visual grid overlay if BG removed is active */}
                {!showOriginal && enhancements.bgRemoved && (
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 z-0">
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-slate-900/40 blur-md rounded-t-full transform scale-x-125 z-0 border-t border-indigo-900/15"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
                  </div>
                )}

                {/* Primary preview image */}
                <img
                  src={images.main}
                  alt="Intelligent Tuned View"
                  style={getFilterStyle(showOriginal)}
                  className={`max-full max-h-full object-contain relative z-10 transition-transform duration-300 ${
                    !showOriginal && enhancements.bgRemoved ? "scale-90" : "scale-100"
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Accent highlights representing sharpness */}
                {!showOriginal && enhancements.sharpness > 40 && (
                  <div 
                    className="absolute inset-0 pointer-events-none border border-indigo-500/10 z-20 mix-blend-color-dodge opacity-50"
                    style={{ filter: "contrast(140%) brightness(105%)" }}
                  />
                )}

                {/* Watermark preview */}
                <span className="absolute bottom-3 right-4 font-display text-[9px] tracking-widest text-white/20 select-none z-20">
                  SMARTBNB AUTO SHOWCASE
                </span>

                {/* Dynamic noise reduction filter simulation */}
                {!showOriginal && !enhancements.denoise && (
                  <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.08%22/></svg>')] opacity-45 z-20" />
                )}
              </div>

              {/* Angle selector panel */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Top (Cabin View)", url: images.top },
                  { label: "Bottom (Alloy Rims)", url: images.bottom },
                  { label: "Left Profile", url: images.left },
                  { label: "Right Structure", url: images.right }
                ].map((sub, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-1 border border-slate-200 flex flex-col items-center">
                    <img
                      src={sub.url}
                      alt={sub.label}
                      style={getFilterStyle(showOriginal)}
                      className="w-full h-12 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] text-slate-500 mt-1 truncate w-full text-center">{sub.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // VIDEO SIMULATION WORKSPACE (VERT REELS TIMELINE PREVIEW)
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                  <span>Interactive Real-time Video Slate: 9:16 Auto Showcase Montage</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">0:15 Reels Blueprint</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-slate-50 p-4 border border-slate-200 rounded-xl">
                {/* 9:16 Phone Canvas representation */}
                <div className="md:col-span-5 flex justify-center">
                  <div className={`w-48 aspect-[9/16] rounded-2xl border-4 border-slate-300 bg-slate-100 overflow-hidden relative flex flex-col justify-between shadow-lg relative ${
                    !enhancements.videoStabilize ? "animate-bounce" : ""
                  }`} style={{ animationDuration: "1.2s", transform: "translateY(1px)" }}>
                    {/* Live Badge and stabilization indicator */}
                    <div className="absolute top-2 left-2 z-30 flex items-center space-x-1">
                      <span className="text-[8px] bg-red-600 text-white font-bold px-1 rounded">LIVE PREVIEW</span>
                      {enhancements.videoStabilize ? (
                        <span className="text-[8px] bg-emerald-950 text-emerald-400 font-semibold px-1 rounded border border-emerald-800/40">✓ STABILIZED</span>
                      ) : (
                        <span className="text-[8px] bg-amber-950 text-amber-400 font-semibold px-1 rounded border border-amber-800/40 animate-pulse">▲ SHAKY FRAME</span>
                      )}
                    </div>

                    {/* Active Montage Clip Frame */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 transition-transform duration-200">
                      {/* Panoramic slow pan panning simulation */}
                      <img
                        src={videoClips[activeClipIndex].url}
                        alt="Reels simulated source"
                        style={getVideoFilterStyle()}
                        className={`w-full h-full object-cover relative transition-transform duration-[2800ms] ease-out ${
                          isPlaying ? "scale-115 translate-x-1" : "scale-100"
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark gradient mapping on video */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/40 z-20"></div>
                    </div>

                    {/* Watermark overlay dynamically stamped */}
                    {enhancements.videoWatermark && (
                      <div className="absolute top-2 right-2 bg-slate-950/80 border border-slate-800 text-white font-bold text-[8px] tracking-wide px-1.5 py-0.5 rounded z-30 uppercase">
                        Auto Showcase Agent
                      </div>
                    )}

                    {/* Video Text Prompts / CTA Center overlays */}
                    <div className="absolute bottom-10 left-3 right-3 z-30 text-left">
                      <span className="bg-indigo-600 text-white font-sans font-bold text-[8px] px-1 rounded tracking-wide uppercase">
                        AI AUTONOMOUS SHOT
                      </span>
                      <h4 className="text-[11px] font-bold text-white tracking-wide mt-1 drop-shadow-md">
                        {analysis.detectedYear} {analysis.detectedMake} {analysis.detectedModel}
                      </h4>
                      <p className="text-[8px] text-zinc-350 line-clamp-2 mt-0.5 whitespace-pre-wrap leading-tight drop-shadow-sm">
                        {analysis.marketingPitch}
                      </p>
                      
                      <div className="flex items-center space-x-1.5 mt-2 bg-slate-950/60 p-1 rounded-md border border-slate-800/50 backdrop-blur-xs">
                        <Volume2 className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" />
                        {enhancements.videoCleanAudio ? (
                          <span className="text-[7.5px] text-green-400 font-semibold truncate animate-pulse">✓ Dynamic Noise Gate: Core Engine Audio Clear</span>
                        ) : (
                          <span className="text-[7.5px] text-slate-400 truncate">Saturated Wind Noise Active</span>
                        )}
                      </div>
                    </div>

                    {/* Active Track Duration Timeline */}
                    <div className="absolute bottom-1.5 inset-x-2 h-1 bg-slate-800 rounded z-30 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded transition-all duration-100"
                        style={{ width: `${(videoTime / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Video Playback State controls */}
                <div className="md:col-span-7 flex flex-col justify-center space-y-4 text-left">
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h5 className="text-xs font-bold text-slate-800 font-sans">Video Sequencer Information</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      The AI agent compiles 4 core media tracks inside a high-impact 9:16 reels format with transition cross-fades automatically, stamping the detected vehicle specifications.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Montage Timetable</span>
                    <div className="space-y-1 text-[10px]">
                      {videoClips.map((clip, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-1.5 rounded border ${
                            activeClipIndex === idx 
                              ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-bold"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="font-medium truncate block max-w-[140px]">{clip.title}</span>
                          <span className="font-mono text-[9px] shrink-0">Clarity Metric: {analysis.clarityScore}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Play & Pause simulation togglers */}
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      Timeline Progress: {videoTime}s / 15.0s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
            {/* RIGHT COLUMN: ENHANCEMENT QUALITY CALIBRATION SLIDERS */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {tuningMode === "photo" ? (
              // SLIDERS FOR PHOTO WORKFLOW
              <div className="space-y-6 text-left">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Photo Correction Parameters</span>
                </h3>

                {/* Brightness Correction */}
                <div className="block">
                  <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                    <span>Auto-Brightness Tune</span>
                    <span className="font-mono text-indigo-700">{enhancements.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={enhancements.brightness}
                    onChange={(e) => handleSliderChange("brightness", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 accent-indigo-500 rounded-lg cursor-pointer animate-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Recommended: 110% to eliminate dark source glare.</span>
                </div>

                {/* Contrast Balance */}
                <div className="block">
                  <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                    <span>Contrast Mapping</span>
                    <span className="font-mono text-indigo-700">{enhancements.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={enhancements.contrast}
                    onChange={(e) => handleSliderChange("contrast", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 accent-indigo-500 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Optimizes shadow levels for metallic car coat highlights.</span>
                </div>

                {/* Sharpness Adjustment */}
                <div className="block">
                  <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                    <span>Smart Edge Sharpness</span>
                    <span className="font-mono text-indigo-700">+{enhancements.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={enhancements.sharpness}
                    onChange={(e) => handleSliderChange("sharpness", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 accent-indigo-500 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Enhances logo clarity and body lines crisply.</span>
                </div>

                {/* Photo Toggles */}
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Showroom Automation filters</h4>

                  {/* Denoise Checkbox */}
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={enhancements.denoise}
                      onChange={(e) => handleSliderChange("denoise", e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Denoise Correction Filter</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">Smooths grain from low light and high ISO sensors.</span>
                    </div>
                  </label>

                  {/* Showroom BG Checkbox */}
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={enhancements.bgRemoved}
                      onChange={(e) => handleSliderChange("bgRemoved", e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Digital Studio Background Swap</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">Removes street clutter, centering the vehicle in a pristine grid room.</span>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              // SLIDERS/TOGGLES FOR VIDEO WORKFLOW
              <div className="space-y-6 text-left animate-fade-in">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Video Correction Parameters</span>
                </h3>

                {/* Brightness Tuning */}
                <div className="block">
                  <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                    <span>Exposure Gain (Video)</span>
                    <span className="font-mono text-indigo-700">{enhancements.videoBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={enhancements.videoBrightness}
                    onChange={(e) => handleSliderChange("videoBrightness", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 accent-indigo-500 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Smooths exposure levels dynamically during rotation pans.</span>
                </div>

                {/* Contrast Tuning */}
                <div className="block">
                  <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                    <span>Dynamic Range Contrast</span>
                    <span className="font-mono text-indigo-700">{enhancements.videoContrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={enhancements.videoContrast}
                    onChange={(e) => handleSliderChange("videoContrast", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 accent-indigo-500 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Video Checkboxes */}
                <div className="border-t border-slate-100 mt-4 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Video Pipeline Automations</h4>

                  {/* Stabilization */}
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 hover:border-slate-305 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={enhancements.videoStabilize}
                      onChange={(e) => handleSliderChange("videoStabilize", e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Gyroscopic Video Stabilization</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">Smooths hand sway or wind vibration dynamically.</span>
                    </div>
                  </label>

                  {/* Clean Audio noise cancel */}
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 hover:border-slate-305 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={enhancements.videoCleanAudio}
                      onChange={(e) => handleSliderChange("videoCleanAudio", e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Clean Audio & Rumble Supression</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">Filters out ambient street noise while retaining raw exhaust bass rumble.</span>
                    </div>
                  </label>

                  {/* Branding Watermark */}
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 hover:border-slate-305 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={enhancements.videoWatermark}
                      onChange={(e) => handleSliderChange("videoWatermark", e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Watermark Logo "Auto Showcase Agent"</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">Stamps our professional watermark strictly on lower third overlay boundaries.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Primary Save & Compile button */}
          <button
            onClick={applyEnhancements}
            disabled={isApplying}
            className="w-full bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer disabled:bg-slate-250 disabled:text-slate-450 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition mt-6 text-center shadow-md transition-all"
            id="apply-enhancements-btn"
          >
            {isApplying ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Synchronizing Photos & Videos...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save Enhanced Assets & Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
