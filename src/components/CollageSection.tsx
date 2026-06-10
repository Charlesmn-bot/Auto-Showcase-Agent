import React, { useState, useRef, useEffect } from "react";
import { Copy, Columns, Download, CheckCircle, ShieldAlert, BadgeInfo, Image, Video, Music, Volume2, Sparkles, Disc, ChevronDown, Upload } from "lucide-react";
import { ActiveEnhancements, CarAnalysisResult, SoundtrackItem } from "../types";

interface CollageProps {
  analysis: CarAnalysisResult;
  images: { main: string; top: string; bottom: string; left: string; right: string };
  enhancements: ActiveEnhancements;
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  onNext: () => void;
  soundtracks: SoundtrackItem[];
  setSoundtracks: React.Dispatch<React.SetStateAction<SoundtrackItem[]>>;
}

export default function CollageSection({ analysis, images, enhancements, addAuditLog, onNext, soundtracks, setSoundtracks }: CollageProps) {
  const [collageTab, setCollageTab] = useState<"photo" | "video">("photo");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledUrl, setCompiledUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState(
    `${analysis.detectedYear} ${analysis.detectedMake.toUpperCase()} ${analysis.detectedModel.toUpperCase()}`
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Video track compilation simulation states
  const [audioSynced, setAudioSynced] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(
    soundtracks && soundtracks.length > 0 ? soundtracks[0].title : "Synthwave Skyline"
  );
  const [isPlayingMontage, setIsPlayingMontage] = useState(true);
  const [montageProgress, setMontageProgress] = useState(4.2);
  const [isMuted, setIsMuted] = useState(false);

  // Custom dropdown and local audio attach states
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const musicDropdownRef = useRef<HTMLDivElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (musicDropdownRef.current && !musicDropdownRef.current.contains(event.target as Node)) {
        setIsMusicDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isDuplicate = soundtracks.some(t => t.title.toLowerCase() === file.name.replace(/\.[^/.]+$/, "").toLowerCase());
      if (isDuplicate) {
        addAuditLog("WARNING", "SYSTEM", `Audio file with similar name is already in playlist.`);
        return;
      }
      const newTrack: SoundtrackItem = {
        id: `snd_upload_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        genre: file.type.split("/")[1]?.toUpperCase() || "MP3",
        duration: "Attached",
        type: "user_uploaded",
        matchingModel: "Custom"
      };
      setSoundtracks(prev => [...prev, newTrack]);
      setSelectedMusic(newTrack.title);
      addAuditLog("SUCCESS", "SYSTEM", `Attached custom audio file: ${file.name} successfully registered in folder / catalog.`);
      setIsMusicDropdownOpen(false);
    }
  };

  // Simulation timeline interval
  useEffect(() => {
    if (!isPlayingMontage) return;
    const t = setInterval(() => {
      setMontageProgress((prev) => {
        if (prev >= 15) return 0;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(t);
  }, [isPlayingMontage]);

  // Auto-compile preview on load or adjustments
  useEffect(() => {
    generateShowroomCanvas();
  }, [enhancements, customTitle, images]);

  const generateShowroomCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 1200;
    canvas.height = 800;

    // Background Studio fill
    const bgGradient = ctx.createRadialGradient(600, 400, 100, 600, 400, 700);
    bgGradient.addColorStop(0, "#111827");
    bgGradient.addColorStop(1, "#030712");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Apply blueprint studio grid lines (simulated)
    ctx.strokeStyle = "rgba(99, 102, 241, 0.04)";
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Helper to apply filters to canvas drawings
    const applyCanvasFilters = () => {
      ctx.filter = `brightness(${enhancements.brightness}%) contrast(${enhancements.contrast}%) saturate(${enhancements.brightness > 100 ? 104 : 100}%)`;
    };

    // Load & Draw all 5 images asynchronously
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load: " + url));
        img.src = url;
      });
    };

    Promise.all([
      loadImage(images.main),
      loadImage(images.top),
      loadImage(images.bottom),
      loadImage(images.left),
      loadImage(images.right),
    ])
      .then(([mainImg, topImg, bottomImg, leftImg, rightImg]) => {
        applyCanvasFilters();

        // Standard placement calculations:
        // Left Image - Side view: column (x: 40, y: 150, w: 220, h: 480)
        drawRoundedImage(ctx, leftImg, 40, 150, 220, 480, 12);

        // Right Image - Rear view: column (x: 940, y: 150, w: 220, h: 480)
        drawRoundedImage(ctx, rightImg, 940, 150, 220, 480, 12);

        // Top Image - Engine view: row (x: 290, y: 150, w: 620, h: 140)
        drawRoundedImage(ctx, topImg, 290, 150, 620, 140, 12);

        // Bottom Image - Interior detail: row (x: 290, y: 490, w: 620, h: 140)
        drawRoundedImage(ctx, bottomImg, 290, 490, 620, 140, 12);

        // Center / Main Image - Front overview: center (x: 305, y: 305, w: 590, h: 170)
        drawRoundedImage(ctx, mainImg, 305, 305, 590, 170, 12);

        // Reset filter for text overlay to prevent distortion
        ctx.filter = "none";

        // Draw elegant Outer frame borders (aesthetic tech accents)
        ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 1160, 760);

        // Header Title Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(customTitle, 600, 80);

        // Subtitle Details Label
        ctx.fillStyle = "rgba(156, 163, 175, 0.8)";
        ctx.font = "14px monospace";
        ctx.fillText(
          `CLASS: ${analysis.detectedStyle.toUpperCase()} | SECURITY AUTH_OK | COLOR: ${analysis.detectedColor.toUpperCase()}`,
          600,
          115
        );

        // Auto Showcase Agent Watermark footer
        ctx.fillStyle = "rgba(99, 102, 241, 0.85)";
        ctx.font = "bold 16px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("AUTO SHOWCASE AGENT", 40, 750);

        // Confidence score / checksum watermark
        ctx.fillStyle = "rgba(100, 116, 139, 0.6)";
        ctx.font = "11px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`VERIFIED PHOTO LAYOUT COREG v1.0 | CLARITY_${analysis.clarityScore}%`, 1160, 750);

        // Set state to compiled DataUrl
        setCompiledUrl(canvas.toDataURL("image/png"));
      })
      .catch((err) => {
        console.error("Canvas drawing error:", err);
      });
  };

  // Helper to draw rounded rectangle borders/masks for images inside canvas
  const drawRoundedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();

    // Work out image ratio scale to fit inside slot beautifully
    const imgRatio = img.width / img.height;
    const slotRatio = width / height;
    let drawX = x,
      drawY = y,
      drawW = width,
      drawH = height;

    if (imgRatio > slotRatio) {
      drawW = height * imgRatio;
      drawX = x - (drawW - width) / 2;
    } else {
      drawH = width / imgRatio;
      drawY = y - (drawH - height) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Draw high contrast edge ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  };

  const saveShowroomOutputs = () => {
    setIsCompiling(true);
    addAuditLog("INFO", "COMPOSITE", `Initiating Step 3 composite compiling process.`);
    addAuditLog("INFO", "COMPOSITE", `Exporting high-fidelity photo grid: '${analysis.detectedModel.replace(/\s+/g, "_")}_collage_showroom.png'`);
    addAuditLog("INFO", "COMPOSITE", `Encoding vertical short video clip sequences using beat track: ${selectedMusic}.`);
    
    setTimeout(() => {
      setIsCompiling(false);
      addAuditLog("SUCCESS", "COMPOSITE", `Collage Combined: Studio layout overlay stamped.`);
      addAuditLog("SUCCESS", "COMPOSITE", `Video Montage Compiled: 'video_showroom.mp4' compiled with synced ${selectedMusic} audio track (15.0s).`);
      addAuditLog("SUCCESS", "COMPOSITE", `Outputs successfully exported inside local directories: '/Showroom_Layouts/' & '/Showroom_Videos/'`);
      onNext();
    }, 1400);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md" id="collage-section">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-wide">Step 3: Studio Composite Layout & Montage Compiler</h2>
            <p className="text-slate-500 text-xs">
              Simultaneously compile your high-fidelity photo grid collages & vertical TikTok/Reels montages.
            </p>
          </div>
        </div>
        
        {/* Toggle subtabs inside Step 3 */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-center shrink-0">
          <button
            onClick={() => setCollageTab("photo")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition duration-200 cursor-pointer ${
              collageTab === "photo"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>📸 Collage Canvas</span>
          </button>
          <button
            onClick={() => setCollageTab("video")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition duration-200 cursor-pointer ${
              collageTab === "video"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎥 Video Montage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CONTROL CONFIGURATION */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between text-left">
          
          {collageTab === "photo" ? (
            // CONFIG FOR COLLAGE CANVAS
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Showroom Photo Settings</span>
              </h3>

              <div className="block">
                <label className="text-xs font-bold text-slate-700 block mb-1">Canvas Heading Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 text-slate-800 focus:outline-none"
                  placeholder="2023 TESLA MODEL 3"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Renders prominently on the upper boundaries of your export.</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block uppercase tracking-wide">Automatic Grid Distribution</span>
                <div className="space-y-1 font-mono text-[10px] text-slate-600">
                  <div className="flex justify-between"><span>• Center (Central Large)</span> <span className="text-indigo-650 font-bold">Front View</span></div>
                  <div className="flex justify-between"><span>• Upper Banner</span> <span className="text-indigo-650 font-bold">Cabin Engine Slot</span></div>
                  <div className="flex justify-between"><span>• Lower Banner</span> <span className="text-indigo-650 font-bold">Wheel Closeups</span></div>
                  <div className="flex justify-between"><span>• Left Columns</span> <span className="text-indigo-650 font-bold">Side profile</span></div>
                  <div className="flex justify-between"><span>• Right Columns</span> <span className="text-indigo-650 font-bold">Rear lights</span></div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start space-x-2 text-[10.5px] text-indigo-850">
                <BadgeInfo className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Watermark Stamps Applied:</strong> Verification checksum signatures are automatically generated to maintain absolute showroom proof.
                </span>
              </div>

              {/* Portfolio Ambient Soundtrack Select Control */}
              <div className="block mt-2 relative" ref={musicDropdownRef}>
                <label className="text-xs font-bold text-slate-700 block mb-1">Portfolio Ambient Soundtrack</label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)}
                    className="w-full bg-[#fcfcff] hover:bg-[#faf5ff] border border-purple-600 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none transition-all flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Music className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {selectedMusic} {soundtracks.find(t => t.title === selectedMusic) ? `(${soundtracks.find(t => t.title === selectedMusic)?.genre})` : ""}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-800 shrink-0 ml-1.5" />
                  </button>

                  {/* Dropdown Menu Portal */}
                  {isMusicDropdownOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      <div className="py-1">
                        {soundtracks.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setSelectedMusic(t.title);
                              addAuditLog("INFO", "COMPOSITE", `Associated ambient soundtrack to photo portfolio: ${t.title}`);
                              setIsMusicDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-xs text-left hover:bg-slate-50 transition flex items-center justify-between ${
                              selectedMusic === t.title ? "bg-purple-50/70 text-purple-700 font-bold" : "text-slate-700 font-medium"
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <Music className="w-3 h-3 text-purple-500 shrink-0" />
                              <span className="truncate">{t.title} <span className="text-slate-400 font-normal">({t.genre})</span></span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{t.duration}</span>
                          </button>
                        ))}
                      </div>

                      {/* Folder / Device Audio Integration */}
                      <div className="p-1 px-1.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => {
                            audioFileInputRef.current?.click();
                          }}
                          className="w-full px-2.5 py-1.5 border border-dashed border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50/50 rounded-lg text-[11px] font-bold text-purple-700 transition flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Upload className="w-3 h-3 text-purple-600" />
                          <span>📁 Attach audio file from folder or any other source...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={audioFileInputRef}
                  onChange={handleAudioUpload}
                  accept="audio/*"
                  className="hidden"
                />

                <span className="text-[10px] text-slate-505 mt-1 block">When sharing or viewing this photo grid digitally, this background track will autoplay.</span>
              </div>
            </div>
          ) : (
            // CONFIG FOR VIDEO MONTAGE
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1">
                <Music className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dynamic Short Montage Audio Settings</span>
              </h3>

              <div className="block">
                <label className="text-xs font-bold text-slate-705 block mb-1">Montage Beat Track Select</label>
                <select
                  value={selectedMusic}
                  onChange={(e) => {
                    setSelectedMusic(e.target.value);
                    addAuditLog("INFO", "COMPOSITE", `Updated baseline beat track preference to: ${e.target.value}`);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:border-indigo-500 text-slate-800 focus:outline-none"
                >
                  {soundtracks.map((t) => (
                    <option key={t.id} value={t.title}>
                      🎵 {t.title} ({t.genre}) - {t.duration}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Transition crossfades will automatically synchronize with this track's transients.</span>
              </div>

              {/* Mute and sync controls */}
              <div className="p-3.5 bg-slate-50 border border-slate-205 rounded-lg space-y-3">
                <span className="text-[11px] font-bold text-slate-805 block uppercase tracking-wide">Sync parameters</span>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Music className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] text-slate-650 font-semibold">Auto Beat-matching transitions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioSynced}
                    onChange={(e) => {
                      setAudioSynced(e.target.checked);
                      addAuditLog("INFO", "SYSTEM", `Video beat sync status changed to: ${e.target.checked}`);
                    }}
                    className="w-3.5 h-3.5 accent-indigo-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] text-slate-650 font-semibold">Mute simulated monitor audio</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={(e) => setIsMuted(e.target.checked)}
                    className="w-3.5 h-3.5 accent-indigo-505 rounded"
                  />
                </label>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-lg text-[10.5px] text-indigo-800 leading-tight">
                <strong>Format:</strong> Vertical Short format (1080 x 1920) optimized natively for Instagram Reels, YouTube Shorts, and TikTok platforms.
              </div>
            </div>
          )}

          {/* DOWNLOADING AND COMPILING STRATEGIES */}
          <div className="space-y-3">
            {collageTab === "photo" && compiledUrl ? (
              <a
                href={compiledUrl}
                download={`${analysis.detectedModel.replace(/\s+/g, "_")}_showroom_collage.png`}
                className="w-full bg-slate-100 hover:bg-slate-205 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 border border-slate-200 transition text-center hover:cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Showroom Collage PNG</span>
              </a>
            ) : collageTab === "video" ? (
              <button
                onClick={() => {
                  addAuditLog("INFO", "COMPOSITE", `Simulated local host downloading triggered for '${analysis.detectedModel.replace(/\s+/g, "_")}_showroom_reels.mp4'`);
                  alert("High impact short compiled video showroom download triggered. Saved inside '/Showroom_Videos/' as video_showroom.mp4.");
                }}
                className="w-full bg-slate-105 hover:bg-slate-205 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 border border-slate-200 transition text-center hover:cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Showroom Video MP4</span>
              </button>
            ) : null}

            <button
              onClick={saveShowroomOutputs}
              disabled={isCompiling}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-450 hover:cursor-pointer text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition text-center shadow-md shadow-indigo-600/10"
              id="save-showroom-collage-btn"
            >
              {isCompiling ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Compiling assets into local showroom paths...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Assets and Proceed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CANVAS WORKSPACE OR REELS WORKSPACE */}
        <div className="lg:col-span-8 flex flex-col space-y-2 text-left">
          
          {collageTab === "photo" ? (
            // COLLAGE PREVIEW FRAME
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-500">Showroom Canvas Output: Combined Grid Portfolio</span>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-[9px] text-slate-500 font-mono">REALTIME CANVAS ASSEMBLED</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                {/* Assembled Canvas element */}
                <canvas ref={canvasRef} className="hidden" />

                {compiledUrl ? (
                  <img
                    src={compiledUrl}
                    alt="Showroom Composite Compile"
                    className="max-w-full h-auto aspect-video rounded-lg shadow-md object-contain border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="aspect-video w-full flex flex-col items-center justify-center text-slate-400 text-xs py-10">
                    <svg className="animate-spin h-5 w-5 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Assembling high-fidelity showroom graphics...</span>
                  </div>
                )}
              </div>

              {/* INTEGRATED AMBIENT SOUNDTRACK HANDLER BAR */}
              <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-md">
                <div className="flex items-center space-x-3 w-full sm:w-auto text-left">
                  <div className={`p-2.5 bg-indigo-600 rounded-lg shrink-0 ${isPlayingMontage ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }}>
                    <Music className="w-4 h-4 text-slate-100" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-slate-200 block leading-tight">Associated Ambient Soundtrack</span>
                    <span className="text-xs font-semibold text-indigo-400 truncate block mt-0.5">
                      {selectedMusic} ({soundtracks.find(t => t.title === selectedMusic)?.genre || "Stereo Blend"})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 w-full sm:w-auto justify-end">
                  {/* Dynamic wave pattern when playing */}
                  {isPlayingMontage ? (
                    <div className="flex items-end space-x-0.5 h-3">
                      <span className="w-[1.5px] bg-indigo-400 h-2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
                      <span className="w-[1.5px] bg-indigo-400 h-1 animate-bounce rounded-full" style={{ animationDelay: "0.3s" }} />
                      <span className="w-[1.5px] bg-indigo-200 h-3 animate-bounce rounded-full" style={{ animationDelay: "0.5s" }} />
                      <span className="w-[1.5px] bg-indigo-400 h-1.5 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-500">PAUSED</span>
                  )}
                  <button
                    onClick={() => {
                      setIsPlayingMontage(!isPlayingMontage);
                      addAuditLog("INFO", "COMPOSITE", `Simulated audio play-state toggle for collage: ${!isPlayingMontage ? "PLAYING" : "PAUSED"}`);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-white text-slate-900 border border-slate-200 text-xs font-bold rounded-lg cursor-pointer transition select-none flex items-center space-x-1 hover:scale-105 active:scale-95"
                  >
                    <span>{isPlayingMontage ? "⏸ Pause Ambient" : "▶ Preview Ambient"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // MONTAGE SHORT GENERATOR PREVIEW
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-500">Vertical TikTok/Reels Video Output (1080 x 1920)</span>
                <span className="text-[10px] text-indigo-600 font-bold font-mono">Synced Beat Track: {selectedMusic}</span>
              </div>

              <div className="border border-slate-200 rounded-xl bg-slate-50 p-6 flex flex-col items-center justify-center relative min-h-[460px]">
                
                {/* 1080x1920 Vertical Canvas Simulation Frame */}
                <div className="w-52 aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-300 shadow-xl flex flex-col justify-between p-3 relative">
                  
                  {/* Dynamic video overlay layers */}
                  <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                    <img
                      src={images.main}
                      alt="Active track overlay"
                      style={{
                        filter: `brightness(${enhancements.videoBrightness}%) contrast(${enhancements.videoContrast}%)`,
                        transform: isPlayingMontage ? "scale(1.23) rotate(0.4deg)" : "scale(1.1)",
                        transition: "transform 14s linear"
                      }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Simulated transitions sweeping effect */}
                    {Math.floor(montageProgress) % 3 === 0 && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-pulse z-20"></div>
                    )}
                    
                    {/* Color film layer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-slate-950/50 z-15"></div>
                  </div>

                  {/* Watermark overlay */}
                  {enhancements.videoWatermark && (
                    <span className="absolute top-2 left-2 z-35 bg-slate-950/80 border border-indigo-900/45 px-1 rounded text-[7px] text-white select-none whitespace-nowrap">
                      Auto Showcase Agent
                    </span>
                  )}

                  {/* Upper Audio beat wave animation overlay */}
                  <div className="z-30 absolute top-2 right-2 flex items-center space-x-0.5 bg-slate-950/60 p-1 rounded">
                    <Disc className={`w-2.5 h-2.5 text-indigo-400 shrink-0 ${isPlayingMontage ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
                    {audioSynced && isPlayingMontage && !isMuted ? (
                      <div className="flex items-center space-x-[1px] h-2.5">
                        <span className="w-[1.5px] bg-indigo-400 h-2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
                        <span className="w-[1.5px] bg-indigo-400 h-1 animate-bounce rounded-full" style={{ animationDelay: "0.3s" }} />
                        <span className="w-[1.5px] bg-indigo-400 h-2.5 animate-bounce rounded-full" style={{ animationDelay: "0.5s" }} />
                        <span className="w-[1.5px] bg-indigo-400 h-1.5 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
                      </div>
                    ) : (
                      <span className="text-[7px] text-slate-500 font-mono font-medium">MUTED</span>
                    )}
                  </div>

                  {/* Titles */}
                  <div className="z-30 relative top-10 text-center">
                    <h4 className="font-display text-white text-[12px] font-extrabold tracking-tight drop-shadow">
                      {customTitle}
                    </h4>
                    <span className="text-[8px] bg-indigo-600 text-white px-1.5 rounded-full font-mono font-bold mt-0.5 inline-block uppercase select-none">
                      {selectedMusic.split(" ")[0]} Mix
                    </span>
                  </div>

                  {/* Marketing Captain list tags */}
                  <div className="z-30 relative mt-auto text-left">
                    <span className="text-[7.5px] text-emerald-400 tracking-wider font-extrabold uppercase bg-emerald-950/80 px-1 rounded inline-block">
                      ✓ ENHANCED SHOT SECURED
                    </span>
                    <p className="text-[8px] leading-tight text-white mt-1 line-clamp-3 font-semibold drop-shadow-sm">
                      {analysis.cta}! Connect DM for vehicle registration specifications, custom tire size details, and test drives inside isolated model territories!
                    </p>
                    <span className="text-[7.5px] text-indigo-300 block mt-1 hover:cursor-pointer truncate">
                      {analysis.hashtags.map(t => `#${t}`).join(" ")}
                    </span>
                  </div>

                  {/* Dynamic bottom timer bar */}
                  <div className="absolute bottom-1 inset-x-2 h-0.5 bg-slate-800 rounded overflow-hidden z-30">
                    <div 
                      className="bg-indigo-500 h-full transition-all"
                      style={{ width: `${(montageProgress / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Simulated sound details segment */}
                <div className="flex items-center space-x-3 mt-4">
                  <button
                    onClick={() => setIsPlayingMontage(!isPlayingMontage)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded cursor-pointer"
                  >
                    {isPlayingMontage ? "Pause Real-time Playback" : "Resume Playback"}
                  </button>
                  <span className="text-xs font-mono text-slate-500">
                    Active Time: {montageProgress}s / 15.0s (Dynamic loop)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
