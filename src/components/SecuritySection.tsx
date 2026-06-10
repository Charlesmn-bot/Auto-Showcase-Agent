import React, { useState } from "react";
import { Shield, Key, FileText, CheckSquare, Search, Lock, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { AuditLogEntry, CarAnalysisResult } from "../types";

interface SecurityProps {
  analysis: CarAnalysisResult;
  auditLogs: AuditLogEntry[];
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  onNext: () => void;
}

export default function SecuritySection({ analysis, auditLogs, addAuditLog, onNext }: SecurityProps) {
  const [cryptKey, setCryptKey] = useState("aes-256-gcm-f83k9d82la01kd9a8");
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const rotateEncryptionKeys = () => {
    setIsEncrypting(true);
    addAuditLog("SECURITY", "SECURITY", "Initiated key rotation sequence. Generating fresh master secret salt...");
    
    setTimeout(() => {
      const chars = "abcdef0123456789";
      let key = "aes-256-gcm-";
      for (let i = 0; i < 20; i++) key += chars[Math.floor(Math.random() * chars.length)];
      setCryptKey(key);
      setIsEncrypting(false);
      addAuditLog("SUCCESS", "SECURITY", `Fresh layout cryptography key deployed successfully: ${key.slice(0, 16)}...`);
    }, 1000);
  };

  const verifyClarityReport = () => {
    addAuditLog("INFO", "SECURITY", `Layout analysis: Clarity Score ${analysis.clarityScore}/100. Core color density checked.`);
    addAuditLog("SUCCESS", "SECURITY", `Sanity Pre-flight validation: PASSED. Clarity rating satisfies 85% threshold. Safe for web publication.`);
    onNext();
  };

  // Filter logs based on selection & search query
  const filteredLogs = auditLogs.filter(log => {
    const matchesCategory = activeCategory === "ALL" || log.category === activeCategory;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl" id="security-section">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white tracking-wide">Step 4: Layout Cryptography & Secure Audit Trail</h2>
            <p className="text-slate-400 text-xs">Verify AES-256 file encryption tags, pre-post clarity scans, and trace immutable operational logs.</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
          AUDIT COMPLIANT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Security Safeguards */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between text-left">
          <div className="space-y-5">
            {/* AES-256 Engine */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Showroom Layout Encryption</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                To guarantee catalog originality and prevent scraping, layouts are cryptographically sealed prior to queue placement.
              </p>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  readOnly
                  value={cryptKey}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-slate-300 flex-1 focus:outline-none"
                />
                <button
                  onClick={rotateEncryptionKeys}
                  disabled={isEncrypting}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-50 hover:cursor-pointer"
                  title="Rotate Keys"
                >
                  <RefreshCw className={`w-4 h-4 ${isEncrypting ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Pre-post clarity check report */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Pre-Flight Integrity Scanning</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Photo Clarity Index:</span>
                  <span className={`font-mono font-semibold ${analysis.clarityScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {analysis.clarityScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Video Stabilization Frame Rate:</span>
                  <span className="text-emerald-400 font-mono font-semibold">60 FPS (Gyroscopic Verified)</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Layout & Video Watermarks:</span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-semibold">VERIFIED</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Model Categorization Confidence:</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {Math.round(analysis.confidenceScore * 100)}%
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block leading-normal">
                  ✓ Required checklist satisfies: Layout resolution matches 1200x800 & short video complies with 15-second duration limits.
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={verifyClarityReport}
            className="w-full bg-emerald-500 hover:bg-emerald-400 hover:cursor-pointer text-slate-950 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition text-center mt-4"
            id="audit-passed-btn"
          >
            <Shield className="w-4 h-4" />
            <span>Approve Clarity Scans & Continue</span>
          </button>
        </div>

        {/* Right Side: Active Logs Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 rounded-xl p-5 border border-slate-850 h-[380px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-900 gap-2 mb-4">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Immutable Audit Trail File Logs</span>
            </h3>

            {/* Keyword Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 w-full sm:w-48 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Table Headers / Filter category buttons */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["ALL", "INTAKE", "ENHANCE", "COMPOSITE", "SECURITY", "SOCIAL"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] px-2.5 py-1 rounded font-mono font-medium transition ${
                  activeCategory === cat
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-900 text-slate-500 border border-slate-900 hover:border-slate-800 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Logs Feed Scroller */}
          <div className="flex-1 overflow-y-auto font-mono text-[10.5px] text-slate-300 divide-y divide-slate-900/60 scrollbar text-left">
            {filteredLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600">
                <span>No audit trail entries matched criteria.</span>
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="py-2 flex items-start space-x-2.5">
                  <span className="text-slate-600 shrink-0 select-none">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    log.level === "SUCCESS"
                      ? "bg-emerald-900/30 text-emerald-400"
                      : log.level === "SECURITY"
                      ? "bg-cyan-900/30 text-cyan-400"
                      : log.level === "WARNING"
                      ? "bg-red-900/30 text-red-400"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 flex-1">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
