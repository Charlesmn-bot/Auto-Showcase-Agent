import React, { useState } from "react";
import { Shield, User, Lock, Eye, EyeOff, LayoutGrid, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [memberId, setMemberId] = useState("");
  const [passkey, setPasskey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !passkey) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate authentication matching the demo credentials
    setTimeout(() => {
      if (
        (memberId.toLowerCase() === "admin" && passkey === "Admin2026") ||
        memberId.toLowerCase() === "member01"
      ) {
        onLoginSuccess();
      } else {
        setError("Invalid credentials. Try using the suggested Demo Credentials.");
        setIsLoading(false);
      }
    }, 850);
  };

  const fillDemoCredentials = () => {
    setMemberId("Admin");
    setPasskey("Admin2026");
    setError(null);
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#05040a] flex items-center justify-center p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      {/* Background atmosphere radial glow lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card box mimicking the pixel-perfect layout */}
      <div className="w-full max-w-5xl bg-[#090714] rounded-3xl border border-slate-900/40 shadow-2xl shadow-black/80 flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[620px]">
        
        {/* LEFT COLUMN: FinExpert-KE Branding with dot pattern grid and custom gradients */}
        <div className="w-full md:w-[48%] bg-gradient-to-br from-[#1d0b52] via-[#09051d] to-[#04010a] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-900/30">
          
          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 opacity-[0.22] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1.5px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Logo & Product Heading */}
          <div className="relative z-10 flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-[#3e0ff2]/90 rounded-2xl flex items-center justify-center shadow-lg shadow-[#3e0ff2]/20 border border-indigo-400/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-base font-bold tracking-tight">SMedia Auto Post</h2>
              <span className="text-[9.5px] uppercase tracking-widest text-[#7c65ff] font-extrabold block mt-0.5">
                GROUP PORTAL
              </span>
            </div>
          </div>

          {/* Middle Typography Banner */}
          <div className="relative z-10 my-12 md:my-auto">
            <h1 className="text-white text-4.5xl sm:text-[45px] font-black tracking-tight leading-[1.05]">
              Social Media <br />
              Auto Post <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#b88cff] filter drop-shadow-[0_2px_15px_rgba(139,92,246,0.3)]">
                Agent.
              </span>
            </h1>

            <p className="text-slate-400/80 text-xs sm:text-[13px] leading-relaxed mt-6 font-medium max-w-xs">
              Social Media Agent for Automated Dealership Posting, AI Copywriting, and Campaign Syncing.
            </p>
          </div>

          {/* Lower subtle decoration */}
          <div className="relative z-10 text-[10px] text-slate-500 font-mono tracking-wide">
            SYSTEM VERSION: AUTH_SECURE_v4.2
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login Forms */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-[#07050e] relative">
          
          <div className="max-w-md w-full mx-auto space-y-8">
            {/* Login Titles */}
            <div>
              <h2 className="text-white text-3xl font-black tracking-tight font-sans">
                Login
              </h2>
              <p className="text-[#8869ff] text-[10.5px] font-mono font-black tracking-widest uppercase mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#8869ff] rounded-full animate-ping shrink-0" />
                VAULT AUTHENTICATION REQUIRED
              </p>
            </div>

            {/* Inbound Error Notice banner */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl p-3.5 font-medium animate-fade-in relative">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Member ID Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 font-sans tracking-wider uppercase block">
                  MEMBER ID / EMAIL
                </label>
                <div className="relative rounded-2xl bg-[#110e22] border border-slate-800 focus-within:border-[#6345ff]/70 transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. member01"
                    className="block w-full pl-11 pr-4 py-4 bg-transparent text-white text-xs rounded-2xl border-none focus:ring-0 focus:outline-none placeholder-slate-600 font-medium tracking-wide"
                  />
                </div>
              </div>

              {/* Secure Passkey Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 font-sans tracking-wider uppercase block">
                  SECURE PASSKEY
                </label>
                <div className="relative rounded-2xl bg-[#110e22] border border-slate-800 focus-within:border-[#6345ff]/70 transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-4 bg-transparent text-white text-xs rounded-2xl border-none focus:ring-0 focus:outline-none placeholder-slate-600 tracking-widest font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Authorize Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden bg-[#5a24f5] hover:bg-[#6c39ff] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 hover:cursor-pointer shadow-lg shadow-[#5a24f5]/20 disabled:opacity-50"
              >
                <span className="text-xs uppercase tracking-widest font-black">
                  {isLoading ? "AUTHORIZING ACCESS..." : "AUTHORIZE ACCESS"}
                </span>
                {!isLoading && <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Demo Credentials quick fill */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-slate-500 hover:text-[#8869ff] transition duration-150 text-[10px] font-sans flex items-center gap-1.5 focus:outline-none font-bold"
              >
                <span>DEMO CREDENTIALS:</span>
                <span className="bg-[#17142b] border border-slate-800 px-1.5 py-0.5 rounded text-white font-mono text-[9px]">Admin</span>
                <span className="text-slate-600">/</span>
                <span className="bg-[#17142b] border border-slate-800 px-1.5 py-0.5 rounded text-white font-mono text-[9px]">Admin2026</span>
              </button>
            </div>

            {/* Divider OR line match */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-900" />
              </div>
              <span className="relative px-3 text-[10px] font-mono font-black text-slate-600 bg-[#07050e] uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Guest Demo Access button */}
            <button
              type="button"
              onClick={handleGuestAccess}
              disabled={isLoading}
              className="w-full bg-transparent hover:bg-[#121021] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 transition duration-200 cursor-pointer text-xs uppercase tracking-wider"
            >
              <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" />
              <span>GUEST DEMO ACCESS</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
