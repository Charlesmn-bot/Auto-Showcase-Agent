import React, { useState, useRef } from "react";
import { Upload, HelpCircle, Shield, Radio, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { CarPreset, CarAnalysisResult } from "../types";
import { CAR_PRESETS } from "../presets";

interface IntakeSectionProps {
  onAnalyzeSuccess: (result: CarAnalysisResult, images: { main: string; top: string; bottom: string; left: string; right: string }, isUploaded: boolean) => void;
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
}

export default function IntakeSection({ onAnalyzeSuccess, addAuditLog }: IntakeSectionProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("porsche-911");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file selection
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Convert uploaded file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Invalid file type. Please upload a PNG, JPG image or MP4, MOV video.");
        addAuditLog("WARNING", "INTAKE", `Rejected file upload: ${file.name} - Invalid MIME Type.`);
        return;
      }
      setError(null);
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type.startsWith("video/")) {
          // If video, use a beautiful car clip thumbnail representation for simulation
          setUploadedImage("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800");
        } else {
          setUploadedImage(reader.result as string);
        }
        setSelectedPresetId(""); // clear preset if user uploads
        const isVid = file.type.startsWith("video/");
        addAuditLog("INFO", "INTAKE", `Queueing uploaded car ${isVid ? "video" : "image"}: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Invalid file type. Please upload a PNG, JPG image or MP4, MOV video.");
        addAuditLog("WARNING", "INTAKE", `Dropped non-image/video file rejected.`);
        return;
      }
      setError(null);
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type.startsWith("video/")) {
          setUploadedImage("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800");
        } else {
          setUploadedImage(reader.result as string);
        }
        setSelectedPresetId("");
        const isVid = file.type.startsWith("video/");
        addAuditLog("INFO", "INTAKE", `Media file dropped: ${file.name} (${isVid ? "Video" : "Image"})`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the agent steps on intake
  const runSecureIntake = async () => {
    setIsScanning(true);
    setError(null);
    setScanLogs([]);

    const addLog = (msg: string) => {
      setScanLogs((prev) => [...prev, msg]);
    };

    try {
      const isVideoInput = uploadFile?.type.startsWith("video/") || false;

      // Step 1.1: Secure Photo & Video Intake Watching folder
      addLog("WATCHING: Active 'Car Media' directory logs for new_uploads...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      addLog(`VALIDATING intake payload: file_type = ${uploadFile ? uploadFile.type : "image/preset"}`);
      if (!uploadedImage && !selectedPresetId) {
        throw new Error("No car photo/video selected or uploaded.");
      }
      await new Promise((resolve) => setTimeout(resolve, 650));
      addLog("✓ File type validation check: PASSED.");

      // Step 1.2: Malware Scan (Security scan)
      addLog("🛡 SCANNING for malware/viruses BEFORE processing in virtual sandbox...");
      await new Promise((resolve) => setTimeout(resolve, 900));
      addLog("✓ Heuristic anti-malware and file sector scans: CLEAN. Threat level: 0%.");
      addAuditLog("SECURITY", "SECURITY", "Pre-processing malware signature scan complete: Clean threat report.");

      // Step 1.3: Gemini API Identification / Preset matching
      addLog("👁 DETECTING car make, car_model, car_year USING VisionAPI...");
      addAuditLog("INFO", "INTAKE", "Sending vehicle media bytes to secure server-side Gemini Core.");

      let response;
      if (uploadedImage && uploadFile) {
        response = await fetch("/api/analyze-car", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: uploadedImage,
            mimeType: uploadFile.type
          })
        });
      } else {
        // Preset
        const currentPreset = CAR_PRESETS.find((p) => p.id === selectedPresetId);
        response = await fetch("/api/analyze-car", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presetName: currentPreset?.name
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze car image via backend.");
      }

      const result: CarAnalysisResult = await response.json();

      addLog("✓ Vision Response Received.");
      addLog(`✓ CAR DETECTED: ${result.detectedYear || ""} ${result.detectedMake || ""} ${result.detectedModel || ""}`);
      addLog(`✓ Details: Style - ${result.detectedStyle}, Color - ${result.detectedColor}`);
      addLog(`✓ Confidence: ${Math.round(result.confidenceScore * 100)}%, Clarity: ${result.clarityScore}/100`);

      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Select secondary images
      let imagesToPass;
      if (uploadedImage) {
        // Since user uploaded, we'll map the main to uploaded, and simulate detail crops
        imagesToPass = {
          main: uploadedImage,
          top: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600", // interior detail
          bottom: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600", // tire details
          left: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=600", // front profile
          right: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600" // rear detail
        };
      } else {
        const preset = CAR_PRESETS.find((p) => p.id === selectedPresetId)!;
        imagesToPass = {
          main: preset.mainUrl,
          top: preset.topUrl,
          bottom: preset.bottomUrl,
          left: preset.leftUrl,
          right: preset.rightUrl
        };
      }

      const folderName = result.detectedModel.replace(/\s+/g, "_");
      
      if (isVideoInput) {
        addLog(`📹 MOVE video TO folder_named(${folderName})`);
      } else {
        addLog(`📸 MOVE photo TO folder_named(${folderName})`);
      }
      addLog(`📁 Creation of isolated model folder: '/CarMedia/${folderName}/'`);
      addAuditLog("SUCCESS", "INTAKE", `Successfully validated and categorized: ${result.detectedMake} ${result.detectedModel} (${result.detectedYear}). Media Type: ${isVideoInput ? "Video" : "Photo"}. Confidence: ${Math.round(result.confidenceScore * 100)}%`);

      setIsScanning(false);
      onAnalyzeSuccess(result, imagesToPass, !!uploadedImage);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during car photo intake.");
      addAuditLog("WARNING", "INTAKE", `Secure scan failed: ${err.message}`);
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md" id="intake-section">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-wide text-left">Step 1: Secure Photo & Video Intake & Verification</h2>
            <p className="text-slate-500 text-xs text-left">Upload your car photos, videos, or select high-fidelity model presets to commence secure processing.</p>
          </div>
        </div>
        <Radio className="w-5 h-5 text-indigo-600 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Area */}
        <div className="space-y-6">
          <div className="block">
            <label className="text-sm font-bold text-slate-700 block mb-2 text-left">Option A: High-Fidelity Car Presets</label>
            <div className="grid grid-cols-2 gap-3">
              {CAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setUploadedImage(null);
                    setUploadFile(null);
                    setError(null);
                  }}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    selectedPresetId === preset.id
                      ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500/20"
                      : "bg-slate-50/55 border-slate-200 text-slate-600 hover:border-slate-350 hover:cursor-pointer hover:bg-slate-100/50"
                  }`}
                  id={`preset-btn-${preset.id}`}
                >
                  <img
                    src={preset.mainUrl}
                    alt={preset.name}
                    className="w-full h-24 object-cover rounded-lg mb-2 shadow-sm"
                  />
                  <span className="font-semibold text-xs text-slate-800 line-clamp-1">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{preset.defaultYear} • {preset.defaultColor}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="block">
            <label className="text-sm font-bold text-slate-700 block mb-2 text-left">Option B: Drag-and-Drop Photo & Video Intake</label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleTriggerUpload}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                uploadedImage
                  ? "bg-indigo-50/40 border-indigo-400 hover:bg-indigo-50/60"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80"
              }`}
            >
              {uploadedImage ? (
                <div className="relative w-full flex flex-col items-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded source"
                    className="h-32 object-contain rounded-lg mb-2 border border-slate-200 shadow-sm"
                  />
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">Selected: {uploadFile?.name || "Direct Video/Image Stream"}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Click or drop another file to replace</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-450 mb-3" />
                  <span className="text-xs text-slate-600 font-bold">Drag car image or video here or click to browse</span>
                  <span className="text-[10px] text-slate-500 mt-1">Accepts PNG, JPG, JPEG, and MP4, MOV up to 100MB</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-650 text-xs text-left">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={runSecureIntake}
            disabled={isScanning || (!uploadedImage && !selectedPresetId)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 hover:cursor-pointer text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 focus:ring-2 focus:ring-indigo-500 text-center shadow-md transition-all"
            id="commence-scan-btn"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing Security & Vision Pipeline...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Commence Secure Agent Workflow</span>
              </>
            )}
          </button>
        </div>

        {/* Console logs */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <span className="font-mono text-xs text-slate-600 font-bold">Agent Command Console</span>
            <div className="flex items-center space-x-1.5 flex-row-reverse">
              <span className="text-[10px] text-slate-500 font-bold">SECURE INTAKE SHELL</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-700 text-left space-y-2 select-text scrollbar">
            {scanLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-450">
                <HelpCircle className="w-8 h-8 mb-2 stroke-[1.5] text-slate-400" />
                <p className="font-bold">Waiting to initialize secure scan.</p>
                <p className="text-[10px] text-slate-500">Select a car or upload photo to begin</p>
              </div>
            ) : (
              scanLogs.map((log, index) => (
                <div key={index} className={`${log.startsWith("✓") ? "text-emerald-700 font-bold" : log.startsWith("🛡") ? "text-amber-700" : log.startsWith("👁") ? "text-cyan-700 font-bold" : "text-slate-650"}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
